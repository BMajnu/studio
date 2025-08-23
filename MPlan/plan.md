# Project Plan: DesAInR Monica-style Browser Extension

## Overview
Implement a Monica-like MV3 extension that reuses the existing `studio/` backend and the same Firebase (Auth + Firestore). Deliver core features: selection toolbar (refine, translate, summarize), page translate, analyze page, overlay with tabs, custom actions, memos, and quotas.

## [ ] Phase 1: Foundation

### [ ] Task 1.1: Extension Scaffold
> References: design.md §2; requirements.md FR-14, FR-15
> Must Read: Re-read these references before implementing any subtask.
- [x] 1.1.1: Initialize `/extension` with Vite + React + TypeScript
- [x] 1.1.2: Create `manifest.json` (MV3) with required permissions and `commands`
- [x] 1.1.3: Add build/dev scripts; enable HMR for overlay where possible
- [x] 1.1.4: Scaffold Popup and Options UIs
- [ ] 1.1.5: Add ESLint/Prettier config and Git hooks (optional)

### [ ] Task 1.2: Backend Routes Skeleton
> References: design.md §2, §6; requirements.md FR-3, FR-5, FR-6, FR-9, FR-10, FR-1
> Must Read: Re-read these references before implementing any subtask.
- [x] 1.2.1: `POST /api/extension/rewrite` route stub
- [x] 1.2.2: `POST /api/extension/translate-chunks` route stub
- [x] 1.2.3: `POST /api/extension/analyze-page` route stub
- [x] 1.2.4: `POST /api/extension/actions` route stub
- [x] 1.2.5: `POST /api/extension/memo/save` route stub
- [x] 1.2.6: `POST /api/extension/auth/exchange` route stub

## [ ] Phase 2: Authentication

### [ ] Task 2.1: Firebase Admin & Verification
> References: design.md §2, §6; requirements.md FR-1, NFR-2
> Must Read: Re-read these references before implementing any subtask.
- [x] 2.1.1: Create `adminApp.ts` (singleton init)
- [x] 2.1.2: Implement `verifyFirebaseToken.ts` util (`getUser(req)`)
- [x] 2.1.3: Add token verification to all `/api/extension/*` routes (except `/auth/exchange`)

### [ ] Task 2.2: WebAuthFlow in Extension
> References: design.md Components (Background, auth.ts); requirements.md FR-1
> Must Read: Re-read these references before implementing any subtask.
- [x] 2.2.1: Implement `auth.ts` with `chrome.identity.launchWebAuthFlow`
- [x] 2.2.2: Handle `/auth/exchange` to mint Firebase Custom Token
- [x] 2.2.3: Persist tokens in `chrome.storage.local`
- [x] 2.2.4: Expose `getIdToken()` and attach `Authorization` header
- [x] 2.2.5: Sign-out
- [x] 2.2.6: Token refresh strategy

### [ ] Task 2.3: API Call Plumbing
- [x] 2.3.1: Background `API_CALL` messaging and `api.ts` helper (Authorization via ID token, avoid CORS)

## [ ] Phase 3: Selection Toolbar

### [ ] Task 3.1: Selection Detection & UI Injection
> References: design.md Components (Content Script, UI/UX §4); requirements.md FR-2
> Must Read: Re-read these references before implementing any subtask.
- [x] 3.1.1: `selection.ts` utility to capture selected text + context
- [x] 3.1.2: Inject floating mini-toolbar via Shadow DOM
- [x] 3.1.3: Positioning and show/hide logic near selection

### [ ] Task 3.2: Rewrite Action Integration
> References: requirements.md FR-3; design.md §6
> Must Read: Re-read these references before implementing any subtask.
- [x] 3.2.1: `apiClient.ts` with Authorization and retry/backoff
- [x] 3.2.2: Call `/rewrite` with tasks (grammar/clarify/shorten/expand/tone)
- [x] 3.2.3: `domReplace.ts` to safely apply rewritten text
- [x] 3.2.4: Undo/clipboard fallback when DOM replace unsafe

### [ ] Task 3.3: Translate Selection
> References: requirements.md FR-4; design.md §6
> Must Read: Re-read these references before implementing any subtask.
- [x] 3.3.1: Setting for default target language
- [x] 3.3.2: Call `/translate-chunks` for selection
- [x] 3.3.3: Replace selection text with translation

## [ ] Phase 4: Translate Page

### [ ] Task 4.1: Node Collection & Batching
> References: requirements.md FR-5, NFR-7; design.md Components (Content Script)
> Must Read: Re-read these references before implementing any subtask.
- [x] 4.1.1: Text node collector via `TreeWalker` with safe filters
- [x] 4.1.2: Chunking strategy and batching API calls
- [x] 4.1.3: Map results back to DOM nodes

### [ ] Task 4.2: Parallel Mode & Toggle
> References: requirements.md FR-5, NFR-4; design.md §4
> Must Read: Re-read these references before implementing any subtask.
- [x] 4.2.1: Render parallel original/translated spans, preserve layout
- [x] 4.2.2: Overlay toggle and live updates via `MutationObserver`
 - [x] 4.2.3: Integrate with translate-chunks API and batching

## [ ] Phase 5: Analyze / Scrape Page

