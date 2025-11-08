'use server';
/**
 * Story/Film Generator Flow
 * Produces bilingual natural prompts + structured JSON with scenes for story/film.
 */

import { DEFAULT_MODEL_ID } from '@/lib/constants';
import { generateJSON } from '@/lib/ai/genai-helper';
import type { UserProfile } from '@/lib/types';
import { GalleryAsset } from '@/lib/video/types';
import { generateConsistencyInstruction } from '@/lib/video/gallery-prompt-helper';
import { classifyError } from '@/lib/errors';

const logDebug = (label: string, ...args: any[]) => {
  try { console.log(`[generateStoryFilm] ${label}`, ...args); } catch(_){}
};

// Input interface
export interface GenerateStoryFilmInput {
  userName?: string;
  storylineIdea: string;
  sceneCount?: number;
  decideByAI?: boolean;
  storyType?: string;
  audioMode?: 'speaking' | 'narration' | 'none';
  duration?: number;
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
export interface GenerateStoryFilmOutput {
  normalPromptEnglish?: string;
  normalPromptBengali?: string;
  jsonPrompt?: any;
  veo3OptimizedPrompt?: string;
  technicalNotes?: string[];
  sceneBreakdown?: string[];
  keywords?: string[];
}

export async function generateStoryFilm(flowInput: GenerateStoryFilmInput): Promise<GenerateStoryFilmOutput> {
  const flowName = 'generateStoryFilm';
  logDebug('input', flowInput);
  
  const {
    userName = 'Designer',
    storylineIdea,
    sceneCount,
    decideByAI,
    storyType,
    audioMode,
    duration,
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

  const desiredScenes = decideByAI 
    ? 'Decide scene count based on pacing' 
    : (sceneCount ? `${sceneCount} scenes` : '5-8 scenes by default');

  // Build system prompt
  const systemPrompt = `System Role: Senior film prompt engineer. Create production-ready prompts for narrative video generation (Veo 3 primary).`;

  // Build user prompt
  let userPrompt = `User: ${userName}\n`;
  userPrompt += `Story Idea: ${storylineIdea}\n`;
  userPrompt += `Story Type: ${storyType || 'auto'}\n`;
  userPrompt += `Audio Mode: ${audioMode || 'auto'}\n`;
  userPrompt += `Target Scenes: ${desiredScenes}\n`;
  if (duration) userPrompt += `Total Duration: ${duration} seconds\n`;
  userPrompt += `\n`;

  userPrompt += `Requirements:\n`;
  userPrompt += `- Generate a clear list of scenes with: sceneNumber, duration (approx), description, cameraMovement, lighting, mood, shotType, lens, location, timeOfDay, transition.\n`;
  userPrompt += `- Maintain character/subject consistency across scenes; avoid brands and real identities.\n`;
  userPrompt += `- Output bilingual natural prompts (English and Bengali), a structured JSON prompt, Veo3-optimized concise paragraph, technical notes, keywords, and a scene breakdown list.\n`;
  userPrompt += `\n`;
  userPrompt += `Return JSON only with keys: normalPromptEnglish, normalPromptBengali, jsonPrompt, veo3OptimizedPrompt, technicalNotes, sceneBreakdown, keywords`;

  try {
    let output = await generateJSON<GenerateStoryFilmOutput>({
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
