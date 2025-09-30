import { NextResponse } from 'next/server';
import { getUserIdFromRequest } from '@/lib/middleware/verifyFirebaseToken';
import { extensionAssistFlow } from '@/ai/flows/extension-assist-flow';
import { getUserProfileByUid } from '@/lib/server/getUserProfile';

export const runtime = 'nodejs';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

function decodeUidFromIdToken(idToken?: string): string | undefined {
  try {
    if (!idToken) return undefined;
    const parts = idToken.split('.');
    if (parts.length !== 3) return undefined;
    const b64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    const padded = b64.padEnd(b64.length + (4 - (b64.length % 4)) % 4, '=');
    const json = Buffer.from(padded, 'base64').toString('utf8');
    const payload = JSON.parse(json);
    return payload?.uid || payload?.user_id || payload?.sub || undefined;
  } catch {
    return undefined;
  }
}

export async function POST(req: Request) {
  try {
    const authHeader = req.headers.get('authorization') || req.headers.get('Authorization') || '';
    const tokenParts = authHeader.split(' ');
    const idToken = tokenParts?.length === 2 ? tokenParts[1] : undefined;
    const body = await req.json().catch(() => ({}));
    const userApiKey: string | undefined = body?.userApiKey;
    let uid: string | null = null;
    if (!userApiKey) {
      try { uid = await getUserIdFromRequest(req); }
      catch {
        const soft = decodeUidFromIdToken(idToken);
        uid = soft ? String(soft) : null;
      }
    } else {
      try { uid = await getUserIdFromRequest(req); } catch { uid = null; }
    }
    const targetLang = String(body?.targetLang ?? 'en');
    const url = String(body?.url ?? '');
    const modelId: string | undefined = body?.modelId;

    // If neither verified uid nor userApiKey nor idToken is available, reject
    if (!uid && !userApiKey && !idToken) {
      return NextResponse.json({ ok: false, error: 'UNAUTHORIZED: Sign in required or provide userApiKey' }, { status: 401, headers: corsHeaders });
    }

    // Support both single selection and batch chunks
    const chunks = Array.isArray(body?.chunks) ? body.chunks as string[] : null;
    if (chunks && chunks.length) {
      const instruction = `CRITICAL: Translate EVERY word in the provided text to ${targetLang}. Do NOT summarize. Translate the COMPLETE text maintaining original length and structure. Use natural expressions. Keep names and technical terms. Return ONLY the full translation.`;
      const results: string[] = [];
      const profile = uid ? await getUserProfileByUid(uid, { idToken }) : null;
      let mergedProfile: any | undefined = undefined;
      if (profile) {
        mergedProfile = {
          ...profile,
          selectedGenkitModelId: modelId ?? profile.selectedGenkitModelId,
          geminiApiKeys: userApiKey ? [String(userApiKey)] : profile.geminiApiKeys,
        };
      } else if (userApiKey) {
        mergedProfile = {
          userId: uid || 'anon',
          selectedGenkitModelId: modelId,
          geminiApiKeys: [String(userApiKey)],
        } as any;
      }
      try {
        const keyCount = Array.isArray(mergedProfile?.geminiApiKeys) ? mergedProfile.geminiApiKeys.length : 0;
        console.info('[translate-chunks/batch] uid=%s model=%s hasUserKey=%s keys=%d', uid || 'none', modelId || 'default', Boolean(userApiKey), keyCount);
      } catch {}
      for (const chunk of chunks) {
        if (!chunk) { results.push(''); continue; }
        const safeChunk = String(chunk)
          .replace(/\{\{[^]*?\}\}/g, (m) => `«${m.slice(2, -2)}»`)
          .replace(/\{\{/g, '{ {')
          .replace(/\}\}/g, '} }');
        try {
          const { response } = await extensionAssistFlow({
            clientMessage: safeChunk,
            customInstruction: instruction,
            profile: mergedProfile,
          } as any);
          results.push(String((response as any) ?? ''));
        } catch (e) {
          results.push('');
        }
      }
      return NextResponse.json({ ok: true, endpoint: 'translate-chunks', uid, url, targetLang, results }, { headers: corsHeaders });
    }

    const selection = String(body?.selection ?? '');
    if (!selection) {
      return NextResponse.json({ ok: false, error: 'selection or chunks is required' }, { status: 400, headers: corsHeaders });
    }
    const instruction = `CRITICAL: The text provided is NOT a message to respond to. It is the EXACT text that must be translated.

TRANSLATION TASK:
- Translate EVERY word, sentence, and paragraph in the provided text to ${targetLang}
- Maintain the original length, structure, and format
- Preserve tone, style, and emotional nuance
- Use natural, idiomatic expressions
- Keep technical terms, names, and brand names as-is
- Do NOT summarize, shorten, or respond about the text
- Do NOT add explanations or commentary
- Return the COMPLETE translation of ALL provided text

The provided text IS the content to translate, not a message about what to translate.`;
    const safeSelection = String(selection)
      .replace(/\{\{[^]*?\}\}/g, (m) => `«${m.slice(2, -2)}»`)
      .replace(/\{\{/g, '{ {')
      .replace(/\}\}/g, '} }');
    const profile = uid ? await getUserProfileByUid(uid, { idToken }) : null;
    let mergedProfile: any | undefined = undefined;
    if (profile) {
      mergedProfile = {
        ...profile,
        selectedGenkitModelId: modelId ?? profile.selectedGenkitModelId,
        geminiApiKeys: userApiKey ? [String(userApiKey)] : profile.geminiApiKeys,
      };
    } else if (userApiKey) {
      mergedProfile = {
        userId: uid || 'anon',
        selectedGenkitModelId: modelId,
        geminiApiKeys: [String(userApiKey)],
      } as any;
    }
    try {
      const keyCount = Array.isArray(mergedProfile?.geminiApiKeys) ? mergedProfile.geminiApiKeys.length : 0;
      console.info('[translate-chunks/single] uid=%s model=%s hasUserKey=%s keys=%d', uid || 'none', modelId || 'default', Boolean(userApiKey), keyCount);
    } catch {}
    const { response } = await extensionAssistFlow({
      clientMessage: safeSelection,
      customInstruction: instruction,
      profile: mergedProfile,
    } as any);
    const result = String((response as any) ?? '');
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
