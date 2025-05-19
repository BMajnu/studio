
// src/lib/hooks/use-chat-history.ts
"use client";

import { useState, useEffect, useCallback } from 'react';
import type { ChatSession, ChatSessionMetadata, ChatMessage, AttachedFile } from '@/lib/types';
import { DEFAULT_USER_ID, DEFAULT_MODEL_ID } from '@/lib/constants';
import { generateChatName, type GenerateChatNameInput } from '@/ai/flows/generate-chat-name-flow';
import { useAuth } from '@/contexts/auth-context';
import { ensureAppFolderExists, saveSessionToDrive, listSessionFilesFromDrive, getSessionFromDrive, type DriveFile } from '@/lib/services/drive-service';
import { useToast } from '@/hooks/use-toast';

const CHAT_HISTORY_INDEX_KEY_LS = 'desainr_chat_history_index_ls_v3'; // Incremented for safety
const CHAT_SESSION_PREFIX_LS = 'desainr_chat_session_ls_v3_'; // Incremented for safety

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
      setIsLoading(true); // Indicate loading while setting up Drive
      try {
        const folderId = await ensureAppFolderExists(googleAccessToken);
        if (folderId) {
          setAppDriveFolderId(folderId);
          console.log("useChatHistory: App Drive folder ID set:", folderId);
          // After folder is ensured, load initial history (which might now try Drive first)
          // loadHistoryIndex(); // This will be triggered by appDriveFolderId change
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
      } finally {
        setIsLoading(false); // Ensure loading is false after attempt
      }
    } else if (!googleAccessToken && authUser) {
      // Logged in but not with Google, or token lost
      setAppDriveFolderId(null);
    }
  }, [googleAccessToken, authUser, appDriveFolderId, toast]); // Removed setIsLoading from here, will be handled in loadHistoryIndex

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

    // Try loading from Google Drive first if available
    if (googleAccessToken && appDriveFolderId && authUser?.uid === effectiveUserId) {
      console.log("useChatHistory: Attempting to load session list from Google Drive.");
      const driveFiles = await listSessionFilesFromDrive(googleAccessToken, appDriveFolderId);
      if (driveFiles) {
        const driveMetadata = driveFiles.map(file => {
          // Extract session ID from filename: session_USERID_TIMESTAMP_RANDOM.json
          const parts = file.name.replace('session_', '').replace('.json', '').split('_');
          const fileSessionId = parts.join('_'); // Reconstruct full ID

          return {
            id: fileSessionId,
            name: file.name.replace('session_', '').replace('.json', '').substring(0,50), // Temporary name from filename
            lastMessageTimestamp: file.modifiedTime ? new Date(file.modifiedTime).getTime() : Date.now(), // Use Drive modified time
            preview: "From Google Drive", // Placeholder preview
            messageCount: 0, // Placeholder, needs full fetch or better manifest
            isDriveSession: true, // Mark as Drive session
          };
        }).filter(meta => meta.id.startsWith(effectiveUserId + '_')); // Ensure it's for current user
        combinedMetadata.push(...driveMetadata);
        console.log(`useChatHistory: Loaded ${driveMetadata.length} session metadata entries from Drive.`);
      } else {
        console.warn("useChatHistory: Failed to load session list from Google Drive or no files found.");
      }
    }

    // Load from localStorage and merge/de-duplicate
    try {
      const storedIndex = localStorage.getItem(CHAT_HISTORY_INDEX_KEY_LS);
      const localParsedIndex: ChatSessionMetadata[] = storedIndex ? JSON.parse(storedIndex) : [];
      const userLocalHistory = localParsedIndex.filter((meta) => meta.id.startsWith(effectiveUserId + '_'));
      
      userLocalHistory.forEach(localMeta => {
        if (!combinedMetadata.find(driveMeta => driveMeta.id === localMeta.id)) {
          combinedMetadata.push({...localMeta, isDriveSession: false}); // Add if not already from Drive
        }
      });
    } catch (error) {
      console.error("Failed to load/merge chat history index from localStorage:", error);
    }
    
    setHistoryMetadata(combinedMetadata.sort((a,b) => b.lastMessageTimestamp - a.lastMessageTimestamp));
    setIsLoading(false);
  }, [effectiveUserId, googleAccessToken, appDriveFolderId, authUser]);

  useEffect(() => {
    // Load history when user/drive status changes
    if (effectiveUserId && (!googleAccessToken || appDriveFolderId || !authUser )) { // Ensure folder ID is set if google user
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
        // Assuming drive file ID is same as session ID for filename `session_${sessionId}.json`
        // This requires a way to get the *Drive File ID*. Listing gives names.
        // For simplicity, if we listed 'session_XYZ.json', we need to search for that file to get its actual Drive ID.
        // This part needs enhancement if Drive File ID is different from our session ID.
        // For now, let's assume the filename is the key to find the Drive file ID.
        // A more robust way would be to store driveFileId in metadata if fetched from Drive.

        // This is a simplified placeholder. Ideally, listSessionFilesFromDrive would return DriveFile IDs.
        // Then getSessionFromDrive would use that.
        // Let's assume, for now, a direct fetch attempt if logic indicates it *might* be on Drive.
        const driveSession = await getSessionFromDrive(googleAccessToken, sessionId); // This is problematic if sessionId != driveFileId
        if (driveSession) {
            // Optionally save to localStorage for offline access / caching
            try {
                localStorage.setItem(`${CHAT_SESSION_PREFIX_LS}${sessionId}`, JSON.stringify(driveSession));
            } catch (e) { console.error("Error caching Drive session to localStorage", e); }
            return driveSession;
        }
        console.warn(`getSession: Failed to fetch session ${sessionId} from Drive, trying localStorage.`);
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
        const driveFile = await saveSessionToDrive(googleAccessToken, appDriveFolderId, sessionToUpdateInMemory.id, sessionToUpdateInMemory); // Save full session to drive
        if (driveFile) {
          console.log(`useChatHistory: Session ${sessionToUpdateInMemory.id} saved to Drive. File ID: ${driveFile.id}`);
          driveSaved = true;
        } else {
          console.warn(`useChatHistory: Failed to save session ${sessionToUpdateInMemory.id} to Drive (saveSessionToDrive returned null).`);
        }
      } catch (driveError: any) {
        console.error(`useChatHistory: Error saving session ${sessionToUpdateInMemory.id} to Drive:`, driveError);
      }
      if (!driveSaved) {
        toast({
            title: "Google Drive Sync Failed",
            description: "Session was saved locally, but failed to sync to Google Drive.",
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
      // Future: Add deleteFromDrive(googleAccessToken, fileId) logic here
      // For now, just remove from local metadata. A sync would be needed to reflect Drive deletion.
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
        const tempId = `temp_error_no_user_${Date.now()}`;
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
    if (!googleAccessToken || !appDriveFolderId || !authUser || authUser.uid !== effectiveUserId) {
      toast({
        title: "Sync Unavailable",
        description: "Please log in with Google to sync with Drive.",
        variant: "default",
      });
      return;
    }
    setIsSyncing(true);
    toast({ title: "Syncing with Google Drive...", description: "Please wait." });
    try {
      // Re-ensure folder exists (good practice, though usually already done)
      const folderId = await ensureAppFolderExists(googleAccessToken);
      if (!folderId) {
        throw new Error("Failed to ensure Drive app folder exists during sync.");
      }
      setAppDriveFolderId(folderId); // Update if it changed, though unlikely

      // Fetch current list from Drive
      const driveFiles = await listSessionFilesFromDrive(googleAccessToken, folderId);
      if (driveFiles === null) { // null indicates an error during listing
        throw new Error("Failed to list session files from Google Drive.");
      }

      const driveMetadata: ChatSessionMetadata[] = driveFiles.map(file => {
        const parts = file.name.replace('session_', '').replace('.json', '').split('_');
        const fileSessionId = parts.join('_');
        return {
          id: fileSessionId,
          name: file.name.replace('session_', '').replace('.json', '').substring(0, 50),
          lastMessageTimestamp: file.modifiedTime ? new Date(file.modifiedTime).getTime() : Date.now(),
          preview: "From Google Drive",
          messageCount: 0, // Will be updated if session is loaded
          isDriveSession: true,
        };
      }).filter(meta => meta.id.startsWith(effectiveUserId + '_'));
      
      // For simplicity, this sync will prioritize Drive.
      // It will load all Drive metadata. If a local session isn't on Drive, it will be "lost" from immediate view
      // until a more sophisticated merge is implemented.
      // A more robust sync would involve merging based on timestamps or content.
      
      // Update local history index with what's on Drive
      try {
        localStorage.setItem(CHAT_HISTORY_INDEX_KEY_LS, JSON.stringify(driveMetadata.sort((a,b) => b.lastMessageTimestamp - a.lastMessageTimestamp)));
      } catch (error) {
        if (isQuotaExceededError(error)) {
          console.error("Failed to save updated chat history index to localStorage due to quota exceeded after Drive sync.", error);
        } else {
          console.error("Failed to save updated chat history index to localStorage after Drive sync:", error);
        }
      }
      setHistoryMetadata(driveMetadata.sort((a,b) => b.lastMessageTimestamp - a.lastMessageTimestamp));

      toast({ title: "Sync Complete", description: `Found ${driveMetadata.length} sessions on Google Drive.` });
      
      // Note: This simple sync doesn't upload local-only sessions to Drive automatically.
      // That would require more complex logic to avoid duplicates or decide on "truth".
      // Individual `saveSession` calls will continue to attempt Drive saves for active sessions.

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
  }, [googleAccessToken, appDriveFolderId, authUser, effectiveUserId, toast, setAppDriveFolderId]);


  return { historyMetadata, isLoading, getSession, saveSession, deleteSession, createNewSession, loadHistoryIndex, appDriveFolderId, initializeDriveFolder, syncWithDrive, isSyncing };
}

    
