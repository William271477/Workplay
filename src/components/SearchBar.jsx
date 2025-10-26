import React from 'react';
import { useXPStore } from '../store/xpStore';

export default function SearchBar() {
  const { searchQuery, setSearchQuery } = useXPStore();

  return (
    <div className="relative mb-6">
      <input
        type="text"
        placeholder="Search jobs by title, company, or location..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full px-4 py-3 pl-12 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
      />
      <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
        🔍
      </div>
    </div>
  );
}