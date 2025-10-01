// Input interface
export interface PromptToReplicateInput {
  userApiKey?: string;
  modelId?: string;
  imageDataUris: string[]; // Array of image data URIs
  userName?: string;
  profile?: any;
}

// Output interfaces
export interface ImagePromptResult {
  imageDataUri: string;
  exactReplicationPrompt: string;
  similarWithTweaksPrompt: string;
  sameNichePrompt: string;
}

export interface PromptToReplicateOutput {
  imagePrompts: ImagePromptResult[];
}
