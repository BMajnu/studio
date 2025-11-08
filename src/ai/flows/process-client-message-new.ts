'use server';

import { DEFAULT_MODEL_ID } from '@/lib/constants';
import { generateJSON } from '@/lib/ai/genai-helper';
import type { UserProfile } from '@/lib/types';
import { classifyError } from '@/lib/errors';

// Input/Output Types (keep same interface for compatibility)
export interface AttachedFile {
  name: string;
  type: string;
  size?: number;
  dataUri?: string;
  textContent?: string;
}

export interface ChatHistoryMessage {
  role: 'user' | 'assistant';
  text: string;
}

export interface ProcessClientMessageInput {
  clientMessage: string;
  userName: string;
  communicationStyleNotes: string;
  attachedFiles?: AttachedFile[];
  chatHistory?: ChatHistoryMessage[];
  modelId?: string;
  userApiKey?: string;
  profile?: UserProfile;
}

export interface ProcessClientMessageOutput {
  keyPointsEnglish: string[];
  keyPointsBengali: string[];
  analysis: string;
  simplifiedRequest: string;
  stepByStepApproach: string;
  bengaliTranslation: string;
  suggestedEnglishReplies: string[];
  suggestedBengaliReplies: string[];
}

export async function processClientMessage(
  input: ProcessClientMessageInput
): Promise<ProcessClientMessageOutput> {
  const {
    clientMessage,
    userName,
    communicationStyleNotes,
    attachedFiles = [],
    chatHistory = [],
    modelId,
    userApiKey,
    profile
  } = input;

  const flowName = 'processClientMessage';
  
  // Debug logging
  console.log(`[${flowName}] Processing message, attachments: ${attachedFiles.length}`);

  // Determine model to use
  const actualModelId = modelId || DEFAULT_MODEL_ID;
  
  // Build profile for key management
  const profileForKey = profile || (userApiKey ? {
    userId: 'temp',
    name: 'temp',
    services: [],
    geminiApiKeys: [userApiKey]
  } as any : null);

  // Build the system prompt
  const systemPrompt = `You are a helpful AI assistant for a graphic designer named ${userName}.
Their communication style is: ${communicationStyleNotes}.

**Your Primary Task:** Analyze the client's message and provide structured output in JSON format with key requirements, analysis, simplified request, step-by-step approach, Bengali translations, and suggested replies.

**Response Format:** Return ONLY a valid JSON object with these exact keys:
{
  "keyPointsEnglish": ["point 1", "point 2", ...],
  "keyPointsBengali": ["বিন্দু ১", "বিন্দু ২", ...],
  "analysis": "detailed analysis",
  "simplifiedRequest": "concise summary",
  "stepByStepApproach": "step by step plan with emojis",
  "bengaliTranslation": "Bengali translation of analysis, simplified request, and step-by-step",
  "suggestedEnglishReplies": ["reply 1", "reply 2"],
  "suggestedBengaliReplies": ["Bengali reply 1", "Bengali reply 2"]
}`;

  // Build the user prompt
  let userPrompt = '';
  
  if (chatHistory.length > 0) {
    userPrompt += 'Previous conversation context:\n';
    chatHistory.forEach(msg => {
      userPrompt += `${msg.role}: ${msg.text}\n---\n`;
    });
  } else {
    userPrompt += 'No previous conversation history available.\n\n';
  }

  userPrompt += `Client's Current Message:\n${clientMessage}\n\n`;

  if (attachedFiles.length > 0) {
    userPrompt += 'Attached files:\n';
    attachedFiles.forEach(file => {
      userPrompt += `- File: ${file.name} (Type: ${file.type})\n`;
      if (file.textContent) {
        userPrompt += `  Content: ${file.textContent}\n`;
      }
    });
    userPrompt += '\n';
  }

  userPrompt += `Based on all information, provide:
1. Key requirement points (3-10 bullets in English and Bengali)
2. Detailed analysis
3. Simplified request
4. Step-by-step approach with emojis and conversational tone
5. Bengali translation of items 2-4
6. Two professional English replies from ${userName}
7. Bengali translations of those replies

Remember: Format as valid JSON matching the exact structure specified above.`;

  try {
    const output = await generateJSON<ProcessClientMessageOutput>({
      modelId: actualModelId,
      temperature: 0.7,
      maxOutputTokens: 8000,
      thinkingMode: profile?.thinkingMode || 'default',
      profile: profileForKey
    }, systemPrompt, userPrompt);

    console.log(`[${flowName}] Success, output size: ${JSON.stringify(output).length} bytes`);
    return output;
  } catch (error) {
    console.error(`ERROR (${flowName}):`, error);
    throw classifyError(error);
  }
}

