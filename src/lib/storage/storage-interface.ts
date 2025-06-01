/**
 * Unified Storage Interface
 * 
 * This interface defines the standard operations for storing and retrieving chat data
 * across different storage mechanisms (localStorage, IndexedDB, Firebase).
 */

import { ChatSession, ChatSessionMetadata } from '@/lib/types';

export interface StorageResult<T> {
  success: boolean;
  data?: T;
  error?: any;
  source?: string; // Where the data came from (local, indexeddb, firebase)
  additionalInfo?: Record<string, any>; // Additional information that might be helpful
}

export interface StorageStats {
  sessionsCount: number;
  totalSizeBytes: number;
  oldestSession?: {
    id: string;
    timestamp: number;
  };
  newestSession?: {
    id: string;
    timestamp: number;
  };
  quotaRemaining?: number; // Bytes remaining, if available
  quotaTotal?: number; // Total quota in bytes, if available
}

/**
 * Base interface for all storage providers
 */
export interface StorageProvider {
  /**
   * Get the name of this storage provider
   */
  getName(): string;
  
  /**
   * Check if this storage provider is available/working
   */
  isAvailable(): Promise<boolean>;
  
  /**
   * Get storage usage statistics
   */
  getStats(userId: string): Promise<StorageResult<StorageStats>>;
}

/**
 * Interface for storage providers that can read and write chat sessions
 */
export interface ChatSessionStorage extends StorageProvider {
  /**
   * Get a chat session by ID
   */
  getSession(userId: string, sessionId: string): Promise<StorageResult<ChatSession>>;
  
  /**
   * Save a chat session
   */
  saveSession(userId: string, session: ChatSession): Promise<StorageResult<void>>;
  
  /**
   * Delete a chat session
   */
  deleteSession(userId: string, sessionId: string): Promise<StorageResult<void>>;
  
  /**
   * Get metadata for all sessions for a user
   */
  getAllSessionsMetadata(userId: string): Promise<StorageResult<ChatSessionMetadata[]>>;
  
  /**
   * Update just the metadata for a session (name, preview, etc.)
   */
  updateSessionMetadata(userId: string, sessionId: string, metadata: Partial<ChatSessionMetadata>): Promise<StorageResult<void>>;
  
  /**
   * Save all sessions metadata at once (for bulk operations)
   */
  saveAllSessionsMetadata(userId: string, metadata: ChatSessionMetadata[]): Promise<boolean>;
  
  /**
   * Clean up old sessions to free up space
   */
  cleanupOldSessions(userId: string, options?: {
    maxAge?: number;
    maxToKeep?: number;
    maxToRemove?: number;
  }): Promise<StorageResult<{ removedCount: number }>>;
}

/**
 * Storage priority order - defines the order in which storage providers
 * should be tried when reading/writing data
 */
export enum StoragePriority {
  // First try local storage for faster access
  LOCAL_STORAGE = 1,
  
  // Then try IndexedDB for larger storage capacity
  INDEXED_DB = 2, 
  
  // Finally try Firebase for cloud backup
  FIREBASE = 3,
}

/**
 * Storage manager configuration options
 */
export interface StorageManagerConfig {
  // Whether to automatically sync across storage providers
  autoSync: boolean;
  
  // How often to sync in ms (if autoSync is enabled)
  syncInterval?: number;
  
  // Storage providers to use in priority order
  writeOrder: StoragePriority[];
  
  // Where to look for data when reading
  readOrder: StoragePriority[];
  
  // Maximum number of sessions to keep before cleaning up
  maxSessionsToKeep?: number;
  
  // Maximum age of sessions in ms before they're candidates for cleanup
  maxSessionAge?: number;
  
  // Minimum quota to maintain in local storage (bytes)
  minLocalQuota?: number;
} 