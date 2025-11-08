'use client';

import { useState, useCallback, useRef } from 'react';
import { useUserProfile } from '@/lib/hooks/use-user-profile';
import { useAuth } from '@/contexts/auth-context';
import { useRecentGeneratedImages } from '@/lib/hooks/use-recent-generated-images';
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
  ChevronDown, ChevronUp, Palette, Home, ArrowLeft, Maximize2, Code
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
import { GeneratedImageStorage } from '@/lib/firebase/generatedImageStorage';
import type { GeneratedImage } from '@/lib/types';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { ImagePreviewDialog } from '@/components/ui/image-preview-dialog';
import { classifyError, toUserToast, toDisplayMessage } from '@/lib/errors';

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
  
  // Fetch all generated images from storage (same as gallery)
  const { images: allGeneratedImages } = useRecentGeneratedImages(profile?.userId);

  // Generation state
  const [selectedModel, setSelectedModel] = useState(IMAGE_GENERATION_MODELS[0]?.id || 'gemini-2.5-flash-image-preview');
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImages, setGeneratedImages] = useState<GeneratedImageData[]>([]);
  const [textResponse, setTextResponse] = useState<string>('');
  const [currentGenerationIds, setCurrentGenerationIds] = useState<Set<string>>(new Set()); // Track IDs of current generation to avoid duplicates
  
  // Advanced controls
  const [imageReferences, setImageReferences] = useState<ImageReference[]>([]);
  const [selectedStyle, setSelectedStyle] = useState<string>('');
  const [selectedComposition, setSelectedComposition] = useState<string>('');
  const [imageCount, setImageCount] = useState<number>(1); // Number of images to generate
  const [aspectRatio, setAspectRatio] = useState<string>('1:1'); // Aspect ratio for Imagen
  const [imageSize, setImageSize] = useState<string>('1K'); // Image size for Imagen
  const [outputFormat, setOutputFormat] = useState<string>('image/jpeg'); // Output format
  const [history, setHistory] = useState<GenerationHistory[]>([]);
  const [previewIndex, setPreviewIndex] = useState<number | null>(null); // For image preview dialog
  const [lastErrorText, setLastErrorText] = useState<string | null>(null);
  
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

    // Check if model requires Pro plan
    const modelInfo = IMAGE_GENERATION_MODELS.find(m => m.id === selectedModel);
    if ((modelInfo as any)?.requiresPro) {
      toast({
        title: "🔒 Pro Plan Required",
        description: "This model is only available with a Pro subscription. Upgrade to unlock all models!",
        variant: "destructive"
      });
      return;
    }

    // Auto-retry logic
    const MAX_RETRIES = 3;
    let retryCount = 0;
    let lastError: Error | null = null;

    try {
      setIsGenerating(true);
      // DON'T clear generatedImages here - keep showing previous generation during loading
      setTextResponse('');
      setLastErrorText(null);

      // Build base enhanced prompt with style and composition
      let basePrompt = prompt;
      if (selectedStyle) {
        basePrompt += `. Style: ${selectedStyle}`;
      }
      if (selectedComposition) {
        basePrompt += `. Composition: ${selectedComposition}`;
      }

      const imageClient = new GeminiImageGenClient(profile);
      const isImagenModel = selectedModel.startsWith('models/imagen');

      // Retry loop
      while (retryCount < MAX_RETRIES) {
        try {
          const allImages: GeneratedImageData[] = [];
          let combinedTextResponse = '';

          if (isImagenModel) {
            // Imagen models support multiple images in one call
            const result = await imageClient.generateImages(
              selectedModel, 
              basePrompt,
              5, // max attempts
              {
                numberOfImages: imageCount,
                aspectRatio: aspectRatio,
                imageSize: imageSize,
                outputMimeType: outputFormat,
              }
            );
            
            allImages.push(...(result.images || []));
            combinedTextResponse = result.textResponse || '';
          } else {
            // Gemini models - make multiple calls with unique variation prompts
            const variations = [
              'Create a unique and creative interpretation',
              'Generate an alternative creative version',
              'Design a distinct variation with fresh perspective',
              'Produce a different artistic take'
            ];
            
            for (let i = 0; i < imageCount; i++) {
              // Create unique prompt for each variation
              const variationInstruction = imageCount > 1 ? `${variations[i % variations.length]}. ` : '';
              const uniquePrompt = `${variationInstruction}${basePrompt}`;
              
              const result = await imageClient.generateImages(
                selectedModel, 
                uniquePrompt,
                5, // max attempts
                {
                  numberOfImages: 1,
                  aspectRatio: aspectRatio,
                  imageSize: imageSize,
                  outputMimeType: outputFormat,
                }
              );

      if (result.images && result.images.length > 0) {
                allImages.push(...result.images);
                if (result.textResponse) {
                  combinedTextResponse += (combinedTextResponse ? '\n\n' : '') + result.textResponse;
                }
              }
            }
          }

          // Check if we got any images
          if (allImages.length > 0) {
            // Success! Convert to GeneratedImage format and save to Firebase
            const generatedImages: GeneratedImage[] = allImages.map((img, idx) => ({
              id: globalThis.crypto?.randomUUID?.() || `${Date.now()}-${idx}`,
              dataUri: GeminiImageGenClient.imageToDataUrl(img),
              alt: `Generated: ${basePrompt.substring(0, 100)}`,
              prompt: basePrompt,
              createdAt: Date.now(),
            }));

            // Track the IDs to filter them out from Firebase history
            const newIds = new Set(generatedImages.map(img => img.id).filter((id): id is string => !!id));
            setCurrentGenerationIds(newIds);

            // Save to Firebase (same as gallery) - runs in background
            if (profile?.userId) {
              GeneratedImageStorage.saveImages(profile.userId, generatedImages, basePrompt)
                .then(() => {
                  console.log('✅ Images saved to Firebase successfully');
                })
                .catch((saveError) => {
                  console.warn('⚠️ Failed to save to Firebase (non-critical):', saveError);
                });
            }

            setGeneratedImages(allImages);
            setTextResponse(combinedTextResponse);
            
            // Add to local history (for immediate display)
            const historyEntry: GenerationHistory = {
              id: Date.now().toString(),
              prompt: basePrompt,
              images: allImages,
              timestamp: Date.now(),
              model: selectedModel
            };
            setHistory(prev => [historyEntry, ...prev].slice(0, 20)); // Keep last 20

        toast({
          title: "Success!",
              description: `Generated ${allImages.length} image${allImages.length > 1 ? 's' : ''}!`
        });
            
            return; // Exit successfully
      } else {
            // No images generated, prepare to retry
            throw new Error('No images returned by the model');
          }
        } catch (attemptError: any) {
          lastError = attemptError;
          retryCount++;
          
          if (retryCount < MAX_RETRIES) {
            console.log(`⚠️ Generation attempt ${retryCount} failed, retrying... (${MAX_RETRIES - retryCount} attempts left)`);
            toast({
              title: "Retrying...",
              description: `Attempt ${retryCount + 1} of ${MAX_RETRIES}`,
            });
            // Wait a bit before retrying
            await new Promise(resolve => setTimeout(resolve, 1000));
          }
        }
      }

      // All retries exhausted
      {
        const appErr = classifyError(lastError || new Error('Generation failed'));
        const td = toUserToast(appErr);
        toast({ title: td.title, description: td.description, variant: td.variant as any });
        setLastErrorText(toDisplayMessage(appErr));
      }
    } catch (error: any) {
      console.error('Image generation error:', error);
      const appErr = classifyError(error);
      const td = toUserToast(appErr);
      toast({ title: td.title, description: td.description, variant: td.variant as any });
      setLastErrorText(toDisplayMessage(appErr));
    } finally {
      setIsGenerating(false);
    }
  }, [prompt, selectedModel, selectedStyle, selectedComposition, imageCount, aspectRatio, imageSize, outputFormat, profile, toast]);

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

  const handleCopyImagePrompt = useCallback((promptText: string | undefined) => {
    if (!promptText) {
      toast({
        title: 'No prompt available',
        description: "The prompt used for this image wasn't saved.",
        variant: 'destructive',
      });
      return;
    }
    navigator.clipboard.writeText(promptText);
    toast({
      title: 'Prompt Copied!',
      description: 'The image prompt has been copied to your clipboard.',
    });
  }, [toast]);

  const handleCopyImage = useCallback(async (dataUri: string) => {
    try {
      const blob = await (await fetch(dataUri)).blob();
      await navigator.clipboard.write([
        new ClipboardItem({
          [blob.type]: blob,
        }),
      ]);
      toast({
        title: 'Image Copied!',
        description: 'The image has been copied to your clipboard.',
      });
    } catch (error) {
      console.error('Failed to copy image:', error);
      toast({
        title: 'Copy Failed',
        description: 'Could not copy the image to the clipboard.',
        variant: 'destructive',
      });
    }
  }, [toast]);

  const handleCopyCurrentPrompt = useCallback(() => {
    navigator.clipboard.writeText(prompt);
    toast({
      title: "Copied!",
      description: "Prompt copied to clipboard."
    });
  }, [prompt, toast]);

  const handleEnhancePrompt = useCallback(async () => {
    if (!prompt.trim()) {
      toast({
        title: "No Prompt",
        description: "Please enter a prompt first to enhance it.",
        variant: "destructive"
      });
      return;
    }

    if (!profile?.geminiApiKeys?.length) {
      toast({
        title: "API Key Required",
        description: "Please add a Gemini API key in your profile settings first.",
        variant: "destructive"
      });
      return;
    }

    try {
      const enhancementPrompt = `You are an expert prompt engineer for AI image generation. Enhance this prompt to make it more detailed and effective: "${prompt}". Respond with ONLY the enhanced prompt, nothing else.`;

      // Use direct Google GenAI SDK for prompt enhancement
      const { GoogleGenAI } = await import('@google/genai');
      const ai = new GoogleGenAI({ apiKey: profile.geminiApiKeys[0] });
      
      const result = await ai.models.generateContent({
        model: 'gemini-flash-lite-latest',
        contents: [{ role: 'user', parts: [{ text: enhancementPrompt }] }],
      });

      const enhancedText = result.candidates?.[0]?.content?.parts?.[0]?.text || result.text || '';
      
      if (enhancedText.trim()) {
        // Remove quotes from start and end if present
        const cleanedPrompt = enhancedText.trim().replace(/^["']|["']$/g, '');
        setPrompt(cleanedPrompt);
        toast({
          title: "✨ Prompt Enhanced!",
          description: "Your prompt has been optimized for better results."
        });
      } else {
        throw new Error('No enhanced prompt returned');
      }
    } catch (error: any) {
      console.error('Prompt enhancement error:', error);
      const appErr = classifyError(error);
      const td = toUserToast(appErr);
      toast({ title: td.title, description: td.description, variant: td.variant as any });
      setLastErrorText(toDisplayMessage(appErr));
    }
  }, [prompt, profile, toast, setPrompt]);

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
          <div className="flex items-center gap-3 mr-48">
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
        <div className="w-[420px] border-r flex-shrink-0 bg-background/50 backdrop-blur-sm overflow-y-auto">
          <div className="p-4 space-y-4">
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
                    onClick={handleEnhancePrompt}
                    disabled={!prompt.trim()}
                    title="Enhance prompt with AI"
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
                    onClick={handleCopyCurrentPrompt}
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
                    <SelectItem value="gemini-2.0-flash-preview-image-generation">
                      <span className="flex items-center gap-2">
                        <span className="font-medium">🎨 Gemini 2.0 Flash (Image Gen) ✓</span>
                        <Badge variant="outline" className="text-xs bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-300">
                          Free
                        </Badge>
                      </span>
                    </SelectItem>
                    <SelectItem value="gemini-2.5-flash-image-preview">
                      <span className="flex items-center gap-2">
                        <span className="font-medium">🎨 Gemini 2.5 Flash (Image Gen/Edit) ⭐</span>
                        <Badge variant="outline" className="text-xs bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300">
                          Pro
                        </Badge>
                      </span>
                    </SelectItem>
                    <SelectItem value="models/imagen-4.0-ultra-generate-001">
                      <span className="flex items-center gap-2">
                        <span className="font-medium">🎨 Imagen 4.0 Ultra ⭐</span>
                        <Badge variant="outline" className="text-xs bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300">
                          Pro
                        </Badge>
                      </span>
                    </SelectItem>
                    <SelectItem value="models/imagen-4.0-generate-001">
                      <span className="flex items-center gap-2">
                        <span className="font-medium">🎨 Imagen 4.0 ⭐</span>
                        <Badge variant="outline" className="text-xs bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300">
                          Pro
                        </Badge>
                      </span>
                    </SelectItem>
                    <SelectItem value="models/imagen-4.0-fast-generate-001">
                      <span className="flex items-center gap-2">
                        <span className="font-medium">🎨 Imagen 4.0 Fast</span>
                        <Badge variant="outline" className="text-xs bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300">
                          Pro
                        </Badge>
                      </span>
                    </SelectItem>
                    <SelectItem value="models/imagen-3.0-generate-002">
                      <span className="flex items-center gap-2">
                        <span className="font-medium">🎨 Imagen 3.0</span>
                        <Badge variant="outline" className="text-xs bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300">
                          Pro
                        </Badge>
                      </span>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Compact Settings Grid */}
              <div className="grid grid-cols-2 gap-3">
                {/* Number of Images */}
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium text-muted-foreground">Images</Label>
                  <Select value={imageCount.toString()} onValueChange={(val) => setImageCount(parseInt(val))}>
                    <SelectTrigger className="h-9 text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1</SelectItem>
                      <SelectItem value="2">2</SelectItem>
                      <SelectItem value="3">3</SelectItem>
                      <SelectItem value="4">4</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Aspect Ratio */}
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium text-muted-foreground">Ratio</Label>
                  <Select value={aspectRatio} onValueChange={setAspectRatio}>
                    <SelectTrigger className="h-9 text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1:1">1:1</SelectItem>
                      <SelectItem value="16:9">16:9</SelectItem>
                      <SelectItem value="9:16">9:16</SelectItem>
                      <SelectItem value="3:4">3:4</SelectItem>
                      <SelectItem value="4:3">4:3</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Image Size (Imagen only) */}
                {selectedModel.startsWith('models/imagen') && (
                  <div className="space-y-1.5">
                    <Label className="text-xs font-medium text-muted-foreground">Size</Label>
                    <Select value={imageSize} onValueChange={setImageSize}>
                      <SelectTrigger className="h-9 text-sm">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1K">1K</SelectItem>
                        <SelectItem value="2K">2K</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {/* Output Format (Imagen only) */}
                {selectedModel.startsWith('models/imagen') && (
                  <div className="space-y-1.5">
                    <Label className="text-xs font-medium text-muted-foreground">Format</Label>
                    <Select value={outputFormat} onValueChange={setOutputFormat}>
                      <SelectTrigger className="h-9 text-sm">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="image/jpeg">JPEG</SelectItem>
                        <SelectItem value="image/png">PNG</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>

              {/* Image References - Only for Gemini models, NOT Imagen */}
              {!selectedModel.startsWith('models/imagen') && (
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
              )}

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
          </div>
                </div>

        {/* RIGHT PANEL: Generated Images & History */}
        <div className="flex-1 flex flex-col overflow-hidden bg-background/30">
          <ScrollArea className="h-full">
            <div className="p-6">
              {/* Loading indicator when generating (doesn't hide history) */}
              {isGenerating && (
                <div className="mb-6 p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl border border-purple-200 dark:border-purple-800 flex items-center gap-3">
                  <Loader2 className="h-5 w-5 animate-spin text-purple-500" />
                  <div>
                    <p className="font-semibold text-purple-700 dark:text-purple-300">Generating your image...</p>
                    <p className="text-xs text-muted-foreground">AI is crafting your masterpiece</p>
                  </div>
                </div>
              )}
              
              {history.length > 0 || generatedImages.length > 0 || allGeneratedImages.length > 0 ? (
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

                      {/* History items - Skip first item if it matches current generation */}
                      {history
                        .filter((item, index) => {
                          // Skip the first history item if we have generated images (to avoid duplication)
                          if (index === 0 && generatedImages.length > 0) {
                            return false;
                          }
                          return true;
                        })
                        .map((item) => (
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
                              {/* Action buttons - Center aligned at bottom */}
                              <div className="absolute bottom-3 left-0 right-0 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Button
                                        size="icon"
                                        variant="secondary"
                                        className="bg-white/90 hover:bg-white text-black rounded-full h-9 w-9 shadow-lg"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          // Find index in combined array for preview
                                          const allImages = [...generatedImages, ...history.flatMap(h => h.images.map(img => ({ ...img, prompt: h.prompt })))];
                                          setPreviewIndex(allImages.findIndex(img => img === image));
                                        }}
                                      >
                                        <Maximize2 className="h-4 w-4" />
                                      </Button>
                                    </TooltipTrigger>
                                    <TooltipContent><p>Preview</p></TooltipContent>
                                  </Tooltip>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Button
                                        size="icon"
                                        variant="secondary"
                                        className="bg-white/90 hover:bg-white text-black rounded-full h-9 w-9 shadow-lg"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleCopyImagePrompt(item.prompt);
                                        }}
                                      >
                                        <Code className="h-4 w-4" />
                                      </Button>
                                    </TooltipTrigger>
                                    <TooltipContent><p>Copy Prompt</p></TooltipContent>
                                  </Tooltip>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Button
                                        size="icon"
                                        variant="secondary"
                                        className="bg-white/90 hover:bg-white text-black rounded-full h-9 w-9 shadow-lg"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleCopyImage(GeminiImageGenClient.imageToDataUrl(image));
                                        }}
                                      >
                                        <Copy className="h-4 w-4" />
                                      </Button>
                                    </TooltipTrigger>
                                    <TooltipContent><p>Copy Image</p></TooltipContent>
                                  </Tooltip>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Button
                                        size="icon"
                                        variant="secondary"
                                        className="bg-white/90 hover:bg-white text-black rounded-full h-9 w-9 shadow-lg"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleDownload(image, imgIndex);
                                        }}
                                      >
                                        <Download className="h-4 w-4" />
                                      </Button>
                                    </TooltipTrigger>
                                    <TooltipContent><p>Download</p></TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              </div>
                            </div>
                            <div className="space-y-2">
                              <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">{item.prompt}</p>
                              <div className="flex items-center gap-2 flex-wrap">
                                <Badge variant="outline" className="text-xs">{aspectRatio}</Badge>
                                <Badge variant="outline" className="text-xs bg-purple-50 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300 border-purple-200 dark:border-purple-800">
                                  {item.model.split('/').pop()}
                                </Badge>
                                <Badge variant="outline" className="text-xs text-muted-foreground">
                                  {new Date(item.timestamp).toLocaleDateString()}
                                </Badge>
                              </div>
                            </div>
                          </div>
                        ))
                  ))}

                      {/* Firebase-persisted images (from gallery) - Filter out current generation to avoid duplicates */}
                      {allGeneratedImages
                        .filter((img) => {
                          // Skip images that are in the current generation (shown with "New" badge)
                          return !currentGenerationIds.has(img.id || '');
                        })
                        .map((img, imgIdx) => (
                        <div key={`firebase-${img.id || imgIdx}`} className="group space-y-3">
                          <div className="relative aspect-square rounded-xl overflow-hidden bg-muted border shadow-md hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
                            <NextImage
                              src={img.dataUri}
                              alt={img.alt || 'Generated image'}
                              fill
                              className="object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            {/* Action buttons - Center aligned at bottom */}
                            <div className="absolute bottom-3 left-0 right-0 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button
                                      size="icon"
                                      variant="secondary"
                                      className="bg-white/90 hover:bg-white text-black rounded-full h-9 w-9 shadow-lg"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setPreviewIndex(imgIdx);
                                      }}
                                    >
                                      <Maximize2 className="h-4 w-4" />
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent><p>Preview</p></TooltipContent>
                                </Tooltip>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button
                                      size="icon"
                                      variant="secondary"
                                      className="bg-white/90 hover:bg-white text-black rounded-full h-9 w-9 shadow-lg"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleCopyImagePrompt(img.prompt);
                                      }}
                                    >
                                      <Code className="h-4 w-4" />
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent><p>Copy Prompt</p></TooltipContent>
                                </Tooltip>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button
                                      size="icon"
                                      variant="secondary"
                                      className="bg-white/90 hover:bg-white text-black rounded-full h-9 w-9 shadow-lg"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleCopyImage(img.dataUri);
                                      }}
                                    >
                                      <Copy className="h-4 w-4" />
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent><p>Copy Image</p></TooltipContent>
                                </Tooltip>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button
                                      size="icon"
                                      variant="secondary"
                                      className="bg-white/90 hover:bg-white text-black rounded-full h-9 w-9 shadow-lg"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        const link = document.createElement('a');
                                        link.href = img.dataUri;
                                        link.download = `generated-${img.id || Date.now()}.png`;
                                        document.body.appendChild(link);
                                        link.click();
                                        document.body.removeChild(link);
                                        toast({ title: "Downloaded!", description: "Image saved to your device." });
                                      }}
                                    >
                                      <Download className="h-4 w-4" />
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent><p>Download</p></TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">{img.prompt || img.alt}</p>
                            <div className="flex items-center gap-2 flex-wrap">
                              <Badge variant="outline" className="text-xs">From Storage</Badge>
                              <Badge variant="outline" className="text-xs text-muted-foreground">
                                {img.createdAt ? new Date(img.createdAt).toLocaleDateString() : 'Unknown'}
                        </Badge>
                            </div>
                      </div>
                    </div>
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
        </div>
      </div>

      {/* Image Preview Dialog */}
      <ImagePreviewDialog
        images={allGeneratedImages}
        startIndex={previewIndex}
        onClose={() => setPreviewIndex(null)}
      />
    </div>
  );
}

