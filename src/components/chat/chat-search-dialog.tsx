'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Search, X, Loader2, MessageSquare, History, Clock, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';
import { useDebounce } from '@/lib/hooks/use-debounce';
import type { ChatSessionMetadata, ChatSession } from '@/lib/types';

interface ChatSearchDialogProps {
  isOpen: boolean;
  onClose: () => void;
  sessions: ChatSessionMetadata[];
  onSelectSession: (sessionId: string, searchQuery?: string) => void;
  loadFullSession: (sessionId: string) => Promise<ChatSession | null>;
}

// Local storage key for recent searches
const RECENT_SEARCHES_KEY = 'desainr_recent_searches';
const MAX_RECENT_SEARCHES = 5;

// Helper function to highlight search terms in text
const highlightSearchTerms = (text: string, searchQuery: string): React.ReactNode => {
  if (!searchQuery.trim()) return text;
  
  const terms = searchQuery.trim().toLowerCase().split(/\s+/).filter(term => term.length >= 2);
  if (terms.length === 0) return text;
  
  // Sort terms by length (longest first) to ensure proper highlighting
  const sortedTerms = [...terms].sort((a, b) => b.length - a.length);
  
  // Split text by terms and create an array of text and highlighted spans
  let parts: React.ReactNode[] = [text];
  
  sortedTerms.forEach((term, termIndex) => {
    parts = parts.flatMap<React.ReactNode>((part, partIndex) => {
      if (typeof part !== 'string') return [part];
      
      const splitParts = part.split(new RegExp(`(${term})`, 'gi'));
      return splitParts.map((subPart, i) => {
        const isMatch = i % 2 === 1; // Every odd index is a match
        // Create a unique key using termIndex, partIndex, and i
        const key = `${termIndex}-${partIndex}-${i}`;
        return isMatch ? (
          <mark 
            key={key} 
            className="search-highlight" 
            data-search-highlight
          >
            {subPart}
          </mark>
        ) : subPart;
      });
    });
  });
  
  return <>{parts}</>;
};

interface SearchResult {
  sessionId: string;
  sessionName: string;
  lastMessageTimestamp: number;
  messageCount: number;
  matchType: 'name' | 'content';
  matchText: string;
  matchContext?: string;
}

