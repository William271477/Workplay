// Firebase messaging service worker
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyDL4tcrXYdFaQvYv8C0sfv5lV3NhYzx6UI",
  authDomain: "workplay-1ef5e.firebaseapp.com",
  projectId: "workplay-1ef5e",
  storageBucket: "workplay-1ef5e.firebasestorage.app",
  messagingSenderId: "1095220702505",
  appId: "1:1095220702505:web:6e5016c039976439d65b38"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('Background message received:', payload);
  
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/icon-192x192.png',
    badge: '/badge-72x72.png',
    tag: 'workplay-notification',
    data: payload.data
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  if (event.notification.data && event.notification.data.type === 'job_match') {
    // Open app to job details
    event.waitUntil(
      clients.openWindow('/?job=' + event.notification.data.jobId)
    );
  } else {
    // Open app
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});