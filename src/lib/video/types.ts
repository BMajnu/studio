// Video Tools Type Definitions

export type VideoToolType = 'video_prompt' | 'story_film' | 'ads' | 'viral_video';

export interface VideoToolOption {
  id: VideoToolType;
  title: string;
  description: string;
  icon: string;
  color: string;
}

// Scene-related types
export interface SceneData {
  id: string;
  sceneNumber: number;
  normalPrompt: string;
  jsonPrompt: object;
  sceneImage: {
    start: string;
    end: string;
  };
  galleryAssets: {
    characters: string[];
    objects: string[];
    backgrounds: string[];
  };
}

// Gallery Asset types
export type AssetType = 'character' | 'subject' | 'object' | 'background';

export interface GalleryAsset {
  id: string;
  type: AssetType;
  name: string;
  prompt: string;
  imageUrl: string;
  thumbnailUrl?: string;
  createdAt: Date;
  tags: string[];
  metadata?: Record<string, any>;
}

// Enhanced Video Generation Parameters (extending existing)
export interface BaseVideoParams {
  description: string;
  style: string;
  duration: number;
  aspectRatio: string;
  language: 'english' | 'bengali' | 'both';
  outputFormat: 'normal' | 'json' | 'both';
  contentCategory: string;
}

// Video Prompt specific params
export interface VideoPromptParams extends BaseVideoParams {
  sceneMode: 'single' | 'multiple';
  scenes?: SceneData[];
}

// Story/Film Generator params
export interface StoryFilmParams extends BaseVideoParams {
  storyline: string;
  sceneCount: number | 'ai_decide';
  videoType: 'realistic' | 'animation' | '2d_cartoon' | '3d_cartoon' | 'anime';
  audioMode: 'speaking_characters' | 'storytelling' | 'without_audio';
  scenes?: SceneData[];
}

// Ads Generator params
export interface AdsParams extends BaseVideoParams {
  productDetails: string;
  textsAndSayings: string;
  storylineScript: string;
  sceneMode: 'single' | 'multiple';
  scenes?: SceneData[];
}

// Viral Video Generator params
export interface ViralVideoParams extends BaseVideoParams {
  subjectsCharacters: string;
  targetAudience: string[];
  storylineScript: string;
  platform: 'tiktok' | 'shorts' | 'reels' | 'all';
  sceneMode: 'single' | 'multiple';
  scenes?: SceneData[];
}

// Tab types for prompt interface
export type PromptTabType = 'normal' | 'json' | 'scene_image' | 'gallery';

export interface PromptTabConfig {
  id: PromptTabType;
  label: string;
  icon?: string;
}

// Gallery sub-tab configuration
export interface GallerySubTab {
  id: AssetType;
  label: string;
  pluralLabel: string;
}

// Scene generation request
export interface SceneGenerationRequest {
  scenePrompt: string;
  galleryAssets: string[];
  sceneNumber: number;
  style?: string;
  aspectRatio?: string;
}

// Gallery asset generation request
export interface AssetGenerationRequest {
  prompt: string;
  type: AssetType;
  count?: number; // Default 4 options
  style?: string;
}

// Export all video tool configurations
export const VIDEO_TOOLS: VideoToolOption[] = [
  {
    id: 'video_prompt',
    title: 'Video Prompt',
    description: 'Generate video prompts with single or multiple scenes',
    icon: 'Video',
    color: 'blue'
  },
  {
    id: 'story_film',
    title: 'Story/Film Generator',
    description: 'Create narrative-driven stories and films with AI-powered scene generation',
    icon: 'Film',
    color: 'purple'
  },
  {
    id: 'ads',
    title: 'Ads Generator',
    description: 'Design compelling advertisement videos for products and services',
    icon: 'Megaphone',
    color: 'green'
  },
  {
    id: 'viral_video',
    title: 'Viral Video Generator',
    description: 'Create engaging content optimized for TikTok, Shorts, and Reels',
    icon: 'TrendingUp',
    color: 'orange'
  }
];

// Prompt tabs configuration
export const PROMPT_TABS: PromptTabConfig[] = [
  { id: 'normal', label: 'Normal Prompt' },
  { id: 'json', label: 'JSON Prompt' },
  { id: 'scene_image', label: 'Scene Image' },
  { id: 'gallery', label: 'Gallery' }
];

// Gallery sub-tabs configuration
export const GALLERY_SUB_TABS: GallerySubTab[] = [
  { id: 'character', label: 'Character', pluralLabel: 'Characters' },
  { id: 'subject', label: 'Subject', pluralLabel: 'Subjects' },
  { id: 'object', label: 'Object', pluralLabel: 'Objects' },
  { id: 'background', label: 'Background', pluralLabel: 'Backgrounds' }
];

// Video style options (enhanced from existing)
export const VIDEO_STYLES = [
  { value: 'cinematic', label: 'Cinematic', description: 'Movie-like quality with dramatic shots' },
  { value: 'documentary', label: 'Documentary', description: 'Realistic and informative storytelling' },
  { value: 'animation', label: 'Animation', description: '2D/3D animated style' },
  { value: 'realistic', label: 'Realistic', description: 'Photo-realistic live-action style' },
  { value: '2d_cartoon', label: '2D Cartoon', description: 'Traditional 2D cartoon animation' },
  { value: '3d_cartoon', label: '3D Cartoon', description: 'Modern 3D cartoon style' },
  { value: 'anime', label: 'Anime', description: 'Japanese anime style animation' },
  { value: 'timelapse', label: 'Timelapse', description: 'Fast-forward time progression' },
  { value: 'vlog', label: 'Vlog / Casual', description: 'Handheld, natural, personality-driven' },
  { value: 'explainer', label: 'Explainer / Tutorial', description: 'Clear step-by-step instructional style' },
  { value: 'shortform', label: 'Short-form Vertical', description: 'Snappy, vertical for TikTok/Reels/Shorts' },
  { value: 'musicvideo', label: 'Music Video', description: 'Stylized cuts synced to music' },
  { value: 'productdemo', label: 'Product Demo', description: 'Show features, benefits, and use-cases' },
  { value: 'motiongraphics', label: 'Motion Graphics', description: 'Text/shape animations and transitions' },
  { value: 'stopmotion', label: 'Stop Motion', description: 'Frame-by-frame animation look' },
];

// Audio mode options for Story/Film
export const AUDIO_MODES = [
  { value: 'speaking_characters', label: 'Audio with Speaking Characters', description: 'Characters have dialogue' },
  { value: 'storytelling', label: 'Audio Storytelling Format', description: 'One narrator tells the story' },
  { value: 'without_audio', label: 'Without Audio', description: 'Visual-only, recommended for Video 3 model' }
];

// Platform options for Viral Videos
export const VIRAL_PLATFORMS = [
  { value: 'tiktok', label: 'TikTok', description: 'Short vertical videos, 15-60 seconds' },
  { value: 'shorts', label: 'YouTube Shorts', description: 'Vertical videos up to 60 seconds' },
  { value: 'reels', label: 'Instagram Reels', description: 'Short engaging videos, 15-90 seconds' },
  { value: 'all', label: 'All Platforms', description: 'Optimized for all short-form platforms' }
];
