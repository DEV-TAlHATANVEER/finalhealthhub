import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import { db } from './firebase-admin.js';

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});

app.use(cors());
app.use(express.json());

// In-memory store for user socket IDs (replace with Redis or similar for multi-instance)
const userSockets = new Map();

// Socket connection handling using an in-memory store
io.on('connection', (socket) => {
  socket.on('register', (userId) => {
    userSockets.set(userId, socket.id);
    socket.join(userId);
    console.log(`User ${userId} registered with socket ${socket.id}`);
  });

  socket.on('disconnect', () => {
    // Remove socket id from the in-memory store
    for (const [userId, sId] of userSockets.entries()) {
      if (sId === socket.id) {
        userSockets.delete(userId);
        console.log(`Socket ${socket.id} for user ${userId} removed`);
        break;
      }
    }
  });
});

// Send notification function using in-memory socket store
async function sendNotification(userId, title, message) {
  try {
    const notification = {
      userId,
      title,
      message,
      read: false,
      createdAt: new Date()
    };

    // Save notification to Firestore
    await db.collection('notifications').add(notification);

    // Emit notification if the user is connected
    const socketId = userSockets.get(userId);
    if (socketId) {
      io.to(socketId).emit('notification', notification);
    }
  } catch (error) {
    console.error('Error sending notification:', error);
  }
}

// Check appointment reminders every minute
setInterval(async () => {
  try {
    const now = new Date();
    const remindersSnapshot = await db.collection('appointment_reminders').get();

    // Loop through each appointment reminder document
    for (const doc of remindersSnapshot.docs) {
      const reminder = doc.data();
      let updateNeeded = false;

      // Update each reminder within the document if it hasn't been sent and its time has passed
      const updatedReminders = reminder.reminders.map(r => {
        const reminderTime = r.time.toDate();
        if (!r.sent && reminderTime <= now) {
          // Send notification to doctor and patient
          sendNotification(
            reminder.doctorId,
            'Appointment Reminder',
            `${r.message} with ${reminder.patientName}`
          );
          sendNotification(
            reminder.patientId,
            'Appointment Reminder',
            `${r.message} with Dr. ${reminder.doctorName}`
          );
          updateNeeded = true;
          return { ...r, sent: true };
        }
        return r;
      });

      // Only update Firestore if at least one reminder was marked as sent
      if (updateNeeded) {
        await doc.ref.update({ reminders: updatedReminders });
      }
    }
  } catch (error) {
    console.error('Error checking reminders:', error);
  }
}, 60000); // Check every minute

