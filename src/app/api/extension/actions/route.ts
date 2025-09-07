import { NextResponse } from 'next/server';
import { getUserIdFromRequest } from '@/lib/middleware/verifyFirebaseToken';
import { extensionAssistFlow } from '@/ai/flows/extension-assist-flow';
import { getFirestore } from 'firebase-admin/firestore';
import { getAdminApp } from '@/lib/firebase/adminApp';
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
    if (!uid) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401, headers: corsHeaders });
    }
    
    const body = await req.json().catch(() => ({}));

    // Inputs
    let clientMessage: string = String(body?.clientMessage || body?.selection || '');
    let customInstruction: string = String(body?.customInstruction || body?.instruction || '');
    const templateId: string | undefined = body?.templateId || body?.promptId;
    
    // Validation: Ensure we have either instruction or templateId
    if (!customInstruction && !templateId) {
      return NextResponse.json(
        { ok: false, error: 'Either customInstruction/instruction or templateId is required' }, 
        { status: 400, headers: corsHeaders }
      );
    }
    
    // Validation: Ensure clientMessage or selection is provided
    if (!clientMessage || clientMessage.trim().length === 0) {
      return NextResponse.json(
        { ok: false, error: 'clientMessage or selection is required' }, 
        { status: 400, headers: corsHeaders }
      );
    }
    
    // Validation: Enforce message length limits (max 10,000 characters)
    if (clientMessage.length > 10000) {
      return NextResponse.json(
        { ok: false, error: 'Message exceeds maximum length of 10,000 characters' }, 
        { status: 400, headers: corsHeaders }
      );
    }
    
    // Validation: Enforce instruction length limit (max 2,000 characters)
    if (customInstruction && customInstruction.length > 2000) {
      return NextResponse.json(
        { ok: false, error: 'Instruction exceeds maximum length of 2,000 characters' }, 
        { status: 400, headers: corsHeaders }
      );
    }
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

    // Map preset toolbar labels (e.g., "Rephrase it") to concrete instructions
    if (customInstruction && !templateId) {
      const label = String(customInstruction).trim().toLowerCase();
      const presets: Record<string, string> = {
        'rephrase it': 'Rephrase the text to be clearer and more natural while preserving meaning. Return only the rephrased text.',
        'add statistics': 'Augment the text with relevant, accurate statistics and data points with brief inline citations (e.g., source or year). Keep it concise. Return only the revised text.',
        'add details': 'Expand the text by adding concrete, helpful details and examples while preserving intent and structure. Return only the expanded text.',
        'add humor': 'Lightly add tasteful, inclusive humor without changing the meaning. Avoid sarcasm that may offend. Return only the revised text.',
        'make it polite': 'Rewrite the text to be more polite, respectful, and professional. Return only the revised text.',
        'remove jargon': 'Rewrite the text to remove technical jargon and use clear, plain language suitable for a general audience. Return only the simplified text.',
        'more informative': 'Make the text more informative by adding concise factual context, definitions, or key background where helpful. Return only the revised text.',
        // Fallback if Analyze is ever routed here
        'analyze': 'Analyze the text and provide a concise summary, key points, and recommendations for improvement. Return only the analysis in paragraph form.',
      };
      if (presets[label]) {
        customInstruction = presets[label];
      }
    }

    // Sanitize template-like tokens that can break prompt parsing
    const safeMessage = String(clientMessage)
      .replace(/\{\{[^]*?\}\}/g, (m) => `«${m.slice(2, -2)}»`)
      .replace(/\{\{/g, '{ {')
      .replace(/\}\}/g, '} }');

    // Load user profile to personalize outputs
    const profile = await getUserProfileByUid(uid, { idToken });
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
      mergedProfile = {
        userId: uid,
        selectedGenkitModelId: modelId,
        geminiApiKeys: [String(userApiKey)],
        name: userName,
        communicationStyleNotes,
      } as any;
    }
    try {
      const keyCount = Array.isArray(mergedProfile?.geminiApiKeys) ? mergedProfile.geminiApiKeys.length : 0;
      console.info('[actions] uid=%s model=%s hasUserKey=%s keys=%d', uid || 'none', modelId || 'default', Boolean(userApiKey), keyCount);
    } catch {}

    const { title, response } = await extensionAssistFlow({
      clientMessage: safeMessage,
      customInstruction,
      language,
      chatHistory,
      attachedFiles,
      profile: mergedProfile,
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
