
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
      const newItem = { ...item }; 
      if (existing) { 
          newItem.isDriveSession = newItem.isDriveSession || existing.isDriveSession;
          newItem.driveFileId = newItem.driveFileId || existing.driveFileId;
      }
      map.set(item.id, newItem);
    } else { 
        const updatedExisting = {...existing};
        updatedExisting.isDriveSession = existing.isDriveSession || item.isDriveSession;
        updatedExisting.driveFileId = existing.driveFileId || item.driveFileId;
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


  const loadHistoryIndex = useCallback(async (
    currentGoogleToken: string | null, // Token for this specific load operation
    currentDriveFolderId: string | null // Folder ID for this specific load operation
  ) => {
    if (!effectiveUserId) {
      console.warn("useChatHistory (loadHistoryIndex): No effectiveUserId, cannot load history. Should not happen if orchestrator waits.");
      setHistoryMetadata([]); // Clear metadata if no user
      return;
    }
    console.log(`useChatHistory (loadHistoryIndex): For user ${effectiveUserId}. DriveToken: ${!!currentGoogleToken}, DriveFolder: ${currentDriveFolderId}`);

    let combinedMetadata: ChatSessionMetadata[] = [];
    const seenIds = new Set<string>();

    // Always load local history metadata first as a base
    try {
      const storedIndex = localStorage.getItem(chatHistoryIndexKeyLS);
      const localParsedIndex: ChatSessionMetadata[] = storedIndex ? JSON.parse(storedIndex) : [];
      
      const userSpecificLocalMetadata = localParsedIndex.filter((meta): meta is ChatSessionMetadata => 
          meta && typeof meta.id === 'string' && meta.id.startsWith(effectiveUserId + '_') &&
          typeof meta.name === 'string' && typeof meta.lastMessageTimestamp === 'number' &&
          typeof meta.preview === 'string' && typeof meta.messageCount === 'number'
      );

      if (userSpecificLocalMetadata.length < localParsedIndex.length && localParsedIndex.length > 0) {
        console.warn(`useChatHistory (loadHistoryIndex): Filtered out ${localParsedIndex.length - userSpecificLocalMetadata.length} invalid/non-user sessions from LS index. Updating LS.`);
        localStorage.setItem(chatHistoryIndexKeyLS, JSON.stringify(userSpecificLocalMetadata));
      }
      
      userSpecificLocalMetadata.forEach(localMeta => {
        if (!seenIds.has(localMeta.id)) {
          combinedMetadata.push({ ...localMeta, isDriveSession: localMeta.isDriveSession || false, driveFileId: localMeta.driveFileId });
          seenIds.add(localMeta.id);
        }
      });
      console.log(`useChatHistory (loadHistoryIndex): Loaded ${userSpecificLocalMetadata.length} sessions from localStorage for ${effectiveUserId}.`);
    } catch (error) {
      console.error("useChatHistory (loadHistoryIndex): Error loading/parsing local chat history index:", error);
    }

    // If Drive details are provided for this load operation, fetch and merge Drive metadata
    if (currentGoogleToken && currentDriveFolderId) {
      console.log(`useChatHistory (loadHistoryIndex): Attempting to fetch metadata from Drive (Folder: ${currentDriveFolderId}).`);
      const driveFiles = await listSessionFilesFromDrive(currentGoogleToken, currentDriveFolderId);
      if (driveFiles) {
        for (const driveFile of driveFiles) {
          if (!driveFile.name || !driveFile.id || !driveFile.name.startsWith(`session_${effectiveUserId}_`)) continue;
          
          const appSessionId = driveFile.name.replace(`session_`, '').replace('.json', '');
          let driveSessionData: ChatSession | null = null;
          try {
            driveSessionData = await getSessionFromDrive(currentGoogleToken, driveFile.id);
          } catch (e) { console.error(`useChatHistory (loadHistoryIndex): Error fetching full session ${appSessionId} from driveFile ${driveFile.id}`, e); }

          const driveMetaEntry: ChatSessionMetadata = {
            id: appSessionId,
            name: driveSessionData?.name || `Drive: ${new Date(driveFile.modifiedTime || Date.now()).toLocaleTimeString()}`,
            lastMessageTimestamp: new Date(driveFile.modifiedTime || driveSessionData?.updatedAt || Date.now()).getTime(),
            preview: driveSessionData ? getMessageTextPreview(driveSessionData.messages[driveSessionData.messages.length - 1]) : "From Google Drive",
            messageCount: driveSessionData?.messages.length || 0,
            isDriveSession: true,
            driveFileId: driveFile.id,
          };

          const existingIndex = combinedMetadata.findIndex(m => m.id === appSessionId);
          if (existingIndex !== -1) { // Session exists locally, merge/update based on timestamp
            const localVersion = combinedMetadata[existingIndex];
            if (driveMetaEntry.lastMessageTimestamp >= localVersion.lastMessageTimestamp) {
              combinedMetadata[existingIndex] = { // Prioritize Drive if newer or equal
                ...localVersion, // Keep local details as base
                ...driveMetaEntry, // Overlay with Drive details (name, preview might be better from Drive if local was placeholder)
                 name: (driveMetaEntry.name.startsWith("Drive:") && !localVersion.name.startsWith("Drive:")) ? localVersion.name : driveMetaEntry.name,
                preview: (driveMetaEntry.preview === "From Google Drive" && localVersion.preview !== "From Google Drive") ? localVersion.preview : driveMetaEntry.preview,
              };
            } else { // Local is newer, just ensure Drive flags are set
              combinedMetadata[existingIndex].isDriveSession = true;
              combinedMetadata[existingIndex].driveFileId = driveFile.id;
            }
          } else { // Session only on Drive, add it
            combinedMetadata.push(driveMetaEntry);
            // seenIds.add(appSessionId); // Already handled by local load if it was there.
          }
        }
        console.log(`useChatHistory (loadHistoryIndex): Processed ${driveFiles.length} potential sessions from Drive.`);
      } else {
        console.warn(`useChatHistory (loadHistoryIndex): listSessionFilesFromDrive returned null for user ${effectiveUserId}.`);
      }
    }
    
    const finalMetadata = deduplicateMetadata(combinedMetadata);
    setHistoryMetadata(finalMetadata);
    console.log(`useChatHistory (loadHistoryIndex): Set historyMetadata with ${finalMetadata.length} items for ${effectiveUserId}.`);
  }, [effectiveUserId, chatHistoryIndexKeyLS]);


  // Main orchestrating useEffect for initial data load
  useEffect(() => {
    const orchestrateInitialLoad = async () => {
      if (!effectiveUserId) {
        console.log("useChatHistory Orchestrator: No effectiveUserId. Waiting.");
        setIsLoading(true); // Keep app loading until user ID is known
        return;
      }

      setIsLoading(true);
      console.log(`useChatHistory Orchestrator: Starting load for ${effectiveUserId}. AuthUser: ${!!authUser}, Token: ${!!googleAccessToken}`);
      
      // Always load local data first
      await loadHistoryIndex(null, null);

      if (authUser && googleAccessToken) {
        console.log(`useChatHistory Orchestrator: Google user & token present for ${effectiveUserId}. Initializing Drive folder.`);
        const folderIdFromInit = await initializeDriveFolder(googleAccessToken);
        if (folderIdFromInit) {
          console.log(`useChatHistory Orchestrator: Drive folder ready (${folderIdFromInit}). Re-loading history to merge Drive data.`);
          await loadHistoryIndex(googleAccessToken, folderIdFromInit); // Load again, this time with Drive context
        } else {
          console.warn(`useChatHistory Orchestrator: Could not get Drive folder ID for ${effectiveUserId}. Drive history merge skipped.`);
        }
      } else {
        console.log(`useChatHistory Orchestrator: Not a full Google session or local user ${effectiveUserId}. Local history load complete.`);
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
            try { // Cache lean version locally for faster access next time
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
        // If it's marked as a Drive session in metadata but we loaded from LS, ensure driveFileId is present
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
  }, [effectiveUserId, googleAccessToken, authUser?.uid, historyMetadata, chatSessionPrefixLS]);


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
    sessionToUpdateInMemory.userId = effectiveUserId; // Ensure correct userId

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
          sessionToUpdateInMemory.driveFileId = driveFile.id; // Update in-memory session with Drive ID
          driveSavedSuccessfully = true;
        } else {
          console.warn(`saveSession: Background save to Drive failed for ${sessionToUpdateInMemory.id}.`);
          toast({ title: "Drive Sync Incomplete", description: `Session "${sessionToUpdateInMemory.name}" saved locally. Background sync to Drive failed.`, variant: "default" });
        }
      } catch (driveError: any) {
        console.error(`saveSession: Error during background save of ${sessionToUpdateInMemory.id} to Drive:`, driveError);
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
         if (isQuotaExceededError(error)) console.error("saveSession: Failed to save history index (quota).", error);
         else console.error("saveSession: Failed to save history index.", error);
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
      if (!sessionMetaToDelete?.isDriveSession) { // Or if Drive deletion failed but local succeeded
         toast({ title: "Session Deleted Locally", description: `Session "${sessionMetaToDelete?.name || sessionId}" removed from local storage.`});
      }
    } catch (error) {
      console.error(`deleteSession: Failed to delete session ${sessionId} from localStorage:`, error);
      toast({ title: "Local Deletion Error", description: `Could not delete "${sessionMetaToDelete?.name || sessionId}" locally.`, variant: "destructive"});
    }
  }, [effectiveUserId, googleAccessToken, authUser?.uid, historyMetadata, toast, chatHistoryIndexKeyLS, chatSessionPrefixLS]);


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
        console.warn("useChatHistory (syncWithDrive): Google access token not available. Requesting re-authentication.");
        setIsSyncing(false); 
        return 'TOKEN_REFRESH_NEEDED';
    }

    let currentAppDriveFolderId = appDriveFolderId; // Use state value
    if (!currentAppDriveFolderId) { // If state is null, try re-initializing
        console.log("useChatHistory (syncWithDrive): appDriveFolderId not set in state, attempting to initialize.");
        currentAppDriveFolderId = await initializeDriveFolder(currentToken);
        if (!currentAppDriveFolderId) {
            toast({ title: "Drive Folder Error", description: "Could not initialize Drive folder. Sync aborted.", variant: "destructive" });
            setIsSyncing(false); return 'FAILED';
        }
    }
    
    toast({ title: "Syncing with Google Drive...", description: "Please wait. This may take a moment." });
    try {
      // 1. Fetch all local session data
      const localMetasFromLS: ChatSessionMetadata[] = JSON.parse(localStorage.getItem(chatHistoryIndexKeyLS) || '[]');
      const userLocalMetas = localMetasFromLS.filter(meta => meta.id.startsWith(effectiveUserId + '_'));
      const localSessionsPromises = userLocalMetas.map(async meta => {
        const sessionJson = localStorage.getItem(`${chatSessionPrefixLS}${meta.id}`);
        return sessionJson ? JSON.parse(sessionJson) as ChatSession : null;
      });
      const localSessionsArray = (await Promise.all(localSessionsPromises)).filter(Boolean) as ChatSession[];
      const localSessionsMap = new Map(localSessionsArray.map(s => [s.id, s]));
      
      // 2. Fetch all Drive session metadata (and content if possible, or just list files)
      const driveFiles = await listSessionFilesFromDrive(currentToken, currentAppDriveFolderId);
      const driveSessionsMap = new Map<string, ChatSession>(); // Store full sessions fetched from Drive
      const driveMetadataMap = new Map<string, ChatSessionMetadata>(); // Store metadata for Drive files

      if (driveFiles) {
        for (const driveFile of driveFiles) {
          if (!driveFile.name || !driveFile.id || !driveFile.name.startsWith(`session_${effectiveUserId}_`)) continue;
          const appSessionId = driveFile.name.replace(`session_`, '').replace('.json', '');
          
          const fullDriveSession = await getSessionFromDrive(currentToken, driveFile.id);
          if (fullDriveSession) {
            fullDriveSession.driveFileId = driveFile.id; // Ensure Drive ID is on the session object
            driveSessionsMap.set(appSessionId, fullDriveSession);
            driveMetadataMap.set(appSessionId, {
              id: appSessionId, name: fullDriveSession.name || `Drive: ${appSessionId.substring(0,10)}`,
              lastMessageTimestamp: new Date(driveFile.modifiedTime || fullDriveSession.updatedAt).getTime(),
              preview: getMessageTextPreview(fullDriveSession.messages[fullDriveSession.messages.length - 1]),
              messageCount: fullDriveSession.messages.length, isDriveSession: true, driveFileId: driveFile.id,
            });
          }
        }
      }

      // 3. Reconcile and Sync
      const allKnownIds = new Set([...localSessionsMap.keys(), ...driveSessionsMap.keys()]);
      const mergedMetadata: ChatSessionMetadata[] = [];

      for (const id of allKnownIds) {
        const localSess = localSessionsMap.get(id);
        const driveSess = driveSessionsMap.get(id);
        
        if (localSess && driveSess) { // Exists in both
          if (localSess.updatedAt >= driveSess.updatedAt) { // Local is newer or same
            console.log(`Sync: Local session ${id} is newer/same. Uploading to Drive.`);
            const savedDriveFile = await saveSessionToDrive(currentToken, currentAppDriveFolderId, id, localSess);
            mergedMetadata.push({
              id, name: localSess.name, lastMessageTimestamp: savedDriveFile?.modifiedTime ? new Date(savedDriveFile.modifiedTime).getTime() : localSess.updatedAt,
              preview: getMessageTextPreview(localSess.messages[localSess.messages.length -1]), messageCount: localSess.messages.length,
              isDriveSession: true, driveFileId: savedDriveFile?.id || driveSess.driveFileId,
            });
            // Update local storage for the session itself with the driveFileId if it was just obtained
            if (savedDriveFile?.id && !localSess.driveFileId) {
                const updatedLocalSessionWithDriveId = {...localSess, driveFileId: savedDriveFile.id};
                localStorage.setItem(`${chatSessionPrefixLS}${id}`, JSON.stringify(createLeanSession(updatedLocalSessionWithDriveId)));
            }

          } else { // Drive is newer
            console.log(`Sync: Drive session ${id} is newer. Updating local storage.`);
            localStorage.setItem(`${chatSessionPrefixLS}${id}`, JSON.stringify(createLeanSession(driveSess)));
            mergedMetadata.push(driveMetadataMap.get(id)!);
          }
        } else if (localSess) { // Only local
          console.log(`Sync: Session ${id} is local only. Uploading to Drive.`);
          const savedDriveFile = await saveSessionToDrive(currentToken, currentAppDriveFolderId, id, localSess);
          mergedMetadata.push({
            id, name: localSess.name, lastMessageTimestamp: savedDriveFile?.modifiedTime ? new Date(savedDriveFile.modifiedTime).getTime() : localSess.updatedAt,
            preview: getMessageTextPreview(localSess.messages[localSess.messages.length -1]), messageCount: localSess.messages.length,
            isDriveSession: true, driveFileId: savedDriveFile?.id,
          });
            if (savedDriveFile?.id) { // Update local session with driveFileId
                const updatedLocalSessionWithDriveId = {...localSess, driveFileId: savedDriveFile.id};
                localStorage.setItem(`${chatSessionPrefixLS}${id}`, JSON.stringify(createLeanSession(updatedLocalSessionWithDriveId)));
            }
        } else if (driveSess) { // Only Drive
          console.log(`Sync: Session ${id} is Drive only. Saving to local storage.`);
          localStorage.setItem(`${chatSessionPrefixLS}${id}`, JSON.stringify(createLeanSession(driveSess)));
          mergedMetadata.push(driveMetadataMap.get(id)!);
        }
      }
      
      const finalDedupedMetadata = deduplicateMetadata(mergedMetadata);
      localStorage.setItem(chatHistoryIndexKeyLS, JSON.stringify(finalDedupedMetadata));
      setHistoryMetadata(finalDedupedMetadata); // Update state directly after sync

      toast({ title: "Drive Sync Successful", description: "History synced with Google Drive." });
      setIsSyncing(false); return 'SUCCESS';

    } catch (error: any) {
      console.error("Error during Sync with Drive:", error);
      toast({ title: "Drive Sync Failed", description: error.message || "An unknown error occurred during sync.", variant: "destructive",});
      setIsSyncing(false); return 'FAILED';
    }
  }, [
      effectiveUserId, googleAccessToken, appDriveFolderId, authUser, 
      toast, initializeDriveFolder, chatHistoryIndexKeyLS, chatSessionPrefixLS, 
      // listSessionFilesFromDrive, getSessionFromDrive, saveSessionToDrive // These are stable
    ]);


  return { historyMetadata, isLoading, getSession, saveSession, deleteSession, createNewSession, syncWithDrive, isSyncing, triggerGoogleSignIn: triggerGoogleSignInFromAuth };
}

    