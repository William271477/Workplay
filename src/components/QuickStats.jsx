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
      color: 'text-amber-600',
      bg: 'bg-amber-50',
      border: 'border-amber-200'
    },
    {
      icon: '🔥',
      label: 'Streak',
      value: streak,
      subtext: 'days active',
      color: 'text-orange-600',
      bg: 'bg-orange-50',
      border: 'border-orange-200'
    },
    {
      icon: '💾',
      label: 'Saved',
      value: saved.length,
      subtext: 'jobs saved',
      color: 'text-emerald-600',
      bg: 'bg-emerald-50',
      border: 'border-emerald-200'
    },
    {
      icon: '📄',
      label: 'Applied',
      value: applied.length,
      subtext: `${successRate}% rate`,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
      border: 'border-blue-200'
    }
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {stats.map((stat, index) => (
        <div key={index} className={`${stat.bg} rounded-xl p-4 border ${stat.border} shadow-sm`}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-2xl">{stat.icon}</span>
            <span className={`text-2xl font-bold ${stat.color}`}>
              {stat.value}
            </span>
          </div>
          <div className="text-sm text-gray-600">
            <div className="font-medium">{stat.label}</div>
            <div className="text-xs text-gray-500">{stat.subtext}</div>
          </div>
        </div>
      ))}
    </div>
  );
}