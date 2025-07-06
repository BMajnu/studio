'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// ScrollArea might not be needed if prompts are not displayed here
// import { ScrollArea } from '@/components/ui/scroll-area'; 
import { X, Plus, Trash, MessageSquarePlus, Image as ImageIcon, Upload, Paperclip, ChevronDown, Settings, Check } from 'lucide-react'; // Removed Wand2, Copy, Check if not used
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
// cn might not be needed if conditional styling for prompt display is removed
// import { cn } from '@/lib/utils'; 
import { promptWithCustomSense } from '@/ai/flows/prompt-with-custom-sense-flow';
import type { PromptWithCustomSenseOutput } from '@/ai/flows/prompt-with-custom-sense-types';
import type { AttachedFile } from '@/lib/types';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
// Removed Tabs imports as they are no longer used

interface PromptWithCustomSenseProps {
  userName?: string;
  userApiKey?: string;
  modelId?: string;
  onClose: () => void;
  onPromptsGenerated: (
    prompts: PromptWithCustomSenseOutput['prompts'],
    designType: string,
    description: string,
    attachedFile?: AttachedFile,
    originalUserMessageId?: string
  ) => void;
  initialDesignType?: string;
  initialDescription?: string;
  initialAttachedFile?: AttachedFile;
  originalUserMessageId?: string;
}

// Extended design type options
const DEFAULT_DESIGN_TYPES = [
  "Vector Design",
  "Illustration",
  "POD Design",
  "Thumbnail Design",
  "Poster Design",
  "Real Photo/Image",
  "Background Design",
  "Pattern Design",
  "Abstract Design",
  "Effect Design",
  "Image Manipulation",
];

