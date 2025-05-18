
'use server';
/**
 * @fileOverview This file is DEPRECATED and will be removed.
 * The functionality has been replaced by generate-engagement-pack-flow.ts
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
// Removed DEFAULT_MODEL_ID import as this flow is deprecated and doesn't use it.

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

// Schema for the flow's input, including modelId (though not used by deprecated logic)
const GenerateBriefFlowInputSchema = z.object({
  clientMessage: z.string().describe('The current client message to process.'),
  userName: z.string().describe('The name of the user (designer).'),
  communicationStyleNotes: z.string().describe('The communication style notes of the user.'),
  attachedFiles: z.array(AttachedFileSchema).optional().describe("Files attached by the user. Images as dataUris, text files as textContent."),
  chatHistory: z.array(ChatHistoryMessageSchema).optional().describe("A summary of recent messages in the conversation. The current clientMessage is NOT part of this history."),
  modelId: z.string().optional().describe('The Genkit model ID to use for this request (not used by deprecated flow).'),
});
export type GenerateBriefInput = z.infer<typeof GenerateBriefFlowInputSchema>;


const GenerateBriefOutputSchema = z.object({
  projectTitle: z.string().describe("A concise title for the project (e.g., 'T-Shirt Design for DesAInR Launch Event'). If not easily identifiable, generate a plausible one based on content."),
  projectSummary: z.string().describe("A brief overview of the project based on the client's request and conversation history."),
  keyObjectives: z.string().describe("Main goals or outcomes the client wants to achieve with this project."),
  targetAudience: z.string().describe("Description of the intended audience for the design. If not specified, state 'Not specified'."),
  designConsiderations: z.string().describe("Specific styles, colors, elements, inspirations, or constraints mentioned or implied."),
  potentialDeliverables: z.string().describe("Likely output files or formats needed (e.g., 'High-resolution PNG for T-shirt printing', 'Vector logo files'). If not specified, state 'Not specified'."),
  timelineNotes: z.string().describe("Any discussion or implication of urgency, deadlines, or project timeline. If not specified, state 'Not specified'."),
  budgetNotes: z.string().describe("Any discussion or implication of budget constraints or pricing. If not specified, state 'Not specified'."),
});
export type GenerateBriefOutput = z.infer<typeof GenerateBriefOutputSchema>;

export async function generateBrief(input: GenerateBriefInput): Promise<GenerateBriefOutput> {
  // This flow is deprecated. Consider removing or redirecting.
  console.warn("generateBriefFlow is deprecated and will be removed. Use generateEngagementPackFlow instead.");
  // Fallback to a simpler response or throw an error
  return {
    projectTitle: "Deprecated Flow",
    projectSummary: "This flow is no longer active. Please use the updated 'Brief' (Engagement Pack) button.",
    keyObjectives: "N/A",
    targetAudience: "N/A",
    designConsiderations: "N/A",
    potentialDeliverables: "N/A",
    timelineNotes: "N/A",
    budgetNotes: "N/A",
  };
}

// Original prompt and flow definition are commented out or removed as this flow is deprecated.
/*
const prompt = ai.definePrompt({
  name: 'generateBriefPrompt',
  input: { schema: GenerateBriefInputSchema }, // This would need to be a prompt-specific schema without modelId
  output: { schema: GenerateBriefOutputSchema },
  prompt: `... original prompt ...`,
});

const generateBriefFlow = ai.defineFlow(
  {
    name: 'generateBriefFlow',
    inputSchema: GenerateBriefFlowInputSchema, // Flow schema includes modelId
    outputSchema: GenerateBriefOutputSchema,
  },
  async (flowInput) => {
    const { modelId, ...actualPromptInput } = flowInput;
    const modelToUse = modelId || DEFAULT_MODEL_ID; // Or some other default
    const {output} = await prompt(actualPromptInput, { model: modelToUse });
    return output!;
  }
);
*/
