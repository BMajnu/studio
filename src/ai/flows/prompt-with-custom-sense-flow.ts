'use server';
/**
 * @fileOverview Generates five distinct versions of a design prompt based on the user's selected design type and description.
 * One prompt aims for exactly what the user described, while the other four explore different style variations.
 * 
 * - promptWithCustomSense - Function to generate the five prompt variations
 */

import { z } from 'zod';
import { GeminiClient } from '@/lib/ai/gemini-client';
import { createGeminiAiInstance } from '@/lib/ai/genkit-utils';
import { DEFAULT_MODEL_ID } from '@/lib/constants';
import {
  PromptWithCustomSenseInput,
  PromptWithCustomSenseOutput,
  PromptWithCustomSensePromptInputSchema,
  PromptWithCustomSensePromptOutputSchema
} from './prompt-with-custom-sense-types';

export async function promptWithCustomSense(flowInput: PromptWithCustomSenseInput): Promise<PromptWithCustomSenseOutput> {
  const { userApiKey, modelId, designType, description, userName } = flowInput;
  const modelToUse = modelId || DEFAULT_MODEL_ID;
  const flowName = 'promptWithCustomSense';

  const profileStub = userApiKey ? ({ userId: 'tmp', name: 'tmp', services: [], geminiApiKeys: [userApiKey] } as any) : null;
  const client = new GeminiClient({ profile: profileStub });

  const promptText = `You are an expert AI Prompt Engineer for {{#if userName}}{{{userName}}}{{else}}a graphic designer{{/if}}.

**Objective:** Generate five distinct versions of a design prompt based on the provided design type and description.

**Design Type:** {{{designType}}}
**Description:** {{{description}}}

**Tasks:**

1. **Generate "Exactly Similar" Prompt:**
   * Create a detailed prompt that precisely describes the design as requested
   * Include specific details about elements, composition, and style
   * Make it suitable for AI image generation or design tools
   * Focus on accuracy to the original concept

2. **Generate "Modern Style" Prompt:**
   * Adapt the design concept with a contemporary, modern aesthetic
   * Incorporate clean lines, minimalist elements, and current design trends
   * Use a sophisticated, sleek approach appropriate for current markets
   * Maintain the core concept but with modern execution

3. **Generate "Vintage Style" Prompt:**
   * Transform the concept with a retro or vintage aesthetic
   * Specify era-appropriate details (e.g., mid-century, 70s, 90s nostalgia)
   * Include vintage color palettes, textures, and typography
   * Create an authentic period feel while keeping the original concept

4. **Generate "Sci-Fi Style" Prompt:**
   * Reimagine the concept with futuristic, science fiction elements
   * Add technological, space-age, or advanced features
   * Use appropriate sci-fi visual language (glows, holograms, futuristic interfaces)
   * Balance the original concept with compelling sci-fi aesthetics

5. **Generate "Colorful Style" Prompt:**
   * Create a vibrant, playful version of the concept
   * Specify a diverse, bold color palette
   * Include dynamic compositions and whimsical elements
   * Make it eye-catching and energetic while maintaining the core idea

For each prompt:
- Be extremely specific and detailed
- Ensure that an AI image generator or designer could produce a high-quality result
- Focus on the unique aspects of each style variation
- Include guidance on colors, composition, mood, and specific elements
- Format each prompt for maximum usability
- Each prompt should be at least 100 words to provide sufficient detail

Output all five prompts as separate fields.
`;

  const MAX_RETRIES = 3;
  const BASE_DELAY_MS = 2000;

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      console.log(`INFO (${flowName}): [Attempt ${attempt}/${MAX_RETRIES}] Processing request for design type: ${designType}`);
      const { data: raw } = await client.request(async (apiKey) => {
        const instance = createGeminiAiInstance(apiKey);
        const promptDef = instance.definePrompt({
          name: `${flowName}Prompt_${Date.now()}`,
          input: { schema: PromptWithCustomSensePromptInputSchema },
          output: { schema: PromptWithCustomSensePromptOutputSchema },
          prompt: promptText
        });
        const { output } = await promptDef({ designType, description, userName }, { model: modelToUse });
        return output;
      });
      if (!raw) throw new Error('AI returned empty output');

      const o = raw as any;
      const formattedPrompts = [
        { title: "Exactly Similar", prompt: o.exactlySimilarPrompt },
        { title: "Modern Style", prompt: o.modernStylePrompt },
        { title: "Vintage Style", prompt: o.vintageStylePrompt },
        { title: "Sci-Fi Style", prompt: o.sciFiStylePrompt },
        { title: "Colorful Style", prompt: o.colorfulStylePrompt }
      ];

      return { prompts: formattedPrompts };
    } catch (err: any) {
      const errMsg = err?.message || String(err);
      const isRetryable = errMsg.includes('503') || errMsg.includes('overloaded') || errMsg.includes('temporarily') || errMsg.includes('unavailable');

      console.warn(`WARN (${flowName}): Attempt ${attempt} failed: ${errMsg}`);

      if (!isRetryable || attempt === MAX_RETRIES) {
        console.error(`ERROR (${flowName}): All attempts failed.`);
        throw new Error(`Failed to generate custom sense prompts: ${errMsg}`);
      }

      // Exponential backoff before retrying
      const delay = BASE_DELAY_MS * Math.pow(2, attempt - 1);
      await new Promise(res => setTimeout(res, delay));
    }
  }

  throw new Error(`Unknown failure in ${flowName}`);
} 