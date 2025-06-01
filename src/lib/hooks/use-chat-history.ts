// src/lib/hooks/use-chat-history.ts
"use client";

import { useState, useEffect, useCallback, useRef } from 'react';
import type { ChatSession, ChatSessionMetadata, ChatMessage, AttachedFile } from '@/lib/types';
import { DEFAULT_USER_ID, DEFAULT_MODEL_ID } from '@/lib/constants';
import { generateSessionName, generateSessionNameFromMessage } from '@/lib/session-naming';
import { useAuth } from '@/contexts/auth-context';
import { useToast } from '@/hooks/use-toast';
import getConfig from 'next/config';
import * as LZString from 'lz-string';

// Load configuration for session storage
const { publicRuntimeConfig } = getConfig() || { publicRuntimeConfig: {} };
const { sessionStorageConfig = { maxSessionSize: 1024 * 1024, compressSession: true } } = publicRuntimeConfig;

// Storage keys
const CHAT_HISTORY_INDEX_KEY_LS_PREFIX = 'desainr_chat_history_index_ls_v4_'; // Increased version to v4
const CHAT_SESSION_PREFIX_LS_PREFIX = 'desainr_chat_session_ls_v4_';
const DELETED_SESSIONS_LS_PREFIX = 'desainr_deleted_sessions_';

// IndexedDB configuration
const DB_NAME = 'DesainrChatSessionsDB';
const DB_VERSION = 1;
const STORE_NAME = 'chat_sessions';

// IndexedDB helper for chat session storage - provides higher storage limits than localStorage
class SessionStorageDB {
  private db: IDBDatabase | null = null;
  private dbInitPromise: Promise<boolean> | null = null;
  
  constructor() {
    this.dbInitPromise = this.initDB();
  }
  
  private async initDB(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      if (!window.indexedDB) {
        console.warn('IndexedDB not supported. Falling back to localStorage only.');
        resolve(false);
        return;
      }
      
      const request = indexedDB.open(DB_NAME, DB_VERSION);
      
      request.onerror = (event) => {
        console.error('Error opening IndexedDB:', event);
        resolve(false);
      };
      
      request.onsuccess = (event) => {
        this.db = (event.target as IDBOpenDBRequest).result;
        resolve(true);
      };
      
      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME, { keyPath: 'id' });
        }
      };
    });
  }
  
  async isAvailable(): Promise<boolean> {
    return this.dbInitPromise || false;
  }
  
  async saveSession(sessionId: string, data: string): Promise<boolean> {
    if (!this.db) {
      await this.dbInitPromise;
      if (!this.db) return false;
    }
    
    return new Promise((resolve) => {
      try {
        const transaction = this.db!.transaction([STORE_NAME], 'readwrite');
        const store = transaction.objectStore(STORE_NAME);
        
        const request = store.put({
          id: sessionId,
          data,
          timestamp: Date.now()
        });
        
        request.onsuccess = () => resolve(true);
        request.onerror = () => {
          console.error('IndexedDB save error:', request.error);
          resolve(false);
        };
      } catch (error) {
        console.error('IndexedDB transaction error:', error);
        resolve(false);
      }
    });
  }
  
  async getSession(sessionId: string): Promise<string | null> {
    if (!this.db) {
      await this.dbInitPromise;
      if (!this.db) return null;
    }
    
    return new Promise((resolve) => {
      try {
        const transaction = this.db!.transaction([STORE_NAME], 'readonly');
        const store = transaction.objectStore(STORE_NAME);
        const request = store.get(sessionId);
        
        request.onsuccess = () => {
          if (request.result) {
            resolve(request.result.data);
          } else {
            resolve(null);
          }
        };
        
        request.onerror = () => {
          console.error('IndexedDB get error:', request.error);
          resolve(null);
        };
      } catch (error) {
        console.error('IndexedDB transaction error:', error);
        resolve(null);
      }
    });
  }
  
  async deleteSession(sessionId: string): Promise<boolean> {
    if (!this.db) {
      await this.dbInitPromise;
      if (!this.db) return false;
    }
    
    return new Promise((resolve) => {
      try {
        const transaction = this.db!.transaction([STORE_NAME], 'readwrite');
        const store = transaction.objectStore(STORE_NAME);
        const request = store.delete(sessionId);
        
        request.onsuccess = () => resolve(true);
        request.onerror = () => {
          console.error('IndexedDB delete error:', request.error);
          resolve(false);
        };
      } catch (error) {
        console.error('IndexedDB transaction error:', error);
        resolve(false);
      }
    });
  }
}

// Create a singleton instance
const sessionDB = typeof window !== 'undefined' ? new SessionStorageDB() : null;

const MAX_MESSAGE_TEXT_LENGTH = 1000; // For msg.content or text parts
const MAX_ATTACHMENT_TEXT_LENGTH = 200; // For attachment textContent

/**
 * Safely parse JSON data without throwing exceptions
 * Returns null if parsing fails
 */
const safeParseJSON = (jsonString: string | null): any => {
  if (!jsonString) return null;
  
  try {
    return JSON.parse(jsonString);
  } catch (e) {
    console.warn('safeParseJSON: Failed to parse JSON data', e);
    return null;
  }
};

// Check if a string is LZString compressed data - more robust approach with additional safeguards
const isCompressedData = (data: string): boolean => {
  // Safety check for null or empty data
  if (!data || typeof data !== 'string' || data.length === 0) {
    console.warn('isCompressedData: Received null, undefined, or empty string');
    return false;
  }
  
  try {
    // VERY conservative approach - if it looks like JSON, it's definitely not compressed
    if (data.trim().startsWith('{') || data.trim().startsWith('[') || data.trim().startsWith('"')) {
      return false;
    }
    
    // Check for special Unicode characters that likely indicate compression
    const hasUnicodeSpecialChars = /[\u0080-\uFFFF]/.test(data.substring(0, 10));
    
    // Check for non-printable characters at the beginning which often indicate compressed content
    const hasNonPrintableStart = /^[\x00-\x1F\x7F-\x9F]/.test(data.substring(0, 5));
    
    // Check for characters that should never appear in standard JSON text
    const hasNonJsonSafeChars = /[\x00-\x08\x0B\x0C\x0E-\x1F\x80-\x9F]/.test(data.substring(0, 20));
    
    // If we have Unicode characters or non-printable characters at the start, it's likely compressed
    const isLikelyCompressed = hasUnicodeSpecialChars || hasNonPrintableStart || hasNonJsonSafeChars;
    
    // Additional check: If it looks like valid JSON or plain text, it's not compressed
    if (!isLikelyCompressed) {
      // Try to see if it's valid JSON by checking for common JSON patterns
      const jsonPatternRegex = /"[^"]*"\s*:/; // Looks for patterns like "key":
      if (jsonPatternRegex.test(data.substring(0, 100))) {
        return false;
      }
    }
    
    return isLikelyCompressed;
  } catch (e) {
    console.error('Error in isCompressedData:', e);
    return false;
  }
};

