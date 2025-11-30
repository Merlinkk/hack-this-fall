import { NextRequest, NextResponse } from 'next/server';
import { LingoDotDevEngine } from 'lingo.dev/sdk';

// Initialize Lingo.dev engine (server-side only)
let lingoEngine: LingoDotDevEngine | null = null;

function getLingoEngine(): LingoDotDevEngine {
  if (!lingoEngine) {
    const apiKey = process.env.LINGODOTDEV_API_KEY || process.env.NEXT_PUBLIC_LINGODOTDEV_API_KEY;
    
    if (!apiKey) {
      throw new Error('LINGODOTDEV_API_KEY is not set. Please add it to your .env.local file.');
    }

    lingoEngine = new LingoDotDevEngine({
      apiKey,
      batchSize: 100,
      idealBatchItemSize: 1000,
    });
  }
  
  return lingoEngine;
}

/**
 * POST /api/translate
 * Translate a single text string
 */
export async function POST(request: NextRequest) {
  try {
    const { text, sourceLocale, targetLocale } = await request.json();

    console.log('🌐 [API] Translation request:', { text: text?.substring(0, 50), sourceLocale, targetLocale });

    if (!text || !targetLocale) {
      console.error('❌ [API] Missing required fields');
      return NextResponse.json(
        { error: 'text and targetLocale are required' },
        { status: 400 }
      );
    }

    const engine = getLingoEngine();
    console.log('✅ [API] Engine initialized, translating...');
    
    const result = await engine.localizeText(text, {
      sourceLocale: sourceLocale || null,
      targetLocale,
    });

    console.log('✅ [API] Translation result:', result?.substring(0, 50));
    return NextResponse.json({ success: true, translated: result });
  } catch (error: any) {
    console.error('❌ [API] Translation error:', error);
    console.error('❌ [API] Error details:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    });
    return NextResponse.json(
      { error: error.message || 'Translation failed', details: error.toString() },
      { status: 500 }
    );
  }
}

