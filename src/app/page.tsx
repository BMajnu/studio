
'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { Paperclip, Send, CornerDownLeft, Loader2, Bot } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ChatMessageDisplay } from '@/components/chat/chat-message';
import { ActionButtonsPanel, type ActionType } from '@/components/chat/action-buttons';
import { useToast } from '@/hooks/use-toast';
import { useUserProfile } from '@/lib/hooks/use-user-profile';
import type { ChatMessage, UserProfile, ChatMessageContentPart, ProcessedClientMessageOutput, PlatformMessagesOutput } from '@/lib/types';
import { processClientMessage, type ProcessClientMessageOutput, type ProcessClientMessageInput } from '@/ai/flows/process-client-message';
import { suggestClientReplies, type SuggestClientRepliesOutput, type SuggestClientRepliesInput } from '@/ai/flows/suggest-client-replies';
import { generatePlatformMessages, type GeneratePlatformMessagesOutput, type GeneratePlatformMessagesInput } from '@/ai/flows/generate-platform-messages';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';

export default function ChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { profile, isLoading: profileLoading } = useUserProfile();
  const chatAreaRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [showNotesModal, setShowNotesModal] = useState(false);
  const [modalActionType, setModalActionType] = useState<ActionType | null>(null);
  const [modalNotes, setModalNotes] = useState('');


  useEffect(() => {
    if (chatAreaRef.current) {
      chatAreaRef.current.scrollTop = chatAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const addMessage = useCallback((role: 'user' | 'assistant' | 'system', content: string | ChatMessageContentPart[], isLoading?: boolean, isError?: boolean) => {
    setMessages(prev => [...prev, { id: Date.now().toString(), role, content, timestamp: Date.now(), isLoading, isError }]);
  }, []);

  const updateLastMessage = useCallback((content: string | ChatMessageContentPart[], isLoading: boolean = false, isError: boolean = false) => {
    setMessages(prev => prev.map((msg, index) => 
      index === prev.length - 1 ? { ...msg, content, isLoading, isError, timestamp: Date.now() } : msg
    ));
  }, []);


  const handleSendMessage = async (messageText: string = inputMessage, actionType: ActionType = 'processMessage', notes?: string) => {
    const currentMessageText = messageText.trim();
    if (!currentMessageText && actionType !== 'generateDelivery' && actionType !== 'generateRevision') return;
    if (!profile) {
      toast({ title: "Profile not loaded", description: "Please wait for your profile to load or set it up in Settings.", variant: "destructive" });
      return;
    }

    addMessage('user', currentMessageText || `Triggered: ${actionType}`);
    addMessage('assistant', 'Processing...', true);
    setIsLoading(true);
    setInputMessage('');
    setSelectedFiles([]);
    if (fileInputRef.current) fileInputRef.current.value = '';


    try {
      let aiResponseContent: ChatMessageContentPart[] = [];

      if (actionType === 'processMessage') {
        const processInput: ProcessClientMessageInput = { clientMessage: currentMessageText, userName: profile.name, communicationStyleNotes: profile.communicationStyleNotes || '' };
        const processed = await processClientMessage(processInput);
        
        const repliesInput: SuggestClientRepliesInput = { clientMessage: currentMessageText, userName: profile.name, professionalTitle: profile.professionalTitle, communicationStyleNotes: profile.communicationStyleNotes, services: profile.services };
        const replies = await suggestClientReplies(repliesInput);

        aiResponseContent.push({
          type: 'translation_group',
          title: 'Client Request Analysis & Plan',
          english: {
            analysis: processed.analysis,
            simplifiedRequest: processed.simplifiedRequest,
            stepByStepApproach: processed.stepByStepApproach,
          },
          bengali: { // Assuming bengaliTranslation is a single string containing all parts. We need to parse it or ask AI to structure it.
                     // For now, let's put the whole string under analysis. This needs refinement based on actual AI output.
            analysis: processed.bengaliTranslation 
          }
        });
        if (replies.englishReplies && replies.englishReplies.length > 0) {
          aiResponseContent.push({ type: 'list', title: 'Suggested English Replies', items: replies.englishReplies });
        }
      } else if (actionType === 'analyzePlan') {
        const processInput: ProcessClientMessageInput = { clientMessage: currentMessageText, userName: profile.name, communicationStyleNotes: profile.communicationStyleNotes || '' };
        const processed = await processClientMessage(processInput);
        aiResponseContent.push({
          type: 'translation_group',
          title: 'Client Request Analysis & Plan',
          english: {
            analysis: processed.analysis,
            simplifiedRequest: processed.simplifiedRequest,
            stepByStepApproach: processed.stepByStepApproach,
          },
          bengali: { analysis: processed.bengaliTranslation }
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
      updateLastMessage("Sorry, I couldn't process that.", false, true);
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

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setSelectedFiles(Array.from(event.target.files));
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      if (!isLoading && inputMessage.trim()) {
        handleSendMessage(inputMessage, 'processMessage');
      }
    }
  };

  if (profileLoading) {
    return <div className="flex items-center justify-center h-screen"><Loader2 className="h-12 w-12 animate-spin text-primary" /> <p className="ml-4 text-lg">Loading Profile...</p></div>;
  }

  return (
    <div className="flex h-[calc(100vh-var(--header-height,0px))]"> {/* Adjust for potential header in AppLayout */}
      <div className="flex-1 flex flex-col bg-background overflow-hidden">
        <ScrollArea className="flex-1 p-1 md:p-4" ref={chatAreaRef}>
          <div className="space-y-2">
            {messages.map((msg) => (
              <ChatMessageDisplay key={msg.id} message={msg} />
            ))}
             {messages.length === 0 && (
                <div className="flex flex-col items-center justify-center h-full text-center p-8">
                    <Bot className="w-16 h-16 text-primary mb-4" />
                    <h2 className="text-2xl font-semibold mb-2">Welcome to DesAInR!</h2>
                    <p className="text-muted-foreground max-w-md">
                        I'm your AI-powered design assistant. Type a client message below, then use the action buttons on the right to get started.
                    </p>
                </div>
            )}
          </div>
        </ScrollArea>

        <div className="border-t p-4 bg-background">
          {selectedFiles.length > 0 && (
            <div className="mb-2 text-xs text-muted-foreground">
              Selected files: {selectedFiles.map(f => f.name).join(', ')}
              <Button variant="link" size="sm" className="ml-2 h-auto p-0" onClick={() => {setSelectedFiles([]); if(fileInputRef.current) fileInputRef.current.value = '';}}>Clear</Button>
            </div>
          )}
          <div className="flex items-start gap-2">
            <Textarea
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your client's message or your query here..."
              className="flex-1 resize-none min-h-[60px] max-h-[150px] rounded-lg shadow-sm focus-visible:ring-2 focus-visible:ring-primary"
              rows={Math.max(1, Math.min(5, inputMessage.split('\n').length))}
            />
            <div className="flex flex-col gap-2">
              <Button
                onClick={() => handleSendMessage(inputMessage, 'processMessage')}
                disabled={isLoading || !inputMessage.trim()}
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
                <Paperclip className="h-4 w-4 mr-2" /> Attach Files (display only)
              </Button>
               <input
                type="file"
                ref={fileInputRef}
                multiple
                onChange={handleFileChange}
                className="hidden"
              />
           </div>
        </div>
      </div>
      <div className="w-full md:w-[320px] lg:w-[380px] hidden md:block shrink-0">
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