// Decompress a string previously compressed with LZString - completely rewritten with robust error handling
const decompressData = (compressedData: string): string => {
  try {
    // Safety check for null or empty data
    if (!compressedData || typeof compressedData !== 'string') {
      console.warn('decompressData: Received null, undefined, or non-string data');
      return '';
    }
    
    // Skip decompression if the data doesn't look compressed
    if (!isCompressedData(compressedData)) {
      return compressedData;
    }
    
    // Attempt LZString decompression
    try {
      const decompressed = LZString.decompressFromUTF16(compressedData);
      
      // Validate the decompressed result
      if (!decompressed) {
        console.warn('decompressData: Decompression returned null or empty string');
        return '';
      }
      
      // Additional validation: check if the result looks like valid JSON if it should be
      if (decompressed.trim().startsWith('{') || decompressed.trim().startsWith('[')) {
        try {
          // Just try to parse it to make sure it's valid JSON, but don't use the result
          JSON.parse(decompressed);
        } catch (jsonError) {
          console.warn('decompressData: Decompressed data is not valid JSON though it looks like it should be');
          // We'll return the string anyway as it might still be usable or partially valid
        }
      }
      
      return decompressed;
    } catch (decompressionError) {
      console.error('decompressData: LZString decompression failed:', decompressionError);
      
      // Try alternative methods of decompression as a fallback
      try {
        // Try alternative LZString methods since the format might be wrong
        const alt1 = LZString.decompress(compressedData);
        if (alt1 && alt1.length > 0) return alt1;
        
        // Use only methods that exist in the current LZString typings
        const alt2 = LZString.decompressFromUTF16(compressedData);
        if (alt2 && alt2.length > 0) return alt2;
        
        const alt3 = LZString.decompressFromBase64(compressedData);
        if (alt3 && alt3.length > 0) return alt3;
        
        const alt4 = LZString.decompressFromEncodedURIComponent(compressedData);
        if (alt4 && alt4.length > 0) return alt4;
      } catch (e) {
        // All fallbacks failed, returning empty string
        console.error('decompressData: All decompression fallbacks failed');
      }
      
      return '';
    }
  } catch (e) {
    console.error('decompressData: Unhandled error during decompression:', e);
    return '';
  }
};

// Enhanced safer JSON parsing function with better error handling
const safeJsonParse = (data: string): any => {
  if (!data || typeof data !== 'string' || data.trim() === '') {
    console.warn('safeJsonParse: Empty or invalid input');
    return null;
  }
  
  try {
    // Remove BOM if present
    const noBomData = data.charCodeAt(0) === 0xFEFF ? data.slice(1) : data;
    
    // Check for non-printable characters or binary data at the beginning
    const hasBinaryPrefix = /^[\x00-\x08\x0B\x0C\x0E-\x1F\x80-\xFF]/.test(noBomData.substring(0, 5));
    let cleanData = noBomData;
    
    if (hasBinaryPrefix) {
      console.warn('safeJsonParse: Input appears to contain binary data or non-printable characters');
      
      // Try to find valid JSON start markers
      const objectStart = noBomData.indexOf('{');
      const arrayStart = noBomData.indexOf('[');
      
      if (objectStart >= 0 || arrayStart >= 0) {
        const jsonStart = (objectStart >= 0 && arrayStart >= 0) 
          ? Math.min(objectStart, arrayStart) 
          : Math.max(objectStart, arrayStart);
        
        console.log(`safeJsonParse: Found potential JSON start at position ${jsonStart}`);
        cleanData = noBomData.substring(jsonStart);
      } else {
        console.warn('safeJsonParse: Cannot find valid JSON start markers in binary data');
        return null;
      }
    }
    
    // Try standard parsing first
    try {
      return JSON.parse(cleanData);
    } catch (e) {
      // If that fails, try more aggressive cleaning
      console.warn('safeJsonParse: Initial parse failed, attempting to clean data');
      
      // Replace any non-ASCII characters and control characters that could cause issues
      const sanitizedData = cleanData.replace(/[^\x20-\x7E]/g, '');
      
      // Try parsing the sanitized data
      try {
        return JSON.parse(sanitizedData);
      } catch (sanitizeError) {
        // If that fails too, try to find valid JSON in the string
        // Using a non-greedy matching approach without the 's' flag
        const jsonRegex = /(\{[\s\S]*?\}|\[[\s\S]*?\])/;
        const match = jsonRegex.exec(cleanData);
        
        if (match && match[0]) {
          try {
            return JSON.parse(match[0]);
          } catch (e) {
            console.error('safeJsonParse: All parsing attempts failed');
            return null;
          }
        }
        
        console.error('safeJsonParse: Could not extract valid JSON');
        return null;
      }
    }
  } catch (e) {
    console.error('safeJsonParse: Unexpected error:', e);
    return null;
  }
};

const getMessageTextPreview = (message: ChatMessage | undefined): string => {
  if (!message) return 'New Chat';
  
  // If the message is loading and not an error, return processing status
  if (message.isLoading === true && !message.isError) {
    return "Processing...";
  }
  
  // If message was in error state
  if (message.isError) {
    return "Error occurred";
  }
  
  if (typeof message.content === 'string') {
    // Only treat content with the exact string "Processing..." as a placeholder
    // This allows real content that happens to contain the word to display correctly
    if (message.content === 'Processing...') {
      return "Completed";
    }
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
                if (part.code) return `Code Block`; // Simplified
                break;
            case 'list':
                if (part.title) return `List: ${part.title.substring(0, 40).trim()}`;
                if (part.items && part.items.length > 0) return `List: ${part.items[0].substring(0, 40).trim()}`;
                break;
            case 'translation_group':
                if (part.title) return `Analysis: ${part.title.substring(0, 40).trim()}`;
                if (part.english?.analysis) return `Eng Analysis: ${part.english.analysis.substring(0, 30).trim()}`;
                break;
            case 'custom':
                if (part.title) return `Custom: ${part.title.substring(0, 40).trim()}`;
                if (part.text) return `Custom instruction: ${part.text.substring(0, 40).trim()}`;
                break;
            case 'suggested_replies':
                return 'Suggested Replies';
                break;
        }
    }
    if (message.attachedFiles && message.attachedFiles.length > 0) {
        return `Attached: ${message.attachedFiles[0].name.substring(0, 40).trim()}`;
    }
  }
  return 'Structured message';
};

/**
 * Helper functions for session compression and storage quota management
 */

// Check if an error is a storage quota exceeded error
const isQuotaExceededError = (error: any): boolean => {
  if (!error) return false;
  
  if (error instanceof DOMException && 
     (error.name === 'QuotaExceededError' || 
      error.name === 'NS_ERROR_DOM_QUOTA_REACHED')) {
    return true;
  }
  
  // Check for error message content as a fallback
  if (error.message && typeof error.message === 'string' &&
     (error.message.includes('quota') || 
      error.message.includes('storage') || 
      error.message.includes('exceeded'))) {
    return true;
  }
  
  return false;
};
// Compress a string using LZString for storage
const compressData = (data: string): string => {
  try {
    // Use LZString for compression with UTF16 format
    return LZString.compressToUTF16(data);
  } catch (error) {
    console.warn('Compression failed:', error);
    return data;
  }
};

