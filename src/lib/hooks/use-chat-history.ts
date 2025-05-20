
// src/lib/hooks/use-chat-history.ts
"use client";

import { useState, useEffect, useCallback } from 'react';
import type { ChatSession, ChatSessionMetadata, ChatMessage, DriveFile } from '@/lib/types';
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
    (error.code === 22 && name.includes('datacloneerror'))
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
    if (!existing || item.lastMessageTimestamp >= existing.lastMessageTimestamp) {
      // If new item is newer or same age, prefer it, especially if it has driveFileId
      // or if existing one was marked as Drive but new one also is (potential update from Drive)
      if (existing && item.driveFileId && !existing.driveFileId) {
          item.isDriveSession = true; // Ensure it's marked as drive if driveFileId is present
      } else if (existing && existing.isDriveSession && !item.driveFileId) {
          item.driveFileId = existing.driveFileId; // Preserve driveFileId if new local is newer
          item.isDriveSession = true;
      }
      map.set(item.id, item);
    } else if (existing && item.driveFileId && !existing.driveFileId) {
        // Existing is older, but current item has driveFileId (likely from Drive sync)
        // Update existing to include driveFileId and mark as Drive session
        existing.driveFileId = item.driveFileId;
        existing.isDriveSession = true;
        map.set(item.id, existing); // Keep existing (newer) data but add Drive info
    }
  }
  return Array.from(map.values()).sort((a, b) => b.lastMessageTimestamp - a.lastMessageTimestamp);
}


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

    const storedFolderId = localStorage.getItem(appDriveFolderIdLSKey);
    if (storedFolderId) {
        console.log(`useChatHistory (initializeDriveFolder): Found stored Drive folder ID: ${storedFolderId}`);
        setAppDriveFolderId(storedFolderId);
        return storedFolderId;
    }

    console.log("useChatHistory (initializeDriveFolder): Ensuring app folder exists with provided token.");
    try {
      const folderId = await ensureAppFolderExists(token);
      if (folderId) {
        setAppDriveFolderId(folderId);
        localStorage.setItem(appDriveFolderIdLSKey, folderId);
        console.log("useChatHistory (initializeDriveFolder): App Drive folder ID set and stored:", folderId);
        return folderId;
      } else {
        toast({
          title: "Google Drive Error",
          description: "Could not access or create the app folder in Google Drive.",
          variant: "destructive",
        });
        setAppDriveFolderId(null);
      }
    } catch (error: any) {
        console.error("useChatHistory (initializeDriveFolder): Error ensuring app folder exists:", error);
        toast({
          title: "Google Drive Setup Failed",
          description: `Failed to set up app folder: ${error.message}. Drive features may be unavailable.`,
          variant: "destructive",
        });
        setAppDriveFolderId(null);
    }
    return null;
  }, [toast, effectiveUserId, appDriveFolderIdLSKey]);


  const loadHistoryIndex = useCallback(async (driveFolderIdForLoad?: string | null, tokenForLoad?: string | null) => {
    if (!effectiveUserId) {
      console.warn("useChatHistory (loadHistoryIndex): No effectiveUserId, cannot load history.");
      setIsLoading(false);
      setHistoryMetadata([]);
      return;
    }
    setIsLoading(true);
    console.log(`useChatHistory (loadHistoryIndex): Loading history for user ${effectiveUserId}. HasToken: ${!!tokenForLoad}, DriveFolderID: ${driveFolderIdForLoad}`);

    let localParsedIndex: ChatSessionMetadata[] = [];
    try {
      const storedIndex = localStorage.getItem(chatHistoryIndexKeyLS);
      localParsedIndex = storedIndex ? JSON.parse(storedIndex) : [];
    } catch (error) {
      console.error("useChatHistory (loadHistoryIndex): Failed to load/parse chat history index from localStorage:", error);
    }
    
    const userSpecificLocalMetadata = localParsedIndex.filter(meta => meta && meta.id && meta.id.startsWith(effectiveUserId + '_'));
    if (userSpecificLocalMetadata.length < localParsedIndex.length && localParsedIndex.length > 0) {
      console.warn(`useChatHistory (loadHistoryIndex): Filtered out ${localParsedIndex.length - userSpecificLocalMetadata.length} sessions not for user ${effectiveUserId}. Updating LS index.`);
      try { localStorage.setItem(chatHistoryIndexKeyLS, JSON.stringify(userSpecificLocalMetadata)); }
      catch (error) { console.error("useChatHistory (loadHistoryIndex): Failed to update LS index after filtering:", error); }
    }

    const combinedMetadataMap = new Map<string, ChatSessionMetadata>();
    userSpecificLocalMetadata.forEach(meta => combinedMetadataMap.set(meta.id, {...meta, isDriveSession: meta.isDriveSession || false, driveFileId: meta.driveFileId}));
    
    if (tokenForLoad && driveFolderIdForLoad && authUser?.uid === effectiveUserId) {
      console.log("useChatHistory (loadHistoryIndex): Attempting to load from Drive. Folder:", driveFolderIdForLoad);
      const driveFiles = await listSessionFilesFromDrive(tokenForLoad, driveFolderIdForLoad);
      
      if (driveFiles) {
        const driveMetadataPromises = driveFiles.map(async (driveFile) => {
          if (!driveFile || !driveFile.name || !driveFile.id || !driveFile.name.startsWith(`session_${effectiveUserId}_`)) return null;
          const appSessionId = driveFile.name.replace(`session_`, '').replace('.json', '');
          
          const existingLocalMeta = combinedMetadataMap.get(appSessionId);
          if (existingLocalMeta && existingLocalMeta.lastMessageTimestamp >= (new Date(driveFile.modifiedTime || 0).getTime()) && existingLocalMeta.driveFileId === driveFile.id) {
            existingLocalMeta.isDriveSession = true; // Ensure marked
            combinedMetadataMap.set(appSessionId, existingLocalMeta);
            return null; 
          }
          
          const fullSession = await getSessionFromDrive(tokenForLoad, driveFile.id);
          if (fullSession && fullSession.id === appSessionId) {
            return {
              id: fullSession.id,
              name: fullSession.name || `Drive: ${new Date(fullSession.createdAt).toLocaleDateString()}`,
              lastMessageTimestamp: new Date(driveFile.modifiedTime || fullSession.updatedAt).getTime(),
              preview: getMessageTextPreview(fullSession.messages[fullSession.messages.length - 1]),
              messageCount: fullSession.messages.length,
              isDriveSession: true,
              driveFileId: driveFile.id,
            } as ChatSessionMetadata;
          }
          return null;
        });
        
        const driveMetadataEntries = (await Promise.all(driveMetadataPromises)).filter(Boolean) as ChatSessionMetadata[];
        driveMetadataEntries.forEach(driveMeta => {
            const existingMeta = combinedMetadataMap.get(driveMeta.id);
            if (existingMeta) {
                if (driveMeta.lastMessageTimestamp >= existingMeta.lastMessageTimestamp) {
                    combinedMetadataMap.set(driveMeta.id, { ...driveMeta, isDriveSession: true, driveFileId: driveMeta.driveFileId });
                } else {
                    combinedMetadataMap.set(driveMeta.id, { ...existingMeta, isDriveSession: true, driveFileId: driveMeta.driveFileId || existingMeta.driveFileId, lastMessageTimestamp: Math.max(driveMeta.lastMessageTimestamp, existingMeta.lastMessageTimestamp) });
                }
            } else {
                combinedMetadataMap.set(driveMeta.id, driveMeta);
            }
        });
      }
    }
    
    const finalDedupedAndSortedMetadata = deduplicateMetadata(Array.from(combinedMetadataMap.values()));
    setHistoryMetadata(finalDedupedAndSortedMetadata);
    console.log(`useChatHistory (loadHistoryIndex): Final history metadata count: ${finalDedupedAndSortedMetadata.length} for user ${effectiveUserId}.`);
    setIsLoading(false);
  }, [effectiveUserId, authUser?.uid, chatHistoryIndexKeyLS, toast]);


  useEffect(() => {
    const orchestrateInitialLoad = async () => {
      if (!effectiveUserId || !authUser) {
        console.warn("useChatHistory (Main Effect): No effectiveUserId or authUser, loading local only.");
        await loadHistoryIndex(null, null); // Load local history
        return;
      }
      
      setIsLoading(true);
      console.log(`useChatHistory (Main Effect): Orchestrating load for user ${effectiveUserId}. Google User: ${!!googleAccessToken}`);
      
      // Always load local history first
      await loadHistoryIndex(null, null);

      let currentFolderId: string | null = null;
      if (googleAccessToken) { // Only attempt Drive init if token is present
        console.log("useChatHistory (Main Effect): Google token available, initializing Drive folder.");
        currentFolderId = await initializeDriveFolder(googleAccessToken);
        // After initializing folder, reload history to merge Drive data
        if (currentFolderId) {
             console.log("useChatHistory (Main Effect): Drive folder initialized. Reloading history index to merge Drive data.");
             await loadHistoryIndex(currentFolderId, googleAccessToken);
        } else {
            console.warn("useChatHistory (Main Effect): Drive folder initialization failed. Only local history will be available from this load cycle.");
             // Ensure isLoading is false if Drive init fails but local load was done
             setIsLoading(false);
        }
      } else {
        console.log("useChatHistory (Main Effect): No Google access token. Local history already loaded.");
        setIsLoading(false); // Local history loaded, no Drive attempt
      }
    };

    if (!userIdFromProfile && !authUser) {
        setIsLoading(false);
        return;
    }
    orchestrateInitialLoad();
  }, [effectiveUserId, googleAccessToken, authUser, initializeDriveFolder, loadHistoryIndex, userIdFromProfile]);


  const getSession = useCallback(async (sessionId: string): Promise<ChatSession | null> => {
    if (!effectiveUserId || !sessionId.startsWith(effectiveUserId + '_')) {
        console.warn(`getSession: Attempt to load session ${sessionId} for incorrect user ${effectiveUserId}.`);
        return null;
    }

    const metadataEntry = historyMetadata.find(m => m.id === sessionId);

    if (metadataEntry?.isDriveSession && metadataEntry.driveFileId && googleAccessToken && authUser?.uid === effectiveUserId) {
        console.log(`getSession: Attempting to fetch session ${sessionId} (Drive ID: ${metadataEntry.driveFileId}) from Google Drive.`);
        const driveSession = await getSessionFromDrive(googleAccessToken, metadataEntry.driveFileId);
        if (driveSession) {
            console.log(`getSession: Successfully fetched session ${sessionId} from Drive.`);
             try { 
                localStorage.setItem(`${chatSessionPrefixLS}${sessionId}`, JSON.stringify(driveSession)); // Cache full session locally after Drive fetch
            } catch (e) { console.error("Error caching full Drive session to localStorage", e); }
            return driveSession;
        }
        console.warn(`getSession: Failed to fetch session ${sessionId} from Drive using Drive ID ${metadataEntry.driveFileId}. Trying localStorage as fallback.`);
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
        console.warn("saveSession: Attempted to save session without valid userId or session ID prefix. Session:", session, "UserId:", effectiveUserId);
        return session;
    }
    
    let sessionToUpdateInMemory = { ...session };
    sessionToUpdateInMemory.updatedAt = Date.now();

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
            console.log(`saveSession: Generated name "${nameOutput.chatName}" for session ${sessionToUpdateInMemory.id}`);
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
    
    try {
      localStorage.setItem(`${chatSessionPrefixLS}${sessionToUpdateInMemory.id}`, JSON.stringify(sessionToUpdateInMemory));
      console.log(`saveSession: Session ${sessionToUpdateInMemory.id} saved to localStorage.`);
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
      console.log(`saveSession: Attempting to save session ${sessionToUpdateInMemory.id} to Google Drive (folder: ${appDriveFolderId}).`);
      try {
        const driveFile = await saveSessionToDrive(googleAccessToken, appDriveFolderId, sessionToUpdateInMemory.id, sessionToUpdateInMemory); 
        if (driveFile && driveFile.id) {
          console.log(`saveSession: Session ${sessionToUpdateInMemory.id} saved to Drive. Drive File ID: ${driveFile.id}`);
          actualDriveFileIdFromSave = driveFile.id;
          sessionToUpdateInMemory.driveFileId = driveFile.id;
          driveSavedSuccessfully = true;
        } else {
          console.warn(`saveSession: Failed to save session ${sessionToUpdateInMemory.id} to Drive (saveSessionToDrive returned null/no ID).`);
          toast({ title: "Google Drive Sync Issue", description: "Session saved locally, but failed to sync to Google Drive this time.", variant: "default", });
        }
      } catch (driveError: any) {
        console.error(`saveSession: Error saving session ${sessionToUpdateInMemory.id} to Drive:`, driveError);
         toast({ title: "Google Drive Sync Error", description: `Session saved locally, but Drive sync failed: ${driveError.message}`, variant: "default", });
      }
    } else if (authUser && authUser.uid === effectiveUserId && !googleAccessToken) {
        console.log(`saveSession: User ${effectiveUserId} is a Google user, but no access token currently available. Skipping Drive save for session ${sessionToUpdateInMemory.id}. Will attempt on next manual sync.`);
    }


    setHistoryMetadata(prev => {
      const newMeta: ChatSessionMetadata = {
        id: sessionToUpdateInMemory.id,
        name: sessionToUpdateInMemory.name || `Chat ${new Date(sessionToUpdateInMemory.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
        lastMessageTimestamp: sessionToUpdateInMemory.updatedAt,
        preview: getMessageTextPreview(sessionToUpdateInMemory.messages[sessionToUpdateInMemory.messages.length - 1]),
        messageCount: sessionToUpdateInMemory.messages.length,
        isDriveSession: driveSavedSuccessfully || prev.find(m => m.id === sessionToUpdateInMemory.id)?.isDriveSession || false,
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
    if (!effectiveUserId || !sessionId.startsWith(effectiveUserId + '_')) return;

    const sessionMetaToDelete = historyMetadata.find(meta => meta.id === sessionId);
    let driveDeleteSucceeded = false;

    if (sessionMetaToDelete?.isDriveSession && sessionMetaToDelete.driveFileId && googleAccessToken && authUser?.uid === effectiveUserId) {
        console.log(`deleteSession: Attempting to delete session ${sessionId} (Drive ID: ${sessionMetaToDelete.driveFileId}) from Google Drive.`);
        const deleted = await deleteFileFromDrive(googleAccessToken, sessionMetaToDelete.driveFileId);
        if (deleted) {
            driveDeleteSucceeded = true;
            toast({ title: "Session Deleted from Drive", description: `Session "${sessionMetaToDelete.name || sessionId}" was also deleted from Google Drive.`});
        } else {
            toast({ title: "Drive Deletion Failed", description: `Could not delete session "${sessionMetaToDelete.name || sessionId}" from Google Drive. It has been removed locally.`, variant: "destructive"});
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
      if (!sessionMetaToDelete?.isDriveSession || !driveDeleteSucceeded) {
         if (!driveDeleteSucceeded || !sessionMetaToDelete?.isDriveSession) { // Avoid double toast if Drive delete succeeded
            toast({ title: "Session Deleted", description: `Session "${sessionMetaToDelete?.name || sessionId}" removed locally.`});
         }
      }
    } catch (error) {
      console.error(`deleteSession: Failed to delete session ${sessionId} from localStorage:`, error);
      toast({ title: "Local Deletion Error", description: `Could not delete session "${sessionMetaToDelete?.name || sessionId}" locally.`, variant: "destructive"});
    }
  }, [effectiveUserId, googleAccessToken, authUser?.uid, historyMetadata, toast, chatHistoryIndexKeyLS, chatSessionPrefixLS]);


  const createNewSession = useCallback((initialMessages: ChatMessage[] = [], modelIdForNameGeneration?: string, userApiKeyForNameGen?: string): ChatSession => {
    if (!effectiveUserId) {
        console.error("createNewSession called without an effectiveUserId.");
        const tempId = `temp_error_no_user_${Date.now()}_${Math.random().toString(36).substring(2,11)}`;
         return { id: tempId, name: 'New Chat (Error)', messages: [], createdAt: Date.now(), updatedAt: Date.now(), userId: "unknown_error_user", };
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
        toast({ title: "Sync Unavailable", description: "Please log in to sync with Google Drive.", variant: "default" });
        setIsSyncing(false); return 'FAILED';
    }
    if (authUser.uid !== effectiveUserId) {
        toast({ title: "Sync User Mismatch", description: "Cannot sync, active user differs from Google authenticated user.", variant: "destructive" });
        setIsSyncing(false); return 'FAILED';
    }
    if (!googleAccessToken) {
        console.warn("syncWithDrive: Google access token not available. Requesting re-authentication.");
        setIsSyncing(false); return 'TOKEN_REFRESH_NEEDED';
    }

    toast({ title: "Syncing with Google Drive...", description: "Please wait." });
    let currentAppDriveFolderId = appDriveFolderId;
    if (!currentAppDriveFolderId) {
        currentAppDriveFolderId = await initializeDriveFolder(googleAccessToken);
        if (!currentAppDriveFolderId) {
            toast({ title: "Drive Folder Error", description: "Could not initialize Drive folder. Sync aborted.", variant: "destructive" });
            setIsSyncing(false); return 'FAILED';
        }
    }
    
    try {
      console.log("syncWithDrive: Folder ID confirmed. Re-triggering history load for full sync effect.");
      await loadHistoryIndex(currentAppDriveFolderId, googleAccessToken);
      toast({ title: "Sync Complete", description: "History checked with Google Drive." });
      setIsSyncing(false); return 'SUCCESS';
    } catch (error: any) {
      console.error("Error during Sync with Drive (post-folder check):", error);
      toast({ title: "Sync Failed", description: error.message || "An unknown error occurred during sync.", variant: "destructive",});
      setIsSyncing(false); return 'FAILED';
    }
  }, [googleAccessToken, appDriveFolderId, authUser, effectiveUserId, toast, initializeDriveFolder, loadHistoryIndex]);


  return { historyMetadata, isLoading, getSession, saveSession, deleteSession, createNewSession, loadHistoryIndex, appDriveFolderId, initializeDriveFolder, syncWithDrive, isSyncing, triggerGoogleSignIn: triggerGoogleSignInFromAuth };
}

