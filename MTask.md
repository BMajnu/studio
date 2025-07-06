DesAInR – AI Chat Rename Feature

Task Overview:

## Phase 1 – 2025-07-06
- [x] Add new AI flow (`generate-chat-title-flow.ts`) using gemini-2.5-flash-lite-preview-06-17 model.
- [x] Ensure existing `/api/generate-chat-title` route compiles with the new flow.

## Phase 2 – 2025-07-06
- [x] Extend `use-chat-history.ts` to request the new API and rename sessions automatically after the first user message.
- [x] Keep simple fallback naming logic for offline/error cases.

## Phase 3 – 2025-07-06
- [x] Update UI components (if required) to reflect instant rename without refresh. (Existing hooks/events already handle this.)
- [x] Add event handling or state updates so titles refresh in history panel and active chat header.

## Phase 4 – 2025-07-06
- [ ] Write unit tests for the new flow and hook changes.
- [ ] Perform manual end-to-end test in the browser.
- [ ] Update documentation/readme if necessary. 