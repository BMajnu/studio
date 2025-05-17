
'use server';
/**
 * @fileOverview Generates a concise project brief based on client messages and history.
 *
 * - generateBrief - A function to generate a project brief.
 * - GenerateBriefInput - The input type for the generateBrief function.
 * - GenerateBriefOutput - The return type for the generateBrief function.
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

const GenerateBriefInputSchema = z.object({
  clientMessage: z.string().describe('The current client message to process.'),
  userName: z.string().describe('The name of the user (designer).'),
  communicationStyleNotes: z.string().describe('The communication style notes of the user.'),
  attachedFiles: z.array(AttachedFileSchema).optional().describe("Files attached by the user. Images as dataUris, text files as textContent."),
  chatHistory: z.array(ChatHistoryMessageSchema).optional().describe("A summary of recent messages in the conversation. The current clientMessage is NOT part of this history."),
});
export type GenerateBriefInput = z.infer<typeof GenerateBriefInputSchema>;

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
  return generateBriefFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateBriefPrompt',
  input: { schema: GenerateBriefInputSchema },
  output: { schema: GenerateBriefOutputSchema },
  prompt: `You are an expert project manager assisting a designer named {{{userName}}}.
Their communication style is: {{{communicationStyleNotes}}}.

Your task is to generate a concise and structured project brief based on the client's latest message, any attached files, and the entire conversation history.

**Conversation Context:**
{{#if chatHistory.length}}
Previous conversation:
{{#each chatHistory}}
{{this.role}}: {{{this.text}}}
---
{{/each}}
{{else}}
No previous conversation history available. Base the brief on the current message and attachments.
{{/if}}

**Client's Current Message (analyze this in light of the full history):**
{{{clientMessage}}}

{{#if attachedFiles.length}}
**Attached Files (consider their content or existence):**
{{#each attachedFiles}}
- File: {{this.name}} (Type: {{this.type}})
  {{#if this.dataUri}}
    (Image content: {{media url=this.dataUri}})
  {{else if this.textContent}}
    Content of {{this.name}}: {{{this.textContent}}}
  {{else}}
    (File type {{this.type}} not directly viewable, note its existence and name if client refers to it.)
  {{/if}}
{{/each}}
{{/if}}

**Generate the Project Brief with the following sections. If information for a section is not explicitly available or strongly implied, state "Not specified" for that section.**

1.  **Project Title:** A concise title for the project (e.g., 'T-Shirt Design for DesAInR Launch Event'). If not easily identifiable, generate a plausible one based on content.
2.  **Project Summary:** A brief overview of the project.
3.  **Key Objectives:** Main goals the client wants to achieve.
4.  **Target Audience:** Intended audience for the design.
5.  **Design Considerations:** Specific styles, colors, elements, inspirations, or constraints.
6.  **Potential Deliverables:** Likely output files or formats.
7.  **Timeline Notes:** Any mention of urgency or deadlines.
8.  **Budget Notes:** Any mention of budget or pricing.

Output Format (ensure your entire response is a single JSON object matching this structure):
{
  "projectTitle": "...",
  "projectSummary": "...",
  "keyObjectives": "...",
  "targetAudience": "...",
  "designConsiderations": "...",
  "potentialDeliverables": "...",
  "timelineNotes": "...",
  "budgetNotes": "..."
}
`,
});

const generateBriefFlow = ai.defineFlow(
  {
    name: 'generateBriefFlow',
    inputSchema: GenerateBriefInputSchema,
    outputSchema: GenerateBriefOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    return output!;
  }
);
