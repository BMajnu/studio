import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { FIREBASE_WEB_CONFIG } from './config';

// Use explicit client-side Firebase Web config bundled from config.ts
const firebaseConfig = FIREBASE_WEB_CONFIG;

let app: FirebaseApp;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0]!;
}

// Safe diagnostics (no secrets): helps verify project match with Admin
try {
  const rawKey = (firebaseConfig as any)?.apiKey || '';
  const maskedKey = rawKey ? `${rawKey.slice(0, 6)}...${rawKey.slice(-4)}` : '';
  const info = {
    projectId: (firebaseConfig as any)?.projectId,
    authDomain: (firebaseConfig as any)?.authDomain,
    apiKey: maskedKey,
  };
  console.info('[DesAInR][ext][firebase] initialized ' + JSON.stringify(info));
} catch {}

export const firebaseApp = app;
export const firebaseAuth = getAuth(app);
export const firebaseDb = getFirestore(app);
