
// src/lib/hooks/use-chat-history.ts
"use client";

import { useState, useEffect, useCallback } from 'react';
import type { ChatSession, ChatSessionMetadata, ChatMessage } from '@/lib/types';
import { DEFAULT_USER_ID } from '@/lib/constants';
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


export function useChatHistory(userId: string = DEFAULT_USER_ID) {
  const [historyMetadata, setHistoryMetadata] = useState<ChatSessionMetadata[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadHistoryIndex = useCallback(() => {
    setIsLoading(true);
    try {
      const storedIndex = localStorage.getItem(CHAT_HISTORY_INDEX_KEY);
      const parsedIndex = storedIndex ? JSON.parse(storedIndex) : [];
      // Filter for sessions belonging to the current user (placeholder for future multi-user)
      const userHistory = parsedIndex.filter((meta: ChatSessionMetadata) => meta.id.startsWith(userId));
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

  const saveSession = useCallback(async (session: ChatSession, isNewSession: boolean = false): Promise<ChatSession> => {
    try {
      let sessionToSave = { ...session };
      sessionToSave.updatedAt = Date.now();
      if (isNewSession && sessionToSave.messages.length > 0 && sessionToSave.name === "New Chat") {
         // Attempt to generate a name if it's a new chat with a generic name
        const firstUserMsg = sessionToSave.messages.find(m => m.role === 'user');
        const firstAssistantMsg = sessionToSave.messages.find(m => m.role === 'assistant');
        
        if (firstUserMsg) {
          try {
            const nameInput: GenerateChatNameInput = {
              firstUserMessage: getMessageTextPreview(firstUserMsg) || "Chat conversation",
              firstAssistantMessage: getMessageTextPreview(firstAssistantMsg),
            };
            const nameOutput = await generateChatName(nameInput);
            if (nameOutput.chatName) {
              sessionToSave.name = nameOutput.chatName;
            }
          } catch (nameGenError) {
            console.error("Failed to generate chat name:", nameGenError);
            // Keep "New Chat" or a timestamp-based name if AI naming fails
            if (sessionToSave.name === "New Chat") {
                 sessionToSave.name = `Chat ${new Date(sessionToSave.createdAt).toLocaleString()}`;
            }
          }
        }
      }

      localStorage.setItem(`${CHAT_SESSION_PREFIX}${sessionToSave.id}`, JSON.stringify(sessionToSave));

      setHistoryMetadata(prev => {
        const existingIndex = prev.findIndex(meta => meta.id === sessionToSave.id);
        const newMeta: ChatSessionMetadata = {
          id: sessionToSave.id,
          name: sessionToSave.name,
          lastMessageTimestamp: sessionToSave.updatedAt,
          preview: getMessageTextPreview(sessionToSave.messages[sessionToSave.messages.length - 1]),
          messageCount: sessionToSave.messages.length,
        };
        let updatedIndex;
        if (existingIndex > -1) {
          updatedIndex = [...prev];
          updatedIndex[existingIndex] = newMeta;
        } else {
          updatedIndex = [newMeta, ...prev];
        }
        const sortedIndex = updatedIndex.sort((a,b) => b.lastMessageTimestamp - a.lastMessageTimestamp);
        localStorage.setItem(CHAT_HISTORY_INDEX_KEY, JSON.stringify(sortedIndex));
        return sortedIndex;
      });
      return sessionToSave;
    } catch (error) {
      console.error(`Failed to save session ${session.id}:`, error);
      return session; // return original session on error
    }
  }, []);

  const deleteSession = useCallback((sessionId: string) => {
    try {
      localStorage.removeItem(`${CHAT_SESSION_PREFIX}${sessionId}`);
      setHistoryMetadata(prev => {
        const updatedIndex = prev.filter(meta => meta.id !== sessionId);
        localStorage.setItem(CHAT_HISTORY_INDEX_KEY, JSON.stringify(updatedIndex));
        return updatedIndex;
      });
    } catch (error) {
      console.error(`Failed to delete session ${sessionId}:`, error);
    }
  }, []);

  const createNewSession = (initialMessages: ChatMessage[] = []): ChatSession => {
    const newSessionId = `${userId}_${Date.now()}`;
    const now = Date.now();
    const newSession: ChatSession = {
      id: newSessionId,
      name: 'New Chat', // Will be updated by AI later
      messages: initialMessages,
      createdAt: now,
      updatedAt: now,
      userId: userId,
    };
    // Save immediately to get it into the index, name will update on first real save
    saveSession(newSession, true); 
    return newSession;
  };

  return { historyMetadata, isLoading, getSession, saveSession, deleteSession, createNewSession, loadHistoryIndex };
}
