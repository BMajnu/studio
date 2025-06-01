/**
 * Simple chat session naming utilities
 */

/**
 * Generate a simple name for a chat session based on creation timestamp
 * without relying on AI
 * 
 * @param timestamp - The timestamp when the session was created
 * @param messages - Optional array of messages for context (not used in simple naming)
 * @returns A string name for the chat session
 */
export function generateSessionName(timestamp: number): string {
  const date = new Date(timestamp);
  
  // Format: "Chat - Jan 15, 2023 (3:45 PM)"
  return `Chat - ${formatDate(date)}`;
}

/**
 * Format a date in a user-friendly way
 */
function formatDate(date: Date): string {
  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];
  
  const month = months[date.getMonth()];
  const day = date.getDate();
  const year = date.getFullYear();
  
  // Get hours in 12-hour format
  let hours = date.getHours();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12; // Convert 0 to 12
  
  // Format minutes with leading zero
  const minutes = date.getMinutes().toString().padStart(2, '0');
  
  return `${month} ${day}, ${year} (${hours}:${minutes} ${ampm})`;
}

/**
 * Generate a session name based on first message content
 * This is a fallback when timestamps aren't reliable
 * 
 * @param message The first message text content
 * @returns A string name based on the message
 */
export function generateSessionNameFromMessage(message: string): string {
  if (!message) return "New Chat";
  
  // Take first 30 chars of message content
  const preview = message.trim().substring(0, 30);
  
  // If preview is shorter than 30 chars, use it directly
  if (preview.length < 30) return preview;
  
  // Otherwise add ellipsis to show it's truncated
  return `${preview}...`;
} 