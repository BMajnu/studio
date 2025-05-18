
'use server';

/**
 * @fileOverview Processes client messages to analyze, simplify, outline steps,
 * and provide a Bengali translation. Can also handle attached files and conversation history.
 *
 * - processClientMessage - A function to process client messages.
 * - ProcessClientMessageInput - The input type for the processClientMessage function.
 * - ProcessClientMessageOutput - The return type for the processClientMessage function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { DEFAULT_MODEL_ID } from '@/lib/constants';

const AttachedFileSchema = z.object({
  name: z.string().describe("Name of the file"),
  type: z.string().describe("MIME type of the file"),
  dataUri: z.string().optional().describe("Base64 data URI for image files. Use {{media url=<dataUri>}} to reference in prompt."),
  textContent: z.string().optional().describe("Text content for text files (e.g., .txt, .md).")
});

const ChatHistoryMessageSchema = z.object({
  role: z.enum(['user', 'assistant']),
  text: z.string(),
});

// Schema for the flow's input, including modelId
const ProcessClientMessageFlowInputSchema = z.object({
  clientMessage: z.string().describe('The current client message to process.'),
  userName: z.string().describe('The name of the user (designer).'),
  communicationStyleNotes: z.string().describe('The communication style notes of the user.'),
  attachedFiles: z.array(AttachedFileSchema).optional().describe("Files attached by the user. Images should be passed as dataUris. Text files as textContent."),
  chatHistory: z.array(ChatHistoryMessageSchema).optional().describe("A summary of recent messages in the conversation, if any. The current clientMessage is NOT part of this history."),
  modelId: z.string().optional().describe('The Genkit model ID to use for this request.'),
});
export type ProcessClientMessageInput = z.infer<typeof ProcessClientMessageFlowInputSchema>;


// Schema for the prompt's specific input (does not include modelId)
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
});
export type ProcessClientMessageOutput = z.infer<typeof ProcessClientMessageOutputSchema>;

export async function processClientMessage(input: ProcessClientMessageInput): Promise<ProcessClientMessageOutput> {
  return processClientMessageFlow(input);
}

const prompt = ai.definePrompt({
  name: 'processClientMessagePrompt',
  input: {
    schema: ProcessClientMessagePromptInputSchema, // Use prompt-specific schema
  },
  output: {
    schema: ProcessClientMessageOutputSchema,
  },
  prompt: `You are a helpful AI assistant for a graphic designer named {{{userName}}}.
Their communication style is: {{{communicationStyleNotes}}}.

**Your Primary Task:** Analyze the "Client's Current Message" in the context of the "Previous conversation context" (if available) and any "Attached Files". Provide a comprehensive analysis, a simplified request, a step-by-step plan, and a Bengali translation, all focused on the *current state of the client's needs as understood from the entire interaction so far*.

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

Based on *all available information* (latest message, full history, attachments), provide the following for the CURRENT request:

1.  **Analysis:** Detailed analysis of the client's *current cumulative needs and requirements*. If the latest message shifts focus, explain how it relates to or diverges from previous points.
2.  **Simplified Request:** A concise summary of what the client is *currently asking for, considering all context*.
3.  **Step-by-Step Approach:** A clear plan for {{{userName}}} to fulfill the *current, fully understood request*.
4.  **Bengali Translation:** Translate the Analysis, Simplified Request, and Step-by-Step Approach for the current request into Bengali.

Output Format (ensure your entire response is a single JSON object matching this structure):
{
  "analysis": "...",
  "simplifiedRequest": "...",
  "stepByStepApproach": "...",
  "bengaliTranslation": "বিশ্লেষণ: ...\nসরলীকৃত অনুরোধ: ...\nধাপে ধাপে পদ্ধতি: ..."
}
`,
});

const processClientMessageFlow = ai.defineFlow(
  {
    name: 'processClientMessageFlow',
    inputSchema: ProcessClientMessageFlowInputSchema, // Use flow-specific schema
    outputSchema: ProcessClientMessageOutputSchema,
  },
  async (flowInput) => {
    const { clientMessage, userName, communicationStyleNotes, attachedFiles, chatHistory, modelId } = flowInput;
    const actualPromptInput = { clientMessage, userName, communicationStyleNotes, attachedFiles, chatHistory };
    const modelToUse = modelId || DEFAULT_MODEL_ID;

    const {output} = await prompt(actualPromptInput, { model: modelToUse });
    return output!;
  }
);
