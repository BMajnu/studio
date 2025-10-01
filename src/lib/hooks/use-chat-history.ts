// src/lib/hooks/use-chat-history.ts
"use client";

import { useState, useEffect, useCallback, useRef } from 'react';
import type { ChatSession, ChatSessionMetadata, ChatMessage, AttachedFile, ChatMessageContentPart } from '@/lib/types';
import { DEFAULT_USER_ID, DEFAULT_MODEL_ID } from '@/lib/constants';
import { generateSessionName, generateSessionNameFromMessage } from '@/lib/session-naming';
import { useAuth } from '@/contexts/auth-context';
import { useToast } from '@/hooks/use-toast';
import getConfig from 'next/config';
import * as LZString from 'lz-string';
import logger from '@/lib/utils/logger';
import eventDebouncer from '@/lib/utils/event-debouncer';
// INSERT: Firebase sync imports
import { queueSessionForSync } from '@/lib/firebase/sync-utils';
import { FirebaseChatStorage } from '@/lib/firebase/chatStorage';
import { forceSyncSession } from '@/lib/firebase/sync-utils';
import { saveUploadedAttachments } from '../storage/uploaded-attachments-local';
import type { UploadedAttachment } from '../storage/uploaded-attachments-local';
import { loadUploadedAttachments } from '../storage/uploaded-attachments-local';
import { loadAttachmentsIndexedDB } from '../storage/uploaded-attachments-indexeddb';
const { session: sessionLogger, storage: storageLogger, history: historyLogger, ui: uiLogger, system: systemLogger } = logger;

// Load configuration for session storage
const { publicRuntimeConfig } = getConfig() || { publicRuntimeConfig: {} };
const { sessionStorageConfig = { maxSessionSize: 1024 * 1024, compressSession: true } } = publicRuntimeConfig;

// Storage keys
const CHAT_HISTORY_INDEX_KEY_LS_PREFIX = 'desainr_chat_history_index_ls_v4_';
const CHAT_SESSION_PREFIX_LS_PREFIX = 'desainr_chat_session_ls_v4_';
const LAST_ACTIVE_SESSION_ID_KEY_PREFIX = 'desainr_last_active_session_id_';
const DELETED_SESSIONS_LS_PREFIX = 'desainr_deleted_sessions_';
const HISTORY_LAST_LOADED_KEY = 'desainr_history_last_loaded';
const HISTORY_CACHE_EXPIRY = 5 * 60 * 1000; // 5 minutes (increased from previous shorter time)
const HISTORY_AUTO_REFRESH_ENABLED = 'desainr_history_auto_refresh_enabled';

// IndexedDB configuration
const DB_NAME = 'DesainrChatSessionsDB';
const DB_VERSION = 1;
const STORE_NAME = 'chat_sessions';

// Global flag to track if the loading procedure has already executed
let globalInitialized = false;

// -----------------------------
// AI Chat Title Generation
// -----------------------------
/** Endpoint that returns a JSON { title: string } given chat messages */
const AI_CHAT_TITLE_ENDPOINT = '/api/generate-chat-title';
/** Tracks which session IDs have already triggered an AI rename attempt in this runtime */
const aiRenameAttempts: Set<string> = new Set();
/** Model ID to always use for chat-title generation - fallback is handled by the API */
const TITLE_MODEL_ID = 'googleai/gemini-flash-lite-latest';

// IndexedDB helper for chat session storage - provides higher storage limits than localStorage
class SessionStorageDB {
  private db: IDBDatabase | null = null;
  private dbInitPromise: Promise<boolean> | null = null;
  
  constructor() {
    this.dbInitPromise = null;
  }
  
  private async initDB(): Promise<boolean> {
    if (this.db) {
      return true;
    }
    
    return new Promise((resolve) => {
      try {
        const request = indexedDB.open('DesAInRChatSessions', 1);
        
        request.onupgradeneeded = (event) => {
          const db = (event.target as IDBOpenDBRequest).result;
          if (!db.objectStoreNames.contains('sessions')) {
            db.createObjectStore('sessions', { keyPath: 'id' });
            systemLogger.info('Created sessions object store in IndexedDB');
          }
      };
      
      request.onsuccess = (event) => {
        this.db = (event.target as IDBOpenDBRequest).result;
          systemLogger.debug('IndexedDB initialized successfully');
        resolve(true);
      };
      
        request.onerror = (event) => {
          systemLogger.error(`Failed to initialize IndexedDB: ${(event.target as IDBOpenDBRequest).error?.message || 'Unknown error'}`);
          resolve(false);
        };
      } catch (error) {
        systemLogger.error(`Exception during IndexedDB initialization: ${error instanceof Error ? error.message : String(error)}`);
        resolve(false);
      }
    });
  }
  
  async isAvailable(): Promise<boolean> {
    if (!this.dbInitPromise) {
      this.dbInitPromise = this.initDB();
    }
    return this.dbInitPromise;
  }
  
  async saveSession(sessionId: string, data: string): Promise<boolean> {
    if (!await this.isAvailable() || !this.db) {
      return false;
    }
    
    return new Promise((resolve) => {
      try {
        const transaction = this.db!.transaction(['sessions'], 'readwrite');
        const store = transaction.objectStore('sessions');
        
        const request = store.put({
          id: sessionId,
          data,
          timestamp: Date.now()
        });
        
        request.onsuccess = () => {
          storageLogger.debug(`Successfully saved session ${sessionId} to IndexedDB`);
          resolve(true);
        };
        
        request.onerror = (event) => {
          storageLogger.error(`Error saving session ${sessionId} to IndexedDB: ${(event.target as IDBRequest).error?.message || 'Unknown error'}`);
          resolve(false);
        };
      } catch (error) {
        storageLogger.error(`Exception during IndexedDB save: ${error instanceof Error ? error.message : String(error)}`);
        resolve(false);
      }
    });
  }
  
  async getSession(sessionId: string): Promise<string | null> {
    if (!await this.isAvailable() || !this.db) {
      return null;
    }
    
    return new Promise((resolve) => {
      try {
        const transaction = this.db!.transaction(['sessions'], 'readonly');
        const store = transaction.objectStore('sessions');
        
        const request = store.get(sessionId);
        
        request.onsuccess = () => {
          const result = request.result;
          if (result && result.data) {
            storageLogger.debug(`Successfully retrieved session ${sessionId} from IndexedDB`);
            resolve(result.data);
          } else {
            storageLogger.debug(`Session ${sessionId} not found in IndexedDB`);
            resolve(null);
          }
        };
        
        request.onerror = (event) => {
          storageLogger.error(`Error retrieving session ${sessionId} from IndexedDB: ${(event.target as IDBRequest).error?.message || 'Unknown error'}`);
          resolve(null);
        };
      } catch (error) {
        storageLogger.error(`Exception during IndexedDB get: ${error instanceof Error ? error.message : String(error)}`);
        resolve(null);
      }
    });
  }
  
