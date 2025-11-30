'use client';

import { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Globe, Check } from 'lucide-react';
import { useTranslation, SUPPORTED_LANGUAGES, LanguageCode } from '@/contexts/TranslationContext';
import { Button } from './button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './dropdown-menu';

interface LanguageSwitcherProps {
  variant?: 'default' | 'dark';
}

export function LanguageSwitcher({ variant = 'default' }: LanguageSwitcherProps) {
  const { currentLanguage, setLanguage } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const isDark = variant === 'dark';

  // Handle language change - update context AND route
  const handleLanguageChange = (lang: LanguageCode) => {
    setLanguage(lang);
    setIsOpen(false);
    
    // Update URL to reflect new language (if pathname includes a language segment)
    if (pathname) {
      const pathParts = pathname.split('/').filter(Boolean);
      if (pathParts.length > 0 && SUPPORTED_LANGUAGES.some(l => l.code === pathParts[0])) {
        // Replace the language segment in the URL
        pathParts[0] = lang;
        const newPath = '/' + pathParts.join('/');
        router.push(newPath);
      } else {
        // If no language in path, add it
        const newPath = `/${lang}${pathname}`;
        router.push(newPath);
      }
    }
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant={isDark ? "ghost" : "outline"}
          size="sm"
          className={`gap-2 ${isDark ? 'text-white hover:bg-white/10 border-white/20' : ''}`}
        >
          <Globe className="w-4 h-4" />
          <span className="hidden sm:inline">
            {SUPPORTED_LANGUAGES.find(l => l.code === currentLanguage)?.name || 'English'}
          </span>
          <span className="sm:hidden">
            {SUPPORTED_LANGUAGES.find(l => l.code === currentLanguage)?.flag || '🇺🇸'}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        {SUPPORTED_LANGUAGES.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => handleLanguageChange(lang.code as LanguageCode)}
            className="flex items-center justify-between cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <span>{lang.flag}</span>
              <span>{lang.name}</span>
            </div>
            {currentLanguage === lang.code && (
              <Check className="w-4 h-4 text-primary" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

