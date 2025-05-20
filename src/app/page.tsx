
'use client';

import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { Paperclip, Loader2, BotIcon, Menu, XIcon, PanelLeftOpen, PanelLeftClose, Palette, SearchCheck, ClipboardSignature, ListChecks, ClipboardList, Lightbulb, Terminal, Plane, RotateCcw, PlusCircle, Edit3, RefreshCw } from 'lucide-react';
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
import { generateEditingPrompts, type GenerateEditingPromptsInput, type GenerateEditingPromptsOutput } from '@/ai/flows/generate-editing-prompts-flow';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import { DEFAULT_USER_ID, DEFAULT_MODEL_ID } from '@/lib/constants';
import { useAuth } from '@/contexts/auth-context';

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
        if (part.english?.analysis) tgContent += `**English Analysis:**\n${part.english.analysis}\n\n`;
        if (part.english?.simplifiedRequest) tgContent += `**English Simplified Request:**\n${part.english.simplifiedRequest}\n\n`;
        if (part.english?.stepByStepApproach) tgContent += `**English Step-by-Step Approach:**\n${part.english.stepByStepApproach}\n\n`;
        
        let bengaliCombined = "";
        if (part.bengali?.analysis && part.bengali?.simplifiedRequest && part.bengali?.stepByStepApproach) {
          bengaliCombined = `বিশ্লেষণ (Analysis):\n${part.bengali.analysis}\n\nসরলীকৃত অনুরোধ (Simplified Request):\n${part.bengali.simplifiedRequest}\n\nধাপে ধাপে পদ্ধতি (Step-by-Step Approach):\n${part.bengali.stepByStepApproach}`;
        } else if (part.bengali?.analysis) { 
          bengaliCombined = part.bengali.analysis; // Assuming this is the combined field now
        } else if (part.bengali?.simplifiedRequest) {
          bengaliCombined = `সরলীকৃত অনুরোধ (Simplified Request):\n${part.bengali.simplifiedRequest}`;
        } else if (part.bengali?.stepByStepApproach) {
            bengaliCombined = `ধাপে ধাপে পদ্ধতি (Step-by-Step Approach):\n${part.bengali.stepByStepApproach}`;
        }
        
        if (bengaliCombined.trim()) {
          if (tgContent.trim()) tgContent += "\n---\n";
          tgContent += `**বাংলা (Bengali Combined):**\n${bengaliCombined.trim()}\n`;
        }
        
        if (!tgContent.trim()) {
            tgContent = `[Empty Translation Group${part.title ? ` for "${part.title}"`: ''}]\n`;
        }
        fullText += tgContent;
        break;
      default:
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
        } else {
           fullText += `${titlePrefix}[Unsupported Content Part: ${unknownPart.type || 'Unknown Type'}${part.title ? ` for "${part.title}"`: ''}]\n`;
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
    const idParts = typeof newId === 'string' ? newId.split('-') : [];
    const isInvalidOldId = idParts.length < 3 || idParts[0] !== 'msg' || isNaN(Number(idParts[1])) || typeof idParts[2] !== 'string' || idParts[2].length < 5;

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
  const { user: authUser, loading: authLoading, googleAccessToken } = useAuth();
  const { profile, isLoading: profileLoading } = useUserProfile();
  const chatAreaRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [showNotesModal, setShowNotesModal] = useState(false);
  const [modalActionType, setModalActionType] = useState<ActionType | null>(null);
  const [modalNotes, setModalNotes] = useState('');

  const userIdForHistory = useMemo(() => {
    if (!authLoading && authUser) {
      return authUser.uid;
    }
    return profile?.userId || DEFAULT_USER_ID;
  }, [authLoading, authUser, profile?.userId]);


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
  const [isHistoryPanelOpen, setIsHistoryPanelOpen] = useState(false);

  const currentApiKeyIndexRef = useRef(0);

  const ensureMessagesHaveUniqueIds = useCallback(baseEnsureMessagesHaveUniqueIds, []);

  useEffect(() => {
    if (isMobile !== undefined) { 
        setIsHistoryPanelOpen(!isMobile);
    }
  }, [isMobile]);


  useEffect(() => {
    if (authLoading || profileLoading || historyHookLoading || !userIdForHistory) {
      console.log(`ChatPage: Initial session load deferred. AuthLoading: ${authLoading}, ProfileLoading: ${profileLoading}, HistoryHookLoading: ${historyHookLoading}, UserID: ${userIdForHistory}`);
      return;
    }
  
    const loadOrCreateSession = async () => {
      const currentUserIdToUse = userIdForHistory;
      const lastActiveSessionIdKey = LAST_ACTIVE_SESSION_ID_KEY_PREFIX + currentUserIdToUse;
      const lastActiveSessionId = localStorage.getItem(lastActiveSessionIdKey);
      let sessionToLoad: ChatSession | null = null;
  
      console.log(`ChatPage: Attempting to load/create session for user ${currentUserIdToUse}. LastActiveID: ${lastActiveSessionId}`);

      if (lastActiveSessionId && lastActiveSessionId.startsWith(currentUserIdToUse + '_')) {
        sessionToLoad = await getSession(lastActiveSessionId);
        if (sessionToLoad && sessionToLoad.userId !== currentUserIdToUse) {
            console.warn(`ChatPage: Loaded session ${lastActiveSessionId} belongs to a different user (${sessionToLoad.userId}). Discarding.`);
            sessionToLoad = null; 
            localStorage.removeItem(lastActiveSessionIdKey);
        } else if (!sessionToLoad) {
            console.warn(`ChatPage: Last active session ID ${lastActiveSessionId} found but getSession returned null. Clearing ID.`);
            localStorage.removeItem(lastActiveSessionIdKey);
        }
      } else if (lastActiveSessionId) {
        console.warn(`ChatPage: lastActiveSessionId ${lastActiveSessionId} does not match current user ${currentUserIdToUse} prefix. Clearing.`);
        localStorage.removeItem(lastActiveSessionIdKey);
      }
  
      if (sessionToLoad) {
        console.log(`ChatPage: Successfully loaded last active session ${sessionToLoad.id}.`);
        const migratedMessages = ensureMessagesHaveUniqueIds(sessionToLoad.messages);
        const updatedSession = { ...sessionToLoad, messages: migratedMessages };
        setCurrentSession(updatedSession);
        setMessages(updatedSession.messages);
      } else {
        console.log(`ChatPage: No valid last active session found for user ${currentUserIdToUse}. Creating new session.`);
        const userApiKeyForNameGen = (profile?.geminiApiKeys && profile.geminiApiKeys.length > 0 && profile.geminiApiKeys[0]) ? profile.geminiApiKeys[0] : undefined;
        const newSession = createNewSession([], profile?.selectedGenkitModelId || DEFAULT_MODEL_ID, userApiKeyForNameGen);
        setCurrentSession(newSession);
        setMessages(newSession.messages);
        if (newSession.id && newSession.id.startsWith(currentUserIdToUse + '_')) {
          localStorage.setItem(lastActiveSessionIdKey, newSession.id);
          console.log(`ChatPage: New session ${newSession.id} created and set as last active for user ${currentUserIdToUse}.`);
        } else {
           console.warn("ChatPage (useEffect session load): New session ID does not match current user ID prefix or is null. This should not happen.", newSession?.id, currentUserIdToUse);
        }
      }
    };
  
    loadOrCreateSession();
  
  }, [
    authLoading, 
    profileLoading, 
    historyHookLoading, 
    userIdForHistory, 
    profile?.selectedGenkitModelId, 
    profile?.geminiApiKeys,
    getSession, // from useChatHistory, ensure it's stable or part of deps if it changes
    createNewSession, // from useChatHistory
    ensureMessagesHaveUniqueIds
  ]);


  useEffect(() => {
    if (chatAreaRef.current) {
      chatAreaRef.current.scrollTop = chatAreaRef.current.scrollHeight;
    }
  }, [messages]);

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
            timestamp: Date.now(), 
            canRegenerate: !!originalRequestDetails, 
            originalRequest: originalRequestDetails 
        } : msg
      );
    });
  }, []);

  const handleNewChat = useCallback(() => {
    const currentUserId = userIdForHistory; 
    const modelIdToUse = (profile?.selectedGenkitModelId || DEFAULT_MODEL_ID);
    const userApiKeyForNewChatNameGen = (profile?.geminiApiKeys && profile.geminiApiKeys.length > 0 && profile.geminiApiKeys[0]) ? profile.geminiApiKeys[0] : undefined;
    const newSession = createNewSession([], modelIdToUse, userApiKeyForNewChatNameGen);
    setCurrentSession(newSession);
    setMessages(newSession.messages);
    setInputMessage('');
    setSelectedFiles([]);
    setCurrentAttachedFilesData([]);
    currentApiKeyIndexRef.current = 0;
    const lastActiveSessionIdKey = LAST_ACTIVE_SESSION_ID_KEY_PREFIX + currentUserId;
    if (newSession.id && newSession.id.startsWith(currentUserId + '_')) {
      localStorage.setItem(lastActiveSessionIdKey, newSession.id);
    } else {
       console.warn("handleNewChat: New session ID does not match current user ID prefix. This should not happen.", newSession.id, currentUserId);
    }
    if (isMobile) setIsHistoryPanelOpen(false);
  }, [createNewSession, userIdForHistory, isMobile, profile?.selectedGenkitModelId, profile?.geminiApiKeys]);

  const handleSelectSession = useCallback(async (sessionId: string) => {
    const currentUserId = userIdForHistory;
    const selected = await getSession(sessionId);
    if (selected && selected.id.startsWith(currentUserId + '_') && selected.userId === currentUserId) {
      const migratedMessages = ensureMessagesHaveUniqueIds(selected.messages);
      const updatedSession = { ...selected, messages: migratedMessages };
      setCurrentSession(updatedSession);
      setMessages(updatedSession.messages);
      currentApiKeyIndexRef.current = 0; 
      const lastActiveSessionIdKey = LAST_ACTIVE_SESSION_ID_KEY_PREFIX + currentUserId;
      localStorage.setItem(lastActiveSessionIdKey, sessionId);
    } else if (selected) { 
        toast({ title: "Error", description: `Cannot load session ${sessionId}. It may belong to a different user context or is corrupted.`, variant: "destructive" });
        localStorage.removeItem(LAST_ACTIVE_SESSION_ID_KEY_PREFIX + currentUserId); 
        handleNewChat(); 
    } else { 
        toast({ title: "Error", description: `Could not load session ${sessionId}. It might be corrupted or missing.`, variant: "destructive" });
        localStorage.removeItem(LAST_ACTIVE_SESSION_ID_KEY_PREFIX + currentUserId);
        handleNewChat(); 
    }
    if (isMobile) setIsHistoryPanelOpen(false);
  }, [getSession, ensureMessagesHaveUniqueIds, userIdForHistory, isMobile, toast, handleNewChat]);

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
    attachedFilesDataParam?: AttachedFile[], 
    isRegenerationCall: boolean = false,
    messageIdToUpdate?: string 
  ) => {

    if (profileLoading) {
        toast({ title: "Profile Loading...", description: "Please wait for your profile data to load before performing actions.", variant: "default" });
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
        currentApiKeyIndexRef.current = 0;
    }

    const userProfile = profile;
    const availableUserApiKeys = userProfile.geminiApiKeys?.filter(key => key && key.trim() !== '') || [];
    let apiKeyToUseThisTurn: string | undefined;

    if (currentApiKeyIndexRef.current < availableUserApiKeys.length) {
        apiKeyToUseThisTurn = availableUserApiKeys[currentApiKeyIndexRef.current];
    } else {
        apiKeyToUseThisTurn = undefined; 
        if (availableUserApiKeys.length > 0) { 
            console.warn(`All ${availableUserApiKeys.length} user-provided API keys have been tried or failed for this sequence. Attempting fallback to global key if set.`);
        }
    }

    const currentMessageText = messageTextParam.trim();
    const currentActionType = actionTypeParam;
    const currentNotes = notesParam;
    const filesToSendWithThisMessage = isRegenerationCall && attachedFilesDataParam ? attachedFilesDataParam : [...currentAttachedFilesData];

    if (actionTypeParam === 'checkMadeDesigns' && filesToSendWithThisMessage.filter(f => f.type?.startsWith('image/') && f.dataUri).length === 0) {
      toast({ title: "No Design Attached", description: `Please attach a design image to use the 'Check Designs' feature.`, variant: "destructive" });
      return;
    }

    const modelIdToUse = userProfile.selectedGenkitModelId || DEFAULT_MODEL_ID;
    const userMessageContent = (!isRegenerationCall || (isRegenerationCall && currentMessageText)) 
        ? (currentMessageText || (filesToSendWithThisMessage.length > 0 ? `Attached ${filesToSendWithThisMessage.length} file(s)${currentNotes ? ` (Notes: ${currentNotes})` : ''}` : `Triggered action: ${currentActionType}${currentNotes ? ` (Notes: ${currentNotes})` : ''}`))
        : ''; 

    const requestParamsForRegeneration: ChatMessage['originalRequest'] = {
        actionType: currentActionType,
        messageText: currentMessageText, 
        notes: currentNotes,
        attachedFilesData: filesToSendWithThisMessage, 
        messageIdToRegenerate: messageIdToUpdate 
    };

    let assistantMessageIdToUse: string;
    let userMessageId: string | null = null;


    if (messageIdToUpdate) { 
        assistantMessageIdToUse = messageIdToUpdate;
        updateMessageById(assistantMessageIdToUse, 'Processing...', true, false, requestParamsForRegeneration);
    } else { 
        if (userMessageContent.trim() !== '' || filesToSendWithThisMessage.length > 0) {
          userMessageId = addMessage('user', userMessageContent, filesToSendWithThisMessage);
        }
        assistantMessageIdToUse = addMessage('assistant', 'Processing...', [], true, false, requestParamsForRegeneration);
    }

    setIsLoading(true);
    if (!isRegenerationCall && !attachedFilesDataParam) {
        setInputMessage('');
        setSelectedFiles([]);
        setCurrentAttachedFilesData([]);
        if (fileInputRef.current) fileInputRef.current.value = '';
    }

    let finalAiResponseContent: ChatMessageContentPart[] = [];
    let aiCallError: any = null;

    try {
      const baseInput = {
        userName: userProfile.name,
        communicationStyleNotes: userProfile.communicationStyleNotes || '',
        modelId: modelIdToUse,
        userApiKey: apiKeyToUseThisTurn,
      };
      const filesForFlow = filesToSendWithThisMessage.map(f => ({ name: f.name, type: f.type, dataUri: f.dataUri, textContent: f.textContent, size: f.size }));

      // Construct chat history just before the AI call using the current `messages` state
      const currentMessagesState = messages; // Capture current state for this specific call
      const chatHistoryForAI = currentMessagesState 
        .filter(msg => msg.id !== assistantMessageIdToUse) // Exclude the "Processing..." message itself
        .slice(-10) 
        .map(msg => ({
          role: msg.role as 'user' | 'assistant',
          text: getMessageText(msg.content)
        }))
        .filter(msg => msg.text.trim() !== '' && (msg.role === 'user' || msg.role === 'assistant'));


      if (currentActionType === 'processMessage') {
        const processInput: ProcessClientMessageInput = { ...baseInput, clientMessage: currentMessageText, attachedFiles: filesForFlow, chatHistory: chatHistoryForAI };
        const processed = await processClientMessage(processInput);
        finalAiResponseContent.push({
          type: 'translation_group',
          title: 'Client Request Analysis & Plan',
          english: { analysis: processed.analysis, simplifiedRequest: processed.simplifiedRequest, stepByStepApproach: processed.stepByStepApproach },
          bengali: { analysis: processed.bengaliTranslation }
        });
      } else if (currentActionType === 'analyzeRequirements') {
        const requirementsInput: AnalyzeClientRequirementsInput = { ...baseInput, clientMessage: currentMessageText, attachedFiles: filesForFlow, chatHistory: chatHistoryForAI };
        const requirementsOutput = await analyzeClientRequirements(requirementsInput);
        finalAiResponseContent.push({ type: 'text', title: 'Main Requirements Analysis', text: requirementsOutput.mainRequirementsAnalysis });
        finalAiResponseContent.push({ type: 'text', title: 'Detailed Requirements (English)', text: requirementsOutput.detailedRequirementsEnglish });
        finalAiResponseContent.push({ type: 'text', title: 'Detailed Requirements (Bangla)', text: requirementsOutput.detailedRequirementsBangla });
        finalAiResponseContent.push({ type: 'text', title: 'Design Message or Saying', text: requirementsOutput.designMessageOrSaying });
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
            ...baseInput,
            designInputText: currentMessageText || "general creative designs",
            attachedFiles: filesForFlow,
            chatHistory: chatHistoryForAI
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
            ...baseInput,
            clientMessage: currentMessageText,
            attachedFiles: filesForFlow,
            chatHistory: chatHistoryForAI
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
          finalAiResponseContent = [{type: 'text', text: "Please attach a design image to check."}];
          aiCallError = new Error("Missing design image for CheckMadeDesigns.");
        } else {
            const checkInput: CheckMadeDesignsInput = {
            ...baseInput,
            clientPromptOrDescription: currentMessageText || "Client requirements as per conversation history.",
            designToCheckDataUri: designFile.dataUri,
            chatHistory: chatHistoryForAI,
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
        const designFile = filesForFlow.find(f => f.type?.startsWith('image/') && f.dataUri);
        if (designFile && designFile.dataUri) {
            designToEditDataUriForFlow = designFile.dataUri;
        } 
        
        const editingInput: GenerateEditingPromptsInput = {
            ...baseInput,
            designToEditDataUri: designToEditDataUriForFlow,
            clientInstructionForEditingTheme: currentMessageText,
            chatHistory: chatHistoryForAI,
        };
        const result: GenerateEditingPromptsOutput = await generateEditingPrompts(editingInput);
        if (result.editingPrompts && result.editingPrompts.length > 0) {
            if (result.editingPrompts.length === 1 && result.editingPrompts[0].type === "error_no_image_found") {
                finalAiResponseContent.push({ type: 'text', title: 'Error', text: result.editingPrompts[0].prompt });
                toast({ title: "Image Not Found For Editing", description: result.editingPrompts[0].prompt, variant: "destructive" });
            } else {
                result.editingPrompts.forEach(p => {
                    const title = p.type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
                    finalAiResponseContent.push({ type: 'code', title: `Prompt for ${title}`, code: p.prompt });
                });
            }
        } else {
            finalAiResponseContent.push({ type: 'text', text: "No editing prompts were generated."});
        }
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
            finalAiResponseContent.push({ type: 'code', title: messageTitle, code: m.message });
          });
        } else {
          finalAiResponseContent.push({type: 'text', text: "No platform messages generated."});
        }
      }
      if (finalAiResponseContent.length === 0 && !aiCallError) {
        finalAiResponseContent.push({type: 'text', text: "Done."});
      }
      updateMessageById(assistantMessageIdToUse, finalAiResponseContent, false, false, requestParamsForRegeneration);
      if (!isRegenerationCall) { 
        currentApiKeyIndexRef.current = 0; 
      }
      
    } catch (error: any) {
      aiCallError = error; 
      console.error("Error processing AI request in page.tsx handleSendMessage (outer try-catch):", error);
    }

    if (aiCallError) {
      let errorMessageText = `Sorry, I couldn't process that. AI Error: ${aiCallError.message || 'Unknown error'}`;
      const isRateLimit = aiCallError.message?.includes('429') || aiCallError.message?.toLowerCase().includes('quota') || aiCallError.message?.toLowerCase().includes('rate limit');
      const isInternalServerError = aiCallError.message?.includes('500') || aiCallError.message?.toLowerCase().includes('internal server error');
      const isInvalidApiKey = aiCallError.message?.toLowerCase().includes('api key not valid') || aiCallError.message?.toLowerCase().includes('invalid api key');

      if (isRateLimit && availableUserApiKeys.length > 0) {
        if (currentApiKeyIndexRef.current < availableUserApiKeys.length - 1) {
          currentApiKeyIndexRef.current++; 
          const nextKeyAttempt = currentApiKeyIndexRef.current + 1;
          errorMessageText = `The current API key (attempt ${nextKeyAttempt-1}/${availableUserApiKeys.length}) may be rate-limited. Click 'Regenerate' to try the next available key (${nextKeyAttempt}/${availableUserApiKeys.length}). Original error: ${aiCallError.message}`;
          toast({ title: "Rate Limit Possible", description: `Key ${nextKeyAttempt -1} might be limited. Regenerate to try key ${nextKeyAttempt}.`, variant: "default", duration: 7000 });
        } else {
          errorMessageText = `All configured API keys (${availableUserApiKeys.length}) may have hit rate limits, or the global key is limited. Please check your quotas or try again later. Original error: ${aiCallError.message}`;
          toast({ title: "All API Keys Tried/Rate Limited", description: "All available API keys may have hit rate limits, or the global key (from .env) is limited.", variant: "destructive", duration: 7000 });
        }
      } else if (isRateLimit) {
        errorMessageText = `The API request was rate-limited (${aiCallError.message}). Please try again later or check your API key quotas.`;
        toast({ title: "Rate Limit Hit", description: aiCallError.message || "The request was rate-limited.", variant: "destructive", duration: 7000 });
      } else if (isInternalServerError) {
        errorMessageText = `An internal error occurred with the AI service. Please try regenerating the response. Error: ${aiCallError.message || 'Internal Server Error'}`;
        toast({ title: "AI Internal Error", description: "The AI service encountered an internal error. Please try regenerating.", variant: "destructive", duration: 7000 });
      } else if (isInvalidApiKey) {
         errorMessageText = `The API key used is invalid. Please check your profile settings or the GOOGLE_API_KEY environment variable. Error: ${aiCallError.message}`;
         toast({ title: "Invalid API Key", description: "The API key is invalid. Check settings.", variant: "destructive", duration: 7000 });
      } else {
        toast({ title: "AI Error", description: aiCallError.message || "Failed to get response from AI.", variant: "destructive" });
      }
      updateMessageById(assistantMessageIdToUse, [{ type: 'text', text: errorMessageText }], false, true, requestParamsForRegeneration);
    }
      
    if (currentSession && userIdForHistory) {
        setMessages(prevMessages => {
            let updatedMessagesList = prevMessages.map(m => 
                m.id === assistantMessageIdToUse ? 
                {...m, content: aiCallError ? [{ type: 'text', text: finalAiResponseContent[0]?.text || errorMessageText || 'Error processing request.' }] : finalAiResponseContent, isLoading: false, isError: !!aiCallError, originalRequest: requestParamsForRegeneration, timestamp: Date.now()} :
                m 
            );
            // Ensure user message is also part of this snapshot if it was just added
            if(userMessageId && !messageIdToUpdate){
                const userMsgObject = prevMessages.find(m => m.id === userMessageId);
                if(userMsgObject && !updatedMessagesList.find(m => m.id === userMessageId)) {
                    // This scenario might be complex if setMessages hasn't updated prevMessages yet
                    // For simplicity, the saveSession will use the `messages` state from the outer scope
                    // which should include the user message if added.
                }
            }
            
            const sessionToSave = { ...currentSession, messages: ensureMessagesHaveUniqueIds(updatedMessagesList) };

            saveSession(
                sessionToSave,
                !messageIdToUpdate && (sessionToSave.messages.length <= (userMessageId ? 2 : 1) || !currentSession.name || currentSession.name === "New Chat"),
                modelIdToUse,
                apiKeyToUseThisTurn
            ).then(savedSession => {
                if (savedSession) {
                    setCurrentSession(savedSession);
                }
            });
            return updatedMessagesList;
        });
    }

    setIsLoading(false);
  };

  const handleRegenerateMessage = useCallback((originalRequestDetailsFromMessage?: ChatMessage['originalRequest']) => {
    if (!originalRequestDetailsFromMessage || !originalRequestDetailsFromMessage.messageIdToRegenerate) {
        toast({ title: "Cannot Regenerate", description: "Original request details or message ID are missing.", variant: "destructive" });
        return;
    }
    if (profileLoading) {
      toast({ title: "Profile Loading...", description: "Please wait for profile to load before regenerating.", variant: "default" });
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
  }, [profileLoading, profile, currentSession, toast, handleSendMessage]); 


  const handleAction = (action: ActionType) => {
    if (action === 'generateDeliveryTemplates' || action === 'generateRevision') {
      setModalActionType(action);
      setShowNotesModal(true);
    } else {
      handleSendMessage(inputMessage || '', action, undefined, undefined, false, undefined);
    }
  };

  const submitModalNotes = () => {
    if (modalActionType) {
      handleSendMessage(inputMessage || '', modalActionType, modalNotes, undefined, false, undefined);
    }
    setShowNotesModal(false);
    setModalNotes('');
    setModalActionType(null);
  };

  const handleFileSelectAndProcess = async (newFiles: File[]) => {
    const combinedFiles = [...selectedFiles, ...newFiles].slice(0, 5); 
    setSelectedFiles(combinedFiles);

    const processedNewFiles = await processFilesForAI(newFiles);
    setCurrentAttachedFilesData(prev =>
        [...prev, ...processedNewFiles]
        .reduce((acc, current) => { 
            if (!acc.find(item => item.name === current.name && item.size === current.size)) {
                acc.push(current);
            }
            return acc;
        }, [] as AttachedFile[])
        .slice(0,5) 
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


  if (authLoading || (!currentSession && !profileLoading && !historyHookLoading) ) { 
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
              isLoading={historyHookLoading}
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
          {isHistoryPanelOpen && (
            <HistoryPanel
              sessions={historyMetadata}
              activeSessionId={currentSession?.id || null}
              onSelectSession={handleSelectSession}
              onNewChat={handleNewChat}
              onDeleteSession={handleDeleteSession}
              isLoading={historyHookLoading}
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
          <div className="flex items-center gap-2">
             { authUser && googleAccessToken && (
                <Button variant="outline" size="sm" onClick={syncWithDrive} disabled={isSyncing} className="hover:bg-primary/10 hover:text-primary transition-colors">
                    {isSyncing ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <RefreshCw className="h-4 w-4 mr-2" />}
                    Sync
                </Button>
            )}
            <Button variant="outline" size="sm" onClick={handleNewChat} className="hover:bg-primary/10 hover:text-primary transition-colors">
                <PlusCircle className="h-4 w-4 mr-2" />
                New Chat
            </Button>
          </div>
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
              <Button variant="link" size="sm" className="ml-2 h-auto p-0 text-primary hover:text-primary/80" onClick={clearSelectedFiles}>Clear</Button>
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
            <DialogTitle>Additional Notes for {modalActionType === 'generateDeliveryTemplates' ? 'Delivery' : modalActionType === 'generateRevision' ? 'Revision' : 'Action'}</DialogTitle>
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
                placeholder={modalActionType === 'generateDeliveryTemplates' ? "e.g., All final files attached, 2 concepts included..." : modalActionType === 'generateRevision' ? "e.g., Client requested color changes, updated logo attached..." : "Enter notes here..."}
              />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose>
            <Button onClick={submitModalNotes}>Generate</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

    