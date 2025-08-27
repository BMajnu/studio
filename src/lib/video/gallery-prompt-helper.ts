/**
 * Gallery Prompt Helper
 * Utilities for incorporating gallery assets into video generation prompts
 */

import { GalleryAsset, SceneData } from './types';

/**
 * Generate gallery asset tags for a prompt
 * These tags help maintain consistency across scenes
 */
export function generateGalleryTags(assets: GalleryAsset[]): string {
  if (!assets || assets.length === 0) {
    return '';
  }

  const characterTags = assets
    .filter(a => a.type === 'character' || a.type === 'subject')
    .map((a, idx) => `[CHARACTER_${idx + 1}: ${a.name}]`)
    .join(' ');

  const objectTags = assets
    .filter(a => a.type === 'object')
    .map((a, idx) => `[OBJECT_${idx + 1}: ${a.name}]`)
    .join(' ');

  const backgroundTags = assets
    .filter(a => a.type === 'background')
    .map((a, idx) => `[BACKGROUND_${idx + 1}: ${a.name}]`)
    .join(' ');

  return [characterTags, objectTags, backgroundTags]
    .filter(Boolean)
    .join(' ')
    .trim();
}

/**
 * Enhance a prompt with gallery asset references
 */
export function enhancePromptWithGalleryAssets(
  prompt: string,
  assets: GalleryAsset[]
): string {
  if (!assets || assets.length === 0) {
    return prompt;
  }

  const tags = generateGalleryTags(assets);
  if (!tags) {
    return prompt;
  }

  // Add gallery tags at the beginning of the prompt for consistency
  return `${tags}\n\n${prompt}`;
}

/**
 * Generate detailed asset descriptions for a scene
 */
export function generateAssetDescriptions(assets: GalleryAsset[]): string {
  if (!assets || assets.length === 0) {
    return '';
  }

  const descriptions: string[] = [];

  // Characters
  const characters = assets.filter(a => a.type === 'character' || a.type === 'subject');
  if (characters.length > 0) {
    descriptions.push('CHARACTERS IN SCENE:');
    characters.forEach((char, idx) => {
      descriptions.push(`- Character ${idx + 1} (${char.name}): ${char.prompt}`);
    });
  }

  // Objects
  const objects = assets.filter(a => a.type === 'object');
  if (objects.length > 0) {
    descriptions.push('\nOBJECTS IN SCENE:');
    objects.forEach((obj, idx) => {
      descriptions.push(`- Object ${idx + 1} (${obj.name}): ${obj.prompt}`);
    });
  }

  // Backgrounds
  const backgrounds = assets.filter(a => a.type === 'background');
  if (backgrounds.length > 0) {
    descriptions.push('\nBACKGROUND/SETTING:');
    backgrounds.forEach((bg, idx) => {
      descriptions.push(`- Background ${idx + 1} (${bg.name}): ${bg.prompt}`);
    });
  }

  return descriptions.join('\n');
}

/**
 * Process scenes to include gallery asset references
 */
export function processScenesWithGalleryAssets(
  scenes: SceneData[],
  globalAssets: GalleryAsset[]
): SceneData[] {
  return scenes.map(scene => {
    // Combine global and scene-specific assets
    const sceneAssets = getSceneAssets(scene, globalAssets);
    
    // Enhance prompts with gallery references
    const enhancedNormalPrompt = enhancePromptWithGalleryAssets(
      scene.normalPrompt,
      sceneAssets
    );
    
    // For JSON prompts, add gallery metadata
    let enhancedJsonPrompt = scene.jsonPrompt;
    if (typeof scene.jsonPrompt === 'object' && scene.jsonPrompt !== null) {
      enhancedJsonPrompt = {
        ...scene.jsonPrompt,
        galleryAssets: generateGalleryTags(sceneAssets),
        assetDescriptions: generateAssetDescriptions(sceneAssets)
      };
    }
    
    // Enhance scene image prompts
    const enhancedSceneImage = {
      start: enhancePromptWithGalleryAssets(scene.sceneImage.start, sceneAssets),
      end: enhancePromptWithGalleryAssets(scene.sceneImage.end, sceneAssets)
    };
    
    return {
      ...scene,
      normalPrompt: enhancedNormalPrompt,
      jsonPrompt: enhancedJsonPrompt,
      sceneImage: enhancedSceneImage
    };
  });
}

/**
 * Get assets for a specific scene
 */
function getSceneAssets(scene: SceneData, globalAssets: GalleryAsset[]): GalleryAsset[] {
  const assets: GalleryAsset[] = [];
  
  // Add characters
  scene.galleryAssets.characters.forEach(id => {
    const asset = globalAssets.find(a => a.id === id);
    if (asset) assets.push(asset);
  });
  
  // Add objects
  scene.galleryAssets.objects.forEach(id => {
    const asset = globalAssets.find(a => a.id === id);
    if (asset) assets.push(asset);
  });
  
  // Add backgrounds
  scene.galleryAssets.backgrounds.forEach(id => {
    const asset = globalAssets.find(a => a.id === id);
    if (asset) assets.push(asset);
  });
  
  return assets;
}

/**
 * Generate a prompt instruction for maintaining asset consistency
 */
export function generateConsistencyInstruction(assets: GalleryAsset[]): string {
  if (!assets || assets.length === 0) {
    return '';
  }

  return `
IMPORTANT: Maintain visual consistency for the following assets throughout all scenes:

${generateAssetDescriptions(assets)}

Use these exact descriptions when referencing these elements in any scene to ensure consistency across the entire video.
`.trim();
}
