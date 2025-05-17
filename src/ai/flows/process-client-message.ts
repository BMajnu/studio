
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

const ProcessClientMessageInputSchema = z.object({
  clientMessage: z.string().describe('The current client message to process.'),
  userName: z.string().describe('The name of the user (designer).'),
  communicationStyleNotes: z.string().describe('The communication style notes of the user.'),
  attachedFiles: z.array(AttachedFileSchema).optional().describe("Files attached by the user. Images should be passed as dataUris. Text files as textContent."),
  chatHistory: z.array(ChatHistoryMessageSchema).optional().describe("A summary of recent messages in the conversation, if any. The current clientMessage is NOT part of this history."),
});
export type ProcessClientMessageInput = z.infer<typeof ProcessClientMessageInputSchema>;

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
    schema: ProcessClientMessageInputSchema,
  },
  output: {
    schema: ProcessClientMessageOutputSchema,
  },
  prompt: `You are a helpful AI assistant for a graphic designer named {{{userName}}}.
Their communication style is: {{{communicationStyleNotes}}}.

{{#if chatHistory.length}}
Previous conversation context:
{{#each chatHistory}}
{{this.role}}: {{{this.text}}}
{{/each}}
---
{{/if}}

Client's Current Message:
{{{clientMessage}}}

{{#if attachedFiles.length}}
The client also attached the following files with their current message. Consider their content or existence if relevant to the message:
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

Based on the client's current message (and any attached files), and considering the previous conversation context if available, provide the following for the CURRENT request:

1.  **Analysis:** Detailed analysis of the client's current needs and requirements.
2.  **Simplified Request:** A concise summary of what the client is currently asking for.
3.  **Step-by-Step Approach:** A clear plan for {{{userName}}} to fulfill the current request.
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
    inputSchema: ProcessClientMessageInputSchema,
    outputSchema: ProcessClientMessageOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
