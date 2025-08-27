import { NextResponse } from 'next/server';
import { getUserIdFromRequest } from '@/lib/middleware/verifyFirebaseToken';
import { generateChatResponse } from '@/ai/flows/generate-chat-response-flow';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export async function POST(req: Request) {
  try {
    const uid = await getUserIdFromRequest(req);
    const body = await req.json().catch(() => ({}));

    const message = String(body?.message ?? body?.userMessage ?? '');
    if (!message) {
      return NextResponse.json({ ok: false, error: 'Missing message' }, { status: 400, headers: corsHeaders });
    }

    const userName = String(body?.userName || 'Extension User');
    const modelId: string | undefined = body?.modelId ? String(body.modelId) : undefined;
    const userApiKey: string | undefined = body?.userApiKey ? String(body.userApiKey) : undefined;

    const chatHistory = Array.isArray(body?.chatHistory)
      ? (body.chatHistory as any[])
          .filter((m) => m && (m.role === 'user' || m.role === 'assistant') && typeof m.text === 'string')
          .map((m) => ({ role: m.role as 'user' | 'assistant', text: String(m.text) }))
      : undefined;

    const result = await generateChatResponse({
      userMessage: message,
      userName,
      chatHistory,
      modelId,
      userApiKey,
    });

    return NextResponse.json({ ok: true, endpoint: 'chat', uid, ...result }, { headers: corsHeaders });
  } catch (err: any) {
    const msg = String(err?.message || '');
    if (msg.startsWith('UNAUTHORIZED')) {
      return NextResponse.json({ ok: false, error: msg }, { status: 401, headers: corsHeaders });
    }
    return NextResponse.json({ ok: false, error: err?.message || 'unexpected error' }, { status: 500, headers: corsHeaders });
  }
}

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: corsHeaders });
}
