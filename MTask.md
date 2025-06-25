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