// Get notifications endpoint
app.get('/api/notifications/:userId', async (req, res) => {
  try {
    const notificationsSnapshot = await db.collection('notifications')
      .where('userId', '==', req.params.userId)
      .where('read', '==', false)
      .orderBy('createdAt', 'desc')
      .get();

    const notifications = notificationsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    res.json(notifications);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Mark single notification as read endpoint
app.post('/api/notifications/:notificationId/read', async (req, res) => {
  try {
    await db.collection('notifications').doc(req.params.notificationId).update({ 
      read: true 
    });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Mark all notifications as read endpoint
app.post('/api/notifications/markAllRead', async (req, res) => {
  try {
    const { userId } = req.body;
    if (!userId) {
      return res.status(400).json({ error: 'userId is required' });
    }
    // Retrieve all unread notifications for the user
    const notificationsSnapshot = await db.collection('notifications')
      .where('userId', '==', userId)
      .where('read', '==', false)
      .get();

    const batch = db.batch();
    notificationsSnapshot.docs.forEach(doc => {
      batch.update(doc.ref, { read: true });
    });

    await batch.commit();
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Send notification endpoint
app.post('/api/send-notification', async (req, res) => {
  try {
    const notification = req.body;
    await db.collection('notifications').add(notification);
    
    // Emit to a specific user if provided; otherwise emit globally.
    if (notification.userId) {
      const socketId = userSockets.get(notification.userId);
      if (socketId) {
        io.to(socketId).emit('notification', notification);
      }
    } else {
      io.emit('notification', notification);
    }
    
    res.status(200).send('Notification sent');
  } catch (error) {
    console.error('Error sending notification:', error);
    res.status(500).send('Error sending notification');
  }
});

// Lab status notification endpoint
app.post('/api/lab-status-notification', async (req, res) => {
  try {
    const { labId, status, remarks } = req.body;
    const notification = {
      userId: labId,
      message: `Your lab status has been updated to: ${status}` +
        (remarks ? ` Remarks: ${remarks}` : ''),
      type: 'labStatusUpdate',
      read: false,
      createdAt: new Date()
    };

    await db.collection('notifications').add(notification);

    const socketId = userSockets.get(labId);
    if (socketId) {
      io.to(socketId).emit('labStatusUpdate', notification);
    }
    
    res.status(200).send('Lab status notification sent');
  } catch (error) {
    console.error('Error sending lab status notification:', error);
    res.status(500).send('Error sending lab status notification');
  }
});

// Check expired doctor availabilities every minute
setInterval(async () => {
  try {
    const doctorsSnapshot = await db.collection('doctors').get();
    for (const doctorDoc of doctorsSnapshot.docs) {
      const doctorId = doctorDoc.id;
      const availabilitiesSnapshot = await db
        .collection('doctors')
        .doc(doctorId)
        .collection('availabilities')
        .get();

      for (const availabilityDoc of availabilitiesSnapshot.docs) {
        const availabilityData = availabilityDoc.data();
        if (!availabilityData.endTime) {
          console.warn(`Availability document ${availabilityDoc.id} for doctor ${doctorId} has no 'endTime' field.`);
          continue;
        }

        const endTime = new Date(availabilityData.endTime);
        const expirationTime = new Date(endTime.getTime() + 60000); // one-minute grace period

        if (new Date() >= expirationTime) {
          await availabilityDoc.ref.delete();
          console.log(`Deleted expired availability (${availabilityDoc.id}) for doctor ${doctorId}`);
        }
      }
    }
  } catch (error) {
    console.error('Error checking expired availabilities:', error);
  }
}, 60000); // Run every minute

// Check expired appointments every minute
setInterval(async () => {
  try {
    const appointmentsSnapshot = await db.collection('appointments').get();
    for (const appointmentDoc of appointmentsSnapshot.docs) {
      const appointmentData = appointmentDoc.data();

      if (!appointmentData.date || !appointmentData.slotPortion) {
        console.warn(`Appointment ${appointmentDoc.id} missing date or slotPortion.`);
        continue;
      }

      // Convert appointment date to Date object
      const appointmentDate = appointmentData.date.toDate
        ? appointmentData.date.toDate()
        : new Date(appointmentData.date);

      // Parse the slotPortion (e.g., "6:12 PM - 6:42 PM portion")
      const parts = appointmentData.slotPortion.split(' - ');
      if (parts.length < 2) {
        console.warn(`Appointment ${appointmentDoc.id} has an invalid slotPortion: ${appointmentData.slotPortion}`);
        continue;
      }

      // Clean and parse the end time
      let endTimeString = parts[1].replace(/portion/i, '').trim();
      const [time, meridiem] = endTimeString.split(' ');
      if (!time || !meridiem) {
        console.warn(`Appointment ${appointmentDoc.id} has an invalid end time format: ${endTimeString}`);
        continue;
      }

      const [hourStr, minuteStr] = time.split(':');
      let hour = parseInt(hourStr, 10);
      const minute = parseInt(minuteStr, 10);
      if (meridiem.toLowerCase() === 'pm' && hour !== 12) {
        hour += 12;
      } else if (meridiem.toLowerCase() === 'am' && hour === 12) {
        hour = 0;
      }

      // Build the end DateTime for the appointment
      const endDateTime = new Date(
        appointmentDate.getFullYear(),
        appointmentDate.getMonth(),
        appointmentDate.getDate(),
        hour,
        minute
      );
      const expirationTime = new Date(endDateTime.getTime() + 60000); // one-minute grace period

      if (new Date() >= expirationTime && appointmentData.status !== 'expired') {
        await appointmentDoc.ref.update({
          status: 'expired',
          updatedAt: new Date()
        });
        console.log(`Appointment ${appointmentDoc.id} updated to expired.`);
      }
    }
  } catch (error) {
    console.error('Error checking expired appointments:', error);
  }
}, 60000); // Run every minute

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
