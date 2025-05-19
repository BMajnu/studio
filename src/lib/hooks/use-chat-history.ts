
// src/lib/hooks/use-chat-history.ts
"use client";

import { useState, useEffect, useCallback } from 'react';
import type { ChatSession, ChatSessionMetadata, ChatMessage, AttachedFile } from '@/lib/types';
import { DEFAULT_USER_ID, DEFAULT_MODEL_ID } from '@/lib/constants';
import { generateChatName, type GenerateChatNameInput } from '@/ai/flows/generate-chat-name-flow';
import { useAuth } from '@/contexts/auth-context';
import { ensureAppFolderExists, saveSessionToDrive } from '@/lib/services/drive-service';
import { useToast } from '@/hooks/use-toast'; // Import useToast

const CHAT_HISTORY_INDEX_KEY_LS = 'desainr_chat_history_index_ls_v2'; // Updated key for safety
const CHAT_SESSION_PREFIX_LS = 'desainr_chat_session_ls_v2_'; // Updated key for safety

const getMessageTextPreview = (message: ChatMessage | undefined): string => {
  if (!message) return 'New Chat';
  if (typeof message.content === 'string') {
    return message.content.substring(0, 50);
  }
  if (Array.isArray(message.content)) {
    const textPart = message.content.find(part => part.type === 'text');
    if (textPart && textPart.text) return textPart.text.substring(0, 50);
    
    const codePart = message.content.find(part => part.type === 'code');
    if (codePart && codePart.title) return `Code: ${codePart.title.substring(0,40)}`;
    if (codePart && codePart.code) return `Code: ${codePart.code.substring(0,40)}`; // Corrected: codePart.code
    
    const listPart = message.content.find(part => part.type === 'list');
    if (listPart && listPart.title) return `List: ${listPart.title.substring(0,40)}`;
    if (listPart && listPart.items && listPart.items.length > 0) return `List: ${listPart.items[0].substring(0,40)}`;
    
    const translationPart = message.content.find(part => part.type === 'translation_group');
    if (translationPart && translationPart.title) return `Analysis: ${translationPart.title.substring(0,40)}`;
    if (translationPart?.english?.analysis) return `Eng Analysis: ${translationPart.english.analysis.substring(0,30)}`;

    if (message.attachedFiles && message.attachedFiles.length > 0) {
        return `Attached: ${message.attachedFiles[0].name.substring(0,40)}`;
    }
  }
  return 'Structured message';
};

const isQuotaExceededError = (error: any): boolean => {
  if (!error) return false;
  const message = String(error.message).toLowerCase();
  const name = String(error.name).toLowerCase();
  const knownErrorCodes = [
    'quotaexceedederror', // Generic
    'ns_error_dom_quota_reached', // Firefox
    'domexception: failed to execute \'setitem\' on \'storage\': setting the value of \'x\' exceeded the quota.', // Chrome/Edge
  ];
  return (
    knownErrorCodes.some(code => name.includes(code) || message.includes(code)) ||
    (error.code === 22 && name.includes('datacloneerror')) // Safari specific code for quota exceeded
  );
};

