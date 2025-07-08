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
  aspectRatio: z.enum(['1:1', '4:3', '3:4', '16:9', '9:16']).default('1:1').describe('Aspect ratio for generated images.'),
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
  const { userApiKeys, modelId, prompt, numImages, aspectRatio, temperature, userName } = flowInput as any;
  const modelToUse = modelId || 'gemini-pro-vision';
  const flowName = 'generateImages';

  const profileStub: UserProfile | null = userApiKeys ? { userId: 'u', name: 'tmp', services: [], geminiApiKeys: userApiKeys } as any : null;
  const client = new GeminiClient({ profile: profileStub });

  try {
    console.log(`INFO (${flowName}): Making Gemini image generation request...`);

    async function callGeminiWithKey(apiKey: string): Promise<string> {
      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-preview-image-generation:generateContent?key=${apiKey}`;
      const promptWithDirectives = `Generate ${numImages} image${numImages > 1 ? 's' : ''} with an aspect ratio of ${aspectRatio}. Return the images only – no additional text. Description: ${prompt}`;
      const body = {
        contents: [ { parts: [{ text: promptWithDirectives }] } ],
        generationConfig: { responseModalities: ["TEXT","IMAGE"], temperature }
      };
      const res = await fetch(endpoint,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)});
      if(!res.ok){throw new Error(`Gemini image API error: ${res.status} - ${await res.text()}`);}      
      const data = await res.json();
      const part = data?.candidates?.[0]?.content?.parts?.find((p:any)=>p.inlineData?.data||p.url);
      if(!part) throw new Error('Gemini image API returned no image part');
      if(part.inlineData?.data) return `data:image/png;base64,${part.inlineData.data}`;
      if(part.url) return part.url;
      throw new Error('Gemini image part had no data');
    }

    async function callGeminiOnce(maxRetries:number=3): Promise<string>{
      let attempts=0;
      while(attempts<maxRetries){
        try{
          const { data } = await client.request<string>(callGeminiWithKey);
          return data;
        }catch(err){
          attempts++;
          if(attempts>=maxRetries) throw err;
        }
      }
      throw new Error('All retries exhausted');
    }

    // Gemini preview currently supports only one image per call. Call it N times.
    const images: { dataUri: string; alt: string }[] = [];
    for (let i = 0; i < numImages; i++) {
      try {
        const dataUri = await callGeminiOnce();
        images.push({ dataUri, alt: `Generated image ${images.length + 1}` });
      } catch (err) {
        console.warn(`generateImages: failed to generate image ${i + 1}/${numImages}`, err);
        // continue to next image attempt
      }
    }

    if (images.length === 0) {
      throw new Error('All image generation attempts failed');
    }

    return { images, prompt };
  } catch (error) {
    console.error(`ERROR (${flowName}): Image generation failed. Error:`, error);
    throw new Error(`Image generation failed in ${flowName}. Please check server logs for details. Original error: ${(error as Error).message}`);
  }
} 