
'use client';

import { Button } from '@/components/ui/button';
import { BotMessageSquare, Edit3, MessageSquareText, Plane, RotateCcw } from 'lucide-react';
import type { UserProfile } from '@/lib/types';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from '@/lib/utils';

export type ActionType = 
  | 'processMessage'
  | 'analyzePlan'
  | 'suggestReplies'
  | 'suggestRepliesTranslated'
  | 'generateDelivery'
  | 'generateRevision';

interface ActionButton {
  id: ActionType;
  label: string;
  icon: React.ElementType;
  description: string;
}

const actionButtonsConfig: ActionButton[] = [
  { id: 'processMessage', label: 'Process Client Message', icon: BotMessageSquare, description: 'Full analysis, plan, Bengali translation, and English reply suggestions.' },
  { id: 'analyzePlan', label: 'Analyze & Plan Request', icon: Edit3, description: 'Detailed analysis, simplification, steps, and Bengali translation.' },
  { id: 'suggestReplies', label: 'Suggest Client Replies', icon: MessageSquareText, description: 'Two English reply suggestions tailored to your style.' },
  { id: 'suggestRepliesTranslated', label: 'Suggest Replies (Translated)', icon: MessageSquareText, description: 'Two English replies with Bengali translations.' },
  { id: 'generateDelivery', label: 'Generate Delivery Message', icon: Plane, description: 'Platform-ready delivery messages and follow-ups.' },
  { id: 'generateRevision', label: 'Generate Revision Message', icon: RotateCcw, description: 'Platform-ready revision messages and follow-ups.' },
];

interface ActionButtonsPanelProps {
  onAction: (action: ActionType) => void;
  isLoading: boolean;
  currentUserMessage: string;
  profile: UserProfile | null;
  currentAttachedFilesDataLength: number; // Kept for potential future use, but not primary for disable logic now
}

export function ActionButtonsPanel({ onAction, isLoading, currentUserMessage, profile, currentAttachedFilesDataLength }: ActionButtonsPanelProps) {
  
  const isActionDisabled = (_actionId: ActionType) => { // actionId parameter is kept for consistency, but not used in the new logic
    if (isLoading || !profile) {
      return true;
    }
    // All buttons are disabled if the current user message input is empty.
    if (!currentUserMessage.trim()) {
      return true;
    }
    // If message box has text, buttons are enabled (unless isLoading or !profile)
    return false;
  };

  return (
    <div className={cn(
        "flex flex-wrap items-center justify-end gap-1.5 md:gap-2", 
        (!profile || isLoading) && "opacity-60 pointer-events-none" 
      )}
    >
      {actionButtonsConfig.map((btn) => (
        <TooltipProvider key={btn.id} delayDuration={300}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="icon" 
                onClick={() => onAction(btn.id)}
                disabled={isActionDisabled(btn.id)}
                className="p-2 h-9 w-9 md:h-10 md:w-10" 
              >
                <btn.icon className="h-4 w-4 md:h-5 md:w-5" />
                <span className="sr-only">{btn.label}</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="top" align="center">
              <p className="font-semibold">{btn.label}</p>
              <p className="text-xs text-muted-foreground max-w-xs">{btn.description}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ))}
    </div>
  );
}

