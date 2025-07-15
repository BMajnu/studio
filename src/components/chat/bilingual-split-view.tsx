'use client';

import { useState, useRef, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { Sparkles } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Edit3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';

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
}

// Define the props interface for the BilingualSplitView component
interface BilingualSplitViewProps {
  keyPoints: BilingualContent; 
  detailedRequirements: BilingualContent;
  designMessage: BilingualContent;
  nicheAndAudience: BilingualContent;
  designItems: {
    english: DesignListItem[];
    bengali: DesignListItem[];
  };
  imageAnalysis?: BilingualContent;
  onSelectDesign?: (designItem: DesignListItem, options: GenerationOptions) => void;
}

export function BilingualSplitView({
  keyPoints,
  detailedRequirements,
  designMessage,
  nicheAndAudience,
  designItems,
  imageAnalysis,
  onSelectDesign
}: BilingualSplitViewProps) {
  const [activeTab, setActiveTab] = useState('keyPoints');
  const englishScrollRef = useRef<HTMLDivElement>(null);
  const bengaliScrollRef = useRef<HTMLDivElement>(null);
  const [syncingEnglish, setSyncingEnglish] = useState(false);
  const [syncingBengali, setSyncingBengali] = useState(false);

  const hasImages = !!imageAnalysis; // if image analysis exists, images were attached

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
        
      case 'designMessage':
        return (
          <div className="flex flex-row gap-1 h-full">
            <ScrollArea ref={englishScrollRef} className="flex-1 h-full p-4 rounded-md bg-card/50 backdrop-blur-sm border border-border shadow-sm hover:shadow-md transition-shadow">
              <div className="mb-2 text-sm uppercase font-semibold text-muted-foreground">English</div>
              <ReactMarkdown className="prose prose-sm dark:prose-invert max-w-none text-foreground whitespace-pre-wrap leading-relaxed font-medium">
                {typeof designMessage.english === 'string' ? designMessage.english : (designMessage.english as string[]).join('\n\n')}
              </ReactMarkdown>
            </ScrollArea>
            
            <div className="w-px bg-border mx-2 h-full"></div>
            
            <ScrollArea ref={bengaliScrollRef} className="flex-1 h-full p-4 rounded-md bg-card/50 backdrop-blur-sm border border-border shadow-sm hover:shadow-md transition-shadow">
              <div className="mb-2 text-sm uppercase font-semibold text-muted-foreground">Bengali</div>
              <ReactMarkdown className="prose prose-sm dark:prose-invert max-w-none text-foreground whitespace-pre-wrap leading-relaxed font-medium">
                {typeof designMessage.bengali === 'string' ? designMessage.bengali : (designMessage.bengali as string[]).join('\n\n')}
              </ReactMarkdown>
            </ScrollArea>
          </div>
        );
        
      case 'nicheAndAudience':
        return (
          <div className="flex flex-row gap-1 h-full">
            <ScrollArea ref={englishScrollRef} className="flex-1 h-full p-4 rounded-md bg-card/50 backdrop-blur-sm border border-border shadow-sm hover:shadow-md transition-shadow">
              <div className="mb-2 text-sm uppercase font-semibold text-muted-foreground">English</div>
              <ReactMarkdown className="prose prose-sm dark:prose-invert max-w-none text-foreground whitespace-pre-wrap leading-relaxed font-medium">
                {typeof nicheAndAudience.english === 'string' ? nicheAndAudience.english : (nicheAndAudience.english as string[]).join('\n\n')}
              </ReactMarkdown>
            </ScrollArea>
            
            <div className="w-px bg-border mx-2 h-full"></div>
            
            <ScrollArea ref={bengaliScrollRef} className="flex-1 h-full p-4 rounded-md bg-card/50 backdrop-blur-sm border border-border shadow-sm hover:shadow-md transition-shadow">
              <div className="mb-2 text-sm uppercase font-semibold text-muted-foreground">Bengali</div>
              <ReactMarkdown className="prose prose-sm dark:prose-invert max-w-none text-foreground whitespace-pre-wrap leading-relaxed font-medium">
                {typeof nicheAndAudience.bengali === 'string' ? nicheAndAudience.bengali : (nicheAndAudience.bengali as string[]).join('\n\n')}
              </ReactMarkdown>
            </ScrollArea>
          </div>
        );
        
      case 'imageAnalysis':
        return (
          <div className="flex flex-row gap-1 h-full">
            <ScrollArea ref={englishScrollRef} className="flex-1 h-full p-4 rounded-md bg-card/50 backdrop-blur-sm border border-border shadow-sm hover:shadow-md transition-shadow">
              <div className="mb-2 text-sm uppercase font-semibold text-muted-foreground">English</div>
              <ReactMarkdown className="prose prose-sm dark:prose-invert max-w-none text-foreground whitespace-pre-wrap leading-relaxed font-medium">
                {typeof imageAnalysis?.english === 'string' ? imageAnalysis?.english : ((imageAnalysis?.english || []) as string[]).join('\n\n')}
              </ReactMarkdown>
            </ScrollArea>
            <div className="w-px bg-border mx-2 h-full"></div>
            <ScrollArea ref={bengaliScrollRef} className="flex-1 h-full p-4 rounded-md bg-card/50 backdrop-blur-sm border border-border shadow-sm hover:shadow-md transition-shadow">
              <div className="mb-2 text-sm uppercase font-semibold text-muted-foreground">Bengali</div>
              <ReactMarkdown className="prose prose-sm dark:prose-invert max-w-none text-foreground whitespace-pre-wrap leading-relaxed font-medium">
                {typeof imageAnalysis?.bengali === 'string' ? imageAnalysis?.bengali : ((imageAnalysis?.bengali || []) as string[]).join('\n\n')}
              </ReactMarkdown>
            </ScrollArea>
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
          <TabsTrigger value="designMessage" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500 data-[state=active]:text-white data-[state=active]:shadow-md rounded-md">Message</TabsTrigger>
          <TabsTrigger value="nicheAndAudience" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500 data-[state=active]:text-white data-[state=active]:shadow-md rounded-md">Audience</TabsTrigger>
          <TabsTrigger value="imageAnalysis" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500 data-[state=active]:text-white data-[state=active]:shadow-md rounded-md">Image</TabsTrigger>
          <TabsTrigger value="designItems" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500 data-[state=active]:text-white data-[state=active]:shadow-md rounded-md">Designs</TabsTrigger>
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
          <label className="flex items-center gap-2 opacity-100"><Checkbox checked={includeOriginalImages} disabled={!hasImages} onCheckedChange={(val: boolean | "indeterminate")=>setIncludeOriginalImages(!!val)} />Include attached images</label>
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
    </div>
  );
} 