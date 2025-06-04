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
import logger from '@/lib/utils/logger';
import eventDebouncer from '@/lib/utils/event-debouncer';
const { history: historyLogger, ui: uiLogger } = logger;

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
  onRefreshHistory: (fromHistoryPanel?: boolean) => void;
  isAutoRefreshEnabled?: boolean;
  setAutoRefreshEnabled?: (enabled: boolean) => void;
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
  isAutoRefreshEnabled,
  setAutoRefreshEnabled,
}: HistoryPanelProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [animateItems, setAnimateItems] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const editInputRef = useRef<HTMLInputElement>(null);
  const [editingSessionId, setEditingSessionId] = useState<string | null>(null);
  const [editNameValue, setEditNameValue] = useState("");
  const debouncedSearchQuery = useDebounce(searchQuery, 300);
  const [sessionBeingSelected, setSessionBeingSelected] = useState<string | null>(null);
  const initialRenderRef = useRef(true);
  const lastActiveSessionId = useRef<string | null>(activeSessionId);
  const [lastRenderedSessions, setLastRenderedSessions] = useState<ChatSessionMetadata[]>([]);
  
  // NEW: Add refs to prevent infinite loops
  const reloadHandledRef = useRef(false);
  const refreshAttempts = useRef(0);
  const lastRefreshTime = useRef(0);

  // NEW: Track navigation state
  const mountedRef = useRef<boolean>(false);
  const visibleRef = useRef<boolean>(true);

  // NEW: Add a state restore mechanism after page changes
  useEffect(() => {
    if (!mountedRef.current) {
      mountedRef.current = true;
      historyLogger.debug('History panel: First mount');
    } else {
      historyLogger.debug('History panel: Sessions updated, sessions count: ' + sessions.length);
      
      // If we previously had sessions but now have none, it might be a navigation issue
      if (lastRenderedSessions.length > 0 && sessions.length === 0 && visibleRef.current) {
        historyLogger.debug('History panel: Detected lost sessions after navigation, triggering reload');
        if (typeof onRefreshHistory === 'function') {
          setTimeout(() => {
            onRefreshHistory(true);
          }, 100);
        }
      }
      
      setLastRenderedSessions(sessions);
    }
    
    // Also add focus detection using the Page Visibility API
    const handleVisibilityChange = () => {
      const isVisible = document.visibilityState === 'visible';
      if (isVisible && mountedRef.current && !visibleRef.current) {
        historyLogger.debug('History panel: Page became visible again');
        visibleRef.current = true;
        
        // If the panel seems empty but should have data, refresh
        if (sessions.length === 0 && lastRenderedSessions.length > 0) {
          historyLogger.debug('History panel: Triggering reload on visibility change');
          if (typeof onRefreshHistory === 'function') {
            onRefreshHistory(true);
          }
        }
      } else if (!isVisible) {
        visibleRef.current = false;
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [sessions, onRefreshHistory, lastRenderedSessions]);

  // Add route change handling
  useEffect(() => {
    const handleRouteChange = () => {
      historyLogger.debug('History panel: Detected route change');
      
      // Reset any editing state
      setEditingSessionId(null);
      setEditNameValue("");
      
      // Trigger a refresh if needed after a slight delay
      setTimeout(() => {
        if (sessions.length === 0 && typeof onRefreshHistory === 'function') {
          historyLogger.debug('History panel: Triggering reload after route change');
          onRefreshHistory(true);
        }
      }, 300);
    };
    
    window.addEventListener('routeChangeComplete', handleRouteChange);
    return () => {
      window.removeEventListener('routeChangeComplete', handleRouteChange);
    };
  }, [sessions.length, onRefreshHistory]);

  useEffect(() => {
    const timer = setTimeout(() => setAnimateItems(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // FIXED: Modify reload detection to prevent looping
  useEffect(() => {
    // Only run this once and if we haven't already handled a reload
    if (!initialRenderRef.current || reloadHandledRef.current) return;
    
    // Check if this is actually a reload
    const isReload = !!(
      document.hidden === false && 
      performance?.navigation?.type === 1
    );
    
    if (isReload && activeSessionId) {
      historyLogger.debug(`HistoryPanel: Detected page reload with active session ${activeSessionId}`);
      
      // Set the flag to prevent repeat handling
      reloadHandledRef.current = true;
      
      // Force a single refresh with delay
      if (onRefreshHistory) {
        setTimeout(() => {
          onRefreshHistory(true);
        }, 100);
      }
    }
    
    // Mark initial render as completed
    initialRenderRef.current = false;
  }, [activeSessionId, onRefreshHistory]);

  // NEW: Add effect to reset loading state if stuck
  useEffect(() => {
    // If loading persists for more than 5 seconds, reset it
    if (isLoading) {
      const loadingTimeout = setTimeout(() => {
        if (isLoading && refreshAttempts.current < 3) {
          historyLogger.warn("HistoryPanel: Loading state stuck, forcing refresh");
          refreshAttempts.current++;
          
          // If onRefreshHistory exists, call it to try refreshing
          if (onRefreshHistory) {
            onRefreshHistory(false);  // Don't force to avoid loops
          }
        }
      }, 5000);
      
      return () => clearTimeout(loadingTimeout);
    } else {
      // Reset attempts counter once loading completes
      refreshAttempts.current = 0;
    }
  }, [isLoading, onRefreshHistory]);
  
  // NEW: Track active session ID changes
  useEffect(() => {
    if (!initialRenderRef.current && 
        activeSessionId && 
        lastActiveSessionId.current !== activeSessionId) {
      historyLogger.debug(`HistoryPanel: Active session changed from ${lastActiveSessionId.current} to ${activeSessionId}`);
      lastActiveSessionId.current = activeSessionId;
    }
  }, [activeSessionId]);

  useEffect(() => {
    if (editingSessionId && editInputRef.current) {
      editInputRef.current.focus();
      editInputRef.current.select();
    }
  }, [editingSessionId]);

  const displayedSessions = useMemo(() => {
    // Add debug logging
    uiLogger.debug('HistoryPanel: Recalculating displayed sessions');
    
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

  // Optimize the event listener setup
  useEffect(() => {
    // NEW: Safe refresh function with rate limiting
    const safeRefresh = (source: string, force: boolean = false) => {
      // Skip auto-refresh if disabled (unless it's a forced refresh)
      if (!force && isAutoRefreshEnabled === false) {
        historyLogger.debug(`HistoryPanel: Auto-refresh disabled, skipping refresh from ${source}`);
        return;
      }
      
      const now = Date.now();
      // Limit refreshes to once per second and max attempts
      if (now - lastRefreshTime.current > 1000 && refreshAttempts.current < 5) {
        historyLogger.debug(`HistoryPanel: Safe refresh triggered from ${source}`);
        lastRefreshTime.current = now;
        refreshAttempts.current++;
        
        if (onRefreshHistory) {
          onRefreshHistory(force);
        }
      } else {
        historyLogger.debug(`HistoryPanel: Refresh throttled from ${source}, attempts: ${refreshAttempts.current}`);
      }
    };
    
    // Create a handler for history-updated events using the debouncer
    const handleHistoryUpdated = eventDebouncer.debounce<(event: CustomEvent) => void>(
      'history-updated-handler', 
      (event: CustomEvent) => {
        const { sessionId, source, forceUpdate } = event.detail;
        
        // Skip if auto-refresh disabled and not forced
        if (!forceUpdate && isAutoRefreshEnabled === false) {
          return;
        }
        
        historyLogger.debug(`History panel: Processing history-updated event for session ${sessionId} from ${source}`);
      
        // Always refresh if forceUpdate is set or if from reload recovery
        // but skip if from a different source during normal operation
        if ((forceUpdate === true || source === 'reload-recovery') && typeof onRefreshHistory === 'function') {
          safeRefresh(`history-updated:${source}`, forceUpdate === true);
        } else if (source !== 'history-panel' && typeof onRefreshHistory === 'function') {
          safeRefresh(`history-updated:${source}`, false);
        }
      },
      1000, // Increased debounce time for reduced frequency
      'history-panel'
    );
    
    // Create a handler for chat-name-updated events using the debouncer
    const handleChatNameUpdated = eventDebouncer.debounce<(event: CustomEvent) => void>(
      'chat-name-updated-handler',
      (event: CustomEvent) => {
        const { sessionId, newName, forceUpdate, source } = event.detail;
      
        // Only process essential updates
        if (forceUpdate === true || source === 'reload-recovery') {
          historyLogger.debug(`History panel: Processing chat-name-updated event for session ${sessionId} with name "${newName}"`);
          
          if (typeof onRefreshHistory === 'function') {
            safeRefresh(`chat-name-updated:${source || 'unknown'}`, false);
          }
        }
      },
      500, // Increased debounce time
      'history-panel'
    );
    
    // Create a handler for storage events using the debouncer
    const handleStorageChange = eventDebouncer.debounce<(e: StorageEvent) => void>(
      'storage-event-handler',
      (e: StorageEvent) => {
        // Check if this is our special update trigger
        if (e.key === 'desainr_ui_update_trigger' || e.key === 'desainr_history_update_trigger') {
          historyLogger.debug(`History panel: Processing update from storage event: ${e.key}`);
          
          // Force refresh all sessions from the current metadata
          if (typeof onRefreshHistory === 'function') {
            safeRefresh('storage-event', false);
          }
        }
      },
      1000, // Longer debounce for storage events
      'history-panel'
    );
    
    // Create a handler for window focus events
    const handleFocus = eventDebouncer.debounce<() => void>(
      'window-focus-handler',
      () => {
        // Only refresh on focus if we have an active session and not currently loading
        if (activeSessionId && !isLoading) {
          historyLogger.debug(`History panel: Window received focus with active session ${activeSessionId}`);
          
          if (typeof onRefreshHistory === 'function') {
            safeRefresh('focus-event', false);
          }
        }
      },
      2000, // Much longer debounce for focus events
      'history-panel'
    );
    
    // Set up all event listeners
    window.addEventListener('history-updated', handleHistoryUpdated as EventListener);
    window.addEventListener('chat-name-updated', handleChatNameUpdated as EventListener);
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('focus', handleFocus);
    
    // Clean up all listeners on unmount
    return () => {
      window.removeEventListener('history-updated', handleHistoryUpdated as EventListener);
      window.removeEventListener('chat-name-updated', handleChatNameUpdated as EventListener);
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('focus', handleFocus);
    };
  }, [onRefreshHistory, activeSessionId, isLoading, isAutoRefreshEnabled]);

  return (
    <div className={cn("flex h-full flex-col bg-gradient-to-b from-background-start-hsl to-background-end-hsl", className)}>
      <div className="flex items-center justify-between p-4 bg-gradient-to-r from-primary/10 to-secondary/10 backdrop-blur-sm border-b animate-fade-in shadow-md">
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-semibold text-gradient">Chat History</h2>
        </div>
        <div className="flex items-center gap-2">
          {/* Manual refresh button - always visible */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => onRefreshHistory && onRefreshHistory(true)}
                  disabled={isLoading}
                  className="hover:bg-primary/10 hover:text-primary transition-colors btn-glow rounded-full"
                >
                  {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="animate-fade-in">Refresh History</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          {/* Auto-refresh toggle - only show if prop is provided */}
          {setAutoRefreshEnabled && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant={isAutoRefreshEnabled ? "secondary" : "outline"} 
                    size="icon" 
                    onClick={() => setAutoRefreshEnabled(!isAutoRefreshEnabled)}
                    className={`hover:bg-primary/10 hover:text-primary transition-colors rounded-full ${isAutoRefreshEnabled ? 'bg-primary/20 text-primary' : ''}`}
                  >
                    {isAutoRefreshEnabled ? 
                      <span className="relative flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-30"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
                      </span> : 
                      <span className="h-3 w-3 rounded-full border border-current"></span>
                    }
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="animate-fade-in">
                  {isAutoRefreshEnabled ? "Auto-Refresh On" : "Auto-Refresh Off"}
                </TooltipContent>
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
