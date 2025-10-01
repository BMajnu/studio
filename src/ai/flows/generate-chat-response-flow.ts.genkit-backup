'use server';
/**
 * @fileOverview Generates chat responses focused on graphic design assistance.
 *
 * - generateChatResponse - A function to process chat messages and provide design-focused responses.
 * - GenerateChatResponseInput - The input type for the generateChatResponse function.
 * - GenerateChatResponseOutput - The return type for the generateChatResponse function.
 */

import { z } from 'genkit';
import { DEFAULT_MODEL_ID } from '@/lib/constants';
import { GeminiClient } from '@/lib/ai/gemini-client';
import { createGeminiAiInstance } from '@/lib/ai/genkit-utils';

// DEBUG logging helper
const logDebug = (label: string, ...args: any[]) => {
  try { console.log(`[generateChatResponse] ${label}`, ...args); } catch(_){}
};

const AttachedFileSchema = z.object({
  name: z.string().describe("Name of the file"),
  type: z.string().describe("MIME type of the file"),
  dataUri: z.string().optional().describe("Base64 data URI for image files"),
  textContent: z.string().optional().describe("Text content for text files")
});

const ChatHistoryMessageSchema = z.object({
  role: z.enum(['user', 'assistant']),
  text: z.string(),
});

// Schema for the flow's input
const GenerateChatResponseFlowInputSchema = z.object({
  userMessage: z.string().describe('The user message to respond to'),
  userName: z.string().describe('The name of the user'),
  attachedFiles: z.array(AttachedFileSchema).optional().describe("Files attached by the user"),
  chatHistory: z.array(ChatHistoryMessageSchema).optional().describe("Recent chat history"),
  modelId: z.string().optional().describe('The Genkit model ID to use'),
  userApiKey: z.string().optional().describe('User-provided Gemini API key'),
});
export type GenerateChatResponseInput = z.infer<typeof GenerateChatResponseFlowInputSchema>;

// Schema for the prompt's specific input
const GenerateChatResponsePromptInputSchema = z.object({
  userMessage: z.string().describe('The user message to respond to'),
  userName: z.string().describe('The name of the user'),
  attachedFiles: z.array(AttachedFileSchema).optional().describe("Files attached by the user"),
  chatHistory: z.array(ChatHistoryMessageSchema).optional().describe("Recent chat history"),
});

// Output schema - bilingual responses
const GenerateChatResponseOutputSchema = z.object({
  responseEnglish: z.string().describe('The chat response in English'),
  responseBengali: z.string().describe('The chat response in Bengali'),
  suggestedActions: z.array(z.string()).optional().describe('Suggested follow-up actions or questions'),
  designTips: z.array(z.string()).optional().describe('Quick design tips related to the conversation'),
});
export type GenerateChatResponseOutput = z.infer<typeof GenerateChatResponseOutputSchema>;

export async function generateChatResponse(flowInput: GenerateChatResponseInput): Promise<GenerateChatResponseOutput> {
  const flowName = 'generateChatResponse';
  logDebug('Starting flow with input', { ...flowInput, userApiKey: flowInput.userApiKey ? '***' : undefined });

  const { modelId = DEFAULT_MODEL_ID, userApiKey, ...promptInputData } = flowInput;
  const modelToUse = modelId;
  
  const profileStub = {
    userId: 'default',
    name: 'User',
    services: [],
    geminiApiKeys: userApiKey ? [String(userApiKey)] : [],
  };
  try {
    const keyCount = Array.isArray(profileStub.geminiApiKeys) ? profileStub.geminiApiKeys.length : 0;
    logDebug('profile stub prepared', { hasUserKey: Boolean(userApiKey), keyCount });
  } catch {}

  const client = new GeminiClient({ profile: profileStub });
  
  const actualPromptInputData = {
    ...promptInputData,
    attachedFiles: promptInputData.attachedFiles?.map(file => ({
      ...file,
      dataUri: file.dataUri ? `{{media url=${file.dataUri}}}` : undefined,
    })),
  };

  const promptText = `You are a professional graphic design assistant helping ${promptInputData.userName}. Provide helpful, creative, and practical design advice.

Context:
- User Message: ${promptInputData.userMessage}
${promptInputData.chatHistory ? `- Chat History: ${JSON.stringify(promptInputData.chatHistory)}` : ''}
${promptInputData.attachedFiles ? `- Attached Files: ${promptInputData.attachedFiles.length} file(s)` : ''}

Your Role:
1. Provide expert graphic design guidance
2. Suggest creative solutions and alternatives
3. Explain design principles when relevant
4. Offer practical implementation tips
5. Be encouraging and supportive

Response Guidelines:
- Be conversational but professional
- Focus on actionable advice
- Include specific examples when helpful
- Consider both aesthetic and functional aspects
- Provide responses in both English and Bengali
- IMPORTANT Bengali rules:
  - When translating common English greetings like "Hello", "Hi", or "Hey", use "আসসালামু আলাইকুম" instead of "নমস্কার".
  - Prefer modern, widely-understood Bangla. Keep proper nouns in original where appropriate.
  - Preserve markdown formatting (bold, lists, headings) in both languages.

Suggested Actions Style (IMPORTANT):
- The \'suggestedActions\' array must contain up to 5 SHORT user-to-AI request prompts (what the user would click to ask you next).
- Phrase them as first-person, imperative, or direct requests from the USER to the AI (e.g., "Create...", "Generate...", "Summarize...").
- DO NOT ask the user questions here. Avoid question marks unless they are part of a request like "Can you generate ...".
- Keep each suggestion concise and specific to the user\'s context.

Design Areas to Consider:
- Typography and font selection
- Color theory and palettes
- Layout and composition
- Branding and identity
- Digital and print design differences
- Design software tips
- Current design trends
- Accessibility in design

Output Format (JSON):
{
  "responseEnglish": "Your helpful response in English",
  "responseBengali": "আপনার সহায়ক প্রতিক্রিয়া বাংলায়",
  "suggestedActions": [
    "Create a concise design brief from my message",
    "Generate 3 logo concept directions with color and typography suggestions",
    "Propose a color palette and font pairings for this brand",
    "Outline a step-by-step plan to deliver the design",
    "Summarize key requirements and prepare a client-ready reply"
  ],
  "designTips": ["Quick tip 1", "Design principle 2"]
}`;

  try {
    const { data: output, apiKeyUsed } = await client.request(async (apiKey) => {
      const instance = createGeminiAiInstance(apiKey);
      const promptDef = instance.definePrompt({
        name: `${flowName}Prompt_${Date.now()}`,
        input: { schema: GenerateChatResponsePromptInputSchema },
        output: { schema: GenerateChatResponseOutputSchema },
        prompt: promptText
      });
      const { output } = await promptDef(actualPromptInputData, { model: modelToUse });
      if (!output) throw new Error('AI returned empty output');
      return output;
    });
    console.log(`INFO (${flowName}): AI call succeeded using key ending with ...${apiKeyUsed.slice(-4)}`);
    return output as GenerateChatResponseOutput;
  } catch (error) {
    console.error(`ERROR (${flowName}): Failed after rotating keys:`, error);
    throw new Error(`AI call failed in ${flowName}. ${(error as Error).message}`);
  }
}
