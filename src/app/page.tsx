// @ts-nocheck
'use client';

import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { Paperclip, Loader2, BotIcon, Menu, PanelLeftOpen, PanelLeftClose, Palette, SearchCheck, ClipboardSignature, ListChecks, ClipboardList, Lightbulb, Terminal, Plane, RotateCcw, PlusCircle, Edit3, RefreshCw, LogIn, UserPlus, Languages, X, AlertTriangle, InfoIcon, ArrowUpToLine, ArrowDownToLine, FileText, ChevronUp, ChevronDown, Moon, Sun, Bot } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ChatMessageDisplay } from '@/components/chat/chat-message';
import { ActionButtonsPanel, type ActionType } from '@/components/chat/action-buttons';
import { HistoryPanel } from '@/components/chat/history-panel';
import { useToast } from "@/hooks/use-toast";
import { safeToast } from "@/lib/safe-toast";
import { useUserProfile } from '@/lib/hooks/use-user-profile';
import { useChatHistory } from '@/lib/hooks/use-chat-history';
import type { ChatMessage, UserProfile, ChatMessageContentPart, AttachedFile, ChatSession, ChatSessionMetadata, EditHistoryEntry } from '@/lib/types';
import { processClientMessage, type ProcessClientMessageInput, type ProcessClientMessageOutput } from '@/ai/flows/process-client-message';
import { processCustomInstruction, type ProcessCustomInstructionInput, type ProcessCustomInstructionOutput } from '@/ai/flows/process-custom-instruction';
import { analyzeClientRequirements, type AnalyzeClientRequirementsInput, type AnalyzeClientRequirementsOutput } from '@/ai/flows/analyze-client-requirements';
import { generateEngagementPack, type GenerateEngagementPackInput, type GenerateEngagementPackOutput } from '@/ai/flows/generate-engagement-pack-flow';
import { generateDesignPrompts, type GenerateDesignPromptsInput, type GenerateDesignPromptsOutput } from '@/ai/flows/generate-design-prompts-flow';
import { checkMadeDesigns, type CheckMadeDesignsInput, type CheckMadeDesignsOutput } from '@/ai/flows/check-made-designs-flow';
import { generatePlatformMessages, type GeneratePlatformMessagesInput, type GeneratePlatformMessagesOutput } from '@/ai/flows/generate-platform-messages';
import { generateEditingPrompts, type GenerateEditingPromptsInput, type GenerateEditingPromptsOutput } from '@/ai/flows/generate-editing-prompts-flow';
import { checkBestDesign, type CheckBestDesignInput, type CheckBestDesignOutput } from '@/ai/flows/check-best-design-flow';
import { promptToReplicate } from '@/ai/flows/prompt-to-replicate-flow';
import { type PromptToReplicateInput, type PromptToReplicateOutput } from '@/ai/flows/prompt-to-replicate-types';

// Add import for DesAInRLogo
import { DesAInRLogo } from '@/components/icons/logo';
import Link from 'next/link';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import { DEFAULT_USER_ID, DEFAULT_MODEL_ID } from '@/lib/constants';
import { useAuth } from '@/contexts/auth-context';
import type { User as FirebaseUser } from 'firebase/auth';
import { LoginForm } from '@/components/auth/login-form';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { firebaseAppInstance } from '@/lib/firebase/clientApp'; // Import Firebase app instance
import { FullscreenSearch } from '@/components/chat/fullscreen-search';
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
// Add import for PromptToReplicate component
import { PromptToReplicate } from '@/components/chat/prompt-to-replicate';
import { PromptWithCustomSense } from '@/components/chat/prompt-with-custom-sense';
import { PromptForMicrostock } from '@/components/chat/prompt-for-microstock';
import type { PromptWithCustomSenseOutput } from '@/ai/flows/prompt-with-custom-sense-types'; // Added this import
import type { PromptWithMetadata as AIPromptWithMetadata } from '@/ai/flows/prompt-for-microstock-types'; // Import type for microstock results
import { FirebaseChatHistory } from '@/components/chat/FirebaseChatHistory';
import { setLocalStorageItem, getLocalStorageItem } from '@/lib/storage-helpers';
// Add import for BilingualSplitView component
import { BilingualSplitView } from '@/components/chat/bilingual-split-view';
import type { DesignListItem } from '@/lib/types';
import Image from 'next/image';

import { promptWithCustomSense } from '@/ai/flows/prompt-with-custom-sense-flow';
import type { PromptWithCustomSenseOutput } from '@/ai/flows/prompt-with-custom-sense-types';
import { motion, AnimatePresence } from 'framer-motion';

const getMessageText = (content: string | ChatMessageContentPart[] | undefined): string => {
  if (!content) return '';
  if (typeof content === 'string') return content;
  if (!Array.isArray(content) || content.length === 0) return '';

  let fullText = '';
  content.forEach(part => {
    const titlePrefix = part.title ? `### ${part.title}\n` : '';
    switch (part.type) {
      case 'text':
        fullText += `${titlePrefix}${part.text || ''}\n`;
        break;
      case 'code':
         fullText += `${titlePrefix}\`\`\`${part.language || ''}\n${part.code || ''}\n\`\`\`\n`;
        break;
      case 'list':
         fullText += titlePrefix;
         if (part.items && part.items.length > 0) {
          fullText += part.items.map((item, index) => `${index + 1}. ${item}`).join('\n') + '\n';
         }
        break;
      case 'translation_group':
        fullText += titlePrefix;
        let tgContent = "";
        if (part.english?.analysis) tgContent += `Analysis (English):\n${part.english.analysis}\n\n`;
        if (part.english?.simplifiedRequest) tgContent += `Simplified Request (English):\n${part.english.simplifiedRequest}\n\n`;
        if (part.english?.stepByStepApproach) tgContent += `Step-by-Step Approach (English):\n${part.english.stepByStepApproach}\n\n`;

        let bengaliCombined = "";
        if (part.bengali?.analysis && (!part.bengali.simplifiedRequest && !part.bengali.stepByStepApproach)) {
            bengaliCombined = part.bengali.analysis;
        } else {
            if (part.bengali?.analysis) bengaliCombined += `বিশ্লেষণ (Analysis):\n${part.bengali.analysis}\n\n`;
            if (part.bengali?.simplifiedRequest) bengaliCombined += `সরলীকৃত অনুরোধ (Simplified Request):\n${part.bengali.simplifiedRequest}\n\n`;
            if (part.bengali?.stepByStepApproach) bengaliCombined += `ধাপে ধাপে পদ্ধতি (Step-by-Step Approach):\n${part.bengali.stepByStepApproach}`;
        }

        if (bengaliCombined.trim()) {
          if (tgContent.trim()) tgContent += "\n---\n";
          tgContent += `Bengali Translation:\n${bengaliCombined.trim()}\n`;
        }
        fullText += tgContent;
        break;
      case 'bilingual_analysis': {
        const ba = part as any;
        fullText += titlePrefix;
        // Key Points
        if (Array.isArray(ba.keyPoints?.english)) {
          fullText += 'Key Points (English):\n';
          ba.keyPoints.english.forEach((kp: string) => fullText += `- ${kp}\n`);
          fullText += '\n';
        }
        if (Array.isArray(ba.keyPoints?.bengali)) {
          fullText += 'Key Points (Bengali):\n';
          ba.keyPoints.bengali.forEach((kp: string) => fullText += `- ${kp}\n`);
          fullText += '\n';
        }
        // Detailed Requirements
        if (typeof ba.detailedRequirements?.english === 'string') {
          fullText += 'Detailed Requirements (English):\n';
          fullText += ba.detailedRequirements.english.trim() + '\n\n';
        }
        if (typeof ba.detailedRequirements?.bengali === 'string') {
          fullText += 'Detailed Requirements (Bengali):\n';
          fullText += ba.detailedRequirements.bengali.trim() + '\n\n';
        }
        // Design Message
        if (typeof ba.designMessage?.english === 'string') {
          fullText += 'Design Message (English):\n';
          fullText += ba.designMessage.english.trim() + '\n\n';
        }
        if (typeof ba.designMessage?.bengali === 'string') {
          fullText += 'Design Message (Bengali):\n';
          fullText += ba.designMessage.bengali.trim() + '\n\n';
        }
        // Niche and Audience
        if (typeof ba.nicheAndAudience?.english === 'string') {
          fullText += 'Niche and Audience (English):\n';
          fullText += ba.nicheAndAudience.english.trim() + '\n\n';
        }
        if (typeof ba.nicheAndAudience?.bengali === 'string') {
          fullText += 'Niche and Audience (Bengali):\n';
          fullText += ba.nicheAndAudience.bengali.trim() + '\n\n';
        }
        // Design Items
        if (Array.isArray(ba.designItems?.english)) {
          fullText += 'Design Items (English):\n';
          ba.designItems.english.forEach((di: any) => {
            fullText += `- ID: ${di.id}, Title: ${di.title}, Description: ${di.description}`;
            if (di.textContent) fullText += `, Text: ${di.textContent}`;
            fullText += '\n';
          });
          fullText += '\n';
        }
        if (Array.isArray(ba.designItems?.bengali)) {
          fullText += 'Design Items (Bengali):\n';
          ba.designItems.bengali.forEach((di: any) => {
            fullText += `- ID: ${di.id}, Title: ${di.title}, Description: ${di.description}`;
            if (di.textContent) fullText += `, Text: ${di.textContent}`;
            fullText += '\n';
          });
          fullText += '\n';
        }
      }
      break;
      case 'microstock_results_tabs':
        fullText += titlePrefix;
        // Use optional chaining to safely access microstockResults
        const microstockResults = part.microstockResults ?? [];
        if (microstockResults.length > 0) {
          fullText += `Generated ${microstockResults.length} microstock prompts:\n\n`;
          microstockResults.forEach((result, index) => {
            fullText += `PROMPT ${index + 1}:\n${result.prompt}\n\n`;
            fullText += `METADATA:\n`;
            fullText += `Title: ${result.metadata.title}\n`;
            fullText += `Keywords: ${result.metadata.keywords.join(', ')}\n`;
            fullText += `Category: ${result.metadata.mainCategory}\n`;
            fullText += `Subcategory: ${result.metadata.subcategory}\n\n`;
            if (index < microstockResults.length - 1) {
              fullText += `---\n\n`;
            }
          });
        } else {
          fullText += `No microstock prompts were generated.\n`;
        }
        break;
      default:
        // For unknown or custom parts, try to extract some text if possible
        const unknownPart = part as any;
        let unknownTextContent = '';
        if (unknownPart.text) unknownTextContent = String(unknownPart.text);
        else if (unknownPart.code) unknownTextContent = String(unknownPart.code);
        else if (unknownPart.message) unknownTextContent = String(unknownPart.message);
        else if (unknownPart.items && Array.isArray(unknownPart.items) && unknownPart.items.length > 0) {
          unknownTextContent = unknownPart.items.join('\n');
        }
        if (unknownTextContent) {
          fullText += `${titlePrefix}${unknownTextContent}\n`;
        }
    }
    fullText += '\n';
  });
  return fullText.trim();
};

const LAST_ACTIVE_SESSION_ID_KEY_PREFIX = 'desainr_last_active_session_id_';

