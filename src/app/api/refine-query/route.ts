import { NextRequest, NextResponse } from 'next/server';

/**
 * API endpoint to refine search queries using AI techniques
 * Optimizes terms for better search relevance, especially for design-related queries
 */
export async function POST(req: NextRequest) {
  try {
    const { query } = await req.json();
    
    if (!query || typeof query !== 'string') {
      return NextResponse.json({ error: 'Valid query parameter is required' }, { status: 400 });
    }

    const refinedQuery = await refineSearchQuery(query);
    
    return NextResponse.json({ 
      originalQuery: query,
      refinedQuery,
      wasRefined: query.toLowerCase() !== refinedQuery.toLowerCase()
    });
  } catch (error) {
    console.error('Query refinement error:', error);
    return NextResponse.json({ error: 'Failed to refine query' }, { status: 500 });
  }
}

/**
 * Refines a search query to improve relevance and quality
 * Currently uses a rule-based approach, but could be replaced with an actual AI service
 */
async function refineSearchQuery(query: string): Promise<string> {
  // Normalize the query
  let refinedQuery = query.trim();
  
  // Don't refine very short queries
  if (refinedQuery.length < 2) return refinedQuery;
  
  // Rule-based refinements for design-related terms
  
  // Common spelling corrections
  const spellingCorrections: Record<string, string> = {
    'tshirt': 't-shirt',
    'tee shirt': 't-shirt',
    'teeshirt': 't-shirt',
    'grafic': 'graphic',
    'grafics': 'graphics',
    'desine': 'design',
    'desings': 'designs',
    'colour': 'color',
    'colours': 'colors',
    'vektor': 'vector',
    'vektors': 'vectors',
    'templete': 'template',
    'templetes': 'templates',
    'patern': 'pattern',
    'paterns': 'patterns',
  };
  
  // Enhanced design term expansions
  const termExpansions: Record<string, string> = {
    'ui': 'user interface',
    'ux': 'user experience',
    'ui/ux': 'user interface and user experience',
    'ai': 'artificial intelligence',
    'ml': 'machine learning',
    '3d': 'three-dimensional',
    'rgb': 'red green blue color',
    'cmyk': 'cyan magenta yellow black print',
    'svg': 'scalable vector graphic',
    'png': 'png image',
    'jpg': 'jpeg image',
    'pdf': 'pdf document',
  };
  
  // Apply spelling corrections
  Object.entries(spellingCorrections).forEach(([incorrect, correct]) => {
    const regex = new RegExp(`\\b${incorrect}\\b`, 'gi');
    refinedQuery = refinedQuery.replace(regex, correct);
  });
  
  // Context-aware term expansions
  // Only expand terms if they appear as standalone words
  Object.entries(termExpansions).forEach(([term, expansion]) => {
    const regex = new RegExp(`\\b${term}\\b`, 'gi');
    
    // Only expand if it's a standalone term or part of a very short query
    if (regex.test(refinedQuery) && refinedQuery.split(/\s+/).length <= 2) {
      refinedQuery = refinedQuery.replace(regex, expansion);
    }
  });
  
  // Add design context for ambiguous queries
  if (!refinedQuery.toLowerCase().includes('design') && 
      !refinedQuery.toLowerCase().includes('template') && 
      !refinedQuery.toLowerCase().includes('graphic') &&
      refinedQuery.includes('shirt') || refinedQuery.includes('t-shirt')) {
    refinedQuery += ' design';
  }
  
  // Improve phrase structure for better results
  // Convert "how to" queries to more direct terms
  if (refinedQuery.toLowerCase().startsWith('how to')) {
    refinedQuery = refinedQuery.replace(/^how to\s+/i, '') + ' tutorial';
  }
  
  // Remove unnecessary filler words
  refinedQuery = refinedQuery.replace(/\b(the|a|an|to|for|of|on|in|at|by|with)\b/gi, ' ');
  
  // Clean up extra spaces
  refinedQuery = refinedQuery.replace(/\s+/g, ' ').trim();
  
  return refinedQuery;
} 