'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { ImageSearchResultItem } from '@/lib/services/search-service';
import { cn } from '@/lib/utils';
import { 
  Dialog, 
  DialogContent, 
  DialogTitle, 
  DialogHeader 
} from '@/components/ui/dialog';
import { ExternalLink } from 'lucide-react';

interface ImageResultsProps {
  results: ImageSearchResultItem[];
  searchQuery: string;
  className?: string;
}

export function ImageResults({ results, searchQuery, className }: ImageResultsProps) {
  const [selectedImage, setSelectedImage] = useState<ImageSearchResultItem | null>(null);
  
  if (results.length === 0) {
    return (
      <div className={cn("py-4 text-center text-muted-foreground text-sm", className)}>
        No images found for "{searchQuery}".
      </div>
    );
  }
  
  return (
    <div className={className}>
      {/* Image grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
        {results.map((image) => (
          <div 
            key={image.id} 
            className="relative group cursor-pointer rounded-md overflow-hidden border border-primary/10 aspect-square hover:border-primary/30 transition-all duration-200"
            onClick={() => setSelectedImage(image)}
          >
            <Image
              src={image.thumbnail}
              alt={image.title}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2">
              <span className="text-xs text-white line-clamp-2">{image.title}</span>
            </div>
          </div>
        ))}
      </div>
      
      {/* Image preview dialog */}
      <Dialog open={!!selectedImage} onOpenChange={(open) => !open && setSelectedImage(null)}>
        <DialogContent className="sm:max-w-xl max-h-screen overflow-hidden p-0 gap-0">
          {selectedImage && (
            <div className="flex flex-col h-full">
              <DialogHeader className="flex flex-row justify-between items-center p-4 border-b">
                <DialogTitle className="text-lg font-medium">{selectedImage.title}</DialogTitle>
                <a 
                  href={selectedImage.url} 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:text-primary/80 flex items-center gap-1"
                  onClick={(e) => e.stopPropagation()}
                >
                  <span className="text-sm">View original</span>
                  <ExternalLink size={14} />
                </a>
              </DialogHeader>
              <div className="relative flex-1 min-h-[400px] bg-muted/30 flex items-center justify-center p-4">
                <Image
                  src={selectedImage.url}
                  alt={selectedImage.title}
                  fill
                  className="object-contain shadow-lg"
                />
                <div className="absolute bottom-2 right-2 text-xs text-muted-foreground bg-background/80 px-2 py-1 rounded">
                  Source: {selectedImage.source}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
} 