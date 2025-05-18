
// src/ai/flows/generate-platform-messages.ts
'use server';
/**
 * @fileOverview A flow for generating standardized platform messages for order delivery and revisions, tailored with the user's details.
 *
 * - generatePlatformMessages - A function that handles the generation of platform messages.
 * - GeneratePlatformMessagesInput - The input type for the generatePlatformMessages function.
 * - GeneratePlatformMessagesOutput - The return type for the generatePlatformMessages function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { DEFAULT_MODEL_ID } from '@/lib/constants';

// Schema for the flow's input, including modelId
const GeneratePlatformMessagesFlowInputSchema = z.object({
  name: z.string().describe('The name of the designer.'),
  professionalTitle: z.string().describe('The professional title of the designer.'),
  services: z.array(z.string()).describe('A list of services offered by the designer.'),
  deliveryNotes: z.string().describe('Any notes about the delivery.'),
  revisionNotes: z.string().describe('Any notes about the revision.'),
  fiverrUsername: z.string().describe('The Fiverr username of the designer.'),
  customSellerFeedbackTemplate: z.string().describe('Custom seller feedback template.'),
  customClientFeedbackResponseTemplate: z.string().describe('Custom client feedback response template.'),
  messageType: z.enum(['delivery', 'revision']).describe('The type of message to generate (delivery or revision).'),
  modelId: z.string().optional().describe('The Genkit model ID to use for this request.'),
});
export type GeneratePlatformMessagesInput = z.infer<typeof GeneratePlatformMessagesFlowInputSchema>;

// Schema for the prompt's specific input (does not include modelId)
const GeneratePlatformMessagesPromptInputSchema = z.object({
  name: z.string().describe('The name of the designer.'),
  professionalTitle: z.string().describe('The professional title of the designer.'),
  services: z.array(z.string()).describe('A list of services offered by the designer.'),
  deliveryNotes: z.string().describe('Any notes about the delivery.'),
  revisionNotes: z.string().describe('Any notes about the revision.'),
  fiverrUsername: z.string().describe('The Fiverr username of the designer.'),
  customSellerFeedbackTemplate: z.string().describe('Custom seller feedback template.'),
  customClientFeedbackResponseTemplate: z.string().describe('Custom client feedback response template.'),
  messageType: z.enum(['delivery', 'revision']).describe('The type of message to generate (delivery or revision).'),
});


const GeneratePlatformMessagesOutputSchema = z.object({
  messages: z.array(
    z.object({
      message: z.string().describe('The generated platform message.'),
      type: z.string().describe('The type of message (delivery, revision, follow-up).'),
    })
  ),
});
export type GeneratePlatformMessagesOutput = z.infer<typeof GeneratePlatformMessagesOutputSchema>;

export async function generatePlatformMessages(input: GeneratePlatformMessagesInput): Promise<GeneratePlatformMessagesOutput> {
  return generatePlatformMessagesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generatePlatformMessagesPrompt',
  input: {schema: GeneratePlatformMessagesPromptInputSchema}, // Use prompt-specific schema
  output: {schema: GeneratePlatformMessagesOutputSchema},
  prompt: `You are a professional assistant helping a graphic designer named {{name}}.
  {{name}}'s professional title is {{professionalTitle}} and their Fiverr username is {{fiverrUsername}}.
  They offer the following services:
  {{#each services}}
  - {{this}}
  {{/each}}

  You are generating messages for the {{messageType}} process on a platform like Fiverr.

  Here are some delivery notes: {{{deliveryNotes}}}
  Here are some revision notes: {{{revisionNotes}}}
  Here is the custom seller feedback template: {{{customSellerFeedbackTemplate}}}
  Here is the custom client feedback response template: {{{customClientFeedbackResponseTemplate}}}

  Generate three message options for the {{messageType}} process, and make the third one concise.
  Also generate automated follow-up content, including a Thank You message with the designer's service list, a Seller Feedback template, and a Client Feedback Response template.

  Return the messages in the following JSON format:
  {
    "messages": [
      { "message": "...", "type": "delivery" },
      { "message": "...", "type": "delivery" },
      { "message": "...", "type": "delivery" },
      { "message": "...", "type": "follow-up" },
      { "message": "...", "type": "follow-up" },
      { "message": "...", "type": "follow-up" }
    ]
  }
  `,
});

const generatePlatformMessagesFlow = ai.defineFlow(
  {
    name: 'generatePlatformMessagesFlow',
    inputSchema: GeneratePlatformMessagesFlowInputSchema, // Use flow-specific schema
    outputSchema: GeneratePlatformMessagesOutputSchema,
  },
  async (flowInput) => {
    const { modelId, ...actualPromptInput } = flowInput;
    const modelToUse = modelId || DEFAULT_MODEL_ID;

    const {output} = await prompt(actualPromptInput, { model: modelToUse });
    return output!;
  }
);
