/**
 * Utility functions for working with chat messages
 */

import { ChatMessage, AttachedFile } from '@/lib/types';

const MAX_MESSAGE_TEXT_LENGTH = 1000; // For msg.content or text parts
const MAX_ATTACHMENT_TEXT_LENGTH = 200; // For attachment textContent

/**
 * Extract a text preview from a message
 */
export function getMessageTextPreview(message: ChatMessage | undefined): string {
  if (!message) return 'New Chat';
  
  // If the message is loading and not an error, return processing status
  if (message.isLoading === true && !message.isError) {
    return "Processing...";
  }
  
  // If message was in error state
  if (message.isError) {
    return "Error occurred";
  }
  
  if (typeof message.content === 'string') {
    // Only treat content with the exact string "Processing..." as a placeholder
    // This allows real content that happens to contain the word to display correctly
    if (message.content === 'Processing...') {
      return "Completed";
    }
    return message.content.substring(0, 50).trim() || "Chat started";
  }
  
  if (Array.isArray(message.content)) {
    for (const part of message.content) {
      if (!part || typeof part !== 'object') continue;

      if ('type' in part) {
        switch (part.type) {
          case 'text':
            if ('text' in part && part.text) return part.text.substring(0, 50).trim();
            break;
          case 'code':
            if ('title' in part && part.title) return `Code: ${part.title.substring(0, 40).trim()}`;
            if ('code' in part && part.code) return `Code Block`; // Simplified
            break;
          case 'list':
            if ('title' in part && part.title) return `List: ${part.title.substring(0, 40).trim()}`;
            if ('items' in part && Array.isArray(part.items) && part.items.length > 0) 
              return `List: ${part.items[0].substring(0, 40).trim()}`;
            break;
          case 'translation_group':
            if ('title' in part && part.title) return `Analysis: ${part.title.substring(0, 40).trim()}`;
            if ('english' in part && part.english?.analysis) 
              return `Eng Analysis: ${part.english.analysis.substring(0, 30).trim()}`;
            break;
          case 'custom':
            if ('title' in part && part.title) return `AI Chat: ${part.title.substring(0, 40).trim()}`;
            if ('text' in part && part.text) return `AI Chat instruction: ${part.text.substring(0, 40).trim()}`;
            break;
          case 'suggested_replies':
            return 'Suggested Replies';
        }
      }
    }
    if (message.attachedFiles && message.attachedFiles.length > 0) {
      return `Attached: ${message.attachedFiles[0].name.substring(0, 40).trim()}`;
    }
  }
  return 'Structured message';
}

/**
 * Create a lean version of a message with truncated content
 */
export function createLeanMessage(message: ChatMessage): ChatMessage {
  if (!message) return message;

  let leanContent = message.content;
  
  if (typeof message.content === 'string' && message.content.length > MAX_MESSAGE_TEXT_LENGTH) {
    leanContent = message.content.substring(0, MAX_MESSAGE_TEXT_LENGTH) + "... (truncated)";
  } else if (Array.isArray(message.content)) {
    leanContent = message.content.map(part => {
      if (part.type === 'text' && part.text && part.text.length > MAX_MESSAGE_TEXT_LENGTH) {
        return { ...part, text: part.text.substring(0, MAX_MESSAGE_TEXT_LENGTH) + "... (truncated)" };
      }
      return part;
    });
  }

  // Handle attachedFiles if present
  if (message.attachedFiles && message.attachedFiles.some(f => 
    f.dataUri || (f.textContent && f.textContent.length > MAX_ATTACHMENT_TEXT_LENGTH))
  ) {
    return {
      ...message,
      content: leanContent,
      attachedFiles: message.attachedFiles.map(f => {
        const { dataUri, textContent, ...rest } = f;
        const leanFile: AttachedFile = { ...rest };
        
        if (textContent && textContent.length > MAX_ATTACHMENT_TEXT_LENGTH) {
          leanFile.textContent = textContent.substring(0, MAX_ATTACHMENT_TEXT_LENGTH) + "... (truncated)";
        } else if (textContent) {
          leanFile.textContent = textContent;
        }
        
        return leanFile;
      })
    };
  }
  
  return { ...message, content: leanContent };
} 