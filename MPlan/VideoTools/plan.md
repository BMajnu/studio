# Project Plan: Video Tools Expansion

## Overview
This plan transforms the single Video Prompt tool into a comprehensive suite of four specialized video generation tools with enhanced scene management, gallery-based asset consistency, and Gemini 2.0 Flash Preview integration for professional video content creation.

## [ ] Phase 1: Foundation & Tool Selection

### [ ] Task 1.1: Tool Selection Infrastructure
> References: requirements.md FR-1; design.md §3 VideoToolsSelector
> Must Read: Re-read these references before implementing any subtask.
- [ ] 1.1.1: Create VideoToolsSelector component with four tool options
- [ ] 1.1.2: Add tool type definitions and enums in lib/video/types.ts
- [ ] 1.1.3: Update page.tsx to handle tool selection state and modal routing

### [ ] Task 1.2: Shared Components Setup
> References: requirements.md FR-2, FR-3; design.md §3 SceneManager, PromptTabs
> Must Read: Re-read these references before implementing any subtask.
- [ ] 1.2.1: Create SceneManager component for single/multiple scene handling
- [ ] 1.2.2: Create PromptTabs component with Normal, JSON, Scene Image, Gallery tabs
- [ ] 1.2.3: Implement CopyToClipboard integration for scene prompts

## [ ] Phase 2: Gallery System Implementation

### [ ] Task 2.1: Gallery Core Components
> References: requirements.md FR-7, FR-8, FR-9; design.md §3 GalleryManager, §7
> Must Read: Re-read these references before implementing any subtask.
- [ ] 2.1.1: Create GalleryManager component with sub-tab navigation
- [ ] 2.1.2: Implement AssetSelector for multiple image selection
- [ ] 2.1.3: Create gallery asset type definitions and interfaces

### [ ] Task 2.2: Gallery Backend Integration
> References: requirements.md FR-8, FR-13; design.md §6 API Endpoints
> Must Read: Re-read these references before implementing any subtask.
- [ ] 2.2.1: Create /api/video/gallery/generate-asset route for Gemini integration
- [ ] 2.2.2: Implement gallery-utils.ts for asset management
- [ ] 2.2.3: Set up Firebase storage for gallery assets

### [ ] Task 2.3: Gallery Features
> References: requirements.md FR-10, FR-11, FR-12; design.md §7
> Must Read: Re-read these references before implementing any subtask.
- [ ] 2.3.1: Implement external image upload and replacement functionality
- [ ] 2.3.2: Create "Generate Scene" button with asset combination logic
- [ ] 2.3.3: Add gallery tag system for prompt references

## [ ] Phase 3: Video Prompt Tool Enhancement

### [ ] Task 3.1: Upgrade Video Prompt Modal
> References: requirements.md FR-2, FR-3; design.md §3 VideoPromptModal
> Must Read: Re-read these references before implementing any subtask.
- [ ] 3.1.1: Refactor existing VideoToolsModal to VideoPromptModal
- [ ] 3.1.2: Integrate SceneManager for single/multiple scene modes
- [ ] 3.1.3: Add PromptTabs with Gallery integration

### [ ] Task 3.2: Scene Image Generation
> References: requirements.md FR-11, FR-12; design.md §6 /api/video/scene/generate
> Must Read: Re-read these references before implementing any subtask.
- [ ] 3.2.1: Implement scene image prompt builder with start/end options
- [ ] 3.2.2: Create ScenePromptBuilder component with gallery asset tags
- [ ] 3.2.3: Add scene generation API route with Gemini integration

## [ ] Phase 4: Story/Film Generator Tool

### [ ] Task 4.1: Story/Film Generator UI
> References: requirements.md FR-4; design.md §3 StoryFilmGeneratorModal
> Must Read: Re-read these references before implementing any subtask.
- [ ] 4.1.1: Create StoryFilmGeneratorModal component with input fields
- [ ] 4.1.2: Implement scene count selector (manual/AI-decided)
- [ ] 4.1.3: Add video type dropdown (Realistic, Animation, Cartoon types, Anime)
- [ ] 4.1.4: Create audio mode selection (characters, storytelling, without)

### [ ] Task 4.2: Story/Film Backend
> References: requirements.md FR-4, FR-14; design.md §6 /api/video/story/generate
> Must Read: Re-read these references before implementing any subtask.
- [ ] 4.2.1: Create generate-story-video-flow.ts AI flow
- [ ] 4.2.2: Implement /api/video/story/generate route
- [ ] 4.2.3: Add prompt generation following Prompt-resourch-for-video.md

### [ ] Task 4.3: Story Output Page
> References: requirements.md FR-2, FR-3; design.md §5 SceneData
> Must Read: Re-read these references before implementing any subtask.
- [ ] 4.3.1: Create generated story display with multiple scenes
- [ ] 4.3.2: Integrate PromptTabs for each scene
- [ ] 4.3.3: Add copy functionality for scene prompts

