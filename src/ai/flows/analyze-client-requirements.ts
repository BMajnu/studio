
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

// Internal Zod schema, not exported
const AnalyzeClientRequirementsInputSchema = z.object({
  clientMessage: z.string().describe('The current client message to process.'),
  userName: z.string().describe('The name of the user (designer).'),
  communicationStyleNotes: z.string().describe('The communication style notes of the user.'),
  attachedFiles: z.array(AttachedFileSchema).optional().describe("Files attached by the user. Images should be passed as dataUris. Text files as textContent."),
  chatHistory: z.array(ChatHistoryMessageSchema).optional().describe("A summary of recent messages in the conversation, if any. The current clientMessage is NOT part of this history."),
});
export type AnalyzeClientRequirementsInput = z.infer<typeof AnalyzeClientRequirementsInputSchema>;

// Internal Zod schema, not exported
const AnalyzeClientRequirementsOutputSchema = z.object({
  mainRequirementsAnalysis: z.string().describe('Paragraph 1: Identification and analysis of the client\'s main requirements.'),
  detailedRequirementsEnglish: z.string().describe('Paragraph 2: Detailed breakdown of all requirements in English, specifying which should be prioritized and which can be overlooked, with proper reasoning. Ensure no requirements are skipped.'),
  detailedRequirementsBangla: z.string().describe('Paragraph 3: Detailed breakdown of all requirements in Bangla, specifying which should be prioritized and which can be overlooked, with proper reasoning. Ensure no requirements are skipped.'),
  designMessageOrSaying: z.string().describe('Paragraph 4: The message, text, slogan, or saying that should be part of the design. If none, state that clearly.'),
});
export type AnalyzeClientRequirementsOutput = z.infer<typeof AnalyzeClientRequirementsOutputSchema>;

export async function analyzeClientRequirements(input: AnalyzeClientRequirementsInput): Promise<AnalyzeClientRequirementsOutput> {
  return analyzeClientRequirementsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeClientRequirementsPrompt',
  input: {
    schema: AnalyzeClientRequirementsInputSchema, // Use internal schema
  },
  output: {
    schema: AnalyzeClientRequirementsOutputSchema, // Use internal schema
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

const analyzeClientRequirementsFlow = ai.defineFlow(
  {
    name: 'analyzeClientRequirementsFlow',
    inputSchema: AnalyzeClientRequirementsInputSchema, // Use internal schema
    outputSchema: AnalyzeClientRequirementsOutputSchema, // Use internal schema
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

