'use server';
/**
 * @fileOverview AI flow to generate image editing prompts based on a design to edit,
 * previous "Check Made Designs" feedback from chat history, and current user instructions.
 * Will use a currently attached image if provided, otherwise attempts to find the last user-uploaded image in history.
 *
 * - generateEditingPrompts - A function to generate various editing prompts.
 * - GenerateEditingPromptsInput - Input type.
 * - GenerateEditingPromptsOutput - Output type.
 */

import { DEFAULT_MODEL_ID } from '@/lib/constants';
import { generateJSON } from '@/lib/ai/genai-helper';
import type { UserProfile } from '@/lib/types';
import { classifyError } from '@/lib/errors';

// Input interface
export interface GenerateEditingPromptsInput {
  designToEditDataUri?: string;
  clientInstructionForEditingTheme?: string;
  userName: string;
  communicationStyleNotes: string;
  chatHistory?: Array<{
    role: 'user' | 'assistant';
    text: string;
  }>;
  modelId?: string;
  userApiKey?: string;
  profile?: UserProfile;
}

// Output interfaces
interface EditingPrompt {
  type: string;
  prompt: string;
}

export interface GenerateEditingPromptsOutput {
  editingPrompts: EditingPrompt[];
}

export async function generateEditingPrompts(flowInput: GenerateEditingPromptsInput): Promise<GenerateEditingPromptsOutput> {
  const { 
    userApiKey, 
    modelId, 
    designToEditDataUri, 
    clientInstructionForEditingTheme = '', 
    userName, 
    communicationStyleNotes, 
    chatHistory = [],
    profile 
  } = flowInput;
  
  const modelToUse = modelId || DEFAULT_MODEL_ID;
  const flowName = 'generateEditingPrompts';

  // Build profile for key management
  const profileForKey = profile || (userApiKey ? {
    userId: 'temp',
    name: 'temp',
    services: [],
    geminiApiKeys: [userApiKey]
  } as any : null);

  // Build system prompt
  const systemPrompt = `You are an expert AI Prompt Engineer for ${userName}, a graphic designer.
Their communication style is: ${communicationStyleNotes}.

**Objective:** Generate 5 distinct, detailed prompts for revising an existing design image using an AI image generation/editing tool.
The prompts should be based on a provided design image, any prior "Check Made Designs" feedback found in the chat history, and an optional current instruction from the user.`;

  // Build user prompt
  let userPrompt = '';
  
  if (designToEditDataUri) {
    userPrompt += `**Primary Design to Edit:** [IMAGE PROVIDED - analyze visually]\n\n`;
  } else {
    userPrompt += `**Image to Edit:** Search the chat history below for the most recent image uploaded by the user. If no image is found, generate prompts in PROMPT-ONLY mode based on the user's instruction/theme.\n\n`;
  }

  userPrompt += `**User's Current Instruction/Theme for Editing:**\n"${clientInstructionForEditingTheme}"\n\n`;

  if (chatHistory.length > 0) {
    userPrompt += '**Chat History (Analyze for "Check Made Designs" feedback and last user image):**\n';
    chatHistory.forEach(msg => {
      userPrompt += `${msg.role}: ${msg.text}\n---\n`;
    });
    userPrompt += '\n';
  }

  userPrompt += `**Tasks:**

1. **Identify Image to Edit:** Use the provided image or find the most recent user image in chat history. If none found, operate in PROMPT-ONLY mode.

2. **Identify Prior Feedback:** Scan chat history for "Check Made Designs" feedback (in Bangla) with categories like "ভুল অবজেক্ট", "টাইপিং ভুল", etc., marked as "অবশ্যই প্রয়োজনীয়" (Must Required) or "ঐচ্ছিক" (Optional).

3. **Generate 5 Editing Prompts:** Each should be a detailed paragraph suitable for AI image editing tools.

   - **Prompt 1: Must Need Edits (type: "must_need_edits")**
     Incorporate ONLY "অবশ্যই প্রয়োজনীয়" changes from feedback + user's current instruction.

   - **Prompt 2: All Edits (type: "all_edits")**
     Incorporate ALL feedback changes (Must Required + Optional) + user's current instruction.

   - **Prompt 3: Make Design More Standout (type: "make_standout")**
     Make the design more visually appealing, dynamic, and eye-catching + user's current instruction.

   - **Prompt 4: Make Design More Colorful (type: "make_colorful")**
     Enhance colors to make it more vibrant and visually interesting + user's current instruction.

   - **Prompt 5: Create New Variations (type: "new_variations")**
     Create subtle variations by tweaking elements, layout, or stylistic details + user's current instruction.

**Prompt Guidelines:**
- Each prompt should be detailed but concise
- Focus on revising the identified image
- Avoid terms like "T-shirt," "Mug," "POD" - use "graphic," "illustration," "design element"
- Specify solid background if needed (white, black, gray)
- If no image found, write prompts that work for prompt-only editing models

**Output Format:** Return ONLY a valid JSON object:
{
  "editingPrompts": [
    { "type": "must_need_edits", "prompt": "..." },
    { "type": "all_edits", "prompt": "..." },
    { "type": "make_standout", "prompt": "..." },
    { "type": "make_colorful", "prompt": "..." },
    { "type": "new_variations", "prompt": "..." }
  ]
}

Always return exactly 5 prompts.
`;

  try {
    const output = await generateJSON<GenerateEditingPromptsOutput>({
      modelId: modelToUse,
      temperature: 0.8,
      maxOutputTokens: 8000,
      thinkingMode: profile?.thinkingMode || 'default',
      profile: profileForKey
    }, systemPrompt, userPrompt);

    console.log(`[${flowName}] Success, generated ${output.editingPrompts.length} editing prompts`);
    
    // Fallback validation
    if (!output || !output.editingPrompts || output.editingPrompts.length === 0) {
      console.warn(`[${flowName}] AI returned empty prompts, using fallback`);
      return { 
        editingPrompts: [
          { type: 'must_need_edits', prompt: 'Revise the design to fix critical issues: correct any text typos, align headings consistently, ensure contrast ratios meet accessibility, and remove visual clutter while keeping the core concept intact.' },
          { type: 'all_edits', prompt: 'Apply a comprehensive refinement: adjust layout spacing, harmonize font sizes/weights, improve iconography clarity, refine color hierarchy, and ensure visual balance across all elements.' },
          { type: 'make_standout', prompt: 'Enhance visual impact: strengthen focal point contrast, add depth or subtle shadows, introduce accent color highlights, and refine composition to guide the viewer\'s eye naturally.' },
          { type: 'make_colorful', prompt: 'Introduce a vibrant palette: select 2–3 bold accent colors, ensure complementary harmony with the base tones, and maintain legibility with proper contrast on backgrounds.' },
          { type: 'new_variations', prompt: 'Create a few subtle variations: experiment with alternative layouts, spacing scales, and icon sizes while preserving the central concept and brand consistency.' }
        ] 
      };
    }
    
    return output;
  } catch (error) {
    console.error(`ERROR (${flowName}): Failed:`, error);
    throw classifyError(error);
  }
}
