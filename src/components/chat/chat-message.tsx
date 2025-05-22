
'use client';

import type { ChatMessage, MessageRole, ChatMessageContentPart, AttachedFile, ActionType } from '@/lib/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Bot, User, AlertTriangle, Paperclip, FileText, Image as ImageIcon, RotateCcw, Loader2, Edit3, Send, X } from 'lucide-react';
import { CopyToClipboard, CopyableText, CopyableList } from '@/components/copy-to-clipboard';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import React, { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';

interface ChatMessageProps {
  message: ChatMessage;
  onRegenerate?: (requestDetails: ChatMessage['originalRequest'] & { messageIdToRegenerate: string }) => void;
  onConfirmEditAndResend?: (messageId: string, newContent: string, originalAttachments?: AttachedFile[]) => void;
}

function MessageAvatar({ role }: { role: MessageRole }) {
  // This component will only be rendered for user messages now.
  if (role !== 'user') return null;

  return (
    <div className="relative">
      <div className={cn(
        "absolute -inset-1 rounded-full blur-md animate-pulse-slow opacity-50",
        "bg-accent/30" // User avatar accent
      )} />
      <Avatar className={cn(
        "h-10 w-10 self-start shrink-0 shadow-lg transition-all duration-300 relative z-10",
        "ring-2 ring-accent/40 bg-gradient-to-br from-accent/10 to-background"
      )}>
        <AvatarImage
          src={`https://placehold.co/40x40.png?text=U`}
          data-ai-hint="person silhouette"
          alt={role}
          className="transition-all duration-300 hover:scale-110"
        />
        <AvatarFallback className={cn(
          "animate-pulse-slow",
          "text-accent bg-accent/10"
        )}>
          <User className="h-5 w-5" />
        </AvatarFallback>
      </Avatar>
    </div>
  );
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

const getSimpleTextContent = (content: string | ChatMessageContentPart[]): string => {
  if (typeof content === 'string') {
    return content;
  }
  if (Array.isArray(content)) {
    const textPart = content.find(part => part.type === 'text');
    return textPart?.text || '';
  }
  return '';
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
        <Card key={index} className={cn("my-4 glass-panel", commonClasses)} style={{ animationDelay }}>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg text-gradient">{part.title || 'Analysis & Plan'}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 stagger-animation">
            {part.english?.analysis && <CopyableText title="Analysis (English)" text={part.english.analysis} className="bg-primary/5 rounded-lg p-2" />}
            {part.english?.simplifiedRequest && <CopyableText title="Simplified Request (English)" text={part.english.simplifiedRequest} className="bg-secondary/5 rounded-lg p-2" />}
            {part.english?.stepByStepApproach && <CopyableText title="Step-by-Step Approach (English)" text={part.english.stepByStepApproach} className="bg-accent/5 rounded-lg p-2" />}

            { (part.english?.analysis || part.english?.simplifiedRequest || part.english?.stepByStepApproach) &&
              (part.bengali?.analysis || part.bengali?.simplifiedRequest || part.bengali?.stepByStepApproach) &&
              <Separator className="my-3 opacity-50" />
            }

            {part.bengali?.analysis && <CopyableText title="বিশ্লেষণ ও পরিকল্পনা (Bengali)" text={part.bengali.analysis} className="bg-primary/5 rounded-lg p-2" />}
          </CardContent>
        </Card>
      );
    default:
      return null;
  }
}

