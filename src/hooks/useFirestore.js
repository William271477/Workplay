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
          await createUserProfile(user.uid, {
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL
          });
          data = await getUserData(user.uid);
        }

        setUserData(data);
        
        // Subscribe to real-time updates
        unsubscribe = subscribeToUserData(user.uid, (newData) => {
          setUserData(newData);
        });
        
      } catch (error) {
        console.error('Error initializing user:', error);
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
      await saveJobToFirestore(user.uid, job);
      await updateUserXP(user.uid, 20, 'job_saved');
    } catch (error) {
      console.error('Error saving job:', error);
    }
  };

  const removeJob = async (jobId) => {
    if (!user) return;
    
    try {
      await removeJobFromFirestore(user.uid, jobId);
    } catch (error) {
      console.error('Error removing job:', error);
    }
  };

  const applyToJobAction = async (jobId) => {
    if (!user) return;
    
    try {
      await applyToJob(user.uid, jobId);
      await updateUserXP(user.uid, 30, 'job_applied');
    } catch (error) {
      console.error('Error applying to job:', error);
    }
  };

  const addXP = async (amount, action) => {
    if (!user) return;
    
    try {
      await updateUserXP(user.uid, amount, action);
    } catch (error) {
      console.error('Error adding XP:', error);
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