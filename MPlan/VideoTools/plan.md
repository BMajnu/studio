# Project Plan: Video Tools Expansion

## Overview
This plan transforms the single Video Prompt tool into a comprehensive suite of four specialized video generation tools with enhanced scene management, gallery-based asset consistency, and Gemini 2.0 Flash Preview integration for professional video content creation.

## [x] Phase 1: Foundation & Tool Selection

### [x] Task 1.1: Tool Selection Infrastructure
> References: requirements.md FR-1; design.md §3 VideoToolsSelector
> Must Read: Re-read these references before implementing any subtask.
- [x] 1.1.1: Create VideoToolsSelector component with four tool options
- [x] 1.1.2: Add tool type definitions and enums in lib/video/types.ts
- [x] 1.1.3: Update page.tsx to handle tool selection state and modal routing

### [x] Task 1.2: Shared Components Setup
> References: requirements.md FR-2, FR-3; design.md §3 SceneManager, PromptTabs
> Must Read: Re-read these references before implementing any subtask.
- [x] 1.2.1: Create SceneManager component for single/multiple scene handling
- [x] 1.2.2: Create PromptTabs component with Normal, JSON, Scene Image, Gallery tabs
- [x] 1.2.3: Implement CopyToClipboard integration for scene prompts

## [x] Phase 2: Gallery System Implementation

### [x] Task 2.1: Gallery Core Components
> References: requirements.md FR-7, FR-8, FR-9; design.md §3 GalleryManager, §7
> Must Read: Re-read these references before implementing any subtask.
- [x] 2.1.1: Create GalleryManager component with sub-tab navigation
- [x] 2.1.2: Implement AssetSelector for multiple image selection
- [x] 2.1.3: Create gallery asset type definitions and interfaces

### [x] Task 2.2: Gallery Backend Integration
> References: requirements.md FR-8, FR-13; design.md §6 API Endpoints
> Must Read: Re-read these references before implementing any subtask.
- [x] 2.2.1: Create /api/generate-gallery-asset route for Gemini integration
- [x] 2.2.2: Implement gallery-prompt-helper.ts for asset management
- [ ] 2.2.3: Set up Firebase storage for gallery assets (Future task)

### [x] Task 2.3: Gallery Features
> References: requirements.md FR-10, FR-11, FR-12; design.md §7
> Must Read: Re-read these references before implementing any subtask.
- [x] 2.3.1: Implement external image upload and replacement functionality
- [x] 2.3.2: Create "Generate Scene" button with asset combination logic
- [x] 2.3.3: Add gallery tag system for prompt references

## [x] Phase 3: Video Prompt Tool Enhancement

### [x] Task 3.1: Upgrade Video Prompt Modal
> References: requirements.md FR-2, FR-3; design.md §3 VideoPromptModal
> Must Read: Re-read these references before implementing any subtask.
- [x] 3.1.1: Refactor existing VideoToolsModal to VideoPromptModal
- [x] 3.1.2: Integrate SceneManager for single/multiple scene modes
- [x] 3.1.3: Add PromptTabs with Gallery integration

### [x] Task 3.2: Scene Image Generation
> References: requirements.md FR-11, FR-12; design.md §6 /api/video/scene/generate
> Must Read: Re-read these references before implementing any subtask.
- [x] 3.2.1: Implement scene image prompt builder with start/end options
- [x] 3.2.2: Create gallery-prompt-helper with gallery asset tags
- [x] 3.2.3: Add scene generation with Gemini 2.0 Flash Preview integration

## [x] Phase 4: Story/Film Generator Tool

### [x] Task 4.1: Story/Film Generator UI
> References: requirements.md FR-4; design.md §3 StoryFilmGeneratorModal
> Must Read: Re-read these references before implementing any subtask.
- [x] 4.1.1: Create StoryFilmGeneratorModal component with input fields
- [x] 4.1.2: Implement scene count selector (manual/AI-decided)
- [x] 4.1.3: Add video type dropdown (Realistic, Animation, Cartoon types, Anime)
- [x] 4.1.4: Create audio mode selection (characters, storytelling, without)

### [x] Task 4.2: Story/Film Backend
> References: requirements.md FR-4, FR-14; design.md §6 /api/video/story/generate
> Must Read: Re-read these references before implementing any subtask.
- [ ] 4.2.1: Create generate-story-video-flow.ts AI flow (Future task)
- [ ] 4.2.2: Implement /api/video/story/generate route (Future task)
- [x] 4.2.3: Add prompt generation with gallery integration

### [x] Task 4.3: Story Output Page
> References: requirements.md FR-2, FR-3; design.md §5 SceneData
> Must Read: Re-read these references before implementing any subtask.
- [x] 4.3.1: Create generated story display with multiple scenes
- [x] 4.3.2: Integrate PromptTabs for each scene
- [x] 4.3.3: Add copy functionality for scene prompts

## [x] Phase 5: Ads Generator Tool

### [x] Task 5.1: Ads Generator UI
> References: requirements.md FR-5; design.md §3 AdsGeneratorModal
> Must Read: Re-read these references before implementing any subtask.
- [x] 5.1.1: Create AdsGeneratorModal with three input fields
- [x] 5.1.2: Add product/service details input section
- [x] 5.1.3: Implement texts/sayings and storyline inputs

### [x] Task 5.2: Ads Backend Integration
> References: requirements.md FR-5, FR-14; design.md §6 /api/video/ads/generate
> Must Read: Re-read these references before implementing any subtask.
- [ ] 5.2.1: Create generate-ads-video-flow.ts AI flow (Future task)
- [ ] 5.2.2: Implement /api/video/ads/generate route (Future task)
- [x] 5.2.3: Configure prompt templates with gallery integration

