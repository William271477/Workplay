import React from "react";
import { useXPStore } from "../store/xpStore";
import Badge from "../components/Badge";
import XPBar from "../components/XPBar";
import { motion } from "framer-motion";

export default function Profile() {
  const { xp, badges, streak, saved, reset } = useXPStore((s) => ({
    xp: s.xp,
    badges: s.badges,
    streak: s.streak,
    saved: s.saved,
    reset: s.reset
  }));

  const level = Math.floor(xp / 100);
  const achievements = [
    { id: 'first_save', name: 'First Save', desc: 'Saved your first job', icon: '🎯', unlocked: saved.length >= 1 },
    { id: 'streak_3', name: 'On Fire', desc: 'Maintain a 3-day streak', icon: '🔥', unlocked: streak >= 3 },
    { id: 'level_1', name: 'Level Up', desc: 'Reach level 1', icon: '⭐', unlocked: level >= 1 },
    { id: 'explorer', name: 'Explorer', desc: 'Save 5 different jobs', icon: '🗺️', unlocked: saved.length >= 5 },
    { id: 'dedicated', name: 'Dedicated', desc: 'Earn 500 XP', icon: '💎', unlocked: xp >= 500 },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900">
      <div className="container py-8 px-4">
        {/* Profile Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-4xl">
            👤
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Job Hunter
          </h1>
          <p className="text-slate-400 mt-2">Level {level} • {xp} XP</p>
        </motion.div>

        {/* XP Progress */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <XPBar xp={xp} />
        </motion.div>

        {/* Stats Grid */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
        >
          <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700 text-center">
            <div className="text-3xl mb-2">🏆</div>
            <div className="text-2xl font-bold text-yellow-400">{level}</div>
            <div className="text-sm text-slate-400">Level</div>
          </div>
          <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700 text-center">
            <div className="text-3xl mb-2">🔥</div>
            <div className="text-2xl font-bold text-orange-400">{streak}</div>
            <div className="text-sm text-slate-400">Streak</div>
          </div>
          <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700 text-center">
            <div className="text-3xl mb-2">💾</div>
            <div className="text-2xl font-bold text-green-400">{saved.length}</div>
            <div className="text-sm text-slate-400">Saved Jobs</div>
          </div>
          <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700 text-center">
            <div className="text-3xl mb-2">⚡</div>
            <div className="text-2xl font-bold text-purple-400">{xp}</div>
            <div className="text-sm text-slate-400">Total XP</div>
          </div>
        </motion.div>

        {/* Achievements */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-8"
        >
          <h2 className="text-2xl font-bold mb-4 text-white">Achievements</h2>
          <div className="grid gap-3">
            {achievements.map((achievement) => (
              <div 
                key={achievement.id}
                className={`p-4 rounded-xl border transition-all ${
                  achievement.unlocked 
                    ? 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 border-purple-500/50' 
                    : 'bg-slate-800/30 border-slate-700 opacity-60'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className="text-3xl">{achievement.icon}</div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-white">{achievement.name}</h3>
                    <p className="text-sm text-slate-400">{achievement.desc}</p>
                  </div>
                  {achievement.unlocked && (
                    <div className="text-green-400 text-xl">✓</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </motion.section>

        {/* Reset Button */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-center"
        >
          <button 
            onClick={reset} 
            className="px-6 py-3 bg-red-600/20 border border-red-500/50 text-red-400 rounded-xl hover:bg-red-600/30 transition-colors"
          >
            Reset Progress
          </button>
        </motion.div>
      </div>
    </div>
  );
}
