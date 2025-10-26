// QIC Gamified Insurance App - Theme Context
// Provides theme state management (light/dark mode)

import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import type { ThemeState } from '@/types';

// Define Theme enum locally to avoid import issues
export enum Theme {
  LIGHT = 'light',
  DARK = 'dark'
}

// Theme context state interface
interface ThemeContextState {
  currentTheme: Theme;
  isLoading: boolean;
  error: string | null;
  dispatch: React.Dispatch<ThemeAction>;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
  isDark: boolean;
  isLight: boolean;
}

// Theme action types
type ThemeAction =
  | { type: 'SET_THEME'; payload: Theme }
  | { type: 'TOGGLE_THEME' }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null };

// Theme reducer
const themeReducer = (state: { currentTheme: Theme; isLoading: boolean; error: string | null }, action: ThemeAction) => {
  switch (action.type) {
    case 'SET_THEME':
      return {
        ...state,
        currentTheme: action.payload,
        isLoading: false,
        error: null
      };
    
    case 'TOGGLE_THEME':
      const newTheme = state.currentTheme === Theme.LIGHT ? Theme.DARK : Theme.LIGHT;
      return {
        ...state,
        currentTheme: newTheme,
        isLoading: false,
        error: null
      };
    
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload
      };
    
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
        isLoading: false
      };
    
    default:
      return state;
  }
};

// Initial state
const initialState = {
  currentTheme: Theme.LIGHT,
  isLoading: false,
  error: null
};

// Create context
const ThemeContext = createContext<ThemeContextState | undefined>(undefined);

// Theme provider component
interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(themeReducer, initialState);

  // Initialize theme on mount
  useEffect(() => {
    const initializeTheme = async () => {
      try {
        dispatch({ type: 'SET_LOADING', payload: true });
        
        // Get saved theme from localStorage or default to light
        const savedTheme = localStorage.getItem('qic-theme') as Theme || Theme.LIGHT;
        
        // Apply theme to document
        applyTheme(savedTheme);
        
        dispatch({ type: 'SET_THEME', payload: savedTheme });
      } catch (error) {
        dispatch({ 
          type: 'SET_ERROR', 
          payload: error instanceof Error ? error.message : 'Failed to initialize theme' 
        });
      }
    };

    initializeTheme();
  }, []);

  // Apply theme to document
  const applyTheme = (theme: Theme) => {
    const root = document.documentElement;
    
    if (theme === Theme.DARK) {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.add('light');
      root.classList.remove('dark');
    }
    
    // Set theme attribute for CSS
    root.setAttribute('data-theme', theme);
  };

  // Context methods
  const setTheme = (theme: Theme) => {
    try {
      // Apply theme to document
      applyTheme(theme);
      
      // Save to localStorage
      localStorage.setItem('qic-theme', theme);
      
      // Update context state
      dispatch({ type: 'SET_THEME', payload: theme });
    } catch (error) {
      dispatch({ 
        type: 'SET_ERROR', 
        payload: error instanceof Error ? error.message : 'Failed to set theme' 
      });
    }
  };

  const toggleTheme = () => {
    try {
      const newTheme = state.currentTheme === Theme.LIGHT ? Theme.DARK : Theme.LIGHT;
      setTheme(newTheme);
    } catch (error) {
      dispatch({ 
        type: 'SET_ERROR', 
        payload: error instanceof Error ? error.message : 'Failed to toggle theme' 
      });
    }
  };

  const isDark = state.currentTheme === Theme.DARK;
  const isLight = state.currentTheme === Theme.LIGHT;

  const contextValue: ThemeContextState = {
    ...state,
    dispatch,
    toggleTheme,
    setTheme,
    isDark,
    isLight
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};

// Custom hook to use theme context
export const useTheme = (): ThemeContextState => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

// Custom hook for theme switching
export const useThemeSwitcher = () => {
  const { currentTheme, toggleTheme, setTheme, isDark, isLight } = useTheme();
  
  return {
    currentTheme,
    toggleTheme,
    setTheme,
    isDark,
    isLight,
    themeIcon: isDark ? '☀️' : '🌙',
    themeLabel: isDark ? 'Light Mode' : 'Dark Mode'
  };
};

// Custom hook for theme-aware styling
export const useThemeStyles = () => {
  const { isDark, isLight } = useTheme();
  
  return {
    isDark,
    isLight,
    backgroundColor: isDark ? 'hsl(var(--background))' : 'hsl(var(--background))',
    textColor: isDark ? 'hsl(var(--foreground))' : 'hsl(var(--foreground))',
    cardBackground: isDark ? 'hsl(var(--card))' : 'hsl(var(--card))',
    borderColor: isDark ? 'hsl(var(--border))' : 'hsl(var(--border))',
    primaryColor: isDark ? 'hsl(var(--qic-primary))' : 'hsl(var(--qic-primary))',
    secondaryColor: isDark ? 'hsl(var(--qic-secondary))' : 'hsl(var(--qic-secondary))',
    accentColor: isDark ? 'hsl(var(--qic-accent))' : 'hsl(var(--qic-accent))'
  };
};

// Utility functions
export const getThemeIcon = (theme: Theme): string => {
  return theme === Theme.DARK ? '☀️' : '🌙';
};

export const getThemeLabel = (theme: Theme): string => {
  return theme === Theme.DARK ? 'Light Mode' : 'Dark Mode';
};

export const getThemeColors = (theme: Theme) => {
  if (theme === Theme.DARK) {
    return {
      background: 'hsl(var(--background))',
      foreground: 'hsl(var(--foreground))',
      card: 'hsl(var(--card))',
      border: 'hsl(var(--border))',
      primary: 'hsl(var(--qic-primary))',
      secondary: 'hsl(var(--qic-secondary))',
      accent: 'hsl(var(--qic-accent))'
    };
  }
  
  return {
    background: 'hsl(var(--background))',
    foreground: 'hsl(var(--foreground))',
    card: 'hsl(var(--card))',
    border: 'hsl(var(--border))',
    primary: 'hsl(var(--qic-primary))',
    secondary: 'hsl(var(--qic-secondary))',
    accent: 'hsl(var(--qic-accent))'
  };
};

// HOC for components that need theme context
export const withTheme = <P extends object>(
  Component: React.ComponentType<P>
): React.FC<P> => {
  const WrappedComponent: React.FC<P> = (props) => {
    return (
      <ThemeProvider>
        <Component {...props} />
      </ThemeProvider>
    );
  };
  
  WrappedComponent.displayName = `withTheme(${Component.displayName || Component.name})`;
  return WrappedComponent;
};

// Theme toggle button component
export const ThemeToggleButton: React.FC<{
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'outline' | 'ghost';
}> = ({ className = '', size = 'md', variant = 'default' }) => {
  const { toggleTheme, isDark } = useTheme();
  
  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-12 w-12'
  };
  
  const variantClasses = {
    default: 'bg-primary text-primary-foreground hover:bg-primary/90',
    outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
    ghost: 'hover:bg-accent hover:text-accent-foreground'
  };
  
  return (
    <button
      onClick={toggleTheme}
      className={`
        ${sizeClasses[size]}
        ${variantClasses[variant]}
        inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2
        disabled:pointer-events-none disabled:opacity-50
        ${className}
      `}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {isDark ? '☀️' : '🌙'}
    </button>
  );
};

export default ThemeContext;
