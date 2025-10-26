import React, { useState } from "react";
import Navbar from "./components/Navbar";
import Swipe from "./pages/Swipe";
import Profile from "./pages/Profile";
import Challenges from "./pages/Challenges";
import Saved from "./pages/Saved";
import { motion, AnimatePresence } from "framer-motion";

export default function App() {
  const [page, setPage] = useState("swipe");

  const pageVariants = {
    initial: { opacity: 0, x: 20 },
    in: { opacity: 1, x: 0 },
    out: { opacity: 0, x: -20 }
  };

  const pageTransition = {
    type: "tween",
    ease: "anticipate",
    duration: 0.3
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-900">
      <Navbar page={page} setPage={setPage} />

      <main className="flex-1 relative overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={page}
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            transition={pageTransition}
            className="absolute inset-0"
          >
            {page === "swipe" && <Swipe />}
            {page === "saved" && <Saved />}
            {page === "profile" && <Profile />}
            {page === "challenges" && <Challenges />}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
