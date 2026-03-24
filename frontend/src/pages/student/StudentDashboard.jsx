import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Calendar,
  Clock,
  BookOpen,
  Award,
  TrendingUp,
  Bell,
  ChevronRight,
  Download,
  Eye,
  BarChart3,
  School,
  FileText,
  UserCheck,
  CalendarDays,
  AlertCircle,
  CheckCircle,
  Activity
} from 'lucide-react';
import Card from '../../components/Common/Card';
import Button from '../../components/Common/Button';
import LineChart from '../../components/Charts/LineChart';
import { studentService } from '../../services/studentService';
import { useAuth } from '../../hooks/useAuth';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

const StudentDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({
    stats: {},
    charts: {},
    upcomingClasses: [],
    recentActivities: [],
    notifications: []
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await studentService.getDashboard();
      setDashboardData(response);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
      // toast.error('Failed to load dashboard data');
      setDashboardData({
        stats: { attendancePercentage: 0, totalSubjects: 0, completedAssignments: 0, upcomingExams: 0, cgpa: 0, totalCredits: 0 },
        charts: { performanceTrend: [] },
        upcomingClasses: [],
        recentActivities: [],
        notifications: []
      });
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ title, value, icon: Icon, trend, color, suffix = '' }) => (
    <motion.div
      whileHover={{ y: -5, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300 }}
      className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl shadow-lg border border-white/20 dark:border-gray-700/50 p-6 flex flex-col justify-between transition-all hover:shadow-xl hover:shadow-[color]/20 relative overflow-hidden group"
    >
      <div className={`absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-${color}-500/10 rounded-full blur-2xl transform group-hover:scale-150 transition-transform duration-500`}></div>
      <div className="flex justify-between items-start mb-4 relative z-10">
        <div className={`p-3 rounded-2xl bg-gradient-to-br from-${color}-500/20 to-${color}-600/10 text-${color}-600 dark:text-${color}-400 shadow-inner`}>
          <Icon className="h-6 w-6" strokeWidth={2} />
        </div>
        {trend ? (
          <div className={`px-2.5 py-1 rounded-full text-xs font-bold backdrop-blur-md ${trend > 0 ? 'bg-green-500/10 text-green-600 dark:text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20'}`}>
            {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}%
          </div>
        ) : null}
      </div>
      <div className="relative z-10">
        <h3 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">
          {typeof value === 'number' ? value.toLocaleString() : value || 0}<span className="text-xl font-bold text-gray-400 ml-1">{suffix}</span>
        </h3>
        <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 mt-1 uppercase tracking-wider">{title}</p>
      </div>
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
        className="relative overflow-hidden bg-gradient-to-br from-indigo-900 via-primary-800 to-indigo-900 rounded-3xl p-8 md:p-10 text-white shadow-2xl border border-white/10"
      >
        <div className="absolute top-0 right-0 w-[30rem] h-[30rem] bg-indigo-500/20 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/3"></div>
        <div className="absolute bottom-0 left-0 w-[20rem] h-[20rem] bg-rose-500/20 rounded-full blur-[60px] translate-y-1/2 -translate-x-1/4"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="flex items-center gap-6">
            <div className="h-20 w-20 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 shadow-inner">
              <span className="text-4xl font-bold bg-gradient-to-br from-white to-white/60 bg-clip-text text-transparent">
                {user?.name?.charAt(0) || 'S'}
              </span>
            </div>
            <div>
              <motion.h1 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="text-3xl md:text-4xl font-black mb-2 tracking-tight"
              >
                Welcome back, <span className="bg-gradient-to-r from-blue-200 to-indigo-200 bg-clip-text text-transparent">{user?.name || 'Student'}</span>
              </motion.h1>
              <p className="text-primary-100/80 font-medium text-lg flex items-center gap-2">
                <CalendarDays size={18} />
                {format(new Date(), 'EEEE, MMMM do, yyyy')}
              </p>
            </div>
          </div>
          <div className="flex gap-3 w-full md:w-auto mt-4 md:mt-0">
            <Button 
              variant="outline" 
              className="flex-1 md:flex-none bg-white/5 backdrop-blur-md border-white/10 text-white hover:bg-white/10 hover:border-white/30 transition-all rounded-xl py-2.5 font-semibold shadow-lg" 
              onClick={() => navigate('/student/attendance')}
            >
              <Eye size={18} className="mr-2" />
              Attendance
            </Button>
            <Button 
              className="flex-1 md:flex-none bg-indigo-500 hover:bg-indigo-400 text-white border-0 shadow-lg shadow-indigo-500/30 transition-all rounded-xl py-2.5 font-semibold" 
              onClick={() => navigate('/student/materials')}
            >
              <BookOpen size={18} className="mr-2" />
              Materials
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6"
      >
        <StatCard title="Attendance" value={dashboardData.stats.attendancePercentage} icon={UserCheck} color="emerald" suffix="%" trend={2.5} />
        <StatCard title="CGPA" value={dashboardData.stats.cgpa} icon={Award} color="indigo" />
        <StatCard title="Total Subjects" value={dashboardData.stats.totalSubjects} icon={BookOpen} color="violet" />
        <StatCard title="Credits" value={dashboardData.stats.totalCredits} icon={Activity} color="amber" />
        <StatCard title="Assignments" value={dashboardData.stats.completedAssignments} icon={FileText} color="cyan" />
        <StatCard title="Upcoming Exams" value={dashboardData.stats.upcomingExams} icon={Calendar} color="rose" />
      </motion.div>

      {/* Performance Chart */}
      <LineChart
        data={dashboardData.charts.performanceTrend}
        lines={[{ key: 'marks', name: 'Performance %' }]}
        xAxisKey="month"
        title="Academic Performance Trend"
        subtitle="Monthly performance tracking"
        height={350}
        colors={['#3b82f6']}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Today's Schedule */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <CalendarDays className="h-5 w-5 text-indigo-500" />
              Today's Schedule
            </h2>
            <Button variant="ghost" size="sm" className="text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 font-medium" onClick={() => navigate('/student/timetable')}>
              View Full Timetable <ChevronRight size={16} className="ml-1" />
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {dashboardData.upcomingClasses.map((classItem, index) => (
              <motion.div
                key={classItem.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-100 dark:border-gray-700/80 shadow-sm hover:shadow-md transition-all group relative overflow-hidden"
              >
                <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500 rounded-l-2xl"></div>
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="font-bold text-gray-900 dark:text-white text-lg">{classItem.subject}</h4>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mt-0.5">{classItem.teacher}</p>
                  </div>
                  <span className="text-xs font-bold text-indigo-700 bg-indigo-50 dark:bg-indigo-900/40 dark:text-indigo-300 px-3 py-1.5 rounded-full border border-indigo-100 dark:border-indigo-800 backdrop-blur-sm shadow-sm">
                    {classItem.time}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-sm font-medium text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-700/50 p-3 rounded-xl">
                  <div className="flex items-center gap-1">
                    <School size={12} />
                    <span>{classItem.room}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock size={12} />
                    <span>{classItem.duration}</span>
                  </div>
                </div>
              </motion.div>
            ))}
            {dashboardData.upcomingClasses.length === 0 && (
              <div className="col-span-full py-10 text-center bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-dashed border-gray-200 dark:border-gray-700">
                <School className="h-10 w-10 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-500 dark:text-gray-400 font-medium">No classes scheduled for today.</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Notifications Placeholder */}
          <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-700/80">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Bell className="h-5 w-5 text-rose-500" />
                Notifications
              </h2>
            </div>
            <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
              {dashboardData.notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 rounded-2xl cursor-pointer transition-all border ${
                    !notification.read 
                      ? 'bg-rose-50/50 dark:bg-rose-900/10 border-rose-100 dark:border-rose-900/30 hover:bg-rose-50 dark:hover:bg-rose-900/20'
                      : 'bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700 hover:border-gray-200 dark:hover:border-gray-600'
                  }`}
                >
                  <div className="flex gap-3">
                    <div className="mt-0.5">
                      {notification.type === 'warning' && <AlertCircle size={18} className="text-amber-500" />}
                      {notification.type === 'info' && <Bell size={18} className="text-blue-500" />}
                      {notification.type === 'success' && <CheckCircle size={18} className="text-emerald-500" />}
                    </div>
                    <div>
                      <p className={`text-sm font-semibold ${!notification.read ? 'text-gray-900 dark:text-white' : 'text-gray-700 dark:text-gray-300'}`}>
                        {notification.title}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 leading-relaxed">{notification.message}</p>
                    </div>
                  </div>
                </div>
              ))}
              {dashboardData.notifications.length === 0 && (
                <div className="text-center py-6">
                  <p className="text-sm text-gray-500">No new notifications</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-700/80">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
          <Activity className="h-5 w-5 text-indigo-500" />
          Quick Actions
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {[
            { title: 'Attendance', icon: UserCheck, color: 'emerald', path: '/student/attendance' },
            { title: 'Marks', icon: Award, color: 'indigo', path: '/student/marks' },
            { title: 'Timetable', icon: CalendarDays, color: 'violet', path: '/student/timetable' },
            { title: 'Apply Leave', icon: Calendar, color: 'rose', path: '/student/leave' },
            { title: 'Materials', icon: BookOpen, color: 'amber', path: '/student/materials' }
          ].map((action, idx) => (
            <button
              key={idx}
              onClick={() => navigate(action.path)}
              className={`p-6 text-center rounded-2xl border border-gray-100 dark:border-gray-700/50 bg-gray-50/50 dark:bg-gray-800/50 hover:bg-white dark:hover:bg-gray-800 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group flex flex-col items-center justify-center gap-3`}
            >
              <div className={`p-4 rounded-2xl bg-${action.color}-100/50 dark:bg-${action.color}-900/20 text-${action.color}-600 dark:text-${action.color}-400 group-hover:scale-110 transition-transform duration-300`}>
                <action.icon className="h-7 w-7" strokeWidth={2} />
              </div>
              <span className="text-sm font-bold text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">{action.title}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Performance Summary */}
      <Card title="Performance Summary">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <h4 className="font-semibold text-green-800 dark:text-green-300 mb-2">Strengths</h4>
            <ul className="space-y-1 text-sm text-green-700 dark:text-green-400">
              <li>• Consistent performance in core subjects</li>
              <li>• Good attendance record</li>
              <li>• Active participation in practical sessions</li>
            </ul>
          </div>
          <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
            <h4 className="font-semibold text-yellow-800 dark:text-yellow-300 mb-2">Areas for Improvement</h4>
            <ul className="space-y-1 text-sm text-yellow-700 dark:text-yellow-400">
              <li>• Algorithms subject needs attention</li>
              <li>• Improve assignment submission time</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default StudentDashboard;