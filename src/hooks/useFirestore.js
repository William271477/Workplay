import { useState, useEffect } from 'react';
import { 
  getUserData, 
  saveJobToFirestore, 
  removeJobFromFirestore, 
  applyToJob, 
  updateUserXP, 
  subscribeToUserData,
  trackJobSwipe,
  createUserProfile
} from '../services/firestore';

export const useFirestore = (user) => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setUserData(null);
      setLoading(false);
      return;
    }

    let unsubscribe;

    const initializeUser = async () => {
      try {
        // Check if user profile exists
        let data = await getUserData(user.uid);
        
        // Create profile if it doesn't exist
        if (!data) {
          const profileData = {
            email: user.email || 'demo@workplay.com',
            displayName: user.displayName || user.email?.split('@')[0] || 'Demo User',
            photoURL: user.photoURL || null,
            isAnonymous: user.isAnonymous || false
          };
          
          await createUserProfile(user.uid, profileData);
          data = await getUserData(user.uid);
        }

        setUserData(data);
        
        // Subscribe to real-time updates
        unsubscribe = subscribeToUserData(user.uid, (newData) => {
          setUserData(newData);
        });
        
      } catch (error) {
        console.error('Error initializing user:', error);
        // Set default data if Firestore fails
        setUserData({
          xp: 0,
          level: 0,
          streak: 0,
          savedJobs: [],
          appliedJobs: [],
          displayName: user.displayName || 'Demo User'
        });
      } finally {
        setLoading(false);
      }
    };

    initializeUser();

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [user]);

  const saveJob = async (job) => {
    if (!user || !userData) return;
    
    try {
      // Optimistic update
      setUserData(prev => ({
        ...prev,
        savedJobs: [job, ...(prev.savedJobs || [])],
        xp: (prev.xp || 0) + 20,
        level: Math.floor(((prev.xp || 0) + 20) / 100),
        streak: (prev.streak || 0) + 1
      }));
      
      await saveJobToFirestore(user.uid, job);
      await updateUserXP(user.uid, 20, 'job_saved');
    } catch (error) {
      console.error('Error saving job:', error);
      // Revert optimistic update on error
      const freshData = await getUserData(user.uid);
      if (freshData) setUserData(freshData);
    }
  };

  const removeJob = async (jobId) => {
    if (!user || !userData) return;
    
    try {
      // Optimistic update
      setUserData(prev => ({
        ...prev,
        savedJobs: (prev.savedJobs || []).filter(job => job.id !== jobId)
      }));
      
      await removeJobFromFirestore(user.uid, jobId);
    } catch (error) {
      console.error('Error removing job:', error);
      // Revert optimistic update on error
      const freshData = await getUserData(user.uid);
      if (freshData) setUserData(freshData);
    }
  };

  const applyToJobAction = async (jobId) => {
    if (!user || !userData) return;
    
    try {
      // Optimistic update
      setUserData(prev => ({
        ...prev,
        appliedJobs: [...(prev.appliedJobs || []), jobId],
        xp: (prev.xp || 0) + 30,
        level: Math.floor(((prev.xp || 0) + 30) / 100)
      }));
      
      await applyToJob(user.uid, jobId);
      await updateUserXP(user.uid, 30, 'job_applied');
    } catch (error) {
      console.error('Error applying to job:', error);
      // Revert optimistic update on error
      const freshData = await getUserData(user.uid);
      if (freshData) setUserData(freshData);
    }
  };

  const addXP = async (amount, action) => {
    if (!user || !userData) return;
    
    try {
      // Optimistic update
      setUserData(prev => ({
        ...prev,
        xp: (prev.xp || 0) + amount,
        level: Math.floor(((prev.xp || 0) + amount) / 100)
      }));
      
      await updateUserXP(user.uid, amount, action);
    } catch (error) {
      console.error('Error adding XP:', error);
      // Revert optimistic update on error
      const freshData = await getUserData(user.uid);
      if (freshData) setUserData(freshData);
    }
  };

  const swipeJob = async (job, direction) => {
    if (!user) return;
    
    try {
      await trackJobSwipe(job, direction);
      
      if (direction === 'right') {
        await saveJob(job);
      } else {
        await addXP(5, 'job_skipped');
      }
    } catch (error) {
      console.error('Error tracking swipe:', error);
    }
  };

  return {
    userData,
    loading,
    saveJob,
    removeJob,
    applyToJobAction,
    addXP,
    swipeJob
  };
};