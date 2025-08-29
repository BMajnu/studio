'use client';

import { useState, useRef, useEffect, useMemo } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { Sparkles, Edit3, Upload, Check, X, Copy } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import type { AttachedFile } from '@/lib/types';

// Define the data structure for each bilingual section
interface BilingualContent {
  english: string | string[];
  bengali: string | string[];
}

interface DesignListItem {
  id: string;
  title: string;
  description: string;
  textContent?: string;
  mustFollow?: string[];
}

interface GenerationOptions {
  includeOriginalPrompt: boolean;
  includeOriginalImages: boolean;
  includeFullAnalysis: boolean;
  customAttachedFiles?: AttachedFile[]; // Newly attached custom images (if any)
}

// Define the props interface for the BilingualSplitView component
interface BilingualSplitViewProps {
  keyPoints: BilingualContent; 
  detailedRequirements: BilingualContent;
  // Optional: simplified summary distinct from detailed requirements
  simplifiedRequirements?: BilingualContent;
  designItems: {
    english: DesignListItem[];
    bengali: DesignListItem[];
  };
  imageAnalysis?: BilingualContent;
  // Optional: generated editing prompts to display in the Editing Prompt tab
  editingPrompts?: { type: string; prompt: string }[];
  // Optional: one prompt per design when available
  editingPromptsByDesign?: { designId: string; designTitle?: string; imageIndex?: number; prompt: string }[];
  onSelectDesign?: (designItem: DesignListItem, options: GenerationOptions) => void;
}