  async deleteSession(sessionId: string): Promise<boolean> {
    if (!await this.isAvailable() || !this.db) {
      return false;
    }
    
    return new Promise((resolve) => {
      try {
        const transaction = this.db!.transaction(['sessions'], 'readwrite');
        const store = transaction.objectStore('sessions');
        const request = store.delete(sessionId);
        
        request.onsuccess = () => {
          storageLogger.debug(`Successfully deleted session ${sessionId} from IndexedDB`);
          resolve(true);
        };
        
        request.onerror = (event) => {
          storageLogger.error(`Error deleting session ${sessionId} from IndexedDB: ${(event.target as IDBRequest).error?.message || 'Unknown error'}`);
          resolve(false);
        };
      } catch (error) {
        storageLogger.error(`Exception during IndexedDB delete: ${error instanceof Error ? error.message : String(error)}`);
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
        
        console.error('safeJsonParse: Could not extract valid JSON, attempting decompression fallback');
        try {
          const decompressed = decompressData(data);
          if (decompressed && decompressed.trim()) {
            return JSON.parse(decompressed);
          }
        } catch (decompressErr) {
          console.error('safeJsonParse: Decompression fallback failed:', decompressErr);
        }
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
                if (part.title) return `AI Chat: ${part.title.substring(0, 40).trim()}`;
                if (part.text) return `AI Chat instruction: ${part.text.substring(0, 40).trim()}`;
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

// Limit the size of a session object so we don\'t blow past the storage quota.
// Strategy:
// 1. Start with a lean copy that removes large attachments / long text.
// 2. If it is still too big (JSON > maxJsonLength) progressively drop
//    the oldest messages until under the limit (we always retain at least one message).
// 3. Make sure we never return a session with zero messages – add a placeholder if needed.
const limitSessionSize = (session: ChatSession, maxJsonLength = 140_000): ChatSession => {
  try {
    // Deep-ish copy so we don\'t mutate the original
    let working: ChatSession = {
      ...session,
      messages: [...session.messages],
    };

    // Early exit – already small enough
    if (JSON.stringify(working).length <= maxJsonLength) {
      return working;
    }

    // Step 1 – apply lean transformation (strips dataUri, long text, etc.)
    working = createLeanSession(working);

    // Step 2 – iteratively drop the oldest messages until we fit or have only one left
    while (
      JSON.stringify(working).length > maxJsonLength &&
      working.messages.length > 1
    ) {
      working.messages.shift();
    }

    // Step 3 – ensure we always have at least one message for the UI
    if (working.messages.length === 0) {
      working.messages.push({
        id: `placeholder_${Date.now()}`,
        role: 'system',
        content:
          'Older messages were trimmed to keep this chat within browser storage limits.',
        timestamp: Date.now(),
      } as ChatMessage);
    }

    return working;
  } catch (err) {
    console.warn('limitSessionSize: Failed to trim session – returning original', err);
    return session;
  }
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
  
  historyLogger.debug(`updateSessionName: Generated name: "${newName}" for session ${sessionId}`);
  
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
      historyLogger.error(`updateSessionName: Error updating history metadata`);
    }
    
    // Dispatch event for UI update - use the debouncer to prevent event cascades
    if (typeof window !== 'undefined') {
      try {
        if (eventDebouncer.trackDispatchedEvent('chat-name-updated', sessionId)) {
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
        }
      } catch (error) {
        historyLogger.error(`updateSessionName: Error dispatching event`);
      }
    }
    
    return true;
  } catch (error) {
    historyLogger.error(`updateSessionName: Error saving session`);
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
          session = safeJsonParse(decompressed);
        } else {
          session = safeJsonParse(dbSessionData);
        }
      }
    }
    
    // If not found in IndexedDB, try localStorage
    if (!session) {
      const sessionJson = localStorage.getItem(`${localStorageKey}${sessionId}`);
      if (sessionJson) {
        if (isCompressedData(sessionJson)) {
          const decompressed = decompressData(sessionJson);
          session = safeJsonParse(decompressed);
        } else {
          session = safeJsonParse(sessionJson);
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

async function triggerRename(session: ChatSession): Promise<string | null> {
  const userMessages = session.messages
    .filter((msg) => msg.role === 'user' && msg.content)
    .slice(-2);
  
  if (userMessages.length === 0) {
    return null;
  }
  
  try {
    const response = await fetch('/api/generate-chat-title', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: userMessages.map(m => ({
          role: 'user',
          // Extract text from content, whether it's a string or complex parts
          text: typeof m.content === 'string'
            ? m.content
            : (m.content as ChatMessageContentPart[])
                .map(p => p.type === 'text' ? p.text : '')
                .join(' ')
                .trim()
        })),
        modelId: TITLE_MODEL_ID,
      }),
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Failed to generate chat title:', response.status, errorText);
      return null;
    }
    
    const data = await response.json();
    return data.title || null;
  } catch (error) {
    console.error('Error in triggerRename:', error);
    return null;
  }
}

export function useChatHistory(userIdFromProfile: string | undefined) {
  const { user: authUser, googleAccessToken } = useAuth(); // Removed triggerGoogleSignInFromAuth as it's not used
  const { toast } = useToast();
  const [historyMetadata, setHistoryMetadata] = useState<ChatSessionMetadata[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false); // This might be removed if no async ops remain

  // Early return for server-side rendering environment
  if (typeof window === 'undefined') {
    return {
      historyMetadata: [],
      isLoading: false,
      isSyncing: false,
      getSession: async () => null,
      saveSession: async (session: ChatSession) => session,
      deleteSession: async () => false,
      renameSession: async () => false,
      createNewSession: () => ({ 
        id: 'temp_id', 
        name: 'New Chat', 
        messages: [], 
        createdAt: Date.now(), 
        updatedAt: Date.now(), 
        userId: userIdFromProfile || 'unknown_user' 
      }),
      triggerGoogleSignIn: undefined,
      cleanLocalStorage: () => {},
      repairMetadata: () => Promise.resolve(false),
      setAutoRefreshEnabled: () => {},
      isAutoRefreshEnabled: true
    };
  }

  const effectiveUserId = authUser?.uid || userIdFromProfile || DEFAULT_USER_ID;
  // Firebase is available for all user IDs (including "default-user") since rules allow it
  const canUseFirebase = !!effectiveUserId;
  const chatHistoryIndexKeyLS = `${CHAT_HISTORY_INDEX_KEY_LS_PREFIX}${effectiveUserId}`;
  const chatSessionPrefixLS = `${CHAT_SESSION_PREFIX_LS_PREFIX}${effectiveUserId}_`;
  const deletedSessionsLSKey = `${DELETED_SESSIONS_LS_PREFIX}${effectiveUserId}`;

  const isMounted = useRef(false);

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  // Removed initializeDriveFolder

  const loadHistoryIndex = useCallback(async () => {
    if (!effectiveUserId) {
      historyLogger.warn("loadHistoryIndex: No effectiveUserId. Cannot load history.");
      if (isMounted.current) setHistoryMetadata([]);
      return;
    }
    historyLogger.info(`loadHistoryIndex: Running for user ${effectiveUserId}.`);

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
          historyLogger.error('loadHistoryIndex: Error processing stored index:', error);
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
          historyLogger.error('loadHistoryIndex: Error loading metadata from IndexedDB:', dbError);
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
                    createdAt: session.createdAt || Date.now()
                  };
                  reconstructedMetadata.push(meta);
                }
            } catch (error) { historyLogger.error(`loadHistoryIndex: Error processing session during reconstruction:`, error); }
              }
            }
        if (reconstructedMetadata.length > 0) {
          localParsedIndex = reconstructedMetadata;
          try {
            localStorage.setItem(chatHistoryIndexKeyLS, compressData(JSON.stringify(reconstructedMetadata)));
          } catch (error) { historyLogger.error('loadHistoryIndex: Error saving reconstructed metadata:', error); }
        }
      }
      
      // INSERT: Merge Firebase metadata
      if (canUseFirebase && typeof navigator !== 'undefined' && navigator.onLine) {
        try {
          const remoteMetadata = await FirebaseChatStorage.listSessionsMetadata(effectiveUserId);
          if (Array.isArray(remoteMetadata) && remoteMetadata.length > 0) {
            const metaMap = new Map<string, ChatSessionMetadata>();
            [...localParsedIndex, ...remoteMetadata].forEach(meta => {
              const existing = metaMap.get(meta.id);
              if (!existing || meta.lastMessageTimestamp > existing.lastMessageTimestamp) {
                metaMap.set(meta.id, meta);
              }
            });
            localParsedIndex = Array.from(metaMap.values()).sort((a, b) => b.lastMessageTimestamp - a.lastMessageTimestamp);
            try {
              localStorage.setItem(chatHistoryIndexKeyLS, compressData(JSON.stringify(localParsedIndex)));
            } catch (persistErr) {
              historyLogger.warn('loadHistoryIndex: Unable to persist merged Firebase metadata', persistErr);
            }
          }
        } catch (firebaseErr) {
          historyLogger.error('loadHistoryIndex: Error fetching metadata from Firebase', firebaseErr);
        }
      }
      
      // NEW: Update metadata with accurate session information during reload
      const updatedMetadata = [...localParsedIndex];
      let metadataUpdated = false;
      
      // Check the URL for current active session
      let activeSessionId = null;
      if (typeof window !== 'undefined' && window.location) {
        const urlParams = new URLSearchParams(window.location.search);
        activeSessionId = urlParams.get('id');
      }
      
      // Check active session first
      if (activeSessionId && activeSessionId.startsWith(effectiveUserId + '_')) {
        try {
          // Try to get the actual session data to ensure name is correct
          const sessionData = await getSessionDirectly(activeSessionId, effectiveUserId, chatSessionPrefixLS);
          if (sessionData) {
            // Find this session in metadata
            const metaIndex = updatedMetadata.findIndex(m => m.id === activeSessionId);
            if (metaIndex >= 0) {
              // Update metadata with actual session values
              updatedMetadata[metaIndex] = {
                ...updatedMetadata[metaIndex],
                name: sessionData.name || updatedMetadata[metaIndex].name,
                preview: sessionData.messages && sessionData.messages.length > 0 
                  ? getMessageTextPreview(sessionData.messages[sessionData.messages.length - 1])
                  : updatedMetadata[metaIndex].preview,
                messageCount: sessionData.messages ? sessionData.messages.length : updatedMetadata[metaIndex].messageCount,
                createdAt: sessionData.createdAt || updatedMetadata[metaIndex].createdAt
              };
              metadataUpdated = true;
              historyLogger.debug(`loadHistoryIndex: Updated metadata for active session ${activeSessionId} with name "${sessionData.name}"`);
            } else {
              // Session exists but isn't in metadata - add it
              updatedMetadata.push({
                id: activeSessionId,
                name: sessionData.name || `Chat ${new Date(sessionData.createdAt || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
                lastMessageTimestamp: sessionData.updatedAt || Date.now(),
                preview: getMessageTextPreview(
                  sessionData.messages && sessionData.messages.length > 0 
                  ? sessionData.messages[sessionData.messages.length - 1] : undefined
                ),
                messageCount: sessionData.messages ? sessionData.messages.length : 0,
                createdAt: sessionData.createdAt || Date.now()
              });
              metadataUpdated = true;
              historyLogger.debug(`loadHistoryIndex: Added active session ${activeSessionId} to metadata with name "${sessionData.name}"`);
            }
          }
        } catch (error) {
          historyLogger.error(`loadHistoryIndex: Error processing active session ${activeSessionId}:`, error);
        }
      }
      
      // If metadata was updated, save the changes
      if (metadataUpdated) {
        try {
          localStorage.setItem(chatHistoryIndexKeyLS, compressData(JSON.stringify(updatedMetadata)));
          localParsedIndex = updatedMetadata;
          historyLogger.debug('loadHistoryIndex: Updated metadata saved successfully');
        } catch (error) {
          historyLogger.error('loadHistoryIndex: Error saving updated metadata:', error);
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
                    // Check if data is compressed and handle accordingly
                    let sessionData;
                    if (isCompressedData(sessionExists)) {
                      const decompressed = decompressData(sessionExists);
                      sessionData = safeJsonParse(decompressed);
                    } else {
                      sessionData = safeJsonParse(sessionExists);
                    }

                    if (sessionData) {
                      const newMetaEntry: ChatSessionMetadata = {
                        id: sessionId,
                        name: sessionData.name || `Chat ${new Date(sessionData.createdAt || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
                        lastMessageTimestamp: sessionData.updatedAt || Date.now(),
                        preview: sessionData.messages && Array.isArray(sessionData.messages) && sessionData.messages.length > 0 ? getMessageTextPreview(sessionData.messages[sessionData.messages.length - 1]) : 'Chat',
                        messageCount: sessionData.messages && Array.isArray(sessionData.messages) ? sessionData.messages.length : 0,
                        createdAt: sessionData.createdAt || Date.now()
                      };
                      if (!seenIds.has(sessionId)) {
                        localParsedIndex.push(newMetaEntry);
                        seenIds.add(sessionId);
                      }
                    }
                  }
            } catch (e) { historyLogger.warn(`loadHistoryIndex: Error checking IndexedDB for missing session ${sessionId}:`, e); }
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
          } else { historyLogger.error('loadHistoryIndex: Failed to save filtered metadata:', storageError); }
          }
        }
      filteredLocal.forEach(meta => {
        if (!seenIds.has(meta.id)) {
          combinedMetadata.push(meta);
          seenIds.add(meta.id);
        }
      });
      historyLogger.info(`loadHistoryIndex: Loaded ${filteredLocal.length} sessions from storage.`);
    } catch (error) {
      historyLogger.error("loadHistoryIndex: Error loading/parsing local chat history index:", error);
    }

    // Removed Google Drive loading section

    if (combinedMetadata.length === 0 && typeof window !== 'undefined' && window.location) {
      const urlParams = new URLSearchParams(window.location.search);
      const currentSessionId = urlParams.get('id');
      if (currentSessionId && currentSessionId.startsWith(effectiveUserId + '_')) {
        const placeholderMeta: ChatSessionMetadata = {
          id: currentSessionId,
          name: 'Current Chat',
          lastMessageTimestamp: Date.now(),
          preview: 'Active chat session',
          messageCount: 0,
          createdAt: Date.now(),
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
        } catch (error) { historyLogger.error(`loadHistoryIndex: Error checking localStorage for active session:`, error); }
      }
    }
    if (isMounted.current) {
      const sortedMetadata = combinedMetadata.sort((a, b) => b.lastMessageTimestamp - a.lastMessageTimestamp);
      setHistoryMetadata(sortedMetadata);
      setIsLoading(false);
      
      // NEW: Force a session title update notification after reload
      if (typeof window !== 'undefined' && window.location) {
        const urlParams = new URLSearchParams(window.location.search);
        const currentSessionId = urlParams.get('id');
        if (currentSessionId && sortedMetadata.some(m => m.id === currentSessionId)) {
          const sessionMeta = sortedMetadata.find(m => m.id === currentSessionId);
          if (sessionMeta) {
            // Use setTimeout to ensure this happens after render
            setTimeout(() => {
              window.dispatchEvent(new CustomEvent('chat-name-updated', { 
                detail: { 
                  sessionId: currentSessionId, 
                  newName: sessionMeta.name, 
                  userId: effectiveUserId, 
                  timestamp: Date.now(), 
                  source: 'reload-recovery',
                  forceUpdate: true 
                }
              }));
              historyLogger.debug(`loadHistoryIndex: Dispatched recovery chat-name-updated for ${currentSessionId} with name "${sessionMeta.name}"`);
            }, 500);
          }
        }
      }
    }
  }, [effectiveUserId, chatHistoryIndexKeyLS, chatSessionPrefixLS]); 

