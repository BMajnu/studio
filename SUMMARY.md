## Extension Restore (d888e86)

## Overview
extension/ ফলডরটক নরদষট কমট d888e86 অবসথয় রসটর কর হয়ছ রসটরর আগ বরতমন extension/ ফলডরর একট টইমসটযমপড বযকআপ নওয় হয়ছ

## Completed
- টইমসটযমপড বযকআপ তর: extension-backup-20250829-180758
- git archive + Expand-Archive বযবহর কর d888e86:extension থক পরণ কনটনট একসটরযকট কর হয়ছ
- git ls-tree -r --name-only d888e86:extension দয় যচই: dist/* এব src/*মট ট ফইলবরতমন extension/-এ উপসথত

## Remainings
- এই কমট package.json, ite.config.ts, ব public/manifest.json ছল নতই এগল অনপসথত থকই পরতযশত ভবষযৎ বলডর জনয পরয়জনমত সকরপট/কনফগ পনসযজন করত হত পর

## Findings (Optionals)
- d888e86 কমট extension/ কবলমতর dist/ ও src/ ফইলগল অনতরভকত কর; কন পযকজ/মযনফসট ফইল ছল ন

## Next Steps 
- যদ একসটনশনট রবলড/রলড করত চন, বলড টল (Vite/manifest) পনরয় যগ করর একট পলযন তর করব
- আপনর পরবরত নরদশন অনযয় কজ চলয় যব

## Asking (Optional)
- বযকআপ লকশন (extension-backup-YYYYMMDD-HHMMSS) ঠক আছ ক ন নশচত করবন

## Build Fix & Stubs

## Overview
extension/src/contentScript.ts ফাইলে IIFE-এর (immediately-invoked function expression) শেষ ব্রেস `{}` অনুপস্থিত ছিল—এটা যোগ করে সিনট্যাক্স এরর ঠিক করা হয়েছে। এছাড়া বিল্ডে যে মডিউলগুলো অনুপস্থিত দেখাচ্ছিল সেগুলোর জন্য মিনিমাল স্টাব তৈরি করা হয়েছে।

## Completed
- contentScript.ts-এ মিসিং ক্লোজিং ব্রেস যোগ করে IIFE ঠিক করা হয়েছে।
- `extension/src/selection.ts`: বর্তমান টেক্সট সিলেকশন ও bounding rect রিটার্ন করার জন্য `getSelectionInfo()` যুক্ত করা হয়েছে।
- `extension/src/overlay.ts`: মিনিমাল `mountOverlay(host, onClose)` স্টাব যুক্ত করা হয়েছে যাতে `toggleReactOverlay()` কাজ করতে পারে এবং `detach()` করে আনমাউন্ট করা যায়।

## Remainings
- `npm run build` চালিয়ে dist জেনারেশন ভেরিফাই করতে হবে।
- যদি আরও কোনো মিসিং মডিউল বা টাইপিং ইস্যু আসে, প্রয়োজনমতো স্টাব/ইমপ্লিমেন্টেশন যোগ করা।
- Chrome-এ extension লোড করে টুলবার ও ওভারলে বেসিক ফ্লো টেস্ট।

## Findings (Optionals)
- d888e86 কমিটে `overlay`/`selection` ফাইল ছিল না—তাই বিল্ড টিকিয়ে রাখতে মিনিমাল স্টাব যোগ করা হয়েছে। পরবর্তীতে পূর্ণ ফিচার্ড ওভারলে (React) রিইনট্রোডিউস করা যাবে।

## Next Steps 
- `extension/` ডিরেক্টরিতে `npm run build` চালানো।
- dist আউটপুট ভেরিফাই করা এবং Chrome-এ লোড করে বেসিক ইন্টারঅ্যাকশন চেক।
- প্রয়োজন হলে অতিরিক্ত কনফিগ/স্ক্রিপ্ট (manifest, vite ইত্যাদি) ধাপে ধাপে যোগ করা।

## Asking (Optional)
- স্টাবগুলো (selection/overlay) আপাতত রাখা যাবে তো? পরে চাইলে আগের ফুল-ফিচার্ড ওভারলে UI ও ফ্লো পুনরায় ইন্টিগ্রেট করব।

## Warnings Fixed

## Overview
esbuild IIFE ফর্ম্যাটে `import.meta` কাজ করে না—এই কারণে আসা ওয়ার্নিংগুলো ঠিক করা হয়েছে।

## Completed
- `extension/src/firebaseClient.ts` থেকে `import.meta.env` ব্যবহার বাদ দিয়ে `globalThis` ভিত্তিক `VITE_FIREBASE_*` কী রিড করা হয়েছে (fallback: খালি স্ট্রিং)।
- `npm run build` পুনরায় চালানো হয়েছে—কোনো ওয়ার্নিং ছাড়াই `dist/` জেনারেট হয়েছে।

## Remainings
- রানটাইমে Firebase কনফিগ সরবরাহ করার কৌশল স্থির করা (যেমন: Chrome storage/remote fetch/preload স্ক্রিপ্টে `globalThis.VITE_*` সেট করা)।
- Chrome-এ এক্সটেনশন লোড করে Auth/ID token ফ্লো টেস্ট।

## Next Steps 
- Firebase কনফিগ ইনজেকশন স্ট্র্যাটেজি নিশ্চিত করা ও টেস্ট রান করা।
- প্রয়োজন হলে `manifest.json`/অন্যান্য বিল্ড কনফিগ অ্যাড করা।

## Firebase Config Injection (Extension)

## Overview
`extension/src/config.ts` ফাইলে `FIREBASE_WEB_CONFIG` (ওয়েব ক্লায়েন্ট কনফিগ) যোগ করা হয়েছে এবং `extension/src/firebaseClient.ts` এখন এই কনফিগ ইমপোর্ট করে Firebase অ্যাপ ইনিশিয়ালাইজ করছে। এতে `import.meta` বা `globalThis.VITE_*` নির্ভরতাও আর নেই।

## Completed
- `config.ts` এ `FIREBASE_WEB_CONFIG` যুক্ত: `apiKey`, `authDomain`, `projectId`, `storageBucket`, `messagingSenderId`, `appId` (পাবলিক ওয়েব কনফিগ)।
- `firebaseClient.ts` এ ওই কনফিগ ব্যবহার করে `initializeApp()` কল আপডেট।
- `npm run build` সফল হয়েছে; `dist/` আপডেটেড।

## Remainings
- Chrome-এ extension লোড করে Auth/WebAuthFlow ও ID Token এক্সচেঞ্জ ফ্লো টেস্ট করা।
- `background` লগ দেখে `auth/invalid-api-key` ইস্যু সম্পূর্ণ রিজলভ হয়েছে কি না ভেরিফাই।

## Findings (Optionals)
- স্ট্যাটিক পাবলিক ওয়েব কনফিগ ব্যবহার করা ওয়েব এক্সটেনশনের জন্য গ্রহণযোগ্য। প্রয়োজনে ভবিষ্যতে `chrome.storage`/রিমোট ফেচ/প্রি-লোড স্ক্রিপ্টে কনফিগ ইনজেকশন যোগ করা যাবে।

## Next Steps 
- Chrome → Load unpacked → `extension/dist` লোড → Popup/WebAuthFlow (`/extension/connect`) টেস্ট।
- ব্যর্থ হলে কনফিগ ভ্যালু প্রজেক্টের সাথে মিলে কিনা চেক এবং `APP_BASE_URL` সঠিক টার্গেটে সেট আছে কিনা (বর্তমানে: `https://desainr.vercel.app`).

## Asking (Optional)
- এই Firebase কনফিগ (API key/IDs) কি আপনার প্রোড প্রজেক্টের জন্যই নির্ধারিত? যদি স্টেজিং কনফিগ চান, ভ্যালুগুলো দিন/নির্দেশ করুন।
- `APP_BASE_URL` কি `https://desainr.vercel.app`-ই থাকবে, নাকি লোকাল/স্টেজিং ইউআরএল ব্যবহার করব?
