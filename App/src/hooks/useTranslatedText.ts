'use client';

import { useState, useEffect } from 'react';
import { useTranslation } from '@/contexts/TranslationContext';

/**
 * Hook to translate text with automatic state management
 * Usage: const translatedText = useTranslatedText('Hello World');
 */
export function useTranslatedText(text: string, sourceLocale?: string | null): string {
  const { translate, currentLanguage } = useTranslation();
  const [translated, setTranslated] = useState(text);

  useEffect(() => {
    if (!text) {
      setTranslated('');
      return;
    }

    // If language is English or same as source, use original
    if (currentLanguage === 'en' || currentLanguage === sourceLocale) {
      setTranslated(text);
      return;
    }

    // Translate the text
    translate(text, sourceLocale).then(setTranslated);
  }, [text, currentLanguage, sourceLocale, translate]);

  return translated;
}

/**
 * Hook to translate multiple texts at once
 */
export function useTranslatedTexts(
  texts: Record<string, string>,
  sourceLocale?: string | null
): Record<string, string> {
  const { translate, currentLanguage } = useTranslation();
  const [translated, setTranslated] = useState(texts);

  useEffect(() => {
    if (currentLanguage === 'en' || currentLanguage === sourceLocale) {
      setTranslated(texts);
      return;
    }

    // Translate all texts
    const translateAll = async () => {
      const translatedTexts: Record<string, string> = {};
      for (const [key, value] of Object.entries(texts)) {
        translatedTexts[key] = await translate(value, sourceLocale);
      }
      setTranslated(translatedTexts);
    };

    translateAll();
  }, [texts, currentLanguage, sourceLocale, translate]);

  return translated;
}

