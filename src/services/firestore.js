import { doc, setDoc, getDoc, updateDoc, arrayUnion, arrayRemove, onSnapshot } from 'firebase/firestore';
import { db, analytics } from '../firebase';
import { logEvent } from 'firebase/analytics';

// User data management
export const createUserProfile = async (userId, userData) => {
  try {
    await setDoc(doc(db, 'users', userId), {
      ...userData,
      createdAt: new Date(),
      xp: 0,
      level: 0,
      streak: 0,
      savedJobs: [],
      appliedJobs: [],
      preferences: {
        jobTypes: ['Full-time'],
        locations: ['South Africa'],
        salaryRange: { min: 0, max: 100000 },
        skills: []
      }
    });
  } catch (error) {
    console.error('Error creating user profile:', error);
  }
};

// Get user data
export const getUserData = async (userId) => {
  try {
    const docRef = doc(db, 'users', userId);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? docSnap.data() : null;
  } catch (error) {
    console.error('Error getting user data:', error);
    return null;
  }
};

// Save job to Firestore
export const saveJobToFirestore = async (userId, job) => {
  try {
    await updateDoc(doc(db, 'users', userId), {
      savedJobs: arrayUnion(job)
    });
    
    // Analytics event
    logEvent(analytics, 'job_saved', {
      job_id: job.id,
      job_title: job.title,
      company: job.company
    });
  } catch (error) {
    console.error('Error saving job:', error);
  }
};

// Remove saved job
export const removeJobFromFirestore = async (userId, jobId) => {
  try {
    const userData = await getUserData(userId);
    const jobToRemove = userData.savedJobs.find(job => job.id === jobId);
    
    if (jobToRemove) {
      await updateDoc(doc(db, 'users', userId), {
        savedJobs: arrayRemove(jobToRemove)
      });
    }
  } catch (error) {
    console.error('Error removing job:', error);
  }
};

// Apply to job
export const applyToJob = async (userId, jobId) => {
  try {
    await updateDoc(doc(db, 'users', userId), {
      appliedJobs: arrayUnion(jobId)
    });
    
    // Analytics event
    logEvent(analytics, 'job_applied', {
      job_id: jobId
    });
  } catch (error) {
    console.error('Error applying to job:', error);
  }
};

// Update XP and level
export const updateUserXP = async (userId, xpGain, action) => {
  try {
    const userData = await getUserData(userId);
    const newXP = userData.xp + xpGain;
    const newLevel = Math.floor(newXP / 100);
    
    await updateDoc(doc(db, 'users', userId), {
      xp: newXP,
      level: newLevel
    });
    
    // Analytics event
    logEvent(analytics, 'xp_gained', {
      action: action,
      xp_gained: xpGain,
      new_total: newXP,
      level: newLevel
    });
  } catch (error) {
    console.error('Error updating XP:', error);
  }
};

// Update user preferences
export const updateUserPreferences = async (userId, preferences) => {
  try {
    await updateDoc(doc(db, 'users', userId), {
      preferences: preferences
    });
  } catch (error) {
    console.error('Error updating preferences:', error);
  }
};

// Track job swipe
export const trackJobSwipe = async (job, direction) => {
  try {
    logEvent(analytics, 'job_swiped', {
      job_id: job.id,
      job_title: job.title,
      company: job.company,
      direction: direction,
      salary: job.salary
    });
  } catch (error) {
    console.error('Error tracking swipe:', error);
  }
};

// Listen to user data changes
export const subscribeToUserData = (userId, callback) => {
  const unsubscribe = onSnapshot(doc(db, 'users', userId), (doc) => {
    if (doc.exists()) {
      callback(doc.data());
    }
  });
  
  return unsubscribe;
};