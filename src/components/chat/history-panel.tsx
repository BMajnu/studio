
// src/components/chat/history-panel.tsx
'use client';

import type { ChatSessionMetadata } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { PlusCircle, Trash2, MessageSquare, Loader2, Search, XIcon } from 'lucide-react';
// Using existing icon instead of MagnifyingGlassIcon from radix-ui
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
import { useIsMobile } from '@/hooks/use-mobile';

interface HistoryPanelProps {
  sessions: ChatSessionMetadata[];
  activeSessionId: string | null;
  onSelectSession: (sessionId: string) => void;
  onNewChat: () => void;
  onDeleteSession: (sessionId: string) => void;
  isLoading: boolean;
  isLoggedIn: boolean;
  className?: string;
}

export function HistoryPanel({
  sessions,
  activeSessionId,
  onSelectSession,
  onNewChat,
  onDeleteSession,
  isLoading,
  isLoggedIn,
  className,
}: HistoryPanelProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [animateItems, setAnimateItems] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const isMobile = useIsMobile();

  useEffect(() => {
    const timer = setTimeout(() => setAnimateItems(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const displayedSessions = useMemo(() => {
    const nonEmptySessions = sessions.filter(session => 
      session.messageCount > 0 && 
      session.preview && 
      session.preview.trim() !== ''
    );
    
    if (!searchQuery.trim()) {
      return [...nonEmptySessions].sort((a, b) => b.lastMessageTimestamp - a.lastMessageTimestamp);
    }
    
    const lowerCaseQuery = searchQuery.toLowerCase();
    const filtered = nonEmptySessions.filter(
      (session) =>
        (session.name && session.name.toLowerCase().includes(lowerCaseQuery)) ||
        (session.preview && session.preview.toLowerCase().includes(lowerCaseQuery))
    );
    
    return filtered.sort((a, b) => b.lastMessageTimestamp - a.lastMessageTimestamp);
  }, [sessions, searchQuery]);

  return (
    <div className={cn("flex h-full flex-col", className)}>
      <div className="flex items-center gap-3 p-4 bg-card/50 backdrop-blur-sm border-b animate-fade-in">
        <h2 className="text-lg font-semibold text-gradient">Chat History</h2>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="btn-glow"
                onClick={() => searchInputRef.current?.focus()}
              >
                <Search className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right" className="animate-fade-in">Search</TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <Button variant="ghost" size="icon" onClick={onNewChat} title="New Chat" className="hover:bg-primary/10 hover:text-primary transition-colors">
          <PlusCircle className="h-5 w-5" />
        </Button>
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
                onClick={() => onSelectSession(session.id)}
              >
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
