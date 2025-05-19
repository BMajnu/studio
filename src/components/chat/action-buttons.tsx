
'use client';

import { Button } from '@/components/ui/button';
import { BotMessageSquare, Plane, RotateCcw, ListChecks, ClipboardList, Sparkles, MessageSquarePlus, Palette, Lightbulb, Terminal, SearchCheck, ClipboardSignature, Edit3 } from 'lucide-react'; // Added Edit3
import type { UserProfile } from '@/lib/types';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from '@/lib/utils';

export type ActionType =
  | 'processMessage'
  | 'analyzeRequirements'
  | 'generateEngagementPack' // Replaces generateBrief
  | 'generateDesignIdeas'
  | 'generateDesignPrompts'
  | 'checkMadeDesigns'
  | 'generateDeliveryTemplates' // For actual delivery messages
  | 'generateRevision'
  | 'generateEditingPrompts'; // Added new action type

interface ActionButtonConfig {
  id: ActionType;
  label: string;
  shortLabel: string;
  icon: React.ElementType;
  description: string;
  isPrimaryAction?: boolean;
}

interface DropdownActionConfig {
    id: string;
    label: string;
    shortLabel: string;
    icon: React.ElementType;
    description: string;
    subActions: ActionButtonConfig[];
}

export type AnyActionConfig = ActionButtonConfig | DropdownActionConfig;


const actionButtonsConfig: AnyActionConfig[] = [
  { id: 'processMessage', label: 'Process Client Message', shortLabel: 'Chat', icon: BotMessageSquare, description: 'Full analysis, plan, Bengali translation.', isPrimaryAction: true },
  { id: 'analyzeRequirements', label: 'Analyze Requirements', shortLabel: 'Requirements', icon: ListChecks, description: 'Detailed analysis of requirements, prioritization, Bangla translation, and design message.', isPrimaryAction: true },
  { id: 'generateEngagementPack', label: 'Generate Engagement Pack', shortLabel: 'Brief', icon: ClipboardList, description: 'Generates a personalized intro, job reply, budget/timeline/software ideas, and clarifying questions.', isPrimaryAction: true },
  {
    id: 'designActions',
    label: 'Design Tools',
    shortLabel: 'Design',
    icon: Palette,
    description: 'Access tools to generate design ideas and AI prompts.',
    subActions: [
      { id: 'generateDesignIdeas', label: 'Generate Design Ideas', shortLabel: 'Idea', icon: Lightbulb, description: 'Generates creative design ideas, web inspiration, and typography concepts.', isPrimaryAction: false },
      { id: 'generateDesignPrompts', label: 'Generate AI Prompts', shortLabel: 'Prompt', icon: Terminal, description: 'Converts design ideas into detailed prompts for AI image generation.', isPrimaryAction: false },
    ]
  },
  {
    id: 'deliveryActions',
    label: 'Delivery Tools',
    shortLabel: 'Delivery',
    icon: Plane,
    description: 'Tools for checking designs and generating delivery messages.',
    subActions: [
      { id: 'checkMadeDesigns', label: 'Check Designs', shortLabel: 'Check', icon: SearchCheck, description: 'AI review of your design for mistakes (Bangla). Requires attached design.', isPrimaryAction: false },
      { id: 'generateEditingPrompts', label: 'Editing Prompts', shortLabel: 'Edit', icon: Edit3, description: 'Generate prompts to edit a design based on prior feedback. Requires image attachment.', isPrimaryAction: false },
      { id: 'generateDeliveryTemplates', label: 'Delivery Templates', shortLabel: 'Templates', icon: ClipboardSignature, description: 'Generate Fiverr delivery messages and follow-ups.', isPrimaryAction: false },
    ]
  },
  { id: 'generateRevision', label: 'Generate Revision Message', shortLabel: 'Revision', icon: RotateCcw, description: 'Platform-ready revision messages and follow-ups.', isPrimaryAction: true },
];

interface ActionButtonsPanelProps {
  onAction: (action: ActionType) => void;
  isLoading: boolean;
  currentUserMessage: string;
  profile: UserProfile | null;
  currentAttachedFilesDataLength: number;
  isMobile: boolean;
}

