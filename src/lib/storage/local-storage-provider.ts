/**
 * LocalStorageProvider
 * 
 * Implementation of the ChatSessionStorage interface using localStorage
 */

import { ChatSession, ChatSessionMetadata } from '@/lib/types';
import { ChatSessionStorage, StorageResult, StorageStats } from './storage-interface';
import { compressString, decompressString, getLocalStorageItem, setLocalStorageItem } from '../storage-helpers';
import { getMessageTextPreview } from '../utils/message-utils';

// Storage key prefixes
const CHAT_HISTORY_INDEX_KEY_LS_PREFIX = 'desainr_chat_history_index_ls_v4_';
const CHAT_SESSION_PREFIX_LS_PREFIX = 'desainr_chat_session_ls_v4_';
const DELETED_SESSIONS_LS_PREFIX = 'desainr_deleted_sessions_';

// Estimated localStorage limit (most browsers have 5MB)
const ESTIMATED_QUOTA = 30 * 1024 * 1024;

export class LocalStorageProvider implements ChatSessionStorage {
  getName(): string {
    return 'localStorage';
  }
  
  async isAvailable(): Promise<boolean> {
    try {
      // Test if localStorage is available
      localStorage.setItem('desainr_ls_test', 'test');
      localStorage.removeItem('desainr_ls_test');
      return true;
    } catch (e) {
      console.error('LocalStorageProvider: localStorage not available', e);
      return false;
    }
  }
  
  async getStats(userId: string): Promise<StorageResult<StorageStats>> {
    try {
      let totalSize = 0;
      let sessionsCount = 0;
      let oldestTimestamp = Date.now();
      let newestTimestamp = 0;
      let oldestSessionId = '';
      let newestSessionId = '';
      
      // Get metadata for quick scan
      const metadataResult = await this.getAllSessionsMetadata(userId);
      if (metadataResult.success && metadataResult.data) {
        sessionsCount = metadataResult.data.length;
        
        // Find oldest and newest sessions
        for (const meta of metadataResult.data) {
          const timestamp = meta.lastMessageTimestamp;
          
          if (timestamp < oldestTimestamp) {
            oldestTimestamp = timestamp;
            oldestSessionId = meta.id;
          }
          
          if (timestamp > newestTimestamp) {
            newestTimestamp = timestamp;
            newestSessionId = meta.id;
          }
        }
      }
      
      // Calculate total size used in localStorage
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('desainr_')) {
          const value = localStorage.getItem(key);
          if (value) {
            // Each character is 2 bytes in UTF-16
            totalSize += (key.length + value.length) * 2;
          }
        }
      }
      
