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
  Bell,
  ChevronRight,
  Download,
  Eye,
  BarChart3,
  School,
  FileText,
  QrCode,
  Upload,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';
import Card from '../../components/Common/Card';
import Button from '../../components/Common/Button';
import LineChart from '../../components/Charts/LineChart';
import BarChart from '../../components/Charts/BarChart';
import { teacherService } from '../../services/teacherService';
import { useAuth } from '../../hooks/useAuth';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

const TeacherDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({
    stats: {},
    charts: {},
    assignedClasses: [],
    recentActivities: [],
    upcomingClasses: [],
    pendingTasks: []
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await teacherService.getDashboard();
      setDashboardData(response);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
      toast.error('Failed to load dashboard data');
      setDashboardData({
        stats: { totalClasses: 0, totalStudents: 0, todayClasses: 0, pendingAttendance: 0, pendingMarks: 0, averageAttendance: 0, pendingLeaves: 0 },
        charts: { attendanceTrend: [], performance: [] },
        assignedClasses: [],
        upcomingClasses: [],
        recentActivities: [],
        pendingTasks: []
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
              Welcome back, {user?.name || 'Professor'}!
            </h1>
            <p className="text-primary-100">
              Here's your teaching summary for today. You have {dashboardData.stats.todayClasses} classes scheduled.
            </p>
          </div>
          <div className="mt-4 md:mt-0 flex gap-3">
            <Button variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
              <QrCode size={18} className="mr-2" />
              QR Attendance
            </Button>
            <Button variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
              <Upload size={18} className="mr-2" />
              Upload Material
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-4">
        <StatCard title="Total Classes" value={dashboardData.stats.totalClasses} icon={BookOpen} color="blue" />
        <StatCard title="Total Students" value={dashboardData.stats.totalStudents} icon={Users} color="green" />
        <StatCard title="Today's Classes" value={dashboardData.stats.todayClasses} icon={Calendar} color="purple" />
        <StatCard title="Pending Attendance" value={dashboardData.stats.pendingAttendance} icon={Clock} color="orange" />
        <StatCard title="Pending Marks" value={dashboardData.stats.pendingMarks} icon={Award} color="red" />
        <StatCard title="Avg Attendance" value={`${dashboardData.stats.averageAttendance}%`} icon={UserCheck} color="teal" trend={2.5} />
        <StatCard title="Pending Leaves" value={dashboardData.stats.pendingLeaves} icon={Bell} color="yellow" />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <LineChart
          data={dashboardData.charts.attendanceTrend}
          lines={[{ key: 'attendance', name: 'Attendance %' }]}
          xAxisKey="month"
          title="Attendance Trend"
          subtitle="Monthly attendance across all classes"
          height={350}
          colors={['#3b82f6']}
        />

        <BarChart
          data={dashboardData.charts.performance}
          bars={[{ key: 'avgMarks', name: 'Average Marks' }]}
          xAxisKey="subject"
          title="Subject Performance"
          subtitle="Average marks by subject"
          height={350}
          colors={['#10b981']}
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Assigned Classes */}
        <Card title="My Classes" className="lg:col-span-2">
          <div className="space-y-3">
            {dashboardData.assignedClasses.map((classItem, index) => (
              <motion.div
                key={classItem.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all cursor-pointer"
                onClick={() => navigate(`/teacher/class/${classItem.id}`)}
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">{classItem.name}</h4>
                    <p className="text-sm text-primary-600 dark:text-primary-400">{classItem.subject}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-medium text-gray-900 dark:text-white">{classItem.students}</span>
                    <p className="text-xs text-gray-500">students</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-xs text-gray-500">
                  <div className="flex items-center gap-1">
                    <Clock size={12} />
                    <span>{classItem.schedule}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <School size={12} />
                    <span>{classItem.room}</span>
                  </div>
                </div>
                <div className="flex gap-2 mt-3">
                  <Button size="sm" variant="outline" onClick={(e) => { e.stopPropagation(); navigate('/teacher/attendance'); }}>
                    <UserCheck size={14} className="mr-1" />
                    Mark Attendance
                  </Button>
                  <Button size="sm" variant="outline" onClick={(e) => { e.stopPropagation(); navigate('/teacher/marks'); }}>
                    <Award size={14} className="mr-1" />
                    Upload Marks
                  </Button>
                  <Button size="sm" variant="outline" onClick={(e) => { e.stopPropagation(); navigate('/teacher/materials'); }}>
                    <FileText size={14} className="mr-1" />
                    Materials
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </Card>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Upcoming Classes */}
          <Card title="Upcoming Classes">
            <div className="space-y-3">
              {dashboardData.upcomingClasses.map((classItem, index) => (
                <motion.div
                  key={classItem.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-3 rounded-lg bg-gray-50 dark:bg-gray-700"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">{classItem.name}</p>
                      <p className="text-sm text-gray-500">{classItem.subject}</p>
                    </div>
                    <span className="text-xs font-medium text-primary-600 bg-primary-50 dark:bg-primary-900/30 px-2 py-1 rounded">
                      {classItem.time}
                    </span>
                  </div>
                  <div className="flex justify-between mt-2 text-xs text-gray-500">
                    <span>Room: {classItem.room}</span>
                    <span>Duration: {classItem.duration}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </Card>

          {/* Pending Tasks */}
          <Card title="Pending Tasks">
            <div className="space-y-2">
              {dashboardData.pendingTasks.map((task) => (
                <div key={task.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">
                  <div className="flex items-center gap-2">
                    {task.priority === 'high' ? (
                      <AlertCircle size={16} className="text-red-500" />
                    ) : task.priority === 'medium' ? (
                      <Clock size={16} className="text-yellow-500" />
                    ) : (
                      <Bell size={16} className="text-blue-500" />
                    )}
                    <span className="text-sm text-gray-700 dark:text-gray-300">{task.title}</span>
                  </div>
                  <Button size="sm" variant="ghost" onClick={() => navigate(`/teacher/${task.type}`)}>
                    View
                  </Button>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {/* Recent Activities */}
      <Card title="Recent Activities">
        <div className="space-y-3">
          {dashboardData.recentActivities.map((activity) => (
            <div key={activity.id} className="flex items-start gap-3 p-2">
              <div className={`p-2 rounded-lg ${
                activity.type === 'attendance' ? 'bg-green-100 dark:bg-green-900/30' :
                activity.type === 'marks' ? 'bg-blue-100 dark:bg-blue-900/30' :
                'bg-yellow-100 dark:bg-yellow-900/30'
              }`}>
                {activity.type === 'attendance' ? <UserCheck size={14} /> :
                 activity.type === 'marks' ? <Award size={14} /> :
                 <Bell size={14} />}
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-900 dark:text-white">{activity.message}</p>
                <p className="text-xs text-gray-500">{activity.time}</p>
              </div>
              {activity.status === 'pending' && (
                <span className="text-xs text-yellow-600 bg-yellow-50 dark:bg-yellow-900/30 px-2 py-1 rounded">
                  Pending
                </span>
              )}
            </div>
          ))}
        </div>
      </Card>

      {/* Quick Actions */}
      <Card title="Quick Actions">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          <button
            onClick={() => navigate('/teacher/attendance')}
            className="p-4 h-full text-center rounded-xl border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all group flex flex-col items-center justify-center gap-2"
          >
            <div className="p-2 rounded-full bg-primary-50 dark:bg-primary-900/30 w-12 h-12 mx-auto mb-2 group-hover:bg-primary-100 dark:group-hover:bg-primary-900/50 transition-colors">
              <UserCheck className="h-6 w-6 text-primary-600 mx-auto" />
            </div>
            <span className="text-sm font-medium">Mark Attendance</span>
          </button>
          <button
            onClick={() => navigate('/teacher/marks')}
            className="p-4 h-full text-center rounded-xl border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all group flex flex-col items-center justify-center gap-2"
          >
            <div className="p-2 rounded-full bg-primary-50 dark:bg-primary-900/30 w-12 h-12 mx-auto mb-2 group-hover:bg-primary-100 dark:group-hover:bg-primary-900/50 transition-colors">
              <Award className="h-6 w-6 text-primary-600 mx-auto" />
            </div>
            <span className="text-sm font-medium">Upload Marks</span>
          </button>
          <button
            onClick={() => navigate('/teacher/oem-board')}
            className="p-4 h-full text-center rounded-xl border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all group flex flex-col items-center justify-center gap-2"
          >
            <div className="p-2 rounded-full bg-primary-50 dark:bg-primary-900/30 w-12 h-12 mx-auto mb-2 group-hover:bg-primary-100 dark:group-hover:bg-primary-900/50 transition-colors">
              <FileText className="h-6 w-6 text-primary-600 mx-auto" />
            </div>
            <span className="text-sm font-medium">OEM Board</span>
          </button>
          <button
            onClick={() => navigate('/teacher/materials')}
            className="p-4 h-full text-center rounded-xl border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all group flex flex-col items-center justify-center gap-2"
          >
            <div className="p-2 rounded-full bg-primary-50 dark:bg-primary-900/30 w-12 h-12 mx-auto mb-2 group-hover:bg-primary-100 dark:group-hover:bg-primary-900/50 transition-colors">
              <BookOpen className="h-6 w-6 text-primary-600 mx-auto" />
            </div>
            <span className="text-sm font-medium">Materials</span>
          </button>
          <button
            onClick={() => navigate('/teacher/leaves')}
            className="p-4 h-full text-center rounded-xl border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all group flex flex-col items-center justify-center gap-2"
          >
            <div className="p-2 rounded-full bg-primary-50 dark:bg-primary-900/30 w-12 h-12 mx-auto mb-2 group-hover:bg-primary-100 dark:group-hover:bg-primary-900/50 transition-colors">
              <Bell className="h-6 w-6 text-primary-600 mx-auto" />
            </div>
            <span className="text-sm font-medium">Leave Requests</span>
          </button>
        </div>
      </Card>
    </div>
  );
};

export default TeacherDashboard;