// Limit session size to prevent quota issues
const limitSessionSize = (session: ChatSession): ChatSession => {
  // Create a copy to avoid modifying the original
  const trimmedSession = {...session};
  
  // If we have a large session, start trimming older messages
  if (trimmedSession.messages && trimmedSession.messages.length > 50) {
    // Keep only the most recent 50 messages
    trimmedSession.messages = trimmedSession.messages.slice(-50);
  }
  
  // Handle attached files if present
  // Note: Using type assertion since files might exist but not be in the type definition
  const sessionWithFiles = trimmedSession as ChatSession & { files?: AttachedFile[] };
  if (sessionWithFiles.files && sessionWithFiles.files.length > 0) {
    // Limit to the 10 most recent files
    sessionWithFiles.files = sessionWithFiles.files.slice(-10);
  }
  
  return trimmedSession;
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
        // Prefer existing name if it's not a placeholder
        if (existing.name && (!newItem.name)) { // Simplified condition
             newItem.name = existing.name;
        } else if (newItem.name && (!existing.name)) {
            // Prefer new name if it's not a placeholder
        } else if (existing.name) {
            // Fallback to existing if both are potentially placeholders or both are good
            newItem.name = existing.name;
        }

        if (existing.preview && newItem.preview === "") { // Simplified condition
            newItem.preview = existing.preview;
        }
      }
      map.set(item.id, newItem);
    } else {
        map.set(item.id, existing);
    }
  }
  return Array.from(map.values()).sort((a, b) => b.lastMessageTimestamp - a.lastMessageTimestamp);
}

const createLeanSession = (session: ChatSession): ChatSession => {
    if (!session || !session.messages) return session;
    const leanMessages = session.messages.map(msg => {
        let leanContent = msg.content;
        if (typeof msg.content === 'string' && msg.content.length > MAX_MESSAGE_TEXT_LENGTH) {
            leanContent = msg.content.substring(0, MAX_MESSAGE_TEXT_LENGTH) + "... (truncated)";
        } else if (Array.isArray(msg.content)) {
            leanContent = msg.content.map(part => {
                if (part.type === 'text' && part.text && part.text.length > MAX_MESSAGE_TEXT_LENGTH) {
                    return { ...part, text: part.text.substring(0, MAX_MESSAGE_TEXT_LENGTH) + "... (truncated)" };
                }
                return part;
            });
        }

        if (msg.attachedFiles && msg.attachedFiles.some(f => f.dataUri || (f.textContent && f.textContent.length > MAX_ATTACHMENT_TEXT_LENGTH))) {
            return {
                ...msg,
                content: leanContent,
                attachedFiles: msg.attachedFiles.map(f => {
                    const { dataUri, textContent, ...rest } = f;
                    const leanFile: AttachedFile = {...rest};
                    if (textContent && textContent.length > MAX_ATTACHMENT_TEXT_LENGTH) {
                        leanFile.textContent = textContent.substring(0, MAX_ATTACHMENT_TEXT_LENGTH) + "... (truncated)";
                    } else if (textContent) {
                        leanFile.textContent = textContent;
                    }
                    return leanFile;
                })
            };
        }
        return { ...msg, content: leanContent };
    });
    return { ...session, messages: leanMessages };
};

// Replace the complex AI-based naming queue and processing with a simpler function
const generateSimpleName = (session: ChatSession): string => {
  // Default to timestamp-based name
  let name = generateSessionName(session.createdAt);
  
  // If there are messages, try to make a name from the first meaningful message
  if (session.messages && session.messages.length > 0) {
    // Find the first non-system message
    const firstUserMsg = session.messages.find(m => m.role === 'user');
    if (firstUserMsg) {
      // Get the text content from the message
      let messageText = '';
      if (typeof firstUserMsg.content === 'string') {
        messageText = firstUserMsg.content;
      } else if (Array.isArray(firstUserMsg.content) && firstUserMsg.content.length > 0) {
        // Try to extract text from complex content
        for (const part of firstUserMsg.content) {
          if ('text' in part && typeof part.text === 'string') {
            messageText = part.text;
            break;
          }
        }
      }
      
      // If we found text, use it to generate a name
      if (messageText) {
        const messageBasedName = generateSessionNameFromMessage(messageText);
        if (messageBasedName !== 'New Chat') {
          name = messageBasedName;
        }
      }
    }
  }
  
  return name;
};

// Simplified function to update session name
const updateSessionName = async (userId: string, sessionId: string, session: ChatSession): Promise<boolean> => {
  if (!session) return false;
  
  const newName = generateSimpleName(session);
  if (!newName || newName === session.name) return false;
  
  console.log(`updateSessionName: Generated name: "${newName}" for session ${sessionId}`);
  
  // Update session name
  session.name = newName;
  
  // Save session with new name
  const localStorageKey = `${CHAT_SESSION_PREFIX_LS_PREFIX}${userId}_`;
  const idbKey = `${localStorageKey}${sessionId}_idb`;
  const hasIdbFlag = localStorage.getItem(idbKey) === 'true';
  
  try {
    // Save to IndexedDB if available
    if (hasIdbFlag && sessionDB) {
      const sessionString = JSON.stringify(session);
      const valueToStore = sessionString.length > 1000 ? compressData(sessionString) : sessionString;
      await sessionDB.saveSession(`${sessionId}`, valueToStore);
    } 
    // Otherwise save to localStorage
    else {
      const sessionString = JSON.stringify(session);
      const valueToStore = sessionString.length > 1000 ? compressData(sessionString) : sessionString;
      localStorage.setItem(`${localStorageKey}${sessionId}`, valueToStore);
    }
    
    // Update metadata index
    try {
      const historyIndexKey = `${CHAT_HISTORY_INDEX_KEY_LS_PREFIX}${userId}`;
      const historyIndexJson = localStorage.getItem(historyIndexKey);
      if (historyIndexJson) {
        let metadata;
        if (isCompressedData(historyIndexJson)) {
          const decompressed = decompressData(historyIndexJson);
          metadata = safeParseJSON(decompressed);
        } else {
          metadata = safeParseJSON(historyIndexJson);
        }
        
        if (metadata && Array.isArray(metadata)) {
          const metadataIndex = metadata.findIndex((m: ChatSessionMetadata) => m.id === sessionId);
          if (metadataIndex >= 0) {
            metadata[metadataIndex].name = newName;
            const metadataString = JSON.stringify(metadata);
            const valueToStore = metadataString.length > 1000 ? compressData(metadataString) : metadataString;
            localStorage.setItem(historyIndexKey, valueToStore);
          }
        }
      }
    } catch (error) {
      console.error(`updateSessionName: Error updating history metadata:`, error);
    }
    
    // Dispatch event for UI update
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('desainr_ui_update_trigger', Date.now().toString());
        window.dispatchEvent(new CustomEvent('chat-name-updated', {
          detail: {
            sessionId,
            newName,
            userId,
            timestamp: Date.now(),
            source: 'simple-generation',
            forceUpdate: true
          }
        }));
      } catch (error) {
        console.error(`updateSessionName: Error dispatching event:`, error);
      }
    }
    
    return true;
  } catch (error) {
    console.error(`updateSessionName: Error saving session:`, error);
    return false;
  }
};

