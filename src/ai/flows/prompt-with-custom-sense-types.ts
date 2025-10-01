// Input interface for the flow
export interface PromptWithCustomSenseInput {
  userApiKey?: string;
  modelId?: string;
  designType: string; // The selected design type (e.g., "Vector Design", "POD Design")
  description: string; // User's description of what they want
  userName?: string;
  profile?: any;
}

// Output interfaces for the flow
export interface PromptVariation {
  title: string; // Style title (e.g., "Exactly Similar", "Modern Style")
  prompt: string; // The generated prompt
}

export interface PromptWithCustomSenseOutput {
  prompts: PromptVariation[];
}
