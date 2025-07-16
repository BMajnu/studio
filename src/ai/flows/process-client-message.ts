'use server';

/**
 * @fileOverview Processes client messages to analyze, simplify, outline steps,
 * provide a Bengali translation, and suggest replies. Can also handle attached files and conversation history.
 *
 * - processClientMessage - A function to process client messages.
 * - ProcessClientMessageInput - The input type for the processClientMessage function.
 * - ProcessClientMessageOutput - The return type for the processClientMessage function.
 */

import { z } from 'genkit';
import { DEFAULT_MODEL_ID } from '@/lib/constants';
import { GeminiClient } from '@/lib/ai/gemini-client';
import { createGeminiAiInstance } from '@/lib/ai/genkit-utils';

const AttachedFileSchema = z.object({
  name: z.string().describe("Name of the file"),
  type: z.string().describe("MIME type of the file"),
  size: z.number().optional().describe("Size of the file in bytes"),
  dataUri: z.string().optional().describe("Base64 data URI for image files. Use {{media url=<dataUri>}} to reference in prompt."),
  textContent: z.string().optional().describe("Text content for text files (e.g., .txt, .md).")
});

const ChatHistoryMessageSchema = z.object({
  role: z.enum(['user', 'assistant']),
  text: z.string(),
});

// Schema for the flow's input, including modelId and userApiKey
const ProcessClientMessageFlowInputSchema = z.object({
  clientMessage: z.string().describe('The current client message to process.'),
  userName: z.string().describe('The name of the user (designer).'),
  communicationStyleNotes: z.string().describe('The communication style notes of the user.'),
  attachedFiles: z.array(AttachedFileSchema).optional().describe("Files attached by the user. Images should be passed as dataUris. Text files as textContent."),
  chatHistory: z.array(ChatHistoryMessageSchema).optional().describe("A summary of recent messages in the conversation, if any. The current clientMessage is NOT part of this history."),
  modelId: z.string().optional().describe('The Genkit model ID to use for this request.'),
  userApiKey: z.string().optional().describe('User-provided Gemini API key.'),
});
export type ProcessClientMessageInput = z.infer<typeof ProcessClientMessageFlowInputSchema>;


// Schema for the prompt's specific input (does not include modelId or userApiKey)
const ProcessClientMessagePromptInputSchema = z.object({
  clientMessage: z.string().describe('The current client message to process.'),
  userName: z.string().describe('The name of the user (designer).'),
  communicationStyleNotes: z.string().describe('The communication style notes of the user.'),
  attachedFiles: z.array(AttachedFileSchema).optional().describe("Files attached by the user. Images should be passed as dataUris. Text files as textContent."),
  chatHistory: z.array(ChatHistoryMessageSchema).optional().describe("A summary of recent messages in the conversation, if any. The current clientMessage is NOT part of this history."),
});


const ProcessClientMessageOutputSchema = z.object({
  analysis: z.string().describe('Analysis of the client message, considering conversation history and attachments.'),
  simplifiedRequest: z.string().describe('Simplified version of the current request.'),
  stepByStepApproach: z.string().describe('Step-by-step approach to fulfill the current request.'),
  bengaliTranslation: z.string().describe('Bengali translation of the analysis, simplified request, and step-by-step approach for the current request.'),
  suggestedEnglishReplies: z.array(z.string()).length(2).describe('Two distinct, professional English replies to the client, reflecting the user\'s style, name, and conversation context.'),
  suggestedBengaliReplies: z.array(z.string()).length(2).optional().describe('Bengali translations of the two suggested English replies.'),
  // NEW: key requirement points in English & Bengali so UI can display them in the "Key Points" tab
  keyPointsEnglish: z.array(z.string()).optional().describe('Key requirement points in English, presented as bullet points for easy reading'),
  keyPointsBengali: z.array(z.string()).optional().describe('Key requirement points in Bengali, presented as bullet points for easy reading'),
});
export type ProcessClientMessageOutput = z.infer<typeof ProcessClientMessageOutputSchema>;

