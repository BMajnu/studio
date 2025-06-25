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
  initialDesignStyles?: string[];
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

// Design styles by category for 2025 trends
const DESIGN_STYLES_BY_CATEGORY: Record<string, string[]> = {
  "Vector Design": [
    "Corporate Memphis",
    "AI-assisted illustration",
    "AI-generated surrealism",
    "Line art / minimalist line drawing",
    "Colorful abstract vectors",
    "Retro-psychedelic illustration",
    "Art Deco revival visuals",
    "Vintage / retro illustration",
    "Comic-book/cartoon style",
    "Doodle/hand-drawn imagery",
    "Whimsical illustration",
    "Technical/diagrammatic illustration",
    "Mixed-media collages",
    "3D playful characters",
    "Multidisciplinary handcrafted textures"
  ],
  "Illustration": [
    "Corporate Memphis",
    "AI-assisted illustration",
    "AI-generated surrealism",
    "Line art / minimalist line drawing",
    "Colorful abstract vectors",
    "Retro-psychedelic illustration",
    "Art Deco revival visuals",
    "Vintage / retro illustration",
    "Comic-book/cartoon style",
    "Doodle/hand-drawn imagery",
    "Whimsical illustration",
    "Technical/diagrammatic illustration",
    "Mixed-media collages",
    "3D playful characters",
    "Multidisciplinary handcrafted textures"
  ],
  "Real Photo/Image": [
    "Bold minimalism",
    "Textured grain photography",
    "Maximum-contrast imagery",
    "Diversity & representation photography",
    "AI-realism",
    "Biophilic/eco-nature photos",
    "Retro-inspired photography",
    "Metallic/shiny surfaces & reflections",
    "Pixelated/lo-fi imagery",
    "Environmental documentary style"
  ],
  "POD Design": [
    "Retro serif typography + vintage colors",
    "Maximalist illustration",
    "Motivational typographic prints",
    "Boho / Scandinavian poster style",
    "Minimalist graphic prints",
    "Pop-art / fine art prints",
    "Decor-style photography prints",
    "Personalized/custom photo posters",
    "Retro typography posters",
    "Sports & vintage collectible prints"
  ],
  "Thumbnail Design": [
    "Bold typography + solid colors",
    "Playful 3D character thumbnails",
    "Maximum contrast + vibrant color blocking",
    "AI-enhanced photo realism",
    "Hand-drawn doodle overlays",
    "Minimalist iconography & symbols",
    "Retro/pixel aesthetic visuals",
    "Collage-style thumbnails"
  ],
  "Poster Design": [
    "Retro typographic posters",
    "Minimalist photogenic posters",
    "Mixed-media collage posters",
    "Art Deco revival posters",
    "Abstract geometric shape posters",
    "Metallic sheen/pixel posters",
    "Maximalist illustration posters",
    "Photography + shape overlay posters",
    "Typographic motivational / quote designs",
    "Personalized/custom photo posters"
  ],
  "Background Design": [
    "Textured grain and tactile backgrounds",
    "Geometric abstract shapes patterns",
    "Dreamy textures + AI pattern blending",
    "Metallic gradients & reflective backdrops",
    "Biophilic/nature-inspired backdrops",
    "Pixelated / digital glitch-style backgrounds"
  ],
  "Pattern Design": [
    "Vintage florals & chintz prints",
    "Animal print patterns",
    "Stripes, checks & plaids",
    "Art Deco geometric patterns",
    "Abstract geometric repeats",
    "Artwork-inspired luxe prints",
    "Texture-grain backgrounds as pattern"
  ],
  "Abstract Design": [
    "Colorful abstract vectors",
    "Abstract geometric compositions",
    "Maximum contrast abstract visuals",
    "Metallic abstraction with sheen",
    "AI-generated abstract surrealism",
    "Dreamy texture overlays"
  ],
  "Effect Design": [
    "Textured grain & film noise effects",
    "Pixel/glitch effects",
    "Metallic chrome / sheen overlays",
    "AI-generated motion blur or surreal effect",
    "3D depth & shadow effects"
  ],
  "Image Manipulation": [
    "Mixed-media collage composites",
    "AI surrealist image blends",
    "Handcrafted texture overlays",
    "Retro filters & color grading",
    "Double-exposure / photographic layering"
  ]
};

