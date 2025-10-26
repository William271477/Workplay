import React, { useState, useEffect } from "react";
import { jobs } from "../data/jobs";

export default function MoodMatcher({ onMoodJobs }) {
  const [currentMood, setCurrentMood] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audio, setAudio] = useState(null);

  const moods = [
    { 
      emoji: "🚀", 
      name: "Ambitious", 
      color: "from-red-500 to-orange-500",
      jobs: ["DevOps Engineer", "Product Manager", "Software Engineer"],
      sound: "data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT"
    },
    { 
      emoji: "😌", 
      name: "Balanced", 
      color: "from-green-500 to-blue-500",
      jobs: ["UX Designer", "Marketing Specialist", "Customer Success"],
      sound: "data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT"
    },
    { 
      emoji: "🎯", 
      name: "Focused", 
      color: "from-purple-500 to-pink-500",
      jobs: ["Data Scientist", "Frontend Developer", "Mobile Developer"],
      sound: "data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT"
    },
    { 
      emoji: "💼", 
      name: "Professional", 
      color: "from-gray-600 to-gray-800",
      jobs: ["Sales Representative", "Software Engineer", "Product Manager"],
      sound: "data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT"
    }
  ];

  const playMoodSound = (mood) => {
    // Create a simple beep sound based on mood
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    const frequencies = { "🚀": 800, "😌": 400, "🎯": 600, "💼": 300 };
    oscillator.frequency.setValueAtTime(frequencies[mood.emoji], audioContext.currentTime);
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.5);
  };

  const selectMood = (mood) => {
    setCurrentMood(mood);
    playMoodSound(mood);
    
    // Filter jobs based on mood
    const moodJobs = jobs.filter(job => 
      mood.jobs.some(moodJob => job.title.includes(moodJob))
    );
    
    onMoodJobs(moodJobs);
    
    // Auto-hide after 3 seconds
    setTimeout(() => setCurrentMood(null), 3000);
  };

  return (
    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-40">
      {!currentMood ? (
        <div className="flex gap-2 bg-slate-800/90 backdrop-blur-lg rounded-full p-2 border border-slate-700">
          {moods.map((mood, i) => (
            <button
              key={i}
              onClick={() => selectMood(mood)}
              className={`w-12 h-12 rounded-full bg-gradient-to-r ${mood.color} flex items-center justify-center text-xl hover:scale-110 transition-transform shadow-lg`}
              title={`${mood.name} Jobs`}
            >
              {mood.emoji}
            </button>
          ))}
        </div>
      ) : (
        <div className={`bg-gradient-to-r ${currentMood.color} rounded-2xl p-4 text-white shadow-2xl animate-pulse`}>
          <div className="text-center">
            <div className="text-3xl mb-2">{currentMood.emoji}</div>
            <div className="font-semibold">{currentMood.name} Mode</div>
            <div className="text-sm opacity-90">Finding {currentMood.name.toLowerCase()} jobs...</div>
          </div>
        </div>
      )}
    </div>
  );
}