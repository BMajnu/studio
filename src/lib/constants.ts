
import type { UserProfile } from './types';

export const DEFAULT_USER_ID = 'default-user';

export const AVAILABLE_MODELS = [
  { id: 'googleai/gemini-1.5-flash-latest', name: 'Gemini 1.5 Flash (Latest)' },
  { id: 'googleai/gemini-1.5-pro-latest', name: 'Gemini 1.5 Pro (Latest)' },
  { id: 'googleai/gemini-pro', name: 'Gemini 1.0 Pro' },
  // Add other models here as they become available or relevant
];
export const DEFAULT_MODEL_ID = 'googleai/gemini-1.5-flash-latest';


export const DEFAULT_USER_PROFILE: UserProfile = {
  userId: DEFAULT_USER_ID,
  name: "B. Majnu",
  professionalTitle: "Professional Graphic Designer",
  yearsOfExperience: 6,
  portfolioLink: "fiverr.com/majnu786",
  communicationStyleNotes: "friendly, reliable, professional, enthusiastic",
  services: [
    "🎽 T-Shirt and Hoodie Designs",
    "☕️ Mug Designs",
    "🌟 Logo Design & Brand Guidelines",
    "📇 Business Cards & Stationery",
    "📢 Flyers & Web Banners, YouTube Ads",
    "🖼 Portrait Drawing, Line Art, Vintage Drawings",
    "🎨 Cartoon Characters, Coloring Book Art, Sticker Designs",
    "✍️ Word Cloud Art & Typography",
    "🤖 AI-Generated Images, Artwork, and Guidelines",
    "📚 Book Cover Design",
    "🛍 Product Listing for POD Businesses",
    "🏷 Product Label and Box Design",
    "📸 Photo Editing/Retouching & Photo Manipulation",
    "🔍 Vector Tracing (Vectorizing) and Image Upscaling",
    "🎬 YouTube or Video Thumbnail Design",
    "...and so much more!"
  ],
  fiverrUsername: "majnu786",
  geminiApiKey: "",
  selectedGenkitModelId: DEFAULT_MODEL_ID,
  customSellerFeedbackTemplate: "Great client, outstanding experience, easy requirement. [AI to suggest adding a short description about the project/order]. I love working with you and looking forward to working with you again🥰.",
  customClientFeedbackResponseTemplate: "Thanks for your great feedback. I hope we will continue doing more and more.",
  rawPersonalStatement: "I'm B. Majnu, a professional Graphic designer. I have over 6 years of experience in Graphics Design. I enjoy working on it. I'm a skilled graphic designer and offer unique, creative, and eye-catching T-shirt design as well as professional logo design, mug design, vector tracing, book cover design, business card design, etc. I am a full-time seller exclusively on Fiverr. I'm passionate about my craft, and I'm dedicated to providing high-quality work to satisfaction. Fiverr profile: www.fiverr.com/majnu786. I have 1k+ overall 5* customer feedback with 1.5k+ successfully completed orders.",
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

export const APP_FEATURES_GUIDE = `
## Welcome to DesAInR!

Your AI-powered assistant for graphic design tasks. Here's a quick guide to the features:

### Core AI Actions

These buttons trigger AI processing based on the client message you input:

1.  **Chat (Default Process Client Message):**
    *   Analyzes the client's request considering conversation history.
    *   Simplifies the client's current needs.
    *   Outlines a step-by-step approach for the design task.
    *   Provides a Bengali translation of the analysis, simplification, and steps.
    *   Suggests two professional English replies tailored to your profile and the conversation.

2.  **Requirements:**
    *   Identifies and analyzes main requirements from the client's message and attachments.
    *   Provides a detailed breakdown of all requirements in English, specifying priority and reasoning.
    *   Provides a similar detailed breakdown in Bangla.
    *   Identifies any specific message or saying for the design.

3.  **Brief (Generate Engagement Pack):**
    *   Analyzes the client's request and history.
    *   Generates a personalized introduction for you (the designer) based on your profile and tailored to the client's specific request.
    *   Crafts a professional reply to the client.
    *   Suggests a competitive budget and timeline.
    *   Recommends software for the task.
    *   Provides clarifying questions to ask the client to get started.

4.  **Generate Delivery Message:**
    *   Prompts for delivery notes.
    *   Creates 3 delivery message options for platforms like Fiverr.
    *   Includes automated follow-up content: Thank You message, Seller Feedback template, Client Feedback Response template.

5.  **Generate Revision Message:**
    *   Prompts for revision notes.
    *   Creates 3 revision message options.
    *   Includes automated follow-up content similar to delivery messages.

### User Profile

*   Navigate to **Settings > Profile** to manage your professional details.
*   Your profile information (name, title, services, communication style, raw personal statement, AI Model etc.) is used to personalize AI-generated content.
*   Keep your profile updated for the best results!

### Tips for Use

*   Paste the full client message into the input field, or attach files.
*   Use the action buttons to get specific AI assistance.
*   Generated content can be easily copied using the "Copy" button next to each block.
*   For "Generate Platform..." messages, provide clear notes when prompted.

We hope DesAInR streamlines your workflow and helps you communicate effectively!
`;
