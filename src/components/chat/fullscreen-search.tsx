'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ImageResults } from './image-results';
import { searchService, SearchResultItem, ImageSearchResultItem } from '@/lib/services/search-service';
import { useDebounce } from '@/lib/hooks/use-debounce';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, X, ExternalLink, Sparkles, FileText, Image as ImageIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

// Add helper functions below imports
const highlightQuery = (text: string, query: string, originalQuery?: string): string => {
  if (!query.trim()) return text;
  
  // Create a set of terms to highlight from both queries
  const terms = new Set<string>();
  
  // Process the main query
  query.trim().toLowerCase().split(/\s+/).forEach(word => {
    if (word.length >= 2) terms.add(word);
  });
  
  // Process the original query if provided
  if (originalQuery) {
    originalQuery.trim().toLowerCase().split(/\s+/).forEach(word => {
      if (word.length >= 2) terms.add(word);
    });
  }
  
  // Sort terms by length (longest first) to ensure proper highlighting of phrases
  const sortedTerms = Array.from(terms).sort((a, b) => b.length - a.length);
  
  let result = text;
  
  // Apply highlighting for each term
  sortedTerms.forEach(term => {
    // Escape special regex characters
    const escapedTerm = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(${escapedTerm})`, 'gi');
    result = result.replace(regex, '<mark class="bg-yellow-200 dark:bg-yellow-800/50 px-0.5 rounded">$1</mark>');
  });
  
  return result;
};

const formatUrl = (url: string): string => {
  try {
    const urlObj = new URL(url);
    let domain = urlObj.hostname.replace(/^www\./, '');
    let path = urlObj.pathname;
    
    // Truncate path if too long
    if (path.length > 25) {
      path = path.substring(0, 22) + '...';
    }
    
    return `${domain}${path}`;
  } catch (e) {
    // If URL parsing fails, return the original
    return url.length > 50 ? url.substring(0, 47) + '...' : url;
  }
};

// Add this function to handle special cases for certain websites
const getModifiedUrlForPreview = (url: string): string => {
  try {
    const urlObj = new URL(url);
    const hostname = urlObj.hostname.toLowerCase();
    
    // For YouTube, use the embed URL
    if (hostname.includes('youtube.com') || hostname.includes('youtu.be')) {
      let videoId = '';
      if (hostname.includes('youtube.com')) {
        videoId = urlObj.searchParams.get('v') || '';
      } else if (hostname.includes('youtu.be')) {
        videoId = urlObj.pathname.substring(1);
      }
      
      if (videoId) {
        return `https://www.youtube.com/embed/${videoId}`;
      }
    }
    
    // For Pinterest, use the embed URL
    if (hostname.includes('pinterest.com')) {
      return `https://www.pinterest.com/pin/${urlObj.pathname.split('/pin/')[1]}/embed/`;
    }
    
    // For Twitter/X, modify if it's a tweet
    if (hostname.includes('twitter.com') || hostname.includes('x.com')) {
      const pathParts = urlObj.pathname.split('/');
      if (pathParts.length >= 4 && pathParts[2] === 'status') {
        const tweetId = pathParts[3];
        return `https://platform.twitter.com/embed/Tweet.html?id=${tweetId}`;
      }
    }
    
    // For some sites, we can't effectively embed them, so we'll force the fallback view
    const nonEmbeddableDomains = [
      'instagram.com', 
      'facebook.com', 
      'linkedin.com',
      'reddit.com',
      'tiktok.com',
      'etsy.com',
      'amazon.com',
      'pinterest.com',
      'ebay.com',
      'canva.com',
      'shopify.com',
      'redbubble.com',
      'teespring.com',
      'spreadshirt.com',
      'teepublic.com',
      'printful.com',
      'customink.com',
      'zazzle.com'
    ];
    
    if (nonEmbeddableDomains.some(domain => hostname.includes(domain))) {
      // Return a URL that will definitely fail to load, triggering our fallback
      return 'about:blank#blocked';
    }
    
    // For all other URLs, return the original
    return url;
  } catch (e) {
    // If URL parsing fails, return the original
    return url;
  }
};

interface FullscreenSearchProps {
  isOpen: boolean;
  onClose: () => void;
  initialQuery?: string;
  onQueryChange?: (query: string) => void;
}

