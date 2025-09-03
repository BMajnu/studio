## Refine Popup & Toolbar Enhancements
 
 ## Overview
 বর্তমান ফোকাস: এক্সটেনশন সাইন-ইন রিডাইরেক্ট করা `/login` রুটে 404 সমস্যা সমাধান।

  - `studio/src/app/login/page.tsx` রুটটি তৈরি/নিশ্চিতকরণ।
  - Next.js ডেভ সার্ভার রিস্টার্ট করে নতুন রুট পিক-আপ নিশ্চিতকরণ।
  - এক্সটেনশন পপআপের Sign in বাটন থেকে `/login` ওপেন ও সফল লগইন ভেরিফাই।
  - প্রয়োজন হলে `?next=` কুয়েরি সাপোর্ট করে সফল লগইনের পর রিডাইরেক্ট।
 
 ## Plan
 ### Phase 1: Routing Fix

 #### Task 1.1: Create `/login` Page
 - Requirement: App Router-এ স্ট্যান্ডঅ্যালোন `/login` পেজ; `?next=` সাপোর্ট; `LoginForm` ব্যবহার; সাকসেসে রিডাইরেক্ট।
 - Design: `studio/src/app/login/page.tsx` client পেজ; `useSearchParams` দিয়ে `next` পড়া; `useRouter.push(next||'/')`।
 - Subtasks (Plan):
   - [x] 1.1.1: `studio/src/app/login/page.tsx` তৈরি (client) + heading/description।
   - [x] 1.1.2: `?next=` পড়ে সাকসেসে রিডাইরেক্ট।
   - [ ] 1.1.3: বেসিক UI copy/style টিউন (ঐচ্ছিক)।

 #### Task 1.2: Dev Server Recognition
 - Requirement: ডেভ সার্ভার নতুন রুট পিক-আপ করে; `/login` আর 404 নয়।
 - Design: Next dev রিস্টার্ট; `.next/server/app-paths-manifest.json` এ `/login` এন্ট্রি চেক।
 - Subtasks (Plan):
   - [ ] 1.2.1: Dev সার্ভার রিস্টার্ট (পোর্ট 9003/9010 কনফিগ মাফিক)।
   - [ ] 1.2.2: `/login` ডাইরেক্ট অ্যাক্সেস ভেরিফাই + ম্যানিফেস্ট এন্ট্রি কনফার্ম।

 ### Phase 2: Integration

 #### Task 2.1: Extension Redirect E2E
 - Requirement: পপআপ Sign in → `${base}/login` ট্যাব ওপেন; সাকসেসে হোম/`next` ফিরে আসে।
 - Design: `chrome.tabs.create`; সাইন-ইন শেষে `router.push(nextOrRoot)`।
 - Subtasks (Plan):
   - [ ] 2.1.1: Popup বাটন টেস্ট (নতুন ট্যাব `/login`)।
   - [ ] 2.1.2: E2E সাইন-ইন স্মোক টেস্ট।

 #### Task 2.2: Optional Safe Redirect
 - Requirement: `next` শুধুমাত্র ইন-অ্যাপ পথ (leading `/`) হলে গ্রহণযোগ্য।
 - Design: পেজে লাইটওয়েট ভ্যালিডেশন; এক্সটার্নাল URL ব্লক।
 - Subtasks (Plan):
   - [ ] 2.2.1: `next` ভ্যালিডেশন/স্যানিটাইজ যোগ।

  ## Completed
   - **কনটেক্সট মেনু ও টুলবারে পিন UX ফাইনালাইজ**:
   - `MonicaStyleContextMenu.ts`: "Copy Selection" অ্যাকশন রিমুভ, পিন টগল আইকনকে পূর্বের memo (Heroicons) আইকনে রিপ্লেস, সর্বোচ্চ পিন লিমিট ৪ → ৯ করা; ডিফল্ট পিনড ৪ থাকবে।
   - `MonicaStyleToolbar.ts`: টুলবার ৯ পর্যন্ত পার্সিস্ট/লোড হ্যান্ডেল করবে; UI রো-তে ডিফল্ট ৪ দেখাবে; পিন আইকন কেবল পিনড হলে দেখাবে।
   - **স্টোরেজ/মেসেজিং ফ্লো ভ্যালিডেশন**:
   - `chrome.storage.sync` কী `'desainr.pinnedActions'`; `SAVE_PINNED_ACTIONS` ব্রডকাস্ট কাজ করে।
   - কনটেক্সট মেনু টগল → স্টোর আপডেট → টুলবার রিফ্রেশ।
   - **MagicInput চালু**:
   - উদ্দেশ্য—memo আইকন/pin limit ৯ UX/toolbar icon visibility বিষয়ে ফাইনাল কনফার্মেশন সংগ্রহ।
   - কনফার্মেশনের ভিত্তিতে ছোটখাটো polish fix → রিবিল্ড (Vite) → Chrome-এ রিলোড।
   - **ক্রস-সাইট QA**:
   - Gmail, Google Docs (iframe), News, GitHub—zoom/theme ভ্যারিয়েশনে।
   - **পার্সিস্টেন্স/ব্রডকাস্টিং ভ্যালিডেশন**:
   - `chrome.storage.sync` কোটায় সেফ; পেজ রিলোড/নতুন ট্যাবে স্টেট পার্সিস্টেন্স ঠিক আছে।
   - **অর্ডার সেম্যান্টিক্স**:
   - পিনড রেন্ডার বেস লিস্টের অর্ডার মেইনটেইন।
   - **টুলবার ভিজিবিলিটি রুল**:
   - টুলবার রো-তে পিন আইকন শুধুমাত্র পিনড হলে দেখা যাচ্ছে কিনা ভেরিফাই।
   - `MonicaStyleOverlay.tsx`: React-based চ্যাট ইন্টারফেস (মডেল সিলেক্টর, কুইক সাজেশন, গ্রেডিয়েন্ট ডিজাইন)
   - `MonicaStyleToolbar.ts`: সিলেকশন টুলবার (কমপ্যাক্ট, ফিচার্ড অ্যাকশন, হোভার ইফেক্ট)
 - **contentScript.ts ইন্টিগ্রেশন**:
   - নতুন Monica-স্টাইল টোস্ট সিস্টেম (আইকন, কালার কোডিং, স্মুথ অ্যানিমেশন)
   - Monica-স্টাইল Undo/Copy বাটন (গ্রেডিয়েন্ট ব্যাকগ্রাউন্ড, উন্নত ইন্টারঅ্যাকশন)
   - `handleMonicaAction()` ফাংশন সব অ্যাকশন রাউটিং হ্যান্ডল করে
   - কনটেক্সট মেনু ও টুলবার ইভেন্ট ইন্টিগ্রেশন
 - **ডিজাইন এনহান্সমেন্ট**:
   - Monica AI-এর চেয়ে উন্নত ভিজুয়াল হায়ারার্কি
   - ফিচার ক্যাটাগরি (Quick Actions, Content Tools, AI Chat, Advanced)
   - রেসপনসিভ ডিজাইন ও মোবাইল অপটিমাইজেশন
   - ব্রিদিং অ্যানিমেশন ও গ্লো ইফেক্ট
   - সর্বশেষ অথেন্টিকেশন ফ্লো আপডেট:
     - ডেভ সার্ভার চলছে: `http://localhost:9010` (Next.js)। কানেক্ট পেজ `localhost`-এ খুলে দেখুন (127.0.0.1 হলে পেজ নিজে থেকেই `localhost`-এ সুইচ করবে)।
     - এক্সটেনশন পপআপ → সাইন ইন (WebAuthFlow) চালান; উইন্ডোটি অটো গুগল রিডাইরেক্ট নেবে।
     - কাজ না হলে:
       - ক্রোম ডেভটুলস কনসোল (পপআপ) থেকে `Redirect URL:`/`Auth URL:` কপি দিন।
       - `chrome.storage.local.remove('DESAINR_BASE_URL')` চালিয়ে আবার চেষ্টা করুন (স্টোরড 127.0.0.1 প্রেফারেন্স থাকলে ক্লিন হবে)।
       - ক্রোমিয়াম/ক্রোম-এ `accounts.google.com` কুকিজ ব্লক আছে কিনা চেক করুন; ad-blocker/3p cookies ব্লক থাকলে অস্থায়ীভাবে allow করুন।
     - সফল হলে token exchange → Firebase sign-in → `chrome.storage.local` কী (uid/idToken/signedInAt) সেট আছে কিনা নিশ্চিত করুন।
   - ইউজার কনফার্ম করেছেন: WebAuthFlow E2E সফল; লগইন এখন কাজ করছে।
   - `extension/public/manifest.json`: content script `<all_urls>` + `run_at: document_idle`, প্রয়োজনীয় permissions/host_permissions কনফার্ম।
   - `extension/vite.content.config.ts`: IIFE + `inlineDynamicImports: true` নিশ্চিত—overlay ডায়নামিক ইমপোর্ট বান্ডেলে মিশে গেছে।
   - `extension/dist/contentScript.js`: `TOGGLE_OVERLAY` লিসেনার ও `Overlay failed:` ফলব্যাক টেক্সট উপস্থিত; React overlay মাউন্ট কোড বান্ডেলে আছে।
   - `extension/src/contentScript.ts`: `ensureToolbar()`/পিনড অ্যাকশন/মেনু/সিলেকশন ইভেন্ট কোড রিভিউ সম্পন্ন (ডায়াগনস্টিক নোট সংগ্রহ)।
   - PING/PONG হ্যান্ডশেক ইমপ্লিমেন্টেড:
     - `contentScript.ts`: `PING` হ্যান্ডলার `{ ok: true, source: 'content', href }` রেসপন্স করে; `CONTEXT_MENU`/`SAVE_PINNED_ACTIONS` রিসিভ লগ যোগ।
   - Build verification:
     - `extension/dist/contentScript.js`-এ প্রাথমিক `onMessage` লিসেনারে `PING` ও `TOGGLE_OVERLAY (early)` স্ট্রিং দৃশ্যমান—মিনিফায়েড আউটপুটেও হ্যান্ডলার উপস্থিত।
   - সর্বশেষ অথেন্টিকেশন ফ্লো আপডেট:
     - ডেভ সার্ভার চলছে: `http://localhost:9010` (Next.js)। কানেক্ট পেজ `localhost`-এ খুলে দেখুন (127.0.0.1 হলে পেজ নিজে থেকেই `localhost`-এ সুইচ করবে)।
     - এক্সটেনশন পপআপ → সাইন ইন (WebAuthFlow) চালান; উইন্ডোটি অটো গুগল রিডাইরেক্ট নেবে।
     - কাজ না হলে:
       - ক্রোম ডেভটুলস কনসোল (পপআপ) থেকে `Redirect URL:`/`Auth URL:` কপি দিন।
       - `chrome.storage.local.remove('DESAINR_BASE_URL')` চালিয়ে আবার চেষ্টা করুন (স্টোরড 127.0.0.1 প্রেফারেন্স থাকলে ক্লিন হবে)।
       - ক্রোমিয়াম/ক্রোম-এ `accounts.google.com` কুকিজ ব্লক আছে কিনা চেক করুন; ad-blocker/3p cookies ব্লক থাকলে অস্থায়ীভাবে allow করুন।
     - সফল হলে token exchange → Firebase sign-in → `chrome.storage.local` কী (uid/idToken/signedInAt) সেট আছে কিনা নিশ্চিত করুন।
   - ইউজার কনফার্ম করেছেন: WebAuthFlow E2E সফল; লগইন এখন কাজ করছে।
   - `extension/public/manifest.json`: content script `<all_urls>` + `run_at: document_idle`, প্রয়োজনীয় permissions/host_permissions কনফার্ম।
   - `extension/vite.content.config.ts`: IIFE + `inlineDynamicImports: true` নিশ্চিত—overlay ডায়নামিক ইমপোর্ট বান্ডেলে মিশে গেছে।
   - `extension/dist/contentScript.js`: `TOGGLE_OVERLAY` লিসেনার ও `Overlay failed:` ফলব্যাক টেক্সট উপস্থিত; React overlay মাউন্ট কোড বান্ডেলে আছে।
   - `extension/src/contentScript.ts`: `ensureToolbar()`/পিনড অ্যাকশন/মেনু/সিলেকশন ইভেন্ট কোড রিভিউ সম্পন্ন (ডায়াগনস্টিক নোট সংগ্রহ)।
   - PING/PONG হ্যান্ডশেক ইমপ্লিমেন্টেড:
     - `contentScript.ts`: `PING` হ্যান্ডলার `{ ok: true, source: 'content', href }` রেসপন্স করে; `CONTEXT_MENU`/`SAVE_PINNED_ACTIONS` রিসিভ লগ যোগ।
   - Build verification:
     - `extension/dist/contentScript.js`-এ প্রাথমিক `onMessage` লিসেনারে `PING` ও `TOGGLE_OVERLAY (early)` স্ট্রিং দৃশ্যমান—মিনিফায়েড আউটপুটেও হ্যান্ডলার উপস্থিত।
   - সর্বশেষ অথেন্টিকেশন ফ্লো আপডেট:
     - ডেভ সার্ভার চলছে: `http://localhost:9010` (Next.js)। কানেক্ট পেজ `localhost`-এ খুলে দেখুন (127.0.0.1 হলে পেজ নিজে থেকেই `localhost`-এ সুইচ করবে)।
     - এক্সটেনশন পপআপ → সাইন ইন (WebAuthFlow) চালান; উইন্ডোটি অটো গুগল রিডাইরেক্ট নেবে।
     - কাজ না হলে:
       - ক্রোম ডেভটুলস কনসোল (পপআপ) থেকে `Redirect URL:`/`Auth URL:` কপি দিন।
       - `chrome.storage.local.remove('DESAINR_BASE_URL')` চালিয়ে আবার চেষ্টা করুন (স্টোরড 127.0.0.1 প্রেফারেন্স থাকলে ক্লিন হবে)।
       - ক্রোমিয়াম/ক্রোম-এ `accounts.google.com` কুকিজ ব্লক আছে কিনা চেক করুন; ad-blocker/3p cookies ব্লক থাকলে অস্থায়ীভাবে allow করুন।
     - সফল হলে token exchange → Firebase sign-in → `chrome.storage.local` কী (uid/idToken/signedInAt) সেট আছে কিনা নিশ্চিত করুন।
   - ইউজার কনফার্ম করেছেন: WebAuthFlow E2E সফল; লগইন এখন কাজ করছে।
   - `extension/public/manifest.json`: content script `<all_urls>` + `run_at: document_idle`, প্রয়োজনীয় permissions/host_permissions কনফার্ম।
   - `extension/vite.content.config.ts`: IIFE + `inlineDynamicImports: true` নিশ্চিত—overlay ডায়নামিক ইমপোর্ট বান্ডেলে মিশে গেছে।
   - `extension/dist/contentScript.js`: `TOGGLE_OVERLAY` লিসেনার ও `Overlay failed:` ফলব্যাক টেক্সট উপস্থিত; React overlay মাউন্ট কোড বান্ডেলে আছে।
   - `extension/src/contentScript.ts`: `ensureToolbar()`/পিনড অ্যাকশন/মেনু/সিলেকশন ইভেন্ট কোড রিভিউ সম্পন্ন (ডায়াগনস্টিক নোট সংগ্রহ)।
   - PING/PONG হ্যান্ডশেক ইমপ্লিমেন্টেড:
     - `contentScript.ts`: `PING` হ্যান্ডলার `{ ok: true, source: 'content', href }` রেসপন্স করে; `CONTEXT_MENU`/`SAVE_PINNED_ACTIONS` রিসিভ লগ যোগ।
   - Build verification:
     - `extension/dist/contentScript.js`-এ প্রাথমিক `onMessage` লিসেনারে `PING` ও `TOGGLE_OVERLAY (early)` স্ট্রিং দৃশ্যমান—মিনিফায়েড আউটপুটেও হ্যান্ডলার উপস্থিত।

  - 🐛 **Hover Misalignment Fix:** `.toolbar-action:hover`/`.more-button:hover` থেকে translateY সরানো; `.action-icon` flex-center করে dot/আইকন সেন্টার নিশ্চিত
  - 🛠️ **Context Menu Fullscreen Fix:** `.monica-menu` base CSS (position: fixed, min/max size, shadow, pointer-events: auto) যোগ; এখন `More` বাটনের নিচে অ্যাঙ্কর হয়
  - 🔄 **Rebuild:** dist/contentScript.js (321.40 kB)
  - ✅ **Decision (MagicInput):** Vertical scrollbar — Option A (মিনিমাল থিমড) রাখব।
  - ✅ **User Check:** Context menu anchoring/overflow — "it's fine" (এখন কোনো পরিবর্তন দরকার নেই)।
  - ✅ **Design Choice:** Icons/Fonts — "do what best match with our design" → আপাতত বর্তমান Inter + বিদ্যমান আইকন সেট রাখছি; চাইলে Heroicons Outline/Rubik/Poppins-এ সুইচ করব।
  - 🎨 **Toolbar/Context Menu Icon Refresh:** সব অ্যাকশন আইকনকে Heroicons outline স্টাইলে আপডেট (via `FeatureIcons`); stroke-ভিত্তিক SVG রেন্ডারিং টিউন করা হয়েছে।
  - • **More বাটন:** টেক্সট গ্লিফ (⋯) বাদ দিয়ে SVG তিন-ডট ব্যবহার — 24px সার্কুলার বাটনে পারফেক্ট সেন্টারিং নিশ্চিত।
  - 🧭 **Scrollbar:** মিনিমাল থিমড স্ক্রলবার বজায় রাখা হয়েছে (Option A)।
  - ✨ **Polish:** subtle hover/active ট্রানজিশন, বর্ডার/শ্যাডো ফাইন-টিউন, label hidden icon-only কমপ্যাক্ট লেআউট।
  - 🔹 **Context Menu Density Tweak:** মেনুর ভিজুয়াল ডেনসিটি হালকা টাইট — আইকন 16→15px, item gap/padding সামান্য কমানো, shortcut pill padding কমানো, এবং overall font-size ~0.95em।
  - 📌 **Pin/Unpin Implementation:**
    - `extension/src/ui/MonicaStyleContextMenu.ts`: প্রতিটি আইটেমে `button.item-pin` (hover/focus স্টাইল সহ) যোগ; পিন টগল করলে `chrome.storage.sync`-এ `'desainr.pinnedActions'` আপডেট হয় এবং `chrome.runtime.sendMessage({ type: 'SAVE_PINNED_ACTIONS', pinnedIds })` ব্রডকাস্ট করে।
    - সর্বোচ্চ 4টি পিন সীমা এনফোর্সড (মেনুতে অতিরিক্ত পিন টগলে নো-অপ; UI সাবটল ফিডব্যাক পরে যোগ করা যাবে)।
    - `extension/src/ui/MonicaStyleToolbar.ts`: কনটেক্সট মেনুর `DefaultActions` থেকে ফুল লিস্ট ব্যবহার; `SAVE_PINNED_ACTIONS` লিসেন করে রি-রেন্ডার; `chrome.storage.sync` থেকে পিনড আইডি লোড করে মূল অর্ডারে সর্বোচ্চ 4টি পিনড অ্যাকশন দেখায়; ফ্যালব্যাক ডিফল্ট: `refine, translate, rewrite, explain`।
  - 🔖 **Pin Icon Polish (Context Menu):**
    - `extension/src/ui/MonicaStyleContextMenu.ts`: পিন টগল আইকনকে `FeatureIcons.memo` (Heroicons) এ সুইচ করা হয়েছে।
    - আইকন সাইজ/স্ট্রোক বিদ্যমান স্টাইলেই কনসিস্টেন্ট রাখা হয়েছে।
  - ✅ **Action Removal:** `Copy Selection (id: copy)` অ্যাকশন `DefaultActions` থেকে রিমুভ।
  - ✅ **Pin Limit:** `maxPinned` ৪ → ৯ করা হয়েছে; টগল লজিক পূর্বের মতো পার্সিস্ট/ব্রডকাস্ট করে।
  - ✅ **Toolbar Compatibility:** টুলবারে ৯ পর্যন্ত পিনড লোড/সিঙ্ক; রো-ডিসপ্লে ডিফল্ট ৪ বজায়; পিন আইকন কেবল পিনড হলে দেখায়।
  - 🎯 **Pin Button Size Adjust:**
    - `extension/src/ui/MonicaStyleContextMenu.ts`: `.item-pin` বাটনের সাইজ 20×20 → 24×24 করা হয়েছে, যাতে অন্যান্য বাটনের (toolbar/more) সাথে কনসিস্টেন্ট থাকে।
    - ভিতরের SVG (memo) 16×16; stroke-width 1.75 — Heroicons outline স্টাইলে কনসিস্টেন্ট।
  - ✅ **Pin Icon Visual State & A11y:**
    - কনটেক্সট মেনুতে পিন আইকনে pinned হলে filled state দেখায় (SVG-তে `class="filled"` টগল); unpinned হলে outline।
    - `button.item-pin`-এ `aria-pressed` (true/false) সেট করা হয়েছে—অ্যাক্সেসিবিলিটি উন্নয়ন।
  - ✅ **Toolbar Visible Buttons → 10:**
    - `MonicaStyleToolbar.ts`: টুলবার এখন সর্বোচ্চ ১০টি pinned অ্যাকশন দেখাবে (স্টোরেজ-অর্ডার অনুযায়ী)। পিন লিমিট অপরিবর্তিত: ৯।
    - `chrome.storage.onChanged` লিসেনার যোগ—পিন পরিবর্তন সাথে সাথে রিফ্রেশ হবে; অর্ডার `desainr.pinnedActions` অনুযায়ী রেন্ডার।
  - ✅ **Toolbar Persistence Fix (Popup stays open):**
    - `extension/src/ui/MonicaStyleToolbar.ts`: অ্যাকশন ক্লিকে `this.hide()` কল রিমুভ করা হয়েছে (toolbar আর প্রিম্যাচিউর ক্লোজ হবে না)।
    - `More` মেনু থেকে অ্যাকশন সিলেক্ট করলে toolbar হাইড করা হবে না; কেবল context menu নিজে হাইড হবে।
    - Outside-click হ্যান্ডলার এখন `#desainr-result-popup`-এর ভেতরের ক্লিক ইগনোর করে—পপআপে ইন্টার‍্যাক্ট করলে toolbar/popup স্থির থাকে।

  ## Remainings
  - [ ] Toolbar ১০-আইটেম লেআউট: ছোট ভিউপোর্ট/লোয়ার জুমে ওভারফ্লো/ক্লিপিং QA
  - [ ] Popup QA: সব অ্যাকশন—'Working…' → ফলাফল/এরর, Replace/Copy আচরণ সঠিক কিনা; toolbar/popup কি এখন স্থিতিশীল থাকছে?
  - [ ] Error/timeout UX: concise কপি-যোগ্য মেসেজ; Replace বাটনে গার্ড (এরর টেক্সট রিপ্লেস প্রতিরোধ)
  - [ ] Cross-site: Docs/Gmail/News/GitHub + RTL/zoom থিমে পজিশন বাউন্ডিং
  - [ ] Pin icon clarity: 90–125% zoom + Light/Dark; `.item-pin` 24×24 + SVG 16px যাচাই
  - [ ] A11y: keyboard nav (Tab/Enter/Escape), focus ring, aria-pressed
  - [ ] Broadcast/persistence: `SAVE_PINNED_ACTIONS` path + storage sync quota
  - [ ] Analyze আইকন cube (Heroicons) কনসিস্টেন্সি ভেরিফিকেশন
  - [ ] "Extension context invalidated" রুট-কজ ট্রায়াজ: background lifecycle, messaging, import chunk availability
  
  ## Next Steps
  1. MagicInput চালু (এখন): সকল টুলবার অ্যাকশনের স্প্লিট-পপআপ/স্টেবিলিটি/এরর-রিপোর্ট সম্পর্কে ইউজার ফিডব্যাক সংগ্রহ।
     - রিপোর্ট করুন: কোন বাটন কাজ করেছে/করেনি (Refine/Translate/Rewrite/Expand/Correct/Explain/Analyze)
     - পপআপ কি ওপেন থেকেছে নাকি টুলবার অপ্রত্যাশিতভাবে ক্লোজ হয়েছে?
     - "Working…" দেখিয়েছে কি? ফলাফল/এরর টেক্সট কী ছিল?
     - Console error/log থাকলে কপি দিন
     - পেজ URL + সাইট টাইপ, জুম %, থিম; সিলেকশনের আনুমানিক দৈর্ঘ্য
     - রিপ্রো স্টেপস সংক্ষেপে
     - Network ট্যাবে রিকোয়েস্ট ফায়ার হয়েছে কি? (যদি Refine কাজ করে, কিন্তু অন্যগুলো না হয়)
  2. রিপোর্টেড ইস্যুগুলো রিপ্রোডিউস → ফিক্স → রিবিল্ড (Vite) → Chrome-এ রিলোড।
  3. Cross-site QA + থিম/জুম ভ্যারিয়েশন + পার্সিস্টেন্স ভ্যালিডেশন।

  ## Asking (Optional)
  - স্প্লিট-পপআপ: Replace কি সম্পূর্ণ সিলেকশন রিপ্লেস করবে? লিডিং/ট্রেইলিং whitespace কি ট্রিম করব? (পছন্দ জানান)
  - Translate/Rewrite/Explain/Correct/Expand ফলাফল—ডান প্যানেলে শিরোনাম/লেবেলিং কেমন লাগছে? (পরিবর্তন চাইলে লিখুন)
  - সর্বোচ্চ পিন লিমিট ৯—কনফার্ম? ডিফল্ট pinned ৪ থাকবে। (Yes/No)
  - Analyze আইকন cube (Heroicons) ঠিক আছে? (Yes/No)
  - "Extension context invalidated" এরর কি এখনও দেখছেন? কোন অ্যাকশনে/কোন পেজে ঘটছে, এবং কনসোলে অতিরিক্ত লগ আছে কি?
  - কোনো misalignment/overflow/contrast ইস্যু দেখলে পেজ নাম + জুম + থিম উল্লেখ করুন।
 
 নোট (কনফার্মড):
 - Extension ID: `eegcjohemdmfmpchimblddocnhpfkgce`
 - Firebase Authorized domains: `localhost`, `127.0.0.1`, `desainr.vercel.app`, `eegcjohemdmfmpchimblddocnhpfkgce.chromiumapp.org`
