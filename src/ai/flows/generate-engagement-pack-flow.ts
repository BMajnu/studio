'use server';
/**
 * @fileOverview Generates a comprehensive engagement pack for client interaction.
 * This includes a personalized introduction, a job reply, budget/timeline/software suggestions,
 * and clarifying questions.
 *
 * - generateEngagementPack - Function to generate the engagement pack.
 * - GenerateEngagementPackInput - Input type for the function.
 * - GenerateEngagementPackOutput - Output type for the function.
 */

import { DEFAULT_MODEL_ID } from '@/lib/constants';
import { generateJSON } from '@/lib/ai/genai-helper';
import type { UserProfile } from '@/lib/types';

// Input interface
export interface GenerateEngagementPackInput {
  clientMessage: string;
  designerName: string;
  designerRawStatement: string;
  designerCommunicationStyle?: string;
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
export interface GenerateEngagementPackOutput {
  clientGreetingName: string;
  personalizedIntroduction: string;
  jobReplyToClient: string;
  suggestedBudget: string;
  suggestedTimeline: string;
  suggestedSoftware: string;
  clarifyingQuestions: string[];
}

export async function generateEngagementPack(flowInput: GenerateEngagementPackInput): Promise<GenerateEngagementPackOutput> {
  const { 
    userApiKey, 
    modelId, 
    clientMessage, 
    designerName, 
    designerRawStatement, 
    designerCommunicationStyle = 'friendly, professional', 
    attachedFiles = [], 
    chatHistory = [],
    profile 
  } = flowInput;
  
  const modelToUse = modelId || DEFAULT_MODEL_ID;
  const flowName = 'generateEngagementPack';

  // Build profile for key management
  const profileForKey = profile || (userApiKey ? {
    userId: 'temp',
    name: 'temp',
    services: [],
    geminiApiKeys: [userApiKey]
  } as any : null);
  
  // Build system prompt
  const systemPrompt = `You are an expert assistant for a graphic designer named ${designerName}.
Their communication style is: ${designerCommunicationStyle}.

**Objective:** Generate a comprehensive engagement pack to help ${designerName} respond to a client's message. This pack includes a personalized introduction, a job reply, budget/timeline/software suggestions, and clarifying questions.

**Designer's Raw Personal Statement (Use this as a base for the personalized introduction):**
${designerRawStatement}`;

  // Build user prompt with dynamic content
  let userPrompt = '';
  
  userPrompt += '**Conversation Context:**\n';
  if (chatHistory.length > 0) {
    userPrompt += 'Previous conversation:\n';
    chatHistory.forEach(msg => {
      userPrompt += `${msg.role}: ${msg.text}\n---\n`;
    });
  } else {
    userPrompt += 'No previous conversation history available. Base the response on the current message and attachments.\n';
  }
  
  userPrompt += `\n**Client's Current Message (analyze this in light of the full history and attachments):**\n${clientMessage}\n\n`;

  if (attachedFiles.length > 0) {
    userPrompt += '**Attached Files (consider their content or existence):**\n';
    attachedFiles.forEach(file => {
      userPrompt += `- File: ${file.name} (Type: ${file.type})\n`;
      if (file.dataUri) {
        userPrompt += `  (Image content - analyze visually)\n`;
      } else if (file.textContent) {
        userPrompt += `  Content of ${file.name}: ${file.textContent}\n`;
      } else {
        userPrompt += `  (File type ${file.type} not directly viewable, note its existence and name if client refers to it.)\n`;
      }
    });
    userPrompt += '\n';
  }

  userPrompt += `

**Task Breakdown:**

1.  **Client Greeting Name:**
    *   Analyze the \`chatHistory\` and \`clientMessage\` to find the client's name.
    *   If a name is identified, set \`clientGreetingName\` to that name.
    *   If no name is clearly identifiable, set \`clientGreetingName\` to "there".

2.  **Personalized Introduction for Designer (Field: \`personalizedIntroduction\`):**
    *   Based on the client's *current request* (derived from their message, history, and attachments) and the \`designerRawStatement\`, rewrite a concise and *highly relevant* introduction for ${designerName}.
    *   This introduction should highlight the designer's skills and experience *specifically matching the client's perceived needs*. For example, if the client asks for a "t-shirt design", the rewritten statement should primarily emphasize t-shirt design skills.
    *   Omit any skills or details from the raw statement that are not directly relevant to the client's current query.
    *   The goal is a short, impactful introduction that shows the designer is a perfect fit for *this specific job*. (e.g., "I'm ${designerName}, a professional T-shirt designer with X years of experience creating unique and eye-catching apparel...")

3.  **Job Reply to Client (Field: \`jobReplyToClient\`):**
    *   Craft a professional, friendly, confident, and easy-to-understand reply to the client.
    *   This reply should directly address the client's current message, using the \`clientGreetingName\`.
    *   It should naturally lead from or incorporate the \`personalizedIntroduction\`.
    *   It should express enthusiasm and readiness to help.

4.  **Suggestions (Fields: \`suggestedBudget\`, \`suggestedTimeline\`, \`suggestedSoftware\`):**
    *   **Budget:** Based on the perceived task from the client's request, suggest a competitive and "cheaper" budget range that ${designerName} could propose or discuss. (e.g., "For a project like this, a typical budget range is $X - $Y. We can discuss specifics to fit your needs.").
    *   **Timeline:** Suggest a general timeline for completing the perceived task. (e.g., "This type of project usually takes about X-Y days.").
    *   **Software:** Briefly mention 1-2 relevant software tools ${designerName} might use, implying efficiency. (e.g., "I typically use tools like Adobe Illustrator and Photoshop to ensure high-quality results.").

5.  **Clarifying Questions for Client (Field: \`clarifyingQuestions\` - an array of strings):**
    *   Generate 3-4 specific and actionable questions that ${designerName} needs to ask the client to get started or to better understand the requirements for the *current request*. These should go beyond generic questions if details are already provided.

**Output Format:** Ensure your entire response is a single JSON object with these exact fields:
{
  "clientGreetingName": "string",
  "personalizedIntroduction": "string",
  "jobReplyToClient": "string",
  "suggestedBudget": "string",
  "suggestedTimeline": "string",
  "suggestedSoftware": "string",
  "clarifyingQuestions": ["question1", "question2", "question3"]
}

Example for clarifyingQuestions: ["What is the primary message you want the design to convey?", "Do you have any specific brand colors or fonts to incorporate?"]
`;

  try {
    const output = await generateJSON<GenerateEngagementPackOutput>({
      modelId: modelToUse,
      temperature: 0.7,
      maxOutputTokens: 8000,
      thinkingMode: profile?.thinkingMode || 'default',
      profile: profileForKey
    }, systemPrompt, userPrompt);

    console.log(`[${flowName}] Success, output size: ${JSON.stringify(output).length} bytes`);
    return output;
  } catch (error) {
    console.error(`ERROR (${flowName}): Failed after rotating keys:`, error);
    throw new Error(`AI call failed in ${flowName}. ${(error as Error).message}`);
  }
}
