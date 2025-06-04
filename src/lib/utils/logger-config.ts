/**
 * Logger configuration utility with UI controls
 */

import { LogLevel, LogCategory, configureLogger, setLogLevel } from './logger';

// Default state of log levels per category
const DEFAULT_LOG_LEVELS: Record<LogCategory, LogLevel> = {
  session: LogLevel.INFO,
  storage: LogLevel.INFO,
  history: LogLevel.INFO,
  ui: LogLevel.INFO,
  api: LogLevel.INFO,
  auth: LogLevel.INFO,
  system: LogLevel.INFO,
  general: LogLevel.INFO
};

// Key for storing user log preferences
const LOG_PREFERENCES_KEY = 'desainr_log_preferences';

/**
 * Initialize logger from saved preferences or defaults
 */
export function initializeLogger(): void {
  try {
    // First try to load saved preferences
    const savedPreferences = localStorage.getItem(LOG_PREFERENCES_KEY);
    if (savedPreferences) {
      const parsed = JSON.parse(savedPreferences);
      applyLogPreferences(parsed);
    } else {
      applyDefaultPreferences();
    }
    
    // Configure production mode if needed
    if (process.env.NODE_ENV === 'production') {
      configureLogger({
        defaultLevel: LogLevel.ERROR,
        includeTimestamps: true
      });
    }
  } catch (error) {
    console.error('Failed to initialize logger, using defaults:', error);
    applyDefaultPreferences();
  }
}

/**
 * Apply default log preferences
 */
function applyDefaultPreferences(): void {
  Object.entries(DEFAULT_LOG_LEVELS).forEach(([category, level]) => {
    setLogLevel(category as LogCategory, level);
  });
}

/**
 * Apply log preferences from saved settings
 */
function applyLogPreferences(preferences: Record<LogCategory, LogLevel>): void {
  Object.entries(preferences).forEach(([category, level]) => {
    if (isValidCategory(category) && isValidLevel(level)) {
      setLogLevel(category as LogCategory, level as LogLevel);
    }
  });
}

/**
 * Save current log preferences to localStorage
 */
export function saveLogPreferences(preferences: Record<LogCategory, LogLevel>): void {
  try {
    localStorage.setItem(LOG_PREFERENCES_KEY, JSON.stringify(preferences));
  } catch (error) {
    console.error('Failed to save log preferences:', error);
  }
}

/**
 * Type guard for valid log category
 */
function isValidCategory(category: string): category is LogCategory {
  return ['session', 'storage', 'history', 'ui', 'api', 'auth', 'system', 'general'].includes(category);
}

/**
 * Type guard for valid log level
 */
function isValidLevel(level: number): level is LogLevel {
  return level >= 0 && level <= 5;
}

/**
 * Get log level name for display
 */
export function getLogLevelName(level: LogLevel): string {
  const names: Record<LogLevel, string> = {
    [LogLevel.NONE]: 'None',
    [LogLevel.ERROR]: 'Error',
    [LogLevel.WARN]: 'Warning',
    [LogLevel.INFO]: 'Info',
    [LogLevel.DEBUG]: 'Debug',
    [LogLevel.TRACE]: 'Trace'
  };
  return names[level] || 'Unknown';
}

/**
 * Get available log levels for UI selection
 */
export function getAvailableLogLevels(): { value: LogLevel, label: string }[] {
  return [
    { value: LogLevel.NONE, label: 'None' },
    { value: LogLevel.ERROR, label: 'Error' },
    { value: LogLevel.WARN, label: 'Warning' },
    { value: LogLevel.INFO, label: 'Info' },
    { value: LogLevel.DEBUG, label: 'Debug' },
    { value: LogLevel.TRACE, label: 'Trace' }
  ];
}

/**
 * Get available categories for UI selection
 */
export function getAvailableCategories(): { value: LogCategory, label: string }[] {
  return [
    { value: 'session', label: 'Session Management' },
    { value: 'storage', label: 'Storage Operations' },
    { value: 'history', label: 'History Panel' },
    { value: 'ui', label: 'UI Components' },
    { value: 'api', label: 'API Calls' },
    { value: 'auth', label: 'Authentication' },
    { value: 'system', label: 'System' },
    { value: 'general', label: 'General' }
  ];
}

// Add helpful description for each category
export const CATEGORY_DESCRIPTIONS: Record<LogCategory, string> = {
  session: 'Logs for session creation, loading, and management',
  storage: 'Logs for localStorage, IndexedDB, and other storage operations',
  history: 'Logs related to chat history panel and events',
  ui: 'Logs for UI component rendering and events',
  api: 'Logs for API calls and responses',
  auth: 'Logs for authentication and user profile operations',
  system: 'System-level operation logs',
  general: 'General uncategorized logs'
};

export default {
  initializeLogger,
  saveLogPreferences,
  getLogLevelName,
  getAvailableLogLevels,
  getAvailableCategories,
  CATEGORY_DESCRIPTIONS
}; 