"use client";

import { useState, useCallback, useEffect } from 'react';
import { useFirebaseChat } from './use-firebase-chat';
import { useChatHistory } from './use-chat-history';
import { useAuth } from '@/contexts/auth-context';
import { useToast } from '@/hooks/use-toast';
import { ChatSession } from '@/lib/types';

// Local storage key to track migration status
const MIGRATION_COMPLETED_KEY = 'desainr_firebase_migration_completed_';
const MIGRATION_SKIP_KEY = 'desainr_firebase_migration_skipped_';

/**
 * Hook for managing the migration of chat data from local storage to Firebase
 */
export function useLocalToFirebaseMigration() {
  const [isMigrationNeeded, setIsMigrationNeeded] = useState<boolean | null>(null);
  const [isMigrationDialogOpen, setIsMigrationDialogOpen] = useState(false);
  const [migrationError, setMigrationError] = useState<string | null>(null);
  const [isPreparing, setIsPreparing] = useState(false);
  const [localSessions, setLocalSessions] = useState<ChatSession[]>([]);

  const { toast } = useToast();
  const { user, googleAccessToken } = useAuth();
  const userId = user?.uid || '';

  // Local storage chat history hooks
  const { 
    historyMetadata,
    getSession
  } = useChatHistory(userId);

  // Firebase chat hooks
  const { 
    migrateSessionsFromLocal, 
    checkMigrationNeeded,
    migrationProgress,
    isMigrationInProgress
  } = useFirebaseChat();

  // Check if migration is needed
  const checkMigration = useCallback(async () => {
    if (!userId) {
      setIsMigrationNeeded(false);
      return;
    }

    try {
      // Check local storage first
      const migrationCompletedKey = `${MIGRATION_COMPLETED_KEY}${userId}`;
      const migrationSkippedKey = `${MIGRATION_SKIP_KEY}${userId}`;
      const hasCompletedMigration = localStorage.getItem(migrationCompletedKey) === 'true';
      const hasSkippedMigration = localStorage.getItem(migrationSkippedKey) === 'true';

      if (hasCompletedMigration) {
        setIsMigrationNeeded(false);
        return;
      }

      // If user previously skipped, don't show dialog automatically
      if (hasSkippedMigration) {
        // Still mark as needed, but don't show dialog automatically
        setIsMigrationNeeded(true);
        return;
      }

      // Check if there's Firebase data already
      const needsMigration = await checkMigrationNeeded();
      
      // Check if there's local data to migrate
      if (needsMigration) {
        // Now check if there's local data to migrate
        if (historyMetadata.length > 0) {
          setIsMigrationNeeded(true);
          // Show dialog automatically 
          setIsMigrationDialogOpen(true);
        } else {
          // No local data, so migration not needed
          setIsMigrationNeeded(false);
          // Mark as completed since there's nothing to migrate
          localStorage.setItem(migrationCompletedKey, 'true');
        }
      } else {
        setIsMigrationNeeded(false);
      }
    } catch (error) {
      console.error("Error checking migration status:", error);
      setIsMigrationNeeded(false);
    }
  }, [userId, checkMigrationNeeded, historyMetadata.length]);

  // Run migration check on mount
  useEffect(() => {
    checkMigration();
  }, [checkMigration]);

  // Load all sessions from local storage
  const loadLocalSessions = useCallback(async () => {
    setIsPreparing(true);
    
    try {
      // Load all sessions
      const sessions: ChatSession[] = [];
      
      for (const metadata of historyMetadata) {
        if (metadata.id) {
          const session = await getSession(metadata.id);
          if (session) {
            sessions.push(session);
          }
        }
      }
      
      setLocalSessions(sessions);
      return sessions;
    } catch (error) {
      console.error("Error loading local sessions:", error);
      setLocalSessions([]);
      return [];
    } finally {
      setIsPreparing(false);
    }
  }, [historyMetadata, getSession]);

  // Trigger migration from local storage to Firebase
  const runMigration = useCallback(async () => {
    if (!userId) {
      toast({
        title: "Login Required",
        description: "You need to be logged in to migrate your data.",
        variant: "destructive"
      });
      return;
    }

    setMigrationError(null);
    
    try {
      // Load all sessions from local storage
      const sessions = await loadLocalSessions();

      if (!sessions || sessions.length === 0) {
        toast({
          title: "No Data Found",
          description: "No chat history found in local storage to migrate.",
          variant: "default"
        });
        return;
      }

      // Migrate sessions
      const successCount = await migrateSessionsFromLocal(sessions);

      if (successCount > 0) {
        // Mark migration as completed
        localStorage.setItem(`${MIGRATION_COMPLETED_KEY}${userId}`, 'true');
        setIsMigrationNeeded(false);
        
        toast({
          title: "Migration Complete",
          description: `Successfully migrated ${successCount} chat sessions to Firebase.`
        });
      } else {
        setMigrationError("No sessions were migrated. Please try again.");
      }
    } catch (error: any) {
      console.error("Error during migration:", error);
      setMigrationError(error.message || "An unexpected error occurred during migration.");
      
      toast({
        title: "Migration Failed",
        description: "Could not migrate chat history to Firebase.",
        variant: "destructive"
      });
    }
  }, [userId, loadLocalSessions, migrateSessionsFromLocal, toast]);

  // Skip migration for now
  const skipMigration = useCallback(() => {
    if (userId) {
      localStorage.setItem(`${MIGRATION_SKIP_KEY}${userId}`, 'true');
    }
    setIsMigrationDialogOpen(false);
  }, [userId]);

  // Allow user to manually open the migration dialog
  const openMigrationDialog = useCallback(() => {
    setIsMigrationDialogOpen(true);
  }, []);

  return {
    isMigrationNeeded,
    isMigrationDialogOpen,
    setIsMigrationDialogOpen,
    migrationError,
    isPreparing,
    runMigration,
    skipMigration,
    openMigrationDialog,
    migrationProgress,
    isMigrationInProgress,
    checkMigration,
    localSessions
  };
} 