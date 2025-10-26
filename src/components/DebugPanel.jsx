import React, { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import * as fb from '../lib/firebase'
import { useXPStore } from '../store/xpStore'

export default function DebugPanel(){
  const { user } = useAuth()
  const saved = useXPStore((s) => s.saved)
  const [remote, setRemote] = useState(null)
  const [loading, setLoading] = useState(false)

  async function fetchRemote(){
    if(!user) return;
    setLoading(true)
    try{
      const docs = await fb.fetchSavedJobsOnce(user.uid)
      setRemote(docs)
    }catch(e){
      setRemote({ error: String(e) })
    }finally{ setLoading(false) }
  }

  return (
    <div className="mt-6 bg-slate-800/40 p-4 rounded">
      <div className="flex items-center justify-between mb-2">
        <div className="text-sm text-slate-300">Debug Panel</div>
        <div className="text-xs text-slate-400">Firestore: {fb.isFirestoreReady() ? 'ready' : 'not ready'}</div>
      </div>

      <div className="text-xs text-slate-300 mb-2">Local saved ({saved.length})</div>
      <pre className="text-xs text-slate-200 max-h-40 overflow-auto p-2 bg-slate-900/40 rounded">{JSON.stringify(saved,null,2)}</pre>

      <div className="mt-3">
        <button onClick={fetchRemote} disabled={!user || loading} className="px-3 py-1 rounded bg-primary text-white text-sm">Fetch remote</button>
      </div>

      {remote && (
        <div className="mt-3 text-xs">
          <div className="text-slate-300 mb-1">Remote snapshot</div>
          <pre className="text-xs text-slate-200 max-h-40 overflow-auto p-2 bg-slate-900/40 rounded">{JSON.stringify(remote,null,2)}</pre>
        </div>
      )}
    </div>
  )
}
