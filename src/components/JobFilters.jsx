import React, { useState } from 'react';

export default function JobFilters({ onFilter, jobCount }) {
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    location: 'all',
    salary: 'all',
    type: 'all'
  });

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilter(newFilters);
  };

  return (
    <div className="mb-6">
      <button
        onClick={() => setShowFilters(!showFilters)}
        className="flex items-center gap-2 px-4 py-2 bg-slate-800/50 text-white rounded-lg hover:bg-slate-700/50 transition-colors"
      >
        🎯 Filters ({jobCount} jobs)
        <span className={`transform transition-transform ${showFilters ? 'rotate-180' : ''}`}>
          ▼
        </span>
      </button>

      {showFilters && (
        <div className="mt-4 p-4 bg-slate-800/30 rounded-lg border border-slate-700/50">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Location Filter */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Location</label>
              <select
                value={filters.location}
                onChange={(e) => handleFilterChange('location', e.target.value)}
                className="w-full p-2 bg-slate-700 border border-slate-600 rounded-lg text-white"
              >
                <option value="all">All Locations</option>
                <option value="cape town">Cape Town</option>
                <option value="johannesburg">Johannesburg</option>
                <option value="durban">Durban</option>
                <option value="remote">Remote</option>
              </select>
            </div>

            {/* Salary Filter */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Salary Range</label>
              <select
                value={filters.salary}
                onChange={(e) => handleFilterChange('salary', e.target.value)}
                className="w-full p-2 bg-slate-700 border border-slate-600 rounded-lg text-white"
              >
                <option value="all">All Salaries</option>
                <option value="0-30">R0k - R30k</option>
                <option value="30-50">R30k - R50k</option>
                <option value="50-70">R50k - R70k</option>
                <option value="70+">R70k+</option>
              </select>
            </div>

            {/* Job Type Filter */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Job Type</label>
              <select
                value={filters.type}
                onChange={(e) => handleFilterChange('type', e.target.value)}
                className="w-full p-2 bg-slate-700 border border-slate-600 rounded-lg text-white"
              >
                <option value="all">All Types</option>
                <option value="tech">Tech</option>
                <option value="finance">Finance</option>
                <option value="marketing">Marketing</option>
                <option value="sales">Sales</option>
              </select>
            </div>
          </div>

          <button
            onClick={() => {
              setFilters({ location: 'all', salary: 'all', type: 'all' });
              onFilter({ location: 'all', salary: 'all', type: 'all' });
            }}
            className="mt-4 px-4 py-2 bg-red-600/20 text-red-400 rounded-lg hover:bg-red-600/30 transition-colors"
          >
            Clear Filters
          </button>
        </div>
      )}
    </div>
  );
}