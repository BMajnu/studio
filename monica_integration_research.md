# Monica-style Browser Extension for DesAInR — Research & Implementation Guide

This document summarizes Monica’s Chrome extension features and maps them to a concrete, staged implementation plan for DesAInR as a separate side app (Chrome/Edge extension), not a direct embedding into the existing designer app. Where relevant, we reference current code in `studio/` and propose new API endpoints and flows.

---

## Executive Summary

- Build a Manifest V3 browser extension for Chrome/Edge that provides Monica-like capabilities to any website via:
  - Selection-based actions (refine/translate/summarize/Custom Prompt) with a floating mini-toolbar.
  - Page-level actions via right-click context menu (Translate Page, Analyze Page, Scrape & Gather Data).
  - A global overlay (hotkey, e.g., Ctrl/Cmd+M) similar to Monica’s on-page panel.
- Reuse your Next.js backend (`studio/src/app/api/*`) and Genkit AI flows (`studio/src/ai/flows/*`) to power all tasks securely. Authenticate with Firebase and enforce per-user rate-limits and quotas.

---

## Monica Extension — Feature Breakdown (from official sources)

References:
- Chrome Web Store: “Monica: ChatGPT AI Assistant | DeepSeek, GPT-4o, Claude 3.5, o1 & More” (`ofpnmcalabcbjgholdjcjblkibolbppb`)
- Website: https://monica.im/home

Key capabilities we should target first for DesAInR parity:

- Chat & Multi‑Model
  - Multiple LLMs in one place; global hotkey to open overlay.
  - Prompt library with “/” shortcuts; real-time info.
- Selection Tools
  - Select text, then Explain / Translate / Rephrase / Summarize / Custom Actions.
- Writing Tools
  - Compose/Rewrite in different tones; grammar correction; email reply suggestions.
- Translate
  - Selected text translation; full-page “parallel” translation (preserve layout, compare original/translated).
- Page/Media Summarization
  - Webpage and YouTube summary; PDF chat/translation; “Chat with Image.”
- Search Integrations
  - Side-by-side answers next to Google/Bing; “Search Agent” that runs multi-step queries.
- “Memo” (Knowledge Base)
  - Save pages, chats, images, PDFs; chat with your knowledge base later.

Given your startup focus, we will prioritize:
- Selection & Refine (Grammarly-like), Custom Actions, Translate Selection.
- Right‑click: Translate Page, Analyze/Scrape Page.
- Optional/Next: Search side panel, PDF tools, YouTube summary, memo knowledge base.

---

## Current Codebase — Relevant Building Blocks

- Next.js app: `studio/` with APIs under `studio/src/app/api/*`
  - Examples: `refine-query` (`studio/src/app/api/refine-query/route.ts`) already shows a refiner route structure.
  - `search/route.ts` and `search/images/route.ts` show search patterns.
  - `generate-video-description` exists and calls Genkit flows via an API.
- Genkit flows: `studio/src/ai/flows/*`
  - Text-focused utilities include `generate-chat-response-flow.ts`, `process-custom-instruction-flow.ts`, etc.
  - Image editing prompt flow: `generate-editing-prompts-flow.ts` — not directly used here but a pattern for flows.
- Firebase client: `studio/src/lib/firebase/clientApp.ts` — initialize Firebase using env vars.

These demonstrate patterns we will reuse for new, extension-targeted APIs.

---

## High-Level Architecture (Extension + Backend)

- Browser Extension (Manifest V3)
  - Service Worker (background): contextMenus, commands (hotkey), identity/auth flow, request routing, quota checks.
  - Content Script(s): selection detection, floating mini-toolbar, DOM text extraction and replacement (for translate/refine), overlay injection.
  - UI surfaces: Popup (toolbar icon), Options page (settings), On-page overlay (React/Shadow DOM) triggered by hotkey.
  - Storage: `chrome.storage.sync` for settings/prompts; `chrome.storage.local` for caches.

- Next.js Backend (existing `studio/`)
  - New routes namespace: `studio/src/app/api/extension/*` to serve extension needs.
  - Uses Genkit (`@genkit-ai/*`) and your `GeminiClient` for LLM tasks.
  - Auth: verify Firebase ID tokens from extension; per-user rate limiting (Firestore counters or token bucket).

