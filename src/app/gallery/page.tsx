'use client';

import { useUserProfile } from '@/lib/hooks/use-user-profile';
import { useRecentGeneratedImages } from '@/lib/hooks/use-recent-generated-images';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Download, Maximize2, Copy, Code } from 'lucide-react';
import { useState } from 'react';
import { GeneratedImage } from '@/lib/types';
import { ImagePreviewDialog } from '@/components/ui/image-preview-dialog';
import { useToast } from '@/hooks/use-toast';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

// Force dynamic rendering for this page
export const dynamic = 'force-dynamic';

export default function GalleryPage() {
  const router = useRouter();
  const { profile } = useUserProfile();
  const { images } = useRecentGeneratedImages(profile?.userId);
  const [previewIndex, setPreviewIndex] = useState<number | null>(null);
  const { toast } = useToast();

  const handleDownload = (img: GeneratedImage) => {
    const link = document.createElement('a');
    link.href = img.dataUri;
    link.download = img.alt || `DesAInR-image-${img.id?.substring(0,8) || Date.now()}.png`;
    link.click();
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

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="flex items-center justify-between px-4 py-3 border-b sticky top-0 bg-background/80 backdrop-blur-sm z-10">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-semibold">Media Gallery</h1>
        </div>
        <span className="text-sm text-muted-foreground">{images.length} images</span>
      </header>

      {images.length === 0 ? (
        <div className="flex-1 flex items-center justify-center text-muted-foreground">
          No images found.
        </div>
      ) : (
        <main className="flex-1 p-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          <TooltipProvider>
            {images.map((img, idx) => (
              <div key={img.id || idx} className="relative group overflow-hidden rounded-lg border shadow-sm aspect-square">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={img.dataUri}
                  alt={img.alt || 'Generated image'}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 cursor-pointer"
                  onClick={() => setPreviewIndex(idx)}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center p-2">
                  <div className="flex items-center justify-center gap-2 transform-gpu translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            size="icon"
                            variant="secondary"
                            className="bg-white/90 hover:bg-white text-black rounded-full h-9 w-9 shadow-lg"
                            onClick={(e) => {
                              e.stopPropagation();
                              setPreviewIndex(idx);
                            }}
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
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCopyPrompt(img.prompt);
                            }}
                          >
                            <Code className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="max-w-xs truncate">{img.prompt || 'Copy Prompt'}</p>
                        </TooltipContent>
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
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDownload(img);
                            }}
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
          </TooltipProvider>
        </main>
      )}

      <ImagePreviewDialog
        images={images}
        startIndex={previewIndex}
        onClose={() => setPreviewIndex(null)}
      />
    </div>
  );
} 