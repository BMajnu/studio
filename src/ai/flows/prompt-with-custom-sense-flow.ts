'use server';
/**
 * @fileOverview Generates five distinct versions of a design prompt based on the user's selected design type and description.
 * One prompt aims for exactly what the user described, while the other four explore different style variations.
 * 
 * - promptWithCustomSense - Function to generate the five prompt variations
 */

import { DEFAULT_MODEL_ID } from '@/lib/constants';
import { generateJSON } from '@/lib/ai/genai-helper';
import type { UserProfile } from '@/lib/types';
import type {
  PromptWithCustomSenseInput,
  PromptWithCustomSenseOutput,
  PromptVariation
} from './prompt-with-custom-sense-types';

interface AIPromptOutput {
  exactlySimilarPrompt: string;
  modernStylePrompt: string;
  vintageStylePrompt: string;
  sciFiStylePrompt: string;
  colorfulStylePrompt: string;
}

export async function promptWithCustomSense(flowInput: PromptWithCustomSenseInput): Promise<PromptWithCustomSenseOutput> {
  const { 
    userApiKey, 
    profile,
    modelId = DEFAULT_MODEL_ID, 
    designType, 
    description, 
    userName 
  } = flowInput;
  
  const flowName = 'promptWithCustomSense';

  // Build profile for key management
  const profileForKey = profile || (userApiKey ? {
    userId: 'temp',
    name: 'temp',
    services: [],
    geminiApiKeys: [userApiKey]
  } as any : null);

  // Build system prompt
  const systemPrompt = `You are an expert AI Prompt Engineer for ${userName || 'a graphic designer'}.`;

  // Build user prompt
  let userPrompt = `**Objective:** Generate five distinct versions of a design prompt based on the provided design type and description.\n\n`;
  
  userPrompt += `**Design Type:** ${designType}\n`;
  userPrompt += `**Description:** ${description}\n\n`;
  
  userPrompt += `**Tasks:**\n\n`;
  
  userPrompt += `1. **Generate "Exactly Similar" Prompt:**\n`;
  userPrompt += `   * Create a detailed prompt that precisely describes the design as requested\n`;
  userPrompt += `   * Include specific details about elements, composition, and style\n`;
  userPrompt += `   * Make it suitable for AI image generation or design tools\n`;
  userPrompt += `   * Focus on accuracy to the original concept\n\n`;
  
  userPrompt += `2. **Generate "Modern Style" Prompt:**\n`;
  userPrompt += `   * Adapt the design concept with a contemporary, modern aesthetic\n`;
  userPrompt += `   * Incorporate clean lines, minimalist elements, and current design trends\n`;
  userPrompt += `   * Use a sophisticated, sleek approach appropriate for current markets\n`;
  userPrompt += `   * Maintain the core concept but with modern execution\n\n`;
  
  userPrompt += `3. **Generate "Vintage Style" Prompt:**\n`;
  userPrompt += `   * Transform the concept with a retro or vintage aesthetic\n`;
  userPrompt += `   * Specify era-appropriate details (e.g., mid-century, 70s, 90s nostalgia)\n`;
  userPrompt += `   * Include vintage color palettes, textures, and typography\n`;
  userPrompt += `   * Create an authentic period feel while keeping the original concept\n\n`;
  
  userPrompt += `4. **Generate "Sci-Fi Style" Prompt:**\n`;
  userPrompt += `   * Reimagine the concept with futuristic, science fiction elements\n`;
  userPrompt += `   * Add technological, space-age, or advanced features\n`;
  userPrompt += `   * Use appropriate sci-fi visual language (glows, holograms, futuristic interfaces)\n`;
  userPrompt += `   * Balance the original concept with compelling sci-fi aesthetics\n\n`;
  
  userPrompt += `5. **Generate "Colorful Style" Prompt:**\n`;
  userPrompt += `   * Create a vibrant, playful version of the concept\n`;
  userPrompt += `   * Specify a diverse, bold color palette\n`;
  userPrompt += `   * Include dynamic compositions and whimsical elements\n`;
  userPrompt += `   * Make it eye-catching and energetic while maintaining the core idea\n\n`;
  
  userPrompt += `For each prompt:\n`;
  userPrompt += `- Be extremely specific and detailed\n`;
  userPrompt += `- Ensure that an AI image generator or designer could produce a high-quality result\n`;
  userPrompt += `- Focus on the unique aspects of each style variation\n`;
  userPrompt += `- Include guidance on colors, composition, mood, and specific elements\n`;
  userPrompt += `- Format each prompt for maximum usability\n`;
  userPrompt += `- Each prompt should be at least 100 words to provide sufficient detail\n\n`;
  
  userPrompt += `Output all five prompts as separate fields in JSON with keys: exactlySimilarPrompt, modernStylePrompt, vintageStylePrompt, sciFiStylePrompt, colorfulStylePrompt.`;

  const MAX_RETRIES = 3;

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      console.log(`INFO (${flowName}): [Attempt ${attempt}/${MAX_RETRIES}] Processing request for design type: ${designType}`);
      
      const raw = await generateJSON<AIPromptOutput>({
        modelId,
        temperature: 0.9,
        maxOutputTokens: 12000,
        thinkingMode: profile?.thinkingMode || 'default',
        profile: profileForKey
      }, systemPrompt, userPrompt);

      if (!raw) throw new Error('AI returned empty output');

      const formattedPrompts: PromptVariation[] = [
        { title: "Exactly Similar", prompt: raw.exactlySimilarPrompt },
        { title: "Modern Style", prompt: raw.modernStylePrompt },
        { title: "Vintage Style", prompt: raw.vintageStylePrompt },
        { title: "Sci-Fi Style", prompt: raw.sciFiStylePrompt },
        { title: "Colorful Style", prompt: raw.colorfulStylePrompt }
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
      const delay = 500 * Math.pow(2, attempt - 1);
      await new Promise(res => setTimeout(res, delay));
    }
  }

  throw new Error(`Unknown failure in ${flowName}`);
}
