/**
 * Lingo.dev Translation Service (Client-side)
 * Provides real-time AI-powered translation using Lingo.dev SDK via API routes
 * Reference: https://lingo.dev/en/sdk/javascript
 * 
 * Note: The SDK is used server-side only. This client wrapper calls API routes.
 */

/**
 * Translate a single text string
 */
export async function translateText(
  text: string,
  sourceLocale: string | null,
  targetLocale: string
): Promise<string> {
  try {
    console.log('📡 [LINGO] Calling translation API:', { text: text.substring(0, 50), sourceLocale, targetLocale });
    
    const response = await fetch('/api/translate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text,
        sourceLocale,
        targetLocale,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: response.statusText }));
      console.error('❌ [LINGO] API error:', errorData);
      throw new Error(`Translation failed: ${errorData.error || response.statusText}`);
    }

    const data = await response.json();
    console.log('✅ [LINGO] Translation response:', data);
    return data.translated || text;
  } catch (error) {
    console.error('❌ [LINGO] Translation error:', error);
    // Return original text on error
    return text;
  }
}

/**
 * Translate an object with nested strings
 */
export async function translateObject<T extends Record<string, any>>(
  obj: T,
  sourceLocale: string | null,
  targetLocale: string
): Promise<T> {
  try {
    const response = await fetch('/api/translate/object', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        object: obj,
        sourceLocale,
        targetLocale,
      }),
    });

    if (!response.ok) {
      throw new Error(`Object translation failed: ${response.statusText}`);
    }

    const data = await response.json();
    return (data.translated || obj) as T;
  } catch (error) {
    console.error('Translation error:', error);
    return obj;
  }
}

/**
 * Translate multiple texts to multiple languages
 */
export async function batchTranslateText(
  text: string,
  sourceLocale: string | null,
  targetLocales: string[]
): Promise<string[]> {
  try {
    const response = await fetch('/api/translate/batch', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text,
        sourceLocale,
        targetLocales,
      }),
    });

    if (!response.ok) {
      throw new Error(`Batch translation failed: ${response.statusText}`);
    }

    const data = await response.json();
    return data.translated || targetLocales.map(() => text);
  } catch (error) {
    console.error('Batch translation error:', error);
    return targetLocales.map(() => text);
  }
}

/**
 * Translate HTML content while preserving markup
 * Note: HTML translation is not yet implemented in API routes
 * This is a placeholder for future implementation
 */
export async function translateHtml(
  html: string,
  sourceLocale: string | null,
  targetLocale: string
): Promise<string> {
  // For now, translate as plain text
  // TODO: Implement HTML translation API route
  try {
    return await translateText(html, sourceLocale, targetLocale);
  } catch (error) {
    console.error('HTML translation error:', error);
    return html;
  }
}

/**
 * Detect the language of a text string
 */
export async function detectLanguage(text: string): Promise<string> {
  try {
    const response = await fetch('/api/translate/detect', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text }),
    });

    if (!response.ok) {
      throw new Error(`Language detection failed: ${response.statusText}`);
    }

    const data = await response.json();
    return data.locale || 'en';
  } catch (error) {
    console.error('Language detection error:', error);
    return 'en'; // Default to English
  }
}

/**
 * Translate with progress tracking
 * Note: Progress tracking is not yet implemented in API routes
 * This is a simplified version without progress callbacks
 */
export async function translateWithProgress<T extends Record<string, any>>(
  obj: T,
  sourceLocale: string | null,
  targetLocale: string,
  onProgress?: (progress: number) => void
): Promise<T> {
  // Call progress callback at start and end
  if (onProgress) {
    onProgress(0);
  }
  
  try {
    const result = await translateObject(obj, sourceLocale, targetLocale);
    
    if (onProgress) {
      onProgress(100);
    }
    
    return result;
  } catch (error) {
    console.error('Translation error:', error);
    if (onProgress) {
      onProgress(100);
    }
    return obj;
  }
}

