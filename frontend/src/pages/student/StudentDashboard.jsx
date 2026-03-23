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
      toast.error('Failed to load dashboard data');
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
            {typeof value === 'number' ? value.toLocaleString() : value || 0}{suffix}
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
              Welcome back, {user?.name || 'Student'}!
            </h1>
            <p className="text-primary-100">
              Track your academic progress and stay updated with your classes
            </p>
          </div>
          <div className="mt-4 md:mt-0 flex gap-3">
            <Button variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20" onClick={() => navigate('/student/attendance')}>
              <Eye size={18} className="mr-2" />
              View Attendance
            </Button>
            <Button variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20" onClick={() => navigate('/student/marks')}>
              <Award size={18} className="mr-2" />
              View Marks
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <StatCard title="Attendance" value={dashboardData.stats.attendancePercentage} icon={UserCheck} color="green" suffix="%" />
        <StatCard title="CGPA" value={dashboardData.stats.cgpa} icon={Award} color="blue" />
        <StatCard title="Total Subjects" value={dashboardData.stats.totalSubjects} icon={BookOpen} color="purple" />
        <StatCard title="Credits" value={dashboardData.stats.totalCredits} icon={Activity} color="orange" />
        <StatCard title="Assignments" value={dashboardData.stats.completedAssignments} icon={FileText} color="teal" />
        <StatCard title="Upcoming Exams" value={dashboardData.stats.upcomingExams} icon={Calendar} color="red" />
      </div>

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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's Schedule */}
        <Card title="Today's Schedule" className="lg:col-span-2">
          <div className="space-y-3">
            {dashboardData.upcomingClasses.map((classItem, index) => (
              <motion.div
                key={classItem.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all"
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">{classItem.subject}</h4>
                    <p className="text-sm text-primary-600 dark:text-primary-400">{classItem.teacher}</p>
                  </div>
                  <span className="text-sm font-medium text-primary-600 bg-primary-50 dark:bg-primary-900/30 px-2 py-1 rounded">
                    {classItem.time}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-xs text-gray-500">
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
          </div>
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <Button variant="ghost" size="sm" fullWidth onClick={() => navigate('/student/timetable')}>
              View Full Timetable
            </Button>
          </div>
        </Card>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Notifications */}
          <Card title="Notifications">
            <div className="space-y-3 max-h-80 overflow-y-auto">
              {dashboardData.notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-3 rounded-lg cursor-pointer transition-colors ${
                    !notification.read 
                      ? 'bg-primary-50 dark:bg-primary-900/20 border-l-4 border-primary-500'
                      : 'hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {notification.type === 'warning' && <AlertCircle size={16} className="text-yellow-500 mt-0.5" />}
                    {notification.type === 'info' && <Bell size={16} className="text-blue-500 mt-0.5" />}
                    {notification.type === 'success' && <CheckCircle size={16} className="text-green-500 mt-0.5" />}
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{notification.title}</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">{notification.message}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Recent Activities */}
          <Card title="Recent Activities">
            <div className="space-y-3">
              {dashboardData.recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start gap-3 p-2">
                  <div className={`p-2 rounded-lg ${
                    activity.type === 'attendance' ? 'bg-green-100 dark:bg-green-900/30' :
                    activity.type === 'marks' ? 'bg-blue-100 dark:bg-blue-900/30' :
                    'bg-purple-100 dark:bg-purple-900/30'
                  }`}>
                    {activity.type === 'attendance' ? <UserCheck size={14} /> :
                     activity.type === 'marks' ? <Award size={14} /> :
                     <FileText size={14} />}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-900 dark:text-white">{activity.message}</p>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                    {activity.marks && (
                      <span className="text-xs font-medium text-green-600">Score: {activity.marks}%</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {/* Quick Actions */}
      <Card title="Quick Actions">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          <button
            onClick={() => navigate('/student/attendance')}
            className="p-4 h-full text-center rounded-xl border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all group flex flex-col items-center justify-center gap-2"
          >
            <div className="p-2 rounded-full bg-primary-50 dark:bg-primary-900/30 w-12 h-12 mx-auto mb-2 group-hover:bg-primary-100 dark:group-hover:bg-primary-900/50 transition-colors">
              <UserCheck className="h-6 w-6 text-primary-600 mx-auto" />
            </div>
            <span className="text-sm font-medium">View Attendance</span>
          </button>
          <button
            onClick={() => navigate('/student/marks')}
            className="p-4 h-full text-center rounded-xl border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all group flex flex-col items-center justify-center gap-2"
          >
            <div className="p-2 rounded-full bg-primary-50 dark:bg-primary-900/30 w-12 h-12 mx-auto mb-2 group-hover:bg-primary-100 dark:group-hover:bg-primary-900/50 transition-colors">
              <Award className="h-6 w-6 text-primary-600 mx-auto" />
            </div>
            <span className="text-sm font-medium">View Marks</span>
          </button>
          <button
            onClick={() => navigate('/student/timetable')}
            className="p-4 h-full text-center rounded-xl border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all group flex flex-col items-center justify-center gap-2"
          >
            <div className="p-2 rounded-full bg-primary-50 dark:bg-primary-900/30 w-12 h-12 mx-auto mb-2 group-hover:bg-primary-100 dark:group-hover:bg-primary-900/50 transition-colors">
              <CalendarDays className="h-6 w-6 text-primary-600 mx-auto" />
            </div>
            <span className="text-sm font-medium">Timetable</span>
          </button>
          <button
            onClick={() => navigate('/student/leave')}
            className="p-4 h-full text-center rounded-xl border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all group flex flex-col items-center justify-center gap-2"
          >
            <div className="p-2 rounded-full bg-primary-50 dark:bg-primary-900/30 w-12 h-12 mx-auto mb-2 group-hover:bg-primary-100 dark:group-hover:bg-primary-900/50 transition-colors">
              <Calendar className="h-6 w-6 text-primary-600 mx-auto" />
            </div>
            <span className="text-sm font-medium">Apply Leave</span>
          </button>
          <button
            onClick={() => navigate('/student/materials')}
            className="p-4 h-full text-center rounded-xl border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all group flex flex-col items-center justify-center gap-2"
          >
            <div className="p-2 rounded-full bg-primary-50 dark:bg-primary-900/30 w-12 h-12 mx-auto mb-2 group-hover:bg-primary-100 dark:group-hover:bg-primary-900/50 transition-colors">
              <BookOpen className="h-6 w-6 text-primary-600 mx-auto" />
            </div>
            <span className="text-sm font-medium">Study Materials</span>
          </button>
        </div>
      </Card>

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