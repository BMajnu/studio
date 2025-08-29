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

export const firebaseApp = app;
export const firebaseAuth = getAuth(app);
export const firebaseDb = getFirestore(app);
