export interface UserProfile {
  userId: string; // For future use with auth
  name: string;
  professionalTitle?: string;
  yearsOfExperience?: number;
  portfolioLink?: string;
  communicationStyleNotes?: string;
  services: string[];
  fiverrUsername?: string;
  geminiApiKey?: string; // Stored but might not be used by current flows
  customSellerFeedbackTemplate?: string;
  customClientFeedbackResponseTemplate?: string;
  createdAt?: string; // ISO Date string
  updatedAt?: string; // ISO Date string
}

export type MessageRole = 'user' | 'assistant' | 'system';

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
export interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string | ChatMessageContentPart[]; // Can be simple text or structured content
  timestamp: number;
  isLoading?: boolean;
  isError?: boolean;
  profileUsed?: Partial<UserProfile>; // To show which profile was active for this AI message
}

// AI Flow input/output types (re-exporting or extending if needed)
// For now, directly use from src/ai/flows
// import type { ProcessClientMessageInput, ProcessClientMessageOutput } from '@/ai/flows/process-client-message';
// import type { GeneratePlatformMessagesInput, GeneratePlatformMessagesOutput } from '@/ai/flows/generate-platform-messages';
// import type { SuggestClientRepliesInput, SuggestClientRepliesOutput } from '@/ai/flows/suggest-client-replies';

export interface ProcessedClientMessageOutput {
  analysis?: string;
  simplifiedRequest?: string;
  stepByStepApproach?: string;
  bengaliTranslation?: string; // This is a single string in the AI output
                               // but might be better structured if possible.
                               // For now, matching the flow.
  englishReplies?: string[];
  bengaliReplies?: string[];
}

export interface PlatformMessagesOutput {
  deliveryOrRevisionMessages: { message: string, type: string }[]; // type will be 'delivery' or 'revision'
  followUpMessages: { message: string, type: string }[]; // type will be 'follow-up'
}
