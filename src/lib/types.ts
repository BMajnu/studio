
export interface UserProfile {
  userId: string; 
  name: string;
  professionalTitle?: string;
  yearsOfExperience?: number;
  portfolioLink?: string;
  communicationStyleNotes?: string;
  services: string[];
  fiverrUsername?: string;
  geminiApiKeys?: string[]; // Changed from geminiApiKey: string to string[]
  selectedGenkitModelId?: string;
  customSellerFeedbackTemplate?: string;
  customClientFeedbackResponseTemplate?: string;
  rawPersonalStatement?: string;
  createdAt?: string; 
  updatedAt?: string; 
}

export type MessageRole = 'user' | 'assistant' | 'system';

export type ActionType =
  | 'processMessage'
  | 'analyzeRequirements'
  | 'generateEngagementPack'
  | 'generateDeliveryTemplates'
  | 'checkMadeDesigns'
  | 'generateRevision'
  | 'generateDesignIdeas'
  | 'generateDesignPrompts'
  | 'generateEditingPrompts'; 

export interface ChatMessageContentPart {
  type: 'text' | 'code' | 'list' | 'translation_group';
  title?: string; 
  text?: string; 
  code?: string; 
  language?: string; 
  items?: string[]; 
  english?: { analysis?: string, simplifiedRequest?: string, stepByStepApproach?: string }; 
  bengali?: { analysis?: string, simplifiedRequest?: string, stepByStepApproach?: string }; 
}

export interface AttachedFile {
  name: string;
  type: string;
  size: number;
  dataUri?: string; 
  textContent?: string; 
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
  canRegenerate?: boolean;
  originalRequest?: {
    actionType: ActionType;
    messageText: string;
    notes?: string;
    attachedFilesData?: AttachedFile[]; // These are the processed files used for the original request
    messageIdToRegenerate?: string; 
  };
}

// AI Flow input/output types (re-exporting or extending if needed)
export interface ProcessedClientMessageOutput {
  analysis?: string;
  simplifiedRequest?: string;
  stepByStepApproach?: string;
  bengaliTranslation?: string; // This likely contains the combined Bengali text
  // englishReplies and bengaliReplies were part of an older version, keep for reference if needed by other parts, but processMessage might not directly output them now
}

export interface PlatformMessagesOutput {
  messages: { message: string, type: string }[]; // Changed structure based on recent flow updates
}

// Chat History Types
export interface ChatSessionMetadata {
  id: string;
  name: string;
  lastMessageTimestamp: number;
  preview: string; 
  messageCount: number;
  isDriveSession?: boolean; // To indicate if it was primarily sourced/synced from Drive
}

export interface ChatSession {
  id: string;
  name: string;
  messages: ChatMessage[];
  createdAt: number; 
  updatedAt: number; 
  userId: string; 
}

