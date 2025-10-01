'use server';
/**
 * @fileOverview Analyzes client requirements from a message and attachments, providing structured output.
 *
 * - analyzeClientRequirements - A function to process client messages for requirements.
 * - AnalyzeClientRequirementsInput - The input type for the analyzeClientRequirements function.
 * - AnalyzeClientRequirementsOutput - The return type for the analyzeClientRequirements function.
 */

import { z } from 'zod';
import { DEFAULT_MODEL_ID } from '@/lib/constants';
import { generateJSON } from '@/lib/ai/genai-helper';
import type { UserProfile } from '@/lib/types';

// DEBUG logging helper
const logDebug = (label: string, ...args: any[]) => {
  try { console.log(`[analyzeClientRequirements] ${label}`, ...args); } catch(_){}
};

// Zod schemas for output validation (used for type inference only with new SDK)
const DesignListItemSchema = z.object({
  id: z.string().describe("Unique identifier for the design item"),
  title: z.string().describe("Title/name of the design item"),
  description: z.string().describe("Brief description of the design"),
  textContent: z.string().optional().describe("Text/saying/quote if included in this design"),
  mustFollow: z.array(z.string()).optional().describe("Specific key requirement points that MUST be followed for this design")
});

// Input interface (no longer using Zod schema for input validation)
export interface AnalyzeClientRequirementsInput {
  clientMessage: string;
  userName: string;
  communicationStyleNotes: string;
  attachedFiles?: Array<{
    name: string;
    type: string;
    dataUri?: string;
    textContent?: string;
  }>;
  chatHistory?: Array<{
    role: 'user' | 'assistant';
    text: string;
  }>;
  modelId?: string;
  userApiKey?: string;
  profile?: UserProfile;
}

// Per-design editing prompt schema
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
  // Image-specific editing prompts: ALWAYS generate one prompt per design
  editingPromptsByDesign: z.array(DesignEditingPromptPerDesignSchema).describe('For each design item, generate one explicit editing prompt that references the design and lists specific changes needed. This is REQUIRED, not optional.'),
  // Generated Prompts: Complete AI image generation prompts based on design items
  generatedPrompts: z.array(z.object({
    designId: z.string().describe('The ID of the design this prompt is for'),
    designTitle: z.string().describe('Title of the design'),
    prompt: z.string().describe('A complete, detailed AI image generation prompt following professional prompt engineering standards')
  })).optional().describe('For each design item, generate a complete AI image generation prompt (not editing prompt). Follow these rules: 1) Start with "Make a" or "Design a" or "Create a", 2) Use professional design terminology, 3) Include all visual details (concept, style, visual elements, color palette, typography, text incorporation, mood), 4) Specify solid background (black, white, or gray), 5) Avoid product-specific terms like T-shirt, Mug, etc., 6) Write as a rich descriptive paragraph ready for AI image generators.')
});
export type AnalyzeClientRequirementsOutput = z.infer<typeof AnalyzeClientRequirementsOutputSchema>;

