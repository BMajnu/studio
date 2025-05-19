
// src/lib/hooks/use-chat-history.ts
"use client";

import { useState, useEffect, useCallback } from 'react';
import type { ChatSession, ChatSessionMetadata, ChatMessage, AttachedFile, DriveFile } from '@/lib/types';
import { DEFAULT_USER_ID, DEFAULT_MODEL_ID } from '@/lib/constants';
import { generateChatName, type GenerateChatNameInput } from '@/ai/flows/generate-chat-name-flow';
import { useAuth } from '@/contexts/auth-context';
import { ensureAppFolderExists, saveSessionToDrive, listSessionFilesFromDrive, getSessionFromDrive, deleteFileFromDrive } from '@/lib/services/drive-service';
import { useToast } from '@/hooks/use-toast';

const CHAT_HISTORY_INDEX_KEY_LS = 'desainr_chat_history_index_ls_v3';
const CHAT_SESSION_PREFIX_LS = 'desainr_chat_session_ls_v3_';

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
    (error.code === 22 && name.includes('datacloneerror')) // Safari specific?
  );
};

function deduplicateMetadata(metadataList: ChatSessionMetadata[]): ChatSessionMetadata[] {
  if (!Array.isArray(metadataList)) return [];
  const map = new Map<string, ChatSessionMetadata>();
  for (const item of metadataList) {
    if (!item || typeof item.id !== 'string') {
      console.warn("DeduplicateMetadata: Encountered invalid item:", item);
      continue;
    }
    const existing = map.get(item.id);
    if (!existing || item.lastMessageTimestamp > existing.lastMessageTimestamp) {
      map.set(item.id, item);
    }
  }
  return Array.from(map.values()).sort((a, b) => b.lastMessageTimestamp - a.lastMessageTimestamp);
}


