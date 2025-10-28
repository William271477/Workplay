import React, { useState } from 'react';

export default function ShareJob({ job, onShare }) {
  const [showShare, setShowShare] = useState(false);

  const shareJob = (platform) => {
    const jobUrl = `${window.location.origin}?job=${job.id}`;
    const text = `Check out this ${job.title} position at ${job.company}! ${job.salary} in ${job.location}`;
    
    const urls = {
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(jobUrl)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(jobUrl)}`,
      whatsapp: `https://wa.me/?text=${encodeURIComponent(text + ' ' + jobUrl)}`,
      copy: jobUrl
    };

    if (platform === 'copy') {
      navigator.clipboard.writeText(urls.copy);
      onShare?.('Link copied!');
    } else {
      window.open(urls[platform], '_blank');
      onShare?.(`Shared to ${platform}`);
    }
    
    setShowShare(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setShowShare(!showShare)}
        className="px-3 py-1 bg-purple-600/20 text-purple-400 rounded-lg text-sm hover:bg-purple-600/30 transition-colors"
      >
        📤 Share
      </button>

      {showShare && (
        <div className="absolute top-full right-0 mt-2 bg-slate-800 border border-slate-700 rounded-lg shadow-xl z-50 min-w-48">
          <div className="p-2">
            <button
              onClick={() => shareJob('twitter')}
              className="w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-slate-700 rounded-lg transition-colors"
            >
              🐦 Twitter
            </button>
            <button
              onClick={() => shareJob('linkedin')}
              className="w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-slate-700 rounded-lg transition-colors"
            >
              💼 LinkedIn
            </button>
            <button
              onClick={() => shareJob('whatsapp')}
              className="w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-slate-700 rounded-lg transition-colors"
            >
              💬 WhatsApp
            </button>
            <button
              onClick={() => shareJob('copy')}
              className="w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-slate-700 rounded-lg transition-colors"
            >
              📋 Copy Link
            </button>
          </div>
        </div>
      )}
    </div>
  );
}