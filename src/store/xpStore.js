import create from "zustand";

export const useXPStore = create((set) => ({
  xp: 0,
  badges: [],
  streak: 0,
  lastLikeAt: null,
  saved: [],
  addXP: (amount) => set((s) => ({ xp: s.xp + amount })),
  addBadge: (badge) =>
    set((s) => ({ badges: Array.from(new Set([...s.badges, badge])) })),
  saveJob: (job) =>
    set((s) => ({ saved: [job, ...s.saved.filter((j) => j.id !== job.id)] })),
  removeSaved: (id) =>
    set((s) => ({ saved: s.saved.filter((j) => j.id !== id) })),
  incrementStreak: () =>
    set((s) => ({ streak: s.streak + 1, lastLikeAt: Date.now() })),
  reset: () =>
    set({ xp: 0, badges: [], streak: 0, lastLikeAt: null, saved: [] }),
}));
