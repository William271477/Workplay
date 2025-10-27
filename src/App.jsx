import React, { useState } from "react";

const jobs = [
  {
    id: "j1",
    title: "Frontend Developer",
    company: "Takealot",
    logo: "🛒",
    location: "Cape Town",
    salary: "R45k - R65k",
    desc: "Build amazing e-commerce experiences with React. Join South Africa's leading online retailer.",
    tags: ["React", "JavaScript", "E-commerce"],
  },
  {
    id: "j2",
    title: "UX Designer",
    company: "Discovery",
    logo: "💎",
    location: "Johannesburg",
    salary: "R40k - R55k",
    desc: "Design user-friendly insurance and banking products that help millions of South Africans.",
    tags: ["Figma", "UX Research", "Fintech"],
  },
  {
    id: "j3",
    title: "Data Scientist",
    company: "Standard Bank",
    logo: "🏦",
    location: "Johannesburg",
    salary: "R50k - R70k",
    desc: "Use machine learning to detect fraud and improve customer experiences in banking.",
    tags: ["Python", "ML", "Banking"],
  }
];

export default function App() {
  const [user, setUser] = useState(null);
  const [page, setPage] = useState("swipe");
  const [xp, setXp] = useState(0);
  const [saved, setSaved] = useState([]);
  const [applied, setApplied] = useState([]);
  const [search, setSearch] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);

  const filteredJobs = search 
    ? jobs.filter(job => 
        job.title.toLowerCase().includes(search.toLowerCase()) ||
        job.company.toLowerCase().includes(search.toLowerCase())
      )
    : jobs;

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-purple-600 flex items-center justify-center text-4xl">
            🎮
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">WorkPlay</h1>
          <p className="text-slate-400 mb-8">Gamify your job search</p>
          <button
            onClick={() => setUser("Demo User")}
            className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
          >
            Start Demo
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <nav className="bg-slate-800 p-4">
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-purple-600 flex items-center justify-center">
              🎮
            </div>
            <span className="text-lg font-bold">WorkPlay</span>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={() => setPage("swipe")}
              className={`px-3 py-2 rounded-lg text-sm ${page === "swipe" ? "bg-purple-600" : "text-slate-300"}`}
            >
              🏠 Home
            </button>
            <button 
              onClick={() => setPage("saved")}
              className={`px-3 py-2 rounded-lg text-sm ${page === "saved" ? "bg-purple-600" : "text-slate-300"}`}
            >
              💾 Saved
            </button>
          </div>
        </div>
      </nav>

      <main className="p-8">
        {page === "swipe" && (
          <div className="max-w-md mx-auto">
            <div className="mb-6">
              <div className="flex justify-between text-sm mb-2">
                <span>XP: {xp}</span>
                <span>Saved: {saved.length}</span>
              </div>
            </div>

            <input
              type="text"
              placeholder="Search jobs..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-4 py-3 mb-6 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-400"
            />
            
            <h1 className="text-xl font-bold text-center mb-6">Discover Jobs</h1>
            
            {currentIndex < filteredJobs.length ? (
              <div className="bg-white rounded-2xl p-6 shadow-xl text-black">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-xl bg-purple-600 flex items-center justify-center text-xl text-white">
                    {filteredJobs[currentIndex].logo}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold">{filteredJobs[currentIndex].title}</h3>
                    <p className="text-gray-600">{filteredJobs[currentIndex].company}</p>
                    <p className="text-gray-500 text-sm">📍 {filteredJobs[currentIndex].location}</p>
                  </div>
                </div>
                
                <div className="mt-4 inline-block px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm font-semibold">
                  {filteredJobs[currentIndex].salary}
                </div>
                
                <p className="mt-4 text-gray-700">{filteredJobs[currentIndex].desc}</p>
                
                <div className="flex gap-4 mt-6">
                  <button 
                    onClick={() => {
                      setCurrentIndex(prev => prev + 1);
                      setXp(prev => prev + 5);
                    }}
                    className="flex-1 py-3 bg-red-500 text-white rounded-lg font-medium"
                  >
                    Skip
                  </button>
                  <button 
                    onClick={() => {
                      setSaved(prev => [...prev, filteredJobs[currentIndex]]);
                      setCurrentIndex(prev => prev + 1);
                      setXp(prev => prev + 20);
                    }}
                    className="flex-1 py-3 bg-green-500 text-white rounded-lg font-medium"
                  >
                    Save
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="text-4xl mb-4">🎉</div>
                <h3 className="text-lg font-bold mb-2">All caught up!</h3>
                <p className="text-slate-400">Check back later for more opportunities</p>
              </div>
            )}
          </div>
        )}
        
        {page === "saved" && (
          <div className="max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">Saved Jobs ({saved.length})</h1>
            {saved.length === 0 ? (
              <div className="text-center py-16">
                <div className="text-4xl mb-4">💼</div>
                <h3 className="text-lg font-bold mb-2">No saved jobs yet</h3>
                <p className="text-slate-400">Start swiping to find your perfect match!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {saved.map((job) => (
                  <div key={job.id} className="bg-slate-800 rounded-lg p-4">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-lg bg-purple-600 flex items-center justify-center text-lg">
                        {job.logo}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold">{job.title}</h3>
                        <p className="text-slate-400 text-sm">{job.company} • {job.location}</p>
                        <p className="text-green-400 font-semibold text-sm">{job.salary}</p>
                        <p className="text-slate-300 text-sm mt-2">{job.desc}</p>
                        <div className="flex gap-2 mt-3">
                          <button 
                            onClick={() => {
                              setApplied(prev => [...prev, job.id]);
                              setXp(prev => prev + 30);
                            }}
                            disabled={applied.includes(job.id)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium ${
                              applied.includes(job.id)
                                ? "bg-green-600 text-white cursor-not-allowed"
                                : "bg-blue-600 hover:bg-blue-700 text-white"
                            }`}
                          >
                            {applied.includes(job.id) ? "✓ Applied" : "Apply Now"}
                          </button>
                          <button 
                            onClick={() => setSaved(prev => prev.filter(j => j.id !== job.id))}
                            className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}