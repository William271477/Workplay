import React, { useState, useRef, useEffect } from "react";
import { useXPStore } from "../store/xpStore";

const botResponses = {
  greeting: [
    "Hi! I'm Zara, your AI career coach! 🚀 How can I help you level up your job search today?",
    "Hey there! Ready to unlock your career potential? I'm here to guide you! ✨"
  ],
  cv: [
    "Great question! For SA employers, focus on: 1) Skills-based format 2) Include your ID number 3) Add languages spoken 4) Keep it 2 pages max. Want me to review yours? 📄",
    "CV tips for SA market: Highlight tech skills, include volunteer work, mention any coding bootcamps or online courses. Stand out! 💪"
  ],
  interview: [
    "Interview prep time! 🎯 Practice these SA favorites: 'Tell me about yourself', 'Why do you want this role?', 'What's your salary expectation?' Want mock questions?",
    "Pro tip: Research the company's BEE status and values. Show you understand SA business culture! 🇿🇦"
  ],
  salary: [
    "SA salary negotiation: Research PayScale/Glassdoor, know the market rate, consider benefits package. Entry level dev: R25-45k, experienced: R45-80k+ 💰",
    "Don't forget to factor in medical aid, pension, and learning opportunities when evaluating offers! 📈"
  ],
  skills: [
    "Hot skills in SA right now: React/Angular, Python, AWS, Data Science, Digital Marketing. FreeCodeCamp and Coursera have great free courses! 🔥",
    "Focus on skills that solve real SA problems: fintech, e-commerce, mobile-first development. That's where the jobs are! 📱"
  ],
  motivation: [
    "You've got this! 💪 Every 'no' gets you closer to your 'yes'. Keep swiping, keep learning, keep growing. Your dream job is out there!",
    "Remember: You're not just job hunting, you're building your future! Each application is practice, each interview is growth. Stay strong! 🌟"
  ],
  default: [
    "That's interesting! I can help with CV tips, interview prep, salary advice, skill development, or just motivation. What would you like to explore? 🤔",
    "I'm here to help with your career journey! Try asking about CVs, interviews, salaries, or skills development. What's on your mind? 💭"
  ]
};

export default function ChatBot({ isOpen, onClose }) {
  const [messages, setMessages] = useState([
    { type: "bot", text: "Hi! I'm Zara, your AI career coach! 🚀 How can I help you level up your job search today?" }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const { addXP } = useXPStore();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getResponse = (message) => {
    const msg = message.toLowerCase();
    if (msg.includes("hi") || msg.includes("hello") || msg.includes("hey")) {
      return botResponses.greeting[Math.floor(Math.random() * botResponses.greeting.length)];
    }
    if (msg.includes("cv") || msg.includes("resume")) {
      return botResponses.cv[Math.floor(Math.random() * botResponses.cv.length)];
    }
    if (msg.includes("interview")) {
      return botResponses.interview[Math.floor(Math.random() * botResponses.interview.length)];
    }
    if (msg.includes("salary") || msg.includes("money") || msg.includes("pay")) {
      return botResponses.salary[Math.floor(Math.random() * botResponses.salary.length)];
    }
    if (msg.includes("skill") || msg.includes("learn") || msg.includes("course")) {
      return botResponses.skills[Math.floor(Math.random() * botResponses.skills.length)];
    }
    if (msg.includes("help") || msg.includes("motivat") || msg.includes("discourag") || msg.includes("hard")) {
      return botResponses.motivation[Math.floor(Math.random() * botResponses.motivation.length)];
    }
    return botResponses.default[Math.floor(Math.random() * botResponses.default.length)];
  };

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage = { type: "user", text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);
    addXP(2); // Small XP for engagement

    setTimeout(() => {
      const botResponse = { type: "bot", text: getResponse(input) };
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000);
  };

  const quickActions = [
    { text: "CV tips", emoji: "📄" },
    { text: "Interview help", emoji: "🎯" },
    { text: "Salary advice", emoji: "💰" },
    { text: "Skill development", emoji: "🚀" }
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-end md:items-center justify-center z-50 p-4">
      <div className="bg-slate-800 rounded-t-3xl md:rounded-3xl w-full max-w-md h-[80vh] md:h-[600px] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-xl">
              🤖
            </div>
            <div>
              <h3 className="font-semibold text-white">Zara AI</h3>
              <p className="text-xs text-green-400">● Online</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white text-xl">
            ✕
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.type === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[80%] p-3 rounded-2xl ${
                msg.type === "user" 
                  ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white" 
                  : "bg-slate-700 text-slate-100"
              }`}>
                <p className="text-sm">{msg.text}</p>
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-slate-700 p-3 rounded-2xl">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Actions */}
        <div className="p-4 border-t border-slate-700">
          <div className="grid grid-cols-2 gap-2 mb-4">
            {quickActions.map((action, i) => (
              <button
                key={i}
                onClick={() => {
                  setInput(action.text);
                  handleSend();
                }}
                className="p-2 bg-slate-700/50 rounded-xl text-xs text-slate-300 hover:bg-slate-600/50 transition-colors flex items-center gap-2"
              >
                <span>{action.emoji}</span>
                <span>{action.text}</span>
              </button>
            ))}
          </div>

          {/* Input */}
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSend()}
              placeholder="Ask me anything about your career..."
              className="flex-1 p-3 bg-slate-700 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <button
              onClick={handleSend}
              className="px-4 py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl text-white hover:from-purple-600 hover:to-pink-600 transition-colors"
            >
              ➤
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}