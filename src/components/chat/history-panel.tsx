
// src/components/chat/history-panel.tsx
'use client';

import type { ChatSessionMetadata } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { PlusCircle, Trash2, MessageSquare, Loader2, Search, XIcon } from 'lucide-react';
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
import React, { useState, useMemo } from 'react';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';

interface HistoryPanelProps {
  sessions: ChatSessionMetadata[];
  activeSessionId: string | null;
  onSelectSession: (sessionId: string) => void;
  onNewChat: () => void;
  onDeleteSession: (sessionId: string) => void;
  isLoading: boolean;
}

export function HistoryPanel({
  sessions,
  activeSessionId,
  onSelectSession,
  onNewChat,
  onDeleteSession,
  isLoading,
}: HistoryPanelProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const isMobile = useIsMobile();

  const displayedSessions = useMemo(() => {
    // First filter out empty chat sessions with no messages
    const nonEmptySessions = sessions.filter(session => 
      // Only show sessions with actual message content
      session.messageCount > 0 && 
      // Make sure preview is not empty or just whitespace
      session.preview && 
      session.preview.trim() !== ''
    );
    
    if (!searchQuery.trim()) {
      // Sort by lastMessageTimestamp descending by default
      return [...nonEmptySessions].sort((a, b) => b.lastMessageTimestamp - a.lastMessageTimestamp);
    }
    
    const lowerCaseQuery = searchQuery.toLowerCase();
    const filtered = nonEmptySessions.filter(
      (session) =>
        (session.name && session.name.toLowerCase().includes(lowerCaseQuery)) ||
        (session.preview && session.preview.toLowerCase().includes(lowerCaseQuery))
    );
    
    // Sort filtered results as well
    return filtered.sort((a, b) => b.lastMessageTimestamp - a.lastMessageTimestamp);
  }, [sessions, searchQuery]);

  return (
    <div className="h-full flex flex-col border-r bg-background/70 backdrop-blur-sm shadow-lg overflow-hidden" style={{ display: 'flex', flexDirection: 'column', height: '100%', maxHeight: '100vh' }}>
      <div className="p-4 flex justify-between items-center border-b shrink-0">
        <h3 className="text-lg font-semibold">Chat History</h3>
        <Button variant="ghost" size="icon" onClick={onNewChat} title="New Chat" className="hover:bg-primary/10 hover:text-primary transition-colors">
          <PlusCircle className="h-5 w-5" />
        </Button>
      </div>
      <div className="p-2 border-b">
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search history..."
            className="w-full rounded-lg bg-background pl-8 pr-8 h-9 focus-visible:ring-primary"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              onClick={() => setSearchQuery('')}
            >
              <XIcon className="h-4 w-4" />
              <span className="sr-only">Clear search</span>
            </Button>
          )}
        </div>
      </div>
      {isLoading && (
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      )}
      {!isLoading && displayedSessions.length === 0 && (
        <div className="flex-1 flex flex-col items-center justify-center text-center p-4 animate-fadeIn">
          <MessageSquare className="h-12 w-12 text-muted-foreground mb-3" />
          <p className="text-sm text-muted-foreground">
            {searchQuery ? 'No sessions match your search.' : 'No chat history yet.'}
          </p>
          {!searchQuery && <p className="text-xs text-muted-foreground">Start a new chat to see it here.</p>}
        </div>
      )}
      {!isLoading && displayedSessions.length > 0 && (
        <ScrollArea className="flex-1 overflow-y-auto" style={{ height: 'calc(100vh - 130px)', minHeight: '200px' }}>
          <div className="p-2 space-y-1 pb-10">
            {displayedSessions.map((session, index) => (
              <div
                key={session.id}
                className={cn(
                  `group flex items-center p-2.5 rounded-md cursor-pointer transition-all duration-200 ease-in-out animate-slideUpSlightly hover:shadow-lg hover:-translate-y-0.5`,
                  session.id === activeSessionId ? 'bg-accent text-accent-foreground shadow-md' : 'text-foreground hover:bg-accent/10'
                )}
                style={{ animationDelay: `${index * 30}ms` }}
                onClick={() => onSelectSession(session.id)}
              >
                {/* Delete button moved to the left */}
                <div className="flex-shrink-0 mr-2">
                    <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button
                        variant="ghost"
                        size="icon"
                        className={cn(
                            "h-7 w-7",
                            "text-slate-500 dark:text-slate-400",
                            "hover:text-destructive hover:bg-destructive/10"
                        )}
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
                <div className="flex-1 min-w-0 overflow-hidden"> {/* Text content container */}
                  <p className="text-sm font-medium truncate" title={session.name}>{session.name}</p>
                  <p className={cn("text-xs truncate", session.id === activeSessionId ? "text-accent-foreground/80" : "text-muted-foreground" )} title={session.preview}>
                    {session.messageCount} msg - {session.preview}
                  </p>
                  <p className={cn("text-xs", session.id === activeSessionId ? "text-accent-foreground/70" : "text-muted-foreground/70")}>
                    {formatDistanceToNow(new Date(session.lastMessageTimestamp), { addSuffix: true })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      )}
    </div>
  );
}
