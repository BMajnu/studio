'use server';
/**
 * @fileOverview Generates five distinct versions of a design prompt based on the user's selected design type and description.
 * One prompt aims for exactly what the user described, while the other four explore different style variations.
 * 
 * - promptWithCustomSense - Function to generate the five prompt variations
 */

import { ai } from '@/ai/genkit';
import { genkit } from 'genkit';
import { z } from 'zod';
import { googleAI } from '@genkit-ai/googleai';
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

  const customSensePrompt = currentAiInstance.definePrompt({
    name: `${flowName}Prompt_${Date.now()}`,
    input: { schema: PromptWithCustomSensePromptInputSchema },
    output: { schema: PromptWithCustomSensePromptOutputSchema },
    prompt: `You are an expert AI Prompt Engineer for {{#if userName}}{{{userName}}}{{else}}a graphic designer{{/if}}.

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
`,
  });

  try {
    console.log(`INFO (${flowName}): Processing request for design type: ${designType}, description: ${description}`);
    const { output } = await customSensePrompt(
      { designType, description, userName }, 
      { model: modelToUse }
    );
    
    if (!output) {
      console.error(`ERROR (${flowName}): AI returned empty or undefined output.`);
      throw new Error(`Failed to generate prompts in ${flowName}.`);
    }
    
    // Format the output into the expected structure
    const formattedPrompts = [
      { title: "Exactly Similar", prompt: output.exactlySimilarPrompt },
      { title: "Modern Style", prompt: output.modernStylePrompt },
      { title: "Vintage Style", prompt: output.vintageStylePrompt },
      { title: "Sci-Fi Style", prompt: output.sciFiStylePrompt },
      { title: "Colorful Style", prompt: output.colorfulStylePrompt }
    ];
    
    return { prompts: formattedPrompts };
  } catch (error) {
    console.error(`ERROR (${flowName}): AI call failed (API key source: ${apiKeySourceForLog}). Error:`, error);
    throw new Error(`Failed to generate custom sense prompts: ${error instanceof Error ? error.message : String(error)}`);
  }
} 