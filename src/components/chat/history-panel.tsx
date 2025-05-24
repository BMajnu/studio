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
import React, { useState, useMemo, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';

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
}: HistoryPanelProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [animateItems, setAnimateItems] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const editInputRef = useRef<HTMLInputElement>(null);
  const [editingSessionId, setEditingSessionId] = useState<string | null>(null);
  const [editNameValue, setEditNameValue] = useState("");
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

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

  const startEditing = (sessionId: string, currentName: string) => {
    if (onRenameSession) { // Only allow editing if onRenameSession is provided
      setEditingSessionId(sessionId);
      setEditNameValue(currentName);
    }
  };

  const handleDoubleClickName = (e: React.MouseEvent, sessionId: string, currentName: string) => {
    e.stopPropagation();
    e.preventDefault();
    startEditing(sessionId, currentName);
  };
  
  const commitEdit = (sessionId: string) => {
    if (onRenameSession && editNameValue.trim() && editingSessionId === sessionId) {
      const trimmedName = editNameValue.trim();
      // Check if name actually changed to prevent unnecessary updates
      const originalSession = sessions.find(s => s.id === sessionId);
      if (originalSession && originalSession.name !== trimmedName) {
        onRenameSession(sessionId, trimmedName);
      }
    }
    setEditingSessionId(null);
  };

  const cancelEdit = () => {
    setEditingSessionId(null);
    // editNameValue will be reset when editing starts next time with startEditing
  };

  const handleInputBlur = (sessionId: string) => {
    // Delay slightly to allow click on save/cancel buttons to register
    setTimeout(() => {
        // Check if we are still in editing mode for this session
        // This helps prevent blur from acting if a button click already handled it
        if (editingSessionId === sessionId) {
            commitEdit(sessionId);
        }
    }, 100); 
  };

  const handleInputKeyDown = (e: React.KeyboardEvent, sessionId: string) => {
    e.stopPropagation(); // Keep this to prevent affecting other elements
    if (e.key === 'Enter') {
      e.preventDefault();
      commitEdit(sessionId);
    } else if (e.key === 'Escape') {
      e.preventDefault();
      cancelEdit();
    }
  };
  
  // For the explicit save button
  const handleSaveButtonClick = (e: React.MouseEvent, sessionId: string) => {
    e.stopPropagation();
    commitEdit(sessionId);
  };

  // For the explicit cancel button
  const handleCancelButtonClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    cancelEdit();
  };
  
  // For the pencil icon button
   const handlePencilEditClick = (e: React.MouseEvent, sessionId: string, currentName: string) => {
    e.stopPropagation();
    startEditing(sessionId, currentName);
  };


  return (
    <div className={cn("flex h-full flex-col", className)}>
      <div className="flex items-center justify-between p-4 bg-card/50 backdrop-blur-sm border-b animate-fade-in">
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
                    className="hover:bg-primary/10 hover:text-primary transition-colors"
                  >
                    {isSyncing ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="animate-fade-in">Sync with Drive</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
          <Button variant="ghost" size="icon" onClick={onNewChat} title="New Chat" className="hover:bg-primary/10 hover:text-primary transition-colors">
            <PlusCircle className="h-5 w-5" />
          </Button>
        </div>
      </div>
      <div className="relative animate-slide-in-right" style={{animationDelay: '0.1s'}}>
        <Input
          ref={searchInputRef}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full rounded-none border-x-0 focus-visible:ring-1 focus-visible:ring-primary/50 focus-visible:ring-offset-0 transition-all duration-300"
          placeholder="Search chats..."
        />
        {searchQuery && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-1 top-1/2 h-6 w-6 -translate-y-1/2 transition-all duration-200 hover:bg-destructive/10"
            onClick={() => setSearchQuery("")}
          >
            <XIcon className="h-3 w-3" />
          </Button>
        )}
      </div>
      
      {isLoading && (
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      )}

      {!isLoading && displayedSessions.length === 0 && (
        <div className="flex h-full flex-col items-center justify-center p-4 text-center text-muted-foreground animate-fade-in" style={{animationDelay: '0.2s'}}>
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted/80 backdrop-blur-sm animate-pulse-slow shadow-lg">
            <MessageSquare className="h-10 w-10" />
          </div>
          <h3 className="mt-4 text-lg font-semibold text-gradient">No chats found</h3>
          <p className="mt-2 text-sm">
            {searchQuery ? "Try a different search term" : "Start a new chat to get started"}
          </p>
        </div>
      )}

      {!isLoading && displayedSessions.length > 0 && (
        <ScrollArea className="flex-1 overflow-y-auto" style={{ height: 'calc(100vh - 130px)', minHeight: '200px' }}>
          <div className="p-2 space-y-1 pb-10">
            {displayedSessions.map((session, index) => (
              <div
                key={session.id}
                className={cn(
                  `group flex items-center p-2.5 rounded-md cursor-pointer transition-all duration-300 ease-in-out hover:shadow-lg hover:-translate-y-0.5`,
                  animateItems ? 'animate-fade-in' : 'opacity-0',
                  session.id === activeSessionId ? 'bg-accent/90 text-accent-foreground shadow-md backdrop-blur-sm' : 'text-foreground hover:bg-accent/10'
                )}
                style={{ animationDelay: `${0.1 + index * 0.05}s` }}
                onClick={() => {
                  if (editingSessionId !== session.id) { // Prevent selecting session if currently editing its name
                    onSelectSession(session.id)
                  }
                }}
              >
                <div className="flex-1 min-w-0 overflow-hidden max-w-[180px]"> {/* Text content container */}
                  {editingSessionId === session.id ? (
                    <div className="flex items-center space-x-1" onClick={(e) => e.stopPropagation()}>
                      <Input
                        ref={editInputRef}
                        type="text"
                        value={editNameValue}
                        onChange={(e) => setEditNameValue(e.target.value)}
                        onKeyDown={(e) => handleInputKeyDown(e, session.id)}
                        onBlur={() => handleInputBlur(session.id)}
                        className="w-full p-1 text-sm h-7 bg-background/80 focus-visible:ring-1 focus-visible:ring-primary"
                        // autoFocus is handled by useEffect
                      />
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-6 w-6 flex-shrink-0 hover:bg-primary/10" 
                        onClick={(e) => handleSaveButtonClick(e, session.id)}
                        title="Save name"
                      >
                        <CheckIcon className="h-3.5 w-3.5" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-6 w-6 flex-shrink-0 hover:bg-destructive/10" 
                        onClick={handleCancelButtonClick}
                        title="Cancel edit"
                      >
                        <XIcon className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  ) : (
                    <>
                      <p 
                        className="text-sm font-medium truncate" 
                        title={session.name}
                        onDoubleClick={(e) => handleDoubleClickName(e, session.id, session.name)}
                      >
                        {session.name}
                      </p>
                      <p className={cn("text-xs truncate", session.id === activeSessionId ? "text-accent-foreground/80" : "text-muted-foreground" )} title={session.preview}>
                        {session.messageCount} msg - {session.preview}
                      </p>
                      <p className={cn("text-xs", session.id === activeSessionId ? "text-accent-foreground/70" : "text-muted-foreground/70")}>
                        {formatDistanceToNow(new Date(session.lastMessageTimestamp), { addSuffix: true })}
                      </p>
                    </>
                  )}
                </div>
                
                {/* Show pencil and delete only when not editing THIS item */}
                {editingSessionId !== session.id && (
                  <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 ml-1">
                    {/* Rename Button (Pencil Icon) */}
                    {onRenameSession && ( // Only show if renaming is possible
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-slate-500 dark:text-slate-400 hover:text-primary hover:bg-primary/10"
                        onClick={(e) => handlePencilEditClick(e, session.id, session.name)}
                        title="Rename chat"
                      >
                        <PencilIcon className="h-4 w-4" />
                      </Button>
                    )}
                    
                    {/* Delete Button */}
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-slate-500 dark:text-slate-400 hover:text-destructive hover:bg-destructive/10"
                          onClick={(e) => e.stopPropagation()} 
                          title="Delete chat"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the chat session "{session.name}".
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => onDeleteSession(session.id)} className="bg-destructive hover:bg-destructive/90 text-destructive-foreground">
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                )}
              </div>
            ))}
          </div>
        </ScrollArea>
      )}
    </div>
  );
}
