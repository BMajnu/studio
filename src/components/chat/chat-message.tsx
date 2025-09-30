'use client';

import type { ChatMessage, MessageRole, ChatMessageContentPart, AttachedFile, ActionType } from '@/lib/types';
import { Bot, User, AlertTriangle, Paperclip, FileText, Image as ImageIcon, RotateCcw, Loader2, Edit3, Send, X, ChevronLeft, ChevronRight, CircleCheck, Copy, FolderOpen, Plus, PlusCircle, Zap, Check, SearchCheck, ClipboardSignature, ClipboardList, Palette, Lightbulb, Terminal, Search, Plane, Settings, Sparkles, FileImage, FileSpreadsheet, Trophy, ChevronDown } from 'lucide-react';
import { TopDesignsResults } from './top-designs-results';
import { CopyToClipboard, CopyableText, CopyableList } from '@/components/copy-to-clipboard';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getActionTypeLabel } from '@/lib/utils';
import { BilingualSplitView } from './bilingual-split-view';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuPortal,
  DropdownMenuSubContent,
} from "@/components/ui/dropdown-menu";
import { Badge } from '@/components/ui/badge';
import { ActionButtonsPanel } from '@/components/chat/action-buttons';
import type { UserProfile } from '@/lib/types';
import { DesignPromptsTabs } from './design-prompts-tabs';
import { PromptToReplicate } from './prompt-to-replicate';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { AVAILABLE_MODELS } from '@/lib/constants';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { loadUploadedAttachments } from '@/lib/storage/uploaded-attachments-local';
import { loadAttachmentsIndexedDB } from '@/lib/storage/uploaded-attachments-indexeddb';
import { DEFAULT_USER_ID } from '@/lib/constants';

interface ChatMessageProps {
  message: ChatMessage;
  onRegenerate?: (requestDetails: ChatMessage['originalRequest'] & { messageIdToRegenerate: string }) => void;
  onConfirmEditAndResend?: (messageId: string, newContent: string, originalAttachments?: AttachedFile[], newActionType?: ActionType) => void;
  onOpenCustomSenseEditor?: (message: ChatMessage) => void;
  onStopRegeneration?: (messageId: string) => void;
  onPerformAction?: (originalRequest: ChatMessage['originalRequest'], actionType: ActionType) => void;
  onRegenerateCustomSense?: (message: ChatMessage) => void;
  isMobile: boolean;
  profile: UserProfile | null;
  activeActionButton: ActionType | null;
  lastSelectedActionButton: ActionType | null;
  isLoading: boolean;
  currentUserMessage: string;
  currentAttachedFilesDataLength: number;
  searchHighlightTerm?: string;
  currentModelId: string;
  setCurrentModelIdAction: (modelId: string) => void;
}

function AttachedFileDisplay({ file, userId }: { file: AttachedFile, userId?: string }) {
  const [src, setSrc] = useState<string | undefined>(file.dataUri);
  useEffect(() => {
    if (!src && file.attachmentId) {
      (async () => {
        try {
          const idb = await loadAttachmentsIndexedDB(userId || DEFAULT_USER_ID);
          let att = idb.find(a => a.id === file.attachmentId);
          if (!att) {
            const local = loadUploadedAttachments(userId || DEFAULT_USER_ID);
            att = local.find(a => a.id === file.attachmentId);
          }
          if (att?.dataUri) setSrc(att.dataUri);
        } catch (e) {
          console.error('Attachment load error', e);
        }
      })();
    }
  }, [file, src, userId]);
  const displaySrc = src;
  return (
    <div className="group relative aspect-square overflow-hidden rounded-md border border-primary/10 hover:border-primary/30 transition-all duration-300 animate-fade-in">
      {file.type?.startsWith('image/') && displaySrc ? (
        <>
          <Image
            src={displaySrc}
            alt={file.name}
            fill
            className="object-cover object-center group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </>
      ) : file.type?.startsWith('text/') ? (
        <div className="flex items-center justify-center h-full bg-muted/20">
          <FileText className="h-5 w-5 text-secondary" />
        </div>
      ) : (
        <div className="flex items-center justify-center h-full bg-muted/20">
          <Paperclip className="h-5 w-5 text-info" />
        </div>
      )}
      <div className="absolute bottom-0 left-0 right-0 p-1 text-[8px] bg-background/80 backdrop-blur-sm truncate opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex justify-between items-center">
        <span className="truncate">{file.name.length > 12 ? file.name.substring(0, 10) + '...' : file.name}</span>
        {file.size && (
          <span className="text-muted-foreground/80 text-[7px] bg-muted/50 px-1 py-0.5 rounded-full shrink-0 ml-1">
            {(file.size / 1024).toFixed(0)} KB
          </span>
        )}
      </div>
    </div>
  );
}

const getMessageText = (content: string | ChatMessageContentPart[] | undefined): string => {
  if (typeof content === 'string') {
    return content;
  }
  if (Array.isArray(content)) {
    // Use type narrowing to safely access properties
    const textParts = content.filter(part => {
      return part.type === 'text' && 'text' in part;
    });
    
    if (textParts.length > 0) {
      return textParts.map(part => {
        // Now TypeScript knows these parts have 'text' property
        return (part as { type: 'text', text: string }).text;
      }).join('\n');
    }
  }
  return ''; // Fallback for complex or empty content
};

const highlightText = (text: string | null | undefined, term: string | null | undefined): React.ReactNode => {
  if (!term || !text) return text;

  // Escape special characters in the search term for regex
  const safeTerm = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(`(${safeTerm})`, 'gi');
  const parts = text.split(regex);

  return (
    <>
      {parts.map((part, i) =>
        regex.test(part) ? (
          <mark 
            key={i} 
            className="search-highlight" 
            data-search-highlight
          >
            {part}
          </mark>
        ) : (
          part
        )
      )}
    </>
  );
};

// Add this helper function for Markdown processing
const processMarkdown = (text: string) => {
  // Process bold text (surrounded by **)
  return text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
};

// NEW: Helper to collapse multiple blank lines into a single line
const removeExtraBlankLines = (text: string) => text.replace(/\n{2,}/g, '\n');

