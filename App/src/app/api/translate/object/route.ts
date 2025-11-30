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
 * POST /api/translate/object
 * Translate an object with nested strings
 */
export async function POST(request: NextRequest) {
  try {
    const { object, sourceLocale, targetLocale } = await request.json();

    if (!object || !targetLocale) {
      return NextResponse.json(
        { error: 'object and targetLocale are required' },
        { status: 400 }
      );
    }

    const engine = getLingoEngine();
    const result = await engine.localizeObject(object, {
      sourceLocale: sourceLocale || null,
      targetLocale,
    });

    return NextResponse.json({ success: true, translated: result });
  } catch (error: any) {
    console.error('Object translation error:', error);
    return NextResponse.json(
      { error: error.message || 'Object translation failed' },
      { status: 500 }
    );
  }
}

