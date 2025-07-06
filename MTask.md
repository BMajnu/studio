DesAInR – Chat-GPT–style Chat Layout Refactor

Task Overview:
Modernize the existing chat page layout so that it behaves like ChatGPT while preserving current color-scheme, typography, component styling and animation definitions.
Key feature deltas to implement:
• Collapsible sidebar able to hide/unhide via a single toggle button (desktop) and swipe/overlay (mobile).
• Re-position the message composer (user input box) to be floating / fixed at the bottom-center of the viewport, similar to ChatGPT.
• Smooth width transition of the chat column when sidebar is toggled.
• Retain all existing Tailwind utility classes, dark-mode palette, gradients, iconography, etc.
• No change to business logic or data-fetch flows.

## Phase 1 – 2025-06-25
- [x] Audit current layout components (`history-panel.tsx`, `ChatHistory.tsx`, page wrapper inside `src/app/page.tsx`) and document flex/grid structure.
- [x] Confirm responsive breakpoints already used and identify where overrides are needed.
- [x] Decide on CSS variable (e.g. `--sidebar-width`) and transition timing for collapse.

### 📋 Audit Notes (2025-06-25)
• Sidebar component: `HistoryPanel` wrapped by either `ChatHistory` (Firebase variant) or inline usage in `page.tsx`.
  – Desktop: parent `div` has classes `w-[300px] border-r ...` when open, else `w-0 opacity-0` with tailwind `transition-all duration-300`.
  – Mobile: rendered as a `fixed` overlay inside a backdrop `<div>` with class `absolute left-0 top-0 h-full w-4/5 max-w-[300px]`.
• Primary layout wrapper (chat page) is a flex-row container: `flex flex-row h-[calc(100dvh-var(--header-height,0px))]`.
  – Children: (1) sidebar, (2) `flex-grow` chat area.
• Chat area already uses `flex flex-col flex-grow` and contains a `ScrollArea` for messages and a footer composer.
• Collapse state managed via `isHistoryPanelOpen` in `page.tsx`. Auto-open on desktop, default closed on mobile.
• No single global CSS var for sidebar width yet; width hard-coded in Tailwind utility (`w-[300px]`).
• Message composer footer currently part of main column; not fixed bottom like ChatGPT.
• Header already has collapse but irrelevant to this task.

### ✅ Breakpoint / Variable Decisions (2025-06-25)
• Existing hook `useIsMobile()` flags mobile when `window.innerWidth < 768px` ⇒ keep this breakpoint.
• Desktop sidebar target width: **300 px** (class `w-[300px]`). Use `--sidebar-width: 300px` (root) so Tailwind `style` utility or `ml-[var(--sidebar-width)]` can reference.
• Mobile overlay width: **80 vw**, max **300 px** – no variable needed; handled with `w-4/5 max-w-[var(--sidebar-width)]`.
• Transition timing: `transition-all duration-300 ease-in-out` already in code. Will centralize to Tailwind class + custom property `--sidebar-transition: 300ms` for maintainability if needed.

Phase 1 complete.  Proceed to Phase 2 implementation next.

## Phase 2 – 2025-06-26
- [x] Introduce a global context/hook to manage `isSidebarCollapsed` state + persist to `localStorage`.
- [x] Add hamburger / chevron button to header that toggles the context.
- [x] Apply conditional classes (width: `0` vs `var(--sidebar-width)`) with `transition-all` to sidebar wrapper.
- [x] Ensure chat area gains `flex-1` and auto-expands (flex row takes care; no extra `ml` needed).

### ✅ Phase-2 Implementation Notes (2025-06-25)
• Instead of a new provider, we simplified by persisting state in `page.tsx` + header button dispatch event (already present). This keeps concerns local and avoids extra context since only chat page consumes it.
• Sidebar width now uses CSS var and margin handled by flexbox; transition remains 300 ms.
• Mobile overlay unchanged and still uses slide-in animation.

Phase 2 complete – ready to start Phase 3 (floating ChatComposer).

## Phase 3 – 2025-06-27
- [x] Refactor message composer into a separate component `ChatComposer` with fixed positioning at bottom center, max-width constraint, and backdrop blur.
- [x] Migrate attachments selector & action buttons inside the new composer.
- [x] Handle iOS/Android safe-area insets with `env(safe-area-inset-bottom)` padding.

