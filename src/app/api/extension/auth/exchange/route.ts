import { NextResponse } from 'next/server';
import { getAdminAuth } from '@/lib/firebase/adminApp';

export const runtime = 'nodejs';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const idToken = body?.idToken as string | undefined;
    if (!idToken) {
      return NextResponse.json({ ok: false, error: 'idToken is required' }, { status: 400, headers: corsHeaders });
    }
    // Development mode: If Firebase Admin is not configured, use a simple passthrough
    const hasAdminCreds = !!(process.env.FIREBASE_CLIENT_EMAIL && process.env.FIREBASE_PRIVATE_KEY);
    if (!hasAdminCreds) {
      console.warn('Firebase Admin not configured - using development mode passthrough');
      return NextResponse.json(
        { ok: true, endpoint: 'auth/exchange', customToken: idToken, uid: 'dev-user' },
        { headers: corsHeaders }
      );
    }

    const decoded = await getAdminAuth().verifyIdToken(idToken);
    const uid = decoded.uid;
    const customToken = await getAdminAuth().createCustomToken(uid, { src: 'extension' });
    return NextResponse.json({ ok: true, endpoint: 'auth/exchange', customToken, uid }, { headers: corsHeaders });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err?.message || 'unexpected error' }, { status: 500, headers: corsHeaders });
  }
}

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: corsHeaders });
}
