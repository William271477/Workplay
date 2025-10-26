import React, { createContext, useContext, useEffect, useState } from "react";
import * as fb from "../lib/firebase";
import { useXPStore } from "../store/xpStore";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = fb.onAuthChange((u) => {
      setUser(u);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  // when user changes, subscribe to their saved jobs
  useEffect(() => {
    if (!user) {
      // clear saved jobs for anonymous state
      useXPStore.setState({ saved: [] });
      // stop retry worker when signed out
      useXPStore.getState().stopRetryWorker();
      return;
    }

    // fetch once and then subscribe
    let unsub = null;
    try {
      unsub = fb.subscribeSavedJobs(user.uid, (jobs) => {
        // store saved jobs in Zustand
        useXPStore.setState({ saved: jobs || [] });
      });
    } catch (err) {
      console.error("subscribe saved jobs failed", err);
    }

    return () => {
      if (typeof unsub === "function") unsub();
    };
  }, [user]);

  // start retry worker when user becomes available
  useEffect(() => {
    if (user) {
      useXPStore.getState().startRetryWorker();
    }
  }, [user]);

  const signInWithGoogle = async () => {
    setLoading(true);
    try {
      const u = await fb.signInWithGoogle();
      setUser(u);
      return u;
    } finally {
      setLoading(false);
    }
  };

  const signInAnonymously = async () => {
    setLoading(true);
    try {
      const u = await fb.signInAnon();
      setUser(u);
      return u;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    setLoading(true);
    try {
      await fb.signOut();
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, signInWithGoogle, signInAnonymously, signOut }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