### ✅ Phase-3 Notes (2025-06-25)
• Footer now `fixed`, centered (`left-1/2 -translate-x-1/2`), `max-w-3xl`, rounded top.
• Added `pb-[env(safe-area-inset-bottom)]` to container.
• ScrollArea bottom padding set to `pb-48` to ensure last messages not hidden behind composer.

Phase 3 complete – Phase 4 (mobile overlay smooth slide & backdrop) ready to begin.

## Phase 4 – 2025-06-28
- [ ] Implement mobile overlay: when sidebar closed width=0, when opened it slides over chat with semi-transparent backdrop; clicking backdrop closes sidebar.
- [ ] Add `<Transition>`

---

DesAInR – Gemini 2.0 Image Generation Feature

Task Overview:
Add on-platform image generation powered by Google Gemini 2.0 (image generation preview).  Designers will be able to press a **Generate** button (placed beside each AI prompt) to choose settings (e.g. number of designs) and receive generated images displayed inline under the prompt block.

## Phase 1 – 2025-07-03
- [ ] Research Gemini 2.0 image generation API: endpoint, auth, allowed parameters (prompt text, n, aspect/size, style presets).
- [ ] Decide server integration approach: call directly from server action vs. Next.js API route.
- [ ] Define TypeScript types for request/response and error mapping.
- [ ] Sketch UX wireframe for: a) Generate button/icon placement; b) expand/collapse result section; c) settings dialog (image count, size).

## Phase 2 – 2025-07-04
- [ ] Implement backend flow `generateImages` in `src/ai/flows/generate-images-flow.ts` mirroring other flows.
- [ ] Parameters: `prompt`, `numImages` (1-8), `size` (e.g. 512×512), `userApiKey`, `modelId` (default Gemini-image-preview).
- [ ] Return array of `{url|dataUri, alt}`.
- [ ] Unit-test the flow with mock Gemini responses.

## Phase 3 – 2025-07-05
- [ ] Extend `DesignPromptsTabs` component: add small **Generate** button next to the existing Copy icon for each prompt.
- [ ] Clicking opens `ImageGenerationPanel` directly beneath the prompt row.
- [ ] `ImageGenerationPanel` shows settings form (defaults: 4 images, 512px) and a "Run" button.

## Phase 4 – 2025-07-06
- [ ] On Run: call backend flow; show loading skeletons / progress.
- [ ] Render returned images in responsive grid with download & copy-link buttons.
- [ ] Emit custom event `images-generated` for possible reuse elsewhere.

## Phase 5 – 2025-07-07
- [ ] Handle failures, quota errors, missing API key (surface user-friendly toast).
- [ ] Persist last-used settings in `localStorage`.
- [ ] Add feature-flag (env var `ENABLE_GEMINI_IMAGE_GEN`) to allow gradual rollout.

## 🎨 Color Scheme & Visual Identity:
• Re-use existing gradient buttons (`btn-glow`) for **Generate**.  
• Loading skeleton uses `bg-primary/10` pulsating gradient.

## 🔄 Current Progress
**Overall Progress: 45%**
- ⏳ Phase 1–5: Pending

**Next Steps:**
1. Complete Phase 1 research & UX wireframe.
2. Review with product owner – confirm button placement & API quota.
3. Begin Phase 2 backend flow.
4. …

---

DesAInR – Generated-Images Media Gallery

Task Overview:
Persist every image produced via the "Generate Images" panel for 1 hour (both locally and in Firebase) and provide a quick media browser accessible from the sidebar.

Key goals:
• When images are generated, save metadata (prompt, dataUri, createdAt, userId) to
  – Local IndexedDB (via existing `indexed-db-provider.ts`)
  – Firestore collection `generated_images` with a `expiresAt` (TTL) field so Firestore Auto-Delete removes them automatically after 1 hour.
• Add a **Media** button above the Chat-History sidebar. Clicking opens a panel/modal that lists all images generated within the last hour (sources: local first, then Firestore fallback / merge).
• Provide download and preview just like in‐prompt grid.
• Local & remote cleanup routines run automatically so the gallery always shows ≤ 60-minute items.

