import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
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
  FileText,
  AlertCircle
} from 'lucide-react';
import Card from '../../components/Common/Card';
import Button from '../../components/Common/Button';
import LineChart from '../../components/Charts/LineChart';
import BarChart from '../../components/Charts/BarChart';
import PieChart from '../../components/Charts/PieChart';
import { hodService } from '../../services/hodService';
import { useAuth } from '../../hooks/useAuth';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

const HODDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({
    stats: {},
    charts: {},
    recentActivities: [],
    notifications: [],
    upcomingEvents: [],
    teacherWorkload: []
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await hodService.getDashboard();
      setDashboardData(response);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
      toast.error('Failed to load dashboard data');
      setDashboardData({
        stats: { totalTeachers: 0, totalClasses: 0, totalStudents: 0, averageAttendance: 0, passPercentage: 0, pendingLeaves: 0, pendingApprovals: 0 },
        charts: { attendanceTrend: [], subjectPerformance: [] },
        recentActivities: [],
        notifications: [],
        upcomingEvents: [],
        teacherWorkload: []
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
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
            Welcome, {user?.name || 'HOD'}!
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Computer Science & Engineering Department
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => navigate('/hod/semester-approval')}>
            <Calendar size={18} className="mr-2" />
            Approve Semester
          </Button>
          <Button variant="primary" onClick={() => navigate('/hod/department-analytics')}>
            <BarChart3 size={18} className="mr-2" />
            View Analytics
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Teachers" value={dashboardData.stats.totalTeachers} icon={Users} color="blue" trend={5} />
        <StatCard title="Total Classes" value={dashboardData.stats.totalClasses} icon={GraduationCap} color="green" trend={2} />
        <StatCard title="Total Students" value={dashboardData.stats.totalStudents} icon={School} color="purple" />
        <StatCard title="Avg Attendance" value={`${dashboardData.stats.averageAttendance}%`} icon={Clock} color="orange" trend={1.5} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Attendance Trend */}
        <LineChart
          data={dashboardData.charts.attendanceTrend}
          lines={[{ key: 'attendance', name: 'Attendance %' }]}
          xAxisKey="month"
          title="Attendance Trend"
          subtitle="Monthly attendance percentage"
          height={350}
        />

        {/* Subject Performance */}
        <BarChart
          data={dashboardData.charts.subjectPerformance}
          bars={[{ key: 'avgMarks', name: 'Average Marks' }]}
          xAxisKey="subject"
          title="Subject Performance"
          subtitle="Average marks by subject"
          height={350}
          colors={['#3b82f6']}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Teacher Workload */}
        <Card title="Teacher Workload" className="lg:col-span-2">
          <div className="space-y-3">
            {dashboardData.teacherWorkload.map((teacher, index) => (
              <motion.div
                key={teacher.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-3 rounded-lg border border-gray-200 dark:border-gray-700"
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium text-gray-900 dark:text-white">{teacher.name}</span>
                  <span className="text-sm text-gray-500">
                    {teacher.hours} hours/week
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-primary-600 h-2 rounded-full"
                    style={{ width: `${(teacher.hours / 20) * 100}%` }}
                  />
                </div>
                <div className="flex justify-between mt-2 text-xs text-gray-500">
                  <span>{teacher.classes} classes</span>
                  <span>{teacher.students} students</span>
                </div>
              </motion.div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <Button variant="ghost" size="sm" fullWidth onClick={() => navigate('/hod/teachers')}>
              Manage Workload
            </Button>
          </div>
        </Card>

        {/* Notifications & Events */}
        <div className="space-y-6">
          <Card title="Notifications">
            <div className="space-y-3">
              {dashboardData.notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-3 rounded-lg ${
                    !notification.read 
                      ? 'bg-primary-50 dark:bg-primary-900/20 border-l-4 border-primary-500'
                      : 'hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{notification.title}</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">{notification.message}</p>
                </div>
              ))}
            </div>
          </Card>

          <Card title="Upcoming Events">
            <div className="space-y-3">
              {dashboardData.upcomingEvents.map((event) => (
                <div key={event.id} className="flex items-center justify-between p-2">
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{event.title}</p>
                    <p className="text-xs text-gray-500">{format(new Date(event.date), 'MMM dd, yyyy')}</p>
                  </div>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    event.type === 'exam' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
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
          <button
            onClick={() => navigate('/hod/teachers')}
            className="p-4 h-full text-center rounded-xl border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all flex flex-col items-center justify-center gap-3"
          >
            <Users size={24} className="mx-auto mb-2 text-primary-600" />
            <span className="text-sm">Manage Teachers</span>
          </button>
          <button
            onClick={() => navigate('/hod/classes')}
            className="p-4 h-full text-center rounded-xl border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all flex flex-col items-center justify-center gap-3"
          >
            <GraduationCap size={24} className="mx-auto mb-2 text-primary-600" />
            <span className="text-sm">Manage Classes</span>
          </button>
          <button
            onClick={() => navigate('/hod/timetable')}
            className="p-4 h-full text-center rounded-xl border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all flex flex-col items-center justify-center gap-3"
          >
            <Calendar size={24} className="mx-auto mb-2 text-primary-600" />
            <span className="text-sm">Create Timetable</span>
          </button>
          <button
            onClick={() => navigate('/hod/department-analytics')}
            className="p-4 h-full text-center rounded-xl border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all flex flex-col items-center justify-center gap-3"
          >
            <TrendingUp size={24} className="mx-auto mb-2 text-primary-600" />
            <span className="text-sm">View Analytics</span>
          </button>
        </div>
      </Card>
    </div>
  );
};

export default HODDashboard;