"use client";
import React, { createContext, useContext } from "react";

// Minimal, non-op text selection context to satisfy imports and avoid build errors.
// Replace with full implementation when ready.

type TextSelectionState = {
  isOpen: boolean;
};

const TextSelectionContext = createContext<TextSelectionState>({ isOpen: false });

export const useTextSelectionContext = () => useContext(TextSelectionContext);

export function TextSelectionProvider({ children }: { children: React.ReactNode }) {
  return (
    <TextSelectionContext.Provider value={{ isOpen: false }}>
      {children}
    </TextSelectionContext.Provider>
  );
}

export default TextSelectionProvider;
