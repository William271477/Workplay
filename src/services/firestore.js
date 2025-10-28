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
    }, { merge: true });
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
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      savedJobs: arrayUnion(job)
    });
    
    // Analytics event
    if (analytics) {
      logEvent(analytics, 'job_saved', {
        job_id: job.id,
        job_title: job.title,
        company: job.company
      });
    }
  } catch (error) {
    console.error('Error saving job:', error);
  }
};

// Remove saved job
export const removeJobFromFirestore = async (userId, jobId) => {
  try {
    const userData = await getUserData(userId);
    if (!userData || !userData.savedJobs) return;
    
    const jobToRemove = userData.savedJobs.find(job => job.id === jobId);
    
    if (jobToRemove) {
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, {
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
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      appliedJobs: arrayUnion(jobId)
    });
    
    // Analytics event
    if (analytics) {
      logEvent(analytics, 'job_applied', {
        job_id: jobId
      });
    }
  } catch (error) {
    console.error('Error applying to job:', error);
  }
};

// Update XP and level
export const updateUserXP = async (userId, xpGain, action) => {
  try {
    const userData = await getUserData(userId);
    if (!userData) return;
    
    const newXP = (userData.xp || 0) + xpGain;
    const newLevel = Math.floor(newXP / 100);
    const newStreak = action === 'job_saved' ? (userData.streak || 0) + 1 : (userData.streak || 0);
    
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      xp: newXP,
      level: newLevel,
      streak: newStreak
    });
    
    // Analytics event
    if (analytics) {
      logEvent(analytics, 'xp_gained', {
        action: action,
        xp_gained: xpGain,
        new_total: newXP,
        level: newLevel
      });
    }
  } catch (error) {
    console.error('Error updating XP:', error);
  }
};

// Track job swipe
export const trackJobSwipe = async (job, direction) => {
  try {
    if (analytics) {
      logEvent(analytics, 'job_swiped', {
        job_id: job.id,
        job_title: job.title,
        company: job.company,
        direction: direction,
        salary: job.salary
      });
    }
  } catch (error) {
    console.error('Error tracking swipe:', error);
  }
};

// Listen to user data changes
export const subscribeToUserData = (userId, callback) => {
  try {
    const unsubscribe = onSnapshot(doc(db, 'users', userId), (doc) => {
      if (doc.exists()) {
        callback(doc.data());
      }
    });
    
    return unsubscribe;
  } catch (error) {
    console.error('Error subscribing to user data:', error);
    return () => {};
  }
};