// src/lib/hooks/use-chat-history.ts
"use client";

import { useState, useEffect, useCallback, useRef } from 'react';
import type { ChatSession, ChatSessionMetadata, ChatMessage, DriveFile, AttachedFile } from '@/lib/types';
import { DEFAULT_USER_ID, DEFAULT_MODEL_ID } from '@/lib/constants';
import { generateChatName, type GenerateChatNameInput } from '@/ai/flows/generate-chat-name-flow';
import { useAuth } from '@/contexts/auth-context';
import { ensureAppFolderExists, saveSessionToDrive, listSessionFilesFromDrive, getSessionFromDrive, deleteFileFromDrive } from '@/lib/services/drive-service';
import { useToast } from '@/hooks/use-toast';

const CHAT_HISTORY_INDEX_KEY_LS_PREFIX = 'desainr_chat_history_index_ls_v3_';
const CHAT_SESSION_PREFIX_LS_PREFIX = 'desainr_chat_session_ls_v3_';
const APP_DRIVE_FOLDER_ID_LS_PREFIX = 'desainr_app_drive_folder_id_';
const DELETED_SESSIONS_LS_PREFIX = 'desainr_deleted_sessions_';

const MAX_MESSAGE_TEXT_LENGTH = 1000; // For msg.content or text parts
const MAX_ATTACHMENT_TEXT_LENGTH = 200; // For attachment textContent

const getMessageTextPreview = (message: ChatMessage | undefined): string => {
  if (!message) return 'New Chat';
  
  // If the message is loading and not an error, return processing status
  if (message.isLoading === true && !message.isError) {
    return "Processing...";
  }
  
  // If message was in error state
  if (message.isError) {
    return "Error occurred";
  }
  
  if (typeof message.content === 'string') {
    // Only treat content with the exact string "Processing..." as a placeholder
    // This allows real content that happens to contain the word to display correctly
    if (message.content === 'Processing...') {
      return "Completed";
    }
    return message.content.substring(0, 50).trim() || "Chat started";
  }
  
  if (Array.isArray(message.content)) {
    for (const part of message.content) {
        switch (part.type) {
            case 'text':
                if (part.text) return part.text.substring(0, 50).trim();
                break;
            case 'code':
                if (part.title) return `Code: ${part.title.substring(0, 40).trim()}`;
                if (part.code) return `Code Block`; // Simplified
                break;
            case 'list':
                if (part.title) return `List: ${part.title.substring(0, 40).trim()}`;
                if (part.items && part.items.length > 0) return `List: ${part.items[0].substring(0, 40).trim()}`;
                break;
            case 'translation_group':
                if (part.title) return `Analysis: ${part.title.substring(0, 40).trim()}`;
                if (part.english?.analysis) return `Eng Analysis: ${part.english.analysis.substring(0, 30).trim()}`;
                break;
            case 'custom':
                if (part.title) return `Custom: ${part.title.substring(0, 40).trim()}`;
                if (part.text) return `Custom instruction: ${part.text.substring(0, 40).trim()}`;
                break;
            case 'suggested_replies':
                return 'Suggested Replies';
                break;
        }
    }
    if (message.attachedFiles && message.attachedFiles.length > 0) {
        return `Attached: ${message.attachedFiles[0].name.substring(0, 40).trim()}`;
    }
  }
  return 'Structured message';
};

const isQuotaExceededError = (error: any): boolean => {
  if (!error) return false;
  const message = String(error.message).toLowerCase();
  const name = String(error.name).toLowerCase();
  const knownErrorCodes = [
    'quotaexceedederror',
    'ns_error_dom_quota_reached',
    'domexception: failed to execute \'setitem\' on \'storage\': setting the value of \'x\' exceeded the quota.',
  ];
  return (
    knownErrorCodes.some(code => name.includes(code) || message.includes(code)) ||
    (error.code === 22 && name.includes('datacloneerror')) ||
    (error.name === 'QuotaExceededError')
  );
};

function deduplicateMetadata(metadataList: ChatSessionMetadata[]): ChatSessionMetadata[] {
  if (!Array.isArray(metadataList) || metadataList.length === 0) return [];
  const map = new Map<string, ChatSessionMetadata>();
  for (const item of metadataList) {
    if (!item || typeof item.id !== 'string') {
      console.warn("DeduplicateMetadata: Encountered invalid item:", item);
      continue;
    }
    const existing = map.get(item.id);
    if (!existing || item.lastMessageTimestamp >= existing.lastMessageTimestamp) {
      const newItem = { ...item };
      if (existing) {
        newItem.isDriveSession = newItem.isDriveSession || existing.isDriveSession;
        newItem.driveFileId = newItem.driveFileId || existing.driveFileId;

        // Prefer existing name if it's not a placeholder, and new name is a placeholder
        if (existing.name && !existing.name.startsWith("Drive:") && (!newItem.name || newItem.name.startsWith("Drive:"))) {
             newItem.name = existing.name;
        } else if (newItem.name && !newItem.name.startsWith("Drive:") && (!existing.name || existing.name.startsWith("Drive:"))) {
            // Prefer new name if it's not a placeholder, and old name was
        } else if (existing.name && !existing.name.startsWith("Drive:")) {
            // Fallback to existing if both are potentially placeholders or both are good.
            newItem.name = existing.name;
        }


        if (existing.preview && existing.preview !== "From Google Drive" && (newItem.preview === "From Google Drive" || !newItem.preview)) {
            newItem.preview = existing.preview;
        }
      }
      map.set(item.id, newItem);
    } else {
        const updatedExisting = {...existing};
        if (item.isDriveSession) {
            updatedExisting.isDriveSession = true;
            updatedExisting.driveFileId = item.driveFileId || updatedExisting.driveFileId;
        }
        map.set(item.id, updatedExisting);
    }
  }
  return Array.from(map.values()).sort((a, b) => b.lastMessageTimestamp - a.lastMessageTimestamp);
}

const createLeanSession = (session: ChatSession): ChatSession => {
    if (!session || !session.messages) return session;
    const leanMessages = session.messages.map(msg => {
        let leanContent = msg.content;
        if (typeof msg.content === 'string' && msg.content.length > MAX_MESSAGE_TEXT_LENGTH) {
            leanContent = msg.content.substring(0, MAX_MESSAGE_TEXT_LENGTH) + "... (truncated)";
        } else if (Array.isArray(msg.content)) {
            leanContent = msg.content.map(part => {
                if (part.type === 'text' && part.text && part.text.length > MAX_MESSAGE_TEXT_LENGTH) {
                    return { ...part, text: part.text.substring(0, MAX_MESSAGE_TEXT_LENGTH) + "... (truncated)" };
                }
                return part;
            });
        }

        if (msg.attachedFiles && msg.attachedFiles.some(f => f.dataUri || (f.textContent && f.textContent.length > MAX_ATTACHMENT_TEXT_LENGTH))) {
            return {
                ...msg,
                content: leanContent,
                attachedFiles: msg.attachedFiles.map(f => {
                    const { dataUri, textContent, ...rest } = f;
                    const leanFile: AttachedFile = {...rest};
                    if (textContent && textContent.length > MAX_ATTACHMENT_TEXT_LENGTH) {
                        leanFile.textContent = textContent.substring(0, MAX_ATTACHMENT_TEXT_LENGTH) + "... (truncated)";
                    } else if (textContent) {
                        leanFile.textContent = textContent;
                    }
                    return leanFile;
                })
            };
        }
        return { ...msg, content: leanContent };
    });
    return { ...session, messages: leanMessages };
};

