import React, { useState } from "react";
import TinderCard from "react-tinder-card";
import confetti from "canvas-confetti";
import { useXPStore } from "../store/xpStore";

export default function SwipeCard({ job, onSwipe }) {
  const [showMatch, setShowMatch] = useState(false);
  const { addXP, saveJob, incrementStreak } = useXPStore();

  const handleSwipe = (direction) => {
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
    onSwipe(direction);
  };

  return (
    <div className="relative">
      <TinderCard
        onSwipe={handleSwipe}
        preventSwipe={["up", "down"]}
        swipeRequirementType="position"
        swipeThreshold={100}
      >
        <div className="bg-white text-black rounded-3xl p-6 shadow-2xl cursor-grab active:cursor-grabbing">
          <div className="flex items-start gap-4 mb-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-2xl">
              {job.logo}
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold">{job.title}</h3>
              <p className="text-gray-600">{job.company}</p>
              <p className="text-sm text-gray-500 flex items-center gap-1">
                📍 {job.location}
              </p>
            </div>
          </div>
          
          <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full inline-block mb-4">
            <span className="font-semibold">{job.salary}</span>
          </div>
          
          <p className="text-gray-700 mb-4">{job.desc}</p>
          
          <div className="flex flex-wrap gap-2 mb-6">
            {job.tags?.map((tag) => (
              <span key={tag} className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs font-medium">
                {tag}
              </span>
            ))}
          </div>
          
          <div className="flex justify-between items-center text-xs text-gray-400">
            <div className="flex items-center gap-1">
              <span>←</span>
              <span>Skip</span>
            </div>
            <div className="flex items-center gap-1">
              <span>Save</span>
              <span>→</span>
            </div>
          </div>
        </div>
      </TinderCard>

      {showMatch && (
        <div className="absolute inset-0 flex items-center justify-center z-50 bg-black/50 rounded-3xl">
          <div className="text-center text-white">
            <div className="text-6xl mb-4">🎉</div>
            <div className="text-2xl font-bold mb-2">Job Saved!</div>
            <div className="text-lg opacity-90">+20 XP</div>
          </div>
        </div>
      )}
    </div>
  );
}