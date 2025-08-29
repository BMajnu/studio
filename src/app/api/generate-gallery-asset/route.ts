import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { AssetType, AssetGenerationRequest } from '@/lib/video/types';

// Initialize Gemini 2.0 Flash Preview
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY || '');
const model = genAI.getGenerativeModel({ 
  model: 'gemini-2.0-flash-exp',
  generationConfig: {
    temperature: 0.9,
    topK: 40,
    topP: 0.95,
    maxOutputTokens: 8192,
  }
});

// Asset generation prompts based on type
const getAssetPrompt = (type: AssetType, description: string, style?: string) => {
  const styleGuide = style ? `, ${style} style` : '';
  
  switch (type) {
    case 'character':
      return `Create a detailed visual description for a CHARACTER in a video/film${styleGuide}:
      
      Character Request: ${description}
      
      Provide a comprehensive character description including:
      1. Physical appearance (age, build, facial features, hair, clothing)
      2. Personality traits and mannerisms
      3. Distinctive visual characteristics
      4. Color palette and style notes
      5. Pose and expression suggestions
      
      Format as a detailed prompt suitable for image generation.`;
      
    case 'object':
      return `Create a detailed visual description for an OBJECT/PROP in a video/film${styleGuide}:
      
      Object Request: ${description}
      
      Provide a comprehensive object description including:
      1. Physical characteristics (size, shape, material, texture)
      2. Color scheme and surface details
      3. Functionality and purpose
      4. Lighting and shadow considerations
      5. Context and placement suggestions
      
      Format as a detailed prompt suitable for image generation.`;
      
    case 'background':
      return `Create a detailed visual description for a BACKGROUND/SETTING in a video/film${styleGuide}:
      
      Background Request: ${description}
      
      Provide a comprehensive background description including:
      1. Environment type and atmosphere
      2. Time of day and lighting conditions
      3. Key visual elements and landmarks
      4. Color palette and mood
      5. Depth and perspective details
      
      Format as a detailed prompt suitable for image generation.`;
      
    default:
      return `Create a detailed visual description for ${description}${styleGuide}`;
  }
};

// Generate multiple variations of an asset
const generateAssetVariations = async (
  type: AssetType, 
  description: string, 
  count: number = 4,
  style?: string
): Promise<string[]> => {
  const basePrompt = getAssetPrompt(type, description, style);
  
  const variationPrompt = `${basePrompt}
  
  Generate ${count} DIFFERENT variations of this ${type}.
  Each variation should be unique but related to the original request.
  
  Format your response as a JSON array with ${count} items, each containing:
  {
    "id": "unique_id",
    "prompt": "detailed image generation prompt",
    "title": "short descriptive title",
    "tags": ["relevant", "tags"]
  }`;
  
  try {
    const result = await model.generateContent(variationPrompt);
    const response = await result.response;
    const text = response.text();
    
    // Extract JSON from response
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      const variations = JSON.parse(jsonMatch[0]);
      return variations.map((v: any) => v.prompt || v);
    }
    
    // Fallback: split text into variations
    const lines = text.split('\n').filter(line => line.trim().length > 0);
    return lines.slice(0, count);
  } catch (error) {
    console.error('Error generating variations:', error);
    // Return default variations
    return Array(count).fill(null).map((_, i) => 
      `${description} - Variation ${i + 1}${style ? ` in ${style} style` : ''}`
    );
  }
};

// Generate image URL using a placeholder service
// In production, this would call the actual Gemini image generation API
const generateImageUrl = async (prompt: string, type: AssetType): Promise<string> => {
  // For now, return a placeholder image based on the prompt
  // In production, integrate with Gemini 2.0 Flash Preview image generation
  
  const category = type === 'character' ? 'people' : 
                   type === 'object' ? 'objects' : 
                   'nature';
  
  // Use a deterministic seed based on prompt for consistency
  const seed = prompt.split('').reduce((a, b) => a + b.charCodeAt(0), 0);
  
  // Return a placeholder image URL
  return `https://picsum.photos/seed/${seed}/400/400`;
};

export async function POST(request: NextRequest) {
  try {
    const body: AssetGenerationRequest = await request.json();
    const { prompt, type, count = 4, style } = body;
    
    if (!prompt || !type) {
      return NextResponse.json(
        { error: 'Missing required fields: prompt and type' },
        { status: 400 }
      );
    }
    
    // Generate variations
    const variations = await generateAssetVariations(type, prompt, count, style);
    
    // Generate images for each variation
    const assets = await Promise.all(
      variations.map(async (variation, index) => {
        const imageUrl = await generateImageUrl(variation, type);
        
        return {
          id: `${type}_${Date.now()}_${index}`,
          type,
          prompt: variation,
          imageUrl,
          title: `${type.charAt(0).toUpperCase() + type.slice(1)} ${index + 1}`,
          tags: [type, style || 'default'].filter(Boolean),
          createdAt: new Date().toISOString()
        };
      })
    );
    
    return NextResponse.json({
      success: true,
      assets,
      metadata: {
        originalPrompt: prompt,
        type,
        count: assets.length,
        style: style || 'default'
      }
    });
    
  } catch (error) {
    console.error('Gallery asset generation error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to generate gallery assets',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
