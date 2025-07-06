import { generateChatTitleFlow } from '@/ai/flows/generate-chat-title-flow';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { messages, modelId, userApiKey } = body;

    if (!messages) {
      return NextResponse.json({ error: 'Messages are required' }, { status: 400 });
    }

    const { title } = await generateChatTitleFlow({ messages, modelId, userApiKey });

    return NextResponse.json({ title });
  } catch (error: any) {
    console.error('generate-chat-title API error:', error);
    return NextResponse.json({ error: error.message || 'Unknown error', stack: error?.stack }, { status: 500 });
  }
} 