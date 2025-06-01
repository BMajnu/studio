import React from 'react';
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
    migrationProgress
  } = useFirebaseChat();

  const handleDeleteSession = async (sessionId: string) => {
    const success = await deleteSession(sessionId);
    if (success) {
      toast({
        title: "Chat Deleted",
        description: "Chat was successfully deleted.",
      });
    } else {
      toast({
        title: "Delete Failed",
        description: "Could not delete the chat. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  const handleRenameSession = async (sessionId: string, newName: string) => {
    // Find the session
    const session = sessions.find(s => s.id === sessionId);
    if (!session) {
      toast({
        title: "Rename Failed",
        description: "Could not find the chat to rename.",
        variant: "destructive",
      });
      return false;
    }
    
    // For now just show a toast - actual rename will be added in Phase 3
    toast({
      title: "Not Implemented",
      description: "Rename functionality will be added soon.",
      variant: "default",
    });
    
    return false;
  };

  const handleRefreshHistory = () => {
    // For now, this is a no-op since we don't have a direct refresh method
    // We'll rely on the automatic refresh when changes occur
    toast({
      title: "Refreshing",
      description: "Checking for updates...",
    });
  };

  return (
    <div className="h-full flex flex-col max-w-[260px] w-full">
      <HistoryPanel
        sessions={sessions}
        activeSessionId={activeSessionId}
        onSelectSession={onSelectSession}
        onNewChat={onNewChat}
        onDeleteSession={handleDeleteSession}
        onRenameSession={handleRenameSession}
        onSyncWithDrive={undefined} // Remove sync button
        isLoading={isLoading}
        isLoggedIn={true}
        isSyncing={false}
        onRefreshHistory={handleRefreshHistory}
      />
      
      {isMigrationInProgress && (
        <div className="px-2 py-3 bg-muted/50 text-xs">
          Migrating chats: {migrationProgress.current}/{migrationProgress.total}
        </div>
      )}
    </div>
  );
} 