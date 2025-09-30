'use server';
/**
 * @fileOverview Generates images using Google's Gemini 2.0 image generation API.
 *
 * - generateImages - A function to generate images from text prompts.
 * - GenerateImagesInput - The input type for the generateImages function.
 * - GenerateImagesOutput - The return type for the generateImages function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { DEFAULT_MODEL_ID } from '@/lib/constants';
import { genkit } from 'genkit';
import { googleAI } from '@genkit-ai/googleai';
import { GeminiClient } from '@/lib/ai/gemini-client';
import { UserProfile } from '@/lib/types';

// Schema for the flow's input
const GenerateImagesFlowInputSchema = z.object({
  prompt: z.string().describe('The text prompt to generate images from.'),
  numImages: z.number().min(1).max(8).default(4).describe('Number of images to generate (1-8).'),
  temperature: z.number().min(0).max(2).default(1).describe('Sampling temperature (0-2)'),
  userName: z.string().describe('The name of the user (designer).'),
  communicationStyleNotes: z.string().describe('The communication style notes of the user.'),
  modelId: z.string().optional().describe('The Genkit model ID to use for this request.'),
  userApiKeys: z.array(z.string()).optional().describe('User-provided Gemini API keys.'),
});
export type GenerateImagesInput = z.infer<typeof GenerateImagesFlowInputSchema>;

// Schema for an individual generated image
const GeneratedImageSchema = z.object({
  dataUri: z.string().describe('Base64 data URI of the generated image.'),
  alt: z.string().describe('Alt text/description for the image.'),
});

// Schema for the flow's output
const GenerateImagesOutputSchema = z.object({
  images: z.array(GeneratedImageSchema).describe('Array of generated images.'),
  prompt: z.string().describe('The prompt used to generate the images.'),
});
export type GenerateImagesOutput = z.infer<typeof GenerateImagesOutputSchema>;

/**
 * Generates images using Google's Gemini 2.0 image generation API.
 * 
 * @param flowInput Input parameters for image generation
 * @returns Array of generated images as data URIs with alt text
 */
export async function generateImages(flowInput: GenerateImagesInput): Promise<GenerateImagesOutput> {
  const { userApiKeys, modelId, prompt, numImages, temperature, userName } = flowInput as any;
  const modelToUse = modelId || 'gemini-pro-vision';
  const flowName = 'generateImages';

  const profileStub: UserProfile | null = userApiKeys ? { userId: 'u', name: 'tmp', services: [], geminiApiKeys: userApiKeys } as any : null;
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