export function ChatMessageDisplay({ message, onRegenerate, onConfirmEditAndResend }: ChatMessageProps) {
  const [isEditingThisMessage, setIsEditingThisMessage] = useState(false);
  const [editedText, setEditedText] = useState(getSimpleTextContent(message.content));

  const isUser = message.role === 'user';
  const isAssistant = message.role === 'assistant';

  if (message.isLoading && !message.content) {
    return (
      <div className={cn(
        "flex items-start gap-4 p-4 md:p-5 w-full animate-slideUpSlightly",
        isUser ? "justify-end" : "justify-start" // AI messages align left by default
      )}>
        {/* No AI avatar for loading skeleton */}
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
        {isUser && <MessageAvatar role="user" />}
      </div>
    );
  }

  const handleRegenerateClick = () => {
    if (onRegenerate && message.originalRequest && message.id) {
      onRegenerate({ ...message.originalRequest, messageIdToRegenerate: message.id });
    }
  };

  const handleStartEdit = () => {
    setEditedText(getSimpleTextContent(message.content));
    setIsEditingThisMessage(true);
  };

  const handleCancelEdit = () => {
    setIsEditingThisMessage(false);
  };

  const handleSaveAndSendEdited = () => {
    if (onConfirmEditAndResend) {
      onConfirmEditAndResend(message.id, editedText, message.attachedFiles);
    }
    setIsEditingThisMessage(false);
  };

  const messageTime = new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const displayContent = message.isLoading && typeof message.content === 'string' && message.content.startsWith('Processing...')
    ? [{ type: 'text' as const, text: message.content }]
    : (typeof message.content === 'string' ? [{ type: 'text' as const, text: message.content }] : message.content);

  return (
    <div className={cn(
        "flex items-start p-4 md:p-5 w-full animate-slideUpSlightly hover:shadow-sm transition-all duration-300",
        isUser ? 'justify-end gap-3' : 'justify-start gap-0' // User messages justify right with gap for avatar
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
            <div className="flex justify-end gap-2 mt-2">
              <Button variant="ghost" size="sm" onClick={handleCancelEdit} rounded="full" className="hover:bg-muted/50">
                <X className="h-4 w-4 mr-1" /> Cancel
              </Button>
              <Button variant="default" size="sm" onClick={handleSaveAndSendEdited} rounded="full" className="bg-primary hover:bg-primary/90">
                <Send className="h-4 w-4 mr-1" /> Save & Send
              </Button>
            </div>
          </div>
        ) : message.isLoading && typeof message.content === 'string' && message.content.startsWith('Processing...') ? (
            <div className="relative z-10 whitespace-pre-wrap animate-pulse-slow glass-panel bg-background/40 p-3 rounded-xl border border-primary/10 shadow-inner">
              <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin text-primary" />
                <p>{message.content}</p>
              </div>
            </div>
          ) : (
            <div className="stagger-animation relative z-10">
              {displayContent.map((part, index) =>
                <RenderContentPart part={part} index={index} key={`${message.id}-part-${index}`}/>
              )}
            </div>
          )
        }

        {message.attachedFiles && message.attachedFiles.length > 0 && !isEditingThisMessage && (
          <div className="mt-3 space-y-2 relative z-10">
            <div className="text-xs font-medium px-2 py-0.5 rounded-full bg-background/30 backdrop-blur-sm w-fit mb-2">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
                {message.attachedFiles.length} {message.attachedFiles.length === 1 ? 'Attachment' : 'Attachments'}
              </span>
            </div>
            {message.attachedFiles.map((file, index) =>
              <div key={`${file.name}-${file.size || 0}-${index}`} className="animate-stagger" style={{ animationDelay: `${index * 100}ms` }}>
                <AttachedFileDisplay file={file} />
              </div>
            )}
          </div>
        )}

        {!isEditingThisMessage && (
          <div className="mt-3 pt-2 border-t border-primary/10 flex justify-end animate-fade-in relative z-10" style={{ animationDelay: '0.5s' }}>
            {isUser && onConfirmEditAndResend && (
              <Button
                variant="ghost"
                size="sm"
                rounded="full"
                glow
                animate
                onClick={handleStartEdit}
                className="text-xs backdrop-blur-sm border border-primary/10 shadow-sm hover:shadow-md hover:scale-105 hover:text-primary hover:bg-primary/10 transition-all duration-300"
                title="Edit & Resend this message"
              >
                <div className="relative mr-1.5">
                  <div className="absolute inset-0 bg-primary/10 rounded-full blur-sm animate-pulse-slow opacity-70"></div>
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
      </div> {/* End of Message Bubble */}

      {isUser && <MessageAvatar role={message.role} />}
    </div>
  );
}

    