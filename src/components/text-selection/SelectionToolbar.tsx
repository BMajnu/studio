"use client";
import React from "react";

// Minimal toolbar stub to satisfy imports and Next.js client serialization rules.
// Note: Any function props are named with *Action suffix to avoid Server Action warnings.

export interface SelectionToolbarProps {
  visible?: boolean;
  onCloseAction?: () => void;
}

export default function SelectionToolbar({ visible = false, onCloseAction }: SelectionToolbarProps) {
  if (!visible) return null;
  return (
    <div style={{ position: 'fixed', bottom: 16, right: 16, background: '#111', color: '#fff', padding: 8, borderRadius: 8 }}>
      <span>Text Selection Toolbar</span>
      <button
        style={{ marginLeft: 12 }}
        onClick={() => onCloseAction?.()}
      >
        Close
      </button>
    </div>
  );
}
