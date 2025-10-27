// Job API service with Adzuna integration
const API_KEYS = {
  adzuna_id: "bdc52330",
  adzuna_key: "9e9cb0fe92cb21b839f79bd2fccbcba5"
};

export const fetchJobs = async (query = "developer", location = "South Africa") => {
  try {
    // Use Adzuna API for South African jobs
    const locationParam = location.toLowerCase().includes('south africa') ? 'south%20africa' : encodeURIComponent(location);
    const response = await fetch(`https://api.adzuna.com/v1/api/jobs/za/search/1?app_id=${API_KEYS.adzuna_id}&app_key=${API_KEYS.adzuna_key}&results_per_page=20&what=${encodeURIComponent(query)}&where=${locationParam}&sort_by=date`);
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    const data = await response.json();
    return transformAdzunaData(data.results || []);

  } catch (error) {
    console.error('Adzuna API failed:', error);
    // Fallback to The Muse API
    try {
      const response = await fetch(`https://www.themuse.com/api/public/jobs?location=South%20Africa&page=1&category=Engineering`);
      const data = await response.json();
      return transformMuseData(data.results || []);
    } catch (museError) {
      console.error('Muse API failed:', museError);
      return getFallbackJobs();
    }
  }
};

// Transform Adzuna data to our format
const transformAdzunaData = (jobs) => {
  return jobs.map((job, index) => ({
    id: job.id || `ad_${index}`,
    title: job.title,
    company: job.company.display_name,
    logo: getCompanyEmoji(job.company.display_name),
    location: job.location.display_name,
    salary: job.salary_min ? `R${Math.round(job.salary_min/1000)}k - R${Math.round(job.salary_max/1000)}k` : "Competitive",
    desc: cleanDescription(job.description),
    tags: extractTags(job.description),
    apply_url: job.redirect_url
  }));
};

// Transform Muse data (fallback)
const transformMuseData = (jobs) => {
  return jobs.map((job, index) => ({
    id: job.id || `muse_${index}`,
    title: job.name,
    company: job.company.name,
    logo: getCompanyEmoji(job.company.name),
    location: job.locations?.[0]?.name || "Remote",
    salary: "Competitive",
    desc: job.contents?.substring(0, 200) + "..." || "Exciting opportunity to join our team.",
    tags: job.levels?.map(l => l.name).slice(0, 3) || ["Full-time"],
    apply_url: `https://www.themuse.com/jobs/${job.id}`
  }));
};

// Clean HTML from job descriptions
const cleanDescription = (desc) => {
  if (!desc) return "Great opportunity to grow your career.";
  return desc
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .replace(/&[^;]+;/g, ' ') // Remove HTML entities
    .substring(0, 200) + "...";
};

// Extract relevant tags from description
const extractTags = (desc) => {
  if (!desc) return ["Full-time"];
  
  const skills = ['React', 'JavaScript', 'Python', 'Java', 'Node.js', 'Angular', 'Vue', 'PHP', 'C#', 'SQL', 'AWS', 'Docker', 'Kubernetes'];
  const found = skills.filter(skill => 
    desc.toLowerCase().includes(skill.toLowerCase())
  );
  
  return found.length > 0 ? found.slice(0, 3) : ["Full-time", "Remote"];
};

// Get company emoji based on name
const getCompanyEmoji = (company) => {
  const emojiMap = {
    'google': '🔍', 'microsoft': '💻', 'apple': '🍎', 'amazon': '📦',
    'facebook': '👥', 'meta': '👥', 'netflix': '🎬', 'uber': '🚗',
    'airbnb': '🏠', 'spotify': '🎵', 'twitter': '🐦', 'linkedin': '💼',
    'takealot': '🛒', 'discovery': '💎', 'capitec': '⚡', 'fnb': '🏦',
    'shoprite': '🛍️', 'woolworths': '🥗', 'mtn': '📱', 'vodacom': '📶',
    'standard bank': '🏦', 'absa': '🏛️', 'nedbank': '💳'
  };
  
  const key = company.toLowerCase();
  for (const [name, emoji] of Object.entries(emojiMap)) {
    if (key.includes(name)) return emoji;
  }
  return '🏢';
};

// Fallback jobs if all APIs fail
const getFallbackJobs = () => [
  {
    id: "fallback_1",
    title: "Frontend Developer",
    company: "Takealot",
    logo: "🛒",
    location: "Cape Town",
    salary: "R45k - R65k",
    desc: "Build amazing e-commerce experiences with React. Join South Africa's leading online retailer.",
    tags: ["React", "JavaScript"],
    apply_url: "https://takealot.com/careers"
  },
  {
    id: "fallback_2",
    title: "Data Scientist",
    company: "Discovery",
    logo: "💎",
    location: "Johannesburg",
    salary: "R50k - R70k",
    desc: "Use machine learning to improve customer experiences in insurance and banking.",
    tags: ["Python", "ML"],
    apply_url: "https://discovery.co.za/careers"
  }
];