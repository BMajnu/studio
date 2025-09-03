// Monica-inspired modern theme system for DesAInR Extension
// Supports both dark and light themes based on system preference

const DarkTheme = {
  background: '#0f0f0f',
  surface: '#1a1a1a',
  surfaceHover: '#262626',
  surfaceActive: '#333333',
  
  // Purple accent system (Monica-inspired but enhanced)
  primary: '#8b5cf6',
  primaryHover: '#7c3aed',
  primaryActive: '#6d28d9',
  primaryLight: '#a78bfa',
  
  // Text colors
  textPrimary: '#ffffff',
  textSecondary: '#a1a1aa',
  textMuted: '#71717a',
  
  // Semantic colors
  success: '#22c55e',
  warning: '#f59e0b',
  error: '#ef4444',
  info: '#3b82f6',
  
  // Border and shadow
  border: '#262626',
  borderLight: '#374151',
  shadow: 'rgba(0, 0, 0, 0.8)',
  shadowLight: 'rgba(0, 0, 0, 0.4)',
};

const LightTheme = {
  background: '#ffffff',
  surface: '#f8fafc',
  surfaceHover: '#f1f5f9',
  surfaceActive: '#e2e8f0',
  
  // Purple accent system (adjusted for light theme)
  primary: '#8b5cf6',
  primaryHover: '#7c3aed',
  primaryActive: '#6d28d9',
  primaryLight: '#a78bfa',
  
  // Text colors for light theme
  textPrimary: '#1e293b',
  textSecondary: '#475569',
  textMuted: '#64748b',
  
  // Semantic colors (same as dark)
  success: '#22c55e',
  warning: '#f59e0b',
  error: '#ef4444',
  info: '#3b82f6',
  
  // Border and shadow for light theme
  border: '#e2e8f0',
  borderLight: '#cbd5e1',
  shadow: 'rgba(0, 0, 0, 0.15)',
  shadowLight: 'rgba(0, 0, 0, 0.08)',
};

// Function to detect system theme preference
const getSystemTheme = (): 'dark' | 'light' => {
  if (typeof window !== 'undefined' && window.matchMedia) {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  return 'dark'; // Default to dark
};

// Function to get current theme colors
const getCurrentTheme = () => {
  const systemTheme = getSystemTheme();
  return systemTheme === 'dark' ? DarkTheme : LightTheme;
};

export const MonicaTheme = {
  colors: getCurrentTheme(),
  
  // Method to update theme dynamically
  updateTheme() {
    this.colors = getCurrentTheme();
  },
  
  // Method to listen for theme changes
  watchThemeChanges(callback: () => void) {
    if (typeof window !== 'undefined' && window.matchMedia) {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      mediaQuery.addEventListener('change', () => {
        this.updateTheme();
        callback();
      });
    }
  },
  
  // Feature Icons (Heroicons-style SVG)
  featureIcons: {
    refine: '<svg viewBox="0 0 20 20" fill="currentColor"><path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"></path></svg>',
    translate: '<svg viewBox="0 0 20 20" fill="currentColor"><path d="M7 2a1 1 0 011 1v1h3a1 1 0 110 2H9.578a18.87 18.87 0 01-1.724 4.78c.29.354.596.696.914 1.026a1 1 0 11-1.44 1.389c-.188-.196-.373-.396-.554-.6a19.098 19.098 0 01-3.107 3.567 1 1 0 01-1.334-1.49 17.087 17.087 0 003.13-3.733 18.992 18.992 0 01-1.487-2.494 1 1 0 111.79-.89c.234.47.489.928.764 1.372.417-.934.752-1.913.997-2.927H3a1 1 0 110-2h3V3a1 1 0 011-1zm6 6a1 1 0 01.894.553l2.991 5.982a.869.869 0 01.02.037l.99 1.98a1 1 0 11-1.79.895L15.383 16h-4.764l-.724 1.447a1 1 0 11-1.788-.894l.99-1.98.019-.038 2.99-5.982A1 1 0 0113 8zm-1.382 4h2.764L13 9.236 11.618 12z"></path></svg>',
    rewrite: '<svg viewBox="0 0 20 20" fill="currentColor"><path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"></path></svg>',
    
    analyze: '<svg viewBox="0 0 20 20" fill="currentColor"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>',
    explain: '<svg viewBox="0 0 20 20" fill="currentColor"><path d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z"></path></svg>',
    correct: '<svg viewBox="0 0 20 20" fill="currentColor"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>',
    expand: '<svg viewBox="0 0 20 20" fill="currentColor"><path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"></path></svg>',
    
    chatPersonal: '<svg viewBox="0 0 20 20" fill="currentColor"><path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z"></path><path d="M15 7v2a4 4 0 01-4 4H9.828l-1.766 1.767c.28.149.599.233.938.233h2l3 3v-3h2a2 2 0 002-2V9a2 2 0 00-2-2h-1z"></path></svg>',
    chatPro: '<svg viewBox="0 0 20 20" fill="currentColor"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>',
    
    copy: '<svg viewBox="0 0 20 20" fill="currentColor"><path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z"></path><path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z"></path></svg>',
    settings: '<svg viewBox="0 0 20 20" fill="currentColor"><path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z"></path></svg>',
    customize: '<svg viewBox="0 0 20 20" fill="currentColor"><path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"></path></svg>',
  },
  
  // Feature Categories
  featureCategories: {
    'Quick Actions': {
      title: 'Quick Actions',
      icon: '<svg viewBox="0 0 20 20" fill="currentColor"><path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z"></path></svg>',
      description: 'Fast access to common tools'
    },
    'Content Tools': {
      title: 'Content Tools', 
      icon: '<svg viewBox="0 0 20 20" fill="currentColor"><path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"></path></svg>',
      description: 'Text editing and enhancement'
    },
    'AI Chat': {
      title: 'AI Chat',
      icon: '<svg viewBox="0 0 20 20" fill="currentColor"><path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z"></path></svg>',
      description: 'AI-powered conversations'
    },
    'Advanced': {
      title: 'Advanced',
      icon: '<svg viewBox="0 0 20 20" fill="currentColor"><path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z"></path></svg>',
      description: 'Advanced features and settings'
    }
  },
  
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '12px',
    lg: '16px',
    xl: '20px',
    xxl: '24px',
  },
  
  borderRadius: {
    sm: '6px',
    md: '8px',
    lg: '12px',
    xl: '16px',
    full: '9999px',
  },
  
  typography: {
    fontFamily: '"Inter", "Segoe UI", system-ui, sans-serif',
    fontSize: {
      xs: '12px',
      sm: '13px',
      base: '14px',
      lg: '16px',
      xl: '18px',
    },
    fontWeight: {
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
    },
    lineHeight: {
      tight: '1.25',
      normal: '1.4',
      relaxed: '1.6',
    },
  },
  
  animation: {
    fast: '150ms ease-out',
    normal: '250ms ease-out',
    slow: '350ms ease-out',
  },
  
  shadows: {
    sm: '0 2px 4px rgba(0, 0, 0, 0.4)',
    md: '0 4px 12px rgba(0, 0, 0, 0.6)',
    lg: '0 8px 24px rgba(0, 0, 0, 0.8)',
    glow: '0 0 20px rgba(139, 92, 246, 0.3)',
  },
  
  zIndex: {
    tooltip: 1000,
    dropdown: 1100,
    overlay: 1200,
    modal: 1300,
    toast: 1400,
    max: 2147483647,
  },
};