export function PromptWithCustomSense({ userName, userApiKey, modelId, onClose, onPromptsGenerated, initialDesignType, initialDesignStyles, initialDescription, initialAttachedFile, originalUserMessageId }: PromptWithCustomSenseProps) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [designTypes, setDesignTypes] = useState<string[]>(DEFAULT_DESIGN_TYPES);
  const [selectedDesignType, setSelectedDesignType] = useState<string>(initialDesignType || "POD Design");
  const [selectedDesignStyles, setSelectedDesignStyles] = useState<string[]>(initialDesignStyles || []);
  const [isStyleDialogOpen, setIsStyleDialogOpen] = useState<boolean>(false);
  const [isAutoMode, setIsAutoMode] = useState<boolean>(initialDesignStyles ? initialDesignStyles.length===0 : true);
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
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith('image/')) {
        setSelectedFile(file);
        toast({
          title: "Image attached",
          description: `${file.name} has been attached.`,
          duration: 2000,
        });
      } else {
        toast({
          title: "Invalid file type",
          description: "Please drop an image file.",
          variant: "destructive",
          duration: 3000,
        });
      }
    }
  }, [toast]);
  
  const addDesignType = () => {
    if (newDesignType.trim() === "") return;
    if (designTypes.includes(newDesignType.trim())) {
      toast({
        title: "Design type already exists",
        description: "This design type is already in the list.",
        variant: "destructive"
      });
      return;
    }
    
    setDesignTypes(prev => [...prev, newDesignType.trim()]);
    setNewDesignType("");
  };
  
  const removeDesignType = (typeToRemove: string) => {
    if (designTypes.length <= 1) {
      toast({
        title: "Cannot remove",
        description: "You need at least one design type.",
        variant: "destructive"
      });
      return;
    }
    
    setDesignTypes(prev => prev.filter(type => type !== typeToRemove));
    if (selectedDesignType === typeToRemove) {
      setSelectedDesignType(designTypes.filter(type => type !== typeToRemove)[0] || DEFAULT_DESIGN_TYPES[0]);
    }
  };
  
  // Helper to read file as data URI
  const readFileAsDataURL = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };
  
  // Effect to reset selected design style when design type changes
  useEffect(() => {
    // reset style selections when switching type
    setSelectedDesignStyles([]);
    setIsAutoMode(true);
  }, [selectedDesignType]);

  // Get available styles for the selected design type
  const getAvailableStyles = useCallback(() => {
    return DESIGN_STYLES_BY_CATEGORY[selectedDesignType] || [];
  }, [selectedDesignType]);

  // Get a random style for auto mode
  const getRandomStylesForType = useCallback((count: number = 1) => {
    const styles = [...getAvailableStyles()];
    if (styles.length === 0) return [];
    // Shuffle array
    for (let i = styles.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [styles[i], styles[j]] = [styles[j], styles[i]];
    }
    return styles.slice(0, count);
  }, [getAvailableStyles]);

  // If initialAttachedFile provided convert to Blob URL preview by creating a dummy File via fetch
  useEffect(() => {
    const loadInitialFile = async () => {
      if (initialAttachedFile && initialAttachedFile.dataUri && !selectedFile) {
        try {
          const res = await fetch(initialAttachedFile.dataUri);
          const blob = await res.blob();
          const fileLike = new File([blob], initialAttachedFile.name || 'image.png', { type: blob.type });
          setSelectedFile(fileLike);
        } catch (e) {
          console.warn('Failed to load initial attached image', e);
        }
      }
    };
    loadInitialFile();
  }, [initialAttachedFile, selectedFile]);

  const handleGeneratePrompts = async () => {
    if (description.trim() === "") {
      toast({
        title: "Description required",
        description: "Please describe the original concept or changes you want.",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    
    // If auto mode is enabled and no style is selected, pick one randomly
    let finalDesignStyles = selectedDesignStyles;
    if (isAutoMode && selectedDesignStyles.length === 0) {
      finalDesignStyles = getRandomStylesForType(1);
    }
    
    // Enhance description with chosen styles (if any)
    let enhancedDescription = description.trim();
    if (finalDesignStyles.length > 0) {
      const stylesSentence = finalDesignStyles.map(s => `"${s}"`).join(', ');
      enhancedDescription += `\n\nPlease use the following design style${finalDesignStyles.length > 1 ? 's' : ''}: ${stylesSentence} for this ${selectedDesignType.toLowerCase()}.`;
    }
    
    try {
      const result = await promptWithCustomSense({
        designType: selectedDesignType,
        description: enhancedDescription,
        userName,
        userApiKey,
        modelId,
      });
      
      let attachedFile: AttachedFile | undefined = undefined;
      if (selectedFile) {
        try {
          const dataUri = await readFileAsDataURL(selectedFile);
          attachedFile = {
            name: selectedFile.name,
            type: selectedFile.type,
            size: selectedFile.size,
            dataUri,
          };
        } catch (e) {
          console.error('Error reading attached file', e);
        }
      }

      onPromptsGenerated(result.prompts, selectedDesignType, description.trim(), attachedFile, originalUserMessageId);
      onClose();
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
    <Card 
      className="w-full max-w-4xl mx-auto glass-panel border border-primary/10 shadow-lg animate-fadeIn" 
      onDragEnter={handleDragEnter} 
      onDragOver={handleDragOver}
    >
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-2xl text-gradient">
          <MessageSquarePlus className="h-5 w-5 inline-block mr-2" />
          Prompt with Custom Change
        </CardTitle>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-3 flex items-center gap-2">
                What type of design is it?
                <span className="text-xs text-muted-foreground font-normal">(Select one or add new)</span>
              </h3>
              <RadioGroup 
                value={selectedDesignType} 
                onValueChange={setSelectedDesignType}
                className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2"
              >
                {designTypes.map((type) => (
                  <div key={type} className="flex items-center space-x-2 justify-between p-2 border rounded-md hover:border-primary/40 transition-all duration-200">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value={type} id={`type-${type}`} />
                      <Label htmlFor={`type-${type}`}>{type}</Label>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-6 w-6 text-muted-foreground hover:text-destructive"
                      onClick={() => removeDesignType(type)}
                    >
                      <Trash className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </RadioGroup>
              
              <div className="flex items-center mt-4 space-x-2">
                <Input 
                  placeholder="Add new design type..." 
                  value={newDesignType}
                  onChange={(e) => setNewDesignType(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addDesignType();
                    }
                  }}
                  className="flex-1"
                />
                <Button onClick={addDesignType} className="flex-shrink-0">
                  <Plus className="h-4 w-4 mr-1" /> Add
                </Button>
              </div>
            </div>
            
            {/* Design Style Selection */}
            <div>
              <h3 className="text-lg font-medium mb-3 flex items-center gap-2">
                Select Design Style
                <span className="text-xs text-muted-foreground font-normal">(Optional)</span>
              </h3>
              
              <div className="flex items-center space-x-3">
                <Button 
                  variant={selectedDesignStyles.length === 0 ? "secondary" : "outline"} 
                  className={cn(
                    "flex-1 justify-between text-left font-normal",
                    selectedDesignStyles.length > 0 ? "border-primary/50 bg-primary/5" : ""
                  )} 
                  onClick={() => setIsStyleDialogOpen(true)}
                >
                  <span>{
                    selectedDesignStyles.length === 0
                      ? "Auto (AI will choose)"
                      : `${selectedDesignStyles.length} style${selectedDesignStyles.length > 1 ? 's' : ''} selected`
                  }</span>
                  <ChevronDown className="h-4 w-4 opacity-50" />
                </Button>
                
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button 
                        variant={isAutoMode ? "secondary" : "outline"} 
                        size="icon"
                        className={isAutoMode ? "border-primary/50 bg-primary/10 hover:bg-primary/20" : ""}
                        onClick={() => setIsAutoMode(!isAutoMode)}
                      >
                        <Settings className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{isAutoMode ? "Auto Mode: ON" : "Auto Mode: OFF"}</p>
                      <p className="text-xs text-muted-foreground">
                        {isAutoMode 
                          ? "AI will randomly choose an appropriate style if none is selected" 
                          : "Only use specifically selected style"}
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-3 flex items-center gap-2">
                Describe the original concept or what changes you want
                <span className="text-xs text-muted-foreground font-normal">(Required)</span>
              </h3>
              <Textarea
                ref={textareaRef}
                placeholder="E.g., A funny cat wearing sunglasses for a t-shirt design" 
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="min-h-[120px] border-primary/20 focus:border-primary/50 transition-all duration-300"
              />
            </div>
            
            {/* Enhanced file attachment with drag & drop */}
            <div 
              ref={dropZoneRef}
              className={`border-2 border-dashed rounded-lg p-4 transition-all duration-300 flex flex-col items-center justify-center gap-3 ${
                isDragging ? 'border-primary bg-primary/10' : 'border-muted-foreground/30 hover:border-primary/30'
              }`}
              onDragEnter={handleDragEnter}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <input 
                ref={fileInputRef}
                type="file" 
                accept="image/*" 
                className="hidden" 
                onChange={(e) => setSelectedFile(e.target.files && e.target.files[0] ? e.target.files[0] : null)}
              />
              
              {selectedFile ? (
                <div className="flex flex-col items-center justify-center">
                  <div className="relative group rounded-md overflow-hidden border border-dashed border-primary/40 w-24 h-24">
                    <img
                      src={URL.createObjectURL(selectedFile as File)}
                      alt={selectedFile.name}
                      className="object-cover w-full h-full"
                    />
                    <button
                      type="button"
                      onClick={() => setSelectedFile(null)}
                      className="absolute -top-2 -right-2 bg-destructive text-white rounded-full h-5 w-5 flex items-center justify-center shadow-md hover:scale-110 transition-transform"
                      title="Remove"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                  <p className="text-xs mt-1 max-w-[6rem] text-center truncate" title={selectedFile.name}>{selectedFile.name}</p>
                  <span className="text-[10px] text-muted-foreground">{(selectedFile.size/1024).toFixed(0)} KB</span>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-center p-3 bg-muted/30 rounded-full">
                    <Upload className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <div className="text-center">
                    <p className="font-medium">Drop an image here or click to browse</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      You can also paste (Ctrl+V) an image from your clipboard
                    </p>
                  </div>
                  <Button 
                    variant="secondary" 
                    className="mt-2" 
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <ImageIcon className="h-4 w-4 mr-2" /> Browse Files
                  </Button>
                </>
              )}
            </div>
            
            <Button
              className="w-full bg-gradient-to-r from-primary to-primary/80 text-primary-foreground hover:from-primary/90 hover:to-primary/70 py-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
              onClick={handleGeneratePrompts}
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-r-transparent"></div>
                  <span>Generating...</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <MessageSquarePlus className="h-5 w-5" />
                  <span>Generate Prompts</span>
                </div>
              )}
            </Button>
          </div>
      </CardContent>
      
      {/* Design Style Selection Dialog */}
      <Dialog open={isStyleDialogOpen} onOpenChange={setIsStyleDialogOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>Choose a Design Style for {selectedDesignType}</DialogTitle>
            <DialogDescription>
              Select a specific style or leave unselected for auto mode
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="mt-4 max-h-[400px] rounded-md border p-4">
            <div className="grid grid-cols-1 gap-2">
              <Button
                variant={selectedDesignStyles.length === 0 ? "secondary" : "outline"}
                className="justify-start gap-2 h-auto py-2 mb-2"
                onClick={() => {
                  setSelectedDesignStyles([]);
                  setIsStyleDialogOpen(false);
                }}
              >
                {selectedDesignStyles.length === 0 && <Check className="h-4 w-4" />}
                <span className="font-medium">Auto (AI will choose)</span>
              </Button>
              
              <div className="h-px bg-border my-2"></div>
              
              {getAvailableStyles().map((style) => {
                const isSelected = selectedDesignStyles.includes(style);
                const disabled = !isSelected && selectedDesignStyles.length >= 5; // limit 5
                return (
                  <Button
                    key={style}
                    variant={isSelected ? "secondary" : "outline"}
                    className="justify-start gap-2 h-auto py-2 disabled:opacity-50"
                    disabled={disabled}
                    onClick={() => {
                      setSelectedDesignStyles(prev => {
                        if (prev.includes(style)) {
                          return prev.filter(s => s !== style);
                        }
                        if (prev.length < 5) {
                          return [...prev, style];
                        }
                        return prev; // ignore if limit reached
                      });
                      setIsAutoMode(false);
                    }}
                  >
                    {isSelected && <Check className="h-4 w-4" />}
                    <span>{style}</span>
                  </Button>
                );
              })}
            </div>
          </ScrollArea>
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setIsStyleDialogOpen(false)}>
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
} 