import React, { useState } from "react";

export default function Login({ onLogin }) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "", name: "" });

  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin(formData.name || formData.email.split('@')[0]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-4xl shadow-2xl">
            🎮
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            WorkPlay
          </h1>
          <p className="text-slate-400 mt-2">Gamify your job search journey</p>
        </div>

        {/* Form */}
        <div className="bg-slate-800/50 backdrop-blur-lg rounded-3xl p-8 border border-slate-700/50">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">
            {isSignUp ? "Join WorkPlay" : "Welcome Back"}
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignUp && (
              <input
                type="text"
                placeholder="Full Name"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full p-4 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:border-purple-500 focus:outline-none"
                required
              />
            )}
            
            <input
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              className="w-full p-4 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:border-purple-500 focus:outline-none"
              required
            />
            
            <input
              type="password"
              placeholder="Password"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              className="w-full p-4 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:border-purple-500 focus:outline-none"
              required
            />
            
            <button
              type="submit"
              className="w-full py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all shadow-lg"
            >
              {isSignUp ? "Start Your Journey" : "Continue Playing"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-purple-400 hover:text-purple-300 text-sm"
            >
              {isSignUp ? "Already have an account? Sign in" : "New to WorkPlay? Sign up"}
            </button>
          </div>

          {/* Demo Button */}
          <div className="mt-4 text-center">
            <button
              onClick={() => onLogin("Demo User")}
              className="text-slate-400 hover:text-white text-sm underline"
            >
              Continue as Demo User
            </button>
          </div>
        </div>

        {/* Features */}
        <div className="mt-8 grid grid-cols-3 gap-4 text-center">
          <div className="text-slate-400">
            <div className="text-2xl mb-1">🎯</div>
            <div className="text-xs">Smart Matching</div>
          </div>
          <div className="text-slate-400">
            <div className="text-2xl mb-1">🏆</div>
            <div className="text-xs">Earn XP & Badges</div>
          </div>
          <div className="text-slate-400">
            <div className="text-2xl mb-1">🚀</div>
            <div className="text-xs">Career Growth</div>
          </div>
        </div>
      </div>
    </div>
  );
}