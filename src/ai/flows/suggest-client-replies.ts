'use server';
/**
 * @fileOverview Generates personalized and styled professional replies for clients, considering conversation history.
 *
 * - suggestClientReplies - A function that generates client replies based on user profile and conversation history.
 * - SuggestClientRepliesInput - The input type for the suggestClientReplies function.
 * - SuggestClientRepliesOutput - The return type for the suggestClientReplies function.
 */

import { DEFAULT_MODEL_ID } from '@/lib/constants';
import { generateJSON } from '@/lib/ai/genai-helper';
import type { UserProfile } from '@/lib/types';
import { classifyError } from '@/lib/errors';

// Input interfaces
export interface ChatHistoryMessage {
  role: 'user' | 'assistant';
  text: string;
}

export interface SuggestClientRepliesInput {
  clientMessage: string;
  userName: string;
  professionalTitle?: string;
  communicationStyleNotes?: string;
  services?: string[];
  chatHistory?: ChatHistoryMessage[];
  modelId?: string;
  userApiKey?: string;
  profile?: UserProfile;
}

// Output interface
export interface SuggestClientRepliesOutput {
  englishReplies: string[];
  bengaliTranslations?: string[];
}

export async function suggestClientReplies(flowInput: SuggestClientRepliesInput): Promise<SuggestClientRepliesOutput> {
  const { 
    userApiKey,
    profile,
    modelId = DEFAULT_MODEL_ID, 
    clientMessage, 
    userName, 
    professionalTitle, 
    communicationStyleNotes = 'Professional and friendly', 
    services = [], 
    chatHistory = [] 
  } = flowInput;
  
  const flowName = 'suggestClientReplies';

  // Build profile for key management
  const profileForKey = profile || (userApiKey ? {
    userId: 'temp',
    name: 'temp',
    services: [],
    geminiApiKeys: [userApiKey]
  } as any : null);

  // Build system prompt
  const systemPrompt = `You are a professional assistant helping a graphic designer.
Designer's Name: ${userName}
${professionalTitle ? `Designer's Title: ${professionalTitle}` : ''}
Designer's Communication Style: ${communicationStyleNotes}
Designer's Services: ${services.length > 0 ? services.join(', ') : 'a variety of graphic design services'}.`;

  // Build user prompt
  let userPrompt = `**Your Task:** Generate two distinct, professional English replies to the "Client's Current Message". These replies MUST:\n`;
  userPrompt += `1. Reflect the designer's name, style, and services.\n`;
  userPrompt += `2. Directly address the "Client's Current Message".\n`;
  userPrompt += `3. Be contextually appropriate, considering the "Previous conversation context" (if available). The replies should feel like a natural continuation of the dialogue.\n`;
  userPrompt += `4. If the client's message introduces a new topic or shifts focus, the replies should acknowledge this.\n`;
  userPrompt += `5. Include a relevant call to action if appropriate (e.g., asking for more details, suggesting next steps related to services).\n`;
  userPrompt += `Also, provide Bengali translations for these English replies.\n\n`;

  if (chatHistory.length > 0) {
    userPrompt += `Previous conversation context (generate replies that naturally follow this history):\n`;
    chatHistory.forEach(msg => {
      userPrompt += `${msg.role}: ${msg.text}\n`;
      userPrompt += `---\n`;
    });
  } else {
    userPrompt += `No previous conversation history available. Base your replies solely on the current client message.\n`;
  }
  userPrompt += `\n`;

  userPrompt += `Client's Current Message:\n`;
  userPrompt += `"${clientMessage}"\n\n`;

  userPrompt += `Return the replies and translations as a JSON object with keys: englishReplies (array of 2 strings), bengaliTranslations (array of 2 strings).`;

  try {
    console.log(`INFO (${flowName}): Making AI call`);
    const output = await generateJSON<SuggestClientRepliesOutput>({
      modelId,
      temperature: 0.8,
      maxOutputTokens: 8000,
      thinkingMode: profile?.thinkingMode || 'default',
      profile: profileForKey
    }, systemPrompt, userPrompt);

    if (!output) {
      console.error(`ERROR (${flowName}): AI returned empty or undefined output.`);
      throw new Error(`AI response was empty or undefined in ${flowName}.`);
    }
    return output;
  } catch (error) {
    console.error(`ERROR (${flowName}): AI call failed. Error:`, error);
    throw classifyError(error);
  }
}
