/**
 * use-storage.ts
 * 
 * A React hook that provides access to the storage system
 * with automatic user ID handling and session management
 */

import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { StorageManager } from '@/lib/storage/storage-manager';
import { StoragePriority, StorageResult } from '@/lib/storage/storage-interface';
import { ChatSession, ChatSessionMetadata } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

// Default user ID for anonymous users
const DEFAULT_USER_ID = 'default_user';

// Create a singleton instance of the storage manager
const storageManager = new StorageManager({
  // Use localStorage first for better performance, then IndexedDB for more storage space
  writeOrder: [StoragePriority.LOCAL_STORAGE, StoragePriority.INDEXED_DB],
  readOrder: [StoragePriority.LOCAL_STORAGE, StoragePriority.INDEXED_DB],
  autoSync: true,
  syncInterval: 5 * 60 * 1000, // 5 minutes
  maxSessionsToKeep: 100,
  maxSessionAge: 90 * 24 * 60 * 60 * 1000, // 90 days
});

/**
 * Hook for accessing and managing chat sessions in storage
 */
export function useStorage(userIdFromProfile?: string) {
  const { user: authUser } = useAuth();
  const { toast } = useToast();
  
  const [sessions, setSessions] = useState<ChatSessionMetadata[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [storageStats, setStorageStats] = useState<{
    sessionsCount: number;
    totalSizeBytes: number;
    quotaRemaining?: number;
  } | null>(null);

  // Get the effective user ID - from auth, profile, or default
  const effectiveUserId = authUser?.uid || userIdFromProfile || DEFAULT_USER_ID;

  // Load sessions metadata on startup and when user changes
  useEffect(() => {
    let isMounted = true;
    
    const loadSessions = async () => {
      if (!isMounted) return;
      
      setIsLoading(true);
      setError(null);
      
      try {
        // Get list of all sessions
        const result = await storageManager.getAllSessionsMetadata(effectiveUserId);
        
        if (result.success && result.data) {
          if (isMounted) setSessions(result.data);
        } else {
          throw new Error(result.error || 'Failed to load sessions');
        }
        
        // Get storage stats
        const statsResult = await storageManager.getStats(effectiveUserId);
        if (statsResult.success && statsResult.data && isMounted) {
          setStorageStats({
            sessionsCount: statsResult.data.sessionsCount,
            totalSizeBytes: statsResult.data.totalSizeBytes,
            quotaRemaining: statsResult.data.quotaRemaining,
          });
        }
      } catch (err: any) {
        if (isMounted) {
          setError(err.message || 'Error loading sessions');
          console.error('Error loading sessions:', err);
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };
    
    loadSessions();
    
    // Listen for storage changes
    const handleStorageEvent = () => {
      if (isMounted) loadSessions();
    };
    
    window.addEventListener('storage', handleStorageEvent);
    
    return () => {
      isMounted = false;
      window.removeEventListener('storage', handleStorageEvent);
    };
  }, [effectiveUserId]);

  // Create a new session
  const createSession = useCallback(async (
    initialMessages: any[] = [],
    modelId?: string
  ): Promise<ChatSession | null> => {
    try {
      const now = Date.now();
      const sessionId = `${effectiveUserId}_${now}_${Math.random().toString(36).substring(2, 11)}`;
      
      const newSession: ChatSession = {
        id: sessionId,
        name: 'New Chat',
        messages: initialMessages,
        createdAt: now,
        updatedAt: now,
        userId: effectiveUserId,
        modelId: modelId || 'default-model',
      };
      
      const result = await storageManager.saveSession(effectiveUserId, newSession);
      
      if (result.success) {
        // Update local list of sessions
        setSessions(prev => {
          const metadata: ChatSessionMetadata = {
            id: sessionId,
            name: 'New Chat',
            lastMessageTimestamp: now,
            preview: initialMessages.length > 0 ? 'Custom starting prompt' : 'New conversation',
            messageCount: initialMessages.length,
            createdAt: now
          };
          return [metadata, ...prev];
        });
        
        return newSession;
      } else {
        toast({
          title: 'Error',
          description: 'Failed to create new chat session',
          variant: 'destructive',
        });
        return null;
      }
    } catch (error: any) {
      console.error('Error creating session:', error);
      toast({
        title: 'Error',
        description: error.message || 'Could not create chat session',
        variant: 'destructive',
      });
      return null;
    }
  }, [effectiveUserId, toast]);

  // Get a session by ID
  const getSession = useCallback(async (
    sessionId: string
  ): Promise<StorageResult<ChatSession>> => {
    if (!sessionId.startsWith(effectiveUserId)) {
      return {
        success: false,
        error: 'Invalid session ID for current user',
        source: 'useStorage',
      };
    }
    
    try {
      return await storageManager.getSession(effectiveUserId, sessionId);
    } catch (error: any) {
      console.error('Error getting session:', error);
      return {
        success: false,
        error: error.message || 'Error getting session',
        source: 'useStorage',
      };
    }
  }, [effectiveUserId]);

  // Save a session
  const saveSession = useCallback(async (
    session: ChatSession
  ): Promise<boolean> => {
    if (!session || !session.id) {
      console.error('Invalid session data');
      return false;
    }
    
    // Ensure the session belongs to the current user
    if (!session.id.startsWith(effectiveUserId)) {
      console.error('Cannot save session: Session does not belong to current user');
      return false;
    }
    
    try {
      const result = await storageManager.saveSession(effectiveUserId, session);
      return result.success;
    } catch (error: any) {
      console.error('Error saving session:', error);
      return false;
    }
  }, [effectiveUserId]);

  // Delete a session
  const deleteSession = useCallback(async (
    sessionId: string
  ): Promise<boolean> => {
    if (!sessionId.startsWith(effectiveUserId)) {
      console.error('Cannot delete session: Session does not belong to current user');
      return false;
    }
    
    try {
      const result = await storageManager.deleteSession(effectiveUserId, sessionId);
      
      if (result.success) {
        // Update local list of sessions
        setSessions(prev => prev.filter(s => s.id !== sessionId));
        return true;
      }
      
      return false;
    } catch (error: any) {
      console.error('Error deleting session:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete chat session',
        variant: 'destructive',
      });
      return false;
    }
  }, [effectiveUserId, toast]);

  // Rename a session
  const renameSession = useCallback(async (
    sessionId: string,
    newName: string
  ): Promise<boolean> => {
    if (!sessionId.startsWith(effectiveUserId)) {
      console.error('Cannot rename session: Session does not belong to current user');
      return false;
    }
    
    try {
      // Update just the metadata
      const result = await storageManager.updateSessionMetadata(
        effectiveUserId,
        sessionId,
        { name: newName }
      );
      
      if (result.success) {
        // Update local list of sessions
        setSessions(prev => prev.map(s => 
          s.id === sessionId 
            ? { ...s, name: newName }
            : s
        ));
        
        // Dispatch event to notify other components
        window.dispatchEvent(new CustomEvent('chat-name-updated', { 
          detail: { 
            sessionId, 
            newName, 
            userId: effectiveUserId,
            timestamp: Date.now(), 
            source: 'manual-rename' 
          }
        }));
        
        return true;
      }
      
      return false;
    } catch (error: any) {
      console.error('Error renaming session:', error);
      return false;
    }
  }, [effectiveUserId]);

  // Clean up storage to free up space
  const cleanupStorage = useCallback(async (): Promise<number> => {
    try {
      const result = await storageManager.cleanupOldSessions(effectiveUserId);
      
      if (result.success && result.data) {
        // Refresh sessions list after cleanup
        const updatedSessions = await storageManager.getAllSessionsMetadata(effectiveUserId);
        if (updatedSessions.success && updatedSessions.data) {
          setSessions(updatedSessions.data);
        }
        
        // Refresh storage stats
        const statsResult = await storageManager.getStats(effectiveUserId);
        if (statsResult.success && statsResult.data) {
          setStorageStats({
            sessionsCount: statsResult.data.sessionsCount,
            totalSizeBytes: statsResult.data.totalSizeBytes,
            quotaRemaining: statsResult.data.quotaRemaining,
          });
        }
        
        return result.data.removedCount;
      }
      
      return 0;
    } catch (error: any) {
      console.error('Error cleaning up storage:', error);
      return 0;
    }
  }, [effectiveUserId]);

  // Force refresh the sessions list
  const refreshSessions = useCallback(async (): Promise<void> => {
    setIsLoading(true);
    
    try {
      const result = await storageManager.getAllSessionsMetadata(effectiveUserId);
      
      if (result.success && result.data) {
        setSessions(result.data);
      }
      
      // Also refresh storage stats
      const statsResult = await storageManager.getStats(effectiveUserId);
      if (statsResult.success && statsResult.data) {
        setStorageStats({
          sessionsCount: statsResult.data.sessionsCount,
          totalSizeBytes: statsResult.data.totalSizeBytes,
          quotaRemaining: statsResult.data.quotaRemaining,
        });
      }
    } catch (error) {
      console.error('Error refreshing sessions:', error);
    } finally {
      setIsLoading(false);
    }
  }, [effectiveUserId]);

  return {
    sessions,
    isLoading,
    error,
    storageStats,
    createSession,
    getSession,
    saveSession,
    deleteSession,
    renameSession,
    cleanupStorage,
    refreshSessions,
  };
} 