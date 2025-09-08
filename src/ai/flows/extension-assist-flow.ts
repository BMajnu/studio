import type { AttachedFile } from '@/lib/types';
import type { ProcessCustomInstructionFlowOutput } from './process-custom-instruction-flow';
import { processCustomInstructionFlow } from './process-custom-instruction-flow';
import type { UserProfile } from '@/lib/types';

export type ExtensionAssistFlowInput = {
  clientMessage: string;
  customInstruction: string;
  language?: 'english' | 'bengali' | 'both';
  chatHistory?: Array<{ role: 'user' | 'assistant'; text: string; timestamp?: number }>;
  attachedFiles?: AttachedFile[];
  profile?: Partial<UserProfile> | null;
};

/**
 * A thin wrapper around processCustomInstructionFlow that injects
 * the user's profile context (name, professionalTitle, communication style,
 * preferred model, and first Gemini API key) so the extension behavior
 * is personalized without duplicating the main flow logic.
 */
export async function extensionAssistFlow(input: ExtensionAssistFlowInput): Promise<ProcessCustomInstructionFlowOutput> {
  const { clientMessage, customInstruction, language, chatHistory, attachedFiles, profile } = input;

  const envKey = process.env.GEMINI_API_KEY || (process as any).env?.GOOGLE_API_KEY || (process as any).env?.GOOGLE_AI_API_KEY;
  const effectiveUserKey = Array.isArray(profile?.geminiApiKeys) && profile!.geminiApiKeys!.length > 0
    ? profile!.geminiApiKeys![0]
    : (envKey || undefined);

  return await processCustomInstructionFlow({
    clientMessage,
    customInstruction,
    language,
    chatHistory,
    attachedFiles,
    userName: profile?.name,
    professionalTitle: profile?.professionalTitle,
    communicationStyleNotes: profile?.communicationStyleNotes,
    modelId: profile?.selectedGenkitModelId,
    userApiKey: effectiveUserKey,
  });
}
