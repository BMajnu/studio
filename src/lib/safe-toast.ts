"use client";

import { toast as originalToast } from "@/hooks/use-toast";

// SafeToast - A wrapper around the toast function that ensures toast calls
// don't happen during React rendering, which can cause the
// "Cannot update a component while rendering a different component" error
export function safeToast(props: Parameters<typeof originalToast>[0]): void {
  // Use setTimeout with 0ms delay to move the toast call outside of the current render cycle
  setTimeout(() => {
    originalToast(props);
  }, 0);
}
