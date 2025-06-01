// src/components/chat/history-panel.tsx
'use client';

import type { ChatSessionMetadata } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { PlusCircle, Trash2, MessageSquare, Loader2, XIcon, PencilIcon, CheckIcon, RefreshCw } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import React, { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { ChatHistoryItem } from './ChatHistoryItem';

// Custom hook for debounce
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}

interface HistoryPanelProps {
  sessions: ChatSessionMetadata[];
  activeSessionId: string | null;
  onSelectSession: (sessionId: string) => void;
  onNewChat: () => void;
  onDeleteSession: (sessionId: string) => void;
  onRenameSession?: (sessionId: string, newName: string) => void;
  onSyncWithDrive?: () => void;
  isLoading: boolean;
  isLoggedIn: boolean;
  isSyncing?: boolean;
  className?: string;
  onRefreshHistory: () => void;
}

export function HistoryPanel({
  sessions,
  activeSessionId,
  onSelectSession,
  onNewChat,
  onDeleteSession,
  onRenameSession,
  onSyncWithDrive,
  isLoading,
  isLoggedIn,
  isSyncing,
  className,
  onRefreshHistory,
}: HistoryPanelProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [animateItems, setAnimateItems] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const editInputRef = useRef<HTMLInputElement>(null);
  const [editingSessionId, setEditingSessionId] = useState<string | null>(null);
  const [editNameValue, setEditNameValue] = useState("");
  const debouncedSearchQuery = useDebounce(searchQuery, 300);
  const [sessionBeingSelected, setSessionBeingSelected] = useState<string | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setAnimateItems(true), 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (editingSessionId && editInputRef.current) {
      editInputRef.current.focus();
      editInputRef.current.select();
    }
  }, [editingSessionId]);

  const displayedSessions = useMemo(() => {
    const nonEmptySessions = sessions.filter(session => 
      session.messageCount > 0 && 
      session.preview && 
      session.preview.trim() !== ''
    );
    
    if (!debouncedSearchQuery.trim()) {
      return [...nonEmptySessions].sort((a, b) => b.lastMessageTimestamp - a.lastMessageTimestamp);
    }
    
    const lowerCaseQuery = debouncedSearchQuery.toLowerCase();
    const filtered = nonEmptySessions.filter(
      (session) =>
        (session.name && session.name.toLowerCase().includes(lowerCaseQuery)) ||
        (session.preview && session.preview.toLowerCase().includes(lowerCaseQuery))
    );
    
    return filtered.sort((a, b) => b.lastMessageTimestamp - a.lastMessageTimestamp);
  }, [sessions, debouncedSearchQuery]);

  const startEditing = useCallback((sessionId: string, currentName: string) => {
    if (onRenameSession) { // Only allow editing if onRenameSession is provided
      setEditingSessionId(sessionId);
      setEditNameValue(currentName);
    }
  }, [onRenameSession]);

  const handleDoubleClickName = useCallback((e: React.MouseEvent, sessionId: string, currentName: string) => {
    e.stopPropagation();
    e.preventDefault();
    startEditing(sessionId, currentName);
  }, [startEditing]);
  
  const commitEdit = useCallback((sessionId: string) => {
    if (onRenameSession && editNameValue.trim() && editingSessionId === sessionId) {
      const trimmedName = editNameValue.trim();
      // Check if name actually changed to prevent unnecessary updates
      const originalSession = sessions.find(s => s.id === sessionId);
      if (originalSession && originalSession.name !== trimmedName) {
        onRenameSession(sessionId, trimmedName);
      }
    }
    setEditingSessionId(null);
  }, [editNameValue, editingSessionId, onRenameSession, sessions]);

  const cancelEdit = useCallback(() => {
    setEditingSessionId(null);
    // editNameValue will be reset when editing starts next time with startEditing
  }, []);

  const handleInputBlur = useCallback((sessionId: string) => {
    // Delay slightly to allow click on save/cancel buttons to register
    setTimeout(() => {
        // Check if we are still in editing mode for this session
        // This helps prevent blur from acting if a button click already handled it
        if (editingSessionId === sessionId) {
            commitEdit(sessionId);
        }
    }, 100); 
  }, [commitEdit, editingSessionId]);

  const handleInputKeyDown = useCallback((e: React.KeyboardEvent, sessionId: string) => {
    e.stopPropagation(); // Keep this to prevent affecting other elements
    if (e.key === 'Enter') {
      e.preventDefault();
      commitEdit(sessionId);
    } else if (e.key === 'Escape') {
      e.preventDefault();
      cancelEdit();
    }
  }, [cancelEdit, commitEdit]);
  
  // For the explicit save button
  const handleSaveButtonClick = useCallback((e: React.MouseEvent, sessionId: string) => {
    e.stopPropagation();
    commitEdit(sessionId);
  }, [commitEdit]);

  // For the explicit cancel button
  const handleCancelButtonClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    cancelEdit();
  }, [cancelEdit]);
  
  // For the pencil icon button
  const handlePencilEditClick = useCallback((e: React.MouseEvent, sessionId: string, currentName: string) => {
    e.stopPropagation();
    startEditing(sessionId, currentName);
  }, [startEditing]);

  // Handler for selecting a session
  const handleSessionSelect = useCallback((sessionId: string) => {
    if (editingSessionId === sessionId) return; // Don't select if currently editing
    
    // Prevent rapid clicking
    if (sessionBeingSelected === sessionId) return;
    
    setSessionBeingSelected(sessionId);
    
    // Call the parent's select handler
    onSelectSession(sessionId);
    
    // Reset selection state after a delay
    setTimeout(() => {
      setSessionBeingSelected(null);
    }, 500);
  }, [editingSessionId, onSelectSession, sessionBeingSelected]);

  // Add listener for history-updated events to force refresh
  useEffect(() => {
    const handleHistoryUpdated = (event: CustomEvent) => {
      const { sessionId, newName } = event.detail;
      console.log(`History panel: Received history-updated event for session ${sessionId} with name "${newName}"`);
      
      // Use the existing displayedSessions update mechanism
      // Force a refresh via onRefreshHistory
      if (typeof onRefreshHistory === 'function') {
        onRefreshHistory();
      }
    };
    
    // Listen for custom history-updated events
    window.addEventListener('history-updated', handleHistoryUpdated as EventListener);
    
    // Also listen for chat-name-updated events
    const handleChatNameUpdated = (event: CustomEvent) => {
      const { sessionId, newName, forceUpdate } = event.detail;
      
      // Only process if we have the forceUpdate flag
      if (forceUpdate) {
        console.log(`History panel: Received chat-name-updated event for session ${sessionId} with name "${newName}"`);
        
        // Use the onRefreshHistory callback to refresh the session list
        if (typeof onRefreshHistory === 'function') {
          onRefreshHistory();
        }
      }
    };
    
    window.addEventListener('chat-name-updated', handleChatNameUpdated as EventListener);
    
    // Storage event listener for cross-tab synchronization
    const handleStorageChange = (e: StorageEvent) => {
      // Check if this is our special update trigger
      if (e.key === 'desainr_history_update_trigger') {
        console.log('History panel: Detected history update trigger');
        
        // Force refresh all sessions from the current metadata
        if (typeof onRefreshHistory === 'function') {
          onRefreshHistory();
        }
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('history-updated', handleHistoryUpdated as EventListener);
      window.removeEventListener('chat-name-updated', handleChatNameUpdated as EventListener);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [onRefreshHistory]);

  return (
    <div className={cn("flex h-full flex-col bg-gradient-to-b from-background-start-hsl to-background-end-hsl", className)}>
      <div className="flex items-center justify-between p-4 bg-gradient-to-r from-primary/10 to-secondary/10 backdrop-blur-sm border-b animate-fade-in shadow-md">
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-semibold text-gradient">Chat History</h2>
        </div>
        <div className="flex items-center gap-2">
          {onSyncWithDrive && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={onSyncWithDrive}
                    disabled={isSyncing}
                    className="hover:bg-primary/10 hover:text-primary transition-colors btn-glow rounded-full"
                  >
                    {isSyncing ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="animate-fade-in">Sync with Drive</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
          <Button 
            variant="outline" 
            size="icon" 
            onClick={onNewChat} 
            title="New Chat" 
            className="hover:bg-primary/10 hover:text-primary transition-colors duration-300 rounded-full shadow-sm hover:shadow-md btn-glow"
          >
            <PlusCircle className="h-5 w-5" />
          </Button>
        </div>
      </div>
      <div className="relative animate-slide-in-right" style={{animationDelay: '0.1s'}}>
        <div className="relative">
          <Input
            ref={searchInputRef}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-none border-x-0 focus-visible:ring-1 focus-visible:ring-primary/50 focus-visible:ring-offset-0 transition-all duration-300 bg-card/40 backdrop-blur-sm"
            placeholder="Search chats..."
          />
          {searchQuery && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-1 top-1/2 h-6 w-6 -translate-y-1/2 transition-all duration-200 hover:bg-destructive/10 hover:text-destructive rounded-full"
              onClick={() => setSearchQuery("")}
            >
              <XIcon className="h-3 w-3" />
            </Button>
          )}
        </div>
        
        <div className="absolute inset-x-0 bottom-0 h-[1px] bg-gradient-to-r from-primary/5 via-primary/30 to-primary/5"></div>
      </div>
      
      {isLoading && (
        <div className="flex-1 flex items-center justify-center">
          <div className="glass-panel p-6 rounded-full shadow-lg animate-pulse-slow">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        </div>
      )}

      {!isLoading && displayedSessions.length === 0 && (
        <div className="flex h-full flex-col items-center justify-center p-4 text-center text-muted-foreground animate-fade-in" style={{animationDelay: '0.2s'}}>
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 backdrop-blur-sm animate-pulse-slow shadow-lg">
            <MessageSquare className="h-10 w-10 text-primary" />
          </div>
          <h3 className="mt-4 text-lg font-semibold text-gradient">No chats found</h3>
          <p className="mt-2 text-sm">
            {searchQuery ? "Try a different search term" : "Start a new chat to get started"}
          </p>
          <Button 
            variant="outline" 
            className="mt-6 rounded-full bg-gradient-to-r from-primary/10 to-secondary/10 hover:from-primary/20 hover:to-secondary/20 shadow-md btn-glow"
            onClick={onNewChat}
          >
            <PlusCircle className="h-4 w-4 mr-2" /> New Chat
          </Button>
        </div>
      )}

      {!isLoading && displayedSessions.length > 0 && (
        <ScrollArea className="flex-1 overflow-y-auto relative" style={{ height: 'calc(100vh - 160px)', minHeight: '200px' }}>
          <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-primary/5 via-primary/20 to-primary/5"></div>
          <div className="px-3 py-2 space-y-2 pb-10">
            {displayedSessions.map((session, index) => (
              <ChatHistoryItem
                key={session.id}
                session={session}
                isActive={session.id === activeSessionId}
                onClick={handleSessionSelect}
                onDelete={onDeleteSession}
                onRename={onRenameSession}
              />
            ))}
          </div>
        </ScrollArea>
      )}
    </div>
  );
}
