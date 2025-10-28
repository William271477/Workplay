import React from 'react';

export default function QuickStats({ xp, saved, applied, streak }) {
  const level = Math.floor(xp / 100);
  const xpToNext = 100 - (xp % 100);
  const successRate = saved.length > 0 ? Math.round((applied.length / saved.length) * 100) : 0;

  const stats = [
    {
      icon: '🏆',
      label: 'Level',
      value: level,
      subtext: `${xpToNext} XP to next`,
      color: 'text-yellow-400'
    },
    {
      icon: '🔥',
      label: 'Streak',
      value: streak,
      subtext: 'days active',
      color: 'text-orange-400'
    },
    {
      icon: '💾',
      label: 'Saved',
      value: saved.length,
      subtext: 'jobs saved',
      color: 'text-green-400'
    },
    {
      icon: '📄',
      label: 'Applied',
      value: applied.length,
      subtext: `${successRate}% rate`,
      color: 'text-blue-400'
    }
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {stats.map((stat, index) => (
        <div key={index} className="bg-slate-800/30 rounded-lg p-4 border border-slate-700/50">
          <div className="flex items-center justify-between mb-2">
            <span className="text-2xl">{stat.icon}</span>
            <span className={`text-2xl font-bold ${stat.color}`}>
              {stat.value}
            </span>
          </div>
          <div className="text-sm text-slate-400">
            <div className="font-medium">{stat.label}</div>
            <div className="text-xs">{stat.subtext}</div>
          </div>
        </div>
      ))}
    </div>
  );
}