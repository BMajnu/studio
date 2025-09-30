'use server';
/**
 * @fileOverview Analyzes client requirements from a message and attachments, providing structured output.
 *
 * - analyzeClientRequirements - A function to process client messages for requirements.
 * - AnalyzeClientRequirementsInput - The input type for the analyzeClientRequirements function.
 * - AnalyzeClientRequirementsOutput - The return type for the analyzeClientRequirements function.
 */

import {z} from 'genkit';
import { DEFAULT_MODEL_ID } from '@/lib/constants';
import { GeminiClient } from '@/lib/ai/gemini-client';
import { createGeminiAiInstance } from '@/lib/ai/genkit-utils';

// DEBUG logging helper
const logDebug = (label: string, ...args: any[]) => {
  try { console.log(`[analyzeClientRequirements] ${label}`, ...args); } catch(_){}
};

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

const EditingPromptSchema = z.object({
  type: z.string().describe("A category for the prompt, e.g., 'must_need_edits', 'all_edits', 'make_standout', 'make_colorful', 'new_variations'."),
  prompt: z.string().describe('The generated editing prompt for an AI image generation/editing tool.'),
});
// New: Per-design editing prompt schema (one prompt per design when multiple designs exist)
const DesignEditingPromptPerDesignSchema = z.object({
  designId: z.string().describe('The ID of the design this prompt applies to (must match designItemsEnglish[].id).'),
  designTitle: z.string().optional().describe('Optional title of the design for display convenience.'),
  imageIndex: z.number().optional().describe('Optional 1-based index of the related image order if applicable.'),
  prompt: z.string().describe('A single, consolidated editing prompt for this specific design. Must explicitly mention the related image by order (e.g., "First image", "Second image").')
});

const AnalyzeClientRequirementsOutputSchema = z.object({
  keyPointsEnglish: z.array(z.string()).describe('Key requirement points in English, presented as bullet points for easy reading'),
  keyPointsBengali: z.array(z.string()).describe('Key requirement points in Bengali, presented as bullet points for easy reading'),
  detailedRequirementsEnglish: z.string().describe('Detailed explanation of all requirements in English, using simplified expert-to-beginner language that explains what should be prioritized and why'),
  detailedRequirementsBengali: z.string().describe('Detailed explanation of all requirements in Bengali, using simplified expert-to-beginner language that explains what should be prioritized and why'),
  // NEW: A concise, simplified version of the requirements distinct from the detailed explanation
  simplifiedRequirementsEnglish: z.string().describe('A concise, simplified summary of the requirements in English (2-6 short bullet points or a short paragraph). Must be distinct from the detailed explanation.'),
  simplifiedRequirementsBengali: z.string().describe('A concise, simplified summary of the requirements in Bengali (2-6 short bullet points or a short paragraph). Must be distinct from the detailed explanation.'),
  designItemsEnglish: z.array(DesignListItemSchema).describe('List of design items with descriptions in English'),
  designItemsBengali: z.array(DesignListItemSchema).describe('List of design items with descriptions in Bengali'),
  imageAnalysisEnglish: z.string().describe('Detailed description of any attached image(s) and how they relate to the requirements in English'),
  imageAnalysisBengali: z.string().describe('Detailed description of any attached image(s) and how they relate to the requirements in Bengali'),
  shortImageSummaryEnglish: z.string().optional().describe('A directive summarizing the visual style from reference images to be applied to the new design. Example: "The new design must follow the reference images \'.........[describe what got from the iamge to design the new design, like style, design, color, typogrpahy style, design theme, etc]......\'"'),
  shortImageSummaryBengali: z.string().optional().describe('A directive summarizing the visual style from reference images, translated to Bengali.'),
  editingPrompts: z.array(EditingPromptSchema).describe('Exactly 5 editing prompts for image editing models; generate in prompt-only mode if no image is available.'),
  // New optional: when multiple distinct designs exist, also return one prompt per design for clarity
  editingPromptsByDesign: z.array(DesignEditingPromptPerDesignSchema).optional().describe('When multiple designs are present, provide one explicit editing prompt per design, referencing image order and specific changes.')
});
export type AnalyzeClientRequirementsOutput = z.infer<typeof AnalyzeClientRequirementsOutputSchema>;

