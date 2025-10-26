import React from "react";

export default function XPBar({ xp }) {
  const level = Math.floor(xp / 100);
  const progress = Math.min(100, xp % 100);

  return (
    <div className="w-full">
      <div className="flex items-center justify-between text-xs text-slate-200 mb-1">
        <div>Level {level}</div>
        <div>{xp} XP</div>
      </div>
      <div className="w-full bg-slate-700 rounded-full h-3 overflow-hidden">
        <div
          style={{ width: `${progress}%` }}
          className="h-3 bg-gradient-to-r from-purple-600 to-indigo-500"
        />
      </div>
    </div>
  );
}