- Firebase
  - Auth: user identity for quota/usage.
  - Firestore: store “Memo” (saved pages/excerpts), custom prompt library, logs.

 ## Reusing the Same Backend and Firebase (Auth + Firestore)
 
 Use the existing Firebase project and Next.js backend for the extension. Key setup and practices:
 
 - Same Firebase project: reuse the Web App config already used by `studio/src/lib/firebase/clientApp.ts`.
 - Authorized domains (Firebase Auth): add `https://<extension-id>.chromiumapp.org` and your production domain(s).
 - Auth flow in extension (recommended):
   - Use `chrome.identity.launchWebAuthFlow` to open your existing `studio/` sign‑in.
   - After sign‑in, redirect to `https://<extension-id>.chromiumapp.org/extension-auth/callback#code=<one-time-code>`.
   - Extension calls `/api/extension/auth/exchange` to exchange the code for a Firebase Custom Token, then signs in with `signInWithCustomToken()` and uses `getIdToken()` for API calls.
 - API calls: attach `Authorization: Bearer <FirebaseIDToken>` to all extension requests.
 - Server verification (Next.js): verify tokens in every `/api/extension/*` route using Firebase Admin. Example:
 
   ```ts
   import { getAuth } from 'firebase-admin/auth';
   import type { NextRequest } from 'next/server';
 
   export async function POST(req: NextRequest) {
     const authHeader = req.headers.get('authorization') || '';
     const [, token] = authHeader.split(' ');
     const decoded = await getAuth().verifyIdToken(token);
     // decoded.uid is the userId; enforce quotas and proceed…
   }
   ```
 
 - Firestore sharing: keep per‑user data under `users/{uid}/...` (e.g., `prompts`, `memos`, `usage`). Server writes via Admin SDK; client reads via APIs or secured rules.
 - Quotas: maintain counters in Firestore and enforce in both client (soft) and server (hard).
 - CORS: if adding CORS to API routes, allow your deployed domain(s) and, for dev, the extension ID origin; otherwise prefer same‑origin by calling the deployed domain directly.
 - Security: never ship service credentials in the extension; store only user tokens in `chrome.storage.local` and refresh via Firebase or by re‑running the exchange flow when needed.
 
 ---
 
 ## Extension UX — Feature-by-Feature

1) Select & Refine (Grammarly-like)
- UX: When user selects text, show a mini-toolbar (floating bubble). Actions:
  - Refine (fix grammar, clarity, tone: formal/casual, shorten/expand)
  - Translate
  - Summarize
  - Custom Prompt (user-defined template)
- Implementation:
  - Content script captures selection and context (element type, contentEditable, input/textarea value vs text node).
  - Post selected text to `/api/extension/rewrite` (see API design). Receive transformed text.
  - Safely replace text in inputs/contenteditable; for raw DOM text, manipulate text nodes; fallback to clipboard copy + toast if direct replace unsafe.

2) Right‑Click Context Menus
- “DesAInR: Refine Selection” (when selection exists)
- “DesAInR: Translate Selection → [target lang]”
- “DesAInR: Custom Action (choose template…)”
- Page-level (no selection): “DesAInR: Analyze Page”, “DesAInR: Translate Page”, “DesAInR: Scrape & Gather Data”

3) Translate Page (Parallel Mode)
- UX: Right‑click > “Translate the Page” or from overlay button.
- Implementation:
  - Content script collects text nodes via `TreeWalker`, dedupes, batches into chunks.
  - Call `/api/extension/translate-chunks` to translate arrays of strings.
  - Replace in DOM while preserving structure; optional parallel mode (side-by-side original vs translated) using injected spans with dataset attributes; allow toggle.
  - Use a `MutationObserver` to re-translate dynamic content when needed.

