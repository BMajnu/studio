'use client';

import React from 'react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { X, Download, Loader2, Sparkles, Maximize2, ArrowLeft } from 'lucide-react';
import { GeneratedImage } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { useUserProfile } from '@/lib/hooks/use-user-profile';
import { Dialog, DialogContent as BaseDialogContent, DialogTitle, DialogPortal, DialogOverlay } from '@/components/ui/dialog';
import * as DialogPrimitive from "@radix-ui/react-dialog";

interface ImageGenerationPanelProps {
  prompt: string;
  onClose: () => void;
}

export function ImageGenerationPanel({ prompt, onClose }: ImageGenerationPanelProps) {
  const { toast } = useToast();
  const { profile } = useUserProfile();
  
  // Settings state
  const [numImages, setNumImages] = useState(4);
  const [aspectRatio, setAspectRatio] = useState<'1:1' | '4:3' | '3:4' | '16:9' | '9:16'>('1:1');
  const [temperature, setTemperature] = useState<number>(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([]);
  
  // Preview modal state
  const [previewImage, setPreviewImage] = useState<GeneratedImage | null>(null);
  const [previewIndex, setPreviewIndex] = useState<number>(0);
  
  // Format prompt for filename (remove special chars, limit length)
  const getImageFilename = (index: number) => {
    const cleanPrompt = prompt
      .replace(/[^\w\s-]/g, '')  // Remove special characters
      .replace(/\s+/g, '-')      // Replace spaces with hyphens
      .substring(0, 50);         // Limit length
    
    return `DesAInR-${cleanPrompt}-${index + 1}.png`;
  };
  
  // Handle generate button click
  const handleGenerate = async () => {
    if (!profile) {
      toast({
        title: "Profile Required",
        description: "Please log in to generate images.",
        variant: "destructive"
      });
      return;
    }
    
    setIsGenerating(true);
    
    try {
      // Call the API to generate images
      const response = await fetch('/api/generate-images', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt,
          numImages,
          aspectRatio,
          temperature,
          userName: profile.name,
          communicationStyleNotes: profile.communicationStyleNotes || '',
          userApiKey: profile.geminiApiKeys?.[0],
          modelId: profile.selectedGenkitModelId
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to generate images');
      }
      
      const data = await response.json();
      setGeneratedImages(data.images);
      
      toast({
        title: "Images Generated",
        description: `Successfully generated ${data.images.length} images.`,
      });
    } catch (error) {
      console.error('Error generating images:', error);
      toast({
        title: "Generation Failed",
        description: error instanceof Error ? error.message : "Failed to generate images. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };
  
  // Handle image download
  const handleDownload = (dataUri: string, index: number) => {
    const link = document.createElement('a');
    link.href = dataUri;
    link.download = getImageFilename(index);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Handle preview image
  const handlePreview = (image: GeneratedImage, index: number) => {
    setPreviewImage(image);
    setPreviewIndex(index);
  };

  // Navigate between images in preview
  const navigatePreview = (direction: 'next' | 'prev') => {
    if (direction === 'next') {
      const nextIndex = (previewIndex + 1) % generatedImages.length;
      setPreviewIndex(nextIndex);
      setPreviewImage(generatedImages[nextIndex]);
    } else {
      const prevIndex = (previewIndex - 1 + generatedImages.length) % generatedImages.length;
      setPreviewIndex(prevIndex);
      setPreviewImage(generatedImages[prevIndex]);
    }
  };
  
  return (
    <div className="w-full space-y-6 bg-background/95 backdrop-blur-sm rounded-lg p-4">
      <div className="flex items-center justify-between border-b pb-3">
        <h3 className="text-lg font-semibold flex items-center">
          <Sparkles className="h-5 w-5 mr-2 text-primary" />
          Generate Images
        </h3>
        <Button variant="ghost" size="sm" onClick={onClose} className="h-8 w-8 p-0">
          <X className="h-4 w-4" />
        </Button>
      </div>
      
      {/* Controls in a compact card */}
      <div className="bg-muted/40 rounded-lg p-4">
        <div className="flex flex-col space-y-6">
          {/* Settings row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Number of images */}
            <div>
              <div className="flex justify-between mb-2">
                <Label htmlFor="num-images" className="text-sm font-medium">Number of Images</Label>
                <span className="text-sm font-bold text-primary">{numImages}</span>
              </div>
              <Slider
                id="num-images"
                min={1}
                max={8}
                step={1}
                value={[numImages]}
                onValueChange={(value) => setNumImages(value[0])}
                className="w-full"
              />
            </div>
            
            {/* Aspect ratio */}
            <div>
              <Label htmlFor="aspect-ratio" className="text-sm font-medium block mb-2">Aspect Ratio</Label>
              <Select value={aspectRatio} onValueChange={(value: '1:1' | '4:3' | '3:4' | '16:9' | '9:16') => setAspectRatio(value)}>
                <SelectTrigger id="aspect-ratio" className="w-full">
                  <SelectValue placeholder="Select ratio" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1:1">1:1 Square</SelectItem>
                  <SelectItem value="16:9">16:9 Widescreen</SelectItem>
                  <SelectItem value="9:16">9:16 Social story</SelectItem>
                  <SelectItem value="3:4">3:4 Traditional</SelectItem>
                  <SelectItem value="4:3">4:3 Classic</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Temperature */}
            <div>
              <div className="flex justify-between mb-2">
                <Label htmlFor="temperature" className="text-sm font-medium">Temperature</Label>
                <span className="text-sm font-bold text-primary">{temperature.toFixed(1)}</span>
              </div>
              <Slider
                id="temperature"
                min={0}
                max={2}
                step={0.1}
                value={[temperature]}
                onValueChange={(val) => setTemperature(parseFloat(val[0].toFixed(1)))}
                className="w-full"
              />
            </div>
          </div>
          
          {/* Prompt preview */}
          <div className="bg-background rounded p-3 text-sm text-muted-foreground border border-border">
            <p className="line-clamp-2 italic">"{prompt}"</p>
          </div>
          
          {/* Generate button */}
          <div className="flex justify-center">
            <Button
              onClick={handleGenerate}
              disabled={isGenerating}
              size="lg"
              className={cn(
                "transition-all duration-300 ease-in-out hover:scale-105 active:scale-95 focus-visible:ring-primary rounded-full shadow-md btn-glow px-8",
                "bg-primary dark:bg-gradient-to-r dark:from-primary dark:to-secondary text-primary-foreground"
              )}
            >
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-5 w-5" />
                  Generate Images
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
      
      {/* Loading skeleton */}
      {isGenerating && (
        <div className="mt-6">
          <h4 className="text-md font-medium mb-3 flex items-center">
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            Generating Images...
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Array(numImages).fill(0).map((_, index) => (
              <div key={index} className="aspect-square rounded-md bg-primary/10 animate-pulse"></div>
            ))}
          </div>
        </div>
      )}
      
      {/* Generated images grid */}
      {generatedImages.length > 0 && (
        <div className="mt-6">
          <h4 className="text-md font-medium mb-3 flex items-center">
            <Sparkles className="h-4 w-4 mr-2 text-primary" />
            Generated Images
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {generatedImages.map((image, index) => (
              <div key={index} className="relative group overflow-hidden rounded-md">
                <img
                  src={image.dataUri}
                  alt={image.alt}
                  className="w-full h-auto rounded-md border border-border transition-transform duration-300 group-hover:scale-105 cursor-pointer"
                  onClick={() => handlePreview(image, index)}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center p-3">
                  <div className="flex w-full space-x-2">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePreview(image, index);
                      }}
                      className="flex-1 bg-white/90 hover:bg-white text-black shadow-lg"
                    >
                      <Maximize2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDownload(image.dataUri, index);
                      }}
                      className="flex-1 bg-white/90 hover:bg-white text-black shadow-lg"
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Image Preview Modal */}
      <Dialog 
        open={previewImage !== null} 
        onOpenChange={(open) => !open && setPreviewImage(null)}
      >
        <DialogPortal>
          <DialogOverlay />
          <DialogPrimitive.Content
            className={cn(
              "fixed left-[50%] top-[50%] z-50 grid w-full max-w-4xl translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-0 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg max-h-[90vh] bg-background/95 backdrop-blur-md overflow-hidden"
            )}
          >
          {previewImage && (
            <div className="relative flex flex-col h-full">
              {/* Preview header */}
              <div className="flex items-center justify-between p-4 border-b">
                <DialogTitle className="text-lg font-medium">
                  Image {previewIndex + 1} of {generatedImages.length}
                </DialogTitle>
                <div className="flex space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleDownload(previewImage.dataUri, previewIndex)}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setPreviewImage(null)}
                    aria-label="Close preview"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              {/* Image container */}
              <div className="flex-1 overflow-auto p-4 flex items-center justify-center">
                <img
                  src={previewImage.dataUri}
                  alt={previewImage.alt}
                  className="max-w-full max-h-[calc(90vh-120px)] object-contain"
                />
              </div>
              
              {/* Navigation controls */}
              {generatedImages.length > 1 && (
                <div className="absolute inset-y-0 left-0 right-0 flex items-center justify-between px-4 pointer-events-none">
                  <Button
                    variant="secondary"
                    size="icon"
                    className="rounded-full bg-black/30 hover:bg-black/50 pointer-events-auto"
                    onClick={() => navigatePreview('prev')}
                  >
                    <ArrowLeft className="h-5 w-5" />
                  </Button>
                  <Button
                    variant="secondary"
                    size="icon"
                    className="rounded-full bg-black/30 hover:bg-black/50 pointer-events-auto"
                    onClick={() => navigatePreview('next')}
                  >
                    <ArrowLeft className="h-5 w-5 rotate-180" />
                  </Button>
                </div>
              )}
            </div>
          )}
          </DialogPrimitive.Content>
        </DialogPortal>
      </Dialog>
    </div>
  );
} 