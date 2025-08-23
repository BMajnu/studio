import { NextResponse } from 'next/server';
import { getUserIdFromRequest } from '@/lib/middleware/verifyFirebaseToken';

export const runtime = 'nodejs';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export async function POST(req: Request) {
  try {
    const uid = await getUserIdFromRequest(req);
    const body = await req.json().catch(() => ({}));
    const targetLang = String(body?.targetLang ?? 'en');
    const url = String(body?.url ?? '');

    // Support both single selection and batch chunks
    const chunks = Array.isArray(body?.chunks) ? body.chunks as string[] : null;
    if (chunks && chunks.length) {
      // Stub: echo each chunk; shape matches batch mode
      const results = chunks.map((c) => String(c));
      return NextResponse.json({ ok: true, endpoint: 'translate-chunks', uid, url, targetLang, results }, { headers: corsHeaders });
    }

    const selection = String(body?.selection ?? '');
    const result = selection; // stub
    return NextResponse.json({ ok: true, endpoint: 'translate-chunks', uid, url, targetLang, result }, { headers: corsHeaders });
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
