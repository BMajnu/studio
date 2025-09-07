import { NextResponse } from 'next/server';
import { getUserIdFromRequest } from '@/lib/middleware/verifyFirebaseToken';
import { generateChatResponse } from '@/ai/flows/generate-chat-response-flow';
import { getUserProfileByUid } from '@/lib/server/getUserProfile';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export async function POST(req: Request) {
  try {
    const uid = await getUserIdFromRequest(req);
    const authHeader = req.headers.get('authorization') || req.headers.get('Authorization') || '';
    const tokenParts = authHeader.split(' ');
    const idToken = tokenParts?.length === 2 ? tokenParts[1] : undefined;
    const body = await req.json().catch(() => ({}));

    const message = String(body?.message ?? body?.userMessage ?? '');
    if (!message) {
      return NextResponse.json({ ok: false, error: 'Missing message' }, { status: 400, headers: corsHeaders });
    }

    const userName = String(body?.userName || 'Extension User');
    const modelId: string | undefined = body?.modelId ? String(body.modelId) : undefined;
    let userApiKey: string | undefined = body?.userApiKey ? String(body.userApiKey) : undefined;

    const chatHistory = Array.isArray(body?.chatHistory)
      ? (body.chatHistory as any[])
          .filter((m) => m && (m.role === 'user' || m.role === 'assistant') && typeof m.text === 'string')
          .map((m) => ({ role: m.role as 'user' | 'assistant', text: String(m.text) }))
      : undefined;

    // If no explicit userApiKey was provided by the extension, try to load it from the user's profile
    if (!userApiKey && uid) {
      try {
        const profile = await getUserProfileByUid(uid, { idToken });
        if (profile?.geminiApiKeys && profile.geminiApiKeys.length > 0) {
          userApiKey = profile.geminiApiKeys[0];
        }
      } catch {}
    }

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
