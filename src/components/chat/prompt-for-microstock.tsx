'use client';

import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  X, ChartBar, Copy, Check, Download, FileJson, FileSpreadsheet, 
  FileText, FileImage, Trash2, Star, StarOff, Filter, ArrowUpDown, BookmarkIcon, Camera, Palette
} from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { promptForMicrostock } from '@/ai/flows/prompt-for-microstock-flow';
import type { PromptWithMetadata as AIPromptWithMetadata, ContentType } from '@/ai/flows/prompt-for-microstock-types';
import type { AttachedFile } from '@/lib/types';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import Image from 'next/image';

// File export type
type ExportFormat = 'svg' | 'json' | 'csv' | 'txt';

// Sort options
type SortOption = 'newest' | 'title-asc' | 'title-desc' | 'category';

// Filter options
type FilterType = 'all' | 'favorites' | 'category';

interface PromptForMicrostockProps {
  userName?: string;
  userApiKey?: string;
  modelId?: string;
  onClose: () => void;
  onResultsGenerated: (results: AIPromptWithMetadata[], niche: string, subNiche?: string, description?: string, attachedFile?: AttachedFile) => void;
}

// Mock examples for the design/image niche field
const NICHE_EXAMPLES = [
  "Realistic photo",
  "Vector illustration",
  "Abstract background",
  "Wildlife photography",
  "Mother's Day theme",
  "Business concept",
  "Food photography",
  "Watercolor painting",
  "3D rendering",
  "Pattern design"
];

interface PromptMetadata {
  title: string;
  keywords: string[];
  mainCategory: string;
  subcategory: string;
}

interface PromptWithMetadata {
  prompt: string;
  metadata: PromptMetadata;
}

