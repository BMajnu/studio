import React, { useState, useRef, useCallback } from 'react';
import { useFirebaseChat } from '@/lib/hooks/use-firebase-chat';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { HistoryPanel } from './history-panel';

interface FirebaseChatHistoryProps {
  activeSessionId: string | null;
  onSelectSession: (sessionId: string) => void;
  onNewChat: () => void;
}

export function FirebaseChatHistory({ activeSessionId, onSelectSession, onNewChat }: FirebaseChatHistoryProps) {
  const { 
    sessions, 
    isLoading, 
    deleteSession, 
    isMigrationInProgress,
    migrationProgress,
    syncWithFirebase,
    loadSession
  } = useFirebaseChat();
  
  // Add local state for auto-refresh
  const [isAutoRefreshEnabled, setAutoRefreshEnabled] = useState(true);
  const lastRefreshTime = useRef<number>(0);

  const handleDeleteSession = async (sessionId: string) => {
    const success = await deleteSession(sessionId);
    if (success) {
      toast({
        title: "Chat Deleted",
        description: "Chat has been deleted successfully.",
      });
    } else {
      toast({
        title: "Deletion Failed",
        description: "Could not delete the chat. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  const handleRenameSession = useCallback(async (sessionId: string, newName: string) => {
    toast({
      title: "Rename Operation",
      description: "Renaming will be available in a future update.",
    });
    return false;
  }, []);
  
  const handleRefreshHistory = useCallback((forced = false) => {
    // Limit refresh frequency to prevent performance issues
    const now = Date.now();
    if (forced || now - lastRefreshTime.current > 30000) { // 30 sec limit for auto refresh
      lastRefreshTime.current = now;
      // Call syncWithFirebase to refresh data
      syncWithFirebase();
      
      // Show toast for user feedback
      if (forced) {
        toast({
          title: "Refreshing",
          description: "Checking for updates from Firebase...",
          duration: 2000
        });
      }
    }
  }, [syncWithFirebase, toast]);

  return (
    <div className="h-full flex flex-col max-w-[260px] w-full">
      <HistoryPanel
        sessions={sessions}
        activeSessionId={activeSessionId}
        onSelectSession={onSelectSession}
        onNewChat={onNewChat}
        onDeleteSession={handleDeleteSession}
        onRenameSession={handleRenameSession}
        isLoading={isLoading}
        isLoggedIn={true}
        onRefreshHistory={handleRefreshHistory}
        isAutoRefreshEnabled={isAutoRefreshEnabled}
        setAutoRefreshEnabled={setAutoRefreshEnabled}
        isCollapsed={false}
        onToggleCollapse={() => {}}
        loadFullSession={loadSession}
      />
      
      {isMigrationInProgress && (
        <div className="px-2 py-3 bg-muted/50 text-xs">
          Migrating chats: {migrationProgress.current}/{migrationProgress.total}
        </div>
      )}
    </div>
  );
} 