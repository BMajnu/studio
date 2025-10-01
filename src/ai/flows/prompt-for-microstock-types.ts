// Define content type
export type ContentType = 'photography' | 'vector';

// Input interface for the flow
export interface PromptForMicrostockInput {
  userApiKey?: string;
  modelId?: string;
  contentType: ContentType; // Required content type (photography or vector)
  designNiche: string; // The design/image niche (e.g., "Vector illustration", "Abstract background")
  subNiche?: string; // Optional sub-niche (e.g., "Nature", "Technology")
  detailedDescription?: string; // Optional detailed description of what they're looking for
  userName?: string;
  profile?: any;
}

// Metadata interface for each prompt
export interface PromptMetadata {
  title: string;
  keywords: string[];
  mainCategory: string;
  subcategory: string;
}

// Interface for prompt with metadata
export interface PromptWithMetadata {
  prompt: string;
  metadata: PromptMetadata;
}

// Output interface for the flow
export interface PromptForMicrostockOutput {
  results: PromptWithMetadata[];
}
