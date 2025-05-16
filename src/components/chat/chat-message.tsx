'use client';

import type { ChatMessage, MessageRole, ChatMessageContentPart } from '@/lib/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Bot, User, AlertTriangle } from 'lucide-react';
import { CopyToClipboard, CopyableText, CopyableList } from '@/components/copy-to-clipboard';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

interface ChatMessageProps {
  message: ChatMessage;
}

function MessageAvatar({ role }: { role: MessageRole }) {
  return (
    <Avatar className="h-8 w-8 self-start">
      <AvatarImage src={role === 'assistant' ? '/bot-avatar.png' : '/user-avatar.png'} alt={role} data-ai-hint={role === 'assistant' ? 'robot face' : 'person silhouette'} />
      <AvatarFallback>
        {role === 'user' ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
      </AvatarFallback>
    </Avatar>
  );
}

function RenderContentPart({ part, index }: { part: ChatMessageContentPart; index: number }) {
  switch (part.type) {
    case 'text':
      return <p key={index} className="whitespace-pre-wrap">{part.text}</p>;
    case 'code':
      return <CopyToClipboard key={index} textToCopy={part.code || ''} title={part.title} language={part.language} />;
    case 'list':
      return (
        <div key={index} className="my-2">
          {part.title && <h4 className="font-semibold mb-1">{part.title}</h4>}
          <CopyableList items={part.items} title={part.title ? undefined : 'List'} />
        </div>
      );
    case 'translation_group':
      return (
        <Card key={index} className="my-4 bg-background/30">
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

            {part.bengali?.analysis && <CopyableText title=" বিশ্লেষণ (Bengali)" text={part.bengali.analysis} />}
            {part.bengali?.simplifiedRequest && <CopyableText title="সরলীকৃত অনুরোধ (Bengali)" text={part.bengali.simplifiedRequest} />}
            {part.bengali?.stepByStepApproach && <CopyableText title="ধাপে ধাপে পদ্ধতি (Bengali)" text={part.bengali.stepByStepApproach} />}
          </CardContent>
        </Card>
      );
    default:
      return null;
  }
}


export function ChatMessageDisplay({ message }: ChatMessageProps) {
  const isUser = message.role === 'user';
  const isAssistant = message.role === 'assistant';

  if (message.isLoading) {
    return (
      <div className={`flex items-start gap-3 p-4 ${isUser ? 'justify-end' : ''}`}>
        {!isUser && <MessageAvatar role="assistant" />}
        <div className={`flex flex-col gap-1 rounded-lg p-3 max-w-[85%] md:max-w-[70%] shadow-sm ${isAssistant ? 'bg-secondary text-secondary-foreground' : 'bg-primary text-primary-foreground'}`}>
          <Skeleton className="h-4 w-32 mb-1" />
          <Skeleton className="h-3 w-24" />
        </div>
        {isUser && <MessageAvatar role="user" />}
      </div>
    );
  }
  
  return (
    <div className={`flex items-start gap-3 p-4 ${isUser ? 'justify-end' : ''}`}>
      {!isUser && <MessageAvatar role={message.role} />}
      <div
        className={`flex flex-col gap-1.5 rounded-lg p-3 max-w-[85%] md:max-w-[70%] shadow-sm text-sm
          ${isAssistant ? 'bg-muted/80 text-foreground' : 'bg-primary text-primary-foreground'}
          ${message.isError ? 'border-destructive border' : ''}`}
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
        {/* <p className="text-xs text-muted-foreground self-end mt-1">
          {new Date(message.timestamp).toLocaleTimeString()}
        </p> */}
      </div>
      {isUser && <MessageAvatar role={message.role} />}
    </div>
  );
}
