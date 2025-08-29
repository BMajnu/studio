# System Design: Video Tools Expansion

## 1. Architecture Overview
- Pattern: Component-based architecture with modal-driven UI and service layer for AI integration
- Flow: Tool Selection → Input Modal → Scene Configuration → Gallery Management → Prompt Generation → AI Processing
- State Management: React hooks for UI state, context for shared gallery assets
- Backend: Next.js API routes for Gemini integration, Firebase for asset storage

## 2. Project Structure
```
/studio
|-- /src
|   |-- /components
|   |   |-- /video-tools
|   |   |   |-- VideoToolsSelector.tsx        # Main tool selection menu
|   |   |   |-- VideoPromptModal.tsx          # Enhanced video prompt tool
|   |   |   |-- StoryFilmGeneratorModal.tsx   # Story/Film generator
|   |   |   |-- AdsGeneratorModal.tsx         # Ads generator
|   |   |   |-- ViralVideoGeneratorModal.tsx  # Viral video generator
|   |   |   |-- /shared
|   |   |       |-- SceneManager.tsx          # Scene list management
|   |   |       |-- PromptTabs.tsx            # Normal/JSON/Scene/Gallery tabs
|   |   |       |-- GalleryManager.tsx        # Asset gallery component
|   |   |       |-- AssetSelector.tsx         # Asset selection interface
|   |   |       |-- ScenePromptBuilder.tsx    # Scene prompt with gallery tags
|   |-- /ai
|   |   |-- /flows
|   |       |-- generate-story-video-flow.ts   # Story generation AI flow
|   |       |-- generate-ads-video-flow.ts     # Ads generation AI flow
|   |       |-- generate-viral-video-flow.ts   # Viral video AI flow
|   |-- /app
|   |   |-- /api
|   |       |-- /video
|   |           |-- /gallery
|   |               |-- generate-asset/route.ts  # Generate gallery assets
|   |           |-- /scene
|   |               |-- generate/route.ts        # Generate scene with assets
|   |-- /lib
|       |-- /video
|           |-- types.ts                        # Video tool type definitions
|           |-- gallery-utils.ts                # Gallery management utilities
|           |-- prompt-builder.ts               # Prompt construction helpers
```

## 3. Components & Modules

### Component: VideoToolsSelector
- Responsibility: Display menu/modal with four video tool options
- Interfaces: onToolSelect(toolType: VideoToolType)
- Dependencies: Individual tool modals

### Component: VideoPromptModal (Enhanced)
- Responsibility: Handle single/multiple scene video prompt generation
- Interfaces: onGenerate(params: VideoPromptParams), onClose()
- Dependencies: SceneManager, PromptTabs, GalleryManager

### Component: StoryFilmGeneratorModal
- Responsibility: Configure story/film generation with scene count and video type
- Interfaces: onGenerate(params: StoryFilmParams), onClose()
- Dependencies: SceneManager, PromptTabs, GalleryManager

### Component: AdsGeneratorModal
- Responsibility: Generate advertisement videos with product details
- Interfaces: onGenerate(params: AdsParams), onClose()
- Dependencies: SceneManager, PromptTabs, GalleryManager

### Component: ViralVideoGeneratorModal
- Responsibility: Create viral content for social platforms
- Interfaces: onGenerate(params: ViralVideoParams), onClose()
- Dependencies: SceneManager, PromptTabs, GalleryManager

### Component: GalleryManager
- Responsibility: Manage visual assets (characters, objects, backgrounds)
- Interfaces: onAssetSelect(asset: GalleryAsset), onGenerateAsset(prompt: string, type: AssetType)
- Dependencies: Gemini API integration, Firebase storage

### Component: SceneManager
- Responsibility: Display and manage multiple scenes with copy functionality
- Interfaces: onSceneUpdate(sceneId: string, data: SceneData)
- Dependencies: PromptTabs, CopyToClipboard component

## 4. UI/UX Guidance
- Tool Selection: Grid layout with icons and descriptions
- Modals: Wide format (max-w-4xl) with clear sections
- Scene Display: List format with code block styling and copy buttons
- Gallery: Grid view with sub-tabs, thumbnails, and selection indicators
- Colors: Consistent with existing theme (bg-card, border-border)
- Typography: text-base for headers, text-sm for content
- Spacing: p-3 for sections, gap-4 for major elements

## 5. Data Schema

### Type: VideoToolType
```typescript
type VideoToolType = 'video_prompt' | 'story_film' | 'ads' | 'viral_video';
```

### Type: SceneData
```typescript
interface SceneData {
  id: string;
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
```

### Type: GalleryAsset
```typescript
interface GalleryAsset {
  id: string;
  type: 'character' | 'subject' | 'object' | 'background';
  name: string;
  prompt: string;
  imageUrl: string;
  createdAt: Date;
  tags: string[];
}
```

### Type: StoryFilmParams
```typescript
interface StoryFilmParams {
  storyline: string;
  sceneCount: number | 'ai_decide';
  videoType: 'realistic' | 'animation' | '2d_cartoon' | '3d_cartoon' | 'anime';
  audioMode: 'speaking_characters' | 'storytelling' | 'without_audio';
  scenes: SceneData[];
}
```

## 6. API Endpoints

### POST /api/video/gallery/generate-asset
- Request: { prompt: string, type: AssetType, count: 4 }
- Response: { assets: GalleryAsset[] }
- Integration: Gemini 2.0 Flash Preview

### POST /api/video/scene/generate
- Request: { scenePrompt: string, galleryAssets: string[], sceneNumber: number }
- Response: { sceneImage: string, metadata: object }
- Integration: Gemini 2.0 Flash Preview with asset consistency

### POST /api/video/story/generate
- Request: StoryFilmParams
- Response: { scenes: SceneData[], videoPrompts: VideoPrompt[] }

### POST /api/video/ads/generate
- Request: AdsParams
- Response: { scenes: SceneData[], videoPrompts: VideoPrompt[] }

### POST /api/video/viral/generate
- Request: ViralVideoParams
- Response: { scenes: SceneData[], videoPrompts: VideoPrompt[] }

## 7. Gallery Integration Flow
1. User selects Gallery tab in any video tool
2. Gallery displays sub-tabs: Characters, Subjects, Objects, Backgrounds
3. User enters prompt and clicks Generate
4. System calls Gemini 2.0 Flash Preview to generate 4 options
5. User selects preferred option(s)
6. Selected assets are tagged in scene prompts
7. Generate Scene button combines assets with prompts for consistent output

## 8. Prompt Structure Guidelines
- Follow Prompt-resourch-for-video.md structure
- Include gallery asset references as tags
- Format: [Scene Description] + [Gallery Tags: Character 1, Background 1]
- Ensure consistency markers for Gemini integration
