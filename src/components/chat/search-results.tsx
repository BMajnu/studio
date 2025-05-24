import React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface SearchResultItem {
  title: string;
  snippet: string;
  link: string;
}

interface SearchResultsProps {
  results: SearchResultItem[];
  isLoading: boolean;
  error?: string;
}

export function SearchResults({ results, isLoading, error }: SearchResultsProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-6">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-center text-sm text-destructive">
        <p>{error}</p>
      </div>
    );
  }

  if (results.length === 0) {
    return null;
  }

  return (
    <div className="space-y-3 p-2">
      {results.map((result, index) => (
        <div 
          key={index} 
          className="glass-panel p-3 rounded-lg border border-primary/10 shadow-sm hover:shadow-md transition-all duration-300"
        >
          <a 
            href={result.link} 
            target="_blank" 
            rel="noopener noreferrer"
            className="block"
          >
            <h3 className="text-sm font-medium text-primary truncate">{result.title}</h3>
            <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{result.snippet}</p>
            <p className="text-xs text-primary/60 mt-1 truncate">{result.link}</p>
          </a>
        </div>
      ))}
    </div>
  );
} 