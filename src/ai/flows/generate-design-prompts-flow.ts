'use server';
/**
 * @fileOverview Generates detailed, creative AI image prompts directly from a design theme.
 * This flow combines idea generation and prompt creation into a single step.
 *
 * - generateDesignPrompts - A function to generate image prompts from a theme.
 * - GenerateDesignPromptsInput - The input type for the function.
 * - GenerateDesignPromptsOutput - The return type for the function.
 */

import { DEFAULT_MODEL_ID } from '@/lib/constants';
import { generateJSON } from '@/lib/ai/genai-helper';
import type { UserProfile } from '@/lib/types';

// Internal type for ideas generated in the first step
interface GeneratedIdeas {
  extractedTextOrSaying: string;
  searchKeywords: string[];
  graphicsCreativeIdeas: string[]; // Should be exactly 4
  typographyDesignIdeas: string[]; // Should be exactly 3
  typographyWithGraphicsIdeas: string[]; // Should be exactly 3
}

// Input interface
export interface GenerateDesignPromptsInput {
  designInputText: string;
  userName: string;
  communicationStyleNotes: string;
  modelId?: string;
  userApiKey?: string;
  profile?: UserProfile;
  attachedFiles?: Array<{
    name: string;
    type: string;
    dataUri?: string;
    textContent?: string;
  }>;
}

// Output interface
export interface GenerateDesignPromptsOutput {
  extractedTextOrSaying: string;
  searchKeywords: string[];
  graphicsPrompts: string[]; // Exactly 4
  typographyPrompts: string[]; // Exactly 3
  typographyWithGraphicsPrompts: string[]; // Exactly 3
}

export async function generateDesignPrompts(flowInput: GenerateDesignPromptsInput): Promise<GenerateDesignPromptsOutput> {
  const { 
    userApiKey, 
    modelId, 
    designInputText, 
    userName, 
    communicationStyleNotes, 
    attachedFiles = [],
    profile 
  } = flowInput;
  
  const modelToUse = modelId || DEFAULT_MODEL_ID;
  const flowName = 'generateDesignPromptsUnified';

  console.log(`\n--- [${flowName}] FLOW_STARTED ---`);

  // Build profile for key management
  const profileForKey = profile || (userApiKey ? {
    userId: 'temp',
    name: 'temp',
    services: [],
    geminiApiKeys: [userApiKey]
  } as any : null);
  
  // STEP 1: Build system prompt for generating creative ideas
  const ideaGenSystemPrompt = `You are an expert Design Idea Generator for a graphic designer named ${userName}.
Their communication style is: ${communicationStyleNotes}.

**Objective:** Generate creative design ideas and Give the complete prompts for the designs in 3 distinct categories based on the provided "Design Input Text".`;

  // Build user prompt for idea generation
  let ideaGenUserPrompt = `Design Input Text: ${designInputText}\n\n`;

  if (attachedFiles.length > 0) {
    ideaGenUserPrompt += 'The user has provided the following reference files. Analyse them carefully and let them influence your ideas:\n';
    attachedFiles.forEach(file => {
      if (file.dataUri) {
        ideaGenUserPrompt += `  - [[Image]] ${file.name}\n`;
      } else if (file.textContent) {
        ideaGenUserPrompt += `  - [[TEXT FILE]] ${file.textContent}\n`;
      }
    });
    ideaGenUserPrompt += '\n';
  }

  ideaGenUserPrompt += `

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

**Output Format:** Return ONLY a valid JSON object with these exact fields:
{
  "extractedTextOrSaying": "string",
  "searchKeywords": ["keyword1", "keyword2", ...],
  "graphicsCreativeIdeas": ["idea1", "idea2", "idea3", "idea4"],
  "typographyDesignIdeas": ["idea1", "idea2", "idea3"],
  "typographyWithGraphicsIdeas": ["idea1", "idea2", "idea3"]
}
`;

  try {
    // Execute STEP 1: Generate Ideas
    console.log(`\n--- [${flowName}] STEP 1: GENERATING IDEAS ---`);
    
    const generatedIdeas = await generateJSON<GeneratedIdeas>({
      modelId: modelToUse,
      temperature: 0.8,
      maxOutputTokens: 16000,
      thinkingMode: profile?.thinkingMode || 'default',
      profile: profileForKey
    }, ideaGenSystemPrompt, ideaGenUserPrompt);

    console.log(`\n--- [${flowName}] STEP 1 RESULT ---`);
    console.log(JSON.stringify(generatedIdeas, null, 2));

    // STEP 2: Build prompt for converting ideas into final image prompts
    const promptCreationSystemPrompt = `You are an expert AI Image Prompt Generator. Your task is to convert the provided design ideas into detailed, high-quality, Complete Image generation prompts.`
    
    const promptCreationUserPrompt = `**Design Ideas Provided:**
- Graphics-Focused:
${generatedIdeas.graphicsCreativeIdeas.map(idea => `  - ${idea}`).join('\n')}

- Typography-Focused:
${generatedIdeas.typographyDesignIdeas.map(idea => `  - ${idea}`).join('\n')}

- Typography with Graphics:
${generatedIdeas.typographyWithGraphicsIdeas.map(idea => `  - ${idea}`).join('\n')}

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

**Output Format:** Return ONLY a valid JSON object with these exact fields:
{
  "extractedTextOrSaying": "string (same as from ideas)",
  "searchKeywords": ["keyword1", "keyword2", ...] (same as from ideas),
  "graphicsPrompts": ["prompt1", "prompt2", "prompt3", "prompt4"],
  "typographyPrompts": ["prompt1", "prompt2", "prompt3"],
  "typographyWithGraphicsPrompts": ["prompt1", "prompt2", "prompt3"]
}
`;

    // Execute STEP 2: Create Prompts from Ideas
    console.log(`\n--- [${flowName}] STEP 2: CREATING PROMPTS FROM IDEAS ---`);

    interface FinalPromptsOutput {
      extractedTextOrSaying: string;
      searchKeywords: string[];
      graphicsPrompts: string[];
      typographyPrompts: string[];
      typographyWithGraphicsPrompts: string[];
    }

    const finalPrompts = await generateJSON<FinalPromptsOutput>({
      modelId: modelToUse,
      temperature: 0.7,
      maxOutputTokens: 16000,
      thinkingMode: profile?.thinkingMode || 'default',
      profile: profileForKey
    }, promptCreationSystemPrompt, promptCreationUserPrompt);

    console.log(`\n--- [${flowName}] STEP 2 RESULT ---`);
    console.log(JSON.stringify(finalPrompts, null, 2));

    const finalOutput: GenerateDesignPromptsOutput = {
      extractedTextOrSaying: generatedIdeas.extractedTextOrSaying,
      searchKeywords: generatedIdeas.searchKeywords,
      graphicsPrompts: finalPrompts.graphicsPrompts,
      typographyPrompts: finalPrompts.typographyPrompts,
      typographyWithGraphicsPrompts: finalPrompts.typographyWithGraphicsPrompts
    };

    console.log(`\n--- [${flowName}] FLOW_COMPLETED ---`);
    return finalOutput;

  } catch (error) {
    console.error(`ERROR (${flowName}): Flow failed:`, error);
    throw new Error(`AI call failed in ${flowName}. ${(error as Error).message}`);
  }
} 