// Replace the complex AI-based naming queue with simpler function
const setSessionName = async (sessionId: string): Promise<boolean> => {
  console.log(`setSessionName: Setting name for session ${sessionId}`);
  
  try {
    const userId = sessionId.split('_')[0]; // Extract userId from the sessionId
    
    // Get the session data
    let session: ChatSession | null = null;
    const localStorageKey = `${CHAT_SESSION_PREFIX_LS_PREFIX}${userId}_`;
    const idbKey = `${localStorageKey}${sessionId}_idb`;
    const hasIdbFlag = localStorage.getItem(idbKey) === 'true';
    
    // Try to get from IndexedDB first
    if (hasIdbFlag && sessionDB) {
      const dbSessionData = await sessionDB.getSession(`${sessionId}`);
      if (dbSessionData) {
        if (isCompressedData(dbSessionData)) {
          const decompressed = decompressData(dbSessionData);
          session = safeParseJSON(decompressed);
        } else {
          session = safeParseJSON(dbSessionData);
        }
      }
    }
    
    // If not found in IndexedDB, try localStorage
    if (!session) {
      const sessionJson = localStorage.getItem(`${localStorageKey}${sessionId}`);
      if (sessionJson) {
        if (isCompressedData(sessionJson)) {
          const decompressed = decompressData(sessionJson);
          session = safeParseJSON(decompressed);
        } else {
          session = safeParseJSON(sessionJson);
        }
      }
    }
    
    // If session is found, update its name
    if (session) {
      return await updateSessionName(userId, sessionId, session);
    }
    
    console.log(`setSessionName: Session ${sessionId} not found.`);
    return false;
  } catch (e) {
    console.error(`setSessionName: Error:`, e);
    return false;
  }
};

