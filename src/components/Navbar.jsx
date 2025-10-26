import React from "react";

export default function Navbar({ page, setPage }) {
  return (
    <nav className="bg-slate-800/60 backdrop-blur sticky top-0 z-10">
      <div className="container flex items-center justify-between h-14">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-md bg-gradient-to-br from-purple-600 to-indigo-500 flex items-center justify-center font-bold">
            WP
          </div>
          <div className="text-white font-semibold">WorkPlay</div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setPage("swipe")}
            className={`px-3 py-1 rounded ${
              page === "swipe" ? "bg-primary text-white" : ""
            } hover:bg-primary/90`}
          >
            Home
          </button>
          <button
            onClick={() => setPage("saved")}
            className={`px-3 py-1 rounded ${
              page === "saved" ? "bg-primary text-white" : ""
            } hover:bg-primary/90`}
          >
            Saved
          </button>
          <button
            onClick={() => setPage("profile")}
            className={`px-3 py-1 rounded ${
              page === "profile" ? "bg-primary text-white" : ""
            } hover:bg-primary/90`}
          >
            Profile
          </button>
        </div>
      </div>
    </nav>
  );
}
