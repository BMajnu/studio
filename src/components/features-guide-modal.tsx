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
import ReactMarkdown from 'react-markdown';

interface FeaturesGuideModalProps {
  triggerButton?: React.ReactNode;
  guideContent: string; // Added prop to accept guide content
}

export function FeaturesGuideModal({ triggerButton, guideContent }: FeaturesGuideModalProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        {triggerButton || <Button variant="outline">App Features Guide</Button>}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] md:max-w-[750px] lg:max-w-[900px] max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>App Features Guide</DialogTitle>
          <DialogDescription>
            Learn how to use DesAInR to its full potential.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[60vh] p-1 pr-4">
          <div className="prose prose-sm dark:prose-invert max-w-none py-4">
            <ReactMarkdown
              components={{
                h1: ({node, ...props}) => <h1 className="text-2xl font-bold my-4" {...props} />,
                h2: ({node, ...props}) => <h2 className="text-xl font-semibold my-3" {...props} />,
                h3: ({node, ...props}) => <h3 className="text-lg font-semibold my-2" {...props} />,
                p: ({node, ...props}) => <p className="my-2 leading-relaxed" {...props} />,
                ul: ({node, ...props}) => <ul className="list-disc pl-5 my-2 space-y-1" {...props} />,
                li: ({node, ...props}) => <li className="my-1" {...props} />,
                code: ({node, inline, ...props}) => 
                  inline ? <code className="bg-muted px-1 py-0.5 rounded-sm font-mono text-sm" {...props} /> : <pre className="bg-muted p-2 rounded-md overflow-x-auto my-2"><code className="font-mono text-sm" {...props} /></pre>,
              }}
            >
              {guideContent}
            </ReactMarkdown>
          </div>
        </ScrollArea>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button">Close</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}