4) Analyze/Scrape Page
- UX: Right‑click > “Analyze Page” → overlay shows summary, key points, entities, links, tables, action items. Optional “Save to Memo.”
- Implementation:
  - Send `{ url, htmlSnippetOrFull?, selection? }` to `/api/extension/analyze-page`.
  - Server fetches URL (to bypass CORS), runs extraction (Readability/cheerio), then LLM analysis flow.
  - For “Scrape & Gather Data,” add heuristics/rules: extract metadata, structured lists/tables, outbound links, images; return JSON + a textual summary.

5) Overlay Panel (Hotkey Ctrl/Cmd+M)
- Monica-like always-on overlay injected by content script with Shadow DOM; provides:
  - Quick chat box (multi-model, reuse your `DEFAULT_MODEL_ID` and model selector).
  - Slash prompts (user library from Firestore or `chrome.storage.sync`).
  - Tabs: Write, Translate, Analyze, Custom Prompt.

6) Custom Actions / Prompt Library
- Users define templates with variables; invoked on selection or from overlay.
- Store in Firestore under user profile; cache in extension storage.
- Call `/api/extension/actions` describing the template, variables, and selection.

7) Optional/Near-Future
- Search side panel on Google/Bing results pages.
- PDF translation/chat; YouTube summary; AI Image tools pass-through to existing flows.
- “Memo” knowledge base: Save page/selection/chat; later “Chat with Memo.”

---

## Backend API Design (New Routes)

Namespace: `studio/src/app/api/extension/*`

- POST `/api/extension/rewrite`
  - Input: `{ text: string, task: 'grammar'|'clarify'|'shorten'|'expand'|'tone', tone?: 'formal'|'casual'|'neutral', modelId?: string }`
  - Output: `{ rewritten: string, meta?: { diffs?: any } }`
  - Impl: New Genkit flow `generate-text-rewrite-flow.ts` using `GeminiClient`.

- POST `/api/extension/translate-chunks`
  - Input: `{ texts: string[], targetLang: string, keepFormatting?: boolean }`
  - Output: `{ translations: string[] }` (same order as input)
  - Impl: New flow `translate-batch-flow.ts` or reuse chat flow with system prompt.

- POST `/api/extension/analyze-page`
  - Input: `{ url?: string, html?: string, selection?: string, mode?: 'summary'|'scrape' }`
  - Output: `{ summary: string, keyPoints: string[], entities?: string[], links?: {url:string,text?:string}[], tables?: any[], raw?: any }`
  - Impl: Server fetch + DOM parse + LLM analysis. Respect robots.txt and legal constraints.

- POST `/api/extension/actions`
  - Input: `{ selection?: string, promptTemplate: string, variables?: Record<string,string>, modelId?: string }`
  - Output: `{ result: string }`
  - Impl: Use `process-custom-instruction-flow.ts` or `generate-chat-response-flow.ts`.

- POST `/api/extension/memo/save`
  - Input: `{ url?: string, title?: string, selection?: string, html?: string, tags?: string[] }`
  - Output: `{ id: string }`
  - Impl: Firestore write (collection per user), validated with Firebase Admin.

Security & Auth:
- Extension attaches `Authorization: Bearer <FirebaseIDToken>` to every request.
- Next.js routes verify tokens; enforce per-user quotas; log usage for insights.

---

## Using Existing Flows

- `process-custom-instruction-flow.ts`: Perfect for Custom Actions on selection.
- `generate-chat-response-flow.ts`: General chat/ask; can power overlay chat and Q&A.
- `refine-query/route.ts`: Reference for creating extension-specific refiner endpoints.
- Video/Image flows: Optional integration from overlay to generate/prototype visuals.

Where needed, add lightweight wrappers (new API routes) to reuse these flows with extension-friendly request/response shapes.

---

## Extension Implementation Plan (Step-by-Step)

1) Scaffold Extension (new repo folder `extension/`)
- Tech: Vite + React + TypeScript. Structure:
  - `manifest.json` (MV3): permissions `contextMenus`, `activeTab`, `scripting`, `tabs`, `storage`, `clipboardWrite`; host permissions `"<all_urls>"` (or narrowed later); optional `identity`.
  - `background.ts` (service worker): context menus, hotkey commands, auth, message router.
  - `contentScript.tsx`: selection detection, mini-toolbar, overlay mount, translate pipeline.
  - `popup.html/.tsx`, `options.html/.tsx`.
  - `offscreen.html` (for mic/voice if needed).

