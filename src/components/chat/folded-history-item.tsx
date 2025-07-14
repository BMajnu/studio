'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import type { ChatSessionMetadata } from '@/lib/types';
import { formatShortRelativeTime } from '@/lib/date-utils';

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
    'bg-blue-600',
    'bg-indigo-600',
    'bg-purple-600',
    'bg-pink-600',
    'bg-red-600',
    'bg-orange-600',
    'bg-yellow-600',
    'bg-green-600',
    'bg-teal-600',
    'bg-cyan-600',
    'bg-blue-700',
    'bg-indigo-700',
    'bg-purple-700',
    'bg-pink-700',
  ];

  const index = Math.abs(hash % colors.length);
  return colors[index];
};

export function FoldedHistoryItem({ session, isActive, onClick }: FoldedHistoryItemProps) {
  const colorClass = getColorFromString(session.id);
  const shortTime = formatShortRelativeTime(new Date(session.createdAt || session.lastMessageTimestamp));

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            onClick={() => onClick(session.id)}
            className={cn(
              'h-8 w-8 mx-auto my-1 rounded-full flex items-center justify-center cursor-pointer transition-all duration-200 text-[10px] font-semibold text-white shadow-sm hover:shadow-md',
              colorClass,
              isActive ? 'ring-2 ring-offset-2 ring-offset-background ring-primary' : '',
              'hover:scale-110'
            )}
          >
            {shortTime}
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