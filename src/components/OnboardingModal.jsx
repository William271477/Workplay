import React from "react";

export default function OnboardingModal({ open, onClose }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="bg-slate-900 text-white rounded-2xl max-w-md w-full p-6 shadow-2xl">
        <h3 className="text-xl font-bold mb-2">How to Swipe</h3>
        <p className="text-slate-300 mb-4">
          Use the cards to browse jobs. Tip:
        </p>
        <ul className="list-disc list-inside text-slate-300 space-y-2 mb-4">
          <li>Swipe right to express interest (save)</li>
          <li>Swipe left to skip</li>
          <li>Swipe up to save with bonus XP</li>
          <li>Tap Save or Skip buttons for accessibility</li>
        </ul>
        <div className="flex gap-2 justify-end">
          <button
            onClick={() => {
              localStorage.setItem("workplay_onboard_seen", "1");
              onClose();
            }}
            className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-500 rounded"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
}
