import React, { useMemo, useState } from "react";
import TinderCard from "react-tinder-card";
import JobCard from "./JobCard";
import confetti from "canvas-confetti";
import { useXPStore } from "../store/xpStore";

export default function SwipeDeck({ jobs }) {
  const [currentIndex, setCurrentIndex] = useState(jobs.length - 1);
  const addXP = useXPStore((s) => s.addXP);
  const saveJob = useXPStore((s) => s.saveJob);
  const incrementStreak = useXPStore((s) => s.incrementStreak);

  const childRefs = useMemo(
    () =>
      Array(jobs.length)
        .fill(0)
        .map(() => React.createRef()),
    [jobs.length]
  );

  function onSwipe(direction, job, idx) {
    setCurrentIndex((i) => Math.max(-1, i - 1));
    if (direction === "right") {
      // like/save
      addXP(20);
      saveJob(job);
      incrementStreak();
      confetti({ particleCount: 60, spread: 60, origin: { y: 0.6 } });
    }
    // left = skip (no xp)
  }

  function swipeOut() {}

  return (
    <div className="relative w-full max-w-xl mx-auto h-[520px]">
      {jobs.map((job, index) => (
        <TinderCard
          ref={childRefs[index]}
          className="absolute w-full h-full"
          key={job.id}
          onSwipe={(dir) => onSwipe(dir, job, index)}
          onCardLeftScreen={() => swipeOut()}
          preventSwipe={["up", "down"]}
        >
          <div className={`p-6 h-full flex items-center justify-center`}>
            <JobCard job={job} />
          </div>
        </TinderCard>
      ))}
    </div>
  );
}
