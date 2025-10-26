// QIC Gamified Insurance App - Language Context
// Provides internationalization (i18n) state management

import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { i18n, t, setLanguage, getCurrentLanguage, isRTL, getSupportedLanguages, getLanguageName } from '@/lib/i18n';

// Simple language types
type Language = 'en' | 'ar';

// Language context state interface
interface LanguageState {
  currentLanguage: Language;
  isLoading: boolean;
  error: string | null;
}

// Language context state interface
interface LanguageContextState extends LanguageState {
  dispatch: React.Dispatch<LanguageAction>;
  changeLanguage: (language: Language) => void;
  getText: (key: string, params?: Record<string, any>) => string;
  isRTL: () => boolean;
  getSupportedLanguages: () => Language[];
  getLanguageName: (language: Language) => string;
}

// Language action types
type LanguageAction =
  | { type: 'SET_LANGUAGE'; payload: Language }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null };

// Language reducer
const languageReducer = (state: LanguageState, action: LanguageAction): LanguageState => {
  switch (action.type) {
    case 'SET_LANGUAGE':
      return {
        ...state,
        currentLanguage: action.payload,
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
const initialState: LanguageState = {
  currentLanguage: 'en',
  isLoading: false,
  error: null
};

// Create context
const LanguageContext = createContext<LanguageContextState | undefined>(undefined);

// Language provider component
interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(languageReducer, initialState);

  // Initialize language on mount
  useEffect(() => {
    const initializeLanguage = async () => {
      try {
        dispatch({ type: 'SET_LOADING', payload: true });
        
        // Get saved language from localStorage or default to English
        const savedLanguage = localStorage.getItem('qic-language') as Language || 'en';
        
        // Set language in i18n system
        setLanguage(savedLanguage);
        
        dispatch({ type: 'SET_LANGUAGE', payload: savedLanguage });
      } catch (error) {
        dispatch({ 
          type: 'SET_ERROR', 
          payload: error instanceof Error ? error.message : 'Failed to initialize language' 
        });
      }
    };

    initializeLanguage();
  }, []);

  // Context methods
  const changeLanguage = (language: Language) => {
    try {
      // Set language in i18n system
      setLanguage(language);
      
      // Save to localStorage
      localStorage.setItem('qic-language', language);
      
      // Update context state
      dispatch({ type: 'SET_LANGUAGE', payload: language });
    } catch (error) {
      dispatch({ 
        type: 'SET_ERROR', 
        payload: error instanceof Error ? error.message : 'Failed to change language' 
      });
    }
  };

  const getText = (key: string, params?: Record<string, any>): string => {
    return t(key, params);
  };

  const getSupportedLanguagesFn = (): Language[] => {
    return getSupportedLanguages() as Language[];
  };

  const getLanguageNameFn = (language: Language): string => {
    return getLanguageName(language);
  };

  const contextValue: LanguageContextState = {
    ...state,
    dispatch,
    changeLanguage,
    getText,
    isRTL,
    getSupportedLanguages: getSupportedLanguagesFn,
    getLanguageName: getLanguageNameFn
  };

  return (
    <LanguageContext.Provider value={contextValue}>
      {children}
    </LanguageContext.Provider>
  );
};

// Custom hook to use language context
export const useLanguage = (): LanguageContextState => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

// Custom hook for translation function
export const useTranslation = () => {
  const { getText, currentLanguage, isRTL } = useLanguage();
  return {
    t: getText,
    currentLanguage,
    isRTL: isRTL(),
    changeLanguage: useLanguage().changeLanguage
  };
};

// Custom hook for language switching
export const useLanguageSwitcher = () => {
  const { currentLanguage, changeLanguage, getSupportedLanguages, getLanguageName } = useLanguage();
  
  const switchLanguage = (language: Language) => {
    changeLanguage(language);
  };

  const getLanguageOptions = () => {
    return getSupportedLanguages().map(language => ({
      value: language,
      label: getLanguageName(language),
      isCurrent: language === currentLanguage
    }));
  };

  return {
    currentLanguage,
    switchLanguage,
    getLanguageOptions,
    supportedLanguages: getSupportedLanguages()
  };
};

// Utility functions
export const getLanguageFlag = (language: Language): string => {
  const flags: Record<Language, string> = {
    en: '🇺🇸',
    ar: '🇸🇦'
  };
  return flags[language] || '🌐';
};

export const getLanguageDirection = (language: Language): 'ltr' | 'rtl' => {
  return language === 'ar' ? 'rtl' : 'ltr';
};

export const formatNumber = (number: number, language: Language): string => {
  if (language === 'ar') {
    // Arabic-Indic numerals
    return number.toLocaleString('ar-SA');
  }
  return number.toLocaleString();
};

export const formatDate = (date: Date, language: Language): string => {
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  };

  if (language === 'ar') {
    return date.toLocaleDateString('ar-SA', options);
  }
  
  return date.toLocaleDateString('en-US', options);
};

export const formatCurrency = (amount: number, language: Language, currency: string = 'USD'): string => {
  if (language === 'ar') {
    return new Intl.NumberFormat('ar-SA', {
      style: 'currency',
      currency: currency
    }).format(amount);
  }
  
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency
  }).format(amount);
};

// HOC for components that need language context
export const withLanguage = <P extends object>(
  Component: React.ComponentType<P>
): React.FC<P> => {
  const WrappedComponent: React.FC<P> = (props) => {
    return (
      <LanguageProvider>
        <Component {...props} />
      </LanguageProvider>
    );
  };
  
  WrappedComponent.displayName = `withLanguage(${Component.displayName || Component.name})`;
  return WrappedComponent;
};

export default LanguageContext;
