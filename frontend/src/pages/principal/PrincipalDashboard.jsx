import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Building2,
  Users,
  GraduationCap,
  Award,
  TrendingUp,
  Calendar,
  Bell,
  Download,
  Eye,
  BarChart3,
  School,
  UserCog,
  FileText,
  AlertCircle,
  CheckCircle,
  XCircle,
  Activity
} from 'lucide-react';
import Card from '../../components/Common/Card';
import Button from '../../components/Common/Button';
import LineChart from '../../components/Charts/LineChart';
import BarChart from '../../components/Charts/BarChart';
import PieChart from '../../components/Charts/PieChart';
import { principalService } from '../../services/principalService';
import { useAuth } from '../../hooks/useAuth';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

const PrincipalDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({
    stats: {},
    charts: {},
    recentActivities: [],
    topPerformers: [],
    departmentStats: [],
    alerts: []
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const data = await principalService.getDashboard();
      setDashboardData({
        stats: {
          totalStudents: data.totalStudents || 0,
          totalTeachers: data.totalTeachers || 0,
          totalDepartments: data.totalDepartments || 0,
          totalClasses: data.totalClasses || 0,
          averageAttendance: data.averageAttendance || 0,
          overallPassRate: data.overallPassRate || 0,
          topPerformingDept: data.topPerformingDept || '-',
          improvementRate: data.improvementRate || 0
        },
        charts: {
          studentEnrollment: data.studentEnrollment || [],
          departmentPerformance: data.departmentPerformance || [],
          attendanceTrend: data.attendanceTrend || []
        },
        recentActivities: data.recentActivities || [],
        topPerformers: data.topPerformers || [],
        departmentStats: data.departmentStats || [],
        alerts: data.alerts || []
      });
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
      toast.error('Failed to load dashboard data');
      setDashboardData({
        stats: { totalStudents: 0, totalTeachers: 0, totalDepartments: 0, totalClasses: 0, averageAttendance: 0, overallPassRate: 0, topPerformingDept: '-', improvementRate: 0 },
        charts: { studentEnrollment: [], departmentPerformance: [], attendanceTrend: [] },
        topPerformers: [],
        departmentStats: [],
        alerts: []
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
            Welcome, {user?.name || 'Principal'}!
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Institution overview and key metrics
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => navigate('/principal/reports')}>
            <FileText size={18} className="mr-2" />
            Generate Report
          </Button>
          <Button variant="primary" onClick={() => navigate('/principal/analytics')}>
            <BarChart3 size={18} className="mr-2" />
            View Analytics
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Students" value={dashboardData.stats.totalStudents} icon={GraduationCap} color="blue" trend={8.5} />
        <StatCard title="Total Teachers" value={dashboardData.stats.totalTeachers} icon={Users} color="green" trend={5.2} />
        <StatCard title="Departments" value={dashboardData.stats.totalDepartments} icon={Building2} color="purple" />
        <StatCard title="Overall Pass Rate" value={`${dashboardData.stats.overallPassRate}%`} icon={Award} color="orange" trend={3.1} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Enrollment Trend */}
        <LineChart
          data={dashboardData.charts.studentEnrollment}
          lines={[{ key: 'students', name: 'Students' }]}
          xAxisKey="year"
          title="Student Enrollment Trend"
          subtitle="Year-over-year growth"
          height={350}
        />

        {/* Department Performance */}
        <BarChart
          data={dashboardData.charts.departmentPerformance}
          bars={[{ key: 'avgMarks', name: 'Average Marks' }]}
          xAxisKey="dept"
          title="Department Performance"
          subtitle="Average marks by department"
          height={350}
          colors={['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6']}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Department Statistics */}
        <Card title="Department Statistics" className="lg:col-span-2">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-900">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Department</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Students</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Teachers</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Pass Rate</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {dashboardData.departmentStats.map((dept, index) => (
                  <motion.tr
                    key={dept.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-white">{dept.name}</td>
                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">{dept.students}</td>
                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">{dept.teachers}</td>
                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">{dept.passRate}%</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        dept.passRate >= 90 ? 'bg-green-100 text-green-700' :
                        dept.passRate >= 80 ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {dept.passRate >= 90 ? 'Excellent' : dept.passRate >= 80 ? 'Good' : 'Needs Improvement'}
                      </span>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Alerts & Notifications */}
        <div className="space-y-6">
          <Card title="System Alerts">
            <div className="space-y-3">
              {dashboardData.alerts.map((alert) => (
                <div key={alert.id} className={`p-3 rounded-lg border-l-4 ${
                  alert.priority === 'high' ? 'border-red-500 bg-red-50 dark:bg-red-900/20' :
                  alert.priority === 'medium' ? 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20' :
                  'border-green-500 bg-green-50 dark:bg-green-900/20'
                }`}>
                  <div className="flex items-start gap-2">
                    {alert.priority === 'high' ? <AlertCircle size={16} className="text-red-500 mt-0.5" /> :
                     alert.priority === 'medium' ? <AlertCircle size={16} className="text-yellow-500 mt-0.5" /> :
                     <CheckCircle size={16} className="text-green-500 mt-0.5" />}
                    <div>
                      <p className="text-sm text-gray-900 dark:text-white">{alert.message}</p>
                      <span className="text-xs text-gray-500 mt-1">{alert.type}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Quick Actions */}
          <Card title="Quick Actions">
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => navigate('/principal/departments')}
                className="p-3 h-full text-center rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all flex flex-col items-center justify-center gap-2"
              >
                <Building2 size={20} className="mx-auto mb-2 text-primary-600" />
                <span className="text-sm">Manage Departments</span>
              </button>
              <button
                onClick={() => navigate('/principal/hod')}
                className="p-3 h-full text-center rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all flex flex-col items-center justify-center gap-2"
              >
                <UserCog size={20} className="mx-auto mb-2 text-primary-600" />
                <span className="text-sm">Manage HODs</span>
              </button>
              <button
                onClick={() => navigate('/principal/analytics')}
                className="p-3 h-full text-center rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all flex flex-col items-center justify-center gap-2"
              >
                <TrendingUp size={20} className="mx-auto mb-2 text-primary-600" />
                <span className="text-sm">View Analytics</span>
              </button>
              <button
                onClick={() => navigate('/principal/reports')}
                className="p-3 h-full text-center rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all flex flex-col items-center justify-center gap-2"
              >
                <Download size={20} className="mx-auto mb-2 text-primary-600" />
                <span className="text-sm">Export Reports</span>
              </button>
            </div>
          </Card>
        </div>
      </div>

      {/* Top Performing Teachers */}
      <Card title="🏆 Top Performing Teachers">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {dashboardData.topPerformers.map((teacher, index) => (
            <motion.div
              key={teacher.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="p-4 rounded-xl border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-primary-500 to-primary-600 flex items-center justify-center text-white font-bold text-lg">
                  {teacher.name.charAt(0)}
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">{teacher.name}</h4>
                  <p className="text-xs text-gray-500">{teacher.dept}</p>
                </div>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Rating:</span>
                <span className="font-semibold text-yellow-600">{teacher.rating} ★</span>
              </div>
              <div className="flex justify-between text-sm mt-1">
                <span className="text-gray-600 dark:text-gray-400">Students:</span>
                <span className="font-semibold text-gray-900 dark:text-white">{teacher.students}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default PrincipalDashboard;