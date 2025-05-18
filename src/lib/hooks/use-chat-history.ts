
// src/lib/hooks/use-chat-history.ts
"use client";

import { useState, useEffect, useCallback } from 'react';
import type { ChatSession, ChatSessionMetadata, ChatMessage, AttachedFile } from '@/lib/types';
import { DEFAULT_USER_ID, DEFAULT_MODEL_ID } from '@/lib/constants';
import { generateChatName, type GenerateChatNameInput } from '@/ai/flows/generate-chat-name-flow';

const CHAT_HISTORY_INDEX_KEY = 'desainr_chat_history_index';
const CHAT_SESSION_PREFIX = 'desainr_chat_session_';

// Helper to get the first textual content from a message
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
    if (codePart && codePart.code) return `Code snippet (first 50 chars): ${codePart.code.substring(0,50)}`;
    const listPart = message.content.find(part => part.type === 'list');
    if (listPart && listPart.title) return `List: ${listPart.title.substring(0,40)}`;
    if (listPart && listPart.items && listPart.items.length > 0) return `List: ${listPart.items[0].substring(0,40)}`;
    const translationPart = message.content.find(part => part.type === 'translation_group');
    if (translationPart && translationPart.title) return `Analysis: ${translationPart.title.substring(0,40)}`;
    if (message.attachedFiles && message.attachedFiles.length > 0) {
        return `Attached: ${message.attachedFiles[0].name.substring(0,40)}`;
    }
  }
  return 'Structured message';
};

// Helper function to check for QuotaExceededError
const isQuotaExceededError = (error: any): boolean => {
  if (!error) return false;
  return (
    error.name === 'QuotaExceededError' || // Standard
    error.name === 'NS_ERROR_DOM_QUOTA_REACHED' || // Firefox
    (error.code === 22 && error.name === 'DataCloneError') || // Safari (sometimes)
    (error.message && error.message.toLowerCase().includes('quota'))
  );
};


