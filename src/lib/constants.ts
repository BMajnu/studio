import type { UserProfile } from './types';

export const DEFAULT_USER_ID = 'default-user';

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
  customSellerFeedbackTemplate: "Great client, outstanding experience, easy requirement. [AI to suggest adding a short description about the project/order]. I love working with you and looking forward to working with you again🥰.",
  customClientFeedbackResponseTemplate: "Thanks for your great feedback. I hope we will continue doing more and more.",
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

export const APP_FEATURES_GUIDE = `
## Welcome to DesAInR!

Your AI-powered assistant for graphic design tasks. Here's a quick guide to the features:

### Core AI Actions

These buttons trigger AI processing based on the client message you input:

1.  **Process Client Message (Default):**
    *   Analyzes the client's request.
    *   Simplifies the client's needs.
    *   Outlines a step-by-step approach for the design task.
    *   Provides a Bengali translation of the analysis, simplification, and steps.
    *   Suggests two professional English replies tailored to your profile.

2.  **Analyze & Plan Request:**
    *   Focuses on in-depth analysis, simplification, and a step-by-step plan.
    *   Includes Bengali translation of these elements.

3.  **Suggest Client Replies:**
    *   Generates two professional English replies based on the client's message and your profile.

4.  **Suggest Client Replies (with Translation):**
    *   Generates two English replies and their Bengali translations.

5.  **Generate Platform Delivery Message:**
    *   Prompts for delivery notes.
    *   Creates 3 delivery message options for platforms like Fiverr.
    *   Includes automated follow-up content: Thank You message, Seller Feedback template, Client Feedback Response template.

6.  **Generate Platform Revision Message:**
    *   Prompts for revision notes.
    *   Creates 3 revision message options.
    *   Includes automated follow-up content similar to delivery messages.

### User Profile

*   Navigate to **Settings > Profile** to manage your professional details.
*   Your profile information (name, title, services, communication style, etc.) is used to personalize AI-generated content.
*   Keep your profile updated for the best results!

### Tips for Use

*   Paste the full client message into the input field.
*   Use the action buttons to get specific AI assistance.
*   Generated content can be easily copied using the "Copy" button next to each block.
*   For "Generate Platform..." messages, provide clear notes when prompted.

We hope DesAInR streamlines your workflow and helps you communicate effectively!
`;
