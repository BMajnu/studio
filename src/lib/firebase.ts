
import { initializeApp, getApps, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore'; // Import Firestore

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
let db: Firestore; // Declare Firestore instance variable

// Initialize Firebase
if (!getApps().length) {
  // Only attempt to initialize if the critical API key is present
  if (apiKey && projectId && authDomain) { // Added more checks for critical config
    try {
      app = initializeApp(firebaseConfig);
      auth = getAuth(app);
      db = getFirestore(app); // Initialize Firestore
    } catch (error) {
      console.error("CRITICAL: Firebase initialization failed. This is often due to an invalid API key or misconfiguration.", error);
      // @ts-ignore: Assign undefined to auth if initialization fails to prevent further errors on auth usage
      auth = undefined; 
      // @ts-ignore
      db = undefined;
    }
  } else {
    console.error("CRITICAL: Essential Firebase configuration (API Key, Project ID, or Auth Domain) is missing. Firebase App cannot be initialized. Auth and Firestore will be unavailable.");
    // @ts-ignore: Assign undefined to auth if config is missing
    auth = undefined;
    // @ts-ignore
    db = undefined;
  }
} else {
  app = getApps()[0]!;
  // If the app was already initialized (e.g., due to Hot Module Replacement),
  // try to get the auth instance. This could still fail if the initial config was bad.
  if (apiKey && projectId && authDomain) { // Check critical config again
    try {
      auth = getAuth(app);
      db = getFirestore(app); // Get Firestore from existing app
    } catch (error) {
      console.error("CRITICAL: Failed to get Auth or Firestore from existing Firebase app. This might be due to an initial configuration error.", error);
      // @ts-ignore
      auth = undefined;
      // @ts-ignore
      db = undefined;
    }
  } else {
    console.error("CRITICAL: Essential Firebase configuration missing. Cannot get Auth or Firestore from existing app. Services will be unavailable.");
    // @ts-ignore
    auth = undefined;
    // @ts-ignore
    db = undefined;
  }
}

export { app, auth, db }; // Export db
