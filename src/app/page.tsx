'use client';

import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { Paperclip, Loader2, BotIcon, Menu, PanelLeftOpen, PanelLeftClose, Palette, SearchCheck, ClipboardSignature, ListChecks, ClipboardList, Lightbulb, Terminal, Plane, RotateCcw, PlusCircle, Edit3, RefreshCw, LogIn, UserPlus, Languages, X, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ChatMessageDisplay } from '@/components/chat/chat-message';
import { ActionButtonsPanel, type ActionType } from '@/components/chat/action-buttons';
import { HistoryPanel } from '@/components/chat/history-panel';
import { useToast } from "@/hooks/use-toast";
import { useUserProfile } from '@/lib/hooks/use-user-profile';
import { useChatHistory } from '@/lib/hooks/use-chat-history';
import type { ChatMessage, UserProfile, ChatMessageContentPart, AttachedFile, ChatSession, EditHistoryEntry } from '@/lib/types';
import { processClientMessage, type ProcessClientMessageInput, type ProcessClientMessageOutput } from '@/ai/flows/process-client-message';
import { processCustomInstruction, type ProcessCustomInstructionInput, type ProcessCustomInstructionOutput } from '@/ai/flows/process-custom-instruction';
import { analyzeClientRequirements, type AnalyzeClientRequirementsInput, type AnalyzeClientRequirementsOutput } from '@/ai/flows/analyze-client-requirements';
import { generateEngagementPack, type GenerateEngagementPackInput, type GenerateEngagementPackOutput } from '@/ai/flows/generate-engagement-pack-flow';
import { generateDesignIdeas, type GenerateDesignIdeasInput, type GenerateDesignIdeasOutput } from '@/ai/flows/generate-design-ideas-flow';
import { generateDesignPrompts, type GenerateDesignPromptsInput, type GenerateDesignPromptsOutput } from '@/ai/flows/generate-design-prompts-flow';
import { checkMadeDesigns, type CheckMadeDesignsInput, type CheckMadeDesignsOutput } from '@/ai/flows/check-made-designs-flow';
import { generatePlatformMessages, type GeneratePlatformMessagesInput, type GeneratePlatformMessagesOutput } from '@/ai/flows/generate-platform-messages';
import { generateEditingPrompts, type GenerateEditingPromptsInput, type GenerateEditingPromptsOutput } from '@/ai/flows/generate-editing-prompts-flow';


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

  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { user: authUser, loading: authLoading, googleAccessToken, signInWithGoogle: triggerGoogleSignInFromAuth } = useAuth();
  const { profile, isLoading: profileLoading } = useUserProfile();
  const chatAreaRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const inputTextAreaRef = useRef<HTMLTextAreaElement>(null);

  const [showNotesModal, setShowNotesModal] = useState(false);
  const [modalActionType, setModalActionType] = useState<ActionType | null>(null);
  const [modalNotes, setModalNotes] = useState('');
  const [isWelcomeLoginModalOpen, setIsWelcomeLoginModalOpen] = useState(false);

  const [pendingAiRequestAfterEdit, setPendingAiRequestAfterEdit] = useState<{
    content: string;
    attachments?: AttachedFile[];
    isUserMessageEdit: boolean;
    editedUserMessageId?: string;
  } | null>(null);

  // State for last selected action button
  const [lastSelectedActionButton, setLastSelectedActionButton] = useState<ActionType | null>(null);
  // State for currently active button UI highlight
  const [activeActionButton, setActiveActionButton] = useState<ActionType | null>(null);
  
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
    syncWithDrive,
    isSyncing,
  } = useChatHistory(userIdForHistory);

  const [currentSession, setCurrentSession] = useState<ChatSession | null>(null);
  const isMobile = useIsMobile();
  const [isHistoryPanelOpen, setIsHistoryPanelOpen] = useState<boolean | undefined>(undefined);
  const currentApiKeyIndexRef = useRef(0);
  const isMounted = useRef(false);
  const initialSessionLoadAttemptedRef = useRef(false);


  useEffect(() => {
    isMounted.current = true;
    return () => { isMounted.current = false; };
  }, []);

  const ensureMessagesHaveUniqueIds = useCallback(baseEnsureMessagesHaveUniqueIds, []);

  useEffect(() => {
    if (isMobile !== undefined && isHistoryPanelOpen === undefined) {
        setIsHistoryPanelOpen(!isMobile);
    }
  }, [isMobile, isHistoryPanelOpen]);


  useEffect(() => {
    const loadOrCreateSession = async () => {
      if (!userIdForHistory || !isMounted.current) {
        return;
      }

      // Prevent re-running if a session for the current user is already loaded,
      // unless this is the very first attempt for this userIdForHistory.
      if (initialSessionLoadAttemptedRef.current && currentSession && currentSession.userId === userIdForHistory) {
        console.log("ChatPage: loadOrCreateSession - Session already active and initialized for user, skipping redundant load.", userIdForHistory);
        return;
      }
      initialSessionLoadAttemptedRef.current = true;


      console.log(`ChatPage: loadOrCreateSession - Running for user ${userIdForHistory}. History Meta Count: ${historyMetadata.length}`);

      const lastActiveSessionIdKey = LAST_ACTIVE_SESSION_ID_KEY_PREFIX + userIdForHistory;
      let lastActiveSessionId = localStorage.getItem(lastActiveSessionIdKey);
      let sessionToLoad: ChatSession | null = null;

      if (lastActiveSessionId && lastActiveSessionId.startsWith(userIdForHistory + '_')) {
        console.log(`ChatPage: loadOrCreateSession - Attempting to load last active session ${lastActiveSessionId}`);
        sessionToLoad = await getSession(lastActiveSessionId); // getSession now depends on historyMetadata being loaded

        if (sessionToLoad && sessionToLoad.userId !== userIdForHistory) {
          console.warn(`ChatPage: loadOrCreateSession - Loaded session ${lastActiveSessionId} for wrong user. Discarding.`);
          sessionToLoad = null;
          localStorage.removeItem(lastActiveSessionIdKey);
        } else if (!sessionToLoad && lastActiveSessionId) {
           console.warn(`ChatPage: loadOrCreateSession - Last active session ID ${lastActiveSessionId} from LS not found by getSession or is invalid. Clearing LS key.`);
           localStorage.removeItem(lastActiveSessionIdKey);
        }
      } else if (lastActiveSessionId) {
        console.warn(`ChatPage: loadOrCreateSession - lastActiveSessionId ${lastActiveSessionId} does not match user ${userIdForHistory}. Clearing LS key.`);
        localStorage.removeItem(lastActiveSessionIdKey);
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
        console.log(`ChatPage: loadOrCreateSession - Loaded session ${updatedSession.id} with ${updatedSession.messages.length} messages.`);
      } else if (isMounted.current) {
        console.log(`ChatPage: loadOrCreateSession - No valid session found or to load, creating new for ${userIdForHistory}.`);
        const userApiKeyForNameGen = (profile?.geminiApiKeys && profile.geminiApiKeys.length > 0 && profile.geminiApiKeys[0]) ? profile.geminiApiKeys[0] : undefined;
        const modelIdToUse = profile?.selectedGenkitModelId || DEFAULT_MODEL_ID;
        const newSession = createNewSession([], modelIdToUse, userApiKeyForNameGen);
        setCurrentSession(newSession);
        setMessages(newSession.messages); // Initialize with empty messages for a new session
        setIsLoading(false); // Ensure global loading state is reset
        if (newSession.id && newSession.id.startsWith(userIdForHistory + '_')) {
          localStorage.setItem(lastActiveSessionIdKey, newSession.id);
        } else {
          console.warn("ChatPage: loadOrCreateSession (New Session) - New session ID mismatch or null.", newSession?.id, userIdForHistory);
        }
        console.log(`ChatPage: loadOrCreateSession - Created new session ${newSession.id}.`);
      }
    };

    // This effect should run when the fundamental loading states are resolved and userIdForHistory is stable.
    if (!authLoading && !profileLoading && !historyHookLoading && userIdForHistory) {
      loadOrCreateSession();
    }
  // Reduced dependencies to prevent re-running due to minor metadata updates.
  // It primarily reacts to changes in auth/profile status and the initial history load completion.
  }, [authLoading, profileLoading, historyHookLoading, userIdForHistory, getSession, createNewSession, ensureMessagesHaveUniqueIds, profile, currentSession]);


  // Effect to sync currentSession.name from historyMetadata if it changes (e.g., by AI naming)
  useEffect(() => {
    if (currentSession && currentSession.id && historyMetadata.length > 0) {
      const currentSessionMeta = historyMetadata.find(meta => meta.id === currentSession.id);
      if (currentSessionMeta && currentSessionMeta.name !== currentSession.name) {
        setCurrentSession(prevSession => {
          if (prevSession && prevSession.id === currentSessionMeta.id) { // Ensure we're updating the same session
            return { ...prevSession, name: currentSessionMeta.name };
          }
          return prevSession;
        });
      }
    }
  }, [historyMetadata, currentSession]); // Rely on currentSession object ref itself


  useEffect(() => {
    if (chatAreaRef.current) {
      chatAreaRef.current.scrollTop = chatAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const addMessage = useCallback((role: 'user' | 'assistant' | 'system', content: string | ChatMessageContentPart[], currentAttachments?: AttachedFile[], isLoadingParam?: boolean, isErrorParam?: boolean, originalRequest?: ChatMessage['originalRequest'], promptedByMessageId?: string) => {
    const newMessageId = generateRobustMessageId();
    const newMessage: ChatMessage = {
      id: newMessageId, role, content, timestamp: Date.now(),
      isLoading: isLoadingParam, isError: isErrorParam,
      attachedFiles: role === 'user' ? currentAttachments : undefined,
      canRegenerate: role === 'assistant' && !!originalRequest,
      originalRequest: role === 'assistant' ? originalRequest : undefined,
      promptedByMessageId: role === 'assistant' ? promptedByMessageId : undefined,
    };
    setMessages(prev => ensureMessagesHaveUniqueIds([...prev, newMessage]));
    return newMessageId;
  }, [ensureMessagesHaveUniqueIds]);

  const updateMessageById = useCallback((messageId: string, newContent: string | ChatMessageContentPart[], isLoadingParam: boolean = false, isErrorParam: boolean = false, originalRequestDetails?: ChatMessage['originalRequest'], promptedByMessageIdToKeep?: string) => {
    setMessages(prev => {
      const updatedMessages = prev.map(msg =>
        msg.id === messageId ? {
            ...msg, content: newContent, isLoading: isLoadingParam, isError: isErrorParam,
            timestamp: Date.now(),
            canRegenerate: !!originalRequestDetails,
            originalRequest: originalRequestDetails,
            promptedByMessageId: promptedByMessageIdToKeep || msg.promptedByMessageId,
        } : msg
      );
      return ensureMessagesHaveUniqueIds(updatedMessages);
    });
  }, [ensureMessagesHaveUniqueIds]);

  const handleNewChat = useCallback(() => {
    initialSessionLoadAttemptedRef.current = false; // Allow loadOrCreateSession to run for new chat
    const modelIdToUse = (profile?.selectedGenkitModelId || DEFAULT_MODEL_ID);
    const userApiKeyForNewChatNameGen = (profile?.geminiApiKeys && profile.geminiApiKeys.length > 0 && profile.geminiApiKeys[0]) ? profile.geminiApiKeys[0] : undefined;

    const newSession = createNewSession([], modelIdToUse, userApiKeyForNewChatNameGen);
    setCurrentSession(newSession);
    setMessages(newSession.messages);
    setInputMessage('');
    setSelectedFiles([]);
    setCurrentAttachedFilesData([]);
    currentApiKeyIndexRef.current = 0;

    const lastActiveSessionIdKey = LAST_ACTIVE_SESSION_ID_KEY_PREFIX + userIdForHistory;
    if (newSession.id && newSession.id.startsWith(userIdForHistory + '_')) {
      localStorage.setItem(lastActiveSessionIdKey, newSession.id);
    }
    if (isMobile) setIsHistoryPanelOpen(false);
  }, [createNewSession, userIdForHistory, isMobile, profile]);

  const handleSelectSession = useCallback(async (sessionId: string) => {
    initialSessionLoadAttemptedRef.current = false; // Allow loadOrCreateSession to run for selected chat
    if (!userIdForHistory || !sessionId.startsWith(userIdForHistory + '_')) {
        localStorage.removeItem(LAST_ACTIVE_SESSION_ID_KEY_PREFIX + userIdForHistory);
        handleNewChat();
        return;
    }

    const selected = await getSession(sessionId);
    if (selected && selected.id === sessionId && selected.userId === userIdForHistory) {
      // Ensure no messages are in a loading state when loading a session from history
      const migratedMessages = ensureMessagesHaveUniqueIds(selected.messages).map(msg => ({
        ...msg,
        isLoading: false, // Reset loading state for all messages in the chat history
        isError: msg.isError // Preserve the error state from the saved message
      }));
      const updatedSession = { ...selected, messages: migratedMessages };
      setCurrentSession(updatedSession);
      setMessages(updatedSession.messages);
      setIsLoading(false); // Ensure global loading state is reset
      currentApiKeyIndexRef.current = 0;
      const lastActiveSessionIdKey = LAST_ACTIVE_SESSION_ID_KEY_PREFIX + userIdForHistory;
      localStorage.setItem(lastActiveSessionIdKey, sessionId);
    } else {
        localStorage.removeItem(LAST_ACTIVE_SESSION_ID_KEY_PREFIX + userIdForHistory);
        handleNewChat();
    }
    if (isMobile) setIsHistoryPanelOpen(false);
  }, [getSession, ensureMessagesHaveUniqueIds, userIdForHistory, isMobile, handleNewChat]);

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
    const processedFiles: AttachedFile[] = [];
    for (const file of files) {
      const basicInfo: AttachedFile = { name: file.name, type: file.type, size: file.size };
      if (file.type.startsWith('image/')) {
        try { basicInfo.dataUri = await readFileAsDataURL(file); } catch (e) { console.error("Error reading image file:", e); }
      } else if (file.type === 'text/plain' || file.type === 'text/markdown' || file.type === 'application/json') {
        try { basicInfo.textContent = await readFileAsText(file); } catch (e) { console.error("Error reading text file:", e); }
      }
      processedFiles.push(basicInfo);
    }
    return processedFiles;
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
    isCustomMessageParam?: boolean // Whether this is a custom message
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
      userMessageIdForCurrentInteraction = addMessage('user', userMessageToDisplay || `Attached ${filesToSendWithThisMessage.length} file(s)${currentNotes ? ` (Notes: ${currentNotes})` : ''}`, filesToSendWithThisMessage);
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
            } catch (err) {
              console.error(`Process message failed. Falling back to analyze requirements.`, err);
              const arInput: AnalyzeClientRequirementsInput = {
                ...baseInput, clientMessage: userMessageContent,
                attachedFiles: filesForFlow, chatHistory: chatHistoryForAI
              };
              const arOutput = await analyzeClientRequirements(arInput);
              
              // Use the actual output structure from analyzeClientRequirements
              finalAiResponseContent.push({ type: 'text', title: 'Requirements Analysis', text: arOutput.mainRequirementsAnalysis });
              finalAiResponseContent.push({ type: 'text', title: 'Detailed Requirements (English)', text: arOutput.detailedRequirementsEnglish });
              finalAiResponseContent.push({ type: 'text', title: 'Detailed Requirements (Bangla)', text: arOutput.detailedRequirementsBangla });
              if (arOutput.designMessageOrSaying) {
                finalAiResponseContent.push({ type: 'text', title: 'Design Message or Saying', text: arOutput.designMessageOrSaying });
              }
            }
          } else if (currentActionType === 'analyzeRequirements') {
            const requirementsInput: AnalyzeClientRequirementsInput = { ...baseInput, clientMessage: userMessageContent, attachedFiles: filesForFlow, chatHistory: chatHistoryForAI };
            const requirementsOutput: AnalyzeClientRequirementsOutput = await analyzeClientRequirements(requirementsInput);
            finalAiResponseContent.push({ type: 'text', title: 'Main Requirements Analysis', text: requirementsOutput.mainRequirementsAnalysis });
            finalAiResponseContent.push({ type: 'text', title: 'Detailed Requirements (English)', text: requirementsOutput.detailedRequirementsEnglish });
            finalAiResponseContent.push({ type: 'text', title: 'Detailed Requirements (Bangla)', text: requirementsOutput.detailedRequirementsBangla });
            finalAiResponseContent.push({ type: 'text', title: 'Design Message or Saying', text: requirementsOutput.designMessageOrSaying });
          } else if (currentActionType === 'generateEngagementPack') {
            const engagementInput: GenerateEngagementPackInput = {
              ...baseInput, clientMessage: userMessageContent, designerName: userProfile.name,
              designerRawStatement: userProfile.rawPersonalStatement || '',
              designerCommunicationStyle: userProfile.communicationStyleNotes || '',
              attachedFiles: filesForFlow, chatHistory: chatHistoryForAI,
            };
            const packOutput = await generateEngagementPack(engagementInput);
            finalAiResponseContent.push({ type: 'code', title: `1. Personalized Introduction for ${packOutput.clientGreetingName}:`, code: packOutput.personalizedIntroduction });
            finalAiResponseContent.push({ type: 'code', title: '2. Brief Reply to Client:', code: packOutput.jobReplyToClient });
            let suggestionsText = `Suggested Budget: ${packOutput.suggestedBudget}\n`;
            suggestionsText += `Suggested Timeline: ${packOutput.suggestedTimeline}\n`;
            suggestionsText += `Suggested Software: ${packOutput.suggestedSoftware}`;
            finalAiResponseContent.push({ type: 'text', title: '3. Suggestions:', text: suggestionsText });
            if (packOutput.clarifyingQuestions && packOutput.clarifyingQuestions.length > 0) {
              finalAiResponseContent.push({ type: 'text', title: '4. Clarifying Questions to Ask Client:', text: " "});
              packOutput.clarifyingQuestions.forEach((q, index) => {
                finalAiResponseContent.push({ type: 'code', title: `Question ${index + 1}`, code: q });
              });
            }
          } else if (currentActionType === 'generateDesignIdeas') {
            const ideasInput: GenerateDesignIdeasInput = {
                ...baseInput, designInputText: userMessageContent || "general creative designs",
                attachedFiles: filesForFlow, chatHistory: chatHistoryForAI
            };
            const ideasOutput = await generateDesignIdeas(ideasInput);
            finalAiResponseContent.push({ type: 'text', title: 'Core Text/Saying for Ideas', text: ideasOutput.extractedTextOrSaying});
            if (ideasOutput.simulatedWebInspiration && ideasOutput.simulatedWebInspiration.length > 0) {
                finalAiResponseContent.push({ type: 'list', title: 'Simulated Web Inspiration', items: ideasOutput.simulatedWebInspiration.map(r => `${r.title} ([${r.link.length > 30 ? r.link.substring(0,27)+'...' : r.link }](${r.link})) - ${r.snippet}`) });
            }
            if (ideasOutput.creativeDesignIdeas && ideasOutput.creativeDesignIdeas.length > 0) {
                finalAiResponseContent.push({ type: 'list', title: 'Creative Design Ideas', items: ideasOutput.creativeDesignIdeas });
            }
            if (ideasOutput.typographyDesignIdeas && ideasOutput.typographyDesignIdeas.length > 0) {
                finalAiResponseContent.push({ type: 'list', title: 'Typography Design Ideas', items: ideasOutput.typographyDesignIdeas });
            }
          } else if (currentActionType === 'generateDesignPrompts') {
            const promptsInput: GenerateDesignPromptsInput = {
                ...baseInput, clientMessage: userMessageContent,
                attachedFiles: filesForFlow, chatHistory: chatHistoryForAI
            };
            const promptsOutput = await generateDesignPrompts(promptsInput);
            if (promptsOutput.imagePrompts && promptsOutput.imagePrompts.length > 0) {
                promptsOutput.imagePrompts.forEach((promptText, index) => {
                    finalAiResponseContent.push({ type: 'code', title: `AI Image Prompt ${index + 1}`, code: promptText });
                });
            } else {
                finalAiResponseContent.push({ type: 'text', text: "No image prompts generated. Ensure design ideas were provided or generated."});
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
                finalAiResponseContent.push({ type: 'text', title: 'টাইপিং ও টেক্সট ভুল', text: result.mistakeAnalysis.typingMistakes });
                finalAiResponseContent.push({ type: 'text', title: 'ভুল রঙ', text: result.mistakeAnalysis.wrongColors });
                finalAiResponseContent.push({ type: 'text', title: 'ভুল আকার', text: result.mistakeAnalysis.wrongSizes });
                finalAiResponseContent.push({ type: 'text', title: 'বাদ পড়া উপাদান', text: result.mistakeAnalysis.missingElements });
                finalAiResponseContent.push({ type: 'text', title: 'অন্যান্য ভুল', text: result.mistakeAnalysis.otherMistakes });
            }
          }
           else if (currentActionType === 'generateEditingPrompts') {
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
            finalAiResponseContent.push({type: 'text', text: "Action processed. No specific textual output to display for this action."});
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

        if (currentSession && userIdForHistory && isMounted.current && !aiCallError) { // Only save if no AI error
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

              saveSession(
                  sessionForSave,
                  (!messageIdToUpdate && !isUserMessageEdit) && (sessionForSave.messages.length <= 2 || !currentSession.name || currentSession.name === "New Chat"),
                  modelIdToUse,
                  apiKeyForNameGen
              ).then(sessionAfterSave => {
                  if (sessionAfterSave && isMounted.current) {
                      setCurrentSession(prev => {
                          if (prev && prev.id === sessionAfterSave.id) {
                              return { ...prev, name: sessionAfterSave.name, driveFileId: sessionAfterSave.driveFileId };
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
  ]);


  useEffect(() => {
    if (pendingAiRequestAfterEdit && isMounted.current) {
      const { content, attachments, isUserMessageEdit: isEdit, editedUserMessageId } = pendingAiRequestAfterEdit;
      handleSendMessage(
        content,
        'processMessage',
        undefined,
        attachments,
        isEdit,
        false,
        undefined,
        editedUserMessageId,
        isCustomMessage // Pass the current custom flag state
      );
      setPendingAiRequestAfterEdit(null);
    }
  }, [pendingAiRequestAfterEdit, handleSendMessage, isCustomMessage]);


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
    }
  }, [profileLoading, profile, currentSession, handleSendMessage, lastSelectedActionButton, isCustomMessage]);


  const handleConfirmEditAndResendUserMessage = useCallback((messageId: string, newContent: string, originalAttachments?: AttachedFile[]) => {
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
            linkedAssistantMessageId: linkedAssistantIdForHistory,
        };

        const updatedEditHistory = [...(targetMessage.editHistory || []), currentVersionToArchive];
        
        const updatedUserMessage: ChatMessage = {
          ...targetMessage,
          content: newContent,
          timestamp: Date.now(),
          attachedFiles: originalAttachments,
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
            });
        }
        
        return ensureMessagesHaveUniqueIds(messagesUpToEditedAndIncluding);
    });
  }, [ensureMessagesHaveUniqueIds, setMessages, setPendingAiRequestAfterEdit]);


  const handleAction = useCallback((action: ActionType) => {
    if (!profile) {
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
      // Pass isCustomMessage to use custom instructions if checkbox is checked
      handleSendMessage(inputMessage || '', action, undefined, undefined, false, false, undefined, undefined, isCustomMessage);
    }
  }, [inputMessage, handleSendMessage, profile, isCustomMessage]);

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
    const combinedFiles = [...selectedFiles, ...newFiles].slice(0, 5);
    setSelectedFiles(combinedFiles);
    const processedNewFiles = await processFilesForAI(newFiles);
    const uniqueProcessedFiles = new Map<string, AttachedFile>();
    currentAttachedFilesData.forEach(file => {
        uniqueProcessedFiles.set(`${file.name}_${file.size || 0}`, file);
    });
    processedNewFiles.forEach(file => {
        uniqueProcessedFiles.set(`${file.name}_${file.size || 0}`, file);
    });
    setCurrentAttachedFilesData(Array.from(uniqueProcessedFiles.values()).slice(0,5));
  }, [selectedFiles, currentAttachedFilesData]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) { handleFileSelectAndProcess(Array.from(event.target.files)); }
  };

  const clearSelectedFiles = () => {
    setSelectedFiles([]); setCurrentAttachedFilesData([]);
    if (fileInputRef.current) fileInputRef.current.value = '';
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

  const handleSyncWithDriveClick = async () => {
    if (!authUser) {
        if (isMounted.current) toast({ title: "Login Required", description: "Please log in to sync with Google Drive.", variant: "default" });
        return;
    }

    const result = await syncWithDrive();

    if (result === 'TOKEN_REFRESH_NEEDED' && isMounted.current) {
        if (isMounted.current) toast({ title: "Google Authentication Needed", description: "Please re-authenticate with Google to enable Drive sync.", variant: "default" });
        try {
            await triggerGoogleSignInFromAuth();
            setTimeout(async () => {
              if (isMounted.current) toast({ title: "Attempting Sync Again...", description: "Re-attempting Drive sync after authentication." });
              await syncWithDrive();
            }, 1500);
        } catch (error) {
            console.error("ChatPage (handleSyncWithDriveClick): Error during Google re-authentication:", error);
            if (isMounted.current) toast({ title: "Google Auth Error", description: "Failed to re-authenticate with Google.", variant: "destructive" });
        }
    }
  };

  const currentAttachedFilesDataLength = currentAttachedFilesData.length;

  if (authLoading || (!currentSession && !profileLoading && !historyHookLoading) ) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-var(--header-height,0px))] bg-gradient-to-b from-background-start-hsl to-background-end-hsl">
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
    <div className="flex h-[calc(100vh-var(--header-height,0px))] bg-gradient-to-br from-background-start-hsl to-background-end-hsl">
      {isMobile && isHistoryPanelOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm animate-fade-in" onClick={() => setIsHistoryPanelOpen(false)}>
          <div className="absolute left-0 top-0 h-full w-4/5 max-w-xs glass-panel border-r shadow-2xl animate-slide-in-left" onClick={(e) => e.stopPropagation()}>
            <HistoryPanel
              sessions={historyMetadata} activeSessionId={currentSession?.id || null}
              onSelectSession={handleSelectSession} onNewChat={handleNewChat}
              onDeleteSession={handleDeleteSession} isLoading={historyHookLoading}
              isLoggedIn={!!authUser}
            />
          </div>
        </div>
      )}
      {!isMobile && (
        <div
          className={cn(
            "glass-panel shrink-0 transition-all duration-300 ease-in-out h-full overflow-y-auto",
            isHistoryPanelOpen ? "w-[300px] p-0 border-r" : "w-0 border-r-0 opacity-0 p-0"
          )}
        >
          {isHistoryPanelOpen && (
            <div className="h-full overflow-hidden animate-fade-in">
              <HistoryPanel
                sessions={historyMetadata} activeSessionId={currentSession?.id || null}
                onSelectSession={handleSelectSession} onNewChat={handleNewChat}
                onDeleteSession={handleDeleteSession} isLoading={historyHookLoading}
                isLoggedIn={!!authUser}
                className="animate-fade-in"
              />
            </div>
          )}
        </div>
      )}

      <div className="flex-1 flex flex-col bg-transparent overflow-hidden" ref={dropZoneRef} onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop}>
        <div className="px-4 py-3 border-b flex items-center justify-between sticky top-0 bg-card/30 backdrop-blur-md z-10 shadow-md min-h-[57px] animate-fade-in transition-all duration-300">
          <div className="flex items-center">
            <Button variant="ghost" size="icon" onClick={() => setIsHistoryPanelOpen(prev => !prev)} aria-label="Toggle history panel" className="hover:bg-primary/20 btn-glow rounded-full">
              {isMobile ? (isHistoryPanelOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />)
                       : (isHistoryPanelOpen ? <PanelLeftClose className="h-5 w-5" /> : <PanelLeftOpen className="h-5 w-5" />)}
            </Button>
            <h2 className="ml-3 font-semibold text-xl truncate text-gradient" title={currentSession?.name || "Chat"}>{currentSession?.name || "Chat"}</h2>
          </div>
          <div className="flex items-center gap-3">
             { authUser && isGoogleUser && (
                <Button variant="outline" size="sm" onClick={handleSyncWithDriveClick} disabled={isSyncing} className="hover:bg-primary/10 hover:text-primary transition-colors duration-300 rounded-full shadow-md btn-glow">
                    {isSyncing ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <RefreshCw className="h-4 w-4 mr-2" />}
                    Sync with Drive
                </Button>
            )}
            <Button variant="secondary" size="sm" onClick={handleNewChat} className="hover:bg-accent hover:text-accent-foreground transition-colors duration-300 rounded-full shadow-md btn-glow">
                <PlusCircle className="h-4 w-4 mr-2" /> New Chat
            </Button>
          </div>
        </div>

        <ScrollArea className="flex-1 p-2 md:p-4" ref={chatAreaRef}>
          <div className="space-y-4 w-full stagger-animation">
            {messages.map((msg) => (
              <ChatMessageDisplay
                key={msg.id}
                message={msg}
                onRegenerate={handleRegenerateMessage}
                onConfirmEditAndResend={handleConfirmEditAndResendUserMessage}
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

        <div className={cn("relative border-t p-4 md:p-5 glass-panel bg-background/60 backdrop-blur-xl shadow-xl", isDragging && "opacity-50")}>
          <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-primary/10 via-primary/40 to-primary/10"></div>

          {currentAttachedFilesData.length > 0 && (
            <div className="mt-1 mb-3 text-xs glass-panel bg-background/80 p-3 rounded-xl border border-primary/10 shadow-md animate-fade-in flex items-center">
              <div className="flex-1 truncate">
                <span className="font-medium bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">Attached:</span>
                <span className="ml-1 text-foreground/80">{currentAttachedFilesData.map(f => f.name).join(', ')}</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="ml-2 h-7 text-destructive/80 hover:text-destructive hover:bg-destructive/10 transition-all duration-300 rounded-full btn-glow"
                onClick={clearSelectedFiles}
              >
                <X className="h-3.5 w-3.5 mr-1" /> Clear
              </Button>
            </div>
          )}

          <div className="flex items-end gap-2 animate-fade-in transition-all duration-300">
            <div className="relative w-full group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/20 via-secondary/20 to-primary/20 rounded-xl blur opacity-30 group-hover:opacity-70 transition-opacity duration-500"></div>
              <Textarea
                ref={inputTextAreaRef}
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type your client's message or your query here... (or drag & drop files)"
                className="relative flex-1 resize-none min-h-[65px] max-h-[150px] rounded-xl shadow-lg focus-visible:ring-2 focus-visible:ring-primary glass-panel border-primary/20 transition-all duration-300 w-full pr-14 z-10 bg-background/60 backdrop-blur-lg"
                rows={Math.max(1, Math.min(5, inputMessage.split('\n').length))}
              />
              <div className="absolute bottom-3 right-3 opacity-60 group-hover:opacity-90 transition-opacity duration-300 z-20">
                <div className="relative">
                  <div className="absolute inset-0 bg-primary/10 rounded-full blur-sm animate-pulse-slow"></div>
                  <BotIcon className="h-5 w-5 text-primary relative" />
                </div>
              </div>
            </div>
          </div>

          <div className={cn(
              "flex flex-wrap items-center justify-between mt-4 gap-x-3 gap-y-2",
               isMobile ? "flex-col items-stretch gap-y-3" : ""
            )}>
            <div className={cn("flex-shrink-0 animate-stagger", isMobile ? "w-full" : "")} style={{ animationDelay: '100ms' }}>
              <Button
                variant="outline"
                size={isMobile ? "default" : "sm"}
                onClick={() => fileInputRef.current?.click()}
                className={cn(
                    "backdrop-blur-sm border border-primary/20 shadow-sm hover:shadow-md hover:scale-105 hover:text-primary hover:bg-primary/10 transition-all duration-300 rounded-full btn-glow",
                    isMobile ? "w-full py-3 text-sm flex items-center justify-center p-2" : "px-3 py-1.5 md:px-3.5 md:py-2"
                )}
                aria-label="Attach files"
              >
                <div className="relative">
                  <div className="absolute inset-0 bg-primary/10 rounded-full blur-sm group-hover:animate-pulse-slow"></div>
                  <Paperclip className={cn("h-4 w-4 relative z-10", !isMobile && "mr-1.5")} />
                </div>
                {!isMobile && "Attach Files"}
                {isMobile && <span className="ml-2">Attach Files</span>}
              </Button>
              <input type="file" ref={fileInputRef} multiple onChange={handleFileChange} className="hidden" accept="image/*,application/pdf,.txt,.md,.json"/>
            </div>
            
            {/* Custom Message Checkbox */}
            <div className={cn("flex items-center gap-2 animate-stagger", isMobile ? "order-last w-full justify-center mt-2" : "")} style={{ animationDelay: '150ms' }}>
              <TooltipProvider delayDuration={200}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex items-center gap-2">
                      <Checkbox
                        id="custom-message"
                        checked={isCustomMessage}
                        onCheckedChange={(checked) => setIsCustomMessage(checked as boolean)}
                        className="data-[state=checked]:bg-accent data-[state=checked]:border-accent"
                      />
                      <label
                        htmlFor="custom-message"
                        className="text-sm font-medium cursor-pointer select-none hover:text-accent transition-colors duration-200"
                      >
                        Custom
                      </label>
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
            </div>
            
            <div className={cn("flex-1 flex justify-end animate-stagger", isMobile ? "w-full justify-center mt-0" : "")} style={{ animationDelay: '200ms' }}>
              <ActionButtonsPanel
                onAction={handleAction}
                isLoading={isLoading}
                currentUserMessage={inputMessage}
                profile={profile}
                currentAttachedFilesDataLength={currentAttachedFilesDataLength}
                isMobile={isMobile}
                activeButton={activeActionButton}
                lastSelectedButton={lastSelectedActionButton}
              />
            </div>
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
    </div>
  );
}

