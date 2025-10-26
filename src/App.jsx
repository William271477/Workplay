import React, { useState } from "react";
import Navbar from "./components/Navbar";
import Swipe from "./pages/Swipe";
import Profile from "./pages/Profile";
import Challenges from "./pages/Challenges";
import Saved from "./pages/Saved";

export default function App() {
  const [page, setPage] = useState("swipe");

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar page={page} setPage={setPage} />

      <main className="flex-1">
        {page === "swipe" && <Swipe />}
        {page === "saved" && <Saved />}
        {page === "profile" && <Profile />}
        {page === "challenges" && <Challenges />}
      </main>
    </div>
  );
}
