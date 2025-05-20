
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
    attachedFilesData?: AttachedFile[]; 
    messageIdToRegenerate?: string; 
  };
}

export interface ProcessedClientMessageOutput {
  analysis?: string;
  simplifiedRequest?: string;
  stepByStepApproach?: string;
  bengaliTranslation?: string; 
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
  isDriveSession?: boolean; 
  driveFileId?: string; // Actual Google Drive file ID
}

export interface ChatSession {
  id: string; // App's internal session ID
  name: string;
  messages: ChatMessage[];
  createdAt: number; 
  updatedAt: number; 
  userId: string; 
  driveFileId?: string; // Optional: Actual Google Drive file ID if synced
}

export interface DriveFile {
  id: string; // Google Drive's file ID
  name: string; // Filename on Google Drive
  mimeType: string;
  modifiedTime?: string;
  appProperties?: Record<string, string>; // To store app's session ID
}
