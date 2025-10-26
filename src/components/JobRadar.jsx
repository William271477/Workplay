import React, { useState, useEffect } from "react";
import { jobs } from "../data/jobs";

export default function JobRadar() {
  const [userLocation, setUserLocation] = useState(null);
  const [nearbyJobs, setNearbyJobs] = useState([]);
  const [radarActive, setRadarActive] = useState(false);

  const cityCoords = {
    "Cape Town": { lat: -33.9249, lng: 18.4241 },
    "Johannesburg": { lat: -26.2041, lng: 28.0473 },
    "Durban": { lat: -29.8587, lng: 31.0218 },
    "Stellenbosch": { lat: -33.9321, lng: 18.8602 }
  };

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        () => {
          // Fallback to Cape Town
          setUserLocation(cityCoords["Cape Town"]);
        }
      );
    }
  }, []);

  const calculateDistance = (lat1, lng1, lat2, lng2) => {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLng/2) * Math.sin(dLng/2);
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  };

  const scanForJobs = () => {
    if (!userLocation) return;
    
    setRadarActive(true);
    
    const jobsWithDistance = jobs.map(job => {
      const jobCoords = cityCoords[job.location] || cityCoords["Cape Town"];
      const distance = calculateDistance(
        userLocation.lat, userLocation.lng,
        jobCoords.lat, jobCoords.lng
      );
      return { ...job, distance: Math.round(distance) };
    }).sort((a, b) => a.distance - b.distance);
    
    setTimeout(() => {
      setNearbyJobs(jobsWithDistance.slice(0, 5));
      setRadarActive(false);
    }, 2000);
  };

  return (
    <div className="fixed top-1/2 left-4 transform -translate-y-1/2 z-40">
      <button
        onClick={scanForJobs}
        className={`w-16 h-16 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 shadow-2xl flex items-center justify-center text-2xl transition-all ${
          radarActive ? 'animate-spin' : 'hover:scale-110'
        }`}
      >
        📡
      </button>
      
      {radarActive && (
        <div className="absolute top-0 left-0 w-16 h-16 border-4 border-green-400 rounded-full animate-ping" />
      )}
      
      {nearbyJobs.length > 0 && !radarActive && (
        <div className="absolute left-20 top-0 bg-slate-800/95 backdrop-blur-lg rounded-2xl p-4 w-72 border border-green-500/50">
          <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
            🎯 Jobs Near You
          </h3>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {nearbyJobs.map((job, i) => (
              <div key={i} className="flex items-center gap-3 p-2 bg-slate-700/50 rounded-lg">
                <div className="text-lg">{job.logo}</div>
                <div className="flex-1">
                  <div className="text-white text-sm font-medium">{job.title}</div>
                  <div className="text-slate-400 text-xs">{job.company}</div>
                </div>
                <div className="text-green-400 text-xs font-medium">
                  {job.distance}km
                </div>
              </div>
            ))}
          </div>
          <button
            onClick={() => setNearbyJobs([])}
            className="w-full mt-3 py-2 bg-green-500/20 text-green-400 rounded-lg text-sm hover:bg-green-500/30 transition-colors"
          >
            Close Radar
          </button>
        </div>
      )}
    </div>
  );
}