// NEW: Add helper function to get a session directly without caching
const getSessionDirectly = async (sessionId: string, userId: string, prefix: string): Promise<ChatSession | null> => {
  // 1. Try IndexedDB directly first (no size limits)
  if (sessionDB) {
    const raw = await sessionDB.getSession(sessionId);
    if (raw) {
      try {
        const parsed: ChatSession = JSON.parse(raw);
        // back-fill lean copy to LS if small
        try {
          const leanStr = JSON.stringify(limitSessionSize(createLeanSession(parsed)));
          if (leanStr.length < 140000) {
            localStorage.setItem(`${prefix}${sessionId}`, leanStr);
          }
        } catch { /* ignore */ }
        // Change return parsed to:
        const hydrated = parsed ? await (async () => { await hydrateSessionAttachments(parsed, userId); return parsed; })() : parsed;
        return hydrated;
      } catch { /* fall through */ }
    }
  }
  
  // INSERT: Try Firebase if not found locally
  if (!userId || !sessionId.startsWith(userId + '_')) {
    return null;
  }
  
  // First try from localStorage
  try {
    const storedSession = localStorage.getItem(`${prefix}${sessionId}`);
    if (storedSession) {
      if (isCompressedData(storedSession)) {
        const decompressed = decompressData(storedSession);
        if (decompressed) {
          return safeJsonParse(decompressed);
        }
      } else {
        return safeJsonParse(storedSession);
      }
    }
  } catch (error) {
    historyLogger.error(`getSessionDirectly: Error reading from localStorage for ${sessionId}:`, error);
  }
  
  // Try IndexedDB
  if (sessionDB) {
    try {
      const isInIndexedDB = localStorage.getItem(`${prefix}${sessionId}_idb`) === 'true';
      if (isInIndexedDB) {
        const dbSessionData = await sessionDB.getSession(`${sessionId}`);
        if (dbSessionData) {
          if (isCompressedData(dbSessionData)) {
            const decompressed = decompressData(dbSessionData);
            return safeJsonParse(decompressed);
          } else {
            return safeJsonParse(dbSessionData);
          }
        }
      }
      } catch (error) {
      historyLogger.error(`getSessionDirectly: Error reading from IndexedDB for ${sessionId}:`, error);
      }
  }
  
  return null;
    };

