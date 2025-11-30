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
 * POST /api/translate/detect
 * Detect the language of a text string
 */
export async function POST(request: NextRequest) {
  try {
    const { text } = await request.json();

    if (!text) {
      return NextResponse.json(
        { error: 'text is required' },
        { status: 400 }
      );
    }

    const engine = getLingoEngine();
    const locale = await engine.recognizeLocale(text);

    return NextResponse.json({ success: true, locale });
  } catch (error: any) {
    console.error('Language detection error:', error);
    return NextResponse.json(
      { error: error.message || 'Language detection failed' },
      { status: 500 }
    );
  }
}

