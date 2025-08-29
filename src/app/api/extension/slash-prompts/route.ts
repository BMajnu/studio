import { NextResponse } from 'next/server';
import { getUserIdFromRequest } from '@/lib/middleware/verifyFirebaseToken';
import { getFirestore } from 'firebase-admin/firestore';
import { getAdminApp } from '@/lib/firebase/adminApp';

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
    const limit = Math.max(1, Math.min(100, Number(body?.limit ?? 50)));

    const db = getFirestore(getAdminApp() as any);
    const snap = await db
      .collection('users')
      .doc(uid)
      .collection('slashPrompts')
      .limit(limit)
      .get();

    const prompts = snap.docs
      .map((d) => {
        const data: any = d.data() || {};
        return { title: data?.title, prompt: data?.prompt } as any;
      })
      .filter((x: any) => typeof x.title === 'string' && typeof x.prompt === 'string')
      .map((x: any) => ({ title: String(x.title), prompt: String(x.prompt) }));

    return NextResponse.json({ ok: true, endpoint: 'slash-prompts', uid, prompts }, { headers: corsHeaders });
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
