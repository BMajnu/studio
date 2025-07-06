'use server';
/**
 * @fileOverview Generates a concise chat session title using Gemini.
 * Always defaults to the gemini-2.5-flash-lite-preview-06-17 model unless the caller specifies otherwise.
 */

import { GoogleAIService } from '@/lib/services/google-ai-service';
import { z } from 'genkit';

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

const DEFAULT_TITLE_MODEL = 'googleai/gemini-2.5-flash-lite-preview-06-17';

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
  const modelIdWithPrefix = modelId || DEFAULT_TITLE_MODEL;

  // The GoogleAIService expects the model name *without* the 'googleai/' prefix.
  const modelToUse = modelIdWithPrefix.replace(/^googleai\//, '');

  // Build prompt
  const promptText = buildPrompt(messages);

  // Call GoogleAIService directly (simpler and avoids Genkit parsing quirks)
  const service = new GoogleAIService({ apiKey: userApiKey || process.env.GOOGLE_API_KEY, modelId: modelToUse, useAlternativeImpl: true });
  const { text } = await service.generateContent(promptText);

  return text.replace(/\n/g, ' ').trim();
}

// Optional: convenience wrapper matching older API (returns object)
export async function generateChatTitleFlow(input: GenerateChatTitleInput): Promise<GenerateChatTitleOutput> {
  const title = await generateChatTitle(input);
  return { title };
} 