/**
 * Logger Utility
 * Handles centralized logging with configurable log levels
 */

interface LogOptions {
  level: LogLevel;
  module: string;
  throttle?: boolean;
}

export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
  SILENT = 4
}

type LoggerFunction = (message: string, ...args: any[]) => void;
type LoggerCategory = Record<string, LoggerFunction>;

// Default configuration
const DEFAULT_LOG_LEVEL = process.env.NODE_ENV === 'production' ? LogLevel.WARN : LogLevel.DEBUG;

// Default categories
const CATEGORIES = [
  'system', 'ui', 'session', 'storage', 'history', 'api', 'auth', 'chat', 'network'
];

// Configuration object (initialized with defaults)
const logConfig = {
  defaultLevel: DEFAULT_LOG_LEVEL,
  categoryLevels: {} as Record<string, LogLevel>,
  enabled: process.env.NODE_ENV !== 'production',
};

// Cache to track recent logs to prevent duplicates
const recentLogs: Record<string, { count: number, timestamp: number, message: string }> = {};
const THROTTLE_WINDOW_MS = 30000; // 30 seconds - increased window for better throttling
const MAX_DUPLICATE_COUNT = 1; // More aggressive throttling - log only once initially

// Helper to check if a log should be throttled
function shouldThrottleLog(category: string, level: string, message: string): boolean {
  // Special handling for history and loading related logs - always throttle aggressively
  if ((category === 'history' || category === 'system') && 
      (message.includes('load') || message.includes('Loading'))) {
    // Create a more general key for these types of messages to group similar logs
    const genericKey = `${category}:${level}:loading_operation`;
    const now = Date.now();
    
    if (recentLogs[genericKey]) {
      recentLogs[genericKey].count++;
      recentLogs[genericKey].timestamp = now;
      // For loading operations, only show the first one in each window
      return true;
    } else {
      recentLogs[genericKey] = { count: 1, timestamp: now, message };
      // Allow the first one through
      return false;
    }
  }
  
  // For other logs, use standard throttling
  const key = `${category}:${level}:${message}`;
  const now = Date.now();
  
  // Clean up expired entries every 100 logs to avoid memory buildup
  if (Math.random() < 0.01) {
    Object.keys(recentLogs).forEach(k => {
      if (now - recentLogs[k].timestamp > THROTTLE_WINDOW_MS) {
        delete recentLogs[k];
      }
    });
  }
  
  // Check if this is a duplicate message
  if (recentLogs[key]) {
    recentLogs[key].count++;
    recentLogs[key].timestamp = now;
    
    // If we've seen this message before, throttle it
    if (recentLogs[key].count > MAX_DUPLICATE_COUNT) {
      // Only log throttle notices less frequently 
      if (recentLogs[key].count === 10 || recentLogs[key].count === 100 || 
          recentLogs[key].count === 1000 || recentLogs[key].count % 1000 === 0) {
        console.warn(`[THROTTLED] ${category}:${level} - Message repeated ${recentLogs[key].count} times: "${message.substring(0, 50)}${message.length > 50 ? '...' : ''}"`);
      }
      return true;
    }
  } else {
    // First time seeing this message
    recentLogs[key] = { count: 1, timestamp: now, message };
  }
  
  return false;
}

// Core logger creator function
function createLogger(category: string, options: Partial<LogOptions> = {}): LoggerFunction {
  const level = options.level ?? logConfig.categoryLevels[category] ?? logConfig.defaultLevel;
  const throttle = options.throttle !== false;
  
  return (message: string, ...args: any[]) => {
    // Skip if logger is disabled or message level is below configured level
    if (!logConfig.enabled) return;
    
    // Skip if throttling is enabled and this message is being throttled
    if (throttle && shouldThrottleLog(category, 'log', message)) return;
    
    // Otherwise log normally
    console.log(`[${category.toUpperCase()}] ${message}`, ...args);
  };
}

// Create logger factory for each type
function createLoggerCategory(category: string): LoggerCategory {
  return {
    debug: (message: string, ...args: any[]) => {
      if (!logConfig.enabled || 
          (logConfig.categoryLevels[category] ?? logConfig.defaultLevel) > LogLevel.DEBUG) return;
          
      if (shouldThrottleLog(category, 'debug', message)) return;
      
      console.debug(`[${category.toUpperCase()}:DEBUG] ${message}`, ...args);
    },
    
    info: (message: string, ...args: any[]) => {
      if (!logConfig.enabled || 
          (logConfig.categoryLevels[category] ?? logConfig.defaultLevel) > LogLevel.INFO) return;
          
      if (shouldThrottleLog(category, 'info', message)) return;
      
      console.info(`[${category.toUpperCase()}:INFO] ${message}`, ...args);
    },
    
    warn: (message: string, ...args: any[]) => {
      if (!logConfig.enabled || 
          (logConfig.categoryLevels[category] ?? logConfig.defaultLevel) > LogLevel.WARN) return;
          
      if (shouldThrottleLog(category, 'warn', message)) return;
      
      console.warn(`[${category.toUpperCase()}:WARN] ${message}`, ...args);
    },
    
    error: (message: string, ...args: any[]) => {
      if (!logConfig.enabled || 
          (logConfig.categoryLevels[category] ?? logConfig.defaultLevel) > LogLevel.ERROR) return;
          
      // We don't throttle errors, they're important
      console.error(`[${category.toUpperCase()}:ERROR] ${message}`, ...args);
    },
    
    log: createLogger(category, { level: LogLevel.INFO }),
  };
}

// Build the logger object with all categories
const logger = CATEGORIES.reduce((loggerObject, category) => {
  return {
    ...loggerObject,
    [category]: createLoggerCategory(category)
  };
}, {} as Record<string, LoggerCategory>);

// Public API methods
export function setLogLevel(level: LogLevel): void {
  logConfig.defaultLevel = level;
}

export function setCategoryLogLevel(category: string, level: LogLevel): void {
  logConfig.categoryLevels[category] = level;
}

export function enableLogging(enabled: boolean): void {
  logConfig.enabled = enabled;
}

export function resetLogConfig(): void {
  logConfig.defaultLevel = DEFAULT_LOG_LEVEL;
  logConfig.categoryLevels = {};
  logConfig.enabled = process.env.NODE_ENV !== 'production';
  
  // Clear throttle history
  Object.keys(recentLogs).forEach(key => {
    delete recentLogs[key];
  });
}

export default logger; 