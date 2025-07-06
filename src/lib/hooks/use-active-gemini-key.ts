import { useState, useEffect, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';

const getActiveKeyFromStorage = (userId: string) => {
  if (typeof window === 'undefined' || !userId) return undefined;
  try {
    return localStorage.getItem(`desainr_active_gemini_key_${userId}`);
  } catch {
    return undefined;
  }
};

/**
 * Reads the active Gemini key from localStorage and provides updates.
 * Also shows a toast notification the first time the key changes in a session.
 */
export function useActiveGeminiKey(userId?: string) {
  const [activeKey, setActiveKey] = useState<string | null | undefined>(undefined);
  const previousKeyRef = useRef<string | null | undefined>(undefined);
  const { toast } = useToast();

  useEffect(() => {
    if (!userId) {
      setActiveKey(undefined);
      return;
    }

    const currentKey = getActiveKeyFromStorage(userId);
    setActiveKey(currentKey);

    // If we have a previous key and the new one is different, it means rotation occurred.
    if (previousKeyRef.current && currentKey && previousKeyRef.current !== currentKey) {
      toast({
        title: "Gemini API Key Rotated",
        description: `Switched to a new key to continue service.`,
        variant: "default",
      });
    }

    // Update the ref for the next render AFTER comparison.
    previousKeyRef.current = currentKey;

    // Optional: could add a storage event listener here to sync across tabs,
    // but for now, this will re-evaluate on component re-renders where the hook is used.

  }, [userId, toast]); // Re-run when userId changes or on re-renders

  // A function to manually trigger a re-check, e.g., after an AI call
  const refreshActiveKey = () => {
     if (userId) {
        const currentKey = getActiveKeyFromStorage(userId);
        setActiveKey(currentKey);
     }
  };


  return { activeKey, refreshActiveKey };
} 