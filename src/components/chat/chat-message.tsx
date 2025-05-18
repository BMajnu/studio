
'use client';

import type { ChatMessage, MessageRole, ChatMessageContentPart, AttachedFile, ActionType } from '@/lib/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Bot, User, AlertTriangle, Paperclip, FileText, Image as ImageIcon, RotateCcw } from 'lucide-react';
import { CopyToClipboard, CopyableText, CopyableList } from '@/components/copy-to-clipboard';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button'; // Import Button

interface ChatMessageProps {
  message: ChatMessage;
  onRegenerate?: (requestDetails: ChatMessage['originalRequest']) => void; // Added prop
}

function MessageAvatar({ role }: { role: MessageRole }) {
  return (
    <Avatar className="h-8 w-8 self-start shrink-0">
      <AvatarImage
        src={role === 'assistant' ? `https://placehold.co/40x40.png?text=AI` : `https://placehold.co/40x40.png?text=U`}
        alt={role}
        data-ai-hint={role === 'assistant' ? 'robot face' : 'person silhouette'}
      />
      <AvatarFallback>
        {role === 'user' ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
      </AvatarFallback>
    </Avatar>
  );
}

function AttachedFileDisplay({ file }: { file: AttachedFile }) {
  return (
    <div className="mt-1 p-2 border rounded-md bg-background/50 text-xs flex items-center gap-2 hover:shadow-md transition-shadow">
      {file.type.startsWith('image/') && file.dataUri ? (
        <>
          <ImageIcon className="h-4 w-4 text-muted-foreground" />
          <Image src={file.dataUri} alt={file.name} width={32} height={32} className="rounded-sm object-cover"/>
        </>
      ) : file.type.startsWith('text/') ? (
        <FileText className="h-4 w-4 text-muted-foreground" />
      ) : (
        <Paperclip className="h-4 w-4 text-muted-foreground" />
      )}
      <span className="truncate" title={file.name}>{file.name}</span>
      {file.size && <span className="text-muted-foreground/80">({(file.size / 1024).toFixed(1)} KB)</span>}
    </div>
  );
}

function RenderContentPart({ part, index }: { part: ChatMessageContentPart; index: number }) {
  const animationDelay = `${index * 50}ms`;
  const commonClasses = "my-2 animate-slideUpSlightly";

  switch (part.type) {
    case 'text':
      if (part.title) {
        return <CopyableText key={index} text={part.text} title={part.title} className={cn(commonClasses)} style={{ animationDelay }} />;
      }
      return <p key={index} className="whitespace-pre-wrap">{part.text}</p>;
    case 'code':
      return <CopyToClipboard key={index} textToCopy={part.code || ''} title={part.title} language={part.language} className={cn(commonClasses)} style={{ animationDelay }} />;
    case 'list':
      if (part.title && (part.title.toLowerCase().includes('suggested') || part.title.toLowerCase().includes('translations') || part.title.toLowerCase().includes('inspiration'))) {
        return (
          <div key={index} className={cn(commonClasses)} style={{ animationDelay }}>
            {part.title && <h4 className="font-semibold mb-1 text-base">{part.title}</h4>}
            {part.items && part.items.map((item, itemIndex) => (
              <CopyableText
                key={`${index}-item-${itemIndex}`}
                text={item}
                title={`${part.title && (part.title.startsWith('Suggest') || part.title.startsWith('Simulated')) ? 'Item' : 'Translation'} ${itemIndex + 1}`}
                className="my-1"
              />
            ))}
          </div>
        );
      }
      return (
        <div key={index} className={cn(commonClasses)} style={{ animationDelay }}>
          {part.title && <h4 className="font-semibold mb-1 text-base">{part.title}</h4>}
          <CopyableList items={part.items} title={part.title ? undefined : 'List'} className="my-1"/>
        </div>
      );
    case 'translation_group':
      return (
        <Card key={index} className={cn("my-4 bg-background/30", commonClasses)} style={{ animationDelay }}>
          <CardHeader>
            <CardTitle className="text-lg">{part.title || 'Analysis & Plan'}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {part.english?.analysis && <CopyableText title="Analysis (English)" text={part.english.analysis} />}
            {part.english?.simplifiedRequest && <CopyableText title="Simplified Request (English)" text={part.english.simplifiedRequest} />}
            {part.english?.stepByStepApproach && <CopyableText title="Step-by-Step Approach (English)" text={part.english.stepByStepApproach} />}

            { (part.english?.analysis || part.english?.simplifiedRequest || part.english?.stepByStepApproach) &&
              (part.bengali?.analysis || part.bengali?.simplifiedRequest || part.bengali?.stepByStepApproach) &&
              <Separator className="my-3" />
            }

            {part.bengali?.analysis && <CopyableText title=" বিশ্লেষণ (Bengali Analysis/Combined)" text={part.bengali.analysis} />}
            {part.bengali?.simplifiedRequest && <CopyableText title="সরলীকৃত অনুরোধ (Bengali Simplified Request)" text={part.bengali.simplifiedRequest} />}
            {part.bengali?.stepByStepApproach && <CopyableText title="ধাপে ধাপে পদ্ধতি (Bengali Step-by-Step)" text={part.bengali.stepByStepApproach} />}
          </CardContent>
        </Card>
      );
    default:
      return null;
  }
}


export function ChatMessageDisplay({ message, onRegenerate }: ChatMessageProps) {
  const isUser = message.role === 'user';
  const isAssistant = message.role === 'assistant';

  if (message.isLoading) {
    return (
      <div className={`flex items-start gap-3 p-3 md:p-4 ${isUser ? 'justify-end' : ''}`}>
        {!isUser && <MessageAvatar role="assistant" />}
        <div className={`flex flex-col gap-1 rounded-lg p-3 shadow-sm w-full ${isAssistant ? 'bg-secondary text-secondary-foreground' : 'bg-primary text-primary-foreground'}`}>
          <Skeleton className="h-4 w-32 mb-1" />
          <Skeleton className="h-3 w-24" />
        </div>
        {isUser && <MessageAvatar role="user" />}
      </div>
    );
  }

  const handleRegenerateClick = () => {
    if (onRegenerate && message.originalRequest) {
      onRegenerate(message.originalRequest);
    }
  };

  return (
    <div className={cn(
        `flex items-start gap-3 p-3 md:p-4 animate-slideUpSlightly`,
        isUser ? 'justify-end' : ''
      )}
    >
      {!isUser && <MessageAvatar role={message.role} />}
      <div
        className={cn(`flex flex-col gap-1.5 rounded-lg p-3 shadow-md text-sm w-full
          ${isAssistant ? 'bg-card text-card-foreground' : 'bg-primary text-primary-foreground'}
          ${message.isError ? 'border-destructive border-2' : 'border-transparent'}`
        )}
      >
        {message.isError && (
          <div className="flex items-center gap-2 text-destructive mb-2">
            <AlertTriangle className="h-4 w-4" />
            <span className="font-medium">Error processing request.</span>
          </div>
        )}
        {typeof message.content === 'string' ? (
          <p className="whitespace-pre-wrap">{message.content}</p>
        ) : (
          message.content.map((part, index) => <RenderContentPart part={part} index={index} key={`${message.id}-part-${index}`}/>)
        )}
        {message.attachedFiles && message.attachedFiles.length > 0 && (
          <div className="mt-2 space-y-1">
            {message.attachedFiles.map(file => <AttachedFileDisplay key={`${file.name}-${file.size || 0}`} file={file} />)}
          </div>
        )}
        {isAssistant && message.canRegenerate && message.originalRequest && onRegenerate && (
          <div className="mt-2 pt-2 border-t border-border/50 flex justify-end">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRegenerateClick}
              className="text-xs text-muted-foreground hover:text-primary hover:bg-primary/10"
              title="Regenerate response"
            >
              <RotateCcw className="h-3.5 w-3.5 mr-1.5" />
              Regenerate
            </Button>
          </div>
        )}
      </div>
      {isUser && <MessageAvatar role={message.role} />}
    </div>
  );
}
