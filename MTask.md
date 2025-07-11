DesAInR Pro - Folded Sidebar History View

Task Overview:
Update the folded sidebar panel to display a creative view of the chat history. Instead of the full list, it will show colored indicators for each chat. Hovering over an indicator will reveal the chat title and a preview.

## Phase 1 – YYYY-MM-DD: Create `FoldedHistoryItem` Component
- [ ] Create `src/components/chat/folded-history-item.tsx`.
- [ ] The component will be a small, clickable, colored element.
- [ ] Use a `Tooltip` to show chat name and preview on hover.
- [ ] Dynamically generate a color for each item based on its session ID.

## Phase 2 – YYYY-MM-DD: Create `FoldedHistoryPanel` Component
- [ ] Create `src/components/chat/folded-history-panel.tsx`.
- [ ] This component will render a list of `FoldedHistoryItem` components.
- [ ] It will manage the layout to fit items in the collapsed sidebar without a scrollbar.

## Phase 3 – YYYY-MM-DD: Integrate `FoldedHistoryPanel` into `HistoryPanel`
- [ ] Modify `src/components/chat/history-panel.tsx`.
- [ ] Add conditional logic: if the panel is collapsed, render `FoldedHistoryPanel`; otherwise, render the current history view.
- [ ] Pass required props to `FoldedHistoryPanel`. 