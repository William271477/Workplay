import React, { useState } from "react";
import SwipeDeck from "../components/SwipeDeck";
import { jobs as initialJobs } from "../data/jobs";
import XPBar from "../components/XPBar";
import { useXPStore } from "../store/xpStore";
import { motion } from "framer-motion";
import OnboardingModal from "../components/OnboardingModal";

export default function Swipe() {
  const { xp, streak, saved } = useXPStore((s) => ({
    xp: s.xp,
    streak: s.streak,
    saved: s.saved,
  }));
  const [showOnboard, setShowOnboard] = useState(
    !localStorage.getItem("workplay_onboard_seen")
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900">
      <div className="container py-6 px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Discover Jobs
              </h1>
              <p className="text-slate-400 mt-1">
                Swipe right to save, left to skip
              </p>
            </div>

            {/* Stats */}
            <div className="flex gap-4 text-center">
              <div className="bg-slate-800/50 rounded-xl p-3 border border-slate-700">
                <div className="text-2xl">🔥</div>
                <div className="text-sm text-slate-400">Streak</div>
                <div className="font-bold text-orange-400">{streak}</div>
              </div>
              <div className="bg-slate-800/50 rounded-xl p-3 border border-slate-700">
                <div className="text-2xl">💾</div>
                <div className="text-sm text-slate-400">Saved</div>
                <div className="font-bold text-green-400">{saved.length}</div>
              </div>
            </div>
          </div>

          <XPBar xp={xp} />
        </motion.div>

        {/* Swipe Deck */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="flex items-center justify-center"
        >
          <SwipeDeck jobs={initialJobs} />
        </motion.div>

        {/* Tips */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-8 text-center"
        >
          <div className="inline-flex items-center gap-4 bg-slate-800/30 rounded-full px-6 py-3 border border-slate-700/50">
            <span className="text-slate-400 text-sm">
              Swipe or use buttons below
            </span>
          </div>
        </motion.div>
        <OnboardingModal
          open={showOnboard}
          onClose={() => setShowOnboard(false)}
        />
      </div>
    </div>
  );
}
