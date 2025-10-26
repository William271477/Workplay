import React, { useState, useEffect } from "react";
import { useXPStore } from "../store/xpStore";

export default function VoiceControl({ onCommand }) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [recognition, setRecognition] = useState(null);
  const { addXP } = useXPStore();

  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognitionInstance = new SpeechRecognition();
      
      recognitionInstance.continuous = true;
      recognitionInstance.interimResults = true;
      recognitionInstance.lang = 'en-ZA'; // South African English
      
      recognitionInstance.onresult = (event) => {
        const current = event.resultIndex;
        const transcript = event.results[current][0].transcript.toLowerCase();
        setTranscript(transcript);
        
        // Voice commands
        if (transcript.includes('save job') || transcript.includes('like this')) {
          onCommand('save');
          addXP(5);
        } else if (transcript.includes('skip') || transcript.includes('next job')) {
          onCommand('skip');
        } else if (transcript.includes('open chat') || transcript.includes('help me')) {
          onCommand('chat');
        } else if (transcript.includes('show profile')) {
          onCommand('profile');
        } else if (transcript.includes('show saved jobs')) {
          onCommand('saved');
        }
      };
      
      recognitionInstance.onerror = () => setIsListening(false);
      recognitionInstance.onend = () => setIsListening(false);
      
      setRecognition(recognitionInstance);
    }
  }, [onCommand, addXP]);

  const toggleListening = () => {
    if (!recognition) return;
    
    if (isListening) {
      recognition.stop();
      setIsListening(false);
    } else {
      recognition.start();
      setIsListening(true);
    }
  };

  return (
    <div className="fixed bottom-40 left-6 z-40">
      <button
        onClick={toggleListening}
        className={`w-14 h-14 rounded-full shadow-2xl flex items-center justify-center text-2xl transition-all ${
          isListening 
            ? 'bg-gradient-to-r from-red-500 to-pink-500 animate-pulse' 
            : 'bg-gradient-to-r from-blue-500 to-purple-500 hover:scale-110'
        }`}
      >
        {isListening ? '🔴' : '🎤'}
      </button>
      
      {transcript && (
        <div className="absolute bottom-16 left-0 bg-black/90 text-white p-2 rounded-lg text-xs max-w-32">
          "{transcript}"
        </div>
      )}
      
      {isListening && (
        <div className="absolute -top-2 -right-2 w-4 h-4 bg-red-500 rounded-full animate-ping" />
      )}
    </div>
  );
}