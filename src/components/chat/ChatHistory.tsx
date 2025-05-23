import React from 'react';
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
  const { historyMetadata, deleteSession, syncWithDrive, isSyncing, renameSession, triggerGoogleSignIn } = useChatHistory(userId);

  const handleDeleteSession = (sessionId: string) => {
    deleteSession(sessionId);
  };

  const handleSyncWithDrive = async () => {
    const result = await syncWithDrive();
    if (result === 'TOKEN_REFRESH_NEEDED') {
      triggerGoogleSignIn();
    }
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

  return (
    <div className="h-full flex flex-col max-w-[260px] w-full">
      <HistoryPanel
        sessions={historyMetadata}
        activeSessionId={activeSessionId}
        onSelectSession={onSelectSession}
        onNewChat={onNewChat}
        onDeleteSession={handleDeleteSession}
        onRenameSession={handleRenameSession}
        onSyncWithDrive={handleSyncWithDrive}
        isLoading={false}
        isLoggedIn={true}
        isSyncing={isSyncing}
      />
    </div>
  );
} 