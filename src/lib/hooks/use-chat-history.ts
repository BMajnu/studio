
// src/lib/hooks/use-chat-history.ts
"use client";

import { useState, useEffect, useCallback } from 'react';
import type { ChatSession, ChatSessionMetadata, ChatMessage } from '@/lib/types';
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
  const textPart = message.content.find(part => part.type === 'text');
  return textPart?.text?.substring(0, 50) || 'Media message';
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
    
    let sessionToSave = { ...session };
    sessionToSave.updatedAt = Date.now();

    if (attemptNameGeneration && sessionToSave.messages.length > 0 && sessionToSave.name === "New Chat") {
      const firstUserMsg = sessionToSave.messages.find(m => m.role === 'user');
      const firstAssistantMsg = sessionToSave.messages.find(m => m.role === 'assistant');
      
      if (firstUserMsg) {
        try {
          const nameInput: GenerateChatNameInput = {
            firstUserMessage: getMessageTextPreview(firstUserMsg) || "Chat conversation",
            firstAssistantMessage: getMessageTextPreview(firstAssistantMsg),
            modelId: modelIdForNameGeneration || DEFAULT_MODEL_ID,
          };
          const nameOutput = await generateChatName(nameInput);
          if (nameOutput.chatName) {
            sessionToSave.name = nameOutput.chatName;
          }
        } catch (nameGenError) {
          console.error("Failed to generate chat name:", nameGenError);
          if (sessionToSave.name === "New Chat") {
               sessionToSave.name = `Chat ${new Date(sessionToSave.createdAt).toLocaleString()}`;
          }
        }
      } else if (sessionToSave.name === "New Chat") {
          sessionToSave.name = `Chat ${new Date(sessionToSave.createdAt).toLocaleString()}`;
      }
    }

    try {
      localStorage.setItem(`${CHAT_SESSION_PREFIX}${sessionToSave.id}`, JSON.stringify(sessionToSave));
    } catch (error) {
      if (isQuotaExceededError(error)) {
        console.error(`Failed to save session ${sessionToSave.id} due to localStorage quota exceeded. Session data might be too large.`, error);
        // Optionally, inform the user via a toast or state update handled by the calling component.
        // For now, we return the original session to indicate the save might not have fully completed or to prevent further state corruption.
        return session; 
      } else {
        console.error(`Failed to save session ${sessionToSave.id}:`, error);
        return session; // Return original session on other errors too
      }
    }

    setHistoryMetadata(prev => {
      const userSpecificPrev = prev.filter(meta => meta.id.startsWith(userId + '_'));
      const existingIndex = userSpecificPrev.findIndex(meta => meta.id === sessionToSave.id);
      const newMeta: ChatSessionMetadata = {
        id: sessionToSave.id,
        name: sessionToSave.name,
        lastMessageTimestamp: sessionToSave.updatedAt,
        preview: getMessageTextPreview(sessionToSave.messages[sessionToSave.messages.length - 1]),
        messageCount: sessionToSave.messages.length,
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
        const otherUserHistories = globalIndex.filter((meta: ChatSessionMetadata) => !meta.id.startsWith(userId + '_'));
        const newGlobalIndex = [...otherUserHistories, ...sortedUserHistory].sort((a,b) => b.lastMessageTimestamp - a.lastMessageTimestamp);
        localStorage.setItem(CHAT_HISTORY_INDEX_KEY, JSON.stringify(newGlobalIndex));
      } catch (error) {
         if (isQuotaExceededError(error)) {
            console.error("Failed to save chat history index due to localStorage quota exceeded.", error);
          } else {
            console.error("Failed to save chat history index:", error);
          }
          // If index saving fails, the in-memory `historyMetadata` will still be updated for the current user for the current session.
          // However, it might not persist correctly across reloads if the index itself couldn't be saved.
      }
      
      return sortedUserHistory;
    });
    return sessionToSave;
  }, [userId, setHistoryMetadata]);

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
        const tempId = `temp_${Date.now()}`;
         return {
          id: tempId,
          name: 'New Chat (Error: No User ID)',
          messages: [],
          createdAt: Date.now(),
          updatedAt: Date.now(),
          userId: "unknown",
        };
    }
    const newSessionId = `${userId}_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`; // Added randomness to ID
    const now = Date.now();
    const newSession: ChatSession = {
      id: newSessionId,
      name: 'New Chat', 
      messages: initialMessages,
      createdAt: now,
      updatedAt: now,
      userId: userId,
    };
    saveSession(newSession, true, modelIdForNameGeneration || DEFAULT_MODEL_ID); 
    return newSession;
  }, [userId, saveSession]);

  return { historyMetadata, isLoading, getSession, saveSession, deleteSession, createNewSession, loadHistoryIndex };
}