      return {
        success: true,
        data: {
          sessionsCount,
          totalSizeBytes: totalSize,
          oldestSession: oldestSessionId ? { id: oldestSessionId, timestamp: oldestTimestamp } : undefined,
          newestSession: newestSessionId ? { id: newestSessionId, timestamp: newestTimestamp } : undefined,
          quotaRemaining: Math.max(0, ESTIMATED_QUOTA - totalSize),
          quotaTotal: ESTIMATED_QUOTA
        },
        source: this.getName()
      };
    } catch (error: unknown) {
      return {
        success: false,
        error,
        source: this.getName()
      };
    }
  }
  
  async getSession(userId: string, sessionId: string): Promise<StorageResult<ChatSession>> {
    if (!userId || !sessionId) {
      return {
        success: false,
        error: 'Invalid userId or sessionId',
        source: this.getName()
      };
    }
    
    const storageKey = `${CHAT_SESSION_PREFIX_LS_PREFIX}${userId}_${sessionId}`;
    
    try {
      const rawData = getLocalStorageItem(storageKey);
      if (!rawData) {
        return {
          success: false,
          error: 'Session not found',
          source: this.getName()
        };
      }
      
      try {
        const session = JSON.parse(rawData);
        return {
          success: true,
          data: session,
          source: this.getName()
        };
      } catch (parseError: unknown) {
        const errorMessage = parseError instanceof Error ? parseError.message : String(parseError);
        return {
          success: false,
          error: `Failed to parse session data: ${errorMessage}`,
          source: this.getName()
        };
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      return {
        success: false,
        error: `Failed to read session from localStorage: ${errorMessage}`,
        source: this.getName()
      };
    }
  }
  
  async saveSession(userId: string, session: ChatSession): Promise<StorageResult<void>> {
    if (!userId || !session || !session.id) {
      return {
        success: false,
        error: 'Invalid userId or session',
        source: this.getName()
      };
    }
    
    // Ensure updatedAt is set to current time
    const sessionToSave = {
      ...session,
      updatedAt: Date.now(),
      userId // Ensure userId is set correctly
    };
    
    const storageKey = `${CHAT_SESSION_PREFIX_LS_PREFIX}${userId}_${session.id}`;
    
    try {
      // Convert to JSON string
      const sessionString = JSON.stringify(sessionToSave);
      
      // Try to save, with potential compression
      const saved = await setLocalStorageItem(
        storageKey, 
        sessionString,
        { forceCompression: sessionString.length > 1000 }
      );
      
      if (!saved) {
        return {
          success: false,
          error: 'Failed to save session to localStorage',
          source: this.getName()
        };
      }
      
      // Update metadata as well
      await this.updateMetadataForSession(userId, sessionToSave);
      
      return {
        success: true,
        source: this.getName()
      };
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      return {
        success: false,
        error: `Failed to save session: ${errorMessage}`,
        source: this.getName()
      };
    }
  }
  
  async deleteSession(userId: string, sessionId: string): Promise<StorageResult<void>> {
    if (!userId || !sessionId) {
      return {
        success: false,
        error: 'Invalid userId or sessionId',
        source: this.getName()
      };
    }
    
    const storageKey = `${CHAT_SESSION_PREFIX_LS_PREFIX}${userId}_${sessionId}`;
    
    try {
      // Remove the session
      localStorage.removeItem(storageKey);
      localStorage.removeItem(`${storageKey}_compressed`);
      
      // Update the deleted sessions list
      const deletedSessionsKey = `${DELETED_SESSIONS_LS_PREFIX}${userId}`;
      try {
        const deletedSessions = JSON.parse(localStorage.getItem(deletedSessionsKey) || '[]');
        if (!deletedSessions.includes(sessionId)) {
          deletedSessions.push(sessionId);
          localStorage.setItem(deletedSessionsKey, JSON.stringify(deletedSessions));
        }
      } catch (e) {
        console.error('Failed to update deleted sessions list:', e);
      }
      
      // Update metadata
      try {
        const metadataKey = `${CHAT_HISTORY_INDEX_KEY_LS_PREFIX}${userId}`;
        const rawMetadata = getLocalStorageItem(metadataKey);
        
        if (rawMetadata) {
          const metadata = JSON.parse(rawMetadata);
          
          if (Array.isArray(metadata)) {
            const updatedMetadata = metadata.filter(item => item.id !== sessionId);
            await setLocalStorageItem(metadataKey, JSON.stringify(updatedMetadata));
          }
        }
      } catch (e) {
        console.error('Failed to update metadata after deletion:', e);
      }
      
      return {
        success: true,
        source: this.getName()
      };
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      return {
        success: false,
        error: `Failed to delete session: ${errorMessage}`,
        source: this.getName()
      };
    }
  }
  
  async getAllSessionsMetadata(userId: string): Promise<StorageResult<ChatSessionMetadata[]>> {
    if (!userId) {
      return {
        success: false,
        error: 'Invalid userId',
        source: this.getName()
      };
    }
    
    const metadataKey = `${CHAT_HISTORY_INDEX_KEY_LS_PREFIX}${userId}`;
    
    try {
      const rawData = getLocalStorageItem(metadataKey);
      
      if (!rawData) {
        return {
          success: true,
          data: [],
          source: this.getName()
        };
      }
      
      try {
        const metadata = JSON.parse(rawData);
        
        if (!Array.isArray(metadata)) {
          return {
            success: true,
            data: [],
            source: this.getName()
          };
        }
        
        // Filter out any invalid items just to be safe
        const validMetadata = metadata.filter(item => 
          item && typeof item.id === 'string' && 
          typeof item.name === 'string' &&
          typeof item.lastMessageTimestamp === 'number'
        );
        
        return {
          success: true,
          data: validMetadata,
          source: this.getName()
        };
      } catch (parseError: unknown) {
        const errorMessage = parseError instanceof Error ? parseError.message : String(parseError);
        return {
          success: false,
          error: `Failed to parse metadata: ${errorMessage}`,
          source: this.getName()
        };
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      return {
        success: false,
        error: `Failed to read metadata: ${errorMessage}`,
        source: this.getName()
      };
    }
  }
  
  async saveAllSessionsMetadata(userId: string, metadata: ChatSessionMetadata[]): Promise<boolean> {
    if (!userId || !Array.isArray(metadata)) {
      return false;
    }
    
    try {
      const metadataKey = `${CHAT_HISTORY_INDEX_KEY_LS_PREFIX}${userId}`;
      
      // Filter out any invalid items just to be safe
      const validMetadata = metadata.filter(item => 
        item && typeof item.id === 'string' && 
        typeof item.name === 'string' &&
        typeof item.lastMessageTimestamp === 'number'
      );
      
      // Sort by most recent first
      validMetadata.sort((a, b) => b.lastMessageTimestamp - a.lastMessageTimestamp);
      
      // Save to localStorage
      const saved = await setLocalStorageItem(metadataKey, JSON.stringify(validMetadata));
      return saved;
    } catch (error) {
      console.error('Failed to save all metadata:', error);
      return false;
    }
  }
  
  async updateSessionMetadata(userId: string, sessionId: string, metadata: Partial<ChatSessionMetadata>): Promise<StorageResult<void>> {
    if (!userId || !sessionId) {
      return {
        success: false,
        error: 'Invalid userId or sessionId',
        source: this.getName()
      };
    }
    
    const metadataKey = `${CHAT_HISTORY_INDEX_KEY_LS_PREFIX}${userId}`;
    
    try {
      const existingResult = await this.getAllSessionsMetadata(userId);
      
      if (!existingResult.success) {
        return {
          success: false,
          error: 'Failed to read existing metadata',
          source: this.getName()
        };
      }
      
      const existingMetadata = existingResult.data || [];
      const index = existingMetadata.findIndex(item => item.id === sessionId);
      
      if (index === -1) {
        // Item doesn't exist, create a new metadata entry
        const newMetadataItem: ChatSessionMetadata = {
          id: sessionId,
          name: metadata.name || 'Untitled Chat',
          lastMessageTimestamp: metadata.lastMessageTimestamp || Date.now(),
          preview: metadata.preview || '',
          messageCount: metadata.messageCount || 0,
          createdAt: metadata.createdAt || Date.now()
        };
        
        existingMetadata.push(newMetadataItem);
      } else {
        // Update existing item
        existingMetadata[index] = {
          ...existingMetadata[index],
          ...metadata
        };
      }
      
      // Sort by most recent first
      existingMetadata.sort((a, b) => b.lastMessageTimestamp - a.lastMessageTimestamp);
      
      // Save updated metadata
      const saved = await this.saveAllSessionsMetadata(userId, existingMetadata);
      
      if (!saved) {
        return {
          success: false,
          error: 'Failed to save updated metadata',
          source: this.getName()
        };
      }
      
      return {
        success: true,
        source: this.getName()
      };
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      return {
        success: false,
        error: `Failed to update metadata: ${errorMessage}`,
        source: this.getName()
      };
    }
  }
  
  /**
   * Update the metadata index for a session based on the session contents
   * @private
   */
  private async updateMetadataForSession(userId: string, session: ChatSession): Promise<boolean> {
    try {
      // Extract metadata from session
      const lastMessage = session.messages.length > 0 
        ? session.messages[session.messages.length - 1] 
        : undefined;
      
      const metadata: Partial<ChatSessionMetadata> = {
        name: session.name || 'Untitled Chat',
        lastMessageTimestamp: session.updatedAt || Date.now(),
        preview: getMessageTextPreview(lastMessage),
        messageCount: session.messages.length
      };
      
      const result = await this.updateSessionMetadata(userId, session.id, metadata);
      return result.success;
    } catch (error: unknown) {
      console.error('Failed to update session metadata:', error);
      return false;
    }
  }
  
  async cleanupOldSessions(
    userId: string, 
    options?: { maxAge?: number; maxToKeep?: number; maxToRemove?: number }
  ): Promise<StorageResult<{ removedCount: number }>> {
    if (!userId) {
      return {
        success: false,
        error: 'Invalid userId',
        source: this.getName()
      };
    }
    
    const maxAge = options?.maxAge || 30 * 24 * 60 * 60 * 1000; // 30 days default
    const maxToKeep = options?.maxToKeep || 50; // Keep 50 sessions by default
    const maxToRemove = options?.maxToRemove || 5; // Remove up to 5 at a time
    
    try {
      // Get all session metadata
      const metadataResult = await this.getAllSessionsMetadata(userId);
      
      if (!metadataResult.success || !metadataResult.data) {
        return {
          success: false,
          error: 'Failed to read session metadata',
          source: this.getName()
        };
      }
      
      const metadata = metadataResult.data;
      
      // If we're under the limit, nothing to do
      if (metadata.length <= maxToKeep) {
        return {
          success: true,
          data: { removedCount: 0 },
          source: this.getName()
        };
      }
      
      // Sort by timestamp, oldest first
      metadata.sort((a, b) => a.lastMessageTimestamp - b.lastMessageTimestamp);
      
      // Mark sessions for cleanup
      const now = Date.now();
      const sessionsToDelete = [];
      
      for (const session of metadata) {
        // Stop if we've reached our deletion limit
        if (sessionsToDelete.length >= maxToRemove) break;
        
        // Stop if keeping this would still keep us under our limit
        if (metadata.length - sessionsToDelete.length <= maxToKeep) break;
        
        // Check if session is old enough to delete
        const age = now - session.lastMessageTimestamp;
        if (age > maxAge) {
          sessionsToDelete.push(session.id);
        }
      }
      
      // Delete the marked sessions
      let deletedCount = 0;
      
      for (const sessionId of sessionsToDelete) {
        const result = await this.deleteSession(userId, sessionId);
        if (result.success) {
          deletedCount++;
        }
      }
      
      return {
        success: true,
        data: { removedCount: deletedCount },
        source: this.getName()
      };
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      return {
        success: false,
        error: `Cleanup failed: ${errorMessage}`,
        source: this.getName()
      };
    }
  }
} 