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

const GeneratedPromptByCategorySchema = z.object({
  category: z.string().describe("The design category: 'Graphics-Focused', 'Typography-Focused', or 'Typography with Graphics'."),
  prompts: z.array(z.string()).describe('Array of detailed AI image generation prompts for this category.')
});

// Per-design generated prompt schema (one detailed prompt per design for complete regeneration)
const DesignGeneratedPromptPerDesignSchema = z.object({
  designId: z.string().describe('The ID of the design this prompt applies to (must match designItemsEnglish[].id).'),
  designTitle: z.string().optional().describe('Optional title of the design for display convenience.'),
  category: z.string().describe("Design category: 'Graphics-Focused', 'Typography-Focused', or 'Typography with Graphics'."),
  prompt: z.string().describe('A complete, detailed AI image generation prompt for creating this design from scratch. Must follow proper prompt engineering guidelines.')
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
  generatedPromptsByCategory: z.array(GeneratedPromptByCategorySchema).describe('Complete AI image generation prompts organized by category: Graphics-Focused (up to 4), Typography-Focused (up to 3), Typography with Graphics (up to 3).'),
  // When multiple designs exist, also provide one detailed prompt per design
  generatedPromptsByDesign: z.array(DesignGeneratedPromptPerDesignSchema).optional().describe('When multiple designs are present, provide one complete generation prompt per design for creating it from scratch.')
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
 - Tab "Generated Prompts" <= generatedPromptsByCategory (complete AI image generation prompts)

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

7. **Generated Prompts (Complete AI Image Generation Prompts - NOT Editing Prompts)**
   - Create complete, detailed AI image generation prompts for creating NEW designs from scratch.
   - These are NOT editing prompts - they are for generating completely new images.
   
   **IMPORTANT RULES FOR ALL PROMPTS:**
   1. **Start with an Action:** Every prompt MUST begin with "Create a," "Design a," or "Make a."
   2. **Professional Language:** Use professional graphic design terminology.
   3. **Avoid Product Terms:** DO NOT use "T-shirt," "Mug," "POD," etc. Instead use "typography design," "vector design," "vintage illustration," or "printing design."
   4. **Solid Backgrounds Only:** All designs MUST be on a solid plain black, white, or gray background. Always specify: "The background is solid [color]."
   5. **No External References:** Do NOT include URLs, image links, or phrases like "based on the reference image" or "similar to attached image." Create completely standalone prompts.
   6. **Be Detailed & Complete:** Each prompt should be a rich, detailed paragraph (150-250 words) that includes:
      - Design concept and narrative
      - Artistic style (e.g., vintage, modern, minimalist, hand-drawn, etc.)
      - Visual elements and composition
      - Color palette with specific colors
      - Typography details (if text is present)
      - Text placement and integration
      - Overall mood and feeling
   
   **Example Format:**
   "Create a vintage illustration design featuring a coffee bean cartoon character holding a golden trophy. The style should evoke a retro revival with clean, intricate line work and a classic, nostalgic feel. Use rich brown tones for the coffee bean contrasted with polished gold accents for the trophy. The background is solid white for maximum contrast. Typography is bold vintage serif, the word 'Coffee' larger than 'Victory,' using a font like Rockwell or Bodoni. Layout is symmetrical with the bean and trophy centered and text placed below. The overall mood is celebratory and refined."
   
   **CATEGORIZE PROMPTS:**
   - Detect the design focus from requirements and create prompts in appropriate categories:
     * **Graphics-Focused (up to 4 prompts):** Main focus on graphics/illustrations, text is secondary or optional
     * **Typography-Focused (up to 3 prompts):** Main focus on typography with optional decorative elements
     * **Typography with Graphics (up to 3 prompts):** Balanced emphasis on both typography and graphics
   
   - Output format for 'generatedPromptsByCategory': Array of { category: string, prompts: string[] }
   
   **PER-DESIGN PROMPTS (if multiple designs exist):**
   - If multiple distinct designs are present, also generate ONE complete detailed prompt per design
   - Each per-design prompt must follow the same structure above
   - Output in 'generatedPromptsByDesign': { designId, designTitle, category, prompt }

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
  "generatedPromptsByCategory": [
    { 
      "category": "Graphics-Focused", 
      "prompts": [
        "Create a vintage illustration design featuring... [complete detailed prompt following all rules]",
        "Design a modern graphic artwork showcasing... [complete detailed prompt]"
      ]
    },
    { 
      "category": "Typography-Focused", 
      "prompts": [
        "Make a bold typographic design with... [complete detailed prompt]"
      ]
    },
    { 
      "category": "Typography with Graphics", 
      "prompts": [
        "Create a mixed-media design combining... [complete detailed prompt]"
      ]
    }
  ],
  "generatedPromptsByDesign": [
    { "designId": "design_1", "designTitle": "Poster A", "category": "Graphics-Focused", "prompt": "Create a high-quality vintage illustration design... [complete detailed prompt with all elements]" },
    { "designId": "design_2", "designTitle": "Poster B", "category": "Typography-Focused", "prompt": "Design a bold typographic artwork... [complete detailed prompt with all elements]" }
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