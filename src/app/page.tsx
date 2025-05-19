
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

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import { DEFAULT_USER_ID, DEFAULT_MODEL_ID } from '@/lib/constants';

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
        if (part.title && !fullText.includes(`### ${part.title}`)) { // Avoid duplicate titles if already added
            fullText += `### ${part.title}\n`;
        }
        fullText += `\`\`\`${part.language || ''}\n${part.code || ''}\n\`\`\`\n`;
        break;
      case 'list':
         if (part.title && !fullText.includes(`### ${part.title}`)) {
             fullText += `### ${part.title}\n`;
         }
         if (part.items && part.items.length > 0) {
          fullText += part.items.map((item, index) => `${index + 1}. ${item}`).join('\n') + '\n';
         } else {
           fullText += `[Empty List${part.title ? ` for "${part.title}"`: ''}]\n`;
         }
        break;
      case 'translation_group':
        if (part.title && !fullText.includes(`### ${part.title}`)) fullText += `### ${part.title}\n\n`;
        if (part.english) {
          if (part.english.analysis) fullText += `**English Analysis:**\n${part.english.analysis}\n\n`;
          if (part.english.simplifiedRequest) fullText += `**English Simplified Request:**\n${part.english.simplifiedRequest}\n\n`;
          if (part.english.stepByStepApproach) fullText += `**English Step-by-Step Approach:**\n${part.english.stepByStepApproach}\n\n`;
        }
        if (part.bengali) {
          fullText += "\n"; // Separator
          if (part.bengali.analysis) fullText += `**Bengali Analysis/Combined Translation:**\n${part.bengali.analysis}\n\n`;
          if (part.bengali.simplifiedRequest) fullText += `**Bengali Simplified Request:**\n${part.bengali.simplifiedRequest}\n\n`;
          if (part.bengali.stepByStepApproach) fullText += `**Bengali Step-by-Step Approach:**\n${part.bengali.stepByStepApproach}\n\n`;
        }
        // Ensure fallback if no content parts were actually populated
        const potentialTitleOnly = part.title ? `### ${part.title}\n\n` : '';
        if (fullText.trim().endsWith(potentialTitleOnly.trim()) || fullText.trim() === potentialTitleOnly.trim()) {
            fullText = fullText.replace(potentialTitleOnly, ''); // Remove if it's just the title
            fullText += `[Empty Translation Group${part.title ? ` for "${part.title}"`: ''}]\n`;
        }
        break;
      default:
        const unknownPart = part as any;
        let unknownText = unknownPart.text || unknownPart.code || unknownPart.message;
        if (typeof unknownText === 'string') {
          fullText += `${unknownText}\n`;
        } else if (unknownPart.items && Array.isArray(unknownPart.items) && unknownPart.items.length > 0) {
          if (unknownPart.title && !fullText.includes(`### ${unknownPart.title}`)) {
            fullText += `### ${unknownPart.title}\n`;
          }
          fullText += unknownPart.items.map((item: string, index: number) => `${index + 1}. ${item}`).join('\n') + '\n';
        } else {
           fullText += `[Unsupported Content Part: ${unknownPart.type || 'Unknown Type'}${part.title ? ` for "${part.title}"`: ''}]\n`;
        }
    }
    fullText += '\n';
  });
  return fullText.trim() || '[Empty Message Content Parts]';
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
    // Check if ID is missing, not starting with "msg-", or if the timestamp part is not a valid number (older format)
    const idParts = typeof newId === 'string' ? newId.split('-') : [];
    const isInvalidOldId = idParts.length < 2 || isNaN(Number(idParts[1]));

    if (typeof newId !== 'string' || !newId.startsWith('msg-') || seenIds.has(newId) || isInvalidOldId) {
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
  }, [isMobile]);


  useEffect(() => {
    if (profileLoading) {
        return;
    }

    const currentUserIdToUse = userIdForHistory;
    const lastActiveSessionIdKey = LAST_ACTIVE_SESSION_ID_KEY_PREFIX + currentUserIdToUse;
    let lastActiveSessionId = localStorage.getItem(lastActiveSessionIdKey);
    let sessionToLoad: ChatSession | null = null;

    if (lastActiveSessionId) {
      if (!lastActiveSessionId.startsWith(currentUserIdToUse + '_')) {
          console.warn(`Last active session ID ${lastActiveSessionId} does not belong to current user ${currentUserIdToUse}. Clearing.`);
          localStorage.removeItem(lastActiveSessionIdKey);
          lastActiveSessionId = null;
      } else {
        sessionToLoad = getSession(lastActiveSessionId);
        if (!sessionToLoad) {
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
      const userApiKeyForNameGen = (profile?.geminiApiKeys && profile.geminiApiKeys.length > 0 && profile.geminiApiKeys[0]) ? profile.geminiApiKeys[0] : undefined;
      const newSession = createNewSession([], profile?.selectedGenkitModelId || DEFAULT_MODEL_ID, userApiKeyForNameGen);
      setCurrentSession(newSession);
      setMessages(newSession.messages);
      if (newSession.id && newSession.id.startsWith(currentUserIdToUse + '_')) {
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
    if (currentSession && (messages.length > 0 || currentSession.messages.length > 0) ) {
      const isNewChatName = currentSession.name === "New Chat";
      const shouldAttemptNameGeneration = isNewChatName && messages.length > 0 && messages.length <= 2;
      const modelIdToUse = (profile?.selectedGenkitModelId || DEFAULT_MODEL_ID);
      
      const firstUserApiKey = (profile?.geminiApiKeys && profile.geminiApiKeys.length > 0 && profile.geminiApiKeys[0]) ? profile.geminiApiKeys[0] : undefined;

      const updatedSession = { ...currentSession, messages, updatedAt: Date.now() };

      const saveTimeout = setTimeout(() => {
        saveSession(updatedSession, shouldAttemptNameGeneration, modelIdToUse, firstUserApiKey).then(savedSession => {
          if (savedSession) {
             setCurrentSession(prevCurrentSession => {
                if (!prevCurrentSession || !savedSession) return savedSession;
                let changesMade = false;
                const newCurrentSessionState = { ...prevCurrentSession };
                if (savedSession.name !== newCurrentSessionState.name) { newCurrentSessionState.name = savedSession.name; changesMade = true; }
                if (JSON.stringify(savedSession.messages) !== JSON.stringify(newCurrentSessionState.messages)) { newCurrentSessionState.messages = savedSession.messages; changesMade = true; }
                if (savedSession.updatedAt !== newCurrentSessionState.updatedAt) { newCurrentSessionState.updatedAt = savedSession.updatedAt; changesMade = true; }
                if (savedSession.id !== newCurrentSessionState.id && newCurrentSessionState.id.startsWith('temp_')) { newCurrentSessionState.id = savedSession.id; changesMade = true; }
                return changesMade ? newCurrentSessionState : prevCurrentSession;
            });
          }
        });
      }, 1000);
      return () => clearTimeout(saveTimeout);
    }
  }, [messages, currentSession, saveSession, profile?.selectedGenkitModelId, profile?.geminiApiKeys]);


  const addMessage = useCallback((role: 'user' | 'assistant' | 'system', content: string | ChatMessageContentPart[], currentAttachments?: AttachedFile[], isLoadingParam?: boolean, isErrorParam?: boolean, originalRequest?: ChatMessage['originalRequest']) => {
    const newMessageId = generateRobustMessageId();
    const newMessage: ChatMessage = {
      id: newMessageId,
      role,
      content,
      timestamp: Date.now(),
      isLoading: isLoadingParam,
      isError: isErrorParam,
      attachedFiles: role === 'user' ? currentAttachments : undefined,
      canRegenerate: role === 'assistant' && !!originalRequest,
      originalRequest: role === 'assistant' ? originalRequest : undefined,
    };
    setMessages(prev => [...prev, newMessage]);
    return newMessageId; 
  }, []);

  const updateMessageById = useCallback((messageId: string, content: string | ChatMessageContentPart[], isLoadingParam: boolean = false, isErrorParam: boolean = false, originalRequestDetails?: ChatMessage['originalRequest']) => {
    setMessages(prev => {
      if (prev.length === 0) return prev;
      return prev.map(msg =>
        msg.id === messageId ? {
            ...msg,
            content,
            isLoading: isLoadingParam,
            isError: isErrorParam,
            timestamp: Date.now(), // Update timestamp on modification
            canRegenerate: !!originalRequestDetails, // Only AI messages intended for regen have originalRequestDetails
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
      currentApiKeyIndexRef.current = 0; // Reset API key index for selected chat
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
      processedFiles.push(basicInfo);
    }
    return processedFiles;
  };

  const handleSendMessage = async (
    messageTextParam: string,
    actionTypeParam: ActionType,
    notesParam?: string,
    attachedFilesDataParam?: AttachedFile[], // For regeneration, uses previously processed files
    isRegenerationCall: boolean = false,
    messageIdToUpdate?: string // For overwriting on regeneration
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

    if (!isRegenerationCall) {
        currentApiKeyIndexRef.current = 0; // Reset for new user actions
    }

    const userProfile = profile;
    const availableUserApiKeys = userProfile.geminiApiKeys?.filter(key => key && key.trim() !== '') || [];
    let apiKeyToUseThisTurn: string | undefined;

    if (currentApiKeyIndexRef.current < availableUserApiKeys.length) {
        apiKeyToUseThisTurn = availableUserApiKeys[currentApiKeyIndexRef.current];
    } else {
        apiKeyToUseThisTurn = undefined; // Will fallback to GOOGLE_API_KEY from .env if available
        if (availableUserApiKeys.length > 0) {
            console.warn(`All ${availableUserApiKeys.length} user-provided API keys have been tried or failed. Attempting fallback to global key if set.`);
        }
    }

    const currentMessageText = messageTextParam.trim();
    const currentActionType = actionTypeParam;
    const currentNotes = notesParam;
    
    // Determine files to use: new ones if not regenerating, or existing ones if regenerating
    const filesToSendWithThisMessage = attachedFilesDataParam || [...currentAttachedFilesData];

    if (currentActionType === 'checkMadeDesigns' && filesToSendWithThisMessage.length === 0) {
      toast({ title: "No Design Attached", description: "Please attach a design image to use the 'Check Made Designs' feature.", variant: "destructive" });
      return;
    }

    const modelIdToUse = userProfile.selectedGenkitModelId || DEFAULT_MODEL_ID;
    const userMessageContent = currentMessageText || (filesToSendWithThisMessage.length > 0 ? `Attached ${filesToSendWithThisMessage.length} file(s)${currentNotes ? ` (Notes: ${currentNotes})` : ''}` : `Triggered action: ${currentActionType}${currentNotes ? ` (Notes: ${currentNotes})` : ''}`);

    const requestParamsForRegeneration: ChatMessage['originalRequest'] = {
        actionType: currentActionType,
        messageText: currentMessageText, // Store the actual text used for this request
        notes: currentNotes,
        attachedFilesData: filesToSendWithThisMessage, // Store processed files used for this request
        messageIdToRegenerate: messageIdToUpdate // Pass this down; it's only set IF this call itself is a regen of another
    };

    let assistantMessageIdToUpdate: string;
    if (isRegenerationCall && messageIdToUpdate) {
        assistantMessageIdToUpdate = messageIdToUpdate;
        updateMessageById(assistantMessageIdToUpdate, 'Processing...', true, false, requestParamsForRegeneration);
    } else { 
        if (userMessageContent.trim() !== '' || filesToSendWithThisMessage.length > 0) {
          addMessage('user', userMessageContent, filesToSendWithThisMessage);
        }
        // Create a new placeholder for the assistant's response
        assistantMessageIdToUpdate = addMessage('assistant', 'Processing...', [], true, false, requestParamsForRegeneration);
    }

    setIsLoading(true);
    if (!isRegenerationCall && !attachedFilesDataParam) { // Clear inputs only for brand new messages, not for regenerations
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
        userApiKey: apiKeyToUseThisTurn,
      };
      const filesForFlow = filesToSendWithThisMessage.map(f => ({ name: f.name, type: f.type, dataUri: f.dataUri, textContent: f.textContent }));
      
      const chatHistoryForAI = messages
        .filter(msg => msg.id !== assistantMessageIdToUpdate) 
        .slice(-10) 
        .map(msg => ({
          role: msg.role as 'user' | 'assistant',
          text: getMessageText(msg.content)
        }))
        .filter(msg => msg.text.trim() !== '' && (msg.role === 'user' || msg.role === 'assistant'));


      if (currentActionType === 'processMessage') {
        const processInput: ProcessClientMessageInput = { ...baseInput, clientMessage: currentMessageText, attachedFiles: filesForFlow, chatHistory: chatHistoryForAI };
        const processed = await processClientMessage(processInput);
        aiResponseContent.push({
          type: 'translation_group',
          title: 'Client Request Analysis & Plan',
          english: { analysis: processed.analysis, simplifiedRequest: processed.simplifiedRequest, stepByStepApproach: processed.stepByStepApproach },
          bengali: { analysis: processed.bengaliTranslation }
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
        aiResponseContent.push({ type: 'code', title: `1. Personalized Introduction for ${packOutput.clientGreetingName}:`, code: packOutput.personalizedIntroduction });
        aiResponseContent.push({ type: 'code', title: '2. Brief Reply to Client:', code: packOutput.jobReplyToClient });
        let suggestionsText = `Suggested Budget: ${packOutput.suggestedBudget}\n`;
        suggestionsText += `Suggested Timeline: ${packOutput.suggestedTimeline}\n`;
        suggestionsText += `Suggested Software: ${packOutput.suggestedSoftware}`;
        aiResponseContent.push({ type: 'text', title: '3. Suggestions:', text: suggestionsText });
        if (packOutput.clarifyingQuestions && packOutput.clarifyingQuestions.length > 0) {
          aiResponseContent.push({ type: 'text', title: '4. Clarifying Questions to Ask Client:', text: " "});
          packOutput.clarifyingQuestions.forEach((q, index) => {
            aiResponseContent.push({ type: 'code', title: `Question ${index + 1}`, code: q });
          });
        }
      } else if (currentActionType === 'generateDesignIdeas') {
        const ideasInput: GenerateDesignIdeasInput = {
            ...baseInput,
            designInputText: currentMessageText || "general creative designs", // Ensure designInputText is not empty
            attachedFiles: filesForFlow,
            chatHistory: chatHistoryForAI
        };
        const ideasOutput = await generateDesignIdeas(ideasInput);
        aiResponseContent.push({ type: 'text', title: 'Core Text/Saying for Ideas', text: ideasOutput.extractedTextOrSaying});
        if (ideasOutput.simulatedWebInspiration && ideasOutput.simulatedWebInspiration.length > 0) {
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
            clientMessage: currentMessageText,
            attachedFiles: filesForFlow,
            chatHistory: chatHistoryForAI
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
          updateMessageById(assistantMessageIdToUpdate, [{type: 'text', text: "Please attach a design image to check."}], false, true, requestParamsForRegeneration);
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
          userApiKey: apiKeyToUseThisTurn,
        };
        const platformMessagesOutput = await generatePlatformMessages(platformInput);

        if (platformMessagesOutput.messages && platformMessagesOutput.messages.length > 0) {
           platformMessagesOutput.messages.forEach(m => {
            const messageTitle = m.type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
            aiResponseContent.push({ type: 'code', title: messageTitle, code: m.message });
          });
        } else {
          aiResponseContent.push({type: 'text', text: "No platform messages generated."});
        }
      }

      updateMessageById(assistantMessageIdToUpdate, aiResponseContent.length > 0 ? aiResponseContent : [{type: 'text', text: "Done."}], false, false, requestParamsForRegeneration);
      if (!isRegenerationCall) { 
        currentApiKeyIndexRef.current = 0; 
      }

    } catch (error: any) {
      console.error("Error processing AI request:", error);
      const availableUserApiKeys = userProfile.geminiApiKeys?.filter(key => key && key.trim() !== '') || [];
      let errorMessageText = `Sorry, I couldn't process that. AI Error: ${error.message || 'Unknown error'}`;
      const isRateLimitError = error.message?.includes('429') || error.message?.toLowerCase().includes('quota') || error.message?.toLowerCase().includes('rate limit');
      const isInternalServerError = error.message?.includes('500') || error.message?.toLowerCase().includes('internal server error');

      if (isRateLimitError && availableUserApiKeys.length > 0) {
        if (currentApiKeyIndexRef.current < availableUserApiKeys.length - 1) {
          currentApiKeyIndexRef.current++;
          const nextKeyAttempt = currentApiKeyIndexRef.current + 1;
          errorMessageText = `The current API key may be rate-limited. Click 'Regenerate' to try the next available key (${nextKeyAttempt}/${availableUserApiKeys.length}).`;
          toast({ title: "Rate Limit Possible", description: `Key ${nextKeyAttempt -1} might be limited. Regenerate to try key ${nextKeyAttempt}.`, variant: "default", duration: 7000 });
        } else {
          errorMessageText = "All your configured API keys may have hit rate limits, or the global key is limited. Please check your quotas or try again later.";
          toast({ title: "All API Keys Tried/Rate Limited", description: "All available API keys may have hit rate limits, or the global key (from .env) is limited.", variant: "destructive", duration: 7000 });
        }
      } else if (isRateLimitError) { 
        errorMessageText = `The API request was rate-limited (${error.message}). Please try again later or check your API key quotas.`;
        toast({ title: "Rate Limit Hit", description: error.message || "The request was rate-limited.", variant: "destructive", duration: 7000 });
      } else if (isInternalServerError) {
        errorMessageText = `An internal error occurred with the AI service. Please try regenerating the response. Error: ${error.message || 'Internal Server Error'}`;
        toast({ title: "AI Internal Error", description: "The AI service encountered an internal error. Please try regenerating.", variant: "destructive", duration: 7000 });
      }
       else if (error.message?.toLowerCase().includes('api key not valid') || error.message?.toLowerCase().includes('invalid api key')) {
         errorMessageText = `The API key used is invalid. Please check your profile settings or the GOOGLE_API_KEY environment variable. Error: ${error.message}`;
         toast({ title: "Invalid API Key", description: "The API key is invalid. Check settings.", variant: "destructive", duration: 7000 });
      }
      else {
        toast({ title: "AI Error", description: error.message || "Failed to get response from AI.", variant: "destructive" });
      }
      updateMessageById(assistantMessageIdToUpdate, [{ type: 'text', text: errorMessageText }], false, true, requestParamsForRegeneration);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegenerateMessage = useCallback((originalRequestDetailsFromMessage?: ChatMessage['originalRequest'] & { messageIdToRegenerate: string }) => {
    if (!originalRequestDetailsFromMessage || !originalRequestDetailsFromMessage.messageIdToRegenerate) {
        toast({ title: "Cannot Regenerate", description: "Original request details or message ID are missing.", variant: "destructive" });
        return;
    }
    if (profileLoading) {
      toast({ title: "Profile loading", description: "Please wait for profile to load before regenerating.", variant: "default" });
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

    const { messageIdToRegenerate, ...originalRequest } = originalRequestDetailsFromMessage;

    handleSendMessage(
        originalRequest.messageText,
        originalRequest.actionType,
        originalRequest.notes,
        originalRequest.attachedFilesData,
        true, 
        messageIdToRegenerate 
    );
  }, [profileLoading, profile, currentSession, handleSendMessage]); // Removed addMessage, updateMessageById from here

  const handleAction = (action: ActionType) => {
    if (action === 'generateDeliveryTemplates' || action === 'generateRevision') {
      setModalActionType(action);
      setShowNotesModal(true);
    } else {
      // For other actions, call handleSendMessage directly
      // The messageIdToUpdate is undefined here, so it will create a new assistant message
      handleSendMessage(inputMessage || '', action, undefined, undefined, false, undefined);
    }
  };

  const submitModalNotes = () => {
    if (modalActionType) {
      // Call handleSendMessage with the modal notes, also no messageIdToUpdate for new message
      handleSendMessage(inputMessage || '', modalActionType, modalNotes, undefined, false, undefined);
    }
    setShowNotesModal(false);
    setModalNotes('');
    setModalActionType(null);
  };

  const handleFileSelectAndProcess = async (newFiles: File[]) => {
    const combinedFiles = [...selectedFiles, ...newFiles].slice(0, 5); // Limit to 5 files total
    setSelectedFiles(combinedFiles);

    const processedNewFiles = await processFilesForAI(newFiles);
    setCurrentAttachedFilesData(prev =>
        [...prev, ...processedNewFiles]
        .reduce((acc, current) => { // Deduplicate based on name & size
            if (!acc.find(item => item.name === current.name && item.size === current.size)) {
                acc.push(current);
            }
            return acc;
        }, [] as AttachedFile[])
        .slice(0,5) // Ensure total processed files also respects the limit
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
        // No messageIdToUpdate for new message from Enter key
        handleSendMessage(inputMessage, 'processMessage', undefined, undefined, false, undefined);
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
    // Check if leaving to outside the window or to a child element
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
  }, [handleFileSelectAndProcess]);


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
          {isHistoryPanelOpen && ( // Only render if open to prevent rendering in 0-width container
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
          <div className="absolute inset-x-4 bottom-[160px] md:bottom-[150px] top-16 md:top-[calc(var(--header-height)_+_1rem)] border-4 border-dashed border-primary bg-primary/10 rounded-lg flex items-center justify-center pointer-events-none z-20 animate-fadeIn">
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
           <div className="flex flex-wrap items-center justify-between mt-2 gap-y-2"> {/* Added flex-wrap and gap-y-2 */}
             <div className="flex-shrink-0"> {/* Ensures attach button doesn't shrink too much */}
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                    className={cn(
                        "text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors",
                        isMobile ? "px-2 py-2" : "" 
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
             <div className="flex-1 flex justify-end"> {/* Panel takes remaining space and aligns its content to end */}
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

    

    