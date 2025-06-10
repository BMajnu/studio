'use server';
/**
 * @fileOverview Generates detailed, creative AI image prompts directly from a design theme.
 * This flow combines idea generation and prompt creation into a single step.
 *
 * - generateDesignPrompts - A function to generate image prompts from a theme.
 * - GenerateDesignPromptsInput - The input type for the function.
 * - GenerateDesignPromptsOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { DEFAULT_MODEL_ID } from '@/lib/constants';
import { genkit } from 'genkit';
import { googleAI } from '@genkit-ai/googleai';

// Internal schema for the ideas generated in the first step.
const GeneratedIdeasSchema = z.object({
  extractedTextOrSaying: z.string(),
  searchKeywords: z.array(z.string()),
  graphicsCreativeIdeas: z.array(z.string()).length(4),
  typographyDesignIdeas: z.array(z.string()).length(3),
  typographyWithGraphicsIdeas: z.array(z.string()).length(3),
});

// Schema for the flow's input - now takes the initial design theme.
const GenerateDesignPromptsFlowInputSchema = z.object({
  designInputText: z.string().describe("The primary text, saying, or theme for the design (e.g., 'Coffee Beats Everything', 'DesAInR company launch')."),
  userName: z.string().describe('The name of the user (designer).'),
  communicationStyleNotes: z.string().describe('The communication style notes of the user.'),
  modelId: z.string().optional().describe('The Genkit model ID to use for this request.'),
  userApiKey: z.string().optional().describe('User-provided Gemini API key.'),
});
export type GenerateDesignPromptsInput = z.infer<typeof GenerateDesignPromptsFlowInputSchema>;

// Schema for the final output, which is the detailed prompts.
const GenerateDesignPromptsOutputSchema = z.object({
  extractedTextOrSaying: z.string().describe("The extracted focal text or saying from the design input."),
  searchKeywords: z.array(z.string()).describe("Search keywords generated to find design inspiration on Google."),
  graphicsPrompts: z.array(z.string()).length(4).describe("Exactly 4 detailed prompts for graphics-focused designs."),
  typographyPrompts: z.array(z.string()).length(3).describe("Exactly 3 detailed prompts for typography-focused designs."),
  typographyWithGraphicsPrompts: z.array(z.string()).length(3).describe("Exactly 3 detailed prompts for designs combining typography and graphics.")
});
export type GenerateDesignPromptsOutput = z.infer<typeof GenerateDesignPromptsOutputSchema>;

export async function generateDesignPrompts(flowInput: GenerateDesignPromptsInput): Promise<GenerateDesignPromptsOutput> {
  const { userApiKey, modelId, designInputText, userName, communicationStyleNotes } = flowInput;
  const modelToUse = modelId || DEFAULT_MODEL_ID;
  const flowName = 'generateDesignPromptsUnified';

  let currentAiInstance = ai;
  let apiKeySourceForLog = "GOOGLE_API_KEY from .env file";

  if (userApiKey) {
    currentAiInstance = genkit({ plugins: [googleAI({ apiKey: userApiKey })] });
    apiKeySourceForLog = "User-provided API key from profile";
  } else if (!process.env.GOOGLE_API_KEY) {
    console.error(`CRITICAL_ERROR (${flowName}): No API key available.`);
    throw new Error(`API key configuration error in ${flowName}.`);
  }
  
  // STEP 1: Define the prompt for generating creative ideas (from the old ideas-flow)
  const ideaGenerationPrompt = currentAiInstance.definePrompt({
    name: 'ideaGeneration',
    input: { schema: GenerateDesignPromptsFlowInputSchema },
    output: { schema: GeneratedIdeasSchema },
    prompt: `You are an expert Design Idea Generator for a graphic designer named {{{userName}}}.
Their communication style is: {{{communicationStyleNotes}}}.

**Objective:** Generate creative design ideas in 3 distinct categories based on the provided "Design Input Text".

Design Input Text: {{{designInputText}}}

**Instructions:**
1. First, identify or extract any specific text, saying, quote or theme that should be the focal point of designs.
2. Generate 5-10 search keywords highly specific to this design request. These keywords should help the user find relevant design inspiration when searched on Google.
3. Generate 3 categories of design ideas:
   a. **Graphics-Focused Creative Ideas (4)**: Generate EXACTLY FOUR detailed graphics-focused design ideas.
   b. **Typography-Focused Ideas (3)**: Generate EXACTLY THREE ideas where typography is the primary focus.
   c. **Typography with Graphics Ideas (3)**: Generate EXACTLY THREE detailed ideas that blend interesting typography with complementary graphic elements.

**For each idea, include:**
- Visual style and concept. Consider using one of the popular styles listed below.
- Key visual elements and composition.
- Color palette recommendations.
- How the text is incorporated.
- Typography suggestions where relevant.

**Popular T-Shirt and POD Design Styles:**
- **Minimalist, Vintage/Retro, Typography-Based, Illustrative, Geometric, Nature, Pop Culture, Hand-Drawn, Graffiti/Street Art, Sports, Funny/Sarcastic, Floral, Abstract, Cartoon, Grunge, Bohemian, Animal Prints.**

**Example Idea Formats (Follow this structure):**

*   **Graphics-Focused ("The Champion Bean"):**
    Design Concept: "The Champion Bean"
    Visual Elements: Heroic cartoon coffee bean flexing on a podium.
    Style: Bold, graphic novel illustration.
    Color palette: Warm browns, tans, vibrant reds/yellows.
    Typography: "Coffee Beats Everything" in a comic book font.
    Layout: Asymmetrical and dynamic.

*   **Typography-Focused ("Vintage Type Declaration"):**
    Design Concept: "Vintage Type Declaration"
    Visual Elements: Almost entirely text-based with typographic ornaments.
    Style: Vintage packaging/posters.
    Color palette: Cream text on a dark brown background.
    Typography: Mix of bold sans-serif, script, and slab serif fonts in a stack.
    Layout: Symmetrical and balanced.

*   **Typography with Graphics ("Organic Sketch"):**
    Design Concept: "Organic Sketch"
    Visual Elements: Hand-drawn coffee plant branch wrapping around text.
    Style: Loose, organic, hand-sketched.
    Color palette: Monochromatic sepia on a cream background.
    Typography: Casual, hand-written font integrated with the illustration.
    Layout: Asymmetrical and flowing.
`,
  });

  // STEP 2: Define the prompt for converting ideas into final image prompts (from the old prompts-flow)
  const promptCreationPrompt = currentAiInstance.definePrompt({
    name: 'promptCreation',
    input: { schema: GeneratedIdeasSchema },
    output: { schema: GenerateDesignPromptsOutputSchema },
    prompt: `You are an expert AI Image Prompt Generator. Your task is to convert the provided design ideas into detailed, high-quality image generation prompts.

**Design Ideas Provided:**
- Graphics-Focused:
{{#each graphicsCreativeIdeas}}
  - {{{this}}}
{{/each}}
- Typography-Focused:
{{#each typographyDesignIdeas}}
  - {{{this}}}
{{/each}}
- Typography with Graphics:
{{#each typographyWithGraphicsIdeas}}
  - {{{this}}}
{{/each}}

**Important Rules for All Prompts:**
1.  **Start with an Action:** Every prompt must begin with "Make a," "Design a," or "Create a."
2.  **Avoid Product-Specific Terms:** Use general terms like "graphic for printing," "vector illustration," "typographic design." Do NOT use "T-shirt," "mug," etc.
3.  **Use Solid Backgrounds:** All designs must be on a solid black or white background. The color palette should be chosen to work on that background.

**Instructions:**
- For each design idea, create a detailed paragraph-long prompt.
- Incorporate all details from the idea: style, subject, colors, composition, and typography.
- Ensure the final prompt is a rich, descriptive paragraph ready for an AI image generator.

**Example Prompt Output Structure:**

*   **For Graphics-Focused:** "Create a graphic novel illustration of a heroic cartoon coffee bean flexing on a winner's podium, with dynamic action lines and a confident expression, on a solid black background. The text 'Coffee Beats Everything' is integrated in a bold comic book font. Use a color palette of warm browns and tans with vibrant red and yellow action effects. The composition is asymmetrical, with high contrast, sharp focus, professional vector art, trending on ArtStation."
*   **For Typography-Focused:** "Design a vintage typographic artwork for printing, with the text 'Coffee Beats Everything' as the centerpiece, on a solid white background. Use a mix of bold condensed sans-serif, flowing script, and strong slab-serif fonts arranged in a balanced stack, framed with typographic ornaments like lines and stars, and a minimalist engraved coffee bean icon. The color palette is a simple cream and dark brown. The composition is symmetrical, with high detail and a textured effect, award-winning typography, classic craftsmanship."
*   **For Typography with Graphics:** "Make a hand-sketched graphic illustration of a coffee plant branch with leaves and cherries organically wrapping around the text 'Coffee Beats Everything,' on a solid light cream background. The text should be in a casual, handwritten script font. The style is loose and organic with imperfect lines in a monochromatic sepia tone. The composition is asymmetrical and flowing, creating an authentic and artisanal feel. High resolution, detailed sketch, rustic aesthetic, trending on Behance for illustrations."
`,
  });
  
  try {
    // Execute STEP 1: Generate Ideas
    console.log(`INFO (${flowName}): Generating creative ideas...`);
    const { output: generatedIdeas } = await ideaGenerationPrompt(flowInput, { model: modelToUse });
    if (!generatedIdeas) {
      throw new Error("Idea generation step produced no output.");
    }
    console.log(`INFO (${flowName}): Ideas generated successfully.`);

    // Execute STEP 2: Create Prompts from Ideas
    console.log(`INFO (${flowName}): Converting ideas into final prompts...`);
    const { output: finalPrompts } = await promptCreationPrompt(generatedIdeas, { model: modelToUse });
    if (!finalPrompts) {
      throw new Error("Prompt creation step produced no output.");
    }
    console.log(`INFO (${flowName}): Final prompts created successfully.`);

    return {
      extractedTextOrSaying: generatedIdeas.extractedTextOrSaying,
      searchKeywords: generatedIdeas.searchKeywords,
      graphicsPrompts: finalPrompts.graphicsPrompts,
      typographyPrompts: finalPrompts.typographyPrompts,
      typographyWithGraphicsPrompts: finalPrompts.typographyWithGraphicsPrompts
    };

  } catch (error) {
    console.error(`ERROR (${flowName}): Flow failed (API key source: ${apiKeySourceForLog}). Error:`, error);
    throw new Error(`AI call failed in ${flowName}. Please check server logs for details. Original error: ${(error as Error).message}`);
  }
} 