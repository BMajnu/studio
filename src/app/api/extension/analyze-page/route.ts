import { NextResponse } from 'next/server';
import { getUserIdFromRequest } from '@/lib/middleware/verifyFirebaseToken';
import { analyzeWebpageFlow } from '@/lib/analyze/analyze-webpage-flow';

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
    const url = String(body?.url ?? '');
    const title = String(body?.title ?? 'Untitled');
    const result = await analyzeWebpageFlow(url);
    const summary = result.summary || `Analyzed page: ${title}`;
    const keyPoints = Array.isArray(result.keyPoints) ? result.keyPoints : [];
    const links = Array.isArray(result.links) ? result.links : [];
    return NextResponse.json({ ok: true, endpoint: 'analyze-page', uid, summary, keyPoints, links }, { headers: corsHeaders });
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
