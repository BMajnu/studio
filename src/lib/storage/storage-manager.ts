/**
 * Storage Manager
 * 
 * Coordinates storage operations across multiple providers (localStorage, IndexedDB)
 * with transparent fallbacks and automatic sync between providers.
 */

import { ChatSession, ChatSessionMetadata } from '@/lib/types';
import {
  ChatSessionStorage,
  StorageManagerConfig,
  StoragePriority,
  StorageResult,
  StorageStats
} from './storage-interface';
import { LocalStorageProvider } from './local-storage-provider';
import { IndexedDBProvider } from './indexed-db-provider';

// Default configuration
const DEFAULT_CONFIG: StorageManagerConfig = {
  autoSync: true,
  syncInterval: 5 * 60 * 1000, // 5 minutes
  writeOrder: [StoragePriority.LOCAL_STORAGE, StoragePriority.INDEXED_DB],
  readOrder: [StoragePriority.LOCAL_STORAGE, StoragePriority.INDEXED_DB],
  maxSessionsToKeep: 100,
  maxSessionAge: 90 * 24 * 60 * 60 * 1000, // 90 days
  minLocalQuota: 500 * 1024, // 500KB minimum free space
};

export class StorageManager implements ChatSessionStorage {
  private providers: Map<StoragePriority, ChatSessionStorage> = new Map();
  private config: StorageManagerConfig;
  private syncTimer: NodeJS.Timeout | null = null;
  
  constructor(config?: Partial<StorageManagerConfig>) {
    this.config = { ...DEFAULT_CONFIG, ...config };
    
    // Initialize providers
    this.providers.set(StoragePriority.LOCAL_STORAGE, new LocalStorageProvider());
    this.providers.set(StoragePriority.INDEXED_DB, new IndexedDBProvider());
    
    // Set up auto-sync if enabled
    if (this.config.autoSync && typeof window !== 'undefined') {
      this.startAutoSync();
    }
  }
  
  getName(): string {
    return 'StorageManager';
  }
  
  /**
   * Check if any storage provider is available
   */
  async isAvailable(): Promise<boolean> {
    const providers = Array.from(this.providers.values());
    for (const provider of providers) {
      if (await provider.isAvailable()) {
        return true;
      }
    }
    return false;
  }
  
  /**
   * Get the first available provider in the given priority order
   */
  private async getFirstAvailableProvider(priorities: StoragePriority[]): Promise<ChatSessionStorage | null> {
    for (const priority of priorities) {
      const provider = this.providers.get(priority);
      if (provider && await provider.isAvailable()) {
        return provider;
      }
    }
    return null;
  }
  
  /**
   * Get a list of all available providers in priority order
   */
  private async getAvailableProviders(priorities: StoragePriority[]): Promise<ChatSessionStorage[]> {
    const availableProviders: ChatSessionStorage[] = [];
    
    for (const priority of priorities) {
      const provider = this.providers.get(priority);
      if (provider && await provider.isAvailable()) {
        availableProviders.push(provider);
      }
    }
    
    return availableProviders;
  }

  /**
   * Start automatic synchronization between storage providers
   */
  private startAutoSync(): void {
    if (this.syncTimer) {
      clearInterval(this.syncTimer);
    }
    
    const interval = this.config.syncInterval || DEFAULT_CONFIG.syncInterval;
    this.syncTimer = setInterval(() => {
      this.syncAllProviders().catch(err => {
        console.error('Error during auto-sync:', err);
      });
    }, interval);
  }
  
  /**
   * Stop automatic synchronization
   */
  stopAutoSync(): void {
    if (this.syncTimer) {
      clearInterval(this.syncTimer);
      this.syncTimer = null;
    }
  }
  