// Add this new component for a fallback text preview
const TextPreview = ({ result }: { result: SearchResultItem }) => {
  const [isIframeLoaded, setIsIframeLoaded] = useState(false);
  const [isIframeError, setIsIframeError] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  
  // Get the modified URL for preview
  const previewUrl = getModifiedUrlForPreview(result.link);
  
  // Check if this is a URL that we've intentionally blocked
  const isIntentionallyBlocked = previewUrl === 'about:blank#blocked';
  
  // Set iframe error state immediately if the URL is intentionally blocked
  useEffect(() => {
    if (isIntentionallyBlocked) {
      setIsIframeError(true);
    } else {
      // Set a timeout to show fallback content if iframe takes too long to load
      timerRef.current = setTimeout(() => {
        if (!isIframeLoaded && !isIframeError) {
          console.log('Preview timeout - showing fallback');
          setIsIframeError(true);
        }
      }, 5000); // 5 second timeout
    }
    
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [isIntentionallyBlocked, isIframeLoaded, isIframeError]);
  
  // Handle iframe load success
  const handleIframeLoad = useCallback(() => {
    setIsIframeLoaded(true);
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    
    // Sometimes iframes "load" but with an error page inside
    // This additional check helps detect those cases
    setTimeout(() => {
      try {
        if (iframeRef.current) {
          // Try to check iframe content - this will throw if cross-origin
          // But a successful load should mean we have access
          const iframeDoc = iframeRef.current.contentDocument;
          if (!iframeDoc || !iframeDoc.body || iframeDoc.body.innerHTML === '') {
            setIsIframeError(true);
          }
        }
      } catch (error) {
        // Cross-origin error means the iframe loaded but can't be accessed
        // In this case, we'll let it display anyway because this is expected
        // for successful third-party embeds
        console.log('Cross-origin iframe access prevented (normal for third-party sites)');
      }
    }, 500);
  }, []);
  
  // Handle iframe load error
  const handleIframeError = useCallback(() => {
    setIsIframeError(true);
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
  }, []);
  
  return (
    <div className="h-full flex flex-col">
      <div className="mb-2 flex items-center justify-between">
        <h2 className="text-lg font-medium text-gradient">{result.title}</h2>
        <a 
          href={result.link} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="flex items-center gap-1 text-sm text-primary hover:underline"
        >
          <span>Open</span>
          <ExternalLink size={14} />
        </a>
      </div>
      <div className="flex-1 overflow-hidden relative">
        {isIframeError ? (
          <div className="absolute inset-0 glass-panel rounded-lg border border-primary/10 p-6 overflow-auto">
            <div className="bg-primary/5 p-4 rounded-lg mb-4">
              <p className="text-sm text-muted-foreground">
                {isIntentionallyBlocked 
                  ? "This website doesn't support embedding in search previews" 
                  : "Preview unavailable - showing snippet only"}
              </p>
              <div className="text-sm text-foreground mt-2 italic">
                {formatUrl(result.link)}
              </div>
            </div>
            
            <h3 className="text-xl font-medium mb-3">{result.title}</h3>
            
            <div className="prose prose-sm dark:prose-invert max-w-none">
              <p className="text-foreground/90 whitespace-pre-line">{result.snippet}</p>
            </div>
            
            <div className="mt-6 bg-muted/30 p-4 rounded-lg">
              <p className="text-sm text-muted-foreground">Click the "Open" button to visit this website directly.</p>
              <a 
                href={result.link} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="mt-3 inline-flex items-center gap-1 px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm"
              >
                Open in new tab <ExternalLink size={14} className="ml-1" />
              </a>
            </div>
          </div>
        ) : (
          <div className="absolute inset-0 glass-panel rounded-lg border border-primary/10">
            <iframe 
              ref={iframeRef}
              src={previewUrl}
              title={result.title}
              className="w-full h-full"
              sandbox="allow-scripts allow-same-origin allow-forms"
              referrerPolicy="no-referrer"
              loading="eager"
              onLoad={handleIframeLoad}
              onError={handleIframeError}
            />
            
            {!isIframeLoaded && (
              <div className="absolute inset-0 flex items-center justify-center bg-card/80 backdrop-blur-sm">
                <div className="flex flex-col items-center">
                  <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
                  <p className="text-sm text-muted-foreground">Loading preview...</p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export function FullscreenSearch({ isOpen, onClose, initialQuery = '', onQueryChange }: FullscreenSearchProps) {
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [refinedQuery, setRefinedQuery] = useState<string | null>(null);
  const [wasQueryRefined, setWasQueryRefined] = useState(false);
  const [textResults, setTextResults] = useState<SearchResultItem[]>([]);
  const [imageResults, setImageResults] = useState<ImageSearchResultItem[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isRefining, setIsRefining] = useState(false);
  const [selectedResult, setSelectedResult] = useState<SearchResultItem | null>(null);
  const [activeTab, setActiveTab] = useState<string>("text");
  const [error, setError] = useState<string | undefined>();
  const searchInputRef = useRef<HTMLInputElement>(null);
  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  // Focus search input when overlay is opened
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  // Handle search when query changes
  useEffect(() => {
    if (debouncedSearchQuery) {
      performSearch(debouncedSearchQuery);
    } else {
      setTextResults([]);
      setImageResults([]);
      setSelectedResult(null);
      setRefinedQuery(null);
      setWasQueryRefined(false);
    }
  }, [debouncedSearchQuery]);

  // Update local state when initialQuery changes from parent
  useEffect(() => {
    if (isOpen) {
      setSearchQuery(initialQuery);
    }
  }, [initialQuery, isOpen]);

  // Handle search query changes
  const handleSearchQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = e.target.value;
    setSearchQuery(newQuery);
    if (onQueryChange) {
      onQueryChange(newQuery);
    }
  };

  // Perform the search
  const performSearch = async (query: string) => {
    if (!query.trim()) return;
    
    try {
      setIsSearching(true);
      setIsRefining(true);
      setError(undefined);
      
      // Get complete search results with both text and images
      const { textResults, imageResults, refinedQuery, wasRefined } = 
        await searchService.completeSearch(query);
      
      // Update state with results and refined query
      setTextResults(textResults);
      setImageResults(imageResults);
      setRefinedQuery(refinedQuery);
      setWasQueryRefined(wasRefined);
      
      // Automatically select the first result
      if (textResults.length > 0) {
        if (!selectedResult || !textResults.some(r => r.link === selectedResult.link)) {
          setSelectedResult(textResults[0]);
        }
      } else {
        setSelectedResult(null);
      }
      
      // Auto-switch to image tab if no text results but image results exist
      if (textResults.length === 0 && imageResults.length > 0) {
        setActiveTab("images");
      }
      
    } catch (error) {
      console.error('Search failed:', error);
      setError('Failed to load search results. Please try again.');
    } finally {
      setIsSearching(false);
      setIsRefining(false);
    }
  };

  // Handle result selection
  const handleResultSelect = (result: SearchResultItem) => {
    setSelectedResult(result);
  };

  // Handle escape key press to close the overlay
  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleEscapeKey);
    return () => window.removeEventListener('keydown', handleEscapeKey);
  }, [isOpen, onClose]);

  // Helper to display search tips
  const renderSearchTips = () => {
    if ((textResults.length === 0 && imageResults.length === 0) && !isSearching && searchQuery) {
      return (
        <div className="mt-4 p-4 bg-muted/30 rounded-lg">
          <h3 className="text-sm font-medium mb-2">Search Tips:</h3>
          <ul className="text-xs text-muted-foreground space-y-1">
            <li>• Try using more specific keywords</li>
            <li>• Check for spelling errors</li>
            <li>• Use fewer but more relevant words</li>
            <li>• Try alternative terms for your search</li>
          </ul>
        </div>
      );
    }
    return null;
  };

  // Count total combined results
  const totalResults = textResults.length + imageResults.length;

  if (!isOpen) return null;

  return (
    <div 
      className={cn(
        "fixed inset-0 z-50 bg-background/95 backdrop-blur-md flex flex-col",
        isOpen ? "animate-in fade-in slide-in-from-top-2 duration-300" : "animate-out fade-out slide-out-to-top-2 duration-200"
      )}
    >
      {/* Header with search input and close button */}
      <div className="border-b p-4 flex items-center gap-2 animate-in slide-in-from-top-4 duration-300 delay-100">
        <div className="relative flex-1">
          <Input
            ref={searchInputRef}
            value={searchQuery}
            onChange={handleSearchQueryChange}
            className="w-full rounded-lg border-primary/20 focus-visible:ring-1 focus-visible:ring-primary glass-panel py-6 pl-4 pr-10 text-lg shadow-lg transition-all duration-300"
            placeholder="Search the web..."
            autoFocus
          />
          {isRefining ? (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center">
              <Sparkles className="h-5 w-5 text-primary/70 animate-pulse mr-1" />
              <Loader2 className="h-5 w-5 animate-spin text-primary" />
            </div>
          ) : isSearching ? (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <Loader2 className="h-5 w-5 animate-spin text-primary" />
            </div>
          ) : null}
        </div>
        <Button
          variant="ghost" 
          size="icon"
          onClick={onClose}
          className="h-10 w-10 rounded-full hover:bg-destructive/10 hover:text-destructive transition-colors"
        >
          <X className="h-5 w-5" />
        </Button>
      </div>

      {/* Refined query display */}
      {refinedQuery && wasQueryRefined && (
        <div className="px-4 py-2 bg-primary/5 border-b flex items-center animate-in fade-in-50 duration-300">
          <Sparkles size={16} className="text-primary mr-2" />
          <span className="text-sm text-muted-foreground">
            Showing results for: <span className="font-medium text-primary">{refinedQuery}</span>
          </span>
          <Button
            variant="link"
            size="sm"
            className="text-xs ml-auto"
            onClick={() => {
              // Search with exactly the original query and disable refinement
              setRefinedQuery(searchQuery);
              setWasQueryRefined(false);
              performSearch(searchQuery);
            }}
          >
            Use original query
          </Button>
        </div>
      )}

      {/* Results count badge */}
      {!isSearching && totalResults > 0 && (
        <div className="px-4 py-2 border-b">
          <span className="text-xs text-muted-foreground">
            Found {totalResults} result{totalResults !== 1 ? 's' : ''} for{' '}
            <span className="font-medium text-primary">
              {wasQueryRefined ? refinedQuery : searchQuery}
            </span>
          </span>
        </div>
      )}

      {/* Main content area with results and preview */}
      <div className="flex flex-1 overflow-hidden animate-in fade-in-50 duration-500 delay-200">
        {/* Search results column with tabs */}
        <div className={cn(
          "overflow-hidden flex flex-col",
          activeTab === "images" ? "w-full" : "w-full lg:w-1/2"
        )}>
          <Tabs
            defaultValue="text"
            value={activeTab}
            onValueChange={setActiveTab}
            className="flex-1 flex flex-col"
          >
            <div className="border-b px-4">
              <TabsList className="h-14">
                <TabsTrigger
                  value="text"
                  className="flex items-center gap-2 data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none"
                >
                  <FileText size={16} />
                  <span>Text Results</span>
                  {textResults.length > 0 && (
                    <span className="ml-1 text-xs bg-muted rounded-full px-2 py-0.5">
                      {textResults.length}
                    </span>
                  )}
                </TabsTrigger>
                <TabsTrigger
                  value="images"
                  className="flex items-center gap-2 data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none"
                >
                  <ImageIcon size={16} />
                  <span>Images</span>
                  {imageResults.length > 0 && (
                    <span className="ml-1 text-xs bg-muted rounded-full px-2 py-0.5">
                      {imageResults.length}
                    </span>
                  )}
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="text" className="flex-1 overflow-y-auto p-4">
              {error ? (
                <div className="p-4 text-center text-destructive bg-destructive/10 rounded-lg">
                  {error}
                </div>
              ) : textResults.length === 0 && !isSearching && searchQuery ? (
                <div className="p-4 text-center text-muted-foreground">
                  No text results found. Try a different search term or check the Images tab.
                </div>
              ) : (
                <div className="space-y-3">
                  {textResults.map((result, index) => (
                    <div 
                      key={index} 
                      className={cn(
                        "glass-panel p-4 rounded-lg border cursor-pointer transition-all duration-200",
                        selectedResult === result 
                          ? "border-primary/50 shadow-md bg-primary/5" 
                          : "border-primary/10 shadow-sm hover:shadow-md hover:border-primary/30"
                      )}
                      onClick={() => handleResultSelect(result)}
                    >
                      <div className="flex items-center">
                        <h3 className="text-base font-medium text-primary mr-2"
                            dangerouslySetInnerHTML={{ __html: highlightQuery(result.title, refinedQuery || searchQuery, searchQuery) }}></h3>
                        <a 
                          href={result.link}
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-primary/60 hover:text-primary transition-colors ml-auto flex-shrink-0"
                          onClick={(e) => {
                            e.stopPropagation();
                          }}
                        >
                          <ExternalLink size={14} />
                        </a>
                      </div>
                      
                      <p className="text-sm text-muted-foreground mt-1 line-clamp-3 leading-relaxed"
                         dangerouslySetInnerHTML={{ __html: highlightQuery(result.snippet, refinedQuery || searchQuery, searchQuery) }}></p>
                         
                      <div className="flex items-center mt-2 text-xs text-primary/40">
                        <span className="truncate max-w-full">{formatUrl(result.link)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {renderSearchTips()}
            </TabsContent>

            <TabsContent value="images" className="flex-1 overflow-y-auto p-4">
              <ImageResults 
                results={imageResults} 
                searchQuery={refinedQuery || searchQuery} 
              />
            </TabsContent>
          </Tabs>
        </div>

        {/* Preview pane (only on larger screens and only for text results) */}
        {activeTab === "text" && (
          <div className="hidden lg:block w-1/2 border-l p-4 overflow-hidden">
            {selectedResult ? (
              <TextPreview result={selectedResult} />
            ) : (
              <div className="h-full flex items-center justify-center text-muted-foreground flex-col gap-2">
                <FileText size={40} className="opacity-20" />
                <p>Select a search result to preview</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
} 