// Queue for processing name generation tasks outside React rendering
const nameGenerationQueue = new Map<string, boolean>();
// Track retry attempts for sessions that don't have enough messages yet
const nameGenerationRetries = new Map<string, number>();
const MAX_RETRIES = 3; // Maximum number of retries before proceeding anyway

// Shared function to process the name generation queue
const processNameGenerationQueue = async () => {
  console.log(`processNameGenerationQueue: Invoked. Current queue size: ${nameGenerationQueue.size}`);
  if (nameGenerationQueue.size === 0) {
    console.log("processNameGenerationQueue: Queue is empty. Returning.");
    return;
  }

  const sessionId = nameGenerationQueue.keys().next().value; 
  if (!sessionId) {
    console.log("processNameGenerationQueue: Could not get sessionId from queue though size > 0. This is unexpected.");
    return;
  }
  
  console.log(`processNameGenerationQueue: Processing sessionId: ${sessionId}`);
  try {
    // Format is: desainr_chat_session_ls_v3_{userId}_{sessionTimestamp}_{randomId}
    // We need just the localStorage key which is: desainr_chat_session_ls_v3_{userId}_
    const userId = sessionId.split('_')[0]; // Extract userId from the sessionId
    const localStorageKey = `${CHAT_SESSION_PREFIX_LS_PREFIX}${userId}_`;
    console.log(`processNameGenerationQueue: Using localStorage key prefix: ${localStorageKey} for session ${sessionId}`);
    
    const sessionJson = localStorage.getItem(`${localStorageKey}${sessionId}`);
    if (!sessionJson) {
      console.log(`processNameGenerationQueue: No sessionJson found in localStorage for ${sessionId}. Skipping name generation for this item.`);
    } else {
      const session = JSON.parse(sessionJson);
      console.log(`processNameGenerationQueue: Successfully found and parsed sessionJson for ${sessionId}. Session message count: ${session.messages.length}`);
      
      const userMessage = session.messages.find((m: ChatMessage) => m.role === 'user');
      if (!userMessage) {
         console.log(`processNameGenerationQueue: No user message found in session ${sessionId} from localStorage. Session messages count: ${session.messages.length}. Skipping name generation.`);
      } else {
          console.log(`processNameGenerationQueue: Found user message in session ${sessionId}. User message role: ${userMessage.role}, content type: ${typeof userMessage.content}`);
          const messageSummary = getMessageTextPreview(userMessage);
          const modelId = session.modelId || DEFAULT_MODEL_ID;
          let apiKey: string | undefined = undefined;
          const userPrefsKey = `user_preferences_${session.userId}`;
          console.log(`processNameGenerationQueue: Attempting to read user preferences. Session UserID: ${session.userId}, LocalStorage Key: ${userPrefsKey}`);
          try {
            const userPrefs = localStorage.getItem(userPrefsKey);
            console.log(`processNameGenerationQueue: Raw userPrefs from localStorage for key ${userPrefsKey}:`, userPrefs);
            if (userPrefs) {
              const prefs = JSON.parse(userPrefs);
              console.log(`processNameGenerationQueue: Parsed userPrefs for key ${userPrefsKey}:`, prefs);
              apiKey = prefs.geminiApiKey;
              console.log(`processNameGenerationQueue: API key from prefs.geminiApiKey for key ${userPrefsKey}: ${apiKey === undefined ? 'undefined' : '********'}`);
            } else {
              console.log(`processNameGenerationQueue: No userPrefs found in localStorage for key ${userPrefsKey}.`);
            }
          } catch (e) {
            console.error(`processNameGenerationQueue: Error reading/parsing API key from preferences for key ${userPrefsKey}:`, e);
          }
          
          console.log(`processNameGenerationQueue: About to call generateChatName for session ${sessionId}. User message summary: "${messageSummary}". Model ID: ${modelId}. API Key defined: ${!!apiKey}`);
          try {
            const nameResult = await generateChatName({
              firstUserMessage: messageSummary,
              modelId,
              userApiKey: apiKey,
            });
            
            if (nameResult.chatName) {
              const userId = sessionId.split('_')[0]; // Extract userId from the sessionId
              const localStorageKey = `${CHAT_SESSION_PREFIX_LS_PREFIX}${userId}_`;
              
              const currentSessionJson = localStorage.getItem(`${localStorageKey}${sessionId}`);
              if (!currentSessionJson) {
                  console.warn(`processNameGenerationQueue: Session ${sessionId} disappeared from localStorage before name could be applied.`);
              } else {
                  const currentSession = JSON.parse(currentSessionJson);
                  currentSession.name = nameResult.chatName;
                  localStorage.setItem(`${localStorageKey}${sessionId}`, JSON.stringify(createLeanSession(currentSession)));
                  
                  const historyIndexKey = `${CHAT_HISTORY_INDEX_KEY_LS_PREFIX}${session.userId}`;
                  const historyIndex = localStorage.getItem(historyIndexKey);
                  if (historyIndex) {
                    const metadata = JSON.parse(historyIndex);
                    const metaIndex = metadata.findIndex((m: ChatSessionMetadata) => m.id === sessionId);
                    if (metaIndex >= 0) {
                      metadata[metaIndex].name = nameResult.chatName;
                      localStorage.setItem(historyIndexKey, JSON.stringify(metadata));
                    }
                  }
                  if (typeof window !== 'undefined') {
                    window.dispatchEvent(new CustomEvent('chat-name-updated', { 
                      detail: { sessionId, newName: nameResult.chatName } 
                    }));
                  }
                }
            }
          } catch (error) {
            console.error(`processNameGenerationQueue: Error calling generateChatName for session ${sessionId}:`, error);
          }
      }
    }
  } catch (error) {
    console.error(`processNameGenerationQueue: Outer error for session ${sessionId}:`, error);
  } finally {
    nameGenerationQueue.delete(sessionId);
    console.log(`processNameGenerationQueue: Finished processing ${sessionId}. Queue size now: ${nameGenerationQueue.size}`);
    if (nameGenerationQueue.size > 0) {
      console.log("processNameGenerationQueue: More items in queue. Scheduling next run.");
      setTimeout(processNameGenerationQueue, 0);
    } else {
      console.log("processNameGenerationQueue: Queue is now empty.");
    }
  }
};

