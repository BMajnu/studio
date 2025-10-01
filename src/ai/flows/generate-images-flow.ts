'use server';
/**
 * @fileOverview Generates images using Google's Gemini 2.0 image generation API.
 *
 * - generateImages - A function to generate images from text prompts.
 * - GenerateImagesInput - The input type for the generateImages function.
 * - GenerateImagesOutput - The return type for the generateImages function.
 */

import type { UserProfile } from '@/lib/types';
import { GeminiClient } from '@/lib/ai/gemini-client';

// Input interface
export interface GenerateImagesInput {
  prompt: string;
  numImages?: number;
  temperature?: number;
  userName: string;
  communicationStyleNotes: string;
  modelId?: string;
  userApiKeys?: string[];
  profile?: UserProfile;
}

// Output interfaces
export interface GeneratedImage {
  dataUri: string;
  alt: string;
}

export interface GenerateImagesOutput {
  images: GeneratedImage[];
  prompt: string;
}

/**
 * Generates images using Google's Gemini 2.0 image generation API.
 * 
 * @param flowInput Input parameters for image generation
 * @returns Array of generated images as data URIs with alt text
 */
export async function generateImages(flowInput: GenerateImagesInput): Promise<GenerateImagesOutput> {
  const { 
    userApiKeys, 
    profile,
    modelId, 
    prompt, 
    numImages = 4, 
    temperature = 1, 
    userName 
  } = flowInput;
  
  const flowName = 'generateImages';

  // Build profile for key management
  const profileStub: UserProfile | null = profile || (userApiKeys ? { 
    userId: 'u', 
    name: 'tmp', 
    services: [], 
    geminiApiKeys: userApiKeys 
  } as any : null);
  
  const client = new GeminiClient({ profile: profileStub });

  try {
    console.log(`INFO (${flowName}): Making Gemini image generation request using @google/genai SDK...`);

    async function callGeminiWithKey(apiKey: string): Promise<{ dataUri: string; alt: string }[]> {
      const { GoogleGenAI } = await import('@google/genai');
      const ai = new GoogleGenAI({ apiKey });
      
      const model = 'gemini-2.5-flash-image-preview';
      const promptWithDirectives = `Generate ${numImages} image${numImages > 1 ? 's' : ''}. Return the images only – no additional text. Description: ${prompt}`;
      
      const config = {
        responseModalities: ['IMAGE', 'TEXT'],
        temperature,
      };
      
      const contents = [
        {
          role: 'user',
          parts: [
            {
              text: promptWithDirectives,
            },
          ],
        },
      ];

      const response = await ai.models.generateContentStream({
        model,
        config,
        contents,
      });

      const collectedImages: { dataUri: string; alt: string }[] = [];
      let imageIndex = 0;

      for await (const chunk of response) {
        if (!chunk.candidates || !chunk.candidates[0]?.content || !chunk.candidates[0].content.parts) {
          continue;
        }
        
        // Check for inline image data
        for (const part of chunk.candidates[0].content.parts) {
          if (part.inlineData && part.inlineData.data) {
            const mimeType = part.inlineData.mimeType || 'image/png';
            const base64Data = part.inlineData.data;
            const dataUri = `data:${mimeType};base64,${base64Data}`;
            
            collectedImages.push({
              dataUri,
              alt: `Generated image ${imageIndex + 1}`
            });
            
            imageIndex++;
            console.log(`✓ Received image ${imageIndex} from stream`);
          }
        }
      }

      if (collectedImages.length === 0) {
        throw new Error('No images returned from Gemini API stream');
      }

      return collectedImages;
    }

    async function callGeminiOnce(maxRetries: number = 3): Promise<{ dataUri: string; alt: string }[]> {
      let attempts = 0;
      while (attempts < maxRetries) {
        try {
          const { data } = await client.request<{ dataUri: string; alt: string }[]>(callGeminiWithKey);
          return data;
        } catch (err) {
          attempts++;
          console.warn(`Image generation attempt ${attempts}/${maxRetries} failed:`, err);
          if (attempts >= maxRetries) throw err;
        }
      }
      throw new Error('All retries exhausted');
    }

    // Generate images using the new SDK
    console.log(`Requesting ${numImages} images from Gemini...`);
    const images = await callGeminiOnce();

    if (images.length === 0) {
      throw new Error('All image generation attempts failed');
    }

    console.log(`✓ Successfully generated ${images.length} image(s)`);
    return { images, prompt };
  } catch (error) {
    console.error(`ERROR (${flowName}): Image generation failed. Error:`, error);
    throw new Error(`Image generation failed in ${flowName}. Please check server logs for details. Original error: ${(error as Error).message}`);
  }
}
