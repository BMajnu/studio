import React, { useCallback } from 'react';
import { useChatHistory } from '@/lib/hooks/use-chat-history';
import { ChatHistoryItem } from './ChatHistoryItem';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { HistoryPanel } from './history-panel';

interface ChatHistoryProps {
  userId: string;
  activeSessionId: string | null;
  onSelectSession: (sessionId: string) => void;
  onNewChat: () => void;
}

export function ChatHistory({ userId, activeSessionId, onSelectSession, onNewChat }: ChatHistoryProps) {
  const { historyMetadata, deleteSession, isSyncing, renameSession } = useChatHistory(userId);

  const handleDeleteSession = (sessionId: string) => {
    deleteSession(sessionId);
  };
  
  const handleRenameSession = async (sessionId: string, newName: string) => {
    const success = await renameSession(sessionId, newName);
    if (success) {
      toast({
        title: "Chat Renamed",
        description: "Chat name updated successfully.",
      });
    } else {
      toast({
        title: "Rename Failed",
        description: "Could not rename the chat. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  // Add a refresh history handler
  const handleRefreshHistory = useCallback(() => {
    // Create an event to force history refresh
    if (typeof window !== 'undefined') {
      const refreshEvent = new Event('storage', { bubbles: true });
      window.dispatchEvent(refreshEvent);
      
      // Also trigger a custom event for components listening for history updates
      const historyEvent = new CustomEvent('history-updated', { 
        detail: { force: true } 
      });
      window.dispatchEvent(historyEvent);
    }
  }, []);

  return (
    <div className="h-full flex flex-col max-w-[260px] w-full">
      <HistoryPanel
        sessions={historyMetadata}
        activeSessionId={activeSessionId}
        onSelectSession={onSelectSession}
        onNewChat={onNewChat}
        onDeleteSession={handleDeleteSession}
        onRenameSession={handleRenameSession}
        onSyncWithDrive={undefined}  // Remove sync functionality
        isLoading={false}
        isLoggedIn={true}
        isSyncing={isSyncing}
        onRefreshHistory={handleRefreshHistory}
        className=""
      />
    </div>
  );
} 