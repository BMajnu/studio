import type { UserProfile } from './types';

export const DEFAULT_USER_ID = 'default-user';

export const AVAILABLE_MODELS = [
  // 🆕 New Models (Top Priority) - "-latest" models are auto-mapped to valid names
  { id: 'gemini-flash-latest', name: '🆕 Gemini Flash (Latest) ⭐', supportsThinking: true, tag: 'New' },
  { id: 'gemini-2.5-flash', name: '🆕 Gemini 2.5 Flash', supportsThinking: true, tag: 'New' },
  { id: 'gemini-2.5-pro', name: '🆕 Gemini 2.5 Pro', supportsThinking: true, tag: 'New' },
  { id: 'gemini-flash-lite-latest', name: '🆕 Gemini Flash Lite (Latest) ⭐', supportsThinking: true, tag: 'New' },

  // 🎨 Image Generation Models (Designer Lab only - NOT for chat)
  { id: 'gemini-2.0-flash-preview-image-generation', name: '🎨 Gemini 2.0 Flash (Image Gen) ✓', supportsThinking: false, supportsImageGen: true, tag: 'Free', requiresPro: false },
  { id: 'models/imagen-4.0-ultra-generate-001', name: '🎨 Imagen 4.0 Ultra ⭐', supportsThinking: false, supportsImageGen: true, tag: 'Pro', isImagen: true, requiresPro: true },
  { id: 'models/imagen-4.0-generate-001', name: '🎨 Imagen 4.0 ⭐', supportsThinking: false, supportsImageGen: true, tag: 'Pro', isImagen: true, requiresPro: true },
  { id: 'models/imagen-4.0-fast-generate-001', name: '🎨 Imagen 4.0 Fast', supportsThinking: false, supportsImageGen: true, tag: 'Pro', isImagen: true, requiresPro: true },
  { id: 'models/imagen-3.0-generate-002', name: '🎨 Imagen 3.0', supportsThinking: false, supportsImageGen: true, tag: 'Pro', isImagen: true, requiresPro: true },
  { id: 'gemini-2.5-flash-image-preview', name: '🎨 Gemini 2.5 Flash (Image Gen/Edit) ⭐', supportsThinking: false, supportsImageGen: true, tag: 'Pro', requiresPro: true },

  // Most Accurate (Slower)
  { id: 'gemini-1.5-pro', name: 'Gemini 1.5 Pro', supportsThinking: true },
  { id: 'gemini-2.5-pro-preview-05-06', name: 'Gemini 2.5 Pro Preview (05-06)', supportsThinking: true },
  { id: 'gemini-2.0-pro-exp', name: 'Gemini 2.0 Pro Experimental', supportsThinking: false },
  { id: 'gemini-2.5-pro-exp-03-25', name: 'Gemini 2.5 Pro Experimental (03-25)', supportsThinking: true },
  { id: 'gemini-pro', name: 'Gemini 1.0 Pro', supportsThinking: false },

  // Fast (Balanced) – Flash models
  { id: 'gemini-1.5-flash', name: 'Gemini 1.5 Flash', supportsThinking: false },
  { id: 'gemini-2.5-flash-preview-04-17', name: 'Gemini 2.5 Flash Preview (04-17)', supportsThinking: false },
  { id: 'gemini-2.5-flash-preview-05-20', name: 'Gemini 2.5 Flash Preview (05-20)', supportsThinking: true },
  { id: 'gemini-2.0-flash', name: 'Gemini 2.0 Flash', supportsThinking: false },
  

  // Fastest (Lowest Cost) – Flash Lite & Gemma models
  { id: 'gemini-2.0-flash-lite', name: 'Gemini 2.0 Flash Lite', supportsThinking: false },
  { id: 'gemma-3n-e4b', name: 'Gemma 3n E4B', supportsThinking: false },
  { id: 'gemma-3n-e2b', name: 'Gemma 3n E2B', supportsThinking: false },
];

// Image Generation Models - separate reference for image-specific features (NOT shown in chat)
export const IMAGE_GENERATION_MODELS = AVAILABLE_MODELS.filter(m => (m as any).supportsImageGen);

