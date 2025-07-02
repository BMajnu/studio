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

const DesignListItemSchema = z.object({
  id: z.string().describe("Unique identifier for the design item"),
  title: z.string().describe("Title/name of the design item"),
  description: z.string().describe("Brief description of the design"),
  textContent: z.string().optional().describe("Text/saying/quote if included in this design"),
  mustFollow: z.array(z.string()).optional().describe("Specific key requirement points that MUST be followed for this design")
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
  keyPointsEnglish: z.array(z.string()).describe('Key requirement points in English, presented as bullet points for easy reading'),
  keyPointsBengali: z.array(z.string()).describe('Key requirement points in Bengali, presented as bullet points for easy reading'),
  detailedRequirementsEnglish: z.string().describe('Detailed explanation of all requirements in English, using simplified expert-to-beginner language that explains what should be prioritized and why'),
  detailedRequirementsBengali: z.string().describe('Detailed explanation of all requirements in Bengali, using simplified expert-to-beginner language that explains what should be prioritized and why'),
  designMessageEnglish: z.string().describe('The message, text, slogan, or saying that should be part of the design in English. If none, state that clearly'),
  designMessageBengali: z.string().describe('The message, text, slogan, or saying that should be part of the design in Bengali. If none, state that clearly'),
  designNicheAndAudienceEnglish: z.string().describe('Information about the design niche, theme, and target audience in English'),
  designNicheAndAudienceBengali: z.string().describe('Information about the design niche, theme, and target audience in Bengali'),
  designItemsEnglish: z.array(DesignListItemSchema).describe('List of design items with descriptions in English'),
  designItemsBengali: z.array(DesignListItemSchema).describe('List of design items with descriptions in Bengali'),
  imageAnalysisEnglish: z.string().describe('Detailed description of any attached image(s) and how they relate to the requirements in English'),
  imageAnalysisBengali: z.string().describe('Detailed description of any attached image(s) and how they relate to the requirements in Bengali')
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

Your task is to thoroughly analyze the client's request based on their latest message, any attached files, and the conversation history. Provide a structured bilingual analysis in English and Bengali.

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

Based on all the above information (latest message, attachments, and full history), provide a comprehensive bilingual analysis split into 5 distinct sections, each in both English and Bengali:

1. **Key Requirements Points (Bullet Points)**
   - English: Create 3-7 clear, concise bullet points capturing the essential requirements
   - Bengali: Translate these same bullet points to Bengali

2. **Detailed Requirements Explanation**
   - English: Write a paragraph explaining all requirements in detail using simplified expert-to-beginner language. Specify which requirements should be prioritized and which can be considered secondary.
   - Bengali: Translate this detailed explanation to Bengali

3. **Design Message/Saying**
   - English: Identify any specific text, message, slogan or saying that should be included in the design. If none is specified, clearly state that.
   - Bengali: Translate this message/saying (or absence statement) to Bengali

4. **Design Niche, Theme and Target Audience**
   - English: Identify the design's niche or theme and the intended audience or consumers
   - Bengali: Translate this information to Bengali

5. **List of Required Designs**
   - English: Create a structured list of all designs the client is looking for. Each design should have:
     * A unique ID (e.g., "design_1", "design_2")
     * A clear title describing the design
     * A brief description of what it should include
     * Any quotes/sayings that should be incorporated (if applicable)
     * **A "Must follow:" section that lists the specific key requirement bullet points relevant to THIS design.** Present these bullet points as a bulleted list directly under the description so that the UI can render them together.
   - Bengali: Create the same structured list in Bengali, including the "Must follow:" bullet list translated into Bengali

6. **Image Description & Connection (Only if images are attached)**
   - English: Describe the main visual content of the attached image(s) in detail and explain how it connects to the client's request and possible design ideas.
   - Bengali: Provide the same description and explanation in Bengali.

Important Notes:
- Give each design item a unique ID so it can be referenced later
- Be specific about any text that should appear in the designs
- If analyzing images, extract any text visible in them and note their style/theme
- For each design, provide a basic concept idea in a single sentence

Output Format (ensure your entire response is a single JSON object):
{
  "keyPointsEnglish": ["Point 1", "Point 2", ...],
  "keyPointsBengali": ["বিন্দু ১", "বিন্দু ২", ...],
  "detailedRequirementsEnglish": "Detailed explanation...",
  "detailedRequirementsBengali": "বিস্তারিত ব্যাখ্যা...",
  "designMessageEnglish": "The specific message/saying or statement that none exists",
  "designMessageBengali": "নির্দিষ্ট বার্তা/বাণী অথবা কোন বার্তা নেই",
  "designNicheAndAudienceEnglish": "Information about niche and target audience",
  "designNicheAndAudienceBengali": "নিশ এবং টার্গেট অডিয়েন্স সম্পর্কে তথ্য",
  "designItemsEnglish": [
    {"id": "design_1", "title": "Design Title", "description": "What this design should include", "textContent": "Any text to include", "mustFollow": ["Requirement 1", "Requirement 2"]},
    ...
  ],
  "designItemsBengali": [
    {"id": "design_1", "title": "ডিজাইনের শিরোনাম", "description": "এই ডিজাইনে কী থাকা উচিত", "textContent": "যেকোনো টেক্সট অন্তর্ভুক্ত করতে", "mustFollow": ["দাবি ১", "দাবি ২"]},
    ...
  ],
  "imageAnalysisEnglish": "Description of image and its relation...",
  "imageAnalysisBengali": "ছবির বর্ণনা এবং এর সম্পর্ক..."
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
