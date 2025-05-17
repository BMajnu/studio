
'use client';

import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { Paperclip, Send, Loader2, BotMessageSquare as BotIcon, Menu, XIcon } from 'lucide-react';
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
import { suggestClientReplies, type SuggestClientRepliesInput } from '@/ai/flows/suggest-client-replies';
import { generatePlatformMessages, type GeneratePlatformMessagesInput } from '@/ai/flows/generate-platform-messages';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import { DEFAULT_USER_ID } from '@/lib/constants';

// Helper to get textual content from ChatMessageContentPart[] or string
const getMessageText = (content: string | ChatMessageContentPart[]): string => {
  if (typeof content === 'string') return content;
  const textPart = content.find(p => p.type === 'text');
  return textPart?.text || '';
};

// Prefix for storing the last active session ID in localStorage
const LAST_ACTIVE_SESSION_ID_KEY_PREFIX = 'desainr_last_active_session_id_';

// Helper function to generate robust message IDs
const generateRobustMessageId = (): string => {
  return `msg-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
};

// Function to ensure messages have unique and correctly formatted IDs
const baseEnsureMessagesHaveUniqueIds = (messagesToProcess: ChatMessage[]): ChatMessage[] => {
  if (!Array.isArray(messagesToProcess) || messagesToProcess.length === 0) {
    return [];
  }
  const seenIds = new Set<string>();
  return messagesToProcess.map(msg => {
    let newId = msg.id;
    // Check if ID is missing, not a string, in old format (doesn't start with 'msg-'), or already seen in this batch
    if (typeof newId !== 'string' || !newId.startsWith('msg-') || seenIds.has(newId) || !isNaN(Number(newId))) {
      let candidateId = generateRobustMessageId();
      // Ensure the newly generated ID is also unique within this batch
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
    // Return a consistent ID during loading phase or if profile is not yet available
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
  const [isHistoryPanelOpen, setIsHistoryPanelOpen] = useState(false);
  const isMobile = useIsMobile();

  const ensureMessagesHaveUniqueIds = useCallback(baseEnsureMessagesHaveUniqueIds, []);

  // Initialize or load session
  useEffect(() => {
    if (!profileLoading && profile) { 
      const currentUserId = profile.userId || DEFAULT_USER_ID;
      const lastActiveSessionIdKey = LAST_ACTIVE_SESSION_ID_KEY_PREFIX + currentUserId;
      const lastActiveSessionId = localStorage.getItem(lastActiveSessionIdKey);
      let sessionToLoad: ChatSession | null = null;

      if (lastActiveSessionId) {
        sessionToLoad = getSession(lastActiveSessionId);
      }

      if (sessionToLoad) {
        const migratedMessages = ensureMessagesHaveUniqueIds(sessionToLoad.messages);
        const updatedSession = { ...sessionToLoad, messages: migratedMessages };
        setCurrentSession(updatedSession);
        setMessages(updatedSession.messages);
      } else {
        const newSession = createNewSession();
        setCurrentSession(newSession);
        setMessages(newSession.messages); 
        localStorage.setItem(lastActiveSessionIdKey, newSession.id);
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileLoading, profile, getSession, createNewSession, ensureMessagesHaveUniqueIds]);


  // Auto-scroll chat
  useEffect(() => {
    if (chatAreaRef.current) {
      chatAreaRef.current.scrollTop = chatAreaRef.current.scrollHeight;
    }
  }, [messages]);

  // Auto-save session
  useEffect(() => {
    if (currentSession && (messages.length > 0 || currentSession.messages.length > 0) ) { 
      const isNewChatName = currentSession.name === "New Chat";
      const shouldAttemptNameGeneration = isNewChatName && messages.length > 0 && messages.length <= 2;

      const updatedSession = { ...currentSession, messages, updatedAt: Date.now() };

      const saveTimeout = setTimeout(() => {
        saveSession(updatedSession, shouldAttemptNameGeneration).then(savedSession => {
          if (savedSession) {
             setCurrentSession(prevCurrentSession => {
                if (!prevCurrentSession) return savedSession; // Should ideally not happen if guarded by currentSession check
                if (savedSession.name !== prevCurrentSession.name) {
                    return { ...prevCurrentSession, name: savedSession.name, messages: savedSession.messages, updatedAt: savedSession.updatedAt };
                }
                // If only messages or updatedAt changed, reflect that
                if (savedSession.messages !== prevCurrentSession.messages || savedSession.updatedAt !== prevCurrentSession.updatedAt) {
                    return { ...prevCurrentSession, messages: savedSession.messages, updatedAt: savedSession.updatedAt };
                }
                return prevCurrentSession;
            });
          }
        });
      }, 1000);
      return () => clearTimeout(saveTimeout);
    }
  }, [messages, currentSession, saveSession]);


  const addMessage = useCallback((role: 'user' | 'assistant' | 'system', content: string | ChatMessageContentPart[], currentAttachments?: AttachedFile[], isLoadingParam?: boolean, isErrorParam?: boolean) => {
    const newMessage: ChatMessage = {
      id: generateRobustMessageId(),
      role,
      content,
      timestamp: Date.now(),
      isLoading: isLoadingParam,
      isError: isErrorParam,
      attachedFiles: role === 'user' ? currentAttachments : undefined,
    };
    setMessages(prev => [...prev, newMessage]);
  }, []);

  const updateLastMessage = useCallback((content: string | ChatMessageContentPart[], isLoadingParam: boolean = false, isErrorParam: boolean = false) => {
    setMessages(prev => prev.map((msg, index) =>
      index === prev.length - 1 ? { ...msg, content, isLoading: isLoadingParam, isError: isErrorParam, timestamp: Date.now() } : msg
    ));
  }, []);

  const handleNewChat = useCallback(() => {
    const newSession = createNewSession();
    setCurrentSession(newSession);
    setMessages(newSession.messages);
    setInputMessage('');
    setSelectedFiles([]);
    setCurrentAttachedFilesData([]);
    const currentUserId = profile?.userId || DEFAULT_USER_ID;
    const lastActiveSessionIdKey = LAST_ACTIVE_SESSION_ID_KEY_PREFIX + currentUserId;
    localStorage.setItem(lastActiveSessionIdKey, newSession.id);
    if (isMobile) setIsHistoryPanelOpen(false);
  }, [createNewSession, profile, isMobile]);

  const handleSelectSession = useCallback((sessionId: string) => {
    const selected = getSession(sessionId);
    if (selected) {
      const migratedMessages = ensureMessagesHaveUniqueIds(selected.messages);
      const updatedSession = { ...selected, messages: migratedMessages };
      setCurrentSession(updatedSession);
      setMessages(updatedSession.messages);
      const currentUserId = profile?.userId || DEFAULT_USER_ID;
      const lastActiveSessionIdKey = LAST_ACTIVE_SESSION_ID_KEY_PREFIX + currentUserId;
      localStorage.setItem(lastActiveSessionIdKey, sessionId);
    }
    if (isMobile) setIsHistoryPanelOpen(false);
  }, [getSession, ensureMessagesHaveUniqueIds, profile, isMobile]);

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

  const handleSendMessage = async (messageText: string = inputMessage, actionType: ActionType = 'processMessage', notes?: string) => {
    const currentMessageText = messageText.trim();
    if (!currentMessageText && actionType !== 'generateDelivery' && actionType !== 'generateRevision' && selectedFiles.length === 0) return;
    if (!profile) {
      toast({ title: "Profile not loaded", description: "Please wait for your profile to load or set it up in Settings.", variant: "destructive" });
      return;
    }
    if (!currentSession) {
        toast({ title: "Session not initialized", description: "Please wait or try creating a new chat.", variant: "destructive" });
        return;
    }

    const filesToSendWithThisMessage = [...currentAttachedFilesData];

    addMessage('user', currentMessageText || `Triggered: ${actionType}`, filesToSendWithThisMessage);
    addMessage('assistant', 'Processing...', [], true);
    setIsLoading(true);
    setInputMessage('');
    setSelectedFiles([]);
    setCurrentAttachedFilesData([]);
    if (fileInputRef.current) fileInputRef.current.value = '';

    try {
      let aiResponseContent: ChatMessageContentPart[] = [];
      const baseInput = { userName: profile.name, communicationStyleNotes: profile.communicationStyleNotes || '' };
      const filesForFlow = filesToSendWithThisMessage.map(f => ({ name: f.name, type: f.type, dataUri: f.dataUri, textContent: f.textContent }));


      if (actionType === 'processMessage') {
        const processInput: ProcessClientMessageInput = { ...baseInput, clientMessage: currentMessageText, attachedFiles: filesForFlow };
        const processed = await processClientMessage(processInput);

        const repliesInput: SuggestClientRepliesInput = { clientMessage: currentMessageText, userName: profile.name, professionalTitle: profile.professionalTitle, communicationStyleNotes: profile.communicationStyleNotes, services: profile.services };
        const replies = await suggestClientReplies(repliesInput);

        aiResponseContent.push({
          type: 'translation_group',
          title: 'Client Request Analysis & Plan',
          english: { analysis: processed.analysis, simplifiedRequest: processed.simplifiedRequest, stepByStepApproach: processed.stepByStepApproach },
          bengali: { analysis: processed.bengaliTranslation }
        });
        if (replies.englishReplies && replies.englishReplies.length > 0) {
          aiResponseContent.push({ type: 'list', title: 'Suggested English Replies', items: replies.englishReplies });
        }
      } else if (actionType === 'analyzePlan') {
        const processInput: ProcessClientMessageInput = { ...baseInput, clientMessage: currentMessageText, attachedFiles: filesForFlow };
        const processed = await processClientMessage(processInput);
        aiResponseContent.push({
          type: 'translation_group',
          title: 'Client Request Analysis & Plan',
          english: { analysis: processed.analysis, simplifiedRequest: processed.stepByStepApproach },
        });
      } else if (actionType === 'suggestReplies') {
        const repliesInput: SuggestClientRepliesInput = { clientMessage: currentMessageText, userName: profile.name, professionalTitle: profile.professionalTitle, communicationStyleNotes: profile.communicationStyleNotes, services: profile.services };
        const replies = await suggestClientReplies(repliesInput);
        if (replies.englishReplies && replies.englishReplies.length > 0) {
          aiResponseContent.push({ type: 'list', title: 'Suggested English Replies', items: replies.englishReplies });
        } else {
          aiResponseContent.push({type: 'text', text: "No English replies generated."});
        }
      } else if (actionType === 'suggestRepliesTranslated') {
        const repliesInput: SuggestClientRepliesInput = { clientMessage: currentMessageText, userName: profile.name, professionalTitle: profile.professionalTitle, communicationStyleNotes: profile.communicationStyleNotes, services: profile.services };
        const replies = await suggestClientReplies(repliesInput);
        if (replies.englishReplies && replies.englishReplies.length > 0) {
          aiResponseContent.push({ type: 'list', title: 'Suggested English Replies', items: replies.englishReplies });
        }
        if (replies.bengaliTranslations && replies.bengaliTranslations.length > 0) {
          aiResponseContent.push({ type: 'list', title: 'Bengali Translations', items: replies.bengaliTranslations });
        }
        if (aiResponseContent.length === 0) {
          aiResponseContent.push({type: 'text', text: "No replies or translations generated."});
        }
      } else if (actionType === 'generateDelivery' || actionType === 'generateRevision') {
        const platformInput: GeneratePlatformMessagesInput = {
          name: profile.name,
          professionalTitle: profile.professionalTitle || '',
          services: profile.services || [],
          deliveryNotes: actionType === 'generateDelivery' ? notes || '' : '',
          revisionNotes: actionType === 'generateRevision' ? notes || '' : '',
          fiverrUsername: profile.fiverrUsername || '',
          customSellerFeedbackTemplate: profile.customSellerFeedbackTemplate || '',
          customClientFeedbackResponseTemplate: profile.customClientFeedbackResponseTemplate || '',
          messageType: actionType === 'generateDelivery' ? 'delivery' : 'revision',
        };
        const platformMessages = await generatePlatformMessages(platformInput);
        const mainMessages = platformMessages.messages.filter(m => m.type === platformInput.messageType);
        const followUpMessages = platformMessages.messages.filter(m => m.type === 'follow-up');

        if (mainMessages.length > 0) {
           aiResponseContent.push({ type: 'list', title: `${actionType === 'generateDelivery' ? 'Delivery' : 'Revision'} Message Options`, items: mainMessages.map(m => m.message) });
        }
        if (followUpMessages.length > 0) {
           aiResponseContent.push({ type: 'list', title: 'Follow-up Messages', items: followUpMessages.map(m => m.message) });
        }
        if (aiResponseContent.length === 0) {
          aiResponseContent.push({type: 'text', text: "No platform messages generated."});
        }
      }

      updateLastMessage(aiResponseContent.length > 0 ? aiResponseContent : [{type: 'text', text: "Done."}]);

    } catch (error) {
      console.error("Error processing AI request:", error);
      toast({ title: "AI Error", description: (error as Error).message || "Failed to get response from AI.", variant: "destructive" });
      updateLastMessage([{type: 'text', text: "Sorry, I couldn't process that."}], false, true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAction = (action: ActionType) => {
    if (action === 'generateDelivery' || action === 'generateRevision') {
      setModalActionType(action);
      setShowNotesModal(true);
    } else {
      handleSendMessage(inputMessage, action);
    }
  };

  const submitModalNotes = () => {
    if (modalActionType) {
      handleSendMessage(inputMessage, modalActionType, modalNotes);
    }
    setShowNotesModal(false);
    setModalNotes('');
    setModalActionType(null);
  };

  const handleFileSelectAndProcess = async (newFiles: File[]) => {
    setSelectedFiles(prev => [...prev, ...newFiles].slice(0, 5)); // Allow up to 5 files
    const processed = await processFilesForAI(newFiles);
    setCurrentAttachedFilesData(prev => [...prev, ...processed].slice(0, 5));
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
      if (!isLoading && (inputMessage.trim() || selectedFiles.length >0)) {
        handleSendMessage(inputMessage, 'processMessage');
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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setCurrentAttachedFilesData, setSelectedFiles]); // processFilesForAI is not stable if not memoized, but its core (readFileAsDataURL/Text) is stable


  if (profileLoading || !currentSession) { // Added !currentSession check
    return <div className="flex items-center justify-center h-screen"><Loader2 className="h-12 w-12 animate-spin text-primary" /> <p className="ml-4 text-lg">Loading DesAInR...</p></div>;
  }

  return (
    <div className="flex h-[calc(100vh-var(--header-height,0px))]">
      {isMobile && isHistoryPanelOpen && (
        <div className="fixed inset-0 z-40 bg-black/50" onClick={() => setIsHistoryPanelOpen(false)}>
          <div className="absolute left-0 top-0 h-full w-4/5 max-w-xs bg-background shadow-xl" onClick={(e) => e.stopPropagation()}>
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
        <div className="w-[280px] shrink-0 md:block hidden">
          <HistoryPanel
            sessions={historyMetadata}
            activeSessionId={currentSession?.id || null}
            onSelectSession={handleSelectSession}
            onNewChat={handleNewChat}
            onDeleteSession={handleDeleteSession}
            isLoading={historyLoading}
          />
        </div>
      )}

      <div className="flex-1 flex flex-col bg-background overflow-hidden" ref={dropZoneRef} onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop}>
        {isMobile && (
          <div className="p-2 border-b flex items-center">
            <Button variant="ghost" size="icon" onClick={() => setIsHistoryPanelOpen(prev => !prev)}>
              {isHistoryPanelOpen ? <XIcon className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
            <h2 className="ml-2 font-semibold text-lg truncate">{currentSession?.name || "Chat"}</h2>
          </div>
        )}
        <ScrollArea className="flex-1 p-1 md:p-4" ref={chatAreaRef}>
          <div className="space-y-2">
            {messages.map((msg) => (
              <ChatMessageDisplay key={msg.id} message={msg} />
            ))}
             {messages.length === 0 && !isLoading && (
                <div className="flex flex-col items-center justify-center h-full text-center p-8">
                    <BotIcon className="w-16 h-16 text-primary mb-4" />
                    <h2 className="text-2xl font-semibold mb-2">Welcome to DesAInR!</h2>
                    <p className="text-muted-foreground max-w-md">
                        Type a client message, or drag & drop files below. Then use the action buttons on the right to get started.
                    </p>
                </div>
            )}
          </div>
        </ScrollArea>

        {isDragging && (
          <div className="absolute inset-x-4 bottom-[160px] md:bottom-[150px] top-4 border-4 border-dashed border-primary bg-primary/10 rounded-lg flex items-center justify-center pointer-events-none">
            <p className="text-primary font-semibold text-lg">Drop files here</p>
          </div>
        )}

        <div className={cn("border-t p-4 bg-background", isDragging && "opacity-50")}>
          {selectedFiles.length > 0 && (
            <div className="mb-2 text-xs text-muted-foreground">
              Selected files: {selectedFiles.map(f => f.name).join(', ')}
              <Button variant="link" size="sm" className="ml-2 h-auto p-0" onClick={clearSelectedFiles}>Clear</Button>
            </div>
          )}
          <div className="flex items-start gap-2">
            <Textarea
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your client's message or your query here... (or drag & drop files)"
              className="flex-1 resize-none min-h-[60px] max-h-[150px] rounded-lg shadow-sm focus-visible:ring-2 focus-visible:ring-primary"
              rows={Math.max(1, Math.min(5, inputMessage.split('\n').length))}
            />
            <div className="flex flex-col gap-2">
              <Button
                onClick={() => handleSendMessage(inputMessage, 'processMessage')}
                disabled={isLoading || (!inputMessage.trim() && selectedFiles.length === 0)}
                className="h-[60px] w-[60px] rounded-lg shadow-sm bg-primary hover:bg-primary/90"
                aria-label="Send message"
              >
                {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
              </Button>
            </div>
          </div>
           <div className="flex items-center mt-2">
             <Button
                variant="ghost"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                className="text-muted-foreground hover:text-primary"
                aria-label="Attach files"
              >
                <Paperclip className="h-4 w-4 mr-2" /> Attach Files
              </Button>
               <input
                type="file"
                ref={fileInputRef}
                multiple
                onChange={handleFileChange}
                className="hidden"
                accept="image/*,application/pdf,.txt,.md,.json" // Accept more types
              />
           </div>
        </div>
      </div>
      <div className="w-full md:w-[320px] lg:w-[380px] shrink-0 hidden md:block">
        <ActionButtonsPanel onAction={handleAction} isLoading={isLoading} currentUserMessage={inputMessage} profile={profile} />
      </div>

      <Dialog open={showNotesModal} onOpenChange={setShowNotesModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Additional Notes for {modalActionType === 'generateDelivery' ? 'Delivery' : 'Revision'}</DialogTitle>
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
                className="col-span-3 h-32 resize-none"
                placeholder={modalActionType === 'generateDelivery' ? "e.g., All final files attached, 2 concepts included..." : "e.g., Client requested color changes, updated logo attached..."}
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

    