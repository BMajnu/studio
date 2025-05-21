
'use client';

import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { Paperclip, Loader2, BotIcon, Menu, XIcon as XCloseIcon, PanelLeftOpen, PanelLeftClose, Palette, SearchCheck, ClipboardSignature, ListChecks, ClipboardList, Lightbulb, Terminal, Plane, RotateCcw, PlusCircle, Edit3, RefreshCw, Send, LogIn, UserPlus, Languages, X } from 'lucide-react'; // Added X
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ChatMessageDisplay } from '@/components/chat/chat-message';
import { ActionButtonsPanel, type ActionType } from '@/components/chat/action-buttons';
import { HistoryPanel } from '@/components/chat/history-panel';
import { useToast } from "@/hooks/use-toast";
import { useUserProfile } from '@/lib/hooks/use-user-profile';
import { useChatHistory } from '@/lib/hooks/use-chat-history';
import type { ChatMessage, UserProfile, ChatMessageContentPart, AttachedFile, ChatSession } from '@/lib/types';
import { processClientMessage, type ProcessClientMessageInput, type ProcessClientMessageOutput } from '@/ai/flows/process-client-message';
import { generatePlatformMessages, type GeneratePlatformMessagesInput } from '@/ai/flows/generate-platform-messages';
import { analyzeClientRequirements, type AnalyzeClientRequirementsInput, type AnalyzeClientRequirementsOutput } from '@/ai/flows/analyze-client-requirements';
import { generateEngagementPack, type GenerateEngagementPackInput } from '@/ai/flows/generate-engagement-pack-flow';
import { generateDesignIdeas, type GenerateDesignIdeasInput } from '@/ai/flows/generate-design-ideas-flow';
import { generateDesignPrompts, type GenerateDesignPromptsInput } from '@/ai/flows/generate-design-prompts-flow';
import { checkMadeDesigns, type CheckMadeDesignsInput, type CheckMadeDesignsOutput } from '@/ai/flows/check-made-designs-flow';
import { generateEditingPrompts, type GenerateEditingPromptsInput, type GenerateEditingPromptsOutput } from '@/ai/flows/generate-editing-prompts-flow';


import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import { DEFAULT_USER_ID, DEFAULT_MODEL_ID } from '@/lib/constants';
import { useAuth } from '@/contexts/auth-context';
import type { User as FirebaseUser } from 'firebase/auth';
import { LoginForm } from '@/components/auth/login-form';


