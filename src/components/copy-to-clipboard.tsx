'use client';

import { useState } from 'react';
import { Check, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface CopyToClipboardProps {
  textToCopy: string;
  displayText?: string; // If different from textToCopy, e.g. for formatted code
  title?: string;
  language?: string;
  className?: string;
  style?: React.CSSProperties;
}

export function CopyToClipboard({
  textToCopy,
  displayText,
  title,
  language,
  className,
  style,
}: CopyToClipboardProps) {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      toast({ title: 'Copied to clipboard!', duration: 2000 });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
      toast({ title: 'Failed to copy', description: 'Could not copy text to clipboard.', variant: 'destructive' });
    }
  };

  const displayContent = displayText || textToCopy;

  return (
    <div className={cn("relative rounded-md border bg-card/50 shadow-sm my-2", className)} style={style}>
      {(title || language) && (
        <div className="flex items-center justify-between px-4 py-2 border-b">
          {title && <h4 className="text-sm font-semibold text-muted-foreground">{title}</h4>}
          {language && <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-sm">{language}</span>}
        </div>
      )}
      <div className="relative p-4">
        <pre className="whitespace-pre-wrap break-words text-sm leading-relaxed text-foreground font-mono">
          <code>{displayContent}</code>
        </pre>
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2 h-7 w-7 text-muted-foreground hover:text-foreground"
          onClick={handleCopy}
          aria-label="Copy to clipboard"
        >
          {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
        </Button>
      </div>
    </div>
  );
}

interface CopyableTextProps {
  text: string | undefined;
  title?: string;
  className?: string;
  style?: React.CSSProperties;
}

export function CopyableText({ text, title, className, style }: CopyableTextProps) {
  if (!text) return null;
  return <CopyToClipboard textToCopy={text} title={title} className={className} style={style} />;
}

interface CopyableListProps {
  items: string[] | undefined;
  title?: string;
  className?: string;
  style?: React.CSSProperties;
}

export function CopyableList({ items, title, className, style }: CopyableListProps) {
  if (!items || items.length === 0) return null;
  const formattedItems = items.map((item, idx) => `${idx + 1}. ${item}`).join('\n');
  return <CopyToClipboard textToCopy={formattedItems} title={title} className={className} style={style} />;
}
