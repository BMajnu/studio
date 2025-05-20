'use client';

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { HelpCircle, X } from "lucide-react";
import ReactMarkdown from 'react-markdown';
import { cn } from "@/lib/utils";

interface FeaturesGuideModalProps {
  triggerButton?: React.ReactNode;
  guideContent: string; // Added prop to accept guide content
}

export function FeaturesGuideModal({ triggerButton, guideContent }: FeaturesGuideModalProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        {triggerButton || (
          <Button 
            variant="outline" 
            rounded="full"
            glow
            animate
            className="backdrop-blur-sm border border-primary/20 shadow-sm hover:shadow-md transition-all duration-300 ease-in-out"
          >
            <span className="relative mr-2">
              <span className="absolute inset-0 rounded-full bg-primary/20 blur-sm animate-pulse-slow"></span>
              <HelpCircle className="h-4 w-4 relative z-10" />
            </span>
            App Features Guide
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] md:max-w-[750px] lg:max-w-[900px] max-h-[85vh] bg-background/95 dark:bg-background/80 backdrop-blur-xl border border-border dark:border-primary/10 shadow-xl dark:shadow-2xl animate-fade-in rounded-2xl overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 rounded-2xl opacity-30 pointer-events-none"></div>
        
        <DialogHeader className="relative z-10 animate-fade-in">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl font-bold text-primary dark:bg-clip-text dark:text-transparent dark:bg-gradient-to-r dark:from-primary dark:to-secondary">
              App Features Guide
            </DialogTitle>
            <DialogClose asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                rounded="full" 
                glow
                className="absolute right-0 top-0 h-8 w-8 border border-border/30 dark:border-primary/10 hover:bg-primary/10 transition-all duration-300"
              >
                <X className="h-4 w-4" />
              </Button>
            </DialogClose>
          </div>
          <DialogDescription className="text-muted-foreground mt-2">
            Learn how to use DesAInR to its full potential.
          </DialogDescription>
        </DialogHeader>
        
        <ScrollArea className="max-h-[60vh] p-2 pr-5 relative z-10 mt-3">
          <div className="prose prose-sm dark:prose-invert max-w-none py-3 animate-fade-in relative">
            <ReactMarkdown
              components={{
                h1: ({node, ...props}) => (
                  <h1 
                    className="text-2xl font-bold my-5 pb-2 border-b border-border/30 dark:border-primary/10 text-primary dark:bg-clip-text dark:text-transparent dark:bg-gradient-to-r dark:from-primary dark:to-secondary" 
                    {...props} 
                  />
                ),
                h2: ({node, ...props}) => (
                  <h2 
                    className="text-xl font-semibold my-4 pb-1 text-primary/90 dark:bg-clip-text dark:text-transparent dark:bg-gradient-to-r dark:from-primary/90 dark:to-secondary/90" 
                    {...props} 
                  />
                ),
                h3: ({node, ...props}) => (
                  <h3 
                    className="text-lg font-semibold my-3 text-primary" 
                    {...props} 
                  />
                ),
                p: ({node, ...props}) => (
                  <p 
                    className="my-2 leading-relaxed text-foreground/90" 
                    {...props} 
                  />
                ),
                ul: ({node, ...props}) => (
                  <ul 
                    className="list-disc pl-5 my-3 space-y-2 stagger-animation" 
                    {...props} 
                  />
                ),
                li: ({node, ...props}) => (
                  <li 
                    className="my-1 animate-stagger" 
                    {...props} 
                  />
                ),
                code: ({node, className, ...props}: any) => {
                  const match = /language-(\w+)/.exec(className || '');
                  const isInline = !match;
                  return isInline ? (
                    <code 
                      className="bg-primary/10 px-1.5 py-0.5 rounded-md font-mono text-primary text-sm" 
                      {...props} 
                    />
                  ) : (
                    <pre className="glass-panel p-3 rounded-xl overflow-x-auto my-3 border border-primary/10 shadow-md transition-all duration-300 hover:shadow-lg">
                      <code className="font-mono text-sm" {...props} />
                    </pre>
                  );
                },
                ol: ({node, ...props}) => (
                  <ol 
                    className="list-decimal pl-5 my-3 space-y-2 stagger-animation" 
                    {...props} 
                  />
                ),
                a: ({node, ...props}) => (
                  <a 
                    className="text-primary hover:text-primary/80 underline transition-colors duration-200" 
                    {...props} 
                  />
                ),
                blockquote: ({node, ...props}) => (
                  <blockquote 
                    className="border-l-4 border-primary/30 pl-4 italic my-4 text-foreground/80" 
                    {...props} 
                  />
                ),
              }}
            >
              {guideContent}
            </ReactMarkdown>
          </div>
        </ScrollArea>
        
        <DialogFooter className="relative z-10 mt-4 pt-3 border-t border-border/30 dark:border-primary/10 animate-fade-in" style={{ animationDelay: '300ms' }}>
          <DialogClose asChild>
            <Button 
              type="button" 
              variant="default" 
              rounded="full"
              glow
              animate
              className="bg-primary dark:bg-gradient-to-r dark:from-primary dark:to-secondary text-primary-foreground hover:shadow-lg transition-all duration-300 ease-in-out"
            >
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}