  /**
   * Synchronize data between all available storage providers
   */
  async syncAllProviders(): Promise<void> {
    // Get all available providers
    const providers = await this.getAvailableProviders([
      ...this.config.readOrder,
      ...this.config.writeOrder
    ]);
    
    if (providers.length <= 1) {
      // Nothing to sync
      return;
    }
    
    // Use the first provider as the source of truth
    const sourceProvider = providers[0];
    
    try {
      // Loop through all users (simplified for now - just use active user)
      // TODO: Handle multiple users if needed
      const activeUser = this.getActiveUserId();
      if (!activeUser) return;
      
      // Sync metadata first
      const metadataResult = await sourceProvider.getAllSessionsMetadata(activeUser);
      if (metadataResult.success && metadataResult.data) {
        // Get the list of all session IDs
        const sessionIds = metadataResult.data.map(meta => meta.id);
        
        // Sync each destination provider
        for (let i = 1; i < providers.length; i++) {
          const destProvider = providers[i];
          
          // Sync metadata
          await destProvider.getAllSessionsMetadata(activeUser).then(async destMetadata => {
            if (!destMetadata.success || !destMetadata.data) {
              // If destination has no metadata, just save the source metadata
              await destProvider.saveAllSessionsMetadata(activeUser, metadataResult.data!);
              return;
            }
            
            // Otherwise, merge metadata (keeping newer timestamps)
            const mergedMetadata = this.mergeMetadataArrays(
              metadataResult.data!,
              destMetadata.data
            );
            
            // Save the merged metadata to destination
            await destProvider.saveAllSessionsMetadata(activeUser, mergedMetadata);
          }).catch(err => {
            console.error(`Error syncing metadata to ${destProvider.getName()}:`, err);
          });
          
          // Sync each session
          for (const sessionId of sessionIds) {
            try {
              // Get session from source
              const sessionResult = await sourceProvider.getSession(activeUser, sessionId);
              
              if (sessionResult.success && sessionResult.data) {
                // Check if session exists in destination and is older
                const destSessionResult = await destProvider.getSession(activeUser, sessionId);
                
                if (!destSessionResult.success || 
                    (destSessionResult.success && destSessionResult.data && 
                     destSessionResult.data.updatedAt < sessionResult.data.updatedAt)) {
                  // Save newer session to destination
                  await destProvider.saveSession(activeUser, sessionResult.data);
                }
              }
            } catch (err) {
              console.error(`Error syncing session ${sessionId}:`, err);
            }
          }
        }
      }
    } catch (error) {
      console.error('Error during provider sync:', error);
      throw error;
    }
  }
  
  /**
   * Merge two metadata arrays, keeping the newer version of each session
   */
  private mergeMetadataArrays(array1: ChatSessionMetadata[], array2: ChatSessionMetadata[]): ChatSessionMetadata[] {
    const mergedMap = new Map<string, ChatSessionMetadata>();
    
    // Add all items from first array
    array1.forEach(item => {
      mergedMap.set(item.id, item);
    });
    
    // Add/update items from second array if they're newer
    array2.forEach(item => {
      const existingItem = mergedMap.get(item.id);
      
      if (!existingItem || item.lastMessageTimestamp > existingItem.lastMessageTimestamp) {
        mergedMap.set(item.id, item);
      }
    });
    
    // Convert back to array and sort
    return Array.from(mergedMap.values())
      .sort((a, b) => b.lastMessageTimestamp - a.lastMessageTimestamp);
  }
  
  /**
   * Get the currently active user ID
   * This is a placeholder - in a real app, you'd get this from auth context
   */
  private getActiveUserId(): string | null {
    // Default to localStorage
    try {
      return localStorage.getItem('desainr_active_user_id') || 'default_user';
    } catch (e) {
      return 'default_user';
    }
  }
  