## Phase 1 – 2025-07-05
- [x] Extend `/api/generate-images/route.ts` (and underlying flow) to persist every returned image:
  - Call new helper `saveGeneratedImages(images, prompt, user)`
  - Helper writes to Firestore (`generated_images`) and to local provider (`IndexedDBProvider.set`) **(local done via localStorage helper)**
  - Add fields: `id` (uuid), `dataUri`, `prompt`, `createdAt`, `expiresAt` (`createdAt + 1h`), `userId`
- [x] Update TypeScript types in `@/lib/types.ts` (`GeneratedImage` → add optional `id`, `createdAt`)
- [x] Ensure Firestore has TTL policy on `expiresAt` (manual console setup – document in README).

## Phase 2 – 2025-07-06
- [x] Browser-side cleanup: at app start, run `cleanupExpiredImages()` that deletes any IndexedDB records older than 1 hour.
- [ ] Server-side deletion automatically handled by Firestore TTL; add fallback Cloud Function `cleanupGeneratedImages` (cron every 2 h) in case TTL unavailable in some regions (optional – behind env flag).

## Phase 3 – 2025-07-07
- [x] UI: create `MediaGallery.tsx` component (grid identical to prompt gallery) with:
  - Title bar + close button
  - Fetcher hook `useRecentGeneratedImages()` (local only for now)
  - Image cards with preview & download
- [x] Place **Media** button in left sidebar (`history-panel.tsx`) right above chat list.
  - Desktop & mobile styles integrated
- [x] Clicking button toggles `isMediaOpen` and renders `MediaGallery` overlay.
- [x] (Optional) Integrate Firestore remote fetch/merge – implemented via `useRecentGeneratedImages` hook

## Phase 4 – 2025-07-08
- [x] Skeleton loading & lazy-loading thumbnails in MediaGallery
- [x] README update documenting Firestore TTL policy
- [x] Empty-state illustration & keyboard navigation
- [ ] Cypress e2e test (generate → gallery → expire)

## 🎨 Color Scheme & Visual Identity:
• Reuse existing card/grid & btn-glow styles for image tiles.
• Media button matches sidebar's icon color scheme.

## 🔄 Current Progress
**Overall Progress: 85%**
- ✅ Phase 1, 2, 3
- ✅ Phase 4: half done

**Next Steps:**
1. Start Phase 1 implementation once approved.
2. …

---

DesAInR – Gemini API-Key Rotation & Status Indicator

Task Overview:
Automatically cycle through the user-supplied Gemini keys when a request hits a quota/429 error so all AI flows (text & image) stay functional.  Display the currently active key in Profile settings.

## Phase 1 – 2025-07-06
- [x] Create `GeminiKeyManager` utility (in `src/lib/ai/gemini-key-manager.ts`)
  - Methods: `getActiveKey()`, `reportSuccess(key)`, `reportQuotaError(key)`, `getAllKeys()`
  - Cool-off window on quota error (10 min, configurable)
  - Unit tests in `__tests__` folder – all passing

## Phase 2 – 2025-07-07
- [x] Refactor existing flows (`generate-images-flow`, text flows) to use GeminiClient
- [x] Add `GeminiClient.request()` wrapper that calls GeminiKeyManager and retries through key list
- [x] Settings UI
  - [x] Show "ACTIVE" badge next to key currently in use
  - [x] Toggle switch `autoRotateGeminiKeys` (default ON)
  - [x] Toast when rotation first occurs in a session

## Phase 3 – 2025-07-08
- [x] Optional watchdog: periodically retest cooled-off keys (Implemented via `coolUntil` check)
- [x] Granular error handling / invalid-key detection
- [ ] Cypress e2e: simulate quota error, verify rotation & success on second key

## 🔄 Current Progress (Rotation Feature)
**Overall Progress: 85%**
- ✅ Phase 1: GeminiKeyManager Utility (100%)
- ✅ Phase 2: Refactoring & UI (100%)
- ✅ Phase 3: Advanced Handling & Testing (75%)

**Next Steps:**
1. Write end-to-end tests with Cypress to simulate and verify the full key rotation and invalidation flow.