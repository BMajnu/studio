import { z } from 'zod';

// Input schema for the flow
export const PromptWithCustomSenseInputSchema = z.object({
  userApiKey: z.string().optional(),
  modelId: z.string().optional(),
  designType: z.string(), // The selected design type (e.g., "Vector Design", "POD Design")
  description: z.string(), // User's description of what they want
  userName: z.string().optional(),
});

export type PromptWithCustomSenseInput = z.infer<typeof PromptWithCustomSenseInputSchema>;

// Output schema for the flow
export const PromptWithCustomSenseOutputSchema = z.object({
  prompts: z.array(z.object({
    title: z.string(), // Style title (e.g., "Exactly Similar", "Modern Style")
    prompt: z.string(), // The generated prompt
  })),
});

export type PromptWithCustomSenseOutput = z.infer<typeof PromptWithCustomSenseOutputSchema>;

// Internal schema for prompt generation
export const PromptWithCustomSensePromptInputSchema = z.object({
  designType: z.string(),
  description: z.string(),
  userName: z.string().optional(),
});

// Output schema for the AI prompt
export const PromptWithCustomSensePromptOutputSchema = z.object({
  exactlySimilarPrompt: z.string(),
  modernStylePrompt: z.string(),
  vintageStylePrompt: z.string(),
  sciFiStylePrompt: z.string(),
  colorfulStylePrompt: z.string(),
}); 