import { z } from 'zod';

// Define content type enum
export const ContentTypeEnum = z.enum(['photography', 'vector']);
export type ContentType = z.infer<typeof ContentTypeEnum>;

// Input schema for the flow
export const PromptForMicrostockInputSchema = z.object({
  userApiKey: z.string().optional(),
  modelId: z.string().optional(),
  contentType: ContentTypeEnum, // Required content type (photography or vector)
  designNiche: z.string(), // The design/image niche (e.g., "Vector illustration", "Abstract background")
  subNiche: z.string().optional(), // Optional sub-niche (e.g., "Nature", "Technology")
  detailedDescription: z.string().optional(), // Optional detailed description of what they're looking for
  userName: z.string().optional(),
});

export type PromptForMicrostockInput = z.infer<typeof PromptForMicrostockInputSchema>;

// Metadata schema for each prompt
export const PromptMetadataSchema = z.object({
  title: z.string(),
  keywords: z.array(z.string()),
  mainCategory: z.string(),
  subcategory: z.string(),
});

// Schema for prompt with metadata
export const PromptWithMetadataSchema = z.object({
  prompt: z.string(),
  metadata: PromptMetadataSchema,
});

// Output schema for the flow
export const PromptForMicrostockOutputSchema = z.object({
  results: z.array(PromptWithMetadataSchema),
});

export type PromptMetadata = z.infer<typeof PromptMetadataSchema>;
export type PromptWithMetadata = z.infer<typeof PromptWithMetadataSchema>;
export type PromptForMicrostockOutput = z.infer<typeof PromptForMicrostockOutputSchema>;

// Internal schema for prompt generation
export const PromptForMicrostockPromptInputSchema = z.object({
  contentType: ContentTypeEnum,
  designNiche: z.string(),
  subNiche: z.string().optional(),
  detailedDescription: z.string().optional(),
  userName: z.string().optional(),
});

// Output schema for the AI prompt
export const PromptForMicrostockPromptOutputSchema = z.object({
  prompts: z.array(z.object({
    prompt: z.string(),
    metadata: z.object({
      title: z.string(),
      keywords: z.array(z.string()),
      mainCategory: z.string(),
      subcategory: z.string(),
    }),
  })),
}); 