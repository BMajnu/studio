
'use server';
/**
 * @fileOverview This file is DEPRECATED and will be removed.
 * The functionality has been replaced by generate-engagement-pack-flow.ts
 */

import {ai} from '@/ai/genkit'; // Keep global ai for potential other uses if any, or remove if truly unused.
import {z} from 'genkit';
// Removed DEFAULT_MODEL_ID import as this flow is deprecated and doesn't use it.
// No need to import genkit or googleAI here as this flow is deprecated.

const AttachedFileSchema = z.object({
  name: z.string().describe("Name of the file"),
  type: z.string().describe("MIME type of the file"),
  dataUri: z.string().optional().describe("Base64 data URI for image files."),
  textContent: z.string().optional().describe("Text content for text files.")
});

const ChatHistoryMessageSchema = z.object({
  role: z.enum(['user', 'assistant']),
  text: z.string(),
});

// Schema for the flow's input, including modelId and userApiKey (though not used by deprecated logic)
const GenerateBriefFlowInputSchema = z.object({
  clientMessage: z.string().describe('The current client message to process.'),
  userName: z.string().describe('The name of the user (designer).'),
  communicationStyleNotes: z.string().describe('The communication style notes of the user.'),
  attachedFiles: z.array(AttachedFileSchema).optional().describe("Files attached by the user."),
  chatHistory: z.array(ChatHistoryMessageSchema).optional().describe("Conversation history."),
  modelId: z.string().optional().describe('Genkit model ID (not used).'),
  userApiKey: z.string().optional().describe('User-provided API key (not used).'),
});
export type GenerateBriefInput = z.infer<typeof GenerateBriefFlowInputSchema>;


const GenerateBriefOutputSchema = z.object({
  projectTitle: z.string().describe("A concise title for the project."),
  projectSummary: z.string().describe("A brief overview of the project."),
  keyObjectives: z.string().describe("Main goals or outcomes."),
  targetAudience: z.string().describe("Intended audience for the design."),
  designConsiderations: z.string().describe("Specific styles, colors, elements."),
  potentialDeliverables: z.string().describe("Likely output files or formats."),
  timelineNotes: z.string().describe("Timeline implications."),
  budgetNotes: z.string().describe("Budget constraints."),
});
export type GenerateBriefOutput = z.infer<typeof GenerateBriefOutputSchema>;

export async function generateBrief(input: GenerateBriefInput): Promise<GenerateBriefOutput> {
  console.warn("generateBriefFlow is deprecated and will be removed. Use generateEngagementPackFlow instead.");
  return {
    projectTitle: "Deprecated Flow",
    projectSummary: "This flow ('generateBrief') is no longer active and has been replaced by the 'Brief' (Generate Engagement Pack) button's functionality. Please use the updated feature.",
    keyObjectives: "N/A",
    targetAudience: "N/A",
    designConsiderations: "N/A",
    potentialDeliverables: "N/A",
    timelineNotes: "N/A",
    budgetNotes: "N/A",
  };
}

// Original prompt and flow definition are removed as this flow is deprecated.
