'use server';
/**
 * @fileOverview Flow to process designer's custom instruction relative to a client's message.
 *
 * - processCustomInstructionFlow - Runs a structured prompt to follow the designer's instruction
 * - ProcessCustomInstructionFlowInput - Input type
 * - ProcessCustomInstructionFlowOutput - Output type
 */

import { DEFAULT_MODEL_ID } from '@/lib/constants';
import { generateJSON } from '@/lib/ai/genai-helper';
import type { UserProfile } from '@/lib/types';
import { classifyError } from '@/lib/errors';

// DEBUG helper
const logDebug = (label: string, ...args: any[]) => {
  try { console.log(`[processCustomInstructionFlow] ${label}`, ...args); } catch(_) {}
};

// Input interface
export interface ProcessCustomInstructionFlowInput {
  clientMessage: string;
  customInstruction: string;
  userName?: string;
  professionalTitle?: string;
  communicationStyleNotes?: string;
  attachedFiles?: Array<{
    name: string;
    type: string;
    dataUri?: string;
    textContent?: string;
    dimensions?: { width?: number; height?: number };
  }>;
  chatHistory?: Array<{
    role: 'user' | 'assistant';
    text: string;
    timestamp?: number;
  }>;
  language?: 'english' | 'bengali' | 'both';
  modelId?: string;
  userApiKey?: string;
  profile?: UserProfile;
}

// Output interface
export interface ProcessCustomInstructionFlowOutput {
  title: string;
  response: string;
}

export async function processCustomInstructionFlow(flowInput: ProcessCustomInstructionFlowInput): Promise<ProcessCustomInstructionFlowOutput> {
  const flowName = 'processCustomInstructionFlow';
  logDebug('Starting flow');

  const {
    clientMessage,
    customInstruction,
    userName = '',
    professionalTitle = '',
    communicationStyleNotes = '',
    attachedFiles = [],
    chatHistory = [],
    language = 'english',
    modelId = DEFAULT_MODEL_ID,
    userApiKey,
    profile
  } = flowInput;

  // Build profile for key management
  const profileForKey = profile || (userApiKey ? {
    userId: 'temp',
    name: 'temp',
    services: [],
    geminiApiKeys: [userApiKey]
  } as any : null);

  // Build system prompt
  const systemPrompt = `You are a creative AI assistant for designers.

**Your Task:** Follow the custom instruction PRECISELY to process the provided client message/text.

IMPORTANT RULES:
- If asked to TRANSLATE, translate the ENTIRE text completely (do not summarize or shorten)
- If asked to REFINE/REWRITE, transform the text directly (do not respond about it)
- If asked to SUMMARIZE, create a concise summary
- If asked to EXPLAIN, provide an explanation
- The "Client Message" is the INPUT TEXT to process, not a conversation message to respond to

Language preference: ${language}
${userName ? `Designer: ${userName}` : ''}
${professionalTitle ? `Title: ${professionalTitle}` : ''}
${communicationStyleNotes ? `Style: ${communicationStyleNotes}` : ''}`;

  // Build user prompt
  let userPrompt = `**Custom Instruction (What to do):**\n${customInstruction}\n\n`;
  userPrompt += `**Client Message (Input text to process):**\n${clientMessage}\n\n`;

  if (chatHistory.length > 0) {
    userPrompt += '**Chat History (for context):**\n';
    chatHistory.slice(-5).forEach(msg => {
      userPrompt += `${msg.role}: ${msg.text.substring(0, 200)}${msg.text.length > 200 ? '...' : ''}\n`;
    });
    userPrompt += '\n';
  }

  if (attachedFiles.length > 0) {
    userPrompt += '**Attached Files:**\n';
    attachedFiles.forEach(file => {
      userPrompt += `- ${file.name} (${file.type})\n`;
      if (file.dataUri) {
        userPrompt += `  [IMAGE PROVIDED - analyze visually]\n`;
      }
      if (file.textContent) {
        userPrompt += `  Content: ${file.textContent.substring(0, 500)}${file.textContent.length > 500 ? '...' : ''}\n`;
      }
    });
    userPrompt += '\n';
  }

  userPrompt += `**Instructions:**
1. Read the custom instruction carefully
2. Process the client message according to that instruction
3. Return a title and the processed response

**Output Format:** Return ONLY a valid JSON object:
{
  "title": "Concise title summarizing the response",
  "response": "The response content following the custom instruction"
}

Execute the instruction now.`;

  try {
    const output = await generateJSON<ProcessCustomInstructionFlowOutput>({
      modelId,
      temperature: 0.7,
      maxOutputTokens: 8000,
      thinkingMode: profile?.thinkingMode || 'default',
      profile: profileForKey
    }, systemPrompt, userPrompt);

    logDebug('Success, title:', output.title);
    return output;
  } catch (error) {
    console.error(`ERROR (${flowName}):`, error);
    throw classifyError(error);
  }
}
