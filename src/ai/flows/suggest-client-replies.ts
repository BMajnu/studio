
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

const ChatHistoryMessageSchema = z.object({
  role: z.enum(['user', 'assistant']),
  text: z.string(),
});

const SuggestClientRepliesInputSchema = z.object({
  clientMessage: z.string().describe("The client's current message to the designer."),
  userName: z.string().describe('The name of the designer.'),
  professionalTitle: z.string().optional().describe('The professional title of the designer.'),
  communicationStyleNotes: z.string().optional().describe('Keywords describing the designer\'s communication style.'),
  services: z.array(z.string()).optional().describe('List of services offered by the designer.'),
  chatHistory: z.array(ChatHistoryMessageSchema).optional().describe("A summary of recent messages in the conversation, if any. The current clientMessage is NOT part of this history."),
});

export type SuggestClientRepliesInput = z.infer<typeof SuggestClientRepliesInputSchema>;

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
  input: {schema: SuggestClientRepliesInputSchema},
  output: {schema: SuggestClientRepliesOutputSchema},
  prompt: `You are a professional assistant helping a graphic designer. The designer's name is {{userName}}{{#if professionalTitle}}, and their professional title is {{professionalTitle}}{{/if}}.
Their communication style can be described as: {{communicationStyleNotes}}.
They offer the following services: {{#if services.length}}{{#each services}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}{{else}}a variety of graphic design services{{/if}}.

{{#if chatHistory.length}}
Previous conversation context:
{{#each chatHistory}}
{{this.role}}: {{{this.text}}}
{{/each}}
---
{{/if}}

The client has now sent the following message:
"{{{clientMessage}}}"

Based on the client's current message and the conversation history (if any), generate two distinct professional replies in English that reflect the designer's style and name. If appropriate, include a call to action related to the designer's services or the ongoing discussion.
Also, generate Bengali translations of these English replies.

Return the replies and translations as a JSON object.
`,
});

const suggestClientRepliesFlow = ai.defineFlow(
  {
    name: 'suggestClientRepliesFlow',
    inputSchema: SuggestClientRepliesInputSchema,
    outputSchema: SuggestClientRepliesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