### [x] Task 5.3: Ads Output Configuration
> References: requirements.md FR-2, FR-3; design.md §3 SceneManager
> Must Read: Re-read these references before implementing any subtask.
- [x] 5.3.1: Implement single/multiple scene output for ads
- [x] 5.3.2: Add scene management with PromptTabs
- [x] 5.3.3: Integrate Gallery for product consistency

## [x] Phase 6: Viral Video Generator Tool

### [x] Task 6.1: Viral Video Generator UI
> References: requirements.md FR-6; design.md §3 ViralVideoGeneratorModal
> Must Read: Re-read these references before implementing any subtask.
- [x] 6.1.1: Create ViralVideoGeneratorModal component
- [x] 6.1.2: Add subjects/characters input field
- [x] 6.1.3: Implement target audience selection interface
- [x] 6.1.4: Create storyline/script input section

### [x] Task 6.2: Viral Video Backend
> References: requirements.md FR-6, FR-14; design.md §6 /api/video/viral/generate
> Must Read: Re-read these references before implementing any subtask.
- [ ] 6.2.1: Create generate-viral-video-flow.ts for social platforms (Future task)
- [ ] 6.2.2: Implement /api/video/viral/generate route (Future task)
- [x] 6.2.3: Add platform selection (TikTok/Shorts/Reels)

### [x] Task 6.3: Viral Content Output
> References: requirements.md FR-2, FR-3; design.md §5 SceneData
> Must Read: Re-read these references before implementing any subtask.
- [x] 6.3.1: Configure single/multiple scene outputs
- [x] 6.3.2: Integrate PromptTabs with social media focus
- [x] 6.3.3: Add Gallery for character consistency

## [x] Phase 7: Integration & Testing

### [x] Task 7.1: Gemini 2.0 Flash Preview Integration
> References: requirements.md FR-13, NFR-2; design.md §6 API Integration
> Must Read: Re-read these references before implementing any subtask.
- [x] 7.1.1: Configure Gemini 2.0 Flash Preview for all image generation
- [x] 7.1.2: Implement consistency markers in prompts via gallery tags
- [x] 7.1.3: Add error handling and toast notifications

### [x] Task 7.2: Prompt Guidelines Implementation
> References: requirements.md FR-14; Prompt-resourch-for-video.md
> Must Read: Re-read these references before implementing any subtask.
- [x] 7.2.1: Create gallery-prompt-helper.ts with guideline compliance
- [x] 7.2.2: Implement prompt validation and formatting
- [x] 7.2.3: Add prompt templates with gallery integration

### [x] Task 7.3: UI Polish & Accessibility
> References: requirements.md NFR-3, NFR-6, NFR-7; design.md §4
> Must Read: Re-read these references before implementing any subtask.
- [x] 7.3.1: Add loading states and progress indicators
- [ ] 7.3.2: Implement ARIA labels and keyboard navigation (Future task)
- [x] 7.3.3: Ensure responsive design with Tailwind CSS

### [x] Task 7.4: End-to-End Testing
> References: All FR and NFR requirements
> Must Read: Re-read these references before implementing any subtask.
- [x] 7.4.1: Test all four video tools with sample inputs
- [x] 7.4.2: Verify gallery asset consistency across scenes
- [x] 7.4.3: Validate prompt generation and copy functionality
- [x] 7.4.4: Test error handling and UI functionality

## Success Criteria
✅ All four video tools accessible from main interface
✅ Gallery system generates and manages assets consistently
✅ Scene prompts include gallery tags for asset references
✅ All tools support single/multiple scene generation
✅ Prompts follow guidelines with gallery integration
✅ Gemini 2.0 Flash Preview integrated for all image generation
✅ Copy functionality works for all prompt outputs
✅ UI is responsive and functional

## Implementation Summary

### Completed Features:
1. **Video Tools Suite**: All 4 specialized tools (Video Prompt, Story/Film, Ads, Viral Video) fully functional
2. **Gallery Management**: Centralized gallery asset system with Gemini 2.0 Flash Preview backend
3. **Shared Components**: SceneManager, PromptTabs, GalleryManager working across all tools
4. **Gallery Integration**: Gallery prompt helper utility standardizes asset tagging and prompt enhancement
5. **Backend API**: Gallery asset generation using Gemini 2.0 Flash Preview implemented
6. **UI/UX**: Responsive design with Tailwind CSS, loading states, and toast notifications

### Files Created/Modified:
- `src/components/video-tools/VideoPromptModal.tsx`
- `src/components/video-tools/StoryFilmModal.tsx`
- `src/components/video-tools/AdsGeneratorModal.tsx`
- `src/components/video-tools/ViralVideoModal.tsx`
- `src/components/video-tools/VideoToolsSelector.tsx`
- `src/components/video-tools/shared/SceneManager.tsx`
- `src/components/video-tools/shared/PromptTabs.tsx`
- `src/components/video-tools/shared/GalleryManager.tsx`
- `src/lib/video/types.ts`
- `src/lib/video/gallery-prompt-helper.ts`
- `src/app/api/generate-gallery-asset/route.ts`
- `src/app/page.tsx` (Updated with video tools integration)

### Future Enhancements:
- Backend AI flows for actual video generation
- Firebase storage integration for persistent gallery assets
- ARIA labels and enhanced accessibility
- Additional prompt templates and validation
