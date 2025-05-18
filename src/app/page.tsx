
'use client';

import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { Paperclip, Loader2, BotIcon, Menu, XIcon, PanelLeftOpen, PanelLeftClose, Palette, SearchCheck, ClipboardSignature, ListChecks, ClipboardList, Lightbulb, Terminal, Plane, RotateCcw, PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ChatMessageDisplay } from '@/components/chat/chat-message';
import { ActionButtonsPanel, type ActionType } from '@/components/chat/action-buttons';
import { HistoryPanel } from '@/components/chat/history-panel';
import { useToast } from '@/hooks/use-toast';
import { useUserProfile } from '@/lib/hooks/use-user-profile';
import { useChatHistory } from '@/lib/hooks/use-chat-history';
import type { ChatMessage, UserProfile, ChatMessageContentPart, AttachedFile, ChatSession } from '@/lib/types';
import { processClientMessage, type ProcessClientMessageInput } from '@/ai/flows/process-client-message';
import { generatePlatformMessages, type GeneratePlatformMessagesInput } from '@/ai/flows/generate-platform-messages';
import { analyzeClientRequirements, type AnalyzeClientRequirementsInput } from '@/ai/flows/analyze-client-requirements';
import { generateEngagementPack, type GenerateEngagementPackInput } from '@/ai/flows/generate-engagement-pack-flow';
import { generateDesignIdeas, type GenerateDesignIdeasInput } from '@/ai/flows/generate-design-ideas-flow';
import { generateDesignPrompts, type GenerateDesignPromptsInput } from '@/ai/flows/generate-design-prompts-flow';
import { checkMadeDesigns, type CheckMadeDesignsInput, type CheckMadeDesignsOutput } from '@/ai/flows/check-made-designs-flow';
// import { generateBrief, type GenerateBriefInput } from '@/ai/flows/generate-brief-flow'; // Replaced by generateEngagementPack

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import { DEFAULT_USER_ID, DEFAULT_MODEL_ID } from '@/lib/constants';


