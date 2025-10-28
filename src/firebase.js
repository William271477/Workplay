import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics, isSupported } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyDL4tcrXYdFaQvYv8C0sfv5lV3NhYzx6UI",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "workplay-1ef5e.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "workplay-1ef5e",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "workplay-1ef5e.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "1095220702505",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:1095220702505:web:6e5016c039976439d65b38",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-31D49G8E4T"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// Initialize analytics only if supported
let analytics = null;
isSupported().then((supported) => {
  if (supported) {
    analytics = getAnalytics(app);
  }
});

export { analytics };