export async function processClientMessage(flowInput: ProcessClientMessageInput): Promise<ProcessClientMessageOutput> {
  const { userApiKey, modelId, clientMessage, userName, communicationStyleNotes, attachedFiles, chatHistory } = flowInput;
  const actualPromptInputData = { clientMessage, userName, communicationStyleNotes, attachedFiles, chatHistory };
  const modelToUse = modelId || DEFAULT_MODEL_ID;
  const flowName = 'processClientMessage';

  // Debugging: log prompt size and attachment info
  try {
    const promptInputJson = JSON.stringify(actualPromptInputData);
    console.log(`[${flowName}] promptInput size`, promptInputJson.length, 'bytes', 'attachments', attachedFiles?.length || 0);
  } catch(err) {
    console.warn('Failed to stringify prompt input for debugging', err);
  }

  const profileStub = userApiKey ? ({ userId: 'tmp', name: 'tmp', services: [], geminiApiKeys: [userApiKey] } as any) : null;
  const client = new GeminiClient({ profile: profileStub });

  const promptText = `You are a helpful AI assistant for a graphic designer named {{{userName}}}.
Their communication style is: {{{communicationStyleNotes}}}.

**Your Primary Task:** Analyze the "Client's Current Message" in the context of the "Previous conversation context" (if available) and any "Attached Files". Provide **key requirement bullet points**, a comprehensive analysis, a simplified request, a step-by-step plan, and a Bengali translation of these parts, all focused on the *current state of the client's needs as understood from the entire interaction so far*. Additionally, generate two distinct, professional English replies to the client's current message and their Bengali translations.

**Contextual Understanding Rules:**
1.  **Examine History:** If "Previous conversation context" exists, review it carefully to understand the ongoing project, previous discussions, and decisions.
2.  **Latest Message's Role:** Determine if the "Client's Current Message" is:
    *   A continuation or clarification of the existing topic.
    *   Introducing a new, distinct request or a significant change to the existing one.
3.  **Integration:**
    *   If it's a continuation/clarification, integrate this new information seamlessly into the existing understanding. Your output should reflect this updated understanding.
    *   If it's a new request or major change, clearly acknowledge this shift in your "Analysis" and tailor the "Simplified Request" and "Step-by-Step Approach" accordingly, while still being mindful of any relevant overarching context from the history if applicable (e.g., client preferences).

{{#if chatHistory.length}}
Previous conversation context (analyze the current message in light of this full history):
{{#each chatHistory}}
{{this.role}}: {{{this.text}}}
---
{{/each}}
{{else}}
No previous conversation history available. Base your response solely on the current message and attachments.
{{/if}}

Client's Current Message:
{{{clientMessage}}}

{{#if attachedFiles.length}}
The client also attached the following files with their current message. Consider their content (if viewable by you) or existence if relevant to the message and overall request:
{{#each attachedFiles}}
- File: {{this.name}} (Type: {{this.type}})
  {{#if this.dataUri}}
    (This is an image. You can see it: {{media url=this.dataUri}})
  {{else if this.textContent}}
    Content of {{this.name}}:
    {{{this.textContent}}}
  {{else}}
    (This file's content (e.g. PDF, other binary) is not directly viewable by you, but the client may refer to it in their message.)
  {{/if}}
{{/each}}
{{/if}}

Based on *all available information* (latest message, full history, attachments), provide the following:

0.  **Key Requirement Points (Bullet Points):**
    * **English:** 3-10 concise bullet points capturing the essential requirements.
    * **Bengali:** A faithful Bengali translation of the same bullet points.

1.  **Analysis:** Detailed analysis of the client's *current cumulative needs and requirements*. If the latest message shifts focus, explain how it relates to or diverges from previous points.
2.  **Simplified Request:** A concise summary of what the client is *currently asking for, considering all context*.
3.  **Step-by-Step Approach:** A conversational, friendly plan for {{{userName}}} to fulfill the *current, fully understood request*. Format each step to be more humanized and engaging:
    * Prefix each step with a relevant emoji
    * Use a conversational tone rather than directive language
    * Frame steps as a journey you're taking together with the client
    * For example, instead of "Gather specific details", say "📝 **Getting the Details Just Right:** Let's dive into all the specific details about your request..."
    * Make the language warm and approachable while maintaining professionalism

4.  **Bengali Translation:** Translate the Analysis, Simplified Request, and Step-by-Step Approach for the current request into Bengali.

5.  **Suggested English Replies (Two options):**
    *   Generate two distinct, professional English replies to the "Client's Current Message".
    *   These replies MUST reflect the designer's name ({{{userName}}}), style ({{{communicationStyleNotes}}}), and services if relevant.
    *   They should directly address the client's current message and be contextually appropriate, considering the conversation history.
    *   Include a relevant call to action if appropriate (e.g., asking for more details, suggesting next steps).

6.  **Suggested Bengali Replies (Translations of the two English replies):**
    *   Provide accurate Bengali translations for the two English replies generated above.

Output Format (ensure your entire response is a single JSON object matching this structure):
{
  "keyPointsEnglish": ["Point 1", "Point 2", ...],
  "keyPointsBengali": ["বিন্দু ১", "বিন্দু ২", ...],
  "analysis": "...",
  "simplifiedRequest": "...",
  "stepByStepApproach": "...",
  "bengaliTranslation": "বিশ্লেষণ: ...\\nসরলীকৃত অনুরোধ: ...\\nধাপে ধাপে পদ্ধতি: ...",
  "suggestedEnglishReplies": ["Reply 1 text...", "Reply 2 text..."],
  "suggestedBengaliReplies": ["Bengali translation of Reply 1...", "Bengali translation of Reply 2..."]
}`;

  try {
    const { data: output, apiKeyUsed } = await client.request(async (apiKey) => {
      const instance = createGeminiAiInstance(apiKey);
      const promptDef = instance.definePrompt({
        name: `${flowName}Prompt_${Date.now()}`,
        input: { schema: ProcessClientMessagePromptInputSchema },
        output: { schema: ProcessClientMessageOutputSchema },
        prompt: promptText
      });
      const { output } = await promptDef(actualPromptInputData, { model: modelToUse });
      return output as ProcessClientMessageOutput;
    });
    try {
      const outSize = JSON.stringify(output).length;
      console.log(`[${flowName}] output size`, outSize, 'bytes');
    } catch(err) { console.warn('Failed to stringify output', err);}    
    return output;
  } catch (error) {
    console.error(`ERROR (${flowName}): Failed after rotating keys:`, error);
    throw new Error(`AI call failed in ${flowName}. ${(error as Error).message}`);
  }
}
