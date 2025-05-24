import { NextRequest, NextResponse } from 'next/server';

export interface ImageSearchResult {
  id: string;
  url: string;
  thumbnail: string;
  title: string;
  width: number;
  height: number;
  source: string;
}

/**
 * API handler for image search requests
 * This returns relevant images based on search queries from Google
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get('q');

    if (!query) {
      return NextResponse.json({ error: 'Query parameter is required' }, { status: 400 });
    }

    // Get image search results
    const images = await tryMultipleImageSearchMethods(query);
    
    return NextResponse.json({ images });
  } catch (error) {
    console.error('Image search API error:', error);
    return NextResponse.json({ error: 'Failed to perform image search' }, { status: 500 });
  }
}

/**
 * Try multiple search methods to get the best image results
 */
async function tryMultipleImageSearchMethods(query: string): Promise<ImageSearchResult[]> {
  let allResults: ImageSearchResult[] = [];
  
  // Try Google Images first
  try {
    const googleResults = await tryGoogleImageSearch(query);
    if (googleResults && googleResults.length > 0) {
      allResults = [...allResults, ...googleResults];
    }
  } catch (error) {
    console.error('Google image search failed:', error);
  }
  
  // If we have results from Google API, return them
  if (allResults.length > 0) {
    return allResults;
  }
  
  // Fallback to simulated results if API fails
  return getSimulatedImageResults(query);
}

/**
 * Try image search using Google Custom Search API
 */
async function tryGoogleImageSearch(query: string): Promise<ImageSearchResult[]> {
  try {
    // Google Custom Search API requires an API key and CX (custom search engine ID)
    const apiKey = process.env.GOOGLE_SEARCH_API_KEY;
    const cx = process.env.GOOGLE_SEARCH_CX;
    
    if (!apiKey || !cx) {
      throw new Error('Google Search API key or CX not configured');
    }
    
    const encodedQuery = encodeURIComponent(query);
    const url = `https://www.googleapis.com/customsearch/v1?key=${apiKey}&cx=${cx}&q=${encodedQuery}&searchType=image`;
    
    const response = await fetch(url, { 
      headers: { 'Accept': 'application/json' },
      next: { revalidate: 3600 } // Cache for 1 hour
    });
    
    if (!response.ok) {
      throw new Error(`Google API returned ${response.status}`);
    }
    
    const data = await response.json();
    const results: ImageSearchResult[] = [];
    
    if (data.items && Array.isArray(data.items)) {
      data.items.forEach((item: any, index: number) => {
        results.push({
          id: `google-${index}-${Date.now()}`,
          url: item.link || '',
          thumbnail: item.image?.thumbnailLink || item.link || '',
          title: item.title || 'Image result',
          width: item.image?.width || 300,
          height: item.image?.height || 200,
          source: 'Google'
        });
      });
    }
    
    return results;
  } catch (error) {
    console.error('Google image search error:', error);
    return [];
  }
}

/**
 * Get simulated image results for the given query
 * Used as fallback when API requests fail
 */
