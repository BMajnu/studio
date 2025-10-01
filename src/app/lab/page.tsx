'use client';

import { useState, useCallback, useRef } from 'react';
import { useUserProfile } from '@/lib/hooks/use-user-profile';
import { useAuth } from '@/contexts/auth-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { 
  Loader2, Sparkles, Download, Copy, Image as ImageIcon, 
  Upload, X, Wand2, Plus, Shuffle, Clock, Lightbulb,
  ChevronDown, ChevronUp, Palette, Home, ArrowLeft
} from 'lucide-react';
import Link from 'next/link';
import { IMAGE_GENERATION_MODELS } from '@/lib/constants';
import { GeminiImageGenClient, type GeneratedImageData } from '@/lib/ai/gemini-image-gen';
import { Skeleton } from '@/components/ui/skeleton';
import NextImage from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

// Force dynamic rendering for this page
export const dynamic = 'force-dynamic';

interface ImageReference {
  id: string;
  file: File;
  preview: string;
}

interface GenerationHistory {
  id: string;
  prompt: string;
  images: GeneratedImageData[];
  timestamp: number;
  model: string;
}

export default function LabPage() {
  const { profile, isLoading: profileLoading } = useUserProfile();
  const { user, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Generation state
  const [selectedModel, setSelectedModel] = useState(IMAGE_GENERATION_MODELS[0]?.id || 'gemini-2.5-flash-image-preview');
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImages, setGeneratedImages] = useState<GeneratedImageData[]>([]);
  const [textResponse, setTextResponse] = useState<string>('');
  
  // Advanced controls
  const [imageReferences, setImageReferences] = useState<ImageReference[]>([]);
  const [selectedStyle, setSelectedStyle] = useState<string>('');
  const [selectedComposition, setSelectedComposition] = useState<string>('');
  const [history, setHistory] = useState<GenerationHistory[]>([]);
  
  // UI state
  const [expandedSections, setExpandedSections] = useState({
    style: true,
    composition: false,
    effects: false,
    character: false,
    object: false,
    colors: false,
  });

  const isLoading = profileLoading || authLoading;

  // Style presets
  const stylePresets = [
    'Realistic', 'Digital Art', 'Oil Painting', 'Watercolor', 
    'Anime', '3D Render', 'Pixel Art', 'Vector', 'Sketch'
  ];

  // Composition presets
  const compositionPresets = [
    'Portrait', 'Landscape', 'Square', 'Panoramic', 
    'Close-up', 'Wide Shot', 'Rule of Thirds'
  ];

  // Toggle section expansion
  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Handle image reference upload
  const handleImageReferenceUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    if (imageReferences.length + files.length > 8) {
      toast({
        title: "Limit Exceeded",
        description: "You can only upload up to 8 reference images.",
        variant: "destructive"
      });
      return;
    }

    Array.from(files).forEach(file => {
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Invalid File",
          description: "Please upload only image files.",
          variant: "destructive"
        });
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setImageReferences(prev => [...prev, {
          id: Math.random().toString(36).substr(2, 9),
          file,
          preview: reader.result as string
        }]);
      };
      reader.readAsDataURL(file);
    });

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, [imageReferences, toast]);

  // Remove image reference
  const removeImageReference = useCallback((id: string) => {
    setImageReferences(prev => prev.filter(ref => ref.id !== id));
  }, []);

  const handleGenerate = useCallback(async () => {
    if (!prompt.trim()) {
      toast({
        title: "Prompt Required",
        description: "Please enter a description of the image you want to generate.",
        variant: "destructive"
      });
      return;
    }

    if (!profile) {
      toast({
        title: "Profile Required",
        description: "Please set up your profile with API keys first.",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsGenerating(true);
      setGeneratedImages([]);
      setTextResponse('');

      // Build enhanced prompt with style and composition
      let enhancedPrompt = prompt;
      if (selectedStyle) {
        enhancedPrompt += `. Style: ${selectedStyle}`;
      }
      if (selectedComposition) {
        enhancedPrompt += `. Composition: ${selectedComposition}`;
      }

      const imageClient = new GeminiImageGenClient(profile);
      const result = await imageClient.generateImages(selectedModel, enhancedPrompt);

      if (result.images && result.images.length > 0) {
        setGeneratedImages(result.images);
        setTextResponse(result.textResponse || '');
        
        // Add to history
        const historyEntry: GenerationHistory = {
          id: Date.now().toString(),
          prompt: enhancedPrompt,
          images: result.images,
          timestamp: Date.now(),
          model: selectedModel
        };
        setHistory(prev => [historyEntry, ...prev].slice(0, 20)); // Keep last 20

        toast({
          title: "Success!",
          description: `Generated ${result.images.length} image${result.images.length > 1 ? 's' : ''}!`
        });
      } else {
        toast({
          title: "No Images Generated",
          description: "The model didn't return any images. Try a different prompt.",
          variant: "destructive"
        });
      }
    } catch (error: any) {
      console.error('Image generation error:', error);
      toast({
        title: "Generation Failed",
        description: error.message || "Failed to generate image. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  }, [prompt, selectedModel, selectedStyle, selectedComposition, profile, toast]);

  const handleDownload = useCallback((imageData: GeneratedImageData, index: number) => {
    try {
      const dataUrl = GeminiImageGenClient.imageToDataUrl(imageData);
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = `generated-image-${Date.now()}-${index}.${imageData.mimeType.split('/')[1] || 'png'}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: "Downloaded!",
        description: "Image has been saved to your device."
      });
    } catch (error) {
      toast({
        title: "Download Failed",
        description: "Failed to download image.",
        variant: "destructive"
      });
    }
  }, [toast]);

  const handleCopyPrompt = useCallback(() => {
    navigator.clipboard.writeText(prompt);
    toast({
      title: "Copied!",
      description: "Prompt copied to clipboard."
    });
  }, [prompt, toast]);

  if (isLoading) {
    return (
      <div className="w-full h-full overflow-y-auto bg-background">
        <div className="container mx-auto px-4 py-6 max-w-7xl">
          <Skeleton className="h-12 w-64 mb-6" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Skeleton className="h-96" />
            <Skeleton className="h-96" />
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-background">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Login Required</CardTitle>
            <CardDescription>
              Please login to use the Lab features.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col bg-gradient-to-br from-background via-background to-muted/20">
      {/* Header */}
      <div className="border-b bg-background/80 backdrop-blur-sm px-6 py-4 flex-shrink-0 shadow-sm">
        <div className="flex items-center justify-between max-w-[2000px] mx-auto">
          <div className="flex items-center gap-4">
            {/* Back to Home Button */}
            <Link href="/">
              <Button 
                variant="ghost" 
                size="icon"
                className="hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-all"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl blur opacity-30"></div>
              <div className="relative p-2.5 rounded-xl bg-gradient-to-br from-purple-500/90 to-pink-500/90">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Designer Lab
              </h1>
              <p className="text-sm text-muted-foreground mt-0.5">
                Generate stunning images with advanced AI
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/">
              <Button 
                variant="outline"
                className="hidden sm:flex items-center gap-2 hover:bg-purple-50 hover:border-purple-400 dark:hover:bg-purple-900/20 transition-all"
              >
                <Home className="h-4 w-4" />
                Home
              </Button>
            </Link>
            <Badge variant="secondary" className="bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300 font-medium px-3 py-1">
              Beta
            </Badge>
          </div>
        </div>
      </div>

      {/* Main Content: 2-column layout */}
      <div className="flex-1 flex overflow-hidden max-w-[2000px] mx-auto w-full">
        {/* LEFT PANEL: Controls */}
        <div className="w-[420px] border-r flex-shrink-0 bg-background/50 backdrop-blur-sm">
          <ScrollArea className="h-full">
            <div className="p-6 space-y-6">
              {/* Generate images heading */}
              <div>
                <h2 className="text-xl font-bold">Generate images</h2>
                <p className="text-xs text-muted-foreground mt-1">Configure your AI generation settings</p>
              </div>

              {/* AI Prompt Input with icon button */}
              <div className="space-y-2">
                <Label className="text-sm font-semibold">Prompt</Label>
                <div className="relative group">
                  <Textarea
                    placeholder="Describe the image you want to create... e.g., 'A futuristic cityscape at sunset with flying cars'"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    rows={5}
                    className="pr-12 resize-none border-2 focus:border-purple-500 transition-all shadow-sm"
                  />
                  <Button
                    size="icon"
                    variant="ghost"
                    className="absolute top-3 right-3 h-9 w-9 hover:bg-purple-100 hover:text-purple-600 dark:hover:bg-purple-900/30 dark:hover:text-purple-400 transition-all"
                    onClick={() => {
                      // AI prompt enhancement could go here
                      toast({
                        title: "✨ AI Prompt Assistant",
                        description: "Coming soon! This will help enhance your prompts."
                      });
                    }}
                  >
                    <Wand2 className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-xs text-muted-foreground">
                    {prompt.length} / 5000 characters
                  </p>
                  {prompt.trim() && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleCopyPrompt}
                      className="h-7 text-xs"
                    >
                      <Copy className="h-3 w-3 mr-1" />
                      Copy
                    </Button>
                  )}
                </div>
              </div>

              {/* Model Selection */}
              <div className="space-y-2">
                <Label className="text-sm font-semibold flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-purple-500" />
                  AI Model
                </Label>
                <Select value={selectedModel} onValueChange={setSelectedModel}>
                  <SelectTrigger className="w-full border-2 focus:border-purple-500 transition-all shadow-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {IMAGE_GENERATION_MODELS.map(model => (
                      <SelectItem key={model.id} value={model.id}>
                        <span className="flex items-center gap-2">
                          <span className="font-medium">{model.name}</span>
                          {(model as any).tag && (
                            <Badge variant="outline" className="text-xs bg-purple-50 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300">
                              {(model as any).tag}
                            </Badge>
                          )}
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  Select the AI model for generation
                </p>
              </div>

              {/* Image References */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-semibold flex items-center gap-2">
                    <ImageIcon className="h-4 w-4 text-purple-500" />
                    Reference Images
                  </Label>
                  <span className="text-xs font-medium text-muted-foreground bg-muted px-2 py-1 rounded-full">
                    {imageReferences.length}/8
                  </span>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {imageReferences.map(ref => (
                    <div key={ref.id} className="relative aspect-square rounded-lg overflow-hidden border-2 border-border group hover:border-purple-400 transition-all shadow-sm">
                      <NextImage
                        src={ref.preview}
                        alt="Reference"
                        fill
                        className="object-cover"
                      />
                      <button
                        onClick={() => removeImageReference(ref.id)}
                        className="absolute top-1.5 right-1.5 bg-red-500 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 hover:bg-red-600 transition-all shadow-lg"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                  {imageReferences.length < 8 && (
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="aspect-square rounded-lg border-2 border-dashed border-muted-foreground/30 hover:border-purple-500 hover:bg-purple-50 dark:hover:bg-purple-900/10 transition-all flex items-center justify-center group"
                    >
                      <div className="text-center">
                        <Plus className="h-5 w-5 text-muted-foreground group-hover:text-purple-500 transition-colors mx-auto" />
                      </div>
                    </button>
                  )}
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageReferenceUpload}
                  className="hidden"
                />
                <p className="text-xs text-muted-foreground">
                  Upload reference images to guide the AI generation
                </p>
              </div>

              {/* Style Section */}
              <div className="space-y-3 p-4 rounded-xl border-2 bg-card shadow-sm">
                <button
                  onClick={() => toggleSection('style')}
                  className="w-full flex items-center justify-between group"
                >
                  <span className="flex items-center gap-2 text-sm font-semibold">
                    <Palette className="h-4 w-4 text-purple-500" />
                    Style
                  </span>
                  {expandedSections.style ? (
                    <ChevronUp className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                  )}
                </button>
                {expandedSections.style && (
                  <div className="space-y-3 pt-2">
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 hover:bg-purple-50 hover:text-purple-700 hover:border-purple-400 dark:hover:bg-purple-900/20 dark:hover:text-purple-300 transition-all"
                        onClick={() => {
                          const randomStyle = stylePresets[Math.floor(Math.random() * stylePresets.length)];
                          setSelectedStyle(randomStyle);
                          toast({
                            title: "Random Style Selected",
                            description: `Selected: ${randomStyle}`
                          });
                        }}
                      >
                        <Shuffle className="h-3 w-3 mr-1.5" />
                        Random
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 hover:bg-purple-50 hover:text-purple-700 dark:hover:bg-purple-900/20 dark:hover:text-purple-300 transition-all"
                        onClick={() => setSelectedStyle('')}
                      >
                        <X className="h-3 w-3 mr-1.5" />
                        Clear
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {stylePresets.map(style => (
                        <button
                          key={style}
                          onClick={() => setSelectedStyle(style === selectedStyle ? '' : style)}
                          className={cn(
                            "px-3.5 py-2 text-xs font-medium rounded-full border-2 transition-all shadow-sm",
                            selectedStyle === style
                              ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white border-transparent shadow-md scale-105"
                              : "bg-background hover:bg-purple-50 dark:hover:bg-purple-900/20 border-border hover:border-purple-400 hover:scale-105"
                          )}
                        >
                          {style}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Composition Section */}
              <div className="space-y-3 p-4 rounded-xl border-2 bg-card shadow-sm">
                <button
                  onClick={() => toggleSection('composition')}
                  className="w-full flex items-center justify-between group"
                >
                  <span className="flex items-center gap-2 text-sm font-semibold">
                    Composition
                  </span>
                  {expandedSections.composition ? (
                    <ChevronUp className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                  )}
                </button>
                {expandedSections.composition && (
                  <div className="space-y-3 pt-2">
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 hover:bg-purple-50 hover:text-purple-700 dark:hover:bg-purple-900/20 dark:hover:text-purple-300 transition-all"
                        onClick={() => setSelectedComposition('')}
                      >
                        <X className="h-3 w-3 mr-1.5" />
                        Clear
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {compositionPresets.map(comp => (
                        <button
                          key={comp}
                          onClick={() => setSelectedComposition(comp === selectedComposition ? '' : comp)}
                          className={cn(
                            "px-3.5 py-2 text-xs font-medium rounded-full border-2 transition-all shadow-sm",
                            selectedComposition === comp
                              ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white border-transparent shadow-md scale-105"
                              : "bg-background hover:bg-purple-50 dark:hover:bg-purple-900/20 border-border hover:border-purple-400 hover:scale-105"
                          )}
                        >
                          {comp}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

            </div>

            {/* Generate Button - Sticky at bottom of left panel */}
            <div className="sticky bottom-0 p-6 bg-gradient-to-t from-background via-background to-transparent border-t backdrop-blur-sm">
              <Button
                onClick={handleGenerate}
                disabled={isGenerating || !prompt.trim()}
                className="w-full h-12 bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-black font-bold text-base shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                size="lg"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-5 w-5 mr-2" />
                    Generate
                  </>
                )}
              </Button>
            </div>
          </ScrollArea>
        </div>

        {/* RIGHT PANEL: Generated Images & History */}
        <div className="flex-1 flex flex-col overflow-hidden bg-background/30">
          <Tabs defaultValue="history" className="flex-1 flex flex-col">
            <div className="border-b px-6 py-4 bg-background/80 backdrop-blur-sm">
              <TabsList className="bg-muted/50">
                <TabsTrigger 
                  value="history" 
                  className="flex items-center gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm"
                >
                  <Clock className="h-4 w-4" />
                  <span className="font-medium">History</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="inspiration" 
                  className="flex items-center gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm"
                >
                  <Lightbulb className="h-4 w-4" />
                  <span className="font-medium">Inspiration</span>
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="history" className="flex-1 m-0 overflow-hidden">
              <ScrollArea className="h-full">
                <div className="p-6">
                  {isGenerating ? (
                    <div className="flex flex-col items-center justify-center py-32 bg-gradient-to-br from-purple-50/50 to-pink-50/50 dark:from-purple-900/10 dark:to-pink-900/10 rounded-2xl">
                      <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full blur-xl opacity-30 animate-pulse"></div>
                        <Loader2 className="relative h-20 w-20 animate-spin text-purple-500" />
                      </div>
                      <p className="text-xl font-bold mt-6">Generating your image...</p>
                      <p className="text-sm text-muted-foreground mt-2">AI is crafting your masterpiece</p>
                    </div>
                  ) : history.length > 0 || generatedImages.length > 0 ? (
                    <div className="grid grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-5">
                      {/* Current generation */}
                      {generatedImages.map((image, index) => (
                        <div key={`current-${index}`} className="group space-y-3">
                          <div className="relative aspect-square rounded-xl overflow-hidden bg-muted border-2 border-purple-500 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-[1.02]">
                            <NextImage
                              src={GeminiImageGenClient.imageToDataUrl(image)}
                              alt={`Generated ${index + 1}`}
                              fill
                              className="object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            <div className="absolute top-3 right-3">
                              <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0 shadow-lg font-semibold">
                                New
                              </Badge>
                            </div>
                            <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                              <Button
                                variant="secondary"
                                size="sm"
                                onClick={() => handleDownload(image, index)}
                                className="w-full bg-white/90 hover:bg-white text-black font-semibold shadow-lg"
                              >
                                <Download className="h-3.5 w-3.5 mr-2" />
                                Download
                              </Button>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">{prompt}</p>
                            <div className="flex items-center gap-2 flex-wrap">
                              <Badge variant="outline" className="text-xs">1:1</Badge>
                              <Badge variant="outline" className="text-xs bg-purple-50 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300 border-purple-200 dark:border-purple-800">
                                {selectedModel.split('/').pop()}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      ))}

                      {/* History items */}
                      {history.map((item) => (
                        item.images.map((image, imgIndex) => (
                          <div key={`${item.id}-${imgIndex}`} className="group space-y-3">
                            <div className="relative aspect-square rounded-xl overflow-hidden bg-muted border shadow-md hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
                              <NextImage
                                src={GeminiImageGenClient.imageToDataUrl(image)}
                                alt={`History ${item.id}`}
                                fill
                                className="object-cover"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                              <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <Button
                                  variant="secondary"
                                  size="sm"
                                  onClick={() => handleDownload(image, imgIndex)}
                                  className="w-full bg-white/90 hover:bg-white text-black font-semibold shadow-lg"
                                >
                                  <Download className="h-3.5 w-3.5 mr-2" />
                                  Download
                                </Button>
                              </div>
                            </div>
                            <div className="space-y-2">
                              <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">{item.prompt}</p>
                              <div className="flex items-center gap-2 flex-wrap">
                                <Badge variant="outline" className="text-xs">1:1</Badge>
                                <Badge variant="outline" className="text-xs text-muted-foreground">
                                  {new Date(item.timestamp).toLocaleDateString()}
                                </Badge>
                              </div>
                            </div>
                          </div>
                        ))
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-32 text-muted-foreground bg-gradient-to-br from-muted/30 to-muted/10 rounded-2xl">
                      <div className="relative">
                        <div className="absolute inset-0 bg-purple-500/20 rounded-full blur-2xl"></div>
                        <ImageIcon className="relative h-24 w-24 mb-6 opacity-20" />
                      </div>
                      <p className="text-xl font-bold">No images yet</p>
                      <p className="text-sm mt-2 max-w-md text-center">
                        Start creating amazing images with AI. Enter a prompt on the left and click Generate.
                      </p>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="inspiration" className="flex-1 m-0 overflow-hidden">
              <ScrollArea className="h-full">
                <div className="p-6">
                  <div className="flex flex-col items-center justify-center py-32 text-muted-foreground bg-gradient-to-br from-yellow-50/50 to-orange-50/50 dark:from-yellow-900/10 dark:to-orange-900/10 rounded-2xl">
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full blur-2xl opacity-20 animate-pulse"></div>
                      <Lightbulb className="relative h-24 w-24 mb-6 opacity-30 text-yellow-600 dark:text-yellow-400" />
                    </div>
                    <p className="text-xl font-bold">Inspiration Gallery</p>
                    <p className="text-sm mt-2 max-w-md text-center">
                      Coming soon! Browse curated designs, trending prompts, and get inspired by the community.
                    </p>
                    <Button 
                      variant="outline" 
                      className="mt-6"
                      disabled
                    >
                      Explore Soon
                    </Button>
                  </div>
                </div>
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

