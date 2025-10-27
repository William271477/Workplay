import React, { useState } from "react";
import TinderCard from "react-tinder-card";
import JobCard from "./JobCard";
import confetti from "canvas-confetti";

export default function SwipeDeck({ jobs, onSwipe }) {
  const [lastDirection, setLastDirection] = useState();

  const swiped = (direction, job) => {
    setLastDirection(direction);
    if (direction === "right") {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
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
      {jobs.slice(0, 3).map((job, index) => (
        <TinderCard
          key={job.id}
          onSwipe={(dir) => swiped(dir, job)}
          preventSwipe={["up", "down"]}
          className="absolute"
        >
          <div 
            className="transform transition-transform"
            style={{ 
              zIndex: jobs.length - index,
              transform: `scale(${1 - index * 0.05}) translateY(${index * 8}px)`
            }}
          >
            <JobCard job={job} />
          </div>
        </TinderCard>
      ))}
      
      {lastDirection && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-50">
          <div className={`px-4 py-2 rounded-full text-white font-bold ${
            lastDirection === "right" ? "bg-green-500" : "bg-red-500"
          }`}>
            {lastDirection === "right" ? "SAVED!" : "SKIPPED"}
          </div>
        </div>
      )}
    </div>
  );
}