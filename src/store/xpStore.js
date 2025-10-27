import { create } from "zustand";

export const useXPStore = create((set, get) => ({
  xp: 0,
  badges: [],
  streak: 0,
  lastLikeAt: null,
  saved: [],
  searchQuery: "",
  appliedJobs: [],
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
  saveJob: (job) => {
    const state = get();
    const filtered = state.saved.filter((j) => j.id !== job.id);
    set({ saved: [job, ...filtered] });
  },
  removeSaved: (id) => {
    const state = get();
    set({ saved: state.saved.filter((j) => j.id !== id) });
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
    set({ xp: 0, badges: [], streak: 0, lastLikeAt: null, saved: [], searchQuery: "", appliedJobs: [] });
  },
}));