// Chat Models - Only non-image-generation models for chat (excludes image gen models)
export const CHAT_MODELS = AVAILABLE_MODELS.filter(m => !(m as any).supportsImageGen);

// Default model for content generation (NOT for title generation which uses specific lite preview models)
export const DEFAULT_MODEL_ID = 'gemini-flash-latest';


export const DEFAULT_USER_PROFILE: UserProfile = {
  userId: DEFAULT_USER_ID,
  name: "New User",
  professionalTitle: "Graphic Designer",
  yearsOfExperience: 0,
  portfolioLink: "",
  communicationStyleNotes: "friendly, professional",
  services: [
    "🎨 Graphic Design",
    "🌟 Logo Design",
    "📇 Business Cards",
  ],
  fiverrUsername: "",
  geminiApiKeys: [], // Empty by default - users must add their own API key
  selectedGenkitModelId: DEFAULT_MODEL_ID,
  customSellerFeedbackTemplate: "Great client, outstanding experience, easy requirement. [AI to suggest adding a short description about the project/order]. I love working with you and looking forward to working with you again🥰.",
  customClientFeedbackResponseTemplate: "Thanks for your great feedback. I hope we will continue doing more and more.",
  rawPersonalStatement: "",
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

export const APP_FEATURES_GUIDE = `
## Welcome to DesAInR!

Your AI-powered assistant for graphic design tasks. Here's a quick guide to the features:

### Core AI Actions (Buttons above input field)

These buttons trigger AI processing based on the client message you input and any attached files:

1.  **Chat (Default Process Client Message):**
    *   Analyzes the client's request considering conversation history.
    *   Simplifies the client's current needs.
    *   Outlines a step-by-step approach for the design task.
    *   Provides a Bengali translation of the analysis, simplification, and steps.

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

4.  **Design (Dropdown Menu):**
    *   **Idea:**
        *   Analyzes your input (text/saying for design).
        *   Provides simulated web inspiration (example links & snippets).
        *   Generates 5 detailed creative design ideas.
        *   Generates 2 creative typography-focused design ideas.
    *   **Prompt:**
        *   Takes design ideas (from your input or previous "Idea" generation) and converts them into detailed prompts for AI image generation tools.
        *   Optimizes prompts for clarity and effectiveness.
        *   Specifies backgrounds and uses generic design terms.
        *   Outputs each prompt in a copyable code block.

5.  **Delivery (Dropdown Menu):**
    *   **Check Made Designs:**
        *   AI reviews your attached design image based on client requirements (from chat or input message).
        *   Provides detailed feedback in Bangla, categorizing mistakes (wrong objects, positions, typing, colors, sizes, missing elements) and suggesting if changes are "Must Required" or "Optional".
        *   Concludes with an overall summary in Bangla.
        *   **Requires a design image to be attached to the message.**
    *   **Delivery Templates:**
        *   Prompts for delivery notes (number of concepts, etc.).
        *   Generates 3 distinct delivery message options for platforms like Fiverr.
        *   Includes 4 follow-up message templates: Thank You (with/without tip, including your services & portfolio), Seller Feedback, and Client Feedback Response.

6.  **Revision:**
    *   Prompts for revision notes.
    *   Creates 3 revision message options.
    *   Includes the same 4 automated follow-up message templates as "Delivery Templates".

### User Profile

*   Navigate to **Profile** (via header link) to manage your professional details.
*   Your profile information (name, title, services, communication style, raw personal statement, AI Model etc.) is used to personalize AI-generated content.
*   Keep your profile updated for the best results!

### Tips for Use

*   Paste the full client message into the input field, or attach files (drag & drop or use the "Attach Files" button).
*   Use the action buttons to get specific AI assistance.
*   Generated content can be easily copied using the "Copy" button next to each block.
*   For "Delivery Templates" or "Revision" messages, provide clear notes when prompted via the modal.

We hope DesAInR streamlines your workflow and helps you communicate effectively!
`;

export const APP_FEATURES_GUIDE_BN = `
## DesAInR-এ স্বাগতম!

আপনার গ্রাফিক ডিজাইন কাজের জন্য AI-চালিত সহকারী। এখানে ফিচারগুলির একটি দ্রুত গাইড রয়েছে:

### কোর এআই অ্যাকশন (ইনপুট ফিল্ডের উপরের বোতাম)

এই বোতামগুলি আপনার ইনপুট করা ক্লায়েন্টের বার্তা এবং সংযুক্ত ফাইলগুলির উপর ভিত্তি করে এআই প্রসেসিং শুরু করে:

1.  **চ্যাট (ডিফল্ট প্রসেস ক্লায়েন্ট মেসেজ):**
    *   কথোপকথনের ইতিহাস বিবেচনা করে ক্লায়েন্টের অনুরোধ বিশ্লেষণ করে।
    *   ক্লায়েন্টের বর্তমান প্রয়োজনগুলি সহজ করে।
    *   ডিজাইন কাজের জন্য ধাপে ধাপে পদ্ধতির রূপরেখা দেয়।
    *   বিশ্লেষণ, সরলীকরণ এবং পদক্ষেপগুলির বাংলা অনুবাদ প্রদান করে।

2.  **রিকোয়ারমেন্টস:**
    *   ক্লায়েন্টের বার্তা এবং সংযুক্তি থেকে প্রধান প্রয়োজনীয়তাগুলি সনাক্ত এবং বিশ্লেষণ করে।
    *   অগ্রাধিকার এবং যুক্তি উল্লেখ করে ইংরেজিতে সমস্ত প্রয়োজনীয়তার একটি বিস্তারিত বিবরণ প্রদান করে।
    *   বাংলায় একই রকম বিস্তারিত বিবরণ প্রদান করে।
    *   ডিজাইনের জন্য কোনও নির্দিষ্ট বার্তা বা উক্তি সনাক্ত করে।

3.  **ব্রিফ (এনগেজমেন্ট প্যাক তৈরি করুন):**
    *   ক্লায়েন্টের অনুরোধ এবং ইতিহাস বিশ্লেষণ করে।
    *   আপনার প্রোফাইলের উপর ভিত্তি করে এবং ক্লায়েন্টের নির্দিষ্ট অনুরোধের সাথে সঙ্গতি রেখে আপনার (ডিজাইনার) জন্য একটি ব্যক্তিগতকৃত ভূমিকা তৈরি করে।
    *   ক্লায়েন্টের জন্য একটি পেশাদার উত্তর তৈরি করে।
    *   একটি প্রতিযোগিতামূলক বাজেট এবং সময়রেখার পরামর্শ দেয়।
    *   কাজের জন্য সফটওয়্যার সুপারিশ করে।
    *   কাজ শুরু করার জন্য ক্লায়েন্টকে জিজ্ঞাসা করার জন্য স্পষ্ট প্রশ্ন সরবরাহ করে।

4.  **ডিজাইন (ড্রপডাউন মেনু):**
    *   **আইডিয়া:**
        *   আপনার ইনপুট (ডিজাইনের জন্য টেক্সট/উক্তি) বিশ্লেষণ করে।
        *   অনুপ্রেরণার জন্য সিমুলেটেড ওয়েব ফলাফল (উদাহরণ লিঙ্ক এবং স্নিপেট) প্রদান করে।
        *   ৫টি বিস্তারিত সৃজনশীল ডিজাইন আইডিয়া তৈরি করে।
        *   ২টি সৃজনশীল টাইপোগ্রাফি-কেন্দ্রিক ডিজাইন আইডিয়া তৈরি করে।
    *   **প্রম্পট:**
        *   ডিজাইন আইডিয়াগুলিকে (আপনার ইনপুট বা পূর্ববর্তী "আইডিয়া" জেনারেশন থেকে) এআই ইমেজ জেনারেশন সরঞ্জামগুলির জন্য বিস্তারিত প্রম্পটে রূপান্তর করে।
        *   স্পষ্টতা এবং কার্যকারিতার জন্য প্রম্পটগুলি অপ্টিমাইজ করে।
        *   পটভূমি নির্দিষ্ট করে এবং জেনেরিক ডিজাইন শব্দ ব্যবহার করে।
        *   প্রতিটি প্রম্পট একটি অনুলিপিযোগ্য কোড ব্লকে আউটপুট করে।

5.  **ডেলিভারি (ড্রপডাউন মেনু):**
    *   **চেক মেইড ডিজাইন:**
        *   ক্লায়েন্টের প্রয়োজনীয়তার উপর ভিত্তি করে (চ্যাট বা ইনপুট বার্তা থেকে) আপনার সংযুক্ত ডিজাইন চিত্র এআই পর্যালোচনা করে।
        *   বাংলায় বিস্তারিত প্রতিক্রিয়া প্রদান করে, ভুলগুলি শ্রেণীবদ্ধ করে (ভুল অবজেক্ট, অবস্থান, টাইপিং, রঙ, আকার, অনুপস্থিত উপাদান) এবং পরিবর্তনগুলি "অবশ্যই প্রয়োজনীয়" বা "ঐচ্ছিক" কিনা তা প্রস্তাব করে।
        *   বাংলায় একটি সামগ্রিক সারাংশ দিয়ে শেষ করে।
        *   **বার্তায় একটি ডিজাইন চিত্র সংযুক্ত করা প্রয়োজন।**
    *   **ডেলিভারি টেমপ্লেট:**
        *   ডেলিভারি নোটের জন্য অনুরোধ করে (ধারণার সংখ্যা, ইত্যাদি)।
        *   Fiverr-এর মতো প্ল্যাটফর্মের জন্য ৩টি স্বতন্ত্র ডেলিভারি বার্তা বিকল্প তৈরি করে।
        *   ৪টি ফলো-আপ বার্তা টেমপ্লেট অন্তর্ভুক্ত করে: ধন্যবাদ (টিপ সহ/ছাড়া, আপনার পরিষেবা এবং পোর্টফোলিও সহ), বিক্রেতার প্রতিক্রিয়া এবং ক্লায়েন্টের প্রতিক্রিয়া।

6.  **রিভিশন:**
    *   রিভিশন নোটের জন্য অনুরোধ করে।
    *   ৩টি রিভিশন বার্তা বিকল্প তৈরি করে।
    *   "ডেলিভারি টেমপ্লেট"-এর মতো একই ৪টি স্বয়ংক্রিয় ফলো-আপ বার্তা টেমপ্লেট অন্তর্ভুক্ত করে।

### ব্যবহারকারীর প্রোফাইল

*   আপনার পেশাদার বিবরণ পরিচালনা করতে **প্রোফাইল**-এ নেভিগেট করুন (হেডার লিঙ্কের মাধ্যমে)।
*   আপনার প্রোফাইল তথ্য (নাম, শিরোনাম, পরিষেবা, যোগাযোগের স্টাইল, কাঁচা ব্যক্তিগত বিবৃতি, এআই মডেল ইত্যাদি) এআই-উত্পন্ন সামগ্রী ব্যক্তিগতকৃত করতে ব্যবহৃত হয়।
*   সেরা ফলাফলের জন্য আপনার প্রোফাইল আপডেট রাখুন!

### ব্যবহারের জন্য টিপস

*   ইনপুট ফিল্ডে সম্পূর্ণ ক্লায়েন্ট বার্তাটি পেস্ট করুন, অথবা ফাইল সংযুক্ত করুন (টেনে এনে ড্রপ করুন বা "ফাইল সংযুক্ত করুন" বোতামটি ব্যবহার করুন)।
*   নির্দিষ্ট এআই সহায়তার জন্য অ্যাকশন বোতামগুলি ব্যবহার করুন।
*   উত্পন্ন সামগ্রী প্রতিটি ব্লকের পাশের "অনুলিপি" বোতামটি ব্যবহার করে সহজেই অনুলিপি করা যায়।
*   "ডেলিভারি টেমপ্লেট" বা "রিভিশন" বার্তাগুলির জন্য, মোডালের মাধ্যমে অনুরোধ করা হলে স্পষ্ট নোট সরবরাহ করুন।

আমরা আশা করি DesAInR আপনার ওয়ার্কফ্লোকে সহজ করবে এবং আপনাকে কার্যকরভাবে যোগাযোগ করতে সাহায্য করবে!
`;

// Feature flags
export const ENABLE_GEMINI_IMAGE_GEN = process.env.ENABLE_GEMINI_IMAGE_GEN === 'true';
