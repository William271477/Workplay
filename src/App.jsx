import React, { useState } from "react";

export default function App() {
  const [page, setPage] = useState("swipe");

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Simple Navbar */}
      <nav className="bg-slate-800 p-4">
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-xl">
              🎮
            </div>
            <span className="text-xl font-bold">WorkPlay</span>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={() => setPage("swipe")}
              className={`px-4 py-2 rounded-lg ${page === "swipe" ? "bg-purple-600" : "bg-slate-700"}`}
            >
              Home
            </button>
            <button 
              onClick={() => setPage("saved")}
              className={`px-4 py-2 rounded-lg ${page === "saved" ? "bg-purple-600" : "bg-slate-700"}`}
            >
              Saved
            </button>
            <button 
              onClick={() => setPage("profile")}
              className={`px-4 py-2 rounded-lg ${page === "profile" ? "bg-purple-600" : "bg-slate-700"}`}
            >
              Profile
            </button>
          </div>
        </div>
      </nav>

      {/* Simple Content */}
      <main className="p-8">
        {page === "swipe" && (
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-4">Discover Jobs</h1>
            <div className="max-w-sm mx-auto bg-white text-black p-6 rounded-2xl">
              <div className="text-2xl mb-2">🛒</div>
              <h3 className="text-xl font-bold">Frontend Developer</h3>
              <p className="text-gray-600">Takealot • Cape Town</p>
              <p className="text-green-600 font-bold">R45k - R65k</p>
              <p className="mt-2 text-sm">Build amazing e-commerce experiences with React.</p>
            </div>
          </div>
        )}
        {page === "saved" && (
          <div className="text-center">
            <h1 className="text-3xl font-bold">Saved Jobs</h1>
            <p className="text-slate-400 mt-2">No saved jobs yet</p>
          </div>
        )}
        {page === "profile" && (
          <div className="text-center">
            <h1 className="text-3xl font-bold">Profile</h1>
            <p className="text-slate-400 mt-2">Level 0 • 0 XP</p>
          </div>
        )}
      </main>
    </div>
  );
}
