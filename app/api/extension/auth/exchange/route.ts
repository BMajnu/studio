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

    // Initialize Admin (explicit FIREBASE_* creds or ADC via GOOGLE_APPLICATION_CREDENTIALS)
    // Any credential issues will throw and be handled in the catch block below.
    const adminAuth = getAdminAuth();
    const decodedToken = await adminAuth.verifyIdToken(idToken);
    const uid = decodedToken.uid;
    const adminProjectId =
      process.env.FIREBASE_PROJECT_ID ||
      process.env.GOOGLE_CLOUD_PROJECT ||
      process.env.GCLOUD_PROJECT ||
      'unknown';
    const initMode = (process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_CLIENT_EMAIL && process.env.FIREBASE_PRIVATE_KEY) ? 'service' : 'adc';
    const iss = decodedToken.iss;
    const aud = decodedToken.aud as string | undefined;
    // Safe server-side diagnostics (no secrets)
    console.info('[DesAInR][exchange] verifyIdToken OK', { uid, adminProjectId, iss, aud });

    const customToken = await adminAuth.createCustomToken(uid, { src: 'extension' });
    // Decode custom token header/payload for diagnostics (no secrets exposed)
    let customTokenInfo: any = undefined;
    try {
      const [h, p] = customToken.split('.') as [string, string];
      const header = JSON.parse(Buffer.from(h, 'base64').toString('utf8'));
      const payload = JSON.parse(Buffer.from(p, 'base64').toString('utf8'));
      customTokenInfo = {
        header: { alg: header?.alg, kid: header?.kid, typ: header?.typ },
        payload: { iss: payload?.iss, sub: payload?.sub, aud: payload?.aud, iat: payload?.iat, exp: payload?.exp, uid: payload?.uid },
      };
    } catch {}
    // Optional: fetch API key project config to ensure API key -> project mapping
    let apiKeyProjectNumber: string | undefined;
    let apiKeyAuthorizedDomains: string[] | undefined;
    const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY || process.env.FIREBASE_WEB_API_KEY;
    if (apiKey) {
      try {
        const resp = await fetch(`https://www.googleapis.com/identitytoolkit/v3/relyingparty/getProjectConfig?key=${apiKey}`);
        if (resp.ok) {
          const cfg = await resp.json();
          apiKeyProjectNumber = cfg?.projectId;
          apiKeyAuthorizedDomains = cfg?.authorizedDomains;
        }
      } catch {}
    }
    console.info('[DesAInR][exchange] createCustomToken OK', { uid, adminProjectId });
    return NextResponse.json({ ok: true, endpoint: 'auth/exchange', customToken, uid, diagnostics: { adminProjectId, initMode, iss, aud, customTokenInfo, apiKeyProjectNumber, apiKeyAuthorizedDomains } }, { headers: corsHeaders });
  } catch (error: any) {
    const code = error?.code || error?.errorInfo?.code || 'internal';
    const adminProjectId =
      process.env.FIREBASE_PROJECT_ID ||
      process.env.GOOGLE_CLOUD_PROJECT ||
      process.env.GCLOUD_PROJECT ||
      'unknown';
    const initMode = (process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_CLIENT_EMAIL && process.env.FIREBASE_PRIVATE_KEY) ? 'service' : 'adc';
    console.error('[DesAInR][exchange] Token exchange error:', { code, message: error?.message, adminProjectId, initMode });
    return NextResponse.json(
      { ok: false, error: error?.message || 'Failed to exchange token', code, diagnostics: { adminProjectId, initMode } },
      { status: 500, headers: corsHeaders }
    );
  }
}
