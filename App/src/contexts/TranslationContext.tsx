'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { translateText, detectLanguage } from '@/lib/lingo';
import { getStorageItem, setStorageItem, STORAGE_KEYS } from '@/lib/storage';

// Supported languages
export const SUPPORTED_LANGUAGES = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'hi', name: 'Hindi', flag: '🇮🇳' },
  { code: 'mr', name: 'Marathi', flag: '🇮🇳' },
  { code: 'ta', name: 'Tamil', flag: '🇮🇳' },
  { code: 'te', name: 'Telugu', flag: '🇮🇳' },
  { code: 'bn', name: 'Bengali', flag: '🇮🇳' },
  { code: 'kn', name: 'Kannada', flag: '🇮🇳' },
  { code: 'gu', name: 'Gujarati', flag: '🇮🇳' },
  { code: 'or', name: 'Odia', flag: '🇮🇳' },
  { code: 'fr', name: 'French', flag: '🇫🇷' },
  { code: 'es', name: 'Spanish', flag: '🇪🇸' },
] as const;

export type LanguageCode = typeof SUPPORTED_LANGUAGES[number]['code'];

interface TranslationContextType {
  currentLanguage: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  translate: (text: string, sourceLocale?: string | null) => Promise<string>;
  t: (text: string, sourceLocale?: string | null) => Promise<string>;
  isTranslating: boolean;
  autoDetect: boolean;
  setAutoDetect: (enabled: boolean) => void;
}

const TranslationContext = createContext<TranslationContextType | undefined>(undefined);

const LANGUAGE_STORAGE_KEY = 'nirogya_language';
const AUTO_DETECT_STORAGE_KEY = 'nirogya_auto_detect';

export function TranslationProvider({ children }: { children: React.ReactNode }) {
  const [currentLanguage, setCurrentLanguageState] = useState<LanguageCode>('en');
  const [isTranslating, setIsTranslating] = useState(false);
  const [autoDetect, setAutoDetectState] = useState(false);
  const [translationCache, setTranslationCache] = useState<Map<string, string>>(new Map());

  // Load saved language preference
  useEffect(() => {
    const savedLang = getStorageItem<LanguageCode>(LANGUAGE_STORAGE_KEY);
    const savedAutoDetect = getStorageItem<boolean>(AUTO_DETECT_STORAGE_KEY);
    
    if (savedLang && SUPPORTED_LANGUAGES.some(l => l.code === savedLang)) {
      setCurrentLanguageState(savedLang);
    }
    
    if (savedAutoDetect !== null) {
      setAutoDetectState(savedAutoDetect);
    }
  }, []);

  const setLanguage = useCallback((lang: LanguageCode) => {
    console.log('🌍 [TRANSLATION] Changing language to:', lang);
    setCurrentLanguageState(lang);
    setStorageItem(LANGUAGE_STORAGE_KEY, lang);
    // Clear translation cache when language changes
    setTranslationCache(new Map());
  }, []);

  const setAutoDetect = useCallback((enabled: boolean) => {
    setAutoDetectState(enabled);
    setStorageItem(AUTO_DETECT_STORAGE_KEY, enabled);
  }, []);

  const translate = useCallback(async (
    text: string,
    sourceLocale?: string | null
  ): Promise<string> => {
    // If target language is English or same as source, return original
    if (currentLanguage === 'en' || currentLanguage === sourceLocale) {
      return text;
    }

    // Check cache
    const cacheKey = `${text}:${sourceLocale || 'auto'}:${currentLanguage}`;
    if (translationCache.has(cacheKey)) {
      console.log('📦 [TRANSLATION] Using cached translation for:', text);
      return translationCache.get(cacheKey)!;
    }

    console.log('🔄 [TRANSLATION] Translating:', text, 'to', currentLanguage);
    setIsTranslating(true);
    try {
      let source = sourceLocale;
      
      // Auto-detect if enabled and source not provided
      if (autoDetect && !source) {
        source = await detectLanguage(text);
        console.log('🔍 [TRANSLATION] Detected language:', source);
      }

      const translated = await translateText(text, source, currentLanguage);
      console.log('✅ [TRANSLATION] Translated:', text, '→', translated);
      
      // Cache the translation
      setTranslationCache(prev => {
        const newCache = new Map(prev);
        newCache.set(cacheKey, translated);
        return newCache;
      });
      
      return translated;
    } catch (error) {
      console.error('❌ [TRANSLATION] Translation failed:', error);
      return text; // Return original on error
    } finally {
      setIsTranslating(false);
    }
  }, [currentLanguage, autoDetect, translationCache]);

  // Alias for convenience
  const t = translate;

  return (
    <TranslationContext.Provider
      value={{
        currentLanguage,
        setLanguage,
        translate,
        t,
        isTranslating,
        autoDetect,
        setAutoDetect,
      }}
    >
      {children}
    </TranslationContext.Provider>
  );
}

export function useTranslation() {
  const context = useContext(TranslationContext);
  if (!context) {
    throw new Error('useTranslation must be used within TranslationProvider');
  }
  return context;
}

