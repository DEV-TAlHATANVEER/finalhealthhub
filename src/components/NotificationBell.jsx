import React, { useState, useEffect } from 'react';
import { 
  IconButton, 
  Badge, 
  Menu, 
  Typography, 
  Box,
  List,
  ListItem,
  ListItemText,
  Divider,
  Button,
} from '@mui/material';
import { Notifications as NotificationsIcon } from '@mui/icons-material';
import { auth } from '../firebase';
import { 
  requestNotificationPermission, 
  getUnreadNotifications,
  initializeSocket,
  markAllNotificationsRead
} from '../utils/notifications';
import { formatDistanceToNow } from 'date-fns';

const NotificationBell = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [anchorEl, setAnchorEl] = useState(null);

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    // Request notification permission and initialize socket
    requestNotificationPermission(user.uid);

    // Initialize Socket.io connection
    const socket = initializeSocket(user.uid);

    // Listen for new notifications
    socket.on('notification', (notification) => {
      setNotifications(prev => [notification, ...prev]);
      setUnreadCount(prev => prev + 1);
    });

    // Fetch initial unread notifications
    const fetchNotifications = async () => {
      const unreadNotifications = await getUnreadNotifications(user.uid);
      setNotifications(unreadNotifications);
      setUnreadCount(unreadNotifications.length);
    };

    fetchNotifications();
  }, []);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleNotificationClick = async (notificationId) => {
    const targetNotification = notifications.find(n => n.id === notificationId);
    if (targetNotification?.read) return; // Already read

    try {
      const response = await fetch(`http://localhost:5000/api/notifications/${notificationId}/read`, {
        method: 'POST'
      });
      
      if (response.ok) {
        setNotifications(prevNotifications => 
          prevNotifications.map(n => 
            n.id === notificationId ? { ...n, read: true } : n
          )
        );
        setUnreadCount(prev => (prev > 0 ? prev - 1 : 0));
      }
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      const response = await markAllNotificationsRead(auth.currentUser.uid);
      if (response?.success) {
        setNotifications(prevNotifications => 
          prevNotifications.map(n => ({ ...n, read: true }))
        );
        setUnreadCount(0);
      }
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  return (
    <>
      <IconButton onClick={handleClick} sx={{ color: 'black' }}>
        <Badge badgeContent={unreadCount} color="error">
          <NotificationsIcon sx={{ color: 'inherit' }} />
        </Badge>
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose} 
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: 'auto',
            maxHeight: '70vh',
            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
            mt: 1.5,
            '& .MuiAvatar-root': {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">Notifications</Typography>
          {unreadCount > 0 && (
            <Button onClick={handleMarkAllRead} size="small">
              Mark All as Read
            </Button>
          )}
        </Box>
        
        <Divider />

        {notifications.length === 0 ? (
          <Box sx={{ p: 2, textAlign: 'center' }}>
            <Typography color="textSecondary">
              No new notifications
            </Typography>
          </Box>
        ) : (
          <List>
            {notifications.map((notification) => (
              <React.Fragment key={notification.id}>
                <ListItem 
                  button 
                  onClick={() => handleNotificationClick(notification.id)}
                >
                  <ListItemText
                    primary={notification.title}
                    secondary={
                      <>
                        <Typography variant="body2">
                          {notification.message}
                        </Typography>
                        {/* <Typography variant="caption" color="textSecondary">
                          {notification.createdAt ? formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true }) : ''}
                        </Typography> */}
                      </>
                    }
                  />
                </ListItem>
                <Divider />
              </React.Fragment>
            ))}
          </List>
        )}
      </Menu>
    </>
  );
};

export default NotificationBell;
