
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
    if (!existing || item.lastMessageTimestamp > existing.lastMessageTimestamp) {
      map.set(item.id, item);
    } else if (existing && item.driveFileId && !existing.driveFileId) {
      // If existing is local and new one is Drive, prefer Drive metadata if timestamps are close
      // This helps ensure driveFileId is populated if a local and drive session match
      existing.driveFileId = item.driveFileId;
      existing.isDriveSession = true;
      if (item.lastMessageTimestamp > existing.lastMessageTimestamp) {
        existing.lastMessageTimestamp = item.lastMessageTimestamp;
        existing.name = item.name;
        existing.preview = item.preview;
        existing.messageCount = item.messageCount;
      }
      map.set(item.id, existing);
    }
  }
  return Array.from(map.values()).sort((a, b) => b.lastMessageTimestamp - a.lastMessageTimestamp);
}


export function useChatHistory(userIdFromProfile: string | undefined) {
  const { user: authUser, googleAccessToken, signInWithGoogle: triggerGoogleSignIn } = useAuth();
  const { toast } = useToast();
  const [historyMetadata, setHistoryMetadata] = useState<ChatSessionMetadata[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [appDriveFolderId, setAppDriveFolderId] = useState<string | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);

  const effectiveUserId = authUser?.uid || userIdFromProfile || DEFAULT_USER_ID;

  const initializeDriveFolder = useCallback(async (token: string): Promise<string | null> => {
    if (!token) {
      console.warn("useChatHistory (initializeDriveFolder): No Google access token provided.");
      setAppDriveFolderId(null);
      return null;
    }
    console.log("useChatHistory (initializeDriveFolder): Ensuring app folder exists with provided token.");
    try {
      const folderId = await ensureAppFolderExists(token);
      if (folderId) {
        setAppDriveFolderId(folderId);
        console.log("useChatHistory (initializeDriveFolder): App Drive folder ID set:", folderId);
        return folderId;
      } else {
        console.warn("useChatHistory (initializeDriveFolder): Could not obtain App Drive folder ID.");
        toast({
          title: "Google Drive Error",
          description: "Could not access or create the app folder in Google Drive. History may not be synced to Drive.",
          variant: "destructive",
        });
        setAppDriveFolderId(null);
      }
    } catch (error: any) {
        console.error("useChatHistory (initializeDriveFolder): Error ensuring app folder exists:", error);
        toast({
          title: "Google Drive Setup Failed",
          description: `Failed to set up app folder in Google Drive: ${error.message}. Drive features may be unavailable.`,
          variant: "destructive",
        });
        setAppDriveFolderId(null);
    }
    return null;
  }, [toast]); 


  const loadHistoryIndex = useCallback(async (currentDriveFolderIdParam?: string | null, currentGoogleAccessTokenParam?: string | null) => {
    if (!effectiveUserId) {
      console.warn("useChatHistory (loadHistoryIndex): No effectiveUserId, cannot load history.");
      setIsLoading(false);
      setHistoryMetadata([]);
      return;
    }
    setIsLoading(true);
    console.log(`useChatHistory (loadHistoryIndex): Loading history for user ${effectiveUserId}. HasToken: ${!!currentGoogleAccessTokenParam}, DriveFolderID: ${currentDriveFolderIdParam}`);

    let localParsedIndex: ChatSessionMetadata[] = [];
    try {
      const storedIndex = localStorage.getItem(CHAT_HISTORY_INDEX_KEY_LS);
      localParsedIndex = storedIndex ? JSON.parse(storedIndex) : [];
    } catch (error) {
      console.error("useChatHistory (loadHistoryIndex): Failed to load/parse chat history index from localStorage:", error);
    }

    const userSpecificLocalMetadata = localParsedIndex.filter(
      (meta) => meta && meta.id && meta.id.startsWith(effectiveUserId + '_')
    ).map(meta => ({...meta, isDriveSession: meta.isDriveSession || false, driveFileId: meta.driveFileId }));

    if (userSpecificLocalMetadata.length < localParsedIndex.length && localParsedIndex.length > 0) {
      console.warn(
        `useChatHistory (loadHistoryIndex): Filtered out ${
          localParsedIndex.length - userSpecificLocalMetadata.length
        } sessions from localStorage index not belonging to user ${effectiveUserId}. Updating LS index.`
      );
      try {
        localStorage.setItem(CHAT_HISTORY_INDEX_KEY_LS, JSON.stringify(userSpecificLocalMetadata));
      } catch (error) {
        console.error("useChatHistory (loadHistoryIndex): Failed to update localStorage index after filtering:", error);
      }
    }
    
    const combinedMetadataMap = new Map<string, ChatSessionMetadata>();
    userSpecificLocalMetadata.forEach(meta => combinedMetadataMap.set(meta.id, meta));
    
    const actualDriveFolderId = currentDriveFolderIdParam === undefined ? appDriveFolderId : currentDriveFolderIdParam;
    const actualToken = currentGoogleAccessTokenParam === undefined ? googleAccessToken : currentGoogleAccessTokenParam;

    if (actualToken && actualDriveFolderId && authUser?.uid === effectiveUserId) {
      console.log("useChatHistory (loadHistoryIndex): Attempting to load and merge session list from Google Drive. Folder ID:", actualDriveFolderId);
      const driveFiles = await listSessionFilesFromDrive(actualToken, actualDriveFolderId);
      
      if (driveFiles) {
        const driveMetadataPromises = driveFiles.map(async (driveFile) => {
          // driveFile.name is like "session_USERID_TIMESTAMP_RANDOM.json"
          // driveFile.id is the actual Google Drive file ID
          if (!driveFile || !driveFile.name || !driveFile.id || !driveFile.name.startsWith(`session_${effectiveUserId}_`)) {
            return null;
          }
          // Extract app's session ID from the filename
          const appSessionId = driveFile.name.replace(`session_`, '').replace('.json', '');
          
          // Check if we already have this appSessionId from local storage, prefer local if newer or more complete name/preview
          const existingLocalMeta = combinedMetadataMap.get(appSessionId);
          if (existingLocalMeta && existingLocalMeta.lastMessageTimestamp >= (new Date(driveFile.modifiedTime || 0).getTime())) {
            // Local is newer or same, ensure driveFileId is updated
            existingLocalMeta.isDriveSession = true;
            existingLocalMeta.driveFileId = driveFile.id;
            combinedMetadataMap.set(appSessionId, existingLocalMeta);
            return null; // Don't fetch from Drive again if local is sufficient
          }
          
          // Fetch full session to get accurate name/preview
          const fullSession = await getSessionFromDrive(actualToken, driveFile.id);
          if (fullSession && fullSession.id === appSessionId) { // Verify appSessionId matches
            return {
              id: fullSession.id, // App's session ID
              name: fullSession.name || `Drive: ${new Date(fullSession.createdAt).toLocaleDateString()}`,
              lastMessageTimestamp: new Date(driveFile.modifiedTime || fullSession.updatedAt).getTime(),
              preview: getMessageTextPreview(fullSession.messages[fullSession.messages.length - 1]),
              messageCount: fullSession.messages.length,
              isDriveSession: true,
              driveFileId: driveFile.id, // Store actual Drive File ID
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
  }, [effectiveUserId, authUser?.uid, appDriveFolderId, googleAccessToken, toast]);


  // Main effect to orchestrate initialization
  useEffect(() => {
    const orchestrateLoad = async () => {
      if (!effectiveUserId || !authUser) { // Wait for authUser to be available
        console.warn("useChatHistory (Main Effect): No effectiveUserId or authUser, deferring load.");
        setIsLoading(false); 
        setHistoryMetadata([]);
        return;
      }
      
      setIsLoading(true);
      console.log(`useChatHistory (Main Effect): Orchestrating load for user ${effectiveUserId}. Google User: ${!!googleAccessToken}`);
      let currentFolderId: string | null = appDriveFolderId;

      if (googleAccessToken && authUser.uid === effectiveUserId) {
        if (!currentFolderId) {
          console.log("useChatHistory (Main Effect): Google user detected, appDriveFolderId not set. Ensuring Drive folder exists.");
          currentFolderId = await initializeDriveFolder(googleAccessToken);
        } else {
          console.log("useChatHistory (Main Effect): Google user detected, appDriveFolderId already set:", currentFolderId);
        }
      } else {
         console.log("useChatHistory (Main Effect): Not a Google user or no access token. Clearing appDriveFolderId and loading local history.");
         setAppDriveFolderId(null); // Ensure it's null if no Google auth
         currentFolderId = null;
      }
      
      console.log(`useChatHistory (Main Effect): Proceeding to load history. UserID: ${effectiveUserId}, Token: ${!!googleAccessToken}, Resolved FolderID for loadHistoryIndex: ${currentFolderId}`);
      await loadHistoryIndex(currentFolderId, googleAccessToken);
    };

    if (!authUser && !userIdFromProfile) { // If no auth context and no profile user ID, bail early
      setIsLoading(false);
      return;
    }
    orchestrateLoad();
  }, [effectiveUserId, googleAccessToken, authUser, initializeDriveFolder, loadHistoryIndex, appDriveFolderId, userIdFromProfile]);


  const getSession = useCallback(async (sessionId: string): Promise<ChatSession | null> => {
    if (!effectiveUserId || !sessionId.startsWith(effectiveUserId + '_')) {
        console.warn(`getSession: Attempt to load session ${sessionId} for incorrect user ${effectiveUserId}.`);
        return null;
    }

    const metadataEntry = historyMetadata.find(m => m.id === sessionId);

    if (metadataEntry?.isDriveSession && metadataEntry.driveFileId && googleAccessToken && appDriveFolderId && authUser?.uid === effectiveUserId) {
        console.log(`getSession: Attempting to fetch session ${sessionId} (Drive ID: ${metadataEntry.driveFileId}) from Google Drive.`);
        const driveSession = await getSessionFromDrive(googleAccessToken, metadataEntry.driveFileId); 
        
        if (driveSession) {
            console.log(`getSession: Successfully fetched session ${sessionId} from Drive.`);
             try { 
                const leanSessionForStorage: Partial<ChatSession> = { // Only store essentials
                    id: driveSession.id,
                    name: driveSession.name,
                    createdAt: driveSession.createdAt,
                    updatedAt: driveSession.updatedAt,
                    userId: driveSession.userId,
                    driveFileId: driveSession.driveFileId,
                    messages: driveSession.messages.map(msg => ({ // Lean messages
                        id: msg.id,
                        role: msg.role,
                        content: typeof msg.content === 'string' ? msg.content.substring(0,100) : "[Structured Content]", // Preview only
                        timestamp: msg.timestamp,
                    })),
                };
                localStorage.setItem(`${CHAT_SESSION_PREFIX_LS}${sessionId}`, JSON.stringify(leanSessionForStorage));
            } catch (e) { console.error("Error caching Drive session (lean) to localStorage", e); }
            return driveSession; // Return full session
        }
        console.warn(`getSession: Failed to fetch session ${sessionId} from Drive using Drive ID ${metadataEntry.driveFileId}. Trying localStorage.`);
    }

    console.log(`getSession: Attempting to fetch session ${sessionId} from localStorage.`);
    try {
      const storedSession = localStorage.getItem(`${CHAT_SESSION_PREFIX_LS}${sessionId}`);
      if (storedSession) {
        const parsedSession: ChatSession = JSON.parse(storedSession);
        // If it was supposed to be a Drive session but failed to load from Drive,
        // ensure its metadata is updated if this local version is used.
        if (metadataEntry?.isDriveSession && !parsedSession.driveFileId) {
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
  }, [effectiveUserId, googleAccessToken, appDriveFolderId, historyMetadata, authUser?.uid]);

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
            // No firstAssistantMessage needed for this version of name generation.
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
    
    // Prepare a lean version for localStorage to avoid quota issues.
    const sessionForLocalStorage: ChatSession = {
      ...sessionToUpdateInMemory,
      messages: sessionToUpdateInMemory.messages.map(msg => {
        if (msg.attachedFiles && msg.attachedFiles.length > 0) {
          return {
            ...msg,
            attachedFiles: msg.attachedFiles.map(file => {
              const leanFile: AttachedFile = {
                name: file.name,
                type: file.type,
                size: file.size,
                // Truncate textContent, remove dataUri for localStorage
                textContent: file.textContent ? file.textContent.substring(0, 500) + (file.textContent.length > 500 ? '...' : '') : undefined,
                dataUri: undefined, 
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
      console.log(`saveSession: Session ${sessionForLocalStorage.id} saved to localStorage.`);
    } catch (error) {
      if (isQuotaExceededError(error)) {
        console.error(`saveSession: Failed to save session ${sessionForLocalStorage.id} to localStorage due to quota exceeded.`, error);
         toast({
          title: "Local Storage Full",
          description: "Could not save chat session locally. Storage quota exceeded.",
          variant: "destructive",
        });
      } else {
        console.error(`saveSession: Failed to save session ${sessionForLocalStorage.id} to localStorage:`, error);
        toast({
          title: "Local Save Error",
          description: "Could not save chat session locally.",
          variant: "destructive",
        });
      }
    }

    let driveSavedSuccessfully = false;
    let actualDriveFileIdFromSave: string | undefined = sessionToUpdateInMemory.driveFileId;

    if (googleAccessToken && appDriveFolderId && authUser && authUser.uid === effectiveUserId) {
      console.log(`saveSession: Attempting to save session ${sessionToUpdateInMemory.id} (App ID) to Google Drive.`);
      try {
        // Pass the full sessionToUpdateInMemory (with potentially full dataUris) to Drive
        const driveFile = await saveSessionToDrive(googleAccessToken, appDriveFolderId, sessionToUpdateInMemory.id, sessionToUpdateInMemory); 
        if (driveFile && driveFile.id) {
          console.log(`saveSession: Session ${sessionToUpdateInMemory.id} saved to Drive. Drive File ID: ${driveFile.id}`);
          actualDriveFileIdFromSave = driveFile.id; // Update with the actual Drive File ID
          sessionToUpdateInMemory.driveFileId = driveFile.id; // Keep the in-memory session up-to-date
          driveSavedSuccessfully = true;
        } else {
          console.warn(`saveSession: Failed to save session ${sessionToUpdateInMemory.id} to Drive (saveSessionToDrive returned null/no ID).`);
           toast({
            title: "Google Drive Sync Issue",
            description: "Session was saved locally, but failed to sync to Google Drive.",
            variant: "default",
          });
        }
      } catch (driveError: any) {
        console.error(`saveSession: Error saving session ${sessionToUpdateInMemory.id} to Drive:`, driveError);
         toast({
            title: "Google Drive Sync Failed",
            description: `Session saved locally, but Drive sync failed: ${driveError.message}`,
            variant: "default", // Not destructive, as local save might have worked
        });
      }
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
        localStorage.setItem(CHAT_HISTORY_INDEX_KEY_LS, JSON.stringify(updatedFullHistory));
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
  }, [effectiveUserId, googleAccessToken, appDriveFolderId, authUser, toast, setHistoryMetadata]);


  const deleteSession = useCallback(async (sessionId: string) => {
    if (!effectiveUserId || !sessionId.startsWith(effectiveUserId + '_')) return;

    const sessionMetaToDelete = historyMetadata.find(meta => meta.id === sessionId);
    let driveDeleteSuccess = false;

    if (sessionMetaToDelete?.isDriveSession && sessionMetaToDelete.driveFileId && googleAccessToken && appDriveFolderId && authUser?.uid === effectiveUserId) {
        console.log(`deleteSession: Attempting to delete session ${sessionId} (Drive ID: ${sessionMetaToDelete.driveFileId}) from Google Drive.`);
        driveDeleteSuccess = await deleteFileFromDrive(googleAccessToken, sessionMetaToDelete.driveFileId);
        if (driveDeleteSuccess) {
            toast({ title: "Session Deleted", description: `Session "${sessionMetaToDelete.name || sessionId}" was also deleted from Google Drive.`});
        } else {
            toast({ title: "Drive Deletion Failed", description: `Could not delete session "${sessionMetaToDelete.name || sessionId}" from Google Drive. It has been removed locally.`, variant: "destructive"});
        }
    } else if (sessionMetaToDelete?.isDriveSession && !sessionMetaToDelete.driveFileId) {
        console.warn(`deleteSession: Session ${sessionId} is marked as Drive session but has no driveFileId. Cannot delete from Drive.`);
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
              console.error("deleteSession: Failed to update chat history index (localStorage) after deletion due to quota exceeded.", error);
            } else {
              console.error("deleteSession: Failed to update chat history index (localStorage) after deletion:", error);
            }
        }
        return finalHistory;
      });
      if (!sessionMetaToDelete?.isDriveSession || !googleAccessToken || !driveDeleteSuccess) { 
        if (!(sessionMetaToDelete?.isDriveSession && driveDeleteSuccess)) {
            toast({ title: "Session Deleted", description: `Session "${sessionMetaToDelete?.name || sessionId}" removed locally.`});
        }
      }
    } catch (error) {
      console.error(`deleteSession: Failed to delete session ${sessionId} from localStorage:`, error);
      toast({ title: "Local Deletion Error", description: `Could not delete session "${sessionMetaToDelete?.name || sessionId}" locally.`, variant: "destructive"});
    }
  }, [effectiveUserId, googleAccessToken, appDriveFolderId, authUser?.uid, historyMetadata, toast, setHistoryMetadata]);


  const createNewSession = useCallback((initialMessages: ChatMessage[] = [], modelIdForNameGeneration?: string, userApiKeyForNameGen?: string): ChatSession => {
    if (!effectiveUserId) {
        console.error("createNewSession called without an effectiveUserId. This should not happen.");
        const tempId = `temp_error_no_user_${Date.now()}_${Math.random().toString(36).substring(2,11)}`;
         return {
          id: tempId,
          name: 'New Chat (Error - No User)',
          messages: [],
          createdAt: Date.now(),
          updatedAt: Date.now(),
          userId: "unknown_error_user",
        };
    }
    const newSessionId = `${effectiveUserId}_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
    const now = Date.now();
    const newSession: ChatSession = {
      id: newSessionId,
      name: 'New Chat',
      messages: initialMessages,
      createdAt: now,
      updatedAt: now,
      userId: effectiveUserId,
      // driveFileId will be set upon successful save to Drive
    };
    
    saveSession(newSession, true, modelIdForNameGeneration || DEFAULT_MODEL_ID, userApiKeyForNameGen); 
    return newSession;
  }, [effectiveUserId, saveSession]);


  const syncWithDrive = useCallback(async (): Promise<'SUCCESS' | 'TOKEN_REFRESH_NEEDED' | 'FAILED'> => {
    setIsSyncing(true);
    if (!authUser || !authUser.uid) {
        toast({ title: "Sync Unavailable", description: "Please log in to sync with Google Drive.", variant: "default" });
        setIsSyncing(false);
        return 'FAILED';
    }
    if (authUser.uid !== effectiveUserId) {
        toast({ title: "Sync User Mismatch", description: "Cannot sync, active user differs from Google authenticated user.", variant: "destructive" });
        setIsSyncing(false);
        return 'FAILED';
    }
    if (!googleAccessToken) {
        console.warn("syncWithDrive: Google access token not available. Requesting re-authentication.");
        toast({ title: "Google Sign-In Required", description: "Please sign in with Google again to enable Drive sync.", variant: "default" });
        setIsSyncing(false);
        return 'TOKEN_REFRESH_NEEDED';
    }

    toast({ title: "Syncing with Google Drive...", description: "Please wait." });

    let currentAppDriveFolderId = appDriveFolderId;
    if (!currentAppDriveFolderId) {
        console.log("syncWithDrive: appDriveFolderId not set, attempting to initialize.");
        try {
            const folderId = await initializeDriveFolder(googleAccessToken); 
            if (folderId) {
                currentAppDriveFolderId = folderId; // This sets the state via initializeDriveFolder
                console.log("syncWithDrive: appDriveFolderId successfully initialized:", folderId);
            } else { 
                toast({ title: "Drive Folder Error", description: "Could not initialize Drive folder. Sync aborted.", variant: "destructive" });
                setIsSyncing(false);
                return 'FAILED';
            }
        } catch (error: any) {
            toast({ title: "Drive Folder Error", description: `Could not initialize Drive folder: ${error.message || 'Unknown error'}. Sync aborted.`, variant: "destructive" });
            setIsSyncing(false);
            return 'FAILED';
        }
    }
    
    try {
      console.log("syncWithDrive: Folder ID confirmed. Re-triggering history load for full sync effect.");
      await loadHistoryIndex(currentAppDriveFolderId, googleAccessToken); 

      // Optionally, iterate through local sessions and ensure they are on Drive if not already
      const localSessionsIndex = JSON.parse(localStorage.getItem(CHAT_HISTORY_INDEX_KEY_LS) || '[]') as ChatSessionMetadata[];
      const userLocalSessions = localSessionsIndex.filter(meta => meta.id.startsWith(effectiveUserId + '_'));

      for (const localMeta of userLocalSessions) {
        const driveMatch = historyMetadata.find(driveMeta => driveMeta.id === localMeta.id && driveMeta.isDriveSession);
        if (!driveMatch) {
          console.log(`syncWithDrive: Local session ${localMeta.id} not found on Drive (or not marked as Drive session). Attempting to upload.`);
          const fullLocalSession = await getSession(localMeta.id); // Fetch full local session
          if (fullLocalSession && currentAppDriveFolderId) {
            await saveSessionToDrive(googleAccessToken, currentAppDriveFolderId, fullLocalSession.id, fullLocalSession);
          }
        }
      }
      // Re-load index one last time after potential uploads
      await loadHistoryIndex(currentAppDriveFolderId, googleAccessToken);


      toast({ title: "Sync Complete", description: "Checked for updates with Google Drive." });
      setIsSyncing(false);
      return 'SUCCESS';
    } catch (error: any) {
      console.error("Error during Sync with Drive (post-folder check):", error);
      toast({
        title: "Sync Failed",
        description: error.message || "An unknown error occurred during sync.",
        variant: "destructive",
      });
      setIsSyncing(false);
      return 'FAILED';
    }
  }, [googleAccessToken, appDriveFolderId, authUser, effectiveUserId, toast, initializeDriveFolder, loadHistoryIndex, historyMetadata, getSession]);


  return { historyMetadata, isLoading, getSession, saveSession, deleteSession, createNewSession, loadHistoryIndex, appDriveFolderId, initializeDriveFolder, syncWithDrive, isSyncing, triggerGoogleSignIn };
}
