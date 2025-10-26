import React, { useState, useRef } from "react";

export default function ARJobPreview({ job, onClose }) {
  const [isRecording, setIsRecording] = useState(false);
  const videoRef = useRef(null);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.log("Camera not available");
    }
  };

  React.useEffect(() => {
    startCamera();
    return () => {
      if (videoRef.current?.srcObject) {
        videoRef.current.srcObject.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col">
      {/* Camera View */}
      <div className="flex-1 relative">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          className="w-full h-full object-cover"
        />
        
        {/* AR Overlay */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="bg-black/80 backdrop-blur-lg rounded-3xl p-6 m-4 max-w-sm border border-purple-500/50">
            <div className="text-center text-white">
              <div className="text-4xl mb-4">{job.logo}</div>
              <h3 className="text-xl font-bold mb-2">{job.title}</h3>
              <p className="text-purple-300 mb-2">{job.company}</p>
              <p className="text-green-400 font-semibold mb-4">{job.salary}</p>
              
              {/* 3D-like buttons */}
              <div className="flex gap-3">
                <button className="flex-1 py-3 bg-gradient-to-b from-red-500 to-red-600 rounded-xl font-medium shadow-lg transform hover:scale-105 transition-transform">
                  👎 Pass
                </button>
                <button className="flex-1 py-3 bg-gradient-to-b from-green-500 to-green-600 rounded-xl font-medium shadow-lg transform hover:scale-105 transition-transform">
                  💚 Apply
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* AR Elements */}
        <div className="absolute top-20 left-4 bg-purple-500/90 rounded-full px-4 py-2">
          <span className="text-white text-sm font-medium">📍 Virtual Office Tour</span>
        </div>
        
        <div className="absolute bottom-32 right-4 bg-blue-500/90 rounded-full px-4 py-2">
          <span className="text-white text-sm font-medium">🎯 95% Match</span>
        </div>
      </div>

      {/* Controls */}
      <div className="p-4 bg-black/90 flex justify-between items-center">
        <button onClick={onClose} className="text-white text-lg">❌</button>
        <div className="flex gap-4">
          <button 
            onClick={() => setIsRecording(!isRecording)}
            className={`w-16 h-16 rounded-full ${isRecording ? 'bg-red-500' : 'bg-white'} flex items-center justify-center text-2xl`}
          >
            {isRecording ? '⏹️' : '📹'}
          </button>
        </div>
        <button className="text-white text-lg">🔄</button>
      </div>
    </div>
  );
}