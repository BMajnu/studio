"use client";

import { useState, useEffect, useCallback } from 'react';
import { FirebaseChatStorage } from '@/lib/firebase/chatStorage';
import { migrateSessionsToFirebase, checkMigrationStatus } from '@/lib/firebase/migrationUtils';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/auth-context';
import { v4 as uuidv4 } from 'uuid';
import type { ChatSession, ChatSessionMetadata, ChatMessage } from '@/lib/types';
import { DEFAULT_MODEL_ID } from '@/lib/constants';
import { queueSessionForSync, forceSyncSession } from '@/lib/firebase/sync-utils';
import { detectSessionConflict, resolveSessionConflict, ConflictResolutionStrategy, mergeSessionMetadata } from '@/lib/firebase/conflict-resolver';

/**
 * Hook for managing chat sessions using Firebase storage with offline support
 */
export function useFirebaseChat() {
  const [sessions, setSessions] = useState<ChatSessionMetadata[]>([]);
  const [currentSession, setCurrentSession] = useState<ChatSession | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isMigrationInProgress, setIsMigrationInProgress] = useState<boolean>(false);
  const [migrationProgress, setMigrationProgress] = useState<{ current: number, total: number }>({ current: 0, total: 0 });
  const [isOnline, setIsOnline] = useState<boolean>(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );
  
  const { toast } = useToast();
  const { user } = useAuth();
  const userId = user?.uid || '';
  
  // Track online status
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      // Sync data when coming back online
      if (userId) {
        syncWithFirebase();
      }
    };
    
    const handleOffline = () => {
      setIsOnline(false);
    };
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [userId]);
  
  // Sync with Firebase when coming back online
  const syncWithFirebase = useCallback(async () => {
    if (!userId || !isOnline) return;
    
    try {
      // First load Firebase metadata
      const firebaseMetadata = await FirebaseChatStorage.listSessionsMetadata(userId);
      
      // Then merge with local metadata
      const localSessionsJson = localStorage.getItem(`firebase_chat_sessions_${userId}`);
      let localSessions: ChatSessionMetadata[] = [];
      
      if (localSessionsJson) {
        try {
          localSessions = JSON.parse(localSessionsJson);
        } catch (e) {
          console.error('Error parsing local sessions:', e);
        }
      }
      
      // Merge metadata, prioritizing newer timestamps
      const mergedMetadata = mergeSessionMetadata(localSessions, firebaseMetadata);
      
      // Update state and local cache
      setSessions(mergedMetadata);
      localStorage.setItem(`firebase_chat_sessions_${userId}`, JSON.stringify(mergedMetadata));
      
      // If we have a current session, check for conflicts
      if (currentSession) {
        try {
          const firebaseSession = await FirebaseChatStorage.getSession(userId, currentSession.id);
          
          if (firebaseSession) {
            const conflict = detectSessionConflict(currentSession, firebaseSession);
            
            if (conflict.hasConflict) {
              const resolvedSession = resolveSessionConflict(
                currentSession, 
                firebaseSession, 
                conflict.recommendedStrategy
              );
              
              // Update UI with resolved session
              setCurrentSession(resolvedSession);
              
              // If we made changes, sync back to Firebase
              if (conflict.recommendedStrategy !== ConflictResolutionStrategy.KEEP_FIREBASE) {
                await forceSyncSession(userId, resolvedSession);
              }
            }
          }
        } catch (e) {
          console.error('Error checking for session conflicts:', e);
        }
      }
    } catch (error) {
      console.error("Error syncing with Firebase:", error);
    }
  }, [userId, isOnline, currentSession]);
  
  // Load all session metadata
  const loadSessionMetadata = useCallback(async () => {
    if (!userId) {
      setSessions([]);
      return;
    }
    
    try {
      setIsLoading(true);
      
      // Try to load from local cache first for instant UI
      const localSessionsJson = localStorage.getItem(`firebase_chat_sessions_${userId}`);
      if (localSessionsJson) {
        try {
          const localSessions = JSON.parse(localSessionsJson);
          setSessions(localSessions);
        } catch (e) {
          console.error('Error parsing local sessions:', e);
        }
      }
      
      // Then try to load from Firebase if online
      if (isOnline) {
        const metadata = await FirebaseChatStorage.listSessionsMetadata(userId);
        setSessions(metadata);
        
        // Update local cache
        localStorage.setItem(`firebase_chat_sessions_${userId}`, JSON.stringify(metadata));
      }
    } catch (error) {
      console.error("Error loading session metadata:", error);
      
      if (!isOnline) {
        toast({
          title: "Offline Mode",
          description: "Working with locally cached sessions",
          variant: "default"
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to load chat sessions from Firebase",
          variant: "destructive"
        });
      }
    } finally {
      setIsLoading(false);
    }
  }, [userId, toast, isOnline]);
  
  // Load a specific session by ID
  const loadSession = useCallback(async (sessionId: string) => {
    if (!userId) {
      return null;
    }
    
    try {
      setIsLoading(true);
      
      // Try to load from local storage first
      const localSessionJson = localStorage.getItem(`firebase_chat_session_${userId}_${sessionId}`);
      let localSession: ChatSession | null = null;
      
      if (localSessionJson) {
        try {
          localSession = JSON.parse(localSessionJson);
          setCurrentSession(localSession);
        } catch (e) {
          console.error('Error parsing local session:', e);
        }
      }
      
      // If we're online, also try to load from Firebase
      if (isOnline) {
        const firebaseSession = await FirebaseChatStorage.getSession(userId, sessionId);
        
        // If we have both local and Firebase sessions, check for conflicts
        if (localSession && firebaseSession) {
          const conflict = detectSessionConflict(localSession, firebaseSession);
          
          if (conflict.hasConflict) {
            // Resolve conflict using recommended strategy
            const resolvedSession = resolveSessionConflict(
              localSession, 
              firebaseSession, 
              conflict.recommendedStrategy
            );
            
            setCurrentSession(resolvedSession);
            
            // Save resolved session back to localStorage
            localStorage.setItem(
              `firebase_chat_session_${userId}_${sessionId}`, 
              JSON.stringify(resolvedSession)
            );
            
            // If we made changes to the Firebase version, sync back
            if (conflict.recommendedStrategy !== ConflictResolutionStrategy.KEEP_FIREBASE) {
              await forceSyncSession(userId, resolvedSession);
            }
            
            return resolvedSession;
          }
        }
        
        // If Firebase has the session and no conflicts, use that
        if (firebaseSession) {
          setCurrentSession(firebaseSession);
          
          // Also update local cache
          localStorage.setItem(
            `firebase_chat_session_${userId}_${sessionId}`, 
            JSON.stringify(firebaseSession)
          );
          
          return firebaseSession;
        }
      }
      
      // If we only have local session (or we're offline)
      if (localSession) {
        return localSession;
      }
      
      toast({
        title: isOnline ? "Error" : "Offline Mode",
        description: isOnline 
          ? `Failed to load chat session ${sessionId}` 
          : "Working offline, session not found in local cache",
        variant: isOnline ? "destructive" : "default"
      });
      
      return null;
    } catch (error) {
      console.error("Error loading session:", error);
      toast({
        title: "Error",
        description: `Failed to load chat session ${sessionId}`,
        variant: "destructive"
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [userId, toast, isOnline]);
  
  // Save the current session
  const saveSession = useCallback(async (session: ChatSession) => {
    if (!userId) {
      return false;
    }
    
    try {
      // Always update local state immediately
      setCurrentSession(session);
      
      // Always save to localStorage
      localStorage.setItem(
        `firebase_chat_session_${userId}_${session.id}`, 
        JSON.stringify(session)
      );
      
      // Update metadata
      const sessionMetadata: ChatSessionMetadata = {
        id: session.id,
        name: session.name,
        lastMessageTimestamp: session.updatedAt || Date.now(),
        preview: session.messages.length > 0 
          ? typeof session.messages[0].content === 'string'
            ? session.messages[0].content.substring(0, 100)
            : "Chat session" 
          : "Empty chat",
        messageCount: session.messages?.length || 0
      };
      
      // Update local metadata cache
      const localMetadataJson = localStorage.getItem(`firebase_chat_sessions_${userId}`);
      let localMetadata: ChatSessionMetadata[] = [];
      
      if (localMetadataJson) {
        try {
          localMetadata = JSON.parse(localMetadataJson);
          
          // Update or add the metadata
          const index = localMetadata.findIndex(m => m.id === session.id);
          
          if (index !== -1) {
            localMetadata[index] = sessionMetadata;
          } else {
            localMetadata.push(sessionMetadata);
          }
          
          // Sort by newest first
          localMetadata.sort((a, b) => b.lastMessageTimestamp - a.lastMessageTimestamp);
          
          // Update local metadata cache
          localStorage.setItem(`firebase_chat_sessions_${userId}`, JSON.stringify(localMetadata));
          
          // Update state
          setSessions(localMetadata);
        } catch (e) {
          console.error('Error updating metadata:', e);
        }
      }
      
      // If online, queue for Firebase sync in background
      if (isOnline) {
        queueSessionForSync(userId, session);
      }
      
      return true;
    } catch (error) {
      console.error("Error saving session:", error);
      toast({
        title: "Error",
        description: "Failed to save chat session",
        variant: "destructive"
      });
      return false;
    }
  }, [userId, isOnline, toast]);
  
  // Create a new session
  const createSession = useCallback(async (initialMessages: ChatMessage[] = []) => {
    if (!userId) {
      return null;
    }
    
    const sessionId = uuidv4();
    const now = Date.now();
    
    const newSession: ChatSession = {
      id: sessionId,
      name: "New Chat",
      messages: initialMessages,
      createdAt: now,
      updatedAt: now,
      userId: userId,
      modelId: DEFAULT_MODEL_ID
    };
    
    try {
      // Save locally first
      const success = await saveSession(newSession);
      
      if (success) {
        // If online, also save to Firebase but don't wait
        if (isOnline) {
          queueSessionForSync(userId, newSession);
        }
        
        return newSession;
      }
      return null;
    } catch (error) {
      console.error("Error creating session:", error);
      toast({
        title: "Error",
        description: "Failed to create new chat session",
        variant: "destructive"
      });
      return null;
    }
  }, [userId, saveSession, isOnline, toast]);
  
  // Delete a session
  const deleteSession = useCallback(async (sessionId: string) => {
    if (!userId) {
      return false;
    }
    
    try {
      // If online, delete from Firebase first to ensure it's properly removed
      if (isOnline) {
        try {
          // Wait for Firebase deletion to complete
          const firebaseSuccess = await FirebaseChatStorage.deleteSession(userId, sessionId);
          if (!firebaseSuccess) {
            console.error("Failed to delete session from Firebase");
            return false;
          }
        } catch (error) {
          console.error("Error deleting from Firebase:", error);
          return false;
        }
      }
      
      // After successful Firebase deletion (or if offline), delete from local cache
      localStorage.removeItem(`firebase_chat_session_${userId}_${sessionId}`);
      
      // Update metadata
      const localMetadataJson = localStorage.getItem(`firebase_chat_sessions_${userId}`);
      if (localMetadataJson) {
        try {
          const localMetadata = JSON.parse(localMetadataJson);
          const updatedMetadata = localMetadata.filter((m: ChatSessionMetadata) => m.id !== sessionId);
          localStorage.setItem(`firebase_chat_sessions_${userId}`, JSON.stringify(updatedMetadata));
          setSessions(updatedMetadata);
        } catch (e) {
          console.error('Error updating metadata after delete:', e);
        }
      }
      
      // If the deleted session was the current one, clear it
      if (currentSession?.id === sessionId) {
        setCurrentSession(null);
      }
      
      return true;
    } catch (error) {
      console.error("Error deleting session:", error);
      return false;
    }
  }, [userId, currentSession, isOnline]);
  
  // Migrate sessions from local/Drive storage to Firebase
  const migrateSessionsFromLocal = useCallback(async (localSessions: ChatSession[]) => {
    if (!userId || !localSessions.length || !isOnline) {
      if (!isOnline) {
        toast({
          title: "Offline",
          description: "Cannot migrate sessions while offline",
          variant: "destructive"
        });
      }
      return 0;
    }
    
    try {
      setIsMigrationInProgress(true);
      setMigrationProgress({ current: 0, total: localSessions.length });
      
      const successCount = await migrateSessionsToFirebase(
        userId,
        localSessions,
        (current, total) => setMigrationProgress({ current, total })
      );
      
      if (successCount > 0) {
        toast({
          title: "Migration Complete",
          description: `Successfully migrated ${successCount} of ${localSessions.length} chat sessions to Firebase`
        });
        
        // Reload metadata to show the migrated sessions
        await loadSessionMetadata();
      }
      
      return successCount;
    } catch (error) {
      console.error("Error migrating sessions:", error);
      toast({
        title: "Migration Failed",
        description: "Failed to migrate chat sessions to Firebase",
        variant: "destructive"
      });
      return 0;
    } finally {
      setIsMigrationInProgress(false);
    }
  }, [userId, loadSessionMetadata, toast, isOnline]);
  
  // Check if migration is needed
  const checkMigrationNeeded = useCallback(async () => {
    if (!userId || !isOnline) {
      return false;
    }
    
    const hasMigrated = await checkMigrationStatus(userId);
    return !hasMigrated;
  }, [userId, isOnline]);
  
  // Load metadata on initial mount and when user changes
  useEffect(() => {
    if (userId) {
      loadSessionMetadata();
    } else {
      setSessions([]);
      setCurrentSession(null);
    }
  }, [userId, loadSessionMetadata]);
  
  return {
    sessions,
    currentSession,
    isLoading,
    isMigrationInProgress,
    migrationProgress,
    isOnline,
    loadSession,
    saveSession,
    createSession,
    deleteSession,
    migrateSessionsFromLocal,
    checkMigrationNeeded,
    syncWithFirebase
  };
}