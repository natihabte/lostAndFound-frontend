// Public Sector Design System
export const platformTheme = {
  // Academic Color Palette - WCAG AA Compliant
  colors: {
    // Primary Platform Colors
    primary: {
      50: '#f0f9ff',   // Very light blue
      100: '#e0f2fe',  // Light blue
      200: '#bae6fd',  // Lighter blue
      300: '#7dd3fc',  // Light blue
      400: '#38bdf8',  // Medium blue
      500: '#0ea5e9',  // Main platform blue
      600: '#0284c7',  // Darker blue
      700: '#0369a1',  // Dark blue
      800: '#075985',  // Very dark blue
      900: '#0c4a6e'   // Darkest blue
    },
    
    // Academic Grays - High Contrast
    gray: {
      50: '#f8fafc',   // Almost white
      100: '#f1f5f9',  // Very light gray
      200: '#e2e8f0',  // Light gray
      300: '#cbd5e1',  // Medium light gray
      400: '#94a3b8',  // Medium gray
      500: '#64748b',  // Dark gray
      600: '#475569',  // Darker gray
      700: '#334155',  // Very dark gray
      800: '#1e293b',  // Almost black
      900: '#0f172a'   // Black
    },
    
    // Semantic Colors - Accessible
    success: {
      50: '#f0fdf4',
      100: '#dcfce7',
      500: '#22c55e',  // WCAG AA compliant green
      600: '#16a34a',
      700: '#15803d'
    },
    
    warning: {
      50: '#fffbeb',
      100: '#fef3c7',
      500: '#f59e0b',  // WCAG AA compliant amber
      600: '#d97706',
      700: '#b45309'
    },
    
    error: {
      50: '#fef2f2',
      100: '#fee2e2',
      500: '#ef4444',  // WCAG AA compliant red
      600: '#dc2626',
      700: '#b91c1c'
    },
    
    // Academic Status Colors
    lost: {
      50: '#fef2f2',
      100: '#fee2e2',
      200: '#fecaca',
      500: '#ef4444',
      600: '#dc2626',
      700: '#b91c1c'
    },
    
    found: {
      50: '#f0fdf4',
      100: '#dcfce7',
      200: '#bbf7d0',
      500: '#22c55e',
      600: '#16a34a',
      700: '#15803d'
    }
  },
  
  // Academic Typography
  typography: {
    fontFamily: {
      sans: [
        'Inter', 
        '-apple-system', 
        'BlinkMacSystemFont', 
        'Segoe UI', 
        'Roboto', 
        'Helvetica Neue', 
        'Arial', 
        'sans-serif'
      ],
      display: [
        'Inter', 
        'system-ui', 
        'sans-serif'
      ]
    },
    
    fontSize: {
      xs: ['0.75rem', { lineHeight: '1rem' }],      // 12px
      sm: ['0.875rem', { lineHeight: '1.25rem' }],  // 14px
      base: ['1rem', { lineHeight: '1.5rem' }],     // 16px
      lg: ['1.125rem', { lineHeight: '1.75rem' }],  // 18px
      xl: ['1.25rem', { lineHeight: '1.75rem' }],   // 20px
      '2xl': ['1.5rem', { lineHeight: '2rem' }],    // 24px
      '3xl': ['1.875rem', { lineHeight: '2.25rem' }], // 30px
      '4xl': ['2.25rem', { lineHeight: '2.5rem' }],   // 36px
      '5xl': ['3rem', { lineHeight: '1' }]            // 48px
    },
    
    fontWeight: {
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700'
    }
  },
  
  // Academic Spacing System
  spacing: {
    px: '1px',
    0: '0',
    1: '0.25rem',   // 4px
    2: '0.5rem',    // 8px
    3: '0.75rem',   // 12px
    4: '1rem',      // 16px
    5: '1.25rem',   // 20px
    6: '1.5rem',    // 24px
    8: '2rem',      // 32px
    10: '2.5rem',   // 40px
    12: '3rem',     // 48px
    16: '4rem',     // 64px
    20: '5rem',     // 80px
    24: '6rem'      // 96px
  },
  
  // Academic Border Radius
  borderRadius: {
    none: '0',
    sm: '0.125rem',   // 2px
    md: '0.375rem',   // 6px
    lg: '0.5rem',     // 8px
    xl: '0.75rem',    // 12px
    '2xl': '1rem',    // 16px
    '3xl': '1.5rem',  // 24px
    full: '9999px'
  },
  
  // Academic Shadows
  boxShadow: {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
    xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
    '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
    none: '0 0 #0000'
  },
  
  // Breakpoints for Mobile-First Design
  screens: {
    sm: '640px',   // Small devices
    md: '768px',   // Medium devices
    lg: '1024px',  // Large devices
    xl: '1280px',  // Extra large devices
    '2xl': '1536px' // 2X large devices
  },
  
  // Academic Focus States
  focus: {
    ring: '2px solid rgb(59 130 246 / 0.5)',
    offset: '2px'
  }
};

// Accessibility Helpers
export const a11y = {
  // Screen Reader Only Text
  srOnly: {
    position: 'absolute',
    width: '1px',
    height: '1px',
    padding: '0',
    margin: '-1px',
    overflow: 'hidden',
    clip: 'rect(0, 0, 0, 0)',
    whiteSpace: 'nowrap',
    border: '0'
  },
  
  // Focus Visible Styles
  focusVisible: 'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
  
  // High Contrast Mode Support
  highContrast: '@media (prefers-contrast: high)',
  
  // Reduced Motion Support
  reducedMotion: '@media (prefers-reduced-motion: reduce)'
};

export default platformTheme;