## [ ] Phase 5: Ads Generator Tool

### [ ] Task 5.1: Ads Generator UI
> References: requirements.md FR-5; design.md §3 AdsGeneratorModal
> Must Read: Re-read these references before implementing any subtask.
- [ ] 5.1.1: Create AdsGeneratorModal with three input fields
- [ ] 5.1.2: Add product/service details input section
- [ ] 5.1.3: Implement texts/sayings and storyline inputs

### [ ] Task 5.2: Ads Backend Integration
> References: requirements.md FR-5, FR-14; design.md §6 /api/video/ads/generate
> Must Read: Re-read these references before implementing any subtask.
- [ ] 5.2.1: Create generate-ads-video-flow.ts AI flow
- [ ] 5.2.2: Implement /api/video/ads/generate route
- [ ] 5.2.3: Configure prompt templates for ad generation

### [ ] Task 5.3: Ads Output Configuration
> References: requirements.md FR-2, FR-3; design.md §3 SceneManager
> Must Read: Re-read these references before implementing any subtask.
- [ ] 5.3.1: Implement single/multiple scene output for ads
- [ ] 5.3.2: Add scene management with PromptTabs
- [ ] 5.3.3: Integrate Gallery for product consistency

## [ ] Phase 6: Viral Video Generator Tool

### [ ] Task 6.1: Viral Video Generator UI
> References: requirements.md FR-6; design.md §3 ViralVideoGeneratorModal
> Must Read: Re-read these references before implementing any subtask.
- [ ] 6.1.1: Create ViralVideoGeneratorModal component
- [ ] 6.1.2: Add subjects/characters input field
- [ ] 6.1.3: Implement target audience selection interface
- [ ] 6.1.4: Create storyline/script input section

### [ ] Task 6.2: Viral Video Backend
> References: requirements.md FR-6, FR-14; design.md §6 /api/video/viral/generate
> Must Read: Re-read these references before implementing any subtask.
- [ ] 6.2.1: Create generate-viral-video-flow.ts for social platforms
- [ ] 6.2.2: Implement /api/video/viral/generate route
- [ ] 6.2.3: Add TikTok/Shorts/Reels optimization logic

### [ ] Task 6.3: Viral Content Output
> References: requirements.md FR-2, FR-3; design.md §5 SceneData
> Must Read: Re-read these references before implementing any subtask.
- [ ] 6.3.1: Configure single/multiple scene outputs
- [ ] 6.3.2: Integrate PromptTabs with social media focus
- [ ] 6.3.3: Add Gallery for character consistency

## [ ] Phase 7: Integration & Testing

### [ ] Task 7.1: Gemini 2.0 Flash Preview Integration
> References: requirements.md FR-13, NFR-2; design.md §6 API Integration
> Must Read: Re-read these references before implementing any subtask.
- [ ] 7.1.1: Configure Gemini 2.0 Flash Preview for all image generation
- [ ] 7.1.2: Implement consistency markers in prompts
- [ ] 7.1.3: Add error handling and retry mechanisms

### [ ] Task 7.2: Prompt Guidelines Implementation
> References: requirements.md FR-14; Prompt-resourch-for-video.md
> Must Read: Re-read these references before implementing any subtask.
- [ ] 7.2.1: Create prompt-builder.ts with guideline compliance
- [ ] 7.2.2: Implement prompt validation and formatting
- [ ] 7.2.3: Add prompt templates for each tool type

### [ ] Task 7.3: UI Polish & Accessibility
> References: requirements.md NFR-3, NFR-6, NFR-7; design.md §4
> Must Read: Re-read these references before implementing any subtask.
- [ ] 7.3.1: Add loading states and progress indicators
- [ ] 7.3.2: Implement ARIA labels and keyboard navigation
- [ ] 7.3.3: Ensure responsive design across screen sizes

### [ ] Task 7.4: End-to-End Testing
> References: All FR and NFR requirements
> Must Read: Re-read these references before implementing any subtask.
- [ ] 7.4.1: Test all four video tools with sample inputs
- [ ] 7.4.2: Verify gallery asset consistency across scenes
- [ ] 7.4.3: Validate prompt generation and copy functionality
- [ ] 7.4.4: Test error handling and edge cases

## Success Criteria
- All four video tools accessible from main interface
- Gallery system generates and manages assets consistently
- Scene prompts include gallery tags for asset references
- All tools support single/multiple scene generation
- Prompts follow guidelines from Prompt-resourch-for-video.md
- Gemini 2.0 Flash Preview integrated for all image generation
- Copy functionality works for all prompt outputs
- UI is responsive and accessible