// Function to queue a session for name generation
const queueNameGeneration = (sessionId: string) => {
  console.log(`queueNameGeneration: Attempting to queue session ${sessionId}. Current queue size: ${nameGenerationQueue.size}`);
  if (nameGenerationQueue.has(sessionId)) {
    console.log(`queueNameGeneration: Session ${sessionId} already in queue. Skipping.`);
    return; // Already queued
  }
  
  // Check if session exists and has at least one message
  try {
    const userId = sessionId.split('_')[0]; // Extract userId from the sessionId
    const localStorageKey = `${CHAT_SESSION_PREFIX_LS_PREFIX}${userId}_`;
    const sessionJson = localStorage.getItem(`${localStorageKey}${sessionId}`);
    
    if (sessionJson) {
      const session = JSON.parse(sessionJson);
      const retryCount = nameGenerationRetries.get(sessionId) || 0;
      
      // If session exists but has only one or no messages
      if (!session.messages || session.messages.length <= 1) {
        // If we've tried too many times, proceed anyway
        if (retryCount >= MAX_RETRIES) {
          console.log(`queueNameGeneration: Session ${sessionId} has ${session.messages?.length || 0} messages after ${retryCount} retries. Proceeding with name generation anyway.`);
          nameGenerationRetries.delete(sessionId); // Clear retry tracking
        } else {
          // Increment retry count
          nameGenerationRetries.set(sessionId, retryCount + 1);
          console.log(`queueNameGeneration: Session ${sessionId} has ${session.messages?.length || 0} messages. Delaying name generation to wait for AI response. Retry ${retryCount + 1}/${MAX_RETRIES}`);
          // Wait 5 seconds and try again
          setTimeout(() => queueNameGeneration(sessionId), 5000);
          return;
        }
      } else {
        // Clean up retry tracking if it exists
        if (nameGenerationRetries.has(sessionId)) {
          nameGenerationRetries.delete(sessionId);
        }
      }
    }
  } catch (e) {
    console.error(`queueNameGeneration: Error checking session message count:`, e);
  }
  
  nameGenerationQueue.set(sessionId, true);
  console.log(`queueNameGeneration: Session ${sessionId} added to queue. New queue size: ${nameGenerationQueue.size}`);
  
  // Process the queue on next tick
  setTimeout(processNameGenerationQueue, 0);
};

