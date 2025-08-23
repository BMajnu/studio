# System Design: DesAInR Monica-style Browser Extension

## 1. Architecture Overview
- Pattern: Client–Server. Chrome/Edge MV3 extension (client) talks to existing Next.js app (`studio/`) via `/api/extension/*` endpoints. Why: isolates secrets server‑side, reuses existing infra, and enables quota/policy enforcement.
- Data flow (high level):
  - User action → Content Script → Background (route/auth) → Next.js API → Genkit Flow/LLM → Response → Content Script → DOM/Overlay update.
  - For auth: Extension launches web auth on `studio/` → exchange one‑time code → Firebase Custom Token → Firebase ID Token → attach as `Authorization: Bearer <token>` to API calls.

## 2. Project Structure
/studio (existing Next.js)
|-- /src
|   |-- /app
|   |   |-- /api
|   |   |   |-- /extension
|   |   |   |   |-- rewrite/route.ts
|   |   |   |   |-- translate-chunks/route.ts
|   |   |   |   |-- analyze-page/route.ts
|   |   |   |   |-- actions/route.ts
|   |   |   |   |-- memo/save/route.ts
|   |   |   |   |-- auth/exchange/route.ts
|   |   |   |-- (existing routes)
|   |-- /ai/flows
|   |   |-- generate-text-rewrite-flow.ts
|   |   |-- translate-batch-flow.ts
|   |   |-- analyze-webpage-flow.ts
|   |   |-- (existing flows)
|   |-- /lib/firebase
|   |   |-- clientApp.ts
|   |   |-- adminApp.ts (ensure initialized once)
|   |-- /lib/middleware
|   |   |-- verifyFirebaseToken.ts

/extension (new MV3 project)
|-- manifest.json
|-- package.json
|-- vite.config.ts
|-- /src
|   |-- background.ts
|   |-- contentScript.ts
|   |-- /ui
|   |   |-- /overlay
|   |   |   |-- App.tsx
|   |   |   |-- index.css
|   |   |-- /popup
|   |   |   |-- Popup.tsx
|   |   |-- /options
|   |   |   |-- Options.tsx
|   |-- /lib
|   |   |-- apiClient.ts
|   |   |-- auth.ts
|   |   |-- selection.ts
|   |   |-- domReplace.ts
|   |   |-- translate.ts
|   |   |-- analyze.ts

## 3. Components & Modules
### Component: Background Service Worker
- Responsibility: Context menus, hotkey commands, auth flow, message routing, lightweight client‑side quotas.
- Interfaces: `chrome.runtime.onMessage`, `chrome.contextMenus`, `chrome.commands`, `chrome.identity.launchWebAuthFlow`.
- Dependencies: `auth.ts`, `apiClient.ts`.

### Component: Content Script
- Responsibility: Watch selection, inject floating toolbar, collect/replace text nodes, inject overlay root.
- Interfaces: `window.getSelection()`, `MutationObserver`, `postMessage` to background.
- Dependencies: `selection.ts`, `domReplace.ts`, `translate.ts`.

### Component: Overlay UI (React in Shadow DOM)
- Responsibility: Chat and tools UI; tabs (Write, Translate, Analyze, Custom); results rendering.
- Interfaces: Background messaging; keyboard focus management.
- Dependencies: `apiClient.ts`.

### Component: Popup UI
- Responsibility: Quick actions, sign‑in state, links to options.
- Interfaces: Background messaging.

### Component: Options UI
- Responsibility: Settings (default language/tone, slash prompts), account, permissions.
- Interfaces: `chrome.storage.sync`.

### Module: auth.ts (extension)
- Responsibility: WebAuthFlow, store tokens in `chrome.storage.local`, refresh when needed.
- Interfaces: `signIn()`, `getIdToken()`, `signOut()`.

### Module: apiClient.ts (extension)
- Responsibility: Fetch wrapper for `/api/extension/*` with Authorization header; retry/backoff; error handling.

### Module: verifyFirebaseToken.ts (server)
- Responsibility: Verify ID token from Authorization header; expose `getUser(req)` util.

### Flows (server)
- `generate-text-rewrite-flow.ts`: deterministic rewrite/refine pipeline via Gemini/Genkit.
- `translate-batch-flow.ts`: batch translation with formatting preservation.
- `analyze-webpage-flow.ts`: summarization + extraction (key points, entities, tables, links).

## 4. UI/UX Guidance
- Color: primary `#4F46E5`, secondary `#0EA5E9`, neutral grays.
- Typography: Inter/Segoe UI, 14–16px base; monospace for code blocks.
- Layout: Shadow DOM container; draggable overlay; responsive panel up to 420px width.
- Key Elements: Floating mini-toolbar near selection; overlay tabs; non-blocking toasts; undo action for DOM replace.

## 5. Data Schema (Firestore)
Collection paths (per user): `users/{uid}/...`
- `prompts` { id, name, template, variables[], updatedAt }
- `memos` { id, url?, title?, selection?, htmlSnippet?, tags[], createdAt }
- `usage` { date (YYYY-MM-DD), rewriteCount, translateCount, analyzeCount }
Server-only logs: request id, latency, status.

## 6. API Endpoints
POST `/api/extension/rewrite`
- Request: `{ text: string, task: 'grammar'|'clarify'|'shorten'|'expand'|'tone', tone?: 'formal'|'casual'|'neutral', modelId?: string }`
- 200: `{ rewritten: string, meta?: { diffs?: any } }`
- 400/401/429: `{ error: string }`

POST `/api/extension/translate-chunks`
- Request: `{ texts: string[], targetLang: string, keepFormatting?: boolean }`
- 200: `{ translations: string[] }`
- 400/401/429: `{ error: string }`

POST `/api/extension/analyze-page`
- Request: `{ url?: string, html?: string, selection?: string, mode?: 'summary'|'scrape' }`
- 200: `{ summary: string, keyPoints: string[], entities?: string[], links?: {url:string,text?:string}[], tables?: any[] }`
- 400/401/429: `{ error: string }`

POST `/api/extension/actions`
- Request: `{ selection?: string, promptTemplate: string, variables?: Record<string,string>, modelId?: string }`
- 200: `{ result: string }`

POST `/api/extension/memo/save`
- Request: `{ url?: string, title?: string, selection?: string, html?: string, tags?: string[] }`
- 200: `{ id: string }`

POST `/api/extension/auth/exchange`
- Request: `{ code: string }`
- 200: `{ customToken: string }`

Security
- All endpoints verify Firebase ID Token from `Authorization: Bearer ...` (except `/auth/exchange`).
- Enforce per-user quotas; return `429` on limit; log usage.

## 7. Build & Packaging
- Extension: Vite build, outputs to `/extension/dist`; `manifest.json` MV3 with `contextMenus`, `activeTab`, `scripting`, `storage`, `tabs`, `clipboardWrite`; host_permissions `"<all_urls>"` initially (narrow later).
- Backend: Next.js routes colocated under `/api/extension/*`; use edge/runtime where feasible; ensure Admin SDK singleton init.
