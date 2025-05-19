
// src/lib/hooks/use-chat-history.ts
"use client";

import { useState, useEffect, useCallback } from 'react';
import type { ChatSession, ChatSessionMetadata, ChatMessage, AttachedFile, DriveFile } from '@/lib/types';
import { DEFAULT_USER_ID, DEFAULT_MODEL_ID } from '@/lib/constants';
import { generateChatName, type GenerateChatNameInput } from '@/ai/flows/generate-chat-name-flow';
import { useAuth } from '@/contexts/auth-context';
import { ensureAppFolderExists, saveSessionToDrive, listSessionFilesFromDrive, getSessionFromDrive } from '@/lib/services/drive-service';
import { useToast } from '@/hooks/use-toast';

const CHAT_HISTORY_INDEX_KEY_LS = 'desainr_chat_history_index_ls_v3';
const CHAT_SESSION_PREFIX_LS = 'desainr_chat_session_ls_v3_';

const getMessageTextPreview = (message: ChatMessage | undefined): string => {
  if (!message) return 'New Chat';
  if (typeof message.content === 'string') {
    return message.content.substring(0, 50);
  }
  if (Array.isArray(message.content)) {
    for (const part of message.content) {
        switch (part.type) {
            case 'text':
                if (part.text) return part.text.substring(0, 50);
                break;
            case 'code':
                if (part.title) return `Code: ${part.title.substring(0, 40)}`;
                if (part.code) return `Code: ${part.code.substring(0, 40)}`;
                break;
            case 'list':
                if (part.title) return `List: ${part.title.substring(0, 40)}`;
                if (part.items && part.items.length > 0) return `List: ${part.items[0].substring(0, 40)}`;
                break;
            case 'translation_group':
                if (part.title) return `Analysis: ${part.title.substring(0, 40)}`;
                if (part.english?.analysis) return `Eng Analysis: ${part.english.analysis.substring(0, 30)}`;
                break;
        }
    }
    if (message.attachedFiles && message.attachedFiles.length > 0) {
        return `Attached: ${message.attachedFiles[0].name.substring(0, 40)}`;
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
  }, [googleAccessToken, authUser, appDriveFolderId, toast]);

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
    
    const seenIds = new Set<string>();
    const uniqueCombinedMetadata: ChatSessionMetadata[] = [];

    if (googleAccessToken && appDriveFolderId && authUser?.uid === effectiveUserId) {
      console.log("useChatHistory: Attempting to load session list from Google Drive.");
      const driveFiles = await listSessionFilesFromDrive(googleAccessToken, appDriveFolderId);
      if (driveFiles) {
        const driveMetadataList = driveFiles.map((file: DriveFile) => {
          const fileSessionId = file.name.replace('session_', '').replace('.json', '');
          return {
            id: fileSessionId,
            name: file.name.replace('session_', '').replace('.json', '').substring(0,50), // Placeholder, full name might be in file content
            lastMessageTimestamp: file.modifiedTime ? new Date(file.modifiedTime).getTime() : Date.now(),
            preview: "From Google Drive",
            messageCount: 0, // Placeholder, full count from file content
            isDriveSession: true,
          };
        }).filter(meta => meta.id.startsWith(effectiveUserId + '_'));
        
        driveMetadataList.forEach(driveMeta => {
            if (!seenIds.has(driveMeta.id)) {
                uniqueCombinedMetadata.push(driveMeta);
                seenIds.add(driveMeta.id);
            }
        });
        console.log(`useChatHistory: Processed ${driveMetadataList.length} session metadata entries from Drive. Unique count: ${uniqueCombinedMetadata.length}`);
      } else {
        console.warn("useChatHistory: Failed to load session list from Google Drive or no files found.");
      }
    }

    try {
      const storedIndex = localStorage.getItem(CHAT_HISTORY_INDEX_KEY_LS);
      const localParsedIndex: ChatSessionMetadata[] = storedIndex ? JSON.parse(storedIndex) : [];
      const userLocalHistory = localParsedIndex.filter((meta) => meta.id.startsWith(effectiveUserId + '_'));
      
      userLocalHistory.forEach(localMeta => {
        if (!seenIds.has(localMeta.id)) {
          uniqueCombinedMetadata.push({...localMeta, isDriveSession: false});
          seenIds.add(localMeta.id);
        } else {
          const existingIndex = uniqueCombinedMetadata.findIndex(m => m.id === localMeta.id);
          if (existingIndex !== -1) {
            const existingMeta = uniqueCombinedMetadata[existingIndex];
            if (localMeta.lastMessageTimestamp > existingMeta.lastMessageTimestamp || 
                (existingMeta.preview === "From Google Drive" && localMeta.preview !== "From Google Drive")) {
              uniqueCombinedMetadata[existingIndex] = {
                ...localMeta,
                isDriveSession: existingMeta.isDriveSession,
                lastMessageTimestamp: Math.max(localMeta.lastMessageTimestamp, existingMeta.lastMessageTimestamp)
              };
            }
          }
        }
      });
    } catch (error) {
      console.error("Failed to load/merge chat history index from localStorage:", error);
    }
    
    setHistoryMetadata(uniqueCombinedMetadata.sort((a,b) => b.lastMessageTimestamp - a.lastMessageTimestamp));
    setIsLoading(false);
  }, [effectiveUserId, googleAccessToken, appDriveFolderId, authUser]);

  useEffect(() => {
     if (effectiveUserId && (!authUser || (googleAccessToken && appDriveFolderId) || (!googleAccessToken && !authUser))) {
        loadHistoryIndex();
    }
  }, [effectiveUserId, googleAccessToken, appDriveFolderId, authUser, loadHistoryIndex]);


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
                    // Cache to localStorage for faster subsequent loads if needed
                    localStorage.setItem(`${CHAT_SESSION_PREFIX_LS}${sessionId}`, JSON.stringify(driveSession));
                } catch (e) { console.error("Error caching Drive session to localStorage", e); }
                return driveSession;
            }
            console.warn(`getSession: Failed to fetch session ${sessionId} from Drive using file ID ${targetDriveFile.id}, trying localStorage fallback.`);
        } else {
             console.warn(`getSession: Could not find Drive file ID for session ${sessionId} name. Trying localStorage fallback.`);
        }
    }

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
        return session;
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
          if (sessionToUpdateInMemory.name === "New Chat") {
             const date = new Date(sessionToUpdateInMemory.createdAt);
             sessionToUpdateInMemory.name = `Chat ${date.toLocaleDateString()} ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
          }
        }
      } else if (sessionToUpdateInMemory.name === "New Chat") {
          const date = new Date(sessionToUpdateInMemory.createdAt);
          sessionToUpdateInMemory.name = `Chat ${date.toLocaleDateString()} ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
      }
    }
    
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
    }

    let driveSaved = false;
    if (googleAccessToken && appDriveFolderId && authUser && authUser.uid === effectiveUserId) {
      console.log(`useChatHistory: Attempting to save session ${sessionToUpdateInMemory.id} to Google Drive.`);
      try {
        const driveFile = await saveSessionToDrive(googleAccessToken, appDriveFolderId, sessionToUpdateInMemory.id, sessionToUpdateInMemory);
        if (driveFile) {
          console.log(`useChatHistory: Session ${sessionToUpdateInMemory.id} saved to Drive. File ID: ${driveFile.id}`);
          driveSaved = true;
        } else {
          console.warn(`useChatHistory: Failed to save session ${sessionToUpdateInMemory.id} to Drive (saveSessionToDrive returned null).`);
          toast({
            title: "Google Drive Sync Issue",
            description: "Session was saved locally, but failed to sync to Google Drive.",
            variant: "default",
          });
        }
      } catch (driveError: any) {
        console.error(`useChatHistory: Error saving session ${sessionToUpdateInMemory.id} to Drive:`, driveError);
        toast({
            title: "Google Drive Sync Failed",
            description: `Session saved locally, but Drive sync failed: ${driveError.message}`,
            variant: "default",
        });
      }
    }


    setHistoryMetadata(prev => {
      const userSpecificPrev = prev.filter(meta => meta.id.startsWith(effectiveUserId + '_'));
      const existingIndex = userSpecificPrev.findIndex(meta => meta.id === sessionToUpdateInMemory.id);
      
      const newMeta: ChatSessionMetadata = {
        id: sessionToUpdateInMemory.id,
        name: sessionToUpdateInMemory.name || `Chat ${new Date(sessionToUpdateInMemory.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
        lastMessageTimestamp: sessionToUpdateInMemory.updatedAt,
        preview: getMessageTextPreview(sessionToUpdateInMemory.messages[sessionToUpdateInMemory.messages.length - 1]),
        messageCount: sessionToUpdateInMemory.messages.length,
        isDriveSession: driveSaved || (existingIndex > -1 ? userSpecificPrev[existingIndex].isDriveSession : false)
      };

      let updatedUserHistory;
      if (existingIndex > -1) {
        updatedUserHistory = [...userSpecificPrev];
        updatedUserHistory[existingIndex] = newMeta;
      } else {
        updatedUserHistory = [newMeta, ...userSpecificPrev];
      }
      const sortedUserHistory = updatedUserHistory.sort((a,b) => b.lastMessageTimestamp - a.lastMessageTimestamp);
      
      try {
        const globalIndexStr = localStorage.getItem(CHAT_HISTORY_INDEX_KEY_LS);
        const globalIndex = globalIndexStr ? JSON.parse(globalIndexStr) : [];
        const otherUserHistories = globalIndex.filter((meta: ChatSessionMetadata) => !meta.id.startsWith(effectiveUserId + '_'));
        const newGlobalIndex = [...otherUserHistories, ...sortedUserHistory].sort((a,b) => b.lastMessageTimestamp - a.lastMessageTimestamp);
        localStorage.setItem(CHAT_HISTORY_INDEX_KEY_LS, JSON.stringify(newGlobalIndex));
      } catch (error) {
         if (isQuotaExceededError(error)) {
            console.error("Failed to save chat history index to localStorage due to quota exceeded.", error);
          } else {
            console.error("Failed to save chat history index to localStorage:", error);
          }
      }
      return sortedUserHistory;
    });
    return sessionToUpdateInMemory;
  }, [effectiveUserId, googleAccessToken, appDriveFolderId, authUser, toast]);

  const deleteSession = useCallback((sessionId: string) => {
    if (!effectiveUserId || !sessionId.startsWith(effectiveUserId + '_')) return;
    try {
      localStorage.removeItem(`${CHAT_SESSION_PREFIX_LS}${sessionId}`);
      setHistoryMetadata(prev => {
        const updatedUserHistory = prev.filter(meta => meta.id !== sessionId && meta.id.startsWith(effectiveUserId + '_'));
        try {
          const globalIndexStr = localStorage.getItem(CHAT_HISTORY_INDEX_KEY_LS);
          const globalIndex = globalIndexStr ? JSON.parse(globalIndexStr) : [];
          const otherUserHistories = globalIndex.filter((meta: ChatSessionMetadata) => !meta.id.startsWith(effectiveUserId + '_'));
          const newGlobalIndex = [...otherUserHistories, ...updatedUserHistory].sort((a,b) => b.lastMessageTimestamp - a.lastMessageTimestamp);
          localStorage.setItem(CHAT_HISTORY_INDEX_KEY_LS, JSON.stringify(newGlobalIndex));
        } catch (error) {
           if (isQuotaExceededError(error)) {
              console.error("Failed to update chat history index (localStorage) after deletion due to quota exceeded.", error);
            } else {
              console.error("Failed to update chat history index (localStorage) after deletion:", error);
            }
        }
        return updatedUserHistory;
      });
    } catch (error) {
      console.error(`Failed to delete session ${sessionId} from localStorage:`, error);
    }
  }, [effectiveUserId, setHistoryMetadata]);

  const createNewSession = useCallback((initialMessages: ChatMessage[] = [], modelIdForNameGeneration?: string, userApiKeyForNameGen?: string): ChatSession => {
    if (!effectiveUserId) {
        console.error("createNewSession called without an effectiveUserId.");
        const tempId = `temp_error_no_user_${Date.now()}_${Math.random().toString(36).substring(2,7)}`;
         return {
          id: tempId,
          name: 'New Chat (Error)',
          messages: [],
          createdAt: Date.now(),
          updatedAt: Date.now(),
          userId: "unknown_error",
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
    };
    saveSession(newSession, true, modelIdForNameGeneration || DEFAULT_MODEL_ID, userApiKeyForNameGen); 
    return newSession;
  }, [effectiveUserId, saveSession]);

  const syncWithDrive = useCallback(async () => {
    if (!googleAccessToken || !authUser || authUser.uid !== effectiveUserId) {
      toast({
        title: "Sync Unavailable",
        description: "Please ensure you are fully logged in with Google to sync with Drive.",
        variant: "default",
      });
      setIsSyncing(false);
      return;
    }

    setIsSyncing(true);
    toast({ title: "Syncing with Google Drive...", description: "Please wait." });

    let currentAppDriveFolderId = appDriveFolderId;

    if (!currentAppDriveFolderId) {
      console.log("syncWithDrive: appDriveFolderId not set, attempting to ensure it exists...");
      try {
        const folderId = await ensureAppFolderExists(googleAccessToken);
        if (folderId) {
          setAppDriveFolderId(folderId);
          currentAppDriveFolderId = folderId;
          console.log("syncWithDrive: App Drive folder ID ensured/retrieved:", folderId);
        } else {
          throw new Error("Failed to ensure Drive app folder exists during sync attempt.");
        }
      } catch (error: any) {
        console.error("syncWithDrive: Error ensuring app folder exists:", error);
        toast({
          title: "Drive Folder Error",
          description: `Could not access or create app folder in Google Drive: ${error.message || 'Unknown error'}. Sync aborted.`,
          variant: "destructive",
        });
        setIsSyncing(false);
        return;
      }
    }
    
    if (!currentAppDriveFolderId) {
        toast({
            title: "Sync Failed",
            description: "Google Drive folder ID is still missing after attempt. Cannot proceed with sync.",
            variant: "destructive",
        });
        setIsSyncing(false);
        return;
    }
    
    try {
      const driveFiles = await listSessionFilesFromDrive(googleAccessToken, currentAppDriveFolderId);
      if (driveFiles === null) {
        throw new Error("Failed to list session files from Google Drive.");
      }

      const driveMetadataFromFiles: ChatSessionMetadata[] = driveFiles.map((file: DriveFile) => {
        const fileSessionId = file.name.replace('session_', '').replace('.json', '');
        return {
          id: fileSessionId,
          name: file.name.replace('session_', '').replace('.json', '').substring(0, 50),
          lastMessageTimestamp: file.modifiedTime ? new Date(file.modifiedTime).getTime() : Date.now(),
          preview: "From Google Drive",
          messageCount: 0,
          isDriveSession: true,
        };
      }).filter(meta => meta.id.startsWith(effectiveUserId + '_'));
      
      let mergedMetadata = [...driveMetadataFromFiles];
      const seenDriveIds = new Set(driveMetadataFromFiles.map(m => m.id));

      try {
        const storedIndex = localStorage.getItem(CHAT_HISTORY_INDEX_KEY_LS);
        const localParsedIndex: ChatSessionMetadata[] = storedIndex ? JSON.parse(storedIndex) : [];
        const userLocalHistory = localParsedIndex.filter((meta) => meta.id.startsWith(effectiveUserId + '_'));

        for (const localMeta of userLocalHistory) {
          if (!seenDriveIds.has(localMeta.id)) {
            mergedMetadata.push({ ...localMeta, isDriveSession: false });
            const localSessionData = localStorage.getItem(`${CHAT_SESSION_PREFIX_LS}${localMeta.id}`);
            if (localSessionData && googleAccessToken && currentAppDriveFolderId && authUser) {
              try {
                const fullSession: ChatSession = JSON.parse(localSessionData);
                 console.log(`Sync: Attempting to upload local-only session ${fullSession.id} to Drive.`);
                 await saveSessionToDrive(googleAccessToken, currentAppDriveFolderId, fullSession.id, fullSession)
                   .then(savedFile => {
                     if (savedFile) {
                       console.log(`Sync: Successfully uploaded local session ${fullSession.id} to Drive.`);
                       setHistoryMetadata(prev => prev.map(m => m.id === fullSession.id ? {...m, isDriveSession: true} : m));
                     }
                   });
              } catch (e) { console.error(`Sync: Error parsing or saving local session ${localMeta.id} to Drive.`, e); }
            }
          } else {
             const driveEntryIndex = mergedMetadata.findIndex(dm => dm.id === localMeta.id);
             if (driveEntryIndex !== -1) {
                const driveEntry = mergedMetadata[driveEntryIndex];
                if (localMeta.lastMessageTimestamp > driveEntry.lastMessageTimestamp || 
                    (driveEntry.preview === "From Google Drive" && localMeta.preview !== "From Google Drive")) {
                    mergedMetadata[driveEntryIndex] = {
                        ...localMeta,
                        isDriveSession: true,
                        lastMessageTimestamp: Math.max(localMeta.lastMessageTimestamp, driveEntry.lastMessageTimestamp)
                    };
                }
             }
          }
        }
      } catch (e) { console.error("Sync: Error processing localStorage history during sync", e); }
      
      const sortedMergedMetadata = mergedMetadata.sort((a,b) => b.lastMessageTimestamp - a.lastMessageTimestamp);
      
      try {
        localStorage.setItem(CHAT_HISTORY_INDEX_KEY_LS, JSON.stringify(sortedMergedMetadata));
      } catch (error) {
        if (isQuotaExceededError(error)) {
          console.error("Failed to save updated chat history index to localStorage due to quota exceeded after Drive sync.", error);
        } else {
          console.error("Failed to save updated chat history index to localStorage after Drive sync:", error);
        }
      }
      setHistoryMetadata(sortedMergedMetadata);

      toast({ title: "Sync Complete", description: `Synced with Google Drive. ${sortedMergedMetadata.length} sessions found/merged.` });
      
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
  }, [googleAccessToken, appDriveFolderId, authUser, effectiveUserId, toast, setAppDriveFolderId, setHistoryMetadata]);


  return { historyMetadata, isLoading, getSession, saveSession, deleteSession, createNewSession, loadHistoryIndex, appDriveFolderId, initializeDriveFolder, syncWithDrive, isSyncing };
}

