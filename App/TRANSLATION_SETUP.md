# Lingo.dev Translation Setup Guide

This app uses [Lingo.dev](https://lingo.dev/en/sdk/javascript) for real-time AI-powered translation to make the app multilingual.

## Setup

### 1. Environment Variable

Add your Lingo.dev API key to `.env.local`:

```bash
LINGODOTDEV_API_KEY=api_wxncbzlbezunag4uml1hcxv9
```

**Note:** The API key is used server-side only (in API routes), so you don't need the `NEXT_PUBLIC_` prefix. However, if you have `NEXT_PUBLIC_LINGODOTDEV_API_KEY` set, it will also work as a fallback.

### 2. Translation Provider

The `TranslationProvider` is already added to the root layout (`src/app/layout.tsx`), so translations are available throughout the app.

### 3. API Routes

Translation API routes are automatically created at:
- `POST /api/translate` - Translate single text
- `POST /api/translate/batch` - Translate to multiple languages
- `POST /api/translate/detect` - Detect language
- `POST /api/translate/object` - Translate objects

These routes handle the Lingo.dev SDK server-side, avoiding browser compatibility issues.

## Usage

### Basic Translation Hook

Use the `useTranslatedText` hook for simple text translation:

```tsx
import { useTranslatedText } from '@/hooks/useTranslatedText';

function MyComponent() {
  const title = useTranslatedText('Hello World');
  
  return <h1>{title}</h1>;
}
```

### Advanced Translation

Use the `useTranslation` hook for more control:

```tsx
import { useTranslation } from '@/contexts/TranslationContext';

function MyComponent() {
  const { translate, currentLanguage, setLanguage } = useTranslation();
  
  const handleClick = async () => {
    const translated = await translate('Hello World');
    console.log(translated);
  };
  
  return (
    <div>
      <p>Current language: {currentLanguage}</p>
      <button onClick={() => setLanguage('hi')}>Switch to Hindi</button>
    </div>
  );
}
```

### Language Switcher Component

Add the language switcher to any page:

```tsx
import { LanguageSwitcher } from '@/components/ui/LanguageSwitcher';

function MyPage() {
  return (
    <div>
      <LanguageSwitcher />
      {/* Your content */}
    </div>
  );
}
```

## Supported Languages

- English (en)
- Hindi (hi)
- Marathi (mr)
- Tamil (ta)
- Telugu (te)
- Bengali (bn)
- Kannada (kn)
- Gujarati (gu)
- Odia (or)
- French (fr)
- Spanish (es)

## Translation Features

### Automatic Caching
Translations are automatically cached to improve performance and reduce API calls.

### Language Persistence
The selected language is saved to localStorage and persists across sessions.

### Auto-Detection
Enable auto-detection to automatically detect the source language:

```tsx
const { setAutoDetect } = useTranslation();
setAutoDetect(true);
```

### Batch Translation
Translate multiple texts at once:

```tsx
import { batchTranslateText } from '@/lib/lingo';

const results = await batchTranslateText(
  'Hello World',
  'en',
  ['hi', 'mr', 'ta']
);
// Returns: ['नमस्ते दुनिया', 'नमस्कार जग', 'வணக்கம் உலகம்']
```

### Object Translation
Translate nested objects:

```tsx
import { translateObject } from '@/lib/lingo';

const obj = {
  greeting: 'Hello',
  farewell: 'Goodbye',
  message: 'Welcome'
};

const translated = await translateObject(obj, 'en', 'hi');
// Returns: { greeting: 'नमस्ते', farewell: 'अलविदा', message: 'स्वागत है' }
```

## Example: Translating a Page

See `src/app/[lang]/mediscan/page-translated.tsx` for a complete example of translating a page.

## API Reference

### Translation Functions

- `translateText(text, sourceLocale, targetLocale)` - Translate single text
- `translateObject(obj, sourceLocale, targetLocale)` - Translate object
- `batchTranslateText(text, sourceLocale, targetLocales)` - Translate to multiple languages
- `translateHtml(html, sourceLocale, targetLocale)` - Translate HTML
- `detectLanguage(text)` - Detect language

### Hooks

- `useTranslation()` - Main translation hook
- `useTranslatedText(text, sourceLocale?)` - Simple translation hook
- `useTranslatedTexts(texts, sourceLocale?)` - Multiple texts hook

## Troubleshooting

### API Key Not Found
Make sure `NEXT_PUBLIC_LINGODOTDEV_API_KEY` is set in `.env.local` and restart the dev server.

### Translations Not Working
1. Check browser console for errors
2. Verify API key is valid
3. Ensure TranslationProvider wraps your components

### Performance Issues
Translations are cached automatically. For large amounts of text, consider using batch translation or object translation.

## Resources

- [Lingo.dev JavaScript SDK Documentation](https://lingo.dev/en/sdk/javascript)
- [Lingo.dev Website](https://lingo.dev)

