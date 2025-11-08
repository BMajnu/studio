'use server';
/**
 * @fileOverview Generates chat responses focused on graphic design assistance.
 *
 * - generateChatResponse - A function to process chat messages and provide design-focused responses.
 * - GenerateChatResponseInput - The input type for the generateChatResponse function.
 * - GenerateChatResponseOutput - The return type for the generateChatResponse function.
 */

import { DEFAULT_MODEL_ID } from '@/lib/constants';
import { generateJSON } from '@/lib/ai/genai-helper';
import type { UserProfile } from '@/lib/types';
import { classifyError } from '@/lib/errors';

// DEBUG logging helper
const logDebug = (label: string, ...args: any[]) => {
  try { console.log(`[generateChatResponse] ${label}`, ...args); } catch(_){}
};

// Input interface
export interface GenerateChatResponseInput {
  userMessage: string;
  userName: string;
  attachedFiles?: Array<{
    name: string;
    type: string;
    dataUri?: string;
    textContent?: string;
  }>;
  chatHistory?: Array<{
    role: 'user' | 'assistant';
    text: string;
  }>;
  modelId?: string;
  userApiKey?: string;
  profile?: UserProfile;
}

// Output interface
export interface GenerateChatResponseOutput {
  responseEnglish: string;
  responseBengali: string;
  suggestedActions?: string[];
  designTips?: string[];
}

export async function generateChatResponse(flowInput: GenerateChatResponseInput): Promise<GenerateChatResponseOutput> {
  const flowName = 'generateChatResponse';
  logDebug('Starting flow');

  const { 
    modelId = DEFAULT_MODEL_ID, 
    userApiKey, 
    userMessage,
    userName,
    attachedFiles = [],
    chatHistory = [],
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
  const systemPrompt = `You are a professional graphic design assistant helping ${userName}. Provide helpful, creative, and practical design advice.

**Your Role:**
1. Provide expert graphic design guidance
2. Suggest creative solutions and alternatives
3. Explain design principles when relevant
4. Offer practical implementation tips
5. Be encouraging and supportive

**Response Guidelines:**
- Be conversational but professional
- Focus on actionable advice
- Include specific examples when helpful
- Consider both aesthetic and functional aspects
- Provide responses in both English and Bengali
- IMPORTANT Bengali rules:
  - When translating common English greetings like "Hello", "Hi", or "Hey", use "আসসালামু আলাইকুম" instead of "নমস্কার"
  - Prefer modern, widely-understood Bangla
  - Preserve markdown formatting (bold, lists, headings) in both languages

**Suggested Actions Style (IMPORTANT):**
- Must contain up to 5 SHORT user-to-AI request prompts (what the user would click to ask you next)
- Phrase them as first-person, imperative, or direct requests from the USER to the AI (e.g., "Create...", "Generate...", "Summarize...")
- DO NOT ask the user questions here
- Keep each suggestion concise and specific to context

**Design Areas to Consider:**
- Typography and font selection
- Color theory and palettes
- Layout and composition
- Branding and identity
- Digital and print design differences
- Design software tips
- Current design trends
- Accessibility in design`;

  // Build user prompt
  let userPrompt = `**User Message:**\n${userMessage}\n\n`;

  if (chatHistory.length > 0) {
    userPrompt += '**Chat History:**\n';
    chatHistory.slice(-5).forEach(msg => {
      userPrompt += `${msg.role}: ${msg.text.substring(0, 200)}${msg.text.length > 200 ? '...' : ''}\n`;
    });
    userPrompt += '\n';
  }

  if (attachedFiles.length > 0) {
    userPrompt += `**Attached Files (${attachedFiles.length}):**\n`;
    attachedFiles.forEach(file => {
      userPrompt += `- ${file.name} (${file.type})\n`;
      if (file.dataUri) {
        userPrompt += `  [IMAGE PROVIDED - analyze visually]\n`;
      }
      if (file.textContent) {
        userPrompt += `  Content: ${file.textContent.substring(0, 300)}${file.textContent.length > 300 ? '...' : ''}\n`;
      }
    });
    userPrompt += '\n';
  }

  userPrompt += `**Output Format:** Return ONLY a valid JSON object:
{
  "responseEnglish": "Your helpful response in English",
  "responseBengali": "আপনার সহায়ক প্রতিক্রিয়া বাংলায়",
  "suggestedActions": [
    "Create a concise design brief from my message",
    "Generate 3 logo concept directions",
    "Propose a color palette and font pairings",
    "Outline a step-by-step plan to deliver the design",
    "Summarize key requirements"
  ],
  "designTips": ["Quick tip 1", "Design principle 2"]
}`;

  try {
    const output = await generateJSON<GenerateChatResponseOutput>({
      modelId,
      temperature: 0.7,
      maxOutputTokens: 8000,
      thinkingMode: profile?.thinkingMode || 'default',
      profile: profileForKey
    }, systemPrompt, userPrompt);

    logDebug('Success');
    return output;
  } catch (error) {
    console.error(`ERROR (${flowName}):`, error);
    throw classifyError(error);
  }
}
