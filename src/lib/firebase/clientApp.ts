import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
// To use features like Firebase Analytics, you would import them here
// import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID // Optional
};

let firebaseAppInstance: FirebaseApp;

// Initialize Firebase
if (!getApps().length) {
  firebaseAppInstance = initializeApp(firebaseConfig);
  console.log("Firebase initialized successfully");
  // Example: Initialize Analytics (if you're using it)
  // if (typeof window !== 'undefined') {
  //   if (firebaseConfig.measurementId) {
  //     getAnalytics(firebaseAppInstance);
  //   }
  // }
} else {
  firebaseAppInstance = getApp();
  console.log("Firebase app already initialized");
}

export const firebaseApp = firebaseAppInstance;
export const firebaseAuth = getAuth(firebaseAppInstance);
export { firebaseAppInstance };