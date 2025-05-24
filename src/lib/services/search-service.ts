import { fetchWithTimeout } from '@/lib/utils';

/**
 * Interface for DuckDuckGo search results
 */
export interface DDGSearchResult {
  Abstract: string;
  AbstractSource: string;
  AbstractURL: string;
  AbstractText: string;
  Answer: string;
  AnswerType: string;
  Definition: string;
  DefinitionSource: string;
  DefinitionURL: string;
  Entity: string;
  Heading: string;
  Image: string;
  ImageWidth: number;
  ImageHeight: number;
  Infobox: any;
  Redirect: string;
  RelatedTopics: Array<{
    Result?: string;
    FirstURL?: string;
    Icon?: { URL: string; Height: string; Width: string };
    Text?: string;
    Topics?: any[];
    Name?: string;
  }>;
  Results: Array<{
    Result: string;
    FirstURL: string;
    Icon: { URL: string; Height: string; Width: string };
    Text: string;
  }>;
  Type: string;
  meta: any;
}

/**
 * Interface for search results
 */
export interface SearchResultItem {
  title: string;
  snippet: string;
  link: string;
}

/**
 * Image search result item
 */
export interface ImageSearchResultItem {
  id: string;
  url: string;
  thumbnail: string;
  title: string;
  width: number;
  height: number;
  source: string;
}

/**
 * Complete search result containing both text and images
 */
export interface CompleteSearchResult {
  textResults: SearchResultItem[];
  imageResults: ImageSearchResultItem[];
  refinedQuery: string;
  wasRefined: boolean;
}

export interface RefinedQueryResult {
  originalQuery: string;
  refinedQuery: string;
  wasRefined: boolean;
}

class SearchService {
  /**
   * Refines a search query using AI techniques to improve relevance
   */
  async refineQuery(query: string): Promise<RefinedQueryResult> {
    try {
      const response = await fetchWithTimeout('/api/refine-query', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query }),
        timeout: 5000, // 5 second timeout
      });

      if (!response.ok) {
        // If refinement fails, return original query
        console.error('Query refinement failed:', await response.text());
        return {
          originalQuery: query,
          refinedQuery: query,
          wasRefined: false
        };
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error refining query:', error);
      // Return original query as fallback
      return {
        originalQuery: query,
        refinedQuery: query,
        wasRefined: false
      };
    }
  }

  /**
   * Searches for text results with the given query
   */
  async search(query: string): Promise<SearchResultItem[]> {
    try {
      const response = await fetchWithTimeout(`/api/search?q=${encodeURIComponent(query)}`, {
        timeout: 15000, // 15 seconds timeout for search to allow for API calls
      });

      if (!response.ok) {
        throw new Error(`Search failed with status: ${response.status}`);
      }

      const data = await response.json();
      return data.results || [];
    } catch (error) {
      console.error('Search error:', error);
      throw new Error('Failed to perform search. Please try again.');
    }
  }

  /**
   * Searches for images with a given query
   */
  async searchImages(query: string): Promise<ImageSearchResultItem[]> {
    try {
      const response = await fetchWithTimeout(`/api/search/images?q=${encodeURIComponent(query)}`, {
        timeout: 15000, // 15 seconds timeout for image search due to external API calls
      });

      if (!response.ok) {
        throw new Error(`Image search failed with status: ${response.status}`);
      }

      const data = await response.json();
      return data.images || [];
    } catch (error) {
      console.error('Image search error:', error);
      return []; // Return empty array on error instead of throwing
    }
  }

  /**
   * Search with both original and refined query, and return combined results
   */
  async searchWithBoth(query: string): Promise<{ 
    results: SearchResultItem[], 
    refinedQuery: string, 
    wasRefined: boolean 
  }> {
    try {
      // Get the refined query
      const refinement = await this.refineQuery(query);
      const { refinedQuery, wasRefined } = refinement;
      
      // Use the refined query for search if available, otherwise fall back to original
      const actualQuery = (refinedQuery && wasRefined) ? refinedQuery : query;
      
      try {
        // Use the refined query for search
        const results = await this.search(actualQuery);
        
        return {
          results,
          refinedQuery: refinedQuery || query,
          wasRefined
        };
      } catch (searchError) {
        console.error('Error searching with refined query:', searchError);
        
        // If the refined query search fails but the query was refined,
        // try again with the original query
        if (wasRefined) {
          const fallbackResults = await this.search(query);
          return {
            results: fallbackResults,
            refinedQuery: query, // Use original query as fallback
            wasRefined: false
          };
        }
        
        // Re-throw if we can't recover
        throw searchError;
      }
    } catch (error) {
      console.error('Error in search with refinement:', error);
      
      // Last resort - try direct search with original query
      try {
        const directResults = await fetch(`/api/search?q=${encodeURIComponent(query)}`).then(r => r.json());
        return {
          results: directResults.results || [],
          refinedQuery: query,
          wasRefined: false
        };
      } catch {
        // Nothing worked, return empty results
        return {
          results: [],
          refinedQuery: query,
          wasRefined: false
        };
      }
    }
  }

  /**
   * Perform a complete search that includes both text and image results
   */
  async completeSearch(query: string): Promise<CompleteSearchResult> {
    // Get the refined query first
    const { refinedQuery, wasRefined } = await this.refineQuery(query);
    const actualQuery = refinedQuery || query;

    // Run text and image searches in parallel for better performance
    const [textResults, imageResults] = await Promise.all([
      this.search(actualQuery).catch(() => []),
      this.searchImages(actualQuery).catch(() => [])
    ]);

    return {
      textResults,
      imageResults,
      refinedQuery,
      wasRefined
    };
  }
}

export const searchService = new SearchService(); 