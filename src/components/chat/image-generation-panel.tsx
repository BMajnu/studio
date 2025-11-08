'use client';

import React from 'react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { X, Download, Loader2, Sparkles, Maximize2, Code, Copy } from 'lucide-react';
import { GeneratedImage } from '@/lib/types';
import { saveGeneratedImagesLocal } from '@/lib/storage/generated-images-local';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { useUserProfile } from '@/lib/hooks/use-user-profile';
import { ImagePreviewDialog } from '@/components/ui/image-preview-dialog';
import { useAuth } from '@/contexts/auth-context';
import { ensureAppFolderCached, uploadImagesBatchVerbose, type BatchUploadItem } from '@/lib/integrations/google-drive';
import { GeneratedImageStorage } from '@/lib/firebase/generatedImageStorage';
import { classifyError, toUserToast, toDisplayMessage } from '@/lib/errors';

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface ImageGenerationPanelProps {
  prompt: string;
  onClose: () => void;
}

export function ImageGenerationPanel({ prompt, onClose }: ImageGenerationPanelProps) {
  const { toast } = useToast();
  const { profile } = useUserProfile();
  const { googleAccessToken } = useAuth();

  // Settings state
  const [numImages, setNumImages] = useState(4);
  const [temperature, setTemperature] = useState<number>(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([]);
  const [lastErrorText, setLastErrorText] = useState<string | null>(null);

  // Preview modal state
  const [previewIndex, setPreviewIndex] = useState<number | null>(null);

  // Build the download file name in the format:
  //   DesAInR - [prompt text] - <n>.png
  // Special characters are stripped and spaces turned into hyphens so the
  // resulting file name is safe on all operating systems.
  const getImageFilename = (index: number) => {
    const safePrompt = prompt.replace(/[^a-z0-9]/gi, '_').slice(0, 30);
    return `DesAInR_${safePrompt}_${index + 1}.png`;
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
    setLastErrorText(null);

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
          temperature,
          userName: profile.name,
          userId: profile.userId,
          communicationStyleNotes: profile.communicationStyleNotes || '',
          userApiKeys: profile.geminiApiKeys,
          modelId: profile.selectedGenkitModelId
        }),
      });

      if (!response.ok) {
        let errorData: any = null;
        try {
          errorData = await response.json();
        } catch {
          try {
            const txt = await response.text();
            errorData = { message: txt };
          } catch {
            errorData = {};
          }
        }
        const err = new Error(errorData?.message || 'Failed to generate images');
        (err as any).code = errorData?.code;
        (err as any).status = response.status;
        throw err;
      }

      const data = await response.json();

      // Attach unique IDs to each generated image (needed for proper deduping)
      const now = Date.now();
      const imagesWithIds: GeneratedImage[] = data.images.map((img: GeneratedImage) => ({
        ...img,
        id: globalThis.crypto?.randomUUID?.() || Math.random().toString(36).slice(2),
        createdAt: now,
        prompt: data.prompt, // <-- Add the prompt here
      }));

      setGeneratedImages(imagesWithIds);

      // Persist locally for Media gallery (always save, will fall back to DEFAULT_USER_ID if needed)
      await saveGeneratedImagesLocal(profile?.userId, imagesWithIds);

      // `saveGeneratedImagesLocal` already dispatches the `generated-images-updated`
      // event, so no further action is required here.

      // Always save to Firebase (24h TTL), and concurrently upload to Google Drive if available
      try {
        const tasks: Promise<any>[] = [];
        if (profile?.userId) {
          tasks.push(GeneratedImageStorage.saveImages(profile.userId, imagesWithIds, prompt));
        }

        if (googleAccessToken) {
          const folderId = await ensureAppFolderCached(googleAccessToken, 'DesAInR');
          const now = Date.now();
          const batch: BatchUploadItem[] = imagesWithIds.map((img, index) => ({
            dataUri: img.dataUri,
            filename: getImageFilename(index),
            description: `Prompt: ${img.prompt || prompt} | CreatedAt: ${new Date(img.createdAt || now).toISOString()}`,
            appProperties: {
              imageId: img.id || '',
              userId: profile!.userId,
              createdAt: String(img.createdAt || now),
              prompt: img.prompt || prompt,
            },
          }));
          const drivePromise = (async () => {
            const outcome = await uploadImagesBatchVerbose(googleAccessToken, batch, folderId, 4);
            // Upsert Drive metadata onto Firestore docs for easy linking later
            if (profile?.userId) {
              const upserts = outcome.results.map((r) => {
                const imageId = (r.item.appProperties?.imageId as string) || '';
                if (!imageId) return Promise.resolve();
                return GeneratedImageStorage.upsertDriveMeta(profile!.userId, imageId, {
                  fileId: r.meta.id,
                  webViewLink: (r.meta as any).webViewLink,
                  webContentLink: (r.meta as any).webContentLink,
                });
              });
              await Promise.allSettled(upserts);
            }
            // Optional debug
            try {
              if (typeof window !== 'undefined' && localStorage.getItem('debugImages') === '1') {
                console.debug('[Images][Drive] upload complete', { success: outcome.success, total: outcome.total, failed: outcome.total - outcome.success });
              }
            } catch {}
            return { success: outcome.success, total: outcome.total };
          })();
          tasks.push(drivePromise);
        }

        const settled = await Promise.allSettled(tasks);
        let driveResult: { success: number; total: number } | undefined;
        let firebaseResult: { ok: number; failed: number } | undefined;
        for (const s of settled) {
          if (s.status === 'fulfilled' && s.value && typeof s.value === 'object') {
            const val: any = s.value;
            if ('success' in val && 'total' in val) {
              driveResult = val as any;
            } else if ('ok' in val && 'failed' in val) {
              firebaseResult = val as any;
            }
          }
        }
        if (driveResult) {
          toast({ title: 'Saved to Google Drive', description: `Uploaded ${driveResult.success} images to your Drive.` });
          const dFailed = driveResult.total - driveResult.success;
          if (dFailed > 0) {
            toast({ title: 'Some Drive uploads failed', description: `${dFailed} of ${driveResult.total} images failed to upload to Drive.`, variant: 'destructive' });
          }
        }
        if (firebaseResult && profile?.userId) {
          if (firebaseResult.failed === 0) {
            toast({ title: 'Saved to Firebase (24h)', description: `Saved ${firebaseResult.ok} images to Firestore.` });
          } else if (firebaseResult.ok > 0) {
            toast({ title: 'Partially saved to Firebase', description: `${firebaseResult.ok} saved, ${firebaseResult.failed} failed. Some images may be too large for Firestore; they remain available this session and in Drive.`, variant: 'destructive' });
          } else {
            toast({ title: 'Firebase save failed', description: 'Could not save images to Firestore.', variant: 'destructive' });
          }
        }
      } catch (persistError) {
        console.error('Persistence error (Drive/Firebase):', persistError);
        toast({
          title: 'Save Failed',
          description: 'Could not save to Drive or Firebase. Images are still available this session.',
          variant: 'destructive',
        });
      }

      toast({
        title: "Images Generated",
        description: `Successfully generated ${data.images.length} images.`,
      });
    } catch (error) {
      console.error('Error generating images:', error);
      const appErr = classifyError(error as any);
      const toastData = toUserToast(appErr);
      toast({ title: toastData.title, description: toastData.description, variant: toastData.variant as any });
      setLastErrorText(toDisplayMessage(appErr));
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

  const handleCopyPrompt = (prompt: string | undefined) => {
    if (!prompt) {
      toast({
        title: 'No prompt available',
        description: "The prompt used for this image wasn't saved.",
        variant: 'destructive',
      });
      return;
    }
    navigator.clipboard.writeText(prompt);
    toast({
      title: 'Prompt Copied!',
      description: 'The image prompt has been copied to your clipboard.',
    });
  };

  const handleCopyImage = async (dataUri: string) => {
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
  };

  // Handle preview image
  const handlePreview = (image: GeneratedImage, index: number) => {
    setPreviewIndex(index);
  };

  // Navigate between images in preview
  const navigatePreview = (direction: 'next' | 'prev') => {
    if (direction === 'next') {
      const nextIndex = (previewIndex! + 1) % generatedImages.length;
      setPreviewIndex(nextIndex);
    } else {
      const prevIndex = (previewIndex! - 1 + generatedImages.length) % generatedImages.length;
      setPreviewIndex(prevIndex);
    }
  };

  return (
    <div className="w-full space-y-4 bg-background/95 backdrop-blur-sm rounded-lg p-4 border shadow-xl">
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
        <div className="flex flex-col space-y-4">
          {/* Settings row plus action button */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
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

            {/* Aspect ratio removed for simplicity (default 1:1) */}

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

            {/* Generate button (4th column) */}
            <div className="flex md:justify-end justify-center md:col-span-1 col-span-full mt-4 md:mt-0">
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

      {lastErrorText && (
        <div className="mt-4 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded p-3 whitespace-pre-wrap">
          {lastErrorText}
        </div>
      )}

      {/* Generated images grid */}
      {generatedImages.length > 0 && (
        <div className="mt-6">
          <h4 className="text-md font-medium mb-3 flex items-center">
            <Sparkles className="h-4 w-4 mr-2 text-primary" />
            Generated Images
          </h4>
          <TooltipProvider>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {generatedImages.map((image, index) => (
                <div key={index} className="relative group overflow-hidden rounded-lg border shadow-sm aspect-square">
                  <img
                    src={image.dataUri}
                    alt={image.alt || 'Generated image'}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 cursor-pointer"
                    onClick={() => setPreviewIndex(index)}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center p-2">
                    <div className="flex items-center justify-center gap-2 transform-gpu translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            size="icon"
                            variant="secondary"
                            className="bg-white/90 hover:bg-white text-black rounded-full h-9 w-9 shadow-lg"
                            onClick={(e) => { e.stopPropagation(); setPreviewIndex(index); }}
                          >
                            <Maximize2 className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Preview</p>
                        </TooltipContent>
                      </Tooltip>
                      <Tooltip>
                        <TooltipTrigger asChild>
                           <Button
                            size="icon"
                            variant="secondary"
                            className="bg-white/90 hover:bg-white text-black rounded-full h-9 w-9 shadow-lg"
                            onClick={(e) => { e.stopPropagation(); handleCopyPrompt(image.prompt); }}
                          >
                            <Code className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="max-w-xs truncate">{image.prompt || 'Copy Prompt'}</p>
                        </TooltipContent>
                      </Tooltip>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            size="icon"
                            variant="secondary"
                            className="bg-white/90 hover:bg-white text-black rounded-full h-9 w-9 shadow-lg"
                            onClick={(e) => { e.stopPropagation(); handleCopyImage(image.dataUri); }}
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Copy Image</p>
                        </TooltipContent>
                      </Tooltip>
                      <Tooltip>
                        <TooltipTrigger asChild>
                           <Button
                            size="icon"
                            variant="secondary"
                            className="bg-white/90 hover:bg-white text-black rounded-full h-9 w-9 shadow-lg"
                            onClick={(e) => { e.stopPropagation(); handleDownload(image.dataUri, index); }}
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Download</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TooltipProvider>
        </div>
      )}

      <ImagePreviewDialog
        images={generatedImages}
        startIndex={previewIndex}
        onClose={() => setPreviewIndex(null)}
        showNavButtons={true}
      />
    </div>
  );
} 