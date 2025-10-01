'use server';
/**
 * @fileOverview Generates prompts with metadata for microstock marketplaces based on user input.
 * Each prompt includes a title, keywords, main category, and subcategory to help with submission to stock sites.
 * 
 * - promptForMicrostock - Function to generate 20 prompts with associated metadata
 */

import { DEFAULT_MODEL_ID } from '@/lib/constants';
import { generateJSON } from '@/lib/ai/genai-helper';
import type { UserProfile } from '@/lib/types';
import type {
  ContentType,
  PromptForMicrostockInput,
  PromptForMicrostockOutput,
  PromptWithMetadata
} from './prompt-for-microstock-types';

interface AIPromptOutput {
  prompts: PromptWithMetadata[];
}

export async function promptForMicrostock(flowInput: PromptForMicrostockInput): Promise<PromptForMicrostockOutput> {
  const { 
    userApiKey,
    profile, 
    modelId = DEFAULT_MODEL_ID, 
    contentType, 
    designNiche, 
    subNiche, 
    detailedDescription, 
    userName 
  } = flowInput;
  
  const flowName = 'promptForMicrostock';

  // Build profile for key management
  const profileForKey = profile || (userApiKey ? {
    userId: 'temp',
    name: 'temp',
    services: [],
    geminiApiKeys: [userApiKey]
  } as any : null);

  // Build system prompt
  const systemPrompt = `You are an expert prompt engineer and stock content creator for ${userName || 'a graphic designer'}.`;

  // Build user prompt
  let userPrompt = `**Objective:** Generate 20 distinct, high-quality prompts with metadata for microstock marketplaces based on the following inputs:\n\n`;
  
  userPrompt += `**Content Type:** ${contentType}\n`;
  userPrompt += `**Design/Image Niche:** ${designNiche}\n`;
  userPrompt += `**Sub-Niche:** ${subNiche || 'Not specified'}\n`;
  userPrompt += `**Detailed Description:** ${detailedDescription || 'Not provided'}\n\n`;
  
  userPrompt += `**Guidelines based on Content Type:**\n`;
  userPrompt += `The content type is "${contentType}". Follow the appropriate guidelines below:\n\n`;
  
  userPrompt += `**For Photography/Real Image Content:**\n`;
  userPrompt += `- Include precise camera settings (e.g., aperture, shutter speed, ISO)\n`;
  userPrompt += `- Specify lighting setups and conditions (e.g., natural light, studio lighting with specific modifiers)\n`;
  userPrompt += `- Detail composition aspects (e.g., rule of thirds, leading lines)\n`;
  userPrompt += `- Mention post-processing recommendations\n`;
  userPrompt += `- Include color grading and mood specifications\n`;
  userPrompt += `- Suggest lens choices and focal lengths\n`;
  userPrompt += `- Describe subject positioning and background elements\n`;
  userPrompt += `- Specify shooting angles and perspectives\n\n`;
  
  userPrompt += `**For Vector/Design Content:**\n`;
  userPrompt += `- Detail typography choices (font families, weights, kerning)\n`;
  userPrompt += `- Specify color palettes with exact color codes when appropriate\n`;
  userPrompt += `- Include style specifications (e.g., flat, isometric, realistic)\n`;
  userPrompt += `- Describe design elements and their arrangement\n`;
  userPrompt += `- Mention texture and pattern details\n`;
  userPrompt += `- Include information about proportions and scale\n`;
  userPrompt += `- Detail line weights and stroke styles\n`;
  userPrompt += `- Specify design techniques and effects\n\n`;
  
  userPrompt += `**Task:**\n`;
  userPrompt += `Generate 20 unique, detailed prompts for creating ${contentType} stock content in the specified niche. For each prompt, also provide the following metadata that would be used when submitting to stock marketplaces:\n\n`;
  
  userPrompt += `1. Title - A clear, marketable title for the stock content (50-60 characters)\n`;
  userPrompt += `2. Keywords - 8-12 relevant, searchable keywords separated by commas\n`;
  userPrompt += `3. Main Category - The primary category this would fit into on stock sites\n`;
  userPrompt += `4. Subcategory - A more specific subcategory\n\n`;
  
  userPrompt += `**Requirements for each prompt:**\n`;
  userPrompt += `- Make each prompt specific, detailed, and actionable\n`;
  userPrompt += `- Ensure prompts are varied and explore different aspects of the design niche\n`;
  userPrompt += `- Include specific style guidance, composition details, and technical specifications\n`;
  userPrompt += `- Make each prompt 150-200 words in length for comprehensive detail\n`;
  userPrompt += `- Ensure prompts would result in commercially viable stock content\n`;
  userPrompt += `- Avoid copyright issues (no branded or trademarked content)\n`;
  userPrompt += `- Focus on marketable concepts with commercial potential\n`;
  userPrompt += `- Make each prompt unique and distinct from the others\n\n`;
  
  userPrompt += `**Requirements for metadata:**\n`;
  userPrompt += `- Title should be concise but descriptive, optimized for marketplace search\n`;
  userPrompt += `- Keywords should be relevant and popular search terms for the content\n`;
  userPrompt += `- Categories should match common marketplace categorization systems\n`;
  userPrompt += `- All metadata should be optimized for discoverability on stock platforms\n\n`;
  
  userPrompt += `Output all 20 prompts with their associated metadata in JSON format with key: prompts (array of objects with keys: prompt, metadata).`;

  try {
    console.log(`INFO (${flowName}): Processing request for content type: ${contentType}, design niche: ${designNiche}, sub-niche: ${subNiche || 'Not specified'}`);
    
    const output = await generateJSON<AIPromptOutput>({
      modelId,
      temperature: 0.9,
      maxOutputTokens: 16000,
      thinkingMode: profile?.thinkingMode || 'default',
      profile: profileForKey
    }, systemPrompt, userPrompt);
    
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
        
        const variation: PromptWithMetadata = {
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
    console.error(`ERROR (${flowName}): AI call failed. Error:`, error);
    throw new Error(`Failed to generate microstock prompts: ${error instanceof Error ? error.message : String(error)}`);
  }
}
