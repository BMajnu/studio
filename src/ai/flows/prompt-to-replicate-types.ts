import { z } from 'zod';

// Input schema for the flow
export const PromptToReplicateInputSchema = z.object({
  userApiKey: z.string().optional(),
  modelId: z.string().optional(),
  imageDataUris: z.array(z.string()), // Array of image data URIs
  userName: z.string().optional(),
});

export type PromptToReplicateInput = z.infer<typeof PromptToReplicateInputSchema>;

// Output schema for the flow
export const PromptToReplicateOutputSchema = z.object({
  imagePrompts: z.array(z.object({
    imageDataUri: z.string(),
    exactReplicationPrompt: z.string(),
    similarWithTweaksPrompt: z.string(),
    sameNichePrompt: z.string(),
  })),
});

export type PromptToReplicateOutput = z.infer<typeof PromptToReplicateOutputSchema>;

// Input schema for the prompt (internal to the flow, but good to keep with related types)
export const PromptToReplicatePromptInputSchema = z.object({
  imageDataUri: z.string(),
  userName: z.string().optional(),
});

// Output schema for the prompt (internal to the flow)
export const PromptReplicateOutputSchema = z.object({
  exactReplicationPrompt: z.string(),
  similarWithTweaksPrompt: z.string(),
  sameNichePrompt: z.string(),
}); 