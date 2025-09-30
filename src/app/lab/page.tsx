'use client';

import { useState, useCallback } from 'react';
import { useUserProfile } from '@/lib/hooks/use-user-profile';
import { useAuth } from '@/contexts/auth-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Sparkles, Download, Copy, Image as ImageIcon } from 'lucide-react';
import { IMAGE_GENERATION_MODELS } from '@/lib/constants';
import { GeminiImageGenClient, type GeneratedImageData } from '@/lib/ai/gemini-image-gen';
import { Skeleton } from '@/components/ui/skeleton';
import NextImage from 'next/image';
import { Badge } from '@/components/ui/badge';

export default function LabPage() {
  const { profile, isLoading: profileLoading } = useUserProfile();
  const { user, loading: authLoading } = useAuth();
  const { toast } = useToast();

  const [selectedModel, setSelectedModel] = useState(IMAGE_GENERATION_MODELS[0]?.id || 'gemini-2.5-flash-image-preview');
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImages, setGeneratedImages] = useState<GeneratedImageData[]>([]);
  const [textResponse, setTextResponse] = useState<string>('');

  const isLoading = profileLoading || authLoading;

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

      const imageClient = new GeminiImageGenClient(profile);
      const result = await imageClient.generateImages(selectedModel, prompt);

      if (result.images && result.images.length > 0) {
        setGeneratedImages(result.images);
        setTextResponse(result.textResponse || '');
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
  }, [prompt, selectedModel, profile, toast]);

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
    <div className="w-full h-full overflow-y-auto bg-background">
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500/20 to-pink-500/20">
              <Sparkles className="h-6 w-6 text-purple-500" />
            </div>
            <h1 className="text-3xl font-bold">AI Lab</h1>
            <Badge variant="secondary" className="ml-auto">Beta</Badge>
          </div>
          <p className="text-muted-foreground">
            Generate and edit images using advanced AI models
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left: Input Panel */}
          <Card>
            <CardHeader>
              <CardTitle>Generation Settings</CardTitle>
              <CardDescription>Configure your image generation</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Model Selection */}
              <div className="space-y-2">
                <Label htmlFor="model">AI Model</Label>
                <Select value={selectedModel} onValueChange={setSelectedModel}>
                  <SelectTrigger id="model">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {IMAGE_GENERATION_MODELS.map(model => (
                      <SelectItem key={model.id} value={model.id}>
                        {model.name}
                        {(model as any).tag && ` 🆕 ${(model as any).tag}`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  Select an AI model that supports image generation
                </p>
              </div>

              {/* Prompt Input */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="prompt">Image Description</Label>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleCopyPrompt}
                    disabled={!prompt.trim()}
                    className="h-7 text-xs"
                  >
                    <Copy className="h-3 w-3 mr-1" />
                    Copy
                  </Button>
                </div>
                <Textarea
                  id="prompt"
                  placeholder="Describe the image you want to generate... (e.g., 'A professional logo for a coffee shop with modern minimalist design')"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  rows={8}
                  className="resize-none"
                />
                <p className="text-xs text-muted-foreground">
                  {prompt.length} / 5000 characters
                </p>
              </div>

              {/* Generate Button */}
              <Button
                onClick={handleGenerate}
                disabled={isGenerating || !prompt.trim()}
                className="w-full"
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
                    Generate Image
                  </>
                )}
              </Button>

              {/* AI Response Text */}
              {textResponse && (
                <div className="mt-4 p-3 rounded-lg bg-muted">
                  <p className="text-sm font-medium mb-1">AI Response:</p>
                  <p className="text-sm text-muted-foreground">{textResponse}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Right: Generated Images */}
          <Card>
            <CardHeader>
              <CardTitle>Generated Images</CardTitle>
              <CardDescription>
                {generatedImages.length > 0 
                  ? `${generatedImages.length} image${generatedImages.length > 1 ? 's' : ''} generated`
                  : 'Your generated images will appear here'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isGenerating ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
                  <p className="text-sm text-muted-foreground">Generating your image...</p>
                </div>
              ) : generatedImages.length > 0 ? (
                <div className="space-y-4">
                  {generatedImages.map((image, index) => (
                    <div key={index} className="space-y-2">
                      <div className="relative aspect-video rounded-lg overflow-hidden bg-muted">
                        <NextImage
                          src={GeminiImageGenClient.imageToDataUrl(image)}
                          alt={`Generated image ${index + 1}`}
                          fill
                          className="object-contain"
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDownload(image, index)}
                          className="flex-1"
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </Button>
                        <Badge variant="secondary" className="text-xs">
                          {image.mimeType}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                  <ImageIcon className="h-12 w-12 mb-4 opacity-50" />
                  <p className="text-sm">No images generated yet</p>
                  <p className="text-xs mt-1">Enter a prompt and click Generate</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

