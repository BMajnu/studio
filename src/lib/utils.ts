import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { ActionType } from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Converts an ActionType to a user-friendly display label
 */
export function getActionTypeLabel(actionType: ActionType | undefined): string {
  switch (actionType) {
    case 'processMessage':
      return 'Chat';
    case 'analyzeRequirements':
      return 'Requirements';
    case 'generateEngagementPack':
      return 'Fiverr Brief';
    case 'generateDeliveryTemplates':
      return 'Delivery';
    case 'checkMadeDesigns':
      return 'Check Designs';
    case 'generateRevision':
      return 'Revision';
    case 'generateDesignPrompts':
      return 'AI Prompts';
    case 'generateEditingPrompts':
      return 'Editing Prompts';
    case 'checkBestDesign':
      return 'Best Design';
    case 'promptToReplicate':
      return 'Replication';
    case 'promptWithCustomSense':
      return 'Custom Style';
    case 'promptForMicroStockMarkets':
      return 'Microstock';
    case 'search':
      return 'Search';
    case 'custom':
      return 'Custom';
    default:
      return 'Chat';
  }
}

// Helper function to fetch with a timeout
export async function fetchWithTimeout(
  resource: RequestInfo,
  options: RequestInit & { timeout?: number } = {}
) {
  const { timeout = 8000, ...fetchOptions } = options;

  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  
  try {
    const response = await fetch(resource, {
      ...fetchOptions,
      signal: controller.signal,
    });
    clearTimeout(id);
    return response;
  } catch (error) {
    clearTimeout(id);
    throw error;
  }
}
