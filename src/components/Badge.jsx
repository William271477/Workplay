import React from "react";
import { motion } from "framer-motion";

const badgeIcons = {
  'Resume Ready': '📄',
  'CV Master': '📄',
  'Go-Getter': '🚀',
  'Coder': '💻',
  'Interview Pro': '🎤',
  'Market Researcher': '🔍',
  'Networker': '💼',
  'Skill Builder': '🎓',
  'First Save': '🎯',
  'On Fire': '🔥',
  'Level Up': '⭐',
  'Explorer': '🗺️',
  'Dedicated': '💎'
};

export default function Badge({ name }) {
  const icon = badgeIcons[name] || '🏅';
  
  return (
    <motion.div 
      initial={{ scale: 0, rotate: -180 }}
      animate={{ scale: 1, rotate: 0 }}
      whileHover={{ scale: 1.05 }}
      className="inline-flex items-center gap-3 bg-gradient-to-r from-yellow-400/20 to-orange-400/20 border border-yellow-400/30 px-4 py-2 rounded-full text-sm font-medium"
    >
      <div className="text-lg">{icon}</div>
      <div className="text-yellow-200">{name}</div>
    </motion.div>
  );
}