// Modify getSession to add special reload state handling
  const getSession = useCallback(async (sessionId: string): Promise<ChatSession | null> => {
    if (!effectiveUserId) {
      return null;
    }
    
    // Check if the sessionId format is valid - should start with the user ID
    if (!sessionId.startsWith(effectiveUserId + '_')) {
      historyLogger.warn(`getSession: SessionId ${sessionId} does not match current user ${effectiveUserId}`);
      return null;
    }

    sessionLogger.debug(`getSession: Loading session ${sessionId}`);
    
    // Add special flag for detecting reloads
    const sessionWasReloaded = window.sessionStorage.getItem(`session_reloaded_${sessionId}`) === 'true';
    if (!sessionWasReloaded) {
      window.sessionStorage.setItem(`session_reloaded_${sessionId}`, 'true');
    } else {
      historyLogger.debug(`getSession: Detected reload for session ${sessionId}`);
      // Clear the flag for future reloads
      window.sessionStorage.removeItem(`session_reloaded_${sessionId}`);
    }
    
    // Implement a simple in-memory session cache
    const sessionCacheKey = `session_cache_${sessionId}`;
    const cachedSession = (window as any)[sessionCacheKey] as ChatSession | undefined;
    
    // If we have a recently cached session (< 2 seconds old), use it
    if (cachedSession && Date.now() - cachedSession.updatedAt < 2000) {
      sessionLogger.debug(`getSession: Using cached session ${sessionId} (age: ${Date.now() - cachedSession.updatedAt}ms)`);
      return cachedSession;
    }
    
    // NEW: Fast path – attempt to fetch from IndexedDB before touching localStorage
    try {
      const directSession = await getSessionDirectly(sessionId, effectiveUserId, chatSessionPrefixLS);
      if (directSession) {
        sessionLogger.debug(`getSession: Loaded session ${sessionId} via getSessionDirectly (IndexedDB-first)`);
        (window as any)[sessionCacheKey] = directSession;
        // Optionally update metadata if this load happened on a reload
        if (sessionWasReloaded) {
          updateSessionMetadataOnReload(sessionId, directSession);
        }
        return directSession;
      }
    } catch (quickErr) {
      storageLogger.warn(`getSession: getSessionDirectly failed for ${sessionId}`, quickErr as any);
    }
    
    let session: ChatSession | null = null;
    let errors = [];
    
    // First try from localStorage
    try {
      const storedSession = localStorage.getItem(`${chatSessionPrefixLS}${sessionId}`);
      if (storedSession) {
        try {
          // Check if the data looks like it's compressed
          if (isCompressedData(storedSession)) {
            storageLogger.debug(`getSession: Found compressed data for session ${sessionId} in localStorage`);
            try {
              const decompressed = decompressData(storedSession);
              if (decompressed && decompressed.trim()) {
                session = safeJsonParse(decompressed);
                if (session) {
                  storageLogger.debug(`getSession: Successfully loaded session ${sessionId} from localStorage (compressed)`);
                  
                  // Update cache
                  (window as any)[sessionCacheKey] = session;
                  
                  // If this was a reload, update the history metadata to ensure synchronization
                  if (sessionWasReloaded) {
                    updateSessionMetadataOnReload(sessionId, session);
                  }
                  
                  await hydrateSessionAttachments(session, effectiveUserId);
                  return session;
                } else {
                  storageLogger.error(`getSession: Failed to parse decompressed JSON for ${sessionId}`);
                  errors.push('localStorage: decompressed JSON parse failed');
                }
              } else {
                storageLogger.error(`getSession: Decompression returned empty result for ${sessionId}`);
                errors.push('localStorage: decompression returned empty result');
              }
            } catch (decompressError: any) {
              storageLogger.error(`getSession: Decompression error for ${sessionId}`);
              errors.push(`localStorage decompress: ${decompressError.message || 'Unknown error'}`);
            }
          } else {
            // Not compressed - direct JSON parse
            try {
              session = safeJsonParse(storedSession);
              if (session) {
                storageLogger.debug(`getSession: Successfully loaded session ${sessionId} from localStorage (uncompressed)`);
                
                // Update cache
                (window as any)[sessionCacheKey] = session;
                
                // If this was a reload, update the history metadata to ensure synchronization
                if (sessionWasReloaded) {
                  updateSessionMetadataOnReload(sessionId, session);
                }
                
                await hydrateSessionAttachments(session, effectiveUserId);
                return session;
              } else {
                storageLogger.error(`getSession: Failed to parse JSON for ${sessionId}`);
                errors.push('localStorage: JSON parse failed');
              }
            } catch (parseError: any) {
              storageLogger.error(`getSession: Error parsing localStorage data for ${sessionId}`);
              errors.push(`localStorage parse: ${parseError.message || 'Unknown error'}`);
            }
          }
        } catch (parseError: any) {
          storageLogger.error(`getSession: Error processing localStorage data for ${sessionId}`);
          errors.push(`localStorage process: ${parseError.message || 'Unknown error'}`);
        }
      } else {
        storageLogger.debug(`getSession: No data found in localStorage for ${sessionId}`);
        errors.push('localStorage: No data found');
      }
    } catch (storageError: any) {
      storageLogger.error(`getSession: Error accessing localStorage for ${sessionId}`);
      errors.push(`localStorage access: ${storageError.message || 'Unknown error'}`);
    }

    // Try IndexedDB if available and needed
    if (!session && sessionDB) {
      try {
        // Check if the session is marked as stored in IndexedDB
        const isInIndexedDB = localStorage.getItem(`${chatSessionPrefixLS}${sessionId}_idb`) === 'true';
        
        // Only try IndexedDB if the flag is set or localStorage failed
        if (isInIndexedDB || errors.some(e => e.startsWith('localStorage'))) {
        if (isInIndexedDB) {
            storageLogger.debug(`getSession: Session ${sessionId} is marked as stored in IndexedDB`);
        }

        const dbSessionData = await sessionDB.getSession(`${sessionId}`);
        if (dbSessionData) {
            storageLogger.debug(`getSession: Found data for session ${sessionId} in IndexedDB`);
          try {
            // Check if the data looks like it's compressed
            if (isCompressedData(dbSessionData)) {
                storageLogger.debug(`getSession: IndexedDB data for ${sessionId} appears to be compressed, decompressing...`);
              try {
                const decompressed = decompressData(dbSessionData);
                if (decompressed && decompressed.trim()) {
                  session = safeJsonParse(decompressed);
                  if (session) {
                      storageLogger.debug(`getSession: Successfully loaded session ${sessionId} from IndexedDB (compressed)`);
                      
                      // Update cache
                      (window as any)[sessionCacheKey] = session;
                      
                      // If this was a reload, update the history metadata to ensure synchronization
                      if (sessionWasReloaded) {
                        updateSessionMetadataOnReload(sessionId, session);
                      }
                      
                      await hydrateSessionAttachments(session, effectiveUserId);
                    return session;
                  } else {
                      storageLogger.error(`getSession: Failed to parse decompressed IndexedDB JSON for ${sessionId}`);
                    errors.push('indexedDB: decompressed JSON parse failed');
                  }
                } else {
                    storageLogger.error(`getSession: IndexedDB decompression returned empty result for ${sessionId}`);
                  errors.push('indexedDB: decompression returned empty result');
                }
              } catch (decompressError: any) {
                  storageLogger.error(`getSession: IndexedDB decompression error for ${sessionId}`);
                errors.push(`indexedDB decompress: ${decompressError.message || 'Unknown error'}`);
              }
            } else {
              // Not compressed - direct JSON parse
              try {
                session = safeJsonParse(dbSessionData);
                if (session) {
                    storageLogger.debug(`getSession: Successfully loaded session ${sessionId} from IndexedDB (uncompressed)`);
                    
                    // Update cache
                    (window as any)[sessionCacheKey] = session;
                    
                    // If this was a reload, update the history metadata to ensure synchronization
                    if (sessionWasReloaded) {
                      updateSessionMetadataOnReload(sessionId, session);
                    }
                    
                    await hydrateSessionAttachments(session, effectiveUserId);
                  return session;
                } else {
                    storageLogger.error(`getSession: Failed to parse IndexedDB JSON for ${sessionId}`);
                  errors.push('indexedDB: JSON parse failed');
                }
              } catch (parseError: any) {
                  storageLogger.error(`getSession: Error parsing IndexedDB data for ${sessionId}`);
                errors.push(`indexedDB parse: ${parseError.message || 'Unknown error'}`);
              }
            }
          } catch (processError: any) {
              storageLogger.error(`getSession: Error processing IndexedDB data for ${sessionId}`);
            errors.push(`indexedDB process: ${processError.message || 'Unknown error'}`);
          }
        } else {
            storageLogger.debug(`getSession: No data found in IndexedDB for ${sessionId}`);
          errors.push('indexedDB: No data found');
          }
        }
      } catch (dbError: any) {
        storageLogger.error(`getSession: Error accessing IndexedDB for ${sessionId}`);
        errors.push(`indexedDB access: ${dbError.message || 'Unknown error'}`);
      }
    }
    
    // Create emergency placeholder session if we couldn't find it
    if (!session) {
      historyLogger.warn(`getSession: Session ${sessionId} not found in any storage. Errors: ${errors.join(', ')}`);
      
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
              historyLogger.debug(`getSession: Creating emergency placeholder session for ${sessionId}`);
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
        historyLogger.error(`getSession: Failed to check metadata for session ${sessionId}`);
      }
    }

    // INSERT: Try Firebase if not found locally
    if (!session && typeof navigator !== 'undefined' && navigator.onLine && canUseFirebase) {
      try {
        const remoteSession = await FirebaseChatStorage.getSession(effectiveUserId, sessionId);
        if (remoteSession) {
          try {
            localStorage.setItem(`${chatSessionPrefixLS}${sessionId}`, JSON.stringify(remoteSession));
          } catch (err) {
            storageLogger.warn('getSession: Failed to cache Firebase session locally', err);
          }
          updateSessionMetadataOnReload(sessionId, remoteSession);
          await hydrateSessionAttachments(remoteSession, effectiveUserId);
          return remoteSession;
        }
      } catch (firebaseErr) {
        historyLogger.error(`getSession: Error fetching session ${sessionId} from Firebase`, firebaseErr);
      }
    }

    // At this point we might have found a session.
    // ------------------- FALLBACK TO FIREBASE IF EMPTY -------------------
    if (session && (!session.messages || session.messages.length === 0)) {
      historyLogger.warn(`getSession: Local copy for ${sessionId} contains no messages – attempting Firebase fallback`);

      if (typeof navigator !== 'undefined' && navigator.onLine && canUseFirebase) {
        try {
          const remoteSession = await FirebaseChatStorage.getSession(effectiveUserId, sessionId);
          if (remoteSession && remoteSession.messages && remoteSession.messages.length > 0) {
            historyLogger.info(`getSession: Successfully fetched non-empty session ${sessionId} from Firebase`);

            // Cache the fresh copy locally for next time (prefer IndexedDB if available)
            const remoteStr = JSON.stringify(remoteSession);
            if (sessionDB && (await sessionDB.isAvailable())) {
              await sessionDB.saveSession(sessionId, remoteStr);
              localStorage.setItem(`${chatSessionPrefixLS}${sessionId}_idb`, 'true');
            } else {
              try {
                const valueToStore = remoteStr.length > 1000 ? compressData(remoteStr) : remoteStr;
                localStorage.setItem(`${chatSessionPrefixLS}${sessionId}`, valueToStore);
              } catch (_) {/* ignore quota issues */}
            }

            // Also update metadata to be safe
            updateSessionMetadataOnReload(sessionId, remoteSession);

            session = remoteSession;
          }
        } catch (fbErr) {
          historyLogger.error(`getSession: Firebase fallback failed for ${sessionId}`, fbErr);
        }
      }
    }
    // ------------------- ABSOLUTE LAST RESORT: Fetch from Firebase -------------------
    if (!session && typeof navigator !== 'undefined' && navigator.onLine && canUseFirebase) {
      try {
        const remoteSession = await FirebaseChatStorage.getSession(effectiveUserId, sessionId);
        if (remoteSession) {
          try {
            localStorage.setItem(`${chatSessionPrefixLS}${sessionId}`, JSON.stringify(remoteSession));
          } catch (err) {
            storageLogger.warn('getSession: Failed to cache Firebase session locally', err);
          }
          updateSessionMetadataOnReload(sessionId, remoteSession);
          await hydrateSessionAttachments(remoteSession, effectiveUserId);
          return remoteSession;
        }
      } catch (firebaseErr) {
        historyLogger.error(`getSession: Error fetching session ${sessionId} from Firebase`, firebaseErr);
      }
    }

    return null;
  }, [effectiveUserId, chatSessionPrefixLS, chatHistoryIndexKeyLS]);

