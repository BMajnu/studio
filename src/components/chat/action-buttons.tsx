'use client';

import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { BotMessageSquare, Edit3, MessageSquareText, Plane, RotateCcw, HelpCircle } from 'lucide-react';
import { FeaturesGuideModal } from '@/components/features-guide-modal';
import type { UserProfile } from '@/lib/types';

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

export function ActionButtonsPanel({ onAction, isLoading, currentUserMessage, profile }: ActionButtonsPanelProps) {
  const isDisabled = isLoading || !currentUserMessage.trim() || !profile;

  return (
    <div className="h-full flex flex-col border-l bg-card/30 p-1 md:p-4">
      <h3 className="text-lg font-semibold mb-4 px-2 md:px-0">Actions</h3>
      <ScrollArea className="flex-grow">
        <div className="space-y-3 pr-2">
          {actionButtonsConfig.map((btn) => (
            <Button
              key={btn.id}
              variant="outline"
              className="w-full justify-start text-left h-auto py-2.5"
              onClick={() => onAction(btn.id)}
              disabled={isDisabled && btn.id !== 'processMessage'} // processMessage can be default if no text is typed
              title={btn.description}
            >
              <btn.icon className="mr-3 h-5 w-5 flex-shrink-0" />
              <div className="flex flex-col">
                <span className="font-medium leading-tight">{btn.label}</span>
                <span className="text-xs text-muted-foreground hidden md:block">{btn.description}</span>
              </div>
            </Button>
          ))}
           <div className="pt-2">
            <FeaturesGuideModal
                triggerButton={
                    <Button variant="ghost" className="w-full justify-start">
                        <HelpCircle className="mr-3 h-5 w-5 flex-shrink-0" /> App Features Guide
                    </Button>
                }
            />
           </div>
        </div>
      </ScrollArea>
    </div>
  );
}