// CSS-in-JS helper for generating theme styles
export const createThemeStyles = (selector: string = '') => `
  ${selector} {
    --monica-bg: ${MonicaTheme.colors.background};
    --monica-surface: ${MonicaTheme.colors.surface};
    --monica-surface-hover: ${MonicaTheme.colors.surfaceHover};
    --monica-surface-active: ${MonicaTheme.colors.surfaceActive};
    --monica-primary: ${MonicaTheme.colors.primary};
    --monica-primary-hover: ${MonicaTheme.colors.primaryHover};
    --monica-primary-active: ${MonicaTheme.colors.primaryActive};
    --monica-text-primary: ${MonicaTheme.colors.textPrimary};
    --monica-text-secondary: ${MonicaTheme.colors.textSecondary};
    --monica-text-muted: ${MonicaTheme.colors.textMuted};
    --monica-border: ${MonicaTheme.colors.border};
    --monica-shadow: ${MonicaTheme.shadows.md};
    --monica-shadow-glow: ${MonicaTheme.shadows.glow};
    --monica-radius: ${MonicaTheme.borderRadius.md};
    --monica-font: ${MonicaTheme.typography.fontFamily};
    --monica-transition: ${MonicaTheme.animation.normal};
  }
`;

// Feature icons mapping (Heroicons-style but optimized)
export const FeatureIcons = {
  // Core Monica features
  summarize: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
    <path d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"/>
  </svg>`,
  
  translate: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
    <path d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 18H20.25"/>
  </svg>`,
  
  explain: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
    <circle cx="12" cy="12" r="10"/>
    <path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3"/>
    <path d="M12 17h.01"/>
  </svg>`,
  
  grammar: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
    <polyline points="14,2 14,8 20,8"/>
    <line x1="16" y1="13" x2="8" y2="13"/>
    <line x1="16" y1="17" x2="8" y2="17"/>
    <polyline points="10,9 9,9 8,9"/>
  </svg>`,
  
  rewrite: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
    <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
    <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
  </svg>`,
  
  expand: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
    <polyline points="15,3 21,3 21,9"/>
    <polyline points="9,21 3,21 3,15"/>
    <line x1="21" y1="3" x2="14" y2="10"/>
    <line x1="3" y1="21" x2="10" y2="14"/>
  </svg>`,
  
  question: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
    <circle cx="12" cy="12" r="10"/>
    <path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3"/>
    <path d="M12 17h.01"/>
  </svg>`,
  
  // Enhanced DesAInR features
  analyze: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
    <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/>
    <polyline points="7.5,10 12,13 16.5,10"/>
    <line x1="12" y1="22.08" x2="12" y2="13"/>
  </svg>`,
  
  chat: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
    <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
  </svg>`,
  
  custom: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
    <circle cx="12" cy="12" r="3"/>
    <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z"/>
  </svg>`,
  
  refine: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
    <path d="M12 3l7 3-7 3-7-3 7-3z"/>
    <path d="M5 12l7 3 7-3"/>
    <path d="M5 18l7 3 7-3"/>
  </svg>`,
  
  memo: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
    <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z"/>
  </svg>`,
};

// Feature categories for better organization
export const FeatureCategories = {
  quickActions: {
    title: 'Quick Actions',
    icon: '⚡',
    items: ['summarize', 'translate', 'explain']
  },
  contentTools: {
    title: 'Content Tools', 
    icon: '🛠️',
    items: ['grammar', 'rewrite', 'expand', 'refine']
  },
  aiChat: {
    title: 'AI Chat',
    icon: '💬', 
    items: ['chat', 'question']
  },
  advanced: {
    title: 'Advanced',
    icon: '🔧',
    items: ['analyze', 'custom', 'memo']
  }
};
