
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore, enableMultiTabIndexedDbPersistence } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Production Firebase Configuration
// Replace these with real values from your Firebase Console (Settings > General > Your Apps)
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY || "AIzaSy-SIMULATED-KEY",
  authDomain: "gigavibe-arena.firebaseapp.com",
  projectId: "gigavibe-arena",
  storageBucket: "gigavibe-arena.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef"
};

// Check if we are using a real key or just a placeholder
export const isNeuralLinkActive = !firebaseConfig.apiKey.includes("SIMULATED-KEY");

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const googleProvider = new GoogleAuthProvider();

// Enable offline persistence for production-ready performance
if (typeof window !== "undefined" && isNeuralLinkActive) {
  enableMultiTabIndexedDbPersistence(db).catch((err) => {
    if (err.code === 'failed-precondition') {
      console.warn("Multiple tabs open, persistence can only be enabled in one tab at a time.");
    } else if (err.code === 'unimplemented') {
      console.warn("The current browser does not support all of the features required to enable persistence.");
    }
  });
}

console.log(`GIGAVibe Ecosystem: ${isNeuralLinkActive ? 'Cloud Sync Active' : 'Local Node Active (Offline Mode)'}`);