export function PromptForMicrostock({ userName, userApiKey, modelId, onClose, onResultsGenerated }: PromptForMicrostockProps) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [contentType, setContentType] = useState<ContentType | null>(null);
  const [designNiche, setDesignNiche] = useState<string>("");
  const [subNiche, setSubNiche] = useState<string>("");
  const [detailedDescription, setDetailedDescription] = useState<string>("");
  const [referenceImage, setReferenceImage] = useState<File | null>(null);
  const [referenceImageDataUrl, setReferenceImageDataUrl] = useState<string | null>(null);
  const { toast } = useToast();
  
  const handleSelectNicheExample = (example: string) => {
    setDesignNiche(example);
  };
  
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Invalid File Type",
          description: "Please upload an image file (JPEG, PNG, etc.)",
          variant: "destructive"
        });
        return;
      }
      
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast({
          title: "File Too Large",
          description: "Please upload an image smaller than 5MB",
          variant: "destructive"
        });
        return;
    }
    
      setReferenceImage(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setReferenceImageDataUrl(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeReferenceImage = () => {
    setReferenceImage(null);
    setReferenceImageDataUrl(null);
  };
  
  const handleGeneratePrompts = async () => {
    if (!contentType) {
      toast({
        title: "Content Type Required",
        description: "Please select either Photography or Vector/Design content type.",
        variant: "destructive"
      });
      return;
    }
    
    if (!designNiche.trim()) {
      toast({
        title: "Niche Required",
        description: "Please provide a design niche.",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    try {
      const result = await promptForMicrostock({
        contentType,
        designNiche: designNiche.trim(),
        subNiche: subNiche.trim() || undefined,
        detailedDescription: detailedDescription.trim() || undefined,
        userName,
        userApiKey,
        modelId,
      });
      
      // Create an AttachedFile object if we have a reference image
      const attachedFile = referenceImage && referenceImageDataUrl ? {
        name: referenceImage.name,
        type: referenceImage.type,
        size: referenceImage.size,
        dataUri: referenceImageDataUrl
      } : undefined;
      
      onResultsGenerated(
        result.results, 
        designNiche, 
        subNiche, 
        detailedDescription,
        attachedFile
      );
      onClose();
    } catch (error) {
      console.error("Error generating microstock prompts:", error);
      toast({
        title: "Generation Error",
        description: `Failed to generate prompts: ${error instanceof Error ? error.message : String(error)}`,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Card className="w-full max-w-2xl mx-auto glass-panel border border-primary/10">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-2xl text-gradient">
          <ChartBar className="h-5 w-5 inline-block mr-2" />
          Prompt for Micro Stock Markets
        </CardTitle>
        <Button variant="ghost" size="sm" onClick={onClose} aria-label="Close">
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="space-y-6 pt-6">
        <div>
          <Label className="text-base font-medium mb-2 block">
            Content type: <span className="text-destructive">*</span>
          </Label>
          <div className="grid grid-cols-2 gap-4 mb-2">
            <Button
              variant={contentType === 'photography' ? "default" : "outline"}
              className={cn(
                "h-auto py-4 transition-all duration-200",
                contentType === 'photography' ? "border-2 border-primary shadow-md" : ""
              )}
              onClick={() => setContentType('photography')}
            >
              <Camera className="h-5 w-5 mr-2" />
              <div className="text-left">
                <div className="font-medium">Real image/Photography</div>
                <div className="text-xs opacity-70 mt-1">Camera settings, lighting, colors</div>
              </div>
            </Button>
            
            <Button
              variant={contentType === 'vector' ? "default" : "outline"}
              className={cn(
                "h-auto py-4 transition-all duration-200",
                contentType === 'vector' ? "border-2 border-primary shadow-md" : ""
              )}
              onClick={() => setContentType('vector')}
            >
              <Palette className="h-5 w-5 mr-2" />
              <div className="text-left">
                <div className="font-medium">Vector/Design</div>
                <div className="text-xs opacity-70 mt-1">Typography, colors, style details</div>
              </div>
            </Button>
          </div>
        </div>
        
            <div>
              <Label htmlFor="design-niche" className="text-base font-medium mb-2 block">
            Design/Image Niche <span className="text-destructive">*</span>
              </Label>
              <Input 
                id="design-niche"
            placeholder="Enter your design niche (e.g., Vintage floral pattern, Wildlife photography)" 
                value={designNiche}
                onChange={(e) => setDesignNiche(e.target.value)}
            className="bg-background/70 backdrop-blur-sm"
          />
            </div>
            
            <div>
          <Label htmlFor="sub-niche" className="text-base font-medium mb-2 block">Sub-niche (Optional)</Label>
              <Input 
                id="sub-niche"
            placeholder="E.g., For t-shirts, For coffee mugs, Dark moody style"
                value={subNiche}
                onChange={(e) => setSubNiche(e.target.value)}
            className="bg-background/70 backdrop-blur-sm"
              />
            </div>
            
            <div>
          <Label htmlFor="detailed-description" className="text-base font-medium mb-2 block">Describe in more detail what type of designs you are looking for</Label>
              <Textarea 
                id="detailed-description"
            placeholder="E.g., I need 20 vector illustrations of cute cats playing with yarn, suitable for children's book illustrations. Focus on pastel colors and expressive faces."
                value={detailedDescription}
                onChange={(e) => setDetailedDescription(e.target.value)}
            className="min-h-[120px] bg-background/70 backdrop-blur-sm"
              />
            </div>
            
        <div>
          <Label htmlFor="reference-image" className="text-base font-medium mb-2 block">Reference Image (Optional)</Label>
          
          {referenceImageDataUrl ? (
            <div className="mt-2 border rounded-lg p-3 bg-background/70 relative">
              <div className="aspect-video relative rounded-md overflow-hidden mb-2">
                <Image
                  src={referenceImageDataUrl!}
                  alt="Reference"
                  fill
                  className="object-contain"
                  sizes="100vw"
                />
                          </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground truncate max-w-[200px]">
                  {referenceImage?.name}
                </span>
                          <Button
                  variant="destructive" 
                            size="sm"
                  onClick={removeReferenceImage}
                  className="h-8 w-8 p-0 rounded-full"
                >
                  <Trash2 className="h-4 w-4" />
                                  </Button>
              </div>
          </div>
          ) : (
            <div className="mt-2">
              <div className="flex items-center justify-center w-full">
                <label htmlFor="reference-image-upload" className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-background/50 hover:bg-background/70 transition-colors">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <FileImage className="w-8 h-8 mb-2 text-muted-foreground" />
                    <p className="mb-1 text-sm text-muted-foreground">
                      <span className="font-semibold">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs text-muted-foreground">
                      PNG, JPG or GIF (max. 5MB)
                    </p>
                    </div>
                  <input 
                    id="reference-image-upload" 
                    type="file" 
                    className="hidden" 
                    accept="image/*"
                    onChange={handleImageUpload}
                  />
                </label>
              </div>
            </div>
          )}
          </div>
          
            <Button 
          className={cn(
            "w-full py-3 text-base mt-4",
            (!contentType || !designNiche.trim()) && "opacity-70"
          )}
          onClick={handleGeneratePrompts} 
          disabled={isLoading || !contentType || !designNiche.trim()}
        >
          {isLoading ? "Generating Prompts & Metadata..." : "Generate Prompts & Metadata"}
            </Button>
      </CardContent>
    </Card>
  );
} 