export function useChatHistory(userIdFromProfile: string | undefined) {
  const { user: authUser, googleAccessToken } = useAuth();
  const { toast } = useToast();
  const [historyMetadata, setHistoryMetadata] = useState<ChatSessionMetadata[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [appDriveFolderId, setAppDriveFolderId] = useState<string | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);

  const effectiveUserId = authUser?.uid || userIdFromProfile || DEFAULT_USER_ID;

  const initializeDriveFolder = useCallback(async () => {
    if (googleAccessToken && authUser && !appDriveFolderId) {
      console.log("useChatHistory: Google Access Token available. Ensuring app folder exists.");
      try {
        const folderId = await ensureAppFolderExists(googleAccessToken);
        if (folderId) {
          setAppDriveFolderId(folderId);
          console.log("useChatHistory: App Drive folder ID set:", folderId);
          return folderId; // Return folderId for syncWithDrive
        } else {
          console.warn("useChatHistory: Could not obtain App Drive folder ID.");
          toast({
            title: "Google Drive Error",
            description: "Could not access or create the app folder in Google Drive. History may not be synced to Drive.",
            variant: "destructive",
          });
        }
      } catch (error: any) {
          console.error("useChatHistory: Error ensuring app folder exists:", error);
          toast({
            title: "Google Drive Setup Failed",
            description: `Failed to set up app folder in Google Drive: ${error.message}. Drive features may be unavailable.`,
            variant: "destructive",
          });
      }
    } else if (!googleAccessToken && authUser) { 
      setAppDriveFolderId(null); 
    }
    return null; // Return null if folderId couldn't be obtained
  }, [googleAccessToken, authUser, appDriveFolderId, toast, setAppDriveFolderId]);


  useEffect(() => {
    initializeDriveFolder();
  }, [initializeDriveFolder]);


  const loadHistoryIndex = useCallback(async () => {
    if (!effectiveUserId) {
        setIsLoading(false);
        setHistoryMetadata([]);
        return;
    }
    setIsLoading(true);
    
    let uniqueCombinedMetadata: ChatSessionMetadata[] = [];
    const seenIds = new Set<string>();

    // 1. Load from Drive if available
    if (googleAccessToken && appDriveFolderId && authUser?.uid === effectiveUserId) {
      console.log("useChatHistory: Attempting to load session list from Google Drive.");
      const driveFiles = await listSessionFilesFromDrive(googleAccessToken, appDriveFolderId);
      if (driveFiles) {
        for (const file of driveFiles) {
          if (!file || !file.name || !file.id) continue;
          const fileSessionId = file.name.replace('session_', '').replace('.json', '');
          if (!fileSessionId.startsWith(effectiveUserId + '_')) continue;

          if (seenIds.has(fileSessionId)) continue; 

          const fullSession = await getSessionFromDrive(googleAccessToken, file.id);
          if (fullSession) {
            uniqueCombinedMetadata.push({
              id: fullSession.id,
              name: fullSession.name || `Chat from Drive ${new Date(fullSession.createdAt).toLocaleDateString()}`,
              lastMessageTimestamp: file.modifiedTime ? new Date(file.modifiedTime).getTime() : fullSession.updatedAt,
              preview: getMessageTextPreview(fullSession.messages[fullSession.messages.length - 1]),
              messageCount: fullSession.messages.length,
              isDriveSession: true,
            });
            seenIds.add(fullSession.id);
          } else {
             console.warn(`useChatHistory (loadHistoryIndex): Could not fetch full session details for Drive file ${file.id} (${file.name}). Creating minimal metadata.`);
            uniqueCombinedMetadata.push({
              id: fileSessionId,
              name: `Drive: ${fileSessionId.substring(0,15)}... (details unavailable)`,
              lastMessageTimestamp: file.modifiedTime ? new Date(file.modifiedTime).getTime() : Date.now(),
              preview: "Session from Google Drive (details unavailable)",
              messageCount: 0, 
              isDriveSession: true,
            });
            seenIds.add(fileSessionId);
          }
        }
      } else {
        console.warn("useChatHistory: Failed to load session list from Google Drive or no files found.");
      }
    }

    // 2. Load from LocalStorage
    try {
      const storedIndex = localStorage.getItem(CHAT_HISTORY_INDEX_KEY_LS);
      const localParsedIndex: ChatSessionMetadata[] = storedIndex ? JSON.parse(storedIndex) : [];
      
      // Filter out any metadata that doesn't belong to the current effectiveUserId
      // This is a crucial step if the CHAT_HISTORY_INDEX_KEY_LS was shared or if userId changed.
      const userLocalHistoryFromStorage = localParsedIndex.filter(
        (meta) => meta && meta.id && meta.id.startsWith(effectiveUserId + '_')
      );
      if (userLocalHistoryFromStorage.length < localParsedIndex.length) {
        console.warn(
          `useChatHistory (loadHistoryIndex): Filtered out ${
            localParsedIndex.length - userLocalHistoryFromStorage.length
          } sessions from localStorage that did not belong to user ${effectiveUserId}. Updating localStorage index.`
        );
        // Persist the filtered index to localStorage to clean it up.
        try {
          localStorage.setItem(
            CHAT_HISTORY_INDEX_KEY_LS,
            JSON.stringify(userLocalHistoryFromStorage) // Save only the filtered items
          );
        } catch (error) {
          console.error(
            "useChatHistory (loadHistoryIndex): Failed to update localStorage index after filtering:",
            error
          );
        }
      }
      
      for (const localMeta of userLocalHistoryFromStorage) {
        if (!seenIds.has(localMeta.id)) {
          uniqueCombinedMetadata.push({...localMeta, isDriveSession: false});
          seenIds.add(localMeta.id);
        } else { // Session ID already seen (likely from Drive), try to merge/update
          const existingIndex = uniqueCombinedMetadata.findIndex(m => m.id === localMeta.id);
          if (existingIndex !== -1) {
            const driveMeta = uniqueCombinedMetadata[existingIndex];
             // If local is newer or Drive version was minimal (preview indicates unavailable details)
             if (localMeta.lastMessageTimestamp > driveMeta.lastMessageTimestamp || (driveMeta.preview.includes("(details unavailable)") && !localMeta.preview.includes("(details unavailable)"))) {
                uniqueCombinedMetadata[existingIndex] = {
                    ...localMeta, // Take localMeta as base
                    isDriveSession: true, // But mark it as a Drive session
                    lastMessageTimestamp: Math.max(localMeta.lastMessageTimestamp, driveMeta.lastMessageTimestamp) // Ensure newest timestamp
                };
            }
          }
        }
      }
    } catch (error) {
      console.error("Failed to load/merge chat history index from localStorage:", error);
    }
    
    const finalDedupedAndSortedMetadata = deduplicateMetadata(uniqueCombinedMetadata);
    setHistoryMetadata(finalDedupedAndSortedMetadata);
    setIsLoading(false);
  }, [effectiveUserId, googleAccessToken, appDriveFolderId, authUser]);


  useEffect(() => {
     if (effectiveUserId) {
        // Only load if user is not authenticated OR (user is authenticated AND google access token is present AND app drive folder id is set)
        // This prevents loading too early if drive folder isn't ready.
        if (!authUser || (authUser?.uid === effectiveUserId && googleAccessToken && appDriveFolderId) || (!googleAccessToken && !authUser && !userIdFromProfile)) { // Adjusted condition
            loadHistoryIndex();
        }
     }
  }, [effectiveUserId, googleAccessToken, appDriveFolderId, authUser, userIdFromProfile, loadHistoryIndex]);


  const getSession = useCallback(async (sessionId: string): Promise<ChatSession | null> => {
    if (!effectiveUserId || !sessionId.startsWith(effectiveUserId + '_')) {
        console.warn(`getSession: Attempt to load session ${sessionId} for incorrect user ${effectiveUserId}.`);
        return null;
    }

    const metadataEntry = historyMetadata.find(m => m.id === sessionId);

    if (metadataEntry?.isDriveSession && googleAccessToken && appDriveFolderId) {
        console.log(`getSession: Attempting to fetch session ${sessionId} from Google Drive.`);
        const driveFiles = await listSessionFilesFromDrive(googleAccessToken, appDriveFolderId);
        const targetDriveFile = driveFiles?.find(f => f.name === `session_${sessionId}.json`);

        if (targetDriveFile?.id) {
            const driveSession = await getSessionFromDrive(googleAccessToken, targetDriveFile.id);
            if (driveSession) {
                try {
                    // Optionally cache to localStorage after fetching from Drive for faster subsequent access
                    localStorage.setItem(`${CHAT_SESSION_PREFIX_LS}${sessionId}`, JSON.stringify(driveSession));
                } catch (e) { console.error("Error caching Drive session to localStorage", e); }
                return driveSession;
            }
            console.warn(`getSession: Failed to fetch session ${sessionId} from Drive using file ID ${targetDriveFile.id}, trying localStorage fallback.`);
        } else {
             console.warn(`getSession: Could not find Drive file ID for session ${sessionId} name. Trying localStorage fallback.`);
        }
    }

    // Fallback to localStorage if Drive fetch fails or not applicable
    try {
      const storedSession = localStorage.getItem(`${CHAT_SESSION_PREFIX_LS}${sessionId}`);
      return storedSession ? JSON.parse(storedSession) : null;
    } catch (error) {
      console.error(`Failed to load session ${sessionId} from localStorage:`, error);
      return null;
    }
  }, [effectiveUserId, googleAccessToken, appDriveFolderId, historyMetadata]);

  const saveSession = useCallback(async (
    session: ChatSession,
    attemptNameGeneration: boolean = false,
    modelIdForNameGeneration?: string,
    userApiKeyForNameGeneration?: string,
  ): Promise<ChatSession> => {
    if (!effectiveUserId || !session || !session.id.startsWith(effectiveUserId + '_')) {
        console.warn("Attempted to save session without valid userId or session ID prefix. Session:", session, "UserId:", effectiveUserId);
        return session; // Return original session if invalid to prevent further issues
    }
    
    let sessionToUpdateInMemory = { ...session };
    sessionToUpdateInMemory.updatedAt = Date.now();

    if (attemptNameGeneration && sessionToUpdateInMemory.messages.length > 0 && sessionToUpdateInMemory.name === "New Chat") {
      const firstUserMsg = sessionToUpdateInMemory.messages.find(m => m.role === 'user');
      const firstAssistantMsg = sessionToUpdateInMemory.messages.find(m => m.role === 'assistant');
      
      if (firstUserMsg) {
        try {
          const nameInput: GenerateChatNameInput = {
            firstUserMessage: getMessageTextPreview(firstUserMsg) || "Chat conversation",
            firstAssistantMessage: getMessageTextPreview(firstAssistantMsg),
            modelId: modelIdForNameGeneration || DEFAULT_MODEL_ID,
            userApiKey: userApiKeyForNameGeneration,
          };
          const nameOutput = await generateChatName(nameInput);
          if (nameOutput.chatName) {
            sessionToUpdateInMemory.name = nameOutput.chatName;
          }
        } catch (nameGenError: any) {
          console.error("Failed to generate chat name:", nameGenError);
          if (sessionToUpdateInMemory.name === "New Chat") { // Still "New Chat" after error
             const date = new Date(sessionToUpdateInMemory.createdAt);
             sessionToUpdateInMemory.name = `Chat ${date.toLocaleDateString()} ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
          }
        }
      } else if (sessionToUpdateInMemory.name === "New Chat") { // No user message, but name is "New Chat"
          const date = new Date(sessionToUpdateInMemory.createdAt);
          sessionToUpdateInMemory.name = `Chat ${date.toLocaleDateString()} ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
      }
    }
    
    // Create a "lean" version for localStorage to save space
    const sessionForLocalStorage: ChatSession = {
      ...sessionToUpdateInMemory,
      messages: sessionToUpdateInMemory.messages.map(msg => {
        if (msg.attachedFiles && msg.attachedFiles.length > 0) {
          return {
            ...msg,
            attachedFiles: msg.attachedFiles.map(file => {
              // Create a lean file object: remove dataUri, truncate textContent
              const leanFile: AttachedFile = {
                name: file.name,
                type: file.type,
                size: file.size,
                textContent: file.textContent ? file.textContent.substring(0, 500) + (file.textContent.length > 500 ? '...' : '') : undefined,
                dataUri: undefined, // Explicitly remove dataUri for localStorage
              };
              return leanFile;
            })
          };
        }
        return msg;
      })
    };

    try {
      localStorage.setItem(`${CHAT_SESSION_PREFIX_LS}${sessionForLocalStorage.id}`, JSON.stringify(sessionForLocalStorage));
    } catch (error) {
      if (isQuotaExceededError(error)) {
        console.error(`Failed to save session ${sessionForLocalStorage.id} to localStorage due to quota exceeded.`, error);
         toast({
          title: "Local Storage Full",
          description: "Could not save chat session locally. Storage quota exceeded.",
          variant: "destructive",
        });
      } else {
        console.error(`Failed to save session ${sessionForLocalStorage.id} to localStorage:`, error);
        toast({
          title: "Local Save Error",
          description: "Could not save chat session locally.",
          variant: "destructive",
        });
      }
      // Do not return early, still attempt Drive save if applicable
    }

    let driveSavedSuccessfully = false;
    if (googleAccessToken && appDriveFolderId && authUser && authUser.uid === effectiveUserId) {
      console.log(`useChatHistory: Attempting to save session ${sessionToUpdateInMemory.id} to Google Drive.`);
      try {
        // For Drive, save the full sessionToUpdateInMemory, not the lean one
        const driveFile = await saveSessionToDrive(googleAccessToken, appDriveFolderId, sessionToUpdateInMemory.id, sessionToUpdateInMemory); 
        if (driveFile) {
          console.log(`useChatHistory: Session ${sessionToUpdateInMemory.id} saved to Drive. File ID: ${driveFile.id}`);
          driveSavedSuccessfully = true;
        } else {
          console.warn(`useChatHistory: Failed to save session ${sessionToUpdateInMemory.id} to Drive (saveSessionToDrive returned null).`);
           toast({
            title: "Google Drive Sync Issue",
            description: "Session was saved locally, but failed to sync to Google Drive.",
            variant: "default", // Changed to default as local save might have worked
          });
        }
      } catch (driveError: any) {
        console.error(`useChatHistory: Error saving session ${sessionToUpdateInMemory.id} to Drive:`, driveError);
         toast({
            title: "Google Drive Sync Failed",
            description: `Session saved locally, but Drive sync failed: ${driveError.message}`,
            variant: "default", // Changed to default
        });
      }
    }

    setHistoryMetadata(prev => {
      const newMeta: ChatSessionMetadata = {
        id: sessionToUpdateInMemory.id,
        name: sessionToUpdateInMemory.name || `Chat ${new Date(sessionToUpdateInMemory.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`, // Fallback name
        lastMessageTimestamp: sessionToUpdateInMemory.updatedAt,
        preview: getMessageTextPreview(sessionToUpdateInMemory.messages[sessionToUpdateInMemory.messages.length - 1]),
        messageCount: sessionToUpdateInMemory.messages.length,
        isDriveSession: driveSavedSuccessfully || prev.find(m => m.id === sessionToUpdateInMemory.id)?.isDriveSession || false,
      };

      const otherMeta = prev.filter(meta => meta.id !== sessionToUpdateInMemory.id);
      const updatedFullHistory = deduplicateMetadata([newMeta, ...otherMeta]);
      
      try {
        localStorage.setItem(CHAT_HISTORY_INDEX_KEY_LS, JSON.stringify(updatedFullHistory));
      } catch (error) {
         if (isQuotaExceededError(error)) {
            console.error("Failed to save chat history index to localStorage due to quota exceeded.", error);
          } else {
            console.error("Failed to save chat history index to localStorage:", error);
          }
      }
      return updatedFullHistory;
    });
    return sessionToUpdateInMemory;
  }, [effectiveUserId, googleAccessToken, appDriveFolderId, authUser, toast, setHistoryMetadata]);


  const deleteSession = useCallback(async (sessionId: string) => {
    if (!effectiveUserId || !sessionId.startsWith(effectiveUserId + '_')) return;

    const sessionMetaToDelete = historyMetadata.find(meta => meta.id === sessionId);
    let driveDeleteSuccess = false;

    if (sessionMetaToDelete?.isDriveSession && googleAccessToken && appDriveFolderId && authUser?.uid === effectiveUserId) {
        console.log(`Attempting to delete session ${sessionId} from Google Drive.`);
        const driveFiles = await listSessionFilesFromDrive(googleAccessToken, appDriveFolderId);
        const targetDriveFile = driveFiles?.find(f => f.name === `session_${sessionId}.json`);

        if (targetDriveFile?.id) {
            driveDeleteSuccess = await deleteFileFromDrive(googleAccessToken, targetDriveFile.id);
            if (driveDeleteSuccess) {
                toast({ title: "Session Deleted", description: `Session "${sessionMetaToDelete.name}" was also deleted from Google Drive.`});
            } else {
                toast({ title: "Drive Deletion Failed", description: `Could not delete session "${sessionMetaToDelete.name}" from Google Drive. It has been removed locally.`, variant: "destructive"});
            }
        } else {
            console.warn(`Could not find session file for ${sessionId} on Google Drive to delete.`);
            // Proceed with local deletion anyway
        }
    }

    try {
      localStorage.removeItem(`${CHAT_SESSION_PREFIX_LS}${sessionId}`);
      setHistoryMetadata(prev => {
        const updatedHistory = prev.filter(meta => meta.id !== sessionId);
        const finalHistory = deduplicateMetadata(updatedHistory);
        try {
          localStorage.setItem(CHAT_HISTORY_INDEX_KEY_LS, JSON.stringify(finalHistory));
        } catch (error) {
           if (isQuotaExceededError(error)) {
              console.error("Failed to update chat history index (localStorage) after deletion due to quota exceeded.", error);
            } else {
              console.error("Failed to update chat history index (localStorage) after deletion:", error);
            }
        }
        return finalHistory;
      });
      if (!sessionMetaToDelete?.isDriveSession || !googleAccessToken || !driveDeleteSuccess) { 
        toast({ title: "Session Deleted", description: `Session "${sessionMetaToDelete?.name || sessionId}" removed locally.`});
      }
    } catch (error) {
      console.error(`Failed to delete session ${sessionId} from localStorage:`, error);
      toast({ title: "Local Deletion Error", description: `Could not delete session "${sessionMetaToDelete?.name || sessionId}" locally.`, variant: "destructive"});
    }
  }, [effectiveUserId, googleAccessToken, appDriveFolderId, authUser, historyMetadata, toast, setHistoryMetadata]);


  const createNewSession = useCallback((initialMessages: ChatMessage[] = [], modelIdForNameGeneration?: string, userApiKeyForNameGen?: string): ChatSession => {
    if (!effectiveUserId) {
        console.error("createNewSession called without an effectiveUserId. This should not happen.");
        // Create a temporary session that won't be saved, to avoid app crash
        const tempId = `temp_error_no_user_${Date.now()}_${Math.random().toString(36).substring(2,11)}`;
         return {
          id: tempId,
          name: 'New Chat (Error - No User)',
          messages: [],
          createdAt: Date.now(),
          updatedAt: Date.now(),
          userId: "unknown_error_user", // Indicate an error state
        };
    }
    const newSessionId = `${effectiveUserId}_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
    const now = Date.now();
    const newSession: ChatSession = {
      id: newSessionId,
      name: 'New Chat', // Default name, will be updated by AI if successful
      messages: initialMessages,
      createdAt: now,
      updatedAt: now,
      userId: effectiveUserId, // Ensure this is set
    };
    
    // Asynchronously save the session. Don't await here as it's for creation.
    saveSession(newSession, true, modelIdForNameGeneration || DEFAULT_MODEL_ID, userApiKeyForNameGen); 
    return newSession;
  }, [effectiveUserId, saveSession]);


  const syncWithDrive = useCallback(async () => {
    if (!authUser || !googleAccessToken) {
        toast({ title: "Sync Unavailable", description: "Please log in with Google to sync.", variant: "default" });
        setIsSyncing(false);
        return;
    }
    if (authUser.uid !== effectiveUserId) {
        toast({ title: "Sync User Mismatch", description: "Cannot sync, active user differs from Google authenticated user.", variant: "destructive" });
        setIsSyncing(false);
        return;
    }

    setIsSyncing(true);
    toast({ title: "Syncing with Google Drive...", description: "Please wait." });

    let currentAppDriveFolderId = appDriveFolderId;
    if (!currentAppDriveFolderId) {
        try {
            const folderId = await initializeDriveFolder(); // Ensure folder is initialized
            if (folderId) {
                currentAppDriveFolderId = folderId; // Update for current sync operation
            } else {
                throw new Error("Failed to ensure Drive app folder exists during sync attempt.");
            }
        } catch (error: any) {
            toast({ title: "Drive Folder Error", description: `Could not initialize Drive folder: ${error.message || 'Unknown error'}. Sync aborted.`, variant: "destructive" });
            setIsSyncing(false);
            return;
        }
    }
    if (!currentAppDriveFolderId) { // Check again after attempt
       toast({ title: "Drive Folder Error", description: "App Drive folder ID is still not available. Sync aborted.", variant: "destructive" });
       setIsSyncing(false);
       return;
    }
    
    try {
      const driveFiles = await listSessionFilesFromDrive(googleAccessToken, currentAppDriveFolderId);
      if (driveFiles === null) { // Explicitly check for null if listSessionFilesFromDrive can return it
        throw new Error("Failed to list session files from Google Drive. Received null.");
      }

      const driveMetadataMap = new Map<string, ChatSessionMetadata>();
      const driveSessionDataMap = new Map<string, ChatSession>();

      for (const file of driveFiles) {
        if (!file || !file.name || !file.id) continue;
        const fileSessionId = file.name.replace('session_', '').replace('.json', '');
        if (!fileSessionId.startsWith(effectiveUserId + '_')) continue; // Ensure it's for the current user
        
        const fullSession = await getSessionFromDrive(googleAccessToken, file.id);
        if (fullSession) {
            driveSessionDataMap.set(fullSession.id, fullSession); // Store full session data
            driveMetadataMap.set(fullSession.id, {
                id: fullSession.id,
                name: fullSession.name || `Unnamed Drive Session ${new Date(fullSession.createdAt).toLocaleDateString()}`,
                lastMessageTimestamp: file.modifiedTime ? new Date(file.modifiedTime).getTime() : fullSession.updatedAt,
                preview: getMessageTextPreview(fullSession.messages[fullSession.messages.length - 1]),
                messageCount: fullSession.messages.length,
                isDriveSession: true,
            });
        } else { // Minimal metadata if full session fetch fails
             driveMetadataMap.set(fileSessionId, {
                id: fileSessionId,
                name: `Drive: ${fileSessionId.substring(0,15)}... (fetch error)`,
                lastMessageTimestamp: file.modifiedTime ? new Date(file.modifiedTime).getTime() : Date.now(),
                preview: "Error fetching details from Drive",
                messageCount: 0,
                isDriveSession: true,
            });
        }
      }
      
      // Get local history index (already filtered for current user by loadHistoryIndex's cleanup)
      const localIndexString = localStorage.getItem(CHAT_HISTORY_INDEX_KEY_LS);
      const localIndex: ChatSessionMetadata[] = localIndexString ? JSON.parse(localIndexString) : [];
      const userLocalHistory = localIndex.filter(meta => meta && meta.id && meta.id.startsWith(effectiveUserId + '_')); // Redundant if loadHistoryIndex cleaned up well
      const dedupedUserLocalHistory = deduplicateMetadata(userLocalHistory); 

      let mergedMetadata: ChatSessionMetadata[] = Array.from(driveMetadataMap.values());
      
      for (const localMeta of dedupedUserLocalHistory) {
        const driveVersionMeta = driveMetadataMap.get(localMeta.id);
        const existingMergedIndex = mergedMetadata.findIndex(m => m.id === localMeta.id);

        if (driveVersionMeta) { // Exists on Drive and Local
          if (existingMergedIndex !== -1) {
            const localSessionData = await getSession(localMeta.id); // Fetch full local session
            const driveSessionData = driveSessionDataMap.get(localMeta.id);

            if (localSessionData && driveSessionData) {
              if (localSessionData.updatedAt > driveSessionData.updatedAt) {
                // Local is newer, update merged entry and upload local to Drive
                mergedMetadata[existingMergedIndex] = { ...localMeta, isDriveSession: true, lastMessageTimestamp: localSessionData.updatedAt };
                await saveSessionToDrive(googleAccessToken, currentAppDriveFolderId, localSessionData.id, localSessionData);
              } else if (driveSessionData.updatedAt > localSessionData.updatedAt) {
                // Drive is newer, update local storage with Drive's version
                localStorage.setItem(`${CHAT_SESSION_PREFIX_LS}${driveSessionData.id}`, JSON.stringify(driveSessionData));
                 mergedMetadata[existingMergedIndex] = driveVersionMeta; // Ensure mergedMeta has Drive's info
              } else {
                // Timestamps equal, prefer local if its name/preview is more complete than a placeholder Drive one
                if ((driveVersionMeta.name.includes("(fetch error)") || driveVersionMeta.preview.includes("Error fetching details")) && 
                    (!localMeta.name.includes("(fetch error)") && !localMeta.preview.includes("Error fetching details"))) {
                   mergedMetadata[existingMergedIndex] = { ...localMeta, isDriveSession: true, lastMessageTimestamp: localMeta.lastMessageTimestamp };
                   // Optionally re-save to Drive if local is better but Drive was placeholder
                   await saveSessionToDrive(googleAccessToken, currentAppDriveFolderId, localSessionData.id, localSessionData);
                }
                // Otherwise, assume Drive's metadata is fine or they are equivalent
              }
            }
          }
        } else { // Exists only in Local storage, needs to be uploaded
          const fullLocalSession = await getSession(localMeta.id);
          if (fullLocalSession) {
            const savedDriveFile = await saveSessionToDrive(googleAccessToken, currentAppDriveFolderId, fullLocalSession.id, fullLocalSession);
            if (savedDriveFile) { 
                mergedMetadata.push({ ...localMeta, isDriveSession: true }); // Add as a drive session
            } else {
                 mergedMetadata.push({ ...localMeta, isDriveSession: false }); // Keep as local if drive save failed
            }
          } else {
             mergedMetadata.push({ ...localMeta, isDriveSession: false }); // Keep as local if full session couldn't be read
          }
        }
      }
      
      const finalHistory = deduplicateMetadata(mergedMetadata);
      localStorage.setItem(CHAT_HISTORY_INDEX_KEY_LS, JSON.stringify(finalHistory));
      setHistoryMetadata(finalHistory);

      toast({ title: "Sync Complete", description: `Synced with Google Drive. ${finalHistory.length} sessions processed.` });
      
    } catch (error: any) {
      console.error("Error during Sync with Drive:", error);
      toast({
        title: "Sync Failed",
        description: error.message || "An unknown error occurred during sync.",
        variant: "destructive",
      });
    } finally {
      setIsSyncing(false);
    }
  }, [googleAccessToken, appDriveFolderId, authUser, effectiveUserId, toast, setHistoryMetadata, getSession, initializeDriveFolder, setAppDriveFolderId, saveSession]);


  return { historyMetadata, isLoading, getSession, saveSession, deleteSession, createNewSession, loadHistoryIndex, appDriveFolderId, initializeDriveFolder, syncWithDrive, isSyncing };
}

    
