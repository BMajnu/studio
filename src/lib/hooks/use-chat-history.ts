
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
      // If new item is newer or same age, or if existing one has placeholder name/preview from Drive
      const newItem = { ...item };
      if (existing) {
        newItem.isDriveSession = newItem.isDriveSession || existing.isDriveSession;
        newItem.driveFileId = newItem.driveFileId || existing.driveFileId;
        // Prefer existing name/preview if the new one is a generic Drive placeholder
        if (newItem.name && newItem.name.startsWith("Drive:") && existing.name && !existing.name.startsWith("Drive:")) {
            newItem.name = existing.name;
        }
        if (newItem.preview === "From Google Drive" && existing.preview && existing.preview !== "From Google Drive") {
            newItem.preview = existing.preview;
        }
      }
      map.set(item.id, newItem);
    } else { // Existing is newer, but ensure Drive flags are merged if the current item is from Drive
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
                    // dataUri is intentionally omitted
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
    console.log(`useChatHistory (initializeDriveFolder): Initializing for user ${effectiveUserId}.`);
    const cachedFolderId = localStorage.getItem(appDriveFolderIdLSKey);
    if (cachedFolderId) {
        console.log(`useChatHistory (initializeDriveFolder): Using cached Drive folder ID: ${cachedFolderId}`);
        setAppDriveFolderId(cachedFolderId);
        return cachedFolderId;
    }

    try {
      console.log(`useChatHistory (initializeDriveFolder): No cached Drive folder ID. Ensuring app folder exists on Drive.`);
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
        console.error(`useChatHistory (initializeDriveFolder): Error ensuring app folder exists:`, error);
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
      console.warn("loadHistoryIndex: No effectiveUserId. Cannot load history.");
      setHistoryMetadata([]);
      return;
    }
    console.log(`loadHistoryIndex: Running for user ${effectiveUserId}. DriveToken: ${!!currentGoogleToken}, DriveFolder: ${currentDriveFolderId}`);

    let localUserMetadata: ChatSessionMetadata[] = [];
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
      localUserMetadata = filteredLocal;
      console.log(`loadHistoryIndex: Loaded ${localUserMetadata.length} sessions from localStorage.`);
    } catch (error) {
      console.error("loadHistoryIndex: Error loading/parsing local chat history index:", error);
    }

    if (currentGoogleToken && currentDriveFolderId) {
      console.log(`loadHistoryIndex: Attempting to fetch and merge metadata from Drive (Folder: ${currentDriveFolderId}).`);
      const driveFiles = await listSessionFilesFromDrive(currentGoogleToken, currentDriveFolderId);
      let combinedMetadata: ChatSessionMetadata[] = [...localUserMetadata]; // Start with local
      const seenDriveAppSessionIds = new Set<string>();

      if (driveFiles) {
        for (const driveFile of driveFiles) {
          if (!driveFile.name || !driveFile.id || !driveFile.name.startsWith(`session_${effectiveUserId}_`)) continue;
          
          const appSessionId = driveFile.name.replace(`session_`, '').replace('.json', '');
          seenDriveAppSessionIds.add(appSessionId);
          
          let driveSessionData: ChatSession | null = null;
          try {
            driveSessionData = await getSessionFromDrive(currentGoogleToken, driveFile.id);
          } catch (e) { console.error(`loadHistoryIndex: Error fetching full session ${appSessionId} from driveFile ${driveFile.id}`, e); }

          const driveMetaEntry: ChatSessionMetadata = {
            id: appSessionId,
            name: driveSessionData?.name || `Drive: ${new Date(driveFile.modifiedTime || Date.now()).toLocaleTimeString()}`,
            lastMessageTimestamp: new Date(driveFile.modifiedTime || driveSessionData?.updatedAt || Date.now()).getTime(),
            preview: driveSessionData ? getMessageTextPreview(driveSessionData.messages[driveSessionData.messages.length - 1]) : "From Google Drive",
            messageCount: driveSessionData?.messages.length || 0,
            isDriveSession: true,
            driveFileId: driveFile.id,
          };

          const existingLocalIndex = combinedMetadata.findIndex(m => m.id === appSessionId);
          if (existingLocalIndex !== -1) { 
            const localVersion = combinedMetadata[existingLocalIndex];
            if (driveMetaEntry.lastMessageTimestamp >= localVersion.lastMessageTimestamp) {
              combinedMetadata[existingLocalIndex] = {
                ...localVersion,
                ...driveMetaEntry,
                name: (driveMetaEntry.name.startsWith("Drive:") && !localVersion.name.startsWith("Drive:")) ? localVersion.name : driveMetaEntry.name,
                preview: (driveMetaEntry.preview === "From Google Drive" && localVersion.preview !== "From Google Drive") ? localVersion.preview : driveMetaEntry.preview,
              };
            } else { 
              combinedMetadata[existingLocalIndex].isDriveSession = true;
              combinedMetadata[existingLocalIndex].driveFileId = driveFile.id;
            }
          } else { 
            combinedMetadata.push(driveMetaEntry);
          }
        }
      }
      // Ensure local sessions not on Drive are marked as local-only
      combinedMetadata.forEach(meta => {
        if (!meta.isDriveSession && !seenDriveAppSessionIds.has(meta.id) && currentDriveFolderId) {
            // If we successfully checked Drive, and this local session wasn't found, it's truly local only.
            // This logic branch might be redundant if we start with local and merge.
        } else if (meta.isDriveSession && !seenDriveAppSessionIds.has(meta.id)) {
            // This implies a local session was marked as Drive but not found on Drive.
            // Could be a stale marker. For now, we trust the Drive list.
            // Better to handle this during sync by attempting to upload.
            // console.warn(`loadHistoryIndex: Metadata for ${meta.id} marked as Drive session but not found on Drive. Consider re-sync.`);
        }
      });

      const finalMetadata = deduplicateMetadata(combinedMetadata);
      setHistoryMetadata(finalMetadata);
      console.log(`loadHistoryIndex: Set historyMetadata with ${finalMetadata.length} merged items from Drive and LocalStorage.`);
    } else {
      const finalLocalMetadata = deduplicateMetadata(localUserMetadata);
      setHistoryMetadata(finalLocalMetadata);
      console.log(`loadHistoryIndex: Set historyMetadata with ${finalLocalMetadata.length} local items only.`);
    }
  }, [effectiveUserId, chatHistoryIndexKeyLS, listSessionFilesFromDrive, getSessionFromDrive, deduplicateMetadata]);


  useEffect(() => {
    const orchestrateInitialLoad = async () => {
      if (!effectiveUserId) {
        console.log("useChatHistory Orchestrator: No effectiveUserId. Waiting.");
        setIsLoading(true);
        return;
      }

      setIsLoading(true);
      console.log(`useChatHistory Orchestrator: For ${effectiveUserId}. AuthUser: ${!!authUser}, Token: ${!!googleAccessToken}, CurrentAppDriveFolderId: ${appDriveFolderId}`);

      // Phase 1: Load local history immediately.
      await loadHistoryIndex(null, null); // This populates historyMetadata with local data.

      // Phase 2: If Google user, initialize Drive and then merge.
      if (authUser && googleAccessToken) {
        console.log(`useChatHistory Orchestrator: Google user & token present. Initializing Drive folder.`);
        // initializeDriveFolder sets appDriveFolderId state, which will trigger the next check.
        // We need to ensure initializeDriveFolder completes before trying to load drive history
        const folderIdAfterInit = await initializeDriveFolder(googleAccessToken);
        if (folderIdAfterInit) {
           console.log(`useChatHistory Orchestrator: Drive folder ready (${folderIdAfterInit}). Loading/merging Drive history.`);
           await loadHistoryIndex(googleAccessToken, folderIdAfterInit); // Load and merge Drive
        } else {
            console.warn(`useChatHistory Orchestrator: Drive folder initialization failed. Only local history will be available initially for ${effectiveUserId}.`);
        }
      } else {
        console.log(`useChatHistory Orchestrator: No Google token or not a Google user. Local history is primary for ${effectiveUserId}.`);
      }
      setIsLoading(false);
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
        const driveSession = await getSessionFromDrive(googleAccessToken, metadataEntry.driveFileId);
        if (driveSession) {
            console.log(`getSession: Successfully fetched session ${sessionId} from Drive.`);
            try { 
                const leanDriveSession = createLeanSession(driveSession);
                localStorage.setItem(`${chatSessionPrefixLS}${sessionId}`, JSON.stringify(leanDriveSession));
            } catch (e) { 
                if (isQuotaExceededError(e)) console.error("getSession: Error caching lean Drive session to localStorage (quota).", e);
                else console.error("getSession: Error caching lean Drive session to localStorage.", e);
            }
            return driveSession; 
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
        console.error(`saveSession: Failed to save session ${sessionToUpdateInMemory.id} to localStorage due to quota.`, error);
        toast({ title: "Local Storage Full", description: "Could not save chat session locally. Storage quota exceeded.", variant: "destructive", });
      } else {
        console.error(`saveSession: Failed to save session ${sessionToUpdateInMemory.id} to localStorage:`, error);
        toast({ title: "Local Save Error", description: "Could not save chat session locally.", variant: "destructive", });
      }
    }

    let driveSavedSuccessfully = false;
    let actualDriveFileIdFromSave: string | undefined = sessionToUpdateInMemory.driveFileId;

    if (googleAccessToken && appDriveFolderId && authUser && authUser.uid === effectiveUserId) {
      console.log(`saveSession: Attempting background save of session ${sessionToUpdateInMemory.id} to Google Drive.`);
      try {
        const driveFile = await saveSessionToDrive(googleAccessToken, appDriveFolderId, sessionToUpdateInMemory.id, sessionToUpdateInMemory); 
        if (driveFile && driveFile.id) {
          console.log(`saveSession: Session ${sessionToUpdateInMemory.id} saved to Drive. Drive File ID: ${driveFile.id}`);
          actualDriveFileIdFromSave = driveFile.id;
          sessionToUpdateInMemory.driveFileId = driveFile.id; 
          driveSavedSuccessfully = true;
        } else {
          console.warn(`saveSession: Background save to Drive failed for ${sessionToUpdateInMemory.id}.`);
          // Do not toast here as this is an optimistic background save.
          // Manual sync will handle errors more visibly.
        }
      } catch (driveError: any) {
        console.error(`saveSession: Error during background save of ${sessionToUpdateInMemory.id} to Drive:`, driveError);
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
         if (isQuotaExceededError(error)) console.error("saveSession: Failed to save history index (quota).", error);
         else console.error("saveSession: Failed to save history index.", error);
      }
      return updatedFullHistory;
    });
    return sessionToUpdateInMemory;
  }, [effectiveUserId, googleAccessToken, appDriveFolderId, authUser, toast, chatHistoryIndexKeyLS, chatSessionPrefixLS, saveSessionToDrive, deduplicateMetadata]);


  const deleteSession = useCallback(async (sessionId: string) => {
    if (!effectiveUserId || !sessionId.startsWith(effectiveUserId + '_')) {
        console.warn(`deleteSession: Attempt to delete session ${sessionId} for incorrect user context (current: ${effectiveUserId}).`);
        return;
    }
    const sessionMetaToDelete = historyMetadata.find(meta => meta.id === sessionId);
    
    if (sessionMetaToDelete?.isDriveSession && sessionMetaToDelete.driveFileId && googleAccessToken && authUser?.uid === effectiveUserId) {
        console.log(`deleteSession: Attempting to delete session ${sessionId} (Drive ID: ${sessionMetaToDelete.driveFileId}) from Drive.`);
        const deletedFromDrive = await deleteFileFromDrive(googleAccessToken, sessionMetaToDelete.driveFileId);
        if (deletedFromDrive) {
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
           if (isQuotaExceededError(error)) console.error("deleteSession: Failed to update LS index (quota).", error);
           else console.error("deleteSession: Failed to update LS index.", error);
        }
        return finalHistory;
      });
      if (!sessionMetaToDelete?.isDriveSession || (sessionMetaToDelete?.isDriveSession && !(await deleteFileFromDrive(googleAccessToken!, sessionMetaToDelete.driveFileId!)))) {
         toast({ title: "Session Deleted Locally", description: `Session "${sessionMetaToDelete?.name || sessionId}" removed from local storage.`});
      }
    } catch (error) {
      console.error(`deleteSession: Failed to delete session ${sessionId} from localStorage:`, error);
      toast({ title: "Local Deletion Error", description: `Could not delete "${sessionMetaToDelete?.name || sessionId}" locally.`, variant: "destructive"});
    }
  }, [effectiveUserId, googleAccessToken, authUser?.uid, historyMetadata, toast, chatHistoryIndexKeyLS, chatSessionPrefixLS, deleteFileFromDrive, deduplicateMetadata]);


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
      // 1. Fetch all local session data (full sessions)
      const localMetasFromLS: ChatSessionMetadata[] = JSON.parse(localStorage.getItem(chatHistoryIndexKeyLS) || '[]');
      const userLocalMetas = localMetasFromLS.filter(meta => meta.id.startsWith(effectiveUserId + '_'));
      const localSessionsPromises = userLocalMetas.map(async meta => {
        const sessionJson = localStorage.getItem(`${chatSessionPrefixLS}${meta.id}`);
        return sessionJson ? JSON.parse(sessionJson) as ChatSession : null;
      });
      const localSessionsArray = (await Promise.all(localSessionsPromises)).filter(Boolean) as ChatSession[];
      const localSessionsMap = new Map(localSessionsArray.map(s => [s.id, s]));
      
      // 2. Fetch all Drive session files and their full content
      const driveFiles = await listSessionFilesFromDrive(currentToken, currentAppDriveFolderId);
      const driveSessionsMap = new Map<string, ChatSession>();
      const driveMetadataMap = new Map<string, ChatSessionMetadata>();

      if (driveFiles) {
        for (const driveFile of driveFiles) {
          if (!driveFile.name || !driveFile.id || !driveFile.name.startsWith(`session_${effectiveUserId}_`)) continue;
          const appSessionId = driveFile.name.replace(`session_`, '').replace('.json', '');
          const fullDriveSession = await getSessionFromDrive(currentToken, driveFile.id);
          if (fullDriveSession) {
            const sessionWithDriveId = { ...fullDriveSession, driveFileId: driveFile.id };
            driveSessionsMap.set(appSessionId, sessionWithDriveId);
            driveMetadataMap.set(appSessionId, {
              id: appSessionId, name: sessionWithDriveId.name || `Drive: ${appSessionId.substring(0,10)}`,
              lastMessageTimestamp: new Date(driveFile.modifiedTime || sessionWithDriveId.updatedAt).getTime(),
              preview: getMessageTextPreview(sessionWithDriveId.messages[sessionWithDriveId.messages.length - 1]),
              messageCount: sessionWithDriveId.messages.length, isDriveSession: true, driveFileId: driveFile.id,
            });
          }
        }
      }

      // 3. Reconcile and Sync
      const allKnownIds = new Set([...localSessionsMap.keys(), ...driveSessionsMap.keys()]);
      const finalMetadataList: ChatSessionMetadata[] = [];

      for (const id of allKnownIds) {
        let localSess = localSessionsMap.get(id);
        let driveSess = driveSessionsMap.get(id);
        
        if (localSess && driveSess) { 
          if (localSess.updatedAt >= driveSess.updatedAt) { 
            console.log(`Sync: Local session ${id} is newer/same. Uploading to Drive.`);
            const savedDriveMeta = await saveSessionToDrive(currentToken, currentAppDriveFolderId, id, localSess);
            localSess.driveFileId = savedDriveMeta?.id || localSess.driveFileId; // Update localSess with new Drive ID if created
            localStorage.setItem(`${chatSessionPrefixLS}${id}`, JSON.stringify(createLeanSession(localSess))); // Save updated local
            finalMetadataList.push({
              id, name: localSess.name, lastMessageTimestamp: savedDriveMeta?.modifiedTime ? new Date(savedDriveMeta.modifiedTime).getTime() : localSess.updatedAt,
              preview: getMessageTextPreview(localSess.messages[localSess.messages.length -1]), messageCount: localSess.messages.length,
              isDriveSession: true, driveFileId: localSess.driveFileId,
            });
          } else { 
            console.log(`Sync: Drive session ${id} is newer. Updating local storage.`);
            localStorage.setItem(`${chatSessionPrefixLS}${id}`, JSON.stringify(createLeanSession(driveSess)));
            finalMetadataList.push(driveMetadataMap.get(id)!);
          }
        } else if (localSess) { 
          console.log(`Sync: Session ${id} is local only. Uploading to Drive.`);
          const savedDriveMeta = await saveSessionToDrive(currentToken, currentAppDriveFolderId, id, localSess);
          localSess.driveFileId = savedDriveMeta?.id;
          localStorage.setItem(`${chatSessionPrefixLS}${id}`, JSON.stringify(createLeanSession(localSess))); // Save local with drive ID
          finalMetadataList.push({
            id, name: localSess.name, lastMessageTimestamp: savedDriveMeta?.modifiedTime ? new Date(savedDriveMeta.modifiedTime).getTime() : localSess.updatedAt,
            preview: getMessageTextPreview(localSess.messages[localSess.messages.length -1]), messageCount: localSess.messages.length,
            isDriveSession: true, driveFileId: localSess.driveFileId,
          });
        } else if (driveSess && driveMetadataMap.has(id)) { // Only Drive
          console.log(`Sync: Session ${id} is Drive only. Saving to local storage.`);
          localStorage.setItem(`${chatSessionPrefixLS}${id}`, JSON.stringify(createLeanSession(driveSess)));
          finalMetadataList.push(driveMetadataMap.get(id)!);
        }
      }
      
      const finalDedupedMetadata = deduplicateMetadata(finalMetadataList);
      localStorage.setItem(chatHistoryIndexKeyLS, JSON.stringify(finalDedupedMetadata));
      setHistoryMetadata(finalDedupedMetadata); 

      toast({ title: "Drive Sync Successful", description: "History synced with Google Drive." });
      setIsSyncing(false); 
      // Explicitly reload/re-merge after successful sync
      await loadHistoryIndex(currentToken, currentAppDriveFolderId);
      return 'SUCCESS';

    } catch (error: any) {
      console.error("Error during Sync with Drive:", error);
      toast({ title: "Drive Sync Failed", description: error.message || "An unknown error occurred during sync.", variant: "destructive",});
      setIsSyncing(false); return 'FAILED';
    }
  }, [
      effectiveUserId, googleAccessToken, appDriveFolderId, authUser, 
      toast, initializeDriveFolder, chatHistoryIndexKeyLS, chatSessionPrefixLS, 
      listSessionFilesFromDrive, getSessionFromDrive, saveSessionToDrive,
      deduplicateMetadata, loadHistoryIndex // loadHistoryIndex added here
    ]);


  return { historyMetadata, isLoading, getSession, saveSession, deleteSession, createNewSession, syncWithDrive, isSyncing, triggerGoogleSignIn: triggerGoogleSignInFromAuth };
}

    