'use client';

import { Button } from '@/components/ui/button';
import { BotMessageSquare, Plane, RotateCcw, ListChecks, ClipboardList, Sparkles, MessageSquarePlus, Palette, Lightbulb, Terminal, SearchCheck, ClipboardSignature, Edit3, AlertTriangle, Search } from 'lucide-react';
import type { UserProfile } from '@/lib/types';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import { cn } from '@/lib/utils';

export type ActionType =
  | 'search'
  | 'processMessage'
  | 'analyzeRequirements'
  | 'generateEngagementPack'
  | 'generateDesignIdeas'
  | 'generateDesignPrompts'
  | 'checkMadeDesigns'
  | 'generateDeliveryTemplates'
  | 'generateRevision'
  | 'generateEditingPrompts';

interface ActionButtonConfig {
  id: ActionType;
  label: string;
  shortLabel: string;
  icon: React.ElementType;
  description: string;
  isPrimaryAction?: boolean; // True for top-level buttons, false for sub-actions
}

interface DropdownActionConfig {
    id: string; // Unique ID for the dropdown trigger itself
    label: string; // Full label for the dropdown trigger button's tooltip
    shortLabel: string; // Short label for the dropdown trigger button
    icon: React.ElementType; // Icon for the dropdown trigger button
    description: string; // Description for the dropdown trigger button's tooltip
    subActions: ActionButtonConfig[];
}

export type AnyActionConfig = ActionButtonConfig | DropdownActionConfig;


