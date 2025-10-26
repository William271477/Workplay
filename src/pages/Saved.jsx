import React from 'react'
import { useXPStore } from '../store/xpStore'
import JobCard from '../components/JobCard'

export default function Saved(){
  const saved = useXPStore((s) => s.saved)
  const removeSaved = useXPStore((s) => s.removeSaved)

  return (
    <div className="container py-8">
      <h2 className="text-2xl font-semibold mb-2">Saved jobs</h2>
      <p className="text-slate-300 mb-4">Jobs you liked are saved here.</p>

      <div className="grid gap-4">
        {saved.length === 0 ? (
          <div className="text-slate-300">No saved jobs yet. Swipe to find matches!</div>
        ) : (
          saved.map(j => (
            <div key={j.id} className="flex items-center justify-between gap-4 bg-slate-800/60 p-4 rounded-lg">
              <div className="flex-1"><JobCard job={j} /></div>
              <div>
                <button onClick={() => removeSaved(j.id)} className="px-3 py-2 bg-red-600 rounded">Remove</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