export async function analyzeClientRequirements(flowInput: AnalyzeClientRequirementsInput): Promise<AnalyzeClientRequirementsOutput> {
  logDebug('input attachments', flowInput.attachedFiles?.length || 0);
  try { logDebug('input size', JSON.stringify(flowInput).length, 'bytes'); } catch(_){}
  
  const { 
    userApiKey, 
    modelId, 
    clientMessage, 
    userName, 
    communicationStyleNotes, 
    attachedFiles = [], 
    chatHistory = [],
    profile 
  } = flowInput;
  
  const modelToUse = modelId || DEFAULT_MODEL_ID;
  const flowName = 'analyzeClientRequirements';

  // Build profile for key management
  const profileForKey = profile || (userApiKey ? {
    userId: 'temp',
    name: 'temp',
    services: [],
    geminiApiKeys: [userApiKey]
  } as any : null);

  // Build system prompt
  const systemPrompt = `You are a helpful AI assistant for a graphic designer named ${userName}.
Their communication style is: ${communicationStyleNotes}.

Your task is to thoroughly analyze the client's request (latest message + any attached files + conversation history) and produce a structured bilingual analysis in English and Bengali.

This output will directly populate UI tabs in the app, so map your content accordingly:
- Tab "Key Points" <= keyPointsEnglish/Bengali (concise bullet points)
- Tab "Details" <= detailedRequirementsEnglish/Bengali (short paragraphs, can include simple lists)
- Tab "Image" <= imageAnalysisEnglish/Bengali (only if images are attached)
- Tab "Designs" <= designItemsEnglish/Bengali (structured list of designs)
 - Tab "Editing Prompt" <= editingPrompts (5 prompts for editing models; works with image or prompt-only)

When writing the English and Bengali outputs, you MAY (optionally) use basic Markdown (e.g. \`#\`/\`##\`, **bold**, *italic*, inline \`code\`) to improve clarity. Do NOT embed HTML or images—only plain Markdown so the JSON stays valid.`;

  // Build user prompt with dynamic content
  let userPrompt = '';
  
  if (chatHistory.length > 0) {
    userPrompt += 'Previous conversation context (analyze the current message in light of this history):\n';
    chatHistory.forEach(msg => {
      userPrompt += `${msg.role}: ${msg.text}\n---\n`;
    });
    userPrompt += '\n';
  }

  userPrompt += `Client's Current Message:\n${clientMessage}\n\n`;

  if (attachedFiles.length > 0) {
    userPrompt += 'The client also attached the following files with their current message. Analyze these files as part of the requirements.\n';
    attachedFiles.forEach(file => {
      userPrompt += `- File: ${file.name} (Type: ${file.type})\n`;
      if (file.dataUri) {
        userPrompt += `  (This is an image. Analyze its content for design requirements)\n`;
      } else if (file.textContent) {
        userPrompt += `  Content of ${file.name}:\n  ${file.textContent}\n`;
      } else {
        userPrompt += `  (This file (e.g. PDF, other binary) content is not directly viewable by you, but its existence and the client's reference to it in their message might be relevant.)\n`;
      }
    });
    userPrompt += '\n';
  }

  userPrompt += `

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

7. **Editing Prompts (Image-Specific, Per Design) - MANDATORY**
   - **IMPORTANT**: You MUST generate editing prompts for EVERY design item in the "List of Required Designs" section.
   - For EACH design (even if there's only one), generate ONE editing prompt specifically for image editing AI models (ChatGPT-4o, Qwen Edit, Gemini 2.5 Flash Edit, etc.)
   - Each prompt should:
     * Reference the design by name/order (e.g., "For the First image (Official Seal Emblem)", "For the Second image (Modern Minimalist)")
     * List specific edits, refinements, or changes that would improve the design
     * Mention visual elements to adjust (typography, colors, layout, graphics, spacing, etc.)
     * Be actionable for AI models that can edit/refine existing images
   - Output in 'editingPromptsByDesign' array with: { designId, designTitle, imageIndex (1-based index starting from 1), prompt }
   - Example format: "For the First image (Official Seal Emblem Logo), refine the seal icon to have more intricate detailing, adjust the text 'Let's Seal It' to use a more elegant serif font with better kerning, and ensure 'mobile notary services & more' is clearly legible with improved spacing."
   - **YOU MUST GENERATE AT LEAST ONE EDITING PROMPT PER DESIGN** - this field cannot be empty or optional!

8. **Generated Prompts (Complete AI Image Generation Prompts)**
   - For EACH design item in the "List of Required Designs", generate a complete, professional AI image generation prompt.
   - These are NOT editing prompts - they are for generating completely new designs from scratch.
   - Follow these MANDATORY prompt engineering rules:
     a. **Start with Action Verb**: Begin with "Make a", "Design a", or "Create a"
     b. **Professional Terminology**: Use design terminology (typography design, vector illustration, vintage poster, etc.)
     c. **NO Product Terms**: NEVER mention T-shirt, Mug, POD, product, merchandise, etc.
     d. **Solid Background**: Always specify solid black, white, or gray background
     e. **Complete Details**: Include ALL these elements in the prompt:
        - Design concept and narrative
        - Artistic style (e.g., vintage, minimalist, illustrative, hand-drawn, retro, modern)
        - Visual elements (objects, characters, symbols, composition)
        - Color palette (specific colors and combinations)
        - Typography (font style, size, placement if text is included)
        - Text incorporation method (how text integrates with graphics)
        - Overall mood/feeling (playful, professional, nostalgic, bold, etc.)
     f. **Rich Paragraph Format**: Write as ONE detailed, descriptive paragraph ready for AI image generators
     g. **Use "Must Follow" Requirements**: Incorporate all the "mustFollow" points from the design item naturally into the prompt
   - Example format: "Make a vintage illustration design featuring [visual elements]. The style should evoke [style description] with [details]. Use [color palette] on a solid [background color] background. Typography is [font description], [placement]. The composition is [layout]. Overall mood is [feeling]."
   - Output these in 'generatedPrompts' array with { designId, designTitle, prompt }

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
  "editingPromptsByDesign": [
    { "designId": "design_1", "designTitle": "Poster A", "imageIndex": 1, "prompt": "For the First image (design_1), ... [explicit edits for this design]" },
    { "designId": "design_2", "designTitle": "Poster B", "imageIndex": 2, "prompt": "For the Second image (design_2), ... [explicit edits for this design]" }
  ],
  "generatedPrompts": [
    { "designId": "design_1", "designTitle": "Poster A", "prompt": "Make a ... [complete AI image generation prompt]" },
    { "designId": "design_2", "designTitle": "Poster B", "prompt": "Design a ... [complete AI image generation prompt]" }
  ]
}

Remember: Return ONLY valid JSON matching the exact structure specified above.`;

  try {
    const output = await generateJSON<AnalyzeClientRequirementsOutput>({
      modelId: modelToUse,
      temperature: 0.7,
      maxOutputTokens: 16000,
      thinkingMode: profile?.thinkingMode || 'default',
      profile: profileForKey
    }, systemPrompt, userPrompt);

    console.log(`[${flowName}] Success, output size: ${JSON.stringify(output).length} bytes`);
    try { logDebug('output size', JSON.stringify(output).length, 'bytes'); } catch(_){}
    return output;
  } catch (error) {
    console.error(`ERROR (${flowName}): Failed after rotating keys:`, error);
    throw new Error(`AI call failed in ${flowName}. ${(error as Error).message}`);
  }
}