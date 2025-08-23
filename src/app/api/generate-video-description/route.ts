import { NextResponse } from 'next/server';
import { generateVideoDescription } from '@/ai/flows/generate-video-description-flow';
import type { GenerateVideoDescriptionInput } from '@/ai/flows/generate-video-description-flow';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const required = ['style', 'contentCategory', 'duration', 'aspectRatio', 'language'];
    const missing = required.filter((k) => body[k] === undefined || body[k] === null || body[k] === '');
    if (missing.length) {
      return NextResponse.json({ message: `Missing required fields: ${missing.join(', ')}` }, { status: 400 });
    }

    const input: GenerateVideoDescriptionInput = {
      style: String(body.style),
      contentCategory: String(body.contentCategory),
      duration: Number(body.duration),
      aspectRatio: String(body.aspectRatio),
      language: body.language as 'english' | 'bengali' | 'both',
      outputFormat: (body.outputFormat || 'normal') as 'normal' | 'json' | 'both',
      userName: body.userName ? String(body.userName) : undefined,
    };

    const result = await generateVideoDescription(input);
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error in generate-video-description API:', error);
    return NextResponse.json(
      { message: error instanceof Error ? error.message : 'Failed to generate video description' },
      { status: 500 }
    );
  }
}
