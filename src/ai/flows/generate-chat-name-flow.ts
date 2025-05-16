
'use server';
/**
 * @fileOverview Generates a concise name for a chat session.
 *
 * - generateChatName - A function that generates a chat name based on initial messages.
 * - GenerateChatNameInput - The input type for the generateChatName function.
 * - GenerateChatNameOutput - The return type for the generateChatName function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateChatNameInputSchema = z.object({
  firstUserMessage: z.string().describe("The first message sent by the user in the chat."),
  firstAssistantMessage: z.string().optional().describe("The first reply from the assistant, if available."),
});
export type GenerateChatNameInput = z.infer<typeof GenerateChatNameInputSchema>;

const GenerateChatNameOutputSchema = z.object({
  chatName: z.string().describe("A short, descriptive name for the chat session (max 5 words, e.g., 'T-Shirt Design Inquiry')."),
});
export type GenerateChatNameOutput = z.infer<typeof GenerateChatNameOutputSchema>;

export async function generateChatName(input: GenerateChatNameInput): Promise<GenerateChatNameOutput> {
  return generateChatNameFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateChatNamePrompt',
  input: {schema: GenerateChatNameInputSchema},
  output: {schema: GenerateChatNameOutputSchema},
  prompt: `Based on the following initial messages in a conversation with a graphic designer, generate a very short, descriptive title or name for this chat session. The name should be a maximum of 5 words and capture the main topic.

User's first message: "{{firstUserMessage}}"
{{#if firstAssistantMessage}}
Assistant's first reply: "{{firstAssistantMessage}}"
{{/if}}

Examples:
- User: "Hi, I need a logo for my new coffee shop." -> "Coffee Shop Logo"
- User: "Can you help with some t-shirt designs for an event?" -> "T-Shirt Design Event"
- User: "I have a quick question about revisions." -> "Revision Question"

Generate a suitable name for the provided messages.
`,
});

const generateChatNameFlow = ai.defineFlow(
  {
    name: 'generateChatNameFlow',
    inputSchema: GenerateChatNameInputSchema,
    outputSchema: GenerateChatNameOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    return output!;
  }
);

