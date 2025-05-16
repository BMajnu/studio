'use server';

/**
 * @fileOverview Processes client messages to analyze, simplify, outline steps,
 * and provide a Bengali translation.
 *
 * - processClientMessage - A function to process client messages.
 * - ProcessClientMessageInput - The input type for the processClientMessage function.
 * - ProcessClientMessageOutput - The return type for the processClientMessage function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ProcessClientMessageInputSchema = z.object({
  clientMessage: z.string().describe('The client message to process.'),
  userName: z.string().describe('The name of the user.'),
  communicationStyleNotes: z.string().describe('The communication style notes of the user.'),
});
export type ProcessClientMessageInput = z.infer<typeof ProcessClientMessageInputSchema>;

const ProcessClientMessageOutputSchema = z.object({
  analysis: z.string().describe('Analysis of the client message.'),
  simplifiedRequest: z.string().describe('Simplified version of the request.'),
  stepByStepApproach: z.string().describe('Step-by-step approach to fulfill the request.'),
  bengaliTranslation: z.string().describe('Bengali translation of the analysis, simplified request, and step-by-step approach.'),
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
  prompt: `You are a helpful AI assistant for graphic designers. Your task is to process client messages, providing analysis, simplification, a step-by-step approach, and a Bengali translation. Consider the user's name and preferred communication style when crafting the response.\n\nUser Name: {{{userName}}}\nCommunication Style: {{{communicationStyleNotes}}}\n\nClient Message: {{{clientMessage}}}\n\nAnalysis:\n{{$json.analysis}}\n\nSimplified Request:\n{{$json.simplifiedRequest}}\n\nStep-by-Step Approach:\n{{$json.stepByStepApproach}}\n\nBengali Translation:\n{{$json.bengaliTranslation}}`,
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
