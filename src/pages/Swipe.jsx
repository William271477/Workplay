import React from "react";
import SwipeDeck from "../components/SwipeDeck";
import { jobs as initialJobs } from "../data/jobs";
import XPBar from "../components/XPBar";
import { useXPStore } from "../store/xpStore";

export default function Swipe() {
  const xp = useXPStore((s) => s.xp);

  return (
    <div className="container py-6">
      <div className="mb-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold">Discover jobs</h2>
        </div>
        <div className="mt-3">
          <XPBar xp={xp} />
        </div>
      </div>

      <div className="flex items-center justify-center">
        <SwipeDeck jobs={initialJobs} />
      </div>
    </div>
  );
}