export function ChatSearchDialog({ 
  isOpen, 
  onClose, 
  sessions, 
  onSelectSession,
  loadFullSession 
}: ChatSearchDialogProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [showRecentSearches, setShowRecentSearches] = useState(false);
  const debouncedSearchQuery = useDebounce(searchQuery, 300);
  const searchInputRef = useRef<HTMLInputElement>(null);
  
  // Load recent searches from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const savedSearches = localStorage.getItem(RECENT_SEARCHES_KEY);
        if (savedSearches) {
          setRecentSearches(JSON.parse(savedSearches));
        }
      } catch (error) {
        console.error('Error loading recent searches:', error);
      }
    }
  }, []);
  
  // Save a search query to recent searches
  const saveToRecentSearches = (query: string) => {
    if (!query.trim()) return;
    
    setRecentSearches(prev => {
      // Remove the query if it already exists (to move it to the top)
      const filtered = prev.filter(item => item !== query);
      // Add the new query to the beginning
      const updated = [query, ...filtered].slice(0, MAX_RECENT_SEARCHES);
      
      // Save to localStorage
      try {
        localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
      } catch (error) {
        console.error('Error saving recent searches:', error);
      }
      
      return updated;
    });
  };
  
  // Focus search input when dialog opens
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);
    }
    
    // Show recent searches when dialog opens with empty search
    if (isOpen && !searchQuery) {
      setShowRecentSearches(true);
    } else {
      setShowRecentSearches(false);
    }
  }, [isOpen, searchQuery]);
  
  // Perform search when query changes
  useEffect(() => {
    const performSearch = async () => {
      if (!debouncedSearchQuery.trim()) {
        setSearchResults([]);
        setShowRecentSearches(true);
        return;
      }
      
      setIsSearching(true);
      setShowRecentSearches(false);
      
      try {
        // First search through session names (quick search)
        const nameResults: SearchResult[] = sessions
          .filter(session => 
            session.name.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
            session.preview.toLowerCase().includes(debouncedSearchQuery.toLowerCase())
          )
          .map(session => ({
            sessionId: session.id,
            sessionName: session.name,
            lastMessageTimestamp: session.lastMessageTimestamp,
            messageCount: session.messageCount,
            matchType: 'name',
            matchText: session.name.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) 
              ? session.name 
              : session.preview
          }));
        
        // Then search through message content (more intensive)
        const contentResults: SearchResult[] = [];
        
        // Limit the number of sessions to search through to avoid performance issues
        const sessionsToSearch = sessions
          .filter(session => !nameResults.some(r => r.sessionId === session.id))
          .sort((a, b) => b.lastMessageTimestamp - a.lastMessageTimestamp)
          .slice(0, 20); // Only search through the 20 most recent sessions
        
        for (const session of sessionsToSearch) {
          const fullSession = await loadFullSession(session.id);
          
          if (fullSession && fullSession.messages) {
            // Search through message content
            for (const message of fullSession.messages) {
              let messageText = '';
              
              if (typeof message.content === 'string') {
                messageText = message.content;
              } else if (Array.isArray(message.content)) {
                messageText = message.content
                  .filter(part => part.type === 'text')
                  .map(part => part.text)
                  .join(' ');
              }
              
              if (messageText.toLowerCase().includes(debouncedSearchQuery.toLowerCase())) {
                // Find the context around the match
                const lowerCaseText = messageText.toLowerCase();
                const matchIndex = lowerCaseText.indexOf(debouncedSearchQuery.toLowerCase());
                
                // Extract context (100 chars before and after the match)
                const contextStart = Math.max(0, matchIndex - 100);
                const contextEnd = Math.min(messageText.length, matchIndex + debouncedSearchQuery.length + 100);
                let matchContext = messageText.substring(contextStart, contextEnd);
                
                // Add ellipsis if we're not at the beginning or end
                if (contextStart > 0) matchContext = '...' + matchContext;
                if (contextEnd < messageText.length) matchContext = matchContext + '...';
                
                contentResults.push({
                  sessionId: session.id,
                  sessionName: session.name,
                  lastMessageTimestamp: session.lastMessageTimestamp,
                  messageCount: session.messageCount,
                  matchType: 'content',
                  matchText: messageText.substring(
                    matchIndex,
                    matchIndex + debouncedSearchQuery.length
                  ),
                  matchContext
                });
                
                // Only include the first match from each session to avoid duplicates
                break;
              }
            }
          }
        }
        
        // Combine and sort results
        const combinedResults = [...nameResults, ...contentResults]
          .sort((a, b) => b.lastMessageTimestamp - a.lastMessageTimestamp);
        
        setSearchResults(combinedResults);
      } catch (error) {
        console.error('Error performing search:', error);
      } finally {
        setIsSearching(false);
      }
    };
    
    performSearch();
  }, [debouncedSearchQuery, sessions, loadFullSession]);
  
  const handleResultClick = (sessionId: string) => {
    // Save the search query to recent searches
    if (searchQuery.trim()) {
      saveToRecentSearches(searchQuery.trim());
    }
    
    // Pass both the session ID and search query to the parent component
    onSelectSession(sessionId, searchQuery);
    
    // Create a more visible effect by dispatching a custom event with additional parameters
    const event = new CustomEvent('highlight-search-terms', {
      detail: { 
        searchQuery: searchQuery.trim(),
        sessionId: sessionId,
        timestamp: Date.now(),
        effect: 'zoom-highlight' // Special effect to apply
      }
    });
    window.dispatchEvent(event);
    
    onClose();
  };
  
  const handleRecentSearchClick = (query: string) => {
    setSearchQuery(query);
    setShowRecentSearches(false);
  };
  
  // Handle escape key press
  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    
    window.addEventListener('keydown', handleEscapeKey);
    return () => window.removeEventListener('keydown', handleEscapeKey);
  }, [isOpen, onClose]);
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        className="sm:max-w-md md:max-w-lg lg:max-w-xl glass-panel backdrop-blur-xl border border-primary/10 shadow-xl rounded-xl animate-fade-in"
        style={{ 
          maxHeight: 'calc(100vh - 100px)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 rounded-xl opacity-30 pointer-events-none"></div>
        
        <DialogHeader className="relative z-10">
          <DialogTitle className="text-xl font-bold text-primary dark:bg-clip-text dark:text-transparent dark:bg-gradient-to-r dark:from-primary dark:to-secondary flex items-center">
            <Search className="h-5 w-5 mr-2" />
            Search Chat History
          </DialogTitle>
        </DialogHeader>
        
        <div className="relative mt-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              ref={searchInputRef}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for chats or messages..."
              className="pl-9 pr-9 rounded-md focus-visible:ring-1 focus-visible:ring-primary shadow-sm"
            />
            {searchQuery && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-1 top-1/2 h-6 w-6 -translate-y-1/2 transition-all duration-200 rounded-full"
                onClick={() => setSearchQuery("")}
              >
                <X className="h-3 w-3" />
              </Button>
            )}
          </div>
          
          {/* Recent searches */}
          {showRecentSearches && recentSearches.length > 0 && (
            <div className="absolute z-10 w-full mt-1 bg-background/95 backdrop-blur-md border border-border/50 rounded-md shadow-lg animate-in fade-in-50 slide-in-from-top-2 duration-200">
              <div className="p-2">
                <div className="flex items-center text-xs text-muted-foreground mb-2">
                  <Clock className="h-3 w-3 mr-1" />
                  <span>Recent Searches</span>
                </div>
                <div className="space-y-1">
                  {recentSearches.map((query, index) => (
                    <div
                      key={`recent-${index}`}
                      className="flex items-center px-2 py-1.5 rounded-md hover:bg-muted/50 cursor-pointer transition-colors"
                      onClick={() => handleRecentSearchClick(query)}
                    >
                      <History className="h-3.5 w-3.5 mr-2 text-muted-foreground" />
                      <span className="text-sm">{query}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
        
        <div className="mt-4 flex-1 overflow-hidden">
          {isSearching ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
              <span className="ml-2 text-sm text-muted-foreground">Searching...</span>
            </div>
          ) : searchResults.length > 0 ? (
            <ScrollArea className="h-[400px]">
              <div className="space-y-2 pr-4">
                {searchResults.map((result, index) => (
                  <div
                    key={`${result.sessionId}-${index}`}
                    className="glass-panel p-3 rounded-lg border border-primary/10 hover:border-primary/30 cursor-pointer transition-all duration-200 hover:shadow-md"
                    onClick={() => handleResultClick(result.sessionId)}
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium text-sm">
                        {highlightSearchTerms(result.sessionName, debouncedSearchQuery)}
                      </h3>
                      <span className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(result.lastMessageTimestamp), { addSuffix: true })}
                      </span>
                    </div>
                    
                    {result.matchType === 'content' && result.matchContext && (
                      <div className="mt-2 text-sm bg-primary/5 border border-primary/10 p-2 rounded">
                        {highlightSearchTerms(result.matchContext, debouncedSearchQuery)}
                      </div>
                    )}
                    
                    <div className="mt-2 flex items-center justify-between">
                      <div className="flex items-center text-xs text-muted-foreground">
                        <MessageSquare className="h-3 w-3 mr-1" />
                        <span>{result.messageCount} messages</span>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-6 text-xs text-primary hover:text-primary hover:bg-primary/10"
                      >
                        <span>Open</span>
                        <ArrowRight className="h-3 w-3 ml-1" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          ) : searchQuery.trim() ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No results found</p>
              <p className="text-xs text-muted-foreground mt-1">Try a different search term</p>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Enter a search term to find chats</p>
              <p className="text-xs text-muted-foreground mt-1">Search by chat name or message content</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
} 