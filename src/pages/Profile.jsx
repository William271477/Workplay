import React from "react";
import { useXPStore } from "../store/xpStore";
import Badge from "../components/Badge";
import XPBar from "../components/XPBar";

export default function Profile() {
  const xp = useXPStore((s) => s.xp);
  const badges = useXPStore((s) => s.badges);
  const reset = useXPStore((s) => s.reset);
  const streak = useXPStore((s) => s.streak);
  const saved = useXPStore((s) => s.saved);

  return (
    <div className="container py-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold">Profile</h2>
          <p className="text-slate-300">Progress and achievements</p>
        </div>
        <div className="text-right">
          <div className="text-sm text-slate-300">XP</div>
          <div className="text-3xl font-bold text-white">{xp}</div>
        </div>
      </div>

      <div className="mt-6">
        <XPBar xp={xp} />
      </div>

      <div className="mt-6 flex gap-6 items-center">
        <div>
          <div className="text-sm text-slate-300">Streak</div>
          <div className="text-xl font-semibold">{streak} 🔥</div>
        </div>
        <div>
          <div className="text-sm text-slate-300">Saved</div>
          <div className="text-xl font-semibold">{saved.length}</div>
        </div>
      </div>

      <section className="mt-8">
        <h3 className="text-lg font-semibold mb-2">Badges</h3>
        <div className="flex gap-3 flex-wrap">
          {badges.length === 0 ? (
            <div className="text-slate-300">
              No badges yet. Complete challenges to earn badges.
            </div>
          ) : (
            badges.map((b) => <Badge key={b} name={b} />)
          )}
        </div>
      </section>

      <div className="mt-8">
        <button onClick={reset} className="px-3 py-2 bg-red-600 rounded">
          Reset progress
        </button>
      </div>
    </div>
  );
}
