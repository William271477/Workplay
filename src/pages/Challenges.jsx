import React from "react";
import { useXPStore } from "../store/xpStore";

const challenges = [
  { id: "c1", title: "Polish your resume", xp: 20, badge: "Resume Ready" },
  { id: "c2", title: "Apply to 3 jobs", xp: 50, badge: "Go-Getter" },
  { id: "c3", title: "Complete a coding kata", xp: 30, badge: "Coder" },
];

export default function Challenges() {
  const addXP = useXPStore((s) => s.addXP);
  const addBadge = useXPStore((s) => s.addBadge);

  function complete(ch) {
    addXP(ch.xp);
    addBadge(ch.badge);
  }

  return (
    <div className="container py-8">
      <h2 className="text-2xl font-semibold mb-4">Challenges</h2>
      <p className="text-slate-300 mb-6">
        Complete short career tasks to earn XP & badges.
      </p>

      <div className="grid gap-4">
        {challenges.map((ch) => (
          <div
            key={ch.id}
            className="bg-slate-800 p-4 rounded-lg flex justify-between items-center"
          >
            <div>
              <div className="font-semibold">{ch.title}</div>
              <div className="text-sm text-slate-300">
                Reward: {ch.xp} XP + {ch.badge}
              </div>
            </div>
            <div>
              <button
                onClick={() => complete(ch)}
                className="px-3 py-1 rounded bg-gradient-to-r from-purple-600 to-indigo-500 text-white"
              >
                Complete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
