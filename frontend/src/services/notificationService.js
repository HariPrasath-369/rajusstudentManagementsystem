import api from './api';

export const notificationService = {
  // Send notification (Teacher/HOD/Principal)
  sendNotification: async (notificationData) => {
    return await api.post('/notifications', notificationData);
  },

  // Broadcast notification (Principal/HOD)
  broadcastNotification: async (notificationData) => {
    return await api.post('/notifications/broadcast', notificationData);
  },

  // Get user notifications
  getNotifications: async (page = 0, size = 20) => {
    return await api.get(`/notifications?page=${page}&size=${size}`);
  },

  // Get unread notifications
  getUnreadNotifications: async () => {
    return await api.get('/notifications/unread');
  },

  // Get unread count
  getUnreadCount: async () => {
    return await api.get('/notifications/count/unread');
  },

  // Mark notification as read
  markAsRead: async (notificationId) => {
    return await api.put(`/notifications/${notificationId}/read`);
  },

  // Mark all notifications as read
  markAllAsRead: async () => {
    return await api.put('/notifications/read-all');
  },

  // Delete notification
  deleteNotification: async (notificationId) => {
    return await api.delete(`/notifications/${notificationId}`);
  },

  // Clear all notifications
  clearAll: async () => {
    const notifications = await notificationService.getNotifications();
    const promises = notifications.map(notif => 
      notificationService.deleteNotification(notif.id)
    );
    await Promise.all(promises);
  },

  // Update notification preferences
  updatePreferences: async (preferences) => {
    return await api.put('/notifications/preferences', preferences);
  },

  // Get notification preferences
  getPreferences: async () => {
    return await api.get('/notifications/preferences');
  },
};