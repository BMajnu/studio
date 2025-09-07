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
    const selection = String(body?.selection ?? '');
    const task = String(body?.task ?? 'rewrite');
    const language: 'english'|'bengali'|'both' | undefined = body?.language;
    const chatHistory = Array.isArray(body?.chatHistory) ? body.chatHistory : undefined;
    const attachedFiles = Array.isArray(body?.attachedFiles) ? body.attachedFiles : undefined;
    const userName: string | undefined = body?.userName;
    const communicationStyleNotes: string | undefined = body?.communicationStyleNotes;
    const modelId: string | undefined = body?.modelId;
    const userApiKey: string | undefined = body?.userApiKey;

    if (!selection) {
      return NextResponse.json({ ok: false, error: 'selection is required' }, { status: 400, headers: corsHeaders });
    }

    // Map simple task types to clear rewriting instructions
    const instructionByTask: Record<string, string> = {
      rewrite: 'Rewrite the text to be clearer, more natural, and well-structured without changing meaning. Return only the rewritten text.',
      grammar: 'Fix grammar, punctuation, and awkward phrasing. Preserve meaning and style. Return only the corrected text.',
      clarify: 'Rewrite to improve clarity and readability while preserving the original meaning. Return only the revised text.',
      shorten: 'Make the text more concise while keeping key information. Return only the shortened text.',
      expand: 'Elaborate slightly to add helpful detail and context while preserving intent. Return only the expanded text.',
      tone: 'Rewrite the text in a professional, friendly tone while preserving meaning. Return only the revised text.',
    };

    const customInstruction = instructionByTask[task] ?? instructionByTask['rewrite'];

    // Sanitize any template-like tokens that can confuse the prompt parser
    const safeSelection = selection
      // Replace full {{...}} blocks with unicode guillemets to preserve content but avoid braces
      .replace(/\{\{[^]*?\}\}/g, (m) => `«${m.slice(2, -2)}»`)
      // Fallback: break remaining brace pairs
      .replace(/\{\{/g, '{ {')
      .replace(/\}\}/g, '} }');
    // Personalize with user profile
    const profile = uid ? await getUserProfileByUid(uid, { idToken }) : null;
    let mergedProfile: any | undefined = undefined;
    if (profile) {
      mergedProfile = {
        ...profile,
        selectedGenkitModelId: modelId ?? profile.selectedGenkitModelId,
        geminiApiKeys: userApiKey ? [String(userApiKey)] : profile.geminiApiKeys,
        name: userName || profile.name,
        communicationStyleNotes: communicationStyleNotes || profile.communicationStyleNotes,
      };
    } else if (userApiKey) {
      // No stored profile, but a user-provided key exists – construct a minimal profile stub
      mergedProfile = {
        userId: uid || 'anon',
        selectedGenkitModelId: modelId,
        geminiApiKeys: [String(userApiKey)],
        name: userName,
        communicationStyleNotes,
      } as any;
    }
    try {
      // Safe diagnostics without leaking secrets
      const keyCount = Array.isArray(mergedProfile?.geminiApiKeys) ? mergedProfile.geminiApiKeys.length : 0;
      console.info('[rewrite] uid=%s model=%s hasUserKey=%s keys=%d', uid || 'none', modelId || 'default', Boolean(userApiKey), keyCount);
    } catch {}

    const { response } = await extensionAssistFlow({
      clientMessage: safeSelection,
      customInstruction,
      language,
      chatHistory,
      attachedFiles,
      profile: mergedProfile,
    } as any);

    const result = String((response as any) ?? '');
    return NextResponse.json({ ok: true, endpoint: 'rewrite', uid, task, result }, { headers: corsHeaders });
  } catch (err: any) {
    const msg = String(err?.message || '');
    if (msg.startsWith('UNAUTHORIZED')) {
      return NextResponse.json({ ok: false, error: msg }, { status: 401, headers: corsHeaders });
    }
    // Detect AI exhaustion/quota conditions bubbled from flows or Gemini client
    const code = (err as any)?.code as string | undefined;
    const hintedStatus = Number((err as any)?.status) || undefined;
    const lower = msg.toLowerCase();
    const looksExhausted = code === 'AI_EXHAUSTED' || lower.includes('all gemini keys exhausted') || lower.includes('resource_exhausted') || lower.includes('unavailable') || lower.includes('overloaded') || lower.includes('429') || lower.includes('503');
    if (looksExhausted) {
      return NextResponse.json(
        { ok: false, error: 'AI capacity exhausted', code: code || 'AI_EXHAUSTED' },
        { status: hintedStatus || 503, headers: corsHeaders }
      );
    }
    const detail = msg || (typeof err === 'string' ? err : JSON.stringify(err));
    return NextResponse.json({ ok: false, error: detail || 'unexpected error' }, { status: hintedStatus || 500, headers: corsHeaders });
  }
}

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: corsHeaders });
}
