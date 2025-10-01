'use server';
/**
 * @fileOverview Generates detailed, creative AI image prompts directly from a design theme.
 * This flow combines idea generation and prompt creation into a single step.
 *
 * - generateDesignPrompts - A function to generate image prompts from a theme.
 * - GenerateDesignPromptsInput - The input type for the function.
 * - GenerateDesignPromptsOutput - The return type for the function.
 */

import {z} from 'genkit';
import { DEFAULT_MODEL_ID } from '@/lib/constants';
import { GeminiClient } from '@/lib/ai/gemini-client';
import { createGeminiAiInstance } from '@/lib/ai/genkit-utils';

// Internal schema for the ideas generated in the first step.
const GeneratedIdeasSchema = z.object({
  extractedTextOrSaying: z.string(),
  searchKeywords: z.array(z.string()),
  graphicsCreativeIdeas: z.array(z.string()).length(4),
  typographyDesignIdeas: z.array(z.string()).length(3),
  typographyWithGraphicsIdeas: z.array(z.string()).length(3),
});

// Re-usable attached file schema (images & text)
const AttachedFileSchema = z.object({
  name: z.string(),
  type: z.string(),
  dataUri: z.string().optional(),
  textContent: z.string().optional(),
});

// Schema for the flow's input – now includes attachments.
const GenerateDesignPromptsFlowInputSchema = z.object({
  designInputText: z.string().describe("The primary text, saying, or theme for the design (e.g., 'Coffee Beats Everything', 'DesAInR company launch')."),
  userName: z.string().describe('The name of the user (designer).'),
  communicationStyleNotes: z.string().describe('The communication style notes of the user.'),
  modelId: z.string().optional().describe('The Genkit model ID to use for this request.'),
  userApiKey: z.string().optional().describe('User-provided Gemini API key.'),
  attachedFiles: z.array(AttachedFileSchema).optional().describe('Images or text files that should inform the design prompts'),
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
  const { userApiKey, modelId, designInputText, userName, communicationStyleNotes, attachedFiles } = flowInput;
  const modelToUse = modelId || DEFAULT_MODEL_ID;
  const flowName = 'generateDesignPromptsUnified';

  console.log(`\n--- [${flowName}] FLOW_STARTED ---`);
  console.log('Flow Input:', JSON.stringify(flowInput, null, 2));

  const profileStub = userApiKey ? ({ userId: 'tmp', name: 'tmp', services: [], geminiApiKeys: [userApiKey] } as any) : null;
  const client = new GeminiClient({ profile: profileStub });
  
  // STEP 1: Define the prompt for generating creative ideas (from the old ideas-flow)
  const ideaGenPromptText = `You are an expert Design Idea Generator for a graphic designer named {{{userName}}}.
Their communication style is: {{{communicationStyleNotes}}}.

**Objective:** Generate creative design ideas and Give the complete prompts for the designs in 3 distinct categories based on the provided "Design Input Text".

Design Input Text: {{{designInputText}}}

{{#if attachedFiles.length}}
The user has provided the following reference files. Analyse them carefully and let them influence your ideas:
{{#each attachedFiles}}
  {{#if this.dataUri}}
    - [[Image]] {{media url=this.dataUri}}
  {{else if this.textContent}}
    - [[TEXT FILE]] {{{this.textContent}}}
  {{/if}}
{{/each}}
{{/if}}

**Instructions:**
1. First, identify or extract any specific text, saying, quote or theme that should be the focal point of designs.
2. Generate 5-10 search keywords highly specific to this design request. These keywords should help the user find relevant design inspiration when searched on Google.
3. Generate 3 categories of design ideas:
   a. **Graphics-Focused Creative Ideas (4)**: Generate EXACTLY FOUR detailed graphics-focused design ideas. 
     - Main focus is on the graphics and the text/saying is the secondary or optional focus. But always follow the user input, If he is clearly mention any text then add it, similarly if he is not mention any text then don't add it. Also If user clearly mention that he don't need any graphics want typography/text based design then follow it.
   b. **Typography-Focused Ideas (3)**: Generate EXACTLY THREE ideas where typography is the primary focus.
     - Main focus is on the typography and the but you can add the decorative elements like typographic ornaments, small shapes, small graphic elements, spikes, dots, lines, etc to make the design standout and beautiful. But always follow the user input, If user clearly mention that he don't need any typography want graphics based design then follow it.
   c. **Typography with Graphics Ideas (3)**: Generate EXACTLY THREE detailed ideas that blend interesting typography with complementary graphic elements.
     - Here try to put same emphases on the graphics and typography. But make sure that design is standout and looks beautiful. And always follow the user input.

**For each idea, include:**
- Concept: Clearly describe the core concept and narrative.
- Style: Specify the artistic style (e.g., Creative Design, Playful design, Maximalism / Dopamine Dressing, Vintage and Retro, Illustrative, Hand‑Drawn, Bold Typography, Line Art, Typography-Based, AI-inspired Designs, Doodle Art, Nature-inspired Designs, Pop Culture, Modern Illustration, Coordinated, Quiet Luxury, Graffiti/Street Art, Sports, Funny/Sarcastic, Floral, Abstract and Geometric Patterns, Minimalism, Cartoon, Grunge, Animal Prints.).
- Visual Elements: Describe in detail the main visual elements, composition and all key visual elements, objects, characters, or symbols. Describe their appearance and interaction.
- Color palette recommendations: Describe the color palette recommendations.
- Typography: Describe the typography suggestions where relevant. If not then skip it.
- Text Incorporation: Explain how the text/saying is integrated into the design (e.g., "arched above the central graphic," "interwoven with illustrative elements," "boldly centered").
- Overall Mood/Feeling: Describe the intended emotional impact (e.g., "playful and energetic," "sophisticated and modern," "nostalgic and warm", "funny and sarcastic", "serious and professional", "romantic and intimate", "bold and striking", "subtle and elegant", "dark and mysterious", "light and airy")

**Example Idea Formats (Follow this structure):**

*   **Graphics-Focused ("The Champion Bean"):**
    Design Concept: a coffee bean cartoon character holding a golden trophy
    Visual Elements: A coffee bean, a golden trophy 
    Style: retro revival, with clean, intricate line work and a classic, nostalgic feel
    Color palette: brown tones for the coffee bean, contrasted with polished gold accents for the trophy
    Typography: bold, vintage serif, with the word "Coffee" larger than "Victory,"
    Text Incorporation: coffee bean and trophy central, and the typography placed above or below the image.
    Overall Mood/Feeling: a warm, celebratory atmosphere with a touch of refinement, evoking the energy of both victory and coffee culture.

*   **Typography-Focused ("Bold Retro Stack"):**
    Design Concept: a bold retro stacked arrangement of the phrase "Coffee Beats Everything"
    Visual Elements: purely typographic treatment enhanced with small starburst accents and underline flourishes
    Style: vintage 1970s poster typography, tight letter-stacking, high contrast letterforms
    Color palette: warm cream lettering on a deep espresso backdrop, subtle gold accent lines
    Typography: condensed sans-serif for "Coffee," flowing script for "Beats Everything," tight tracking for impact
    Text Incorporation: phrase centred and stacked, decorative flourishes framing the stack
    Overall Mood/Feeling: nostalgic and energetic, evoking classic coffee-shop signage

*   **Typography with Graphics ("Hand-Drawn Bean Burst"):**
    Design Concept: hand-lettered phrase surrounded by an illustrated coffee bean splash
    Visual Elements: dynamic ink splash of coffee beans radiating outward, integrating with the hand-drawn text
    Style: loose hand-drawn illustration blended with expressive lettering
    Color palette: rich browns and warm creams, single accent orange for highlights
    Typography: expressive brush-script lettering, slightly slanted for motion
    Text Incorporation: lettering sits at the splash centre, bean elements overlap stroke ends
    Overall Mood/Feeling: lively and artisanal, suggesting freshly brewed excitement
`;

  // STEP 2: Define the prompt for converting ideas into final image prompts (from the old prompts-flow)
  const promptCreationPromptText = `You are an expert AI Image Prompt Generator. Your task is to convert the provided design ideas into detailed, high-quality, Complete Image generation prompts.

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
2.  **Act as a professional graphic designer:** Use professional design terminology.
3.  **Avoid Product-Specific Terms:** Avoid using terms like "T-shirt," "Mug," "POD," etc.; instead use alternatives such as "typography design," "vector design," "vintage illustration," or "printing design." 
4.  **Use Solid Backgrounds:** All designs must be on a solid plain black, white, or gray background. Pick a palette that works on that background. For mug, tumbler, or bottle designs always use a white background.

**Instructions:**
- For each design idea, create a detailed paragraph-long prompt.
- Incorporate all details from the idea: Concept, Style, Visual Elements, Colour palette, Typography, Text Incorporation, and Overall Mood/Feeling.
- Ensure the final prompt is a rich, descriptive paragraph ready for an AI image generator.

**Example Prompt Format:**
   Creative Design Ideas (Graphics-Focused): Create a vintage illustration design featuring a coffee bean cartoon character holding a golden trophy. The style should evoke a retro revival with clean, intricate line work and a classic, nostalgic feel. Use rich brown tones for the coffee bean contrasted with polished gold accents for the trophy. The background is solid white for maximum contrast. Typography is bold vintage serif, the word "Coffee" larger than "Victory," using a font like Rockwell or Bodoni. Layout is symmetrical with the bean and trophy centred and text placed below. The overall mood is celebratory and refined.
   Typography-Focused Prompt: Design a bold retro typographic artwork showcasing the stacked phrase "Coffee Beats Everything". Use condensed sans-serif for "Coffee" and flowing script for "Beats Everything", tightly kerned. Add starburst and underline flourishes for emphasis. Palette: warm cream lettering on deep espresso; background solid black. Composition centred and balanced, exuding confident vintage-café energy.
   Typography with Graphics Prompt: Make a loose hand-drawn graphic of coffee beans splashing outward around the hand-lettered phrase "Coffee Beats Everything". Combine expressive brush-script lettering with dynamic ink-style bean graphics. Palette: rich browns with warm cream highlights on a solid light-gray background. Composition asymmetrical and flowing—beans overlap the lettering, conveying artisanal, freshly-brewed excitement.
`;
  
  try {
    // Execute STEP 1: Generate Ideas
    console.log(`\n--- [${flowName}] STEP 1: GENERATING IDEAS ---`);
    console.log('--- PROMPT START ---\n', ideaGenPromptText, '\n--- PROMPT END ---');
    
    const { data: generatedIdeas } = await client.request(async (apiKey) => {
      const instance = createGeminiAiInstance(apiKey);
      const promptDef = instance.definePrompt({
        name: 'ideaGeneration',
        input: { schema: GenerateDesignPromptsFlowInputSchema },
        output: { schema: GeneratedIdeasSchema },
        prompt: ideaGenPromptText
      });
      console.log('Executing ideaGeneration prompt with input:', JSON.stringify(flowInput, null, 2));
      const { output } = await promptDef(flowInput, { model: modelToUse });
      if (!output) throw new Error("AI returned empty output for idea generation");
      return output;
    });

    console.log(`\n--- [${flowName}] STEP 1 RESULT (generatedIdeas) ---`);
    console.log(JSON.stringify(generatedIdeas, null, 2));

    // Execute STEP 2: Create Prompts from Ideas
    console.log(`\n--- [${flowName}] STEP 2: CREATING PROMPTS FROM IDEAS ---`);
    console.log('--- PROMPT START ---\n', promptCreationPromptText, '\n--- PROMPT END ---');

    const { data: finalPrompts } = await client.request(async (apiKey) => {
      const instance = createGeminiAiInstance(apiKey);
      const promptDef = instance.definePrompt({
        name: 'promptCreation',
        input: { schema: GeneratedIdeasSchema },
        output: { schema: GenerateDesignPromptsOutputSchema },
        prompt: promptCreationPromptText
      });
      console.log('Executing promptCreation prompt with input (generatedIdeas):', JSON.stringify(generatedIdeas, null, 2));
      const { output } = await promptDef(generatedIdeas, { model: modelToUse });
      if (!output) throw new Error("AI returned empty output for prompt creation");
      return output;
    });

    console.log(`\n--- [${flowName}] STEP 2 RESULT (finalPrompts) ---`);
    console.log(JSON.stringify(finalPrompts, null, 2));

    const finalOutput = {
      extractedTextOrSaying: generatedIdeas.extractedTextOrSaying,
      searchKeywords: generatedIdeas.searchKeywords,
      graphicsPrompts: finalPrompts.graphicsPrompts,
      typographyPrompts: finalPrompts.typographyPrompts,
      typographyWithGraphicsPrompts: finalPrompts.typographyWithGraphicsPrompts
    };

    console.log(`\n--- [${flowName}] FLOW_COMPLETED ---`);
    console.log('Final Output:', JSON.stringify(finalOutput, null, 2));

    return finalOutput;

  } catch (error) {
    console.error(`ERROR (${flowName}): Flow failed. Error:`, error);
    throw new Error(`AI call failed in ${flowName}. Please check server logs for details. Original error: ${(error as Error).message}`);
  }
} 