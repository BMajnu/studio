import { NextResponse } from 'next/server';
import { getUserIdFromRequest } from '@/lib/middleware/verifyFirebaseToken';
import { extensionAssistFlow } from '@/ai/flows/extension-assist-flow';
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
    const targetLang = String(body?.targetLang ?? 'en');
    const url = String(body?.url ?? '');
    const modelId: string | undefined = body?.modelId;
    const userApiKey: string | undefined = body?.userApiKey;

    // Support both single selection and batch chunks
    const chunks = Array.isArray(body?.chunks) ? body.chunks as string[] : null;
    if (chunks && chunks.length) {
      const instruction = `Translate the following text into ${targetLang}. Return only the translation, no comments.`;
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
    const instruction = `Translate the following text into ${targetLang}. Return only the translation, no comments.`;
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
