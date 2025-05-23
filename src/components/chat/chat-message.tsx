'use client';

import type { ChatMessage, MessageRole, ChatMessageContentPart, AttachedFile } from '@/lib/types';
import { Bot, User, AlertTriangle, Paperclip, FileText, Image as ImageIcon, RotateCcw, Loader2, Edit3, Send, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { CopyToClipboard, CopyableText, CopyableList } from '@/components/copy-to-clipboard';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import React, { useState, useEffect } from 'react';
import { Textarea } from '@/components/ui/textarea';

interface ChatMessageProps {
  message: ChatMessage;
  onRegenerate?: (requestDetails: ChatMessage['originalRequest'] & { messageIdToRegenerate: string }) => void;
  onConfirmEditAndResend?: (messageId: string, newContent: string, originalAttachments?: AttachedFile[]) => void;
}

function AttachedFileDisplay({ file }: { file: AttachedFile }) {
  return (
    <div className="group mt-1 p-3 border border-primary/10 rounded-xl glass-panel bg-background/40 backdrop-blur-md text-xs flex items-center gap-3 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 animate-fade-in">
      <div className="relative">
        <div className="absolute inset-0 rounded-full blur-sm bg-primary/20 opacity-50 group-hover:opacity-80 transition-opacity duration-300"></div>
        {file.type.startsWith('image/') && file.dataUri ? (
          <div className="relative z-10 flex items-center gap-2">
            <ImageIcon className="h-4 w-4 text-primary" />
            <div className="rounded-md overflow-hidden ring-1 ring-primary/30 shadow-sm">
              <Image src={file.dataUri} alt={file.name} width={40} height={40} className="rounded-md object-cover hover:scale-110 transition-transform duration-300"/>
            </div>
          </div>
        ) : file.type.startsWith('text/') ? (
          <FileText className="h-4 w-4 text-secondary relative z-10" />
        ) : (
          <Paperclip className="h-4 w-4 text-info relative z-10" />
        )}
      </div>
      <div className="flex flex-col">
        <span className="truncate font-medium text-sm" title={file.name}>{file.name}</span>
        {file.size && (
          <span className="text-muted-foreground/80 text-[10px] bg-muted/50 px-2 py-0.5 rounded-full w-fit mt-1 group-hover:bg-primary/10 transition-colors duration-300">
            {(file.size / 1024).toFixed(1)} KB
          </span>
        )}
      </div>
    </div>
  );
}

const getMessageText = (content: string | ChatMessageContentPart[] | undefined): string => {
  if (typeof content === 'string') {
    return content;
  }
  if (Array.isArray(content)) {
    // Attempt to get the first text part, or join all text parts.
    // This might need refinement based on how user messages are structured.
    // For user messages, content is often expected to be a simple string.
    const textParts = content.filter(part => part.type === 'text' && part.text);
    if (textParts.length > 0) {
      return textParts.map(part => part.text).join('\n');
    }
  }
  return ''; // Fallback for complex or empty content
};


function RenderContentPart({ part, index }: { part: ChatMessageContentPart; index: number }) {
  const animationDelay = `${index * 80}ms`;
  const commonClasses = "my-2 animate-slideUpSlightly w-full";

  switch (part.type) {
    case 'text':
      if (part.title) {
        return <CopyableText key={index} text={part.text} title={part.title} className={cn(commonClasses, "bg-card/80 backdrop-blur-sm border border-border rounded-lg shadow-md")} style={{ animationDelay }} />;
      }
      return <p key={index} className="whitespace-pre-wrap leading-relaxed w-full animate-slideUpSlightly" style={{ animationDelay }}>{part.text}</p>;
    
    case 'code':
      return <CopyToClipboard key={index} textToCopy={part.code || ''} title={part.title} language={part.language} className={cn(commonClasses, "shadow-lg hover:shadow-xl transition-all duration-300 w-full")} style={{ animationDelay }} />;
    
    case 'list':
      return (
        <div key={index} className={cn(commonClasses, "bg-muted/30 rounded-lg p-3 backdrop-blur-sm")} style={{ animationDelay }}>
          {part.title && <h4 className="font-semibold mb-2 text-base text-gradient">{part.title}</h4>}
          <CopyableList items={part.items} title={part.title ? undefined : 'List'} className="my-1 stagger-animation"/>
        </div>
      );
    
    case 'translation_group':
      return (
        <Card key={index} className={cn(commonClasses, "shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-background/95 to-muted/50 backdrop-blur-sm")} style={{ animationDelay }}>
          <CardHeader className="py-2 px-4">
            <CardTitle className="text-sm font-semibold text-gradient">{part.title || 'Translation Group'}</CardTitle>
          </CardHeader>
          <CardContent className="py-2 px-4 space-y-2">
            {part.bengali?.analysis && <CopyableText title="বিশ্লেষণ (Analysis in Bengali)" text={part.bengali.analysis} className="bg-primary/5 rounded-lg p-2" />}
            {part.bengali?.simplifiedRequest && <CopyableText title="সরলীকৃত অনুরোধ (Simplified Request in Bengali)" text={part.bengali.simplifiedRequest} className="bg-secondary/5 rounded-lg p-2" />}
            {part.bengali?.stepByStepApproach && <CopyableText title="ধাপে ধাপে পদ্ধতি (Step-by-Step Approach in Bengali)" text={part.bengali.stepByStepApproach} className="bg-accent/5 rounded-lg p-2" />}
          </CardContent>
        </Card>
      );

    case 'custom':
      return (
        <div key={index} className={cn(
          commonClasses, 
          "bg-gradient-to-br from-accent/10 to-secondary/10 rounded-lg p-4 backdrop-blur-sm border-2 border-accent/20 shadow-lg",
          "relative overflow-hidden"
        )} style={{ animationDelay }}>
          {/* Special decorative element for custom responses */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-accent to-secondary"></div>
          
          {part.title && (
            <h3 className="font-bold text-base mb-3 bg-clip-text text-transparent bg-gradient-to-r from-accent to-secondary flex items-center">
              <span className="mr-2 text-lg">✨</span> {part.title}
            </h3>
          )}
          
          {part.text && (
            <div className="whitespace-pre-wrap leading-relaxed pt-1">
              <CopyableText text={part.text} className="bg-background/50 p-3 rounded-lg border border-accent/10 shadow-inner" />
            </div>
          )}
        </div>
      );
      
    case 'suggested_replies':
      return (
        <div key={index} className={cn(commonClasses, "space-y-3")} style={{ animationDelay }}>
          {part.title && <h4 className="font-semibold mb-2 text-base text-gradient">{part.title}</h4>}
          
          {part.suggestions?.english && part.suggestions.english.length > 0 && (
            <div className="space-y-2">
              {part.suggestions.english.map((reply, i) => (
                <CopyToClipboard 
                  key={`eng-reply-${i}`} 
                  textToCopy={reply} 
                  title={`English Reply ${i + 1}`}
                  className="shadow-lg hover:shadow-xl transition-all duration-300 bg-primary/5 hover:bg-primary/10" 
                />
              ))}
            </div>
          )}
          
          {part.suggestions?.bengali && part.suggestions.bengali.length > 0 && (
            <div className="space-y-2 mt-3">
              {part.suggestions.bengali.map((reply, i) => (
                <CopyToClipboard 
                  key={`bng-reply-${i}`} 
                  textToCopy={reply} 
                  title={`Bengali Reply ${i + 1}`}
                  className="shadow-lg hover:shadow-xl transition-all duration-300 bg-secondary/5 hover:bg-secondary/10" 
                />
              ))}
            </div>
          )}
        </div>
      );
      
    default:
      return null;
  }
}

export function ChatMessageDisplay({ message, onRegenerate, onConfirmEditAndResend }: ChatMessageProps) {
  const [isEditingThisMessage, setIsEditingThisMessage] = useState(false);
  const [editedText, setEditedText] = useState('');
  
  // State for viewing edit history
  const [currentHistoryViewIndex, setCurrentHistoryViewIndex] = useState<number | null>(null);

  const isUser = message.role === 'user';
  const isAssistant = message.role === 'assistant';

  // Determine content and attachments to display based on edit history view
  const hasEditHistory = isUser && message.editHistory && message.editHistory.length > 0;
  const totalVersions = (message.editHistory?.length || 0) + 1; // +1 for the current version

  let displayContent: string | ChatMessageContentPart[];
  let displayAttachments: AttachedFile[] | undefined;

  if (isUser && hasEditHistory && currentHistoryViewIndex !== null) {
    const historyEntry = message.editHistory![currentHistoryViewIndex];
    displayContent = historyEntry.content;
    displayAttachments = historyEntry.attachedFiles;
  } else {
    displayContent = message.content;
    displayAttachments = message.attachedFiles;
  }

  // Convert displayContent to simple string for Textarea if user message
  const displayContentString = isUser ? getMessageText(displayContent) : '';

  useEffect(() => {
    if (isEditingThisMessage) {
      // When entering edit mode, populate with the currently viewed content
      setEditedText(displayContentString);
    }
  }, [isEditingThisMessage, displayContentString]);

  if (message.isLoading && !message.content) { // Skeleton for initial "Processing..."
    return (
      <div className={cn(
        "flex items-start w-full animate-slideUpSlightly",
        isUser ? "justify-end" : "justify-start"
      )}>
        <div className={cn(
          "relative flex flex-col gap-3 rounded-2xl p-5",
          "w-full", 
          isAssistant ? "bg-card/80 backdrop-blur-sm shadow-xl border border-primary/10" :
                       "bg-gradient-to-br from-primary/90 to-primary/80 text-primary-foreground shadow-xl",
          isUser ? 'rounded-tr-none' : 'rounded-tl-none'
        )}>
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 rounded-2xl blur-md opacity-40"></div>
          <Skeleton className="h-4 w-32 mb-1 bg-primary/20 rounded-full" />
          <Skeleton className="h-3 w-full bg-primary/10 rounded-full" />
          <Skeleton className="h-3 w-3/4 bg-primary/10 rounded-full" />
          <Skeleton className="h-3 w-1/2 bg-primary/10 rounded-full" />
        </div>
      </div>
    );
  }

  const handleRegenerateClick = () => {
    if (onRegenerate && message.originalRequest && message.id) {
      onRegenerate({ ...message.originalRequest, messageIdToRegenerate: message.id });
    }
  };

  const handleStartEdit = () => {
    setIsEditingThisMessage(true);
    // `editedText` is set by the useEffect hook above
  };

  const handleCancelEdit = () => {
    setIsEditingThisMessage(false);
  };

  const handleSaveAndSendEdited = () => {
    if (onConfirmEditAndResend) {
      // Note: We send the `message.id` of the original message being edited.
      // `onConfirmEditAndResend` in ChatPage.tsx will handle pushing the *current message.content* to editHistory
      // and then updating message.content with editedText.
      onConfirmEditAndResend(message.id, editedText, displayAttachments); // Pass current displayAttachments
    }
    setIsEditingThisMessage(false);
    setCurrentHistoryViewIndex(null); // Reset to view current version after edit
  };

  const handlePrevHistory = () => {
    if (!hasEditHistory) return;
    if (currentHistoryViewIndex === null) { // Viewing current, go to last edit
      setCurrentHistoryViewIndex((message.editHistory?.length || 0) - 1);
    } else if (currentHistoryViewIndex > 0) {
      setCurrentHistoryViewIndex(currentHistoryViewIndex - 1);
    }
  };

  const handleNextHistory = () => {
    if (!hasEditHistory) return;
    if (currentHistoryViewIndex !== null && currentHistoryViewIndex < (message.editHistory?.length || 0) - 1) {
      setCurrentHistoryViewIndex(currentHistoryViewIndex + 1);
    } else if (currentHistoryViewIndex !== null && currentHistoryViewIndex === (message.editHistory?.length || 0) - 1) {
      setCurrentHistoryViewIndex(null); // Go to current version
    }
  };

  const messageTime = new Date(
    isUser && hasEditHistory && currentHistoryViewIndex !== null
      ? message.editHistory![currentHistoryViewIndex].timestamp
      : message.timestamp
  ).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const contentToRender = (typeof displayContent === 'string' && isUser) // Simple text for user message display (non-edit mode)
    ? [{ type: 'text' as const, text: displayContent }]
    : (message.isLoading && typeof message.content === 'string' && message.content.startsWith('Processing...')) // AI "Processing..." state
    ? [{ type: 'text' as const, text: message.content }]
    : (Array.isArray(displayContent) ? displayContent : [{ type: 'text' as const, text: String(displayContent) }]); // AI content parts or fallback

  const currentDisplayVersionNumber = currentHistoryViewIndex === null ? totalVersions : currentHistoryViewIndex + 1;


  return (
    <div className={cn(
        "flex items-start w-full animate-slideUpSlightly hover:shadow-sm transition-all duration-300",
        isUser ? 'justify-end gap-0' : 'justify-start gap-0'
      )}
    >
      {/* Message Bubble */}
      <div
        className={cn(
          "relative flex flex-col gap-3 rounded-2xl p-5 shadow-lg text-sm transition-all duration-300",
          "w-full", 
          isAssistant ? 'bg-card/80 backdrop-blur-sm border border-primary/10 rounded-tl-none' :
                       'bg-gradient-to-br from-primary/90 to-primary/80 text-primary-foreground rounded-tr-none',
          message.isError ? 'border-destructive border-2' : isAssistant ? 'border-primary/10' : 'border-transparent'
        )}
      >
        <div className={cn(
          "absolute inset-0 rounded-2xl opacity-30",
          isAssistant ? "bg-gradient-to-br from-primary/5 to-secondary/5 blur-md" :
                       "bg-gradient-to-br from-primary-foreground/5 to-primary-foreground/10 blur-md"
        )}></div>
        <div className="flex justify-between items-center mb-2 relative z-10">
          <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-background/30 backdrop-blur-sm">{messageTime}</span>
          {message.isError && !isEditingThisMessage && (
            <div className="flex items-center gap-2 text-destructive bg-destructive/10 px-2 py-1 rounded-full animate-pulse-slow">
              <AlertTriangle className="h-4 w-4" />
              <span className="font-medium text-xs">Error processing request</span>
            </div>
          )}
        </div>

        {isEditingThisMessage && isUser ? (
          <div className="space-y-2 relative z-10">
            <Textarea
              value={editedText}
              onChange={(e) => setEditedText(e.target.value)}
              className="w-full resize-none min-h-[60px] bg-background/70 text-foreground focus-visible:ring-primary"
              rows={Math.max(2, editedText.split('\n').length)}
            />
            {/* Attachments could be displayed here if editing attachments is also desired */}
             {displayAttachments && displayAttachments.length > 0 && (
              <div className="mt-2 space-y-1">
                <p className="text-xs font-medium text-primary-foreground/80">Attachments (uneditable in this view):</p>
                {displayAttachments.map((file, index) => (
                  <div key={`${file.name}-${file.size || 0}-${index}`} className="text-xs text-primary-foreground/70 p-1 bg-primary-foreground/10 rounded-md truncate">
                    <Paperclip className="inline h-3 w-3 mr-1" /> {file.name}
                  </div>
                ))}
              </div>
            )}
            <div className="flex justify-end gap-2 mt-2">
              <Button variant="ghost" size="sm" onClick={handleCancelEdit} rounded="full" className="hover:bg-muted/50 text-primary-foreground/80 hover:text-primary-foreground">
                <X className="h-4 w-4 mr-1" /> Cancel
              </Button>
              <Button variant="default" size="sm" onClick={handleSaveAndSendEdited} rounded="full" className="bg-primary-foreground/20 hover:bg-primary-foreground/30 text-primary-foreground">
                <Send className="h-4 w-4 mr-1" /> Save & Send
              </Button>
            </div>
          </div>
        ) : message.isLoading ? (
            <div className="relative z-10 whitespace-pre-wrap animate-pulse-slow glass-panel bg-background/40 p-3 rounded-xl border border-primary/10 shadow-inner">
              <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin text-primary" />
                <p>{typeof message.content === 'string' ? message.content : 'Processing...'}</p>
              </div>
            </div>
          ) : (
            <div className="stagger-animation relative z-10">
              {contentToRender.map((part, index) =>
                <RenderContentPart part={part} index={index} key={`${message.id}-part-${index}`}/>
              )}
            </div>
          )
        }

        {displayAttachments && displayAttachments.length > 0 && !isEditingThisMessage && (
          <div className="mt-3 space-y-2 relative z-10">
            <div className={cn(
                "text-xs font-medium px-2 py-0.5 rounded-full bg-background/30 backdrop-blur-sm w-fit mb-2",
                 isUser && "bg-primary-foreground/20 text-primary-foreground/90"
              )}>
              <span className={cn(isUser ? "" : "bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary")}>
                {displayAttachments.length} {displayAttachments.length === 1 ? 'Attachment' : 'Attachments'}
              </span>
            </div>
            {displayAttachments.map((file, index) =>
              <div key={`${file.name}-${file.size || 0}-${index}`} className="animate-stagger" style={{ animationDelay: `${index * 100}ms` }}>
                <AttachedFileDisplay file={file} />
              </div>
            )}
          </div>
        )}

        {/* Edit History Navigation & Edit Button Area */}
        {!isEditingThisMessage && (
          <div className="mt-3 pt-2 border-t border-primary/10 flex justify-end items-center gap-3 animate-fade-in relative z-10" style={{ animationDelay: '0.5s' }}>
            {hasEditHistory && (
              <div className="flex items-center gap-1 mr-auto">
                <Button
                  variant="ghost"
                  size="icon"
                  className={cn("h-7 w-7", isUser ? "text-primary-foreground/70 hover:bg-primary-foreground/20 hover:text-primary-foreground" : "text-muted-foreground hover:bg-muted/50")}
                  onClick={handlePrevHistory}
                  disabled={currentHistoryViewIndex === 0}
                  title="Previous edit"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className={cn("text-xs", isUser ? "text-primary-foreground/80" : "text-muted-foreground")}>
                  {currentDisplayVersionNumber} / {totalVersions}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  className={cn("h-7 w-7", isUser ? "text-primary-foreground/70 hover:bg-primary-foreground/20 hover:text-primary-foreground" : "text-muted-foreground hover:bg-muted/50")}
                  onClick={handleNextHistory}
                  disabled={currentHistoryViewIndex === null}
                  title="Next edit / Current version"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            )}

            {isUser && onConfirmEditAndResend && (
              <Button
                variant="ghost"
                size="sm"
                rounded="full"
                glow
                animate
                onClick={handleStartEdit}
                className="text-xs backdrop-blur-sm border border-primary/10 shadow-sm hover:shadow-md hover:scale-105 text-primary-foreground/80 hover:text-primary-foreground hover:bg-primary-foreground/10 transition-all duration-300"
                title="Edit & Resend this message"
              >
                <div className="relative mr-1.5">
                  <div className="absolute inset-0 bg-primary-foreground/10 rounded-full blur-sm animate-pulse-slow opacity-70"></div>
                  <Edit3 className="h-3.5 w-3.5 relative z-10" />
                </div>
                Edit & Resend
              </Button>
            )}
            {isAssistant && message.canRegenerate && message.originalRequest && onRegenerate && (
              <Button
                variant="ghost"
                size="sm"
                rounded="full"
                glow
                animate
                onClick={handleRegenerateClick}
                className="text-xs backdrop-blur-sm border border-primary/10 shadow-sm hover:shadow-md hover:scale-105 hover:text-primary hover:bg-primary/10 transition-all duration-300"
                title="Regenerate response"
                disabled={message.isLoading}
              >
                <div className="relative mr-1.5">
                  <div className="absolute inset-0 bg-primary/10 rounded-full blur-sm animate-pulse-slow opacity-70"></div>
                  <RotateCcw className="h-3.5 w-3.5 relative z-10" />
                </div>
                Regenerate
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
