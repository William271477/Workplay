import React, { useState, useEffect } from "react";
import { useXPStore } from "../store/xpStore";

export default function NotificationSystem() {
  const [notifications, setNotifications] = useState([]);
  const { xp, streak, saved } = useXPStore();

  useEffect(() => {
    const addNotification = (type, message, icon) => {
      const id = Date.now();
      const notification = { id, type, message, icon, timestamp: new Date() };
      
      setNotifications(prev => [notification, ...prev.slice(0, 4)]);
      
      // Auto remove after 4 seconds
      setTimeout(() => {
        setNotifications(prev => prev.filter(n => n.id !== id));
      }, 4000);
    };

    // Level up notifications
    const level = Math.floor(xp / 100);
    if (level > 0 && xp % 100 < 25) {
      addNotification('success', `🎉 Level ${level} unlocked! You're on fire!`, '🆙');
    }

    // Streak notifications
    if (streak > 0 && streak % 3 === 0) {
      addNotification('achievement', `🔥 ${streak}-day streak! Keep it going!`, '⚡');
    }

    // Job recommendations
    if (saved.length > 0 && saved.length % 3 === 0) {
      addNotification('info', `💼 ${saved.length} jobs saved! Ready to apply?`, '📈');
    }

    // Daily motivation (simulate)
    const hour = new Date().getHours();
    if (hour === 9 || hour === 14) {
      const motivations = [
        "💪 Your dream job is just one swipe away!",
        "🚀 Keep building your career momentum!",
        "⭐ Every application gets you closer to success!"
      ];
      addNotification('motivation', motivations[Math.floor(Math.random() * motivations.length)], '💫');
    }
  }, [xp, streak, saved]);

  const shareProgress = () => {
    const level = Math.floor(xp / 100);
    const text = `🎮 Just reached Level ${level} on WorkPlay! ${saved.length} jobs saved and counting. Gamifying my job search! #WorkPlay #CareerGrowth`;
    
    if (navigator.share) {
      navigator.share({
        title: 'WorkPlay Progress',
        text: text,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(text);
      setNotifications(prev => [{
        id: Date.now(),
        type: 'success',
        message: '📋 Progress copied to clipboard!',
        icon: '✅',
        timestamp: new Date()
      }, ...prev.slice(0, 4)]);
    }
  };

  return (
    <>
      {/* Notifications Stack */}
      <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className={`p-4 rounded-2xl shadow-2xl backdrop-blur-lg border animate-slide-in ${
              notification.type === 'success' ? 'bg-green-500/90 border-green-400' :
              notification.type === 'achievement' ? 'bg-purple-500/90 border-purple-400' :
              notification.type === 'info' ? 'bg-blue-500/90 border-blue-400' :
              'bg-orange-500/90 border-orange-400'
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">{notification.icon}</span>
              <div className="flex-1">
                <p className="text-white text-sm font-medium">{notification.message}</p>
                <p className="text-white/70 text-xs">
                  {notification.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Share Button */}
      <button
        onClick={shareProgress}
        className="fixed bottom-24 right-6 w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full shadow-lg flex items-center justify-center text-xl hover:scale-110 transition-transform z-40"
        title="Share Progress"
      >
        📤
      </button>

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes slide-in {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }
      `}</style>
    </>
  );
}