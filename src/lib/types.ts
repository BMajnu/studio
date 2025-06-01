export interface UserProfile {
  userId: string; 
  name: string;
  professionalTitle?: string;
  yearsOfExperience?: number;
  portfolioLink?: string;
  communicationStyleNotes?: string;
  services: string[];
  fiverrUsername?: string;
  geminiApiKeys?: string[]; 
  selectedGenkitModelId?: string;
  useAlternativeAiImpl?: boolean;
  useFirebaseAI?: boolean;
  customSellerFeedbackTemplate?: string;
  customClientFeedbackResponseTemplate?: string;
  rawPersonalStatement?: string;
  createdAt?: string; 
  updatedAt?: string; 
}

export type MessageRole = 'user' | 'assistant' | 'system';

export type ActionType =
  | 'search'
  | 'processMessage'
  | 'analyzeRequirements'
  | 'generateEngagementPack'
  | 'generateDeliveryTemplates'
  | 'checkMadeDesigns'
  | 'generateRevision'
  | 'generateDesignIdeas'
  | 'generateDesignPrompts'
  | 'generateEditingPrompts'
  | 'checkBestDesign'
  | 'promptToReplicate'
  | 'promptWithCustomSense'
  | 'promptForMicroStockMarkets';

export interface ChatMessageContentPart {
  type: 'text' | 'code' | 'list' | 'translation_group' | 'custom' | 'suggested_replies' | 'top_designs' | 'design_idea' | 'design_ideas_group' | 'prompt_tabs' | 'custom_prompts_tabs' | 'microstock_results_tabs';
  title?: string; 
  text?: string; 
  code?: string; 
  language?: string; 
  items?: string[]; 
  english?: { analysis?: string, simplifiedRequest?: string, stepByStepApproach?: string }; 
  bengali?: { analysis?: string, simplifiedRequest?: string, stepByStepApproach?: string }; 
  suggestions?: { english: string[], bengali: string[] }; // For suggested_replies type
  data?: any; // For top_designs type, holds the CheckBestDesignOutput data
  ideas?: { category: string, items: string[] }[]; // For design_ideas_group type, holds ideas grouped by category
  imageDataUri?: string; // For prompt_tabs type, holds the image data URI
  exactReplicationPrompt?: string; // For prompt_tabs type
  similarWithTweaksPrompt?: string; // For prompt_tabs type
  sameNichePrompt?: string; // For prompt_tabs type
  customPrompts?: { title: string, prompt: string }[]; // For custom_prompts_tabs type, holds all custom prompts
  microstockResults?: { 
    prompt: string; 
    metadata: { 
      title: string; 
      keywords: string[]; 
      mainCategory: string; 
      subcategory: string; 
    }; 
  }[]; // For microstock_results_tabs type, holds microstock prompts with metadata
}

export interface AttachedFile {
  name: string;
  type: string;
  size: number;
  dataUri?: string; 
  textContent?: string; 
}

export interface EditHistoryEntry {
  content: string | ChatMessageContentPart[]; // User message content for this version
  timestamp: number; // Timestamp of this user message version
  attachedFiles?: AttachedFile[];
  linkedAssistantMessageId?: string; // ID of the assistant message that responded to THIS user version
}

export interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string | ChatMessageContentPart[]; 
  timestamp: number;
  isLoading?: boolean;
  isError?: boolean;
  profileUsed?: Partial<UserProfile>; 
  attachedFiles?: AttachedFile[]; 
  canRegenerate?: boolean; // For assistant messages
  originalRequest?: { // For assistant messages, to enable regeneration
    actionType: ActionType;
    messageText: string;
    notes?: string;
    attachedFilesData?: AttachedFile[]; 
    messageIdToRegenerate?: string; // The ID of the assistant message being regenerated
  };
  // For user messages, to store previous versions of their own content & the AI response to that version
  editHistory?: EditHistoryEntry[]; 
  // For assistant messages, to link them to the user message that prompted them
  promptedByMessageId?: string; 
  // For user messages, to link them to the assistant message that replied to their *current* version
  linkedAssistantMessageId?: string; 
}


export interface ProcessedClientMessageOutput {
  analysis?: string;
  simplifiedRequest?: string;
  stepByStepApproach?: string;
  bengaliTranslation?: string; 
  suggestedEnglishReplies?: string[];
  suggestedBengaliReplies?: string[];
}

export interface PlatformMessagesOutput {
  messages: { message: string, type: string }[]; 
}

export interface ChatSessionMetadata {
  id: string; // App's internal session ID
  name: string;
  lastMessageTimestamp: number;
  preview: string; 
  messageCount: number;
}

export interface ChatSession {
  id: string; // App's internal session ID
  name: string;
  messages: ChatMessage[];
  createdAt: number; 
  updatedAt: number; 
  userId: string; 
  modelId?: string; // Added for storing model used for name generation or general session model
}
