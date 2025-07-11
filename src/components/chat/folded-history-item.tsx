'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import type { ChatSessionMetadata } from '@/lib/types';

interface FoldedHistoryItemProps {
  session: ChatSessionMetadata;
  isActive: boolean;
  onClick: (sessionId: string) => void;
}

// A simple hashing function to get a color from a predefined palette
const getColorFromString = (str: string): string => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }

  const colors = [
    'bg-red-500',
    'bg-yellow-500',
    'bg-green-500',
    'bg-blue-500',
    'bg-indigo-500',
    'bg-purple-500',
    'bg-pink-500',
    'bg-red-400',
    'bg-yellow-400',
    'bg-green-400',
    'bg-blue-400',
    'bg-indigo-400',
    'bg-purple-400',
    'bg-pink-400',
  ];

  const index = Math.abs(hash % colors.length);
  return colors[index];
};

export function FoldedHistoryItem({ session, isActive, onClick }: FoldedHistoryItemProps) {
  const colorClass = getColorFromString(session.id);

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            onClick={() => onClick(session.id)}
            className={cn(
              'h-8 w-8 mx-auto my-2 rounded-full flex items-center justify-center cursor-pointer transition-all duration-200',
              isActive ? 'ring-2 ring-offset-2 ring-offset-background ring-primary' : '',
              'hover:scale-110'
            )}
          >
            <div className={cn('h-4 w-4 rounded-full', colorClass)} />
          </div>
        </TooltipTrigger>
        <TooltipContent side="right" className="flex flex-col gap-1">
          <p className="font-bold">{session.name || 'Untitled Chat'}</p>
          <p className="text-xs text-muted-foreground">{session.preview}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
} 