
// src/lib/hooks/use-chat-history.ts
"use client";

import { useState, useEffect, useCallback } from 'react';
import type { ChatSession, ChatSessionMetadata, ChatMessage, DriveFile, AttachedFile } from '@/lib/types';
import { DEFAULT_USER_ID, DEFAULT_MODEL_ID } from '@/lib/constants';
import { generateChatName, type GenerateChatNameInput } from '@/ai/flows/generate-chat-name-flow';
import { useAuth } from '@/contexts/auth-context';
import { ensureAppFolderExists, saveSessionToDrive, listSessionFilesFromDrive, getSessionFromDrive, deleteFileFromDrive } from '@/lib/services/drive-service';
import { useToast } from '@/hooks/use-toast';

const CHAT_HISTORY_INDEX_KEY_LS_PREFIX = 'desainr_chat_history_index_ls_v3_';
const CHAT_SESSION_PREFIX_LS_PREFIX = 'desainr_chat_session_ls_v3_';
const APP_DRIVE_FOLDER_ID_LS_PREFIX = 'desainr_app_drive_folder_id_';


const getMessageTextPreview = (message: ChatMessage | undefined): string => {
  if (!message) return 'New Chat';
  if (typeof message.content === 'string') {
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
                if (part.code) return `Code: ${part.code.substring(0, 40).trim()}`;
                break;
            case 'list':
                if (part.title) return `List: ${part.title.substring(0, 40).trim()}`;
                if (part.items && part.items.length > 0) return `List: ${part.items[0].substring(0, 40).trim()}`;
                break;
            case 'translation_group':
                if (part.title) return `Analysis: ${part.title.substring(0, 40).trim()}`;
                if (part.english?.analysis) return `Eng Analysis: ${part.english.analysis.substring(0, 30).trim()}`;
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
    (error.code === 22 && name.includes('datacloneerror')) || // Firefox specific
    (error.name === 'QuotaExceededError') // Standard name
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
      const newItem = { ...item }; // Create a copy to avoid mutating original
      if (existing) { // Merge drive info if existing had it
          newItem.isDriveSession = newItem.isDriveSession || existing.isDriveSession;
          newItem.driveFileId = newItem.driveFileId || existing.driveFileId;
      }
      map.set(item.id, newItem);
    } else { // existing is newer or has drive info this one lacks
        const updatedExisting = {...existing};
        updatedExisting.isDriveSession = existing.isDriveSession || item.isDriveSession;
        updatedExisting.driveFileId = existing.driveFileId || item.driveFileId;
        map.set(item.id, updatedExisting);
    }
  }
  return Array.from(map.values()).sort((a, b) => b.lastMessageTimestamp - a.lastMessageTimestamp);
}

