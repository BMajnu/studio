'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Settings } from 'lucide-react';
import { LogLevel, setLogLevel, setCategoryLogLevel, enableLogging, resetLogConfig } from '@/lib/utils/logger';

// Category options
const categoryOptions = [
  'system',
  'ui', 
  'session', 
  'storage', 
  'history', 
  'api', 
  'auth', 
  'chat', 
  'network',
];

// Log level options
const logLevelOptions = [
  { value: LogLevel.SILENT, label: 'Silent' },
  { value: LogLevel.ERROR, label: 'Error Only' },
  { value: LogLevel.WARN, label: 'Warning & Error' },
  { value: LogLevel.INFO, label: 'Info & Above' },
  { value: LogLevel.DEBUG, label: 'Debug & Above' },
];

export function LoggerSettings() {
  // State with more restrictive defaults
  const [globalLogLevel, setGlobalLogLevel] = useState<LogLevel>(LogLevel.WARN);
  const [categoryLogLevels, setCategoryLogLevels] = useState<Record<string, LogLevel>>({
    history: LogLevel.ERROR,
    storage: LogLevel.ERROR,
    session: LogLevel.ERROR
  });
  const [isLoggingEnabled, setIsLoggingEnabled] = useState(false); // Disabled by default
  const [isOpen, setIsOpen] = useState(false);

  // Component effect to initialize logger with restricted settings
  useEffect(() => {
    // Set initial logger configuration
    enableLogging(false); // Start with logging disabled
    setLogLevel(LogLevel.WARN); // Default to warn level
    setCategoryLogLevel('history', LogLevel.ERROR); // Specifically restrict noisy categories
    setCategoryLogLevel('storage', LogLevel.ERROR);
    setCategoryLogLevel('session', LogLevel.ERROR);
  }, []);

  // Handle global log level change
  const handleGlobalLogLevelChange = (value: string) => {
    const level = parseInt(value, 10) as LogLevel;
    setGlobalLogLevel(level);
    setLogLevel(level);
  };

  // Handle category log level change
  const handleCategoryLogLevelChange = (category: string, value: string) => {
    const level = parseInt(value, 10) as LogLevel;
    setCategoryLogLevels(prev => ({
      ...prev,
      [category]: level
    }));
    setCategoryLogLevel(category, level);
  };

  // Handle logging enable/disable toggle
  const handleLoggingToggle = (checked: boolean) => {
    setIsLoggingEnabled(checked);
    enableLogging(checked);
  };

  // Reset all settings
  const handleReset = () => {
    resetLogConfig();
    setGlobalLogLevel(process.env.NODE_ENV === 'production' ? LogLevel.WARN : LogLevel.DEBUG);
    setCategoryLogLevels({});
    setIsLoggingEnabled(process.env.NODE_ENV !== 'production');
  };

  return (
    <div>
      <Button 
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(true)}
        className="flex items-center"
      >
        <Settings className="h-4 w-4 mr-2" />
        Configure Logging
      </Button>
      
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>Logger Settings</DialogTitle>
            <DialogDescription>
              Configure the application logging behavior for debugging.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            {/* Enable/disable logging */}
            <div className="flex flex-row items-center justify-between rounded-lg border p-3">
              <div className="space-y-0.5">
                <Label htmlFor="logging-enabled">Enable Logging</Label>
                <div className="text-sm text-muted-foreground">
                  Enable or disable all console logging
                </div>
              </div>
              <Switch
                id="logging-enabled"
                checked={isLoggingEnabled}
                onCheckedChange={handleLoggingToggle}
              />
            </div>

            {/* Global log level */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="global-log-level">Global Log Level</Label>
              <Select 
                value={globalLogLevel.toString()} 
                onValueChange={handleGlobalLogLevelChange}
                disabled={!isLoggingEnabled}
              >
                <SelectTrigger id="global-log-level">
                  <SelectValue placeholder="Select log level" />
                </SelectTrigger>
                <SelectContent>
                  {logLevelOptions.map(option => (
                    <SelectItem key={option.value} value={option.value.toString()}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Category log levels */}
            <div className="flex flex-col gap-2 mt-2">
              <Label className="mb-2">Category Log Levels (Overrides)</Label>
              <div className="grid grid-cols-2 gap-4">
                {categoryOptions.map(category => (
                  <div key={category} className="flex flex-col gap-2">
                    <Label htmlFor={`log-level-${category}`}>{category}</Label>
                    <Select 
                      value={(categoryLogLevels[category] || globalLogLevel).toString()}
                      onValueChange={(value) => handleCategoryLogLevelChange(category, value)}
                      disabled={!isLoggingEnabled}
                    >
                      <SelectTrigger id={`log-level-${category}`}>
                        <SelectValue placeholder="Default" />
                      </SelectTrigger>
                      <SelectContent>
                        {logLevelOptions.map(option => (
                          <SelectItem key={option.value} value={option.value.toString()}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                ))}
              </div>
            </div>

            {/* Reset button */}
            <div className="flex justify-end mt-4">
              <Button variant="outline" onClick={handleReset} className="mr-2">
                Reset Defaults
              </Button>
              <Button onClick={() => setIsOpen(false)}>
                Done
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}