  /**
   * Get storage stats across all providers
   */
  async getStats(userId: string): Promise<StorageResult<StorageStats>> {
    try {
      const providers = await this.getAvailableProviders(this.config.readOrder);
      
      if (providers.length === 0) {
        return {
          success: false,
          error: 'No storage providers available',
          source: this.getName()
        };
      }
      
      // Get stats from primary provider
      const primaryStats = await providers[0].getStats(userId);
      if (!primaryStats.success) {
        return primaryStats;
      }
      
      // If we only have one provider, return its stats
      if (providers.length === 1) {
        return primaryStats;
      }
      
      // Combine stats from all providers
      const combinedStats: StorageStats = {
        ...primaryStats.data!,
        sessionsCount: primaryStats.data!.sessionsCount,
        totalSizeBytes: primaryStats.data!.totalSizeBytes,
      };
      
      // Add provider-specific stats for debugging
      const allProviderStats: Record<string, any> = {
        [providers[0].getName()]: primaryStats.data
      };
      
      // Get stats from other providers
      for (let i = 1; i < providers.length; i++) {
        const providerStats = await providers[i].getStats(userId);
        if (providerStats.success && providerStats.data) {
          allProviderStats[providers[i].getName()] = providerStats.data;
        }
      }
      
      return {
        success: true,
        data: combinedStats,
        source: this.getName(),
        additionalInfo: { providerStats: allProviderStats }
      };
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      return {
        success: false,
        error: `Failed to get stats: ${errorMessage}`,
        source: this.getName()
      };
    }
  }
  
  /**
   * Get a session from storage
   */
  async getSession(userId: string, sessionId: string): Promise<StorageResult<ChatSession>> {
    try {
      // Try each provider in read order
      for (const priority of this.config.readOrder) {
        const provider = this.providers.get(priority);
        
        if (provider && await provider.isAvailable()) {
          const result = await provider.getSession(userId, sessionId);
          
          if (result.success && result.data) {
            return result;
          }
        }
      }
      
      // If we got here, session wasn't found in any provider
      return {
        success: false,
        error: 'Session not found in any storage provider',
        source: this.getName()
      };
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      return {
        success: false,
        error: `Failed to get session: ${errorMessage}`,
        source: this.getName()
      };
    }
  }
  
