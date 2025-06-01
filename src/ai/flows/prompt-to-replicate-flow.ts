'use server';
/**
 * @fileOverview Generates three types of prompts based on uploaded images: exact replication, similar with tweaks, 
 * and same niche/concept prompts. Part of the "Prompt to Replicate" feature.
 * 
 * - promptToReplicate - Function to generate prompts based on uploaded images
 */

import { ai } from '@/ai/genkit';
import { genkit } from 'genkit';
import { z } from 'zod';
import { googleAI } from '@genkit-ai/googleai';
import { DEFAULT_MODEL_ID } from '@/lib/constants';
import {
  PromptToReplicateInput,
  PromptToReplicateOutput,
  PromptToReplicatePromptInputSchema,
  PromptReplicateOutputSchema
} from './prompt-to-replicate-types';

export async function promptToReplicate(flowInput: PromptToReplicateInput): Promise<PromptToReplicateOutput> {
  const { userApiKey, modelId, imageDataUris, userName } = flowInput;
  const modelToUse = modelId || DEFAULT_MODEL_ID;
  const flowName = 'promptToReplicate';

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

  const replicatePrompt = currentAiInstance.definePrompt({
    name: `${flowName}Prompt_${Date.now()}`,
    input: { schema: PromptToReplicatePromptInputSchema },
    output: { schema: PromptReplicateOutputSchema },
    prompt: `You are an expert AI Prompt Engineer for {{#if userName}}{{{userName}}}{{else}}a graphic designer{{/if}}.

**Objective:** Generate three distinct, detailed prompts based on an uploaded design image:

**Image to Analyze:**
{{media url=imageDataUri}}

**Tasks:**

1. **Generate "Exact Replication" Prompt:**
   * Create a highly detailed textual description of the image
   * Focus on elements like objects, colors, composition, style, lighting, textures, and any text present
   * Be comprehensive enough that an image generation AI could use it to recreate the visual as closely as possible
   * This prompt should aim to replicate the design exactly

2. **Generate "Similar with Tweaks" Prompt:**
   * Analyze the core elements and style of the image
   * Create a prompt for a variation that is clearly inspired by the original
   * Incorporate thoughtful modifications (e.g., different color scheme, alternative objects, modified composition)
   * Keep the essence of the original design but with specific variations

3. **Generate "Same Niche/Concept, Not Similar" Prompt:**
   * Identify the underlying niche or concept (e.g., "fruit still life," "abstract geometric pattern," "futuristic cityscape")
   * Create a highly detailed prompt for a completely new image within that same niche/concept
   * Make sure it's visually distinct from the uploaded image
   * Focus on the same subject matter/purpose but with a fresh creative approach

For each prompt:
- Be extremely specific and detailed
- Ensure that an AI image generator could produce a high-quality result following your description
- Focus on color, lighting, composition, style, mood, and specific elements
- Format each prompt for maximum usability with AI image generators

Output all three prompts as separate fields.
`,
  });

  // Process each image and get prompts
  const imagePrompts = [];
  for (const imageDataUri of imageDataUris) {
    try {
      console.log(`INFO (${flowName}): Processing image...`);
      const { output } = await replicatePrompt({ imageDataUri, userName }, { model: modelToUse });
      
      if (!output) {
        console.error(`ERROR (${flowName}): AI returned empty or undefined output for an image.`);
        continue;
      }
      
      imagePrompts.push({
        imageDataUri,
        exactReplicationPrompt: output.exactReplicationPrompt,
        similarWithTweaksPrompt: output.similarWithTweaksPrompt,
        sameNichePrompt: output.sameNichePrompt,
      });
    } catch (error) {
      console.error(`ERROR (${flowName}): AI call failed for an image (API key source: ${apiKeySourceForLog}). Error:`, error);
    }
  }

  if (imagePrompts.length === 0) {
    throw new Error(`Failed to generate prompts for any images in ${flowName}.`);
  }

  return { imagePrompts };
} 