
'use server';
/**
 * @fileOverview Generates personalized and styled professional replies for clients, considering conversation history.
 *
 * - suggestClientReplies - A function that generates client replies based on user profile and conversation history.
 * - SuggestClientRepliesInput - The input type for the suggestClientReplies function.
 * - SuggestClientRepliesOutput - The return type for the suggestClientReplies function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { DEFAULT_MODEL_ID } from '@/lib/constants';

const ChatHistoryMessageSchema = z.object({
  role: z.enum(['user', 'assistant']),
  text: z.string(),
});

// Schema for the flow's input, including modelId
const SuggestClientRepliesFlowInputSchema = z.object({
  clientMessage: z.string().describe("The client's current message to the designer."),
  userName: z.string().describe('The name of the designer.'),
  professionalTitle: z.string().optional().describe('The professional title of the designer.'),
  communicationStyleNotes: z.string().optional().describe('Keywords describing the designer\'s communication style.'),
  services: z.array(z.string()).optional().describe('List of services offered by the designer.'),
  chatHistory: z.array(ChatHistoryMessageSchema).optional().describe("A summary of recent messages in the conversation, if any. The current clientMessage is NOT part of this history."),
  modelId: z.string().optional().describe('The Genkit model ID to use for this request.'),
});
export type SuggestClientRepliesInput = z.infer<typeof SuggestClientRepliesFlowInputSchema>;

// Schema for the prompt's specific input (does not include modelId)
const SuggestClientRepliesPromptInputSchema = z.object({
  clientMessage: z.string().describe("The client's current message to the designer."),
  userName: z.string().describe('The name of the designer.'),
  professionalTitle: z.string().optional().describe('The professional title of the designer.'),
  communicationStyleNotes: z.string().optional().describe('Keywords describing the designer\'s communication style.'),
  services: z.array(z.string()).optional().describe('List of services offered by the designer.'),
  chatHistory: z.array(ChatHistoryMessageSchema).optional().describe("A summary of recent messages in the conversation, if any. The current clientMessage is NOT part of this history."),
});


const SuggestClientRepliesOutputSchema = z.object({
  englishReplies: z.array(z.string()).describe('Two suggested English replies, reflecting the user\'s style, name, and conversation context.'),
  bengaliTranslations: z.array(z.string()).optional().describe('Bengali translations of the English replies.'),
});
export type SuggestClientRepliesOutput = z.infer<typeof SuggestClientRepliesOutputSchema>;

export async function suggestClientReplies(input: SuggestClientRepliesInput): Promise<SuggestClientRepliesOutput> {
  return suggestClientRepliesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestClientRepliesPrompt',
  input: {schema: SuggestClientRepliesPromptInputSchema}, // Use prompt-specific schema
  output: {schema: SuggestClientRepliesOutputSchema},
  prompt: `You are a professional assistant helping a graphic designer.
Designer's Name: {{userName}}
{{#if professionalTitle}}Designer's Title: {{professionalTitle}}{{/if}}
Designer's Communication Style: {{communicationStyleNotes}}
Designer's Services: {{#if services.length}}{{#each services}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}{{else}}a variety of graphic design services{{/if}}.

**Your Task:** Generate two distinct, professional English replies to the "Client's Current Message". These replies MUST:
1.  Reflect the designer's name, style, and services.
2.  Directly address the "Client's Current Message".
3.  Be contextually appropriate, considering the "Previous conversation context" (if available). The replies should feel like a natural continuation of the dialogue.
4.  If the client's message introduces a new topic or shifts focus, the replies should acknowledge this.
5.  Include a relevant call to action if appropriate (e.g., asking for more details, suggesting next steps related to services).
Also, provide Bengali translations for these English replies.

{{#if chatHistory.length}}
Previous conversation context (generate replies that naturally follow this history):
{{#each chatHistory}}
{{this.role}}: {{{this.text}}}
---
{{/each}}
{{else}}
No previous conversation history available. Base your replies solely on the current client message.
{{/if}}

Client's Current Message:
"{{{clientMessage}}}"

Return the replies and translations as a JSON object.
`,
});

const suggestClientRepliesFlow = ai.defineFlow(
  {
    name: 'suggestClientRepliesFlow',
    inputSchema: SuggestClientRepliesFlowInputSchema, // Use flow-specific schema
    outputSchema: SuggestClientRepliesOutputSchema,
  },
  async (flowInput) => {
    const { clientMessage, userName, professionalTitle, communicationStyleNotes, services, chatHistory, modelId } = flowInput;
    const actualPromptInput = { clientMessage, userName, professionalTitle, communicationStyleNotes, services, chatHistory };
    const modelToUse = modelId || DEFAULT_MODEL_ID;
    
    const {output} = await prompt(actualPromptInput, { model: modelToUse });
    return output!;
  }
);