### [ ] Task 5.1: Backend Analyze Flow
> References: requirements.md FR-6; design.md Flows (§3) and §6
> Must Read: Re-read these references before implementing any subtask.
- [x] 5.1.1: Implement `analyze-webpage-flow.ts` (Readability/cheerio)
- [x] 5.1.2: Server-side fetch with robots.txt respect
- [x] 5.1.3: Return `{ summary, keyPoints, entities?, links?, tables? }`

### [ ] Task 5.2: UI Integration
> References: requirements.md FR-6; design.md UI/UX (§4)
> Must Read: Re-read these references before implementing any subtask.
 - [x] 5.2.1: Overlay Analyze tab and renderer
 - [x] 5.2.2: Context menu action to trigger analyze flow

## [ ] Phase 6: Overlay (Hotkey) & Tabs

### [ ] Task 6.1: Commands & Overlay Shell
> References: requirements.md FR-7; design.md Components (Overlay UI), §4
> Must Read: Re-read these references before implementing any subtask.
- [x] 6.1.1: `manifest.json` `commands` (Ctrl/Cmd+M)
- [x] 6.1.2: Inject/attach React overlay app in Shadow DOM
- [x] 6.1.3: Focus management and keyboard accessibility

### [ ] Task 6.2: Chat and Tool Tabs
> References: requirements.md FR-7, FR-9; design.md §4, §6
> Must Read: Re-read these references before implementing any subtask.
 - [x] 6.2.1: Add `/api/extension/chat` route using `generate-chat-response-flow`
 - [x] 6.2.2: Chat tab UI with optional model selector
 - [x] 6.2.3: Write/Translate/Analyze tabs wired to existing APIs
- [ ] 6.2.4: Slash prompts from Firestore/`chrome.storage.sync`

## [ ] Phase 7: Custom Actions / Prompt Library

### [ ] Task 7.1: Backend Actions
> References: requirements.md FR-9; design.md §6
> Must Read: Re-read these references before implementing any subtask.
- [ ] 7.1.1: Implement `/api/extension/actions` using `process-custom-instruction-flow`
- [ ] 7.1.2: Firestore schema under `users/{uid}/prompts`
- [ ] 7.1.3: Validate inputs and enforce limits

### [ ] Task 7.2: UI & Selection Integration
> References: requirements.md FR-2, FR-9; design.md Components (Content Script, Overlay)
> Must Read: Re-read these references before implementing any subtask.
- [ ] 7.2.1: Add "Custom" button in selection toolbar
- [ ] 7.2.2: Templates CRUD in Options page
- [ ] 7.2.3: Apply templates with variables to selection

## [ ] Phase 8: Memo Save

### [ ] Task 8.1: Backend Memo Save
> References: requirements.md FR-10; design.md §6, §5
> Must Read: Re-read these references before implementing any subtask.
- [ ] 8.1.1: Implement `/api/extension/memo/save` route
- [ ] 8.1.2: Firestore writes and rules/admin validation
- [ ] 8.1.3: Return memo id; include in overlay toast

### [ ] Task 8.2: UI Integration
> References: requirements.md FR-10; design.md Components (Overlay)
> Must Read: Re-read these references before implementing any subtask.
- [ ] 8.2.1: "Save to Memo" from Analyze tab results
- [ ] 8.2.2: Context menu "Save selection to Memo"

## [ ] Phase 9: Quotas, Telemetry, Polishing

### [ ] Task 9.1: Client Quotas
> References: requirements.md FR-11; design.md Components (Background)
> Must Read: Re-read these references before implementing any subtask.
- [ ] 9.1.1: Token bucket counters in `chrome.storage.local`
- [ ] 9.1.2: Soft-block and friendly message when exceeded

### [ ] Task 9.2: Server Quotas & Logging
> References: requirements.md FR-11, FR-12; design.md §6
> Must Read: Re-read these references before implementing any subtask.
- [ ] 9.2.1: Increment usage in Firestore per user/day
- [ ] 9.2.2: Return `429` and headers on limit
- [ ] 9.2.3: Log latency/errors for observability

### [ ] Task 9.3: Accessibility & UX Polish
> References: requirements.md NFR-4, NFR-5; design.md §4
> Must Read: Re-read these references before implementing any subtask.
- [ ] 9.3.1: ARIA labels, focus traps, keyboard navigation
- [ ] 9.3.2: High-contrast theme and toasts
- [ ] 9.3.3: Confirmations and undo for DOM changes

## [ ] Phase 10: Packaging & QA

### [ ] Task 10.1: Build & Load Unpacked
> References: requirements.md FR-14; design.md §7
> Must Read: Re-read these references before implementing any subtask.
- [ ] 10.1.1: Vite build for MV3, sourcemaps, env handling
- [ ] 10.1.2: Load unpacked in Chrome/Edge; smoke check
- [ ] 10.1.3: Narrow permissions/host_permissions as feasible

### [ ] Task 10.2: QA & E2E Scenarios
> References: requirements.md NFR-3, NFR-7, NFR-8; design.md Components
> Must Read: Re-read these references before implementing any subtask.
- [ ] 10.2.1: Selection/refine flows on forms and contenteditable
- [ ] 10.2.2: Translate page on static and SPA pages
- [ ] 10.2.3: Analyze page on multiple domains and edge-cases

### [ ] Task 10.3: Release Prep
> References: requirements.md FR-14; design.md §7
> Must Read: Re-read these references before implementing any subtask.
- [ ] 10.3.1: Icons, screenshots, marketing copy
- [ ] 10.3.2: Review permissions; privacy policy link
- [ ] 10.3.3: Submit draft to Chrome Web Store
