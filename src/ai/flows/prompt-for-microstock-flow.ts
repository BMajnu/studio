'use server';
/**
 * @fileOverview Generates prompts with metadata for microstock marketplaces based on user input.
 * Each prompt includes a title, keywords, main category, and subcategory to help with submission to stock sites.
 * 
 * - promptForMicrostock - Function to generate 20 prompts with associated metadata
 */

import { ai } from '@/ai/genkit';
import { genkit } from 'genkit';
import { googleAI } from '@genkit-ai/googleai';
import { DEFAULT_MODEL_ID } from '@/lib/constants';
import {
  ContentType,
  PromptForMicrostockInput,
  PromptForMicrostockOutput,
  PromptForMicrostockPromptInputSchema,
  PromptForMicrostockPromptOutputSchema
} from './prompt-for-microstock-types';

export async function promptForMicrostock(flowInput: PromptForMicrostockInput): Promise<PromptForMicrostockOutput> {
  const { userApiKey, modelId, contentType, designNiche, subNiche, detailedDescription, userName } = flowInput;
  const modelToUse = modelId || DEFAULT_MODEL_ID;
  const flowName = 'promptForMicrostock';

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

  const microstockPrompt = currentAiInstance.definePrompt({
    name: `${flowName}Prompt_${Date.now()}`,
    input: { schema: PromptForMicrostockPromptInputSchema },
    output: { schema: PromptForMicrostockPromptOutputSchema },
    prompt: `You are an expert prompt engineer and stock content creator for {{#if userName}}{{{userName}}}{{else}}a graphic designer{{/if}}.

**Objective:** Generate 20 distinct, high-quality prompts with metadata for microstock marketplaces based on the following inputs:

**Content Type:** {{contentType}}
**Design/Image Niche:** {{{designNiche}}}
**Sub-Niche:** {{#if subNiche}}{{{subNiche}}}{{else}}Not specified{{/if}}
**Detailed Description:** {{#if detailedDescription}}{{{detailedDescription}}}{{else}}Not provided{{/if}}

**Guidelines based on Content Type:**
The content type is "{{contentType}}". Follow the appropriate guidelines below:

**For Photography/Real Image Content:**
- Include precise camera settings (e.g., aperture, shutter speed, ISO)
- Specify lighting setups and conditions (e.g., natural light, studio lighting with specific modifiers)
- Detail composition aspects (e.g., rule of thirds, leading lines)
- Mention post-processing recommendations
- Include color grading and mood specifications
- Suggest lens choices and focal lengths
- Describe subject positioning and background elements
- Specify shooting angles and perspectives

**For Vector/Design Content:**
- Detail typography choices (font families, weights, kerning)
- Specify color palettes with exact color codes when appropriate
- Include style specifications (e.g., flat, isometric, realistic)
- Describe design elements and their arrangement
- Mention texture and pattern details
- Include information about proportions and scale
- Detail line weights and stroke styles
- Specify design techniques and effects

**Task:**
Generate 20 unique, detailed prompts for creating {{contentType}} stock content in the specified niche. For each prompt, also provide the following metadata that would be used when submitting to stock marketplaces:

1. Title - A clear, marketable title for the stock content (50-60 characters)
2. Keywords - 8-12 relevant, searchable keywords separated by commas
3. Main Category - The primary category this would fit into on stock sites
4. Subcategory - A more specific subcategory

**Requirements for each prompt:**
- Make each prompt specific, detailed, and actionable
- Ensure prompts are varied and explore different aspects of the design niche
- Include specific style guidance, composition details, and technical specifications
- Make each prompt 150-200 words in length for comprehensive detail
- Ensure prompts would result in commercially viable stock content
- Avoid copyright issues (no branded or trademarked content)
- Focus on marketable concepts with commercial potential
- Make each prompt unique and distinct from the others

**Requirements for metadata:**
- Title should be concise but descriptive, optimized for marketplace search
- Keywords should be relevant and popular search terms for the content
- Categories should match common marketplace categorization systems
- All metadata should be optimized for discoverability on stock platforms

Output all 20 prompts with their associated metadata in the specified format.
`,
  });

  try {
    console.log(`INFO (${flowName}): Processing request for content type: ${contentType}, design niche: ${designNiche}, sub-niche: ${subNiche || 'Not specified'}`);
    const { output } = await microstockPrompt(
      { 
        contentType,
        designNiche, 
        subNiche, 
        detailedDescription, 
        userName 
      }, 
      { model: modelToUse }
    );
    
    if (!output || !output.prompts || output.prompts.length === 0) {
      console.error(`ERROR (${flowName}): AI returned empty or invalid output.`);
      throw new Error(`Failed to generate prompts in ${flowName}.`);
    }
    
    // Ensure we have exactly 20 results
    let results = output.prompts;
    
    // If we somehow got fewer than 20 results, pad the array with variations
    if (results.length < 20) {
      console.warn(`WARN (${flowName}): AI returned only ${results.length} prompts. Padding to 20.`);
      
      // Create variations by adding numbered suffixes to existing prompts
      while (results.length < 20) {
        const sourceIndex = results.length % output.prompts.length;
        const sourcePrompt = output.prompts[sourceIndex];
        
        const variation = {
          prompt: `${sourcePrompt.prompt} (Variation ${results.length - output.prompts.length + 1})`,
          metadata: {
            title: `${sourcePrompt.metadata.title} (Variation ${results.length - output.prompts.length + 1})`,
            keywords: [...sourcePrompt.metadata.keywords, `variation${results.length}`],
            mainCategory: sourcePrompt.metadata.mainCategory,
            subcategory: sourcePrompt.metadata.subcategory,
          }
        };
        
        results.push(variation);
      }
    }
    
    // Trim to exactly 20 if we somehow got more
    results = results.slice(0, 20);
    
    return { results };
  } catch (error) {
    console.error(`ERROR (${flowName}): AI call failed (API key source: ${apiKeySourceForLog}). Error:`, error);
    throw new Error(`Failed to generate microstock prompts: ${error instanceof Error ? error.message : String(error)}`);
  }
} 