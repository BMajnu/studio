'use client';

import type { ChatMessage, MessageRole, ChatMessageContentPart, AttachedFile } from '@/lib/types';
import { Bot, User, AlertTriangle, Paperclip, FileText, Image as ImageIcon, RotateCcw, Loader2, Edit3, Send, X, ChevronLeft, ChevronRight, CircleCheck, Copy, FolderOpen, Plus, PlusCircle, Zap, Check } from 'lucide-react';
import { TopDesignsResults } from './top-designs-results';
import { CopyToClipboard, CopyableText, CopyableList } from '@/components/copy-to-clipboard';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import React, { useState, useEffect, useCallback } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface ChatMessageProps {
  message: ChatMessage;
  onRegenerate?: (requestDetails: ChatMessage['originalRequest'] & { messageIdToRegenerate: string }) => void;
  onConfirmEditAndResend?: (messageId: string, newContent: string, originalAttachments?: AttachedFile[]) => void;
  onStopRegeneration?: (messageId: string) => void;
}

function AttachedFileDisplay({ file }: { file: AttachedFile }) {
  return (
    <div className="group mt-1 p-3 border border-primary/10 rounded-xl glass-panel bg-background/40 backdrop-blur-md text-xs flex items-center gap-3 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 animate-fade-in">
      <div className="relative">
        <div className="absolute inset-0 rounded-full blur-sm bg-primary/20 opacity-50 group-hover:opacity-80 transition-opacity duration-300"></div>
        {file.type.startsWith('image/') && file.dataUri ? (
          <div className="relative z-10 flex items-center gap-2">
            <ImageIcon className="h-4 w-4 text-primary" />
            <div className="rounded-md overflow-hidden ring-1 ring-primary/30 shadow-sm">
              <Image src={file.dataUri} alt={file.name} width={40} height={40} className="rounded-md object-cover hover:scale-110 transition-transform duration-300"/>
            </div>
          </div>
        ) : file.type.startsWith('text/') ? (
          <FileText className="h-4 w-4 text-secondary relative z-10" />
        ) : (
          <Paperclip className="h-4 w-4 text-info relative z-10" />
        )}
      </div>
      <div className="flex flex-col">
        <span className="truncate font-medium text-sm" title={file.name}>{file.name}</span>
        {file.size && (
          <span className="text-muted-foreground/80 text-[10px] bg-muted/50 px-2 py-0.5 rounded-full w-fit mt-1 group-hover:bg-primary/10 transition-colors duration-300">
            {(file.size / 1024).toFixed(1)} KB
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
    // Attempt to get the first text part, or join all text parts.
    // This might need refinement based on how user messages are structured.
    // For user messages, content is often expected to be a simple string.
    const textParts = content.filter(part => part.type === 'text' && part.text);
    if (textParts.length > 0) {
      return textParts.map(part => part.text).join('\n');
    }
  }
  return ''; // Fallback for complex or empty content
};

// Add this helper function for Markdown processing
const processMarkdown = (text: string) => {
  // Process bold text (surrounded by **)
  return text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
};

function RenderContentPart({ part, index }: { part: ChatMessageContentPart; index: number }) {
  const animationDelay = `${index * 80}ms`;
  const commonClasses = "animate-slideUpAndFade rounded-lg w-full mb-3";
  const { toast } = useToast();
  
  const [copyState, setCopyState] = useState<{[key: string]: boolean}>({});
  
  const handleCopyToClipboard = useCallback((text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopyState(prev => ({ ...prev, [id]: true }));
    toast({
      title: "Copied to clipboard",
      description: "The prompt has been copied to your clipboard.",
    });
    
    setTimeout(() => {
      setCopyState(prev => ({ ...prev, [id]: false }));
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
          titleEmoji = '🔍';
          gradientClass = 'bg-gradient-to-r from-blue-500 to-indigo-600';
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
                dangerouslySetInnerHTML={{ __html: processMarkdown(part.title) }}
              />
            </div>
            {part.text && (
              <div className="px-4 py-3">
                <p 
                  className="whitespace-pre-wrap leading-relaxed" 
                  dangerouslySetInnerHTML={{ __html: processMarkdown(part.text) }}
                />
              </div>
            )}
          </div>
        );
      }
      return (
        <p 
          key={index} 
          className="whitespace-pre-wrap leading-relaxed w-full animate-slideUpSlightly" 
          style={{ animationDelay }}
          dangerouslySetInnerHTML={{ __html: part.text ? processMarkdown(part.text) : '' }}
        />
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
    
    case 'translation_group':
      return (
        <Card key={index} className={cn(commonClasses, "shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-background/95 to-muted/50 backdrop-blur-sm")} style={{ animationDelay }}>
          <CardHeader className="py-2 px-4">
            <CardTitle className="text-sm font-semibold text-gradient flex items-center">
              <span className="mr-2 text-lg">🌐</span> {part.title || 'Translation Group'}
            </CardTitle>
          </CardHeader>
          <CardContent className="py-2 px-4 space-y-2">
            {part.bengali?.analysis && (
              <div className="bg-primary/5 rounded-lg p-3">
                <h5 className="text-sm font-medium mb-1">বিশ্লেষণ (Analysis in Bengali)</h5>
                <p className="whitespace-pre-wrap text-sm">{part.bengali.analysis}</p>
              </div>
            )}
            {part.bengali?.simplifiedRequest && (
              <div className="bg-secondary/5 rounded-lg p-3">
                <h5 className="text-sm font-medium mb-1">সরলীকৃত অনুরোধ (Simplified Request in Bengali)</h5>
                <p className="whitespace-pre-wrap text-sm">{part.bengali.simplifiedRequest}</p>
              </div>
            )}
            {part.bengali?.stepByStepApproach && (
              <div className="bg-accent/5 rounded-lg p-3">
                <h5 className="text-sm font-medium mb-1">ধাপে ধাপে পদ্ধতি (Step-by-Step Approach in Bengali)</h5>
                <p className="whitespace-pre-wrap text-sm">{part.bengali.stepByStepApproach}</p>
              </div>
            )}
          </CardContent>
        </Card>
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
              <span dangerouslySetInnerHTML={{ __html: processMarkdown(part.title) }} />
            </h3>
          )}
          
          {part.text && (
            <div className="whitespace-pre-wrap leading-relaxed pt-1">
              <div className="bg-background/50 p-3 rounded-lg border border-accent/10 shadow-inner">
                <div dangerouslySetInnerHTML={{ __html: processMarkdown(part.text) }} />
              </div>
            </div>
          )}
        </div>
      );
      
    case 'suggested_replies':
      return (
        <div key={index} className={cn(commonClasses, "space-y-3")} style={{ animationDelay }}>
          {part.title && <h4 className="font-semibold mb-2 text-base text-gradient">{part.title}</h4>}
          
          {part.suggestions?.english && part.suggestions.english.length > 0 && (
            <div className="space-y-2">
              {part.suggestions.english.map((reply, i) => (
                <CopyToClipboard 
                  key={`eng-reply-${i}`} 
                  textToCopy={reply} 
                  title={`English Reply ${i + 1}`}
                  className="shadow-lg hover:shadow-xl transition-all duration-300 bg-primary/5 hover:bg-primary/10" 
                />
              ))}
            </div>
          )}
          
          {part.suggestions?.bengali && part.suggestions.bengali.length > 0 && (
            <div className="space-y-2 mt-3">
              {part.suggestions.bengali.map((reply, i) => (
                <CopyToClipboard 
                  key={`bng-reply-${i}`} 
                  textToCopy={reply} 
                  title={`Bengali Reply ${i + 1}`}
                  className="shadow-lg hover:shadow-xl transition-all duration-300 bg-secondary/5 hover:bg-secondary/10" 
                />
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
              <h4 className="font-semibold text-base" dangerouslySetInnerHTML={{ __html: processMarkdown(part.title) }} />
            </div>
          )}
          {part.text && (
            <div className="px-4 py-3 space-y-3">
              {/* Split the content into sections by double line breaks and process each */}
              {part.text.split('\n\n').map((section, sectionIndex) => {
                // Check if this is a section header (starts with **)
                if (section.startsWith('**') && section.includes(':**')) {
                  const [header, ...content] = section.split('\n');
                  return (
                    <div key={sectionIndex} className="mb-4">
                      <h5 className="text-indigo-700 dark:text-indigo-400 font-medium mb-2" 
                          dangerouslySetInnerHTML={{ __html: processMarkdown(header) }} />
                      <div className="pl-4 border-l-2 border-indigo-200 dark:border-indigo-800">
                        {content.map((line, lineIndex) => (
                          <p key={lineIndex} className="text-slate-700 dark:text-slate-300 mb-1" 
                             dangerouslySetInnerHTML={{ __html: processMarkdown(line) }} />
                        ))}
                      </div>
                    </div>
                  );
                }
                
                // Handle numbered lists (check if starts with number and period)
                else if (/^\d+\./.test(section)) {
                  return (
                    <div key={sectionIndex} className="mb-4 pl-2">
                      <ul className="list-decimal pl-5 space-y-2">
                        {section.split('\n').map((item, itemIndex) => {
                          const listContent = item.replace(/^\d+\.\s+/, '');
                          return (
                            <li key={itemIndex} className="text-slate-700 dark:text-slate-300" 
                                dangerouslySetInnerHTML={{ __html: processMarkdown(listContent) }} />
                          );
                        })}
                      </ul>
                    </div>
                  );
                }
                
                // Regular paragraph
                else {
                  return (
                    <p key={sectionIndex} className="text-slate-700 dark:text-slate-300" 
                       dangerouslySetInnerHTML={{ __html: processMarkdown(section) }} />
                  );
                }
              })}
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
              <h4 className="font-semibold text-lg" dangerouslySetInnerHTML={{ __html: processMarkdown(part.title) }} />
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
              
              <div className="p-4 space-y-6">
                {group.items.map((idea, ideaIndex) => (
                  <div key={ideaIndex} className="pb-4 mb-4 border-b border-slate-200 dark:border-slate-700 last:border-0 last:mb-0 last:pb-0">
                    {/* Split the content into sections by double line breaks and process each */}
                    {idea.split('\n\n').map((section, sectionIndex) => {
                      // Check if this is a section header (starts with **)
                      if (section.startsWith('**') && section.includes(':**')) {
                        const [header, ...content] = section.split('\n');
                        return (
                          <div key={sectionIndex} className="mb-4">
                            <h5 className="text-indigo-700 dark:text-indigo-400 font-medium mb-2" 
                                dangerouslySetInnerHTML={{ __html: processMarkdown(header) }} />
                            <div className="pl-4 border-l-2 border-indigo-200 dark:border-indigo-800">
                              {content.map((line, lineIndex) => (
                                <p key={lineIndex} className="text-slate-700 dark:text-slate-300 mb-1" 
                                  dangerouslySetInnerHTML={{ __html: processMarkdown(line) }} />
                              ))}
                            </div>
                          </div>
                        );
                      }
                      
                      // Handle numbered lists (check if starts with number and period)
                      else if (/^\d+\./.test(section)) {
                        return (
                          <div key={sectionIndex} className="mb-4 pl-2">
                            <ul className="list-decimal pl-5 space-y-2">
                              {section.split('\n').map((item, itemIndex) => {
                                const listContent = item.replace(/^\d+\.\s+/, '');
                                return (
                                  <li key={itemIndex} className="text-slate-700 dark:text-slate-300" 
                                      dangerouslySetInnerHTML={{ __html: processMarkdown(listContent) }} />
                                );
                              })}
                            </ul>
                          </div>
                        );
                      }
                      
                      // Regular paragraph
                      else {
                        return (
                          <p key={sectionIndex} className="text-slate-700 dark:text-slate-300" 
                            dangerouslySetInnerHTML={{ __html: processMarkdown(section) }} />
                        );
                      }
                    })}
                  </div>
                ))}
              </div>
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
                <TabsTrigger value="exact" className="data-[state=active]:bg-gradient-to-br data-[state=active]:from-blue-500 data-[state=active]:to-indigo-600 data-[state=active]:text-white">
                  <span className="mr-1.5">🎯</span> Exact Replication
                </TabsTrigger>
                <TabsTrigger value="similar" className="data-[state=active]:bg-gradient-to-br data-[state=active]:from-violet-500 data-[state=active]:to-purple-600 data-[state=active]:text-white">
                  <span className="mr-1.5">✏️</span> Similar with Tweaks
                </TabsTrigger>
                <TabsTrigger value="niche" className="data-[state=active]:bg-gradient-to-br data-[state=active]:from-emerald-500 data-[state=active]:to-teal-600 data-[state=active]:text-white">
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
                      className="data-[state=active]:bg-gradient-to-br data-[state=active]:text-white data-[state=active]:from-purple-500 data-[state=active]:to-pink-600"
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
                        className="py-1 px-0 md:py-1.5 data-[state=active]:bg-gradient-to-br data-[state=active]:text-white data-[state=active]:from-cyan-500 data-[state=active]:to-teal-600 data-[state=active]:shadow-md transition-all duration-300 relative"
                      >
                        <span className="block md:hidden text-xs">P{resultIndex + 1}</span>
                        <span className="hidden md:block text-sm">Prompt {resultIndex + 1}</span>
                        <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-l-transparent border-r-4 border-r-transparent border-t-4 border-cyan-600 opacity-0 data-[state=active]:opacity-100 transition-opacity duration-300"></div>
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
                            className="py-1 px-0 md:py-1.5 data-[state=active]:bg-gradient-to-br data-[state=active]:text-white data-[state=active]:from-cyan-500 data-[state=active]:to-teal-600 data-[state=active]:shadow-md transition-all duration-300 relative"
                          >
                            <span className="block md:hidden text-xs">P{actualIndex + 1}</span>
                            <span className="hidden md:block text-sm">Prompt {actualIndex + 1}</span>
                            <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-l-transparent border-r-4 border-r-transparent border-t-4 border-cyan-600 opacity-0 data-[state=active]:opacity-100 transition-opacity duration-300"></div>
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
                            className="flex-1 py-1.5 md:py-2 rounded-none data-[state=active]:bg-gradient-to-r data-[state=active]:from-teal-500 data-[state=active]:to-teal-600 data-[state=active]:text-white data-[state=inactive]:bg-muted/30 transition-all duration-300"
                          >
                            Prompt
                          </TabsTrigger>
                          <TabsTrigger 
                            value="metadata" 
                            className="flex-1 py-1.5 md:py-2 rounded-none data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500 data-[state=active]:to-cyan-600 data-[state=active]:text-white data-[state=inactive]:bg-muted/30 transition-all duration-300"
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

    default:
      return null;
  }
}

export function ChatMessageDisplay({ message, onRegenerate, onConfirmEditAndResend, onStopRegeneration }: ChatMessageProps) {
  const [isEditingThisMessage, setIsEditingThisMessage] = useState(false);
  const [editedText, setEditedText] = useState('');
  
  // State for viewing edit history
  const [currentHistoryViewIndex, setCurrentHistoryViewIndex] = useState<number | null>(null);

  const isUser = message.role === 'user';
  const isAssistant = message.role === 'assistant';

  // Determine content and attachments to display based on edit history view
  const hasEditHistory = isUser && message.editHistory && message.editHistory.length > 0;
  const totalVersions = (message.editHistory?.length || 0) + 1; // +1 for the current version

  let displayContent: string | ChatMessageContentPart[];
  let displayAttachments: AttachedFile[] | undefined;

  if (isUser && hasEditHistory && currentHistoryViewIndex !== null) {
    const historyEntry = message.editHistory![currentHistoryViewIndex];
    displayContent = historyEntry.content;
    displayAttachments = historyEntry.attachedFiles;
  } else {
    displayContent = message.content;
    displayAttachments = message.attachedFiles;
  }

  // Convert displayContent to simple string for Textarea if user message
  const displayContentString = isUser ? getMessageText(displayContent) : '';

  useEffect(() => {
    if (isEditingThisMessage) {
      // When entering edit mode, populate with the currently viewed content
      setEditedText(displayContentString);
    }
  }, [isEditingThisMessage, displayContentString]);

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

  const handleRegenerateClick = () => {
    if (onRegenerate && message.originalRequest && message.id) {
      onRegenerate({ ...message.originalRequest, messageIdToRegenerate: message.id });
    }
  };

  const handleStartEdit = () => {
    setIsEditingThisMessage(true);
    // `editedText` is set by the useEffect hook above
  };

  const handleCancelEdit = () => {
    setIsEditingThisMessage(false);
  };

  const handleSaveAndSendEdited = () => {
    if (onConfirmEditAndResend) {
      // Note: We send the `message.id` of the original message being edited.
      // `onConfirmEditAndResend` in ChatPage.tsx will handle pushing the *current message.content* to editHistory
      // and then updating message.content with editedText.
      onConfirmEditAndResend(message.id, editedText, displayAttachments); // Pass current displayAttachments
    }
    setIsEditingThisMessage(false);
    setCurrentHistoryViewIndex(null); // Reset to view current version after edit
  };

  const handlePrevHistory = () => {
    if (!hasEditHistory) return;
    if (currentHistoryViewIndex === null) { // Viewing current, go to last edit
      setCurrentHistoryViewIndex((message.editHistory?.length || 0) - 1);
    } else if (currentHistoryViewIndex > 0) {
      setCurrentHistoryViewIndex(currentHistoryViewIndex - 1);
    }
  };

  const handleNextHistory = () => {
    if (!hasEditHistory) return;
    if (currentHistoryViewIndex !== null && currentHistoryViewIndex < (message.editHistory?.length || 0) - 1) {
      setCurrentHistoryViewIndex(currentHistoryViewIndex + 1);
    } else if (currentHistoryViewIndex !== null && currentHistoryViewIndex === (message.editHistory?.length || 0) - 1) {
      setCurrentHistoryViewIndex(null); // Go to current version
    }
  };

  const messageTime = new Date(
    isUser && hasEditHistory && currentHistoryViewIndex !== null
      ? message.editHistory![currentHistoryViewIndex].timestamp
      : message.timestamp
  ).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const contentToRender = (typeof displayContent === 'string' && isUser) // Simple text for user message display (non-edit mode)
    ? [{ type: 'text' as const, text: displayContent }]
    : (message.isLoading && typeof message.content === 'string' && message.content.startsWith('Processing...')) // AI "Processing..." state
    ? [{ type: 'text' as const, text: message.content }]
    : (Array.isArray(displayContent) ? displayContent : [{ type: 'text' as const, text: String(displayContent) }]); // AI content parts or fallback

  const currentDisplayVersionNumber = currentHistoryViewIndex === null ? totalVersions : currentHistoryViewIndex + 1;

  // Define gradient backgrounds based on message role
  const userGradient = "from-blue-600 to-indigo-700";
  const assistantGradient = "from-emerald-500 to-teal-700";
  const errorGradient = "from-red-500 to-orange-600";

  return (
    <div className={cn(
        "flex items-start w-full animate-slideUpSlightly hover:shadow-sm transition-all duration-300",
        isUser ? 'justify-end gap-0' : 'justify-start gap-0'
      )}
    >
      {/* Message Bubble */}
      <div
        className={cn(
          "relative flex flex-col gap-3 rounded-2xl p-5 shadow-lg text-sm transition-all duration-300",
          "w-full max-w-full overflow-hidden", 
          isAssistant ? 
            'bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30 backdrop-blur-sm border border-emerald-200 dark:border-emerald-800/50 rounded-tl-none' :
            'bg-gradient-to-br from-blue-600 to-indigo-700 text-white rounded-tr-none',
          message.isError ? 'border-destructive border-2' : ''
        )}
      >
        <div className={cn(
          "absolute inset-0 rounded-2xl opacity-30",
          isAssistant ? 
            "bg-gradient-to-br from-emerald-200/30 to-teal-300/30 dark:from-emerald-700/10 dark:to-teal-700/10 blur-md" :
            "bg-gradient-to-br from-blue-400/20 to-indigo-500/20 blur-md"
        )}></div>
        
        <div className="flex justify-between items-center mb-2 relative z-10">
          <span className={cn(
            "text-xs font-medium px-2 py-0.5 rounded-full",
            isAssistant ? 
              "bg-emerald-100/80 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-200 backdrop-blur-sm" : 
              "bg-blue-500/30 text-white/90 backdrop-blur-sm"
          )}>
            {messageTime}
          </span>
          {message.isError && !isEditingThisMessage && (
            <div className="flex items-center gap-2 text-destructive bg-destructive/10 px-2 py-1 rounded-full animate-pulse-slow">
              <AlertTriangle className="h-4 w-4" />
              <span className="font-medium text-xs">Error processing request</span>
            </div>
          )}
        </div>

        {isEditingThisMessage && isUser ? (
          <div className="space-y-2 relative z-10">
            <Textarea
              value={editedText}
              onChange={(e) => setEditedText(e.target.value)}
              className="w-full resize-none min-h-[60px] bg-background/70 text-foreground focus-visible:ring-primary"
              rows={Math.max(2, editedText.split('\n').length)}
            />
            {/* Attachments could be displayed here if editing attachments is also desired */}
             {displayAttachments && displayAttachments.length > 0 && (
              <div className="mt-2 space-y-1">
                <p className="text-xs font-medium text-primary-foreground/80">Attachments (uneditable in this view):</p>
                {displayAttachments.map((file, index) => (
                  <div key={`${file.name}-${file.size || 0}-${index}`} className="text-xs text-primary-foreground/70 p-1 bg-primary-foreground/10 rounded-md truncate">
                    <Paperclip className="inline h-3 w-3 mr-1" /> {file.name}
                  </div>
                ))}
              </div>
            )}
            <div className="flex justify-end gap-2 mt-2">
              <Button variant="ghost" size="sm" onClick={handleCancelEdit} rounded="full" className="hover:bg-muted/50 text-primary-foreground/80 hover:text-primary-foreground">
                <X className="h-4 w-4 mr-1" /> Cancel
              </Button>
              <Button variant="default" size="sm" onClick={handleSaveAndSendEdited} rounded="full" className="bg-primary-foreground/20 hover:bg-primary-foreground/30 text-primary-foreground">
                <Send className="h-4 w-4 mr-1" /> Save & Send
              </Button>
            </div>
          </div>
        ) : message.isLoading ? (
            <div className="relative z-10 whitespace-pre-wrap animate-pulse-slow glass-panel bg-background/40 p-3 rounded-xl border border-primary/10 shadow-inner">
              <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin text-primary" />
                <p>{typeof message.content === 'string' ? message.content : 'Processing...'}</p>
              </div>
            </div>
          ) : (
            <div className="stagger-animation relative z-10 w-full overflow-x-auto">
              {contentToRender.map((part, index) =>
                <RenderContentPart part={part} index={index} key={`${message.id}-part-${index}`}/>
              )}
            </div>
          )
        }

        {displayAttachments && displayAttachments.length > 0 && !isEditingThisMessage && (
          <div className="mt-3 space-y-2 relative z-10">
            <div className={cn(
                "text-xs font-medium px-2 py-0.5 rounded-full w-fit mb-2",
                isAssistant ? 
                  "bg-emerald-100/80 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-200" : 
                  "bg-blue-500/30 text-white/90"
              )}>
              <span>
                {displayAttachments.length} {displayAttachments.length === 1 ? 'Attachment' : 'Attachments'}
              </span>
            </div>
            {displayAttachments.map((file, index) =>
              <div key={`${file.name}-${file.size || 0}-${index}`} className="animate-stagger" style={{ animationDelay: `${index * 100}ms` }}>
                <AttachedFileDisplay file={file} />
              </div>
            )}
          </div>
        )}

        {/* Edit History Navigation & Edit Button Area */}
        {!isEditingThisMessage && (
          <div className={cn(
            "mt-3 pt-2 border-t flex justify-end items-center gap-3 animate-fade-in relative z-10",
            isAssistant ? "border-emerald-200/30 dark:border-emerald-800/30" : "border-blue-400/30"
          )} style={{ animationDelay: '0.5s' }}>
            {hasEditHistory && (
              <div className="flex items-center gap-1 mr-auto">
                <Button
                  variant="ghost"
                  size="icon"
                  className={cn(
                    "h-7 w-7", 
                    isAssistant ? 
                      "text-emerald-700/70 hover:bg-emerald-100/50 dark:text-emerald-400 dark:hover:bg-emerald-900/30" : 
                      "text-white/70 hover:bg-blue-500/20 hover:text-white"
                  )}
                  onClick={handlePrevHistory}
                  disabled={currentHistoryViewIndex === 0}
                  title="Previous edit"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className={cn(
                  "text-xs", 
                  isAssistant ? "text-emerald-700 dark:text-emerald-300" : "text-white/80"
                )}>
                  {currentDisplayVersionNumber} / {totalVersions}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  className={cn(
                    "h-7 w-7", 
                    isAssistant ? 
                      "text-emerald-700/70 hover:bg-emerald-100/50 dark:text-emerald-400 dark:hover:bg-emerald-900/30" : 
                      "text-white/70 hover:bg-blue-500/20 hover:text-white"
                  )}
                  onClick={handleNextHistory}
                  disabled={currentHistoryViewIndex === null}
                  title="Next edit / Current version"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            )}

            {isUser && onConfirmEditAndResend && (
              <Button
                variant="ghost"
                size="sm"
                rounded="full"
                glow
                animate
                onClick={handleStartEdit}
                className="text-xs backdrop-blur-sm border border-blue-300/20 shadow-sm hover:shadow-md hover:scale-105 text-white/90 hover:text-white hover:bg-blue-500/20 transition-all duration-300"
                title="Edit & Resend this message"
              >
                <div className="relative mr-1.5">
                  <div className="absolute inset-0 bg-blue-400/30 rounded-full blur-sm animate-pulse-slow opacity-70"></div>
                  <Edit3 className="h-3.5 w-3.5 relative z-10" />
                </div>
                Edit & Resend
              </Button>
            )}
            {isAssistant && message.canRegenerate && message.originalRequest && onRegenerate && (
              <Button
                variant="ghost"
                size="sm"
                rounded="full"
                glow
                animate
                onClick={handleRegenerateClick}
                className="text-xs backdrop-blur-sm border border-emerald-300/20 shadow-sm hover:shadow-md hover:scale-105 text-emerald-700 dark:text-emerald-300 hover:text-emerald-800 dark:hover:text-emerald-200 hover:bg-emerald-100/50 dark:hover:bg-emerald-900/30 transition-all duration-300"
                title="Regenerate response"
                disabled={message.isLoading}
              >
                <div className="relative mr-1.5">
                  <div className="absolute inset-0 bg-emerald-400/20 dark:bg-emerald-400/10 rounded-full blur-sm animate-pulse-slow opacity-70"></div>
                  <RotateCcw className="h-3.5 w-3.5 relative z-10" />
                </div>
                Regenerate
              </Button>
            )}
            {isAssistant && message.isLoading && onStopRegeneration && (
              <Button
                variant="ghost"
                size="sm"
                rounded="full"
                glow
                animate
                onClick={() => onStopRegeneration(message.id)}
                className="text-xs backdrop-blur-sm border border-red-300/20 shadow-sm hover:shadow-md hover:scale-105 text-red-700 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 hover:bg-red-100/50 dark:hover:bg-red-900/30 transition-all duration-300"
                title="Stop regeneration"
              >
                <div className="relative mr-1.5">
                  <div className="absolute inset-0 bg-red-400/20 dark:bg-red-400/10 rounded-full blur-sm animate-pulse-slow opacity-70"></div>
                  <X className="h-3.5 w-3.5 relative z-10" />
                </div>
                Stop
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
