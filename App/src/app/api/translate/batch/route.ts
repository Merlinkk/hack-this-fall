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
 * POST /api/translate/batch
 * Translate text to multiple languages
 */
export async function POST(request: NextRequest) {
  try {
    const { text, sourceLocale, targetLocales } = await request.json();

    if (!text || !targetLocales || !Array.isArray(targetLocales)) {
      return NextResponse.json(
        { error: 'text and targetLocales (array) are required' },
        { status: 400 }
      );
    }

    const engine = getLingoEngine();
    const results = await engine.batchLocalizeText(text, {
      sourceLocale: sourceLocale || null,
      targetLocales,
    });

    return NextResponse.json({ success: true, translated: results });
  } catch (error: any) {
    console.error('Batch translation error:', error);
    return NextResponse.json(
      { error: error.message || 'Batch translation failed' },
      { status: 500 }
    );
  }
}