function getSimulatedImageResults(query: string): ImageSearchResult[] {
  const cleanQuery = query.toLowerCase().trim();
  
  // T-shirt design images
  if (cleanQuery.includes('shirt') || cleanQuery.includes('t-shirt') || cleanQuery.includes('tee') || 
      cleanQuery.includes('apparel') || cleanQuery.includes('clothing')) {
    return [
      {
        id: 'tshirt-1',
        url: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?q=80&w=300',
        thumbnail: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?q=80&w=300',
        title: 'White t-shirt mockup',
        width: 300,
        height: 200,
        source: 'Unsplash'
      },
      {
        id: 'tshirt-2',
        url: 'https://images.unsplash.com/photo-1562157873-818bc0726f68?q=80&w=300',
        thumbnail: 'https://images.unsplash.com/photo-1562157873-818bc0726f68?q=80&w=300',
        title: 'Black t-shirt design',
        width: 300,
        height: 200,
        source: 'Unsplash'
      },
      {
        id: 'tshirt-3',
        url: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?q=80&w=300',
        thumbnail: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?q=80&w=300',
        title: 'Printed t-shirt collection',
        width: 300,
        height: 200, 
        source: 'Unsplash'
      },
      {
        id: 'tshirt-4',
        url: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?q=80&w=300',
        thumbnail: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?q=80&w=300',
        title: 'Custom t-shirt print',
        width: 300,
        height: 200,
        source: 'Unsplash'
      },
      {
        id: 'tshirt-5',
        url: 'https://images.unsplash.com/photo-1529374255404-311a2a4f1fd0?q=80&w=300',
        thumbnail: 'https://images.unsplash.com/photo-1529374255404-311a2a4f1fd0?q=80&w=300',
        title: 'Vintage t-shirt design',
        width: 300,
        height: 200,
        source: 'Unsplash'
      }
    ];
  }
  
  // Design and graphic design images
  if (cleanQuery.includes('design') || cleanQuery.includes('graphic') || cleanQuery.includes('logo')) {
    return [
      {
        id: 'design-1',
        url: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?q=80&w=300',
        thumbnail: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?q=80&w=300',
        title: 'Graphic design workspace',
        width: 300,
        height: 200,
        source: 'Unsplash'
      },
      {
        id: 'design-2',
        url: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?q=80&w=300',
        thumbnail: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?q=80&w=300',
        title: 'Creative design elements',
        width: 300,
        height: 200,
        source: 'Unsplash'
      },
      {
        id: 'design-3',
        url: 'https://images.unsplash.com/photo-1572044162444-ad60f128bdea?q=80&w=300',
        thumbnail: 'https://images.unsplash.com/photo-1572044162444-ad60f128bdea?q=80&w=300',
        title: 'Logo design sketch',
        width: 300,
        height: 200,
        source: 'Unsplash'
      },
      {
        id: 'design-4',
        url: 'https://images.unsplash.com/photo-1558655146-9f40138edfeb?q=80&w=300',
        thumbnail: 'https://images.unsplash.com/photo-1558655146-9f40138edfeb?q=80&w=300',
        title: 'Design tools and patterns',
        width: 300,
        height: 200,
        source: 'Unsplash'
      }
    ];
  }
  
  // Templates and patterns
  if (cleanQuery.includes('template') || cleanQuery.includes('pattern')) {
    return [
      {
        id: 'template-1',
        url: 'https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?q=80&w=300',
        thumbnail: 'https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?q=80&w=300',
        title: 'Design templates collection',
        width: 300,
        height: 200,
        source: 'Unsplash'
      },
      {
        id: 'template-2',
        url: 'https://images.unsplash.com/photo-1618004912476-29818d81ae2e?q=80&w=300',
        thumbnail: 'https://images.unsplash.com/photo-1618004912476-29818d81ae2e?q=80&w=300',
        title: 'Abstract pattern design',
        width: 300,
        height: 200,
        source: 'Unsplash'
      },
      {
        id: 'template-3',
        url: 'https://images.unsplash.com/photo-1595344436903-fafb119d2973?q=80&w=300',
        thumbnail: 'https://images.unsplash.com/photo-1595344436903-fafb119d2973?q=80&w=300',
        title: 'Geometric patterns',
        width: 300,
        height: 200,
        source: 'Unsplash'
      }
    ];
  }
  
  // If no specific category matched, return generic design-related images
  return [
    {
      id: 'generic-1',
      url: 'https://images.unsplash.com/photo-1493723843671-1d655e66ac1c?q=80&w=300',
      thumbnail: 'https://images.unsplash.com/photo-1493723843671-1d655e66ac1c?q=80&w=300',
      title: 'Creative workspace',
      width: 300,
      height: 200,
      source: 'Unsplash'
    },
    {
      id: 'generic-2',
      url: 'https://images.unsplash.com/photo-1606636660801-c61b8e97a8b7?q=80&w=300',
      thumbnail: 'https://images.unsplash.com/photo-1606636660801-c61b8e97a8b7?q=80&w=300',
      title: 'Design inspiration',
      width: 300,
      height: 200,
      source: 'Unsplash'
    },
    {
      id: 'generic-3',
      url: 'https://images.unsplash.com/photo-1535016120720-40c646be5580?q=80&w=300',
      thumbnail: 'https://images.unsplash.com/photo-1535016120720-40c646be5580?q=80&w=300',
      title: 'Digital art and design',
      width: 300, 
      height: 200,
      source: 'Unsplash'
    }
  ];
} 