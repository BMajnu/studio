/**
 * IndexedDBProvider
 * 
 * Implementation of the ChatSessionStorage interface using IndexedDB
 */

import { ChatSession, ChatSessionMetadata } from '@/lib/types';
import { ChatSessionStorage, StorageResult, StorageStats } from './storage-interface';
import { compressString, decompressString } from '../storage-helpers';
import { getMessageTextPreview } from '../utils/message-utils';

// IndexedDB configuration
const DB_NAME = 'DesainrChatSessionsDB';
const DB_VERSION = 1;
const STORE_NAME = 'chat_sessions';
const METADATA_STORE_NAME = 'metadata';

export class IndexedDBProvider implements ChatSessionStorage {
  private db: IDBDatabase | null = null;
  private dbInitPromise: Promise<boolean> | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      this.dbInitPromise = this.initDB();
    }
  }

  getName(): string {
    return 'indexedDB';
  }

  /**
   * Initialize the IndexedDB database and create object stores if needed
   */
  private async initDB(): Promise<boolean> {
    return new Promise((resolve) => {
      if (!window || !window.indexedDB) {
        resolve(false);
        return;
      }

      try {
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
          
          // Create sessions store if it doesn't exist
          if (!db.objectStoreNames.contains(STORE_NAME)) {
            db.createObjectStore(STORE_NAME, { keyPath: 'id' });
          }
          
          // Create metadata store if it doesn't exist
          if (!db.objectStoreNames.contains(METADATA_STORE_NAME)) {
            const metadataStore = db.createObjectStore(METADATA_STORE_NAME, { keyPath: 'userId' });
            metadataStore.createIndex('userId', 'userId', { unique: true });
          }
        };
      } catch (e) {
        console.error('Error in IndexedDB initialization:', e);
        resolve(false);
      }
    });
  }

  async isAvailable(): Promise<boolean> {
    if (this.dbInitPromise === null) {
      if (typeof window !== 'undefined') {
        this.dbInitPromise = this.initDB();
      } else {
        return false;
      }
    }
    return this.dbInitPromise;
  }

  async getStats(userId: string): Promise<StorageResult<StorageStats>> {
    if (!await this.isAvailable()) {
      return {
        success: false,
        error: 'IndexedDB is not available',
        source: this.getName()
      };
    }

    try {
      const metadataResult = await this.getAllSessionsMetadata(userId);
      const metadata = metadataResult.success ? metadataResult.data || [] : [];

      // Find oldest and newest sessions
      let oldestTimestamp = Date.now();
      let newestTimestamp = 0;
      let oldestSessionId = '';
      let newestSessionId = '';
      
      for (const meta of metadata) {
        if (meta.lastMessageTimestamp < oldestTimestamp) {
          oldestTimestamp = meta.lastMessageTimestamp;
          oldestSessionId = meta.id;
        }
        
        if (meta.lastMessageTimestamp > newestTimestamp) {
          newestTimestamp = meta.lastMessageTimestamp;
          newestSessionId = meta.id;
        }
      }

      // Get a rough size estimate (harder for IndexedDB)
      const sizeEstimate = await this.estimateStorageSize(userId);
      
      return {
        success: true,
        data: {
          sessionsCount: metadata.length,
          totalSizeBytes: sizeEstimate,
          oldestSession: oldestSessionId ? { id: oldestSessionId, timestamp: oldestTimestamp } : undefined,
          newestSession: newestSessionId ? { id: newestSessionId, timestamp: newestTimestamp } : undefined,
        },
        source: this.getName()
      };
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      return {
        success: false,
        error: `Failed to get storage stats: ${errorMessage}`,
        source: this.getName()
      };
    }
  }

  /**
   * Estimate the storage size used by IndexedDB
   * This is approximate since there's no direct API to get the size
   */
  private async estimateStorageSize(userId: string): Promise<number> {
    if (!this.db) return 0;

    try {
      const metadataResult = await this.getAllSessionsMetadata(userId);
      const metadata = metadataResult.success ? metadataResult.data || [] : [];
      let totalSize = 0;

      // Sample a few sessions to get an average size
      const samplesToTake = Math.min(metadata.length, 5);
      let samplesCollected = 0;
      let totalSampleSize = 0;

      for (let i = 0; i < metadata.length && samplesCollected < samplesToTake; i++) {
        const sessionId = metadata[i].id;
        const sessionResult = await this.getSession(userId, sessionId);
        
        if (sessionResult.success && sessionResult.data) {
          const sessionJson = JSON.stringify(sessionResult.data);
          totalSampleSize += sessionJson.length * 2; // UTF-16 chars are 2 bytes
          samplesCollected++;
        }
      }

      // Calculate average and estimate total
      if (samplesCollected > 0) {
        const averageSize = totalSampleSize / samplesCollected;
        totalSize = averageSize * metadata.length;
      }

      // Add estimated metadata size
      totalSize += JSON.stringify(metadata).length * 2;

      return Math.round(totalSize);
    } catch (e) {
      console.error('Error estimating IndexedDB storage size:', e);
      return 0;
    }
  }

  async getSession(userId: string, sessionId: string): Promise<StorageResult<ChatSession>> {
    if (!await this.isAvailable() || !this.db) {
      return {
        success: false,
        error: 'IndexedDB is not available',
        source: this.getName()
      };
    }

    if (!userId || !sessionId) {
      return {
        success: false,
        error: 'Invalid userId or sessionId',
        source: this.getName()
      };
    }

    return new Promise((resolve) => {
      try {
        const transaction = this.db!.transaction([STORE_NAME], 'readonly');
        const store = transaction.objectStore(STORE_NAME);
        const request = store.get(`${userId}_${sessionId}`);

        request.onsuccess = () => {
          if (request.result) {
            let sessionData = request.result.data;
            
            // Check if data is compressed
            if (typeof sessionData === 'string') {
              try {
                // First try to decompress if needed
                if (request.result.compressed === true) {
                  sessionData = decompressString(sessionData);
                }
                
                // Parse the JSON data
                const session = JSON.parse(sessionData);
                resolve({
                  success: true,
                  data: session,
                  source: this.getName()
                });
              } catch (parseError: unknown) {
                const errorMessage = parseError instanceof Error ? parseError.message : String(parseError);
                resolve({
                  success: false,
                  error: `Failed to parse session data: ${errorMessage}`,
                  source: this.getName()
                });
              }
            } else {
              // Data is already an object
              resolve({
                success: true,
                data: sessionData,
                source: this.getName()
              });
            }
          } else {
            resolve({
              success: false,
              error: 'Session not found',
              source: this.getName()
            });
          }
        };

        request.onerror = (event) => {
          const error = (event.target as IDBRequest).error;
          resolve({
            success: false,
            error: `IndexedDB error: ${error?.message || 'Unknown error'}`,
            source: this.getName()
          });
        };
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        resolve({
          success: false,
          error: `Failed to access IndexedDB: ${errorMessage}`,
          source: this.getName()
        });
      }
    });
  }

  async saveSession(userId: string, session: ChatSession): Promise<StorageResult<void>> {
    if (!await this.isAvailable() || !this.db) {
      return {
        success: false,
        error: 'IndexedDB is not available',
        source: this.getName()
      };
    }

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

    const compositeKey = `${userId}_${session.id}`;

    return new Promise((resolve) => {
      try {
        const transaction = this.db!.transaction([STORE_NAME], 'readwrite');
        const store = transaction.objectStore(STORE_NAME);
        
        // Convert to JSON string
        const sessionString = JSON.stringify(sessionToSave);
        const shouldCompress = sessionString.length > 1000;
        
        const dataToStore = shouldCompress
          ? compressString(sessionString)
          : sessionString;
        
        const request = store.put({
          id: compositeKey,
          data: dataToStore,
          compressed: shouldCompress,
          timestamp: Date.now()
        });

        request.onsuccess = async () => {
          // Update metadata asynchronously
          await this.updateMetadataForSession(userId, sessionToSave);
          resolve({
            success: true,
            source: this.getName()
          });
        };

        request.onerror = (event) => {
          const error = (event.target as IDBRequest).error;
          resolve({
            success: false,
            error: `IndexedDB save error: ${error?.message || 'Unknown error'}`,
            source: this.getName()
          });
        };
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        resolve({
          success: false,
          error: `Failed to save session: ${errorMessage}`,
          source: this.getName()
        });
      }
    });
  }

  async deleteSession(userId: string, sessionId: string): Promise<StorageResult<void>> {
    if (!await this.isAvailable() || !this.db) {
      return {
        success: false,
        error: 'IndexedDB is not available',
        source: this.getName()
      };
    }

    if (!userId || !sessionId) {
      return {
        success: false,
        error: 'Invalid userId or sessionId',
        source: this.getName()
      };
    }

    const compositeKey = `${userId}_${sessionId}`;

    return new Promise((resolve) => {
      try {
        const transaction = this.db!.transaction([STORE_NAME], 'readwrite');
        const store = transaction.objectStore(STORE_NAME);
        const request = store.delete(compositeKey);

        request.onsuccess = async () => {
          // Update metadata to remove this session
          try {
            const metadataResult = await this.getAllSessionsMetadata(userId);
            
            if (metadataResult.success && metadataResult.data) {
              const updatedMetadata = metadataResult.data.filter(meta => meta.id !== sessionId);
              await this.saveAllSessionsMetadata(userId, updatedMetadata);
            }
          } catch (e) {
            console.error('Error updating metadata after deletion:', e);
          }
          
          resolve({
            success: true,
            source: this.getName()
          });
        };

        request.onerror = (event) => {
          const error = (event.target as IDBRequest).error;
          resolve({
            success: false,
            error: `IndexedDB delete error: ${error?.message || 'Unknown error'}`,
            source: this.getName()
          });
        };
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        resolve({
          success: false,
          error: `Failed to delete session: ${errorMessage}`,
          source: this.getName()
        });
      }
    });
  }

  async getAllSessionsMetadata(userId: string): Promise<StorageResult<ChatSessionMetadata[]>> {
    if (!await this.isAvailable() || !this.db) {
      return {
        success: false,
        error: 'IndexedDB is not available',
        source: this.getName()
      };
    }

    if (!userId) {
      return {
        success: false,
        error: 'Invalid userId',
        source: this.getName()
      };
    }

    return new Promise((resolve) => {
      try {
        const transaction = this.db!.transaction([METADATA_STORE_NAME], 'readonly');
        const store = transaction.objectStore(METADATA_STORE_NAME);
        const request = store.get(userId);

        request.onsuccess = () => {
          if (request.result && Array.isArray(request.result.sessions)) {
            const validMetadata = request.result.sessions.filter((item: any) => 
              item && typeof item.id === 'string' && 
              typeof item.name === 'string' &&
              typeof item.lastMessageTimestamp === 'number'
            );
            
            resolve({
              success: true,
              data: validMetadata,
              source: this.getName()
            });
          } else {
            resolve({
              success: true,
              data: [],
              source: this.getName()
            });
          }
        };

        request.onerror = (event) => {
          const error = (event.target as IDBRequest).error;
          resolve({
            success: false,
            error: `IndexedDB error reading metadata: ${error?.message || 'Unknown error'}`,
            source: this.getName()
          });
        };
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        resolve({
          success: false,
          error: `Failed to access metadata: ${errorMessage}`,
          source: this.getName()
        });
      }
    });
  }

  async saveAllSessionsMetadata(userId: string, metadata: ChatSessionMetadata[]): Promise<boolean> {
    if (!await this.isAvailable() || !this.db || !userId) {
      return false;
    }

    return new Promise((resolve) => {
      try {
        const transaction = this.db!.transaction([METADATA_STORE_NAME], 'readwrite');
        const store = transaction.objectStore(METADATA_STORE_NAME);
        const request = store.put({
          userId,
          sessions: metadata,
          timestamp: Date.now()
        });

        request.onsuccess = () => resolve(true);
        request.onerror = () => resolve(false);
      } catch (e) {
        console.error('Error saving metadata to IndexedDB:', e);
        resolve(false);
      }
    });
  }

  async updateSessionMetadata(userId: string, sessionId: string, metadata: Partial<ChatSessionMetadata>): Promise<StorageResult<void>> {
    if (!await this.isAvailable() || !this.db) {
      return {
        success: false,
        error: 'IndexedDB is not available',
        source: this.getName()
      };
    }

    if (!userId || !sessionId) {
      return {
        success: false,
        error: 'Invalid userId or sessionId',
        source: this.getName()
      };
    }

    try {
      const metadataResult = await this.getAllSessionsMetadata(userId);
      
      if (!metadataResult.success) {
        return {
          success: false,
          error: 'Failed to read existing metadata',
          source: this.getName()
        };
      }
      
      const existingMetadata = metadataResult.data || [];
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
    if (!await this.isAvailable() || !this.db) {
      return {
        success: false,
        error: 'IndexedDB is not available',
        source: this.getName()
      };
    }

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