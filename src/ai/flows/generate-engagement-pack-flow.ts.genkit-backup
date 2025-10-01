
'use server';
/**
 * @fileOverview Generates a comprehensive engagement pack for client interaction.
 * This includes a personalized introduction, a job reply, budget/timeline/software suggestions,
 * and clarifying questions.
 *
 * - generateEngagementPack - Function to generate the engagement pack.
 * - GenerateEngagementPackInput - Input type for the function.
 * - GenerateEngagementPackOutput - Output type for the function.
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
const GenerateEngagementPackFlowInputSchema = z.object({
  clientMessage: z.string().describe('The current client message to process.'),
  designerName: z.string().describe("The designer's name (e.g., B. Majnu)."),
  designerRawStatement: z.string().describe("The designer's full raw personal statement detailing their skills, experience, Fiverr profile, feedback stats etc. The AI will rewrite and tailor this."),
  designerCommunicationStyle: z.string().optional().describe("Keywords describing the designer's communication style (e.g., 'friendly, professional')."),
  attachedFiles: z.array(AttachedFileSchema).optional().describe("Files attached by the user. Images as dataUris, text files as textContent."),
  chatHistory: z.array(ChatHistoryMessageSchema).optional().describe("A summary of recent messages in the conversation. The current clientMessage is NOT part of this history."),
  modelId: z.string().optional().describe('The Genkit model ID to use for this request.'),
  userApiKey: z.string().optional().describe('User-provided Gemini API key.'),
});
export type GenerateEngagementPackInput = z.infer<typeof GenerateEngagementPackFlowInputSchema>;

// Schema for the prompt's specific input (does not include modelId or userApiKey)
const GenerateEngagementPackPromptInputSchema = z.object({
  clientMessage: z.string().describe('The current client message to process.'),
  designerName: z.string().describe("The designer's name (e.g., B. Majnu)."),
  designerRawStatement: z.string().describe("The designer's full raw personal statement detailing their skills, experience, Fiverr profile, feedback stats etc. The AI will rewrite and tailor this."),
  designerCommunicationStyle: z.string().optional().describe("Keywords describing the designer's communication style (e.g., 'friendly, professional')."),
  attachedFiles: z.array(AttachedFileSchema).optional().describe("Files attached by the user. Images as dataUris, text files as textContent."),
  chatHistory: z.array(ChatHistoryMessageSchema).optional().describe("A summary of recent messages in the conversation. The current clientMessage is NOT part of this history."),
});


const GenerateEngagementPackOutputSchema = z.object({
  clientGreetingName: z.string().describe("The client's name if found in history/message, otherwise 'there' (e.g., 'John' or 'there')."),
  personalizedIntroduction: z.string().describe("A concise, AI-rewritten introduction of the designer, tailored to be highly relevant to the client's specific request based on their message and the designer's raw statement. Focus on skills matching the request."),
  jobReplyToClient: z.string().describe("A professional, friendly, confident, and easy-to-understand reply to the client, addressing their current message and incorporating the personalized introduction implicitly or explicitly."),
  suggestedBudget: z.string().describe("A suggestion for a competitive/cheaper budget range to discuss with the client for the perceived task."),
  suggestedTimeline: z.string().describe("A suggestion for how long the perceived task might take."),
  suggestedSoftware: z.string().describe("Software suggestions relevant for completing the perceived task efficiently."),
  clarifyingQuestions: z.array(z.string()).describe("A few specific questions to ask the client to get started on the job or clarify requirements."),
});
export type GenerateEngagementPackOutput = z.infer<typeof GenerateEngagementPackOutputSchema>;

export async function generateEngagementPack(flowInput: GenerateEngagementPackInput): Promise<GenerateEngagementPackOutput> {
  const { userApiKey, modelId, clientMessage, designerName, designerRawStatement, designerCommunicationStyle, attachedFiles, chatHistory } = flowInput;
  const actualPromptInputData = { clientMessage, designerName, designerRawStatement, designerCommunicationStyle, attachedFiles, chatHistory };
  const modelToUse = modelId || DEFAULT_MODEL_ID;
  const flowName = 'generateEngagementPack';

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
  
  const generateEngagementPackPrompt = currentAiInstance.definePrompt({
    name: `${flowName}Prompt_${Date.now()}`,
    input: { schema: GenerateEngagementPackPromptInputSchema }, 
    output: { schema: GenerateEngagementPackOutputSchema },
    prompt: `You are an expert assistant for a graphic designer named {{{designerName}}}.
Their communication style is: {{{designerCommunicationStyle}}}.

**Objective:** Generate a comprehensive engagement pack to help {{{designerName}}} respond to a client's message. This pack includes a personalized introduction, a job reply, budget/timeline/software suggestions, and clarifying questions.

**Designer's Raw Personal Statement (Use this as a base for the personalized introduction):**
{{{designerRawStatement}}}

**Conversation Context:**
{{#if chatHistory.length}}
Previous conversation:
{{#each chatHistory}}
{{this.role}}: {{{this.text}}}
---
{{/each}}
{{else}}
No previous conversation history available. Base the response on the current message and attachments.
{{/if}}

**Client's Current Message (analyze this in light of the full history and attachments):**
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

**Task Breakdown:**

1.  **Client Greeting Name:**
    *   Analyze the \`chatHistory\` and \`clientMessage\` to find the client's name.
    *   If a name is identified, set \`clientGreetingName\` to that name.
    *   If no name is clearly identifiable, set \`clientGreetingName\` to "there".

2.  **Personalized Introduction for Designer (Field: \`personalizedIntroduction\`):**
    *   Based on the client's *current request* (derived from their message, history, and attachments) and the \`designerRawStatement\`, rewrite a concise and *highly relevant* introduction for {{{designerName}}}.
    *   This introduction should highlight the designer's skills and experience *specifically matching the client's perceived needs*. For example, if the client asks for a "t-shirt design", the rewritten statement should primarily emphasize t-shirt design skills.
    *   Omit any skills or details from the raw statement that are not directly relevant to the client's current query.
    *   The goal is a short, impactful introduction that shows the designer is a perfect fit for *this specific job*. (e.g., "I'm {{{designerName}}}, a professional T-shirt designer with X years of experience creating unique and eye-catching apparel...")

3.  **Job Reply to Client (Field: \`jobReplyToClient\`):**
    *   Craft a professional, friendly, confident, and easy-to-understand reply to the client.
    *   This reply should directly address the client's current message, using the \`clientGreetingName\`.
    *   It should naturally lead from or incorporate the \`personalizedIntroduction\`.
    *   It should express enthusiasm and readiness to help.

4.  **Suggestions (Fields: \`suggestedBudget\`, \`suggestedTimeline\`, \`suggestedSoftware\`):**
    *   **Budget:** Based on the perceived task from the client's request, suggest a competitive and "cheaper" budget range that {{{designerName}}} could propose or discuss. (e.g., "For a project like this, a typical budget range is $X - $Y. We can discuss specifics to fit your needs.").
    *   **Timeline:** Suggest a general timeline for completing the perceived task. (e.g., "This type of project usually takes about X-Y days.").
    *   **Software:** Briefly mention 1-2 relevant software tools {{{designerName}}} might use, implying efficiency. (e.g., "I typically use tools like Adobe Illustrator and Photoshop to ensure high-quality results.").

5.  **Clarifying Questions for Client (Field: \`clarifyingQuestions\` - an array of strings):**
    *   Generate 3-4 specific and actionable questions that {{{designerName}}} needs to ask the client to get started or to better understand the requirements for the *current request*. These should go beyond generic questions if details are already provided.

**Output Format:** Ensure your entire response is a single JSON object matching the \`GenerateEngagementPackOutputSchema\`.
Example for clarifyingQuestions: ["What is the primary message you want the design to convey?", "Do you have any specific brand colors or fonts to incorporate?"]
`,
  });
  
  try {
    console.log(`INFO (${flowName}): Making AI call using API key from: ${apiKeySourceForLog}`);
    const {output} = await generateEngagementPackPrompt(actualPromptInputData, { model: modelToUse });
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