// Helper to get textual content from ChatMessageContentPart[] or string
const getMessageText = (content: string | ChatMessageContentPart[]): string => {
  if (typeof content === 'string') return content;
  if (!Array.isArray(content) || content.length === 0) return '[Empty Message Content]';

  let fullText = '';
  content.forEach(part => {
    if (part.title && part.type !== 'code' && part.type !== 'list' && part.type !== 'translation_group') {
      fullText += `### ${part.title}\n`;
    }
    switch (part.type) {
      case 'text':
        fullText += `${part.text || ''}\n`;
        break;
      case 'code':
        if (part.title) fullText += `### ${part.title}\n`;
        fullText += `\`\`\`${part.language || ''}\n${part.code || ''}\n\`\`\`\n`;
        break;
      case 'list':
        if (part.title) {
             fullText += `### ${part.title}\n`;
        }
        if (part.items && part.items.length > 0) {
          fullText += part.items.map((item, index) => `${index + 1}. ${item}`).join('\n') + '\n';
        } else {
          fullText += `[Empty List${part.title ? ` for "${part.title}"` : ''}]\n`;
        }
        break;
      case 'translation_group':
        if (part.title) fullText += `### ${part.title}\n`;
        if (part.english) {
          if (part.english.analysis) fullText += `English Analysis:\n${part.english.analysis}\n\n`;
          if (part.english.simplifiedRequest) fullText += `English Simplified Request:\n${part.english.simplifiedRequest}\n\n`;
          if (part.english.stepByStepApproach) fullText += `English Step-by-Step Approach:\n${part.english.stepByStepApproach}\n\n`;
        }
        if (part.bengali) {
          fullText += "\n";
          if (part.bengali.analysis) fullText += `Bengali Analysis/Combined Translation:\n${part.bengali.analysis}\n\n`;
          if (part.bengali.simplifiedRequest) fullText += `Bengali Simplified Request:\n${part.bengali.simplifiedRequest}\n\n`;
          if (part.bengali.stepByStepApproach) fullText += `Bengali Step-by-Step Approach:\n${part.bengali.stepByStepApproach}\n\n`;
        }
        if (fullText.trim() === (part.title ? `### ${part.title}` : '')) {
            fullText += `[Empty Translation Group${part.title ? ` for "${part.title}"` : ''}]\n`;
        }
        break;
      default:
        // Attempt to get text from unknown part types, or mark as unsupported
        let unknownText = (part as any).text || (part as any).code || (part as any).message; // common fields
        if (typeof unknownText === 'string') {
          fullText += `${unknownText}\n`;
        } else {
           fullText += `[Unsupported Content Part: ${(part as any).type} ${part.title ? `for "${part.title}"` : ''}]\n`;
        }
    }
    fullText += '\n'; // Add a newline after each part for better separation in history text
  });
  return fullText.trim() || '[Empty Message Content Parts]'; // Fallback for empty parts array
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
    // Check if ID is missing, not a string, doesn't start with 'msg-', or is potentially a simple timestamp
    if (typeof newId !== 'string' || !newId.startsWith('msg-') || seenIds.has(newId) || !isNaN(Number(newId.replace('msg-','').split('-')[0]))) {
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

  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { profile, isLoading: profileLoading } = useUserProfile();
  const chatAreaRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [showNotesModal, setShowNotesModal] = useState(false);
  const [modalActionType, setModalActionType] = useState<ActionType | null>(null);
  const [modalNotes, setModalNotes] = useState('');

  const userIdForHistory = useMemo(() => {
    if (!profileLoading && profile) {
      return profile.userId || DEFAULT_USER_ID;
    }
    return DEFAULT_USER_ID;
  }, [profileLoading, profile]);


  const {
    historyMetadata,
    isLoading: historyLoading,
    getSession,
    saveSession,
    deleteSession,
    createNewSession,
  } = useChatHistory(userIdForHistory);

  const [currentSession, setCurrentSession] = useState<ChatSession | null>(null);
  const isMobile = useIsMobile();
  const [isHistoryPanelOpen, setIsHistoryPanelOpen] = useState(false);

  const currentApiKeyIndexRef = useRef(0);

  const ensureMessagesHaveUniqueIds = useCallback(baseEnsureMessagesHaveUniqueIds, []);

  useEffect(() => {
    if (isMobile !== undefined) { // Only set once isMobile is determined
        setIsHistoryPanelOpen(!isMobile);
    }
  }, [isMobile]); // Runs when isMobile value changes


  useEffect(() => {
    if (profileLoading) { // Wait until profile loading is complete
        return;
    }

    const currentUserIdToUse = userIdForHistory; // This will be the actual userId or DEFAULT_USER_ID
    const lastActiveSessionIdKey = LAST_ACTIVE_SESSION_ID_KEY_PREFIX + currentUserIdToUse;
    let lastActiveSessionId = localStorage.getItem(lastActiveSessionIdKey);
    let sessionToLoad: ChatSession | null = null;

    if (lastActiveSessionId) {
      // Validate that the last active session ID actually belongs to the current user context
      if (!lastActiveSessionId.startsWith(currentUserIdToUse + '_')) {
          console.warn(`Last active session ID ${lastActiveSessionId} does not belong to current user ${currentUserIdToUse}. Clearing.`);
          localStorage.removeItem(lastActiveSessionIdKey);
          lastActiveSessionId = null; // Invalidate it
      } else {
        sessionToLoad = getSession(lastActiveSessionId);
        if (!sessionToLoad) { // Session data might be missing or corrupted
             console.warn(`Could not load session data for ID ${lastActiveSessionId}. Clearing.`);
             localStorage.removeItem(lastActiveSessionIdKey);
             lastActiveSessionId = null;
        }
      }
    }

    if (sessionToLoad) {
      const migratedMessages = ensureMessagesHaveUniqueIds(sessionToLoad.messages);
      const updatedSession = { ...sessionToLoad, messages: migratedMessages };
      setCurrentSession(updatedSession);
      setMessages(updatedSession.messages);
    } else {
      // Determine API key for new session name generation (if applicable)
      const userApiKeyForNameGen = (profile?.geminiApiKeys && profile.geminiApiKeys.length > 0 && profile.geminiApiKeys[0]) ? profile.geminiApiKeys[0] : undefined;
      const newSession = createNewSession([], profile?.selectedGenkitModelId || DEFAULT_MODEL_ID, userApiKeyForNameGen);
      setCurrentSession(newSession);
      setMessages(newSession.messages);
      // Save the new session's ID as the last active, only if it's a valid user-specific ID
      if (newSession.id && newSession.id.startsWith(currentUserIdToUse + '_')) { // Check prefix before saving
        localStorage.setItem(lastActiveSessionIdKey, newSession.id);
      }
    }
  }, [profileLoading, userIdForHistory, getSession, createNewSession, ensureMessagesHaveUniqueIds, profile?.selectedGenkitModelId, profile?.geminiApiKeys]);


  useEffect(() => {
    if (chatAreaRef.current) {
      chatAreaRef.current.scrollTop = chatAreaRef.current.scrollHeight;
    }
  }, [messages]);


  useEffect(() => {
    // Auto-save session when messages change, and attempt name generation for new chats.
    if (currentSession && (messages.length > 0 || currentSession.messages.length > 0) ) {
      const isNewChatName = currentSession.name === "New Chat";
      // Attempt name generation if the name is default AND there are 1 or 2 messages.
      const shouldAttemptNameGeneration = isNewChatName && messages.length > 0 && messages.length <= 2;
      const modelIdToUse = (profile?.selectedGenkitModelId || DEFAULT_MODEL_ID);
      // Use the first API key from the profile for name generation if available.
      const userApiKeyForNameGen = (profile?.geminiApiKeys && profile.geminiApiKeys.length > 0 && profile.geminiApiKeys[0]) ? profile.geminiApiKeys[0] : undefined;

      const updatedSession = { ...currentSession, messages, updatedAt: Date.now() };

      // Debounce save operation
      const saveTimeout = setTimeout(() => {
        saveSession(updatedSession, shouldAttemptNameGeneration, modelIdToUse, userApiKeyForNameGen).then(savedSession => {
          if (savedSession) {
             // Update currentSession state if the saved session (e.g., with a new name) is different
             // This functional update ensures we're working with the latest state.
             setCurrentSession(prevCurrentSession => {
                if (!prevCurrentSession || !savedSession) return savedSession; // Should not happen if saveSession is robust

                let changesMade = false;
                const newCurrentSessionState = { ...prevCurrentSession };

                if (savedSession.name !== newCurrentSessionState.name) { newCurrentSessionState.name = savedSession.name; changesMade = true; }
                if (JSON.stringify(savedSession.messages) !== JSON.stringify(newCurrentSessionState.messages)) { newCurrentSessionState.messages = savedSession.messages; changesMade = true; }
                if (savedSession.updatedAt !== newCurrentSessionState.updatedAt) { newCurrentSessionState.updatedAt = savedSession.updatedAt; changesMade = true; }
                // Important: Update ID only if the current session ID was a temporary one
                if (savedSession.id !== newCurrentSessionState.id && newCurrentSessionState.id.startsWith('temp_')) { newCurrentSessionState.id = savedSession.id; changesMade = true; }

                return changesMade ? newCurrentSessionState : prevCurrentSession;
            });
          }
        });
      }, 1000); // Save after 1 second of inactivity
      return () => clearTimeout(saveTimeout);
    }
  }, [messages, currentSession, saveSession, profile?.selectedGenkitModelId, profile?.geminiApiKeys]);


  const addMessage = useCallback((role: 'user' | 'assistant' | 'system', content: string | ChatMessageContentPart[], currentAttachments?: AttachedFile[], isLoadingParam?: boolean, isErrorParam?: boolean, originalRequest?: ChatMessage['originalRequest']) => {
    const newMessage: ChatMessage = {
      id: generateRobustMessageId(),
      role,
      content,
      timestamp: Date.now(),
      isLoading: isLoadingParam,
      isError: isErrorParam,
      attachedFiles: role === 'user' ? currentAttachments : undefined,
      canRegenerate: role === 'assistant' && !!originalRequest, // Only assistants can be regenerated based on original req
      originalRequest: role === 'assistant' ? originalRequest : undefined,
    };
    setMessages(prev => [...prev, newMessage]);
  }, []);

  const updateLastMessage = useCallback((content: string | ChatMessageContentPart[], isLoadingParam: boolean = false, isErrorParam: boolean = false, originalRequestDetails?: ChatMessage['originalRequest']) => {
    setMessages(prev => {
      if (prev.length === 0) return prev;
      return prev.map((msg, index) =>
        index === prev.length - 1 ? {
            ...msg,
            content,
            isLoading: isLoadingParam,
            isError: isErrorParam,
            timestamp: Date.now(), // Update timestamp on content change
            canRegenerate: !!originalRequestDetails, // Can regenerate if original request details are provided
            originalRequest: originalRequestDetails
        } : msg
      );
    });
  }, []);

  const handleNewChat = useCallback(() => {
    const modelIdToUse = (profile?.selectedGenkitModelId || DEFAULT_MODEL_ID);
    const userApiKeyForNewChatNameGen = (profile?.geminiApiKeys && profile.geminiApiKeys.length > 0 && profile.geminiApiKeys[0]) ? profile.geminiApiKeys[0] : undefined;
    const newSession = createNewSession([], modelIdToUse, userApiKeyForNewChatNameGen);
    setCurrentSession(newSession);
    setMessages(newSession.messages);
    setInputMessage('');
    setSelectedFiles([]);
    setCurrentAttachedFilesData([]);
    currentApiKeyIndexRef.current = 0; // Reset API key index for new chat
    const currentUserId = userIdForHistory;
    const lastActiveSessionIdKey = LAST_ACTIVE_SESSION_ID_KEY_PREFIX + currentUserId;
    if (newSession.id && newSession.id.startsWith(currentUserId + '_')) {
      localStorage.setItem(lastActiveSessionIdKey, newSession.id);
    }
    if (isMobile) setIsHistoryPanelOpen(false);
  }, [createNewSession, userIdForHistory, isMobile, profile?.selectedGenkitModelId, profile?.geminiApiKeys]);

  const handleSelectSession = useCallback((sessionId: string) => {
    const selected = getSession(sessionId);
    if (selected) {
      const migratedMessages = ensureMessagesHaveUniqueIds(selected.messages);
      const updatedSession = { ...selected, messages: migratedMessages };
      setCurrentSession(updatedSession);
      setMessages(updatedSession.messages);
      currentApiKeyIndexRef.current = 0; // Reset API key index when switching sessions
      const currentUserId = userIdForHistory;
      const lastActiveSessionIdKey = LAST_ACTIVE_SESSION_ID_KEY_PREFIX + currentUserId;
      localStorage.setItem(lastActiveSessionIdKey, sessionId);
    }
    if (isMobile) setIsHistoryPanelOpen(false);
  }, [getSession, ensureMessagesHaveUniqueIds, userIdForHistory, isMobile]);

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
        try {
          basicInfo.dataUri = await readFileAsDataURL(file);
        } catch (e) { console.error("Error reading image file:", e); }
      } else if (file.type === 'text/plain' || file.type === 'text/markdown' || file.type === 'application/json') {
        try {
          basicInfo.textContent = await readFileAsText(file);
        } catch (e) { console.error("Error reading text file:", e); }
      }
      // For other file types like PDF, we don't attempt to read content client-side.
      // The AI flow will just be aware of its name and type.
      processedFiles.push(basicInfo);
    }
    return processedFiles;
  };

  const handleSendMessage = async (
    messageTextParam: string,
    actionTypeParam: ActionType,
    notesParam?: string,
    attachedFilesDataParam?: AttachedFile[], // For regeneration, using already processed files
    isRegenerationCall: boolean = false // Flag to indicate if this is a regeneration
  ) => {

    if (profileLoading) {
        toast({ title: "Profile loading", description: "Please wait for your profile to finish loading.", variant: "default" });
        return;
    }
    if (!profile) {
      toast({ title: "Profile not loaded", description: "Please set up your profile in Settings or wait for it to load.", variant: "destructive" });
      return;
    }
    if (!currentSession) {
        toast({ title: "Session not initialized", description: "Please wait or try creating a new chat.", variant: "destructive" });
        return;
    }

    // Reset API key index for new user actions, but not for regenerations
    if (!isRegenerationCall) {
        currentApiKeyIndexRef.current = 0;
    }

    const userProfile = profile; // Use the loaded profile
    const availableUserApiKeys = userProfile.geminiApiKeys?.filter(key => key && key.trim() !== '') || [];
    let apiKeyToUseThisTurn: string | undefined;

    if (currentApiKeyIndexRef.current < availableUserApiKeys.length) {
        apiKeyToUseThisTurn = availableUserApiKeys[currentApiKeyIndexRef.current];
    } else {
        // If all user keys have been tried (or no user keys configured),
        // apiKeyToUseThisTurn will be undefined, and flows will try process.env.GOOGLE_API_KEY
        apiKeyToUseThisTurn = undefined;
        if (!process.env.GOOGLE_API_KEY && availableUserApiKeys.length > 0) {
            console.warn(`All ${availableUserApiKeys.length} user-provided API keys have been tried or failed. Attempting fallback if global key is set.`);
        }
    }


    const currentMessageText = messageTextParam.trim();
    const currentActionType = actionTypeParam;
    const currentNotes = notesParam;
    const filesToSendWithThisMessage = attachedFilesDataParam || [...currentAttachedFilesData]; // Use passed files for regen, else current ones

    if (currentActionType === 'checkMadeDesigns' && filesToSendWithThisMessage.length === 0) {
      toast({ title: "No Design Attached", description: "Please attach a design image to use the 'Check Made Designs' feature.", variant: "destructive" });
      return;
    }

    const modelIdToUse = userProfile.selectedGenkitModelId || DEFAULT_MODEL_ID;

    // Define the content for the user's message in the chat display
    const userMessageContent = currentMessageText || (filesToSendWithThisMessage.length > 0 ? `Attached ${filesToSendWithThisMessage.length} file(s)${currentNotes ? ` (Notes: ${currentNotes})` : ''}` : `Triggered action: ${currentActionType}${currentNotes ? ` (Notes: ${currentNotes})` : ''}`);

    // Prepare details for potential regeneration
    const requestParamsForRegeneration: ChatMessage['originalRequest'] = {
        actionType: currentActionType,
        messageText: currentMessageText, // Store the original text for this specific call
        notes: currentNotes,
        attachedFilesData: filesToSendWithThisMessage, // Store the actual file data objects
    };

    // Add user message only if it's not a regeneration call that just reuses previous parameters
    if (!attachedFilesDataParam) { // Differentiates initial call from regeneration using this param
        addMessage('user', userMessageContent, filesToSendWithThisMessage);
    }
    addMessage('assistant', 'Processing...', [], true, false, requestParamsForRegeneration); // Add loading placeholder with regen capability

    setIsLoading(true);
    if (!attachedFilesDataParam) { // Clear inputs only for new messages
        setInputMessage('');
        setSelectedFiles([]);
        setCurrentAttachedFilesData([]);
        if (fileInputRef.current) fileInputRef.current.value = '';
    }


    try {
      let aiResponseContent: ChatMessageContentPart[] = [];
      const baseInput = {
        userName: userProfile.name,
        communicationStyleNotes: userProfile.communicationStyleNotes || '',
        modelId: modelIdToUse,
        userApiKey: apiKeyToUseThisTurn, // Pass the determined API key
      };
      const filesForFlow = filesToSendWithThisMessage.map(f => ({ name: f.name, type: f.type, dataUri: f.dataUri, textContent: f.textContent }));

      // Construct chat history from previous messages, excluding the current loading message
      const chatHistoryForAI = messages
        .slice(0, -1) // Exclude the "Processing..." message just added
        .slice(-10) // Take last 10 messages for context (or fewer if not enough)
        .map(msg => ({
          role: msg.role as 'user' | 'assistant', // Cast to expected enum
          text: getMessageText(msg.content) // Convert message content to plain text
        }))
        .filter(msg => msg.text.trim() !== '' && (msg.role === 'user' || msg.role === 'assistant')); // Filter out empty or system messages


      if (currentActionType === 'processMessage') {
        const processInput: ProcessClientMessageInput = { ...baseInput, clientMessage: currentMessageText, attachedFiles: filesForFlow, chatHistory: chatHistoryForAI };
        const processed = await processClientMessage(processInput);
        aiResponseContent.push({
          type: 'translation_group',
          title: 'Client Request Analysis & Plan',
          english: { analysis: processed.analysis, simplifiedRequest: processed.simplifiedRequest, stepByStepApproach: processed.stepByStepApproach },
          bengali: { analysis: processed.bengaliTranslation } // Assuming bengaliTranslation contains all three parts
        });
      } else if (currentActionType === 'analyzeRequirements') {
        const requirementsInput: AnalyzeClientRequirementsInput = { ...baseInput, clientMessage: currentMessageText, attachedFiles: filesForFlow, chatHistory: chatHistoryForAI };
        const requirementsOutput = await analyzeClientRequirements(requirementsInput);
        aiResponseContent.push({ type: 'text', title: 'Main Requirements Analysis', text: requirementsOutput.mainRequirementsAnalysis });
        aiResponseContent.push({ type: 'text', title: 'Detailed Requirements (English)', text: requirementsOutput.detailedRequirementsEnglish });
        aiResponseContent.push({ type: 'text', title: 'Detailed Requirements (Bangla)', text: requirementsOutput.detailedRequirementsBangla });
        aiResponseContent.push({ type: 'text', title: 'Design Message or Saying', text: requirementsOutput.designMessageOrSaying });

      } else if (currentActionType === 'generateEngagementPack') {
        const engagementInput: GenerateEngagementPackInput = {
          ...baseInput,
          clientMessage: currentMessageText,
          designerName: userProfile.name,
          designerRawStatement: userProfile.rawPersonalStatement || '',
          designerCommunicationStyle: userProfile.communicationStyleNotes || '',
          attachedFiles: filesForFlow,
          chatHistory: chatHistoryForAI,
        };
        const packOutput = await generateEngagementPack(engagementInput);
        aiResponseContent.push({ type: 'text', title: `1. Personalized Introduction for ${packOutput.clientGreetingName}:`, text: packOutput.personalizedIntroduction });
        aiResponseContent.push({ type: 'text', title: '2. Brief Reply to Client:', text: packOutput.jobReplyToClient });

        let suggestionsText = `Suggested Budget: ${packOutput.suggestedBudget}\n`;
        suggestionsText += `Suggested Timeline: ${packOutput.suggestedTimeline}\n`;
        suggestionsText += `Suggested Software: ${packOutput.suggestedSoftware}`;
        aiResponseContent.push({ type: 'text', title: '3. Suggestions:', text: suggestionsText });

        if (packOutput.clarifyingQuestions && packOutput.clarifyingQuestions.length > 0) {
          aiResponseContent.push({ type: 'text', title: '4. Clarifying Questions to Ask Client:', text: " "}); // Empty text for main title
          packOutput.clarifyingQuestions.forEach((q, index) => {
            aiResponseContent.push({ type: 'code', title: `Question ${index + 1}`, code: q });
          });
        }
      } else if (currentActionType === 'generateDesignIdeas') {
        const ideasInput: GenerateDesignIdeasInput = {
            ...baseInput,
            designInputText: currentMessageText || "general creative designs", // Use a fallback if input is empty
            attachedFiles: filesForFlow,
            chatHistory: chatHistoryForAI
        };
        const ideasOutput = await generateDesignIdeas(ideasInput);
        aiResponseContent.push({ type: 'text', title: 'Core Text/Saying for Ideas', text: ideasOutput.extractedTextOrSaying});
        if (ideasOutput.simulatedWebInspiration && ideasOutput.simulatedWebInspiration.length > 0) {
            // Format for better display in CopyableList or as separate CopyableText items
            aiResponseContent.push({ type: 'list', title: 'Simulated Web Inspiration', items: ideasOutput.simulatedWebInspiration.map(r => `${r.title} ([${r.link.length > 30 ? r.link.substring(0,27)+'...' : r.link }](${r.link})) - ${r.snippet}`) });
        }
        if (ideasOutput.creativeDesignIdeas && ideasOutput.creativeDesignIdeas.length > 0) {
            aiResponseContent.push({ type: 'list', title: 'Creative Design Ideas', items: ideasOutput.creativeDesignIdeas });
        }
        if (ideasOutput.typographyDesignIdeas && ideasOutput.typographyDesignIdeas.length > 0) {
            aiResponseContent.push({ type: 'list', title: 'Typography Design Ideas', items: ideasOutput.typographyDesignIdeas });
        }
      } else if (currentActionType === 'generateDesignPrompts') {
        const promptsInput: GenerateDesignPromptsInput = {
            ...baseInput,
            clientMessage: currentMessageText, // Pass current message for context for prompt gen
            attachedFiles: filesForFlow,
            chatHistory: chatHistoryForAI // Pass history which might contain earlier generated ideas
        };
        const promptsOutput = await generateDesignPrompts(promptsInput);
        if (promptsOutput.imagePrompts && promptsOutput.imagePrompts.length > 0) {
            promptsOutput.imagePrompts.forEach((promptText, index) => {
                aiResponseContent.push({ type: 'code', title: `AI Image Prompt ${index + 1}`, code: promptText });
            });
        } else {
            aiResponseContent.push({ type: 'text', text: "No image prompts generated. Ensure design ideas were provided or generated."});
        }
      } else if (currentActionType === 'checkMadeDesigns') {
        const designFile = filesForFlow.find(f => f.type?.startsWith('image/') && f.dataUri);
        if (!designFile || !designFile.dataUri) {
          toast({ title: "Design Image Missing", description: "Please attach the design image you want to check.", variant: "destructive" });
          updateLastMessage([{type: 'text', text: "Please attach a design image to check."}], false, true, requestParamsForRegeneration);
          setIsLoading(false);
          return;
        }
        const checkInput: CheckMadeDesignsInput = {
          ...baseInput,
          clientPromptOrDescription: currentMessageText || "Client requirements as per conversation history.",
          designToCheckDataUri: designFile.dataUri,
          chatHistory: chatHistoryForAI,
        };
        const result: CheckMadeDesignsOutput = await checkMadeDesigns(checkInput);
        aiResponseContent.push({ type: 'text', title: 'Design Check Summary (Bangla)', text: result.overallSummary });
        aiResponseContent.push({ type: 'text', title: 'ভুল অবজেক্ট/উপাদান', text: result.mistakeAnalysis.wrongObjectOrElements });
        aiResponseContent.push({ type: 'text', title: 'ভুল অবস্থান', text: result.mistakeAnalysis.wrongPositions });
        aiResponseContent.push({ type: 'text', title: 'টাইপিং ও টেক্সট ভুল', text: result.mistakeAnalysis.typingMistakes });
        aiResponseContent.push({ type: 'text', title: 'ভুল রঙ', text: result.mistakeAnalysis.wrongColors });
        aiResponseContent.push({ type: 'text', title: 'ভুল আকার', text: result.mistakeAnalysis.wrongSizes });
        aiResponseContent.push({ type: 'text', title: 'বাদ পড়া উপাদান', text: result.mistakeAnalysis.missingElements });
        aiResponseContent.push({ type: 'text', title: 'অন্যান্য ভুল', text: result.mistakeAnalysis.otherMistakes });
      }
       else if (currentActionType === 'generateDeliveryTemplates' || currentActionType === 'generateRevision') {
        const platformInput: GeneratePlatformMessagesInput = {
          name: userProfile.name,
          professionalTitle: userProfile.professionalTitle || '',
          services: userProfile.services || [],
          deliveryNotes: currentActionType === 'generateDeliveryTemplates' ? (currentNotes || currentMessageText) : '',
          revisionNotes: currentActionType === 'generateRevision' ? (currentNotes || currentMessageText) : '',
          fiverrUsername: userProfile.fiverrUsername || '',
          customSellerFeedbackTemplate: userProfile.customSellerFeedbackTemplate || '',
          customClientFeedbackResponseTemplate: userProfile.customClientFeedbackResponseTemplate || '',
          messageType: currentActionType === 'generateDeliveryTemplates' ? 'delivery' : 'revision',
          modelId: modelIdToUse,
          userApiKey: apiKeyToUseThisTurn, // Pass the key
        };
        const platformMessagesOutput = await generatePlatformMessages(platformInput);

        if (platformMessagesOutput.messages && platformMessagesOutput.messages.length > 0) {
           platformMessagesOutput.messages.forEach(m => {
            // Make titles more readable from the type
            const messageTitle = m.type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
            aiResponseContent.push({ type: 'code', title: messageTitle, code: m.message });
          });
        } else {
          aiResponseContent.push({type: 'text', text: "No platform messages generated."});
        }
      }

      updateLastMessage(aiResponseContent.length > 0 ? aiResponseContent : [{type: 'text', text: "Done."}], false, false, requestParamsForRegeneration);
      if (!isRegenerationCall) { // Reset API key index only on successful new calls, not on regenerations that might still fail
        currentApiKeyIndexRef.current = 0; // This was the issue, only reset for NEW calls
      }

    } catch (error: any) {
      console.error("Error processing AI request:", error);
      const isRateLimitError = error.message?.includes('429') || error.message?.toLowerCase().includes('quota');
      let errorMessageContent = `Sorry, I couldn't process that. AI Error: ${error.message || 'Unknown error'}`;

      if (isRateLimitError) {
        if (availableUserApiKeys.length > 0 && currentApiKeyIndexRef.current < availableUserApiKeys.length - 1) {
          currentApiKeyIndexRef.current++; // Increment for the NEXT regeneration attempt
          errorMessageContent = `The current API key may have hit a rate limit. You can try regenerating to use the next key (${currentApiKeyIndexRef.current + 1}/${availableUserApiKeys.length}).`;
          toast({ title: "Rate Limit Possible", description: `Key ${currentApiKeyIndexRef.current} (attempted) might be limited. Regenerate to try key ${currentApiKeyIndexRef.current + 1}.`, variant: "default" });
        } else if (availableUserApiKeys.length > 0 && currentApiKeyIndexRef.current >= availableUserApiKeys.length - 1) {
          errorMessageContent = "All your configured API keys may have hit rate limits. Please check your quotas or try again later.";
          toast({ title: "All API Keys Tried", description: "Rate limits might have been hit on all your API keys.", variant: "destructive" });
        } else if (availableUserApiKeys.length === 0 && !process.env.GOOGLE_API_KEY){ // Checks if no user keys AND no global key
           errorMessageContent = "No API key available. Please configure one in your profile or set a global GOOGLE_API_KEY in your environment.";
           toast({ title: "API Key Error", description: "No API key available for AI features.", variant: "destructive" });
        } else { // Rate limit on the global key or the only user key
            errorMessageContent = `The API request was rate-limited (${error.message}). Please try again later or check your API key quotas.`;
            toast({ title: "Rate Limit Hit", description: error.message || "The request was rate-limited.", variant: "destructive" });
        }
      } else {
        toast({ title: "AI Error", description: error.message || "Failed to get response from AI.", variant: "destructive" });
      }
      updateLastMessage([{ type: 'text', text: errorMessageContent }], false, true, requestParamsForRegeneration);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegenerateMessage = useCallback((originalRequestDetails?: ChatMessage['originalRequest']) => {
    if (!originalRequestDetails) {
        toast({ title: "Cannot Regenerate", description: "Original request details are missing.", variant: "destructive" });
        return;
    }
    // Pass true for isRegenerationCall
    handleSendMessage(
        originalRequestDetails.messageText,
        originalRequestDetails.actionType,
        originalRequestDetails.notes,
        originalRequestDetails.attachedFilesData, // Use the stored file data
        true // Indicate this is a regeneration call
    );
  }, [profileLoading, profile, currentSession, handleSendMessage]); // Added handleSendMessage to deps

  const handleAction = (action: ActionType) => {
    if (action === 'generateDeliveryTemplates' || action === 'generateRevision') {
      setModalActionType(action);
      setShowNotesModal(true);
    } else {
      handleSendMessage(inputMessage || '', action, undefined);
    }
  };

  const submitModalNotes = () => {
    if (modalActionType) {
      handleSendMessage(inputMessage || '', modalActionType, modalNotes);
    }
    setShowNotesModal(false);
    setModalNotes('');
    setModalActionType(null);
  };

  const handleFileSelectAndProcess = async (newFiles: File[]) => {
    const combinedFiles = [...selectedFiles, ...newFiles].slice(0, 5); // Limit to 5 files
    setSelectedFiles(combinedFiles);

    const processedNewFiles = await processFilesForAI(newFiles);
    // Combine and de-duplicate based on name and size, then slice to 5
    setCurrentAttachedFilesData(prev =>
        [...prev, ...processedNewFiles]
        .reduce((acc, current) => { // De-duplicate
            if (!acc.find(item => item.name === current.name && item.size === current.size)) {
                acc.push(current);
            }
            return acc;
        }, [] as AttachedFile[])
        .slice(0,5) // Ensure only 5 files max
    );
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      handleFileSelectAndProcess(Array.from(event.target.files));
    }
  };

  const clearSelectedFiles = () => {
    setSelectedFiles([]);
    setCurrentAttachedFilesData([]);
    if (fileInputRef.current) fileInputRef.current.value = '';
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      if (!isLoading && (inputMessage.trim() || currentAttachedFilesData.length > 0)) {
        handleSendMessage(inputMessage, 'processMessage', undefined);
      }
    }
  };

  const [isDragging, setIsDragging] = useState(false);
  const dropZoneRef = useRef<HTMLDivElement>(null);

  const handleDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    // Only set isDragging to false if the leave event is not going to a child element of the drop zone
    if (dropZoneRef.current && !dropZoneRef.current.contains(event.relatedTarget as Node)) {
      setIsDragging(false);
    }
  }, []);

  const handleDrop = useCallback(async (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(false);
    if (event.dataTransfer.files && event.dataTransfer.files.length > 0) {
      await handleFileSelectAndProcess(Array.from(event.dataTransfer.files));
      event.dataTransfer.clearData();
    }
  }, [handleFileSelectAndProcess]); // Added handleFileSelectAndProcess dependency


  if (profileLoading || !currentSession) {
    return <div className="flex items-center justify-center h-screen"><Loader2 className="h-12 w-12 animate-spin text-primary" /> <p className="ml-4 text-lg">Loading DesAInR...</p></div>;
  }

  const currentAttachedFilesDataLength = currentAttachedFilesData.length;

  return (
    <div className="flex h-[calc(100vh-var(--header-height,0px))]">
      {isMobile && isHistoryPanelOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm animate-fadeIn" onClick={() => setIsHistoryPanelOpen(false)}>
          <div className="absolute left-0 top-0 h-full w-4/5 max-w-xs bg-background shadow-xl animate-fadeIn" onClick={(e) => e.stopPropagation()}>
            <HistoryPanel
              sessions={historyMetadata}
              activeSessionId={currentSession?.id || null}
              onSelectSession={handleSelectSession}
              onNewChat={handleNewChat}
              onDeleteSession={handleDeleteSession}
              isLoading={historyLoading}
            />
          </div>
        </div>
      )}
      {!isMobile && (
        <div
          className={cn(
            "bg-background shrink-0 transition-all duration-300 ease-in-out overflow-hidden",
            isHistoryPanelOpen ? "w-[280px] border-r" : "w-0 border-r-0 opacity-0"
          )}
        >
          {isHistoryPanelOpen && ( // Only render content if panel is open to avoid rendering in zero-width div
            <HistoryPanel
              sessions={historyMetadata}
              activeSessionId={currentSession?.id || null}
              onSelectSession={handleSelectSession}
              onNewChat={handleNewChat}
              onDeleteSession={handleDeleteSession}
              isLoading={historyLoading}
            />
          )}
        </div>
      )}

      <div className="flex-1 flex flex-col bg-transparent overflow-hidden" ref={dropZoneRef} onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop}>
        <div className="p-2 border-b flex items-center justify-between sticky top-0 bg-background/80 backdrop-blur-sm z-10 shadow-sm">
          <div className="flex items-center">
            <Button variant="ghost" size="icon" onClick={() => setIsHistoryPanelOpen(prev => !prev)} aria-label="Toggle history panel" className="hover:bg-primary/10">
              {isMobile ? (
                isHistoryPanelOpen ? <XIcon className="h-5 w-5" /> : <Menu className="h-5 w-5" />
              ) : (
                isHistoryPanelOpen ? <PanelLeftClose className="h-5 w-5" /> : <PanelLeftOpen className="h-5 w-5" />
              )}
            </Button>
            <h2 className="ml-2 font-semibold text-lg truncate" title={currentSession?.name || "Chat"}>{currentSession?.name || "Chat"}</h2>
          </div>
          <Button variant="outline" size="sm" onClick={handleNewChat} className="ml-auto hover:bg-primary/10 hover:text-primary transition-colors">
            <PlusCircle className="h-4 w-4 mr-2" />
            New Chat
          </Button>
        </div>

        <ScrollArea className="flex-1 p-1 md:p-4" ref={chatAreaRef}>
          <div className="space-y-2">
            {messages.map((msg) => (
              <ChatMessageDisplay key={msg.id} message={msg} onRegenerate={handleRegenerateMessage} />
            ))}
             {messages.length === 0 && !isLoading && (
                <div className="flex flex-col items-center justify-center h-full text-center p-8 animate-fadeIn">
                    <BotIcon className="w-16 h-16 text-accent mb-4" />
                    <h2 className="text-2xl font-semibold mb-2">Welcome to DesAInR!</h2>
                    <p className="text-muted-foreground max-w-md">
                        Type a client message, or drag & drop files below. Then use the action buttons to get started.
                    </p>
                </div>
            )}
          </div>
        </ScrollArea>

        {isDragging && (
          <div className="absolute inset-x-4 bottom-[160px] md:bottom-[150px] top-16 md:top-[calc(var(--header-height)_+_0.5rem)] border-4 border-dashed border-primary bg-primary/10 rounded-lg flex items-center justify-center pointer-events-none z-20 animate-fadeIn">
            <p className="text-primary font-semibold text-lg">Drop files here</p>
          </div>
        )}

        <div className={cn("border-t p-2 md:p-4 bg-background/80 backdrop-blur-sm shadow-t-lg", isDragging && "opacity-50")}>
          {currentAttachedFilesData.length > 0 && (
            <div className="mt-1 mb-2 text-xs text-muted-foreground animate-fadeIn">
              Attached: {currentAttachedFilesData.map(f => f.name).join(', ')}
              <Button variant="link" size="xs" className="ml-2 h-auto p-0 text-primary hover:text-primary/80" onClick={clearSelectedFiles}>Clear</Button>
            </div>
          )}
          <div className="flex items-end gap-2">
            <Textarea
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your client's message or your query here... (or drag & drop files)"
              className="flex-1 resize-none min-h-[60px] max-h-[150px] rounded-lg shadow-sm focus-visible:ring-2 focus-visible:ring-primary bg-background"
              rows={Math.max(1, Math.min(5, inputMessage.split('\n').length))}
            />
          </div>
           <div className="flex flex-wrap items-center justify-between mt-2 gap-y-2">
             <div className="flex-shrink-0">
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                    className={cn(
                        "text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors",
                        isMobile && "px-2 py-2" // Smaller padding for icon-only on mobile
                    )}
                    aria-label="Attach files"
                >
                    <Paperclip className={cn("h-4 w-4", !isMobile && "mr-2")} />
                    {!isMobile && "Attach Files"}
                </Button>
                <input
                    type="file"
                    ref={fileInputRef}
                    multiple
                    onChange={handleFileChange}
                    className="hidden"
                    accept="image/*,application/pdf,.txt,.md,.json"
                />
             </div>
             <div className="flex-1 flex justify-end">
                <ActionButtonsPanel
                    onAction={handleAction}
                    isLoading={isLoading}
                    currentUserMessage={inputMessage}
                    profile={profile}
                    currentAttachedFilesDataLength={currentAttachedFilesDataLength}
                    isMobile={isMobile}
                />
             </div>
           </div>
        </div>
      </div>

      <Dialog open={showNotesModal} onOpenChange={setShowNotesModal}>
        <DialogContent className="animate-fadeIn">
          <DialogHeader>
            <DialogTitle>Additional Notes for {modalActionType === 'generateDeliveryTemplates' ? 'Delivery' : 'Revision'}</DialogTitle>
            <DialogDescription>
              Provide any specific notes or details for the AI to consider.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="notes" className="text-right col-span-1">
                Notes
              </Label>
              <Textarea
                id="notes"
                value={modalNotes}
                onChange={(e) => setModalNotes(e.target.value)}
                className="col-span-3 h-32 resize-none bg-background"
                placeholder={modalActionType === 'generateDeliveryTemplates' ? "e.g., All final files attached, 2 concepts included..." : "e.g., Client requested color changes, updated logo attached..."}
              />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose>
            <Button onClick={submitModalNotes}>Generate Messages</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