// Helper function to create a "lean" version of a session for localStorage
const createLeanSession = (session: ChatSession): ChatSession => {
    const leanMessages = session.messages.map(msg => {
        if (msg.attachedFiles && msg.attachedFiles.some(f => f.dataUri || (f.textContent && f.textContent.length > 500))) {
            return {
                ...msg,
                attachedFiles: msg.attachedFiles.map(f => {
                    const { dataUri, textContent, ...rest } = f;
                    const leanFile: AttachedFile = {...rest};
                    if (textContent && textContent.length > 500) {
                        leanFile.textContent = textContent.substring(0,500) + "... (truncated)";
                    } else if (textContent) {
                        leanFile.textContent = textContent;
                    }
                    return leanFile;
                })
            };
        }
        return msg;
    });
    return { ...session, messages: leanMessages };
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


  const initializeDriveFolder = useCallback(async (token: string): Promise<string | null> => {
    if (!token || !effectiveUserId) {
      console.warn("useChatHistory (initializeDriveFolder): No Google access token or effectiveUserId.");
      setAppDriveFolderId(null);
      return null;
    }

    const cachedFolderId = localStorage.getItem(appDriveFolderIdLSKey);
    if (cachedFolderId) {
        console.log(`useChatHistory (initializeDriveFolder): Using cached Drive folder ID for user ${effectiveUserId}: ${cachedFolderId}`);
        setAppDriveFolderId(cachedFolderId); // Set state
        return cachedFolderId;
    }

    console.log(`useChatHistory (initializeDriveFolder): No cached Drive folder ID. Ensuring app folder exists on Drive for user ${effectiveUserId}.`);
    try {
      const folderId = await ensureAppFolderExists(token);
      if (folderId) {
        setAppDriveFolderId(folderId);
        localStorage.setItem(appDriveFolderIdLSKey, folderId);
        console.log(`useChatHistory (initializeDriveFolder): App Drive folder ID set and cached: ${folderId}`);
        return folderId;
      } else {
        toast({ title: "Google Drive Error", description: "Could not access or create the app folder in Google Drive.", variant: "destructive",});
        setAppDriveFolderId(null);
      }
    } catch (error: any) {
        console.error(`useChatHistory (initializeDriveFolder): Error ensuring app folder exists for user ${effectiveUserId}:`, error);
        toast({ title: "Google Drive Setup Failed", description: `Failed to set up app folder: ${error.message}. Drive features may be unavailable.`, variant: "destructive",});
        setAppDriveFolderId(null);
    }
    return null;
  }, [toast, effectiveUserId, appDriveFolderIdLSKey]);


  const loadHistoryIndex = useCallback(async (
    currentGoogleToken: string | null,
    currentDriveFolderId: string | null
  ) => {
    if (!effectiveUserId) {
      console.log("useChatHistory (loadHistoryIndex): No effectiveUserId, cannot load history.");
      setHistoryMetadata([]);
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    console.log(`useChatHistory (loadHistoryIndex): Loading history for user ${effectiveUserId}. Token: ${!!currentGoogleToken}, FolderID: ${currentDriveFolderId}`);

    let combinedMetadata: ChatSessionMetadata[] = [];
    const seenIds = new Set<string>();

    // 1. Attempt to load from Google Drive if token and folderId are available
    if (currentGoogleToken && currentDriveFolderId) {
      console.log(`useChatHistory (loadHistoryIndex): Attempting to fetch metadata from Drive for user ${effectiveUserId}.`);
      const driveFiles = await listSessionFilesFromDrive(currentGoogleToken, currentDriveFolderId);
      if (driveFiles) {
        for (const driveFile of driveFiles) {
          if (!driveFile.name || !driveFile.id || !driveFile.name.startsWith(`session_${effectiveUserId}_`)) continue;
          const appSessionId = driveFile.name.replace(`session_`, '').replace('.json', '');

          const fullSession = await getSessionFromDrive(currentGoogleToken, driveFile.id);
          if (fullSession) {
            combinedMetadata.push({
              id: appSessionId,
              name: fullSession.name || `Drive: ${new Date(fullSession.createdAt).toLocaleTimeString()}`,
              lastMessageTimestamp: new Date(driveFile.modifiedTime || fullSession.updatedAt).getTime(),
              preview: getMessageTextPreview(fullSession.messages[fullSession.messages.length - 1]),
              messageCount: fullSession.messages.length,
              isDriveSession: true,
              driveFileId: driveFile.id,
            });
            seenIds.add(appSessionId);
          } else {
             console.warn(`useChatHistory (loadHistoryIndex): Failed to fetch full session content for Drive file ${driveFile.id} (app session ID: ${appSessionId}). Creating minimal metadata.`);
             combinedMetadata.push({
                id: appSessionId,
                name: `Drive File: ${driveFile.name.replace(`session_`, '').replace('.json', '').substring(0,20)}...`,
                lastMessageTimestamp: new Date(driveFile.modifiedTime || Date.now()).getTime(),
                preview: "From Google Drive (content error)",
                messageCount: 0, // Unknown
                isDriveSession: true,
                driveFileId: driveFile.id,
            });
            seenIds.add(appSessionId);
          }
        }
        console.log(`useChatHistory (loadHistoryIndex): Fetched ${driveFiles.length} potential sessions from Drive. Processed ${combinedMetadata.length}.`);
      } else {
        console.warn(`useChatHistory (loadHistoryIndex): listSessionFilesFromDrive returned null or empty for user ${effectiveUserId}.`);
      }
    }

    // 2. Load from localStorage and merge/add if not already seen from Drive
    console.log(`useChatHistory (loadHistoryIndex): Loading local history metadata for user ${effectiveUserId}.`);
    try {
      const storedIndex = localStorage.getItem(chatHistoryIndexKeyLS);
      let localParsedIndex: ChatSessionMetadata[] = storedIndex ? JSON.parse(storedIndex) : [];
      
      let userSpecificLocalMetadata: ChatSessionMetadata[] = [];
      if (Array.isArray(localParsedIndex)) {
          userSpecificLocalMetadata = localParsedIndex.filter((meta): meta is ChatSessionMetadata => 
              meta && typeof meta.id === 'string' && meta.id.startsWith(effectiveUserId + '_') &&
              typeof meta.name === 'string' &&
              typeof meta.lastMessageTimestamp === 'number' &&
              typeof meta.preview === 'string' &&
              typeof meta.messageCount === 'number'
          );
          if (userSpecificLocalMetadata.length < localParsedIndex.length && localParsedIndex.length > 0) {
            console.warn(`useChatHistory (loadHistoryIndex): Filtered out ${localParsedIndex.length - userSpecificLocalMetadata.length} invalid/non-user sessions from LS index. Updating LS.`);
            localStorage.setItem(chatHistoryIndexKeyLS, JSON.stringify(userSpecificLocalMetadata));
          }
      }

      userSpecificLocalMetadata.forEach(localMeta => {
        if (!seenIds.has(localMeta.id)) {
          combinedMetadata.push(localMeta); // Add if not seen from Drive
          seenIds.add(localMeta.id);
        } else {
          // It was seen from Drive, let's compare and potentially update the Drive entry with local details if local is newer/better
          const driveVersionIndex = combinedMetadata.findIndex(m => m.id === localMeta.id);
          if (driveVersionIndex !== -1) {
            const driveVersion = combinedMetadata[driveVersionIndex];
            if (localMeta.lastMessageTimestamp > driveVersion.lastMessageTimestamp || 
                (driveVersion.preview === "From Google Drive (content error)" && localMeta.preview !== "From Google Drive (content error)")) {
                
                console.log(`useChatHistory (loadHistoryIndex): Merging local data for session ${localMeta.id} into Drive version as local is newer/better.`);
                combinedMetadata[driveVersionIndex] = {
                    ...localMeta, // Take local details
                    isDriveSession: true, // But mark it as a drive session
                    driveFileId: driveVersion.driveFileId, // Keep the driveFileId
                    lastMessageTimestamp: Math.max(localMeta.lastMessageTimestamp, driveVersion.lastMessageTimestamp) // Ensure newest timestamp
                };
            }
          }
        }
      });
      console.log(`useChatHistory (loadHistoryIndex): Processed ${userSpecificLocalMetadata.length} local sessions for ${effectiveUserId}. Total combined: ${combinedMetadata.length}`);
    } catch (error) {
      console.error("useChatHistory (loadHistoryIndex): Failed to load/parse local chat history index:", error);
    }
    
    const finalMetadata = deduplicateMetadata(combinedMetadata);
    setHistoryMetadata(finalMetadata);
    setIsLoading(false);
    console.log(`useChatHistory (loadHistoryIndex): Final history metadata count for user ${effectiveUserId}: ${finalMetadata.length}`);
  }, [effectiveUserId, chatHistoryIndexKeyLS, toast]);


  useEffect(() => {
    const orchestrateInitialLoad = async () => {
        if (!effectiveUserId || !authUser) {
            // If not logged in with Firebase, just load local history for default user or logged-out state.
            if (effectiveUserId === DEFAULT_USER_ID || !authUser) {
                 console.log("useChatHistory Effect: No Firebase user or default user. Loading local history only.");
                 await loadHistoryIndex(null, null); // Load local only
            }
            return;
        }

        // Firebase user is present.
        console.log(`useChatHistory Effect: Firebase user ${authUser.uid} detected. Token available: ${!!googleAccessToken}`);
        
        if (googleAccessToken) { // Token IS available (e.g., fresh login, or after manual sync)
            console.log("useChatHistory Effect: Google access token present. Initializing Drive folder and loading combined history.");
            const folderId = await initializeDriveFolder(googleAccessToken);
            await loadHistoryIndex(googleAccessToken, folderId);
        } else { // Token is NOT available (e.g., after refresh)
            console.log("useChatHistory Effect: Google access token NOT present. Loading local history only for now.");
            await loadHistoryIndex(null, null); // Load local only
            // appDriveFolderId will be initialized from localStorage by initializeDriveFolder if user clicks Sync later
            // Or if initializeDriveFolder is called separately when token becomes available (e.g. via a dedicated effect)
        }
    };

    orchestrateInitialLoad();
  }, [effectiveUserId, authUser, googleAccessToken, initializeDriveFolder, loadHistoryIndex]);

  // Separate effect to attempt initializing Drive folder if token becomes available later
  // and appDriveFolderId is not yet set. This handles cases where token might arrive after initial load logic.
  useEffect(() => {
    if (authUser && googleAccessToken && !appDriveFolderId) {
        console.log("useChatHistory Drive Init Effect: Token available, appDriveFolderId not set. Initializing folder.");
        initializeDriveFolder(googleAccessToken);
    }
  }, [authUser, googleAccessToken, appDriveFolderId, initializeDriveFolder]);


  const getSession = useCallback(async (sessionId: string): Promise<ChatSession | null> => {
    if (!effectiveUserId || !sessionId.startsWith(effectiveUserId + '_')) {
        console.warn(`getSession: Attempt to load session ${sessionId} for incorrect user context (current: ${effectiveUserId}).`);
        return null;
    }
    
    const metadataEntry = historyMetadata.find(m => m.id === sessionId);

    if (metadataEntry?.isDriveSession && metadataEntry.driveFileId && googleAccessToken && authUser?.uid === effectiveUserId) {
        console.log(`getSession: Attempting to fetch session ${sessionId} (Drive ID: ${metadataEntry.driveFileId}) from Google Drive.`);
        const driveSession = await getSessionFromDrive(googleAccessToken, metadataEntry.driveFileId);
        if (driveSession) {
            console.log(`getSession: Successfully fetched session ${sessionId} from Drive.`);
            try {
                const leanDriveSession = createLeanSession(driveSession); // Create lean version
                localStorage.setItem(`${chatSessionPrefixLS}${sessionId}`, JSON.stringify(leanDriveSession));
            } catch (e) { 
                if (isQuotaExceededError(e)) {
                    console.error("getSession: Error caching lean Drive session to localStorage (quota exceeded).", e);
                } else {
                    console.error("getSession: Error caching lean Drive session to localStorage.", e);
                }
            }
            return driveSession; // Return full session for app use
        }
        console.warn(`getSession: Failed to fetch session ${sessionId} from Drive. Falling back to localStorage.`);
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
  }, [effectiveUserId, googleAccessToken, historyMetadata, authUser?.uid, chatSessionPrefixLS]);


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
    
    let sessionToUpdateInMemory = { ...session };
    sessionToUpdateInMemory.updatedAt = Date.now();
    sessionToUpdateInMemory.userId = effectiveUserId;

    if (attemptNameGeneration && sessionToUpdateInMemory.messages.length > 0 && (sessionToUpdateInMemory.name === "New Chat" || !sessionToUpdateInMemory.name)) {
      const firstUserMsg = sessionToUpdateInMemory.messages.find(m => m.role === 'user');
      if (firstUserMsg) {
        try {
          const nameInput: GenerateChatNameInput = {
            firstUserMessage: getMessageTextPreview(firstUserMsg) || "Chat conversation",
            modelId: modelIdForNameGeneration || DEFAULT_MODEL_ID,
            userApiKey: userApiKeyForNameGeneration,
          };
          console.log(`saveSession: Attempting to generate name for session ${sessionToUpdateInMemory.id}`);
          const nameOutput = await generateChatName(nameInput);
          if (nameOutput.chatName) {
            sessionToUpdateInMemory.name = nameOutput.chatName;
          }
        } catch (nameGenError: any) {
          console.error(`saveSession: Failed to generate chat name for session ${sessionToUpdateInMemory.id}:`, nameGenError);
          if (sessionToUpdateInMemory.name === "New Chat" || !sessionToUpdateInMemory.name) {
             const date = new Date(sessionToUpdateInMemory.createdAt);
             sessionToUpdateInMemory.name = `Chat ${date.toLocaleDateString()} ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
          }
        }
      } else if (sessionToUpdateInMemory.name === "New Chat" || !sessionToUpdateInMemory.name) {
          const date = new Date(sessionToUpdateInMemory.createdAt);
          sessionToUpdateInMemory.name = `Chat ${date.toLocaleDateString()} ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
      }
    }
    
    const leanSessionForLocalStorage = createLeanSession(sessionToUpdateInMemory);

    try {
      localStorage.setItem(`${chatSessionPrefixLS}${sessionToUpdateInMemory.id}`, JSON.stringify(leanSessionForLocalStorage));
      console.log(`saveSession: Session ${sessionToUpdateInMemory.id} (lean) saved to localStorage.`);
    } catch (error) {
      if (isQuotaExceededError(error)) {
        console.error(`saveSession: Failed to save session ${sessionToUpdateInMemory.id} to localStorage due to quota exceeded.`, error);
        toast({ title: "Local Storage Full", description: "Could not save chat session locally. Storage quota exceeded.", variant: "destructive", });
      } else {
        console.error(`saveSession: Failed to save session ${sessionToUpdateInMemory.id} to localStorage:`, error);
        toast({ title: "Local Save Error", description: "Could not save chat session locally.", variant: "destructive", });
      }
    }

    let driveSavedSuccessfully = false;
    let actualDriveFileIdFromSave: string | undefined = sessionToUpdateInMemory.driveFileId;

    if (googleAccessToken && appDriveFolderId && authUser && authUser.uid === effectiveUserId) {
      console.log(`saveSession: Attempting background save of session ${sessionToUpdateInMemory.id} to Google Drive (folder: ${appDriveFolderId}).`);
      try {
        const driveFile = await saveSessionToDrive(googleAccessToken, appDriveFolderId, sessionToUpdateInMemory.id, sessionToUpdateInMemory); 
        if (driveFile && driveFile.id) {
          console.log(`saveSession: Session ${sessionToUpdateInMemory.id} saved to Drive. Drive File ID: ${driveFile.id}`);
          actualDriveFileIdFromSave = driveFile.id;
          sessionToUpdateInMemory.driveFileId = driveFile.id;
          driveSavedSuccessfully = true;
        } else {
          console.warn(`saveSession: Background save to Drive failed for session ${sessionToUpdateInMemory.id} (saveSessionToDrive returned null/no ID). Toasting user.`);
          toast({ title: "Drive Sync Incomplete", description: `Session "${sessionToUpdateInMemory.name}" saved locally. Background sync to Drive failed. Try manual sync later.`, variant: "default" });
        }
      } catch (driveError: any) {
        console.error(`saveSession: Error during background save of session ${sessionToUpdateInMemory.id} to Drive:`, driveError);
        toast({ title: "Drive Sync Error", description: `Session "${sessionToUpdateInMemory.name}" saved locally. Error syncing to Drive: ${driveError.message}.`, variant: "destructive" });
      }
    } else if (authUser && authUser.uid === effectiveUserId && !googleAccessToken) {
        console.log(`saveSession: Google user, but no access token. Skipping background Drive save for ${sessionToUpdateInMemory.id}. Will sync on next manual 'Sync' action.`);
    }

    setHistoryMetadata(prev => {
      const newMeta: ChatSessionMetadata = {
        id: sessionToUpdateInMemory.id,
        name: sessionToUpdateInMemory.name || `Chat ${new Date(sessionToUpdateInMemory.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
        lastMessageTimestamp: sessionToUpdateInMemory.updatedAt,
        preview: getMessageTextPreview(sessionToUpdateInMemory.messages[sessionToUpdateInMemory.messages.length - 1]),
        messageCount: sessionToUpdateInMemory.messages.length,
        isDriveSession: driveSavedSuccessfully || !!prev.find(m => m.id === sessionToUpdateInMemory.id)?.isDriveSession || !!actualDriveFileIdFromSave,
        driveFileId: actualDriveFileIdFromSave || prev.find(m => m.id === sessionToUpdateInMemory.id)?.driveFileId,
      };

      const otherMeta = prev.filter(meta => meta.id !== sessionToUpdateInMemory.id);
      const updatedFullHistory = deduplicateMetadata([newMeta, ...otherMeta]);
      
      try {
        localStorage.setItem(chatHistoryIndexKeyLS, JSON.stringify(updatedFullHistory));
      } catch (error) {
         if (isQuotaExceededError(error)) {
            console.error("saveSession: Failed to save chat history index to localStorage due to quota exceeded.", error);
          } else {
            console.error("saveSession: Failed to save chat history index to localStorage:", error);
          }
      }
      return updatedFullHistory;
    });
    return sessionToUpdateInMemory;
  }, [effectiveUserId, googleAccessToken, appDriveFolderId, authUser, toast, chatHistoryIndexKeyLS, chatSessionPrefixLS]);


  const deleteSession = useCallback(async (sessionId: string) => {
    if (!effectiveUserId || !sessionId.startsWith(effectiveUserId + '_')) {
        console.warn(`deleteSession: Attempt to delete session ${sessionId} for incorrect user context (current: ${effectiveUserId}).`);
        return;
    }

    const sessionMetaToDelete = historyMetadata.find(meta => meta.id === sessionId);
    let driveDeleteSucceeded = false;

    if (sessionMetaToDelete?.isDriveSession && sessionMetaToDelete.driveFileId && googleAccessToken && authUser?.uid === effectiveUserId) {
        console.log(`deleteSession: Attempting to delete session ${sessionId} (Drive ID: ${sessionMetaToDelete.driveFileId}) from Google Drive.`);
        const deletedFromDrive = await deleteFileFromDrive(googleAccessToken, sessionMetaToDelete.driveFileId);
        if (deletedFromDrive) {
            driveDeleteSucceeded = true;
            toast({ title: "Session Deleted from Drive", description: `Session "${sessionMetaToDelete.name || sessionId}" also deleted from Google Drive.`});
        } else {
            toast({ title: "Drive Deletion Failed", description: `Could not delete "${sessionMetaToDelete.name || sessionId}" from Drive. Removed locally.`, variant: "default"});
        }
    }

    try {
      localStorage.removeItem(`${chatSessionPrefixLS}${sessionId}`);
      setHistoryMetadata(prev => {
        const updatedHistory = prev.filter(meta => meta.id !== sessionId);
        const finalHistory = deduplicateMetadata(updatedHistory);
        try {
          localStorage.setItem(chatHistoryIndexKeyLS, JSON.stringify(finalHistory));
        } catch (error) {
           if (isQuotaExceededError(error)) { console.error("deleteSession: Failed to update LS index after deletion (quota).", error); }
           else { console.error("deleteSession: Failed to update LS index after deletion.", error); }
        }
        return finalHistory;
      });
      if (!sessionMetaToDelete?.isDriveSession || !driveDeleteSucceeded) { // Or if Drive deletion failed but local succeeded
         toast({ title: "Session Deleted Locally", description: `Session "${sessionMetaToDelete?.name || sessionId}" removed from local storage.`});
      }
    } catch (error) {
      console.error(`deleteSession: Failed to delete session ${sessionId} from localStorage:`, error);
      toast({ title: "Local Deletion Error", description: `Could not delete "${sessionMetaToDelete?.name || sessionId}" locally.`, variant: "destructive"});
    }
  }, [effectiveUserId, googleAccessToken, authUser?.uid, historyMetadata, toast, chatHistoryIndexKeyLS, chatSessionPrefixLS]);


  const createNewSession = useCallback((initialMessages: ChatMessage[] = [], modelIdForNameGeneration?: string, userApiKeyForNameGen?: string): ChatSession => {
    if (!effectiveUserId) {
        console.error("createNewSession called without an effectiveUserId. This should not happen.");
        const tempId = `error_no_user_${Date.now()}_${Math.random().toString(36).substring(2,11)}`;
         return { id: tempId, name: 'New Chat (Error)', messages: [], createdAt: Date.now(), updatedAt: Date.now(), userId: "unknown_user", };
    }
    const newSessionId = `${effectiveUserId}_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
    const now = Date.now();
    const newSession: ChatSession = {
      id: newSessionId, name: 'New Chat', messages: initialMessages, createdAt: now, updatedAt: now, userId: effectiveUserId,
    };
    saveSession(newSession, true, modelIdForNameGeneration || DEFAULT_MODEL_ID, userApiKeyForNameGen); 
    return newSession;
  }, [effectiveUserId, saveSession]);


  const syncWithDrive = useCallback(async (): Promise<'SUCCESS' | 'TOKEN_REFRESH_NEEDED' | 'FAILED'> => {
    setIsSyncing(true);
    if (!authUser || !authUser.uid) {
        toast({ title: "Sync Unavailable", description: "Please log in with Google to sync with Google Drive.", variant: "default" });
        setIsSyncing(false); return 'FAILED';
    }
    if (authUser.uid !== effectiveUserId) {
        toast({ title: "Sync User Mismatch", description: "Cannot sync, active user differs from Google authenticated user.", variant: "destructive" });
        setIsSyncing(false); return 'FAILED';
    }
    
    let currentToken = googleAccessToken;
    if (!currentToken) {
        console.warn("useChatHistory (syncWithDrive): Google access token not available. Requesting re-authentication.");
        setIsSyncing(false); 
        return 'TOKEN_REFRESH_NEEDED';
    }

    let currentAppDriveFolderId = appDriveFolderId;
    if (!currentAppDriveFolderId) {
        currentAppDriveFolderId = await initializeDriveFolder(currentToken);
        if (!currentAppDriveFolderId) {
            toast({ title: "Drive Folder Error", description: "Could not initialize Drive folder. Sync aborted.", variant: "destructive" });
            setIsSyncing(false); return 'FAILED';
        }
    }
    
    toast({ title: "Syncing with Google Drive...", description: "Please wait. This may take a moment." });
    try {
      const localMetasFromState = [...historyMetadata]; // Use current state as a base for local
      const localSessionsPromises = localMetasFromState.map(meta => getSession(meta.id));
      const localSessionsArray = (await Promise.all(localSessionsPromises)).filter(Boolean) as ChatSession[];
      const localSessionsMap = new Map(localSessionsArray.map(s => [s.id, s]));

      const driveFiles = await listSessionFilesFromDrive(currentToken, currentAppDriveFolderId);
      const driveSessionsMap = new Map<string, ChatSession>();
      const driveMetadataMap = new Map<string, ChatSessionMetadata>();

      if (driveFiles) {
        for (const driveFile of driveFiles) {
          if (!driveFile.name || !driveFile.id || !driveFile.name.startsWith(`session_${effectiveUserId}_`)) continue;
          const appSessionId = driveFile.name.replace(`session_`, '').replace('.json', '');
          
          const fullDriveSession = await getSessionFromDrive(currentToken, driveFile.id);
          if (fullDriveSession) {
            fullDriveSession.driveFileId = driveFile.id; 
            driveSessionsMap.set(appSessionId, fullDriveSession);
            driveMetadataMap.set(appSessionId, {
              id: appSessionId,
              name: fullDriveSession.name || `Drive: ${new Date(fullDriveSession.createdAt).toLocaleDateString()}`,
              lastMessageTimestamp: new Date(driveFile.modifiedTime || fullDriveSession.updatedAt).getTime(),
              preview: getMessageTextPreview(fullDriveSession.messages[fullDriveSession.messages.length - 1]),
              messageCount: fullDriveSession.messages.length,
              isDriveSession: true,
              driveFileId: driveFile.id,
            });
          }
        }
      }

      const allKnownIds = new Set([...localSessionsMap.keys(), ...driveSessionsMap.keys()]);
      const finalMetadataList: ChatSessionMetadata[] = [];
      const processedIds = new Set<string>();


      for (const id of allKnownIds) {
        if (processedIds.has(id)) continue;

        const localSession = localSessionsMap.get(id);
        const driveSession = driveSessionsMap.get(id);
        const driveMeta = driveMetadataMap.get(id); // Metadata from Drive listing

        let sessionToKeep: ChatSession;
        let metadataToKeep: ChatSessionMetadata;
        let needsUploadToDrive = false;
        let needsUpdateLocal = false;

        if (localSession && driveSession && driveMeta) { // Exists in both
          if (localSession.updatedAt >= driveSession.updatedAt) {
            console.log(`Sync: Local session ${id} is newer or same as Drive. Will upload to Drive.`);
            sessionToKeep = localSession;
            metadataToKeep = {
                ...localMetasFromState.find(m => m.id === id)!, // Get local meta
                isDriveSession: true, 
                driveFileId: driveSession.driveFileId || driveMeta.driveFileId, // Ensure driveFileId is from Drive
                lastMessageTimestamp: localSession.updatedAt, // Use local timestamp
            };
            needsUploadToDrive = true;
          } else { // Drive is newer
            console.log(`Sync: Drive session ${id} is newer. Updating local storage.`);
            sessionToKeep = driveSession;
            metadataToKeep = driveMeta;
            needsUpdateLocal = true;
          }
        } else if (localSession) { // Only local
          console.log(`Sync: Session ${id} is local only. Uploading to Drive.`);
          sessionToKeep = localSession;
          metadataToKeep = {
            ...localMetasFromState.find(m => m.id === id)!,
            isDriveSession: true, // Will become a drive session
            // driveFileId will be set after upload
          };
          needsUploadToDrive = true;
        } else if (driveSession && driveMeta) { // Only Drive
          console.log(`Sync: Session ${id} is Drive only. Saving to local storage.`);
          sessionToKeep = driveSession;
          metadataToKeep = driveMeta;
          needsUpdateLocal = true;
        } else {
            console.warn(`Sync: Session ${id} has inconsistent data. Skipping.`);
            continue; // Skip if data is missing
        }

        if (needsUploadToDrive) {
            const savedDriveFile = await saveSessionToDrive(currentToken, currentAppDriveFolderId, id, sessionToKeep);
            if (savedDriveFile && savedDriveFile.id) {
                metadataToKeep.driveFileId = savedDriveFile.id; // Update metadata with new/confirmed Drive ID
                metadataToKeep.lastMessageTimestamp = new Date(savedDriveFile.modifiedTime || sessionToKeep.updatedAt).getTime(); // Update timestamp from Drive
                sessionToKeep.driveFileId = savedDriveFile.id; // Update in-memory session
                
                 // Also update localStorage with the version that now has driveFileId (lean version)
                const leanSessionForLS = createLeanSession(sessionToKeep);
                try {
                    localStorage.setItem(`${chatSessionPrefixLS}${id}`, JSON.stringify(leanSessionForLS));
                } catch (e) { if (isQuotaExceededError(e)) console.error("Sync: Quota error updating LS after Drive upload.", e); else console.error("Sync: Error updating LS after Drive upload.", e); }

            } else {
                console.warn(`Sync: Failed to upload session ${id} to Drive during sync. Metadata might be incomplete.`);
                metadataToKeep.isDriveSession = false; // Mark as not a Drive session if upload failed
            }
        }
        
        if (needsUpdateLocal) {
            const leanSessionForLS = createLeanSession(sessionToKeep); // sessionToKeep is from Drive here
            try {
                localStorage.setItem(`${chatSessionPrefixLS}${id}`, JSON.stringify(leanSessionForLS));
            } catch (e) { 
                if (isQuotaExceededError(e)) {
                    console.error(`Sync: Quota error saving Drive session ${id} to local storage.`, e);
                    toast({title: "Local Storage Full", description: `Could not save session "${sessionToKeep.name}" locally from Drive.`, variant: "destructive"});
                } else {
                    console.error(`Sync: Error saving Drive session ${id} to local storage.`, e);
                }
            }
        }
        
        finalMetadataList.push(metadataToKeep);
        processedIds.add(id);
      }
      
      const dedupedFinalMetadata = deduplicateMetadata(finalMetadataList);
      localStorage.setItem(chatHistoryIndexKeyLS, JSON.stringify(dedupedFinalMetadata));
      // Instead of setting historyMetadata directly, call loadHistoryIndex to re-load from combined sources
      // This ensures all states are consistently derived.
      await loadHistoryIndex(currentToken, currentAppDriveFolderId);


      toast({ title: "Drive Sync Successful", description: "History synced with Google Drive." });
      setIsSyncing(false); return 'SUCCESS';
    } catch (error: any) {
      console.error("Error during Sync with Drive:", error);
      toast({ title: "Drive Sync Failed", description: error.message || "An unknown error occurred during sync.", variant: "destructive",});
      setIsSyncing(false); return 'FAILED';
    }
  }, [
      effectiveUserId, 
      googleAccessToken, 
      appDriveFolderId, 
      authUser, 
      toast, 
      initializeDriveFolder, 
      chatHistoryIndexKeyLS, 
      chatSessionPrefixLS, 
      historyMetadata, 
      getSession,
      loadHistoryIndex // Added loadHistoryIndex
    ]);


  return { historyMetadata, isLoading, getSession, saveSession, deleteSession, createNewSession, syncWithDrive, isSyncing, triggerGoogleSignIn: triggerGoogleSignInFromAuth };
}