const generateRobustMessageId = (): string => {
  return `msg-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
};

const baseEnsureMessagesHaveUniqueIds = (messagesToProcess: ChatMessage[]): ChatMessage[] => {
  if (!Array.isArray(messagesToProcess) || messagesToProcess.length === 0) {
    return [];
  }
  const seenIds = new Set<string>();
  return messagesToProcess.map(msg => {
    let newId = msg.id;
    const isInvalidOldId = typeof newId !== 'string' || !newId.startsWith('msg-') || newId.split('-').length < 3;

    if (isInvalidOldId || seenIds.has(newId)) {
      let candidateId = generateRobustMessageId();
      while (seenIds.has(candidateId)) {
        candidateId = generateRobustMessageId();
      }
      newId = candidateId;
    }
    seenIds.add(newId);
    return { ...msg, id: newId };
  });
};

export default function ChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [currentAttachedFilesData, setCurrentAttachedFilesData] = useState<AttachedFile[]>([]);
  const [isCustomMessage, setIsCustomMessage] = useState(false);
  // Add state for feature components
  const [showPromptToReplicate, setShowPromptToReplicate] = useState(false);
  const [showPromptWithCustomSense, setShowPromptWithCustomSense] = useState(false);
  const [showPromptForMicrostock, setShowPromptForMicrostock] = useState(false);
  // State to store generated prompts for the Prompt to Replicate popup
  const [replicatePromptResults, setReplicatePromptResults] = useState<PromptToReplicateOutput | null>(null);
  const [isProcessingReplicatePrompts, setIsProcessingReplicatePrompts] = useState(false);
  // Add state for collapsible header and footer
  const [isHeaderCollapsed, setIsHeaderCollapsed] = useState(false);
  const [isFooterCollapsed, setIsFooterCollapsed] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { user: authUser, loading: authLoading, googleAccessToken, signInWithGoogle: triggerGoogleSignInFromAuth } = useAuth();
  const { profile, isLoading: profileLoading } = useUserProfile();
  const chatAreaRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const inputTextAreaRef = useRef<HTMLTextAreaElement>(null);
  const lastSyncTimestampRef = useRef<number>(0); // Track the last time we performed an auto-sync

  const [showNotesModal, setShowNotesModal] = useState(false);
  const [modalActionType, setModalActionType] = useState<ActionType | null>(null);
  const [modalNotes, setModalNotes] = useState('');
  const [isWelcomeLoginModalOpen, setIsWelcomeLoginModalOpen] = useState(false);

  const [pendingAiRequestAfterEdit, setPendingAiRequestAfterEdit] = useState<{
    content: string;
    attachments?: AttachedFile[];
    isUserMessageEdit: boolean;
    editedUserMessageId?: string;
    actionType?: ActionType;
  } | null>(null);

  // State for last selected action button
  const [lastSelectedActionButton, setLastSelectedActionButton] = useState<ActionType | null>(null);
  // State for currently active button UI highlight
  const [activeActionButton, setActiveActionButton] = useState<ActionType | null>(null);
  // State for search mode
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  // State to track the active search term to highlight inside the chat view
  const [searchHighlightTerm, setSearchHighlightTerm] = useState<string>(() => {
    if (typeof window === 'undefined') return '';
    try {
      return localStorage.getItem('desainr_search_query') || '';
    } catch {
      return '';
    }
  });

  // Add this state variable with other state declarations
  const [selectedDesignItem, setSelectedDesignItem] = useState<DesignListItem | null>(null);
  // Custom Instruction Modal state
  const [showCustomInstructionModal, setShowCustomInstructionModal] = useState(false);
  const [customInstructionText, setCustomInstructionText] = useState('');
  const [customInstructionFiles, setCustomInstructionFiles] = useState<AttachedFile[]>([]);
  const customInstructionFileInputRef = useRef<HTMLInputElement>(null);

  // Add state for custom sense prefill
  const [customSensePrefill, setCustomSensePrefill] = useState<CustomSensePrefill | null>(null);

  // New state for collapsed history panel
  const [isHistoryPanelCollapsed, setIsHistoryPanelCollapsed] = useState(false);

  /**
   * Button Selection Logic
   * ---------------------
   * We track two separate states:
   * 1. lastSelectedActionButton: Remembers which action button logic to use when:
   *    - User edits and resends a message
   *    - User regenerates a message
   *    - User sends a message without selecting an action button
   * 
   * 2. activeActionButton: Used only for visual UI feedback to show which button 
   *    is currently selected. This resets after a short delay for better UX.
   * 
   * Message Generation Logic
   * ----------------------
   * - When a user explicitly clicks an action button, that action is used AND remembered
   * - When regenerating or editing without choosing a new action, the system falls back 
   *   to the last used action button
   * - The "Chat" button is never automatically selected - it must be explicitly clicked
   * - If no action button has been clicked yet in the session, all messages default to
   *   using the "Chat" (processMessage) logic
   */

  const userIdForHistory = useMemo(() => {
    if (!authLoading && authUser) return authUser.uid;
    if (!authLoading && !authUser && !profileLoading && profile) return profile.userId; // For default user when profile loads
    return DEFAULT_USER_ID; // Fallback, should be brief if auth/profile load quickly
  }, [authLoading, authUser, profileLoading, profile]);

  const {
    historyMetadata,
    isLoading: historyHookLoading,
    getSession,
    saveSession,
    deleteSession,
    createNewSession,
    isSyncing,
    isAutoRefreshEnabled,
    setAutoRefreshEnabled,
  } = useChatHistory(userIdForHistory);

  const [currentSession, setCurrentSession] = useState<ChatSession | null>(null);
  const isMobile = useIsMobile();
  // Sidebar open / closed – persist to localStorage so the state survives refreshes
  const [isHistoryPanelOpen, setIsHistoryPanelOpen] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('desainr_sidebar_open');
      if (stored !== null) {
        return stored === 'true';
      }
      // default: open on desktop, closed on mobile
      return window.innerWidth >= 768;
    }
    return true;
  });
  const currentApiKeyIndexRef = useRef(0);
  const isMounted = useRef(false);
  const initialSessionLoadAttemptedRef = useRef(false);

  // Add a chatSidebarRef to access the history panel
  const chatSidebarRef = useRef<HTMLDivElement>(null);

  // Toggle functions for collapsible header and footer
  const toggleHeader = useCallback(() => {
    setIsHeaderCollapsed(prev => !prev);
  }, []);

  const toggleFooter = useCallback(() => {
    setIsFooterCollapsed(prev => !prev);
  }, []);

  const toggleHistoryPanelCollapse = useCallback(() => {
    setIsHistoryPanelCollapsed(prev => !prev);
  }, []);

  useEffect(() => {
    isMounted.current = true;
    
    // Load header and footer collapse state from localStorage
    try {
      const headerCollapsedState = localStorage.getItem('desainr_header_collapsed');
      const footerCollapsedState = localStorage.getItem('desainr_footer_collapsed');
      
      if (headerCollapsedState !== null) {
        setIsHeaderCollapsed(headerCollapsedState === 'true');
      }
      
      if (footerCollapsedState !== null) {
        setIsFooterCollapsed(footerCollapsedState === 'true');
      }
    } catch (error) {
      console.error('Error loading collapse state from localStorage:', error);
    }
    
    // Automatic localStorage cleanup for corrupted data
    try {
      // Handle corrupted history index keys
      console.log('Checking for corrupted localStorage data...');
      const keyPrefix = 'desainr_chat_history_index_ls_';
      const sessionKeyPrefix = 'desainr_chat_session_ls_';
      
      // Find all history and session keys
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (!key) continue;
        
        if (key.startsWith(keyPrefix) || key.startsWith(sessionKeyPrefix)) {
          try {
            const value = localStorage.getItem(key);
            if (!value) continue;
            
            // Try parsing the value
            try {
              JSON.parse(value);
            } catch (parseError) {
              // If parsing fails, try to check if it's corrupted compressed data
              if (value.includes('') || /[\x00-\x1F\x80-\xFF]/.test(value.substring(0, 4))) {
                console.warn(`Found corrupted data in ${key}, removing it`);
                localStorage.removeItem(key);
              }
            }
          } catch (e) {
            console.warn(`Error checking ${key}, removing it:`, e);
            localStorage.removeItem(key);
          }
        }
      }
      console.log('Finished checking localStorage for corrupted data');
    } catch (e) {
      console.error('Error during localStorage auto-repair:', e);
    }
    
    return () => { isMounted.current = false; };
  }, []);
  
  // Save collapse state to localStorage when it changes
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    // Update the CSS variable based on header state
    document.documentElement.style.setProperty('--header-height', isHeaderCollapsed ? '0px' : '4rem');
    
    try {
      localStorage.setItem('desainr_header_collapsed', isHeaderCollapsed.toString());
    } catch (error) {
      console.error('Error saving header collapse state to localStorage:', error);
    }
  }, [isHeaderCollapsed]);
  
  useEffect(() => {
    if (!isMounted.current) return;
    
    try {
      localStorage.setItem('desainr_footer_collapsed', isFooterCollapsed.toString());
    } catch (error) {
      console.error('Error saving footer collapse state to localStorage:', error);
    }
  }, [isFooterCollapsed]);

  const ensureMessagesHaveUniqueIds = useCallback(baseEnsureMessagesHaveUniqueIds, []);

  useEffect(() => {
    /* When viewport changes through resize, auto-close if mobile, open if desktop (unless user explicitly toggled) */
    setIsHistoryPanelOpen(prev => {
      const desired = !isMobile;
      // if prev equals desired no change
      return prev === desired ? prev : desired;
    });
  }, [isMobile]);

  // Persist sidebar state whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem('desainr_sidebar_open', isHistoryPanelOpen ? 'true' : 'false');
    } catch (_) {
      /* ignore */
    }
  }, [isHistoryPanelOpen]);

  useEffect(() => {
    const loadOrCreateSession = async () => {
      if (!userIdForHistory || !isMounted.current) {
        return;
      }

      // Prevent re-running if a session for the current user is already loaded,
      // unless this is the very first attempt for this userIdForHistory.
      if (initialSessionLoadAttemptedRef.current && currentSession && currentSession.userId === userIdForHistory) {
        // console.log("ChatPage: loadOrCreateSession - Session already active and initialized for user, skipping redundant load.", userIdForHistory);
        return;
      }
      initialSessionLoadAttemptedRef.current = true;


      // console.log(`ChatPage: loadOrCreateSession - Running for user ${userIdForHistory}. History Meta Count: ${historyMetadata.length}`);

      const lastActiveSessionIdKey = LAST_ACTIVE_SESSION_ID_KEY_PREFIX + userIdForHistory;
      let lastActiveSessionId = null;
      
      try {
        lastActiveSessionId = localStorage.getItem(lastActiveSessionIdKey);
        // console.log(`ChatPage: loadOrCreateSession - Last active session ID from localStorage: ${lastActiveSessionId || 'none'}`);
      } catch (error) {
        console.error(`ChatPage: loadOrCreateSession - Error reading last active session ID:`, error);
      }
      
      let sessionToLoad: ChatSession | null = null;

      if (lastActiveSessionId && lastActiveSessionId.startsWith(userIdForHistory + '_')) {
        // console.log(`ChatPage: loadOrCreateSession - Attempting to load last active session ${lastActiveSessionId}`);
        
        try {
          sessionToLoad = await getSession(lastActiveSessionId); // getSession now depends on historyMetadata being loaded
          
          if (sessionToLoad) {
            // console.log(`ChatPage: loadOrCreateSession - Successfully loaded session ${lastActiveSessionId}`);
          } else {
            // console.warn(`ChatPage: loadOrCreateSession - Last active session ID ${lastActiveSessionId} not found by getSession`);
          }
        } catch (error) {
          console.error(`ChatPage: loadOrCreateSession - Error loading session ${lastActiveSessionId}:`, error);
        }

        if (sessionToLoad && sessionToLoad.userId !== userIdForHistory) {
          // console.warn(`ChatPage: loadOrCreateSession - Loaded session ${lastActiveSessionId} for wrong user. Discarding.`);
          sessionToLoad = null;
          try {
            localStorage.removeItem(lastActiveSessionIdKey);
            console.error(`ChatPage: loadOrCreateSession - Error removing invalid session ID:`, error);
          } catch (error) {
            console.error(`ChatPage: loadOrCreateSession - Error removing invalid session ID:`, error);
          }
        } else if (!sessionToLoad && lastActiveSessionId) {
           // console.warn(`ChatPage: loadOrCreateSession - Last active session ID ${lastActiveSessionId} from LS not found by getSession or is invalid. Clearing LS key.`);
           try {
             localStorage.removeItem(lastActiveSessionIdKey);
           } catch (error) {
             console.error(`ChatPage: loadOrCreateSession - Error removing invalid session ID:`, error);
           }
        }
      } else if (lastActiveSessionId) {
        // console.warn(`ChatPage: loadOrCreateSession - lastActiveSessionId ${lastActiveSessionId} does not match user ${userIdForHistory}. Clearing LS key.`);
        try {
          localStorage.removeItem(lastActiveSessionIdKey);
        } catch (error) {
          console.error(`ChatPage: loadOrCreateSession - Error removing invalid session ID:`, error);
        }
      }

      // Try to load from history if last active session wasn't found
      if (!sessionToLoad && historyMetadata.length > 0) {
        // console.log(`ChatPage: loadOrCreateSession - Last active session not found, trying most recent from history (${historyMetadata.length} sessions available)`);
        // Sort by lastMessageTimestamp to get the most recent session
        const sortedHistory = [...historyMetadata].sort((a, b) => b.lastMessageTimestamp - a.lastMessageTimestamp);
        
        if (sortedHistory.length > 0) {
          const mostRecentSessionId = sortedHistory[0].id;
          // console.log(`ChatPage: loadOrCreateSession - Attempting to load most recent session ${mostRecentSessionId}`);
          
          try {
            sessionToLoad = await getSession(mostRecentSessionId);
            if (sessionToLoad) {
              // console.log(`ChatPage: loadOrCreateSession - Successfully loaded most recent session ${mostRecentSessionId}`);
              // Update last active session ID
              try {
                localStorage.setItem(lastActiveSessionIdKey, mostRecentSessionId);
                // console.log(`ChatPage: loadOrCreateSession - Set ${mostRecentSessionId} as last active session for user ${userIdForHistory}`);
              } catch (error) {
                console.error(`ChatPage: loadOrCreateSession - Error updating last active session ID:`, error);
              }
            }
          } catch (error) {
            console.error(`ChatPage: loadOrCreateSession - Error loading most recent session:`, error);
          }
        }
      }

      if (sessionToLoad && isMounted.current) {
        // Ensure no messages are in a loading state when loading initial session
        const migratedMessages = ensureMessagesHaveUniqueIds(sessionToLoad.messages).map(msg => ({
          ...msg,
          isLoading: false, // Reset loading state for all messages 
          isError: msg.isError // Preserve the error state from the saved message
        }));
        const updatedSession = { ...sessionToLoad, messages: migratedMessages };
        setCurrentSession(updatedSession);
        setMessages(updatedSession.messages);
        setIsLoading(false); // Ensure global loading state is reset
        // console.log(`ChatPage: loadOrCreateSession - Loaded session ${updatedSession.id} with ${updatedSession.messages.length} messages.`);
      } else if (isMounted.current) {
        // console.log(`ChatPage: loadOrCreateSession - No valid session found or to load, creating new for ${userIdForHistory}.`);
        const modelIdToUse = profile?.selectedGenkitModelId || DEFAULT_MODEL_ID;
        // Remove the third parameter (userApiKeyForNameGen)
        const newSession = createNewSession([], modelIdToUse);
        setCurrentSession(newSession);
        setMessages(newSession.messages); // Initialize with empty messages for a new session
        setIsLoading(false); // Ensure global loading state is reset
        
        // Save the new session ID as the last active session
        if (newSession.id && newSession.id.startsWith(userIdForHistory + '_')) {
          try {
            localStorage.setItem(lastActiveSessionIdKey, newSession.id);
            // console.log(`ChatPage: loadOrCreateSession - Set ${newSession.id} as last active session for user ${userIdForHistory}`);
            
            // Save the empty session to ensure it appears in history
            await saveSession(newSession, true);
            // console.log(`ChatPage: loadOrCreateSession - Saved new empty session ${newSession.id} to history`);
          } catch (error) {
            console.error(`ChatPage: loadOrCreateSession - Error in session creation/saving process:`, error);
          }
        } else {
          // console.warn("ChatPage: loadOrCreateSession (New Session) - New session ID mismatch or null.", newSession?.id, userIdForHistory);
        }
        // console.log(`ChatPage: loadOrCreateSession - Created new session ${newSession.id}.`);
      }
    };

    // This effect should run when the fundamental loading states are resolved and userIdForHistory is stable.
    if (!authLoading && !profileLoading && !historyHookLoading && userIdForHistory) {
      loadOrCreateSession();
    }
  // Reduced dependencies to prevent re-running due to minor metadata updates.
  // It primarily reacts to changes in auth/profile status and the initial history load completion.
  }, [authLoading, profileLoading, historyHookLoading, userIdForHistory, getSession, createNewSession, saveSession, ensureMessagesHaveUniqueIds, profile, currentSession]);


  // Effect to sync currentSession.name from historyMetadata if it changes (e.g., by AI naming)
  useEffect(() => {
    if (currentSession && currentSession.id && historyMetadata.length > 0) {
      const currentSessionMeta = historyMetadata.find((meta: ChatSessionMetadata) => meta.id === currentSession.id);
      if (currentSessionMeta && currentSessionMeta.name !== currentSession.name) {
        setCurrentSession(prevSession => {
          if (prevSession && prevSession.id === currentSession.id) { // Ensure we're updating the same session
            return { ...prevSession, name: currentSessionMeta.name };
          }
          return prevSession;
        });
      }
    }
  }, [historyMetadata, currentSession]); // Rely on currentSession object ref itself

  // Add direct listener for chat name updates to update UI immediately
  useEffect(() => {
    const handleChatNameUpdated = (event: CustomEvent) => {
      const { sessionId, newName } = event.detail;
      // console.log(`Received chat-name-updated event: sessionId=${sessionId}, newName=${newName}`);
      
      // Only update if this is the current active session
      if (currentSession && currentSession.id === sessionId && newName && newName !== currentSession.name) {
        // console.log(`Updating current session name from "${currentSession.name}" to "${newName}"`);
        
        // Force an immediate update to the current session
        setCurrentSession(prevSession => {
          if (prevSession && prevSession.id === sessionId) {
            // Create a completely new object to ensure React detects the change
            const updatedSession = { 
              ...prevSession, 
              name: newName,
              // Add a timestamp to force React to see this as a new object
              _nameUpdateTimestamp: Date.now() 
            };
            
            // Force the window title to update
            document.title = `${newName} | DesAInR`;
            
            // Store minimal session data instead of the entire session object
            try {
              const minimalSessionData = {
                id: sessionId,
                name: newName,
                lastUpdated: Date.now()
              };
              
              // Use enhanced storage helpers that handle compression and retries
              setLocalStorageItem(
                `desainr_last_active_session_name_${sessionId}`, 
                JSON.stringify(minimalSessionData),
                { retryAttempts: 3 }
              ).catch(error => console.error("Failed to save session name after retries:", error));
            } catch (e) {
              console.error("Error saving renamed session to localStorage:", e);
            }
            
            return updatedSession;
          }
          return prevSession;
        });
        
        // Also force an update to the history metadata to ensure sidebar updates
        // Skip if we're not using the same API instance
        if (typeof historyMetadata !== 'undefined') {
          const currentHistoryIndex = historyMetadata.findIndex(meta => meta.id === sessionId);
          if (currentHistoryIndex >= 0) {
            // Update directly in history hook for visual update in sidebar
            const updatedHistory = [...historyMetadata];
            updatedHistory[currentHistoryIndex] = {
              ...updatedHistory[currentHistoryIndex],
              name: newName
            };
            
            // Force a UI refresh of the sidebar
            setTimeout(() => {
              // Trigger a DOM update
              const historyEvent = new CustomEvent('history-updated', {
                detail: { sessionId, newName }
              });
              window.dispatchEvent(historyEvent);
              
              // Also force a history reload if possible by adding a fake key change
              const fakeTriggerKey = 'desainr_history_update_trigger';
              try {
                setLocalStorageItem(fakeTriggerKey, Date.now().toString())
                  .then(() => {
                    // Instead of removing, set to empty string
                    return setLocalStorageItem(fakeTriggerKey, '', { retryAttempts: 1 });
                  })
                  .catch(error => {
                    console.error("Failed to trigger history reload:", error);
                  });
              } catch (storageError) {
                // If we can't update localStorage, at least we tried
                console.error("Failed to trigger history reload:", storageError);
              }
            }, 10);
          }
        }
      }
    };
    
    // Add event listener for chat name updates
    window.addEventListener('chat-name-updated', handleChatNameUpdated as EventListener);
    
    return () => {
      window.removeEventListener('chat-name-updated', handleChatNameUpdated as EventListener);
    };
  }, [currentSession, historyMetadata]);

  useEffect(() => {
    if (chatAreaRef.current) {
      chatAreaRef.current.scrollTop = chatAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const addMessage = useCallback((role: 'user' | 'assistant' | 'system', content: string | ChatMessageContentPart[], currentAttachments?: AttachedFile[], isLoadingParam?: boolean, isErrorParam?: boolean, originalRequest?: ChatMessage['originalRequest'], promptedByMessageId?: string, actionType?: ActionType) => {
    const newMessageId = generateRobustMessageId();
    const newMessage: ChatMessage = {
      id: newMessageId, role, content, timestamp: Date.now(),
      isLoading: isLoadingParam, isError: isErrorParam,
      attachedFiles: role === 'user' ? currentAttachments : undefined,
      actionType: role === 'user' ? actionType : undefined, // Store actionType for user messages
      canRegenerate: role === 'assistant' && !!originalRequest,
      originalRequest: role === 'assistant' ? originalRequest : undefined,
      promptedByMessageId: role === 'assistant' ? promptedByMessageId : undefined,
    };
    setMessages(prev => ensureMessagesHaveUniqueIds([...prev, newMessage]));
    return newMessageId;
  }, [ensureMessagesHaveUniqueIds]);

  const updateMessageById = useCallback((messageId: string, newContent: string | ChatMessageContentPart[], isLoadingParam: boolean = false, isErrorParam: boolean = false, originalRequestDetails?: ChatMessage['originalRequest'], promptedByMessageIdToKeep?: string, actionType?: ActionType) => {
    setMessages(prev => {
      const updatedMessages = prev.map(msg =>
        msg.id === messageId ? {
            ...msg, 
            content: newContent, 
            isLoading: isLoadingParam, 
            isError: isErrorParam,
            timestamp: Date.now(),
            actionType: actionType !== undefined ? actionType : msg.actionType, // Use new action type if provided
            canRegenerate: !!originalRequestDetails,
            originalRequest: originalRequestDetails,
            promptedByMessageId: promptedByMessageIdToKeep || msg.promptedByMessageId,
        } : msg
      );
      return ensureMessagesHaveUniqueIds(updatedMessages);
    });
  }, [ensureMessagesHaveUniqueIds]);

  const handleNewChat = useCallback(async () => {
    initialSessionLoadAttemptedRef.current = false; // Allow loadOrCreateSession to run for new chat
    const modelIdToUse = (profile?.selectedGenkitModelId || DEFAULT_MODEL_ID);
    
    // Create a unique timestamp for the new session
    const timestamp = Date.now();
    
    // Create a new session with a better default name to help it show up in history
    // Remove the third parameter (userApiKeyForNewChatNameGen)
    const newSession = createNewSession([], modelIdToUse);
    
    // Make sure it has a name even before AI naming
    newSession.name = `Chat ${new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    
    // Update state with the new session
    setCurrentSession(newSession);
    setMessages(newSession.messages);
    setInputMessage('');
    setSelectedFiles([]);
    setCurrentAttachedFilesData([]);
    setShowPromptWithCustomSense(false); // Reset the prompt with custom change state
    setShowPromptForMicrostock(false); // Reset the prompt for microstock state
    currentApiKeyIndexRef.current = 0;
    
    // Save session ID to localStorage for next load
    if (userIdForHistory && newSession.id && newSession.id.startsWith(userIdForHistory + '_')) {
      const lastActiveSessionIdKey = LAST_ACTIVE_SESSION_ID_KEY_PREFIX + userIdForHistory;
      try {
        localStorage.setItem(lastActiveSessionIdKey, newSession.id);
        // console.log(`handleNewChat: Set ${newSession.id} as last active session for user ${userIdForHistory}`);
      } catch (error) {
        // console.warn(`handleNewChat: Error setting last active session ID:`, error);
      }
      
      // Explicitly save the new empty session to ensure it appears in history
      // console.log('Explicitly saving new empty session to history:', newSession.id);
      
      // Make sure to save with name generation enabled (true) to ensure it shows up in history properly
      const savedSession = await saveSession(newSession, true);
      // console.log('New empty session saved successfully to history:', savedSession.id);
      
      // Force refresh history UI immediately
      const historyEvent = new CustomEvent('history-updated', {
        detail: { sessionId: savedSession.id, force: true, source: 'new_chat' }
      });
      window.dispatchEvent(historyEvent);
    } else {
      // console.warn('handleNewChat: Invalid session ID or missing userIdForHistory:', newSession.id, userIdForHistory);
    }
    
    if (isMobile) setIsHistoryPanelOpen(false);
  }, [createNewSession, userIdForHistory, isMobile, profile, saveSession]);

  const handleSelectSession = useCallback(async (sessionId: string) => {
    // console.log(`ChatPage: handleSelectSession called for session ${sessionId}`);
    initialSessionLoadAttemptedRef.current = true; // Mark that we've attempted to load a session
    
    if (!userIdForHistory) {
      console.error("ChatPage: handleSelectSession - No userIdForHistory available");
      toast({ 
        title: "Error Loading Chat", 
        description: "User information not available. Please try again.", 
        variant: "destructive" 
      });
      return;
    }

    // Validate session ID format
    if (!sessionId.startsWith(userIdForHistory + '_')) {
      // console.warn(`ChatPage: handleSelectSession - Invalid session ID format: ${sessionId}`);
        localStorage.removeItem(LAST_ACTIVE_SESSION_ID_KEY_PREFIX + userIdForHistory);
        handleNewChat();
        return;
    }

    try {
      setIsLoading(true); // Show loading state while fetching the session
    const selected = await getSession(sessionId);
      
      if (!selected) {
        console.error(`ChatPage: handleSelectSession - Session not found: ${sessionId}`);
        toast({ 
          title: "Chat Not Found", 
          description: "The selected chat could not be loaded. It may have been deleted.", 
          variant: "destructive" 
        });
        handleNewChat();
        return;
      }
      
    if (selected && selected.id === sessionId && selected.userId === userIdForHistory) {
        // console.log(`ChatPage: handleSelectSession - Successfully loaded session: ${sessionId}`);
        
      // Ensure no messages are in a loading state when loading a session from history
      const migratedMessages = ensureMessagesHaveUniqueIds(selected.messages).map(msg => ({
        ...msg,
        isLoading: false, // Reset loading state for all messages in the chat history
        isError: msg.isError // Preserve the error state from the saved message
      }));
        
      const updatedSession = { ...selected, messages: migratedMessages };
      setCurrentSession(updatedSession);
        setMessages(migratedMessages); // Set messages directly to ensure UI updates
        
      const lastActiveSessionIdKey = LAST_ACTIVE_SESSION_ID_KEY_PREFIX + userIdForHistory;
      localStorage.setItem(lastActiveSessionIdKey, sessionId);
        
        // Reset other session-related state
        currentApiKeyIndexRef.current = 0;
        setActiveActionButton(null);
        setInputMessage(''); // Clear input field when switching sessions
        
        // Show success toast if switching between sessions (not just initial load)
        if (currentSession && currentSession.id !== sessionId) {
          toast({
            title: "Chat Loaded",
            description: `Loaded "${selected.name || 'Untitled Chat'}"`,
            duration: 2000
          });
        }
    } else {
        // console.warn(`ChatPage: handleSelectSession - Session validation failed: ${sessionId}`);
        toast({ 
          title: "Invalid Chat Session", 
          description: "The selected chat data appears to be corrupted. Starting a new chat.", 
          variant: "destructive" 
        });
        localStorage.removeItem(LAST_ACTIVE_SESSION_ID_KEY_PREFIX + userIdForHistory);
        handleNewChat();
    }
    } catch (error) {
      console.error(`ChatPage: handleSelectSession - Error loading session ${sessionId}:`, error);
      toast({ 
        title: "Error Loading Chat", 
        description: "An error occurred while loading the selected chat.", 
        variant: "destructive" 
      });
      handleNewChat();
    } finally {
      setIsLoading(false);
      
      // Close the history panel on mobile after selecting a session
      if (isMobile) {
        setIsHistoryPanelOpen(false);
      }
    }
  }, [getSession, ensureMessagesHaveUniqueIds, userIdForHistory, isMobile, handleNewChat, toast, currentSession]);

  const handleDeleteSession = useCallback((sessionId: string) => {
    deleteSession(sessionId);
    if (currentSession?.id === sessionId) {
      handleNewChat();
    }
  }, [deleteSession, currentSession?.id, handleNewChat]);

  const readFileAsDataURL = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const readFileAsText = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsText(file);
    });
  };

  const processFilesForAI = async (files: File[]): Promise<AttachedFile[]> => {
    // Process files in parallel for faster reads
    const filePromises = files.map(async (file) => {
      const basicInfo: AttachedFile = { name: file.name, type: file.type, size: file.size };
      if (file.type.startsWith('image/')) {
        try { basicInfo.dataUri = await readFileAsDataURL(file); } catch (e) { console.error("Error reading image file:", e); }
      } else if (file.type === 'text/plain' || file.type === 'text/markdown' || file.type === 'application/json') {
        try { basicInfo.textContent = await readFileAsText(file); } catch (e) { console.error("Error reading text file:", e); }
      }
      return basicInfo;
    });
    return Promise.all(filePromises);
  };

  const messagesRef = useRef(messages);
  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  const handleSendMessage = useCallback(async (
    messageTextParam: string,
    actionTypeParam: ActionType,
    notesParam?: string,
    attachedFilesDataParam?: AttachedFile[],
    isUserMessageEdit: boolean = false,
    isRegenerationCall: boolean = false,
    messageIdToUpdate?: string, // ID of the assistant message to update (for regeneration)
    userMessageIdForAiPrompting?: string, // ID of the user message that prompted this, especially for edits
    isCustomMessageParam?: boolean, // Whether this is a custom message
    actionTypeOverride?: ActionType // Override action type (used for message editing with a new action)
  ) => {
    if (profileLoading) {
      toast({ title: "Profile Loading", description: "Please wait while your profile data loads.", duration: 3000 });
        return;
    }
    if (!profile) {
      toast({ title: "Profile Required", description: "Please set up your profile before chatting.", duration: 3000, variant: "destructive" });
      return;
    }
    if (!currentSession) {
      toast({ title: "Session Not Ready", description: "Please wait for your session to initialize.", duration: 3000 });
        return;
    }
    
    // Determine action type - use provided or fall back to last selected if available
    // For normal messages, use the provided actionTypeParam
    // For edited messages, regeneration, or when no actionTypeParam is provided,
    // fall back to the last selected action button if available, otherwise default to 'processMessage'
    const determineActionType = (): ActionType => {
      /**
       * Action Button Selection Logic:
       * 
       * 1. For direct user actions (clicking a button):
       *    - Use the selected action type
       *    - Remember this selection for future fallbacks
       * 
       * 2. For message regeneration or editing:
       *    - If the original action was 'processMessage' (Chat), check if we have a better action to use
       *    - If we have a remembered action button, use that instead
       *    - This provides continuity in the conversation flow and preserves specialized behaviors
       * 
       * 3. Default Behavior:
       *    - If no explicit or remembered action is available, default to 'processMessage'
       *    - This ensures basic functionality even if no action was ever selected
       * 
       * 4. The 'Chat' button is never auto-selected:
       *    - It must be explicitly clicked by the user to become the remembered action
       */

      // If action type override is provided, use it (for edited messages with changed action)
      if (actionTypeOverride) {
        return actionTypeOverride;
      }
      
      // If an explicit action type is provided and not 'processMessage', use it and update last selected
      // If an explicit action type is provided and not 'processMessage', use it and update last selected
      if (actionTypeParam && actionTypeParam !== 'processMessage') {
        // Only update lastSelectedActionButton if this is a direct user action (not regeneration/edit)
        if (!isUserMessageEdit && !isRegenerationCall) {
          setLastSelectedActionButton(actionTypeParam);
        }
        return actionTypeParam;
      }
      
      // For regeneration or edits without explicit action type, use last selected or default
      if (isUserMessageEdit || isRegenerationCall || actionTypeParam === 'processMessage') {
        return lastSelectedActionButton || 'processMessage';
      }
      
      // Default fallback
      return actionTypeParam;
    };
    
    const currentActionType = determineActionType();
    
    // Update active button for UI highlighting (only for direct user actions)
    if (!isUserMessageEdit && !isRegenerationCall) {
      setActiveActionButton(currentActionType);
      
      // Reset active button after a short delay
      setTimeout(() => {
        setActiveActionButton(null);
      }, 500);
    }

    if (!isRegenerationCall && !isUserMessageEdit) {
        currentApiKeyIndexRef.current = 0;
    }

    const userProfile = profile;
    const availableUserApiKeys = userProfile.geminiApiKeys?.filter(key => key && key.trim() !== '') || [];
    let apiKeyToUseThisTurn: string | undefined;

    if (availableUserApiKeys.length > 0) {
        apiKeyToUseThisTurn = availableUserApiKeys[currentApiKeyIndexRef.current % availableUserApiKeys.length];
    }

    const userMessageContent = messageTextParam.trim();
    const currentNotes = notesParam;
    const isCustom = isCustomMessageParam ?? isCustomMessage;

    const filesToSendWithThisMessage = (isRegenerationCall && attachedFilesDataParam) ? attachedFilesDataParam
                                      : (isUserMessageEdit && attachedFilesDataParam) ? attachedFilesDataParam
                                      : [...currentAttachedFilesData];

    if (currentActionType === 'checkMadeDesigns') {
        const hasImage = filesToSendWithThisMessage.some(f => f.type?.startsWith('image/') && f.dataUri);
        if(!hasImage) {
            toast({ title: "No Design Attached", description: `Please attach a design image to use the 'Check Designs' feature.`, variant: "destructive" });
            return;
        }
    }

    const modelIdToUse = userProfile.selectedGenkitModelId || DEFAULT_MODEL_ID;

    let promptedByMsgIdForNewAssistant: string | undefined = userMessageIdForAiPrompting;
    let userMessageIdForCurrentInteraction: string | undefined = userMessageIdForAiPrompting;
    let assistantMessageIdToUse: string;

    if (!isUserMessageEdit && !messageIdToUpdate && (userMessageContent.trim() !== '' || filesToSendWithThisMessage.length > 0)) {
      const userMessageToDisplay = isCustom ? `[Custom Message] ${userMessageContent}` : userMessageContent;
      userMessageIdForCurrentInteraction = addMessage(
        'user', 
        userMessageToDisplay || `Attached ${filesToSendWithThisMessage.length} file(s)${currentNotes ? ` (Notes: ${currentNotes})` : ''}`, 
        filesToSendWithThisMessage,
        false, // isLoading
        false, // isError
        undefined, // originalRequest
        undefined, // promptedByMessageId
        currentActionType // Add action type
      );
      promptedByMsgIdForNewAssistant = userMessageIdForCurrentInteraction;
    } else if (messageIdToUpdate && !isUserMessageEdit) { // Assistant regeneration
        const regeneratedAssistantMsg = messagesRef.current.find(m => m.id === messageIdToUpdate);
        promptedByMsgIdForNewAssistant = regeneratedAssistantMsg?.promptedByMessageId;
        userMessageIdForCurrentInteraction = promptedByMsgIdForNewAssistant;
    } else if (isUserMessageEdit) { // User message was edited
        promptedByMsgIdForNewAssistant = userMessageIdForCurrentInteraction; // userMessageIdForCurrentInteraction is editedUserMessageId
    }


    const requestParamsForRegeneration: ChatMessage['originalRequest'] = {
        actionType: currentActionType, messageText: userMessageContent,
        notes: currentNotes, attachedFilesData: filesToSendWithThisMessage,
        messageIdToRegenerate: (messageIdToUpdate && !isUserMessageEdit) ? messageIdToUpdate : undefined
    };


    if (messageIdToUpdate && !isUserMessageEdit) {
        assistantMessageIdToUse = messageIdToUpdate;
        updateMessageById(assistantMessageIdToUse, 'Processing...', true, false, requestParamsForRegeneration, promptedByMsgIdForNewAssistant);
    } else {
        assistantMessageIdToUse = addMessage('assistant', 'Processing...', [], true, false, requestParamsForRegeneration, promptedByMsgIdForNewAssistant);
    }

    if (!isRegenerationCall && !isUserMessageEdit) {
        setInputMessage('');
        setSelectedFiles([]);
        setCurrentAttachedFilesData([]);
        setIsCustomMessage(false); // Reset custom checkbox
        if (fileInputRef.current) fileInputRef.current.value = '';
    }

    setIsLoading(true);

    setTimeout(async () => {
        let finalAiResponseContent: ChatMessageContentPart[] = [];
        let aiCallError: any = null;

        try {
          const baseInput = {
            userName: userProfile.name, communicationStyleNotes: userProfile.communicationStyleNotes || '',
            modelId: modelIdToUse, userApiKey: apiKeyToUseThisTurn,
          };
          const filesForFlow = filesToSendWithThisMessage.map(f => ({ name: f.name, type: f.type, dataUri: f.dataUri, textContent: f.textContent, size: f.size }));

          const historyMessagesToConsider = messagesRef.current.filter(msg => {
            if (msg.id === assistantMessageIdToUse) return false;
            if (promptedByMsgIdForNewAssistant && msg.id === promptedByMsgIdForNewAssistant && !isUserMessageEdit && !messageIdToUpdate) return false;
            return true;
          });

          const chatHistoryForAI = historyMessagesToConsider
            .slice(-10)
            .map(msg => ({
              role: msg.role === 'user' ? ('user'as const) : ('assistant'as const),
              text: getMessageText(msg.content)
            }))
            .filter(msg => msg.text.trim() !== '' && (msg.role === 'user' || msg.role === 'assistant'));

          // Handle custom message flow if isCustom flag is true
          if (isCustom) {
            // Extract the original client message and custom instruction
            // The userMessageContent is the custom instruction from the designer
            // We need to find the client's original message that this instruction is for
            
            // If we have history, use the last client message as context
            const lastClientMessageInHistory = chatHistoryForAI.filter(msg => msg.role === 'user').pop();
            const clientMessageForContext = lastClientMessageInHistory?.text || userMessageContent;
            
            console.log(`Using model ID for custom instruction: ${modelIdToUse}`);
            console.log(`Using API key (exists): ${!!apiKeyToUseThisTurn}`);
            
            // Custom instruction is whatever the designer entered
            const customInstructionInput: ProcessCustomInstructionInput = {
              ...baseInput,
              clientMessage: clientMessageForContext,
              customInstruction: userMessageContent,
              attachedFiles: filesForFlow, 
              chatHistory: chatHistoryForAI,
              userName: userProfile.name,
              communicationStyleNotes: userProfile.communicationStyleNotes || '',
              userApiKey: apiKeyToUseThisTurn,
              modelId: modelIdToUse,
              useAlternativeImpl: userProfile.useAlternativeAiImpl || false,
              useFirebaseAI: userProfile.useFirebaseAI || false, // Pass useFirebaseAI
              firebaseApp: firebaseAppInstance // Pass Firebase app instance
            };
            
            // Call the custom instruction flow
            const customOutput = await processCustomInstruction(customInstructionInput);
            
            // Format the output as a special custom response message
            finalAiResponseContent = [
              { 
                type: 'custom',  
                title: customOutput.title,
                text: customOutput.response 
              }
            ];
          }
          else if (currentActionType === 'processMessage') {
            try {
              const pmInput: ProcessClientMessageInput = {
                ...baseInput, clientMessage: userMessageContent,
                attachedFiles: filesForFlow, chatHistory: chatHistoryForAI
              };
              const pmOutput = await processClientMessage(pmInput);
              finalAiResponseContent.push({ type: 'text', title: 'Analysis', text: pmOutput.analysis });
              finalAiResponseContent.push({ type: 'text', title: 'Simplified Request', text: pmOutput.simplifiedRequest });
              finalAiResponseContent.push({ type: 'text', title: 'Step-by-Step Approach', text: pmOutput.stepByStepApproach });
              finalAiResponseContent.push({ type: 'translation_group', title: 'Bengali Translation', bengali: { analysis: pmOutput.bengaliTranslation } });

              const repliesSection: ChatMessageContentPart = {
                type: 'suggested_replies',
                title: 'Suggested Replies',
                suggestions: {
                  english: pmOutput.suggestedEnglishReplies || [],
                  bengali: pmOutput.suggestedBengaliReplies || []
                }
              };
              finalAiResponseContent.push(repliesSection);
            }
            catch (error) {
              console.error("Error processing client message:", error);
              aiCallError = error;
            }
          }
          // Handle promptToReplicate action directly in the chat interface
          else if (currentActionType === 'promptToReplicate') {
            try {
              // Check if we have attached image files
              const hasImageFiles = filesForFlow.some(file => file.type?.startsWith('image/') && file.dataUri);
              
              if (!hasImageFiles) {
                // If no images are attached, respond with instructions
                finalAiResponseContent.push({ 
                  type: 'text', 
                  title: 'Awaiting Images', 
                  text: 'Please upload one or more images to generate AI prompts for replication. I need to see the images you want to analyze before I can create detailed prompts.' 
                });
              } else {
                // If images are attached, process them with the promptToReplicate flow
                const result = await promptToReplicate({
                  imageDataUris: filesForFlow.filter(file => file.type?.startsWith('image/') && file.dataUri).map(file => file.dataUri as string),
                  userName: userProfile.name,
                  userApiKey: apiKeyToUseThisTurn,
                  modelId: modelIdToUse,
                });
                
                // Add each image and its prompts as separate content parts
                for (const imagePrompt of result.imagePrompts) {
                  finalAiResponseContent.push({
                    type: 'prompt_tabs',
                    title: 'Image Prompts',
                    imageDataUri: imagePrompt.imageDataUri,
                    exactReplicationPrompt: imagePrompt.exactReplicationPrompt,
                    similarWithTweaksPrompt: imagePrompt.similarWithTweaksPrompt,
                    sameNichePrompt: imagePrompt.sameNichePrompt
                  });
                }
              }
            } catch (error) {
              console.error("Error in promptToReplicate flow:", error);
              aiCallError = error;
              
              finalAiResponseContent = [{
                type: 'text',
                title: 'Error Processing Images',
                text: `There was an error generating prompts: ${error instanceof Error ? error.message : String(error)}. Please try again with different images.`
              }];
              }
            }
          else if (currentActionType === 'analyzeRequirements') {
            const requirementsInput: AnalyzeClientRequirementsInput = { ...baseInput, clientMessage: userMessageContent, attachedFiles: filesForFlow, chatHistory: chatHistoryForAI };
            const requirementsOutput: AnalyzeClientRequirementsOutput = await analyzeClientRequirements(requirementsInput);
            
            // Add the BilingualSplitView component for displaying the analysis
            finalAiResponseContent.push({
              type: 'bilingual_analysis',
              keyPoints: {
                english: requirementsOutput.keyPointsEnglish,
                bengali: requirementsOutput.keyPointsBengali
              },
              detailedRequirements: {
                english: requirementsOutput.detailedRequirementsEnglish,
                bengali: requirementsOutput.detailedRequirementsBengali
              },
              designMessage: {
                english: requirementsOutput.designMessageEnglish,
                bengali: requirementsOutput.designMessageBengali
              },
              nicheAndAudience: {
                english: requirementsOutput.designNicheAndAudienceEnglish,
                bengali: requirementsOutput.designNicheAndAudienceBengali
              },
              imageAnalysis: {
                english: requirementsOutput.imageAnalysisEnglish,
                bengali: requirementsOutput.imageAnalysisBengali
              },
              designItems: {
                english: requirementsOutput.designItemsEnglish,
                bengali: requirementsOutput.designItemsBengali
              }
            });
          } else if (currentActionType === 'generateEngagementPack') {
            const engagementInput: GenerateEngagementPackInput = {
              ...baseInput, clientMessage: userMessageContent, designerName: userProfile.name,
              designerRawStatement: userProfile.rawPersonalStatement || '',
              designerCommunicationStyle: userProfile.communicationStyleNotes || '',
              attachedFiles: filesForFlow, chatHistory: chatHistoryForAI,
            };
            const packOutput = await generateEngagementPack(engagementInput);
            
            // Section 1: Personal Information (using AI-generated content)
            finalAiResponseContent.push({ 
              type: 'code', 
              title: '1. Personal Information:', 
              code: packOutput.personalizedIntroduction
            });
            
            // Section 2: Brief Reply (using AI-generated content)
            const clientName = packOutput.clientGreetingName !== 'there' ? packOutput.clientGreetingName : 'there';
            finalAiResponseContent.push({ 
              type: 'code', 
              title: '2. Brief Reply:', 
              code: packOutput.jobReplyToClient
            });
            
            // Section 3: Suggestions (keep with emoji formatting as specified)
            let suggestionsText = `Suggested Budget: 💰 ${packOutput.suggestedBudget}\n\n`;
            suggestionsText += `Suggested Timeline: ⏱️ ${packOutput.suggestedTimeline}\n\n`;
            suggestionsText += `Suggested Software: 🛠️ ${packOutput.suggestedSoftware}`;
            finalAiResponseContent.push({ type: 'text', title: '3. Suggestions:', text: suggestionsText });
            
            if (packOutput.clarifyingQuestions && packOutput.clarifyingQuestions.length > 0) {
              // Section 4: Clarifying Questions (keep with emoji formatting as specified)
              finalAiResponseContent.push({ type: 'text', title: '4. Clarifying Questions to Ask Client 🤔:', text: " "});
              packOutput.clarifyingQuestions.forEach((q, index) => {
                finalAiResponseContent.push({ type: 'code', title: `Question ${index + 1}`, code: q });
              });
              
              // Section 5: Reply with questions (using AI-generated content)
              const replyWithQuestionsContent = `Hi ${clientName},\n\n${packOutput.personalizedIntroduction}\n\nTo get started and make sure the design fits your vision perfectly, could you please answer a few quick questions?\n\n${packOutput.clarifyingQuestions.join('\n')}\n\nLooking forward to your answers and to creating exactly what you need!\n\nBest regards,\nB. Majnu`;
              
              finalAiResponseContent.push({ 
                type: 'code', 
                title: '5. Reply with questions.', 
                code: replyWithQuestionsContent 
              });
            }
          } else if (currentActionType === 'generateDesignPrompts') {
            // Use last design ideas from assistant as input for prompt generation if available
            let designIdeasText = userMessageContent;
            const lastDesignIdeasMsg = historyMessagesToConsider
                .slice().reverse()
                .find(msg => Array.isArray(msg.content) && msg.content.some(part => part.type === 'design_ideas_group'));
            if (lastDesignIdeasMsg) {
              designIdeasText = getMessageText(lastDesignIdeasMsg.content);
            }
            const promptsInput: GenerateDesignPromptsInput = {
              ...baseInput,
              designInputText: designIdeasText,
            };
            const promptsOutput = await generateDesignPrompts(promptsInput);

            // Destructure prompts output to include search keywords
            const { searchKeywords, graphicsPrompts, typographyPrompts, typographyWithGraphicsPrompts } = promptsOutput;

            // Display search keywords as clickable links
            if (searchKeywords && searchKeywords.length > 0) {
              finalAiResponseContent.push({
                type: 'search_keywords',
                title: 'Web Search Keywords',
                keywords: searchKeywords.map(keyword => ({
                  text: keyword,
                  url: `https://www.google.com/search?q=${encodeURIComponent(keyword)}`
                })),
              });
            }

            const promptsData: { category: string, prompts: string[] }[] = [];
            if (graphicsPrompts?.length > 0) {
              promptsData.push({ category: 'Graphics', prompts: graphicsPrompts });
            }
            if (typographyPrompts?.length > 0) {
              promptsData.push({ category: 'Typography', prompts: typographyPrompts });
            }
            if (typographyWithGraphicsPrompts?.length > 0) {
              promptsData.push({ category: 'Mixed', prompts: typographyWithGraphicsPrompts });
            }

            if (promptsData.length > 0) {
              finalAiResponseContent.push({
                type: 'design_prompts_tabs',
                title: 'AI Image Generation Prompts',
                promptsData: promptsData,
              });
            }
          } else if (currentActionType === 'checkMadeDesigns') {
            const designFile = filesForFlow.find(f => f.type?.startsWith('image/') && f.dataUri);
            if (!designFile || !designFile.dataUri) {
              finalAiResponseContent = [{type: 'text', text: "Error: CheckMadeDesigns was called without a design image. Please attach an image."}];
              aiCallError = new Error("Missing design image for CheckMadeDesigns in deferred call.");
              if(isMounted.current) toast({ title: "Image Required", description: "Please attach a design image to use the 'Check Designs' feature.", variant: "destructive" });
            } else {
                const checkInput: CheckMadeDesignsInput = {
                ...baseInput, clientPromptOrDescription: userMessageContent || "Client requirements as per conversation history.",
                designToCheckDataUri: designFile.dataUri, chatHistory: chatHistoryForAI,
                };
                const result: CheckMadeDesignsOutput = await checkMadeDesigns(checkInput);
                finalAiResponseContent.push({ type: 'text', title: 'Design Check Summary (Bangla)', text: result.overallSummary });
                finalAiResponseContent.push({ type: 'text', title: 'ভুল অবজেক্ট/উপাদান', text: result.mistakeAnalysis.wrongObjectOrElements });
                finalAiResponseContent.push({ type: 'text', title: 'ভুল অবস্থান', text: result.mistakeAnalysis.wrongPositions });
                finalAiResponseContent.push({ type: 'text', title: 'টাইপিং ভুল', text: result.mistakeAnalysis.typingMistakes });
                finalAiResponseContent.push({ type: 'text', title: 'ভুল রঙ', text: result.mistakeAnalysis.wrongColors });
                finalAiResponseContent.push({ type: 'text', title: 'ভুল সাইজ', text: result.mistakeAnalysis.wrongSizes });
                finalAiResponseContent.push({ type: 'text', title: 'অনুপস্থিত উপাদান', text: result.mistakeAnalysis.missingElements });
                finalAiResponseContent.push({ type: 'text', title: 'অন্যান্য ভুল', text: result.mistakeAnalysis.otherMistakes });
            }
          } else if (currentActionType === 'checkBestDesign') {
            // Check if there are design images attached to analyze
            const designFiles = filesForFlow.filter(f => f.type?.startsWith('image/') && f.dataUri);
            
            if (designFiles.length < 2) {
              finalAiResponseContent = [{
                type: 'text', 
                text: "Error: CheckBestDesign was called with fewer than 2 design images. Please attach multiple design images to compare."
              }];
              aiCallError = new Error("Insufficient design images for CheckBestDesign in deferred call.");
              if(isMounted.current) {
                // Use setTimeout to avoid React state updates during render
                setTimeout(() => {
                  if(isMounted.current) {
                    safeToast({ 
                      title: "Multiple Images Required", 
                      description: "Please attach at least 2 design images to use the 'Check the best design' feature.", 
                      variant: "destructive" 
                    });
                  }
                }, 0);
              }
            } else {
              try {
                // Display a notification about the number of designs being analyzed
                if(isMounted.current) {
                  setTimeout(() => {
                    if(isMounted.current) {
                      toast({ 
                        title: "Analyzing Designs", 
                        description: `Evaluating ${designFiles.length} designs to find the best options...`, 
                        duration: 5000 
                      });
                    }
                  }, 0);
                }
                
                // Update the assistant message to show progress
                updateMessageById(assistantMessageIdToUse, [{ 
                  type: 'text', 
                  text: `Analyzing ${designFiles.length} designs. This may take a minute for larger sets...` 
                }], true, false, requestParamsForRegeneration, promptedByMsgIdForNewAssistant);
                
                // Create design objects from all attached files (no limit)
                // We'll optimize image data handling for large sets to avoid "Failed to fetch" errors
                const designs = designFiles.map((file, index) => {
                  // If dealing with many designs, we can compress or resize the images
                  // to reduce payload size when there are more than 8 designs
                  let optimizedDataUri = file.dataUri!;
                  
                  // For very large sets, we can add a check here to optimize the images
                  // if (designFiles.length > 8) {
                  //   optimizedDataUri = compressImageDataUri(file.dataUri!);
                  // }
                  
                  return {
                    id: `design_${index + 1}`,
                    imageDataUri: optimizedDataUri,
                    generatedPrompt: userMessageContent || undefined,
                    createdAt: new Date(),
                    metadata: { 
                      filename: file.name, 
                      fileType: file.type, 
                      fileSize: file.size,
                      originalIndex: index
                    }
                  };
                });
                
                // Process in smaller batches if too many designs
                if (designFiles.length > 10) {
                  if(isMounted.current) {
                    setTimeout(() => {
                      if(isMounted.current) {
                        toast({ 
                          title: "Processing Large Set", 
                          description: `Processing ${designFiles.length} designs in batches for better reliability.`, 
                          duration: 5000 
                        });
                      }
                    }, 0);
                  }
                }
                
                // Prepare input for the checkBestDesign flow
                // Destructure only the relevant fields from baseInput (omit communicationStyleNotes)
                const { userName, modelId, userApiKey } = baseInput;
                const bestDesignInput: CheckBestDesignInput = {
                  userName,
                  modelId,
                  userApiKey,
                  designs,
                  clientRequirements: userMessageContent || "Client requirements as per conversation history.",
                  chatHistory: chatHistoryForAI,
                };
                
                // Removed design count limit so that all uploaded designs are processed
                // Call the checkBestDesign flow with a timeout to prevent hanging
                // Create a promise that rejects after 120 seconds
                const timeoutPromise = new Promise<never>((_, reject) => {
                  const timeoutId = setTimeout(() => {
                    clearTimeout(timeoutId);
                    reject(new Error('Design evaluation timed out after 120 seconds. Please try again with fewer designs.'));
                  }, 120000); // 120 second timeout
                });
                
                // Race the actual API call against the timeout
                try {
                  console.log("Calling checkBestDesign with input:", JSON.stringify({
                    ...bestDesignInput,
                    designs: bestDesignInput.designs.map((d: any) => ({
                      ...d,
                      imageDataUri: `[DataURI length: ${d.imageDataUri.length}]` // Don't log full data URIs
                    }))
                  }));
                  
                  const bestDesignResult = await Promise.race([
                    checkBestDesign(bestDesignInput),
                    timeoutPromise
                  ]);
                  
                  // Add a brief text summary
                  finalAiResponseContent.push({ 
                    type: 'text', 
                    title: '🏆 Design Evaluation Summary', 
                    text: bestDesignResult.evaluationSummary 
                  });
                  
                  // Create a mapping of designId to original image data to pass to the UI
                  const designImagesMap: Record<string, string> = {};
                  designs.forEach(design => {
                    designImagesMap[design.id] = design.imageDataUri;
                  });
                  
                  // Add the specialized top designs UI component with image data
                  finalAiResponseContent.push({
                    type: 'top_designs',
                    title: 'Top Ranked Designs',
                    data: {
                      ...bestDesignResult,
                      // Add the design images map for the UI component to use
                      designImages: designImagesMap
                    }
                  });
                } catch (error) {
                  console.error("Error in checkBestDesign flow:", error);
                  aiCallError = error;
                  
                  // Provide more specific guidance based on the error type
                  let errorMessage = '';
                  
                  if (error instanceof TypeError && error.message === 'Failed to fetch') {
                    errorMessage = 'Network error while processing designs. This usually happens when trying to process too many large images at once. Try with fewer designs or smaller image files.';
                    
                    // Show a helpful toast using safeToast to avoid React state update errors
                    if(isMounted.current) {
                      safeToast({ 
                        title: "Network Error", 
                        description: "Too much data to process at once. Try with fewer or smaller images.", 
                        variant: "destructive",
                        duration: 7000
                      });
                    }
                  } else if (error instanceof Error && error.message.includes('timed out')) {
                    errorMessage = 'Design evaluation timed out. This usually happens with very complex designs or too many designs at once. Try with fewer designs (we recommend 15 or fewer for best results).';
                  } else {
                    errorMessage = `Error evaluating designs: ${error instanceof Error ? error.message : String(error)}`;
                  }
                  
                  finalAiResponseContent = [{
                    type: 'text',
                    text: errorMessage
                  }];
                }
              } catch (error) {
                console.error("Error in checkBestDesign flow:", error);
                aiCallError = error;
                
                // Provide more specific guidance based on the error type
                let errorMessage = '';
                
                if (error instanceof TypeError && error.message === 'Failed to fetch') {
                  errorMessage = 'Network error while processing designs. This usually happens when trying to process too many large images at once. Try with fewer designs or smaller image files.';
                  
                  // Show a helpful toast using safeToast to avoid React state update errors
                  if(isMounted.current) {
                    safeToast({ 
                      title: "Network Error", 
                      description: "Too much data to process at once. Try with fewer or smaller images.", 
                      variant: "destructive",
                      duration: 7000
                    });
                  }
                } else if (error instanceof Error && error.message.includes('timed out')) {
                  errorMessage = 'Design evaluation timed out. This usually happens with very complex designs or too many designs at once. Try with fewer designs (we recommend 15 or fewer for best results).';
                } else {
                  errorMessage = `Error evaluating designs: ${error instanceof Error ? error.message : String(error)}`;
                }
                
                finalAiResponseContent = [{
                  type: 'text',
                  text: errorMessage
                }];
              }
            }
          } else if (currentActionType === 'generateEditingPrompts') {
            let designToEditDataUriForFlow: string | undefined = undefined;
            const currentDesignFile = filesToSendWithThisMessage.find(f => f.type?.startsWith('image/') && f.dataUri);
            if (currentDesignFile && currentDesignFile.dataUri) {
                designToEditDataUriForFlow = currentDesignFile.dataUri;
            }

            const editingInput: GenerateEditingPromptsInput = {
                ...baseInput, designToEditDataUri: designToEditDataUriForFlow,
                clientInstructionForEditingTheme: userMessageContent,
                chatHistory: chatHistoryForAI,
            };
            const result: GenerateEditingPromptsOutput = await generateEditingPrompts(editingInput);
            if (result.editingPrompts && result.editingPrompts.length > 0) {
                if (result.editingPrompts.length === 1 && result.editingPrompts[0].type === "error_no_image_found") {
                    finalAiResponseContent.push({ type: 'text', title: 'Error', text: result.editingPrompts[0].prompt });
                     if(isMounted.current) toast({ title: "Image Needed", description: result.editingPrompts[0].prompt, variant: "default" });
                } else if (result.editingPrompts.length === 1 && result.editingPrompts[0].type === "error") {
                     finalAiResponseContent.push({ type: 'text', title: 'Error', text: result.editingPrompts[0].prompt });
                     aiCallError = new Error(result.editingPrompts[0].prompt);
                }
                else {
                    result.editingPrompts.forEach(p => {
                        const title = p.type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
                        finalAiResponseContent.push({ type: 'code', title: `Prompt for ${title}`, code: p.prompt });
                    });
                }
            } else { finalAiResponseContent.push({ type: 'text', text: "No editing prompts were generated."}); }
          }
           else if (currentActionType === 'generateDeliveryTemplates' || currentActionType === 'generateRevision') {
            const platformInput: GeneratePlatformMessagesInput = {
              name: userProfile.name, professionalTitle: userProfile.professionalTitle || '',
              services: userProfile.services || [],
              deliveryNotes: currentActionType === 'generateDeliveryTemplates' ? (currentNotes || userMessageContent) : '',
              revisionNotes: currentActionType === 'generateRevision' ? (currentNotes || userMessageContent) : '',
              fiverrUsername: userProfile.fiverrUsername || '',
              customSellerFeedbackTemplate: userProfile.customSellerFeedbackTemplate || '',
              customClientFeedbackResponseTemplate: userProfile.customClientFeedbackResponseTemplate || '',
              messageType: currentActionType === 'generateDeliveryTemplates' ? 'delivery' : 'revision',
              modelId: modelIdToUse, userApiKey: apiKeyToUseThisTurn,
            };
            const platformMessagesOutput = await generatePlatformMessages(platformInput);
            if (platformMessagesOutput.messages && platformMessagesOutput.messages.length > 0) {
                 platformMessagesOutput.messages.forEach(m => {
                    const messageTitle = m.type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
                    finalAiResponseContent.push({ type: 'code', title: messageTitle, code: m.message });
                });
            } else { finalAiResponseContent.push({type: 'text', text: "No platform messages generated."}); }
          }

          if (finalAiResponseContent.length === 0 && !aiCallError) {
            finalAiResponseContent.push({ type: 'text', text: '✅ Done' });
          }

          if (!aiCallError && isMounted.current) {
            updateMessageById(assistantMessageIdToUse, finalAiResponseContent, false, false, requestParamsForRegeneration, promptedByMsgIdForNewAssistant);
          }

          if (promptedByMsgIdForNewAssistant && !aiCallError && isMounted.current) {
            setMessages(prevMsgs => {
                const userMsgIndex = prevMsgs.findIndex(m => m.id === promptedByMsgIdForNewAssistant);
                if (userMsgIndex !== -1 && prevMsgs[userMsgIndex].role === 'user') {
                    const updatedUserMsg = { ...prevMsgs[userMsgIndex], linkedAssistantMessageId: assistantMessageIdToUse };
                    const newMsgs = [...prevMsgs];
                    newMsgs[userMsgIndex] = updatedUserMsg;
                    return ensureMessagesHaveUniqueIds(newMsgs);
                }
                return prevMsgs;
            });
          }

          if (!isRegenerationCall && !isUserMessageEdit && !aiCallError) {
            currentApiKeyIndexRef.current = 0;
          }
        } catch (error: any) {
          aiCallError = error;
          console.error(`ChatPage (handleSendMessage - deferred AI Call): Error for action '${currentActionType}'. API Key Index: ${currentApiKeyIndexRef.current}`, error);
          let errorMessageText = `Sorry, I couldn't process that. AI Error: ${aiCallError.message || 'Unknown error'}`;
          const errorMsgLower = String(aiCallError.message).toLowerCase();

          if (errorMsgLower.includes('500') || errorMsgLower.includes('internal server error')) {
            errorMessageText = `An internal error occurred with the AI service. Please try regenerating the response. Error: ${aiCallError.message || 'Internal Server Error'}`;
            if (isMounted.current) toast({title: "AI Internal Error", description: "The AI service encountered an internal error. Please try regenerating.", variant: "destructive"});
          } else if (errorMsgLower.includes('429') || errorMsgLower.includes('quota') || errorMsgLower.includes('rate limit')) {
            if (availableUserApiKeys.length > 0 && currentApiKeyIndexRef.current < availableUserApiKeys.length - 1) {
              currentApiKeyIndexRef.current++;
              errorMessageText = `The current API key (attempt ${currentApiKeyIndexRef.current}/${availableUserApiKeys.length}) may be rate-limited. Click 'Regenerate' to try the next available key (${currentApiKeyIndexRef.current + 1}/${availableUserApiKeys.length}). Original error: ${aiCallError.message}`;
              if (isMounted.current) toast({title: "API Key Rate Limited", description: `Key ${currentApiKeyIndexRef.current} may be rate-limited. Regenerate to try key ${currentApiKeyIndexRef.current + 1}.`, variant: "default"});
            } else {
              errorMessageText = `All configured API keys (${availableUserApiKeys.length}) seem to have hit rate limits, or the global key is limited. Please check your quotas or try again later. Original error: ${aiCallError.message}`;
              if (isMounted.current) toast({title: "All API Keys Limited", description: "All configured API keys might be rate-limited. Check quotas.", variant: "destructive"});
            }
          } else if (errorMsgLower.includes('api key not valid') || errorMsgLower.includes('invalid api key')) {
             errorMessageText = `The API key used is invalid. Please check your profile settings or the GOOGLE_API_KEY environment variable. Error: ${aiCallError.message}`;
             if (isMounted.current) toast({title: "Invalid API Key", description: "The API key used is invalid. Check profile or .env file.", variant: "destructive"});
          }
          if (isMounted.current) updateMessageById(assistantMessageIdToUse, [{ type: 'text', text: errorMessageText }], false, true, requestParamsForRegeneration, promptedByMsgIdForNewAssistant);
        }

        if (isMounted.current) setIsLoading(false);

        if (currentSession && userIdForHistory && isMounted.current && !aiCallError && currentActionType !== 'checkBestDesign') { // Only save if no AI error
            // Use a functional update with setMessages to get the latest state
            // and then use that latest state for saving.
            setMessages(currentMessagesFromState => {
              const messagesForSave = ensureMessagesHaveUniqueIds(currentMessagesFromState);
              const sessionForSave: ChatSession = {
                  ...currentSession,
                  messages: messagesForSave, 
                  updatedAt: Date.now(),
                  userId: userIdForHistory,
              };
              const apiKeyForNameGen = (profile?.geminiApiKeys && profile.geminiApiKeys.length > 0 && profile.geminiApiKeys[0]) ? profile.geminiApiKeys[0] : undefined;

              const hasDefaultName = !currentSession.name || currentSession.name === "New Chat" || /^Chat \d{1,2}:\d{2}(:\d{2})?\s*(AM|PM)?$/i.test(currentSession.name);
              saveSession(
                  sessionForSave,
                  (!messageIdToUpdate && !isUserMessageEdit) && (sessionForSave.messages.length <= 2 || hasDefaultName)
              ).then((sessionAfterSave: ChatSession) => {
                  if (sessionAfterSave && isMounted.current) {
                      setCurrentSession(prev => {
                          if (prev && prev.id === sessionAfterSave.id) {
                              // Remove driveFileId property reference as it has been removed
                              return { ...prev, name: sessionAfterSave.name };
                          }
                          return prev;
                      });
                  }
              });
              return messagesForSave; // Return the state for setMessages
            });
        }
    }, 0);
  }, [
    addMessage, updateMessageById, profile, currentSession,
    currentAttachedFilesData, saveSession, ensureMessagesHaveUniqueIds,
    userIdForHistory, profileLoading, toast,
    lastSelectedActionButton, messagesRef, // Added messagesRef here
    // Remove syncWithDrive, authUser, googleAccessToken from dependencies
  ]);


  useEffect(() => {
    if (!pendingAiRequestAfterEdit || !isMounted.current) return;

    const { content, attachments, isUserMessageEdit: isEdit, editedUserMessageId, actionType } = pendingAiRequestAfterEdit;

    const run = async () => {
      if (actionType === 'promptWithCustomSense') {
        // Parse designType and description from content
        let designType = 'POD Design';
        let description = content;

        try {
          const typeMatch = content.match(/Design Type:\s*"([^"]+)"/i);
          const descMatch = content.match(/Description:\s*"([^"]+)"/i);
          if (typeMatch) designType = typeMatch[1];
          if (descMatch) description = descMatch[1];
        } catch (_) { /* ignore */ }

        try {
          let placeholderAssistantId: string | null = null; // declare once here

          // Create placeholder assistant message with loading state
          placeholderAssistantId = addMessage(
            'assistant',
            'Processing...',
            [],
            true, // isLoading
            false,
            undefined,
            editedUserMessageId,
            'promptWithCustomSense'
          );

          const promptsResult: PromptWithCustomSenseOutput = await promptWithCustomSense({
            designType,
            description,
            userName: profile?.name,
            userApiKey: profile?.geminiApiKeys ? profile.geminiApiKeys[0] : undefined,
            modelId: profile?.selectedGenkitModelId,
          });

          const assistantParts: ChatMessageContentPart[] = [
            {
              type: 'custom_prompts_tabs',
              title: `${designType} Style Variations`,
              customPrompts: promptsResult.prompts.map(p => ({ title: p.title || 'Generated Prompt', prompt: p.prompt }))
            }
          ];

          // Update placeholder with actual content
          if (placeholderAssistantId) {
            updateMessageById(
              placeholderAssistantId,
              assistantParts,
              false,
              false,
              undefined,
              editedUserMessageId,
              'promptWithCustomSense'
            );
          } else {
            addMessage('assistant', assistantParts, [], false, false, undefined, editedUserMessageId, 'promptWithCustomSense');
          }
        } catch (err) {
          console.error('Failed to regenerate custom prompts:', err);
          if (placeholderAssistantId) {
            updateMessageById(
              placeholderAssistantId,
              'Error regenerating custom prompts. Please try again.',
              false,
              true,
              undefined,
              editedUserMessageId,
              'promptWithCustomSense'
            );
          } else {
            addMessage('assistant', 'Error regenerating custom prompts. Please try again.', [], false, true, undefined, editedUserMessageId, 'promptWithCustomSense');
          }
        }

        setPendingAiRequestAfterEdit(null);
        return;
      }

      // Default behaviour for other action types
      handleSendMessage(
        content,
        'processMessage',
        undefined,
        attachments,
        isEdit,
        false,
        undefined,
        editedUserMessageId,
        isCustomMessage,
        actionType
      );
      setPendingAiRequestAfterEdit(null);
    };

    run();
  }, [pendingAiRequestAfterEdit, handleSendMessage, isCustomMessage, profile, addMessage]);


  const handleRegenerateMessage = useCallback((originalRequestDetailsWithMessageId?: ChatMessage['originalRequest'] & { messageIdToRegenerate: string }) => {
    if (!originalRequestDetailsWithMessageId || !originalRequestDetailsWithMessageId.messageIdToRegenerate) {
        return;
    }
    if (profileLoading) return;
    if (!profile) return;
    if (!currentSession) return;

    if (originalRequestDetailsWithMessageId.actionType && originalRequestDetailsWithMessageId.messageText !== undefined) {
        const { messageIdToRegenerate, ...originalRequest } = originalRequestDetailsWithMessageId;
        
        // Use originalRequest.actionType or fall back to lastSelectedActionButton if it was processMessage
        // This ensures the regeneration uses the most appropriate action type
        const actionToUse = originalRequest.actionType === 'processMessage' && lastSelectedActionButton 
          ? lastSelectedActionButton 
          : originalRequest.actionType;
        
        // Check if this is a custom message by looking at the original user message format
        // User messages that are custom instructions start with "[Custom Message]"
        const isMessageCustom = isCustomMessage || 
          (typeof originalRequest.messageText === 'string' && 
           originalRequest.messageText.startsWith('[Custom Message]'));
        
        if (isMessageCustom) {
          console.log('Regenerating a custom message');
        }
        
        handleSendMessage(
            originalRequest.messageText, 
            actionToUse,
            originalRequest.notes, 
            originalRequest.attachedFilesData,
            false,  // isUserMessageEdit
            true,   // isRegenerationCall
            messageIdToRegenerate, // messageIdToUpdate
            undefined, // userMessageIdForAiPrompting
            isMessageCustom // Use custom flag based on message content or current state
        );
        // Clear input box after regenerating message
        setInputMessage('');
    }
  }, [profileLoading, profile, currentSession, handleSendMessage, lastSelectedActionButton, isCustomMessage, setInputMessage]);


  const handleConfirmEditAndResendUserMessage = useCallback((messageId: string, newContent: string, originalAttachments?: AttachedFile[], newActionType?: ActionType) => {
    setMessages(prevMessages => {
        const messageIndex = prevMessages.findIndex(msg => msg.id === messageId);
        if (messageIndex === -1 || prevMessages[messageIndex].role !== 'user') {
            return prevMessages;
        }

        const targetMessage = { ...prevMessages[messageIndex] };
        const linkedAssistantIdForHistory: string | undefined = targetMessage.linkedAssistantMessageId;

        const currentVersionToArchive: EditHistoryEntry = {
            content: targetMessage.content,
            timestamp: targetMessage.timestamp,
            attachedFiles: targetMessage.attachedFiles,
            actionType: targetMessage.actionType, // Preserve the original action type
            linkedAssistantMessageId: linkedAssistantIdForHistory,
        };

        const updatedEditHistory = [...(targetMessage.editHistory || []), currentVersionToArchive];
        
        const updatedUserMessage: ChatMessage = {
          ...targetMessage,
          content: newContent,
          timestamp: Date.now(),
          attachedFiles: originalAttachments,
          actionType: newActionType || targetMessage.actionType, // Use new action type if provided, otherwise keep existing
          editHistory: updatedEditHistory,
          linkedAssistantMessageId: undefined,
        };

        let messagesUpToEditedAndIncluding = prevMessages.slice(0, messageIndex);
        messagesUpToEditedAndIncluding.push(updatedUserMessage);
        
        if (isMounted.current) {
            setPendingAiRequestAfterEdit({
                content: newContent,
                attachments: originalAttachments,
                isUserMessageEdit: true,
                editedUserMessageId: updatedUserMessage.id,
                actionType: newActionType || targetMessage.actionType // Pass along the action type
            });
        }
        
        return ensureMessagesHaveUniqueIds(messagesUpToEditedAndIncluding);
    });
  }, [ensureMessagesHaveUniqueIds, setMessages, setPendingAiRequestAfterEdit]);


  const handleAction = useCallback((action: ActionType) => {
    if (!profile) {
       return;
    }

    // Handle custom instruction toggle
    if (action === 'custom') {
      setShowCustomInstructionModal(true);
      setActiveActionButton(action);
      setLastSelectedActionButton(action);
      return;
    }

    // Handle search action specially
    if (action === 'search') {
      setIsSearchActive(prev => !prev);
      // Set or reset search query when toggling
      if (!isSearchActive) {
        setSearchQuery('');
      }
      // Highlight the button briefly then clear it
      setActiveActionButton(action);
      setTimeout(() => {
        setActiveActionButton(null);
      }, 500);
       return;
    }
    
    // Handle prompt to replicate specially
    if (action === 'promptToReplicate') {
      // Set this action as the last selected
      setLastSelectedActionButton(action);
      // Highlight this button in the UI
      setActiveActionButton(action);
      
      // Send the prompt to replicate message with attached images directly in the chat
      handleSendMessage(
        "Please analyze these images and generate AI prompts for replication", 
        'promptToReplicate',
        undefined,
        undefined,
        false,
        false,
        undefined,
        undefined,
        false
      );
      
      // Reset highlight after a delay
      setTimeout(() => {
        setActiveActionButton(null);
      }, 500);
      return;
    }
    
    // Handle prompt with custom change specially
    if (action === 'promptWithCustomSense') {
      setShowPromptWithCustomSense(true);
      // Set this action as the last selected
      setLastSelectedActionButton(action);
      // Highlight this button in the UI
      setActiveActionButton(action);
      return;
    }
    
    // Handle prompt for micro stock markets
    if (action === 'promptForMicroStockMarkets') {
      setShowPromptForMicrostock(true);
      // Set this action as the last selected
      setLastSelectedActionButton(action);
      // Highlight this button in the UI
      setActiveActionButton(action);
      return;
    }
    
    // Handle generateDesignPrompts action specially to trigger prompt flow from ideas without user input
    if (action === 'generateDesignPrompts') {
      setLastSelectedActionButton(action);
      setActiveActionButton(action);
      // Log the generateDesignPrompts invocation
      console.log(`BUTTON API generateDesignPrompts -> using last design ideas context, clientMessage="${inputMessage}"`);
      // Trigger prompt generation flow using default ideas context
      handleSendMessage('', action, undefined, undefined, false, false, undefined, undefined, isCustomMessage);
      setInputMessage('');
      return;
    }
    
    // Set this action as the last selected
    setLastSelectedActionButton(action);
    // Highlight this button in the UI
    setActiveActionButton(action);
    
    if (action === 'generateDeliveryTemplates' || action === 'generateRevision') {
      setModalActionType(action);
      setShowNotesModal(true);
    } else {
      handleSendMessage(inputMessage || '', action, undefined, undefined, false, false, undefined, undefined, isCustomMessage);
    }
  }, [inputMessage, handleSendMessage, profile, isCustomMessage, isSearchActive, setActiveActionButton, setLastSelectedActionButton, setInputMessage, toast, selectedDesignItem]);

  const submitModalNotes = () => {
    if (modalActionType) {
      // Pass isCustomMessage to modal actions as well
      handleSendMessage(inputMessage || '', modalActionType, modalNotes, undefined, false, false, undefined, undefined, isCustomMessage);
    }
    setShowNotesModal(false);
    setModalNotes('');
    setModalActionType(null);
  };

  const handleFileSelectAndProcess = useCallback(async (newFiles: File[]) => {
    // Increase the limit for design analysis functions like checkBestDesign
    const fileLimit = 20; // Increased from 5 to 20
    
    const combinedFiles = [...selectedFiles, ...newFiles].slice(0, fileLimit);
    setSelectedFiles(combinedFiles);
    const processedNewFiles = await processFilesForAI(newFiles);
    const uniqueProcessedFiles = new Map<string, AttachedFile>();
    currentAttachedFilesData.forEach(file => {
        uniqueProcessedFiles.set(`${file.name}_${file.size || 0}`, file);
    });
    processedNewFiles.forEach(file => {
        uniqueProcessedFiles.set(`${file.name}_${file.size || 0}`, file);
    });
    setCurrentAttachedFilesData(Array.from(uniqueProcessedFiles.values()).slice(0, fileLimit));
  }, [selectedFiles, currentAttachedFilesData]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) { handleFileSelectAndProcess(Array.from(event.target.files)); }
  };

  const clearSelectedFiles = () => {
    setSelectedFiles([]); setCurrentAttachedFilesData([]);
    if (fileInputRef.current) fileInputRef.current.value = '';
  }

  const handleRemoveFile = (index: number) => {
    const newFiles = [...selectedFiles];
    newFiles.splice(index, 1);
    setSelectedFiles(newFiles);
    
    const newFileData = [...currentAttachedFilesData];
    newFileData.splice(index, 1);
    setCurrentAttachedFilesData(newFileData);
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      if (!isLoading && (inputMessage.trim() || currentAttachedFilesData.length > 0)) {
        handleSendMessage(inputMessage, 'processMessage', undefined, undefined, false, false, undefined, undefined, isCustomMessage);
      }
    }
  };

  const [isDragging, setIsDragging] = useState(false);
  const dropZoneRef = useRef<HTMLDivElement>(null);

  const handleDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault(); event.stopPropagation(); setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault(); event.stopPropagation();
    if (dropZoneRef.current && !dropZoneRef.current.contains(event.relatedTarget as Node)) {
      setIsDragging(false);
    }
  }, []);

  const handleDrop = useCallback(async (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault(); event.stopPropagation(); setIsDragging(false);
    if (event.dataTransfer.files && event.dataTransfer.files.length > 0) {
      await handleFileSelectAndProcess(Array.from(event.dataTransfer.files));
      event.dataTransfer.clearData();
    }
  }, [handleFileSelectAndProcess]);

  const isGoogleUser = useMemo(() => authUser?.providerData.some(p => p.providerId === 'google.com'), [authUser]);

  // No explicit sync buttons needed - Firebase automatically saves chat data after each message
  // and when the session is modified

  // First, define a handleRefreshHistory function near other handler functions
  const handleRefreshHistory = useCallback((fromHistoryPanel = false) => {
    // This will trigger a re-fetch of history metadata
    if (typeof window !== 'undefined' && !fromHistoryPanel) {
      // Create an event to force history refresh
      const refreshEvent = new Event('storage', { bubbles: true });
      window.dispatchEvent(refreshEvent);
      
      // Also trigger a custom event for components listening for history updates
      const historyEvent = new CustomEvent('history-updated', { 
        detail: { force: true, source: 'chatpage' } 
      });
      window.dispatchEvent(historyEvent);
    }
  }, []);

  // Add the new handler function for when custom sense prompts are generated
  const handleCustomSensePromptsGenerated = useCallback(( 
    prompts: PromptWithCustomSenseOutput['prompts'], 
    designType: string, 
    description: string,
    attachedFile?: AttachedFile,
    originalUserMessageId?: string
  ) => {
    if (originalUserMessageId) {
      // update existing user message
      const newContent = `[Prompt with Custom Change] Requested prompts for Design Type: "${designType}". Description: "${description}"`;
      handleConfirmEditAndResendUserMessage(originalUserMessageId, newContent, attachedFile ? [attachedFile] : undefined, 'promptWithCustomSense');
      return;
    }

    const userMessageText = `[Prompt with Custom Change] Requested prompts for Design Type: "${designType}". Description: "${description}"`;
    const userMessageId = addMessage(
      'user',
      userMessageText,
      attachedFile ? [attachedFile] : undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      'promptWithCustomSense'
    );

    // Create assistant content part
    const assistantResponseParts: ChatMessageContentPart[] = [{
      type: 'custom_prompts_tabs',
      title: `${designType} Style Variations`,
      customPrompts: prompts.map(promptItem => ({
        title: promptItem.title || 'Generated Prompt',
        prompt: promptItem.prompt,
      })),
    }];

    addMessage(
      'assistant',
      prompts.length > 0 ? assistantResponseParts : "No prompts were generated for your request.",
      undefined,
      false,
      false,
      undefined,
      userMessageId
    );

    // Persist session
    if (currentSession && userIdForHistory) {
      setMessages(prevMsgs => {
        const updatedMsgs = ensureMessagesHaveUniqueIds(prevMsgs);
        const sessionForSave: ChatSession = {
          ...currentSession,
          messages: updatedMsgs,
          updatedAt: Date.now(),
        };
        saveSession(sessionForSave, false);
        return updatedMsgs;
      });
    }
  }, [addMessage, ensureMessagesHaveUniqueIds, currentSession, saveSession, userIdForHistory, setMessages, handleConfirmEditAndResendUserMessage]);

  // Handler for Microstock results
  const handleMicrostockResultsGenerated = useCallback((
    results: AIPromptWithMetadata[],
    niche: string,
    subNiche?: string,
    description?: string,
    attachedFile?: AttachedFile
  ) => {
    // Create a more structured and visually appealing user message
    const userMessageParts: ChatMessageContentPart[] = [{
      type: 'text',
      title: 'Prompt for Micro Stock Markets',
      text: `I'm looking for **${results.length} prompts** for the following specifications:`
    }, {
      type: 'text',
      text: `**Design/Image Niche:** ${niche}${subNiche ? `\n**Sub-niche:** ${subNiche}` : ''}${description ? `\n\n**Detailed Description:**\n${description}` : ''}`
    }];
    
    // Add user message with the enhanced content and attached file if provided
    const userMessageId = addMessage('user', userMessageParts, attachedFile ? [attachedFile] : undefined);

    // Create the assistant response with the tabs
    const assistantResponseParts: ChatMessageContentPart[] = [{
      type: 'microstock_results_tabs',
      title: `Microstock Prompts: ${niche}`,
      microstockResults: results // Pass the full results array
    }];

    if (results.length > 0) {
      addMessage('assistant', assistantResponseParts, undefined, false, false, undefined, userMessageId);
    } else {
      addMessage('assistant', "No prompts or metadata were generated for your request.", undefined, false, false, undefined, userMessageId);
    }
  }, [addMessage]);


  useEffect(() => {
    if (authLoading || (!currentSession && !profileLoading && !historyHookLoading) ) {
      return;
    }

    // If there's a current session, check if it has no messages
    if (currentSession && currentSession.messages.length === 0) {
      return;
    }

    // If there's no current session, check if the history is loading or empty
    if (!currentSession && historyHookLoading) {
      return;
    }

    // If there's no current session and no history, show a loading message
    if (!currentSession && !historyHookLoading) {
      return;
    }

    // If there's a current session and it's empty, show a loading message
    if (currentSession && currentSession.messages.length === 0) {
      return;
    }

    // If there's a current session and it's not empty, show the messages
    if (currentSession && currentSession.messages.length > 0) {
      return;
    }
  }, [authLoading, currentSession, profileLoading, historyHookLoading]);

  // Add handleStopRegeneration function with the other callback functions
  const handleStopRegeneration = useCallback((messageId: string) => {
    // Update the message to stop loading and show stopped message
    updateMessageById(
      messageId, 
      [{ 
        type: 'text', 
        title: 'Generation Stopped',
        text: 'AI generation was stopped by user. Click "Regenerate" to try again.' 
      }], 
      false, // Not loading anymore
      false, // Not an error
      messages.find(msg => msg.id === messageId)?.originalRequest // Preserve original request for regeneration
    );
    // Show a toast notification
    if (isMounted.current) {
      toast({ 
        title: "Generation Stopped", 
        description: "The AI generation process was cancelled.",
        duration: 3000
      });
    }
  }, [updateMessageById, messages, toast]);

  // Add handleDesignItemSelect function before handleAction
  const handleDesignItemSelect = useCallback((designItem: DesignListItem) => {
    if (!designItem || !designItem.id) return;
    
    setSelectedDesignItem(designItem);
    
    // Construct a prompt that focuses on this specific design item,
    // with enough detail for the AI to generate relevant search keywords
    const mustFollowSection = designItem.mustFollow && designItem.mustFollow.length > 0
      ? `\n\nMust follow:\n${designItem.mustFollow.map(p => `- ${p}`).join('\n')}`
      : '';

    const designPrompt = `Generate design ideas and provide the complete prompts for the designs: "${designItem.title}".\n\nBasic concept: ${designItem.description}\n\n${designItem.textContent ? `TEXT TO INCLUDE: "${designItem.textContent}"\n\n` : ''}${mustFollowSection}`;
    
    // Show toast notification about the selection
    toast({
      title: 'Design Selected',
      description: `Generating prompts for "${designItem.title}"`,
      duration: 3000
    });
    
    // Call the generateDesignPrompts function with this specific prompt
    handleSendMessage(
      designPrompt, 
      'generateDesignPrompts',
      undefined,
      undefined, 
      false, 
      false,
      undefined,
      undefined,
      false
    );
    // Clear the input box after selecting a design
    setInputMessage('');
  }, [handleSendMessage, toast, setSelectedDesignItem, setInputMessage]);
  
  // Add useEffect to listen for design-item-selected events
  useEffect(() => {
    const handleDesignItemSelectedEvent = (event: Event) => {
      const customEvent = event as CustomEvent;
      const designItem = customEvent.detail?.designItem;
      if (designItem && designItem.id) {
        handleDesignItemSelect(designItem);
      }
    };
    
    // Add event listener
    window.addEventListener('design-item-selected', handleDesignItemSelectedEvent);
    
    // Remove event listener on cleanup
    return () => {
      window.removeEventListener('design-item-selected', handleDesignItemSelectedEvent);
    };
  }, [handleDesignItemSelect]);

  // After defining isHistoryPanelOpen and setIsHistoryPanelOpen
  // Listen for top-level history toggle events
  useEffect(() => {
    const handleToggleHistory = () => {
      setIsHistoryPanelOpen(prev => !prev);
    };
    window.addEventListener('toggle-history-panel', handleToggleHistory);
    return () => {
      window.removeEventListener('toggle-history-panel', handleToggleHistory);
    };
  }, []);

  // Listen for top-level new-chat events
  useEffect(() => {
    const handleNewChatEvent = () => {
      handleNewChat();
    };
    window.addEventListener('new-chat', handleNewChatEvent);
    return () => {
      window.removeEventListener('new-chat', handleNewChatEvent);
    };
  }, [handleNewChat]);

  // New: perform a fresh action on the original user request without overwriting
  const handlePerformActionOnMessage = useCallback((originalRequest: ChatMessage['originalRequest'], action: ActionType) => {
    if (!originalRequest) return; // ensure originalRequest is defined
    if (profileLoading) return;
    if (!profile) return;
    if (!currentSession) return;

    // Always clear input box when using in-message action buttons
    setInputMessage('');

    // Handle custom instruction toggle: link inline custom to footer input
    if (action === 'custom') {
      setIsCustomMessage(prev => !prev);
      setActiveActionButton(action);
      setLastSelectedActionButton(action);
      // focus input box
      inputTextAreaRef.current?.focus();
      return;
    }
    // Special handling for design ideas: ignore originalRequest and trigger default flow
    setLastSelectedActionButton(action);
    setActiveActionButton(action);
    // Trigger a new user message based on the original request
    handleSendMessage(
      originalRequest.messageText,
      action,
      originalRequest.notes,
      originalRequest.attachedFilesData,
      false, // isUserMessageEdit
      false, // isRegenerationCall
      undefined,
      undefined,
      false
    );
    // Clear highlight after brief feedback
    setTimeout(() => setActiveActionButton(null), 500);
  }, [profileLoading, profile, currentSession, handleSendMessage, setActiveActionButton, setLastSelectedActionButton, setInputMessage]);

  // Add handler for custom instruction file selection
  const handleCustomInstructionFilesChange = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const processedFiles = await processFilesForAI(Array.from(event.target.files));
      setCustomInstructionFiles(prev => [...prev, ...processedFiles]);
    }
  }, [processFilesForAI]);

  // Add handler to send custom instruction
  const handleCustomInstructionSend = useCallback(() => {
    // Send custom instruction with attached files
    handleSendMessage(
      customInstructionText,
      'custom',
      undefined,
      customInstructionFiles,
      false,
      false,
      undefined,
      undefined,
      true
    );
    // Reset modal state
    setCustomInstructionText('');
    setCustomInstructionFiles([]);
    setShowCustomInstructionModal(false);
  }, [customInstructionText, customInstructionFiles, handleSendMessage]);

  // Handler to open editor with prefill
  const openPromptWithCustomSenseEditor = useCallback((message: ChatMessage) => {
    if (message.actionType !== 'promptWithCustomSense') return;
    // Parse designType and description
    let designType = 'POD Design';
    let description = '';
    if (typeof message.content === 'string') {
      const typeMatch = message.content.match(/Design Type:\s*"([^"]+)"/i);
      const descMatch = message.content.match(/Description:\s*"([^"]+)"/i);
      if (typeMatch) designType = typeMatch[1];
      if (descMatch) description = descMatch[1];
    }
    const attachedFile = message.attachedFiles && message.attachedFiles[0] ? message.attachedFiles[0] : undefined;

    setCustomSensePrefill({ designType, description, attachedFile, originalUserMessageId: message.id });
    setShowPromptWithCustomSense(true);
  }, []);

  const handleRegenerateCustomSense = useCallback((msg: ChatMessage) => {
    if (msg.actionType !== 'promptWithCustomSense') return;
    if (typeof msg.content !== 'string') return;

    setPendingAiRequestAfterEdit({
      content: msg.content,
      attachments: msg.attachedFiles,
      isUserMessageEdit: false,
      editedUserMessageId: msg.id,
      actionType: 'promptWithCustomSense'
    });
  }, []);

  /* ------------------------------------------------------------------
   * Search-highlight handling
   * ------------------------------------------------------------------*/
  // Listen for custom events dispatched from the HistoryPanel / SearchDialog
  useEffect(() => {
    const handleHighlightEvent = (event: Event) => {
      const custom = event as CustomEvent;
      const term: string | undefined = custom.detail?.searchQuery;
      if (typeof term === 'string' && term.trim().length > 0) {
        setSearchHighlightTerm(term.trim());
        try {
          localStorage.setItem('desainr_search_query', term.trim());
        } catch { /* ignore */ }
      }
    };

    const handleClearHighlights = () => {
      setSearchHighlightTerm('');
      try { localStorage.removeItem('desainr_search_query'); } catch { /* ignore */ }
    };

    window.addEventListener('highlight-search-terms', handleHighlightEvent as EventListener);
    window.addEventListener('clear-search-highlights', handleClearHighlights);
    return () => {
      window.removeEventListener('highlight-search-terms', handleHighlightEvent as EventListener);
      window.removeEventListener('clear-search-highlights', handleClearHighlights);
    };
  }, []);

  // Apply highlight to matching portions when term changes
  useEffect(() => {
    if (!searchHighlightTerm) return;

    const container = chatAreaRef.current;
    if (!container) return;

    const term = searchHighlightTerm;
    const regex = new RegExp(`(${term.replace(/[.*+?^${}()|[\\]\\]/g, '\\$&')})`, 'gi');

    // Walk through each text node under the scroll area and replace matches with <mark>
    const walker = document.createTreeWalker(container, NodeFilter.SHOW_TEXT, {
      acceptNode: (node) => {
        if (!node.parentElement) return NodeFilter.FILTER_REJECT;
        // Avoid highlighting inside certain elements (code blocks etc.) if needed
        if (node.parentElement.closest('mark[data-search-highlight]')) return NodeFilter.FILTER_REJECT;
        return regex.test(node.nodeValue || '') ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
      }
    });

    let firstMatchEl: HTMLElement | null = null;

    const textNodes: Text[] = [];
    while (walker.nextNode()) {
      textNodes.push(walker.currentNode as Text);
    }

    textNodes.forEach((textNode) => {
      const html = (textNode.nodeValue || '').replace(regex, '<mark data-search-highlight class="bg-yellow-300 dark:bg-yellow-600 text-black rounded px-0.5">$1</mark>');
      const span = document.createElement('span');
      span.innerHTML = html;
      const frag = document.createDocumentFragment();
      Array.from(span.childNodes).forEach(n => frag.appendChild(n));
      const parent = textNode.parentNode;
      if (!parent) return;
      parent.replaceChild(frag, textNode);

      if (!firstMatchEl) {
        const candidate = parent.querySelector('mark[data-search-highlight]');
        if (candidate) firstMatchEl = candidate as HTMLElement;
      }
    });

    if (firstMatchEl) {
      firstMatchEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
      // Brief pulse animation for visibility
      firstMatchEl.classList.add('animate-pulse');
      setTimeout(() => firstMatchEl.classList.remove('animate-pulse'), 2000);
    }

  }, [searchHighlightTerm, messages]);

  // When highlights are cleared via button/event, also remove markup immediately
  useEffect(() => {
    if (!searchHighlightTerm) {
      // If term cleared, clean any lingering highlight markup
      const container = chatAreaRef.current;
      if (!container) return;
      container.querySelectorAll('mark[data-search-highlight], mark.search-highlight')
        .forEach((markEl) => {
          const parent = markEl.parentNode;
          if (!parent) return;
          // Replace the <mark> with its text content
          parent.replaceChild(document.createTextNode(markEl.textContent || ''), markEl);
          // Merge adjacent text nodes – optional for cleaner DOM
          parent.normalize();
        });
    }
  }, [searchHighlightTerm]);

  if (authLoading || (!currentSession && !profileLoading && !historyHookLoading)) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-var(--header-height,0px))] bg-gradient-to-b from-background-start-hsl to-background-end-hsl">
        <div className="glass-panel p-8 rounded-xl shadow-2xl flex flex-col items-center animate-float">
          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-primary/20 blur-xl animate-pulse-slow"></div>
            <Loader2 className="h-16 w-16 animate-spin text-primary relative z-10" />
          </div>
          <p className="mt-6 text-xl font-semibold text-gradient">Loading DesAInR Pro...</p>
          <p className="text-sm text-muted-foreground mt-2">Preparing your design assistant</p>
        </div>
      </div>
    );
  }

  if (!authUser && !authLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-var(--header-height,0px))] bg-gradient-to-br from-background-start-hsl to-background-end-hsl text-center p-4">
          <div className="glass-panel p-8 md:p-12 rounded-2xl shadow-2xl flex flex-col items-center animate-fade-in max-w-lg w-full">
              <div className="relative mb-6">
                  <div className="absolute -inset-2 rounded-full bg-primary/10 blur-xl animate-pulse-slow opacity-70"></div>
                  <BotIcon className="w-20 h-20 md:w-24 md:h-24 text-primary relative z-10 animate-float" />
              </div>
              <h1 className="text-3xl md:text-4xl font-bold mb-4 text-gradient">Welcome to DesAInR Pro!</h1>
              <p className="text-lg md:text-xl text-foreground/80 mb-6">
                  Your AI-powered design assistant.
              </p>
              <p className="text-base text-foreground/70 mb-8">
                  Please log in to continue and access your chat history.
              </p>
               <Dialog open={isWelcomeLoginModalOpen} onOpenChange={setIsWelcomeLoginModalOpen}>
                  <DialogTrigger asChild>
                      <Button
                          variant="default"
                          className="w-full text-base py-6 max-w-xs mb-3"
                          onClick={() => setIsWelcomeLoginModalOpen(true)}
                      >
                          <LogIn className="mr-2 h-5 w-5" /> Login with Google
                      </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md glass-panel backdrop-blur-xl border border-border dark:border-primary/10 shadow-xl dark:shadow-2xl rounded-xl animate-fade-in">
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 rounded-xl opacity-30 pointer-events-none"></div>
                      <DialogHeader className="relative z-10">
                           <div className="flex items-center justify-between">
                            <DialogTitle className="text-xl font-bold text-primary dark:bg-clip-text dark:text-transparent dark:bg-gradient-to-r dark:from-primary dark:to-secondary">Login to DesAInR</DialogTitle>
                           </div>
                      </DialogHeader>
                      <LoginForm onSuccess={() => setIsWelcomeLoginModalOpen(false)} />
                  </DialogContent>
              </Dialog>
          </div>
      </div>
    );
  }


  return (
    <div className="flex flex-row h-full overflow-hidden bg-gradient-to-b from-background-start-hsl to-background-end-hsl"
         onDragOver={handleDragOver}
         onDragLeave={handleDragLeave}
         onDrop={handleDrop}
         ref={dropZoneRef}>
      {/* History panel - mobile version */}
      <AnimatePresence>
        {isMobile && isHistoryPanelOpen && (
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsHistoryPanelOpen(false)}
          >
            <motion.div
              key="mobileSidebar"
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', stiffness: 260, damping: 30 }}
              ref={chatSidebarRef}
              className="absolute left-0 top-0 h-full w-4/5 max-w-[300px] glass-panel border-r border-primary/20 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <HistoryPanel
                sessions={historyMetadata}
                activeSessionId={currentSession?.id || null}
                onSelectSession={handleSelectSession}
                onNewChat={handleNewChat}
                onDeleteSession={handleDeleteSession}
                isLoading={historyHookLoading}
                isLoggedIn={!!authUser}
                onRefreshHistory={handleRefreshHistory}
                isAutoRefreshEnabled={isAutoRefreshEnabled}
                setAutoRefreshEnabled={setAutoRefreshEnabled}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* History panel - desktop version */}
      {!isMobile && (
        <div
          ref={chatSidebarRef}
          style={{ width: isHistoryPanelOpen ? (isHistoryPanelCollapsed ? '60px' : 'var(--sidebar-width,300px)') : 0 }}
          className={cn(
            "glass-panel shrink-0 transition-all duration-300 ease-in-out h-full overflow-hidden shadow-lg",
            isHistoryPanelOpen ? "border-r border-primary/20" : "opacity-0"
          )}
        >
          {isHistoryPanelOpen && (
            <div className="h-full overflow-hidden animate-fade-in">
              <HistoryPanel
                sessions={historyMetadata}
                activeSessionId={currentSession?.id || null}
                onSelectSession={handleSelectSession}
                onNewChat={handleNewChat}
                onDeleteSession={handleDeleteSession}
                isLoading={historyHookLoading}
                isLoggedIn={!!authUser}
                className="animate-fade-in" 
                onRefreshHistory={handleRefreshHistory}
                isAutoRefreshEnabled={isAutoRefreshEnabled}
                setAutoRefreshEnabled={setAutoRefreshEnabled}
                isCollapsed={isHistoryPanelCollapsed}
                onToggleCollapse={toggleHistoryPanelCollapse}
              />
            </div>
          )}
        </div>
      )}

      {/* Main chat area - always visible regardless of history panel state */}
      <div className="flex flex-col flex-grow min-w-0 w-full h-full">
        <ScrollArea className="flex-1 overflow-y-auto" ref={chatAreaRef}>
          <div className={cn(
            "space-y-4 w-full stagger-animation pb-48 px-2",
            isHistoryPanelOpen ? (isHistoryPanelCollapsed ? "pl-2" : "pl-2") : ""
          )}>
            {messages.map((msg) => (
              <ChatMessageDisplay
                key={msg.id}
                message={msg}
                onRegenerate={handleRegenerateMessage}
                onConfirmEditAndResend={handleConfirmEditAndResendUserMessage}
                onStopRegeneration={handleStopRegeneration}
                onPerformAction={handlePerformActionOnMessage}
                isMobile={isMobile}
                profile={profile}
                activeActionButton={activeActionButton}
                lastSelectedActionButton={lastSelectedActionButton}
                isLoading={isLoading}
                currentUserMessage={inputMessage}
                currentAttachedFilesDataLength={currentAttachedFilesData.length}
                onOpenCustomSenseEditor={openPromptWithCustomSenseEditor}
                onRegenerateCustomSense={handleRegenerateCustomSense}
                searchHighlightTerm={searchHighlightTerm}
              />
            ))}
             {messages.length === 0 && !isLoading && (
                <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-6 animate-fade-in w-full">
                    <div className="relative mb-6">
                      <div className="absolute inset-0 rounded-full bg-accent/20 blur-xl animate-pulse-slow"></div>
                      <BotIcon className="w-20 h-20 text-accent relative z-10 animate-float" />
                    </div>
                    <h2 className="text-3xl font-bold mb-3 text-gradient">Welcome to DesAInR Pro</h2>
                    <p className="text-xl text-foreground/80 mb-6">
                        Your AI-powered design assistant
                    </p>
                    <div className="glass-panel p-6 rounded-xl w-full max-w-3xl mx-auto">
                      <p className="text-foreground/90">
                          Type a client message, or drag & drop files below. Then use the action buttons to get started.
                      </p>
                    </div>
                </div>
            )}
          </div>
        </ScrollArea>

        {isDragging && (
          <div className="absolute inset-x-4 bottom-[160px] md:bottom-[150px] top-16 md:top-[calc(var(--header-height)_+_1rem)] border-4 border-dashed border-primary/70 bg-primary/10 backdrop-blur-sm rounded-xl flex items-center justify-center pointer-events-none z-20 animate-fade-in shadow-2xl">
            <div className="glass-panel p-8 rounded-full animate-pulse-slow">
              <p className="text-primary font-bold text-xl">Drop files here</p>
            </div>
          </div>
        )}

        <div 
          className={cn(
            "fixed bottom-0 left-0 right-0 z-50 w-full transition-all duration-300 pb-[env(safe-area-inset-bottom)]", 
            isHistoryPanelOpen ? (isHistoryPanelCollapsed ? "pl-[60px]" : "pl-[300px]") : "pl-0"
          )}
        >
          <div
            className={cn(
              "max-w-5xl mx-auto w-full relative",
              isDragging && "opacity-50",
              !isFooterCollapsed && "border-t glass-panel bg-background/70 backdrop-blur-xl shadow-2xl rounded-t-xl p-4 md:p-5"
            )}
          >
            {/* Modern collapse/expand button for footer */}
            <div className={cn(
              "absolute right-4 transition-all duration-300 z-[60]",
              isFooterCollapsed ? "-top-3" : "-top-6"
            )}>
              <Button
                variant="outline"
                size="icon"
                onClick={toggleFooter}
                className="h-6 w-10 rounded-full bg-background backdrop-blur-sm border border-border/50 shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out flex items-center justify-center group"
                aria-label={isFooterCollapsed ? "Expand input area" : "Collapse input area"}
              >
                <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <div className={`transition-all duration-300 ${isFooterCollapsed ? "" : "transform rotate-180"}`}>
                    <ChevronDown size={15} className="text-foreground/80 group-hover:text-primary transition-colors" />
                  </div>
                </div>
              </Button>
            </div>

            {!isFooterCollapsed && (
              <>
                <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-primary/10 via-primary/40 to-primary/10"></div>
                {currentAttachedFilesData.length > 0 && (
                  <div className="mt-2 mb-4 w-full">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-medium text-primary/80">Attached files:</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 text-destructive/80 hover:text-destructive hover:bg-destructive/10 transition-all duration-300 rounded-full"
                        onClick={clearSelectedFiles}
                      >
                        <X className="h-3.5 w-3.5 mr-1" /> Clear All
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2 items-center">
                      {currentAttachedFilesData.map((file, index) => (
                        <div key={index} className="relative group">
                          <div className="w-16 h-16 rounded-md border border-primary/20 bg-card/50 flex items-center justify-center overflow-hidden">
                            {file.type?.startsWith('image/') ? (
                              <img 
                                src={file.dataUri} 
                                alt={file.name} 
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <FileText className="h-8 w-8 text-primary/70" />
                            )}
                            <button 
                              onClick={() => handleRemoveFile(index)}
                              className="absolute top-0 right-0 bg-destructive/80 hover:bg-destructive text-destructive-foreground rounded-bl-md p-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"
                            >
                              <X className="h-3.5 w-3.5" />
                            </button>
                            <div className="absolute bottom-0 left-0 right-0 p-0.5 text-[8px] bg-background/80 backdrop-blur-sm truncate opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                              {file.name.length > 10 ? file.name.substring(0, 8) + '...' : file.name}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex items-end gap-2 animate-fade-in transition-all duration-300 w-full">
                  <div className="relative w-full group">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/20 via-secondary/20 to-primary/20 rounded-xl blur opacity-30 group-hover:opacity-70 transition-opacity duration-500"></div>
                    <Textarea
                      ref={inputTextAreaRef}
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder="Type here..."
                      className="relative flex-1 resize-none min-h-[65px] max-h-[150px] rounded-xl shadow-lg focus-visible:ring-2 focus-visible:ring-primary glass-panel border-primary/20 transition-all duration-300 w-full pr-24 z-10 bg-background/60 backdrop-blur-lg"
                      rows={Math.max(1, Math.min(5, inputMessage.split('\n').length))}
                    />
                    <div className="absolute bottom-3 right-3 flex items-center gap-2 opacity-70 group-hover:opacity-100 transition-opacity duration-300 z-20">
                      <TooltipProvider delayDuration={200}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className="flex items-center gap-1.5">
                              <div className="text-xs text-foreground/70 font-medium">Custom</div>
                              <Checkbox
                                id="custom-message-inline"
                                checked={isCustomMessage}
                                onCheckedChange={(checked) => setIsCustomMessage(checked as boolean)}
                                className="data-[state=checked]:bg-accent data-[state=checked]:border-accent h-4 w-4"
                              />
                            </div>
                          </TooltipTrigger>
                          <TooltipContent side="top" className="glass-panel text-foreground shadow-xl rounded-lg p-3 animate-fade-in border border-accent/10 max-w-sm">
                            <p className="font-semibold text-gradient">Custom Instructions</p>
                            <p className="text-xs text-foreground/80 mt-1">
                              When enabled, your message will be treated as a custom instruction for the AI. 
                              Instead of standard analysis, you can tell the AI exactly what to generate from the client message.
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => fileInputRef.current?.click()}
                        className="h-8 w-8 p-0 hover:bg-primary/10 rounded-full"
                        aria-label="Attach files"
                      >
                        <div className="relative">
                          <div className="absolute inset-0 bg-primary/10 rounded-full blur-sm animate-pulse-slow"></div>
                          <Paperclip className="h-5 w-5 text-primary relative z-10" />
                        </div>
                      </Button>
                      <input type="file" ref={fileInputRef} multiple onChange={handleFileChange} className="hidden" accept="image/*,application/pdf,.txt,.md,.json"/>
                    </div>
                  </div>
                </div>

                <div className={cn(
                  "flex items-center justify-between mt-4 gap-x-3 gap-y-2 w-full",
                   isMobile ? "flex-col items-stretch gap-y-3" : "flex-nowrap overflow-x-auto"
                )}>
                  <div className={cn("flex-1 flex justify-end animate-stagger", isMobile ? "w-full justify-center mt-0" : "")} style={{ animationDelay: '200ms' }}>
                    <ActionButtonsPanel
                      onAction={handleAction}
                      isLoading={isLoading}
                      currentUserMessage={inputMessage}
                      profile={profile}
                      currentAttachedFilesDataLength={currentAttachedFilesData.length}
                      isMobile={isMobile}
                      activeButton={activeActionButton}
                      lastSelectedButton={lastSelectedActionButton}
                    />
                  </div>
                </div>
              </>
            )}
            {isFooterCollapsed && (
              <div className="h-3"></div>
            )}
          </div>
        </div>
      </div>

      <Dialog open={showNotesModal} onOpenChange={setShowNotesModal}>
        <DialogContent className="animate-fade-in bg-background/95 dark:bg-background/80 backdrop-blur-xl border border-border dark:border-primary/10 shadow-xl dark:shadow-2xl rounded-xl">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 rounded-xl opacity-30 pointer-events-none"></div>

          <DialogHeader className="mb-2 relative z-10">
            <div className="flex items-center justify-between">
              <DialogTitle className="text-xl font-bold text-primary dark:bg-clip-text dark:text-transparent dark:bg-gradient-to-r dark:from-primary dark:to-secondary">
                Additional Notes for {modalActionType === 'generateDeliveryTemplates' ? 'Delivery' : modalActionType === 'generateRevision' ? 'Revision' : 'Action'}
              </DialogTitle>
              <DialogClose asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-8 w-8 border border-border/30 dark:border-primary/10 hover:bg-primary/10 transition-all duration-300 rounded-full btn-glow"
                >
                  <X className="h-4 w-4" />
                </Button>
              </DialogClose>
            </div>
            <DialogDescription className="text-muted-foreground mt-2">
              Provide any specific notes or details for the AI to consider.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4 relative z-10">
            <div className="grid grid-cols-1 items-center gap-4">
              <Label htmlFor="notes" className="font-medium text-foreground/90">Notes</Label>
              <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/10 via-secondary/10 to-primary/10 rounded-xl blur opacity-20 group-hover:opacity-40 transition-opacity duration-500 pointer-events-none"></div>
                <Textarea
                  id="notes"
                  value={modalNotes}
                  onChange={(e) => setModalNotes(e.target.value)}
                  className="w-full h-40 resize-none bg-card dark:glass-panel border border-border dark:border-primary/20 shadow-md dark:shadow-lg rounded-xl relative z-10"
                  placeholder={modalActionType === 'generateDeliveryTemplates' ? "e.g., All final files attached, 2 concepts included..." : modalActionType === 'generateRevision' ? "e.g., Client requested color changes, updated logo attached..." : "Enter notes here..."}
                />
              </div>
            </div>
          </div>

          <DialogFooter className="gap-3 relative z-10 mt-2 pt-3 border-t border-border/30 dark:border-primary/10">
            <DialogClose asChild>
              <Button
                variant="outline"
                className="bg-background hover:bg-destructive/10 hover:text-destructive transition-all duration-300 ease-in-out shadow-sm hover:shadow-md rounded-full btn-glow"
              >
                Cancel
              </Button>
            </DialogClose>
            <Button
              onClick={submitModalNotes}
              variant="default"
              className="bg-primary dark:bg-gradient-to-r dark:from-primary dark:to-secondary text-primary-foreground hover:shadow-lg transition-all duration-300 ease-in-out rounded-full btn-glow"
            >
              <div className="relative mr-2">
                <div className="absolute inset-0 rounded-full bg-primary-foreground/20 blur-sm opacity-70"></div>
                <Plane className="h-4 w-4 relative z-10" />
              </div>
              Generate
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Fullscreen search overlay */}
      <FullscreenSearch 
        isOpen={isSearchActive}
        onClose={() => setIsSearchActive(false)}
        initialQuery={searchQuery}
        onQueryChange={setSearchQuery}
      />
      
      {/* Prompt with Custom Change component */}
      {showPromptWithCustomSense && (
        <div className="fixed inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm z-50 p-4">
          <PromptWithCustomSense
            userName={profile?.name}
            userApiKey={profile?.geminiApiKeys?.[0]}
            modelId={profile?.selectedGenkitModelId || DEFAULT_MODEL_ID}
            onClose={() => { setShowPromptWithCustomSense(false); setCustomSensePrefill(null);} }
            onPromptsGenerated={handleCustomSensePromptsGenerated}
            initialDesignType={customSensePrefill?.designType}
            initialDesignStyles={customSensePrefill?.designStyles}
            initialDescription={customSensePrefill?.description}
            initialAttachedFile={customSensePrefill?.attachedFile}
            originalUserMessageId={customSensePrefill?.originalUserMessageId}
          />
        </div>
      )}
      
      {/* Prompt for Microstock component */}
      {showPromptForMicrostock && (
        <div className="fixed inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm z-50 p-4">
          <PromptForMicrostock
            userName={profile?.name}
            userApiKey={profile?.geminiApiKeys?.[0]}
            modelId={profile?.selectedGenkitModelId || DEFAULT_MODEL_ID}
            onClose={() => setShowPromptForMicrostock(false)}
            onResultsGenerated={handleMicrostockResultsGenerated} 
          />
        </div>
      )}
      {/* Custom Instruction Modal */}
      {showCustomInstructionModal && (
        <Dialog open={showCustomInstructionModal} onOpenChange={setShowCustomInstructionModal}>
          <DialogContent className="animate-fade-in bg-background/95 dark:bg-background/80 backdrop-blur-xl border border-border dark:border-primary/10 shadow-xl dark:shadow-2xl rounded-xl">
            <DialogHeader className="relative z-10">
              <DialogTitle className="text-xl font-bold">Custom Instructions</DialogTitle>
              <DialogDescription className="text-xs text-foreground/80 mt-1">
                Enter custom instructions or attach files for the AI to follow.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4 relative z-10">
              <Textarea
                id="custom-instruction-text"
                value={customInstructionText}
                onChange={(e) => setCustomInstructionText(e.target.value)}
                placeholder="Enter your custom instruction..."
                className="w-full h-40 resize-none bg-card dark:glass-panel border border-border dark:border-primary/20 shadow-md rounded-xl"
              />
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" onClick={() => customInstructionFileInputRef.current?.click()}>
                  <Paperclip className="h-5 w-5" />
                </Button>
                <input type="file" ref={customInstructionFileInputRef} multiple onChange={handleCustomInstructionFilesChange} className="hidden" accept="image/*,application/pdf,.txt,.md,.json"/>
                {customInstructionFiles.map((file, idx) => (
                  <div key={idx} className="text-sm truncate">
                    {file.name}{file.size ? ` (${file.size} bytes)` : ''}
                  </div>
                ))}
              </div>
            </div>
            <DialogFooter className="gap-3 relative z-10 mt-2 pt-3 border-t border-border/30 dark:border-primary/10">
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button onClick={handleCustomInstructionSend} className="bg-primary dark:bg-gradient-to-r dark:from-primary dark:to-secondary text-primary-foreground hover:shadow-lg transition-all duration-300 rounded-full">
                Send
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

