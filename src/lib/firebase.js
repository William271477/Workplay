// Firebase initialization and auth helpers
import { initializeApp, getApps } from "firebase/app";
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  deleteDoc,
  onSnapshot,
  getDocs,
} from "firebase/firestore";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInAnonymously,
  onAuthStateChanged,
  signOut as firebaseSignOut,
} from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "",
};

if (!getApps().length && firebaseConfig.apiKey) {
  initializeApp(firebaseConfig);
}

const auth = getAuth();
const googleProvider = new GoogleAuthProvider();
const db = getApps().length ? getFirestore() : null;

export async function signInWithGoogle() {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (err) {
    console.error("Google sign-in error", err);
    throw err;
  }
}

export async function signInAnon() {
  try {
    const res = await signInAnonymously(auth);
    return res.user;
  } catch (err) {
    console.error("Anonymous sign-in error", err);
    throw err;
  }
}

export function onAuthChange(cb) {
  return onAuthStateChanged(auth, cb);
}

export async function signOut() {
  return firebaseSignOut(auth);
}

export { auth };

// Firestore helpers for per-user saved jobs
export async function saveJobForUser(uid, job) {
  if (!uid) return;
  try {
    if (!db) throw new Error("Firestore not initialized");
    const ref = doc(db, "users", uid, "savedJobs", job.id);
    await setDoc(ref, { ...job, savedAt: Date.now() });
  } catch (err) {
    console.error("saveJobForUser error", err);
    throw err;
  }
}

export async function removeSavedForUser(uid, jobId) {
  if (!uid) return;
  try {
    if (!db) throw new Error("Firestore not initialized");
    const ref = doc(db, "users", uid, "savedJobs", jobId);
    await deleteDoc(ref);
  } catch (err) {
    console.error("removeSavedForUser error", err);
    throw err;
  }
}

export function subscribeSavedJobs(uid, cb) {
  if (!uid) return () => {};
  if (!db) {
    console.warn("subscribeSavedJobs: Firestore not initialized");
    return () => {};
  }
  const coll = collection(db, "users", uid, "savedJobs");
  return onSnapshot(
    coll,
    (snapshot) => {
      const jobs = snapshot.docs.map((d) => d.data());
      cb(jobs);
    },
    (err) => {
      console.error("subscribeSavedJobs error", err);
    }
  );
}

export async function fetchSavedJobsOnce(uid) {
  if (!uid) return [];
  const coll = collection(db, "users", uid, "savedJobs");
  const snap = await getDocs(coll);
  return snap.docs.map((d) => d.data());
}

export function isFirestoreReady() {
  return !!db;
}
