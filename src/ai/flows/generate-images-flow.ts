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

// Schema for the flow's input
const GenerateImagesFlowInputSchema = z.object({
  prompt: z.string().describe('The text prompt to generate images from.'),
  numImages: z.number().min(1).max(8).default(4).describe('Number of images to generate (1-8).'),
  aspectRatio: z.enum(['1:1', '4:3', '3:4', '16:9', '9:16']).default('1:1').describe('Aspect ratio for generated images.'),
  temperature: z.number().min(0).max(2).default(1).describe('Sampling temperature (0-2)'),
  userName: z.string().describe('The name of the user (designer).'),
  communicationStyleNotes: z.string().describe('The communication style notes of the user.'),
  modelId: z.string().optional().describe('The Genkit model ID to use for this request.'),
  userApiKey: z.string().optional().describe('User-provided Gemini API key.'),
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
  const { userApiKey, modelId, prompt, numImages, aspectRatio, temperature, userName } = flowInput;
  const modelToUse = modelId || 'gemini-pro-vision'; // Default model for image generation
  const flowName = 'generateImages';

  let currentAiInstance = ai; // Global Genkit instance by default
  let apiKeySourceForLog = "GOOGLE_API_KEY from .env file";

  if (userApiKey) {
    console.log(`INFO (${flowName}): Using user-provided API key.`);
    currentAiInstance = genkit({ plugins: [googleAI({ apiKey: userApiKey })] });
    apiKeySourceForLog = "User-provided API key from profile";
  } else if (process.env.GOOGLE_API_KEY) {
    console.log(`INFO (${flowName}): User API key not provided. Using GOOGLE_API_KEY from .env file.`);
  } else {
    console.error(`CRITICAL_ERROR (${flowName}): No API key available. Neither a user-provided API key nor the GOOGLE_API_KEY in the .env file is set.`);
    throw new Error(`API key configuration error in ${flowName}. AI features are unavailable.`);
  }

  try {
    console.log(`INFO (${flowName}): Making Gemini image generation request...`);

    /*
     * NOTE: 2025-07 – Google updated the Gemini image generation REST API. The correct
     * path is now `${model}:generateContent` and the request/response schema mirrors
     * normal multimodal generateContent calls. See docs:
     * https://ai.google.dev/gemini-api/docs/image-generation
     */

    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-preview-image-generation:generateContent?key=${userApiKey || process.env.GOOGLE_API_KEY}`;

    // Ask the model explicitly for <numImages> images so we (hopefully) get the desired count.
    // The model currently supports a single size (1024×1024). We include the desired size in
    // the prompt as a soft hint so that future versions can respect it.
    const promptWithDirectives = `Generate ${numImages} image${numImages > 1 ? 's' : ''} with an aspect ratio of ${aspectRatio}. Return the images only – no additional text. Description: ${prompt}`;

    const body = {
      contents: [
        {
          parts: [{ text: promptWithDirectives }]
        }
      ],
      generationConfig: {
        // IMAGE must be present or the API returns multimodal content.
        responseModalities: ["TEXT", "IMAGE"],
        temperature,
        // NOTE: aspectRatio is not yet supported as a formal field in Gemini's
        // generationConfig. Until the API adds first-class support, we only
        // include the desired ratio in the textual prompt above.
      }
    };

    async function callGeminiOnce(): Promise<string> {
      const fetchRes = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      });

      if (!fetchRes.ok) {
        const errText = await fetchRes.text();
        throw new Error(`Gemini image API error: ${fetchRes.status} - ${errText}`);
      }

      interface GeminiPart {
        text?: string;
        inlineData?: { mimeType: string; data: string };
        url?: string;
      }

      interface GeminiResp {
        candidates: { content: { parts: GeminiPart[] } }[];
      }

      const data = (await fetchRes.json()) as GeminiResp;

      const part = data?.candidates?.[0]?.content?.parts?.find((p) => p.inlineData?.data || p.url);

      if (!part) {
        throw new Error('Gemini image API returned no image part');
      }

      if (part.inlineData?.data) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
      if (part.url) {
        return part.url;
      }
      throw new Error('Gemini image part had no data');
    }

    // Gemini preview currently supports only one image per call. Call it N times.
    const imagePromises: Promise<string>[] = [];
    for (let i = 0; i < numImages; i++) {
      imagePromises.push(callGeminiOnce());
    }

    const dataUris = await Promise.all(imagePromises);

    const images = dataUris.map((dataUri, idx) => ({
      dataUri,
      alt: `Generated image ${idx + 1}`
    }));

    return { images, prompt };
  } catch (error) {
    console.error(`ERROR (${flowName}): Image generation failed (API key source: ${apiKeySourceForLog}). Error:`, error);
    throw new Error(`Image generation failed in ${flowName}. Please check server logs for details. Original error: ${(error as Error).message}`);
  }
} 