export function ActionButtonsPanel({ onAction, isLoading, currentUserMessage, profile, currentAttachedFilesDataLength, isMobile }: ActionButtonsPanelProps) {

  const isActionDisabled = (actionId?: ActionType) => {
    if (isLoading || !profile) {
      return true;
    }
    // Specific logic for actions requiring attachments
    if ((actionId === 'checkMadeDesigns' || actionId === 'generateEditingPrompts') && currentAttachedFilesDataLength === 0) {
      return true;
    }
    // General disable if no message and no files for certain actions (can be adjusted)
    // if (!currentUserMessage && currentAttachedFilesDataLength === 0 &&
    //     (actionId === 'processMessage' || actionId === 'analyzeRequirements' || actionId === 'generateEngagementPack' || actionId === 'generateDesignIdeas' || actionId === 'generateDesignPrompts') ) {
    //   return true;
    // }
    return false; // Default to active unless loading or profile missing
  };

  return (
    <div className={cn(
        "flex flex-wrap items-center justify-end gap-1.5 md:gap-2",
        isLoading && "opacity-60 pointer-events-none"
      )}
    >
      {actionButtonsConfig.map((actionConfig) => {
        const baseButtonClasses = cn(
            "h-auto transition-all duration-150 ease-in-out hover:scale-105 active:scale-95 focus-visible:ring-primary",
            isMobile ? "p-2" : "px-2.5 py-1.5 md:px-3 md:py-2"
        );

        if ('isPrimaryAction' in actionConfig && actionConfig.isPrimaryAction) {
          const btn = actionConfig as ActionButtonConfig;
          return (
            <TooltipProvider key={btn.id} delayDuration={200}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onAction(btn.id)}
                    disabled={isActionDisabled(btn.id)}
                    className={baseButtonClasses}
                  >
                    <btn.icon className={cn("h-4 w-4 shrink-0", !isMobile && "mr-1 md:mr-1.5")} />
                    {!isMobile && <span className="text-xs md:text-sm whitespace-nowrap">{btn.shortLabel}</span>}
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top" align="center" className="bg-popover text-popover-foreground shadow-lg rounded-md p-2">
                  <p className="font-semibold">{btn.label}</p>
                  <p className="text-xs text-muted-foreground max-w-xs">{btn.description}</p>
                   { (btn.id === 'checkMadeDesigns' || btn.id === 'generateEditingPrompts') && currentAttachedFilesDataLength === 0 && (
                     <p className="text-xs text-destructive mt-1">Requires an image file to be attached.</p>
                   )}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          );
        } else {
          const dropdown = actionConfig as DropdownActionConfig;
          return (
            <DropdownMenu key={dropdown.id}>
              <TooltipProvider delayDuration={200}>
                <Tooltip>
                  <TooltipTrigger asChild>
                     <DropdownMenuTrigger asChild>
                        <Button
                            variant="outline"
                            size="sm"
                            disabled={isLoading || !profile}
                            className={baseButtonClasses}
                        >
                            <dropdown.icon className={cn("h-4 w-4 shrink-0", !isMobile && "mr-1 md:mr-1.5")} />
                            {!isMobile && <span className="text-xs md:text-sm whitespace-nowrap">{dropdown.shortLabel}</span>}
                        </Button>
                     </DropdownMenuTrigger>
                  </TooltipTrigger>
                  <TooltipContent side="top" align="center" className="bg-popover text-popover-foreground shadow-lg rounded-md p-2">
                    <p className="font-semibold">{dropdown.label}</p>
                    <p className="text-xs text-muted-foreground max-w-xs">{dropdown.description}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <DropdownMenuContent align="end" className="bg-popover border-border shadow-xl rounded-md">
                {dropdown.subActions.map(subAction => (
                  <DropdownMenuItem
                    key={subAction.id}
                    onClick={() => onAction(subAction.id)}
                    disabled={isActionDisabled(subAction.id)}
                    className="text-sm cursor-pointer hover:bg-accent focus:bg-accent data-[disabled]:opacity-50 data-[disabled]:pointer-events-none"
                  >
                    <subAction.icon className="h-4 w-4 mr-2 shrink-0" />
                    {subAction.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          );
        }
      })}
    </div>
  );
}