const actionButtonsConfig: AnyActionConfig[] = [
  { id: 'search', label: 'Search the Web', shortLabel: 'Search', icon: Search, description: 'Search the web for information using DuckDuckGo.', isPrimaryAction: true },
  { id: 'processMessage', label: 'Process Client Message', shortLabel: 'Chat', icon: BotMessageSquare, description: 'Full analysis, plan, Bengali translation.', isPrimaryAction: true },
  { id: 'analyzeRequirements', label: 'Analyze Requirements', shortLabel: 'Requirements', icon: ListChecks, description: 'Detailed analysis of requirements, prioritization, Bangla translation, and design message.', isPrimaryAction: true },
  { id: 'generateEngagementPack', label: 'Generate Engagement Pack', shortLabel: 'Brief', icon: ClipboardList, description: 'Generates a personalized intro, job reply, budget/timeline/software ideas, and clarifying questions.', isPrimaryAction: true },
  {
    id: 'designActions', // ID for the dropdown trigger
    label: 'Design Tools', // Tooltip for the trigger
    shortLabel: 'Design',  // Text on the trigger button
    icon: Palette,         // Icon for the trigger
    description: 'Access tools to generate design ideas and AI prompts.',
    subActions: [
      { id: 'generateDesignIdeas', label: 'Generate Design Ideas', shortLabel: 'Idea', icon: Lightbulb, description: 'Generates creative design ideas, web inspiration, and typography concepts.', isPrimaryAction: false },
      { id: 'generateDesignPrompts', label: 'Generate AI Prompts', shortLabel: 'Prompt', icon: Terminal, description: 'Converts design ideas into detailed prompts for AI image generation.', isPrimaryAction: false },
    ]
  },
  {
    id: 'deliveryActions', // ID for the dropdown trigger
    label: 'Delivery Tools', // Tooltip for the trigger
    shortLabel: 'Delivery',  // Text on the trigger button
    icon: Plane,             // Icon for the trigger
    description: 'Tools for checking designs and generating delivery messages.',
    subActions: [
      { id: 'checkMadeDesigns', label: 'Check Designs', shortLabel: 'Check', icon: SearchCheck, description: 'AI review of your design for mistakes (Bangla). Requires attached design.', isPrimaryAction: false },
      { id: 'generateEditingPrompts', label: 'Editing Prompts', shortLabel: 'Edit', icon: Edit3, description: 'Generate prompts to edit a design. Uses currently attached image if provided, or attempts to use the last relevant image from chat history.', isPrimaryAction: false },
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
  activeButton: ActionType | null; // Currently active button for visual feedback
  lastSelectedButton: ActionType | null; // Last selected button for logic
}

export function ActionButtonsPanel({ 
  onAction, 
  isLoading, 
  currentUserMessage, 
  profile, 
  currentAttachedFilesDataLength, 
  isMobile,
  activeButton,
  lastSelectedButton
}: ActionButtonsPanelProps) {

  const isActionDisabled = (actionId?: ActionType) => {
    if (isLoading || !profile) {
      return true;
    }
    // "Check Designs" requires an image to be attached *before* clicking
    if (actionId === 'checkMadeDesigns' && currentAttachedFilesDataLength === 0) {
      return true;
    }
    // "Editing Prompts" no longer has this client-side check, the flow will handle it.
    return false;
  };

  // Helper function to determine if button should appear selected
  const isButtonSelected = (buttonId: string): boolean => {
    /**
     * Button Selection Visual Logic:
     * ------------------------------
     * This determines which buttons appear visually selected in the UI, based on:
     * 
     * 1. Never auto-select the "Chat" button:
     *    - Only highlight it when explicitly selected
     * 
     * 2. Active button feedback (immediate visual response):
     *    - When a button is clicked, it briefly highlights (activeButton state)
     *    - This provides immediate visual feedback to the user's action
     * 
     * 3. Parent dropdown highlighting:
     *    - If any child action is the last selected action, highlight the parent dropdown
     *    - This helps users understand which category their last action came from
     * 
     * 4. Persistent selection state:
     *    - The lastSelectedButton state determines which button appears selected 
     *    - This visually indicates which action will be used for regeneration or edit
     */

    // Don't highlight processMessage/Chat by default - only when explicitly selected
    if (buttonId === 'processMessage' && !activeButton && !lastSelectedButton) {
      return false;
    }
    
    // Show as selected based on activeButton state (for immediate visual feedback)
    if (activeButton === buttonId) {
      return true;
    }
    
    // Dropdown containers are selected if any of their children are the lastSelectedButton
    if (buttonId === 'designActions' && 
        (lastSelectedButton === 'generateDesignIdeas' || lastSelectedButton === 'generateDesignPrompts')) {
      return true;
    }
    
    if (buttonId === 'deliveryActions' && 
        (lastSelectedButton === 'checkMadeDesigns' || 
         lastSelectedButton === 'generateEditingPrompts' || 
         lastSelectedButton === 'generateDeliveryTemplates')) {
      return true;
    }
    
    // Regular buttons are selected if they are the lastSelectedButton
    return buttonId === lastSelectedButton;
  };

  return (
    <div className={cn(
        "flex flex-wrap items-center justify-end gap-2 md:gap-3 stagger-animation",
        isLoading && "opacity-60 pointer-events-none"
      )}
    >
      {actionButtonsConfig.map((actionConfig) => {
        const baseButtonClasses = cn(
            "h-auto transition-all duration-300 ease-in-out hover:scale-105 active:scale-95 focus-visible:ring-primary rounded-full shadow-md btn-glow",
            isMobile ? "p-2" : "px-3 py-1.5 md:px-3.5 md:py-2"
        );

        if ('isPrimaryAction' in actionConfig && actionConfig.isPrimaryAction) {
          const btn = actionConfig as ActionButtonConfig;
          const isSelected = isButtonSelected(btn.id);
          
          return (
            <TooltipProvider key={btn.id} delayDuration={200}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant={isSelected ? "secondary" : "outline"}
                    size="sm"
                    onClick={() => onAction(btn.id)}
                    disabled={isActionDisabled(btn.id)}
                    className={cn(
                      baseButtonClasses,
                      // Apply highlight styles based on selection state
                      isSelected ? "bg-primary text-primary-foreground hover:bg-primary-light ring-2 ring-primary/30" : "",
                      !isSelected && btn.id === 'analyzeRequirements' ? "hover:border-secondary hover:text-secondary" : "",
                      !isSelected && btn.id === 'generateEngagementPack' ? "hover:border-accent hover:text-accent" : "",
                      !isSelected && btn.id === 'generateRevision' ? "hover:border-info hover:text-info" : ""
                    )}
                  >
                    <btn.icon className={cn("h-4 w-4 shrink-0", !isMobile && "mr-1.5 md:mr-2")} />
                    {!isMobile && <span className="text-xs md:text-sm font-medium whitespace-nowrap">{btn.shortLabel}</span>}
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top" align="center" className="glass-panel text-foreground shadow-xl rounded-lg p-3 animate-fade-in border border-primary/10">
                  <p className="font-semibold text-gradient">{btn.label}</p>
                  <p className="text-xs text-foreground/80 max-w-xs mt-1">{btn.description}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          );
        } else {
          const dropdown = actionConfig as DropdownActionConfig;
          const isDropdownSelected = isButtonSelected(dropdown.id);
          
          return (
            <DropdownMenu key={dropdown.id}>
              <TooltipProvider delayDuration={200}>
                <Tooltip>
                  <TooltipTrigger asChild>
                     <DropdownMenuTrigger asChild>
                        <Button
                            variant={isDropdownSelected ? "secondary" : "outline"}
                            size="sm"
                            disabled={isLoading || !profile} // General disable for dropdown trigger
                            className={cn(
                              baseButtonClasses,
                              isDropdownSelected ? "bg-primary/90 text-primary-foreground hover:bg-primary-light ring-2 ring-primary/30" : "",
                              !isDropdownSelected && dropdown.id === 'designActions' ? "hover:border-success hover:text-success" : "",
                              !isDropdownSelected && dropdown.id === 'deliveryActions' ? "hover:border-warning hover:text-warning" : ""
                            )}
                        >
                            <dropdown.icon className={cn("h-4 w-4 shrink-0", !isMobile && "mr-1.5 md:mr-2")} />
                            {!isMobile && <span className="text-xs md:text-sm font-medium whitespace-nowrap">{dropdown.shortLabel}</span>}
                        </Button>
                     </DropdownMenuTrigger>
                  </TooltipTrigger>
                  <TooltipContent side="top" align="center" className="glass-panel text-foreground shadow-xl rounded-lg p-3 animate-fade-in border border-primary/10">
                    <p className="font-semibold text-gradient">{dropdown.label}</p>
                    <p className="text-xs text-foreground/80 max-w-xs mt-1">{dropdown.description}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <DropdownMenuContent align="end" className="glass-panel border-primary/10 shadow-2xl rounded-lg animate-fade-in">
                <DropdownMenuLabel className="text-sm px-3 py-2 text-gradient font-semibold">{dropdown.label}</DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-primary/10" />
                {dropdown.subActions.map(subAction => {
                  const isSubActionSelected = lastSelectedButton === subAction.id;
                  
                  return (
                  <DropdownMenuItem
                    key={subAction.id}
                    onClick={() => onAction(subAction.id)}
                    disabled={isActionDisabled(subAction.id)}
                      className={cn(
                        "text-sm cursor-pointer hover:bg-primary/10 focus:bg-primary/10 data-[disabled]:opacity-50 data-[disabled]:pointer-events-none flex items-center gap-2 px-3 py-2 transition-all duration-200 rounded-md mx-1 my-0.5",
                        isSubActionSelected && "bg-primary/20"
                      )}
                  >
                    <div className={cn(
                      "p-1.5 rounded-full",
                      dropdown.id === 'designActions' ? "bg-success/10 text-success" : "bg-warning/10 text-warning"
                    )}>
                      <subAction.icon className="h-3.5 w-3.5 shrink-0" />
                    </div>
                    <span>{subAction.label}</span>
                     { (subAction.id === 'checkMadeDesigns' && currentAttachedFilesDataLength === 0) && (
                       <span className="ml-auto text-xs text-destructive bg-destructive/10 px-1.5 py-0.5 rounded-full">
                         Needs Image
                       </span>
                     )}
                  </DropdownMenuItem>
                  );
                })}
              </DropdownMenuContent>
            </DropdownMenu>
          );
        }
      })}
    </div>
  );
}
