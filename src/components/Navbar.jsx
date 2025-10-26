import React from "react";
import { motion } from "framer-motion";

export default function Navbar({ page, setPage }) {
  const navItems = [
    { id: "swipe", label: "Home", icon: "🏠" },
    { id: "saved", label: "Saved", icon: "💾" },
    { id: "profile", label: "Profile", icon: "👤" },
  ];

  return (
    <nav className="bg-gradient-to-r from-slate-900/95 to-slate-800/95 backdrop-blur-lg sticky top-0 z-50 border-b border-slate-700/50">
      <div className="container flex items-center justify-between h-16 px-4">
        <motion.div 
          className="flex items-center gap-3"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 flex items-center justify-center font-bold text-white shadow-lg">
            🎮
          </div>
          <div className="text-white font-bold text-xl bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            WorkPlay
          </div>
        </motion.div>

        <div className="flex items-center gap-1 bg-slate-800/50 rounded-full p-1">
          {navItems.map((item) => (
            <motion.button
              key={item.id}
              onClick={() => setPage(item.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                page === item.id
                  ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg"
                  : "text-slate-300 hover:text-white hover:bg-slate-700/50"
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="text-base">{item.icon}</span>
              <span className="hidden sm:inline">{item.label}</span>
            </motion.button>
          ))}
        </div>
      </div>
    </nav>
  );
}