// NEW: Helper function to update metadata when a session is loaded during reload
const updateSessionMetadataOnReload = (sessionId: string, session: ChatSession) => {
  try {
    if (!session || !effectiveUserId) return;
    
    historyLogger.debug(`updateSessionMetadataOnReload: Updating metadata for session ${sessionId} with name "${session.name}"`);
    
    // Get the current metadata
    const historyIndexKey = `${CHAT_HISTORY_INDEX_KEY_LS_PREFIX}${effectiveUserId}`;
    const historyIndexJson = localStorage.getItem(historyIndexKey);
    if (!historyIndexJson) return;
    
    // Parse the metadata
    let metadata: ChatSessionMetadata[] = [];
    try {
      if (isCompressedData(historyIndexJson)) {
        const decompressed = decompressData(historyIndexJson);
        metadata = safeJsonParse(decompressed);
      } else {
        metadata = safeJsonParse(historyIndexJson);
      }
    } catch (error) {
      historyLogger.error(`updateSessionMetadataOnReload: Error parsing metadata: ${error}`);
      return;
    }
    
    if (!metadata || !Array.isArray(metadata)) {
      historyLogger.warn(`updateSessionMetadataOnReload: Invalid metadata format`);
      return;
    }
    
    // Find the session in metadata
    const metadataIndex = metadata.findIndex(m => m.id === sessionId);
    if (metadataIndex === -1) {
      // Session not in metadata, add it
      historyLogger.debug(`updateSessionMetadataOnReload: Adding session ${sessionId} to metadata`);
      
      metadata.push({
        id: sessionId,
        name: session.name,
        lastMessageTimestamp: session.updatedAt || Date.now(),
        preview: session.messages && session.messages.length > 0 
          ? getMessageTextPreview(session.messages[session.messages.length - 1]) 
          : 'Chat session',
        messageCount: session.messages ? session.messages.length : 0,
        createdAt: session.createdAt
      });
    } else {
      // Update existing metadata
      historyLogger.debug(`updateSessionMetadataOnReload: Updating existing metadata for session ${sessionId}`);
      
      metadata[metadataIndex] = {
        ...metadata[metadataIndex],
        name: session.name,
        lastMessageTimestamp: session.updatedAt || metadata[metadataIndex].lastMessageTimestamp,
        preview: session.messages && session.messages.length > 0 
          ? getMessageTextPreview(session.messages[session.messages.length - 1]) 
          : metadata[metadataIndex].preview,
        messageCount: session.messages ? session.messages.length : metadata[metadataIndex].messageCount,
        createdAt: session.createdAt || metadata[metadataIndex].createdAt
      };
    }
    
    // Save updated metadata
    try {
      const metadataString = JSON.stringify(metadata);
      const valueToStore = metadataString.length > 1000 ? compressData(metadataString) : metadataString;
      localStorage.setItem(historyIndexKey, valueToStore);
      
      // Update React state if mounted
      if (isMounted.current) {
        setHistoryMetadata(prev => deduplicateMetadata([...metadata]));
      }
      
      // Dispatch event to update UI
      if (typeof window !== 'undefined') {
        if (eventDebouncer.trackDispatchedEvent('metadata-reload-updated', sessionId)) {
          window.dispatchEvent(new CustomEvent('history-updated', {
            detail: {
              sessionId,
              userId: effectiveUserId,
              timestamp: Date.now(),
              source: 'reload-recovery',
              forceUpdate: true
            }
          }));
        }
      }
      
      historyLogger.debug(`updateSessionMetadataOnReload: Successfully updated metadata for session ${sessionId}`);
    } catch (error) {
      historyLogger.error(`updateSessionMetadataOnReload: Error saving metadata: ${error}`);
    }
  } catch (error) {
    historyLogger.error(`updateSessionMetadataOnReload: Unhandled error: ${error}`);
  }
};

  const saveSession: (session: ChatSession, attemptNameGeneration?: boolean, modelIdForNameGeneration?: string) => Promise<ChatSession> = useCallback(async (
    session: ChatSession,
    attemptNameGeneration: boolean = false,
    modelIdForNameGeneration?: string,
  ): Promise<ChatSession> => {
    if (!effectiveUserId || !session || !session.id.startsWith(effectiveUserId + '_')) {
        return session;
    }
    
    sessionLogger.debug(`saveSession: Processing session ${session.id} with ${session.messages.length} messages`);
    
    // Clean up messages to ensure they're in a good state for storage
    const cleanedMessages = session.messages.map(msg => ({
        ...msg,
      content: (msg.isLoading === true && typeof msg.content === 'string' && msg.content === 'Processing...') ? [] : msg.content,
      isLoading: false,
      isError: (msg.isError && typeof msg.content !== 'string') ? true : (msg.isError && typeof msg.content === 'string' && msg.content !== 'Processing...') ? true : false,
    }));
    
    const originalCreatedAt = session.createdAt;
    let sessionToSave: ChatSession = { 
      ...session, 
      updatedAt: Date.now(), 
      createdAt: originalCreatedAt, 
      userId: effectiveUserId, 
      messages: cleanedMessages,
      modelId: attemptNameGeneration && modelIdForNameGeneration ? modelIdForNameGeneration : session.modelId,
    };
    
    const hasDefaultName = !sessionToSave.name || sessionToSave.name === "New Chat" || /^Chat \d{1,2}:\d{2}(:\d{2})?\s*(AM|PM)?$/i.test(sessionToSave.name);
    
    // Only attempt to rename if the name is a default placeholder
    if (attemptNameGeneration && hasDefaultName) {
      try {
        const newTitle = await triggerRename(sessionToSave);
        if (newTitle) {
          sessionToSave.name = newTitle;
          historyLogger.info(`Successfully renamed session ${sessionToSave.id} to "${newTitle}"`);
        }
      } catch (renameError) {
        historyLogger.error(`Failed to rename session ${sessionToSave.id}`, renameError);
      }
    }
    
    // Before deepCopySession creation, process attachments on sessionToSave
    // Ensure every attachment has an attachmentId immediately, and collect for persistence
    const attachmentsToSave: Partial<UploadedAttachment>[] = [];
    sessionToSave.messages.forEach(msg => {
      if (msg.attachedFiles) {
        msg.attachedFiles.forEach(file => {
          if ((file.dataUri || file.textContent) && !file.attachmentId) {
            file.attachmentId = globalThis.crypto?.randomUUID?.() || Math.random().toString(36).slice(2);
          }
          if (file.attachmentId && (file.dataUri || file.textContent)) {
            attachmentsToSave.push({ ...file });
          }
        });
      }
    });

    // Deep copy for storage manipulation (preserves UI copy intact)
    const deepCopySession: ChatSession = JSON.parse(JSON.stringify(sessionToSave));

    if (attachmentsToSave.length) {
      await saveUploadedAttachments(effectiveUserId, attachmentsToSave);
      // Strip heavy fields from deep copy only
      deepCopySession.messages.forEach(msg => {
        msg.attachedFiles?.forEach(file => {
          delete file.dataUri;
          delete file.textContent;
        });
      });
    }

    // Continue using deepCopySession for storage variants
    const sessionForIndexedDB = limitSessionSize(deepCopySession, 5_000_000);
    const sessionForLocalStorage = limitSessionSize(createLeanSession(deepCopySession), 140_000);

    const idbValue = JSON.stringify(sessionForIndexedDB);
    const localValueJson = JSON.stringify(sessionForLocalStorage);

    // By default we still attempt to write lean JSON to localStorage unless oversized
    let localValue: string | null = localValueJson;
    if (localValue && localValue.length > 150000) {
      // if too big, skip localStorage write to avoid quota errors
      localValue = null;
    }
    
    // Track if we were able to save the session anywhere
    let savedSuccessfully = false;
    let savedInLocalStorage = false;
    let savedInIndexedDB = false;

    // 1. Try to save in IndexedDB first (higher storage limit)
    if (sessionDB) {
      try {
        const isDbAvailable = await sessionDB.isAvailable();
        if (isDbAvailable) {
          const saved = await sessionDB.saveSession(`${sessionToSave.id}`, idbValue);
          if (saved) {
            savedInIndexedDB = true;
            storageLogger.debug(`saveSession: Successfully saved session ${sessionToSave.id} to IndexedDB`);
            
            // Mark this session as stored in IndexedDB with a flag in localStorage
            try {
              localStorage.setItem(`${chatSessionPrefixLS}${sessionToSave.id}_idb`, 'true');
            } catch (flagErr) {
              storageLogger.warn(`saveSession: Failed to set IndexedDB flag for ${sessionToSave.id}`);
              // This is non-critical, we can continue
            }
            
            savedSuccessfully = true;
          } else {
            storageLogger.warn(`saveSession: IndexedDB save returned false for ${sessionToSave.id}`);
          }
        } else {
          storageLogger.warn(`saveSession: IndexedDB not available for ${sessionToSave.id}`);
        }
      } catch (dbError) {
        storageLogger.warn(`saveSession: Error using IndexedDB for ${sessionToSave.id}, falling back to localStorage`);
      }
    }
    
    // 2. Try localStorage (as backup or primary if IndexedDB failed)
    if ((!savedInIndexedDB || chatSessionPrefixLS) && localValue !== null) {
      try {
        localStorage.setItem(`${chatSessionPrefixLS}${sessionToSave.id}`, localValue);
        storageLogger.debug(`saveSession: Successfully saved session ${sessionToSave.id} to localStorage`);
        savedInLocalStorage = true;
        savedSuccessfully = true;
      } catch (storageError) {
        storageLogger.warn(`saveSession: Error saving to localStorage for ${sessionToSave.id}`);
        // We ignore further quota handling since we no longer depend on localStorage
      }
    }
    
    // 3. Always update session metadata in the history index
    try {
      // Prepare metadata entry for this session
      const metaEntry: ChatSessionMetadata = {
        id: sessionToSave.id, 
        name: sessionToSave.name || `Chat ${new Date(sessionToSave.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
        lastMessageTimestamp: sessionToSave.updatedAt, 
        preview: getMessageTextPreview(
          sessionToSave.messages.length > 0 ? 
            sessionToSave.messages[sessionToSave.messages.length - 1] : undefined
        ),
        messageCount: sessionToSave.messages.length,
        createdAt: sessionToSave.createdAt,
      };
      
      // Get existing metadata list
      const storedIndex = localStorage.getItem(chatHistoryIndexKeyLS);
      let metadataList: ChatSessionMetadata[] = [];
      
      if (storedIndex) {
        try {
          if (isCompressedData(storedIndex)) {
            const decompressed = decompressData(storedIndex);
            metadataList = JSON.parse(decompressed);
          } else {
            metadataList = JSON.parse(storedIndex);
          }
        } catch (parseError) {
          historyLogger.error(`saveSession: Error parsing history index for ${sessionToSave.id}`);
          metadataList = [];
        }
      }
      
      // Remove existing entry for this session (if any) and add the updated one at the beginning
      metadataList = metadataList.filter(meta => meta.id !== sessionToSave.id);
      metadataList.unshift(metaEntry);
      
      // Save the updated metadata list
      try {
        localStorage.setItem(chatHistoryIndexKeyLS, JSON.stringify(metadataList));
        historyLogger.debug(`saveSession: Updated history index with session ${sessionToSave.id}`);
      } catch (metaSaveError) {
        historyLogger.warn(`saveSession: Error saving history index for ${sessionToSave.id}`);
        
        if (isQuotaExceededError(metaSaveError)) {
          try { 
            localStorage.setItem(chatHistoryIndexKeyLS, compressData(JSON.stringify(metadataList)));
            historyLogger.debug(`saveSession: Saved compressed history index including ${sessionToSave.id}`);
          } catch (compressError) {
            historyLogger.error(`saveSession: Failed to save even compressed history index`);
          }
        }
      }
      
      // Update the React state with the new metadata
      if (isMounted.current) {
        setHistoryMetadata(prev => deduplicateMetadata([
          metaEntry, 
          ...prev.filter(meta => meta.id !== sessionToSave.id)
        ]));
      }
    } catch (metaError) {
      historyLogger.error(`saveSession: Error updating metadata for ${sessionToSave.id}`);
    }

    // 5. Save the session ID as the last active session
    try {
      localStorage.setItem(`${LAST_ACTIVE_SESSION_ID_KEY_PREFIX}${effectiveUserId}`, sessionToSave.id);
      storageLogger.debug(`saveSession: Set ${sessionToSave.id} as last active session for user ${effectiveUserId}`);
    } catch (lastActiveError) {
      storageLogger.warn(`saveSession: Failed to set last active session ID for ${sessionToSave.id}`);
    }
    
    // 6. Dispatch history-updated event (only if the save was successful and using debouncer)
    if (savedSuccessfully && typeof window !== 'undefined') {
      try {
        // Use event debouncer to prevent excessive event dispatch
        if (eventDebouncer.trackDispatchedEvent('history-updated', sessionToSave.id)) {
          localStorage.setItem('desainr_ui_update_trigger', Date.now().toString());
          window.dispatchEvent(new CustomEvent('history-updated', {
            detail: {
              sessionId: sessionToSave.id,
              userId: effectiveUserId,
              timestamp: Date.now(),
              source: 'session-save'
            }
          }));
          historyLogger.debug(`saveSession: Dispatched debounced history-updated event for ${sessionToSave.id}`);
        }
      } catch (eventError) {
        historyLogger.warn(`saveSession: Error dispatching history-updated event for ${sessionToSave.id}`);
      }
    }
    
     // INSERT: Queue Firebase sync
     if (canUseFirebase) {
      try {
        // Queue for background sync
        queueSessionForSync(effectiveUserId, sessionToSave);
        // If online, also attempt immediate sync so user sees it on other devices right away
        if (canUseFirebase && (typeof navigator === 'undefined' || navigator.onLine)) {
          forceSyncSession(effectiveUserId, sessionToSave).catch((err) => {
            historyLogger.warn(`saveSession: Immediate Firebase sync failed for ${sessionToSave.id}, will retry in background`, err);
          });
        }
      } catch (syncErr) {
        historyLogger.warn(`saveSession: Could not queue session ${sessionToSave.id} for Firebase sync`, syncErr);
      }
    }

    if (!savedSuccessfully && !savedInLocalStorage && !savedInIndexedDB) {
      storageLogger.error(`[STORAGE:ERROR] saveSession: Failed to save session ${sessionToSave.id}. Skipped due to size/quota.`);
    }
    
    return sessionToSave;
  }, [effectiveUserId, chatSessionPrefixLS, chatHistoryIndexKeyLS, isMounted, setHistoryMetadata]);

  const deleteSession = useCallback(async (sessionId: string) => {
    if (!effectiveUserId || !sessionId.startsWith(effectiveUserId + '_')) {
        return false; // Return boolean
    }
    // NEW: Try to delete from Firebase first (for authenticated users)
    if (typeof navigator === 'undefined' || navigator.onLine) {
      try {
        const firebaseSuccess = await FirebaseChatStorage.deleteSession(effectiveUserId, sessionId);
        if (!firebaseSuccess) {
          console.error(`deleteSession: Failed to delete session ${sessionId} from Firebase`);
          if (isMounted.current) toast({ title: "Remote Deletion Error", description: `Could not delete session from cloud storage.`, variant: "destructive"});
          return false;
        }
      } catch (fbError) {
        console.error(`deleteSession: Error deleting session ${sessionId} from Firebase:`, fbError);
        if (isMounted.current) toast({ title: "Remote Deletion Error", description: `Could not delete session from cloud storage.`, variant: "destructive"});
        return false;
      }
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
          toast({ title: "Session Deleted", description: `Session removed successfully.`,});
          }
      return true; // Indicate success
    } catch (error) {
      console.error(`deleteSession: Failed to delete session ${sessionId} from local storage:`, error);
      if (isMounted.current) toast({ title: "Local Deletion Error", description: `Could not delete session locally.`, variant: "destructive"});
      return false; // Indicate failure
    }
  }, [effectiveUserId, toast, chatHistoryIndexKeyLS, chatSessionPrefixLS, deduplicateMetadata, deletedSessionsLSKey]); // Removed googleAccessToken, authUser?.uid

  const createNewSession = useCallback((initialMessages: ChatMessage[] = [], modelIdForNameGeneration?: string): ChatSession => {
    if (!effectiveUserId) {
        const tempId = `error_no_user_${Date.now()}_${Math.random().toString(36).substring(2,11)}`;
         return { id: tempId, name: 'New Chat (Error)', messages: [], createdAt: Date.now(), updatedAt: Date.now(), userId: "unknown_user", };
    }
    
    // Check if we should reuse a recent empty session instead of creating a new one
    if (initialMessages.length === 0) {
      // Find any recent empty or nearly empty sessions (< 10 minutes old with no messages)
      const recentEmptySessions = historyMetadata
        .filter(meta => 
          meta.messageCount <= 1 && // Empty or just system message
          meta.lastMessageTimestamp > Date.now() - 10 * 60 * 1000 // Less than 10 minutes old
        );
      
      if (recentEmptySessions.length > 0) {
        // Use the most recent empty session
        const mostRecentEmpty = recentEmptySessions[0]; // Already sorted by timestamp
        historyLogger.debug(`createNewSession: Reusing recent empty session ${mostRecentEmpty.id} instead of creating a new one`);
        
        return {
          id: mostRecentEmpty.id,
          name: 'New Chat',
          messages: initialMessages,
          createdAt: mostRecentEmpty.lastMessageTimestamp,
          updatedAt: Date.now(),
          userId: effectiveUserId,
          modelId: modelIdForNameGeneration || DEFAULT_MODEL_ID
        };
      }
    }

    // Generate a new session ID with better uniqueness guarantees
    const timestamp = Date.now();
    const randomPart = Math.random().toString(36).substring(2, 11);
    const newSessionId = `${effectiveUserId}_${timestamp}_${randomPart}`;
    
    historyLogger.debug(`createNewSession: Creating new chat session ${newSessionId}`);
    
    const newSession: ChatSession = {
      id: newSessionId, 
      name: 'New Chat', 
      messages: initialMessages, 
      createdAt: timestamp, 
      updatedAt: timestamp, 
      userId: effectiveUserId,
      modelId: modelIdForNameGeneration || DEFAULT_MODEL_ID
    };
    
    // Only save if there are messages or user explicitly requested a new session
    saveSession(newSession, initialMessages.length > 0);
    
    return newSession;
  }, [effectiveUserId, saveSession, historyMetadata]);

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

  // Simplified version of cleanupCorruptedLocalStorage
  const cleanupCorruptedLocalStorage = async (effectiveUserId: string) => {
    if (!effectiveUserId) return;
    const chatHistoryIndexKeyLS = `${CHAT_HISTORY_INDEX_KEY_LS_PREFIX}${effectiveUserId}`;
    const chatSessionPrefixLS = `${CHAT_SESSION_PREFIX_LS_PREFIX}${effectiveUserId}_`;
    
    try {
      // First check for corrupted localStorage entries
      const allKeys = Object.keys(localStorage);
      const sessionKeys = allKeys.filter(key => key.startsWith(chatSessionPrefixLS));
      
      for (const key of sessionKeys) {
        try {
          const value = localStorage.getItem(key);
          if (value) {
            // Check if it's compressed data
            if (isCompressedData(value)) {
              try {
                const decompressed = decompressData(value);
                if (!decompressed || decompressed.trim() === '') {
                  console.warn(`cleanupCorruptedLocalStorage: Removing corrupted compressed session: ${key}`);
                  localStorage.removeItem(key);
                }
              } catch (e) {
                console.warn(`cleanupCorruptedLocalStorage: Removing session with decompression error: ${key}`);
                localStorage.removeItem(key);
              }
            } else {
              try {
                JSON.parse(value);
              } catch (e) {
                console.warn(`cleanupCorruptedLocalStorage: Removing session with JSON parse error: ${key}`);
                localStorage.removeItem(key);
              }
            }
          }
        } catch (e) {
          console.error(`cleanupCorruptedLocalStorage: Error processing key ${key}:`, e);
        }
      }
      
      // Check for and cleanup corrupted IndexedDB sessions
      if (sessionDB) {
        try {
          const allKeys = Object.keys(localStorage);
          const idbFlagKeys = allKeys.filter(key => key.startsWith(chatSessionPrefixLS) && key.endsWith('_idb'));
          
          for (const flagKey of idbFlagKeys) {
            const sessionId = flagKey.substring(chatSessionPrefixLS.length, flagKey.length - 4);
            if (sessionId.startsWith(effectiveUserId + '_')) {
              try {
                const sessionExists = await sessionDB.getSession(sessionId);
                if (sessionExists) {
                  try {
                    let isValid = false;
                    if (isCompressedData(sessionExists)) {
                      const decompressed = decompressData(sessionExists);
                      isValid = !!safeJsonParse(decompressed);
                    } else {
                      isValid = !!safeJsonParse(sessionExists);
                    }
                    
                    if (!isValid) {
                      console.warn(`cleanupCorruptedLocalStorage: Removing corrupted IndexedDB session: ${sessionId}`);
                      await sessionDB.deleteSession(sessionId);
                      localStorage.removeItem(flagKey);
                    }
                  } catch (e) {
                    console.warn(`cleanupCorruptedLocalStorage: Error validating IndexedDB session, removing: ${sessionId}`);
                    await sessionDB.deleteSession(sessionId);
                    localStorage.removeItem(flagKey);
                  }
                }
              } catch (e) {
                console.error(`cleanupCorruptedLocalStorage: Error accessing IndexedDB session ${sessionId}:`, e);
              }
            }
          }
        } catch (e) {
          console.error(`cleanupCorruptedLocalStorage: Error checking IndexedDB sessions:`, e);
        }
      }
    } catch (e) {
      console.error("cleanupCorruptedLocalStorage: Unhandled error during cleanup:", e);
    }
  };

  // Simplified version of repairChatHistoryMetadata
  const repairChatHistoryMetadata = async (effectiveUserId: string): Promise<boolean> => {
    historyLogger.info(`repairChatHistoryMetadata: Starting for user ${effectiveUserId}`);
    if (!effectiveUserId) return false;
    
    // Scan localStorage for session data without metadata entries
    const sessionKeys = [];
    const metadataEntries: ChatSessionMetadata[] = [];
    let metadataRepaired = false;
    
    try {
      // Find all session keys in localStorage
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(chatSessionPrefixLS) && !key.endsWith('_idb') && 
           !key.includes('_compressed')) {
          // Extract session ID from key
          const sessionId = key.substring(chatSessionPrefixLS.length);
          if (sessionId.startsWith(effectiveUserId + '_')) {
            sessionKeys.push({ key, sessionId });
          }
        }
      }
      
      // If no sessions found, nothing to repair
      if (sessionKeys.length === 0) {
        console.log(`repairChatHistoryMetadata: No repairs needed or no data to repair for user ${effectiveUserId}.`);
        return false;
      }
      
      // For each session key, attempt to load and create metadata
      for (const { key, sessionId } of sessionKeys) {
        try {
          const sessionData = localStorage.getItem(key);
          if (sessionData) {
            let session: ChatSession | null = null;
            
            if (isCompressedData(sessionData)) {
              const decompressed = decompressData(sessionData);
              if (decompressed) {
                session = safeJsonParse(decompressed);
              }
            } else {
              session = safeJsonParse(sessionData);
            }
            
            if (session && session.id === sessionId) {
              const metadata: ChatSessionMetadata = {
                id: sessionId,
                name: session.name || `Chat ${new Date(session.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
                lastMessageTimestamp: session.updatedAt || Date.now(),
                preview: session.messages && session.messages.length > 0 ? 
                         getMessageTextPreview(session.messages[session.messages.length - 1]) : 'Chat',
                messageCount: session.messages?.length || 0,
                createdAt: session.createdAt
              };
              
              metadataEntries.push(metadata);
              metadataRepaired = true;
            }
          }
        } catch (e) {
          console.error(`repairChatHistoryMetadata: Error processing session ${sessionId}:`, e);
        }
      }
      
      // Only save if we found any valid metadata
      if (metadataEntries.length > 0) {
        const reconstructedMetadata = metadataEntries.sort((a, b) => b.lastMessageTimestamp - a.lastMessageTimestamp);
        
        try {
          localStorage.setItem(chatHistoryIndexKeyLS, compressData(JSON.stringify(reconstructedMetadata)));
          console.log(`repairChatHistoryMetadata: Successfully reconstructed metadata for ${metadataEntries.length} sessions`);
          if (isMounted.current) {
            setHistoryMetadata(reconstructedMetadata);
          }
          console.log('[repair] About to trigger uploadLegacySessions');
          uploadLegacySessions(reconstructedMetadata);
          console.log('[repair] Called uploadLegacySessions');
          metadataRepaired = true;
        } catch (error) {
          if (isQuotaExceededError(error) && sessionDB) {
            try {
              await sessionDB.saveSession('metadata_index', JSON.stringify(reconstructedMetadata));
              metadataRepaired = true;
            } catch (dbError) {
              console.error(`repairChatHistoryMetadata: Failed to save to IndexedDB:`, dbError);
            }
          }
        }
      }
    } catch (error) {
      console.error(`repairChatHistoryMetadata: Unhandled error:`, error);
    }
    
    console.log(`repairChatHistoryMetadata: ${metadataRepaired ? 'Successful repair' : 'No repairs needed or no data to repair'} for user ${effectiveUserId}.`);
    return metadataRepaired;
  };

  // Replace handlePageNavigation to always refresh history on navigation
  const handlePageNavigation = useCallback(() => {
    if (!effectiveUserId || !isMounted.current) return;
    historyLogger.debug('handlePageNavigation: Forcing history reload');
    loadHistoryIndex();
  }, [effectiveUserId, loadHistoryIndex]);

  // Modify the initialization useEffect to always register page navigation listeners and handle first-time initialization separately
  useEffect(() => {
    let forceQuitTimer: ReturnType<typeof setTimeout> | undefined;
    if (!globalInitialized) {
      globalInitialized = true;

      // Force quit any stuck loading state after 3 seconds
      forceQuitTimer = setTimeout(() => {
        if (isMounted.current && isLoading) {
          historyLogger.warn("Force stopping any ongoing loading operations");
          setIsLoading(false);
        }
      }, 3000);

      // Run initialization once
      const initAsync = async () => {
        if (!effectiveUserId || !isMounted.current) {
          setIsLoading(false);
          return;
        }

        setIsLoading(true);
        try {
          await loadHistoryIndex();
          // If no sessions were loaded, try to repair
          if (historyMetadata.length === 0) {
            await repairChatHistoryMetadata(effectiveUserId);
            await loadHistoryIndex();
          }
          // Update last loaded timestamp
          localStorage.setItem(HISTORY_LAST_LOADED_KEY, Date.now().toString());
        } catch (error) {
          historyLogger.error("Error during initialization:", error);
        } finally {
          if (isMounted.current) {
            setIsLoading(false);
          }
        }
      };
      initAsync();
    } else {
      // Clear loading state if needed after first init
      if (isMounted.current && isLoading) {
        setIsLoading(false);
      }
      // Reload history immediately on subsequent mounts
      handlePageNavigation();
    }

    // Always add event listeners for page navigation
    if (typeof window !== 'undefined') {
      window.addEventListener('routeChangeComplete', handlePageNavigation);
      window.addEventListener('focus', handlePageNavigation);
    }

    // Clean up listeners and timers
    return () => {
      if (forceQuitTimer) {
        clearTimeout(forceQuitTimer);
      }
      if (typeof window !== 'undefined') {
        window.removeEventListener('routeChangeComplete', handlePageNavigation);
        window.removeEventListener('focus', handlePageNavigation);
      }
    };
  }, [effectiveUserId, handlePageNavigation]);

  // Add this function to the returned object at the bottom of the hook
  const setAutoRefreshEnabled = useCallback((enabled: boolean) => {
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem(HISTORY_AUTO_REFRESH_ENABLED, enabled ? 'true' : 'false');
        historyLogger.info(`Auto-refresh ${enabled ? 'enabled' : 'disabled'} for chat history`);
      }
    } catch (error) {
      historyLogger.error('Error updating auto-refresh setting', error);
    }
  }, []);

  const uploadLegacySessions = useCallback(async (legacyMetadata: ChatSessionMetadata[]) => {
    console.log(`[legacy-sync] Found ${legacyMetadata.length} legacy sessions. Starting upload to Firebase...`);
    if (!canUseFirebase || !effectiveUserId || legacyMetadata.length === 0) {
      console.log(`[legacy-sync] Aborting: Pre-conditions not met (canUseFirebase: ${canUseFirebase}, user: !!${effectiveUserId}, sessions: ${legacyMetadata.length})`);
      return;
    }

    let cancelled = false;
    const CONCURRENCY_LIMIT = 3;
    const queue = [...legacyMetadata];

    const worker = async (workerId: number) => {
      while (!cancelled && queue.length > 0) {
        const meta = queue.shift();
        if (!meta) break;
        const sessionId = meta.id;

        try {
          console.log(`[legacy-sync-worker-${workerId}] Checking ${sessionId}`);
          const remoteSession = await FirebaseChatStorage.getSession(effectiveUserId, sessionId);
          if (remoteSession) {
            console.log(`[legacy-sync-worker-${workerId}] SKIPPING ${sessionId} - already exists in Firebase.`);
            continue;
          }

          const localSession = await getSessionDirectly(sessionId, effectiveUserId, chatSessionPrefixLS);
          if (!localSession) {
            console.warn(`[legacy-sync-worker-${workerId}] SKIPPING ${sessionId} - local copy not found.`);
            continue;
          }

          console.log(`[legacy-sync-worker-${workerId}] UPLOADING ${sessionId}...`);
          const ok = await forceSyncSession(effectiveUserId, localSession);
          console.log(`[legacy-sync-worker-${workerId}] UPLOADED ${sessionId} - Success: ${ok}`);
        } catch (err) {
          console.error(`[legacy-sync-worker-${workerId}] FAILED processing ${sessionId}:`, err);
        }
      }
    };

    await Promise.all(Array.from({ length: CONCURRENCY_LIMIT }, (_, i) => worker(i + 1)));
    console.log('[legacy-sync] Finished upload process.');
  }, [canUseFirebase, effectiveUserId, chatSessionPrefixLS]);

  // NEW: Prefetch & cache full session data shortly after metadata is available
  // ------------------------------------------------------------------------
  useEffect(() => {
    // Only run when we have a valid user, some metadata and the browser is online
    if (!effectiveUserId || historyMetadata.length === 0) return;
    if (typeof navigator !== 'undefined' && !navigator.onLine) return;

    let cancelled = false;

    const prefetchSessionsInBackground = async () => {
      const CONCURRENCY_LIMIT = 3; // Don't overwhelm network / Firestore
      const queue = [...historyMetadata]; // copy so we can mutate

      const worker = async () => {
        while (!cancelled && queue.length > 0) {
          const meta = queue.shift();
          if (!meta) break;
          const sessionId = meta.id;

          try {
            // 1️⃣ Skip if we already have a cached version (localStorage / IndexedDB)
            const localKey = `${chatSessionPrefixLS}${sessionId}`;
            if (localStorage.getItem(localKey)) continue;
            if (sessionDB) {
              const idbData = await sessionDB.getSession(sessionId);
              if (idbData) continue;
            }

            // 2️⃣ Fetch from Firebase
            const remoteSession = await FirebaseChatStorage.getSession(effectiveUserId, sessionId);
            if (!remoteSession) continue;

            // 3️⃣ Persist to preferred storage
            const sessionString = JSON.stringify(remoteSession);
            try {
              if (sessionDB) {
                await sessionDB.saveSession(sessionId, sessionString);
                // quick flag so next reload knows it is in IDB
                localStorage.setItem(`${localKey}_idb`, '1');
              } else {
                const valueToStore = sessionString.length > 1000 ? compressData(sessionString) : sessionString;
                localStorage.setItem(localKey, valueToStore);
              }
            } catch (persistErr) {
              historyLogger.warn(`prefetchSessions: failed to cache ${sessionId}`, persistErr);
            }
          } catch (err) {
            historyLogger.warn(`prefetchSessions: error processing ${sessionId}`, err);
          }
        }
      };

      // Spin up limited concurrent workers
      await Promise.all(Array.from({ length: CONCURRENCY_LIMIT }, () => worker()));
    };

    prefetchSessionsInBackground();

    return () => {
      cancelled = true;
    };
  }, [effectiveUserId, historyMetadata]);

  useEffect(() => {
    if (!historyMetadata || historyMetadata.length === 0) return;

    const sessionToConsider = historyMetadata[0]; // most recent session

    const hasDefaultName = !sessionToConsider.name || sessionToConsider.name === 'New Chat' || /^Chat \d{1,2}:\d{2}(:\d{2})?\s*(AM|PM)?$/i.test(sessionToConsider.name);
    const hasMessages = sessionToConsider.messageCount > 1; // More than just a system message

    const shouldAttemptAiRename = hasDefaultName && hasMessages && !aiRenameAttempts.has(sessionToConsider.id);

    if (shouldAttemptAiRename) {
      aiRenameAttempts.add(sessionToConsider.id);

      (async () => {
        try {
          const session = await getSession(sessionToConsider.id);
          if (!session || !session.messages) return;

          const recentMsgs = session.messages.filter(m => m.role === 'user')
            .slice(-3)
            .map(msg => {
              let text = '';
              if (typeof msg.content === 'string') {
                text = msg.content;
              } else if (Array.isArray(msg.content)) {
                text = msg.content.map(part => {
                  if (part.type === 'text' && part.text) return part.text;
                  return '';
                }).join(' ');
              }
              return { role: 'user', text: text.slice(0, 200) };
            });

            if (recentMsgs.length === 0) return;

            console.log('Requesting AI title with messages:', recentMsgs);
            const res = await fetch(AI_CHAT_TITLE_ENDPOINT, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ messages: recentMsgs, modelId: TITLE_MODEL_ID })
            });

            if (!res.ok) {
              const text = await res.text();
              console.error('AI title fetch failed', res.status, text);
              return;
            }

            const data = await res.json();
            if (data?.title) {
              await renameSession(sessionToConsider.id, data.title.trim());
            }
        } catch (err) {
          console.warn('AI chat title request failed:', err);
        }
      })();
    }
  }, [historyMetadata, getSession, renameSession]);

  const legacyChatSessionPrefixLS = `desainr_chat_session_ls_${effectiveUserId}_`;
  const legacyHistoryIndexKeyLS = `desainr_chat_history_index_ls_${effectiveUserId}`;

  // One-time migration: copy legacy keys (without v4) to new v4 keys if needed
  useEffect(() => {
    try {
      // Migrate session entries
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (!key) continue;
        if (key.startsWith(legacyChatSessionPrefixLS)) {
          const newKey = key.replace(legacyChatSessionPrefixLS, chatSessionPrefixLS);
          if (!localStorage.getItem(newKey)) {
            const value = localStorage.getItem(key);
            if (value) {
              localStorage.setItem(newKey, value);
              // Remove old key to free space
              try { localStorage.removeItem(key); localStorage.removeItem(`${key}_compressed`); } catch (_) {}
            }
          }
        }
      }
      // Migrate history index
      if (!localStorage.getItem(chatHistoryIndexKeyLS)) {
        const legacyIndex = localStorage.getItem(legacyHistoryIndexKeyLS);
        if (legacyIndex) {
          localStorage.setItem(chatHistoryIndexKeyLS, legacyIndex);
          try { localStorage.removeItem(legacyHistoryIndexKeyLS); } catch (_) {}
        }
      }
    } catch (migrateErr) {
      console.warn('Legacy data migration failed:', migrateErr);
    }
  // run once
  }, []);

  // Add hydrate function before getSession
  async function hydrateSessionAttachments(session: ChatSession, userId: string) {
    const attachmentKeys = new Set<string>();
    session.messages.forEach(msg => {
      msg.attachedFiles?.forEach(file => {
        if (!file.dataUri && !file.textContent) {
          if (file.attachmentId) attachmentKeys.add(file.attachmentId);
          // Fallback for legacy records that used only `id` on the file
          const fileId = (file as any).id as string | undefined;
          if (fileId) attachmentKeys.add(fileId);
        }
      });
    });
    if (attachmentKeys.size === 0) return;
    const indexed = await loadAttachmentsIndexedDB(userId);
    const local = loadUploadedAttachments(userId);
    const all = [...indexed, ...local.filter(l => !indexed.some(i => i.id === l.id))];
    // Map by both id and attachmentId to support older records saved with mismatched ids
    const attMap = new Map<string, typeof all[number]>();
    all.forEach(a => {
      if (a.id) attMap.set(a.id, a);
      // a may carry attachmentId from original file object
      // @ts-ignore - allow presence even if not in interface at compile time
      const attId = (a as any).attachmentId as string | undefined;
      if (attId) attMap.set(attId, a);
    });
    session.messages.forEach(msg => {
      msg.attachedFiles?.forEach(file => {
        const key = file.attachmentId || ((file as any).id as string | undefined);
        if (key && attMap.has(key)) {
          const att = attMap.get(key)!;
          file.dataUri = att.dataUri;
          file.textContent = att.textContent;
          // Backfill attachmentId for future persistence if it was missing
          if (!file.attachmentId) {
            // @ts-ignore
            file.attachmentId = key;
          }
        }
      });
    });
  }

  return {
    historyMetadata,
    isLoading,
    isSyncing,
    getSession,
    saveSession,
    deleteSession,
    renameSession,
    createNewSession,
    // Removed Drive sync functions from return
    triggerGoogleSignIn: undefined, // Explicitly set to undefined or remove if not used
    cleanLocalStorage: () => cleanupCorruptedLocalStorage(effectiveUserId),
    repairMetadata: () => repairChatHistoryMetadata(effectiveUserId),
    setAutoRefreshEnabled, // Add the new function
    // Check if auto-refresh is currently enabled, safely for SSR
    isAutoRefreshEnabled: typeof window !== 'undefined' ? localStorage.getItem(HISTORY_AUTO_REFRESH_ENABLED) !== 'false' : true
  };
} 