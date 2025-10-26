import React, { useState } from "react";
import TinderCard from "react-tinder-card";
import JobCard from "./JobCard";
import confetti from "canvas-confetti";
import { useAuth } from "../contexts/AuthContext";
import * as fb from "../lib/firebase";
import { useXPStore } from "../store/xpStore";

export default function SwipeDeck({ jobs, onSwipe }) {
  const [lastDirection, setLastDirection] = useState();
  const [toast, setToast] = useState(null);
  const { user } = useAuth();
  const saveJobLocal = useXPStore((s) => s.saveJob);

  const swiped = async (direction, job) => {
    setLastDirection(direction);
    // local update (store handles persistence & retry)
    if (direction === "right" || direction === "up") {
      saveJobLocal(job);
      // confetti on match
      confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
      setToast("Match! Job saved");
      setTimeout(() => setToast(null), 1800);
    }

    // if left -> skip: could record analytics
    onSwipe?.(direction, job);
  };

  if (!jobs || jobs.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="text-4xl mb-4">🎯</div>
        <p className="text-slate-400">No more jobs to show</p>
      </div>
    );
  }

  return (
    <div className="relative h-96 flex justify-center items-center">
      {jobs.slice(0, 4).map((job, index) => (
        <TinderCard
          key={job.id}
          onSwipe={(dir) => swiped(dir, job)}
          preventSwipe={["down"]}
          className="absolute"
        >
          <div
            className="transform transition-transform"
            style={{
              zIndex: jobs.length - index,
              transform: `scale(${1 - index * 0.04}) translateY(${
                index * 8
              }px)`,
            }}
          >
            <JobCard job={job} />
          </div>
        </TinderCard>
      ))}

      {toast && (
        <div className="absolute top-6 left-1/2 transform -translate-x-1/2 z-50">
          <div className="px-4 py-2 rounded-full text-white font-bold bg-emerald-500/95 shadow-lg">
            {toast}
          </div>
        </div>
      )}

      {lastDirection && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-50">
          <div
            className={`px-4 py-2 rounded-full text-white font-bold ${
              lastDirection === "right" ? "bg-green-500" : "bg-red-500"
            }`}
          >
            {lastDirection === "right" ? "SAVED!" : "SKIPPED"}
          </div>
        </div>
      )}
    </div>
  );
}
