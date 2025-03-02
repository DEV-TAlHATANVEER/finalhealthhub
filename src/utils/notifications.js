import io from 'socket.io-client';
import { db } from '../firebase';
import { addDoc, collection } from 'firebase/firestore';

let socket = null;

// Initialize Socket.io connection
export const initializeSocket = (userId) => {
  if (!socket) {
    socket = io('http://localhost:5000');
    
    socket.on('connect', () => {
      socket.emit('register', userId);
    });

    socket.on('notification', (notification) => {
      showNotification(notification.title, { body: notification.message });
    });
  }
  return socket;
};

// Request browser notification permission
export const requestNotificationPermission = async (userId) => {
  try {
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      initializeSocket(userId);
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error getting notification permission:', error);
    return false;
  }
};

// Schedule reminder for appointment
export const scheduleAppointmentReminder = async (appointmentData) => {
  try {
    const { doctorId, patientId, appointmentTime, doctorName, patientName, type } = appointmentData;

    // Store reminder in Firestore
    await addDoc(collection(db, 'appointment_reminders'), {
      appointmentId: appointmentData.appointmentId,
      doctorId,
      patientId,
      doctorName,
      patientName,
      appointmentTime,
      type,
      reminders: [
        {
          time: new Date(appointmentTime - 24 * 60 * 60 * 1000), // 24 hours before
          sent: false,
          message: `You have a ${type} appointment tomorrow`
        },
        {
          time: new Date(appointmentTime - 60 * 60 * 1000), // 1 hour before
          sent: false,
          message: `You have a ${type} appointment in 1 hour`
        }
      ]
    });

    return true;
  } catch (error) {
    console.error('Error scheduling reminder:', error);
    return false;
  }
};

// Get unread notifications
export const getUnreadNotifications = async (userId) => {
  try {
    const response = await fetch(`http://localhost:5000/api/notifications/${userId}`);
    if (!response.ok) throw new Error('Failed to fetch notifications');
    return await response.json();
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return [];
  }
};

// Mark all notifications as read
export const markAllNotificationsRead = async (userId) => {
  try {
    const response = await fetch(`http://localhost:5000/api/notifications/markAllRead`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ userId })
    });
    if (!response.ok) throw new Error('Failed to mark all notifications as read');
    return await response.json();
  } catch (error) {
    console.error('Error marking all notifications as read:', error);
    return null;
  }
};

// Show browser notification
export const showNotification = (title, options = {}) => {
  if ('Notification' in window && Notification.permission === 'granted') {
    new Notification(title, options);
  }
};

// Send lab status notification
export const sendLabStatusNotification = async (labId, status, remarks = '') => {
  try {
    const notification = {
      userId: labId,
      message: `Your lab status has been updated to: ${status}` +
        (remarks ? ` Remarks: ${remarks}` : ''),
      type: 'labStatusUpdate',
      read: false,
      createdAt: new Date().toISOString()
    };
    
    await addDoc(collection(db, 'notifications'), notification);
    if (socket) {
      socket.emit('labStatusUpdate', notification);
    }
  } catch (error) {
    console.error('Error sending lab status notification:', error);
  }
};

// Clean up socket connection
export const cleanupSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

// Listen for lab status updates
export const listenForLabStatusUpdates = (userId, callback) => {
  if (socket) {
    socket.on('labStatusUpdate', (notification) => {
      if (notification.userId === userId) {
        callback(notification);
      }
    });
  }
};
