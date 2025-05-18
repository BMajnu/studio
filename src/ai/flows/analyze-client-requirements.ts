
'use server';
/**
 * @fileOverview Analyzes client requirements from a message and attachments, providing structured output.
 *
 * - analyzeClientRequirements - A function to process client messages for requirements.
 * - AnalyzeClientRequirementsInput - The input type for the analyzeClientRequirements function.
 * - AnalyzeClientRequirementsOutput - The return type for the analyzeClientRequirements function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { DEFAULT_MODEL_ID } from '@/lib/constants';
import { genkit } from 'genkit';
import { googleAI } from '@genkit-ai/googleai';

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

// Schema for the flow's input, including modelId and userApiKey
const AnalyzeClientRequirementsFlowInputSchema = z.object({
  clientMessage: z.string().describe('The current client message to process.'),
  userName: z.string().describe('The name of the user (designer).'),
  communicationStyleNotes: z.string().describe('The communication style notes of the user.'),
  attachedFiles: z.array(AttachedFileSchema).optional().describe("Files attached by the user. Images should be passed as dataUris. Text files as textContent."),
  chatHistory: z.array(ChatHistoryMessageSchema).optional().describe("A summary of recent messages in the conversation, if any. The current clientMessage is NOT part of this history."),
  modelId: z.string().optional().describe('The Genkit model ID to use for this request.'),
  userApiKey: z.string().optional().describe('User-provided Gemini API key.'),
});
export type AnalyzeClientRequirementsInput = z.infer<typeof AnalyzeClientRequirementsFlowInputSchema>;

// Schema for the prompt's specific input (does not include modelId or userApiKey)
const AnalyzeClientRequirementsPromptInputSchema = z.object({
  clientMessage: z.string().describe('The current client message to process.'),
  userName: z.string().describe('The name of the user (designer).'),
  communicationStyleNotes: z.string().describe('The communication style notes of the user.'),
  attachedFiles: z.array(AttachedFileSchema).optional().describe("Files attached by the user. Images should be passed as dataUris. Text files as textContent."),
  chatHistory: z.array(ChatHistoryMessageSchema).optional().describe("A summary of recent messages in the conversation, if any. The current clientMessage is NOT part of this history."),
});


const AnalyzeClientRequirementsOutputSchema = z.object({
  mainRequirementsAnalysis: z.string().describe('Paragraph 1: Identification and analysis of the client\'s main requirements.'),
  detailedRequirementsEnglish: z.string().describe('Paragraph 2: Detailed breakdown of all requirements in English, specifying which should be prioritized and which can be overlooked, with proper reasoning. Ensure no requirements are skipped.'),
  detailedRequirementsBangla: z.string().describe('Paragraph 3: Detailed breakdown of all requirements in Bangla, specifying which should be prioritized and which can be overlooked, with proper reasoning. Ensure no requirements are skipped.'),
  designMessageOrSaying: z.string().describe('Paragraph 4: The message, text, slogan, or saying that should be part of the design. If none, state that clearly.'),
});
export type AnalyzeClientRequirementsOutput = z.infer<typeof AnalyzeClientRequirementsOutputSchema>;

export async function analyzeClientRequirements(flowInput: AnalyzeClientRequirementsInput): Promise<AnalyzeClientRequirementsOutput> {
  const { userApiKey, modelId, clientMessage, userName, communicationStyleNotes, attachedFiles, chatHistory } = flowInput;
  const actualPromptInputData = { clientMessage, userName, communicationStyleNotes, attachedFiles, chatHistory };
  const modelToUse = modelId || DEFAULT_MODEL_ID;
  const flowName = 'analyzeClientRequirements';

  let currentAiInstance = ai; // Global Genkit instance by default
  let apiKeySourceForLog = "GOOGLE_API_KEY from .env file";

  if (userApiKey) {
    console.log(`INFO (${flowName}): Using user-provided API key.`);
    currentAiInstance = genkit({ plugins: [googleAI({ apiKey: userApiKey })] });
    apiKeySourceForLog = "User-provided API key from profile";
  } else if (process.env.GOOGLE_API_KEY) {
    console.log(`INFO (${flowName}): User API key not provided. Using GOOGLE_API_KEY from .env file.`);
  } else {
    console.error(`CRITICAL_ERROR (${flowName}): No API key available. Neither a user-provided API key nor the GOOGLE_API_KEY in the .env file is set.`);
    throw new Error(`API key configuration error in ${flowName}. AI features are unavailable.`);
  }

  const analyzeClientRequirementsPrompt = currentAiInstance.definePrompt({
    name: `${flowName}Prompt_${Date.now()}`,
    input: {
      schema: AnalyzeClientRequirementsPromptInputSchema, 
    },
    output: {
      schema: AnalyzeClientRequirementsOutputSchema, 
    },
    prompt: `You are a helpful AI assistant for a graphic designer named {{{userName}}}.
Their communication style is: {{{communicationStyleNotes}}}.

Your task is to thoroughly analyze the client's request based on their latest message, any attached files, and the conversation history. Provide a structured analysis in four distinct paragraphs.

{{#if chatHistory.length}}
Previous conversation context (analyze the current message in light of this history):
{{#each chatHistory}}
{{this.role}}: {{{this.text}}}
---
{{/each}}
{{/if}}

Client's Current Message:
{{{clientMessage}}}

{{#if attachedFiles.length}}
The client also attached the following files with their current message. Analyze these files as part of the requirements.
{{#each attachedFiles}}
- File: {{this.name}} (Type: {{this.type}})
  {{#if this.dataUri}}
    (This is an image. Analyze its content for design requirements: {{media url=this.dataUri}})
  {{else if this.textContent}}
    Content of {{this.name}}:
    {{{this.textContent}}}
  {{else}}
    (This file (e.g. PDF, other binary) content is not directly viewable by you, but its existence and the client's reference to it in their message might be relevant.)
  {{/if}}
{{/each}}
{{/if}}

Based on all the above information (latest message, attachments, and full history), provide the following four paragraphs:

1.  **Main Requirements Analysis:** Identify and analyze the client's main requirements. What are they fundamentally asking for?

2.  **Detailed Requirements (English):** Provide a detailed breakdown of *all* identified requirements in English. For each requirement, specify its priority (e.g., "High Priority/Must-have", "Medium Priority/Should-have", "Low Priority/Nice-to-have", or "Can be overlooked if necessary"). Include clear reasoning for each prioritization. Ensure *no requirement* mentioned or implied (from text or images) is skipped.

3.  **Detailed Requirements (Bangla):** Provide a detailed breakdown of *all* identified requirements in Bangla, using the same prioritization and reasoning structure as the English section. Ensure *no requirement* is skipped. (আপনার বিস্তারিত সমস্ত প্রয়োজনীয়তা বাংলায় তালিকাভুক্ত করুন, অগ্রাধিকার এবং কারণসহ, যেমন ইংরেজিতে করেছেন।)

4.  **Design Message or Saying:** Identify any explicit or implicit message, text, slogan, or saying that should be part of the design. If no specific text is mentioned for the design, clearly state that "No specific message or saying for the design was identified in the requirements."

Output Format (ensure your entire response is a single JSON object matching this structure):
{
  "mainRequirementsAnalysis": "...",
  "detailedRequirementsEnglish": "...",
  "detailedRequirementsBangla": "...",
  "designMessageOrSaying": "..."
}
`,
  });

  try {
    console.log(`INFO (${flowName}): Making AI call using API key from: ${apiKeySourceForLog}`);
    const {output} = await analyzeClientRequirementsPrompt(actualPromptInputData, { model: modelToUse });
    if (!output) {
      console.error(`ERROR (${flowName}): AI returned empty or undefined output.`);
      throw new Error(`AI response was empty or undefined in ${flowName}.`);
    }
    return output;
  } catch (error) {
    console.error(`ERROR (${flowName}): AI call failed (API key source: ${apiKeySourceForLog}). Error:`, error);
    throw new Error(`AI call failed in ${flowName}. Please check server logs for details. Original error: ${(error as Error).message}`);
  }
}
