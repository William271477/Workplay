import { create } from "zustand";
import { auth } from "../lib/firebase";
import { removeSavedForUser, saveJobForUser } from "../lib/firebase";

export const useXPStore = create((set, get) => ({
  xp: 0,
  badges: [],
  streak: 0,
  lastLikeAt: null,
  saved: [],
  searchQuery: "",
  appliedJobs: [],
  // Last saved job (for undo)
  lastSaved: null,
  // retry queue for failed persistence
  failedQueue: [],
  retryIntervalId: null,
  // toasts
  toasts: [],

  addXP: (amount) => {
    const state = get();
    set({ xp: state.xp + amount });
  },
  addBadge: (badge) => {
    const state = get();
    const newBadges = [...state.badges];
    if (!newBadges.includes(badge)) {
      newBadges.push(badge);
    }
    set({ badges: newBadges });
  },
  addToast: (msg) => {
    const id = Date.now() + Math.random();
    set((s) => ({ toasts: [...s.toasts, { id, msg }] }));
    // auto remove
    setTimeout(() => {
      get().removeToast(id);
    }, 3500);
  },
  removeToast: (id) =>
    set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
  saveJob: (job) => {
    const state = get();
    const filtered = state.saved.filter((j) => j.id !== job.id);
    set({ saved: [job, ...filtered], lastSaved: job });

    // attempt to persist to Firestore
    try {
      const uid = auth.currentUser?.uid;
      if (uid) {
        saveJobForUser(uid, job).catch((e) => {
          console.error("firestore save failed", e);
          // enqueue retry
          get().enqueueFailed({ type: "save", uid, job });
          get().addToast("Save failed — will retry");
        });
      }
    } catch (e) {
      console.error("saveJob persist error", e);
    }
  },
  removeSaved: (id) => {
    const state = get();
    set({ saved: state.saved.filter((j) => j.id !== id) });
    // remove from Firestore if user present
    try {
      const uid = auth.currentUser?.uid;
      if (uid) {
        removeSavedForUser(uid, id).catch((e) => {
          console.error("firestore remove failed", e);
          get().enqueueFailed({ type: "remove", uid, jobId: id });
          get().addToast("Remove failed — will retry");
        });
      }
    } catch (e) {
      console.error("removeSaved persist error", e);
    }
  },
  undoLastSave: () => {
    const state = get();
    const last = state.lastSaved;
    if (!last) return;
    // remove locally
    set({
      saved: state.saved.filter((j) => j.id !== last.id),
      lastSaved: null,
    });
    // remove from firestore
    try {
      const uid = auth.currentUser?.uid;
      if (uid) {
        removeSavedForUser(uid, last.id).catch((e) => {
          console.error("undo remove failed", e);
          get().enqueueFailed({ type: "remove", uid, jobId: last.id });
          get().addToast("Undo remove failed — will retry");
        });
      }
    } catch (e) {
      console.error("undo persist error", e);
    }
  },
  enqueueFailed: (item) => {
    set((s) => ({
      failedQueue: [
        ...s.failedQueue,
        { item, nextAttempt: Date.now() + 2000, tries: 0 },
      ],
    }));
  },
  startRetryWorker: () => {
    if (typeof window === "undefined") return;
    if (get().retryIntervalId) return; // already running
    const id = setInterval(async () => {
      const state = get();
      const now = Date.now();
      const queue = [...state.failedQueue];
      if (queue.length === 0) return;
      const remaining = [];
      for (const q of queue) {
        if (q.nextAttempt > now) {
          remaining.push(q);
          continue;
        }
        const { item } = q;
        try {
          if (item.type === "save") {
            await saveJobForUser(item.uid, item.job);
          } else if (item.type === "remove") {
            await removeSavedForUser(item.uid, item.jobId);
          }
          // success: show toast
          get().addToast("Sync succeeded");
        } catch (e) {
          // schedule next attempt with backoff
          const tries = (q.tries || 0) + 1;
          const delay = Math.min(60000, 2000 * Math.pow(2, tries));
          remaining.push({ item, nextAttempt: Date.now() + delay, tries });
        }
      }
      set({ failedQueue: remaining });
    }, 5000);
    set({ retryIntervalId: id });
  },
  stopRetryWorker: () => {
    const id = get().retryIntervalId;
    if (id) {
      clearInterval(id);
      set({ retryIntervalId: null });
    }
  },
  applyToJob: (jobId) => {
    const state = get();
    if (!state.appliedJobs.includes(jobId)) {
      set({ appliedJobs: [...state.appliedJobs, jobId] });
    }
  },
  setSearchQuery: (query) => {
    set({ searchQuery: query });
  },
  incrementStreak: () => {
    const state = get();
    set({ streak: state.streak + 1, lastLikeAt: Date.now() });
  },
  reset: () => {
    set({
      xp: 0,
      badges: [],
      streak: 0,
      lastLikeAt: null,
      saved: [],
      searchQuery: "",
      appliedJobs: [],
    });
  },
}));
