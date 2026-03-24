import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bell,
  CheckCircle,
  XCircle,
  AlertCircle,
  Info,
  Calendar,
  Clock,
  UserCheck,
  Award,
  BookOpen,
  Mail,
  Trash2,
  Check,
  Filter,
  Search,
  Settings,
  ChevronRight,
  Eye,
  EyeOff
} from 'lucide-react';
import Card from '../../components/Common/Card';
import Button from '../../components/Common/Button';
import Modal from '../../components/Common/Modal';
import { notificationService } from '../../services/notificationService';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

const Notifications = () => {
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [preferencesModalOpen, setPreferencesModalOpen] = useState(false);
  const [preferences, setPreferences] = useState({
    email: true,
    push: true,
    attendance: true,
    marks: true,
    leave: true,
    timetable: true,
    announcements: true
  });

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const data = await notificationService.getNotifications();
      const notificationsList = data?.content || data?.data || data || [];
      setNotifications(Array.isArray(notificationsList) ? notificationsList : []);
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
      // toast.error('Failed to load notifications');
      setNotifications(getMockNotifications());
    } finally {
      setLoading(false);
    }
  };

  const getMockNotifications = () => [
    {
      id: 1,
      title: 'Attendance Marked',
      message: 'Your attendance for Data Structures class has been marked.',
      type: 'attendance',
      read: false,
      createdAt: '2024-03-15T09:30:00',
      actionUrl: '/student/attendance',
      icon: UserCheck,
      priority: 'high'
    },
    {
      id: 2,
      title: 'Marks Published',
      message: 'Your marks for Algorithms exam have been published.',
      type: 'marks',
      read: false,
      createdAt: '2024-03-14T15:45:00',
      actionUrl: '/student/marks',
      icon: Award,
      priority: 'high'
    },
    {
      id: 3,
      title: 'Leave Approved',
      message: 'Your leave request from March 20-22 has been approved.',
      type: 'leave',
      read: true,
      createdAt: '2024-03-13T11:20:00',
      actionUrl: '/student/leave',
      icon: Calendar,
      priority: 'medium'
    },
    {
      id: 4,
      title: 'New Study Material',
      message: 'New study material has been uploaded for Database Systems.',
      type: 'material',
      read: true,
      createdAt: '2024-03-12T08:15:00',
      actionUrl: '/student/materials',
      icon: BookOpen,
      priority: 'low'
    },
    {
      id: 5,
      title: 'Timetable Updated',
      message: 'Your timetable has been updated for the upcoming week.',
      type: 'timetable',
      read: false,
      createdAt: '2024-03-11T16:30:00',
      actionUrl: '/student/timetable',
      icon: Clock,
      priority: 'medium'
    },
    {
      id: 6,
      title: 'System Announcement',
      message: 'Mid-term examinations will commence from April 1st.',
      type: 'announcement',
      read: true,
      createdAt: '2024-03-10T10:00:00',
      actionUrl: '/dashboard',
      icon: Info,
      priority: 'high'
    }
  ];

  const getNotificationIcon = (type) => {
    const icons = {
      attendance: UserCheck,
      marks: Award,
      leave: Calendar,
      material: BookOpen,
      timetable: Clock,
      announcement: Info,
      warning: AlertCircle,
      success: CheckCircle,
      error: XCircle
    };
    return icons[type] || Bell;
  };

  const getNotificationColor = (type, priority) => {
    if (priority === 'high') return 'border-l-red-500 bg-red-50 dark:bg-red-900/20';
    if (priority === 'medium') return 'border-l-yellow-500 bg-yellow-50 dark:bg-yellow-900/20';
    
    const colors = {
      attendance: 'border-l-green-500 bg-green-50 dark:bg-green-900/20',
      marks: 'border-l-blue-500 bg-blue-50 dark:bg-blue-900/20',
      leave: 'border-l-purple-500 bg-purple-50 dark:bg-purple-900/20',
      material: 'border-l-orange-500 bg-orange-50 dark:bg-orange-900/20',
      timetable: 'border-l-teal-500 bg-teal-50 dark:bg-teal-900/20',
      announcement: 'border-l-indigo-500 bg-indigo-50 dark:bg-indigo-900/20'
    };
    return colors[type] || 'border-l-gray-500 bg-gray-50 dark:bg-gray-800';
  };

  const handleMarkAsRead = async (id) => {
    try {
      await notificationService.markAsRead(id);
      setNotifications(prev =>
        prev.map(notif =>
          notif.id === id ? { ...notif, read: true } : notif
        )
      );
      toast.success('Marked as read');
    } catch (error) {
      toast.error('Failed to mark as read');
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications(prev =>
        prev.map(notif => ({ ...notif, read: true }))
      );
      toast.success('All notifications marked as read');
    } catch (error) {
      toast.error('Failed to mark all as read');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this notification?')) {
      try {
        await notificationService.deleteNotification(id);
        setNotifications(prev => prev.filter(notif => notif.id !== id));
        toast.success('Notification deleted');
      } catch (error) {
        toast.error('Failed to delete notification');
      }
    }
  };

  const handleClearAll = async () => {
    if (window.confirm('Are you sure you want to clear all notifications?')) {
      try {
        await notificationService.clearAll();
        setNotifications([]);
        toast.success('All notifications cleared');
      } catch (error) {
        toast.error('Failed to clear notifications');
      }
    }
  };

  const handleViewDetails = (notification) => {
    setSelectedNotification(notification);
    setDetailsModalOpen(true);
    if (!notification.read) {
      handleMarkAsRead(notification.id);
    }
  };

  const handleSavePreferences = async () => {
    try {
      await notificationService.updatePreferences(preferences);
      toast.success('Notification preferences updated');
      setPreferencesModalOpen(false);
    } catch (error) {
      toast.error('Failed to update preferences');
    }
  };

  const filteredNotifications = notifications.filter(notification => {
    const matchesFilter = filter === 'all' || 
      (filter === 'unread' && !notification.read) ||
      (filter === 'read' && notification.read);
    const matchesSearch = notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         notification.message.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  const filterOptions = [
    { value: 'all', label: 'All', count: notifications.length },
    { value: 'unread', label: 'Unread', count: unreadCount },
    { value: 'read', label: 'Read', count: notifications.length - unreadCount }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
            Notifications
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Stay updated with your latest activities and announcements
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => setPreferencesModalOpen(true)}>
            <Settings size={18} className="mr-2" />
            Preferences
          </Button>
          <Button variant="outline" onClick={handleMarkAllAsRead} disabled={unreadCount === 0}>
            <Check size={18} className="mr-2" />
            Mark All Read
          </Button>
          <Button variant="outline" onClick={handleClearAll} disabled={notifications.length === 0}>
            <Trash2 size={18} className="mr-2" />
            Clear All
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="text-center">
          <Bell className="h-8 w-8 text-primary-600 mx-auto mb-2" />
          <p className="text-2xl font-bold">{notifications.length}</p>
          <p className="text-sm text-gray-500">Total Notifications</p>
        </Card>
        <Card className="text-center">
          <Mail className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
          <p className="text-2xl font-bold">{unreadCount}</p>
          <p className="text-sm text-gray-500">Unread</p>
        </Card>
        <Card className="text-center">
          <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
          <p className="text-2xl font-bold">{notifications.length - unreadCount}</p>
          <p className="text-sm text-gray-500">Read</p>
        </Card>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search notifications..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
            />
          </div>
        </div>
        <div className="flex gap-2">
          {filterOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => setFilter(option.value)}
              className={`px-4 py-2 rounded-xl transition-all ${
                filter === option.value
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              {option.label}
              <span className="ml-2 text-xs opacity-75">({option.count})</span>
            </button>
          ))}
        </div>
      </div>

      {/* Notifications List */}
      {loading ? (
        <div className="text-center py-12">
          <div className="loading-spinner mx-auto mb-4"></div>
          <p className="text-gray-500">Loading notifications...</p>
        </div>
      ) : filteredNotifications.length === 0 ? (
        <Card className="text-center py-12">
          <Bell className="h-12 w-12 mx-auto text-gray-400 mb-3" />
          <p className="text-gray-500">No notifications found</p>
          <p className="text-sm text-gray-400 mt-1">You're all caught up!</p>
        </Card>
      ) : (
        <div className="space-y-3">
          <AnimatePresence>
            {filteredNotifications.map((notification, index) => {
              const Icon = getNotificationIcon(notification.type);
              return (
                <motion.div
                  key={notification.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card
                    className={`cursor-pointer border-l-4 ${getNotificationColor(notification.type, notification.priority)} ${
                      !notification.read ? 'shadow-md' : 'opacity-80'
                    }`}
                    onClick={() => handleViewDetails(notification)}
                  >
                    <div className="flex items-start gap-4">
                      <div className={`p-2 rounded-lg ${
                        !notification.read ? 'bg-primary-100 dark:bg-primary-900/30' : 'bg-gray-100 dark:bg-gray-700'
                      }`}>
                        <Icon size={20} className={!notification.read ? 'text-primary-600' : 'text-gray-500'} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className={`font-semibold ${!notification.read ? 'text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-400'}`}>
                              {notification.title}
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                              {notification.message}
                            </p>
                          </div>
                          <div className="flex items-center gap-2 ml-4">
                            {!notification.read && (
                              <span className="w-2 h-2 bg-primary-600 rounded-full animate-pulse"></span>
                            )}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleMarkAsRead(notification.id);
                              }}
                              className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                              title="Mark as read"
                            >
                              <Eye size={14} className="text-gray-400" />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDelete(notification.id);
                              }}
                              className="p-1 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600"
                              title="Delete"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                          <div className="flex items-center gap-1">
                            <Clock size={12} />
                            <span>{format(new Date(notification.createdAt), 'MMM dd, yyyy hh:mm a')}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <span className={`px-1.5 py-0.5 rounded-full text-xs ${
                              notification.priority === 'high' ? 'bg-red-100 text-red-700' :
                              notification.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                              'bg-green-100 text-green-700'
                            }`}>
                              {notification.priority}
                            </span>
                          </div>
                        </div>
                      </div>
                      <ChevronRight size={16} className="text-gray-400 mt-2" />
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}

      {/* Notification Details Modal */}
      <Modal
        isOpen={detailsModalOpen}
        onClose={() => setDetailsModalOpen(false)}
        title={selectedNotification?.title}
        size="md"
      >
        {selectedNotification && (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${getNotificationColor(selectedNotification.type, selectedNotification.priority)}`}>
                {React.createElement(getNotificationIcon(selectedNotification.type), { size: 24 })}
              </div>
              <div>
                <p className="text-sm text-gray-500">
                  {format(new Date(selectedNotification.createdAt), 'MMMM dd, yyyy hh:mm a')}
                </p>
                <span className={`inline-block px-2 py-1 text-xs rounded-full mt-1 ${
                  selectedNotification.priority === 'high' ? 'bg-red-100 text-red-700' :
                  selectedNotification.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-green-100 text-green-700'
                }`}>
                  {selectedNotification.priority} priority
                </span>
              </div>
            </div>
            <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                {selectedNotification.message}
              </p>
            </div>
            {selectedNotification.actionUrl && (
              <Button
                variant="primary"
                fullWidth
                onClick={() => {
                  window.location.href = selectedNotification.actionUrl;
                }}
              >
                View Details
              </Button>
            )}
          </div>
        )}
      </Modal>

      {/* Preferences Modal */}
      <Modal
        isOpen={preferencesModalOpen}
        onClose={() => setPreferencesModalOpen(false)}
        title="Notification Preferences"
        size="lg"
        actions={
          <>
            <Button variant="outline" onClick={() => setPreferencesModalOpen(false)}>Cancel</Button>
            <Button variant="primary" onClick={handleSavePreferences}>Save Preferences</Button>
          </>
        }
      >
        <div className="space-y-6">
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Delivery Methods</h3>
            <div className="space-y-3">
              <label className="flex items-center justify-between p-3 rounded-lg border border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-3">
                  <Mail size={18} className="text-primary-600" />
                  <span className="text-sm">Email Notifications</span>
                </div>
                <input
                  type="checkbox"
                  checked={preferences.email}
                  onChange={(e) => setPreferences({ ...preferences, email: e.target.checked })}
                  className="h-4 w-4 text-primary-600 rounded"
                />
              </label>
              <label className="flex items-center justify-between p-3 rounded-lg border border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-3">
                  <Bell size={18} className="text-primary-600" />
                  <span className="text-sm">Push Notifications</span>
                </div>
                <input
                  type="checkbox"
                  checked={preferences.push}
                  onChange={(e) => setPreferences({ ...preferences, push: e.target.checked })}
                  className="h-4 w-4 text-primary-600 rounded"
                />
              </label>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Notification Types</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <label className="flex items-center justify-between p-3 rounded-lg border border-gray-200 dark:border-gray-700">
                <span className="text-sm">Attendance Updates</span>
                <input
                  type="checkbox"
                  checked={preferences.attendance}
                  onChange={(e) => setPreferences({ ...preferences, attendance: e.target.checked })}
                  className="h-4 w-4 text-primary-600 rounded"
                />
              </label>
              <label className="flex items-center justify-between p-3 rounded-lg border border-gray-200 dark:border-gray-700">
                <span className="text-sm">Marks & Grades</span>
                <input
                  type="checkbox"
                  checked={preferences.marks}
                  onChange={(e) => setPreferences({ ...preferences, marks: e.target.checked })}
                  className="h-4 w-4 text-primary-600 rounded"
                />
              </label>
              <label className="flex items-center justify-between p-3 rounded-lg border border-gray-200 dark:border-gray-700">
                <span className="text-sm">Leave Requests</span>
                <input
                  type="checkbox"
                  checked={preferences.leave}
                  onChange={(e) => setPreferences({ ...preferences, leave: e.target.checked })}
                  className="h-4 w-4 text-primary-600 rounded"
                />
              </label>
              <label className="flex items-center justify-between p-3 rounded-lg border border-gray-200 dark:border-gray-700">
                <span className="text-sm">Timetable Changes</span>
                <input
                  type="checkbox"
                  checked={preferences.timetable}
                  onChange={(e) => setPreferences({ ...preferences, timetable: e.target.checked })}
                  className="h-4 w-4 text-primary-600 rounded"
                />
              </label>
              <label className="flex items-center justify-between p-3 rounded-lg border border-gray-200 dark:border-gray-700">
                <span className="text-sm">Study Materials</span>
                <input
                  type="checkbox"
                  checked={preferences.materials}
                  onChange={(e) => setPreferences({ ...preferences, materials: e.target.checked })}
                  className="h-4 w-4 text-primary-600 rounded"
                />
              </label>
              <label className="flex items-center justify-between p-3 rounded-lg border border-gray-200 dark:border-gray-700">
                <span className="text-sm">Announcements</span>
                <input
                  type="checkbox"
                  checked={preferences.announcements}
                  onChange={(e) => setPreferences({ ...preferences, announcements: e.target.checked })}
                  className="h-4 w-4 text-primary-600 rounded"
                />
              </label>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Notifications;