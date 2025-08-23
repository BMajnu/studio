import { NextResponse } from 'next/server';
import { getUserIdFromRequest } from '@/lib/middleware/verifyFirebaseToken';
import { processCustomInstructionFlow } from '@/ai/flows/process-custom-instruction-flow';
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

    // Inputs
    let clientMessage: string = String(body?.clientMessage || body?.selection || '');
    let customInstruction: string = String(body?.customInstruction || body?.instruction || '');
    const templateId: string | undefined = body?.templateId || body?.promptId;
    const language: 'english'|'bengali'|'both' | undefined = body?.language;
    const chatHistory = Array.isArray(body?.chatHistory) ? body.chatHistory : undefined;
    const attachedFiles = Array.isArray(body?.attachedFiles) ? body.attachedFiles : undefined;
    const userName: string | undefined = body?.userName;
    const communicationStyleNotes: string | undefined = body?.communicationStyleNotes;
    const modelId: string | undefined = body?.modelId;
    const userApiKey: string | undefined = body?.userApiKey;

    // If templateId provided and instruction missing, fetch from Firestore
    if (!customInstruction && templateId) {
      const db = getFirestore(getAdminApp() as any);
      const doc = await db.collection('users').doc(uid).collection('prompts').doc(String(templateId)).get();
      if (doc.exists) {
        const data: any = doc.data() || {};
        customInstruction = String(data?.instruction || data?.prompt || data?.template || '');
      }
    }

    if (!clientMessage?.trim()) {
      return NextResponse.json({ ok: false, error: 'Missing clientMessage/selection' }, { status: 400, headers: corsHeaders });
    }
    if (!customInstruction?.trim()) {
      return NextResponse.json({ ok: false, error: 'Missing customInstruction or template' }, { status: 400, headers: corsHeaders });
    }

    const { title, response } = await processCustomInstructionFlow({
      clientMessage,
      customInstruction,
      language,
      chatHistory,
      attachedFiles,
      userName,
      communicationStyleNotes,
      modelId,
      userApiKey,
    });

    return NextResponse.json({ ok: true, endpoint: 'actions', uid, title, result: response }, { headers: corsHeaders });
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
