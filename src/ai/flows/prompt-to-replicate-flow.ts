'use server';
/**
 * @fileOverview Generates three types of prompts based on uploaded images: exact replication, similar with tweaks, 
 * and same niche/concept prompts. Part of the "Prompt to Replicate" feature.
 * 
 * - promptToReplicate - Function to generate prompts based on uploaded images
 */

import { DEFAULT_MODEL_ID } from '@/lib/constants';
import { generateJSON } from '@/lib/ai/genai-helper';
import type { UserProfile } from '@/lib/types';
import { classifyError, AppError } from '@/lib/errors';
import type {
  PromptToReplicateInput,
  PromptToReplicateOutput,
  ImagePromptResult
} from './prompt-to-replicate-types';

interface SingleImagePromptOutput {
  exactReplicationPrompt: string;
  similarWithTweaksPrompt: string;
  sameNichePrompt: string;
}

export async function promptToReplicate(flowInput: PromptToReplicateInput): Promise<PromptToReplicateOutput> {
  const { 
    userApiKey,
    profile, 
    modelId = DEFAULT_MODEL_ID, 
    imageDataUris, 
    userName 
  } = flowInput;
  
  const flowName = 'promptToReplicate';

  // Build profile for key management
  const profileForKey = profile || (userApiKey ? {
    userId: 'temp',
    name: 'temp',
    services: [],
    geminiApiKeys: [userApiKey]
  } as any : null);

  // Build system prompt
  const systemPrompt = `You are an expert AI Prompt Engineer for ${userName || 'a graphic designer'}.`;

  // Process each image and get prompts
  const imagePrompts: ImagePromptResult[] = [];
  let lastErr: any = null;
  
  for (const imageDataUri of imageDataUris) {
    try {
      console.log(`INFO (${flowName}): Processing image...`);
      
      // Build user prompt for this image
      let userPrompt = `**Objective:** Generate three distinct, detailed prompts based on an uploaded design image:\n\n`;
      
      userPrompt += `**Image to Analyze:**\n`;
      userPrompt += `{{media url=${imageDataUri}}}\n\n`;
      
      userPrompt += `**Tasks:**\n\n`;
      
      userPrompt += `1. **Generate "Exact Replication" Prompt:**\n`;
      userPrompt += `   * Create a highly detailed textual description of the image\n`;
      userPrompt += `   * Focus on elements like objects, colors, composition, style, lighting, textures, and any text present\n`;
      userPrompt += `   * Be comprehensive enough that an image generation AI could use it to recreate the visual as closely as possible\n`;
      userPrompt += `   * This prompt should aim to replicate the design exactly\n\n`;
      
      userPrompt += `2. **Generate "Similar with Tweaks" Prompt:**\n`;
      userPrompt += `   * Analyze the core elements and style of the image\n`;
      userPrompt += `   * Create a prompt for a variation that is clearly inspired by the original\n`;
      userPrompt += `   * Incorporate thoughtful modifications (e.g., different color scheme, alternative objects, modified composition)\n`;
      userPrompt += `   * Keep the essence of the original design but with specific variations\n\n`;
      
      userPrompt += `3. **Generate "Same Niche/Concept, Not Similar" Prompt:**\n`;
      userPrompt += `   * Identify the underlying niche or concept (e.g., "fruit still life," "abstract geometric pattern," "futuristic cityscape")\n`;
      userPrompt += `   * Create a highly detailed prompt for a completely new image within that same niche/concept\n`;
      userPrompt += `   * Make sure it's visually distinct from the uploaded image\n`;
      userPrompt += `   * Focus on the same subject matter/purpose but with a fresh creative approach\n\n`;
      
      userPrompt += `For each prompt:\n`;
      userPrompt += `- Be extremely specific and detailed\n`;
      userPrompt += `- Ensure that an AI image generator could produce a high-quality result following your description\n`;
      userPrompt += `- Focus on color, lighting, composition, style, mood, and specific elements\n`;
      userPrompt += `- Format each prompt for maximum usability with AI image generators\n\n`;
      
      userPrompt += `Output all three prompts as separate fields in JSON with keys: exactReplicationPrompt, similarWithTweaksPrompt, sameNichePrompt.`;

      const output = await generateJSON<SingleImagePromptOutput>({
        modelId,
        temperature: 0.8,
        maxOutputTokens: 8000,
        thinkingMode: profile?.thinkingMode || 'default',
        profile: profileForKey
      }, systemPrompt, userPrompt);
      
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
      console.error(`ERROR (${flowName}): AI call failed for an image. Error:`, error);
      lastErr = error;
    }
  }

  if (imagePrompts.length === 0) {
    throw classifyError(lastErr || new AppError('INTERNAL', 500, `Failed to generate prompts for any images in ${flowName}.`));
  }

  return { imagePrompts };
}