export function useChatHistory(userId: string = DEFAULT_USER_ID) {
  const [historyMetadata, setHistoryMetadata] = useState<ChatSessionMetadata[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadHistoryIndex = useCallback(() => {
    if (!userId) { // Don't load if userId is not yet available
        setIsLoading(false);
        setHistoryMetadata([]);
        return;
    }
    setIsLoading(true);
    try {
      const storedIndex = localStorage.getItem(CHAT_HISTORY_INDEX_KEY);
      const parsedIndex = storedIndex ? JSON.parse(storedIndex) : [];
      // Filter for sessions belonging to the current user
      const userHistory = parsedIndex.filter((meta: ChatSessionMetadata) => meta.id.startsWith(userId + '_'));
      setHistoryMetadata(userHistory.sort((a,b) => b.lastMessageTimestamp - a.lastMessageTimestamp));
    } catch (error) {
      console.error("Failed to load chat history index:", error);
      setHistoryMetadata([]);
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    loadHistoryIndex();
  }, [loadHistoryIndex]);

  const getSession = useCallback((sessionId: string): ChatSession | null => {
    try {
      const storedSession = localStorage.getItem(`${CHAT_SESSION_PREFIX}${sessionId}`);
      return storedSession ? JSON.parse(storedSession) : null;
    } catch (error) {
      console.error(`Failed to load session ${sessionId}:`, error);
      return null;
    }
  }, []);

  const saveSession = useCallback(async (session: ChatSession, attemptNameGeneration: boolean = false, modelIdForNameGeneration?: string): Promise<ChatSession> => {
    if (!userId || !session || !session.id.startsWith(userId + '_')) {
        console.warn("Attempted to save session without valid userId or session ID prefix. Session:", session, "UserId:", userId);
        return session;
    }
    
    let sessionToUpdateInMemory = { ...session }; // This will hold the version with full data for immediate use
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
          };
          const nameOutput = await generateChatName(nameInput);
          if (nameOutput.chatName) {
            sessionToUpdateInMemory.name = nameOutput.chatName;
          }
        } catch (nameGenError) {
          console.error("Failed to generate chat name:", nameGenError);
          if (sessionToUpdateInMemory.name === "New Chat") { // Check again in case of error
               sessionToUpdateInMemory.name = `Chat ${new Date(sessionToUpdateInMemory.createdAt).toLocaleTimeString()}`;
          }
        }
      } else if (sessionToUpdateInMemory.name === "New Chat") { // Fallback if no user message for some reason
          sessionToUpdateInMemory.name = `Chat ${new Date(sessionToUpdateInMemory.createdAt).toLocaleTimeString()}`;
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
                // dataUri is removed
                // textContent could also be truncated/removed if very large
                textContent: file.textContent ? file.textContent.substring(0, 500) + (file.textContent.length > 500 ? '...' : '') : undefined,
              };
              return leanFile;
            })
          };
        }
        return msg;
      })
    };


    try {
      localStorage.setItem(`${CHAT_SESSION_PREFIX}${sessionForLocalStorage.id}`, JSON.stringify(sessionForLocalStorage));
    } catch (error) {
      if (isQuotaExceededError(error)) {
        console.error(`Failed to save session ${sessionForLocalStorage.id} due to localStorage quota exceeded. Session data might be too large. DataURIs were removed, but content might still be too big.`, error);
        // Return the in-memory version so app state is still up-to-date for current session.
        return sessionToUpdateInMemory;
      } else {
        console.error(`Failed to save session ${sessionForLocalStorage.id}:`, error);
        return sessionToUpdateInMemory; // Return in-memory version on other errors too
      }
    }

    setHistoryMetadata(prev => {
      const userSpecificPrev = prev.filter(meta => meta.id.startsWith(userId + '_'));
      const existingIndex = userSpecificPrev.findIndex(meta => meta.id === sessionToUpdateInMemory.id); // Use sessionToUpdateInMemory for ID and name
      
      const newMeta: ChatSessionMetadata = {
        id: sessionToUpdateInMemory.id,
        name: sessionToUpdateInMemory.name || `Chat ${new Date(sessionToUpdateInMemory.createdAt).toLocaleTimeString()}`, // Ensure name is a string
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
        const globalIndexStr = localStorage.getItem(CHAT_HISTORY_INDEX_KEY);
        const globalIndex = globalIndexStr ? JSON.parse(globalIndexStr) : [];
        // Filter out any existing metadata for the current user before adding the updated list
        const otherUserHistories = globalIndex.filter((meta: ChatSessionMetadata) => !meta.id.startsWith(userId + '_'));
        const newGlobalIndex = [...otherUserHistories, ...sortedUserHistory].sort((a,b) => b.lastMessageTimestamp - a.lastMessageTimestamp);
        localStorage.setItem(CHAT_HISTORY_INDEX_KEY, JSON.stringify(newGlobalIndex));
      } catch (error) {
         if (isQuotaExceededError(error)) {
            console.error("Failed to save chat history index due to localStorage quota exceeded.", error);
          } else {
            console.error("Failed to save chat history index:", error);
          }
      }
      
      return sortedUserHistory;
    });
    return sessionToUpdateInMemory; // Return the version with potentially full data for in-memory state
  }, [userId, setHistoryMetadata]); // Removed getMessageTextPreview from deps as it's defined outside

  const deleteSession = useCallback((sessionId: string) => {
    if (!userId || !sessionId.startsWith(userId + '_')) return;
    try {
      localStorage.removeItem(`${CHAT_SESSION_PREFIX}${sessionId}`);
      setHistoryMetadata(prev => {
        const updatedUserHistory = prev.filter(meta => meta.id !== sessionId && meta.id.startsWith(userId + '_'));
        try {
          const globalIndexStr = localStorage.getItem(CHAT_HISTORY_INDEX_KEY);
          const globalIndex = globalIndexStr ? JSON.parse(globalIndexStr) : [];
          const otherUserHistories = globalIndex.filter((meta: ChatSessionMetadata) => !meta.id.startsWith(userId + '_'));
          const newGlobalIndex = [...otherUserHistories, ...updatedUserHistory].sort((a,b) => b.lastMessageTimestamp - a.lastMessageTimestamp);
          localStorage.setItem(CHAT_HISTORY_INDEX_KEY, JSON.stringify(newGlobalIndex));
        } catch (error) {
           if (isQuotaExceededError(error)) {
              console.error("Failed to update chat history index after deletion due to localStorage quota exceeded.", error);
            } else {
              console.error("Failed to update chat history index after deletion:", error);
            }
        }
        return updatedUserHistory;
      });
    } catch (error) {
      console.error(`Failed to delete session ${sessionId}:`, error);
    }
  }, [userId, setHistoryMetadata]);

  const createNewSession = useCallback((initialMessages: ChatMessage[] = [], modelIdForNameGeneration?: string): ChatSession => {
    if (!userId) {
        console.error("createNewSession called without a userId.");
        const tempId = `temp_${Date.now()}_${Math.random().toString(36).substring(2,7)}`;
         return {
          id: tempId,
          name: 'New Chat (Error: No User ID)',
          messages: [],
          createdAt: Date.now(),
          updatedAt: Date.now(),
          userId: "unknown",
        };
    }
    const newSessionId = `${userId}_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const now = Date.now();
    const newSession: ChatSession = {
      id: newSessionId,
      name: 'New Chat', 
      messages: initialMessages,
      createdAt: now,
      updatedAt: now,
      userId: userId,
    };
    // Call saveSession but don't await it here to avoid making createNewSession async
    // saveSession itself will handle name generation if needed
    saveSession(newSession, true, modelIdForNameGeneration || DEFAULT_MODEL_ID); 
    return newSession;
  }, [userId, saveSession]);

  return { historyMetadata, isLoading, getSession, saveSession, deleteSession, createNewSession, loadHistoryIndex };
}

    