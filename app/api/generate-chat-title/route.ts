import { generateChatTitleFlow } from '@/ai/flows/generate-chat-title-flow';
import { NextRequest, NextResponse } from 'next/server';
import { AppError, classifyError } from '@/lib/errors';

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
    const appErr = error instanceof AppError ? error : classifyError(error);
    const status = appErr.status ?? 500;
    return NextResponse.json({ error: appErr.userMessage || appErr.message || 'Unknown error' }, { status });
  }
}