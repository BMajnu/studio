
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
  onAction: (action: ActionType, notes?: string) => void;
  isLoading: boolean;
  currentUserMessage: string;
  profile: UserProfile | null;
}

export function ActionButtonsPanel({ onAction, isLoading, currentUserMessage, profile}: ActionButtonsPanelProps) {
  // For "Generate Delivery/Revision", message might not be needed if notes are provided via modal
  const isGeneralActionDisabled = (actionId: ActionType) => {
    if (actionId === 'generateDelivery' || actionId === 'generateRevision') {
      return isLoading || !profile; // Only disable if loading or no profile
    }
    // For other actions, disable if loading, no profile, or no message
    return isLoading || !profile || !currentUserMessage.trim();
  };

  return (
    <div className={cn(
        "flex flex-wrap items-center gap-1.5 py-2 mb-2 md:gap-2",
        (!profile || isLoading) && "opacity-60 pointer-events-none" // General disabled state for the whole panel
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
                disabled={isGeneralActionDisabled(btn.id)} // Individual button disabled state
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

