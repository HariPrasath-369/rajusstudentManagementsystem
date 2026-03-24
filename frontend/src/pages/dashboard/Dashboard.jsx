import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Users,
  GraduationCap,
  BookOpen,
  Calendar,
  Clock,
  Award,
  TrendingUp,
  UserCheck,
  UserX,
  Activity,
  Bell,
  ChevronRight,
  Download,
  Eye,
  BarChart3,
  School,
  Mail,
  Phone,
  MapPin,
  Calendar as CalendarIcon,
  CheckCircle,
  XCircle,
  AlertCircle,
  FileText,
  QrCode
} from 'lucide-react';
import Card from '../../components/Common/Card';
import Button from '../../components/Common/Button';
import LineChart from '../../components/Charts/LineChart';
import BarChart from '../../components/Charts/BarChart';
import PieChart from '../../components/Charts/PieChart';
import { dashboardService } from '../../services/dashboardService';
import { format, subDays } from 'date-fns';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({
    stats: {},
    charts: {},
    recentActivities: [],
    notifications: [],
    upcomingEvents: [],
    quickActions: []
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await dashboardService.getDashboard();
      setDashboardData(response);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
      // toast.error('Failed to load dashboard data');
      setDashboardData({
        stats: { totalStudents: 0, totalTeachers: 0, totalDepartments: 0, totalClasses: 0, averageAttendance: 0, passPercentage: 0, pendingLeaves: 0, upcomingExams: 0 },
        charts: { attendanceTrend: [], marksDistribution: [], departmentPerformance: [] },
        recentActivities: [],
        notifications: [],
        upcomingEvents: [],
        quickActions: []
      });
    } finally {
      setLoading(false);
    }
  };


  const getStatIcon = (statName) => {
    const icons = {
      totalStudents: GraduationCap,
      totalTeachers: Users,
      totalDepartments: School,
      totalClasses: BookOpen,
      averageAttendance: Clock,
      passPercentage: Award,
      pendingLeaves: UserX,
      upcomingExams: Calendar
    };
    return icons[statName] || Activity;
  };

  const getActivityIcon = (type) => {
    const icons = {
      attendance: UserCheck,
      marks: Award,
      leave: Calendar,
      timetable: Clock
    };
    return icons[type] || Activity;
  };

  const getNotificationIcon = (type) => {
    const icons = {
      warning: AlertCircle,
      danger: XCircle,
      success: CheckCircle,
      info: Bell
    };
    return icons[type] || Bell;
  };

  const StatCard = ({ title, value, icon: Icon, trend, color }) => (
    <motion.div
      whileHover={{ y: -4 }}
      className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700/80 p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between transition-all hover:shadow-lg hover:border-blue-100"
    >
      <div className="flex items-center gap-5">
        <div className={`p-4 rounded-[1rem] bg-${color}-50 dark:bg-${color}-900/20 text-${color}-600 dark:text-${color}-400`}>
          <Icon className="h-8 w-8" strokeWidth={1.5} />
        </div>
        <div className="flex flex-col">
          <p className="text-xs font-bold text-gray-500 dark:text-gray-400 mb-1 tracking-wider uppercase">{title}</p>
          <h3 className="text-3xl font-extrabold text-gray-900 dark:text-white">
            {typeof value === 'number' ? value.toLocaleString() : value || 0}
          </h3>
        </div>
      </div>
      {trend ? (
        <div className={`mt-4 sm:mt-0 px-3 py-1.5 rounded-full text-xs font-bold ${trend > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}%
        </div>
      ) : null}
    </motion.div>
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="loading-spinner mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl p-6 text-white"
      >
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold mb-2">
              Welcome back, {user?.name}!
            </h1>
            <p className="text-primary-100">
              Here's what's happening with your {user?.role === 'ROLE_PRINCIPAL' ? 'institution' : 'dashboard'} today.
            </p>
          </div>
          <div className="mt-4 md:mt-0 flex gap-3">
            <Button variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
              <Download size={18} className="mr-2" />
              Export Report
            </Button>
            <Button variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
              <Eye size={18} className="mr-2" />
              View Analytics
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {Object.entries(dashboardData.stats).map(([key, value], index) => {
          const Icon = getStatIcon(key);
          return (
            <motion.div
              key={key}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <StatCard
                title={key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                value={value}
                icon={Icon}
                color="primary"
              />
            </motion.div>
          );
        })}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <LineChart
          data={dashboardData.charts.attendanceTrend}
          lines={[{ key: 'attendance', name: 'Attendance %' }]}
          xAxisKey="month"
          title="Attendance Trend"
          subtitle="Monthly attendance percentage"
          height={350}
        />
        
        <BarChart
          data={dashboardData.charts.marksDistribution}
          bars={[{ key: 'students', name: 'Number of Students' }]}
          xAxisKey="range"
          title="Marks Distribution"
          subtitle="Student performance distribution"
          height={350}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activities */}
        <Card title="Recent Activities" className="lg:col-span-2">
          <div className="space-y-4">
            {dashboardData.recentActivities.map((activity, index) => {
              const Icon = getActivityIcon(activity.type);
              return (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <div className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700">
                    <Icon size={18} className="text-primary-600 dark:text-primary-400" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-900 dark:text-white">{activity.message}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-gray-500 dark:text-gray-400">{activity.user}</span>
                      <span className="text-xs text-gray-400">•</span>
                      <span className="text-xs text-gray-400">{activity.time}</span>
                    </div>
                  </div>
                  <ChevronRight size={16} className="text-gray-400" />
                </motion.div>
              );
            })}
          </div>
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <Button variant="ghost" size="sm" fullWidth>
              View All Activities
            </Button>
          </div>
        </Card>

        {/* Notifications & Upcoming Events */}
        <div className="space-y-6">
          {/* Notifications */}
          <Card title="Notifications" className="overflow-hidden">
            <div className="space-y-3 max-h-80 overflow-y-auto custom-scrollbar">
              {dashboardData.notifications.map((notification) => {
                const Icon = getNotificationIcon(notification.type);
                return (
                  <div
                    key={notification.id}
                    className={`p-3 rounded-lg cursor-pointer transition-colors ${
                      !notification.read 
                        ? 'bg-primary-50 dark:bg-primary-900/20 border-l-4 border-primary-500'
                        : 'hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <Icon size={16} className={`mt-0.5 ${
                        notification.type === 'warning' ? 'text-yellow-500' :
                        notification.type === 'danger' ? 'text-red-500' :
                        notification.type === 'success' ? 'text-green-500' :
                        'text-primary-500'
                      }`} />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {notification.title}
                        </p>
                        <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                          {notification.message}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <Button variant="ghost" size="sm" fullWidth>
                View All Notifications
              </Button>
            </div>
          </Card>

          {/* Upcoming Events */}
          <Card title="Upcoming Events">
            <div className="space-y-3">
              {dashboardData.upcomingEvents.map((event) => (
                <div key={event.id} className="flex items-start gap-3 p-2">
                  <div className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700">
                    <CalendarIcon size={16} className="text-primary-600 dark:text-primary-400" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{event.title}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {format(new Date(event.date), 'MMM dd, yyyy')}
                    </p>
                  </div>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    event.type === 'exam' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                    event.type === 'meeting' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
                    'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                  }`}>
                    {event.type}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {/* Quick Actions */}
      <Card title="Quick Actions">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {dashboardData.quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <motion.button
                key={action.id}
                whileHover={{ y: -2 }}
                onClick={() => navigate(action.path)}
                className="p-4 h-full text-center rounded-xl border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all flex flex-col items-center justify-center gap-2"
              >
                <Icon size={24} className={`mx-auto mb-2 text-${action.color}-600 dark:text-${action.color}-400`} />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{action.label}</span>
              </motion.button>
            );
          })}
        </div>
      </Card>

      {/* Footer Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center text-sm text-gray-500 dark:text-gray-400">
        <div className="flex items-center justify-center gap-2">
          <Activity size={14} />
          <span>System Status: <span className="text-green-500">Operational</span></span>
        </div>
        <div className="flex items-center justify-center gap-2">
          <Clock size={14} />
          <span>Last Updated: {format(new Date(), 'hh:mm a')}</span>
        </div>
        <div className="flex items-center justify-center gap-2">
          <Bell size={14} />
          <span>Next Backup: {format(new Date().setHours(2, 0, 0), 'hh:mm a')}</span>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;