export function useChatHistory(userIdFromProfile: string | undefined) {
  const { user: authUser, googleAccessToken, signInWithGoogle: triggerGoogleSignInFromAuth } = useAuth();
  const { toast } = useToast();
  const [historyMetadata, setHistoryMetadata] = useState<ChatSessionMetadata[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [appDriveFolderId, setAppDriveFolderId] = useState<string | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);

  const effectiveUserId = authUser?.uid || userIdFromProfile || DEFAULT_USER_ID;
  const chatHistoryIndexKeyLS = `${CHAT_HISTORY_INDEX_KEY_LS_PREFIX}${effectiveUserId}`;
  const chatSessionPrefixLS = `${CHAT_SESSION_PREFIX_LS_PREFIX}${effectiveUserId}_`;
  const appDriveFolderIdLSKey = `${APP_DRIVE_FOLDER_ID_LS_PREFIX}${effectiveUserId}`;
  const deletedSessionsLSKey = `${DELETED_SESSIONS_LS_PREFIX}${effectiveUserId}`;

  const isMounted = useRef(false);

  useEffect(() => {
    isMounted.current = true;
    return () => { isMounted.current = false; };
  }, []);

  const initializeDriveFolder = useCallback(async (token: string): Promise<string | null> => {
    if (!token || !effectiveUserId) {
      console.warn("useChatHistory (initializeDriveFolder): No Google access token or effectiveUserId.");
      if (isMounted.current) setAppDriveFolderId(null);
      return null;
    }
    console.log(`useChatHistory (initializeDriveFolder): Initializing for user ${effectiveUserId}.`);
    const cachedFolderId = localStorage.getItem(appDriveFolderIdLSKey);
    if (cachedFolderId) {
        console.log(`useChatHistory (initializeDriveFolder): Using cached Drive folder ID: ${cachedFolderId}`);
        if (isMounted.current) setAppDriveFolderId(cachedFolderId);
        return cachedFolderId;
    }

    try {
      console.log(`useChatHistory (initializeDriveFolder): No cached Drive folder ID. Ensuring app folder exists on Drive.`);
      const folderId = await ensureAppFolderExists(token);
      if (folderId) {
        if (isMounted.current) setAppDriveFolderId(folderId);
        localStorage.setItem(appDriveFolderIdLSKey, folderId);
        console.log(`useChatHistory (initializeDriveFolder): App Drive folder ID set and cached: ${folderId}`);
        return folderId;
      } else {
        if (isMounted.current) {
            toast({ title: "Google Drive Error", description: "Could not access or create the app folder in Google Drive.", variant: "destructive",});
            setAppDriveFolderId(null);
        }
      }
    } catch (error: any) {
        console.error(`useChatHistory (initializeDriveFolder): Error ensuring app folder exists:`, error);
        if (isMounted.current) {
            toast({ title: "Google Drive Setup Failed", description: `Failed to set up app folder: ${error.message}. Drive features may be unavailable.`, variant: "destructive",});
            setAppDriveFolderId(null);
        }
    }
    return null;
  }, [toast, effectiveUserId, appDriveFolderIdLSKey]);

  const loadHistoryIndex = useCallback(async (
    currentGoogleToken: string | null,
    currentDriveFolderId: string | null
  ) => {
    if (!effectiveUserId) {
      console.warn("loadHistoryIndex: No effectiveUserId. Cannot load history.");
      if (isMounted.current) setHistoryMetadata([]);
      return;
    }
    console.log(`loadHistoryIndex: Running for user ${effectiveUserId}. DriveToken: ${!!currentGoogleToken}, DriveFolder: ${currentDriveFolderId}`);

    let combinedMetadata: ChatSessionMetadata[] = [];
    const seenIds = new Set<string>();

    // 1. Load from LocalStorage
    try {
      const storedIndex = localStorage.getItem(chatHistoryIndexKeyLS);
      const localParsedIndex: ChatSessionMetadata[] = storedIndex ? JSON.parse(storedIndex) : [];

      const filteredLocal = localParsedIndex.filter((meta): meta is ChatSessionMetadata =>
          meta && typeof meta.id === 'string' && meta.id.startsWith(effectiveUserId + '_') &&
          typeof meta.name === 'string' && typeof meta.lastMessageTimestamp === 'number' &&
          typeof meta.preview === 'string' && typeof meta.messageCount === 'number'
      );

      if (filteredLocal.length < localParsedIndex.length && localParsedIndex.length > 0) {
        console.warn(`loadHistoryIndex: Filtered out ${localParsedIndex.length - filteredLocal.length} invalid/non-user sessions from LS index. Updating LS.`);
        localStorage.setItem(chatHistoryIndexKeyLS, JSON.stringify(filteredLocal));
      }
      filteredLocal.forEach(meta => {
        if (!seenIds.has(meta.id)) {
          combinedMetadata.push(meta);
          seenIds.add(meta.id);
        }
      });
      console.log(`loadHistoryIndex: Loaded ${filteredLocal.length} sessions from localStorage.`);
    } catch (error) {
      console.error("loadHistoryIndex: Error loading/parsing local chat history index:", error);
    }

    // 2. Load from Google Drive and Merge
    if (currentGoogleToken && currentDriveFolderId) {
      console.log(`loadHistoryIndex: Attempting to fetch and merge metadata from Drive (Folder: ${currentDriveFolderId}).`);
      const driveFiles = await listSessionFilesFromDrive(currentGoogleToken, currentDriveFolderId);

      if (driveFiles) {
        for (const driveFile of driveFiles) {
          if (!driveFile.name || !driveFile.id || !driveFile.name.startsWith(`session_${effectiveUserId}_`)) continue;

          const appSessionId = driveFile.name.replace(`session_`, '').replace('.json', '');
          let driveSessionData: ChatSession | null = null;
          try {
            driveSessionData = await getSessionFromDrive(currentGoogleToken, driveFile.id);
          } catch (e) { console.error(`loadHistoryIndex: Error fetching full session ${appSessionId} from driveFile ${driveFile.id}`, e); }

          const driveMetaEntry: ChatSessionMetadata = {
            id: appSessionId,
            name: driveSessionData?.name || `Drive: ${new Date(driveFile.modifiedTime || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
            lastMessageTimestamp: new Date(driveFile.modifiedTime || driveSessionData?.updatedAt || Date.now()).getTime(),
            preview: driveSessionData ? getMessageTextPreview(driveSessionData.messages[driveSessionData.messages.length - 1]) : "From Google Drive",
            messageCount: driveSessionData?.messages.length || 0,
            isDriveSession: true,
            driveFileId: driveFile.id,
          };

          const existingLocalIndex = combinedMetadata.findIndex(m => m.id === appSessionId);
          if (existingLocalIndex !== -1) {
            const localVersion = combinedMetadata[existingLocalIndex];
            const driveIsNewerOrSame = driveMetaEntry.lastMessageTimestamp >= localVersion.lastMessageTimestamp;

            combinedMetadata[existingLocalIndex] = {
              ...localVersion,
              ...driveMetaEntry,
              name: (driveIsNewerOrSame && driveMetaEntry.name && !driveMetaEntry.name.startsWith("Drive:"))
                    ? driveMetaEntry.name
                    : (localVersion.name && !localVersion.name.startsWith("Drive:") ? localVersion.name : driveMetaEntry.name),
              preview: (driveIsNewerOrSame && driveMetaEntry.preview && driveMetaEntry.preview !== "From Google Drive")
                       ? driveMetaEntry.preview
                       : (localVersion.preview && localVersion.preview !== "From Google Drive" ? localVersion.preview : driveMetaEntry.preview),
              lastMessageTimestamp: Math.max(driveMetaEntry.lastMessageTimestamp, localVersion.lastMessageTimestamp),
              isDriveSession: true,
              driveFileId: driveMetaEntry.driveFileId,
            };
            seenIds.add(appSessionId); // ensure it's marked as seen if updated
          } else if (!seenIds.has(appSessionId)) {
            combinedMetadata.push(driveMetaEntry);
            seenIds.add(appSessionId);
          }
        }
      }
    }

    const finalMetadata = deduplicateMetadata(combinedMetadata);
    if (isMounted.current) {
        setHistoryMetadata(finalMetadata);
    }
    console.log(`loadHistoryIndex: Set historyMetadata with ${finalMetadata.length} items. Used Drive: ${!!(currentGoogleToken && currentDriveFolderId)}`);
  }, [effectiveUserId, chatHistoryIndexKeyLS, listSessionFilesFromDrive, getSessionFromDrive, deduplicateMetadata]);


  useEffect(() => {
    const orchestrateInitialLoad = async () => {
      if (!effectiveUserId || !isMounted.current) {
        console.log("useChatHistory Orchestrator: No effectiveUserId or not mounted. Waiting.");
        setIsLoading(true);
        return;
      }
      console.log(`useChatHistory Orchestrator: Starting for ${effectiveUserId}. AuthUser: ${!!authUser}, Token: ${!!googleAccessToken}`);
      setIsLoading(true);

      // Always load local history first
      await loadHistoryIndex(null, null);
      console.log(`useChatHistory Orchestrator: Local history loaded for ${effectiveUserId}. Current historyMetadata count: ${historyMetadata.length}`);


      if (authUser && googleAccessToken) {
        console.log(`useChatHistory Orchestrator: Google user & token present for ${effectiveUserId}. Initializing Drive folder.`);
        const folderIdFromInit = await initializeDriveFolder(googleAccessToken);
        if (folderIdFromInit && isMounted.current) {
           console.log(`useChatHistory Orchestrator: Drive folder ready (${folderIdFromInit}) for ${effectiveUserId}. Re-loading/merging history with Drive.`);
           await loadHistoryIndex(googleAccessToken, folderIdFromInit);
        } else if (isMounted.current) {
            console.warn(`useChatHistory Orchestrator: Drive folder initialization failed for ${effectiveUserId}. Only local history available initially.`);
        }
      } else if (isMounted.current) {
        console.log(`useChatHistory Orchestrator: No Google token or not a Google user for ${effectiveUserId}. Local history is primary.`);
      }

      if (isMounted.current) setIsLoading(false);
      console.log(`useChatHistory Orchestrator: Initial load sequence complete for ${effectiveUserId}. isLoading: ${isLoading}`);
    };

    orchestrateInitialLoad();
  }, [effectiveUserId, authUser, googleAccessToken, initializeDriveFolder, loadHistoryIndex]);


  const getSession = useCallback(async (sessionId: string): Promise<ChatSession | null> => {
    if (!effectiveUserId || !sessionId.startsWith(effectiveUserId + '_')) {
        console.warn(`getSession: Attempt to load session ${sessionId} for incorrect user context (current: ${effectiveUserId}).`);
        return null;
    }

    const metadataEntry = historyMetadata.find(m => m.id === sessionId);

    if (metadataEntry?.isDriveSession && metadataEntry.driveFileId && googleAccessToken && authUser?.uid === effectiveUserId) {
        console.log(`getSession: Attempting to fetch session ${sessionId} (Drive ID: ${metadataEntry.driveFileId}) from Google Drive.`);
        try {
            const driveSession = await getSessionFromDrive(googleAccessToken, metadataEntry.driveFileId);
            if (driveSession) {
                console.log(`getSession: Successfully fetched session ${sessionId} from Drive.`);
                try {
                    localStorage.setItem(`${chatSessionPrefixLS}${sessionId}`, JSON.stringify(createLeanSession(driveSession)));
                } catch (e) {
                    if (isQuotaExceededError(e)) console.error("getSession: Error caching lean Drive session to localStorage (quota).", e);
                    else console.error("getSession: Error caching lean Drive session to localStorage.", e);
                }
                return driveSession;
            }
            console.warn(`getSession: Failed to fetch session ${sessionId} from Drive. Falling back to localStorage.`);
        } catch (driveError) {
            console.error(`getSession: Error occurred while trying to fetch ${sessionId} from Drive. Falling back to localStorage.`, driveError);
        }
    }

    console.log(`getSession: Attempting to fetch session ${sessionId} from localStorage.`);
    try {
      const storedSession = localStorage.getItem(`${chatSessionPrefixLS}${sessionId}`);
      if (storedSession) {
        const parsedSession: ChatSession = JSON.parse(storedSession);
        if (metadataEntry?.isDriveSession && !parsedSession.driveFileId && metadataEntry.driveFileId) {
            parsedSession.driveFileId = metadataEntry.driveFileId;
        }
        console.log(`getSession: Successfully fetched session ${sessionId} from localStorage.`);
        return parsedSession;
      }
      console.warn(`getSession: Session ${sessionId} not found in localStorage.`);
      return null;
    } catch (error) {
      console.error(`Failed to load session ${sessionId} from localStorage:`, error);
      return null;
    }
  }, [effectiveUserId, googleAccessToken, authUser?.uid, historyMetadata, chatSessionPrefixLS, getSessionFromDrive]);


  const saveSession = useCallback(async (
    session: ChatSession,
    attemptNameGeneration: boolean = false,
    modelIdForNameGeneration?: string,
    userApiKeyForNameGeneration?: string,
  ): Promise<ChatSession> => {
    if (!effectiveUserId || !session || !session.id.startsWith(effectiveUserId + '_')) {
        console.warn("saveSession: Attempted to save session without valid userId or session ID prefix. Session ID:", session?.id, "Effective UserID:", effectiveUserId);
        return session;
    }

    // Clean up any lingering loading states before saving
    const cleanedMessages = session.messages.map(msg => {
      let finalContent = msg.content;
      // If the original message was actively loading AND its content is the "Processing..." placeholder
      if (msg.isLoading === true && typeof msg.content === 'string' && msg.content === 'Processing...') {
        // This signifies an interrupted generation if saved in this state.
        // Store its content as an empty array to represent this.
        finalContent = []; 
      }

      return {
        ...msg,
        content: finalContent,
        isLoading: false, // Represent saved messages as "not currently loading"
        // Preserve error state if it's a real error, not just a "Processing..." placeholder that failed.
        isError: (msg.isError && typeof msg.content !== 'string') ? true : // If it's a rich error object
                 (msg.isError && typeof msg.content === 'string' && msg.content !== 'Processing...') ? true : // If it's an error string (not placeholder)
                 false,
      };
    });
    
    // Preserve original timestamps
    const originalCreatedAt = session.createdAt;
    
    let sessionToSave: ChatSession = { 
      ...session, 
      updatedAt: Date.now(), 
      createdAt: originalCreatedAt, // Ensure we preserve original creation time
      userId: effectiveUserId,
      messages: cleanedMessages,
      // If attempting name generation and a specific model is provided for it,
      // set it on the session object. This will be picked up by processNameGenerationQueue.
      modelId: attemptNameGeneration && modelIdForNameGeneration 
                 ? modelIdForNameGeneration 
                 : session.modelId, 
    };
    
    const sessionIsNewAndNeedsName = attemptNameGeneration && (sessionToSave.name === "New Chat" || !sessionToSave.name);

    // Save to localStorage first
    try {
      localStorage.setItem(`${chatSessionPrefixLS}${sessionToSave.id}`, JSON.stringify(createLeanSession(sessionToSave)));
      console.log(`saveSession: Session ${sessionToSave.id} (lean) saved to localStorage initially.`);
    } catch (error) {
      if (isQuotaExceededError(error)) {
        console.error(`saveSession: Failed to save session ${sessionToSave.id} to localStorage due to quota.`, error);
        if (isMounted.current) toast({ title: "Local Storage Full", description: "Could not save chat session locally. Storage quota exceeded.", variant: "destructive", });
      } else {
        console.error(`saveSession: Failed to save session ${sessionToSave.id} to localStorage:`, error);
        if (isMounted.current) toast({ title: "Local Save Error", description: "Could not save chat session locally.", variant: "destructive", });
      }
    }

    // Update metadata immediately with current/placeholder name
    if (isMounted.current) {
      setTimeout(() => {
        if (!isMounted.current) return;
        setHistoryMetadata(prev => {
          const latestMessage = sessionToSave.messages.length > 0 ? 
            sessionToSave.messages[sessionToSave.messages.length - 1] : undefined;
          
          const newMeta: ChatSessionMetadata = {
            id: sessionToSave.id,
            name: sessionToSave.name || `Chat ${new Date(sessionToSave.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
            lastMessageTimestamp: sessionToSave.updatedAt,
            preview: getMessageTextPreview(latestMessage),
            messageCount: sessionToSave.messages.length,
            isDriveSession: prev.find(m => m.id === sessionToSave.id)?.isDriveSession || false, 
            driveFileId: prev.find(m => m.id === sessionToSave.id)?.driveFileId,
          };
          const otherMeta = prev.filter(meta => meta.id !== sessionToSave.id);
          const updatedFullHistory = deduplicateMetadata([newMeta, ...otherMeta]);
          try {
            localStorage.setItem(chatHistoryIndexKeyLS, JSON.stringify(updatedFullHistory));
          } catch (error) {
             if (isQuotaExceededError(error)) console.error("saveSession: Failed to save history index (quota).", error);
             else console.error("saveSession: Failed to save history index.", error);
          }
          return updatedFullHistory;
        });
      }, 0);
    }

    // Queue name generation as a separate process outside of React rendering
    if (sessionIsNewAndNeedsName) {
      queueNameGeneration(sessionToSave.id);
    }

    // Asynchronous Drive save without name generation
    (async () => {
      let driveFileIdToUse: string | undefined = sessionToSave.driveFileId;
      let driveSavedSuccessFlag = false;

      // Use current session name for Drive operations
      const sessionForDriveOp = { ...sessionToSave };
      
      // Ensure original timestamps are preserved when saving to Drive
      console.log(`saveSession (async Drive save): Using original createdAt: ${new Date(sessionForDriveOp.createdAt).toISOString()}`);

      if (googleAccessToken && appDriveFolderId && authUser && authUser.uid === effectiveUserId) {
        try {
          console.log(`saveSession (async Drive save): Attempting to save session ${sessionForDriveOp.id} with ${sessionForDriveOp.messages.length} messages to Drive.`);
          const driveFile = await saveSessionToDrive(googleAccessToken, appDriveFolderId, sessionForDriveOp.id, sessionForDriveOp);
          if (driveFile && driveFile.id) {
            driveFileIdToUse = driveFile.id;
            driveSavedSuccessFlag = true;
            console.log(`saveSession (async Drive save): Session ${sessionForDriveOp.id} saved successfully to Drive with file ID: ${driveFileIdToUse}`);
          } else {
            console.error(`saveSession (async Drive save): Failed to get valid Drive file ID for session ${sessionForDriveOp.id}`);
          }
        } catch (driveError: any) {
          console.error(`saveSession (async Drive save): Error during background save of ${sessionForDriveOp.id} to Drive:`, driveError);
          if (isMounted.current) toast({ title: "Drive Sync Error", description: `Failed to sync session \"${sessionForDriveOp.name}\" to Google Drive: ${driveError.message}`, variant: "destructive"});
        }
      } else {
        // Log why Drive save wasn't attempted
        const reasons = [];
        if (!googleAccessToken) reasons.push("no Google access token");
        if (!appDriveFolderId) reasons.push("no Drive folder ID");
        if (!authUser) reasons.push("no authenticated user");
        if (authUser && authUser.uid !== effectiveUserId) reasons.push("user ID mismatch");
        console.log(`saveSession (async Drive save): Skipping Drive save for session ${sessionToSave.id} due to: ${reasons.join(', ')}`);
      }

      // If Drive status changed, update metadata
      if (isMounted.current && driveSavedSuccessFlag) {
        setTimeout(() => {
          if (!isMounted.current) return;
          setHistoryMetadata(prev => {
            const existingMetaIndex = prev.findIndex(meta => meta.id === sessionToSave.id);
            if (existingMetaIndex === -1) {
                console.warn(`saveSession (async Drive save metadata update): session ID ${sessionToSave.id} not found in prev metadata. This might happen if it was deleted.`);
                return prev; // Session might have been deleted in the meantime
            }

            const updatedMetaEntry = { 
                ...prev[existingMetaIndex],
                lastMessageTimestamp: Date.now(), // Update timestamp to reflect this change
                isDriveSession: true, // If drive save succeeded
                driveFileId: driveFileIdToUse, // Use new drive ID
            };
            
            const updatedFullHistory = [...prev];
            updatedFullHistory[existingMetaIndex] = updatedMetaEntry;
            
            const finalDedupedHistory = deduplicateMetadata(updatedFullHistory);
            try {
              localStorage.setItem(chatHistoryIndexKeyLS, JSON.stringify(finalDedupedHistory));
            } catch (error) {
               if (isQuotaExceededError(error)) console.error("saveSession (async Drive save): Failed to save updated history index (quota).", error);
               else console.error("saveSession (async Drive save): Failed to save updated history index.", error);
            }
            return finalDedupedHistory;
          });
        }, 0);
      }
    })(); // End of async IIFE

    return sessionToSave;
  }, [effectiveUserId, googleAccessToken, appDriveFolderId, authUser, toast, chatHistoryIndexKeyLS, chatSessionPrefixLS, saveSessionToDrive, deduplicateMetadata]);


  const deleteSession = useCallback(async (sessionId: string) => {
    if (!effectiveUserId || !sessionId.startsWith(effectiveUserId + '_')) {
        console.warn(`deleteSession: Attempt to delete session ${sessionId} for incorrect user context (current: ${effectiveUserId}).`);
        return;
    }
    const sessionMetaToDelete = historyMetadata.find(meta => meta.id === sessionId);
    let driveDeleteSuccess = false;

    // Track deleted sessions to prevent re-sync
    try {
      const deletedSessions = JSON.parse(localStorage.getItem(deletedSessionsLSKey) || '[]');
      if (!deletedSessions.includes(sessionId)) {
        deletedSessions.push(sessionId);
        localStorage.setItem(deletedSessionsLSKey, JSON.stringify(deletedSessions));
        console.log(`deleteSession: Added ${sessionId} to deleted sessions tracking.`);
      }
    } catch (error) {
      console.error(`deleteSession: Error updating deleted sessions list:`, error);
    }

    if (sessionMetaToDelete?.isDriveSession && sessionMetaToDelete.driveFileId && googleAccessToken && authUser?.uid === effectiveUserId) {
        console.log(`deleteSession: Attempting to delete session ${sessionId} (Drive ID: ${sessionMetaToDelete.driveFileId}) from Drive.`);
        driveDeleteSuccess = await deleteFileFromDrive(googleAccessToken, sessionMetaToDelete.driveFileId);
        if (driveDeleteSuccess) {
            if (isMounted.current) toast({ title: "Session Deleted from Drive", description: `Session "${sessionMetaToDelete.name || sessionId}" also deleted from Google Drive.`});
        } else {
            if (isMounted.current) toast({ title: "Drive Deletion Failed", description: `Could not delete "${sessionMetaToDelete.name || sessionId}" from Drive. It will be removed locally.`, variant: "default"});
        }
    }
    try {
      localStorage.removeItem(`${chatSessionPrefixLS}${sessionId}`);
      if (isMounted.current) {
          setHistoryMetadata(prev => {
            const updatedHistory = prev.filter(meta => meta.id !== sessionId);
            const finalHistory = deduplicateMetadata(updatedHistory);
            try {
              localStorage.setItem(chatHistoryIndexKeyLS, JSON.stringify(finalHistory));
            } catch (error) {
               if (isQuotaExceededError(error)) console.error("deleteSession: Failed to update LS index (quota).", error);
               else console.error("deleteSession: Failed to update LS index.", error);
            }
            return finalHistory;
          });
          if (!sessionMetaToDelete?.isDriveSession || !driveDeleteSuccess) {
             if (isMounted.current) toast({ title: "Session Deleted Locally", description: `Session "${sessionMetaToDelete?.name || sessionId}" removed from local storage.`});
          }
      }
    } catch (error) {
      console.error(`deleteSession: Failed to delete session ${sessionId} from localStorage:`, error);
      if (isMounted.current) toast({ title: "Local Deletion Error", description: `Could not delete "${sessionMetaToDelete?.name || sessionId}" locally.`, variant: "destructive"});
    }
  }, [effectiveUserId, googleAccessToken, authUser?.uid, historyMetadata, toast, chatHistoryIndexKeyLS, chatSessionPrefixLS, deleteFileFromDrive, deduplicateMetadata, deletedSessionsLSKey]);


  const createNewSession = useCallback((initialMessages: ChatMessage[] = [], modelIdForNameGeneration?: string, userApiKeyForNameGen?: string): ChatSession => {
    if (!effectiveUserId) {
        console.error("createNewSession called without an effectiveUserId.");
        const tempId = `error_no_user_${Date.now()}_${Math.random().toString(36).substring(2,11)}`;
         return { id: tempId, name: 'New Chat (Error)', messages: [], createdAt: Date.now(), updatedAt: Date.now(), userId: "unknown_user", };
    }
    const newSessionId = `${effectiveUserId}_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
    const now = Date.now();
    const newSession: ChatSession = {
      id: newSessionId, name: 'New Chat', messages: initialMessages, createdAt: now, updatedAt: now, userId: effectiveUserId,
    };
    // Call saveSession with attemptNameGeneration = true
    // The name generation will happen asynchronously after the initial save
    saveSession(newSession, true, modelIdForNameGeneration || DEFAULT_MODEL_ID, userApiKeyForNameGen);
    return newSession;
  }, [effectiveUserId, saveSession]);


  const syncWithDrive = useCallback(async (): Promise<'SUCCESS' | 'TOKEN_REFRESH_NEEDED' | 'FAILED'> => {
    if (!isMounted.current) return 'FAILED';
    setIsSyncing(true);
    if (!authUser || !authUser.uid) {
        toast({ title: "Sync Unavailable", description: "Please log in with Google to sync with Google Drive.", variant: "default" });
        setIsSyncing(false); 
        return 'FAILED';
    }
    if (authUser.uid !== effectiveUserId) {
        toast({ title: "Sync User Mismatch", description: "Cannot sync, active user differs from Google authenticated user.", variant: "destructive" });
        setIsSyncing(false); 
        return 'FAILED';
    }

    let currentToken = googleAccessToken;
    if (!currentToken) {
        console.warn("useChatHistory (syncWithDrive): Google access token not available. Indicating refresh needed.");
        setIsSyncing(false);
        return 'TOKEN_REFRESH_NEEDED';
    }

    let currentAppDriveFolderId = appDriveFolderId;
    if (!currentAppDriveFolderId) {
        console.log("useChatHistory (syncWithDrive): appDriveFolderId not set in state, attempting to initialize.");
        currentAppDriveFolderId = await initializeDriveFolder(currentToken);
        if (!currentAppDriveFolderId) {
            toast({ title: "Drive Folder Error", description: "Could not initialize Drive folder for sync. Sync aborted.", variant: "destructive" });
            setIsSyncing(false); return 'FAILED';
        }
    }

    toast({ title: "Syncing with Google Drive...", description: "Please wait. This may take a moment." });
    try {
      // Load local sessions
      console.log("syncWithDrive: Loading local sessions from localStorage...");
      const localMetasFromLS: ChatSessionMetadata[] = JSON.parse(localStorage.getItem(chatHistoryIndexKeyLS) || '[]');
      const userLocalMetas = localMetasFromLS.filter(meta => meta.id.startsWith(effectiveUserId + '_'));
      console.log(`syncWithDrive: Found ${userLocalMetas.length} local session metadata entries.`);
      
      const localSessionsMap = new Map<string, ChatSession>();
      for (const meta of userLocalMetas) {
          const sessionJson = localStorage.getItem(`${chatSessionPrefixLS}${meta.id}`);
          if (sessionJson) {
              localSessionsMap.set(meta.id, JSON.parse(sessionJson) as ChatSession);
          }
      }
      console.log(`syncWithDrive: Loaded ${localSessionsMap.size} complete sessions from localStorage.`);

      // Get list of deleted sessions to prevent re-syncing
      const deletedSessions: string[] = [];
      try {
        const deletedSessionsData = localStorage.getItem(deletedSessionsLSKey);
        if (deletedSessionsData) {
          const parsed = JSON.parse(deletedSessionsData);
          if (Array.isArray(parsed)) {
            deletedSessions.push(...parsed);
          }
        }
        console.log(`syncWithDrive: Loaded ${deletedSessions.length} deleted session IDs to prevent re-syncing.`);
      } catch (error) {
        console.error("syncWithDrive: Error loading deleted sessions list:", error);
      }

      // Load Drive sessions
      console.log(`syncWithDrive: Listing session files from Drive folder ${currentAppDriveFolderId}...`);
      const driveFiles = await listSessionFilesFromDrive(currentToken, currentAppDriveFolderId);
      console.log(`syncWithDrive: Found ${driveFiles?.length || 0} session files in Drive.`);
      
      const driveSessionsMap = new Map<string, ChatSession>();
      const driveMetadataMap = new Map<string, ChatSessionMetadata>();

      if (driveFiles) {
        // Process drive files in parallel batches for better performance
        const batchSize = 10; // Process 10 files at a time
        const driveFilesToProcess = driveFiles.filter(file => {
          if (!file.name || !file.id || !file.name.startsWith(`session_${effectiveUserId}_`)) return false;
          const appSessionIdFromDriveFilename = file.name.replace(`session_`, '').replace('.json', '');
          // Skip deleted sessions
          if (deletedSessions.includes(appSessionIdFromDriveFilename)) {
            console.log(`syncWithDrive: Skipping deleted session ${appSessionIdFromDriveFilename} from Drive.`);
            return false;
          }
          return true;
        });
        
        console.log(`syncWithDrive: Processing ${driveFilesToProcess.length} valid Drive files in batches...`);

        // Process in batches for better performance
        for (let i = 0; i < driveFilesToProcess.length; i += batchSize) {
          const batch = driveFilesToProcess.slice(i, i + batchSize);
          console.log(`syncWithDrive: Processing batch ${Math.floor(i/batchSize) + 1} with ${batch.length} files...`);
          
          // Process batch in parallel
          const results = await Promise.all(batch.map(async (driveFile) => {
            const appSessionIdFromDriveFilename = driveFile.name!.replace(`session_`, '').replace('.json', '');
            try {
              const fullDriveSession = await getSessionFromDrive(currentToken, driveFile.id!);
              if (fullDriveSession) {
                // Preserve original timestamps
                const originalCreatedAt = fullDriveSession.createdAt;
                
                const sessionWithDriveId = { 
                  ...fullDriveSession, 
                  driveFileId: driveFile.id,
                  // Ensure we keep the original createdAt timestamp
                  createdAt: originalCreatedAt
                };
                
                return {
                  id: appSessionIdFromDriveFilename,
                  session: sessionWithDriveId,
                  metadata: {
                    id: appSessionIdFromDriveFilename, 
                    name: sessionWithDriveId.name || `Drive: ${appSessionIdFromDriveFilename.substring(0,10)}`,
                    lastMessageTimestamp: sessionWithDriveId.updatedAt,
                    preview: getMessageTextPreview(sessionWithDriveId.messages[sessionWithDriveId.messages.length - 1]),
                    messageCount: sessionWithDriveId.messages.length, 
                    isDriveSession: true, 
                    driveFileId: driveFile.id,
                  }
                };
              }
            } catch (error) {
              console.error(`syncWithDrive: Error processing Drive file ${driveFile.id}:`, error);
            }
            return null;
          }));
          
          // Filter out nulls and add to maps
          results.filter(Boolean).forEach(result => {
            if (result) {
              driveSessionsMap.set(result.id, result.session);
              driveMetadataMap.set(result.id, result.metadata);
            }
          });
        }
      }

      console.log(`syncWithDrive: Loaded ${driveSessionsMap.size} complete sessions from Drive.`);

      // Merge local and Drive sessions
      const allKnownIds = new Set([...localSessionsMap.keys(), ...driveSessionsMap.keys()]);
      console.log(`syncWithDrive: Processing ${allKnownIds.size} unique session IDs across both local and Drive.`);
      
      const finalMetadataList: ChatSessionMetadata[] = [];
      let syncedUpCount = 0;
      let syncedDownCount = 0;

      // Process uploads and downloads in parallel
      const syncPromises: Promise<void>[] = [];
      
      allKnownIds.forEach(id => {
        // Skip deleted sessions
        if (deletedSessions.includes(id)) {
          console.log(`syncWithDrive: Skipping deleted session ${id}.`);
          return;
        }
        
        let localSess = localSessionsMap.get(id);
        let driveSess = driveSessionsMap.get(id);
        const driveMetaFromMap = driveMetadataMap.get(id);

        if (localSess && driveSess && driveMetaFromMap) { // Exists in both
          // Compare message counts as a heuristic for determining which is newer
          const localMessageCount = localSess.messages.length;
          const driveMessageCount = driveSess.messages.length;
          
          // Compare timestamps ONLY if message counts are the same
          // If message counts differ, the one with more messages is considered newer
          const localIsNewer = localMessageCount > driveMessageCount || 
                              (localMessageCount === driveMessageCount && localSess.updatedAt >= driveSess.updatedAt);
          
          if (localIsNewer) {
            console.log(`syncWithDrive: Local session ${id} is newer (${localMessageCount} msgs vs ${driveMessageCount} msgs). Uploading to Drive.`);
            syncedUpCount++;
            
            // Ensure we preserve the original createdAt timestamp
            const sessionToUpload = { 
              ...localSess,
              createdAt: localSess.createdAt || driveSess.createdAt // Preserve original creation time
            };
            
            syncPromises.push((async () => {
              const savedDriveFile = await saveSessionToDrive(currentToken, currentAppDriveFolderId, id, sessionToUpload);
              if (savedDriveFile?.id) {
                sessionToUpload.driveFileId = savedDriveFile.id;
                console.log(`syncWithDrive: Successfully uploaded session ${id} to Drive. File ID: ${savedDriveFile.id}`);
                
                try { localStorage.setItem(`${chatSessionPrefixLS}${id}`, JSON.stringify(createLeanSession(sessionToUpload))); }
                catch (e) { if(isQuotaExceededError(e)) { console.error(`syncWithDrive: Quota error saving updated local session ${id}`, e); toast({title: "Local Storage Full", description: `Could not update local cache for session "${sessionToUpload.name}" after Drive sync.`});} else throw e; }
    
                finalMetadataList.push({
                  id, name: sessionToUpload.name, 
                  lastMessageTimestamp: sessionToUpload.updatedAt,
                  preview: getMessageTextPreview(sessionToUpload.messages[sessionToUpload.messages.length -1]), 
                  messageCount: sessionToUpload.messages.length,
                  isDriveSession: true, 
                  driveFileId: sessionToUpload.driveFileId,
                });
              } else {
                console.error(`syncWithDrive: Failed to upload session ${id} to Drive.`);
                finalMetadataList.push({
                  id, name: sessionToUpload.name, 
                  lastMessageTimestamp: sessionToUpload.updatedAt,
                  preview: getMessageTextPreview(sessionToUpload.messages[sessionToUpload.messages.length -1]), 
                  messageCount: sessionToUpload.messages.length,
                  isDriveSession: false, 
                  driveFileId: undefined,
                });
              }
            })());
          } else {
            console.log(`syncWithDrive: Drive session ${id} is newer (${driveMessageCount} msgs vs ${localMessageCount} msgs). Updating local storage.`);
            syncedDownCount++;
            
            syncPromises.push((async () => {
              try {
                // Preserve original creation timestamp
                const preservedCreationTime = localSess?.createdAt || driveSess.createdAt;
                driveSess = { ...driveSess, createdAt: preservedCreationTime };
                
                localStorage.setItem(`${chatSessionPrefixLS}${id}`, JSON.stringify(createLeanSession(driveSess)));
                console.log(`syncWithDrive: Successfully downloaded session ${id} from Drive to localStorage.`);
              } catch (e) {
                if(isQuotaExceededError(e)) {
                    console.error(`syncWithDrive: Quota error saving Drive session ${id} locally`, e);
                    toast({title: "Local Storage Full", description: `Could not save session "${driveSess.name}" from Drive locally due to storage limits.`});
                } else throw e;
              }
              finalMetadataList.push(driveMetaFromMap);
            })());
          }
        } else if (localSess) { // Local only
          console.log(`syncWithDrive: Session ${id} is local only (${localSess.messages.length} msgs). Uploading to Drive.`);
          syncedUpCount++;
          
          syncPromises.push((async () => {
            const savedDriveFile = await saveSessionToDrive(currentToken, currentAppDriveFolderId, id, localSess);
            if (savedDriveFile?.id) {
              localSess.driveFileId = savedDriveFile.id;
              console.log(`syncWithDrive: Successfully uploaded local-only session ${id} to Drive. File ID: ${savedDriveFile.id}`);
              
              try { localStorage.setItem(`${chatSessionPrefixLS}${id}`, JSON.stringify(createLeanSession(localSess))); }
              catch (e) { if(isQuotaExceededError(e)) { console.error(`syncWithDrive: Quota error saving local session ${id} after Drive upload`, e); toast({title: "Local Storage Full", description: `Could not update local cache for session "${localSess.name}" after Drive sync.`});} else throw e; }

              finalMetadataList.push({
                id, name: localSess.name, 
                lastMessageTimestamp: localSess.updatedAt,
                preview: getMessageTextPreview(localSess.messages[localSess.messages.length -1]), 
                messageCount: localSess.messages.length,
                isDriveSession: true, 
                driveFileId: localSess.driveFileId,
              });
            } else {
              console.error(`syncWithDrive: Failed to upload local-only session ${id} to Drive.`);
              finalMetadataList.push({
                id, name: localSess.name, 
                lastMessageTimestamp: localSess.updatedAt,
                preview: getMessageTextPreview(localSess.messages[localSess.messages.length -1]), 
                messageCount: localSess.messages.length,
                isDriveSession: false,
              });
            }
          })());
        } else if (driveSess && driveMetaFromMap && !deletedSessions.includes(id)) { // Only Drive and not deleted
          console.log(`syncWithDrive: Session ${id} is Drive only (${driveSess.messages.length} msgs). Saving to local storage.`);
          syncedDownCount++;
          
          syncPromises.push((async () => {
            try {
               localStorage.setItem(`${chatSessionPrefixLS}${id}`, JSON.stringify(createLeanSession(driveSess)));
               console.log(`syncWithDrive: Successfully downloaded Drive-only session ${id} to localStorage.`);
            } catch (e) {
                if(isQuotaExceededError(e)) {
                    console.error(`syncWithDrive: Quota error saving Drive session ${id} locally`, e);
                    toast({title: "Local Storage Full", description: `Could not save session "${driveSess.name}" from Drive locally due to storage limits. It will still appear in history if metadata fits.`});
                } else {
                    throw e;
                }
            }
            finalMetadataList.push(driveMetaFromMap);
          })());
        }
      });

      // Wait for all sync operations to complete
      await Promise.all(syncPromises);

      console.log(`syncWithDrive: Sync complete. Uploaded ${syncedUpCount} sessions to Drive, downloaded ${syncedDownCount} sessions from Drive.`);

      const finalDedupedMetadata = deduplicateMetadata(finalMetadataList);
      try {
        localStorage.setItem(chatHistoryIndexKeyLS, JSON.stringify(finalDedupedMetadata));
        console.log(`syncWithDrive: Saved final deduped metadata (${finalDedupedMetadata.length} items) to localStorage.`);
      } catch (e) { if(isQuotaExceededError(e)) { console.error(`syncWithDrive: Quota error saving final history index`, e); toast({title: "Local Storage Full", description: `Could not save updated chat history index locally.`});} else throw e; }

      if(isMounted.current) {
        setHistoryMetadata(finalDedupedMetadata);
        setIsSyncing(false);
        toast({ title: "Drive Sync Successful", description: `Synced ${syncedUpCount} chats to Drive, ${syncedDownCount} from Drive.` });
        // Explicitly reload/re-merge after successful sync
        await loadHistoryIndex(currentToken, currentAppDriveFolderId);
      }
      return 'SUCCESS';

    } catch (error: any) {
      console.error("Error during Sync with Drive:", error);
      if(isMounted.current) {
        toast({ title: "Drive Sync Failed", description: error.message || "An unknown error occurred during sync.", variant: "destructive",});
        setIsSyncing(false);
      }
      return 'FAILED';
    }
  }, [
    effectiveUserId, googleAccessToken, appDriveFolderId, authUser,
    toast, initializeDriveFolder, chatHistoryIndexKeyLS, chatSessionPrefixLS,
    listSessionFilesFromDrive, getSessionFromDrive, saveSessionToDrive,
    deduplicateMetadata, loadHistoryIndex, deletedSessionsLSKey
  ]);
  
  return {
    historyMetadata,
    isLoading,
    getSession,
    saveSession,
    deleteSession,
    createNewSession,
    syncWithDrive,
    isSyncing,
    triggerGoogleSignIn: triggerGoogleSignInFromAuth
  };
}