export async function analyzeClientRequirements(flowInput: AnalyzeClientRequirementsInput): Promise<AnalyzeClientRequirementsOutput> {
  logDebug('input attachments', flowInput.attachedFiles?.length || 0);
  try { logDebug('input size', JSON.stringify(flowInput).length, 'bytes'); } catch(_){}
  const { userApiKey, modelId, clientMessage, userName, communicationStyleNotes, attachedFiles, chatHistory } = flowInput;
  const actualPromptInputData = { clientMessage, userName, communicationStyleNotes, attachedFiles, chatHistory };
  const modelToUse = modelId || DEFAULT_MODEL_ID;
  const flowName = 'analyzeClientRequirements';

  const profileStub = userApiKey ? ({ userId: 'tmp', name: 'tmp', services: [], geminiApiKeys: [userApiKey] } as any) : null;
  const client = new GeminiClient({ profile: profileStub });

  const promptText = `You are a helpful AI assistant for a graphic designer named {{{userName}}}.
Their communication style is: {{{communicationStyleNotes}}}.

Your task is to thoroughly analyze the client's request (latest message + any attached files + conversation history) and produce a structured bilingual analysis in English and Bengali.

This output will directly populate UI tabs in the app, so map your content accordingly:
- Tab "Key Points" <= keyPointsEnglish/Bengali (concise bullet points)
- Tab "Details" <= detailedRequirementsEnglish/Bengali (short paragraphs, can include simple lists)
- Tab "Image" <= imageAnalysisEnglish/Bengali (only if images are attached)
- Tab "Designs" <= designItemsEnglish/Bengali (structured list of designs)
 - Tab "Editing Prompt" <= editingPrompts (5 prompts for editing models; works with image or prompt-only)

When writing the English and Bengali outputs, you MAY (optionally) use basic Markdown (e.g. \`#\`/\`##\`, **bold**, *italic*, inline \`code\`) to improve clarity. Do NOT embed HTML or images—only plain Markdown so the JSON stays valid.

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

Based on all the above information (latest message, attachments, and full history), provide a comprehensive bilingual analysis split into distinct sections, each in both English and Bengali:

1. **Key Requirements Points (Bullet Points)**
   - English: Create 3-10 clear, concise bullet points capturing the essential requirements
   - Bengali: Translate these same bullet points to Bengali

2. **Simplified Requirements (Concise Summary)**
   - English: Provide a concise simplified summary of the client's requirements (either 2–6 short bullet points or a short paragraph). This MUST be distinct from the detailed explanation below.
   - Bengali: Provide the same simplified summary translated to Bengali.

3. **Detailed Requirements Explanation**
   - English: Write a paragraph explaining all requirements in detail using simplified expert-to-beginner language. Specify which requirements should be prioritized and which can be considered secondary.
   - Bengali: Translate this detailed explanation to Bengali

4. **List of Required Designs**  – Be creative! Suggest fresh colour palettes, experimental typography, novel illustration approaches, or unique print techniques where appropriate.
   - English: Create a structured list of all designs the client is looking for. Each design should have:
     * A unique ID (e.g., "design_1", "design_2")
     * A clear title describing the design
     * A brief description of what it should include
     * Any quotes/sayings that should be incorporated (if applicable)
     * **A "Must follow:" section** that lists the specific key requirement bullet points relevant to THIS design **PLUS the *short image summary (English)* as the FIRST bullet** (so the designer immediately sees how the reference images influence the design).
   - Bengali: Create the same structured list in Bengali, including the "Must follow:" bullet list translated into Bengali

5. **Image Description & Connection (Only if images are attached)**
   - English: Describe the main visual content of the attached image(s) in detail and explain how it connects to the client's request and possible design ideas.
   - Bengali: Provide the same description and explanation in Bengali.

6. **Image Style Summary (Only if images are attached)**
   - English: Provide a concise, one-sentence directive summarizing the key visual style from the reference images that MUST be applied. Start with "The reference images indicate a clear preference for..." and describe the style (e.g., "bold, dynamic, and often layered typographic designs with strong outlines and subtle textures."). This will be added to the 'Must follow' list.
   - Bengali: Translate this directive to Bengali.

7. **Editing Prompts (Multi-Design Aware; Image-based if image available; otherwise Prompt-Only)**
   - Detect if multiple distinct designs are present from the "List of Required Designs" section.
    - If multiple designs exist, for each design generate ONE consolidated editing prompt that explicitly references the related image by order (e.g., "First image", "Second image", "Third image") and lists the specific edits for that design.
      - Output these per-design prompts in a separate array named 'editingPromptsByDesign', where each item contains: { designId, designTitle, imageIndex (1-based, optional), prompt }.
      - The prompt MUST clearly mention the image order and the exact changes needed for that specific design.
   - Additionally, always generate exactly 5 generic prompts suitable for editing tools:
     - Types: "must_need_edits", "all_edits", "make_standout", "make_colorful", "new_variations".
     - If an image is attached, word them as revisions of the existing image (e.g., "Revise this image to...", "Modify the existing design by...").
     - If no image is available, operate in PROMPT-ONLY mode (still 5 prompts) and avoid referencing a specific existing image; describe the desired output clearly.

Important Notes:
- Give each design item a unique ID so it can be referenced later
- Be specific about any text that should appear in the designs
- If analyzing images, extract any text visible in them and note their style/theme
 - For each design, provide a basic concept idea in a single sentence and base it on the above analysis

Output Format (ensure your entire response is a single JSON object):
{
  "keyPointsEnglish": ["Point 1", "Point 2", ...],
  "keyPointsBengali": ["বিন্দু ১", "বিন্দু ২", ...],
  "detailedRequirementsEnglish": "Detailed explanation...",
  "detailedRequirementsBengali": "বিস্তারিত ব্যাখ্যা...",
  "simplifiedRequirementsEnglish": "Short simplified summary (bullet list or short paragraph)...",
  "simplifiedRequirementsBengali": "সংক্ষিপ্ত সরল সারসংক্ষেপ (বুলেট তালিকা বা ছোট অনুচ্ছেদ)...",
  "designItemsEnglish": [
    {"id": "design_1", "title": "Design Title", "description": "What this design should include", "textContent": "Any text to include", "mustFollow": ["Requirement 1", "Requirement 2"]},
    ...
  ],
  "designItemsBengali": [
    {"id": "design_1", "title": "ডিজাইনের শিরোনাম", "description": "এই ডিজাইনে কী থাকা উচিত", "textContent": "যেকোনো টেক্সট অন্তর্ভুক্ত করতে", "mustFollow": ["দাবি ১", "দাবি ২"]},
    ...
  ],
  "imageAnalysisEnglish": "Description of image and its relation...",
  "imageAnalysisBengali": "ছবির বর্ণনা এবং এর সম্পর্ক...",
  "shortImageSummaryEnglish": "The reference images indicate a clear preference for bold, dynamic, and often layered typographic designs.",
  "shortImageSummaryBengali": "রেফারেন্স চিত্রগুলি গাঢ়, গতিশীল এবং প্রায়শই স্তরযুক্ত টাইপোগ্রাফিক ডিজাইনের জন্য একটি স্পষ্ট পছন্দ নির্দেশ করে।",
  "editingPrompts": [
    { "type": "must_need_edits", "prompt": "Revise this image to ... OR (if no image) Create a design that ..." },
    { "type": "all_edits", "prompt": "..." },
    { "type": "make_standout", "prompt": "..." },
    { "type": "make_colorful", "prompt": "..." },
    { "type": "new_variations", "prompt": "..." }
  ],
  "editingPromptsByDesign": [
    { "designId": "design_1", "designTitle": "Poster A", "imageIndex": 1, "prompt": "For the First image (design_1), ... [explicit edits for this design]" },
    { "designId": "design_2", "designTitle": "Poster B", "imageIndex": 2, "prompt": "For the Second image (design_2), ... [explicit edits for this design]" }
  ]
}
`;

  try {
    const { data: output, apiKeyUsed } = await client.request(async (apiKey) => {
      const instance = createGeminiAiInstance(apiKey);
      const promptDef = instance.definePrompt({
        name: `${flowName}Prompt_${Date.now()}`,
        input: { schema: AnalyzeClientRequirementsPromptInputSchema },
        output: { schema: AnalyzeClientRequirementsOutputSchema },
        prompt: promptText
      });
      const { output } = await promptDef(actualPromptInputData, { model: modelToUse });
      if (!output) throw new Error('AI returned empty output');
      return output;
    });
    console.log(`INFO (${flowName}): AI call succeeded using key ending with ...${apiKeyUsed.slice(-4)}`);
    // Debug output size
    try { logDebug('output size', JSON.stringify(output).length, 'bytes'); } catch(_){}
    return output as AnalyzeClientRequirementsOutput;
  } catch (error) {
    console.error(`ERROR (${flowName}): Failed after rotating keys:`, error);
    throw new Error(`AI call failed in ${flowName}. ${(error as Error).message}`);
  }
}