// Simple internal translation system - no external dependencies
import en from '../locales/en.json';
import ar from '../locales/ar.json';

type TranslationKey = keyof typeof en;
type Language = 'en' | 'ar';

// Simple translation store
let currentLanguage: Language = 'en';
const translations = { en, ar };

// Translation function
export const t = (key: TranslationKey, params?: Record<string, any>): string => {
  const translation = translations[currentLanguage]?.[key] || translations.en[key] || key;
  
  if (params) {
    return translation.replace(/\{\{(\w+)\}\}/g, (match, paramKey) => {
      return params[paramKey] || match;
    });
  }
  
  return translation;
};

// Language management
export const setLanguage = (language: Language): void => {
  currentLanguage = language;
  // Trigger a re-render by dispatching a custom event
  window.dispatchEvent(new CustomEvent('languageChanged', { detail: { language } }));
};

export const getCurrentLanguage = (): Language => currentLanguage;

export const isRTL = (): boolean => {
  return currentLanguage === 'ar';
};

// Export the i18n instance for compatibility
export const i18n = {
  t,
  changeLanguage: setLanguage,
  language: currentLanguage,
};

// Helpers for supported languages and display names
export const getSupportedLanguages = (): Language[] => {
  return ['en', 'ar'];
};

export const getLanguageName = (language: Language): string => {
  const map: Record<Language, string> = {
    en: 'English',
    ar: 'Arabic',
  };
  return map[language] || language;
};

export default i18n;