export function useChatHistory(userIdFromProfile: string | undefined) {
  const { user: authUser, googleAccessToken } = useAuth(); // Removed triggerGoogleSignInFromAuth as it's not used
  const { toast } = useToast();
  const [historyMetadata, setHistoryMetadata] = useState<ChatSessionMetadata[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false); // This might be removed if no async ops remain

  const effectiveUserId = authUser?.uid || userIdFromProfile || DEFAULT_USER_ID;
  const chatHistoryIndexKeyLS = `${CHAT_HISTORY_INDEX_KEY_LS_PREFIX}${effectiveUserId}`;
  const chatSessionPrefixLS = `${CHAT_SESSION_PREFIX_LS_PREFIX}${effectiveUserId}_`;
  const deletedSessionsLSKey = `${DELETED_SESSIONS_LS_PREFIX}${effectiveUserId}`;

  const isMounted = useRef(false);

  useEffect(() => {
    isMounted.current = true;
    const handleChatNameUpdated = (event: CustomEvent) => {
      if (isMounted.current) {
        const { newName } = event.detail;
        if (newName) {
          toast({
            title: "Chat Named",
            description: `Chat automatically named: "${newName}"`,
            duration: 3000
          });
        }
      }
    };
    window.addEventListener('chat-name-updated', handleChatNameUpdated as EventListener);
    return () => { 
      isMounted.current = false;
      window.removeEventListener('chat-name-updated', handleChatNameUpdated as EventListener);
    };
  }, [toast]);

  // Removed initializeDriveFolder

  const loadHistoryIndex = useCallback(async () => {
    if (!effectiveUserId) {
      console.warn("loadHistoryIndex: No effectiveUserId. Cannot load history.");
      if (isMounted.current) setHistoryMetadata([]);
      return;
    }
    console.log(`loadHistoryIndex: Running for user ${effectiveUserId}.`);

    let combinedMetadata: ChatSessionMetadata[] = [];
    const seenIds = new Set<string>();

    try {
      let storedIndex = localStorage.getItem(chatHistoryIndexKeyLS);
      let localParsedIndex: ChatSessionMetadata[] = [];
      if (storedIndex) {
        try {
          if (isCompressedData(storedIndex)) {
              const decompressedData = decompressData(storedIndex);
              if (decompressedData) {
                const parsedData = safeJsonParse(decompressedData);
                if (parsedData && Array.isArray(parsedData)) {
                  localParsedIndex = parsedData;
              } else { localStorage.removeItem(chatHistoryIndexKeyLS); }
            } else { localStorage.removeItem(chatHistoryIndexKeyLS); }
                } else {
                const parsedData = safeJsonParse(storedIndex);
                if (parsedData && Array.isArray(parsedData)) {
                  localParsedIndex = parsedData;
            } else { localStorage.removeItem(chatHistoryIndexKeyLS); }
          }
        } catch (error) {
          console.error('loadHistoryIndex: Error processing stored index:', error);
          localStorage.removeItem(chatHistoryIndexKeyLS);
        }
      }
      
      if (localParsedIndex.length === 0 && sessionDB) {
        try {
          const metadataFromDB = await sessionDB.getSession('metadata_index');
          if (metadataFromDB) {
              localParsedIndex = JSON.parse(metadataFromDB);
          }
        } catch (dbError) {
          console.error('loadHistoryIndex: Error loading metadata from IndexedDB:', dbError);
        }
      }
      
      if (localParsedIndex.length === 0) {
        const sessionPattern = new RegExp(`^${CHAT_SESSION_PREFIX_LS_PREFIX}${effectiveUserId}_([^_]+)$`);
        const reconstructedMetadata: ChatSessionMetadata[] = [];
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key && sessionPattern.test(key)) {
            try {
              const sessionId = key.replace(`${CHAT_SESSION_PREFIX_LS_PREFIX}${effectiveUserId}_`, '');
              if (!sessionId || sessionId.includes('_idb')) continue;
              const sessionData = localStorage.getItem(key);
              if (!sessionData) continue;
              let session: ChatSession | null = null;
                if (isCompressedData(sessionData)) {
                  const decompressed = decompressData(sessionData);
                if (decompressed) session = safeJsonParse(decompressed);
                } else {
                  session = safeJsonParse(sessionData);
                }
                if (session && Array.isArray(session.messages)) {
                  const lastMessage = session.messages.length > 0 ? session.messages[session.messages.length - 1] : undefined;
                  const meta: ChatSessionMetadata = {
                    id: sessionId,
                    name: session.name || `Chat ${new Date(session.createdAt || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
                    lastMessageTimestamp: session.updatedAt || Date.now(),
                    preview: getMessageTextPreview(lastMessage),
                    messageCount: session.messages.length,
                  };
                  reconstructedMetadata.push(meta);
                }
            } catch (error) { console.error(`loadHistoryIndex: Error processing session during reconstruction:`, error); }
              }
            }
        if (reconstructedMetadata.length > 0) {
          localParsedIndex = reconstructedMetadata;
          try {
            localStorage.setItem(chatHistoryIndexKeyLS, compressData(JSON.stringify(reconstructedMetadata)));
          } catch (error) { console.error('loadHistoryIndex: Error saving reconstructed metadata:', error); }
        }
      }
      
        if (sessionDB) {
          const allKeys = Object.keys(localStorage);
        const idbFlagKeys = allKeys.filter(key => key.startsWith(chatSessionPrefixLS) && key.endsWith('_idb'));
          for (const flagKey of idbFlagKeys) {
            const sessionId = flagKey.substring(chatSessionPrefixLS.length, flagKey.length - 4);
          if (!localParsedIndex.some(meta => meta?.id === sessionId) && sessionId.startsWith(effectiveUserId + '_')) {
              try {
                const sessionExists = await sessionDB.getSession(sessionId);
                if (sessionExists) {
                    const sessionData = JSON.parse(sessionExists);
                    const newMetaEntry: ChatSessionMetadata = {
                      id: sessionId,
                      name: sessionData.name || `Chat ${new Date(sessionData.createdAt || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
                      lastMessageTimestamp: sessionData.updatedAt || Date.now(),
                  preview: sessionData.messages && Array.isArray(sessionData.messages) && sessionData.messages.length > 0 ? getMessageTextPreview(sessionData.messages[sessionData.messages.length - 1]) : 'Chat',
                      messageCount: sessionData.messages && Array.isArray(sessionData.messages) ? sessionData.messages.length : 0,
                    };
                    if (!seenIds.has(sessionId)) {
                      localParsedIndex.push(newMetaEntry);
                      seenIds.add(sessionId);
                    }
                  }
            } catch (e) { console.warn(`loadHistoryIndex: Error checking IndexedDB for missing session ${sessionId}:`, e); }
                }
              }
      }

      const filteredLocal = localParsedIndex.filter((meta): meta is ChatSessionMetadata =>
          meta && typeof meta.id === 'string' && meta.id.startsWith(effectiveUserId + '_') &&
          typeof meta.name === 'string' && typeof meta.lastMessageTimestamp === 'number' &&
          typeof meta.preview === 'string' && typeof meta.messageCount === 'number'
      );

      if (filteredLocal.length < localParsedIndex.length && localParsedIndex.length > 0) {
        try {
          localStorage.setItem(chatHistoryIndexKeyLS, compressData(JSON.stringify(filteredLocal)));
        } catch (storageError) {
          if (isQuotaExceededError(storageError) && sessionDB) {
            await sessionDB.saveSession('metadata_index', JSON.stringify(filteredLocal));
          } else { console.error('loadHistoryIndex: Failed to save filtered metadata:', storageError); }
          }
        }
      filteredLocal.forEach(meta => {
        if (!seenIds.has(meta.id)) {
          combinedMetadata.push(meta);
          seenIds.add(meta.id);
        }
      });
      console.log(`loadHistoryIndex: Loaded ${filteredLocal.length} sessions from storage.`);
    } catch (error) {
      console.error("loadHistoryIndex: Error loading/parsing local chat history index:", error);
    }

    // Removed Google Drive loading section

    if (combinedMetadata.length === 0 && typeof window !== 'undefined' && window.location) {
      const urlParams = new URLSearchParams(window.location.search);
      const currentSessionId = urlParams.get('id');
      if (currentSessionId && currentSessionId.startsWith(effectiveUserId + '_')) {
        const placeholderMeta: ChatSessionMetadata = {
          id: currentSessionId, name: 'Current Chat', lastMessageTimestamp: Date.now(),
          preview: 'Active chat session', messageCount: 0,
        };
        combinedMetadata.push(placeholderMeta);
        try {
          const sessionData = localStorage.getItem(`${chatSessionPrefixLS}${currentSessionId}`);
          if (sessionData) {
            let session: ChatSession | null = null;
              if (isCompressedData(sessionData)) {
                const decompressed = decompressData(sessionData);
              if (decompressed) session = safeJsonParse(decompressed);
              } else {
                session = safeJsonParse(sessionData);
              }
              if (session && Array.isArray(session.messages)) {
                placeholderMeta.name = session.name || 'Current Chat';
                placeholderMeta.lastMessageTimestamp = session.updatedAt || Date.now();
                placeholderMeta.messageCount = session.messages.length;
              placeholderMeta.preview = session.messages.length > 0 ? getMessageTextPreview(session.messages[session.messages.length - 1]) : 'Current chat session';
                  localStorage.setItem(chatHistoryIndexKeyLS, JSON.stringify([placeholderMeta]));
            }
          }
        } catch (error) { console.error(`loadHistoryIndex: Error checking localStorage for active session:`, error); }
      }
    }
    if (isMounted.current) {
      const sortedMetadata = combinedMetadata.sort((a, b) => b.lastMessageTimestamp - a.lastMessageTimestamp);
      setHistoryMetadata(sortedMetadata);
      setIsLoading(false);
    }
  }, [effectiveUserId, chatHistoryIndexKeyLS, chatSessionPrefixLS]); // Removed googleAccessToken, appDriveFolderId, authUser, toast, deletedSessionsLSKey

  useEffect(() => {
    const orchestrateInitialLoad = async () => {
      if (!effectiveUserId || !isMounted.current) {
        setIsLoading(true);
        return;
      }
      setIsLoading(true);
      const safetyTimeout = setTimeout(() => {
        if (isMounted.current && isLoading) {
          setIsLoading(false);
        }
      }, 10000);

      try {
        cleanupCorruptedLocalStorage(effectiveUserId);
        await loadHistoryIndex();
        if (historyMetadata.length === 0) {
          const repaired = await repairChatHistoryMetadata(effectiveUserId);
          if (repaired) {
            await loadHistoryIndex();
          }
        }
        if (isMounted.current) setIsLoading(false);
        // Removed Drive initialization logic
      } catch (error) {
        console.error("useChatHistory Orchestrator: Error during initial load:", error);
        if (isMounted.current) setIsLoading(false);
      } finally {
        clearTimeout(safetyTimeout);
      }
    };
    orchestrateInitialLoad();
  }, [effectiveUserId, loadHistoryIndex]); // Removed googleAccessToken

  const getSession = useCallback(async (sessionId: string): Promise<ChatSession | null> => {
    if (!effectiveUserId || !sessionId) {
      console.warn(`getSession: Invalid sessionId ${sessionId} or effectiveUserId ${effectiveUserId}`);
      return null;
    }
    
    // Check if the sessionId format is valid - should start with the user ID
    if (!sessionId.startsWith(effectiveUserId + '_')) {
      console.warn(`getSession: SessionId ${sessionId} does not match current user ${effectiveUserId}`);
      return null;
    }

    console.log(`getSession: Loading session ${sessionId}`);
    let session: ChatSession | null = null;
    let errors = [];
    
    // First try from localStorage
    try {
      const storedSession = localStorage.getItem(`${chatSessionPrefixLS}${sessionId}`);
      if (storedSession) {
        try {
          if (isCompressedData(storedSession)) {
            const decompressed = decompressData(storedSession);
            if (decompressed && decompressed.trim()) {
              session = safeJsonParse(decompressed);
              if (session) {
                console.log(`getSession: Successfully loaded session ${sessionId} from localStorage (compressed)`);
                return session;
              }
            }
          } else {
            session = safeJsonParse(storedSession);
            if (session) {
              console.log(`getSession: Successfully loaded session ${sessionId} from localStorage`);
              return session;
            }
          }
        } catch (parseError: any) {
          console.error(`getSession: Error parsing localStorage data for session ${sessionId}:`, parseError);
          errors.push(`localStorage parse: ${parseError.message || 'Unknown error'}`);
        }
      }
    } catch (storageError: any) {
      console.error(`getSession: Error accessing localStorage for session ${sessionId}:`, storageError);
      errors.push(`localStorage access: ${storageError.message || 'Unknown error'}`);
    }

    // Try IndexedDB if available
    if (sessionDB) {
      try {
        const dbSessionData = await sessionDB.getSession(`${sessionId}`);
        if (dbSessionData) {
          try {
            if (isCompressedData(dbSessionData)) {
              const decompressed = decompressData(dbSessionData);
              if (decompressed && decompressed.trim()) {
                session = safeJsonParse(decompressed);
                if (session) {
                  console.log(`getSession: Successfully loaded session ${sessionId} from IndexedDB (compressed)`);
                  return session;
                }
              }
            } else {
              session = safeJsonParse(dbSessionData);
              if (session) {
                console.log(`getSession: Successfully loaded session ${sessionId} from IndexedDB`);
                return session;
              }
            }
          } catch (parseError: any) {
            console.error(`getSession: Error parsing IndexedDB data for session ${sessionId}:`, parseError);
            errors.push(`indexedDB parse: ${parseError.message || 'Unknown error'}`);
          }
        }
      } catch (dbError: any) {
        console.error(`getSession: Error accessing IndexedDB for session ${sessionId}:`, dbError);
        errors.push(`indexedDB access: ${dbError.message || 'Unknown error'}`);
      }
    }
    
    // Create emergency placeholder session if we couldn't find it
    if (!session) {
      console.warn(`getSession: Session ${sessionId} not found in any storage. Errors: ${errors.join(', ')}`);
      
      // Check if there's a metadata entry for this session
      try {
        const historyData = localStorage.getItem(chatHistoryIndexKeyLS);
        if (historyData) {
          let metadata;
          if (isCompressedData(historyData)) {
            const decompressed = decompressData(historyData);
            metadata = safeJsonParse(decompressed);
          } else {
            metadata = safeJsonParse(historyData);
          }
          
          if (metadata && Array.isArray(metadata)) {
            const sessionMeta = metadata.find((m) => m.id === sessionId);
            if (sessionMeta) {
              // Create an emergency placeholder session with the metadata we have
              console.log(`getSession: Creating emergency placeholder session for ${sessionId}`);
              const emergencySession: ChatSession = {
                id: sessionId,
                name: sessionMeta.name || "Recovered Chat",
                messages: [{
                  id: `recovery_${Date.now()}`,
                  role: 'system',
                  content: "This chat session was recovered from metadata. Previous messages could not be loaded.",
                  timestamp: Date.now()
                }],
                createdAt: Date.now() - 3600000, // 1 hour ago
                updatedAt: sessionMeta.lastMessageTimestamp || Date.now(),
                userId: effectiveUserId,
                modelId: DEFAULT_MODEL_ID
              };
              return emergencySession;
            }
          }
        }
      } catch (metaError) {
        console.error(`getSession: Failed to check metadata for session ${sessionId}:`, metaError);
      }
    }

    return null;
  }, [effectiveUserId, chatSessionPrefixLS, chatHistoryIndexKeyLS]);

  const saveSession = useCallback(async (
    session: ChatSession,
    attemptNameGeneration: boolean = false,
    modelIdForNameGeneration?: string,
  ): Promise<ChatSession> => { // Removed userApiKeyForNameGeneration
    if (!effectiveUserId || !session || !session.id.startsWith(effectiveUserId + '_')) {
        return session;
    }
    const cleanedMessages = session.messages.map(msg => ({
        ...msg,
      content: (msg.isLoading === true && typeof msg.content === 'string' && msg.content === 'Processing...') ? [] : msg.content,
      isLoading: false,
      isError: (msg.isError && typeof msg.content !== 'string') ? true : (msg.isError && typeof msg.content === 'string' && msg.content !== 'Processing...') ? true : false,
    }));
    const originalCreatedAt = session.createdAt;
    let sessionToSave: ChatSession = { 
      ...session, updatedAt: Date.now(), createdAt: originalCreatedAt, userId: effectiveUserId, messages: cleanedMessages,
      modelId: attemptNameGeneration && modelIdForNameGeneration ? modelIdForNameGeneration : session.modelId,
    };
    const hasTimeBasedName = sessionToSave.name && /Chat \\d{1,2}:\\d{1,2}/.test(sessionToSave.name);
    const hasDefaultName = sessionToSave.name === "New Chat" || !sessionToSave.name || hasTimeBasedName;
    const validUserMessages = sessionToSave.messages.filter(m => m.role === 'user' && (typeof m.content === 'string' ? m.content.length > 0 : (Array.isArray(m.content) && m.content.length > 0)));
    const validAssistantMessages = sessionToSave.messages.filter(m => m.role === 'assistant' && (typeof m.content === 'string' ? m.content.length > 0 : (Array.isArray(m.content) && m.content.length > 0)));
    const shouldAutoGenerateName = hasDefaultName && validUserMessages.length > 0 && validAssistantMessages.length > 0 && !attemptNameGeneration;
    const finalAttemptNameGeneration = attemptNameGeneration || shouldAutoGenerateName;
    const sessionToStore = limitSessionSize(createLeanSession(sessionToSave));
    let sessionString = JSON.stringify(sessionToStore);
    let storageValue = sessionString.length > 1000 ? compressData(sessionString) : sessionString;

    if (sessionDB) {
      try {
        const isDbAvailable = await sessionDB.isAvailable();
        if (isDbAvailable) {
          const saved = await sessionDB.saveSession(`${sessionToSave.id}`, storageValue);
          if (saved) {
            localStorage.setItem(`${chatSessionPrefixLS}${sessionToSave.id}_idb`, 'true');
            // Force update metadata for IndexedDB sessions
                const metaEntry: ChatSessionMetadata = {
                id: sessionToSave.id, name: sessionToSave.name || `Chat ${new Date(sessionToSave.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
                lastMessageTimestamp: sessionToSave.updatedAt, preview: getMessageTextPreview(sessionToSave.messages.length > 0 ? sessionToSave.messages[sessionToSave.messages.length - 1] : undefined),
                  messageCount: sessionToSave.messages.length,
                };
                const storedIndex = localStorage.getItem(chatHistoryIndexKeyLS);
                let metadataList: ChatSessionMetadata[] = [];
                if (storedIndex) {
              if (storedIndex.startsWith('𫝂')) { // LZString marker
                try { metadataList = JSON.parse(decompressData(storedIndex)); } catch (e) { metadataList = []; }
                  } else {
                try { metadataList = JSON.parse(storedIndex); } catch (e) { metadataList = []; }
                    }
                  }
                metadataList = metadataList.filter(meta => meta.id !== sessionToSave.id);
                metadataList.unshift(metaEntry);
                try {
                  localStorage.setItem(chatHistoryIndexKeyLS, JSON.stringify(metadataList));
                } catch (metaSaveError) {
                  if (isQuotaExceededError(metaSaveError)) {
                try { localStorage.setItem(chatHistoryIndexKeyLS, compressData(JSON.stringify(metadataList))); } catch (c) {}
                    }
                  }
                if (isMounted.current) {
              setHistoryMetadata(prev => deduplicateMetadata([metaEntry, ...prev.filter(meta => meta.id !== sessionToSave.id)]));
            }
            if (finalAttemptNameGeneration) setSessionName(sessionToSave.id);
            return sessionToSave;
          }
        }
      } catch (dbError) { console.warn('Error using IndexedDB, falling back to localStorage:', dbError); }
      }
    try {
      localStorage.setItem(`${chatSessionPrefixLS}${sessionToSave.id}`, storageValue);
      if (finalAttemptNameGeneration) setSessionName(sessionToSave.id);
    } catch (error) {
      if (isQuotaExceededError(error)) {
        const minimalSession = { ...sessionToStore, messages: sessionToStore.messages.slice(-5), files: [] };
        try {
          localStorage.setItem(`${chatSessionPrefixLS}${sessionToSave.id}`, compressData(JSON.stringify(minimalSession)));
          if (finalAttemptNameGeneration) setSessionName(sessionToSave.id);
          if(isMounted.current) setTimeout(() => { if(isMounted.current) toast({ title: "Session Trimmed", description: "Some older messages were removed to save storage space.", duration: 5000 }); }, 0);
        } catch (innerError) {
          if (sessionDB) {
            try {
              const emergencySave = await sessionDB.saveSession(`${sessionToSave.id}`, JSON.stringify(minimalSession));
              if (emergencySave) { if (finalAttemptNameGeneration) setSessionName(sessionToSave.id); return sessionToSave; }
            } catch (lastDbError) {}
          }
          if (isMounted.current) setTimeout(() => { if (isMounted.current) toast({ title: "Storage Error", description: "Could not save chat. Please try deleting older sessions.", variant: "destructive" }); }, 0);
        }
      } else {
        if (isMounted.current) setTimeout(() => { if (isMounted.current) toast({ title: "Save Error", description: "Could not save chat locally.", variant: "destructive" }); }, 0);
      }
    }
    if (isMounted.current) {
      setTimeout(() => {
        if (!isMounted.current) return;
          setHistoryMetadata(prev => {
          const latestMessage = sessionToSave.messages.length > 0 ? sessionToSave.messages[sessionToSave.messages.length - 1] : undefined;
              const existingMeta = prev.find(m => m.id === sessionToSave.id);
          const isDefaultName = existingMeta?.name === 'New Chat' || /Chat \\d{1,2}:\\d{1,2}/.test(existingMeta?.name || '');
          const effectiveName = (!existingMeta || isDefaultName || !existingMeta.name) ? (sessionToSave.name || `Chat ${new Date(sessionToSave.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`) : existingMeta.name;
              const newMeta: ChatSessionMetadata = {
            id: sessionToSave.id, name: effectiveName, lastMessageTimestamp: sessionToSave.updatedAt,
            preview: getMessageTextPreview(latestMessage), messageCount: sessionToSave.messages.length,
          };
              const otherMeta = prev.filter(meta => meta.id !== sessionToSave.id);
              const updatedFullHistory = deduplicateMetadata([newMeta, ...otherMeta]);
          try {
            localStorage.setItem(chatHistoryIndexKeyLS, compressData(JSON.stringify(updatedFullHistory)));
          } catch (error) { console.error("saveSession: Failed to save history index (quota or other).", error); }
              return updatedFullHistory;
          });
      }, 0);
    }
    if (finalAttemptNameGeneration) setSessionName(sessionToSave.id);
    // Removed async Drive save IIFE
    return sessionToSave;
  }, [effectiveUserId, toast, chatHistoryIndexKeyLS, chatSessionPrefixLS, deduplicateMetadata]); // Removed googleAccessToken, appDriveFolderId, authUser

  const deleteSession = useCallback(async (sessionId: string) => {
    if (!effectiveUserId || !sessionId.startsWith(effectiveUserId + '_')) {
        return false; // Return boolean
    }
    // Removed Drive deletion logic
    try {
      const deletedSessions = JSON.parse(localStorage.getItem(deletedSessionsLSKey) || '[]');
      if (!deletedSessions.includes(sessionId)) {
        deletedSessions.push(sessionId);
        localStorage.setItem(deletedSessionsLSKey, JSON.stringify(deletedSessions));
      }
    } catch (error) { console.error(`deleteSession: Error updating deleted sessions list:`, error); }

    try {
      localStorage.removeItem(`${chatSessionPrefixLS}${sessionId}`);
      if (sessionDB) await sessionDB.deleteSession(sessionId); // Also remove from IndexedDB

      if (isMounted.current) {
          setHistoryMetadata(prev => {
            const updatedHistory = prev.filter(meta => meta.id !== sessionId);
            const finalHistory = deduplicateMetadata(updatedHistory);
            try {
              localStorage.setItem(chatHistoryIndexKeyLS, compressData(JSON.stringify(finalHistory)));
            } catch (error) { console.error("deleteSession: Failed to update LS index.", error); }
            return finalHistory;
          });
          toast({ title: "Session Deleted Locally", description: `Session removed from local storage.`});
          }
      return true; // Indicate success
    } catch (error) {
      console.error(`deleteSession: Failed to delete session ${sessionId} from local storage:`, error);
      if (isMounted.current) toast({ title: "Local Deletion Error", description: `Could not delete session locally.`, variant: "destructive"});
      return false; // Indicate failure
    }
  }, [effectiveUserId, toast, chatHistoryIndexKeyLS, chatSessionPrefixLS, deduplicateMetadata, deletedSessionsLSKey]); // Removed googleAccessToken, authUser?.uid

  const createNewSession = useCallback((initialMessages: ChatMessage[] = [], modelIdForNameGeneration?: string): ChatSession => { // Removed userApiKeyForNameGen
    if (!effectiveUserId) {
        const tempId = `error_no_user_${Date.now()}_${Math.random().toString(36).substring(2,11)}`;
         return { id: tempId, name: 'New Chat (Error)', messages: [], createdAt: Date.now(), updatedAt: Date.now(), userId: "unknown_user", };
    }
    const newSessionId = `${effectiveUserId}_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
    const now = Date.now();
    const newSession: ChatSession = {
      id: newSessionId, name: 'New Chat', messages: initialMessages, createdAt: now, updatedAt: now, userId: effectiveUserId,
    };
    saveSession(newSession, true, modelIdForNameGeneration || DEFAULT_MODEL_ID);
    return newSession;
  }, [effectiveUserId, saveSession]);

  // Removed syncWithDrive, syncUploadToDrive, syncDownloadFromDrive functions

  const renameSession = useCallback(async (sessionId: string, newName: string): Promise<boolean> => {
    if (!effectiveUserId || !sessionId.startsWith(effectiveUserId + '_')) {
      return false;
    }
    try {
      const session = await getSession(sessionId);
      if (!session) return false;
      const updatedSession = { ...session, name: newName };
      await saveSession(updatedSession);
      if (isMounted.current) {
    setHistoryMetadata(prev => {
      const existingIndex = prev.findIndex(meta => meta.id === sessionId);
      if (existingIndex === -1) return prev;
      const updated = [...prev];
          updated[existingIndex] = { ...updated[existingIndex], name: newName };
          const finalHistory = deduplicateMetadata(updated);
          try { localStorage.setItem(chatHistoryIndexKeyLS, compressData(JSON.stringify(finalHistory))); } catch (error) {}
          return finalHistory;
        });
      }
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem('desainr_ui_update_trigger', Date.now().toString());
          window.dispatchEvent(new CustomEvent('chat-name-updated', { 
            detail: { sessionId, newName, userId: effectiveUserId, timestamp: Date.now(), source: 'manual-rename', forceUpdate: true }
          }));
        } catch (error) {}
      }
      return true;
    } catch (error) {
      return false;
    }
  }, [effectiveUserId, getSession, saveSession, chatHistoryIndexKeyLS, deduplicateMetadata]);

  // Adding back these functions that were referenced but removed during simplification
  // Simplified version of cleanupCorruptedLocalStorage
  const cleanupCorruptedLocalStorage = (effectiveUserId: string) => {
    if (!effectiveUserId) return;
    const chatHistoryIndexKeyLS = `${CHAT_HISTORY_INDEX_KEY_LS_PREFIX}${effectiveUserId}`;
    const chatSessionPrefixLS = `${CHAT_SESSION_PREFIX_LS_PREFIX}${effectiveUserId}_`;

    try {
      // Clean up individual corrupted sessions
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(chatSessionPrefixLS) && !key.endsWith('_idb')) {
          try {
            const sessionData = localStorage.getItem(key);
            if (sessionData) {
              if (isCompressedData(sessionData)) {
                const decompressed = decompressData(sessionData);
                if (!decompressed) { // Decompression failed or returned empty
                  localStorage.removeItem(key);
                  console.warn(`Removed corrupted (failed decompress) session: ${key}`);
                  continue;
                }
                safeJsonParse(decompressed); // Attempt parse
              } else {
                safeJsonParse(sessionData); // Attempt parse
              }
            }
          } catch (e) {
            // If parsing fails, remove the item
            localStorage.removeItem(key);
            console.warn(`Removed corrupted (parse failed) session: ${key}`);
          }
        }
      }

      // Clean up corrupted history index
      const historyIndexJson = localStorage.getItem(chatHistoryIndexKeyLS);
      if (historyIndexJson) {
        try {
          let parsedIndex;
          if (isCompressedData(historyIndexJson)) {
            const decompressed = decompressData(historyIndexJson);
            if (!decompressed) {
               localStorage.removeItem(chatHistoryIndexKeyLS);
               console.warn('Removed corrupted (failed decompress) history index');
               return;
            }
            parsedIndex = safeJsonParse(decompressed);
          } else {
            parsedIndex = safeJsonParse(historyIndexJson);
          }
          if (!parsedIndex || !Array.isArray(parsedIndex)) {
            localStorage.removeItem(chatHistoryIndexKeyLS);
            console.warn('Removed corrupted (invalid format) history index');
          }
        } catch (e) {
          localStorage.removeItem(chatHistoryIndexKeyLS);
          console.warn('Removed corrupted (parse failed) history index');
        }
      }
    } catch (error) {
      console.error('Error during localStorage cleanup:', error);
    }
  };

  // Simplified version of repairChatHistoryMetadata
  const repairChatHistoryMetadata = async (effectiveUserId: string): Promise<boolean> => {
    if (!effectiveUserId) return false;
    console.log(`repairChatHistoryMetadata: Starting for user ${effectiveUserId}`);
    const chatHistoryIndexKeyLS = `${CHAT_HISTORY_INDEX_KEY_LS_PREFIX}${effectiveUserId}`;
    const chatSessionPrefixLS = `${CHAT_SESSION_PREFIX_LS_PREFIX}${effectiveUserId}_`;
    let metadataRepaired = false;

    try {
      const reconstructedMetadata: ChatSessionMetadata[] = [];
      const existingMetadataIds = new Set<string>();

      // Load existing metadata if any, to avoid duplicating already correct entries
      const existingHistoryJson = localStorage.getItem(chatHistoryIndexKeyLS);
      if (existingHistoryJson) {
        try {
          let parsedExisting;
          if (isCompressedData(existingHistoryJson)) {
            const decompressed = decompressData(existingHistoryJson);
            parsedExisting = safeJsonParse(decompressed);
          } else {
            parsedExisting = safeJsonParse(existingHistoryJson);
          }
          if (parsedExisting && Array.isArray(parsedExisting)) {
            parsedExisting.forEach(meta => {
              if (meta && meta.id) {
                existingMetadataIds.add(meta.id);
                reconstructedMetadata.push(meta); // Keep valid existing entries
              }
            });
          }
        } catch (e) {
          console.warn('repairChatHistoryMetadata: Could not parse existing history index, will rebuild from scratch.', e);
        }
      }
      
      const localKeys = [];
      for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key && key.startsWith(chatSessionPrefixLS) && !key.endsWith('_idb')) {
              localKeys.push(key);
          }
      }

      for (const key of localKeys) {
        const sessionId = key.replace(chatSessionPrefixLS, '');
        if (existingMetadataIds.has(sessionId)) continue; // Skip if already processed

        try {
          const sessionData = localStorage.getItem(key);
          if (!sessionData) continue;

          let session: ChatSession | null = null;
          if (isCompressedData(sessionData)) {
            const decompressed = decompressData(sessionData);
            if (decompressed) session = safeJsonParse(decompressed);
          } else {
            session = safeJsonParse(sessionData);
          }

          if (session && session.id && session.id === sessionId && Array.isArray(session.messages)) {
            const lastMessage = session.messages.length > 0 ? session.messages[session.messages.length - 1] : undefined;
            const meta: ChatSessionMetadata = {
              id: session.id,
              name: session.name || generateSessionName(session.createdAt || Date.now()),
              lastMessageTimestamp: session.updatedAt || Date.now(),
              preview: getMessageTextPreview(lastMessage),
              messageCount: session.messages.length,
            };
            reconstructedMetadata.push(meta);
            metadataRepaired = true;
            existingMetadataIds.add(sessionId); // Add to set after successful processing
          }
        } catch (error) {
          console.error(`repairChatHistoryMetadata: Error processing session ${key}:`, error);
        }
      }

      if (metadataRepaired) {
        // Save the reconstructed metadata
        const finalMetadata = deduplicateMetadata(reconstructedMetadata.filter(Boolean)); // Ensure no null/undefined items
        finalMetadata.sort((a, b) => b.lastMessageTimestamp - a.lastMessageTimestamp);
        try {
          localStorage.setItem(chatHistoryIndexKeyLS, compressData(JSON.stringify(finalMetadata)));
          console.log(`repairChatHistoryMetadata: Successfully repaired and saved metadata for user ${effectiveUserId}. Found ${finalMetadata.length} sessions.`);
        } catch (saveError) {
          console.error('repairChatHistoryMetadata: Error saving repaired metadata:', saveError);
          metadataRepaired = false; // Indicate failure if save fails
        }
      } else {
          console.log(`repairChatHistoryMetadata: No repairs needed or no data to repair for user ${effectiveUserId}.`);
      }
    } catch (error) {
      console.error(`repairChatHistoryMetadata: General error for user ${effectiveUserId}:`, error);
      metadataRepaired = false;
    }
    return metadataRepaired;
  };

  return {
    historyMetadata,
    isLoading,
    isSyncing, // Consider if this is still needed
    getSession,
    saveSession,
    deleteSession,
    renameSession,
    createNewSession,
    // Removed Drive sync functions from return
    triggerGoogleSignIn: undefined, // Explicitly set to undefined or remove if not used
    cleanLocalStorage: () => cleanupCorruptedLocalStorage(effectiveUserId),
    repairMetadata: () => repairChatHistoryMetadata(effectiveUserId)
  };
} 