export function PromptWithCustomSense({ userName, userApiKey, modelId, onClose, onPromptsGenerated, initialDesignType, initialDescription, initialAttachedFile, originalUserMessageId }: PromptWithCustomSenseProps) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [designTypes, setDesignTypes] = useState<string[]>(DEFAULT_DESIGN_TYPES);
  const [selectedDesignType, setSelectedDesignType] = useState<string>(initialDesignType || "POD Design");
  const [description, setDescription] = useState<string>(initialDescription || "");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [newDesignType, setNewDesignType] = useState<string>("");
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropZoneRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  // Handle paste events for the entire modal
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      if (e.clipboardData && e.clipboardData.files.length > 0) {
        const file = e.clipboardData.files[0];
        if (file.type.startsWith('image/')) {
          setSelectedFile(file);
          e.preventDefault();
          toast({
            title: "Image pasted",
            description: `${file.name} has been attached.`,
            duration: 2000,
          });
        }
      }
    };

    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, [toast]);

  // Setup drag and drop handlers
  const handleDragEnter = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setSelectedFile(e.dataTransfer.files[0]);
      e.dataTransfer.clearData();
    }
  }, []);
  
  const addDesignType = () => {
    if (newDesignType && !designTypes.includes(newDesignType)) {
      setDesignTypes([...designTypes, newDesignType]);
      setSelectedDesignType(newDesignType);
      setNewDesignType("");
    }
  };

  const removeDesignType = (typeToRemove: string) => {
    setDesignTypes(designTypes.filter(t => t !== typeToRemove));
    if (selectedDesignType === typeToRemove) {
      setSelectedDesignType(designTypes[0] || "");
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

  const handleGeneratePrompts = async () => {
    if (!description) {
      toast({ title: "Description missing", description: "Please describe the concept.", variant: "destructive" });
      return;
    }

    setIsLoading(true);

    let attachedFile: AttachedFile | undefined;
    if (selectedFile) {
      try {
        const fileData = await readFileAsDataURL(selectedFile);
        attachedFile = { name: selectedFile.name, type: selectedFile.type, size: selectedFile.size, dataUri: fileData };
      } catch (error) {
        toast({ title: "File Read Error", description: "Could not read the attached file.", variant: "destructive" });
        setIsLoading(false);
        return;
      }
    } else if (initialAttachedFile) {
        attachedFile = initialAttachedFile;
    }

    try {
      const result = await promptWithCustomSense({
        userApiKey,
        modelId,
        userName,
        designType: selectedDesignType,
        description,
      });

      if (result.prompts.length > 0) {
        onPromptsGenerated(result.prompts, selectedDesignType, description, attachedFile, originalUserMessageId);
        toast({
          title: 'Prompts Generated',
          description: `Generated ${result.prompts.length} prompts for ${selectedDesignType}.`,
        });
      } else {
        toast({
          title: "No prompts generated",
          description: "Failed to generate prompts. Please try again.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Error generating prompts:", error);
      toast({
        title: "Error",
        description: "Failed to generate prompts. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div ref={dropZoneRef} onDrop={handleDrop} onDragOver={handleDragOver} onDragEnter={handleDragEnter} onDragLeave={handleDragLeave} className="flex flex-col h-full">
      <header className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center space-x-2">
          <MessageSquarePlus className="h-6 w-6 text-primary" />
          <h2 className="text-lg font-semibold">Generate Design Prompts</h2>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </header>

      <main className="flex-1 p-4 space-y-6 overflow-y-auto">
        <div className={cn("absolute inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm", isDragging ? 'visible' : 'hidden')}>
          <div className="text-2xl font-bold text-primary">Drop image anywhere</div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>What type of design is it?</CardTitle>
          </CardHeader>
          <CardContent>
            <RadioGroup value={selectedDesignType} onValueChange={setSelectedDesignType} className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {designTypes.map((type) => (
                <div key={type} className="flex items-center space-x-2 group">
                  <RadioGroupItem value={type} id={type} />
                  <Label htmlFor={type} className="flex-1">{type}</Label>
                  <Button variant="ghost" size="icon" className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => removeDesignType(type)}>
                    <Trash className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </RadioGroup>
            <div className="flex mt-4">
              <Input
                type="text"
                placeholder="Add new design type..."
                value={newDesignType}
                onChange={(e) => setNewDesignType(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addDesignType()}
                className="rounded-r-none"
              />
              <Button onClick={addDesignType} className="rounded-l-none">
                <Plus className="h-4 w-4 mr-2" /> Add
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Describe the original concept or what changes you want <span className="text-destructive">*</span></CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              ref={textareaRef}
              placeholder="E.g., A funny cat wearing sunglasses for a t-shirt design"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="h-32"
            />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Enhanced file attachment with drag & drop</CardTitle>
          </CardHeader>
          <CardContent>
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-muted-foreground/50 rounded-lg p-8 text-center cursor-pointer hover:border-primary transition-colors"
            >
              <input
                ref={fileInputRef}
                type="file" 
                accept="image/*" 
                className="hidden" 
                onChange={(e) => setSelectedFile(e.target.files && e.target.files[0] ? e.target.files[0] : null)}
              />
              <div className="flex flex-col items-center space-y-2 text-muted-foreground">
                {selectedFile ? (
                  <>
                    <Check className="h-8 w-8 text-green-500" />
                    <span className="font-semibold">{selectedFile.name}</span>
                    <Button variant="link" size="sm" onClick={(e) => { e.stopPropagation(); setSelectedFile(null); if (fileInputRef.current) fileInputRef.current.value = ""; }}>
                      Remove
                    </Button>
                  </>
                ) : initialAttachedFile ? (
                   <>
                    <Check className="h-8 w-8 text-green-500" />
                    <span className="font-semibold">{initialAttachedFile.name}</span>
                    <Button variant="link" size="sm" onClick={(e) => { e.stopPropagation(); setSelectedFile(null); }}>
                      Replace
                    </Button>
                  </>
                ) : (
                  <>
                    <Upload className="h-8 w-8" />
                    <span>Click or drag & drop to upload</span>
                    <span className="text-xs">Optional reference image</span>
                  </>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </main>

      <footer className="flex justify-end p-4 border-t">
        <Button onClick={handleGeneratePrompts} disabled={isLoading} size="lg">
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary-foreground mr-2" />
              Generating...
            </>
          ) : (
            <>
              <MessageSquarePlus className="h-5 w-5 mr-2" />
              Generate Prompts
            </>
          )}
        </Button>
      </footer>
    </div>
  );
} 