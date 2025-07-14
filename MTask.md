DesAInR Pro - Gemini and Gemma Model Integration

Task Overview:
Integrate new Gemini and Gemma models, including a "thinking" vs. "non-thinking" mode for all supported Gemini models.

## Phase 1 – YYYY-MM-DD: Setup and Backend Configuration
- [ ] Install necessary dependencies: `@google/genai`, `mime`, and `@types/node`.
- [ ] Add the new models to the application constants in `src/lib/constants.ts`:
    - `gemini-2.5-flash` (with `supportsThinking: true`)
    - `gemini-2.5-flash-lite-preview-06-17` (with `supportsThinking: true`)
    - `gemma-3n-e4b` (with `supportsThinking: false`)
    - `gemma-3n-e2b` (with `supportsThinking: false`)
- [ ] Create a new type definition for `ThinkingMode` (`'default'` | `'none'`) in `src/lib/types.ts`.
- [ ] Add an optional `thinkingMode` property to the `UserProfile` interface in `src/lib/types.ts`.
- [ ] Update `gemini-client.ts` to use the `@google/genai` library. It will set `thinkingConfig.thinkingBudget` to `0` for `'none'` mode and send no `thinkingConfig` for `'default'` mode to use the model's default behavior.

## Phase 2 – YYYY-MM-DD: UI Implementation
- [ ] In the profile settings UI (`src/components/profile/profile-form.tsx`), add a `Switch` or `RadioGroup` to toggle "Thinking Mode" (On/Off).
- [ ] This UI control will only be visible when a selected model has `supportsThinking: true`.
- [ ] Update the `use-user-profile` hook to manage the state of the new `thinkingMode` setting.

## Phase 3 – YYYY-MM-DD: End-to-End Integration
- [ ] Trace the data flow from the UI to the AI service to ensure the `thinkingMode` is passed correctly.
- [ ] Modify `google-ai-service.ts` to accept the `thinkingMode` and pass it to the `gemini-client`.
- [ ] Verify that the `thinkingConfig` is correctly applied (or omitted for default) in the `generateContentStream` API call based on the user's selection.
- [ ] Conduct a final test to ensure the feature works as expected for all supported models. 

## Phase 4 – 2025-07-12  (Requirements-Analysis & UI Enhancements)
- [ ] Update analyze-client-requirements prompt to add “image summary” and increase creativity
- [ ] Extend output schema to include shortImageSummary & merge into mustFollow
- [ ] Adjust TypeScript types that consume the flow
- [ ] Adapt BilingualSplitView / DesignItemCard to render the extra mustFollow bullet
- [ ] Add “Edit and Generate Prompts” modal & hook it to existing generation logic
- [ ] Regression-test: attachments, design listing, both buttons 

DesAInR Pro - Chat History Enhancements

Task Overview:
Enhance chat history items in the unfolded sidebar by adding creation timestamp, making items larger, and displaying short relative time for creation.

## Phase 1 – 2024-07-13: Update Types and Metadata Creation
- [x] Add `createdAt: number` to `ChatSessionMetadata` interface in `src/lib/types.ts`.
- [x] Update all places where `ChatSessionMetadata` is created (e.g., in `use-chat-history.ts`, `use-firebase-chat.ts`, `firebase/chatStorage.ts`, `storage providers`) to include `createdAt` from the session's `createdAt`.

## Phase 2 – 2024-07-13: Update Date Utilities
- [x] Add a new function `formatShortRelativeTime(date: Date): string` in `src/lib/date-utils.ts` that returns short formats like '1m', '1h', '1d', etc.

## Phase 3 – 2024-07-13: Update UI Components
- [x] In `src/components/chat/ChatHistoryItem.tsx`, use the new short relative time based on `session.createdAt` instead of `lastMessageTimestamp`.
- [x] Adjust styling in `ChatHistoryItem.tsx` to make the item larger (increase padding, font sizes).
- [x] Ensure message count is displayed properly.

## Phase 4 – 2024-07-13: Testing and Refinement
- [x] Test the changes with existing and new chats to verify creation time is shown correctly.
- [x] Adjust styling if necessary for proper display. 