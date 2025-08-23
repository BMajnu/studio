import { App, cert, getApps, initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';

let app: App | undefined;

export function getAdminApp(): App {
  if (!app) {
    const projectId = process.env.FIREBASE_PROJECT_ID;
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
    // Support escaped newlines in env (e.g., GitHub secrets)
    const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');

    if (getApps().length === 0) {
      if (projectId && clientEmail && privateKey) {
        app = initializeApp({
          credential: cert({ projectId, clientEmail, privateKey } as any),
        });
      } else {
        // Fallback to ADC (Application Default Credentials)
        app = initializeApp();
      }
    } else {
      app = getApps()[0]!;
    }
  }
  return app!;
}

export function getAdminAuth() {
  return getAuth(getAdminApp());
}
