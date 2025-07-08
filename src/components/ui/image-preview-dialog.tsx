'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogPortal, DialogOverlay, DialogTitle } from '@/components/ui/dialog';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, Download, X, ZoomIn, ZoomOut, Code, Copy } from 'lucide-react';
import { GeneratedImage } from '@/lib/types';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { useToast } from '@/hooks/use-toast';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface ImagePreviewDialogProps {
  images: GeneratedImage[];
  startIndex: number | null;
  onClose: () => void;
  showNavButtons?: boolean;
}

export function ImagePreviewDialog({
  images,
  startIndex,
  onClose,
  showNavButtons = true,
}: ImagePreviewDialogProps) {
  const [currentIndex, setCurrentIndex] = useState<number | null>(startIndex);
  const [isZoomed, setIsZoomed] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    setCurrentIndex(startIndex);
    setIsZoomed(false); // Reset zoom on new image
  }, [startIndex]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (currentIndex === null) return;
      if (e.key === 'ArrowRight') {
        if (showNavButtons) navigate('next');
      } else if (e.key === 'ArrowLeft') {
        if (showNavButtons) navigate('prev');
      } else if (e.key === 'z') {
        setIsZoomed(z => !z);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, showNavButtons]);

  const navigate = (direction: 'next' | 'prev') => {
    if (currentIndex === null) return;
    const nextIndex =
      direction === 'next'
        ? (currentIndex + 1) % images.length
        : (currentIndex - 1 + images.length) % images.length;
    setCurrentIndex(nextIndex);
  };

  const handleDownload = () => {
    if (currentIndex === null) return;
    const img = images[currentIndex];
    const link = document.createElement('a');
    link.href = img.dataUri;
    link.download = img.alt || `DesAInR-image-${img.id?.substring(0, 8) || Date.now()}.png`;
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

  const currentImage = currentIndex !== null ? images[currentIndex] : null;

  return (
    <Dialog open={currentIndex !== null} onOpenChange={(open) => !open && onClose()}>
      <DialogPortal>
        <DialogOverlay className="bg-black/80 backdrop-blur-sm fixed inset-0 z-[100]" />
        <DialogPrimitive.Content
          className={cn(
            'fixed inset-0 z-[110] flex items-center justify-center p-4 outline-none'
          )}
        >
          {currentImage && (
            <div className="flex flex-col w-full max-w-5xl h-[90vh] bg-background/95 backdrop-blur-md shadow-lg sm:rounded-lg overflow-hidden">
              <header className="flex items-center justify-between p-4 border-b shrink-0">
                <DialogTitle>
                  Image {currentIndex! + 1} of {images.length}
                </DialogTitle>
                <div className="flex items-center gap-2">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="outline" size="sm" onClick={() => handleCopyPrompt(currentImage?.prompt)}>
                          <Code className="h-4 w-4 mr-2" />
                          Copy Prompt
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="max-w-xs truncate">{currentImage?.prompt || 'Copy image prompt'}</p>
                      </TooltipContent>
                    </Tooltip>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="outline" size="sm" onClick={() => handleCopyImage(currentImage!.dataUri)}>
                          <Copy className="h-4 w-4 mr-2" />
                          Copy Image
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Copy image to clipboard</p>
                      </TooltipContent>
                    </Tooltip>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="outline" size="sm" onClick={handleDownload}>
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Download Image</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  <DialogPrimitive.Close asChild>
                    <Button variant="ghost" size="icon" onClick={onClose}>
                      <X className="h-5 w-5" />
                    </Button>
                  </DialogPrimitive.Close>
                </div>
              </header>
              <main className="flex-1 overflow-auto flex items-center justify-center p-4 bg-muted/20">
                <Image
                  key={`${currentImage.id}-${isZoomed}`}
                  src={currentImage.dataUri}
                  alt={currentImage.alt || 'Generated preview'}
                  width={2048}
                  height={2048}
                  className={cn(
                    'transition-transform duration-300 ease-in-out',
                    isZoomed 
                      ? 'scale-150 cursor-grab' 
                      : 'scale-100 object-contain w-auto h-auto max-w-full max-h-full cursor-zoom-in'
                  )}
                  onClick={() => setIsZoomed(!isZoomed)}
                />
              </main>
              <footer className="flex items-center justify-between p-2 border-t shrink-0 h-16">
                  <div className="w-1/3 pl-2">
                    {showNavButtons && (
                      <Button
                        variant="outline"
                        onClick={() => navigate('prev')}
                        disabled={images.length <= 1}
                      >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Previous
                      </Button>
                    )}
                  </div>
                  <div className="w-1/3 flex justify-center">
                    <Button variant="outline" onClick={() => setIsZoomed(!isZoomed)}>
                      {isZoomed ? <ZoomOut className="h-4 w-4 mr-2" /> : <ZoomIn className="h-4 w-4 mr-2" />}
                      {isZoomed ? 'Fit Screen' : 'Zoom'}
                    </Button>
                  </div>
                  <div className="w-1/3 flex justify-end pr-2">
                    {showNavButtons && (
                       <Button
                        variant="outline"
                        onClick={() => navigate('next')}
                        disabled={images.length <= 1}
                      >
                        Next
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>
                    )}
                  </div>
                </footer>
            </div>
          )}
        </DialogPrimitive.Content>
      </DialogPortal>
    </Dialog>
  );
} 