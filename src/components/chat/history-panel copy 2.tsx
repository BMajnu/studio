// src/components/chat/history-panel.tsx
'use client';

import type { ChatSessionMetadata, ChatSession } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { PlusCircle, Trash2, MessageSquare, Loader2, XIcon, PencilIcon, CheckIcon, RefreshCw, GalleryHorizontal, PanelLeftClose, Search, Edit, PanelLeftOpen, Image, X } from 'lucide-react';
import MediaGallery from './media-gallery';
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
import { DesAInRLogo } from '../icons/logo';
import { ChatSearchDialog } from './chat-search-dialog';
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
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  loadFullSession?: (sessionId: string) => Promise<ChatSession | null>;
}

// Add this component before the HistoryPanel component
function SessionItem({ 
  session, 
  isActive, 
  onClick, 
  onDelete, 
  animationDelay 
}: { 
  session: ChatSessionMetadata; 
  isActive: boolean; 
  onClick: (id: string) => void; 
  onDelete: (id: string) => void;
  animationDelay: string;
}) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  
  return (
    <div
      key={session.id}
      className={cn(
        "group relative flex flex-col rounded-md px-2 py-1.5 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-1 animate-fade-in mx-2 w-[calc(100%-37px)]",
        isActive
          ? "text-primary"
          : "",
      )}
      style={{ 
        backgroundColor: isActive ? 'hsl(var(--sidebar-primary) / 0.1)' : 'transparent',
        color: isActive ? 'hsl(var(--sidebar-primary))' : 'hsl(var(--sidebar-foreground) / 0.8)',
        animationDelay,
        '--ring-color': 'hsl(var(--sidebar-ring))'
      } as React.CSSProperties}
      onClick={() => onClick(session.id)}
      tabIndex={0}
    >
      {showDeleteConfirm ? (
        <div className="flex items-center justify-between w-full" onClick={(e) => e.stopPropagation()}>
          <div className="text-xs text-destructive">Delete this chat?</div>
          <div className="flex space-x-1">
            <button
              className="h-6 px-2 text-xs bg-destructive text-destructive-foreground rounded-sm"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(session.id);
                setShowDeleteConfirm(false);
              }}
            >
              Yes
            </button>
            <button
              className="h-6 px-2 text-xs bg-muted text-muted-foreground rounded-sm"
              onClick={(e) => {
                e.stopPropagation();
                setShowDeleteConfirm(false);
              }}
            >
              No
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between w-full">
            <div className="truncate font-medium max-w-[85%]">
              {session.name || session.preview}
            </div>
            <button
              className="h-6 w-6 flex items-center justify-center rounded-full text-muted-foreground hover:text-destructive hover:bg-destructive/10 opacity-0 group-hover:opacity-100 transition-opacity my-auto"
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                setShowDeleteConfirm(true);
              }}
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
          <div className="flex items-center text-xs mt-0.5" 
            style={{ color: 'hsl(var(--sidebar-foreground) / 0.5)' }}>
            <span>{session.messageCount} msg</span>
            <span className="mx-1">•</span>
            <span>about {formatDistanceToNow(new Date(session.lastMessageTimestamp), { addSuffix: false })}</span>
          </div>
        </>
      )}
    </div>
  );
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
  isCollapsed,
  onToggleCollapse,
  loadFullSession
}: HistoryPanelProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [animateItems, setAnimateItems] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const editInputRef = useRef<HTMLInputElement>(null);
  const [editingSessionId, setEditingSessionId] = useState<string | null>(null);
  const [editNameValue, setEditNameValue] = useState("");
  const [isMediaOpen, setIsMediaOpen] = useState(false);
  const [isSearchDialogOpen, setIsSearchDialogOpen] = useState(false);
  const debouncedSearchQuery = useDebounce(searchQuery, 300);
  const [sessionBeingSelected, setSessionBeingSelected] = useState<string | null>(null);
  const initialRenderRef = useRef(true);
  const lastActiveSessionId = useRef<string | null>(activeSessionId);
  const [lastRenderedSessions, setLastRenderedSessions] = useState<ChatSessionMetadata[]>([]);
  const [hasActiveHighlights, setHasActiveHighlights] = useState(false);
  
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

  // Function to handle opening the search dialog
  const handleOpenSearchDialog = () => {
    setIsSearchDialogOpen(true);
  };

  // Function to clear search highlights
  const handleClearSearchHighlights = () => {
    const event = new CustomEvent('clear-search-highlights');
    window.dispatchEvent(event);
    setHasActiveHighlights(false);
  };

  // Handle session selection from search dialog with search query
  const handleSearchSessionSelect = (sessionId: string, searchQuery?: string) => {
    onSelectSession(sessionId);
    
    // Dispatch a custom event to highlight search terms in the chat
    if (searchQuery && searchQuery.trim()) {
      const event = new CustomEvent('highlight-search-terms', {
        detail: { searchQuery: searchQuery.trim() }
      });
      window.dispatchEvent(event);
      setHasActiveHighlights(true);
    }
  };

  // Default loadFullSession implementation if not provided
  const defaultLoadFullSession = async (sessionId: string): Promise<ChatSession | null> => {
    console.warn('loadFullSession not provided to HistoryPanel');
    return null;
  };

  const effectiveLoadFullSession = loadFullSession || defaultLoadFullSession;

  // Check for active highlights on mount
  useEffect(() => {
    try {
      const savedQuery = localStorage.getItem('desainr_search_query');
      if (savedQuery) {
        setHasActiveHighlights(true);
      }
    } catch (error) {
      console.error('Error checking localStorage for search query:', error);
    }
  }, []);

  if (isCollapsed) {
    return (
      <div className={cn(
        "flex flex-col h-full border-r border-border/50 bg-sidebar shadow-sm transition-all duration-300 relative overflow-hidden",
        "w-[60px] min-w-[60px]",
        className
      )}>
        {/* Logo with unfold button on hover */}
        <div className="px-3 pt-3 pb-2 relative">
          <div className="w-full h-10 flex items-center justify-center relative group">
            <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent opacity-50 rounded-md"></div>
            <div className="opacity-100 group-hover:opacity-0 transition-opacity duration-200 flex items-center justify-center absolute inset-0">
              <DesAInRLogo className="h-6 w-6 text-primary/80" />
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
              onClick={onToggleCollapse}
              title="Expand sidebar"
            >
              <PanelLeftOpen className="h-5 w-5 text-primary" />
            </Button>
          </div>
        </div>
        
        {/* New Chat Button */}
        <div className="px-3 pt-4 pb-2">
          <Button
            variant="outline"
            size="icon"
            className="w-full h-10 flex items-center justify-center border-primary/20 bg-primary/5 hover:bg-primary/10 transition-colors"
            onClick={onNewChat}
            title="New Chat"
          >
            <PlusCircle className="h-5 w-5 text-primary/80" />
          </Button>
        </div>
        
        {/* Gallery Button */}
        <div className="px-3 pb-2">
          <Button
            variant="outline"
            size="icon"
            className="w-full h-10 flex items-center justify-center border-primary/20 bg-primary/5 hover:bg-primary/10 transition-colors"
            onClick={() => setIsMediaOpen(true)}
            title="Media Gallery"
          >
            <Image className="h-5 w-5 text-primary/80" />
          </Button>
        </div>
        
        {/* Search Button */}
        <div className="px-3 pb-2">
          <Button
            variant="outline"
            size="icon"
            className="w-full h-10 flex items-center justify-center border-primary/20 bg-primary/5 hover:bg-primary/10 transition-colors"
            onClick={handleOpenSearchDialog}
            title="Search Chats"
          >
            <Search className="h-5 w-5 text-primary/80" />
          </Button>
        </div>
        
        {/* Clear Highlights Button - Only shown when search has been performed */}
        {hasActiveHighlights && (
          <div className="px-3 pb-2">
            <Button
              variant="outline"
              size="icon"
              className="w-full h-10 flex items-center justify-center border-destructive/20 bg-destructive/5 hover:bg-destructive/10 transition-colors"
              onClick={handleClearSearchHighlights}
              title="Clear Search Highlights"
            >
              <X className="h-5 w-5 text-destructive/80" />
            </Button>
          </div>
        )}
        
        {/* Media Gallery Dialog */}
        <MediaGallery
          open={isMediaOpen}
          onOpenChange={setIsMediaOpen}
        />
        
        {/* Search Dialog */}
        <ChatSearchDialog
          isOpen={isSearchDialogOpen}
          onClose={() => setIsSearchDialogOpen(false)}
          sessions={sessions}
          onSelectSession={handleSearchSessionSelect}
          loadFullSession={effectiveLoadFullSession}
        />
      </div>
    );
  }

  return (
    <div className={cn("flex h-full flex-col border-r", className)}
      style={{ 
        background: 'linear-gradient(to bottom, hsl(var(--sidebar-background)), hsl(var(--sidebar-background) / 0.95))',
        borderColor: 'hsl(var(--sidebar-border))'
      }}>
      <div className="flex items-center justify-between p-3 border-b animate-fade-in shadow-md"
        style={{ 
          background: 'linear-gradient(to right, hsl(var(--sidebar-primary) / 0.1), hsl(var(--sidebar-accent) / 0.1))',
          backdropFilter: 'blur(8px)',
          borderColor: 'hsl(var(--sidebar-border))'
        }}>
        <div className="flex items-center">
          <DesAInRLogo width={30} height={30} className="mr-2" />
          <h1 className="text-xl font-semibold text-gradient">DesAInR</h1>
        </div>
        <Button variant="ghost" size="icon" onClick={onToggleCollapse} 
          className="h-8 w-8 hover:bg-transparent"
          style={{ color: 'hsl(var(--sidebar-foreground) / 0.7)' }}>
          <PanelLeftClose className="h-4 w-4" />
        </Button>
      </div>

      <div className="px-3 py-4">
        <Button variant="outline" className="w-full justify-start gap-2 border-0"
          style={{ 
            color: 'hsl(var(--sidebar-foreground) / 0.8)',
            borderColor: 'hsl(var(--sidebar-border))'
          }}
          onClick={onNewChat}>
          <PlusCircle className="h-4 w-4" />
          <span>New Chat</span>
        </Button>
      </div>
      
      {/* Gallery Button */}
      <div className="px-3 pb-2">
        <Button 
          variant="outline" 
          className="w-full justify-start gap-2 border-0"
          style={{ 
            color: 'hsl(var(--sidebar-foreground) / 0.8)',
            borderColor: 'hsl(var(--sidebar-border))'
          }}
          onClick={() => setIsMediaOpen(true)}
        >
          <Image className="h-4 w-4" />
          <span>Gallery</span>
        </Button>
      </div>

      {/* Clear Search Highlights Button - Only shown when search has been performed */}
      {hasActiveHighlights && (
        <div className="px-3 pb-2">
          <Button 
            variant="outline" 
            className="w-full justify-start gap-2 border border-primary/20 bg-primary/5"
            onClick={handleClearSearchHighlights}
          >
            <X className="h-4 w-4" />
            <span>Clear Highlights</span>
          </Button>
        </div>
      )}

      <div className="relative px-3 pb-4 animate-slide-in-right" style={{animationDelay: '0.1s'}}>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 pointer-events-none" 
            style={{ color: 'hsl(var(--sidebar-foreground) / 0.5)' }} />
          <Input
            ref={searchInputRef}
            placeholder="Search chats..."
            className="w-full pl-9 rounded-md border-x-0 focus-visible:ring-1 focus-visible:ring-offset-0 transition-all duration-300 backdrop-blur-sm"
            style={{ 
              backgroundColor: 'hsl(var(--card) / 0.4)',
              borderColor: 'hsl(var(--sidebar-border))',
              color: 'hsl(var(--sidebar-foreground))'
            }}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={handleOpenSearchDialog}
          />
          {searchQuery && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-1 top-1/2 h-6 w-6 -translate-y-1/2 transition-all duration-200 rounded-full"
              style={{ 
                color: 'hsl(var(--sidebar-foreground) / 0.7)'
              }}
              onClick={() => setSearchQuery("")}
            >
              <XIcon className="h-3 w-3" />
            </Button>
          )}
        </div>
        <div className="absolute inset-x-0 bottom-0 h-[1px]" 
          style={{ 
            background: 'linear-gradient(to right, hsl(var(--sidebar-primary) / 0.05), hsl(var(--sidebar-primary) / 0.3), hsl(var(--sidebar-primary) / 0.05))' 
          }}></div>
      </div>

      <ScrollArea className="flex-1 px-2">
        <div className="flex flex-col gap-1 pb-4">
          {isLoading && displayedSessions.length === 0 ? (
            [...Array(5)].map((_, i) => (
              <div key={i} className="h-16 w-full animate-pulse rounded-md" 
                style={{ backgroundColor: 'hsl(var(--sidebar-foreground) / 0.1)' }} />
            ))
          ) : (
            displayedSessions.map((session, index) => (
              <SessionItem
                key={session.id}
                session={session}
                isActive={activeSessionId === session.id}
                onClick={handleSessionSelect}
                onDelete={onDeleteSession}
                animationDelay={`${index * 0.05}s`}
              />
            ))
          )}
        </div>
      </ScrollArea>
      
      <MediaGallery open={isMediaOpen} onOpenChange={setIsMediaOpen} />
      <ChatSearchDialog 
        isOpen={isSearchDialogOpen}
        onClose={() => setIsSearchDialogOpen(false)}
        sessions={sessions}
        onSelectSession={handleSearchSessionSelect}
        loadFullSession={effectiveLoadFullSession}
      />
    </div>
  );
}
