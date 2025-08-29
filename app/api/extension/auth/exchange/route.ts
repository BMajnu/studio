import { NextRequest, NextResponse } from 'next/server';
import { getAdminAuth } from '@/lib/firebase/adminApp';

// CORS headers for extension
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: corsHeaders });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({} as any));
    const idToken = (body as any)?.idToken as string | undefined;
    if (!idToken) {
      return NextResponse.json({ ok: false, error: 'idToken is required' }, { status: 400, headers: corsHeaders });
    }

    // Development mode: If Firebase Admin is not configured, fail clearly
    if (!process.env.FIREBASE_CLIENT_EMAIL || !process.env.FIREBASE_PRIVATE_KEY) {
      console.error('[auth/exchange] Firebase Admin credentials are missing. Set FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, and FIREBASE_PRIVATE_KEY.');
      return NextResponse.json(
        {
          ok: false,
          error: 'Server not configured to mint Firebase custom tokens. Please set FIREBASE_* Admin credentials on the server.',
          devPassthrough: true,
        },
        { status: 500, headers: corsHeaders }
      );
    }

    // Lazy initialize admin only after confirming creds exist
    const adminAuth = getAdminAuth();
    const decodedToken = await adminAuth.verifyIdToken(idToken);
    const uid = decodedToken.uid;
    const customToken = await adminAuth.createCustomToken(uid, { src: 'extension' });
    return NextResponse.json({ ok: true, endpoint: 'auth/exchange', customToken, uid }, { headers: corsHeaders });
  } catch (error: any) {
    console.error('Token exchange error:', error);
    return NextResponse.json(
      { ok: false, error: error?.message || 'Failed to exchange token' },
      { status: 500, headers: corsHeaders }
    );
  }
}
