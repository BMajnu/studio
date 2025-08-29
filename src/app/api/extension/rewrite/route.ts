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
    const profile = uid ? await getUserProfileByUid(uid) : null;
    const mergedProfile = profile ? {
      ...profile,
      selectedGenkitModelId: modelId ?? profile.selectedGenkitModelId,
      geminiApiKeys: userApiKey ? [userApiKey] : profile.geminiApiKeys,
      name: userName || profile.name,
      communicationStyleNotes: communicationStyleNotes || profile.communicationStyleNotes,
    } : undefined;

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
    const detail = msg || (typeof err === 'string' ? err : JSON.stringify(err));
    return NextResponse.json({ ok: false, error: detail || 'unexpected error' }, { status: 500, headers: corsHeaders });
  }
}

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: corsHeaders });
}
