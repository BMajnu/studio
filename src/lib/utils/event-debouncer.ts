/**
 * Event Debouncer Utility
 * Prevents event cascading and implements proper debouncing for chat events
 */

import logger from './logger';
const { system: systemLogger } = logger;

interface EventRecord {
  lastFiredTime: number;
  timer: NodeJS.Timeout | null;
  count: number;
  source: string;
}

export class EventDebouncer {
  private events: Record<string, EventRecord> = {};
  private readonly MIN_INTERVAL_MS: number = 300; // Minimum time between events
  private readonly MAX_EVENTS_PER_SECOND: number = 5; // Rate limiting
  
  /**
   * Should the event be processed, or is it being fired too rapidly?
   */
  shouldProcessEvent(eventName: string, source: string = 'unknown'): boolean {
    const now = Date.now();
    const eventKey = `${eventName}:${source}`;
    
    // Initialize tracking for this event if first time
    if (!this.events[eventKey]) {
      this.events[eventKey] = {
        lastFiredTime: 0,
        timer: null,
        count: 0,
        source
      };
    }
    
    const record = this.events[eventKey];
    const timeSinceLast = now - record.lastFiredTime;
    
    // Reset count if it's been more than a second
    if (timeSinceLast > 1000) {
      record.count = 0;
    }
    
    // Increment count and check rate limit
    record.count++;
    if (record.count > this.MAX_EVENTS_PER_SECOND) {
      systemLogger.warn(`Rate limiting ${eventName} from ${source}: fired ${record.count} times in ~1 second`);
      
      // Only log once per second when rate limited
      if (record.count === this.MAX_EVENTS_PER_SECOND + 1) {
        return false;
      }
      return false;
    }
    
    // Check if enough time has passed since last event
    if (timeSinceLast < this.MIN_INTERVAL_MS) {
      return false;
    }
    
    // Update last fired time
    record.lastFiredTime = now;
    return true;
  }
  
  /**
   * Debounce an event handler function
   */
  debounce<T extends (...args: any[]) => void>(
    eventName: string,
    func: T,
    wait: number,
    source: string = 'unknown'
  ): (...args: Parameters<T>) => void {
    return (...args: Parameters<T>): void => {
      const eventKey = `${eventName}:${source}`;
      
      if (!this.events[eventKey]) {
        this.events[eventKey] = {
          lastFiredTime: 0,
          timer: null,
          count: 0,
          source
        };
      }
      
      const record = this.events[eventKey];
      
      // Clear previous timer
      if (record.timer) {
        clearTimeout(record.timer);
        record.timer = null;
      }
      
      // Set new timer
      record.timer = setTimeout(() => {
        record.lastFiredTime = Date.now();
        func(...args);
      }, wait);
    };
  }
  
  /**
   * Track an event that's about to be dispatched
   * Returns false if the event should be skipped (happening too frequently)
   */
  trackDispatchedEvent(eventName: string, source: string = 'unknown'): boolean {
    return this.shouldProcessEvent(eventName, source);
  }
}

// Create and export a singleton instance
export const eventDebouncer = new EventDebouncer();

export default eventDebouncer; 