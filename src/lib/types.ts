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
  | 'generateDesignPrompts'
  | 'generateEditingPrompts'
  | 'checkBestDesign'
  | 'promptToReplicate'
  | 'promptWithCustomSense'
  | 'promptForMicroStockMarkets'
  | 'custom';

export interface DesignListItem {
  id: string;
  title: string;
  description: string;
  textContent?: string;
}

export interface BilingualContent {
  english: string | string[];
  bengali: string | string[];
}

export type ChatMessageContentPart =
  | { type: 'text'; title?: string; text: string }
  | { type: 'code'; title?: string; language?: string; code: string }
  | { type: 'list'; title?: string; items: string[] }
  | { 
      type: 'translation_group'; 
      title?: string; 
      english?: { 
        analysis?: string; 
        simplifiedRequest?: string; 
        stepByStepApproach?: string 
      }; 
      bengali?: { 
        analysis?: string; 
        simplifiedRequest?: string; 
        stepByStepApproach?: string 
      } 
    }
  | { 
      type: 'bilingual_analysis';
  title?: string; 
      keyPoints: BilingualContent;
      detailedRequirements: BilingualContent;
      designMessage: BilingualContent;
      nicheAndAudience: BilingualContent;
      designItems: {
        english: DesignListItem[];
        bengali: DesignListItem[];
      };
    }
  | { type: 'search_keywords'; title?: string; keywords: Array<{ text: string, url: string }> }
  | { type: 'custom'; title?: string; text?: string; code?: string; language?: string; items?: string[]; english?: { analysis?: string, simplifiedRequest?: string, stepByStepApproach?: string }; bengali?: { analysis?: string, simplifiedRequest?: string, stepByStepApproach?: string }; suggestions?: { english: string[], bengali: string[] }; data?: any; ideas?: { category: string, items: string[] }[]; imageDataUri?: string; exactReplicationPrompt?: string; similarWithTweaksPrompt?: string; sameNichePrompt?: string; customPrompts?: { title: string, prompt: string }[]; microstockResults?: { 
    prompt: string; 
    metadata: { 
      title: string; 
      keywords: string[]; 
      mainCategory: string; 
      subcategory: string; 
    }; 
  }[]; }
  | { type: 'suggested_replies'; title?: string; text?: string; english?: { analysis?: string, simplifiedRequest?: string, stepByStepApproach?: string }; bengali?: { analysis?: string, simplifiedRequest?: string, stepByStepApproach?: string }; suggestions?: { english: string[], bengali: string[] } }
  | { type: 'top_designs'; title?: string; text?: string; code?: string; language?: string; items?: string[]; english?: { analysis?: string, simplifiedRequest?: string, stepByStepApproach?: string }; bengali?: { analysis?: string, simplifiedRequest?: string, stepByStepApproach?: string }; data?: any }
  | { type: 'design_idea'; title?: string; text?: string; code?: string; language?: string; english?: { analysis?: string, simplifiedRequest?: string, stepByStepApproach?: string }; bengali?: { analysis?: string, simplifiedRequest?: string, stepByStepApproach?: string }; imageDataUri?: string }
  | { type: 'design_ideas_group'; title?: string; ideas: { category: string, items: string[] }[] }
  | { type: 'design_prompts_tabs'; title?: string; promptsData: DesignPromptsData[] }
  | { type: 'prompt_tabs'; title?: string; text?: string; code?: string; language?: string; english?: { analysis?: string, simplifiedRequest?: string, stepByStepApproach?: string }; bengali?: { analysis?: string, simplifiedRequest?: string, stepByStepApproach?: string }; imageDataUri?: string; exactReplicationPrompt?: string; similarWithTweaksPrompt?: string; sameNichePrompt?: string; customPrompts?: { title: string, prompt: string }[]; microstockResults?: { 
    prompt: string; 
    metadata: { 
      title: string; 
      keywords: string[]; 
      mainCategory: string; 
      subcategory: string; 
    }; 
  }[] }
  | { type: 'custom_prompts_tabs'; title?: string; text?: string; code?: string; language?: string; english?: { analysis?: string, simplifiedRequest?: string, stepByStepApproach?: string }; bengali?: { analysis?: string, simplifiedRequest?: string, stepByStepApproach?: string }; customPrompts?: { title: string, prompt: string }[] }
  | { type: 'microstock_results_tabs'; title?: string; text?: string; code?: string; language?: string; english?: { analysis?: string, simplifiedRequest?: string, stepByStepApproach?: string }; bengali?: { analysis?: string, simplifiedRequest?: string, stepByStepApproach?: string }; microstockResults?: { 
    prompt: string; 
    metadata: { 
      title: string; 
      keywords: string[]; 
      mainCategory: string; 
      subcategory: string; 
    }; 
  }[] }

export interface AttachedFile {
  name: string;
  type: string;
  size: number;
  dataUri?: string; 
  textContent?: string; 
}

export interface DesignPromptsData {
  category: string;
  prompts: string[];
}

export interface EditHistoryEntry {
  content: string | ChatMessageContentPart[]; // User message content for this version
  timestamp: number; // Timestamp of this user message version
  attachedFiles?: AttachedFile[];
  actionType?: ActionType; // The action type used for this message version
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
  actionType?: ActionType; // Action type used to generate this message
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
