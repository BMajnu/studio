'use server';
/**
 * Viral Video Generator Flow
 * Produces bilingual prompts + structured JSON optimized for short-form viral content.
 */

import { DEFAULT_MODEL_ID } from '@/lib/constants';
import { generateJSON } from '@/lib/ai/genai-helper';
import type { UserProfile } from '@/lib/types';
import { GalleryAsset } from '@/lib/video/types';
import { generateConsistencyInstruction } from '@/lib/video/gallery-prompt-helper';
import { classifyError } from '@/lib/errors';

const logDebug = (label: string, ...args: any[]) => {
  try { console.log(`[generateViralVideo] ${label}`, ...args); } catch(_){}
};

// Input interface
export interface GenerateViralVideoInput {
  userName?: string;
  topic: string;
  targetAudience?: string;
  duration?: number;
  style?: string;
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
export interface GenerateViralVideoOutput {
  normalPromptEnglish?: string;
  normalPromptBengali?: string;
  jsonPrompt?: any;
  veo3OptimizedPrompt?: string;
  technicalNotes?: string[];
  sceneBreakdown?: string[];
  keywords?: string[];
}

export async function generateViralVideo(flowInput: GenerateViralVideoInput): Promise<GenerateViralVideoOutput> {
  const flowName = 'generateViralVideo';
  logDebug('input', flowInput);
  
  const {
    userName = 'Designer',
    topic,
    targetAudience,
    duration,
    style,
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
  const systemPrompt = `System Role: Social content strategist + video prompt engineer. Create engaging, fast-paced short-form prompts optimized for Veo 3. Follow platform best practices. Avoid copyrighted brands/logos.`;

  // Build user prompt
  let userPrompt = `User: ${userName}\n`;
  userPrompt += `Topic: ${topic}\n`;
  userPrompt += `Target Audience: ${targetAudience || 'general'}\n`;
  if (duration) userPrompt += `Duration: ${duration} seconds\n`;
  if (style) userPrompt += `Style: ${style}\n`;
  userPrompt += `\n`;

  userPrompt += `Requirements:\n`;
  userPrompt += `- Hook in first 2 seconds, 3-7 concise scenes, strong CTA (if applicable).\n`;
  userPrompt += `- For each scene: sceneNumber, duration, on-screen action, overlay text (if any), cameraMovement, lighting, mood.\n`;
  userPrompt += `- Return JSON only with keys: normalPromptEnglish, normalPromptBengali, jsonPrompt, veo3OptimizedPrompt, technicalNotes, sceneBreakdown, keywords.`;

  try {
    let output = await generateJSON<GenerateViralVideoOutput>({
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
    throw classifyError(error);
  }
}
