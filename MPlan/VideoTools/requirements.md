# Requirements: Video Tools Expansion

## 1. Goal
Transform the single Video Prompt tool into a comprehensive suite of four specialized video generation tools (Video Prompt, Story/Film Generator, Ads Generator, Viral Video Generator) with enhanced UI/UX featuring scene management, gallery-based asset consistency, and Gemini 2.0 Flash Preview integration for professional video content creation.

## 2. User Stories
- As a content creator, I want to choose between different video generation tools so that I can create content tailored to specific purposes (stories, ads, viral videos).
- As a video producer, I want to manage single or multiple scenes with different prompt formats (Normal, JSON, Scene Image) so that I have precise control over video generation.
- As a marketer, I want to generate consistent characters and assets across scenes so that my videos maintain visual coherence.
- As a storyteller, I want to specify scene numbers and video types (realistic, animation, etc.) so that I can create engaging narratives.
- As an advertiser, I want to input product details and generate compelling ad videos so that I can promote products effectively.
- As a social media creator, I want to target specific audiences for viral content so that I can maximize engagement.
- As a user, I want a gallery system to manage and reuse visual assets so that I can maintain consistency across scenes.

## 3. Functional Requirements (FR)
- FR-1 Tool Selection: Replace single Video Tools button with menu presenting four options: Video Prompt, Story/Film Generator, Ads Generator, Viral Video Generator.
- FR-2 Video Prompt Tool: Support single/multiple scene modes with tabs for Normal Prompt, JSON Prompt, Scene Image (start/end), and Gallery.
- FR-3 Scene Management: Each scene in multiple scene mode displays as list with copy button (code block style) for easy prompt extraction.
- FR-4 Story/Film Generator: Input storyline/idea, scene count (manual or AI-decided), video type (Realistic, Animation, 2D/3D Cartoon, Anime), audio options (speaking characters, storytelling, without audio).
- FR-5 Ads Generator: Three input fields (Product/Service details, Texts/Sayings, storyline/script), supporting single/multiple scene generation.
- FR-6 Viral Video Generator: Input fields for Subjects/Characters, Target Audience groups, storyline/script for TikTok/Shorts/Reels optimization.
- FR-7 Gallery System: Centralized asset management with sub-tabs (characters, subjects, objects, backgrounds) for consistent visual elements.
- FR-8 Asset Generation: Generate button in Gallery to create assets via Gemini 2.0 Flash Preview with prompt and resulting image display.
- FR-9 Multiple Selection: Allow selection from 4 generated image options for each asset type.
- FR-10 External Import: Support replacing gallery assets with user's externally generated images.
- FR-11 Scene Generation: "Generate Scene" button that combines relevant gallery assets with scene prompts for consistent output.
- FR-12 Gallery Tags: Include gallery tags in prompts (e.g., "Character 1", "Background 1") to reference specific assets for scene generation.
- FR-13 Backend Integration: All image generation exclusively uses Gemini 2.0 Flash Preview (Image Gen) model.
- FR-14 Prompt Structure: Follow guidelines from Prompt-resourch-for-video.md for all AI prompt generation.
- FR-15 Copy Functionality: All prompt outputs include copy-to-clipboard functionality with code block styling.

## 4. Non-Functional Requirements (NFR)
- NFR-1 Performance: Tool switching and UI updates respond within 200ms; Gallery asset loading < 1s.
- NFR-2 Consistency: Maintain visual consistency across scenes using gallery assets and proper prompt tagging.
- NFR-3 Usability: Intuitive navigation between tools and scenes; clear visual hierarchy in UI elements.
- NFR-4 Scalability: Support unlimited scenes per project; Gallery handles 100+ assets efficiently.
- NFR-5 Reliability: Graceful error handling for failed generations; retry mechanisms for API calls.
- NFR-6 Accessibility: ARIA labels, keyboard navigation, screen reader support for all interactive elements.
- NFR-7 Responsive Design: Adapt layout for different screen sizes while maintaining functionality.
- NFR-8 Data Persistence: Save gallery assets and project state to prevent loss during session interruptions.
- NFR-9 Professional Output: Generated prompts follow industry-standard video production terminology.
- NFR-10 Extensibility: Architecture supports adding new video tool types and prompt formats in future.
