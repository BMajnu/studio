
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
    return message.content.substring(0, 50) || "Chat started";
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
    
    let combinedMetadata: ChatSessionMetadata[] = [];
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

          if (seenIds.has(fileSessionId)) continue; // Already processed a better version or local version

          const fullSession = await getSessionFromDrive(googleAccessToken, file.id);
          if (fullSession) {
            combinedMetadata.push({
              id: fullSession.id,
              name: fullSession.name || `Chat from Drive ${new Date(fullSession.createdAt).toLocaleDateString()}`,
              lastMessageTimestamp: file.modifiedTime ? new Date(file.modifiedTime).getTime() : fullSession.updatedAt,
              preview: getMessageTextPreview(fullSession.messages[fullSession.messages.length - 1]),
              messageCount: fullSession.messages.length,
              isDriveSession: true,
            });
            seenIds.add(fullSession.id);
          } else {
             // Fallback if full session fetch fails, use minimal info
            combinedMetadata.push({
              id: fileSessionId,
              name: `Drive: ${fileSessionId.substring(0,15)}...`, // Basic name from file ID
              lastMessageTimestamp: file.modifiedTime ? new Date(file.modifiedTime).getTime() : Date.now(),
              preview: "Session from Google Drive (details unavailable)",
              messageCount: 0, // Unknown
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
      const userLocalHistoryFromStorage = localParsedIndex.filter((meta) => meta && meta.id && meta.id.startsWith(effectiveUserId + '_'));
      
      for (const localMeta of userLocalHistoryFromStorage) {
        if (!seenIds.has(localMeta.id)) {
          // Item is only in local storage
          combinedMetadata.push({...localMeta, isDriveSession: false});
          seenIds.add(localMeta.id);
        } else {
          // Item ID was also found on Drive. Merge/update.
          const existingIndex = combinedMetadata.findIndex(m => m.id === localMeta.id);
          if (existingIndex !== -1) {
            const driveMeta = combinedMetadata[existingIndex];
             if (localMeta.lastMessageTimestamp > driveMeta.lastMessageTimestamp) {
                combinedMetadata[existingIndex] = {
                    ...localMeta, // Prioritize local if newer
                    isDriveSession: true, // It exists on Drive
                };
            }
          }
        }
      }
    } catch (error) {
      console.error("Failed to load/merge chat history index from localStorage:", error);
    }
    
    const finalDedupedAndSortedMetadata = deduplicateMetadata(combinedMetadata);
    setHistoryMetadata(finalDedupedAndSortedMetadata);
    setIsLoading(false);
  }, [effectiveUserId, googleAccessToken, appDriveFolderId, authUser]);


  useEffect(() => {
     if (effectiveUserId) {
        if (!authUser || (authUser?.uid === effectiveUserId && googleAccessToken && appDriveFolderId) || (!googleAccessToken && !authUser)) {
            loadHistoryIndex();
        }
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
                    // Cache to localStorage for faster subsequent access if needed,
                    // but Drive is source of truth for isDriveSession=true
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
          // Fallback name if AI fails
          if (sessionToUpdateInMemory.name === "New Chat") {
             const date = new Date(sessionToUpdateInMemory.createdAt);
             sessionToUpdateInMemory.name = `Chat ${date.toLocaleDateString()} ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
          }
        }
      } else if (sessionToUpdateInMemory.name === "New Chat") { // If no user message yet, but we're saving
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
      // Even if localStorage fails, attempt Drive save if possible
    }

    let driveSavedSuccessfully = false;
    if (googleAccessToken && appDriveFolderId && authUser && authUser.uid === effectiveUserId) {
      console.log(`useChatHistory: Attempting to save session ${sessionToUpdateInMemory.id} to Google Drive.`);
      try {
        const driveFile = await saveSessionToDrive(googleAccessToken, appDriveFolderId, sessionToUpdateInMemory.id, sessionToUpdateInMemory); // Save full session to Drive
        if (driveFile) {
          console.log(`useChatHistory: Session ${sessionToUpdateInMemory.id} saved to Drive. File ID: ${driveFile.id}`);
          driveSavedSuccessfully = true;
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
      const newMeta: ChatSessionMetadata = {
        id: sessionToUpdateInMemory.id,
        name: sessionToUpdateInMemory.name || `Chat ${new Date(sessionToUpdateInMemory.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
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


  const deleteSession = useCallback((sessionId: string) => {
    if (!effectiveUserId || !sessionId.startsWith(effectiveUserId + '_')) return;
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
      // TODO: Implement delete from Google Drive if metadataEntry.isDriveSession
    } catch (error) {
      console.error(`Failed to delete session ${sessionId} from localStorage:`, error);
    }
  }, [effectiveUserId, setHistoryMetadata]);


  const createNewSession = useCallback((initialMessages: ChatMessage[] = [], modelIdForNameGeneration?: string, userApiKeyForNameGen?: string): ChatSession => {
    if (!effectiveUserId) {
        console.error("createNewSession called without an effectiveUserId.");
        const tempId = `temp_error_no_user_${Date.now()}_${Math.random().toString(36).substring(2,11)}`;
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
    // Save session (which also triggers name generation if needed)
    // This will also update historyMetadata
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
            const folderId = await ensureAppFolderExists(googleAccessToken);
            if (folderId) {
                setAppDriveFolderId(folderId);
                currentAppDriveFolderId = folderId;
            } else {
                throw new Error("Failed to ensure Drive app folder exists during sync attempt.");
            }
        } catch (error: any) {
            toast({ title: "Drive Folder Error", description: `Could not initialize Drive folder: ${error.message || 'Unknown error'}. Sync aborted.`, variant: "destructive" });
            setIsSyncing(false);
            return;
        }
    }
    
    try {
      const driveFiles = await listSessionFilesFromDrive(googleAccessToken, currentAppDriveFolderId);
      if (driveFiles === null) {
        throw new Error("Failed to list session files from Google Drive.");
      }

      const driveMetadataMap = new Map<string, ChatSessionMetadata>();
      for (const file of driveFiles) {
        if (!file || !file.name || !file.id) continue;
        const fileSessionId = file.name.replace('session_', '').replace('.json', '');
        if (!fileSessionId.startsWith(effectiveUserId + '_')) continue;
        
        const fullSession = await getSessionFromDrive(googleAccessToken, file.id);
        if (fullSession) {
            driveMetadataMap.set(fullSession.id, {
                id: fullSession.id,
                name: fullSession.name || `Unnamed Drive Session ${new Date(fullSession.createdAt).toLocaleDateString()}`,
                lastMessageTimestamp: file.modifiedTime ? new Date(file.modifiedTime).getTime() : fullSession.updatedAt,
                preview: getMessageTextPreview(fullSession.messages[fullSession.messages.length - 1]),
                messageCount: fullSession.messages.length,
                isDriveSession: true,
            });
        } else {
            // Minimal metadata if full fetch fails
            driveMetadataMap.set(fileSessionId, {
                id: fileSessionId,
                name: `Drive: ${fileSessionId.substring(0,15)}...`,
                lastMessageTimestamp: file.modifiedTime ? new Date(file.modifiedTime).getTime() : Date.now(),
                preview: "Session from Google Drive (details unavailable)",
                messageCount: 0,
                isDriveSession: true,
            });
        }
      }
      
      const localIndexString = localStorage.getItem(CHAT_HISTORY_INDEX_KEY_LS);
      const localIndex: ChatSessionMetadata[] = localIndexString ? JSON.parse(localIndexString) : [];
      const userLocalHistory = localIndex.filter(meta => meta && meta.id && meta.id.startsWith(effectiveUserId + '_'));
      const dedupedUserLocalHistory = deduplicateMetadata(userLocalHistory); // Deduplicate local first

      let combinedHistory: ChatSessionMetadata[] = Array.from(driveMetadataMap.values());
      const processedIdsFromDrive = new Set<string>(driveMetadataMap.keys());

      for (const localMeta of dedupedUserLocalHistory) {
        const driveVersion = driveMetadataMap.get(localMeta.id);
        if (driveVersion) { // Exists on Drive and Local
          const existingIndex = combinedHistory.findIndex(ch => ch.id === localMeta.id);
          if (localMeta.lastMessageTimestamp > driveVersion.lastMessageTimestamp) {
            // Local is newer, update combined history to reflect local and upload local to Drive
            if (existingIndex !== -1) {
              combinedHistory[existingIndex] = { ...localMeta, isDriveSession: true };
            }
            const fullLocalSession = await getSession(localMeta.id); // getSession will fetch from LS
            if (fullLocalSession) {
              await saveSessionToDrive(googleAccessToken, currentAppDriveFolderId, fullLocalSession.id, fullLocalSession);
            }
          } else if (driveVersion.lastMessageTimestamp > localMeta.lastMessageTimestamp) {
             // Drive is newer, update local storage with Drive's version
             const fullDriveSession = await getSessionFromDrive(googleAccessToken, driveFiles.find(f => f.name === `session_${driveVersion.id}.json`)!.id);
             if (fullDriveSession) {
                if (existingIndex !== -1) { // Update combined history with Drive's (already there mostly)
                  combinedHistory[existingIndex] = {
                    id: fullDriveSession.id,
                    name: fullDriveSession.name,
                    lastMessageTimestamp: fullDriveSession.updatedAt,
                    preview: getMessageTextPreview(fullDriveSession.messages[fullDriveSession.messages.length-1]),
                    messageCount: fullDriveSession.messages.length,
                    isDriveSession: true,
                  };
                }
                // Update local storage
                localStorage.setItem(`${CHAT_SESSION_PREFIX_LS}${fullDriveSession.id}`, JSON.stringify(fullDriveSession));
             }
          }
          // If timestamps are equal, prefer Drive's version if names/previews differ significantly, or keep as is
        } else { // Exists only in Local storage
          combinedHistory.push({ ...localMeta, isDriveSession: false }); // Initially mark as not Drive synced
          // Upload local session to Drive
          const fullLocalSession = await getSession(localMeta.id);
          if (fullLocalSession) {
            const savedDriveFile = await saveSessionToDrive(googleAccessToken, currentAppDriveFolderId, fullLocalSession.id, fullLocalSession);
            if (savedDriveFile) { // If successfully saved to drive, update metadata
                const idx = combinedHistory.findIndex(ch => ch.id === fullLocalSession.id);
                if(idx !== -1) combinedHistory[idx].isDriveSession = true;
            }
          }
        }
        processedIdsFromDrive.add(localMeta.id); // Mark as processed
      }
      
      const finalHistory = deduplicateMetadata(combinedHistory);
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
  }, [googleAccessToken, appDriveFolderId, authUser, effectiveUserId, toast, setAppDriveFolderId, setHistoryMetadata, getSession]);


  return { historyMetadata, isLoading, getSession, saveSession, deleteSession, createNewSession, loadHistoryIndex, appDriveFolderId, initializeDriveFolder, syncWithDrive, isSyncing };
}

    