export function useChatHistory(userIdFromProfile: string | undefined) {
  const { user: authUser, googleAccessToken } = useAuth();
  const { toast } = useToast(); // Initialize useToast
  const [historyMetadata, setHistoryMetadata] = useState<ChatSessionMetadata[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [appDriveFolderId, setAppDriveFolderId] = useState<string | null>(null);

  const effectiveUserId = authUser?.uid || userIdFromProfile || DEFAULT_USER_ID;

  useEffect(() => {
    if (googleAccessToken && authUser) {
      console.log("useChatHistory: Google Access Token available. Ensuring app folder exists.");
      ensureAppFolderExists(googleAccessToken)
        .then(folderId => {
          if (folderId) {
            setAppDriveFolderId(folderId);
            console.log("useChatHistory: App Drive folder ID set:", folderId);
            // Future: Trigger loading history from Drive here
          } else {
            console.warn("useChatHistory: Could not obtain App Drive folder ID.");
            toast({
              title: "Google Drive Error",
              description: "Could not access or create the app folder in Google Drive. History might not be synced.",
              variant: "destructive",
            });
          }
        })
        .catch(error => {
            console.error("useChatHistory: Error ensuring app folder exists:", error);
            toast({
              title: "Google Drive Error",
              description: `Failed to set up app folder in Google Drive: ${error.message}. History might not be synced.`,
              variant: "destructive",
            });
        });
    } else {
      setAppDriveFolderId(null);
    }
  }, [googleAccessToken, authUser, toast]);


  const loadHistoryIndex = useCallback(() => {
    if (!effectiveUserId) {
        setIsLoading(false);
        setHistoryMetadata([]);
        return;
    }
    setIsLoading(true);
    try {
      const storedIndex = localStorage.getItem(CHAT_HISTORY_INDEX_KEY_LS);
      const parsedIndex = storedIndex ? JSON.parse(storedIndex) : [];
      const userHistory = parsedIndex.filter((meta: ChatSessionMetadata) => meta.id.startsWith(effectiveUserId + '_'));
      setHistoryMetadata(userHistory.sort((a,b) => b.lastMessageTimestamp - a.lastMessageTimestamp));
    } catch (error) {
      console.error("Failed to load chat history index from localStorage:", error);
      setHistoryMetadata([]);
    } finally {
      setIsLoading(false);
    }
  }, [effectiveUserId]);

  useEffect(() => {
    loadHistoryIndex();
  }, [loadHistoryIndex]);

  const getSession = useCallback((sessionId: string): ChatSession | null => {
    if (!effectiveUserId || !sessionId.startsWith(effectiveUserId + '_')) {
        console.warn(`getSession: Attempt to load session ${sessionId} for incorrect user ${effectiveUserId}.`);
        return null;
    }
    try {
      const storedSession = localStorage.getItem(`${CHAT_SESSION_PREFIX_LS}${sessionId}`);
      return storedSession ? JSON.parse(storedSession) : null;
    } catch (error) {
      console.error(`Failed to load session ${sessionId} from localStorage:`, error);
      return null;
    }
  }, [effectiveUserId]);

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
             sessionToUpdateInMemory.name = `Chat ${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
          }
        }
      } else if (sessionToUpdateInMemory.name === "New Chat") {
          const date = new Date(sessionToUpdateInMemory.createdAt);
          sessionToUpdateInMemory.name = `Chat ${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
      }
    }

    // Create a lean version for localStorage
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
    }

    // Attempt to save to Google Drive if applicable
    // Use sessionToUpdateInMemory (with full data including dataUris if needed for Drive)
    // but for Drive, we might also want a lean version if files are stored separately.
    // For now, let's assume sessionForLocalStorage is also suitable for Drive to keep it simple.
    if (googleAccessToken && appDriveFolderId && authUser && authUser.uid === effectiveUserId) {
      console.log(`useChatHistory: Attempting to save session ${sessionToUpdateInMemory.id} to Google Drive.`);
      saveSessionToDrive(googleAccessToken, appDriveFolderId, sessionToUpdateInMemory.id, sessionForLocalStorage) // Using lean version for Drive too for now
        .then(driveFile => {
          if (driveFile) {
            console.log(`useChatHistory: Session ${sessionToUpdateInMemory.id} saved to Drive. File ID: ${driveFile.id}`);
            // Optionally, toast for Drive success if desired
            // toast({ title: "Chat Saved", description: "Session synced to Google Drive." });
          } else {
            console.warn(`useChatHistory: Failed to save session ${sessionToUpdateInMemory.id} to Drive (returned null).`);
            toast({
              title: "Google Drive Sync Failed",
              description: "Session was saved locally, but failed to sync to Google Drive.",
              variant: "default", // Not as critical as a full save failure
            });
          }
        })
        .catch(driveError => {
          console.error(`useChatHistory: Error saving session ${sessionToUpdateInMemory.id} to Drive:`, driveError);
          toast({
            title: "Google Drive Sync Error",
            description: `Session saved locally, but sync to Google Drive failed: ${driveError.message}`,
            variant: "default",
          });
        });
    }


    setHistoryMetadata(prev => {
      const userSpecificPrev = prev.filter(meta => meta.id.startsWith(effectiveUserId + '_'));
      const existingIndex = userSpecificPrev.findIndex(meta => meta.id === sessionToUpdateInMemory.id);
      
      const newMeta: ChatSessionMetadata = {
        id: sessionToUpdateInMemory.id,
        name: sessionToUpdateInMemory.name || `Chat ${new Date(sessionToUpdateInMemory.createdAt).toLocaleTimeString()}`,
        lastMessageTimestamp: sessionToUpdateInMemory.updatedAt,
        preview: getMessageTextPreview(sessionToUpdateInMemory.messages[sessionToUpdateInMemory.messages.length - 1]),
        messageCount: sessionToUpdateInMemory.messages.length,
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
  }, [effectiveUserId, googleAccessToken, appDriveFolderId, authUser, toast]); // Added toast to dependencies

  const deleteSession = useCallback((sessionId: string) => {
    if (!effectiveUserId || !sessionId.startsWith(effectiveUserId + '_')) return;
    try {
      localStorage.removeItem(`${CHAT_SESSION_PREFIX_LS}${sessionId}`);
      // Future: Add deleteFromDrive(googleAccessToken, fileId) logic here
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
  }, [effectiveUserId, setHistoryMetadata /*, googleAccessToken */]);

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

  return { historyMetadata, isLoading, getSession, saveSession, deleteSession, createNewSession, loadHistoryIndex, appDriveFolderId };
}

    