2) Auth Strategy
- Preferred: Firebase auth via `chrome.identity.launchWebAuthFlow` → sign in on your web app (`studio/`) and return to extension with a secure redirect URL capturing an ID token/custom token.
- Store token in `chrome.storage.local`; refresh as needed. Each API call includes `Authorization` header.

3) Selection Tooling
- Implement selection watcher in content script; render floating toolbar via Shadow DOM to avoid CSS conflicts.
- Actions call backend endpoints; apply results to DOM safely.

4) Translate Page
- Text node collector + batching → `/api/extension/translate-chunks` → replace DOM with mapping.
- Optional toggle for “parallel” overlay showing original vs translated.

5) Context Menus
- Register items on install; enable/disable per context (selection vs page).
- Route clicks to content script or directly call backend, then show results in overlay.

6) Overlay (Ctrl/Cmd+M)
- Keyboard `commands` in `manifest.json`.
- React overlay with tabs: Chat, Write, Translate, Analyze, Custom Action.
- Slash commands: simply map `/keyword` to stored templates.

7) “Memo” Save
- From overlay or context menu, save selection/page summary to Firestore via `/api/extension/memo/save`.

8) Logging, Quotas, Telemetry
- Background tracks usage (counts per day/user); enforce soft limits client-side; server enforces hard limits.

9) Testing & QA
- Unit test utility functions; e2e via Puppeteer/Playwright for selection/replace and translate page flows.

---

## Data & Privacy

- Respect robots.txt for server-side fetches.
- Do not send entire pages by default; prefer URL fetch on server. For intranet/behind-login pages, fall back to client-supplied HTML with user consent.
- Encrypt tokens at rest; least-privilege permissions; clear opt-in UX.

---

## Roadmap & Milestones

- M1 (Week 1–2): Scaffold extension, auth, selection toolbar with Grammar Refine, basic `/rewrite` route.
- M2 (Week 3): Translate Selection + Translate Page batching; `/translate-chunks` route.
- M3 (Week 4): Analyze/Scrape Page; `/analyze-page` route; overlay MVP with hotkey.
- M4 (Week 5): Custom Actions & Prompt Library synced to Firestore; context menus complete.
- M5 (Week 6): Memo save; quotas; polish UX; beta release.

---

## Risks & Mitigations

- CORS/security on page fetches → always prefer server fetch with token validation.
- DOM rewrite hazards → conservative node replacement; undo button; contenteditable edge cases.
- Model cost/latency → batch requests; caching; per-user limits; streaming where possible.

---

## Bengali Summary (সংক্ষিপ্ত)

- আলাদা Chrome/Edge এক্সটেনশন বানানো হবে — সিলেক্ট & রিফাইন, ট্রান্সলেট, রাইট‑ক্লিক অ্যানালাইস/স্ক্র্যাপ, ওভারলে (Ctrl/Cmd+M)।
- এক্সটেনশনটি `studio/` ব্যাকএন্ড API গুলো ব্যবহার করবে। নতুন `api/extension/*` রুট যোগ করা হবে: `rewrite`, `translate-chunks`, `analyze-page`, `actions`, `memo/save`।
- কাস্টম অ্যাকশন/প্রম্পট, স্ল্যাশ কমান্ড, মেমো সেভ — Firestore‑এর সাথে সিঙ্ক।
- প্রথম ধাপে গ্রামার রিফাইন + সিলেক্টেড টেক্সট ট্রান্সলেট; পরে ফুল‑পেজ ট্রান্সলেট ও অ্যানালাইস।

---

## Next Actions (for this repo)

- Add new API routes under `studio/src/app/api/extension/*` as specified.
- Create new flows where needed:
  - `studio/src/ai/flows/generate-text-rewrite-flow.ts`
  - `studio/src/ai/flows/translate-batch-flow.ts`
  - `studio/src/ai/flows/analyze-webpage-flow.ts`
- Start a new `extension/` folder (Manifest V3, React overlay) and wire auth to Firebase.

If you want, I can scaffold the extension folder and the first API route next.