function RenderContentPart({ part, index, searchHighlightTerm, onSuggestionClick }: { part: ChatMessageContentPart; index: number, searchHighlightTerm?: string, onSuggestionClick?: (suggestion: string, lang: 'en' | 'bn') => void }) {
  const animationDelay = `${index * 80}ms`;
  const commonClasses = "animate-slideUpAndFade rounded-lg w-full mb-3";
  const { toast } = useToast();
  
  const [copyState, setCopyState] = useState<{[key: string]: boolean}>({});
  
  const handleCopyToClipboard = useCallback((text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopyState((prev: Record<string, boolean>) => ({ ...prev, [id]: true }));
    toast({
      title: "Copied to clipboard",
      description: "The prompt has been copied to your clipboard.",
    });
    
    setTimeout(() => {
      setCopyState((prev: Record<string, boolean>) => ({ ...prev, [id]: false }));
    }, 2000);
  }, [toast]);

  switch (part.type) {
    case 'text':
      if (part.title) {
        // Add appropriate emoji based on the title
        let titleEmoji = '📝'; // Default emoji
        let gradientClass = '';
        
        // Customize emoji and styling based on section type
        if (part.title.includes('Main Requirements Analysis') || part.title.includes('Requirements Analysis')) {
          return null;
        } else if (part.title.includes('Detailed Requirements (English)')) {
          titleEmoji = '📋';
          gradientClass = 'bg-gradient-to-r from-green-500 to-teal-600';
        } else if (part.title.includes('Detailed Requirements (Bangla)')) {
          titleEmoji = '🌏';
          gradientClass = 'bg-gradient-to-r from-purple-500 to-pink-600';
        } else if (part.title.includes('Design Message')) {
          titleEmoji = '💬';
          gradientClass = 'bg-gradient-to-r from-amber-500 to-orange-600';
        } else if (part.title.includes('Brief') || part.title.includes('Reply') || part.title.includes('Suggestions')) {
          titleEmoji = '✨';
          gradientClass = 'bg-gradient-to-r from-violet-500 to-fuchsia-600';
        } else if (part.title.includes('Clarifying Questions') || part.title.includes('Question')) {
          titleEmoji = '❓';
          gradientClass = 'bg-gradient-to-r from-cyan-500 to-blue-600';
        } else if (part.title.includes('Personal Information')) {
          titleEmoji = '👋';
          gradientClass = 'bg-gradient-to-r from-teal-500 to-emerald-600';
        } else if (part.title.includes('Timeline') || part.title.includes('Budget')) {
          titleEmoji = '⏱️';
          gradientClass = 'bg-gradient-to-r from-blue-500 to-cyan-600';
        } else if (part.title.includes('Software')) {
          titleEmoji = '🛠️';
          gradientClass = 'bg-gradient-to-r from-gray-700 to-gray-900';
        } else if (part.title.includes('Typography Design') || part.title.includes('Typography Idea')) {
          titleEmoji = '🔤';
          gradientClass = 'bg-gradient-to-r from-indigo-600 to-blue-700';
        } else if (part.title.includes('Creative Design') || part.title.includes('Design Idea')) {
          titleEmoji = '🎨';
          gradientClass = 'bg-gradient-to-r from-rose-500 to-pink-600';
        } else if (part.title.includes('Web Inspiration') || part.title.includes('Web Design')) {
          titleEmoji = '🌐';
          gradientClass = 'bg-gradient-to-r from-sky-500 to-blue-600';
        } else if (part.title.includes('Core Text') || part.title.includes('Saying')) {
          titleEmoji = '📢';
          gradientClass = 'bg-gradient-to-r from-amber-600 to-orange-700';
        } else if (part.title.includes('Design Tools') || part.title.includes('Generate')) {
          titleEmoji = '⚒️';
          gradientClass = 'bg-gradient-to-r from-slate-700 to-slate-900';
        } else if (part.title.includes('Idea')) {
          titleEmoji = '💡';
          gradientClass = 'bg-gradient-to-r from-yellow-500 to-amber-600';
        }
        
        return (
          <div key={index} className={cn(commonClasses, "bg-card/80 backdrop-blur-sm border border-border rounded-lg shadow-md overflow-hidden")} style={{ animationDelay }}>
            <div className={cn("px-4 py-3 border-b flex items-center", gradientClass ? gradientClass : "bg-primary/10")}>
              <span className="mr-2 text-lg">{titleEmoji}</span>
              <h4 
                className={cn("font-semibold text-base", gradientClass ? "text-white" : "text-foreground")}
              >
                {highlightText(part.title, searchHighlightTerm)}
              </h4>
            </div>
            {part.text && (
              <div className="px-4 py-3">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    ul: ({ node, ...props }: any) => <ul className="list-disc pl-5 space-y-[3px]" {...props} />,
                    ol: ({ node, ...props }: any) => <ol className="list-decimal pl-5 space-y-[3px]" {...props} />,
                  }}
                  className="prose prose-sm dark:prose-invert max-w-none space-y-[3px] leading-snug prose-p:my-0 prose-li:my-0 prose-ul:my-0 prose-ol:my-0"
                >
                  {part.text}
                </ReactMarkdown>
              </div>
            )}
          </div>
        );
      }
      return (
        <div 
          key={index} 
          className="w-full animate-slideUpSlightly" 
          style={{ animationDelay }}
        >
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              ul: ({ node, ...props }: any) => <ul className="list-disc pl-5 space-y-[3px]" {...props} />,
              ol: ({ node, ...props }: any) => <ol className="list-decimal pl-5 space-y-[3px]" {...props} />,
            }}
            className="prose prose-sm dark:prose-invert max-w-none text-foreground space-y-[3px] leading-snug prose-p:my-0 prose-li:my-0 prose-ul:my-0 prose-ol:my-0"
          >
            {part.text}
          </ReactMarkdown>
        </div>
      );
    
    case 'code':
      return <CopyToClipboard key={index} textToCopy={part.code || ''} title={part.title} language={part.language} className={cn(commonClasses, "shadow-lg hover:shadow-xl transition-all duration-300 w-full")} style={{ animationDelay }} />;
    
    case 'list':
      return (
        <div key={index} className={cn(commonClasses, "bg-muted/30 rounded-lg p-3 backdrop-blur-sm")} style={{ animationDelay }}>
          {part.title && <h4 className="font-semibold mb-2 text-base text-gradient flex items-center">
            <span className="mr-2 text-lg">📋</span> {part.title}
          </h4>}
          <CopyableList items={part.items} title={part.title ? undefined : 'List'} className="my-1 stagger-animation"/>
        </div>
      );
    
    case 'bilingual_text_split':
      return (
        <div
          key={index}
          className={cn(
            commonClasses,
            "bg-card/80 backdrop-blur-sm border border-border rounded-lg shadow-md overflow-hidden"
          )}
          style={{ animationDelay }}
        >
          {/* Optional header for bilingual split cards */}
          {part.title && (
            <div className="px-4 pt-4 pb-0 bg-transparent">
              <h3 className="text-xl font-semibold text-center text-purple-400 -mb-1">
                {part.title}
              </h3>
            </div>
          )}

          <div className="p-4">
            <div className="flex flex-row gap-1">
              <ScrollArea className="flex-1 h-full p-4 rounded-md bg-card/50 backdrop-blur-sm border border-border shadow-sm hover:shadow-md transition-shadow">
                <div className="mb-2 text-sm uppercase font-semibold text-muted-foreground">English</div>
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    ul: ({ node, ...props }: any) => <ul className="list-disc pl-5 space-y-[3px]" {...props} />,
                    ol: ({ node, ...props }: any) => <ol className="list-decimal pl-5 space-y-[3px]" {...props} />,
                  }}
                  className="prose prose-sm dark:prose-invert max-w-none text-foreground space-y-[3px] leading-snug prose-p:my-0 prose-li:my-0 prose-ul:my-0 prose-ol:my-0 prose-headings:my-2"
                >
                  {part.english}
                </ReactMarkdown>
              </ScrollArea>
              <div className="w-px bg-border mx-2" />
              <ScrollArea className="flex-1 h-full p-4 rounded-md bg-card/50 backdrop-blur-sm border border-border shadow-sm hover:shadow-md transition-shadow">
                <div className="mb-2 text-sm uppercase font-semibold text-muted-foreground">Bengali</div>
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    ul: ({ node, ...props }: any) => <ul className="list-disc pl-5 space-y-[3px]" {...props} />,
                    ol: ({ node, ...props }: any) => <ol className="list-decimal pl-5 space-y-[3px]" {...props} />,
                  }}
                  className="prose prose-sm dark:prose-invert max-w-none text-foreground space-y-[3px] leading-snug prose-p:my-0 prose-li:my-0 prose-ul:my-0 prose-ol:my-0 prose-headings:my-2"
                >
                  {part.bengali}
                </ReactMarkdown>
              </ScrollArea>
            </div>
          </div>
        </div>
      );
    case 'video_prompt_tabs':
      // Rich video prompt renderer: Normal, JSON, Scene Image, Gallery
      const jsonObj: any = (part as any).jsonPrompt || {};
      const scenes: any[] = Array.isArray(jsonObj?.scenes) ? jsonObj.scenes : [];
      const allKeywords: string[] | undefined = (part as any).keywords;
      const veo3Text: string | undefined = (part as any).veo3OptimizedPrompt;
      const techNotes: string[] | undefined = (part as any).technicalNotes;
      const jsonString = JSON.stringify(jsonObj || {}, null, 2);
      return (
        <div
          key={index}
          className={cn(commonClasses, "bg-card/80 backdrop-blur-sm border border-border rounded-lg shadow-md overflow-hidden")}
          style={{ animationDelay }}
        >
          {part.title && (
            <div className="px-4 pt-4 pb-0 bg-transparent">
              <h3 className="text-xl font-semibold text-center text-purple-400 -mb-1">
                {part.title}
              </h3>
            </div>
          )}
          <div className="p-4">
            <Tabs defaultValue={(part as any)?.bilingual?.english || (part as any)?.bilingual?.bengali ? 'normal' : 'json'} className="w-full">
              <TabsList className="grid grid-cols-4 gap-1 mb-4">
                <TabsTrigger value="normal" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500 data-[state=active]:text-white data-[state=active]:shadow-md rounded-md">Normal</TabsTrigger>
                <TabsTrigger value="json" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500 data-[state=active]:text-white data-[state=active]:shadow-md rounded-md">JSON</TabsTrigger>
                <TabsTrigger value="scene_image" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500 data-[state=active]:text-white data-[state=active]:shadow-md rounded-md">Scene Image</TabsTrigger>
                <TabsTrigger value="gallery" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500 data-[state=active]:text-white data-[state=active]:shadow-md rounded-md">Gallery</TabsTrigger>
              </TabsList>

              <TabsContent value="normal" className="mt-0">
                {((part as any)?.bilingual?.english || (part as any)?.bilingual?.bengali) ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {(part as any)?.bilingual?.english && (
                      <CopyToClipboard
                        textToCopy={(part as any).bilingual.english}
                        title="📝 Normal Prompt (English)"
                        language="text"
                        className="shadow-lg hover:shadow-xl transition-all duration-300 w-full"
                      />
                    )}
                    {(part as any)?.bilingual?.bengali && (
                      <CopyToClipboard
                        textToCopy={(part as any).bilingual.bengali}
                        title="📝 Normal Prompt (Bengali)"
                        language="text"
                        className="shadow-lg hover:shadow-xl transition-all duration-300 w-full"
                      />
                    )}
                  </div>
                ) : (
                  <div className="text-sm text-muted-foreground">No normal prompt available.</div>
                )}
              </TabsContent>

              <TabsContent value="json" className="mt-0">
                <CopyToClipboard
                  textToCopy={jsonString}
                  title="📋 JSON Format (Google Veo 3)"
                  language="json"
                  className="shadow-lg hover:shadow-xl transition-all duration-300 w-full"
                />
              </TabsContent>

              <TabsContent value="scene_image" className="mt-0">
                {scenes.length === 0 ? (
                  <div className="text-sm text-muted-foreground">No scene image prompts available.</div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {scenes.map((s: any, i: number) => {
                      const desc: string = s.description || '';
                      const derivedStart = s?.sceneImage?.start || (desc ? `Starting scene image: ${desc}` : 'Starting scene prompt not provided.');
                      const derivedEnd = s?.sceneImage?.end || (desc ? `Ending scene image: ${desc}` : 'Ending scene prompt not provided.');
                      return (
                        <div key={i} className="rounded-lg bg-card/60 border border-border p-3 shadow-sm hover:shadow-md transition-shadow">
                          <div className="font-semibold text-base mb-2">Scene {s.sceneNumber ?? (i + 1)} Image Prompts</div>
                          <Tabs defaultValue="start" className="w-full">
                            <TabsList className="grid grid-cols-2 gap-1 mb-3">
                              <TabsTrigger value="start" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500 data-[state=active]:text-white data-[state=active]:shadow-md rounded-md text-xs">Starting</TabsTrigger>
                              <TabsTrigger value="end" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500 data-[state=active]:text-white data-[state=active]:shadow-md rounded-md text-xs">Ending</TabsTrigger>
                            </TabsList>
                            <TabsContent value="start" className="mt-0">
                              <div className="flex items-center justify-between mb-1">
                                <div className="text-xs font-medium text-foreground/80">Starting Image</div>
                                <CopyToClipboard textToCopy={derivedStart} className="h-7 px-2 text-xs" />
                              </div>
                              <pre className="text-[12px] leading-snug whitespace-pre-wrap bg-muted p-2 rounded">{derivedStart}</pre>
                            </TabsContent>
                            <TabsContent value="end" className="mt-0">
                              <div className="flex items-center justify-between mb-1">
                                <div className="text-xs font-medium text-foreground/80">Ending Image</div>
                                <CopyToClipboard textToCopy={derivedEnd} className="h-7 px-2 text-xs" />
                              </div>
                              <pre className="text-[12px] leading-snug whitespace-pre-wrap bg-muted p-2 rounded">{derivedEnd}</pre>
                            </TabsContent>
                          </Tabs>
                        </div>
                      );
                    })}
                  </div>
                )}
              </TabsContent>

              

              <TabsContent value="gallery" className="mt-0">
                {scenes.length === 0 ? (
                  <div className="text-sm text-muted-foreground">No gallery assets provided.</div>
                ) : (
                  <div className="space-y-3">
                    <div className="text-xs text-muted-foreground">Gallery assets referenced per scene (if available).</div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {scenes.map((s: any, i: number) => {
                        const ga = s.galleryAssets || { characters: [], objects: [], backgrounds: [] };
                        const hasAny = (ga.characters?.length || 0) + (ga.objects?.length || 0) + (ga.backgrounds?.length || 0) > 0;
                        return (
                          <div key={i} className="rounded-lg bg-card/60 border border-border p-3 shadow-sm hover:shadow-md transition-shadow">
                            <div className="font-semibold text-base mb-2">Scene {s.sceneNumber ?? (i + 1)} Gallery</div>
                            {hasAny ? (
                              <div className="flex flex-wrap gap-2 text-xs">
                                {(ga.characters || []).map((_: any, idx: number) => (
                                  <span key={`c-${idx}`} className="px-2 py-0.5 bg-muted rounded border">Character {idx + 1}</span>
                                ))}
                                {(ga.objects || []).map((_: any, idx: number) => (
                                  <span key={`o-${idx}`} className="px-2 py-0.5 bg-muted rounded border">Object {idx + 1}</span>
                                ))}
                                {(ga.backgrounds || []).map((_: any, idx: number) => (
                                  <span key={`b-${idx}`} className="px-2 py-0.5 bg-muted rounded border">Background {idx + 1}</span>
                                ))}
                              </div>
                            ) : (
                              <div className="text-xs text-muted-foreground">No gallery assets referenced in this scene.</div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      );

    case 'translation_group':
      return (
        <div key={index} className={cn(
          commonClasses, 
          "bg-card/80 backdrop-blur-sm border border-border rounded-lg shadow-md overflow-hidden"
        )} style={{ animationDelay }}>
          <div className="px-4 pt-4 pb-0 bg-transparent">
            <h3 className="text-xl font-semibold text-center text-purple-400 -mb-1">
              {part.title && String(part.title).trim()
                ? part.title
                : 'Client Message Analyze'}
            </h3>
          </div>
          
          <div className="p-4">
            <Tabs defaultValue="keyPoints" className="w-full">
              <TabsList className="grid grid-cols-5 mb-4">
                <TabsTrigger value="keyPoints" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500 data-[state=active]:text-white data-[state=active]:shadow-md rounded-md">Key Points</TabsTrigger>
                <TabsTrigger value="analysis" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500 data-[state=active]:text-white data-[state=active]:shadow-md rounded-md">Fast analyze</TabsTrigger>
                <TabsTrigger value="simplified" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500 data-[state=active]:text-white data-[state=active]:shadow-md rounded-md">Simplified Request</TabsTrigger>
                <TabsTrigger value="approach" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500 data-[state=active]:text-white data-[state=active]:shadow-md rounded-md">Step-by-Step Approach</TabsTrigger>
                <TabsTrigger value="replies" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500 data-[state=active]:text-white data-[state=active]:shadow-md rounded-md">Suggested Replies</TabsTrigger>
              </TabsList>
              
              <div className="min-h-[200px]">
                <TabsContent value="keyPoints" className="mt-0">
                  <div className="flex flex-row gap-1 h-full">
                    <ScrollArea className="flex-1 h-full p-4 rounded-md bg-card/50 backdrop-blur-sm border border-border shadow-sm hover:shadow-md transition-shadow">
                      <div className="mb-2 text-sm uppercase font-semibold text-muted-foreground">English</div>
                      <div className="prose prose-sm dark:prose-invert max-w-none text-foreground leading-snug font-medium prose-li:my-0 prose-ul:my-0 prose-ol:my-0">
                        {part.english?.keyPoints && part.english.keyPoints.length > 0 ? (
                          <ul className="list-disc pl-5 space-y-[3px]">
                            {part.english.keyPoints.map((point, i) => <li key={i}>{point}</li>)}
                          </ul>
                        ) : "No key points available"}
              </div>
                    </ScrollArea>
                    <div className="w-px bg-border mx-2 h-full"></div>
                    <ScrollArea className="flex-1 h-full p-4 rounded-md bg-card/50 backdrop-blur-sm border border-border shadow-sm hover:shadow-md transition-shadow">
                      <div className="mb-2 text-sm uppercase font-semibold text-muted-foreground">Bengali</div>
                      <div className="prose prose-sm dark:prose-invert max-w-none text-foreground leading-snug font-medium prose-li:my-0 prose-ul:my-0 prose-ol:my-0">
                        {part.bengali?.keyPoints && part.bengali.keyPoints.length > 0 ? (
                          <ul className="list-disc pl-5 space-y-[3px]">
                            {part.bengali.keyPoints.map((point, i) => <li key={i}>{point}</li>)}
                          </ul>
                        ) : "কোন মূল বিষয় উপলব্ধ নেই"}
              </div>
                    </ScrollArea>
                  </div>
                </TabsContent>

                <TabsContent value="analysis" className="mt-0">
                  <div className="flex flex-row gap-1 h-full">
                    <ScrollArea className="flex-1 h-full p-4 rounded-md bg-card/50 backdrop-blur-sm border border-border shadow-sm hover:shadow-md transition-shadow">
                      <div className="mb-2 text-sm uppercase font-semibold text-muted-foreground">English</div>
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        components={{
                          ul: ({ node, ...props }: any) => <ul className="list-disc pl-5 space-y-[3px]" {...props} />,
                          ol: ({ node, ...props }: any) => <ol className="list-decimal pl-5 space-y-[3px]" {...props} />,
                        }}
                        className="prose prose-sm dark:prose-invert max-w-none text-foreground space-y-[3px] leading-snug font-medium prose-p:my-0 prose-li:my-0 prose-ul:my-0 prose-ol:my-0"
                      >
                        {part.english?.analysis || "No analysis available"}
                      </ReactMarkdown>
                    </ScrollArea>
                    
                    <div className="w-px bg-border mx-2 h-full"></div>
                    
                    <ScrollArea className="flex-1 h-full p-4 rounded-md bg-card/50 backdrop-blur-sm border border-border shadow-sm hover:shadow-md transition-shadow">
                      <div className="mb-2 text-sm uppercase font-semibold text-muted-foreground">Bengali</div>
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        components={{
                          ul: ({ node, ...props }: any) => <ul className="list-disc pl-5 space-y-[3px]" {...props} />,
                          ol: ({ node, ...props }: any) => <ol className="list-decimal pl-5 space-y-[3px]" {...props} />,
                        }}
                        className="prose prose-sm dark:prose-invert max-w-none text-foreground space-y-[3px] leading-snug font-medium prose-p:my-0 prose-li:my-0 prose-ul:my-0 prose-ol:my-0"
                      >
                        {part.bengali?.analysis || "কোন বিশ্লেষণ উপলব্ধ নেই"}
                      </ReactMarkdown>
                    </ScrollArea>
                  </div>
                </TabsContent>
                
                <TabsContent value="simplified" className="mt-0">
                  <div className="flex flex-row gap-1 h-full">
                    <ScrollArea className="flex-1 h-full p-4 rounded-md bg-card/50 backdrop-blur-sm border border-border shadow-sm hover:shadow-md transition-shadow">
                      <div className="mb-2 text-sm uppercase font-semibold text-muted-foreground">English</div>
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        components={{
                          ul: ({ node, ...props }: any) => <ul className="list-disc pl-5 space-y-[3px]" {...props} />,
                          ol: ({ node, ...props }: any) => <ol className="list-decimal pl-5 space-y-[3px]" {...props} />,
                        }}
                        className="prose prose-sm dark:prose-invert max-w-none text-foreground space-y-[3px] leading-snug font-medium prose-p:my-0 prose-li:my-0 prose-ul:my-0 prose-ol:my-0"
                      >
                        {part.english?.simplifiedRequest || "No simplified request available"}
                      </ReactMarkdown>
                    </ScrollArea>
                    
                    <div className="w-px bg-border mx-2 h-full"></div>
                    
                    <ScrollArea className="flex-1 h-full p-4 rounded-md bg-card/50 backdrop-blur-sm border border-border shadow-sm hover:shadow-md transition-shadow">
                      <div className="mb-2 text-sm uppercase font-semibold text-muted-foreground">Bengali</div>
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        components={{
                          ul: ({ node, ...props }: any) => <ul className="list-disc pl-5 space-y-[3px]" {...props} />,
                          ol: ({ node, ...props }: any) => <ol className="list-decimal pl-5 space-y-[3px]" {...props} />,
                        }}
                        className="prose prose-sm dark:prose-invert max-w-none text-foreground space-y-[3px] leading-snug font-medium prose-p:my-0 prose-li:my-0 prose-ul:my-0 prose-ol:my-0"
                      >
                        {part.bengali?.simplifiedRequest || "কোন সরলীকৃত অনুরোধ উপলব্ধ নেই"}
                      </ReactMarkdown>
                    </ScrollArea>
                  </div>
                </TabsContent>
                
                <TabsContent value="approach" className="mt-0">
                  <div className="flex flex-row gap-1 h-full">
                    <ScrollArea className="flex-1 h-full p-4 rounded-md bg-card/50 backdrop-blur-sm border border-border shadow-sm hover:shadow-md transition-shadow">
                      <div className="mb-2 text-sm uppercase font-semibold text-muted-foreground">English</div>
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        components={{
                          ul: ({ node, ...props }: any) => <ul className="list-disc pl-5 space-y-[3px]" {...props} />,
                          ol: ({ node, ...props }: any) => <ol className="list-decimal pl-5 space-y-[3px]" {...props} />,
                        }}
                        className="prose prose-sm dark:prose-invert max-w-none text-foreground space-y-[3px] leading-snug font-medium prose-p:my-0 prose-li:my-0 prose-ul:my-0 prose-ol:my-0"
                      >
                        {part.english?.stepByStepApproach || "No step-by-step approach available"}
                      </ReactMarkdown>
                    </ScrollArea>
                    
                    <div className="w-px bg-border mx-2 h-full"></div>
                    
                    <ScrollArea className="flex-1 h-full p-4 rounded-md bg-card/50 backdrop-blur-sm border border-border shadow-sm hover:shadow-md transition-shadow">
                      <div className="mb-2 text-sm uppercase font-semibold text-muted-foreground">Bengali</div>
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        components={{
                          ul: ({ node, ...props }: any) => <ul className="list-disc pl-5 space-y-[3px]" {...props} />,
                          ol: ({ node, ...props }: any) => <ol className="list-decimal pl-5 space-y-[3px]" {...props} />,
                        }}
                        className="prose prose-sm dark:prose-invert max-w-none text-foreground space-y-[3px] leading-snug font-medium prose-p:my-0 prose-li:my-0 prose-ul:my-0 prose-ol:my-0"
                      >
                        {part.bengali?.stepByStepApproach || "কোন ধাপে ধাপে পদ্ধতি উপলব্ধ নেই"}
                      </ReactMarkdown>
                    </ScrollArea>
                  </div>
                </TabsContent>
                
                <TabsContent value="replies" className="mt-0">
                  <div className="flex flex-row gap-1 h-full">
                    <ScrollArea className="flex-1 h-full p-4 rounded-md bg-card/50 backdrop-blur-sm border border-border shadow-sm hover:shadow-md transition-shadow">
                      <div className="mb-2 text-sm uppercase font-semibold text-muted-foreground">English</div>
                      <div className="prose prose-sm dark:prose-invert max-w-none text-foreground leading-snug font-medium prose-li:my-0 prose-ul:my-0 prose-ol:my-0">
                        {part.english?.suggestions ? (
                          <div className="space-y-[3px]">
                            {Array.isArray(part.english.suggestions) && part.english.suggestions.map((suggestion, idx) => (
                              <div
                                key={`eng-tab-sugg-${idx}`}
                                className="group relative"
                                onClick={(e) => { if ((e.target as HTMLElement).closest('button')) return; onSuggestionClick && onSuggestionClick(suggestion, 'en'); }}
                                role="button"
                                tabIndex={0}
                                onKeyDown={(e) => { if ((e.target as HTMLElement).closest('button')) return; if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onSuggestionClick && onSuggestionClick(suggestion, 'en'); } }}
                                title={`Use suggestion: ${suggestion}`}
                              >
                                <CopyToClipboard
                                  textToCopy={suggestion}
                                  className="cursor-pointer not-prose bg-card border-border hover:border-primary/50 text-foreground"
                                  contentClassName="font-sans [&_code]:font-sans"
                                  style={{ marginTop: '3px', marginBottom: '3px' }}
                                />
                                <div className="pointer-events-none absolute inset-0 rounded-md ring-1 ring-primary/30 opacity-0 group-hover:opacity-100 transition-opacity" />
                              </div>
                            ))}
                          </div>
                        ) : "No suggested replies available"}
                      </div>
                    </ScrollArea>
                    <div className="w-px bg-border mx-2 h-full"></div>
                    <ScrollArea className="flex-1 h-full p-4 rounded-md bg-card/50 backdrop-blur-sm border border-border shadow-sm hover:shadow-md transition-shadow">
                      <div className="mb-2 text-sm uppercase font-semibold text-muted-foreground">Bengali</div>
                      <div className="prose prose-sm dark:prose-invert max-w-none text-foreground leading-snug font-medium prose-li:my-0 prose-ul:my-0 prose-ol:my-0">
                        {part.bengali?.suggestions ? (
                          <div className="space-y-[3px]">
                            {Array.isArray(part.bengali.suggestions) && part.bengali.suggestions.map((suggestion, idx) => (
                              <div
                                key={`bn-tab-sugg-${idx}`}
                                className="group relative"
                                onClick={(e) => { if ((e.target as HTMLElement).closest('button')) return; onSuggestionClick && onSuggestionClick(suggestion, 'bn'); }}
                                role="button"
                                tabIndex={0}
                                onKeyDown={(e) => { if ((e.target as HTMLElement).closest('button')) return; if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onSuggestionClick && onSuggestionClick(suggestion, 'bn'); } }}
                                title={`Use suggestion: ${suggestion}`}
                              >
                                <CopyToClipboard
                                  textToCopy={suggestion}
                                  className="cursor-pointer not-prose bg-card border-border hover:border-secondary/50 text-foreground"
                                  contentClassName="font-sans [&_code]:font-sans"
                                  style={{ marginTop: '3px', marginBottom: '3px' }}
                                />
                                <div className="pointer-events-none absolute inset-0 rounded-md ring-1 ring-secondary/30 opacity-0 group-hover:opacity-100 transition-opacity" />
                              </div>
                            ))}
                          </div>
                        ) : "কোন প্রস্তাবিত উত্তর উপলব্ধ নেই"}
                      </div>
                    </ScrollArea>
                  </div>
                </TabsContent>
              </div>
             </Tabs>
           </div>
        </div>
      );

    case 'custom':
      return (
        <div key={index} className={cn(
          commonClasses, 
          "bg-gradient-to-br from-accent/10 to-secondary/10 rounded-lg p-4 backdrop-blur-sm border-2 border-accent/20 shadow-lg",
          "relative overflow-hidden"
        )} style={{ animationDelay }}>
          {/* Special decorative element for custom responses */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-accent to-secondary"></div>
          
          {part.title && (
            <h3 className="font-bold text-base mb-3 bg-clip-text text-transparent bg-gradient-to-r from-accent to-secondary flex items-center">
              <span className="mr-2 text-lg">✨</span>
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{ p: ({ children }) => <span>{children}</span> }}
                className="inline"
              >
                {part.title}
              </ReactMarkdown>
            </h3>
          )}
          
          {part.text && (
            <div className="pt-1">
              <div className="bg-background/50 p-3 rounded-lg border border-accent/10 shadow-inner">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  className="prose prose-sm dark:prose-invert max-w-none text-foreground whitespace-pre-wrap leading-snug prose-p:my-0 prose-li:my-0 prose-ul:my-0 prose-ol:my-0"
                >
                  {part.text}
                </ReactMarkdown>
              </div>
            </div>
          )}
        </div>
      );
      
    case 'suggested_replies':
      return (
        <div key={index} className={cn(commonClasses, "space-y-3")} style={{ animationDelay }}>
          {part.title && <h4 className="font-semibold mb-2 text-base text-gradient">{part.title}</h4>}

          {part.suggestions?.english && Array.isArray(part.suggestions.english) && part.suggestions.english.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {part.suggestions.english.slice(0, 5).map((reply, i) => (
                <Button
                  key={`eng-sugg-${i}`}
                  variant="outline"
                  size="sm"
                  className="rounded-full bg-primary/5 hover:bg-primary/10 border-primary/20 text-primary hover:text-primary shadow-sm"
                  onClick={() => onSuggestionClick && onSuggestionClick(reply, 'en')}
                  title={`Use suggestion: ${reply}`}
                >
                  <Sparkles className="h-3 w-3 mr-1" /> {reply}
                </Button>
              ))}
            </div>
          )}

          {part.suggestions?.bengali && Array.isArray(part.suggestions.bengali) && part.suggestions.bengali.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {part.suggestions.bengali.slice(0, 5).map((reply, i) => (
                <Button
                  key={`bn-sugg-${i}`}
                  variant="outline"
                  size="sm"
                  className="rounded-full bg-secondary/5 hover:bg-secondary/10 border-secondary/20 text-secondary-foreground/90 shadow-sm"
                  onClick={() => onSuggestionClick && onSuggestionClick(reply, 'bn')}
                  title={`Use suggestion: ${reply}`}
                >
                  <Sparkles className="h-3 w-3 mr-1" /> {reply}
                </Button>
              ))}
            </div>
          )}
        </div>
      );
      
    case 'top_designs':
      return (
        <div key={index} className={cn(commonClasses, "mt-6 animate-fade-in")} style={{ animationDelay }}>
          <div className="relative p-4 bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-950/40 dark:to-blue-950/40 rounded-lg mb-6 border border-indigo-200/50 dark:border-indigo-800/30 shadow-lg overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-purple-500/5 to-blue-500/5 opacity-30"></div>
            <div className="z-10 relative">
              {part.data && <TopDesignsResults results={part.data} className="w-full" />}
            </div>
          </div>
        </div>
      );

    case 'design_idea':
      return (
        <div key={index} className={cn(commonClasses, "bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900/70 dark:to-slate-800/70 rounded-lg shadow-md overflow-hidden border border-slate-200 dark:border-slate-700")} style={{ animationDelay }}>
          {part.title && (
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-3 border-b flex items-center text-white">
              <span className="mr-2 text-lg">🎨</span>
              <h4 className="font-semibold text-base">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{ p: ({ node, ...props }) => <span {...props} /> }}
                  className="inline"
                >
                  {part.title}
                </ReactMarkdown>
              </h4>
            </div>
          )}
          {part.text && (
            <div className="px-4 py-3">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                className="prose prose-sm dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 whitespace-pre-wrap leading-snug prose-p:my-0 prose-li:my-0 prose-ul:my-0 prose-ol:my-0"
              >
                {part.text}
              </ReactMarkdown>
            </div>
          )}
          <div className="px-4 py-2 bg-slate-100 dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 flex justify-end items-center gap-2">
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-xs flex items-center gap-1 text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400"
              onClick={() => navigator.clipboard.writeText(part.text || '')}
            >
              <Copy className="h-3.5 w-3.5" />
              <span>Copy</span>
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-xs flex items-center gap-1 text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400"
              onClick={() => {/* Functionality to be added later */}}
            >
              <PlusCircle className="h-3.5 w-3.5" />
              <span>Save Idea</span>
            </Button>
          </div>
        </div>
      );


    // Add new case for design_ideas_group
    case 'design_ideas_group':
      return (
        <div key={index} className={cn(commonClasses, "space-y-6")} style={{ animationDelay }}>
          {part.title && (
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-4 py-3 rounded-t-lg flex items-center text-white">
              <span className="mr-2 text-lg">📋</span>
              <h4 className="font-semibold text-lg">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{ p: ({ node, ...props }) => <span {...props} /> }}
                  className="inline"
                >
                  {part.title}
                </ReactMarkdown>
              </h4>
            </div>
          )}
          
          {part.ideas && part.ideas.map((group, groupIndex) => (
            <div key={groupIndex} className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900/70 dark:to-slate-800/70 rounded-lg shadow-md overflow-hidden border border-slate-200 dark:border-slate-700">
              <div className={cn(
                "px-4 py-3 border-b flex items-center text-white",
                groupIndex === 0 ? "bg-gradient-to-r from-rose-500 to-pink-600" : // Creative Design Ideas
                groupIndex === 1 ? "bg-gradient-to-r from-indigo-600 to-blue-700" : // Typography Design
                "bg-gradient-to-r from-violet-600 to-purple-700" // Typography with Graphics
              )}>
                <span className="mr-2 text-lg">
                  {groupIndex === 0 ? "🎨" : groupIndex === 1 ? "🔤" : "🖌️"}
                </span>
                <h4 className="font-semibold text-base">{group.category}</h4>
              </div>
              
                {group.items.map((idea, ideaIndex) => (
                  <div key={ideaIndex} className="pb-2 mb-2 border-b border-slate-200 dark:border-slate-700 last:border-0 last:mb-0 last:pb-0">
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      className="prose prose-sm dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 whitespace-pre-wrap leading-snug prose-p:my-0 prose-li:my-0 prose-ul:my-0 prose-ol:my-0"
                    >
                      {idea}
                    </ReactMarkdown>
                  </div>
                ))}
            </div>
          ))}
        </div>
      );
      

    case 'prompt_tabs':
      return (
        <div key={index} className={cn(
          commonClasses, 
          "bg-gradient-to-br from-slate-50/90 to-slate-100/90 dark:from-slate-900/90 dark:to-slate-800/90 backdrop-blur-sm border border-primary/10 rounded-lg shadow-xl overflow-hidden"
        )} style={{ animationDelay }}>
          <div className="bg-gradient-to-r from-indigo-600 to-violet-600 px-4 py-3 border-b flex items-center text-white">
            <span className="mr-2 text-lg">✨</span>
            <h4 className="font-semibold text-base">{part.title || 'AI Image Prompts'}</h4>
          </div>
          
          <div className="p-4 space-y-4">
            {part.imageDataUri && (
              <div className="flex items-center space-x-4 bg-white/40 dark:bg-slate-800/40 p-3 rounded-xl border border-primary/10 shadow-md">
                <div className="relative rounded-md overflow-hidden w-28 h-28 border border-primary/20 shadow-md transition-all duration-300 hover:shadow-lg">
                  <Image 
                    src={part.imageDataUri} 
                    alt="Reference image"
                    fill
                    style={{ objectFit: 'contain' }}
                  />
                </div>
                <div>
                  <h4 className="text-lg font-semibold bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-violet-500">{part.title || 'Image Analysis'}</h4>
                  <p className="text-sm text-muted-foreground mt-1">Here are three different prompt styles for this image</p>
                </div>
              </div>
            )}
            
            <Tabs defaultValue="exact" className="w-full">
              <TabsList className="grid grid-cols-3 mb-4 bg-gradient-to-r from-background/80 to-muted/80 p-1 rounded-lg">
                <TabsTrigger value="exact" className="data-[state=active]:bg-gradient-to-br data-[state=active]:from-blue-500 data-[state=active]:to-indigo-600 data-[state=active]:text-white data-[state=active]:shadow-md rounded-md">
                  <span className="mr-1.5">🎯</span> Exact Replication
                </TabsTrigger>
                <TabsTrigger value="similar" className="data-[state=active]:bg-gradient-to-br data-[state=active]:from-violet-500 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-md rounded-md">
                  <span className="mr-1.5">✏️</span> Similar with Tweaks
                </TabsTrigger>
                <TabsTrigger value="niche" className="data-[state=active]:bg-gradient-to-br data-[state=active]:from-emerald-500 data-[state=active]:to-teal-600 data-[state=active]:text-white data-[state=active]:shadow-md rounded-md">
                  <span className="mr-1.5">🔄</span> Same Niche/Concept
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="exact">
                <div className="space-y-3 animate-fade-in">
                  <div className="flex justify-between items-center">
                    <h3 className="font-medium text-blue-700 dark:text-blue-400 flex items-center">
                      <span className="mr-2 text-lg">🎯</span>
                      Exact Replication
                    </h3>
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex items-center gap-1 bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-700 hover:bg-blue-100 dark:hover:bg-blue-800/40 text-blue-700 dark:text-blue-300 transition-all duration-300"
                      onClick={() => handleCopyToClipboard(part.exactReplicationPrompt || '', `exact-${index}`)}
                    >
                      {copyState[`exact-${index}`] ? (
                        <>
                          <Check className="h-3 w-3" /> Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="h-3 w-3" /> Copy Prompt
                        </>
                      )}
                    </Button>
                  </div>
                  <div className="h-[200px] rounded-lg border border-blue-200 dark:border-blue-800/60 p-4 bg-blue-50/50 dark:bg-blue-900/20 overflow-auto shadow-inner">
                    <pre className="text-sm whitespace-pre-wrap text-slate-700 dark:text-slate-300">{part.exactReplicationPrompt}</pre>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="similar">
                <div className="space-y-3 animate-fade-in">
                  <div className="flex justify-between items-center">
                    <h3 className="font-medium text-violet-700 dark:text-violet-400 flex items-center">
                      <span className="mr-2 text-lg">✏️</span>
                      Similar with Tweaks
                    </h3>
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex items-center gap-1 bg-violet-50 dark:bg-violet-900/30 border-violet-200 dark:border-violet-700 hover:bg-violet-100 dark:hover:bg-violet-800/40 text-violet-700 dark:text-violet-300 transition-all duration-300"
                      onClick={() => handleCopyToClipboard(part.similarWithTweaksPrompt || '', `similar-${index}`)}
                    >
                      {copyState[`similar-${index}`] ? (
                        <>
                          <Check className="h-3 w-3" /> Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="h-3 w-3" /> Copy Prompt
                        </>
                      )}
                    </Button>
                  </div>
                  <div className="h-[200px] rounded-lg border border-violet-200 dark:border-violet-800/60 p-4 bg-violet-50/50 dark:bg-violet-900/20 overflow-auto shadow-inner">
                    <pre className="text-sm whitespace-pre-wrap text-slate-700 dark:text-slate-300">{part.similarWithTweaksPrompt}</pre>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="niche">
                <div className="space-y-3 animate-fade-in">
                  <div className="flex justify-between items-center">
                    <h3 className="font-medium text-emerald-700 dark:text-emerald-400 flex items-center">
                      <span className="mr-2 text-lg">🔄</span>
                      Same Niche/Concept
                    </h3>
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex items-center gap-1 bg-emerald-50 dark:bg-emerald-900/30 border-emerald-200 dark:border-emerald-700 hover:bg-emerald-100 dark:hover:bg-emerald-800/40 text-emerald-700 dark:text-emerald-300 transition-all duration-300"
                      onClick={() => handleCopyToClipboard(part.sameNichePrompt || '', `niche-${index}`)}
                    >
                      {copyState[`niche-${index}`] ? (
                        <>
                          <Check className="h-3 w-3" /> Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="h-3 w-3" /> Copy Prompt
                        </>
                      )}
                    </Button>
                  </div>
                  <div className="h-[200px] rounded-lg border border-emerald-200 dark:border-emerald-800/60 p-4 bg-emerald-50/50 dark:bg-emerald-900/20 overflow-auto shadow-inner">
                    <pre className="text-sm whitespace-pre-wrap text-slate-700 dark:text-slate-300">{part.sameNichePrompt}</pre>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      );

    case 'custom_prompts_tabs':
      return (
        <div key={index} className={`${commonClasses} bg-gradient-to-br from-slate-50/90 to-slate-100/90 dark:from-slate-900/90 dark:to-slate-800/90 backdrop-blur-sm border border-primary/10 rounded-lg shadow-xl overflow-hidden`} style={{ animationDelay }}>
          <div className="bg-gradient-to-r from-pink-600 to-purple-600 px-4 py-3 border-b flex items-center text-white">
            <span className="mr-2 text-lg">💫</span>
            <h4 className="font-semibold text-base">{part.title || 'Custom Prompt Styles'}</h4>
          </div>
          
          <div className="p-4 space-y-4">
            {part.customPrompts && part.customPrompts.length > 0 && (
              <Tabs defaultValue={part.customPrompts[0]?.title || 'prompt-0'} className="w-full">
                <TabsList className="grid w-full grid-cols-1 sm:grid-cols-3 md:grid-cols-5 gap-2 mb-4 bg-gradient-to-r from-background/80 to-muted/80 p-1 rounded-lg">
                  {part.customPrompts.map((promptItem, promptIndex) => (
                    <TabsTrigger 
                      key={promptIndex}
                      value={promptItem.title || `prompt-${promptIndex}`}
                      className="data-[state=active]:bg-gradient-to-br data-[state=active]:text-white data-[state=active]:from-purple-500 data-[state=active]:to-pink-600 data-[state=active]:shadow-md rounded-md"
                    >
                      {promptItem.title}
                    </TabsTrigger>
                  ))}
                </TabsList>
                
                {part.customPrompts.map((promptItem, promptIndex) => (
                  <TabsContent key={promptIndex} value={promptItem.title || `prompt-${promptIndex}`}>
                    <div className="space-y-3 animate-fade-in">
                      <div className="flex justify-between items-center">
                        <h3 className="font-medium text-foreground flex items-center">
                          <span className="mr-2 text-lg">✨</span>
                          {promptItem.title}
                        </h3>
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex items-center gap-1 transition-all duration-300"
                          onClick={() => handleCopyToClipboard(promptItem.prompt || '', `custom-prompt-${promptIndex}`)}
                        >
                          {copyState[`custom-prompt-${promptIndex}`] ? (
                            <>
                              <Check className="h-3 w-3" /> Copied!
                            </>
                          ) : (
                            <>
                              <Copy className="h-3 w-3" /> Copy Prompt
                            </>
                          )}
                        </Button>
                      </div>
                      <div className="h-[200px] rounded-lg border p-4 bg-background/50 overflow-auto shadow-inner">
                        <pre className="text-sm whitespace-pre-wrap text-foreground/90">{promptItem.prompt}</pre>
                      </div>
                    </div>
                  </TabsContent>
                ))}
              </Tabs>
            )}
          </div>
        </div>
      );

    case 'microstock_results_tabs':
      return (
        <div key={index} className={`${commonClasses} bg-gradient-to-br from-slate-50/90 to-slate-100/90 dark:from-slate-900/90 dark:to-slate-800/90 backdrop-blur-sm border border-primary/10 rounded-lg shadow-xl overflow-hidden`} style={{ animationDelay }}>
          <div className="bg-gradient-to-r from-teal-600 to-cyan-600 px-4 py-3 border-b flex items-center justify-between text-white">
            <div className="flex items-center">
              <span className="mr-2 text-lg">📈</span>
              <h4 className="font-semibold text-base">{part.title || 'Microstock Prompts & Metadata'}</h4>
            </div>
            <div className="flex items-center gap-2">
              <span className="bg-white/20 text-white text-xs px-2 py-1 rounded-full">
                {part.microstockResults?.length || 0} Prompts
              </span>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-7 w-7 p-0 rounded-full bg-white/10 hover:bg-white/20 text-white"
                onClick={() => handleCopyToClipboard(
                  part.microstockResults?.map((r, i) => `PROMPT ${i+1}:\n${r.prompt}\n\nMETADATA:\nTitle: ${r.metadata.title}\nKeywords: ${r.metadata.keywords.join(', ')}\nCategory: ${r.metadata.mainCategory}\nSubcategory: ${r.metadata.subcategory}`).join('\n\n---\n\n') || '',
                  'all-microstock-prompts'
                )}
              >
                {copyState['all-microstock-prompts'] ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
              </Button>
            </div>
          </div>
          
          <div className="p-2 md:p-4 w-full">
            {part.microstockResults && part.microstockResults.length > 0 && (
              <Tabs defaultValue={`prompt-0`} className="w-full">
                {/* First row of tabs: Prompts 1-10 */}
                <div className="space-y-2">
                  <TabsList className="grid grid-cols-5 sm:grid-cols-5 md:grid-cols-10 w-full gap-1 mb-2 bg-gradient-to-r from-teal-50 to-cyan-50 dark:from-teal-950/30 dark:to-cyan-950/30 p-1 md:p-1.5 rounded-t-lg shadow-sm">
                    {part.microstockResults.slice(0, 10).map((resultItem, resultIndex) => (
                      <TabsTrigger 
                        key={`outer-tab-${resultIndex}`}
                        value={`prompt-${resultIndex}`}
                        className="py-1 px-0 md:py-1.5 data-[state=active]:bg-gradient-to-br data-[state=active]:text-white data-[state=active]:from-cyan-500 data-[state=active]:to-teal-600 data-[state=active]:shadow-md transition-all duration-300 relative rounded-md"
                      >
                        <span className="block md:hidden text-xs">P{resultIndex + 1}</span>
                        <span className="hidden md:block text-sm">Prompt {resultIndex + 1}</span>
                        <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2">
                          <div className="w-0.5 h-3 bg-gradient-to-b from-teal-500 to-teal-600"></div>
                        </div>
                      </TabsTrigger>
                    ))}
                  </TabsList>
                  
                  {/* Second row of tabs: Prompts 11-20 (if available) */}
                  {part.microstockResults.length > 10 && (
                    <TabsList className="grid grid-cols-5 sm:grid-cols-5 md:grid-cols-10 w-full gap-1 mb-2 bg-gradient-to-r from-teal-50 to-cyan-50 dark:from-teal-950/30 dark:to-cyan-950/30 p-1 md:p-1.5 rounded-b-lg shadow-sm">
                      {part.microstockResults.slice(10, 20).map((resultItem, resultIndex) => {
                        const actualIndex = resultIndex + 10;
                        return (
                          <TabsTrigger 
                            key={`outer-tab-${actualIndex}`}
                            value={`prompt-${actualIndex}`}
                            className="py-1 px-0 md:py-1.5 data-[state=active]:bg-gradient-to-br data-[state=active]:text-white data-[state=active]:from-cyan-500 data-[state=active]:to-teal-600 data-[state=active]:shadow-md transition-all duration-300 relative rounded-md"
                          >
                            <span className="block md:hidden text-xs">P{actualIndex + 1}</span>
                            <span className="hidden md:block text-sm">Prompt {actualIndex + 1}</span>
                            <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2">
                              <div className="w-0.5 h-3 bg-gradient-to-b from-teal-500 to-teal-600"></div>
                            </div>
                          </TabsTrigger>
                        );
                      })}
                    </TabsList>
                  )}
                </div>
                
                {/* Add some spacing between tabs and content */}
                <div className="h-2"></div>
                
                {/* Content areas for all tabs */}
                {part.microstockResults.map((resultItem, resultIndex) => (
                  <TabsContent key={`outer-content-${resultIndex}`} value={`prompt-${resultIndex}`}>
                    <div className="space-y-3 animate-fade-in border border-muted/30 rounded-lg p-2 md:p-3 bg-card/50">
                      <Tabs defaultValue="prompt-text" className="w-full">
                        <TabsList className="w-full flex mb-3 bg-transparent p-0 rounded-md overflow-hidden border divide-x">
                          <TabsTrigger 
                            value="prompt-text" 
                            className="flex-1 py-1.5 md:py-2 rounded-none data-[state=active]:bg-gradient-to-r data-[state=active]:from-teal-500 data-[state=active]:to-teal-600 data-[state=active]:text-white data-[state=inactive]:bg-muted/30 transition-all duration-300 rounded-md"
                          >
                            Prompt
                          </TabsTrigger>
                          <TabsTrigger 
                            value="metadata" 
                            className="flex-1 py-1.5 md:py-2 rounded-none data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500 data-[state=active]:to-cyan-600 data-[state=active]:text-white data-[state=inactive]:bg-muted/30 transition-all duration-300 rounded-md"
                          >
                            Metadata
                          </TabsTrigger>
                        </TabsList>
                        
                        {/* Visual connector between outer and inner tabs */}
                        <div className="relative w-full">
                          <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
                            <div className="w-0.5 h-3 bg-gradient-to-b from-teal-500 to-teal-600"></div>
                          </div>
                          <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-teal-500 to-teal-600 text-white text-xs px-2 py-0.5 rounded-full">
                            #{resultIndex + 1}
                          </div>
                        </div>
                        
                        <TabsContent value="prompt-text" className="focus-visible:outline-none focus-visible:ring-0">
                          <div className="flex justify-between items-start mb-1">
                            <h4 className="font-medium text-foreground/90 text-sm md:text-base">Prompt Text</h4>
                            <Button
                              size="sm" 
                              variant="ghost"
                              className="flex items-center gap-1 text-xs h-7 px-2"
                              onClick={() => handleCopyToClipboard(resultItem.prompt || '', `ms-prompt-${resultIndex}`)}
                            >
                              {copyState[`ms-prompt-${resultIndex}`] ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />} Copy
                            </Button>
                          </div>
                          <div className="h-[120px] md:h-[150px] rounded-md border p-2 md:p-3 bg-background/70 overflow-auto shadow-inner">
                            <pre className="text-xs md:text-sm whitespace-pre-wrap text-foreground/80">{resultItem.prompt}</pre>
                          </div>
                        </TabsContent>
                        <TabsContent value="metadata" className="focus-visible:outline-none focus-visible:ring-0">
                          <div className="space-y-2">
                            <div className="flex justify-between items-start">
                              <h5 className="font-medium text-xs md:text-sm text-foreground/90">Title:</h5>
                              <Button 
                                size="sm" 
                                variant="ghost" 
                                className="h-6 md:h-7 px-2 text-xs" 
                                onClick={() => handleCopyToClipboard(resultItem.metadata.title || '', `ms-title-${resultIndex}`)}
                              >
                                {copyState[`ms-title-${resultIndex}`] ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />} Copy
                              </Button>
                            </div>
                            <p className="text-xs p-1.5 md:p-2 bg-background/70 rounded border border-muted/20 text-foreground/80">{resultItem.metadata.title}</p>
                            
                            <div className="flex justify-between items-start pt-1">
                              <h5 className="font-medium text-xs md:text-sm text-foreground/90">Keywords:</h5>
                              <Button 
                                size="sm" 
                                variant="ghost" 
                                className="h-6 md:h-7 px-2 text-xs" 
                                onClick={() => handleCopyToClipboard(resultItem.metadata.keywords.join(', ') || '', `ms-keywords-${resultIndex}`)}
                              >
                                {copyState[`ms-keywords-${resultIndex}`] ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />} Copy
                              </Button>
                            </div>
                            <div className="text-xs p-1.5 md:p-2 bg-background/70 rounded border border-muted/20 text-foreground/80 flex flex-wrap gap-1">
                              {resultItem.metadata.keywords.map(kw => <span key={kw} className="bg-muted px-1.5 py-0.5 rounded">{kw}</span>)}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-3 gap-y-1 pt-1">
                               <div>
                                <div className="flex justify-between items-start">
                                  <h5 className="font-medium text-xs md:text-sm text-foreground/90">Category:</h5>
                                  <Button 
                                    size="sm" 
                                    variant="ghost" 
                                    className="h-6 md:h-7 px-2 text-xs" 
                                    onClick={() => handleCopyToClipboard(resultItem.metadata.mainCategory || '', `ms-cat-${resultIndex}`)}
                                  >
                                    {copyState[`ms-cat-${resultIndex}`] ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />} Copy
                                  </Button>
                                </div>
                                <p className="text-xs p-1.5 md:p-2 bg-background/70 rounded border border-muted/20 text-foreground/80">{resultItem.metadata.mainCategory}</p>
                               </div>
                               <div className="mt-2 md:mt-0">
                                <div className="flex justify-between items-start">
                                  <h5 className="font-medium text-xs md:text-sm text-foreground/90">Subcategory:</h5>
                                   <Button 
                                    size="sm" 
                                    variant="ghost" 
                                    className="h-6 md:h-7 px-2 text-xs" 
                                    onClick={() => handleCopyToClipboard(resultItem.metadata.subcategory || '', `ms-subcat-${resultIndex}`)}
                                  >
                                    {copyState[`ms-subcat-${resultIndex}`] ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />} Copy
                                  </Button>
                                </div>
                                <p className="text-xs p-1.5 md:p-2 bg-background/70 rounded border border-muted/20 text-foreground/80">{resultItem.metadata.subcategory}</p>
                               </div>
                            </div>
                          </div>
                        </TabsContent>
                      </Tabs>
                    </div>
                  </TabsContent>
                ))}
              </Tabs>
            )}
          </div>
        </div>
      );

    case 'bilingual_analysis':
      return (
        <div key={index} className={cn(commonClasses)} style={{ animationDelay }}>
          <BilingualSplitView
            keyPoints={{ english: part.keyPoints.english, bengali: part.keyPoints.bengali }}
            detailedRequirements={{ english: part.detailedRequirements.english, bengali: part.detailedRequirements.bengali }}
            simplifiedRequirements={part.simplifiedRequirements ? { english: part.simplifiedRequirements.english, bengali: part.simplifiedRequirements.bengali } : undefined}
            imageAnalysis={part.imageAnalysis ? { english: part.imageAnalysis.english, bengali: part.imageAnalysis.bengali } : undefined}
            designItems={{ english: part.designItems.english, bengali: part.designItems.bengali }}
            generatedPromptsByDesign={part.editingPromptsByDesign}
            generatedPrompts={part.generatedPrompts}
            onSelectDesign={(designItem: any, options: any) => {
              // Create a custom event that page.tsx can listen for, including user-selected options
              const event = new CustomEvent('design-item-selected', {
                detail: { designItem, options }
              });
              window.dispatchEvent(event);
            }}
          />
        </div>
      );

    case 'search_keywords': {
      // Normalize keyword entries so that each has text and url.
      const normalizedKeywords = (part.keywords || []).map((kw: any) => {
        if (typeof kw === 'string') {
          return {
            text: kw,
            url: `https://www.google.com/search?q=${encodeURIComponent(kw)}`,
          };
        }
        if (typeof kw === 'object' && kw !== null) {
          return {
            text: kw.text ?? String(kw),
            url: kw.url ?? `https://www.google.com/search?q=${encodeURIComponent(kw.text ?? String(kw))}`,
          };
        }
        // Fallback for unexpected types
        const kwString = String(kw);
        return {
          text: kwString,
          url: `https://www.google.com/search?q=${encodeURIComponent(kwString)}`,
        };
      });

      return (
        <div key={index} className={cn(commonClasses, "bg-card/80 backdrop-blur-sm border border-border rounded-lg shadow-md overflow-hidden")} style={{ animationDelay }}>
          <div className="px-4 py-3 border-b flex items-baseline justify-between bg-gradient-to-r from-sky-500 to-blue-600">
            <div className="flex items-baseline gap-3">
              <span className="text-lg">🔍</span>
            <h4 className="font-semibold text-base text-white">
              {part.title || 'Search Keywords'}
            </h4>
              <p className="text-xs text-white/80 font-light">
                (Click on any keyword to find design inspiration on Google)
              </p>
            </div>
          </div>
          <div className="p-4">
            <div className="flex flex-wrap gap-2">
              {normalizedKeywords.map((keyword, i) => (
                <Button
                  key={`search-keyword-${i}`}
                  variant="outline"
                  className="rounded-full bg-primary/5 hover:bg-primary/20 border-primary/20 text-sm py-1 h-auto transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 hover:scale-105"
                  asChild
                >
                  <a
                    href={keyword.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center"
                  >
                    <span>{keyword.text}</span>
                  </a>
                </Button>
              ))}
            </div>
          </div>
        </div>
      );
    }

    case 'design_prompts_tabs':
      return (
        <div key={index} className={cn(commonClasses, "bg-card/80 backdrop-blur-sm border border-border rounded-lg shadow-md overflow-hidden")} style={{ animationDelay }}>
          <div className="px-4 py-3 border-b flex items-center justify-between bg-gradient-to-r from-teal-500 to-cyan-600">
            <div className='flex items-center'>
              <span className="mr-2 text-lg">🎨</span>
              <h4 className="font-semibold text-base text-white">
                {part.title || 'AI Image Generation Prompts'}
              </h4>
            </div>
            {part.promptsData && (
              <Badge variant="secondary" className="font-mono text-xs">
                {part.promptsData.reduce((acc: number, curr: any) => acc + curr.prompts.length, 0)} Prompts
              </Badge>
            )}
          </div>
          {part.promptsData && part.promptsData.length > 0 && (
            <div className="p-1 sm:p-2">
              <DesignPromptsTabs promptsData={part.promptsData} />
            </div>
          )}
        </div>
      );

    default:
      return null;
  }
}

export function ChatMessageDisplay({ message, onRegenerate, onConfirmEditAndResend, onOpenCustomSenseEditor, onStopRegeneration, onPerformAction, onRegenerateCustomSense, isMobile, profile, activeActionButton, lastSelectedActionButton, isLoading, currentUserMessage, currentAttachedFilesDataLength, searchHighlightTerm, currentModelId, setCurrentModelIdAction }: ChatMessageProps) {
  const [isEditingThisMessage, setIsEditingThisMessage] = useState(false);
  const [editedText, setEditedText] = useState<string>('');
  const [editedAttachments, setEditedAttachments] = useState<AttachedFile[]>([]);
  const [editedActionType, setEditedActionType] = useState<ActionType | undefined>(message.actionType);
  const [currentHistoryViewIndex, setCurrentHistoryViewIndex] = useState<number | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isUser = message.role === 'user';
  const isAssistant = message.role === 'assistant';
  
  // Determine if this message has edit history
  const hasEditHistory = message.editHistory && message.editHistory.length > 0;
  const totalVersions = hasEditHistory ? message.editHistory!.length + 1 : 1;

  // Get the content to display based on currentHistoryViewIndex
  const displayContent = useMemo(() => {
    if (message.role === 'user' && hasEditHistory && currentHistoryViewIndex !== null) {
      return message.editHistory![currentHistoryViewIndex].content;
    } else {
      return message.content;
    }
  }, [message, hasEditHistory, currentHistoryViewIndex]);

  // Get attachments to display based on currentHistoryViewIndex
  const displayAttachments = useMemo(() => {
    if (message.role === 'user' && hasEditHistory && currentHistoryViewIndex !== null) {
      return message.editHistory![currentHistoryViewIndex].attachedFiles;
    } else {
      return message.attachedFiles;
    }
  }, [message, hasEditHistory, currentHistoryViewIndex]);

  // Track if action change should trigger regeneration (only for non-editing mode)
  const shouldRegenerateOnActionChange = isUser && !isEditingThisMessage && message.linkedAssistantMessageId;

  // Handler for action type change
  const handleActionTypeChange = (newActionType: ActionType) => {
    // Update the action type
    setEditedActionType(newActionType);
    
    // If we're not in edit mode and this is a user message with a linked assistant response,
    // trigger regeneration with the new action type
    if (shouldRegenerateOnActionChange && onConfirmEditAndResend) {
      // Get the current message content and attachments
      const currentContent = typeof message.content === 'string' ? 
        message.content : getMessageText(message.content);
      
      // Use the existing onConfirmEditAndResend function to trigger regeneration
      // with the same content but a new action type
      onConfirmEditAndResend(
        message.id,
        currentContent,
        message.attachedFiles,
        newActionType
      );
    }
  };

  const handleRegenerateClick = () => {
    if (message.originalRequest && onRegenerate) {
      onRegenerate({
        ...message.originalRequest,
        messageIdToRegenerate: message.id
      });
    }
  };

  const handleStartEdit = () => {
    const contentToEdit = typeof displayContent === 'string' ? displayContent : getMessageText(displayContent);
    setEditedText(contentToEdit);
    setEditedAttachments(displayAttachments || []);
    setEditedActionType(message.actionType);
    setIsEditingThisMessage(true);
  };

  const handleCancelEdit = () => {
    setIsEditingThisMessage(false);
  };

  const handleSaveAndSendEdited = () => {
    if (onConfirmEditAndResend) {
      onConfirmEditAndResend(message.id, editedText, editedAttachments, editedActionType);
    }
    setIsEditingThisMessage(false);
    setCurrentHistoryViewIndex(null); // Reset to view current version after edit
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const files = Array.from(event.target.files);
      const processedFiles: AttachedFile[] = [];
  
      for (const file of files) {
        const basicInfo: AttachedFile = {
          name: (file as File).name,
          type: (file as File).type,
          size: (file as File).size
        };
  
        if ((file as File).type.startsWith('image/')) {
          try { basicInfo.dataUri = await readFileAsDataURL(file as File); } 
          catch (e) { console.error("Error reading image file:", e); }
        } else if ((file as File).type === 'text/plain' || (file as File).type === 'text/markdown' || (file as File).type === 'application/json') {
          try { basicInfo.textContent = await readFileAsText(file as File); } 
          catch (e) { console.error("Error reading text file:", e); }
        }
        processedFiles.push(basicInfo);
      }
  
      setEditedAttachments([...editedAttachments, ...processedFiles]);
    }
  };

  const readFileAsDataURL = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const readFileAsText = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsText(file);
    });
  };

  const removeAttachment = (index: number) => {
    setEditedAttachments(prev => prev.filter((_: AttachedFile, i: number) => i !== index));
  };

  const clearAttachments = () => {
    setEditedAttachments([]);
  };

  const handlePrevHistory = () => {
    if (hasEditHistory && message.editHistory && message.editHistory.length > 0) {
      setCurrentHistoryViewIndex(currentIdx => {
        if (currentIdx === null) return message.editHistory!.length - 1;
        return Math.max(0, currentIdx - 1);
      });
    }
  };

  const handleNextHistory = () => {
    if (hasEditHistory && message.editHistory && message.editHistory.length > 0) {
      setCurrentHistoryViewIndex(currentIdx => {
        if (currentIdx === null) return null;
        return currentIdx >= message.editHistory!.length - 1 ? null : currentIdx + 1;
      });
    }
  };

  // Add this helper function inside the component
  const getActionButtonIcon = (actionType: ActionType | undefined) => {
    switch (actionType) {
      case 'processMessage':
        return <Bot className="h-3 w-3 mr-1.5" />;
      case 'analyzeRequirements':
        return <SearchCheck className="h-3 w-3 mr-1.5" />;
      case 'generateEngagementPack':
        return <ClipboardSignature className="h-3 w-3 mr-1.5" />;
      case 'generateDeliveryTemplates':
        return <ClipboardList className="h-3 w-3 mr-1.5" />;
      case 'checkMadeDesigns':
        return <Palette className="h-3 w-3 mr-1.5" />;
      case 'generateRevision':
        return <RotateCcw className="h-3 w-3 mr-1.5" />;
      case 'generateDesignPrompts':
        return <Terminal className="h-3 w-3 mr-1.5" />;
      case 'generateEditingPrompts':
        return <Edit3 className="h-3 w-3 mr-1.5" />;
      case 'checkBestDesign':
        return <Trophy className="h-3 w-3 mr-1.5" />;
      case 'promptToReplicate':
        return <Copy className="h-3 w-3 mr-1.5" />;
      case 'promptWithCustomSense':
        return <Zap className="h-3 w-3 mr-1.5" />;
      case 'promptForMicroStockMarkets':
        return <ImageIcon className="h-3 w-3 mr-1.5" />;
      case 'search':
        return <Search className="h-3 w-3 mr-1.5" />;
      default:
        return <Bot className="h-3 w-3 mr-1.5" />;
    }
  };

  function ActionButton({ 
    actionType, 
    isEditing, 
    onActionChange 
  }: { 
    actionType?: ActionType, 
    isEditing: boolean, 
    onActionChange: (newType: ActionType) => void 
  }) {
    if (!actionType) return null;
    
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button 
            className="inline-flex items-center justify-center gap-2 whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 py-1.5 px-3 font-medium hover:shadow-lg text-xs rounded-full transition-all bg-gradient-to-r text-white shadow-md from-purple-500 to-pink-500 data-[state=open]:shadow-md"
            data-state="closed"
          >
            {getActionButtonIcon(actionType)}
            <span className="text-xs font-medium">{getActionTypeLabel(actionType)}</span>
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48 bg-background/95 dark:bg-zinc-900/95 backdrop-blur-lg border border-border shadow-lg rounded-lg z-50">
          <DropdownMenuLabel className="px-3 py-2 text-xs font-semibold text-muted-foreground">
            {shouldRegenerateOnActionChange ? 'Change & Regenerate' : 'Change Action Type'}
          </DropdownMenuLabel>
          <DropdownMenuSeparator className="bg-border h-px" />
          
          {/* Main menu items */}
          <DropdownMenuItem onClick={() => onActionChange('processMessage')} className="flex items-center gap-2 px-3 py-2 cursor-pointer hover:bg-muted/60 text-foreground">
            {getActionButtonIcon('processMessage')}
            <span className="text-sm">Chat</span>
          </DropdownMenuItem>
          
          <DropdownMenuItem onClick={() => onActionChange('analyzeRequirements')} className="flex items-center gap-2 px-3 py-2 cursor-pointer hover:bg-muted/60 text-foreground">
            {getActionButtonIcon('analyzeRequirements')}
            <span className="text-sm">Requirements</span>
          </DropdownMenuItem>
          
          <DropdownMenuItem onClick={() => onActionChange('generateEngagementPack')} className="flex items-center gap-2 px-3 py-2 cursor-pointer hover:bg-muted/60 text-foreground">
            {getActionButtonIcon('generateEngagementPack')}
            <span className="text-sm">Fiverr Brief</span>
          </DropdownMenuItem>
          
          <DropdownMenuItem onClick={() => onActionChange('generateRevision')} className="flex items-center gap-2 px-3 py-2 cursor-pointer hover:bg-muted/60 text-foreground">
            {getActionButtonIcon('generateRevision')}
            <span className="text-sm">Generate Revision Message</span>
          </DropdownMenuItem>

          {/* Design Tools submenu */}
          <DropdownMenuSub>
            <DropdownMenuSubTrigger className="flex items-center gap-2 px-3 py-2 cursor-pointer hover:bg-muted/60 text-foreground">
              <Palette className="h-4 w-4" />
              <span className="text-sm">Design Tools</span>
            </DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent className="min-w-[180px] bg-background/95 dark:bg-zinc-900/95 backdrop-blur-lg border border-border shadow-lg rounded-lg">
                <DropdownMenuItem onClick={() => onActionChange('generateDesignPrompts')} className="flex items-center gap-2 px-3 py-2 cursor-pointer hover:bg-muted/60 text-foreground">
                  <Terminal className="h-4 w-4 text-teal-500" />
                  <span className="text-sm">Generate AI Prompts</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onActionChange('checkBestDesign')} className="flex items-center gap-2 px-3 py-2 cursor-pointer hover:bg-muted/60 text-foreground">
                  <SearchCheck className="h-4 w-4 text-blue-500" />
                  <span className="text-sm">Check the best design</span>
                </DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>

          {/* Delivery Tools submenu */}
          <DropdownMenuSub>
            <DropdownMenuSubTrigger className="flex items-center gap-2 px-3 py-2 cursor-pointer hover:bg-muted/60 text-foreground">
              <Plane className="h-4 w-4" />
              <span className="text-sm">Delivery Tools</span>
            </DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent className="min-w-[180px] bg-background/95 dark:bg-zinc-900/95 backdrop-blur-lg border border-border shadow-lg rounded-lg">
                <DropdownMenuItem onClick={() => onActionChange('checkMadeDesigns')} className="flex items-center gap-2 px-3 py-2 cursor-pointer hover:bg-muted/60 text-foreground">
                  <SearchCheck className="h-4 w-4 text-amber-500" />
                  <span className="text-sm">Check Designs</span>
                  <span className="ml-auto text-xs text-red-400">Needs Image</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onActionChange('generateEditingPrompts')} className="flex items-center gap-2 px-3 py-2 cursor-pointer hover:bg-muted/60 text-foreground">
                  <ClipboardSignature className="h-4 w-4 text-amber-500" />
                  <span className="text-sm">Editing Prompts</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onActionChange('generateDeliveryTemplates')} className="flex items-center gap-2 px-3 py-2 cursor-pointer hover:bg-muted/60 text-foreground">
                  <ClipboardList className="h-4 w-4 text-amber-500" />
                  <span className="text-sm">Delivery Templates</span>
                </DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>

          {/* General Tools submenu */}
          <DropdownMenuSub>
            <DropdownMenuSubTrigger className="flex items-center gap-2 px-3 py-2 cursor-pointer hover:bg-muted/60 text-foreground">
              <Settings className="h-4 w-4" />
              <span className="text-sm">Tools</span>
            </DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent className="min-w-[220px] bg-background/95 dark:bg-zinc-900/95 backdrop-blur-lg border border-border shadow-lg rounded-lg">
                <DropdownMenuItem onClick={() => onActionChange('promptToReplicate')} className="flex items-center gap-2 px-3 py-2 cursor-pointer hover:bg-muted/60 text-foreground">
                  <Sparkles className="h-4 w-4 text-blue-500" />
                  <span className="text-sm">Prompt to Replicate</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onActionChange('promptWithCustomSense')} className="flex items-center gap-2 px-3 py-2 cursor-pointer hover:bg-muted/60 text-foreground">
                  <FileImage className="h-4 w-4 text-blue-500" />
                  <span className="text-sm">Prompt with Custom Change</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onActionChange('promptForMicroStockMarkets')} className="flex items-center gap-2 px-3 py-2 cursor-pointer hover:bg-muted/60 text-foreground">
                  <FileSpreadsheet className="h-4 w-4 text-blue-500" />
                  <span className="text-sm">Prompt for Micro Stock Markets (PMSM)</span>
                </DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  if (message.isLoading && !message.content) { // Skeleton for initial "Processing..."
    return (
      <div className={cn(
        "flex items-start w-full animate-slideUpSlightly",
        isUser ? "justify-end" : "justify-start"
      )}>
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
      </div>
    );
  }

  const messageTime = new Date(message.timestamp
    ).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const contentToRenderRaw = (typeof displayContent === 'string' && isUser) // Simple text for user message display (non-edit mode)
    ? [{ type: 'text' as const, text: displayContent }]
    : (message.isLoading && typeof message.content === 'string' && message.content.startsWith('Processing...')) // AI "Processing..." state
    ? [{ type: 'text' as const, text: message.content }]
    : (Array.isArray(displayContent) ? displayContent : [{ type: 'text' as const, text: String(displayContent) }]); // AI content parts or fallback

  // If a translation_group part exists, hydrate it with any standalone sections then filter redundant cards
  const hasTranslationGroup = contentToRenderRaw.some((p: any) => p && typeof p === 'object' && 'type' in p && p.type === 'translation_group');

  if (hasTranslationGroup) {
    // Grab reference to the translation_group object to mutate
    const translationPart: any = contentToRenderRaw.find((p: any) => p && typeof p === 'object' && p.type === 'translation_group');
    if (translationPart) {
      if (!translationPart.english) translationPart.english = {};
      if (!translationPart.bengali) translationPart.bengali = {};

      // Iterate over raw parts to capture English content & suggestions
      contentToRenderRaw.forEach((p: any) => {
        if (!p || typeof p !== 'object') return;

        // Capture text sections by title
        if (p.type === 'text' && 'title' in p && typeof p.title === 'string') {
          const titleLower = (p.title as string).toLowerCase();
          const textContent = (p as any).text;
          if (!textContent) return;

          if (titleLower.includes('analysis') && !translationPart.english.analysis) {
            translationPart.english.analysis = textContent;
          } else if (titleLower.includes('simplified request') && !translationPart.english.simplifiedRequest) {
            translationPart.english.simplifiedRequest = textContent;
          } else if (titleLower.includes('step-by-step approach') && !translationPart.english.stepByStepApproach) {
            translationPart.english.stepByStepApproach = textContent;
          } else if (titleLower.includes('bengali translation')) {
            // Attempt to split combined bengali translation into subsections
            const combinedText = textContent;
            const sectionRegexes: { key: keyof typeof translationPart.bengali; pattern: RegExp }[] = [
              { key: 'analysis', pattern: /(?:বিষ্লেষণ|বিশ্লেষণ|analysis)[:：]/i },
              { key: 'simplifiedRequest', pattern: /(?:সরলীকৃত\s+অনুরোধ|simplified\s+request)[:：]/i },
              { key: 'stepByStepApproach', pattern: /(?:ধাপে\s*-?\s*ধাপে\s*পদ্ধতি|step[- ]?by[- ]?step\s+approach)[:：]/i },
            ];
            const positions: { key: keyof typeof translationPart.bengali; index: number }[] = [];
            sectionRegexes.forEach(({ key, pattern }) => {
              const match = combinedText.match(pattern);
              if (match && typeof match.index === 'number') positions.push({ key, index: match.index });
            });
            if (positions.length > 0) {
              positions.sort((a, b) => a.index - b.index);
              for (let i = 0; i < positions.length; i++) {
                const { key, index } = positions[i];
                const endIdx = i + 1 < positions.length ? positions[i + 1].index : combinedText.length;
                const slice = combinedText.slice(index, endIdx).replace(/^[^:：]+[:：]/, '').trim();
                if (!translationPart.bengali[key]) {
                  translationPart.bengali[key] = slice;
                }
              }
            }
          }
        }

        // Capture suggested replies (list or dedicated type)
        if (p.type === 'list' && 'title' in p && typeof p.title === 'string' && (p.title as string).toLowerCase().includes('suggested replies') && Array.isArray((p as any).items)) {
          if (!translationPart.english.suggestions) {
            translationPart.english.suggestions = (p as any).items;
          }
        }

        if (p.type === 'suggested_replies' && (p as any).suggestions) {
          if ((p as any).suggestions.english && Array.isArray((p as any).suggestions.english) && !translationPart.english.suggestions) {
            translationPart.english.suggestions = (p as any).suggestions.english;
          }
          if ((p as any).suggestions.bengali && Array.isArray((p as any).suggestions.bengali) && !translationPart.bengali.suggestions) {
            translationPart.bengali.suggestions = (p as any).suggestions.bengali;
          }
        }

        // Capture list sections by title
        if (p.type === 'list' && 'title' in p && typeof p.title === 'string' && Array.isArray((p as any).items)) {
          const titleLower = (p.title as string).toLowerCase();
          const items = (p as any).items;
          
          if (titleLower.includes('key points')) {
            if (!translationPart.english.keyPoints) translationPart.english.keyPoints = items;
          } else if (titleLower.includes('মূল বিষয়') || titleLower.includes('key points bengali')) {
            if (!translationPart.bengali.keyPoints) translationPart.bengali.keyPoints = items;
          } else if (titleLower.includes('suggested replies')) {
            if (!translationPart.english.suggestions) translationPart.english.suggestions = items;
          }
        }
      });

      // Post-process: if bengali.analysis contains other sections, split them out
      if (translationPart.bengali && typeof translationPart.bengali.analysis === 'string') {
        const analysisText: string = translationPart.bengali.analysis;
        // Only attempt split if other fields are missing
        const missingSimplified = !translationPart.bengali.simplifiedRequest;
        const missingApproach = !translationPart.bengali.stepByStepApproach;
        if (missingSimplified || missingApproach) {
          const simpRegex = /(?:সরলীকৃত\s+অনুরোধ|simplified\s+request)[:：]/i;
          const stepRegex = /(?:ধাপে\s*-?\s*ধাপে\s*পদ্ধতি|step[- ]?by[- ]?step\s+approach)[:：]/i;

          const simpMatch = analysisText.match(simpRegex);
          const stepMatch = analysisText.match(stepRegex);

          // Determine slice boundaries
          const indices: { key: 'simplifiedRequest' | 'stepByStepApproach'; index: number }[] = [];
          if (simpMatch && typeof simpMatch.index === 'number') indices.push({ key: 'simplifiedRequest', index: simpMatch.index });
          if (stepMatch && typeof stepMatch.index === 'number') indices.push({ key: 'stepByStepApproach', index: stepMatch.index });

          if (indices.length > 0) {
            indices.sort((a, b) => a.index - b.index);
            let trimmedAnalysis = analysisText;
            for (let i = 0; i < indices.length; i++) {
              const { key, index } = indices[i];
              const endIdx = i + 1 < indices.length ? indices[i + 1].index : analysisText.length;
              const slice = analysisText.slice(index, endIdx).replace(/^[^:：]+[:：]/, '').trim();
              translationPart.bengali[key] = slice;

              // Remove from analysis
              trimmedAnalysis = trimmedAnalysis.replace(analysisText.slice(index, endIdx), '').trim();
            }
            translationPart.bengali.analysis = trimmedAnalysis.trim();
          }
        }
      }
    }
  }

  // After hydrating, build filtered list removing redundant top-level cards
  const redundantTitles = ['Analysis', 'Simplified Request', 'Step-by-Step Approach', 'Bengali Translation', 'Suggested Replies', 'Key Points', 'মূল বিষয়'];
  const contentToRender = hasTranslationGroup
    ? contentToRenderRaw.filter((p: any) => {
        if (!p || typeof p !== 'object') return true;
        // Remove explicit suggested_replies parts entirely
        if ('type' in p && p.type === 'suggested_replies') return false;

        if ('type' in p && (p.type === 'text' || p.type === 'list' || p.type === 'code')) {
          if ('title' in p && p.title && redundantTitles.includes(String(p.title))) {
            return false; // skip redundant card
          }
        }
        return true;
      })
    : contentToRenderRaw;

  const messageText = getMessageText(displayContent);
  const isLongMessage = messageText.split('\n').length > 2 || messageText.length > 200;

  // Handle clicking a suggested reply button from assistant messages
  const handleSuggestionClick = useCallback((suggestion: string, lang: 'en' | 'bn') => {
    if (!onConfirmEditAndResend) return;
    // Only send the clicked suggestion as a fresh user message to avoid duplication
    const combined = suggestion;
    const targetUserMessageId = message.promptedByMessageId ?? message.id;
    const attachments = message.originalRequest?.attachedFilesData || message.attachedFiles;
    const actionType = message.originalRequest?.actionType || message.actionType;
    onConfirmEditAndResend(targetUserMessageId, combined, attachments, actionType);
  }, [onConfirmEditAndResend, message.originalRequest, message.attachedFiles, message.actionType, message.promptedByMessageId, message.id, currentUserMessage]);

  return (
    <div className={cn(
        "flex items-start w-full animate-slideUpSlightly hover:shadow-sm transition-all duration-300",
        isUser ? 'justify-end gap-0' : 'justify-start gap-0'
      )}
    >
      {isUser ? (
        <div className={cn(
          "group rounded-lg border backdrop-blur-sm shadow transition-all duration-300 w-full", // Added w-full here
          isEditingThisMessage ? "bg-card/80 border-primary/20" : "bg-card/50 border-primary/20",
          message.isError ? "border-destructive/30" : ""
        )}>
          <div className="px-4 py-3 flex items-start gap-3 w-full"> {/* Added w-full here */}
            <div className="flex-shrink-0 mt-1">
              <User className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-grow min-w-0 w-full"> {/* Added w-full here */}
              <div className="flex justify-between items-start w-full"> {/* Added w-full here */}
                <div className="flex items-center mb-2 gap-2">
                  <span className="font-medium text-sm text-muted-foreground">You</span>
                  <TooltipProvider>
                    <div className="flex items-center gap-1.5 border border-primary/20 rounded-full p-1 bg-primary/5">
                      <Tooltip>
                        <TooltipTrigger asChild>
                           <div onClick={(e) => e.preventDefault()}>
                            <ActionButton 
                              actionType={message.actionType || 'processMessage'} 
                              isEditing={isEditingThisMessage} 
                              onActionChange={handleActionTypeChange}
                            />
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Select Action Type</p>
                        </TooltipContent>
                      </Tooltip>
                      <Select value={currentModelId} onValueChange={setCurrentModelIdAction} disabled={isEditingThisMessage}>
                        <SelectTrigger className="inline-flex items-center justify-center gap-2 whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 h-7 px-4 leading-none text-xs font-medium rounded-full hover:shadow-lg transition-all bg-gradient-to-r text-white shadow-md from-purple-500 to-pink-500 data-[state=open]:shadow-md">
                          <Bot className="h-3 w-3 mr-1.5" />
                          <SelectValue placeholder="Model" />
                        </SelectTrigger>
                        <SelectContent>
                          {AVAILABLE_MODELS.map(model => (
                            <SelectItem key={model.id} value={model.id}>{model.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {isUser && !isEditingThisMessage && (
                        <>
                          {onConfirmEditAndResend && (
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={handleStartEdit}
                                  className="group text-primary hover:text-primary hover:bg-primary/10 transition-all duration-300 rounded-full"
                                >
                                  <Edit3 className="h-4 w-4 mr-2 transition-all duration-300" />
                                  <span>Edit & Resend</span>
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Edit and resend this message</p>
                              </TooltipContent>
                            </Tooltip>
                          )}
                        </>
                      )}
                    </div>
                  </TooltipProvider>
                </div>
              </div>
              
              {isEditingThisMessage ? (
                <div className="space-y-2 relative z-10 w-full">
            <Textarea
              value={editedText}
              onChange={(e) => setEditedText(e.target.value)}
              className="w-full resize-none min-h-[60px] bg-background/70 text-foreground focus-visible:ring-primary"
              rows={Math.max(2, editedText.split('\n').length)}
            />
                  
                  {/* Updated attachment section for edit mode */}
                  <div className="mt-2 w-full"> {/* Added w-full here */}
                    {editedAttachments.length > 0 && (
                      <div className="mt-1 mb-3 glass-panel bg-background/80 p-3 rounded-xl border border-primary/10 shadow-md animate-fade-in w-full"> {/* Added w-full here */}
                        <div className="flex items-center justify-between mb-2 w-full"> {/* Added w-full here */}
                          <span className="text-xs font-medium text-primary-foreground/80">
                            Attached files:
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 text-destructive/80 hover:text-destructive hover:bg-destructive/10 transition-all duration-300 rounded-full"
                            onClick={clearAttachments}
                          >
                            <X className="h-3.5 w-3.5 mr-1" /> Clear
                          </Button>
                        </div>
                        
                        <div className="font-size-0 whitespace-nowrap" style={{ fontSize: 0, lineHeight: 0 }}>
                          {editedAttachments.map((file, index) => (
                            <div 
                              key={index} 
                              className="inline-block align-top whitespace-normal w-20"
                              style={{ margin: 0, padding: 0 }}
                            >
                              <div className="group relative aspect-square overflow-hidden rounded-md border border-primary/10 hover:border-primary/30 transition-all duration-300">
                                {file.type?.startsWith('image/') && file.dataUri ? (
                                  <>
                                    <Image
                                      src={file.dataUri}
                                      alt={file.name}
                                      fill
                                      className="object-cover object-center group-hover:scale-105 transition-transform duration-300"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                  </>
                                ) : file.type?.startsWith('text/') ? (
                                  <div className="flex items-center justify-center h-full bg-muted/20">
                                    <FileText className="h-5 w-5 text-secondary" />
                                  </div>
                                ) : (
                                  <div className="flex items-center justify-center h-full bg-muted/20">
                                    <Paperclip className="h-5 w-5 text-info" />
                                  </div>
                                )}
                                <button 
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    removeAttachment(index);
                                  }}
                                  className="absolute top-0 right-0 bg-destructive/80 hover:bg-destructive text-destructive-foreground rounded-bl-md p-0.5 opacity-100 transition-opacity duration-300 z-10" // Changed from opacity-0 group-hover:opacity-100 to just opacity-100
                                >
                                  <X className="h-3.5 w-3.5" />
                                </button>
                                <div className="absolute bottom-0 left-0 right-0 p-0.5 text-[8px] bg-background/80 backdrop-blur-sm truncate opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                  {file.name.length > 10 ? file.name.substring(0, 8) + '...' : file.name}
                                </div>
                              </div>
                  </div>
                ))}
                        </div>
              </div>
            )}
                  </div>
                  
                  <div className="flex items-center justify-between mt-2 w-full"> {/* Added w-full here */}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => fileInputRef.current?.click()}
                      className="h-7 text-primary hover:text-primary hover:bg-primary/10 rounded-full transition-all duration-300"
                    >
                      <Paperclip className="h-3.5 w-3.5 mr-1" /> Add files
                    </Button>
                    <input 
                      type="file" 
                      ref={fileInputRef} 
                      multiple 
                      onChange={handleFileChange} 
                      className="hidden" 
                      accept="image/*,application/pdf,.txt,.md,.json"
                    />
                    
                    <div className="flex justify-end gap-2">
                      <Select value={currentModelId} onValueChange={setCurrentModelIdAction}>
                        <SelectTrigger className="inline-flex items-center justify-center gap-2 whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 h-7 px-4 leading-none text-xs font-medium rounded-full hover:shadow-lg transition-all bg-gradient-to-r text-white shadow-md from-purple-500 to-pink-500 data-[state=open]:shadow-md">
                          <Bot className="h-3 w-3 mr-1.5" />
                          <SelectValue placeholder="Model" />
                        </SelectTrigger>
                        <SelectContent>
                          {AVAILABLE_MODELS.map(model => (
                            <SelectItem key={model.id} value={model.id}>{model.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <div className="flex gap-2">
                        <Button variant="default" size="sm" onClick={handleCancelEdit} className="inline-flex items-center justify-center gap-2 h-7 px-4 leading-none text-xs font-medium rounded-full bg-gradient-to-r from-red-500 to-orange-500 text-white shadow-md hover:shadow-lg transition-all">
                          <X className="h-4 w-4 mr-1" /> Cancel
                        </Button>
                        <Button variant="default" size="sm" onClick={handleSaveAndSendEdited} className="inline-flex items-center justify-center gap-2 h-7 px-4 leading-none text-xs font-medium rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md hover:shadow-lg transition-all">
                          <Send className="h-4 w-4 mr-1" /> Save & Send
                        </Button>
                      </div>
            </div>
              </div>
            </div>
          ) : (
            <div className="stagger-animation relative z-10 w-full overflow-x-auto">
               <div
                className="relative overflow-hidden transition-all duration-500 ease-in-out"
                style={{ maxHeight: isLongMessage && !isExpanded ? '80px' : `${contentRef.current?.scrollHeight}px` }}
              >
                <div ref={contentRef}>
                  {contentToRender.map((part, index) =>
                    <RenderContentPart part={part} index={index} key={`${message.id}-part-${index}`} searchHighlightTerm={searchHighlightTerm} onSuggestionClick={handleSuggestionClick} />
                  )}
                </div>
                {isLongMessage && !isExpanded && (
                  <div className="absolute bottom-0 left-0 w-full h-12 bg-gradient-to-t from-card to-transparent pointer-events-none"></div>
                )}
              </div>

              {isLongMessage && (
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="text-primary hover:underline text-sm mt-2 flex items-center gap-1 font-medium"
                >
                  <span>{isExpanded ? 'Show Less' : 'Show More'}</span>
                  <ChevronDown className={cn("h-4 w-4 transition-transform duration-300", isExpanded && "rotate-180")} />
                </button>
              )}
            </div>
              )}

        {displayAttachments && displayAttachments.length > 0 && !isEditingThisMessage && (
                <div className="mt-3 relative z-10 w-full"> {/* Added w-full here */}
                  <div className="text-xs font-medium px-2 py-0.5 rounded-full w-fit mb-2 bg-primary/10 text-primary">
              <span>
                {displayAttachments.length} {displayAttachments.length === 1 ? 'Attachment' : 'Attachments'}
              </span>
            </div>
            <div className="font-size-0 whitespace-nowrap" style={{ fontSize: 0, lineHeight: 0 }}>
              {displayAttachments.map((file, index) => (
                <div 
                  key={`${file.name}-${file.size || 0}-${index}`} 
                  className="inline-block align-top whitespace-normal w-24 animate-stagger" 
                  style={{ margin: 0, padding: 0, animationDelay: `${index * 50}ms` }}
                >
                  <AttachedFileDisplay file={file} userId={profile?.userId} />
                </div>
              ))}
            </div>
          </div>
        )}

              {/* Add back the history navigation buttons */}
              {!isEditingThisMessage && hasEditHistory && (
                <div className="flex items-center gap-2 mt-3 pt-2 border-t border-primary/10">
                  <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                      className="h-7 w-7 text-primary/70 hover:bg-primary/10"
                  onClick={handlePrevHistory}
                  disabled={currentHistoryViewIndex === 0}
                  title="Previous edit"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                    <span className="text-xs text-primary/80">
                  {currentHistoryViewIndex === null ? 1 : currentHistoryViewIndex + 1} / {totalVersions}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                      className="h-7 w-7 text-primary/70 hover:bg-primary/10"
                  onClick={handleNextHistory}
                  disabled={currentHistoryViewIndex === null}
                  title="Next edit / Current version"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
                  </div>
              </div>
            )}
            </div>
          </div>
        </div>
      ) : (
        <div className={cn(
          "relative flex flex-col gap-3 rounded-2xl p-5 shadow-lg text-sm transition-all duration-300",
          "w-full max-w-full overflow-hidden", 
          'bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30 backdrop-blur-sm border border-emerald-200 dark:border-emerald-800/50 rounded-tl-none',
          message.isError ? 'border-destructive border-2' : ''
        )}
      >
        <div className={cn(
          "absolute inset-0 rounded-2xl opacity-30",
          "bg-gradient-to-br from-emerald-200/30 to-teal-300/30 dark:from-emerald-700/10 dark:to-teal-700/10 blur-md"
        )}></div>
        
        <div className="flex justify-between items-center mb-2 relative z-10">
          {message.isError && !isEditingThisMessage && (
            <div className="flex items-center gap-2 text-destructive bg-destructive/10 px-2 py-1 rounded-full animate-pulse-slow">
              <AlertTriangle className="h-4 w-4" />
              <span className="font-medium text-xs">Error processing request</span>
            </div>
          )}
        </div>

        {message.isLoading ? (
          <div className="relative z-10 whitespace-pre-wrap animate-pulse-slow glass-panel bg-background/40 p-3 rounded-xl border border-primary/10 shadow-inner">
            <div className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin text-primary" />
              <p>{typeof message.content === 'string' ? message.content : 'Processing...'}</p>
            </div>
          </div>
        ) : (
          <div className="stagger-animation relative z-10 w-full overflow-x-auto">
            {contentToRender.map((part, index) =>
              <RenderContentPart part={part} index={index} key={`${message.id}-part-${index}`} searchHighlightTerm={searchHighlightTerm} onSuggestionClick={handleSuggestionClick} />
            )}
          </div>
        )}

        {displayAttachments && displayAttachments.length > 0 && !isEditingThisMessage && (
          <div className="mt-3 relative z-10 w-full">
            <div className={cn(
                "text-xs font-medium px-2 py-0.5 rounded-full w-fit mb-2",
                "bg-emerald-100/80 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-200"
              )}>
              <span>
                {displayAttachments.length} {displayAttachments.length === 1 ? 'Attachment' : 'Attachments'}
              </span>
            </div>
            <div className="font-size-0 whitespace-nowrap" style={{ fontSize: 0, lineHeight: 0 }}>
              {displayAttachments.map((file, index) => (
                <div 
                  key={`${file.name}-${file.size || 0}-${index}`} 
                  className="inline-block align-top whitespace-normal w-24 animate-stagger" 
                  style={{ margin: 0, padding: 0, animationDelay: `${index * 50}ms` }}
                >
                  <AttachedFileDisplay file={file} userId={profile?.userId} />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons and Regenerate Area */}
        {!isEditingThisMessage && (
          <div className={cn(
            "mt-0 pt-0 border-0 flex justify-between items-center gap-3 animate-fade-in relative z-10",
            "bg-transparent"
          )} style={{ animationDelay: '0.5s' }}>
            {isAssistant && message.originalRequest && onPerformAction && (
              <ActionButtonsPanel
                onAction={(actionType) => onPerformAction(message.originalRequest!, actionType)}
                isLoading={isLoading}
                currentUserMessage={currentUserMessage}
                profile={profile}
                currentAttachedFilesDataLength={currentAttachedFilesDataLength}
                isMobile={isMobile}
                activeButton={activeActionButton}
                lastSelectedButton={lastSelectedActionButton}
                flat
              />
            )}
            <div></div>
            <div className="flex items-center gap-3">
              <span className="text-xs text-muted-foreground">{messageTime}</span>
              {isAssistant && message.canRegenerate && message.originalRequest && onRegenerate && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleRegenerateClick}
                        className="transition-all duration-200 hover:bg-primary/10 hover:border-primary/50"
                        aria-label="Regenerate this response"
                      >
                        <RotateCcw className="h-4 w-4 mr-2" />
                        Regenerate
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Regenerate Response</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
              {isAssistant && message.isLoading && onStopRegeneration && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onStopRegeneration(message.id)}
                  className="text-xs backdrop-blur-sm border border-red-300/20 shadow-sm hover:shadow-md hover:scale-105 text-red-700 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 hover:bg-red-100/50 dark:hover:bg-red-900/30 transition-all duration-300"
                  title="Stop regeneration"
                >
                  <X className="h-3.5 w-3.5 mr-1.5" />
                  Stop
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
      )}
    </div>
  );
}
