import React, { useState, useEffect } from "react";
import { useXPStore } from "../store/xpStore";
import { jobs } from "../data/jobs";
import confetti from "canvas-confetti";

export default function JobLottery() {
  const [isSpinning, setIsSpinning] = useState(false);
  const [dailyChallenge, setDailyChallenge] = useState(null);
  const [lotteryResult, setLotteryResult] = useState(null);
  const [canSpin, setCanSpin] = useState(true);
  const { addXP, saveJob } = useXPStore();

  const challenges = [
    { id: 1, task: "Swipe 10 jobs", reward: 50, icon: "🎯", progress: 0, target: 10 },
    { id: 2, task: "Save 3 jobs", reward: 75, icon: "💾", progress: 0, target: 3 },
    { id: 3, task: "Chat with Zara 5 times", reward: 40, icon: "💬", progress: 0, target: 5 },
    { id: 4, task: "Use voice commands", reward: 30, icon: "🎤", progress: 0, target: 1 },
    { id: 5, task: "Complete profile", reward: 100, icon: "👤", progress: 0, target: 1 }
  ];

  useEffect(() => {
    // Set daily challenge
    const today = new Date().getDate();
    const challenge = challenges[today % challenges.length];
    setDailyChallenge(challenge);

    // Check if user can spin (once per hour)
    const lastSpin = localStorage.getItem('lastLotterySpin');
    const now = Date.now();
    if (lastSpin && now - parseInt(lastSpin) < 3600000) { // 1 hour
      setCanSpin(false);
    }
  }, []);

  const spinLottery = () => {
    if (!canSpin) return;
    
    setIsSpinning(true);
    setCanSpin(false);
    localStorage.setItem('lastLotterySpin', Date.now().toString());
    
    setTimeout(() => {
      const prizes = [
        { type: 'xp', amount: 100, text: '100 XP Bonus!', icon: '⚡' },
        { type: 'xp', amount: 200, text: '200 XP Jackpot!', icon: '💎' },
        { type: 'job', job: jobs[Math.floor(Math.random() * jobs.length)], text: 'Premium Job Match!', icon: '🎁' },
        { type: 'multiplier', amount: 2, text: '2x XP for 1 hour!', icon: '🚀' },
        { type: 'badge', name: 'Lucky Winner', text: 'Special Badge!', icon: '🏆' }
      ];
      
      const prize = prizes[Math.floor(Math.random() * prizes.length)];
      
      if (prize.type === 'xp') {
        addXP(prize.amount);
      } else if (prize.type === 'job') {
        saveJob(prize.job);
      }
      
      setLotteryResult(prize);
      setIsSpinning(false);
      
      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4']
      });
      
      setTimeout(() => setLotteryResult(null), 4000);
    }, 3000);
  };

  return (
    <div className="space-y-4">
      {/* Daily Challenge */}
      {dailyChallenge && (
        <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-2xl p-4 border border-yellow-500/30">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-2xl">{dailyChallenge.icon}</span>
            <div>
              <h3 className="font-semibold text-white">Daily Challenge</h3>
              <p className="text-yellow-300 text-sm">{dailyChallenge.task}</p>
            </div>
            <div className="ml-auto text-right">
              <div className="text-yellow-400 font-bold">+{dailyChallenge.reward} XP</div>
            </div>
          </div>
          
          <div className="w-full bg-slate-700 rounded-full h-2">
            <div 
              className="h-2 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full transition-all duration-500"
              style={{ width: `${(dailyChallenge.progress / dailyChallenge.target) * 100}%` }}
            />
          </div>
          <div className="text-xs text-slate-400 mt-1">
            {dailyChallenge.progress}/{dailyChallenge.target} completed
          </div>
        </div>
      )}

      {/* Job Lottery */}
      <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-2xl p-6 border border-purple-500/30 text-center">
        <h3 className="font-semibold text-white mb-4 flex items-center justify-center gap-2">
          🎰 Job Lottery
        </h3>
        
        <div className="relative mb-6">
          <div className={`w-32 h-32 mx-auto rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-4xl ${
            isSpinning ? 'animate-spin' : ''
          }`}>
            {isSpinning ? '🌟' : '🎲'}
          </div>
          
          {isSpinning && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-40 h-40 border-4 border-purple-400 rounded-full animate-ping opacity-30" />
            </div>
          )}
        </div>
        
        <button
          onClick={spinLottery}
          disabled={!canSpin || isSpinning}
          className={`px-6 py-3 rounded-xl font-semibold transition-all ${
            canSpin && !isSpinning
              ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 shadow-lg'
              : 'bg-slate-600 text-slate-400 cursor-not-allowed'
          }`}
        >
          {isSpinning ? 'Spinning...' : canSpin ? 'Spin for Prizes!' : 'Next spin in 1 hour'}
        </button>
        
        <p className="text-xs text-slate-400 mt-2">
          Win XP, jobs, badges, and multipliers!
        </p>
      </div>

      {/* Lottery Result */}
      {lotteryResult && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-3xl p-8 text-center max-w-sm mx-4 shadow-2xl">
            <div className="text-6xl mb-4">{lotteryResult.icon}</div>
            <h3 className="text-2xl font-bold text-white mb-2">You Won!</h3>
            <p className="text-white text-lg">{lotteryResult.text}</p>
            {lotteryResult.job && (
              <div className="mt-4 p-3 bg-white/20 rounded-xl">
                <p className="text-white font-medium">{lotteryResult.job.title}</p>
                <p className="text-white/80 text-sm">{lotteryResult.job.company}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}