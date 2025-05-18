
import { initializeApp, getApps, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';

// Load Firebase configuration from environment variables
const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
const authDomain = process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN;
const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
const storageBucket = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET;
const messagingSenderId = process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID;
const appId = process.env.NEXT_PUBLIC_FIREBASE_APP_ID;

// Check if essential configuration variables are present
if (!apiKey) {
  console.error(
    "CRITICAL ERROR: Firebase API Key (NEXT_PUBLIC_FIREBASE_API_KEY) is MISSING or empty. " +
    "Firebase WILL FAIL to initialize. Please ensure it is correctly set in your .env file " +
    "AND that you have RESTARTED your development server."
  );
}
if (!authDomain) {
  console.warn(
    "WARNING: Firebase Auth Domain (NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN) is missing. " +
    "Authentication features may fail. Please set it in your .env file and restart your server."
  );
}
if (!projectId) {
  console.warn(
    "WARNING: Firebase Project ID (NEXT_PUBLIC_FIREBASE_PROJECT_ID) is missing. " +
    "Firebase might not connect to the correct project. Please set it in your .env file and restart your server."
  );
}
// Add similar checks for other critical variables if desired, e.g., storageBucket, appId.

const firebaseConfig = {
  apiKey: apiKey,
  authDomain: authDomain,
  projectId: projectId,
  storageBucket: storageBucket,
  messagingSenderId: messagingSenderId,
  appId: appId,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID, // Measurement ID is often optional
};

let app: FirebaseApp;
let auth: Auth;

// Initialize Firebase
if (!getApps().length) {
  // Only attempt to initialize if the critical API key is present
  if (apiKey) {
    try {
      app = initializeApp(firebaseConfig);
      auth = getAuth(app); // This is where the 'auth/invalid-api-key' error typically originates if the key value is wrong
    } catch (error) {
      console.error("CRITICAL: Firebase initialization failed. This is often due to an invalid API key or misconfiguration.", error);
      // @ts-ignore: Assign undefined to auth if initialization fails to prevent further errors on auth usage
      auth = undefined; 
    }
  } else {
    console.error("CRITICAL: Firebase API key is missing. Firebase App cannot be initialized. Auth will be unavailable.");
    // @ts-ignore: Assign undefined to auth if config is missing
    auth = undefined;
  }
} else {
  app = getApps()[0]!;
  // If the app was already initialized (e.g., due to Hot Module Replacement),
  // try to get the auth instance. This could still fail if the initial config was bad.
  if (apiKey) { // Check apiKey again, as the initial init might have failed silently if HMR is involved
    try {
      auth = getAuth(app);
    } catch (error) {
      console.error("CRITICAL: Failed to get Auth from existing Firebase app. This might be due to an initial configuration error.", error);
      // @ts-ignore
      auth = undefined;
    }
  } else {
    console.error("CRITICAL: Firebase API key is missing. Cannot get Auth from existing app. Auth will be unavailable.");
    // @ts-ignore
    auth = undefined;
  }
}

export { app, auth };
