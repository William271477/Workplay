import React, { useMemo, useState } from "react";
import TinderCard from "react-tinder-card";
import JobCard from "./JobCard";
import confetti from "canvas-confetti";
import { motion, AnimatePresence } from "framer-motion";
import { useXPStore } from "../store/xpStore";

export default function SwipeDeck({ jobs }) {
  const [currentIndex, setCurrentIndex] = useState(jobs.length - 1);
  const [showMatch, setShowMatch] = useState(false);
  const [lastAction, setLastAction] = useState(null);
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
      // Save job
      addXP(20);
      saveJob(job);
      incrementStreak();
      setLastAction({ type: "saved", job });
      setShowMatch(true);
      
      // Confetti effect
      confetti({ 
        particleCount: 100, 
        spread: 70, 
        origin: { y: 0.6 },
        colors: ['#8B5CF6', '#EC4899', '#F59E0B']
      });
      
      setTimeout(() => setShowMatch(false), 2000);
    } else if (direction === "left") {
      setLastAction({ type: "skipped", job });
      addXP(5); // Small XP for engagement
    }
  }

  const canSwipe = currentIndex >= 0;
  const currentJob = jobs[currentIndex];

  return (
    <div className="relative w-full max-w-sm mx-auto h-[600px]">
      {/* Card Stack */}
      <div className="relative h-full">
        {jobs.map((job, index) => (
          <TinderCard
            ref={childRefs[index]}
            className="absolute w-full h-full"
            key={job.id}
            onSwipe={(dir) => onSwipe(dir, job, index)}
            preventSwipe={["up", "down"]}
            swipeRequirementType="position"
            swipeThreshold={100}
          >
            <div className="h-full flex items-center justify-center p-4">
              <JobCard job={job} />
            </div>
          </TinderCard>
        ))}
      </div>

      {/* Match Animation */}
      <AnimatePresence>
        {showMatch && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="absolute inset-0 flex items-center justify-center z-50 bg-black/50 rounded-3xl"
          >
            <motion.div
              initial={{ y: 50 }}
              animate={{ y: 0 }}
              className="text-center text-white"
            >
              <div className="text-6xl mb-4">🎉</div>
              <div className="text-2xl font-bold mb-2">Job Saved!</div>
              <div className="text-lg opacity-90">+20 XP</div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* No More Cards */}
      {!canSwipe && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <div className="text-center p-8 bg-gradient-to-br from-purple-100 to-pink-100 rounded-3xl border border-purple-200">
            <div className="text-4xl mb-4">🎆</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">All caught up!</h3>
            <p className="text-gray-600">Check back later for more opportunities</p>
          </div>
        </motion.div>
      )}

      {/* Action Buttons */}
      {canSwipe && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-4">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => childRefs[currentIndex]?.current?.swipe('left')}
            className="w-14 h-14 bg-white rounded-full shadow-lg flex items-center justify-center text-2xl border-2 border-gray-200 hover:border-red-300"
          >
            ❌
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => childRefs[currentIndex]?.current?.swipe('right')}
            className="w-14 h-14 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full shadow-lg flex items-center justify-center text-2xl text-white"
          >
            ❤️
          </motion.button>
        </div>
      )}
    </div>
  );
}
