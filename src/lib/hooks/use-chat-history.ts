
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
  if (!Array.isArray(metadataList) || metadataList.length === 0) return [];
  const map = new Map<string, ChatSessionMetadata>();
  for (const item of metadataList) {
    if (!item || typeof item.id !== 'string') {
      console.warn("DeduplicateMetadata: Encountered invalid item:", item);
      continue;
    }
    const existing = map.get(item.id);
    if (!existing || item.lastMessageTimestamp >= existing.lastMessageTimestamp) {
      // If new item is newer or same age, prefer it.
      // Prioritize keeping Drive information if one has it and the other doesn't,
      // or if both are Drive and this one is newer.
      if (existing) {
          item.isDriveSession = item.isDriveSession || existing.isDriveSession;
          item.driveFileId = item.driveFileId || existing.driveFileId;
      }
      map.set(item.id, item);
    } else { // existing is newer
        existing.isDriveSession = existing.isDriveSession || item.isDriveSession;
        existing.driveFileId = existing.driveFileId || item.driveFileId;
        map.set(item.id, existing);
    }
  }
  return Array.from(map.values()).sort((a, b) => b.lastMessageTimestamp - a.lastMessageTimestamp);
}


export function useChatHistory(userIdFromProfile: string | undefined) {
  const { user: authUser, googleAccessToken, signInWithGoogle: triggerGoogleSignInFromAuth } = useAuth();
  const { toast } = useToast();
  const [historyMetadata, setHistoryMetadata] = useState<ChatSessionMetadata[]>([]);
  const [isLoading, setIsLoading] = useState(true); // True initially until local history is loaded
  const [appDriveFolderId, setAppDriveFolderId] = useState<string | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);

  const effectiveUserId = authUser?.uid || userIdFromProfile || DEFAULT_USER_ID;
  const chatHistoryIndexKeyLS = `${CHAT_HISTORY_INDEX_KEY_LS_PREFIX}${effectiveUserId}`;
  const chatSessionPrefixLS = `${CHAT_SESSION_PREFIX_LS_PREFIX}${effectiveUserId}_`;
  const appDriveFolderIdLSKey = `${APP_DRIVE_FOLDER_ID_LS_PREFIX}${effectiveUserId}`;


  const loadLocalHistoryMetadata = useCallback(() => {
    if (!effectiveUserId) {
        console.log("useChatHistory (loadLocalHistoryMetadata): No effectiveUserId, cannot load local history.");
        setHistoryMetadata([]);
        setIsLoading(false);
        return []; // Return empty array if no user
    }
    console.log(`useChatHistory (loadLocalHistoryMetadata): Loading local history for user ${effectiveUserId}.`);
    setIsLoading(true); // Set loading true at the start of this specific operation
    try {
      const storedIndex = localStorage.getItem(chatHistoryIndexKeyLS);
      const localParsedIndex = storedIndex ? JSON.parse(storedIndex) : [];
      let userSpecificLocalMetadata: ChatSessionMetadata[] = [];

      if (Array.isArray(localParsedIndex)) {
          userSpecificLocalMetadata = localParsedIndex.filter((meta): meta is ChatSessionMetadata => 
              meta && typeof meta.id === 'string' && meta.id.startsWith(effectiveUserId + '_') &&
              typeof meta.name === 'string' && // Ensure name is a string
              typeof meta.lastMessageTimestamp === 'number' &&
              typeof meta.preview === 'string' &&
              typeof meta.messageCount === 'number'
          );
      }
      
      if (userSpecificLocalMetadata.length < localParsedIndex.length && localParsedIndex.length > 0) {
        console.warn(`useChatHistory (loadLocalHistoryMetadata): Filtered out ${localParsedIndex.length - userSpecificLocalMetadata.length} invalid or non-user sessions. Updating LS index.`);
        localStorage.setItem(chatHistoryIndexKeyLS, JSON.stringify(userSpecificLocalMetadata));
      }
      const finalMetadata = deduplicateMetadata(userSpecificLocalMetadata);
      setHistoryMetadata(finalMetadata);
      console.log(`useChatHistory (loadLocalHistoryMetadata): Loaded ${finalMetadata.length} local sessions for ${effectiveUserId}.`);
      setIsLoading(false); // Set loading false after local history is processed
      return finalMetadata;
    } catch (error) {
      console.error("useChatHistory (loadLocalHistoryMetadata): Failed to load/parse local chat history index:", error);
      setHistoryMetadata([]);
      setIsLoading(false);
      return [];
    }
  }, [effectiveUserId, chatHistoryIndexKeyLS]);

  // Effect to load local history as soon as effectiveUserId is available
  useEffect(() => {
    if (effectiveUserId) {
        console.log(`useChatHistory: effectiveUserId is now '${effectiveUserId}'. Triggering local history load.`);
        loadLocalHistoryMetadata();
    } else {
        // This case handles when user logs out or userIdFromProfile is undefined
        console.log("useChatHistory: effectiveUserId is null/undefined. Clearing history metadata.");
        setHistoryMetadata([]);
        setIsLoading(false); // Ensure loading is false if no user
    }
  }, [effectiveUserId, loadLocalHistoryMetadata]);


  const initializeDriveFolder = useCallback(async (token: string): Promise<string | null> => {
    if (!token || !effectiveUserId) {
      console.warn("useChatHistory (initializeDriveFolder): No Google access token or effectiveUserId.");
      setAppDriveFolderId(null);
      return null;
    }

    const cachedFolderId = localStorage.getItem(appDriveFolderIdLSKey);
    if (cachedFolderId) {
        console.log(`useChatHistory (initializeDriveFolder): Using cached Drive folder ID for user ${effectiveUserId}: ${cachedFolderId}`);
        setAppDriveFolderId(cachedFolderId);
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

  // Effect to initialize Drive folder if token is available and folderId isn't already known
  useEffect(() => {
    const initDrive = async () => {
      if (authUser && googleAccessToken && !appDriveFolderId) {
        console.log("useChatHistory: Google token available, no appDriveFolderId. Initializing Drive folder.");
        await initializeDriveFolder(googleAccessToken);
      }
    };
    initDrive();
  }, [authUser, googleAccessToken, appDriveFolderId, initializeDriveFolder]);


  const getSession = useCallback(async (sessionId: string): Promise<ChatSession | null> => {
    if (!effectiveUserId || !sessionId.startsWith(effectiveUserId + '_')) {
        console.warn(`getSession: Attempt to load session ${sessionId} for incorrect user context (current: ${effectiveUserId}).`);
        return null;
    }
    
    const metadataEntry = historyMetadata.find(m => m.id === sessionId);

    // Try Drive first if indicated and possible
    if (metadataEntry?.isDriveSession && metadataEntry.driveFileId && googleAccessToken && appDriveFolderId && authUser?.uid === effectiveUserId) {
        console.log(`getSession: Attempting to fetch session ${sessionId} (Drive ID: ${metadataEntry.driveFileId}) from Google Drive.`);
        const driveSession = await getSessionFromDrive(googleAccessToken, metadataEntry.driveFileId);
        if (driveSession) {
            console.log(`getSession: Successfully fetched session ${sessionId} from Drive.`);
            driveSession.driveFileId = metadataEntry.driveFileId; // Ensure it has the driveFileId
            try { // Update local cache with fresh Drive data
                localStorage.setItem(`${chatSessionPrefixLS}${sessionId}`, JSON.stringify(driveSession));
            } catch (e) { console.error("Error caching full Drive session to localStorage", e); }
            return driveSession;
        }
        console.warn(`getSession: Failed to fetch session ${sessionId} from Drive. Falling back to localStorage.`);
    }

    // Fallback to localStorage
    console.log(`getSession: Attempting to fetch session ${sessionId} from localStorage.`);
    try {
      const storedSession = localStorage.getItem(`${chatSessionPrefixLS}${sessionId}`);
      if (storedSession) {
        const parsedSession: ChatSession = JSON.parse(storedSession);
         // Ensure driveFileId from metadata is on the loaded session if it's a drive session
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
  }, [effectiveUserId, googleAccessToken, appDriveFolderId, historyMetadata, authUser?.uid, chatSessionPrefixLS]);


  const saveSession = useCallback(async (
    session: ChatSession,
    attemptNameGeneration: boolean = false,
    modelIdForNameGeneration?: string,
    userApiKeyForNameGeneration?: string,
  ): Promise<ChatSession> => {
    if (!effectiveUserId || !session || !session.id.startsWith(effectiveUserId + '_')) {
        console.warn("saveSession: Attempted to save session without valid userId or session ID prefix. Session ID:", session?.id, "Effective UserID:", effectiveUserId);
        return session; // Return original session if user ID mismatch or session is invalid
    }
    
    let sessionToUpdateInMemory = { ...session };
    sessionToUpdateInMemory.updatedAt = Date.now();
    sessionToUpdateInMemory.userId = effectiveUserId; // Ensure userId is correct

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
          if (sessionToUpdateInMemory.name === "New Chat" || !sessionToUpdateInMemory.name) { // Fallback name if generation fails
             const date = new Date(sessionToUpdateInMemory.createdAt);
             sessionToUpdateInMemory.name = `Chat ${date.toLocaleDateString()} ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
          }
        }
      } else if (sessionToUpdateInMemory.name === "New Chat" || !sessionToUpdateInMemory.name) { // Fallback name if no user message
          const date = new Date(sessionToUpdateInMemory.createdAt);
          sessionToUpdateInMemory.name = `Chat ${date.toLocaleDateString()} ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
      }
    }
    
    // Prepare a lean version for localStorage by removing dataUris
    const leanMessages = sessionToUpdateInMemory.messages.map(msg => {
        if (msg.attachedFiles && msg.attachedFiles.some(f => f.dataUri)) {
            return {
                ...msg,
                attachedFiles: msg.attachedFiles.map(f => {
                    const { dataUri, textContent, ...rest } = f; // Remove dataUri
                    const leanFile: AttachedFile = {...rest};
                    if (textContent && textContent.length > 500) { // Truncate textContent too
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
    const leanSessionForLocalStorage = { ...sessionToUpdateInMemory, messages: leanMessages };

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

    // Attempt to save to Google Drive if conditions are met (background sync)
    let driveSavedSuccessfully = false;
    let actualDriveFileIdFromSave: string | undefined = sessionToUpdateInMemory.driveFileId;

    if (googleAccessToken && appDriveFolderId && authUser && authUser.uid === effectiveUserId) {
      console.log(`saveSession: Attempting background save of session ${sessionToUpdateInMemory.id} to Google Drive (folder: ${appDriveFolderId}).`);
      try {
        // Full session data (not lean) is saved to Drive
        const driveFile = await saveSessionToDrive(googleAccessToken, appDriveFolderId, sessionToUpdateInMemory.id, sessionToUpdateInMemory); 
        if (driveFile && driveFile.id) {
          console.log(`saveSession: Session ${sessionToUpdateInMemory.id} saved to Drive. Drive File ID: ${driveFile.id}`);
          actualDriveFileIdFromSave = driveFile.id;
          sessionToUpdateInMemory.driveFileId = driveFile.id; // Update in-memory session with Drive ID
          driveSavedSuccessfully = true;
        } else {
          console.warn(`saveSession: Background save to Drive failed for session ${sessionToUpdateInMemory.id} (saveSessionToDrive returned null/no ID).`);
          // No user toast here for background failures, to keep UI clean.
        }
      } catch (driveError: any) {
        console.error(`saveSession: Error during background save of session ${sessionToUpdateInMemory.id} to Drive:`, driveError);
        // No user toast for background failures.
      }
    } else if (authUser && authUser.uid === effectiveUserId && !googleAccessToken) {
        console.log(`saveSession: Google user, but no access token. Skipping background Drive save for ${sessionToUpdateInMemory.id}. Will sync on next manual 'Sync' action.`);
    }


    // Update history metadata state
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
    return sessionToUpdateInMemory; // Return the potentially name-updated session
  }, [effectiveUserId, googleAccessToken, appDriveFolderId, authUser, toast, chatHistoryIndexKeyLS, chatSessionPrefixLS, loadLocalHistoryMetadata]); // Added loadLocalHistoryMetadata


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
      if (!sessionMetaToDelete?.isDriveSession || !driveDeleteSucceeded) {
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
        // Fallback to a temporary ID if absolutely necessary, though this indicates a deeper issue.
        const tempId = `error_no_user_${Date.now()}_${Math.random().toString(36).substring(2,11)}`;
         return { id: tempId, name: 'New Chat (Error)', messages: [], createdAt: Date.now(), updatedAt: Date.now(), userId: "unknown_user", };
    }
    const newSessionId = `${effectiveUserId}_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
    const now = Date.now();
    const newSession: ChatSession = {
      id: newSessionId, name: 'New Chat', messages: initialMessages, createdAt: now, updatedAt: now, userId: effectiveUserId,
    };
    // Save session (which also updates metadata)
    // The name generation will happen within saveSession if attemptNameGeneration is true
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
        setIsSyncing(false); // Set to false before returning, so button is not disabled
        return 'TOKEN_REFRESH_NEEDED';
    }

    let currentFolderId = appDriveFolderId;
    if (!currentFolderId) {
        currentFolderId = await initializeDriveFolder(currentToken);
        if (!currentFolderId) {
            toast({ title: "Drive Folder Error", description: "Could not initialize Drive folder. Sync aborted.", variant: "destructive" });
            setIsSyncing(false); return 'FAILED';
        }
    }
    
    toast({ title: "Syncing with Google Drive...", description: "Please wait. This may take a moment." });
    try {
      // 1. Get current local sessions' metadata & full data
      const localMetas = loadLocalHistoryMetadata(); // This gets from LS, not current state
      const localSessionsPromises = localMetas.map(meta => getSession(meta.id));
      const localSessionsArray = (await Promise.all(localSessionsPromises)).filter(Boolean) as ChatSession[];
      const localSessionsMap = new Map(localSessionsArray.map(s => [s.id, s]));

      // 2. Get Drive sessions' metadata (file list)
      const driveFiles = await listSessionFilesFromDrive(currentToken, currentFolderId);
      const driveSessionsMap = new Map<string, ChatSession>();
      const driveMetadataMap = new Map<string, ChatSessionMetadata>();

      if (driveFiles) {
        for (const driveFile of driveFiles) {
          if (!driveFile.name || !driveFile.id || !driveFile.name.startsWith(`session_${effectiveUserId}_`)) continue;
          const appSessionId = driveFile.name.replace(`session_`, '').replace('.json', '');
          
          const fullDriveSession = await getSessionFromDrive(currentToken, driveFile.id);
          if (fullDriveSession) {
            fullDriveSession.driveFileId = driveFile.id; // Ensure driveFileId is set
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

      // 3. Merge Logic
      const allKnownIds = new Set([...localSessionsMap.keys(), ...driveSessionsMap.keys()]);
      const finalMetadataList: ChatSessionMetadata[] = [];

      for (const id of allKnownIds) {
        const local = localSessionsMap.get(id);
        const drive = driveSessionsMap.get(id);
        const driveMetaFromMap = driveMetadataMap.get(id);

        if (local && drive) { // Exists in both
          if (local.updatedAt >= drive.updatedAt) { // Local is newer or same
            console.log(`Sync: Local session ${id} is newer/same. Uploading to Drive.`);
            await saveSessionToDrive(currentToken, currentFolderId, id, local);
            finalMetadataList.push({ ...localMetas.find(m => m.id === id)!, isDriveSession: true, driveFileId: drive.driveFileId || driveMetaFromMap?.driveFileId });
          } else { // Drive is newer
            console.log(`Sync: Drive session ${id} is newer. Updating local storage.`);
            localStorage.setItem(`${chatSessionPrefixLS}${id}`, JSON.stringify(drive));
            finalMetadataList.push(driveMetaFromMap!);
          }
        } else if (local) { // Only local
          console.log(`Sync: Session ${id} is local only. Uploading to Drive.`);
          const savedDriveFile = await saveSessionToDrive(currentToken, currentFolderId, id, local);
          finalMetadataList.push({ ...localMetas.find(m => m.id === id)!, isDriveSession: true, driveFileId: savedDriveFile?.id });
        } else if (drive && driveMetaFromMap) { // Only Drive
          console.log(`Sync: Session ${id} is Drive only. Saving to local storage.`);
          localStorage.setItem(`${chatSessionPrefixLS}${id}`, JSON.stringify(drive));
          finalMetadataList.push(driveMetaFromMap);
        }
      }
      
      const dedupedFinalMetadata = deduplicateMetadata(finalMetadataList);
      setHistoryMetadata(dedupedFinalMetadata);
      localStorage.setItem(chatHistoryIndexKeyLS, JSON.stringify(dedupedFinalMetadata));

      toast({ title: "Drive Sync Successful", description: "History synced with Google Drive." });
      setIsSyncing(false); return 'SUCCESS';
    } catch (error: any) {
      console.error("Error during Sync with Drive:", error);
      toast({ title: "Drive Sync Failed", description: error.message || "An unknown error occurred during sync.", variant: "destructive",});
      setIsSyncing(false); return 'FAILED';
    }
  }, [googleAccessToken, appDriveFolderId, authUser, effectiveUserId, toast, initializeDriveFolder, chatHistoryIndexKeyLS, chatSessionPrefixLS, loadLocalHistoryMetadata, getSession]);


  return { historyMetadata, isLoading, getSession, saveSession, deleteSession, createNewSession, syncWithDrive, isSyncing, triggerGoogleSignIn: triggerGoogleSignInFromAuth };
}
