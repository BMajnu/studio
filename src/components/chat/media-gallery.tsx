"use client";

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogOverlay, DialogTitle } from '@/components/ui/dialog';
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { GeneratedImage } from '@/lib/types';
import { useRecentGeneratedImages } from '@/lib/hooks/use-recent-generated-images';
import { useUserProfile } from '@/lib/hooks/use-user-profile';
import { Button } from '@/components/ui/button';
import { Download, Maximize2, X, Sparkles, Loader2, ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MediaGalleryProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function MediaGallery({ open, onOpenChange }: MediaGalleryProps) {
  const { profile } = useUserProfile();
  const { images, loading } = useRecentGeneratedImages(profile?.userId);
  const [previewIndex, setPreviewIndex] = useState<number | null>(null);

  const handleDownload = (img: GeneratedImage) => {
    const link = document.createElement('a');
    link.href = img.dataUri;
    link.download = img.alt || `DesAInR-image-${img.id?.substring(0, 8) || Date.now()}.png`;
    link.click();
  };

  const navigatePreview = (direction: 'next' | 'prev') => {
    if (previewIndex === null) return;
    if (direction === 'next') {
      setPreviewIndex((previewIndex + 1) % images.length);
    } else {
      setPreviewIndex((previewIndex - 1 + images.length) % images.length);
    }
  };
  
  const previewImage = previewIndex !== null ? images[previewIndex] : null;

  // Handle arrow-key navigation when preview is open
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (previewIndex === null) return;
      if (e.key === 'ArrowLeft') {
        navigatePreview('prev');
      } else if (e.key === 'ArrowRight') {
        navigatePreview('next');
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [previewIndex]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogOverlay />
      <DialogContent className="w-full max-w-5xl overflow-hidden bg-background/95 backdrop-blur-md p-0">
        <div className="flex items-center justify-between p-4 border-b">
          <DialogTitle asChild>
            <h3 className="text-lg font-semibold flex items-center">
              <Sparkles className="h-5 w-5 mr-2 text-primary" />Generated Images (last hour)
            </h3>
          </DialogTitle>
        </div>
        {loading ? (
          <div className="p-4 grid grid-cols-2 md:grid-cols-4 gap-4 animate-pulse-slow">
            {Array(8).fill(0).map((_, i) => (
              <div key={i} className="aspect-square rounded-md bg-primary/10" />
            ))}
          </div>
        ) : images.length === 0 ? (
          <div className="p-6 flex flex-col items-center justify-center text-muted-foreground">
            <Sparkles className="h-10 w-10 mb-3 text-primary" />
            <p>No recent images found.</p>
          </div>
        ) : (
          <div className="p-4 grid grid-cols-2 md:grid-cols-4 gap-4">
            {images.map((img, idx) => (
              <div key={img.id || idx} className="relative group overflow-hidden rounded-md">
                <img
                  src={img.dataUri}
                  alt={img.alt}
                  loading="lazy"
                  className="w-full h-auto rounded-md border border-border transition-transform duration-300 group-hover:scale-105 cursor-pointer"
                  onClick={() => setPreviewIndex(idx)}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center p-3">
                  <div className="flex w-full space-x-2">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        setPreviewIndex(idx);
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
                        handleDownload(img);
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
        )}

        {/* Image Preview Modal */}
        <Dialog 
          open={previewIndex !== null} 
          onOpenChange={(open) => !open && setPreviewIndex(null)}
        >
          <DialogPrimitive.Portal>
            <DialogOverlay />
            <DialogPrimitive.Content
              className={cn(
                "fixed left-[50%] top-[50%] z-50 grid w-full max-w-4xl translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-0 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg max-h-[90vh] bg-background/95 backdrop-blur-md overflow-hidden"
              )}
            >
            {previewImage && previewIndex !== null && (
              <div className="relative flex flex-col h-full">
                {/* Preview header */}
                <div className="flex items-center justify-between p-4 border-b">
                  <DialogTitle className="text-lg font-medium">
                    Image {previewIndex + 1} of {images.length}
                  </DialogTitle>
                  <div className="flex space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleDownload(previewImage)}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => setPreviewIndex(null)}
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
                {images.length > 1 && (
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
          </DialogPrimitive.Portal>
        </Dialog>
      </DialogContent>
    </Dialog>
  );
} 