export function BilingualSplitView({
  keyPoints,
  detailedRequirements,
  simplifiedRequirements,
  designItems,
  imageAnalysis,
  editingPrompts,
  editingPromptsByDesign,
  onSelectDesign
}: BilingualSplitViewProps) {
  const [activeTab, setActiveTab] = useState('keyPoints');
  const englishScrollRef = useRef<HTMLDivElement>(null);
  const bengaliScrollRef = useRef<HTMLDivElement>(null);
  const [syncingEnglish, setSyncingEnglish] = useState(false);
  const [syncingBengali, setSyncingBengali] = useState(false);
  const [generatedPrompts, setGeneratedPrompts] = useState<{ category: string; prompts: string[] }[] | null>(null);

  const hasImages = !!imageAnalysis; // if image analysis exists, images were attached

  // Editing Prompt tab is auto-generated; no local input state required
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Local fallback: Convert Design Ideas to English-only prompts if AI event data isn't available
  function buildDesignPrompt(item: DesignListItem): string {
    const parts: string[] = [];
    const title = (item.title || '').trim();
    const desc = (item.description || '').trim();
    const extra = (item.textContent || '').trim();
    if (title && desc) {
      parts.push(`${title} — ${desc}`);
    } else if (title) {
      parts.push(title);
    } else if (desc) {
      parts.push(desc);
    }
    if (extra) parts.push(extra);
    const base = parts.join('. ');
    const mustFollow = (item.mustFollow || []).map(s => s.trim()).filter(Boolean);
    const mf = mustFollow.length > 0 ? ` Requirements: ${mustFollow.join('; ')}` : '';
    // Keep the prompt single-paragraph, plain English, professional design terms
    return `Create a high-quality, professional design based on: ${base}.${mf} Use clear visual hierarchy, balanced composition, consistent typography and color harmony. Avoid watermarks, illegible text, and low-quality artifacts.`;
  }

  const fallbackGeneratedGroups = useMemo(() => {
    try {
      const en = (designItems?.english || []) as DesignListItem[];
      if (!en || en.length === 0) return null;
      const prompts = en.map(buildDesignPrompt).filter(Boolean);
      if (prompts.length === 0) return null;
      return [{ category: 'From Design Ideas', prompts }];
    } catch {
      return null;
    }
  }, [designItems]);

  // Function to handle scroll synchronization between the two panels
  const handleScroll = (sourceRef: React.RefObject<HTMLDivElement>, targetRef: React.RefObject<HTMLDivElement>, isSyncing: boolean, setSyncing: (value: boolean) => void) => {
    if (isSyncing || !sourceRef.current || !targetRef.current) return;

    const sourceElement = sourceRef.current;
    const targetElement = targetRef.current;
    
    // Set the opposite panel's scroll position to match
    const scrollPercentage = sourceElement.scrollTop / (sourceElement.scrollHeight - sourceElement.clientHeight);
    const targetScrollPosition = scrollPercentage * (targetElement.scrollHeight - targetElement.clientHeight);
    
    // Prevent scroll loop by setting a sync flag
    setSyncing(true);
    targetElement.scrollTop = targetScrollPosition;
    
    // Reset sync flag after a short delay
    setTimeout(() => setSyncing(false), 50);
  };

  // Set up scroll event listeners
  useEffect(() => {
    const englishElement = englishScrollRef.current;
    const bengaliElement = bengaliScrollRef.current;
    
    if (!englishElement || !bengaliElement) return;
    
    const handleEnglishScroll = () => {
      if (!syncingBengali) {
        handleScroll(englishScrollRef, bengaliScrollRef, syncingEnglish, setSyncingEnglish);
      }
    };
    
    const handleBengaliScroll = () => {
      if (!syncingEnglish) {
        handleScroll(bengaliScrollRef, englishScrollRef, syncingBengali, setSyncingBengali);
      }
    };
    
    englishElement.addEventListener('scroll', handleEnglishScroll);
    bengaliElement.addEventListener('scroll', handleBengaliScroll);
    
    return () => {
      englishElement.removeEventListener('scroll', handleEnglishScroll);
      bengaliElement.removeEventListener('scroll', handleBengaliScroll);
    };
  }, [syncingEnglish, syncingBengali]);

  // Listen for generated prompts event from page.tsx and switch to the tab
  useEffect(() => {
    const handler: any = (event: any) => {
      const data = event?.detail?.promptsData;
      if (Array.isArray(data)) {
        setGeneratedPrompts(data);
        setActiveTab('generatedPrompt');
      }
    };
    window.addEventListener('design-prompts-generated', handler as EventListener);
    return () => window.removeEventListener('design-prompts-generated', handler as EventListener);
  }, []);

  // Render the current content based on the active tab
  const renderContent = () => {
    switch (activeTab) {
      case 'keyPoints':
        return (
          <div className="flex flex-row gap-1 h-full">
            <ScrollArea ref={englishScrollRef} className="flex-1 h-full p-4 rounded-md bg-card/50 backdrop-blur-sm border border-border shadow-sm hover:shadow-md transition-shadow">
              <div className="mb-2 text-sm uppercase font-semibold text-muted-foreground">English</div>
              <ul className="list-disc pl-5 space-y-2">
                {Array.isArray(keyPoints.english) ? (
                  keyPoints.english.map((point, index) => (
                    <li key={index} className="text-foreground font-medium">
                      <ReactMarkdown
                        components={{ p: ({node, ...props}) => <span {...props} /> }}
                        className="inline"
                      >
                        {point as string}
                      </ReactMarkdown>
                    </li>
                  ))
                ) : (
                  <li className="text-foreground font-medium">
                    <ReactMarkdown components={{ p: ({node, ...props}) => <span {...props} /> }} className="inline">
                      {keyPoints.english as string}
                    </ReactMarkdown>
                  </li>
                )}
              </ul>
            </ScrollArea>
            
            <div className="w-px bg-border mx-2 h-full"></div>
            
            <ScrollArea ref={bengaliScrollRef} className="flex-1 h-full p-4 rounded-md bg-card/50 backdrop-blur-sm border border-border shadow-sm hover:shadow-md transition-shadow">
              <div className="mb-2 text-sm uppercase font-semibold text-muted-foreground">Bengali</div>
              <ul className="list-disc pl-5 space-y-2">
                {Array.isArray(keyPoints.bengali) ? (
                  keyPoints.bengali.map((point, index) => (
                    <li key={index} className="text-foreground font-medium">
                      <ReactMarkdown components={{ p: ({node, ...props}) => <span {...props} /> }} className="inline">
                        {point as string}
                      </ReactMarkdown>
                    </li>
                  ))
                ) : (
                  <li className="text-foreground font-medium">
                    <ReactMarkdown components={{ p: ({node, ...props}) => <span {...props} /> }} className="inline">
                      {keyPoints.bengali as string}
                    </ReactMarkdown>
                  </li>
                )}
              </ul>
            </ScrollArea>
          </div>
        );
        
      case 'detailedRequirements':
        return (
          <div className="flex flex-row gap-1 h-full">
            <ScrollArea ref={englishScrollRef} className="flex-1 h-full p-4 rounded-md bg-card/50 backdrop-blur-sm border border-border shadow-sm hover:shadow-md transition-shadow">
              <div className="mb-2 text-sm uppercase font-semibold text-muted-foreground">English</div>
              <ReactMarkdown className="prose prose-sm dark:prose-invert max-w-none text-foreground whitespace-pre-wrap leading-relaxed font-medium">
                {typeof detailedRequirements.english === 'string' ? detailedRequirements.english : (detailedRequirements.english as string[]).join('\n\n')}
              </ReactMarkdown>
            </ScrollArea>
            
            <div className="w-px bg-border mx-2 h-full"></div>
            
            <ScrollArea ref={bengaliScrollRef} className="flex-1 h-full p-4 rounded-md bg-card/50 backdrop-blur-sm border border-border shadow-sm hover:shadow-md transition-shadow">
              <div className="mb-2 text-sm uppercase font-semibold text-muted-foreground">Bengali</div>
              <ReactMarkdown className="prose prose-sm dark:prose-invert max-w-none text-foreground whitespace-pre-wrap leading-relaxed font-medium">
                {typeof detailedRequirements.bengali === 'string' ? detailedRequirements.bengali : (detailedRequirements.bengali as string[]).join('\n\n')}
              </ReactMarkdown>
            </ScrollArea>
          </div>
        );
        
      case 'simplizeRequirement':
        return (
          <div className="flex flex-row gap-1 h-full">
            <ScrollArea ref={englishScrollRef} className="flex-1 h-full p-4 rounded-md bg-card/50 backdrop-blur-sm border border-border shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-2">
                <div className="text-sm uppercase font-semibold text-muted-foreground">English</div>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-7 px-2 text-xs"
                  onClick={() => {
                    const source = simplifiedRequirements?.english ?? detailedRequirements.english;
                    const englishText = Array.isArray(source)
                      ? (source as string[]).join('\n\n')
                      : (source as string);
                    navigator.clipboard.writeText(englishText).then(() => {
                      setCopiedKey('simplize-en');
                      setTimeout(() => setCopiedKey(null), 1200);
                    });
                  }}
                >
                  {copiedKey === 'simplize-en' ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />} Copy
                </Button>
              </div>
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  ul: ({ node, ...props }: any) => <ul className="list-disc pl-5 space-y-[3px]" {...props} />,
                  ol: ({ node, ...props }: any) => <ol className="list-decimal pl-5 space-y-[3px]" {...props} />,
                }}
                className="prose prose-sm dark:prose-invert max-w-none text-foreground space-y-[3px] leading-snug font-medium prose-p:my-0 prose-li:my-0 prose-ul:my-0 prose-ol:my-0"
              >
                {(() => {
                  const source = simplifiedRequirements?.english ?? detailedRequirements.english;
                  return typeof source === 'string' ? (source as string) : (source as string[]).join('\n\n');
                })()}
              </ReactMarkdown>
            </ScrollArea>

            <div className="w-px bg-border mx-2 h-full"></div>

            <ScrollArea ref={bengaliScrollRef} className="flex-1 h-full p-4 rounded-md bg-card/50 backdrop-blur-sm border border-border shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-2">
                <div className="text-sm uppercase font-semibold text-muted-foreground">Bengali</div>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-7 px-2 text-xs"
                  onClick={() => {
                    const source = simplifiedRequirements?.bengali ?? detailedRequirements.bengali;
                    const bengaliText = Array.isArray(source)
                      ? (source as string[]).join('\n\n')
                      : (source as string);
                    navigator.clipboard.writeText(bengaliText).then(() => {
                      setCopiedKey('simplize-bn');
                      setTimeout(() => setCopiedKey(null), 1200);
                    });
                  }}
                >
                  {copiedKey === 'simplize-bn' ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />} Copy
                </Button>
              </div>
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  ul: ({ node, ...props }: any) => <ul className="list-disc pl-5 space-y-[3px]" {...props} />,
                  ol: ({ node, ...props }: any) => <ol className="list-decimal pl-5 space-y-[3px]" {...props} />,
                }}
                className="prose prose-sm dark:prose-invert max-w-none text-foreground space-y-[3px] leading-snug font-medium prose-p:my-0 prose-li:my-0 prose-ul:my-0 prose-ol:my-0"
              >
                {(() => {
                  const source = simplifiedRequirements?.bengali ?? detailedRequirements.bengali;
                  return typeof source === 'string' ? (source as string) : (source as string[]).join('\n\n');
                })()}
              </ReactMarkdown>
            </ScrollArea>
          </div>
        );
        
      case 'editingPrompt':
        return (
          <div className="space-y-3">
            {Array.isArray(editingPromptsByDesign) && editingPromptsByDesign.length > 0 ? (
              <div className="border border-border rounded-md p-3 bg-card/40">
                <div className="text-sm font-semibold mb-2">Editing Prompts by Design</div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {editingPromptsByDesign.map((item, idx) => (
                    <div key={idx} className="p-3 rounded-md border border-muted/30 bg-background/50">
                      <div className="flex items-center justify-between mb-1">
                        <div className="text-xs uppercase tracking-wide text-muted-foreground">
                          {item.designTitle || item.designId}
                          {typeof item.imageIndex === 'number' ? (
                            <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded bg-muted/50 text-[10px] text-muted-foreground">Image #{item.imageIndex}</span>
                          ) : null}
                        </div>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-7 px-2 text-xs"
                          onClick={() => {
                            navigator.clipboard.writeText(item.prompt).then(() => {
                              setCopiedIndex(idx);
                              setTimeout(() => setCopiedIndex(null), 1200);
                            });
                          }}
                        >
                          {copiedIndex === idx ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />} Copy
                        </Button>
                      </div>
                      <pre className="whitespace-pre-wrap text-sm leading-snug m-0">{item.prompt}</pre>
                    </div>
                  ))}
                </div>
              </div>
            ) : Array.isArray(editingPrompts) && editingPrompts.length > 0 ? (
              <div className="border border-border rounded-md p-3 bg-card/40">
                <div className="text-sm font-semibold mb-2">Generated Editing Prompts</div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {editingPrompts.map((ep, idx) => (
                    <div key={idx} className="p-3 rounded-md border border-muted/30 bg-background/50">
                      <div className="flex items-center justify-between mb-1">
                        <div className="text-xs uppercase tracking-wide text-muted-foreground">{ep.type}</div>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-7 px-2 text-xs"
                          onClick={() => {
                            navigator.clipboard.writeText(ep.prompt).then(() => {
                              setCopiedIndex(idx);
                              setTimeout(() => setCopiedIndex(null), 1200);
                            });
                          }}
                        >
                          {copiedIndex === idx ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />} Copy
                        </Button>
                      </div>
                      <pre className="whitespace-pre-wrap text-sm leading-snug m-0">{ep.prompt}</pre>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-sm text-muted-foreground">
                Editing prompts will be generated automatically after the requirements are analyzed.
              </div>
            )}
          </div>
        );
      
      case 'generatedPrompt':
        return (
          <div className="space-y-3">
            {(() => {
              const groups = (Array.isArray(generatedPrompts) && generatedPrompts.length > 0)
                ? generatedPrompts
                : fallbackGeneratedGroups;
              if (Array.isArray(groups) && groups.length > 0) {
                return groups.map((group, gIdx) => (
                  <div key={gIdx} className="border border-border rounded-md p-3 bg-card/40">
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-sm font-semibold">{group.category}</div>
                      <div className="text-xs text-muted-foreground">{group.prompts.length} prompts</div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {group.prompts.map((p, pIdx) => {
                        const key = `gen-${gIdx}-${pIdx}`;
                        return (
                          <div key={key} className="p-3 rounded-md border border-muted/30 bg-background/50">
                            <div className="flex items-center justify-between mb-1">
                              <div className="text-[11px] uppercase tracking-wide text-muted-foreground">Prompt</div>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-7 px-2 text-xs"
                                onClick={() => {
                                  navigator.clipboard.writeText(p).then(() => {
                                    setCopiedKey(key);
                                    setTimeout(() => setCopiedKey(null), 1200);
                                  });
                                }}
                              >
                                {copiedKey === key ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />} Copy
                              </Button>
                            </div>
                            <pre className="whitespace-pre-wrap text-sm leading-snug m-0">{p}</pre>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ));
              }
              return (
                <div className="text-sm text-muted-foreground">
                  No prompts yet. Select a design idea and click "Generate Prompts" to see AI image prompts here.
                </div>
              );
            })()}
          </div>
        );
      
      case 'designItems':
        return <DesignItemsList designItems={designItems} onSelectDesign={onSelectDesign} hasImages={hasImages} />;
        
      default:
        return null;
    }
  };

  return (
    <div className="w-full glass-panel border border-border p-4 rounded-xl shadow-md mb-4">
      <h3 className="text-xl font-semibold text-center mb-4 text-gradient">Requirements Analysis</h3>
      
      <Tabs defaultValue="keyPoints" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-6 mb-4">
          <TabsTrigger value="keyPoints" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500 data-[state=active]:text-white data-[state=active]:shadow-md rounded-md">Key Points</TabsTrigger>
          <TabsTrigger value="detailedRequirements" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500 data-[state=active]:text-white data-[state=active]:shadow-md rounded-md">Details</TabsTrigger>
          <TabsTrigger value="simplizeRequirement" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500 data-[state=active]:text-white data-[state=active]:shadow-md rounded-md">Simplize Requirement</TabsTrigger>
          <TabsTrigger value="editingPrompt" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500 data-[state=active]:text-white data-[state=active]:shadow-md rounded-md">Editing Prompt</TabsTrigger>
          <TabsTrigger value="generatedPrompt" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500 data-[state=active]:text-white data-[state=active]:shadow-md rounded-md">Generated Prompt</TabsTrigger>
          <TabsTrigger value="designItems" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500 data-[state=active]:text-white data-[state=active]:shadow-md rounded-md">Designs Idea</TabsTrigger>
        </TabsList>
        
        <div className="min-h-[300px] h-full">
          {renderContent()}
        </div>
      </Tabs>
    </div>
  );
}

// Separate component for the design items list with action buttons
function DesignItemsList({ 
  designItems,
  onSelectDesign,
  hasImages
}: { 
  designItems: { english: DesignListItem[]; bengali: DesignListItem[] },
  onSelectDesign?: (designItem: DesignListItem, options: GenerationOptions) => void,
  hasImages: boolean
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-4">
        <h4 className="text-sm uppercase font-semibold text-muted-foreground">English</h4>
        {designItems.english.map((item, index) => (
          <DesignItemCard 
            key={item.id || index}
            item={item}
            onSelect={onSelectDesign}
            language="english"
            hasImages={hasImages}
          />
        ))}
      </div>
      
      <div className="space-y-4">
        <h4 className="text-sm uppercase font-semibold text-muted-foreground">Bengali</h4>
        {designItems.bengali.map((item, index) => (
          <DesignItemCard 
            key={item.id || index}
            item={item}
            onSelect={onSelectDesign}
            language="bengali"
            hasImages={hasImages}
          />
        ))}
      </div>
    </div>
  );
}

// Card component for each design item
function DesignItemCard({ 
  item, 
  onSelect,
  language,
  hasImages
}: { 
  item: DesignListItem; 
  onSelect?: (designItem: DesignListItem, options: GenerationOptions) => void;
  language: 'english' | 'bengali';
  hasImages: boolean;
}) {
  // Only show action button on English items to prevent duplicate actions
  const showActionButton = language === 'english' && onSelect;

  // Option checkboxes
  const [includeOriginalPrompt, setIncludeOriginalPrompt] = useState(false);
  const [includeOriginalImages, setIncludeOriginalImages] = useState(hasImages);
  const [includeFullAnalysis, setIncludeFullAnalysis] = useState(false);

  // Custom image attachment handling
  const [customAttachedFiles, setCustomAttachedFiles] = useState<AttachedFile[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Clear custom image if user chooses to include original images again
  useEffect(() => {
    if (includeOriginalImages) {
      setCustomAttachedFiles([]);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  }, [includeOriginalImages]);

  const handleCustomFilesChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = event.target.files;
    if (!fileList) return;

    Array.from(fileList).forEach(file => {
      const reader = new FileReader();
      reader.onload = () => {
        const dataUrl = reader.result as string;
        setCustomAttachedFiles(prev => [...prev, {
          name: file.name,
          type: file.type,
          size: file.size,
          dataUri: dataUrl,
        }]);
      };
      reader.readAsDataURL(file);
    });

    // Reset the input so same file can be reselected if removed
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleRemoveCustomImage = (index: number) => {
    setCustomAttachedFiles(prev => prev.filter((_, i) => i !== index));
  };

  // State for inline editing
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(item.title);
  const [editedDescription, setEditedDescription] = useState(item.description);
  const [editedTextContent, setEditedTextContent] = useState(item.textContent || '');
  const [editedMustFollow, setEditedMustFollow] = useState((item.mustFollow || []).join('\n'));

  const handleStartEdit = () => {
    // Reset state to current item props when starting edit
    setEditedTitle(item.title);
    setEditedDescription(item.description);
    setEditedTextContent(item.textContent || '');
    setEditedMustFollow((item.mustFollow || []).join('\n'));
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  const buildOptions = (): GenerationOptions => ({
    includeOriginalPrompt,
    includeOriginalImages,
    includeFullAnalysis,
    customAttachedFiles: customAttachedFiles.length > 0 ? customAttachedFiles : undefined,
  });

  const handleSaveAndGenerate = () => {
    const updatedItem: DesignListItem = {
      ...item,
      title: editedTitle,
      description: editedDescription,
      textContent: editedTextContent.trim() || undefined,
      mustFollow: editedMustFollow.split('\n').map(s => s.trim()).filter(Boolean),
    };
    onSelect?.(updatedItem, buildOptions());
    setIsEditing(false);
  };
  
  return (
    <div className={cn(
      "bg-card/50 backdrop-blur-sm border border-border p-4 rounded-lg shadow-sm", 
      "hover:shadow-md transition-shadow duration-300"
    )}>
      {isEditing ? (
        <div className="space-y-4">
          <div>
            <Label htmlFor={`title-${item.id}`} className="text-sm font-medium">Title</Label>
            <Input id={`title-${item.id}`} value={editedTitle} onChange={(e) => setEditedTitle(e.target.value)} className="mt-1" />
          </div>
          <div>
            <Label htmlFor={`desc-${item.id}`} className="text-sm font-medium">Description</Label>
            <Textarea id={`desc-${item.id}`} value={editedDescription} onChange={(e) => setEditedDescription(e.target.value)} className="mt-1" />
          </div>
          {item.textContent && (
            <div>
              <Label htmlFor={`text-${item.id}`} className="text-sm font-medium">Quote / Text</Label>
              <Textarea id={`text-${item.id}`} value={editedTextContent} onChange={(e) => setEditedTextContent(e.target.value)} className="mt-1" />
            </div>
          )}
          {item.mustFollow && item.mustFollow.length > 0 && (
            <div>
              <Label htmlFor={`must-follow-${item.id}`} className="text-sm font-medium">Must follow</Label>
              <Textarea 
                id={`must-follow-${item.id}`} 
                value={editedMustFollow} 
                onChange={(e) => setEditedMustFollow(e.target.value)} 
                className="mt-1 font-mono text-sm"
                rows={item.mustFollow.length + 1}
              />
            </div>
          )}
        </div>
      ) : (
        <>
      <h4 className="font-medium text-lg mb-2">{item.title}</h4>
      <p className="text-muted-foreground mb-2">{item.description}</p>
      {item.textContent && (
        <div className="mt-2 border-l-2 border-primary/30 pl-3 italic text-sm">
          &ldquo;{item.textContent}&rdquo;
        </div>
      )}
      
      {item.mustFollow && item.mustFollow.length > 0 && (
        <div className="mt-4">
          <h5 className="font-semibold text-sm mb-1">Must follow:</h5>
          <ul className="list-disc pl-5 space-y-1 text-foreground text-sm">
            {item.mustFollow.map((point, idx) => (
              <li key={idx}>{point}</li>
            ))}
          </ul>
        </div>
          )}
        </>
      )}
      
      {showActionButton && (
        <div className="mt-3 space-y-1 text-sm">
          <label className="flex items-center gap-2"><Checkbox checked={includeOriginalPrompt} onCheckedChange={(val: boolean | "indeterminate")=>setIncludeOriginalPrompt(!!val)} />Include original prompt</label>
          <label className="flex items-center gap-2 opacity-100"><Checkbox checked={includeOriginalImages} onCheckedChange={(val: boolean | "indeterminate")=>setIncludeOriginalImages(!!val)} />Include attached images</label>
          <label className="flex items-center gap-2"><Checkbox checked={includeFullAnalysis} onCheckedChange={(val: boolean | "indeterminate")=>setIncludeFullAnalysis(!!val)} />Include full analysis</label>
        </div>
      )}

      {showActionButton && (
        <div className="mt-4 grid grid-cols-2 gap-2">
          {isEditing ? (
            <>
              <Button variant="outline" onClick={handleCancelEdit}>
                Cancel
              </Button>
              <Button onClick={handleSaveAndGenerate}>
                <Sparkles className="h-4 w-4 mr-2" />
                Generate Prompts
              </Button>
            </>
          ) : (
            <>
              <Button
                onClick={() => onSelect?.(item, buildOptions())}
            className="w-full px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 flex items-center justify-center"
        >
            <Sparkles className="h-4 w-4 mr-2" />
            Generate Prompts
              </Button>

              <Button
                onClick={handleStartEdit}
                className="w-full px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 flex items-center justify-center"
              >
                <Edit3 className="h-4 w-4 mr-2" />
                Edit & Generate Prompts
              </Button>
            </>
          )}
        </div>
      )}

      {/* Custom image uploader shown when original images are NOT included */}
      {!includeOriginalImages && (
        <div className="mt-2 space-y-2">
          {customAttachedFiles.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {customAttachedFiles.map((file, idx) => (
                <div key={idx} className="relative w-16 h-16 rounded-md border border-primary/20 bg-card/50 overflow-hidden flex items-center justify-center">
                  {/* Image preview */}
                  {file.dataUri && (
                    <img src={file.dataUri} alt={file.name} className="w-full h-full object-cover" />
                  )}
                  {/* Remove button */}
                  <Button
                    variant="destructive"
                    size="icon"
                    className="absolute top-0 right-0 bg-destructive/80 hover:bg-destructive text-destructive-foreground rounded-bl-md p-0.5 h-5 w-5"
                    onClick={() => handleRemoveCustomImage(idx)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          )}
          <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()} className="flex items-center gap-2">
            <Upload className="h-4 w-4" /> {customAttachedFiles.length > 0 ? 'Add more images' : 'Attach custom images'}
          </Button>
          <input
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            ref={fileInputRef}
            onChange={handleCustomFilesChange}
          />
        </div>
      )}
    </div>
  );
} 