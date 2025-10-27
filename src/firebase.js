import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: "AIzaSyDL4tcrXYdFaQvYv8C0sfv5lV3NhYzx6UI",
  authDomain: "workplay-1ef5e.firebaseapp.com",
  projectId: "workplay-1ef5e",
  storageBucket: "workplay-1ef5e.firebasestorage.app",
  messagingSenderId: "1095220702505",
  appId: "1:1095220702505:web:6e5016c039976439d65b38",
  measurementId: "G-31D49G8E4T"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const analytics = getAnalytics(app);