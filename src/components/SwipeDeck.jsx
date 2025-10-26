import React, { useState, useMemo } from "react";
import TinderCard from "react-tinder-card";
import confetti from "canvas-confetti";
import { useXPStore } from "../store/xpStore";

export default function SwipeDeck({ jobs }) {
  const [currentIndex, setCurrentIndex] = useState(jobs.length - 1);
  const [showMatch, setShowMatch] = useState(false);
  const { addXP, saveJob, incrementStreak } = useXPStore();

  const childRefs = useMemo(() => 
    Array(jobs.length).fill(0).map(() => React.createRef()), 
    [jobs.length]
  );

  const handleSwipe = (direction, job) => {
    setCurrentIndex(prev => prev - 1);
    
    if (direction === "right") {
      addXP(20);
      saveJob(job);
      incrementStreak();
      setShowMatch(true);
      confetti({ 
        particleCount: 100, 
        spread: 70, 
        origin: { y: 0.6 },
        colors: ['#8B5CF6', '#EC4899', '#F59E0B']
      });
      setTimeout(() => setShowMatch(false), 2000);
    } else if (direction === "left") {
      addXP(5);
    }
  };

  const swipe = (dir) => {
    if (currentIndex >= 0) {
      childRefs[currentIndex].current?.swipe(dir);
    }
  };

  return (
    <div className="relative w-full max-w-sm mx-auto h-96">
      {jobs.map((job, index) => (
        <TinderCard
          ref={childRefs[index]}
          className="absolute w-full h-full"
          key={job.id}
          onSwipe={(dir) => handleSwipe(dir, job)}
          preventSwipe={["up", "down"]}
          swipeRequirementType="position"
          swipeThreshold={100}
        >
          <div 
            className="w-full h-full bg-white rounded-3xl shadow-2xl p-6 cursor-grab active:cursor-grabbing"
            style={{
              transform: `scale(${1 - (jobs.length - 1 - index) * 0.05}) translateY(${(jobs.length - 1 - index) * -8}px)`,
              zIndex: index
            }}
          >
            <div className="flex items-start gap-4 mb-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-2xl">
                {job.logo}
              </div>
              <div className="flex-1 text-black">
                <h3 className="text-xl font-bold">{job.title}</h3>
                <p className="text-gray-600">{job.company}</p>
                <p className="text-sm text-gray-500">📍 {job.location}</p>
              </div>
            </div>
            
            <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full inline-block mb-4">
              <span className="font-semibold">{job.salary}</span>
            </div>
            
            <p className="text-gray-700 mb-4 text-sm leading-relaxed">{job.desc}</p>
            
            <div className="flex flex-wrap gap-2 mb-6">
              {job.tags?.map((tag) => (
                <span key={tag} className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs font-medium">
                  {tag}
                </span>
              ))}
            </div>
            
            <div className="flex justify-between items-center text-xs text-gray-400">
              <span>← Skip</span>
              <span>Save →</span>
            </div>
          </div>
        </TinderCard>
      ))}

      {showMatch && (
        <div className="absolute inset-0 flex items-center justify-center z-50 bg-black/50 rounded-3xl">
          <div className="text-center text-white">
            <div className="text-6xl mb-4">🎉</div>
            <div className="text-2xl font-bold mb-2">Job Saved!</div>
            <div className="text-lg opacity-90">+20 XP</div>
          </div>
        </div>
      )}

      {currentIndex >= 0 && (
        <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2 flex gap-4">
          <button
            onClick={() => swipe('left')}
            className="w-14 h-14 bg-white rounded-full shadow-lg flex items-center justify-center text-2xl border-2 border-gray-200 hover:border-red-300 transition-colors"
          >
            ❌
          </button>
          <button
            onClick={() => swipe('right')}
            className="w-14 h-14 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full shadow-lg flex items-center justify-center text-2xl text-white hover:from-green-500 hover:to-emerald-600 transition-colors"
          >
            ❤️
          </button>
        </div>
      )}
    </div>
  );
}