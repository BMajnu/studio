import { getFirestore } from 'firebase-admin/firestore';
import { getAdminApp } from '@/lib/firebase/adminApp';
import type { UserProfile } from '@/lib/types';

export async function getUserProfileByUid(uid: string, opts?: { idToken?: string }): Promise<UserProfile | null> {
  // First try with Admin SDK (preferred)
  try {
    const db = getFirestore(getAdminApp() as any);
    const snap = await db.collection('userProfiles').doc(uid).get();
    if (snap.exists) {
      const data = snap.data() as any;
      const profile: UserProfile = {
        userId: uid,
        name: String(data?.name || ''),
        professionalTitle: data?.professionalTitle || undefined,
        yearsOfExperience: data?.yearsOfExperience || undefined,
        portfolioLink: data?.portfolioLink || undefined,
        communicationStyleNotes: data?.communicationStyleNotes || undefined,
        services: Array.isArray(data?.services) ? data.services : [],
        fiverrUsername: data?.fiverrUsername || undefined,
        geminiApiKeys: Array.isArray(data?.geminiApiKeys) ? data.geminiApiKeys : undefined,
        selectedGenkitModelId: data?.selectedGenkitModelId || undefined,
        customSellerFeedbackTemplate: data?.customSellerFeedbackTemplate || undefined,
        customClientFeedbackResponseTemplate: data?.customClientFeedbackResponseTemplate || undefined,
        rawPersonalStatement: data?.rawPersonalStatement || undefined,
        createdAt: data?.createdAt?.toDate ? data.createdAt.toDate().toISOString() : (data?.createdAt || undefined),
        updatedAt: data?.updatedAt?.toDate ? data.updatedAt.toDate().toISOString() : (data?.updatedAt || undefined),
        autoRotateGeminiKeys: data?.autoRotateGeminiKeys || undefined,
        thinkingMode: data?.thinkingMode || undefined,
      };
      return profile;
    }
  } catch (e) {
    // Continue to REST fallback below
    try { console.warn('[getUserProfileByUid] Admin SDK unavailable, trying REST fallback'); } catch {}
  }

  // REST fallback using the user's ID token (must be provided)
  const idToken = opts?.idToken;
  if (!idToken) return null;

  const projectId = process.env.FIREBASE_PROJECT_ID || extractProjectIdFromIdToken(idToken);
  if (!projectId) return null;

  try {
    const url = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/userProfiles/${encodeURIComponent(uid)}`;
    const res = await fetch(url, { headers: { Authorization: `Bearer ${idToken}` } as any });
    if (!res.ok) return null;
    const doc = await res.json();
    const f = (doc && doc.fields) || {};
    const readString = (node: any): string | undefined => (node && node.stringValue) || undefined;
    const readArrayOfStrings = (node: any): string[] | undefined => {
      const arr = node && node.arrayValue && Array.isArray(node.arrayValue.values) ? node.arrayValue.values : [];
      const out = arr.map((v: any) => v && v.stringValue).filter((s: any) => typeof s === 'string' && s.trim() !== '');
      return out.length ? out : undefined;
    };

    const profile: UserProfile = {
      userId: uid,
      name: readString(f.name) || '',
      professionalTitle: readString(f.professionalTitle),
      yearsOfExperience: undefined,
      portfolioLink: readString(f.portfolioLink),
      communicationStyleNotes: readString(f.communicationStyleNotes),
      services: [],
      fiverrUsername: readString(f.fiverrUsername),
      geminiApiKeys: readArrayOfStrings(f.geminiApiKeys),
      selectedGenkitModelId: readString(f.selectedGenkitModelId),
      customSellerFeedbackTemplate: readString(f.customSellerFeedbackTemplate),
      customClientFeedbackResponseTemplate: readString(f.customClientFeedbackResponseTemplate),
      rawPersonalStatement: readString(f.rawPersonalStatement),
      createdAt: undefined,
      updatedAt: undefined,
      autoRotateGeminiKeys: undefined,
      thinkingMode: (readString(f.thinkingMode) as any) || undefined,
    } as any;
    return profile;
  } catch (e) {
    try { console.warn('[getUserProfileByUid] REST fallback failed:', (e as any)?.message || e); } catch {}
    return null;
  }
}

function extractProjectIdFromIdToken(idToken: string | undefined): string | undefined {
  try {
    if (!idToken) return undefined;
    const parts = idToken.split('.');
    if (parts.length !== 3) return undefined;
    const b64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    let json: string;
    if (typeof atob === 'function') {
      // Edge/runtime with atob
      const padded = b64.padEnd(b64.length + (4 - (b64.length % 4)) % 4, '=');
      json = atob(padded);
    } else {
      // Node runtime
      json = Buffer.from(b64, 'base64').toString('utf8');
    }
    const payload = JSON.parse(json);
    const iss: string | undefined = payload?.iss;
    // iss example: https://securetoken.google.com/{projectId}
    if (iss && iss.includes('securetoken.google.com/')) {
      return iss.split('securetoken.google.com/')[1];
    }
    // Some tokens include aud equal to projectId
    const aud = payload?.aud;
    return typeof aud === 'string' ? aud : undefined;
  } catch {
    return undefined;
  }
}
