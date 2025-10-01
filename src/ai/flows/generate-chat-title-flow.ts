'use server';
/**
 * @fileOverview Generates a concise chat session title using Gemini.
 * Always defaults to the gemini-2.5-flash-lite-preview-06-17 model unless the caller specifies otherwise.
 */

import { GoogleAIService } from '@/lib/services/google-ai-service';
import { z } from 'zod';

// -------------------------
// Schemas
// -------------------------

const ChatMessageSchema = z.object({
  role: z.enum(['user', 'assistant', 'system']).optional(),
  text: z.string(),
});

const GenerateChatTitleInputSchema = z.object({
  messages: z.array(ChatMessageSchema).describe('Recent chat messages to summarise'),
  modelId: z.string().optional().describe('Optional Genkit model ID to override default'),
  userApiKey: z.string().optional().describe('User-provided Gemini API key'),
});
export type GenerateChatTitleInput = z.infer<typeof GenerateChatTitleInputSchema>;

const GenerateChatTitleOutputSchema = z.object({
  title: z.string().describe('A short, descriptive chat title (ideally ≤ 5 words)')
});
export type GenerateChatTitleOutput = z.infer<typeof GenerateChatTitleOutputSchema>;

// -------------------------
// Constants
// -------------------------

// Default model for title generation - using flash-lite-latest with fallback to preview models
const DEFAULT_TITLE_MODEL = 'googleai/gemini-flash-lite-latest';
const FALLBACK_TITLE_MODELS = [
  'googleai/gemini-2.5-flash-lite-preview-06-17',
  'googleai/gemini-2.0-flash-lite-preview-12-18',
  'googleai/gemini-1.5-flash-lite-preview',
];

// -------------------------
// Helper – build prompt text
// -------------------------
function buildPrompt(messages: GenerateChatTitleInput['messages']): string {
  const latestConversation = messages
    .slice(-10) // only last 10 messages for brevity
    .map((m) => `${m.role || 'user'}: ${m.text}`)
    .join('\n');

  return `You are an AI assistant tasked with creating a concise chat session title.\n\n` +
    `Conversation:\n${latestConversation}\n\n` +
    `Rules:\n` +
    `1. Respond with ONLY the title.\n` +
    `2. Maximum 5 words.\n` +
    `3. Use Title Case.\n`;
}

// -------------------------
// Flow implementation
// -------------------------

export async function generateChatTitle(input: GenerateChatTitleInput): Promise<string> {
  const { messages, modelId, userApiKey } = input;
  
  // Build prompt
  const promptText = buildPrompt(messages);

  // Create a minimal profile for GoogleAIService
  const apiKey = userApiKey || process.env.GOOGLE_API_KEY || '';
  const profile = apiKey ? { 
    userId: 'temp', 
    name: 'temp',
    services: [],
    geminiApiKeys: [apiKey] 
  } as any : null;
  
  if (!profile) {
    throw new Error('No API key available for generating chat title');
  }

  // Try models with fallback
  // Always constrain title generation to lite models unless caller explicitly forces it
  const modelsToTry = modelId && modelId.startsWith('googleai/') && modelId.includes('flash-lite')
    ? [modelId]
    : [DEFAULT_TITLE_MODEL, ...FALLBACK_TITLE_MODELS];

  let lastError: Error | null = null;

  for (const modelIdWithPrefix of modelsToTry) {
    try {
      // The GoogleAIService expects the model name *without* the 'googleai/' prefix.
      const modelToUse = modelIdWithPrefix.replace(/^googleai\//, '');
      
      console.log(`🏷️  [TITLE GENERATION] Using LITE model: ${modelToUse}`);
      
      // Call GoogleAIService directly (simpler and avoids Genkit parsing quirks)
      const service = new GoogleAIService({ 
        modelId: modelToUse,
        profile 
      });
      const { text } = await service.generateContent(promptText);

      console.log(`✅ [TITLE GENERATION] Success with model: ${modelToUse}`);
      return text.replace(/\n/g, ' ').trim();
    } catch (error) {
      console.warn(`Chat title generation failed with model ${modelIdWithPrefix}:`, error);
      lastError = error as Error;
      // Continue to next model
    }
  }

  // If all models failed, throw the last error
  throw lastError || new Error('All chat title generation models failed');
}

// Optional: convenience wrapper matching older API (returns object)
export async function generateChatTitleFlow(input: GenerateChatTitleInput): Promise<GenerateChatTitleOutput> {
  const title = await generateChatTitle(input);
  return { title };
} 