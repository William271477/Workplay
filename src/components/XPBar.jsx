import React from "react";
import { motion } from "framer-motion";

export default function XPBar({ xp }) {
  const level = Math.floor(xp / 100);
  const progress = Math.min(100, xp % 100);
  const nextLevelXP = (level + 1) * 100;

  return (
    <div className="w-full">
      <div className="flex items-center justify-between text-sm font-medium mb-2">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🏆</span>
          <span className="text-white">Level {level}</span>
        </div>
        <div className="text-purple-400 font-bold">{xp} XP</div>
      </div>
      
      <div className="relative">
        <div className="w-full bg-slate-800 rounded-full h-4 overflow-hidden border border-slate-700">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="h-full bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400 relative"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse" />
          </motion.div>
        </div>
        
        <div className="flex justify-between text-xs text-slate-400 mt-1">
          <span>{level * 100} XP</span>
          <span>{nextLevelXP} XP</span>
        </div>
      </div>
    </div>
  );
}
