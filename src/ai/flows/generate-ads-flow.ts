'use server';
/**
 * Ads Generator Flow
 * Produces bilingual prompts + structured JSON for ad concepts and scenes.
 */

import { DEFAULT_MODEL_ID } from '@/lib/constants';
import { generateJSON } from '@/lib/ai/genai-helper';
import type { UserProfile } from '@/lib/types';
import { GalleryAsset } from '@/lib/video/types';
import { generateConsistencyInstruction } from '@/lib/video/gallery-prompt-helper';

const logDebug = (label: string, ...args: any[]) => {
  try { console.log(`[generateAds] ${label}`, ...args); } catch(_){}
};

// Input interface
export interface GenerateAdsInput {
  userName?: string;
  productInfo: string;
  slogans?: string;
  scriptIdea?: string;
  adLengthSeconds?: number;
  visualStyle?: string;
  attachedFiles?: Array<{
    name: string;
    type: string;
    dataUri?: string;
    textContent?: string;
  }>;
  selectedGalleryAssets?: GalleryAsset[];
  modelId?: string;
  userApiKey?: string;
  profile?: UserProfile;
}

// Output interface
export interface GenerateAdsOutput {
  normalPromptEnglish?: string;
  normalPromptBengali?: string;
  jsonPrompt?: any;
  veo3OptimizedPrompt?: string;
  technicalNotes?: string[];
  sceneBreakdown?: string[];
  keywords?: string[];
}

export async function generateAds(flowInput: GenerateAdsInput): Promise<GenerateAdsOutput> {
  const flowName = 'generateAds';
  logDebug('input', flowInput);
  
  const {
    userName = 'Designer',
    productInfo,
    slogans,
    scriptIdea,
    adLengthSeconds,
    visualStyle,
    selectedGalleryAssets = [],
    modelId = DEFAULT_MODEL_ID,
    userApiKey,
    profile
  } = flowInput;

  // Build profile for key management
  const profileForKey = profile || (userApiKey ? {
    userId: 'temp',
    name: 'temp',
    services: [],
    geminiApiKeys: [userApiKey]
  } as any : null);

  // Build system prompt
  const systemPrompt = `System Role: Senior advertising prompt engineer. Create ad-ready prompts and structured scenes optimized for AI video (Veo 3 primary). Keep it compliant: no brands/logos.`;

  // Build user prompt
  let userPrompt = `User: ${userName}\n`;
  userPrompt += `Product/Service: ${productInfo}\n`;
  userPrompt += `Slogans/Texts: ${slogans || 'auto'}\n`;
  userPrompt += `Script/Idea: ${scriptIdea || 'auto'}\n`;
  if (adLengthSeconds) userPrompt += `Ad Length: ${adLengthSeconds} seconds\n`;
  if (visualStyle) userPrompt += `Visual Style: ${visualStyle}\n`;
  userPrompt += `\n`;

  userPrompt += `Return JSON only with keys: normalPromptEnglish, normalPromptBengali, jsonPrompt, veo3OptimizedPrompt, technicalNotes, sceneBreakdown, keywords.\n`;
  userPrompt += `Scenes must include: sceneNumber, duration, description, cameraMovement, lighting, mood, shotType, lens, location, timeOfDay, transition.`;

  try {
    let output = await generateJSON<GenerateAdsOutput>({
      modelId,
      temperature: 0.8,
      maxOutputTokens: 16000,
      thinkingMode: profile?.thinkingMode || 'default',
      profile: profileForKey
    }, systemPrompt, userPrompt);

    // Inject gallery consistency instruction if assets provided
    if (selectedGalleryAssets && selectedGalleryAssets.length > 0) {
      const consistency = generateConsistencyInstruction(selectedGalleryAssets);
      output = {
        ...output,
        normalPromptEnglish: `${consistency}\n\n${output.normalPromptEnglish || ''}`.trim(),
        normalPromptBengali: `${consistency}\n\n${output.normalPromptBengali || ''}`.trim(),
        technicalNotes: [...(output.technicalNotes || []), 'Maintain asset consistency across all scenes as described above.'],
      };
    }

    return output;
  } catch (error) {
    console.error(`ERROR (${flowName}):`, error);
    throw new Error(`AI call failed in ${flowName}. ${(error as Error).message}`);
  }
}
