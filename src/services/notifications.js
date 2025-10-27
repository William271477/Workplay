import { getMessaging, getToken, onMessage } from 'firebase/messaging';
import { updateDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';

let messaging = null;

// Initialize messaging
export const initializeMessaging = () => {
  try {
    messaging = getMessaging();
    return messaging;
  } catch (error) {
    console.error('Messaging not supported:', error);
    return null;
  }
};

// Request notification permission
export const requestNotificationPermission = async (userId) => {
  try {
    if (!messaging) {
      messaging = initializeMessaging();
    }
    
    if (!messaging) return null;

    const permission = await Notification.requestPermission();
    
    if (permission === 'granted') {
      const token = await getToken(messaging, {
        vapidKey: 'YOUR_VAPID_KEY' // You'll need to generate this in Firebase Console
      });
      
      // Save token to user profile
      if (token && userId) {
        await updateDoc(doc(db, 'users', userId), {
          fcmToken: token
        });
      }
      
      return token;
    }
    
    return null;
  } catch (error) {
    console.error('Error getting notification permission:', error);
    return null;
  }
};

// Listen for foreground messages
export const onMessageListener = () => {
  if (!messaging) return () => {};
  
  return onMessage(messaging, (payload) => {
    console.log('Message received:', payload);
    
    // Show custom notification
    if (payload.notification) {
      showCustomNotification(payload.notification);
    }
  });
};

// Show custom notification
const showCustomNotification = (notification) => {
  // Create custom notification UI
  const notificationDiv = document.createElement('div');
  notificationDiv.className = 'fixed top-4 right-4 bg-purple-600 text-white p-4 rounded-lg shadow-lg z-50 max-w-sm';
  notificationDiv.innerHTML = `
    <div class="flex items-start gap-3">
      <div class="text-2xl">🎯</div>
      <div class="flex-1">
        <h4 class="font-bold">${notification.title}</h4>
        <p class="text-sm opacity-90">${notification.body}</p>
      </div>
      <button onclick="this.parentElement.parentElement.remove()" class="text-white/70 hover:text-white">×</button>
    </div>
  `;
  
  document.body.appendChild(notificationDiv);
  
  // Auto remove after 5 seconds
  setTimeout(() => {
    if (notificationDiv.parentElement) {
      notificationDiv.remove();
    }
  }, 5000);
};

// Send job match notification (would be called from backend)
export const sendJobMatchNotification = async (userToken, job) => {
  // This would typically be done from your backend
  const message = {
    notification: {
      title: '🎯 New Job Match!',
      body: `${job.title} at ${job.company} matches your preferences`,
      icon: '/icon-192x192.png'
    },
    data: {
      jobId: job.id,
      type: 'job_match'
    },
    token: userToken
  };
  
  // Backend would send this via Firebase Admin SDK
  console.log('Would send notification:', message);
};