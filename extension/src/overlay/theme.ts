/**
 * Theme system for high-contrast and accessibility support
 */

export interface Theme {
  name: 'default' | 'high-contrast';
  colors: {
    background: string;
    surface: string;
    border: string;
    text: string;
    textSecondary: string;
    primary: string;
    primaryText: string;
    success: string;
    error: string;
    warning: string;
    info: string;
    focus: string;
  };
  shadows: {
    sm: string;
    md: string;
    lg: string;
  };
  borders: {
    width: string;
    radius: number;
  };
  fonts: {
    weight: {
      normal: number;
      medium: number;
      bold: number;
    };
  };
}

export const defaultTheme: Theme = {
  name: 'default',
  colors: {
    background: '#ffffff',
    surface: '#f9fafb',
    border: '#e5e7eb',
    text: '#111827',
    textSecondary: '#6b7280',
    primary: '#3b82f6',
    primaryText: '#ffffff',
    success: '#10b981',
    error: '#ef4444',
    warning: '#f59e0b',
    info: '#3b82f6',
    focus: '#3b82f6'
  },
  shadows: {
    sm: '0 2px 4px rgba(0,0,0,0.1)',
    md: '0 4px 12px rgba(0,0,0,0.15)',
    lg: '0 6px 20px rgba(0,0,0,0.2)'
  },
  borders: {
    width: '1px',
    radius: 8
  },
  fonts: {
    weight: {
      normal: 400,
      medium: 500,
      bold: 700
    }
  }
};

export const highContrastTheme: Theme = {
  name: 'high-contrast',
  colors: {
    background: '#000000',
    surface: '#000000',
    border: '#ffffff',
    text: '#ffffff',
    textSecondary: '#ffff00',
    primary: '#00ffff',
    primaryText: '#000000',
    success: '#00ff00',
    error: '#ff0000',
    warning: '#ffff00',
    info: '#00ffff',
    focus: '#ffff00'
  },
  shadows: {
    sm: '0 0 0 2px #ffffff',
    md: '0 0 0 3px #ffffff',
    lg: '0 0 0 4px #ffffff'
  },
  borders: {
    width: '2px',
    radius: 4
  },
  fonts: {
    weight: {
      normal: 500,
      medium: 600,
      bold: 800
    }
  }
};

/**
 * Get theme based on user preference or system settings
 */
export function getTheme(preferHighContrast?: boolean): Theme {
  if (preferHighContrast !== undefined) {
    return preferHighContrast ? highContrastTheme : defaultTheme;
  }
  
  // Check system preference
  if (typeof window !== 'undefined') {
    const mediaQuery = window.matchMedia('(prefers-contrast: high)');
    return mediaQuery.matches ? highContrastTheme : defaultTheme;
  }
  
  return defaultTheme;
}

/**
 * Apply theme to styles
 */
export function themed(theme: Theme) {
  return {
    container: {
      color: theme.colors.text,
      background: theme.colors.background,
      border: `${theme.borders.width} solid ${theme.colors.border}`,
      borderRadius: theme.borders.radius,
      boxShadow: theme.shadows.lg,
      fontWeight: theme.fonts.weight.normal
    },
    button: (variant: 'primary' | 'secondary' = 'secondary', active = false) => ({
      padding: '6px 12px',
      borderRadius: theme.borders.radius - 2,
      border: `${theme.borders.width} solid ${
        variant === 'primary' ? theme.colors.primary : theme.colors.border
      }`,
      background: variant === 'primary' 
        ? (active ? theme.colors.primary : theme.colors.primary)
        : (active ? theme.colors.surface : theme.colors.background),
      color: variant === 'primary'
        ? theme.colors.primaryText
        : theme.colors.text,
      fontWeight: active ? theme.fonts.weight.bold : theme.fonts.weight.medium,
      cursor: 'pointer',
      transition: 'all 0.2s',
      ':focus': {
        outline: `2px solid ${theme.colors.focus}`,
        outlineOffset: '2px'
      }
    }),
    input: {
      padding: '8px 12px',
      borderRadius: theme.borders.radius - 2,
      border: `${theme.borders.width} solid ${theme.colors.border}`,
      background: theme.colors.background,
      color: theme.colors.text,
      fontWeight: theme.fonts.weight.normal,
      ':focus': {
        outline: `2px solid ${theme.colors.focus}`,
        outlineOffset: '2px',
        borderColor: theme.colors.primary
      }
    },
    label: {
      color: theme.colors.textSecondary,
      fontWeight: theme.fonts.weight.medium
    },
    link: {
      color: theme.colors.primary,
      textDecoration: 'underline',
      fontWeight: theme.fonts.weight.medium,
      ':focus': {
        outline: `2px solid ${theme.colors.focus}`,
        outlineOffset: '2px'
      }
    },
    surface: {
      background: theme.colors.surface,
      border: `${theme.borders.width} solid ${theme.colors.border}`,
      borderRadius: theme.borders.radius - 2,
      padding: '8px'
    },
    success: {
      color: theme.colors.success,
      fontWeight: theme.fonts.weight.bold
    },
    error: {
      color: theme.colors.error,
      fontWeight: theme.fonts.weight.bold
    },
    warning: {
      color: theme.colors.warning,
      fontWeight: theme.fonts.weight.bold
    },
    info: {
      color: theme.colors.info,
      fontWeight: theme.fonts.weight.normal
    }
  };
}
