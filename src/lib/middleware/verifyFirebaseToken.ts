import { getAdminAuth } from '@/lib/firebase/adminApp';

export async function getUserIdFromRequest(req: Request): Promise<string> {
  const header = req.headers.get('authorization') || req.headers.get('Authorization');
  if (!header) throw new Error('UNAUTHORIZED: Missing Authorization header');

  const [scheme, token] = header.split(' ');
  if (scheme?.toLowerCase() !== 'bearer' || !token) {
    throw new Error('UNAUTHORIZED: Invalid Authorization format');
  }

  try {
    const decoded = await getAdminAuth().verifyIdToken(token);
    return decoded.uid;
  } catch (e: any) {
    throw new Error('UNAUTHORIZED: Invalid or expired token');
  }
}
