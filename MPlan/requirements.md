# Requirements: DesAInR Monica-style Browser Extension

## 1. Goal
Build a Manifest V3 Chrome/Edge extension that brings Monica-like AI assistance to any web page (selection refine, translate, analyze, overlay chat) while reusing the existing Next.js backend (`studio/`) and the same Firebase project (Auth + Firestore). Ensure secure auth, per-user quotas, and a fast, reliable UX.

## 2. User Stories
- As a user, I want to select text on any page and quickly refine/translate/summarize it so I can improve content without leaving the site.
- As a user, I want a hotkey overlay to ask questions or use custom prompts anywhere so I can work faster.
- As a user, I want to translate entire pages while preserving structure so I can read in my preferred language.
- As a user, I want page analysis (summary, key points, entities) via right-click so I can grasp content quickly.
- As a user, I want my custom actions and saved excerpts (memos) synced to my account so I can reuse them across devices.

## 3. Functional Requirements (FR)
- FR-1 Auth: Extension uses the same Firebase project; sign-in via `chrome.identity.launchWebAuthFlow`; backend verifies Firebase ID tokens on all `/api/extension/*` routes.
- FR-2 Selection Toolbar: Show mini-toolbar on text selection with actions (Refine, Translate, Summarize, Custom Prompt).
- FR-3 Rewrite API: POST `/api/extension/rewrite` → returns improved text; applied safely into inputs/contenteditable/DOM.
- FR-4 Translate Selection: Translate selected text to target language; configurable default.
- FR-5 Translate Page: Batch translate text nodes (TreeWalker) via POST `/api/extension/translate-chunks`; preserve layout; optional parallel view toggle.
- FR-6 Analyze Page: Right‑click action sends `{url | html}` to POST `/api/extension/analyze-page`; returns summary, key points, structured info.
- FR-7 Overlay (Hotkey): Ctrl/Cmd+M opens React overlay with Chat, Write, Translate, Analyze, Custom tabs; supports slash prompts.
- FR-8 Context Menus: Register items for selection and page-level actions (Refine, Translate Selection, Translate Page, Analyze Page, Custom Action).
- FR-9 Custom Actions: Run user-defined prompt templates against selection; store templates per user.
- FR-10 Memo Save: POST `/api/extension/memo/save` to store excerpts/pages with tags in Firestore under `users/{uid}`.
- FR-11 Quotas & Rate Limits: Enforce soft client limits and hard server-side limits per user/day.
- FR-12 Telemetry & Logs: Minimal usage counts, errors; privacy-respecting.
- FR-13 Settings Storage: Persist user preferences (language, tone, shortcuts) in `chrome.storage.sync`.
- FR-14 Packaging: Build and package MV3 extension with Vite; dev hot-reload for content/overlay where possible.
- FR-15 Security: Never ship secrets in extension; all server calls include `Authorization: Bearer <IDToken>`.

## 4. Non-Functional Requirements (NFR)
- NFR-1 Performance: Selection actions respond <1.5s p50; page translate initial render <3s p50 for typical article pages.
- NFR-2 Security: Verify tokens server-side; limit scopes/permissions; respect CORS/robots.txt; sanitize DOM writes.
- NFR-3 Reliability: Graceful fallbacks (clipboard copy if DOM replace unsafe); retries for transient server errors.
- NFR-4 Usability: Accessible toolbar/overlay; keyboard navigation; minimal intrusive UI; undo for DOM changes when feasible.
- NFR-5 Accessibility: Contrast-compliant colors; ARIA labels; focus management in overlay.
- NFR-6 Privacy: Do not upload entire pages unless necessary; prefer server fetch by URL; explicit user consent for behind-login pages.
- NFR-7 Compatibility: Chrome and Edge latest 2 versions; resilient to SPA DOM changes (MutationObserver).
- NFR-8 Maintainability: Modular code; typed APIs; clear boundaries between background, content, UI.
- NFR-9 Observability: Basic client logs (dev), server logs for latency/errors/usage.
- NFR-10 Internationalization: UI supports en + later locales; translation features handle at least en/bn/es/hi/zh.
