'use server';
/**
 * @fileOverview Generates personalized and styled professional replies for clients.
 *
 * - suggestClientReplies - A function that generates client replies based on user profile.
 * - SuggestClientRepliesInput - The input type for the suggestClientReplies function.
 * - SuggestClientRepliesOutput - The return type for the suggestClientReplies function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestClientRepliesInputSchema = z.object({
  clientMessage: z.string().describe('The client\'s message to the designer.'),
  userName: z.string().describe('The name of the designer.'),
  professionalTitle: z.string().optional().describe('The professional title of the designer.'),
  communicationStyleNotes: z.string().optional().describe('Keywords describing the designer\'s communication style.'),
  services: z.array(z.string()).optional().describe('List of services offered by the designer.'),
});

export type SuggestClientRepliesInput = z.infer<typeof SuggestClientRepliesInputSchema>;

const SuggestClientRepliesOutputSchema = z.object({
  englishReplies: z.array(z.string()).describe('Two suggested English replies, reflecting the user\'s style and name.'),
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
  prompt: `You are a professional assistant helping a graphic designer. The designer's name is {{userName}}, and their professional title is {{professionalTitle}}. Their communication style can be described as: {{communicationStyleNotes}}. They offer the following services: {{#each services}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}.

  The client has sent the following message: {{{clientMessage}}}

  Generate two distinct professional replies in English that reflect the designer's style and name. If possible, include a call to action related to the designer's services.
  Also generate Bengali translations of these replies.  Return the replies and translations as a JSON object.
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
