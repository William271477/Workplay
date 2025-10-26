import React from "react";

export default function Badge({ name }) {
  return (
    <div className="inline-flex items-center gap-2 bg-slate-700/40 px-3 py-1 rounded-full text-sm">
      <div className="w-6 h-6 rounded-full bg-yellow-400 flex items-center justify-center text-xs font-bold">
        ★
      </div>
      <div>{name}</div>
    </div>
  );
}