const getMessageText = (content: string | ChatMessageContentPart[]): string => {
  if (typeof content === 'string') return content;
  if (!Array.isArray(content) || content.length === 0) return '[Empty Message Content]';

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
         } else {
           fullText += `[Empty List${part.title ? ` for "${part.title}"`: ''}]\n`;
         }
        break;
      case 'translation_group':
        fullText += titlePrefix;
        let tgContent = "";
        if (part.english?.analysis) tgContent += `**Analysis (English):**\n${part.english.analysis}\n\n`;
        if (part.english?.simplifiedRequest) tgContent += `**Simplified Request (English):**\n${part.english.simplifiedRequest}\n\n`;
        if (part.english?.stepByStepApproach) tgContent += `**Step-by-Step Approach (English):**\n${part.english.stepByStepApproach}\n\n`;
        
        let bengaliCombined = "";
        // Check if bengali.analysis already contains the other two parts
        if (part.bengali?.analysis && (part.bengali.analysis.includes(part.bengali.simplifiedRequest || "______") || part.bengali.analysis.includes(part.bengali.stepByStepApproach || "______"))) {
            bengaliCombined = part.bengali.analysis; 
        } else if (part.bengali?.simplifiedRequest || part.bengali?.stepByStepApproach) { 
            // If not, construct it. This assumes bengali.analysis might be a general intro if others are separate.
            let tempBengali = "";
            // Include bengali.analysis first if it exists and is distinct
            if (part.bengali?.analysis && !part.bengali.analysis.includes(part.bengali.simplifiedRequest || "______") && !part.bengali.analysis.includes(part.bengali.stepByStepApproach || "______")) {
                tempBengali += `${part.bengali.analysis}\n\n`;
            }
            if(part.bengali.simplifiedRequest) tempBengali += `সরলীকৃত অনুরোধ (Simplified Request):\n${part.bengali.simplifiedRequest}\n\n`;
            if(part.bengali.stepByStepApproach) tempBengali += `ধাপে ধাপে পদ্ধতি (Step-by-Step Approach):\n${part.bengali.stepByStepApproach}`;
            
            // If only analysis was present and the others were embedded, it's already set
            if (!bengaliCombined && part.bengali?.analysis && !part.bengali.simplifiedRequest && !part.bengali.stepByStepApproach) {
                 bengaliCombined = part.bengali.analysis;
            } else {
                 bengaliCombined = tempBengali.trim();
            }
        } else if (part.bengali?.analysis) { // Fallback if only analysis is present
            bengaliCombined = part.bengali.analysis;
        }
        
        if (bengaliCombined.trim()) {
          if (tgContent.trim()) tgContent += "\n---\n"; 
          tgContent += `**বিশ্লেষণ ও পরিকল্পনা (Bengali):**\n${bengaliCombined.trim()}\n`;
        }
        
        if (!tgContent.trim()) { 
            tgContent = `[Empty Translation Group${part.title ? ` for "${part.title}"`: ''}]\n`;
        }
        fullText += tgContent;
        break;
      default:
        // Attempt to get some textual representation for unknown parts
        const unknownPart = part as any; // Cast to any to try common properties
        let unknownTextContent = '';
        if (unknownPart.text) unknownTextContent = String(unknownPart.text);
        else if (unknownPart.code) unknownTextContent = String(unknownPart.code);
        else if (unknownPart.message) unknownTextContent = String(unknownPart.message); // For some error-like objects
        else if (unknownPart.items && Array.isArray(unknownPart.items) && unknownPart.items.length > 0) { // For simple lists not caught by 'list' type
          unknownTextContent = unknownPart.items.join('\n');
        }
        
        if (unknownTextContent) {
          fullText += `${titlePrefix}${unknownTextContent}\n`;
        } else {
           // Minimal fallback if no obvious text content
           fullText += `${titlePrefix}[Unsupported Content Part: ${unknownPart.type || 'Unknown Type'}${part.title ? ` for "${part.title}"`: ''}]\n`;
        }
    }
    fullText += '\n'; // Add a newline after each part for better separation in history
  });
  return fullText.trim() || '[Empty Message Content Parts]'; // Ensure empty parts don't lead to empty history entry
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
    // Check if ID is invalid (e.g., just a number, doesn't match prefix, or is a duplicate)
    const isInvalidOldId = typeof newId !== 'string' || !newId.startsWith('msg-') || newId.split('-').length < 3;

    if (isInvalidOldId || seenIds.has(newId)) {
      let candidateId = generateRobustMessageId();
      while (seenIds.has(candidateId)) { // Ensure truly unique in this batch
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


  const userIdForHistory = useMemo(() => {
    // Prioritize authUser.uid if available and auth is not loading
    if (!authLoading && authUser) return authUser.uid;
    // Fallback to profile.userId if profile is loaded and exists
    if (!profileLoading && profile) return profile.userId;
    // Final fallback to DEFAULT_USER_ID if others are not ready
    return DEFAULT_USER_ID; 
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
    triggerGoogleSignIn: triggerGoogleSignInForHistory, // This is from useChatHistory's return
  } = useChatHistory(userIdForHistory); 

  const [currentSession, setCurrentSession] = useState<ChatSession | null>(null);
  const isMobile = useIsMobile();
  const [isHistoryPanelOpen, setIsHistoryPanelOpen] = useState(isMobile === undefined ? true : !isMobile);

  const currentApiKeyIndexRef = useRef(0);

  const ensureMessagesHaveUniqueIds = useCallback(baseEnsureMessagesHaveUniqueIds, []);

  useEffect(() => {
    // Set initial state of history panel once isMobile is determined
    if (isMobile !== undefined && isHistoryPanelOpen === undefined) { // Only set if undefined to avoid overriding user toggle
        setIsHistoryPanelOpen(!isMobile);
    }
  }, [isMobile, isHistoryPanelOpen]); // isHistoryPanelOpen dependency might be removed if we don't want to reset on toggle


  // Effect for loading or creating the initial session
  useEffect(() => {
    const loadOrCreateSession = async () => {
      // Wait for all loading states to complete and for userIdForHistory to be stable
      if (authLoading || profileLoading || historyHookLoading || !userIdForHistory) {
        console.log(`ChatPage SessionInitEffect: Deferred due to loading states or no userIdForHistory. Loadings: auth=${authLoading}, profile=${profileLoading}, history=${historyHookLoading}. UserID: ${userIdForHistory}`);
        return;
      }
  
      console.log(`ChatPage SessionInitEffect: Running for user ${userIdForHistory}. History Metadata Count: ${historyMetadata.length}`);
      const currentUserIdToUse = userIdForHistory;
      const lastActiveSessionIdKey = LAST_ACTIVE_SESSION_ID_KEY_PREFIX + currentUserIdToUse;
      let lastActiveSessionId = localStorage.getItem(lastActiveSessionIdKey);
      let sessionToLoad: ChatSession | null = null;
  
      if (lastActiveSessionId && lastActiveSessionId.startsWith(currentUserIdToUse + '_')) {
        console.log(`ChatPage SessionInitEffect: Attempting to load session ${lastActiveSessionId} for user ${currentUserIdToUse}.`);
        sessionToLoad = await getSession(lastActiveSessionId);
        
        // Additional validation: ensure the loaded session is still in the current historyMetadata
        if (sessionToLoad && !historyMetadata.some(m => m.id === sessionToLoad!.id)) {
            console.warn(`ChatPage SessionInitEffect: Loaded session ${sessionToLoad.id} from LS, but not in current historyMetadata (e.g. Drive sync removed it or it's outdated). Discarding.`);
            sessionToLoad = null; // Invalidate it
            localStorage.removeItem(lastActiveSessionIdKey); // Clear the potentially problematic ID
            lastActiveSessionId = null;
        } else if (sessionToLoad && sessionToLoad.userId !== currentUserIdToUse) {
          // This case should ideally be caught by the prefix check, but as a safeguard
          console.warn(`ChatPage SessionInitEffect: Loaded session ${lastActiveSessionId} belongs to a different user (${sessionToLoad.userId}) than current ${currentUserIdToUse}. Discarding.`);
          sessionToLoad = null; 
          localStorage.removeItem(lastActiveSessionIdKey); 
          lastActiveSessionId = null;
        } else if (!sessionToLoad && historyMetadata.some(m => m.id === lastActiveSessionId)) {
           // Last active ID is in metadata but getSession returned null (e.g., Drive fetch failed but local was also removed/corrupted)
           console.warn(`ChatPage SessionInitEffect: Last active session ID ${lastActiveSessionId} found in metadata but getSession returned null. Clearing ID from LS.`);
           localStorage.removeItem(lastActiveSessionIdKey);
           lastActiveSessionId = null;
        }
      } else if (lastActiveSessionId) {
        // Last active ID doesn't belong to the current user
        console.warn(`ChatPage SessionInitEffect: lastActiveSessionId ${lastActiveSessionId} does not match current user ${currentUserIdToUse}. Clearing ID from LS.`);
        localStorage.removeItem(lastActiveSessionIdKey);
        lastActiveSessionId = null;
      }
  
      if (sessionToLoad) {
        console.log(`ChatPage SessionInitEffect: Loaded last active session ${sessionToLoad.id}. Migrating message IDs if necessary.`);
        const migratedMessages = ensureMessagesHaveUniqueIds(sessionToLoad.messages);
        const updatedSession = { ...sessionToLoad, messages: migratedMessages };
        setCurrentSession(updatedSession);
        setMessages(updatedSession.messages);
      } else {
        console.log(`ChatPage SessionInitEffect: No valid last active session for user ${currentUserIdToUse}. Creating new.`);
        const userApiKeyForNameGen = (profile?.geminiApiKeys && profile.geminiApiKeys.length > 0 && profile.geminiApiKeys[0]) ? profile.geminiApiKeys[0] : undefined;
        const newSession = createNewSession([], profile?.selectedGenkitModelId || DEFAULT_MODEL_ID, userApiKeyForNameGen);
        setCurrentSession(newSession);
        setMessages(newSession.messages); // Start with welcome messages or empty
        if (newSession.id && newSession.id.startsWith(currentUserIdToUse + '_')) {
          localStorage.setItem(lastActiveSessionIdKey, newSession.id);
        } else {
          console.warn("ChatPage SessionInitEffect (New Session): New session ID mismatch or null.", newSession?.id, currentUserIdToUse);
        }
      }
    };
  
    loadOrCreateSession();
  }, [ 
      authLoading, profileLoading, historyHookLoading, userIdForHistory, 
      historyMetadata.length, // Re-evaluate if history metadata content changes significantly
      profile?.selectedGenkitModelId, profile?.geminiApiKeys,
      getSession, createNewSession, ensureMessagesHaveUniqueIds // Callbacks from useChatHistory
  ]);


  useEffect(() => {
    if (chatAreaRef.current) {
      chatAreaRef.current.scrollTop = chatAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const addMessage = useCallback((role: 'user' | 'assistant' | 'system', content: string | ChatMessageContentPart[], currentAttachments?: AttachedFile[], isLoadingParam?: boolean, isErrorParam?: boolean, originalRequest?: ChatMessage['originalRequest']) => {
    const newMessageId = generateRobustMessageId();
    const newMessage: ChatMessage = {
      id: newMessageId, role, content, timestamp: Date.now(),
      isLoading: isLoadingParam, isError: isErrorParam,
      attachedFiles: role === 'user' ? currentAttachments : undefined,
      canRegenerate: role === 'assistant' && !!originalRequest,
      originalRequest: role === 'assistant' ? originalRequest : undefined,
    };
    setMessages(prev => ensureMessagesHaveUniqueIds([...prev, newMessage]));
    return newMessageId;
  }, [ensureMessagesHaveUniqueIds]);

  const updateMessageById = useCallback((messageId: string, newContent: string | ChatMessageContentPart[], isLoadingParam: boolean = false, isErrorParam: boolean = false, originalRequestDetails?: ChatMessage['originalRequest']) => {
    setMessages(prev => {
      if (prev.length === 0) return prev; // Should not happen if we are updating
      const updatedMessages = prev.map(msg =>
        msg.id === messageId ? {
            ...msg, content: newContent, isLoading: isLoadingParam, isError: isErrorParam,
            timestamp: Date.now(), // Update timestamp on content change
            canRegenerate: !!originalRequestDetails, // Can regenerate if we have original request details
            originalRequest: originalRequestDetails // Store the request details
        } : msg
      );
      return ensureMessagesHaveUniqueIds(updatedMessages);
    });
  }, [ensureMessagesHaveUniqueIds]);

  const handleNewChat = useCallback(() => {
    const currentUserId = userIdForHistory; // Get the most up-to-date userIdForHistory
    const modelIdToUse = (profile?.selectedGenkitModelId || DEFAULT_MODEL_ID);
    const userApiKeyForNewChatNameGen = (profile?.geminiApiKeys && profile.geminiApiKeys.length > 0 && profile.geminiApiKeys[0]) ? profile.geminiApiKeys[0] : undefined;
    
    console.log(`ChatPage (handleNewChat): Creating new session for user ${currentUserId}.`);
    const newSession = createNewSession([], modelIdToUse, userApiKeyForNewChatNameGen);
    setCurrentSession(newSession);
    setMessages(newSession.messages); // Ensure messages state is reset for new chat
    setInputMessage('');
    setSelectedFiles([]);
    setCurrentAttachedFilesData([]);
    currentApiKeyIndexRef.current = 0; // Reset API key index for the new chat

    const lastActiveSessionIdKey = LAST_ACTIVE_SESSION_ID_KEY_PREFIX + currentUserId;
    if (newSession.id && newSession.id.startsWith(currentUserId + '_')) {
      localStorage.setItem(lastActiveSessionIdKey, newSession.id);
    } else {
       console.warn("ChatPage (handleNewChat): New session ID mismatch or null.", newSession?.id, currentUserId);
    }
    if (isMobile) setIsHistoryPanelOpen(false);
  }, [createNewSession, userIdForHistory, isMobile, profile?.selectedGenkitModelId, profile?.geminiApiKeys]);

  const handleSelectSession = useCallback(async (sessionId: string) => {
    const currentUserId = userIdForHistory;
    if (!currentUserId || !sessionId.startsWith(currentUserId + '_')) {
        // This might happen if userIdForHistory is not yet updated to the logged-in user
        // or if an invalid sessionId is clicked.
        toast({ title: "Error Loading Session", description: `Session ${sessionId} may belong to a different user or is invalid. Starting new chat.`, variant: "destructive" });
        localStorage.removeItem(LAST_ACTIVE_SESSION_ID_KEY_PREFIX + currentUserId); // Clear potentially bad key
        handleNewChat(); // Default to new chat
        return;
    }

    console.log(`ChatPage (handleSelectSession): Selecting session ${sessionId} for user ${currentUserId}.`);
    const selected = await getSession(sessionId);
    if (selected && selected.id === sessionId && selected.userId === currentUserId) { // Double check userId match
      const migratedMessages = ensureMessagesHaveUniqueIds(selected.messages);
      const updatedSession = { ...selected, messages: migratedMessages };
      setCurrentSession(updatedSession);
      setMessages(updatedSession.messages);
      currentApiKeyIndexRef.current = 0; // Reset API key index for the selected chat
      const lastActiveSessionIdKey = LAST_ACTIVE_SESSION_ID_KEY_PREFIX + currentUserId;
      localStorage.setItem(lastActiveSessionIdKey, sessionId);
    } else { 
        // Session might be null if getSession fails (e.g., corrupted or Drive fetch fails)
        toast({ title: "Error Loading Session", description: `Could not load session ${sessionId}. It might be corrupted or missing. Starting new chat.`, variant: "destructive" });
        localStorage.removeItem(LAST_ACTIVE_SESSION_ID_KEY_PREFIX + currentUserId); // Clear bad key
        handleNewChat(); // Default to new chat
    }
    if (isMobile) setIsHistoryPanelOpen(false);
  }, [getSession, ensureMessagesHaveUniqueIds, userIdForHistory, isMobile, toast, handleNewChat]);

  const handleDeleteSession = useCallback((sessionId: string) => {
    console.log(`ChatPage (handleDeleteSession): Deleting session ${sessionId}.`);
    deleteSession(sessionId); // This will also update historyMetadata via its internal setState
    if (currentSession?.id === sessionId) {
      console.log(`ChatPage (handleDeleteSession): Current session ${sessionId} was deleted. Creating new chat.`);
      handleNewChat();
    }
  }, [deleteSession, currentSession?.id, handleNewChat]);

  // --- File Handling ---
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
      // For other types (PDF, etc.), we just pass name, type, size. The AI flow prompt handles this.
      processedFiles.push(basicInfo);
    }
    return processedFiles;
  };

  const handleSendMessage = useCallback(async (
    messageTextParam: string,
    actionTypeParam: ActionType,
    notesParam?: string,
    attachedFilesDataParam?: AttachedFile[], // For regeneration, these are the *original* attachments
    isRegenerationCall: boolean = false,
    messageIdToUpdate?: string // For regeneration, this is the assistant message ID to update
  ) => {

    if (profileLoading) {
        toast({ title: "Profile Loading...", description: "Please wait for your profile data to load.", variant: "default" });
        return;
    }
    if (!profile) {
      toast({ title: "Profile not loaded", description: "Please set up your profile or wait for it to load.", variant: "destructive" });
      return;
    }
    if (!currentSession) {
        toast({ title: "Session not initialized", description: "Please wait or try creating a new chat.", variant: "destructive" });
        return;
    }

    if (!isRegenerationCall) { // Reset API key index for new user actions
        currentApiKeyIndexRef.current = 0;
    }

    const userProfile = profile;
    const availableUserApiKeys = userProfile.geminiApiKeys?.filter(key => key && key.trim() !== '') || [];
    let apiKeyToUseThisTurn: string | undefined;

    if (availableUserApiKeys.length > 0) {
        // Use the key at the current index, cycling if needed (though cycling logic is more for errors)
        apiKeyToUseThisTurn = availableUserApiKeys[currentApiKeyIndexRef.current % availableUserApiKeys.length]; 
    } else { apiKeyToUseThisTurn = undefined; } // Fallback to global .env key
    console.log(`ChatPage (handleSendMessage): API key index ${currentApiKeyIndexRef.current} (Key: ${apiKeyToUseThisTurn ? `USER_KEY_***${apiKeyToUseThisTurn.slice(-4)}` : 'GLOBAL_KEY_OR_NONE'}) for action: ${actionTypeParam}`);


    const currentMessageText = messageTextParam.trim();
    const currentActionType = actionTypeParam;
    const currentNotes = notesParam;
    // If it's a regeneration, use the original attachments. Otherwise, use currentAttachedFilesData.
    const filesToSendWithThisMessage = isRegenerationCall && attachedFilesDataParam ? attachedFilesDataParam : [...currentAttachedFilesData];
    
    // Specific check for 'checkMadeDesigns' action
     if (actionTypeParam === 'checkMadeDesigns' && filesToSendWithThisMessage.filter(f => f.type?.startsWith('image/') && f.dataUri).length === 0) {
        toast({ title: "No Design Attached", description: `Please attach a design image to use the 'Check Designs' feature.`, variant: "destructive" });
        return;
    }
    // Specific check for 'generateEditingPrompts' when NOT a regeneration (flow will handle for regeneration)
    if (actionTypeParam === 'generateEditingPrompts' && !isRegenerationCall && filesToSendWithThisMessage.filter(f => f.type?.startsWith('image/') && f.dataUri).length === 0) {
        // This path is now less likely as the flow itself handles missing image.
        // However, keeping a client-side hint if useful.
        // toast({ title: "No Design Attached for Editing", description: `Please attach an image to generate editing prompts. The AI can also try to use a recent image from history.`, variant: "default" });
        // For this action, we proceed and let the flow decide.
    }
    
    const modelIdToUse = userProfile.selectedGenkitModelId || DEFAULT_MODEL_ID;
    
    // Determine user message content only if it's NOT a regeneration of an assistant message OR if it's a user message edit
    const userMessageContent = (!isRegenerationCall || (isRegenerationCall && currentMessageText && !messageIdToUpdate) ) // if messageIdToUpdate is present, it's an assistant regen.
        ? (currentMessageText || (filesToSendWithThisMessage.length > 0 ? `Attached ${filesToSendWithThisMessage.length} file(s)${currentNotes ? ` (Notes: ${currentNotes})` : ''}` : `Triggered action: ${currentActionType}${currentNotes ? ` (Notes: ${currentNotes})` : ''}`))
        : ''; // No new user message text for assistant regeneration

    // Store details needed to regenerate this AI response
    const requestParamsForRegeneration: ChatMessage['originalRequest'] = {
        actionType: currentActionType, messageText: currentMessageText, 
        notes: currentNotes, attachedFilesData: filesToSendWithThisMessage, // these are the *original* attachments for this turn
        messageIdToRegenerate: messageIdToUpdate // This will be the assistant's message ID we're about to update/create
    };

    let assistantMessageIdToUse: string;
    let userMessageId: string | null = null;

    if (messageIdToUpdate) { // This is an assistant message regeneration
        assistantMessageIdToUse = messageIdToUpdate;
        updateMessageById(assistantMessageIdToUse, 'Processing...', true, false, requestParamsForRegeneration);
    } else { // New user action or user message edit (which triggers a new AI sequence)
        // Add user message only if there's content or files (and not an assistant regen)
        if (userMessageContent.trim() !== '' || filesToSendWithThisMessage.length > 0) {
          userMessageId = addMessage('user', userMessageContent, filesToSendWithThisMessage);
        }
        // Add a new "Processing..." message for the assistant
        assistantMessageIdToUse = addMessage('assistant', 'Processing...', [], true, false, requestParamsForRegeneration);
    }

    setIsLoading(true);
    if (!isRegenerationCall && !messageIdToUpdate) { // Clear input only for brand new user submissions
        setInputMessage('');
        setSelectedFiles([]);
        setCurrentAttachedFilesData([]);
        if (fileInputRef.current) fileInputRef.current.value = '';
    }

    let finalAiResponseContent: ChatMessageContentPart[] = [];
    let aiCallError: any = null;

    try {
      const baseInput = {
        userName: userProfile.name, communicationStyleNotes: userProfile.communicationStyleNotes || '',
        modelId: modelIdToUse, userApiKey: apiKeyToUseThisTurn,
      };
      // Prepare files for the flow, ensuring they have the structure the flows expect.
      const filesForFlow = filesToSendWithThisMessage.map(f => ({ name: f.name, type: f.type, dataUri: f.dataUri, textContent: f.textContent, size: f.size }));
      
      // Use a functional update for setMessages to get the most current messages state for chatHistoryForAI
      let chatHistoryForAI: { role: 'user' | 'assistant'; text: string }[] = [];
      setMessages(prevMessages => {
          chatHistoryForAI = prevMessages
            // Exclude the current "Processing..." message and the user message that just triggered it
            .filter(msg => msg.id !== assistantMessageIdToUse && (!userMessageId || msg.id !== userMessageId) ) 
            .slice(-10) // Take last 10 relevant messages for context
            .map(msg => ({
              role: msg.role === 'user' ? ('user' as const) : ('assistant' as const), // Ensure role is correctly typed
              text: getMessageText(msg.content)
            }))
            // Filter out any system messages or messages that became empty after getMessageText
            .filter(msg => msg.text.trim() !== '' && (msg.role === 'user' || msg.role === 'assistant'));
          return prevMessages; // No change in this setter, just getting the latest state
      });


      if (currentActionType === 'processMessage') {
        const processInput: ProcessClientMessageInput = { ...baseInput, clientMessage: currentMessageText, attachedFiles: filesForFlow, chatHistory: chatHistoryForAI };
        const processed: ProcessClientMessageOutput = await processClientMessage(processInput);
        finalAiResponseContent.push({
          type: 'translation_group', title: 'Client Request Analysis & Plan',
          english: { analysis: processed.analysis, simplifiedRequest: processed.simplifiedRequest, stepByStepApproach: processed.stepByStepApproach },
          bengali: { analysis: processed.bengaliTranslation } // Assuming bengaliTranslation contains all parts
        });
      } else if (currentActionType === 'analyzeRequirements') {
        const requirementsInput: AnalyzeClientRequirementsInput = { ...baseInput, clientMessage: currentMessageText, attachedFiles: filesForFlow, chatHistory: chatHistoryForAI };
        const requirementsOutput: AnalyzeClientRequirementsOutput = await analyzeClientRequirements(requirementsInput);
        finalAiResponseContent.push({ type: 'text', title: 'Main Requirements Analysis', text: requirementsOutput.mainRequirementsAnalysis });
        finalAiResponseContent.push({ type: 'text', title: 'Detailed Requirements (English)', text: requirementsOutput.detailedRequirementsEnglish });
        finalAiResponseContent.push({ type: 'text', title: 'Detailed Requirements (Bangla)', text: requirementsOutput.detailedRequirementsBangla });
        finalAiResponseContent.push({ type: 'text', title: 'Design Message or Saying', text: requirementsOutput.designMessageOrSaying });
      } else if (currentActionType === 'generateEngagementPack') {
        const engagementInput: GenerateEngagementPackInput = {
          ...baseInput, clientMessage: currentMessageText, designerName: userProfile.name,
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
          finalAiResponseContent.push({ type: 'text', title: '4. Clarifying Questions to Ask Client:', text: " "}); // Title part
          packOutput.clarifyingQuestions.forEach((q, index) => {
            finalAiResponseContent.push({ type: 'code', title: `Question ${index + 1}`, code: q });
          });
        }
      } else if (currentActionType === 'generateDesignIdeas') {
        const ideasInput: GenerateDesignIdeasInput = {
            ...baseInput, designInputText: currentMessageText || "general creative designs", // Provide a default if message is empty
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
            ...baseInput, clientMessage: currentMessageText,
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
          // This error should ideally be caught before calling the flow if it's a hard requirement
          finalAiResponseContent = [{type: 'text', text: "Please attach a design image to check."}];
          aiCallError = new Error("Missing design image for CheckMadeDesigns."); // Set an error to be handled by catch
        } else {
            const checkInput: CheckMadeDesignsInput = {
            ...baseInput, clientPromptOrDescription: currentMessageText || "Client requirements as per conversation history.",
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
        // Find the first image with a dataUri from the currently attached files for this specific action
        const designFile = filesForFlow.find(f => f.type?.startsWith('image/') && f.dataUri);
        if (designFile && designFile.dataUri) { designToEditDataUriForFlow = designFile.dataUri; } 
        
        const editingInput: GenerateEditingPromptsInput = {
            ...baseInput, designToEditDataUri: designToEditDataUriForFlow, // Pass undefined if no current image
            clientInstructionForEditingTheme: currentMessageText, // User's current input acts as theme
            chatHistory: chatHistoryForAI,
        };
        const result: GenerateEditingPromptsOutput = await generateEditingPrompts(editingInput);
        if (result.editingPrompts && result.editingPrompts.length > 0) {
            if (result.editingPrompts.length === 1 && result.editingPrompts[0].type === "error_no_image_found") {
                // AI couldn't find an image directly or in history
                finalAiResponseContent.push({ type: 'text', title: 'Error', text: result.editingPrompts[0].prompt });
                toast({ title: "Image Not Found For Editing", description: result.editingPrompts[0].prompt, variant: "destructive" });
            } else {
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
          deliveryNotes: currentActionType === 'generateDeliveryTemplates' ? (currentNotes || currentMessageText) : '',
          revisionNotes: currentActionType === 'generateRevision' ? (currentNotes || currentMessageText) : '',
          fiverrUsername: userProfile.fiverrUsername || '',
          customSellerFeedbackTemplate: userProfile.customSellerFeedbackTemplate || '',
          customClientFeedbackResponseTemplate: userProfile.customClientFeedbackResponseTemplate || '',
          messageType: currentActionType === 'generateDeliveryTemplates' ? 'delivery' : 'revision',
          modelId: modelIdToUse, userApiKey: apiKeyToUseThisTurn,
        };
        const platformMessagesOutput = await generatePlatformMessages(platformInput);
        if (platformMessagesOutput.messages && platformMessagesOutput.messages.length > 0) {
             platformMessagesOutput.messages.forEach(m => {
                const messageTitle = m.type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()); // Format type as title
                finalAiResponseContent.push({ type: 'code', title: messageTitle, code: m.message });
            });
        } else { finalAiResponseContent.push({type: 'text', text: "No platform messages generated."}); }
      }
      // Fallback if no specific content was generated but no error occurred
      if (finalAiResponseContent.length === 0 && !aiCallError) { 
        finalAiResponseContent.push({type: 'text', text: "Action processed. No specific textual output to display."});
      }

      // Update the assistant's message with the final content or error
      updateMessageById(assistantMessageIdToUse, finalAiResponseContent, false, false, requestParamsForRegeneration);
      if (!isRegenerationCall) { // Reset API key index only for new primary actions
        currentApiKeyIndexRef.current = 0;
      }
      
    } catch (error: any) {
      aiCallError = error; // Store the error
      console.error(`ChatPage (handleSendMessage): Error for action '${currentActionType}'. API Key Index: ${currentApiKeyIndexRef.current}`, error);
      let errorMessageText = `Sorry, I couldn't process that. AI Error: ${aiCallError.message || 'Unknown error'}`;
      const errorMsgLower = String(aiCallError.message).toLowerCase();
      const isRateLimit = errorMsgLower.includes('429') || errorMsgLower.includes('quota') || errorMsgLower.includes('rate limit');
      const isInternalServerError = errorMsgLower.includes('500') || errorMsgLower.includes('internal server error');
      const isInvalidApiKey = errorMsgLower.includes('api key not valid') || errorMsgLower.includes('invalid api key');

      if (isInternalServerError) {
         errorMessageText = `An internal error occurred with the AI service. Please try regenerating the response. Error: ${aiCallError.message || 'Internal Server Error'}`;
         toast({ title: "AI Internal Error", description: "The AI service encountered an internal error. Please try regenerating.", variant: "destructive", duration: 7000 });
      } else if (isRateLimit && availableUserApiKeys.length > 0) {
        const currentAttemptedKeyIndex = currentApiKeyIndexRef.current;
        if (currentAttemptedKeyIndex < availableUserApiKeys.length - 1) {
          // Don't increment here for direct user action, regeneration will handle it
          // currentApiKeyIndexRef.current++; // This was causing issues
          const nextKeyToTryDisplay = currentAttemptedKeyIndex + 1; // Next index to try if user regenerates
          errorMessageText = `The current API key (attempt ${currentAttemptedKeyIndex + 1}/${availableUserApiKeys.length}) may be rate-limited. Click 'Regenerate' to try the next available key (${nextKeyToTryDisplay + 1 > availableUserApiKeys.length ? 'last' : nextKeyToTryDisplay +1}/${availableUserApiKeys.length}). Original error: ${aiCallError.message}`;
          toast({ title: "Rate Limit Possible", description: `Key ${currentAttemptedKeyIndex + 1} might be limited. Regenerate to try key ${nextKeyToTryDisplay +1 > availableUserApiKeys.length ? 'last' : nextKeyToTryDisplay+1}.`, variant: "default", duration: 7000 });
        } else { // All user keys attempted, or only one user key was available and it failed
          errorMessageText = `All configured API keys (${availableUserApiKeys.length}) may have hit rate limits, or the global key is limited. Please check your quotas or try again later. Original error: ${aiCallError.message}`;
          toast({ title: "All API Keys Tried/Rate Limited", description: "All available API keys may have hit rate limits, or the global key (from .env) is limited.", variant: "destructive", duration: 7000 });
        }
      } else if (isRateLimit) { // Rate limit but no user API keys configured (using global key)
        errorMessageText = `The API request was rate-limited (${aiCallError.message}). This usually means the global API key (from your .env file) has hit its limits. Please try again later or check your API key quotas.`;
        toast({ title: "Rate Limit Hit", description: aiCallError.message || "The request was rate-limited.", variant: "destructive", duration: 7000 });
      } else if (isInvalidApiKey) {
         errorMessageText = `The API key used is invalid. Please check your profile settings or the GOOGLE_API_KEY environment variable. Error: ${aiCallError.message}`;
         toast({ title: "Invalid API Key", description: "The API key is invalid. Check settings.", variant: "destructive", duration: 7000 });
      } else {
        // Generic error
        toast({ title: "AI Error", description: aiCallError.message || "Failed to get response from AI.", variant: "destructive" });
      }
      console.error("ChatPage AI Call Error, Displaying to user:", errorMessageText);
      updateMessageById(assistantMessageIdToUse, [{ type: 'text', text: errorMessageText }], false, true, requestParamsForRegeneration);
    }
      
    // Save session after AI call (success or handled error)
    if (currentSession && userIdForHistory) { // Ensure currentSession and userIdForHistory are valid
        // Use setMessages functional update to ensure we operate on the latest state when constructing sessionToSave
        setMessages(prevMessages => {
            // Construct the most up-to-date list of messages *before* saving
            const currentMessagesAfterAICall = prevMessages.map(msg => {
                if (msg.id === assistantMessageIdToUse) {
                    // Ensure the assistant message being saved reflects the final AI response or error
                    return {
                        ...msg,
                        content: aiCallError ? [{type: 'text', text: (finalAiResponseContent[0] as any)?.text || "Error processing request."}] : finalAiResponseContent,
                        isLoading: false,
                        isError: !!aiCallError,
                        originalRequest: requestParamsForRegeneration,
                        timestamp: Date.now() // Ensure timestamp is updated for the final state
                    };
                }
                return msg;
            });
            
            // Construct the session object to save
            const sessionToSave: ChatSession = {
                ...currentSession,
                messages: ensureMessagesHaveUniqueIds(currentMessagesAfterAICall), // Ensure IDs are unique
                updatedAt: Date.now(),
                userId: userIdForHistory, // Ensure the correct user ID is associated
            };
            
            // Determine if chat name generation should be attempted
            // Only for new actions (not regenerations or message edits) and if the session is new or unnamed
            const shouldAttemptNameGeneration = (!messageIdToUpdate && !isRegenerationCall) && 
                (sessionToSave.messages.length <= (userMessageId ? 2 : 1) || !currentSession.name || currentSession.name === "New Chat");

            saveSession(
                sessionToSave,
                shouldAttemptNameGeneration,
                modelIdToUse, // Model used for this turn
                (profile?.geminiApiKeys && profile.geminiApiKeys.length > 0 && profile.geminiApiKeys[0]) ? profile.geminiApiKeys[0] : undefined // Primary user key for name gen
            ).then(savedSessionWithPotentialNewName => {
                // If saveSession updated the name, reflect it in currentSession state
                if (savedSessionWithPotentialNewName && savedSessionWithPotentialNewName.id === currentSession.id) {
                     // Check if the name actually changed before updating state to prevent loop
                     if (currentSession.name !== savedSessionWithPotentialNewName.name) {
                       setCurrentSession(prev => prev ? {...prev, name: savedSessionWithPotentialNewName.name} : null);
                    }
                }
            }).catch(error => {
                // Handle errors from saveSession (e.g., localStorage quota errors if not caught inside)
                console.error("Error saving session or generating chat name post-send:", error);
                // Optionally, show a toast for save failure if not handled within saveSession
            });
            
            return currentMessagesAfterAICall; // Return the updated messages for the setMessages call
        });
    }
    setIsLoading(false);
  }, [
    addMessage,
    updateMessageById,
    profile, // profile is a dependency because its fields are used in baseInput
    currentSession,
    currentAttachedFilesData, // Used for new messages
    toast, 
    saveSession, // From useChatHistory
    ensureMessagesHaveUniqueIds,
    userIdForHistory,
    profileLoading, // To gate the function
    // messages // Removed: `messages` was causing a stale closure for `chatHistoryForAI`. Instead, use `setMessages(prev => ...)` to get current messages.
  ]);

  const handleRegenerateMessage = useCallback((originalRequestDetailsFromMessage?: ChatMessage['originalRequest'] & { messageIdToRegenerate: string }) => {
    if (!originalRequestDetailsFromMessage || !originalRequestDetailsFromMessage.messageIdToRegenerate) {
        toast({ title: "Cannot Regenerate", description: "Original request details or message ID are missing.", variant: "destructive" });
        return;
    }
    if (profileLoading) {
      toast({ title: "Profile Loading...", description: "Please wait for profile to load.", variant: "default" });
      return;
    }
    if (!profile) {
      toast({ title: "Profile not loaded", description: "Cannot regenerate without user profile.", variant: "destructive" });
      return;
    }
     if (!currentSession) {
        toast({ title: "Session not initialized", description: "Cannot regenerate without an active session.", variant: "destructive" });
        return;
    }
    
    // Ensure messageIdToRegenerate is part of the original request details
    if (originalRequestDetailsFromMessage.actionType && originalRequestDetailsFromMessage.messageText !== undefined) { 
        const { messageIdToRegenerate, ...originalRequest } = originalRequestDetailsFromMessage;
        
        // Logic for API key cycling on regenerate
        const availableUserApiKeys = profile.geminiApiKeys?.filter(key => key && key.trim() !== '') || [];
        if (availableUserApiKeys.length > 0 && currentApiKeyIndexRef.current < availableUserApiKeys.length -1) {
            // Only increment if there are more keys *beyond the current one*.
            // This suggests a previous attempt (the one being regenerated) failed with the key at currentApiKeyIndexRef.current.
            // So, for *this* regeneration, we try the *next* one.
            // currentApiKeyIndexRef.current++; // This was the old logic that might pre-increment.
            // Let handleSendMessage determine the key based on the current index.
            // If the previous error handling in handleSendMessage already incremented it, this will use the new one.
        } else if (availableUserApiKeys.length > 0) {
            // All keys have been tried, reset to 0 for this regeneration attempt or stick to last one
            // currentApiKeyIndexRef.current = 0; // Or let it stay at max index if all failed
            console.log("Regenerate: All user API keys may have been tried. Attempting with current index or global key.")
        }
        console.log(`ChatPage (handleRegenerateMessage): Regenerating message ID ${messageIdToRegenerate} for action ${originalRequest.actionType}. Using API Key Index: ${currentApiKeyIndexRef.current}`);

        handleSendMessage(
            originalRequest.messageText, originalRequest.actionType,
            originalRequest.notes, originalRequest.attachedFilesData, 
            true, // isRegenerationCall = true
            messageIdToRegenerate // Pass the assistant message ID to update
        );
    } else {
        toast({ title: "Regeneration Error", description: "Missing details from original request to regenerate.", variant: "destructive" });
    }
  }, [profileLoading, profile, currentSession, toast, handleSendMessage]); // handleSendMessage is a key dependency


  const handleConfirmEditAndResendUserMessage = (messageId: string, newContent: string, originalAttachments?: AttachedFile[]) => {
    setMessages(prevMessages => {
      const messageIndex = prevMessages.findIndex(msg => msg.id === messageId);
      if (messageIndex === -1) return prevMessages; // Should not happen

      const targetMessage = prevMessages[messageIndex];
      const newEditHistoryEntry = {
        content: targetMessage.content, // Store the *old* content
        timestamp: targetMessage.timestamp,
        attachedFiles: targetMessage.attachedFiles,
      };

      const updatedMessage: ChatMessage = {
        ...targetMessage,
        content: newContent, // New content
        timestamp: Date.now(), // New timestamp
        attachedFiles: originalAttachments, // Retain original attachments for this "version"
        editHistory: [...(targetMessage.editHistory || []), newEditHistoryEntry],
      };
      
      // Create a new array: messages up to the edited one (inclusive, with the update)
      let messagesUpToEdited = prevMessages.slice(0, messageIndex);
      messagesUpToEdited.push(updatedMessage); 
      
      // Trigger new AI interaction with the edited content.
      // This will append new assistant messages after the edited user message.
      handleSendMessage(newContent, 'processMessage', undefined, originalAttachments, false, undefined);
      
      // Return messages up to the point of the edit. handleSendMessage will add the new AI response.
      return ensureMessagesHaveUniqueIds(messagesUpToEdited);
    });
  };


  const handleAction = useCallback((action: ActionType) => {
    if (action === 'generateDeliveryTemplates' || action === 'generateRevision') {
      setModalActionType(action);
      setShowNotesModal(true);
    } else {
      // Call handleSendMessage with current input and selected action
      // No files are passed here directly as they are managed by currentAttachedFilesData
      handleSendMessage(inputMessage || '', action, undefined, undefined, false, undefined);
    }
  }, [inputMessage, handleSendMessage]); // Added handleSendMessage

  const submitModalNotes = () => {
    if (modalActionType) {
      // Call handleSendMessage with notes and selected action
      handleSendMessage(inputMessage || '', modalActionType, modalNotes, undefined, false, undefined);
    }
    setShowNotesModal(false);
    setModalNotes('');
    setModalActionType(null);
  };

  const handleFileSelectAndProcess = useCallback(async (newFiles: File[]) => {
    // Limit to 5 files total
    const combinedFiles = [...selectedFiles, ...newFiles].slice(0, 5); 
    setSelectedFiles(combinedFiles);

    const processedNewFiles = await processFilesForAI(newFiles);
    
    // Ensure uniqueness in currentAttachedFilesData based on name and size to avoid duplicates from multiple selections
    const uniqueProcessedFiles = new Map<string, AttachedFile>();
    // Add existing files first
    currentAttachedFilesData.forEach(file => {
        uniqueProcessedFiles.set(`${file.name}_${file.size}`, file);
    });
    // Then add new ones, potentially overwriting if re-selected
    processedNewFiles.forEach(file => {
        uniqueProcessedFiles.set(`${file.name}_${file.size}`, file);
    });

    setCurrentAttachedFilesData(Array.from(uniqueProcessedFiles.values()).slice(0,5)); // Max 5
  }, [selectedFiles, currentAttachedFilesData]); // Added currentAttachedFilesData

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
        handleSendMessage(inputMessage, 'processMessage', undefined, undefined, false, undefined);
      }
    }
  };

  // --- Drag and Drop File Handling ---
  const [isDragging, setIsDragging] = useState(false);
  const dropZoneRef = useRef<HTMLDivElement>(null);

  const handleDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault(); event.stopPropagation(); setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault(); event.stopPropagation();
    // Check if the leave event is truly leaving the drop zone area
    if (dropZoneRef.current && !dropZoneRef.current.contains(event.relatedTarget as Node)) {
      setIsDragging(false);
    }
  }, []); // Removed dropZoneRef from deps as it's stable

  const handleDrop = useCallback(async (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault(); event.stopPropagation(); setIsDragging(false);
    if (event.dataTransfer.files && event.dataTransfer.files.length > 0) {
      await handleFileSelectAndProcess(Array.from(event.dataTransfer.files));
      event.dataTransfer.clearData(); // Important for some browsers
    }
  }, [handleFileSelectAndProcess]); 

  const isGoogleUser = useMemo(() => authUser?.providerData.some(p => p.providerId === 'google.com'), [authUser]);

  const handleSyncWithDriveClick = async () => {
    if (!authUser) { // General check for any logged-in user
        toast({ title: "Login Required", description: "Please log in to sync with Google Drive.", variant: "default" });
        return;
    }
    if (!isGoogleUser) { // Specific check if the logged-in user is a Google user
        toast({ title: "Google Account Needed", description: "Drive sync is only available for users logged in with Google.", variant: "default" });
        return;
    }
    
    // At this point, we know authUser is a Google user.
    // We now check if syncWithDrive requires a token refresh.
    const result = await syncWithDrive(); // syncWithDrive will use the token from AuthContext if available
    
    if (result === 'SUCCESS') {
      // Toast is handled inside syncWithDrive for success
    } else if (result === 'TOKEN_REFRESH_NEEDED') {
        // If syncWithDrive explicitly says token is needed, trigger re-auth
        toast({ title: "Google Re-authentication Needed", description: "Please sign in with Google again to refresh Drive access.", variant: "default" });
        try {
            await triggerGoogleSignInFromAuth(); // This should be triggerGoogleSignInFromAuth from useAuth()
            // After successful re-auth, AuthContext's googleAccessToken will update.
            // useChatHistory's useEffects should then pick up the new token and attempt Drive init/load.
            // We can also attempt an immediate sync again after a short delay.
            setTimeout(async () => { 
              const secondAttempt = await syncWithDrive();
              // Toast for secondAttempt success/failure is handled within syncWithDrive
            }, 1500); // Delay to allow token propagation
        } catch (error) {
            console.error("ChatPage (handleSyncWithDriveClick): Error during Google re-authentication:", error);
            toast({ title: "Google Sign-In Failed", description: "Could not re-authenticate with Google for Drive sync.", variant: "destructive" });
        }
    } else if (result === 'FAILED') {
      // Toast is handled inside syncWithDrive for general failure
    }
  };

  const currentAttachedFilesDataLength = currentAttachedFilesData.length;

  if (authLoading || (!currentSession && !profileLoading && !historyHookLoading) || !userIdForHistory ) { // Added !userIdForHistory and simplified !currentSession
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

  if (!authLoading && !authUser) {
    // Welcome screen for non-logged-in users
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-var(--header-height,0px))] bg-gradient-to-br from-background-start-hsl to-background-end-hsl text-center p-4">
          {/* Modal is triggered by buttons below now */}
          <Dialog open={isWelcomeLoginModalOpen} onOpenChange={setIsWelcomeLoginModalOpen}>
              {/* The content visible on the page before modal opens */}
              <div className="glass-panel p-8 md:p-12 rounded-2xl shadow-2xl flex flex-col items-center animate-fade-in max-w-lg w-full">
                  <div className="relative mb-6">
                      <div className="absolute -inset-2 rounded-full bg-primary/10 blur-xl animate-pulse-slow opacity-70"></div>
                      <BotIcon className="w-20 h-20 md:w-24 md:h-24 text-primary relative z-10 animate-float" />
                  </div>
                  <h1 className="text-3xl md:text-4xl font-bold mb-4 text-gradient">Welcome to DesAInR Pro!</h1>
                  <p className="text-lg md:text-xl text-foreground/80 mb-8">
                      Your AI-powered design assistant.
                  </p>
                  {/* Login Button on Welcome Screen */}
                  <DialogTrigger asChild>
                      <Button 
                          variant="default" 
                          className="w-full text-base py-6 max-w-xs mb-3" 
                          glow 
                          animate
                          onClick={() => setIsWelcomeLoginModalOpen(true)} // Opens the dialog
                      >
                          <LogIn className="mr-2 h-5 w-5" /> Login with Google
                      </Button>
                  </DialogTrigger>
                  <p className="text-sm text-foreground/60">
                      Need an account? The login button also handles new user sign-ups with Google.
                  </p>
              </div>
              {/* Dialog Content for Login */}
              <DialogContent className="sm:max-w-md glass-panel backdrop-blur-xl border border-border dark:border-primary/10 shadow-xl dark:shadow-2xl rounded-xl animate-fade-in">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 rounded-xl opacity-30 pointer-events-none"></div>
                  <DialogHeader className="relative z-10"> {}
                      <DialogTitle className="text-xl font-bold text-primary dark:bg-clip-text dark:text-transparent dark:bg-gradient-to-r dark:from-primary dark:to-secondary">Login to DesAInR</DialogTitle> {}
                  </DialogHeader>
                  <LoginForm onSuccess={() => setIsWelcomeLoginModalOpen(false)} />
              </DialogContent>
          </Dialog>
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
            "glass-panel border-r shrink-0 transition-all duration-300 ease-in-out h-full overflow-y-auto",
            isHistoryPanelOpen ? "w-[300px] p-0" : "w-0 border-r-0 opacity-0 p-0"
          )}
        >
          {isHistoryPanelOpen && ( // Only render HistoryPanel content if it's open to avoid rendering in 0 width
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

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col bg-transparent overflow-hidden" ref={dropZoneRef} onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop}>
        {/* Header for Chat Name and New Chat Button */}
        <div className="px-4 py-3 border-b flex items-center justify-between sticky top-0 bg-card/30 backdrop-blur-md z-10 shadow-md min-h-[57px] animate-fade-in transition-all duration-300">
          <div className="flex items-center">
            <Button variant="ghost" size="icon" onClick={() => setIsHistoryPanelOpen(prev => !prev)} aria-label="Toggle history panel" className="hover:bg-primary/20 btn-glow rounded-full">
              {isMobile ? (isHistoryPanelOpen ? <XCloseIcon className="h-5 w-5" /> : <Menu className="h-5 w-5" />) 
                       : (isHistoryPanelOpen ? <PanelLeftClose className="h-5 w-5" /> : <PanelLeftOpen className="h-5 w-5" />)}
            </Button>
            <h2 className="ml-3 font-semibold text-xl truncate text-gradient" title={currentSession?.name || "Chat"}>{currentSession?.name || "Chat"}</h2>
          </div>
          <div className="flex items-center gap-3">
             { authUser && isGoogleUser && ( // Show sync button only if logged in with Google
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

        {/* Input Area */}
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
                rounded="full"
                glow
                animate
                className="ml-2 h-7 text-destructive/80 hover:text-destructive hover:bg-destructive/10 transition-all duration-300" 
                onClick={clearSelectedFiles}
              >
                <X className="h-3.5 w-3.5 mr-1" /> Clear 
              </Button>
            </div>
          )}
          
          <div className="flex items-end gap-2 animate-fade-in transition-all duration-300">
            <div className="relative w-full group">
              {/* Subtle gradient border effect */}
              <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/20 via-secondary/20 to-primary/20 rounded-xl blur opacity-30 group-hover:opacity-70 transition-opacity duration-500"></div>
              <Textarea
                ref={inputTextAreaRef} // Ensure ref is assigned
                value={inputMessage} 
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={handleKeyDown} // Keep for Enter to send
                placeholder="Type your client's message or your query here... (or drag & drop files)"
                className="relative flex-1 resize-none min-h-[65px] max-h-[150px] rounded-xl shadow-lg focus-visible:ring-2 focus-visible:ring-primary glass-panel border-primary/20 transition-all duration-300 w-full pr-14 z-10 bg-background/60 backdrop-blur-lg"
                rows={Math.max(1, Math.min(5, inputMessage.split('\n').length))} // Auto-adjust rows
              />
              {/* Decorative BotIcon inside textarea */}
              <div className="absolute bottom-3 right-3 opacity-60 group-hover:opacity-90 transition-opacity duration-300 z-20">
                <div className="relative">
                  <div className="absolute inset-0 bg-primary/10 rounded-full blur-sm animate-pulse-slow"></div>
                  <BotIcon className="h-5 w-5 text-primary relative" />
                </div>
              </div>
            </div>
          </div>
          
          {/* Bottom row with Attach Files and Action Buttons */}
          <div className={cn(
              "flex flex-wrap items-center justify-between mt-4 gap-x-3 gap-y-2", // Allow wrapping and gap
               isMobile ? "flex-col items-stretch gap-y-3" : "" // Full width for children on mobile
            )}>
            <div className={cn("flex-shrink-0 animate-stagger", isMobile ? "w-full" : "")} style={{ animationDelay: '100ms' }}>
              <Button
                variant="outline" 
                size={isMobile ? "default" : "sm"} 
                rounded="full"
                glow
                animate
                onClick={() => fileInputRef.current?.click()}
                className={cn(
                    "backdrop-blur-sm border border-primary/20 shadow-sm hover:shadow-md hover:scale-105 hover:text-primary hover:bg-primary/10 transition-all duration-300",
                    isMobile ? "w-full py-3 text-sm flex items-center justify-center px-2" : "text-xs px-2 py-2" // Adjusted mobile style
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
            <div className={cn("flex-1 flex justify-end animate-stagger", isMobile ? "w-full justify-center mt-0" : "")} style={{ animationDelay: '200ms' }}> 
              <ActionButtonsPanel
                onAction={handleAction} 
                isLoading={isLoading}
                currentUserMessage={inputMessage} 
                profile={profile}
                currentAttachedFilesDataLength={currentAttachedFilesDataLength} // Pass the length
                isMobile={isMobile}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Notes Modal */}
      <Dialog open={showNotesModal} onOpenChange={setShowNotesModal}>
        <DialogContent className="animate-fade-in bg-background/95 dark:bg-background/80 backdrop-blur-xl border border-border dark:border-primary/10 shadow-xl dark:shadow-2xl rounded-xl">
          {/* Decorative Gradient Overlay */}
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
                  rounded="full" 
                  glow
                  className="absolute right-0 top-0 h-8 w-8 border border-border/30 dark:border-primary/10 hover:bg-primary/10 transition-all duration-300"
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
                {/* Subtle gradient border effect for textarea */}
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
                rounded="full"
                glow
                className="bg-background hover:bg-destructive/10 hover:text-destructive transition-all duration-300 ease-in-out shadow-sm hover:shadow-md"
              >
                Cancel
              </Button>
            </DialogClose>
            <Button 
              onClick={submitModalNotes} 
              variant="default"
              rounded="full"
              glow
              className="bg-primary dark:bg-gradient-to-r dark:from-primary dark:to-secondary text-primary-foreground hover:shadow-lg transition-all duration-300 ease-in-out"
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
    
