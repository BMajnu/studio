'use server';
/**
 * Ads Generator Flow
 * Produces bilingual prompts + structured JSON for ad concepts and scenes.
 */

import { z } from 'genkit';
import { DEFAULT_MODEL_ID } from '@/lib/constants';
import { GeminiClient } from '@/lib/ai/gemini-client';
import { createGeminiAiInstance } from '@/lib/ai/genkit-utils';
import { GalleryAsset } from '@/lib/video/types';
import { generateConsistencyInstruction } from '@/lib/video/gallery-prompt-helper';

const logDebug = (label: string, ...args: any[]) => {
  try { console.log(`[generateAds] ${label}`, ...args); } catch(_){}
};

const AttachedFileSchema = z.object({
  name: z.string(),
  type: z.string(),
  dataUri: z.string().optional(),
  textContent: z.string().optional(),
});

const InputSchema = z.object({
  userName: z.string().default('Designer'),
  productInfo: z.string().min(1, 'Provide product/service details'),
  slogans: z.string().optional(),
  scriptIdea: z.string().optional(),
  adLengthSeconds: z.number().optional(),
  visualStyle: z.string().optional(),
  attachedFiles: z.array(AttachedFileSchema).optional(),
  selectedGalleryAssets: z.any().optional(),
});
export type GenerateAdsInput = z.infer<typeof InputSchema>;

const OutputSchema = z.object({
  normalPromptEnglish: z.string().optional(),
  normalPromptBengali: z.string().optional(),
  jsonPrompt: z.any().optional(),
  veo3OptimizedPrompt: z.string().optional(),
  technicalNotes: z.array(z.string()).optional(),
  sceneBreakdown: z.array(z.string()).optional(),
  keywords: z.array(z.string()).optional(),
});
export type GenerateAdsOutput = z.infer<typeof OutputSchema>;

export async function generateAds(flowInput: GenerateAdsInput): Promise<GenerateAdsOutput> {
  const flowName = 'generateAds';
  logDebug('input', flowInput);
  const modelToUse = DEFAULT_MODEL_ID;

  const profileStub = { userId: 'default', name: 'User', services: [], geminiApiKeys: [] as string[] } as any;
  const client = new GeminiClient({ profile: profileStub });

  const promptText = `System Role: Senior advertising prompt engineer. Create ad-ready prompts and structured scenes optimized for AI video (Veo 3 primary). Keep it compliant: no brands/logos.

User: ${flowInput.userName}
Product/Service: ${flowInput.productInfo}
Slogans/Texts: ${flowInput.slogans || 'auto'}
Script/Idea: ${flowInput.scriptIdea || 'auto'}
${flowInput.adLengthSeconds ? `Ad Length: ${flowInput.adLengthSeconds} seconds` : ''}
${flowInput.visualStyle ? `Visual Style: ${flowInput.visualStyle}` : ''}

Return JSON only with keys: normalPromptEnglish, normalPromptBengali, jsonPrompt, veo3OptimizedPrompt, technicalNotes, sceneBreakdown, keywords.
Scenes must include: sceneNumber, duration, description, cameraMovement, lighting, mood, shotType, lens, location, timeOfDay, transition.`;

  try {
    const { data: output } = await client.request(async (apiKey) => {
      const instance = createGeminiAiInstance(apiKey);
      const promptDef = instance.definePrompt({
        name: `${flowName}Prompt_${Date.now()}`,
        input: { schema: InputSchema },
        output: { schema: OutputSchema },
        prompt: promptText,
      });
      const { output } = await promptDef(flowInput, { model: modelToUse });
      if (!output) throw new Error('AI returned empty output');
      // Inject gallery consistency instruction if assets provided
      let enriched = output as GenerateAdsOutput;
      const assets = (flowInput as { selectedGalleryAssets?: GalleryAsset[] }).selectedGalleryAssets || [];
      if (assets && assets.length) {
        const consistency = generateConsistencyInstruction(assets);
        enriched = {
          ...enriched,
          normalPromptEnglish: `${consistency}\n\n${enriched.normalPromptEnglish || ''}`.trim(),
          normalPromptBengali: `${consistency}\n\n${enriched.normalPromptBengali || ''}`.trim(),
          technicalNotes: [...(enriched.technicalNotes || []), 'Maintain asset consistency across all scenes as described above.'],
        };
      }
      return enriched as any;
    });
    return output as GenerateAdsOutput;
  } catch (error) {
    console.error(`ERROR (${flowName}):`, error);
    throw new Error(`AI call failed in ${flowName}. ${(error as Error).message}`);
  }
}
