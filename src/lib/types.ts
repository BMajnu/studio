
export interface UserProfile {
  userId: string; // For future use with auth
  name: string;
  professionalTitle?: string;
  yearsOfExperience?: number;
  portfolioLink?: string;
  communicationStyleNotes?: string;
  services: string[];
  fiverrUsername?: string;
  geminiApiKeys?: string[];
  selectedGenkitModelId?: string;
  customSellerFeedbackTemplate?: string;
  customClientFeedbackResponseTemplate?: string;
  rawPersonalStatement?: string;
  createdAt?: string; // ISO Date string
  updatedAt?: string; // ISO Date string
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
  | 'generateDesignPrompts';

export interface ChatMessageContentPart {
  type: 'text' | 'code' | 'list' | 'translation_group';
  title?: string; // For code blocks or sections
  text?: string; // For text parts
  code?: string; // For code parts
  language?: string; // For code parts, e.g., 'json', 'markdown'
  items?: string[]; // For list parts
  english?: { analysis?: string, simplifiedRequest?: string, stepByStepApproach?: string }; // For translation groups
  bengali?: { analysis?: string, simplifiedRequest?: string, stepByStepApproach?: string }; // For translation groups
}

export interface AttachedFile {
  name: string;
  type: string;
  size: number;
  dataUri?: string; // For images
  textContent?: string; // For text files
}
export interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string | ChatMessageContentPart[]; // Can be simple text or structured content
  timestamp: number;
  isLoading?: boolean;
  isError?: boolean;
  profileUsed?: Partial<UserProfile>; // To show which profile was active for this AI message
  attachedFiles?: AttachedFile[]; // Files attached with this specific message (primarily for user messages)
  canRegenerate?: boolean;
  originalRequest?: {
    actionType: ActionType;
    messageText: string;
    notes?: string;
    attachedFilesData?: AttachedFile[];
    messageIdToRegenerate?: string; // ID of the assistant message being regenerated
  };
}

// AI Flow input/output types (re-exporting or extending if needed)
export interface ProcessedClientMessageOutput {
  analysis?: string;
  simplifiedRequest?: string;
  stepByStepApproach?: string;
  bengaliTranslation?: string;
  englishReplies?: string[];
  bengaliReplies?: string[];
}

export interface PlatformMessagesOutput {
  deliveryOrRevisionMessages: { message: string, type: string }[];
  followUpMessages: { message: string, type: string }[];
}

// Chat History Types
export interface ChatSessionMetadata {
  id: string;
  name: string;
  lastMessageTimestamp: number;
  preview: string; // First few words of the first user message or last message
  messageCount: number;
}

export interface ChatSession {
  id: string;
  name: string;
  messages: ChatMessage[];
  createdAt: number; // Timestamp
  updatedAt: number; // Timestamp
  userId: string; // Associate with a user
}

