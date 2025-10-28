import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';

export default function DailyRewards({ onClaimReward }) {
  const [lastClaim, setLastClaim] = useState(null);
  const [canClaim, setCanClaim] = useState(false);
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    const stored = localStorage.getItem('workplay_daily_reward');
    if (stored) {
      const data = JSON.parse(stored);
      setLastClaim(new Date(data.lastClaim));
      setStreak(data.streak || 0);
    }
    checkCanClaim();
  }, []);

  const checkCanClaim = () => {
    const stored = localStorage.getItem('workplay_daily_reward');
    if (!stored) {
      setCanClaim(true);
      return;
    }

    const data = JSON.parse(stored);
    const lastClaim = new Date(data.lastClaim);
    const now = new Date();
    const timeDiff = now.getTime() - lastClaim.getTime();
    const hoursDiff = timeDiff / (1000 * 3600);

    setCanClaim(hoursDiff >= 24);
  };

  const claimReward = () => {
    if (!canClaim) return;

    const newStreak = streak + 1;
    const reward = Math.min(50 + (newStreak * 10), 200); // Max 200 XP

    // Save claim data
    localStorage.setItem('workplay_daily_reward', JSON.stringify({
      lastClaim: new Date().toISOString(),
      streak: newStreak
    }));

    setLastClaim(new Date());
    setStreak(newStreak);
    setCanClaim(false);

    // Trigger confetti
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 }
    });

    onClaimReward(reward);
  };

  const getNextRewardTime = () => {
    if (!lastClaim) return null;
    const nextClaim = new Date(lastClaim.getTime() + 24 * 60 * 60 * 1000);
    return nextClaim;
  };

  const getTimeUntilNext = () => {
    const next = getNextRewardTime();
    if (!next) return null;
    
    const now = new Date();
    const diff = next.getTime() - now.getTime();
    
    if (diff <= 0) return null;
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    return `${hours}h ${minutes}m`;
  };

  return (
    <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-4 mb-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-amber-700 flex items-center gap-2">
            🎁 Daily Reward
          </h3>
          <p className="text-sm text-gray-600">
            {canClaim 
              ? `Claim ${Math.min(50 + (streak * 10), 200)} XP • ${streak} day streak`
              : `Next reward in ${getTimeUntilNext() || '24h'}`
            }
          </p>
        </div>
        <button
          onClick={claimReward}
          disabled={!canClaim}
          className={`px-6 py-3 rounded-xl font-bold transition-all ${
            canClaim
              ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:scale-105 shadow-lg'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
        >
          {canClaim ? 'Claim!' : 'Claimed'}
        </button>
      </div>
    </div>
  );
}