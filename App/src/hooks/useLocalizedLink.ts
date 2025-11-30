'use client';

import { useParams } from 'next/navigation';
import { useTranslation, SUPPORTED_LANGUAGES } from '@/contexts/TranslationContext';

/**
 * Hook to generate language-aware links
 * Usage: const href = useLocalizedLink('/home'); // Returns '/en/home' or '/hi/home' etc.
 */
export function useLocalizedLink(path: string): string {
  const params = useParams();
  const { currentLanguage } = useTranslation();
  
  // Get current language from route params or context
  const lang = (params?.lang as string) || currentLanguage || 'en';
  
  // Remove leading slash if present
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  
  // If path already includes language, return as is
  const firstSegment = cleanPath.split('/')[0];
  if (firstSegment === lang || SUPPORTED_LANGUAGES.some(l => l.code === firstSegment)) {
    return `/${cleanPath}`;
  }
  
  return `/${lang}/${cleanPath}`;
}

