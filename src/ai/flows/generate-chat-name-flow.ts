'use server';
/**
 * @fileOverview Generates a concise name for a chat session.
 *
 * - generateChatName - A function that generates a chat name based on initial messages.
 * - GenerateChatNameInput - The input type for the generateChatName function.
 * - GenerateChatNameOutput - The return type for the generateChatName function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { DEFAULT_MODEL_ID } from '@/lib/constants';
import { genkit } from 'genkit';
import { googleAI } from '@genkit-ai/googleai';

// Schema for the flow's input, including modelId and userApiKey
const GenerateChatNameFlowInputSchema = z.object({
  firstUserMessage: z.string().describe("The first message sent by the user in the chat."),
  firstAssistantMessage: z.string().optional().describe("The first reply from the assistant, if available."),
  modelId: z.string().optional().describe('The Genkit model ID to use for this request.'),
  userApiKey: z.string().optional().describe('User-provided Gemini API key.'),
});
export type GenerateChatNameInput = z.infer<typeof GenerateChatNameFlowInputSchema>;

// Schema for the prompt's specific input (does not include modelId or userApiKey)
const GenerateChatNamePromptInputSchema = z.object({
  firstUserMessage: z.string().describe("The first message sent by the user in the chat."),
  firstAssistantMessage: z.string().optional().describe("The first reply from the assistant, if available."),
});

const GenerateChatNameOutputSchema = z.object({
  chatName: z.string().describe("A short, descriptive name for the chat session (max 5 words, e.g., 'T-Shirt Design Inquiry')."),
});
export type GenerateChatNameOutput = z.infer<typeof GenerateChatNameOutputSchema>;

export async function generateChatName(flowInput: GenerateChatNameInput): Promise<GenerateChatNameOutput> {
  const { userApiKey, modelId, firstUserMessage, firstAssistantMessage } = flowInput;
  const actualPromptInputData = { firstUserMessage, firstAssistantMessage };
  const modelToUse = modelId || DEFAULT_MODEL_ID;
  const flowName = 'generateChatName';

  let currentAiInstance = ai; // Global Genkit instance by default
  let apiKeySourceForLog = "GOOGLE_API_KEY from .env file";

  if (userApiKey) {
    console.log(`INFO (${flowName}): Using user-provided API key.`);
    // Create a new Genkit instance with the user's API key
    currentAiInstance = genkit({
      plugins: [googleAI({ apiKey: userApiKey })]
    });
    apiKeySourceForLog = "User-provided API key from profile";
  } else if (process.env.GOOGLE_API_KEY) {
    console.log(`INFO (${flowName}): User API key not provided. Using GOOGLE_API_KEY from .env file.`);
  } else {
    console.error(`CRITICAL_ERROR (${flowName}): No API key available. Neither a user-provided API key nor the GOOGLE_API_KEY in the .env file is set.`);
    throw new Error(`API key configuration error in ${flowName}. AI features are unavailable.`);
  }
  
  const generateChatNamePrompt = currentAiInstance.definePrompt({
    name: `${flowName}Prompt_${Date.now()}`,
    input: {schema: GenerateChatNamePromptInputSchema}, 
    output: {schema: GenerateChatNameOutputSchema},
    prompt: `Generate a brief, concise title (3-5 words) for a chat conversation based on its content.
Title should be informative and specific, capturing the main topic or purpose of the conversation.
The title should be professional and descriptive.

Here is the beginning of the conversation:

User: "{{firstUserMessage}}"
{{#if firstAssistantMessage}}
Assistant: "{{firstAssistantMessage}}"
{{/if}}

Analyze the conversation and extract the main topic, question, or purpose.
Focus on identifying specific subjects, technologies, tasks, or questions present in the messages.
If the message is too short or vague, create a title that accurately represents what you can infer.
If the conversation is a greeting only, use "General Chat" or similar.

Guidelines:
- Keep the title between 3-5 words (maximum 50 characters)
- Make it specific and descriptive (e.g. "Python Data Analysis Help" is better than "Programming Help")
- Don't use quotes in the title
- Don't prefix with "Chat about" or similar phrases
- Don't use any emojis

Your task is to generate a suitable name for the provided conversation.`,
  });
  
  try {
    console.log(`INFO (${flowName}): Making AI call using API key from: ${apiKeySourceForLog}`);
    const {output} = await generateChatNamePrompt(actualPromptInputData, { model: modelToUse });
    if (!output) {
      console.error(`ERROR (${flowName}): AI returned empty or undefined output.`);
      throw new Error(`AI response was empty or undefined in ${flowName}.`);
    }
    
    // Clean up and format the chat name
    let chatName = output.chatName;
    
    // Remove any quotes
    chatName = chatName.replace(/^["']|["']$/g, '');
    
    // Remove common prefixes like "Chat about" or "About"
    chatName = chatName.replace(/^(Chat about|About|Chat:|Title:|Chat titled|Chat name:|Name:)\s*/i, '');
    
    // Ensure first letter of each word is capitalized
    chatName = chatName.replace(/\b\w/g, c => c.toUpperCase());
    
    // Limit length
    if (chatName.length > 50) {
      chatName = chatName.substring(0, 47) + '...';
    }
    
    return { chatName };
  } catch (error) {
    console.error(`ERROR (${flowName}): AI call failed (API key source: ${apiKeySourceForLog}). Error:`, error);
    throw new Error(`AI call failed in ${flowName}. Please check server logs for details. Original error: ${(error as Error).message}`);
  }
}
