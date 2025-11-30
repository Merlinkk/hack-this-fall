'use client';

/**
 * Example component showing how to use Lingo.dev translations
 * This demonstrates the different ways to translate content in your app
 */

import { useState } from 'react';
import { useTranslation } from '@/contexts/TranslationContext';
import { useTranslatedText } from '@/hooks/useTranslatedText';
import { LanguageSwitcher } from '@/components/ui/LanguageSwitcher';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export function TranslationExample() {
  const { translate, currentLanguage, setLanguage, autoDetect, setAutoDetect } = useTranslation();
  const [asyncTranslation, setAsyncTranslation] = useState<string>('');

  // Method 1: Using useTranslatedText hook (recommended for simple text)
  const welcomeText = useTranslatedText('Welcome to Nirogya AI');
  const descriptionText = useTranslatedText('Your agentic health guardian');

  // Method 2: Using translate function for async operations
  const handleAsyncTranslate = async () => {
    const translated = await translate('This is an async translation example');
    setAsyncTranslation(translated);
  };

  return (
    <div className="space-y-6 p-6">
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">Translation Examples</h2>
          <LanguageSwitcher />
        </div>

        <div className="space-y-4">
          {/* Example 1: Simple translated text */}
          <div>
            <h3 className="font-semibold mb-2">1. Simple Translation (useTranslatedText)</h3>
            <p className="text-lg">{welcomeText}</p>
            <p className="text-gray-600">{descriptionText}</p>
          </div>

          {/* Example 2: Async translation */}
          <div>
            <h3 className="font-semibold mb-2">2. Async Translation</h3>
            <Button onClick={handleAsyncTranslate} className="mb-2">
              Translate Async
            </Button>
            {asyncTranslation && <p className="text-gray-700">{asyncTranslation}</p>}
          </div>

          {/* Example 3: Current language info */}
          <div>
            <h3 className="font-semibold mb-2">3. Language Info</h3>
            <p>Current Language: <strong>{currentLanguage}</strong></p>
            <p>Auto-detect: <strong>{autoDetect ? 'Enabled' : 'Disabled'}</strong></p>
            <Button 
              onClick={() => setAutoDetect(!autoDetect)}
              variant="outline"
              size="sm"
              className="mt-2"
            >
              Toggle Auto-detect
            </Button>
          </div>

          {/* Example 4: Direct language switching */}
          <div>
            <h3 className="font-semibold mb-2">4. Quick Language Switch</h3>
            <div className="flex gap-2 flex-wrap">
              <Button onClick={() => setLanguage('en')} size="sm" variant="outline">
                English
              </Button>
              <Button onClick={() => setLanguage('hi')} size="sm" variant="outline">
                Hindi
              </Button>
              <Button onClick={() => setLanguage('mr')} size="sm" variant="outline">
                Marathi
              </Button>
              <Button onClick={() => setLanguage('ta')} size="sm" variant="outline">
                Tamil
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