  /**
   * Save a session to storage
   */
  async saveSession(userId: string, session: ChatSession): Promise<StorageResult<void>> {
    if (!userId || !session || !session.id) {
      return {
        success: false,
        error: 'Invalid userId or session',
        source: this.getName()
      };
    }
    
    // Ensure updatedAt is set
    const sessionToSave = {
      ...session,
      updatedAt: Date.now(),
      userId
    };
    
    try {
      let savedToAny = false;
      let lastError: any = null;
      
      // Try each provider in write order
      for (const priority of this.config.writeOrder) {
        const provider = this.providers.get(priority);
        
        if (provider && await provider.isAvailable()) {
          try {
            const result = await provider.saveSession(userId, sessionToSave);
            
            if (result.success) {
              savedToAny = true;
            } else {
              lastError = result.error;
            }
          } catch (e) {
            lastError = e;
            console.error(`Error saving to ${provider.getName()}:`, e);
          }
        }
      }
      
      if (savedToAny) {
        return {
          success: true,
          source: this.getName()
        };
      }
      
      return {
        success: false,
        error: `Failed to save to any provider: ${lastError}`,
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
  
  /**
   * Delete a session from all storage providers
   */
  async deleteSession(userId: string, sessionId: string): Promise<StorageResult<void>> {
    if (!userId || !sessionId) {
      return {
        success: false,
        error: 'Invalid userId or sessionId',
        source: this.getName()
      };
    }
    
    try {
      let deletedFromAny = false;
      let lastError: any = null;
      
      // Try to delete from all available providers
      const providers = await this.getAvailableProviders([
        ...this.config.writeOrder,
        ...this.config.readOrder
      ]);
      
      for (const provider of providers) {
        try {
          const result = await provider.deleteSession(userId, sessionId);
          
          if (result.success) {
            deletedFromAny = true;
          } else {
            lastError = result.error;
          }
        } catch (e) {
          lastError = e;
          console.error(`Error deleting from ${provider.getName()}:`, e);
        }
      }
      
      if (deletedFromAny) {
        return {
          success: true,
          source: this.getName()
        };
      }
      
      return {
        success: false,
        error: `Failed to delete from any provider: ${lastError}`,
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
  
  /**
   * Get all session metadata across providers
   */
  async getAllSessionsMetadata(userId: string): Promise<StorageResult<ChatSessionMetadata[]>> {
    if (!userId) {
      return {
        success: false,
        error: 'Invalid userId',
        source: this.getName()
      };
    }
    
    try {
      // Try each provider in read order
      for (const priority of this.config.readOrder) {
        const provider = this.providers.get(priority);
        
        if (provider && await provider.isAvailable()) {
          const result = await provider.getAllSessionsMetadata(userId);
          
          if (result.success && result.data) {
            return result;
          }
        }
      }
      
      // If we got here, no metadata was found in any provider
      return {
        success: true,
        data: [],
        source: this.getName()
      };
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      return {
        success: false,
        error: `Failed to get metadata: ${errorMessage}`,
        source: this.getName()
      };
    }
  }
  
  /**
   * Update session metadata across all providers
   */
  async updateSessionMetadata(userId: string, sessionId: string, metadata: Partial<ChatSessionMetadata>): Promise<StorageResult<void>> {
    if (!userId || !sessionId) {
      return {
        success: false,
        error: 'Invalid userId or sessionId',
        source: this.getName()
      };
    }
    
    try {
      let updatedAny = false;
      let lastError: any = null;
      
      // Try each provider in write order
      for (const priority of this.config.writeOrder) {
        const provider = this.providers.get(priority);
        
        if (provider && await provider.isAvailable()) {
          try {
            const result = await provider.updateSessionMetadata(userId, sessionId, metadata);
            
            if (result.success) {
              updatedAny = true;
            } else {
              lastError = result.error;
            }
          } catch (e) {
            lastError = e;
            console.error(`Error updating metadata in ${provider.getName()}:`, e);
          }
        }
      }
      
      if (updatedAny) {
        return {
          success: true,
          source: this.getName()
        };
      }
      
      return {
        success: false,
        error: `Failed to update metadata in any provider: ${lastError}`,
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
   * Save all sessions metadata across providers
   */
  async saveAllSessionsMetadata(userId: string, metadata: ChatSessionMetadata[]): Promise<boolean> {
    if (!userId) {
      return false;
    }
    
    try {
      let savedAny = false;
      
      // Try each provider in write order
      for (const priority of this.config.writeOrder) {
        const provider = this.providers.get(priority);
        
        if (provider && await provider.isAvailable()) {
          try {
            const saved = await provider.saveAllSessionsMetadata(userId, metadata);
            if (saved) {
              savedAny = true;
            }
          } catch (e) {
            console.error(`Error saving all metadata to ${provider.getName()}:`, e);
          }
        }
      }
      
      return savedAny;
    } catch (error) {
      console.error('Failed to save all metadata:', error);
      return false;
    }
  }
  
  /**
   * Clean up old sessions to free up space
   */
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
    
    // Use options with defaults
    const cleanupOptions = {
      maxAge: options?.maxAge || this.config.maxSessionAge,
      maxToKeep: options?.maxToKeep || this.config.maxSessionsToKeep,
      maxToRemove: options?.maxToRemove || 5,
    };
    
    try {
      let totalRemoved = 0;
      
      // Clean up each provider
      const providers = await this.getAvailableProviders([
        ...this.config.writeOrder,
        ...this.config.readOrder
      ]);
      
      for (const provider of providers) {
        try {
          const result = await provider.cleanupOldSessions(userId, cleanupOptions);
          
          if (result.success && result.data) {
            totalRemoved += result.data.removedCount;
          }
        } catch (e) {
          console.error(`Error cleaning up in ${provider.getName()}:`, e);
        }
      }
      
      return {
        success: true,
        data: { removedCount: totalRemoved },
        source: this.getName()
      };
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      return {
        success: false,
        error: `Failed to cleanup sessions: ${errorMessage}`,
        source: this.getName()
      };
    }
  }
} 