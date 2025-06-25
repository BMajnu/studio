'use client';

import { useState, useRef, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { Sparkles } from 'lucide-react';

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
  onSelectDesign?: (designItem: DesignListItem) => void;
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
            <ScrollArea ref={englishScrollRef} className="flex-1 h-full p-4 rounded-md">
              <div className="mb-2 text-sm uppercase font-semibold text-muted-foreground">English</div>
              <ul className="list-disc pl-5 space-y-2">
                {Array.isArray(keyPoints.english) ? (
                  keyPoints.english.map((point, index) => (
                    <li key={index} className="text-foreground">{point}</li>
                  ))
                ) : (
                  <li className="text-foreground">{keyPoints.english}</li>
                )}
              </ul>
            </ScrollArea>
            
            <div className="w-px bg-border mx-2 h-full"></div>
            
            <ScrollArea ref={bengaliScrollRef} className="flex-1 h-full p-4 rounded-md">
              <div className="mb-2 text-sm uppercase font-semibold text-muted-foreground">Bengali</div>
              <ul className="list-disc pl-5 space-y-2">
                {Array.isArray(keyPoints.bengali) ? (
                  keyPoints.bengali.map((point, index) => (
                    <li key={index} className="text-foreground">{point}</li>
                  ))
                ) : (
                  <li className="text-foreground">{keyPoints.bengali}</li>
                )}
              </ul>
            </ScrollArea>
          </div>
        );
        
      case 'detailedRequirements':
        return (
          <div className="flex flex-row gap-1 h-full">
            <ScrollArea ref={englishScrollRef} className="flex-1 h-full p-4 rounded-md">
              <div className="mb-2 text-sm uppercase font-semibold text-muted-foreground">English</div>
              <div className="text-foreground whitespace-pre-wrap">
                {typeof detailedRequirements.english === 'string' ? detailedRequirements.english : detailedRequirements.english.join('\n\n')}
              </div>
            </ScrollArea>
            
            <div className="w-px bg-border mx-2 h-full"></div>
            
            <ScrollArea ref={bengaliScrollRef} className="flex-1 h-full p-4 rounded-md">
              <div className="mb-2 text-sm uppercase font-semibold text-muted-foreground">Bengali</div>
              <div className="text-foreground whitespace-pre-wrap">
                {typeof detailedRequirements.bengali === 'string' ? detailedRequirements.bengali : detailedRequirements.bengali.join('\n\n')}
              </div>
            </ScrollArea>
          </div>
        );
        
      case 'designMessage':
        return (
          <div className="flex flex-row gap-1 h-full">
            <ScrollArea ref={englishScrollRef} className="flex-1 h-full p-4 rounded-md">
              <div className="mb-2 text-sm uppercase font-semibold text-muted-foreground">English</div>
              <div className="text-foreground whitespace-pre-wrap">
                {typeof designMessage.english === 'string' ? designMessage.english : designMessage.english.join('\n\n')}
              </div>
            </ScrollArea>
            
            <div className="w-px bg-border mx-2 h-full"></div>
            
            <ScrollArea ref={bengaliScrollRef} className="flex-1 h-full p-4 rounded-md">
              <div className="mb-2 text-sm uppercase font-semibold text-muted-foreground">Bengali</div>
              <div className="text-foreground whitespace-pre-wrap">
                {typeof designMessage.bengali === 'string' ? designMessage.bengali : designMessage.bengali.join('\n\n')}
              </div>
            </ScrollArea>
          </div>
        );
        
      case 'nicheAndAudience':
        return (
          <div className="flex flex-row gap-1 h-full">
            <ScrollArea ref={englishScrollRef} className="flex-1 h-full p-4 rounded-md">
              <div className="mb-2 text-sm uppercase font-semibold text-muted-foreground">English</div>
              <div className="text-foreground whitespace-pre-wrap">
                {typeof nicheAndAudience.english === 'string' ? nicheAndAudience.english : nicheAndAudience.english.join('\n\n')}
              </div>
            </ScrollArea>
            
            <div className="w-px bg-border mx-2 h-full"></div>
            
            <ScrollArea ref={bengaliScrollRef} className="flex-1 h-full p-4 rounded-md">
              <div className="mb-2 text-sm uppercase font-semibold text-muted-foreground">Bengali</div>
              <div className="text-foreground whitespace-pre-wrap">
                {typeof nicheAndAudience.bengali === 'string' ? nicheAndAudience.bengali : nicheAndAudience.bengali.join('\n\n')}
              </div>
            </ScrollArea>
          </div>
        );
        
      case 'imageAnalysis':
        return (
          <div className="flex flex-row gap-1 h-full">
            <ScrollArea ref={englishScrollRef} className="flex-1 h-full p-4 rounded-md">
              <div className="mb-2 text-sm uppercase font-semibold text-muted-foreground">English</div>
              <div className="text-foreground whitespace-pre-wrap">
                {typeof imageAnalysis?.english === 'string' ? imageAnalysis?.english : (imageAnalysis?.english || []).join('\n\n')}
              </div>
            </ScrollArea>
            <div className="w-px bg-border mx-2 h-full"></div>
            <ScrollArea ref={bengaliScrollRef} className="flex-1 h-full p-4 rounded-md">
              <div className="mb-2 text-sm uppercase font-semibold text-muted-foreground">Bengali</div>
              <div className="text-foreground whitespace-pre-wrap">
                {typeof imageAnalysis?.bengali === 'string' ? imageAnalysis?.bengali : (imageAnalysis?.bengali || []).join('\n\n')}
              </div>
            </ScrollArea>
          </div>
        );
        
      case 'designItems':
        return <DesignItemsList designItems={designItems} onSelectDesign={onSelectDesign} />;
        
      default:
        return null;
    }
  };

  return (
    <div className="w-full glass-panel border border-border p-4 rounded-xl shadow-md mb-4">
      <h3 className="text-xl font-semibold text-center mb-4 text-gradient">Bilingual Requirements Analysis</h3>
      
      <Tabs defaultValue="keyPoints" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-6 mb-4">
          <TabsTrigger value="keyPoints">Key Points</TabsTrigger>
          <TabsTrigger value="detailedRequirements">Details</TabsTrigger>
          <TabsTrigger value="designMessage">Message</TabsTrigger>
          <TabsTrigger value="nicheAndAudience">Audience</TabsTrigger>
          <TabsTrigger value="imageAnalysis">Image</TabsTrigger>
          <TabsTrigger value="designItems">Designs</TabsTrigger>
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
  onSelectDesign 
}: { 
  designItems: { english: DesignListItem[]; bengali: DesignListItem[] },
  onSelectDesign?: (designItem: DesignListItem) => void
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
  language
}: { 
  item: DesignListItem; 
  onSelect?: (item: DesignListItem) => void;
  language: 'english' | 'bengali';
}) {
  // Only show action button on English items to prevent duplicate actions
  const showActionButton = language === 'english' && onSelect;
  
  return (
    <div className={cn(
      "bg-card/50 backdrop-blur-sm border border-border p-4 rounded-lg shadow-sm", 
      "hover:shadow-md transition-shadow duration-300",
      showActionButton ? "cursor-pointer" : ""
    )}>
      <h4 className="font-medium text-lg mb-2">{item.title}</h4>
      <p className="text-muted-foreground mb-2">{item.description}</p>
      {item.textContent && (
        <div className="mt-2 border-l-2 border-primary/30 pl-3 italic text-sm">
          &ldquo;{item.textContent}&rdquo;
        </div>
      )}
      
      {showActionButton && (
        <div className="mt-2">
        <button 
          onClick={() => onSelect?.(item)}
            className="w-full px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 flex items-center justify-center"
        >
            <Sparkles className="h-4 w-4 mr-2" />
            Generate Prompts
        </button>
        </div>
      )}
    </div>
  );
} 