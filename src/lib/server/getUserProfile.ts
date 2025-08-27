import { getFirestore } from 'firebase-admin/firestore';
import { getAdminApp } from '@/lib/firebase/adminApp';
import type { UserProfile } from '@/lib/types';

export async function getUserProfileByUid(uid: string): Promise<UserProfile | null> {
  try {
    const db = getFirestore(getAdminApp() as any);
    const snap = await db.collection('userProfiles').doc(uid).get();
    if (!snap.exists) return null;
    const data = snap.data() as any;
    // Normalize to UserProfile shape (best-effort)
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
      useAlternativeAiImpl: data?.useAlternativeAiImpl || undefined,
      useFirebaseAI: data?.useFirebaseAI || undefined,
      customSellerFeedbackTemplate: data?.customSellerFeedbackTemplate || undefined,
      customClientFeedbackResponseTemplate: data?.customClientFeedbackResponseTemplate || undefined,
      rawPersonalStatement: data?.rawPersonalStatement || undefined,
      createdAt: data?.createdAt?.toDate ? data.createdAt.toDate().toISOString() : (data?.createdAt || undefined),
      updatedAt: data?.updatedAt?.toDate ? data.updatedAt.toDate().toISOString() : (data?.updatedAt || undefined),
      autoRotateGeminiKeys: data?.autoRotateGeminiKeys || undefined,
      thinkingMode: data?.thinkingMode || undefined,
    };
    return profile;
  } catch (e) {
    console.error('[getUserProfileByUid] error', e);
    return null;
  }
}
