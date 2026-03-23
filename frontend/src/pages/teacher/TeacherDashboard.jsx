import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  BookOpen,
  Calendar,
  Clock,
  Award,
  TrendingUp,
  UserCheck,
  Bell,
  ChevronRight,
  School,
  QrCode,
  Upload,
  AlertCircle
} from 'lucide-react';
import Card from '../../components/Common/Card';
import Button from '../../components/Common/Button';
import LineChart from '../../components/Charts/LineChart';
import BarChart from '../../components/Charts/BarChart';
import { teacherService } from '../../services/teacherService';
import { useAuth } from '../../hooks/useAuth';
import toast from 'react-hot-toast';

const TeacherDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({
    stats: {
      totalClasses: 0,
      totalStudents: 0,
      todayClasses: 0,
      pendingAttendance: 0,
      pendingMarks: 0,
      averageAttendance: 0,
      pendingLeaves: 0
    },
    charts: {
      attendanceTrend: [],
      performance: []
    },
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
      setDashboardData({
        ...response,
        stats: {
          ...dashboardData.stats,
          ...response.stats
        }
      });
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ title, value, icon: Icon, color, trend }) => (
    <motion.div
      whileHover={{ y: -5, scale: 1.02 }}
      className="relative overflow-hidden bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 group transition-all duration-300 hover:shadow-2xl hover:shadow-primary-500/10"
    >
      <div className={`absolute top-0 right-0 w-32 h-32 -mr-8 -mt-8 bg-${color}-500/5 rounded-full blur-3xl group-hover:bg-${color}-500/10 transition-colors duration-500`} />
      
      <div className="relative flex flex-col h-full justify-between gap-4">
        <div className="flex items-center justify-between">
          <div className={`p-3 rounded-2xl bg-${color}-50 dark:bg-${color}-900/20 text-${color}-600 dark:text-${color}-400 group-hover:scale-110 transition-transform duration-500`}>
            <Icon size={24} strokeWidth={2} />
          </div>
          {trend && (
            <span className={`flex items-center text-xs font-bold px-2.5 py-1 rounded-lg ${trend > 0 ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
              {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}%
            </span>
          )}
        </div>
        
        <div>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">{title}</p>
          <div className="flex items-baseline gap-1">
            <h3 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">
              {value}
            </h3>
          </div>
        </div>
      </div>
    </motion.div>
  );

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-4">
        <div className="relative w-16 h-16">
          <div className="absolute top-0 left-0 w-full h-full border-4 border-primary-100 rounded-full" />
          <div className="absolute top-0 left-0 w-full h-full border-4 border-primary-600 rounded-full animate-spin border-t-transparent" />
        </div>
        <p className="text-gray-500 dark:text-gray-400 font-medium animate-pulse">Analyzing your teaching summary...</p>
      </div>
    );
  }

  return (
    <div className="max-w-[1600px] mx-auto space-y-8 pb-12">
      <header className="relative py-10 px-8 rounded-[2.5rem] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-600 via-primary-700 to-indigo-800" />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay" />
        
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="text-center md:text-left">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white/90 text-sm font-medium mb-4"
            >
              <TrendingUp size={14} className="text-emerald-400" />
              <span>Teaching Performance Level: Distinguished</span>
            </motion.div>
            <motion.h1 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-4 tracking-tight"
            >
              Hello, {user?.name?.split(' ')[0] || 'Professor'}!
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-lg md:text-xl text-primary-100 max-w-xl font-medium leading-relaxed"
            >
              You have <span className="text-white font-bold">{dashboardData.stats.todayClasses}</span> sessions on your schedule today.
            </motion.p>
          </div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap justify-center md:justify-end gap-4"
          >
            <button 
              onClick={() => navigate('/teacher/attendance')}
              className="group px-8 py-4 bg-white text-primary-700 rounded-2xl font-bold shadow-xl shadow-primary-900/20 hover:bg-primary-50 transition-all flex items-center gap-3 active:scale-95"
            >
              <QrCode size={22} className="group-hover:rotate-12 transition-transform" />
              Start QR Attendance
            </button>
            <button 
              onClick={() => navigate('/teacher/materials')}
              className="px-8 py-4 bg-primary-500/20 backdrop-blur-md border border-white/30 text-white rounded-2xl font-bold hover:bg-white/10 transition-all flex items-center gap-3 active:scale-95"
            >
              <Upload size={22} />
              Material Explorer
            </button>
          </motion.div>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-6">
        <StatCard title="Active Classes" value={dashboardData.stats.totalClasses} icon={BookOpen} color="blue" />
        <StatCard title="Total Students" value={dashboardData.stats.totalStudents} icon={Users} color="indigo" />
        <StatCard title="Today's Sessions" value={dashboardData.stats.todayClasses} icon={Calendar} color="violet" />
        <StatCard title="Attendance Gap" value={dashboardData.stats.pendingAttendance} icon={Clock} color="rose" />
        <StatCard title="Ungraded Work" value={dashboardData.stats.pendingMarks} icon={Award} color="amber" />
        <StatCard title="Engagement Rate" value={`${dashboardData.stats.averageAttendance}%`} icon={UserCheck} color="emerald" trend={+4.2} />
        <StatCard title="Leave Requests" value={dashboardData.stats.pendingLeaves} icon={Bell} color="sky" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        <div className="xl:col-span-8 space-y-8">
          <Card 
            title="Class Performance Hub" 
            className="rounded-[2.5rem] border-none shadow-xl shadow-gray-200/50 dark:shadow-none"
            headerAction={<Button variant="ghost" size="sm" onClick={() => navigate('/teacher/assigned-classes')}>Manage All <ChevronRight size={16} /></Button>}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {dashboardData.assignedClasses.map((classItem) => (
                <motion.div
                  key={classItem.id}
                  whileHover={{ scale: 1.01 }}
                  className="p-6 rounded-3xl border border-gray-100 dark:border-gray-700 bg-gray-50/30 dark:bg-gray-800/50 hover:bg-white dark:hover:bg-gray-800 hover:shadow-xl hover:shadow-primary-500/5 transition-all duration-300"
                >
                  <div className="flex justify-between items-start mb-6">
                    <div className="flex gap-4">
                      <div className="w-14 h-14 rounded-2xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-primary-600">
                        <School size={28} />
                      </div>
                      <div>
                        <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-1">{classItem.name}</h4>
                        <div className="flex items-center gap-2 text-primary-600 dark:text-primary-400 font-bold text-sm">
                          <BookOpen size={14} />
                          {classItem.subject}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-black text-gray-900 dark:text-white">{classItem.students}</div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Enrollment</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-4 mb-6">
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white dark:bg-gray-700 text-xs font-bold text-gray-600 dark:text-gray-300 border border-gray-100 dark:border-gray-600">
                      <Clock size={14} className="text-orange-500" />
                      {classItem.schedule}
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white dark:bg-gray-700 text-xs font-bold text-gray-600 dark:text-gray-300 border border-gray-100 dark:border-gray-600">
                      <Users size={14} className="text-blue-500" />
                      Room {classItem.room}
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <Button variant="outline" size="sm" className="rounded-xl font-bold text-[11px]" onClick={() => navigate('/teacher/attendance')}>Attendance</Button>
                    <Button variant="outline" size="sm" className="rounded-xl font-bold text-[11px]" onClick={() => navigate('/teacher/marks')}>Grades</Button>
                    <Button variant="outline" size="sm" className="rounded-xl font-bold text-[11px]" onClick={() => navigate('/teacher/materials')}>Resources</Button>
                  </div>
                </motion.div>
              ))}
            </div>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 font-bold">
            <Card title="Attendance Insights" className="rounded-[2.5rem]">
              <LineChart
                data={dashboardData.charts.attendanceTrend}
                lines={[{ key: 'attendance', name: 'Success Rate' }]}
                xAxisKey="month"
                height={280}
                colors={['#3b82f6']}
              />
            </Card>
            <Card title="Engagement Analysis" className="rounded-[2.5rem]">
              <BarChart
                data={dashboardData.charts.performance}
                bars={[{ key: 'avgMarks', name: 'Avg Score' }]}
                xAxisKey="subject"
                height={280}
                colors={['#10b981']}
              />
            </Card>
          </div>
        </div>

        <aside className="xl:col-span-4 space-y-8">
          <Card title="On Deck (Today)" className="rounded-[2rem]">
            <div className="space-y-4">
              {dashboardData.upcomingClasses.map((item) => (
                <div key={item.id} className="p-5 rounded-3xl bg-gray-50 dark:bg-gray-800 border border-transparent hover:border-primary-500/20 hover:bg-white dark:hover:bg-gray-700 transition-all duration-300">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-[10px] font-black tracking-widest text-primary-600 dark:text-primary-400 uppercase">{item.subject}</span>
                    <span className="font-black text-gray-900 dark:text-white flex items-center gap-1.5">
                      <Clock size={16} className="text-primary-500" />
                      {item.time}
                    </span>
                  </div>
                  <h5 className="text-xl font-black text-gray-800 dark:text-gray-100 mb-3">{item.name}</h5>
                  <div className="flex justify-between items-center text-xs text-gray-500">
                    <span>Room: {item.room}</span>
                  </div>
                </div>
              ))}
              {dashboardData.upcomingClasses.length === 0 && (
                <div className="py-12 text-center text-gray-500">
                   <Calendar className="mx-auto mb-2 opacity-20" size={48} />
                   <p className="font-medium">No more classes for today!</p>
                </div>
              )}
            </div>
          </Card>

          <Card title="Smart Alerts" className="rounded-[2rem]">
            <div className="space-y-4">
              {dashboardData.pendingTasks.map((task) => (
                <div 
                  key={task.id} 
                  className="flex items-center gap-4 p-4 rounded-2xl bg-gray-50/50 dark:bg-gray-800/50 hover:bg-white dark:hover:bg-gray-800 transition-all cursor-pointer group"
                  onClick={() => navigate(`/teacher/${task.type}`)}
                >
                  <div className={`p-3 rounded-xl ${
                    task.priority === 'high' ? 'bg-rose-50 text-rose-600' : 
                    task.priority === 'medium' ? 'bg-amber-50 text-amber-600' : 'bg-blue-50 text-blue-600'
                  }`}>
                    {task.priority === 'high' ? <AlertCircle size={20} /> : <Clock size={20} />}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-gray-800 dark:text-gray-200">{task.title}</p>
                    <p className="text-xs text-gray-500 font-medium">{task.deadline || 'No deadline'}</p>
                  </div>
                  <ChevronRight size={18} className="text-gray-300 group-hover:translate-x-1 transition-transform" />
                </div>
              ))}
              {dashboardData.pendingTasks.length === 0 && (
                <div className="py-6 text-center text-gray-500">
                   <p className="text-sm font-medium">All tasks completed!</p>
                </div>
              )}
            </div>
          </Card>
        </aside>
      </div>
    </div>
  );
};

export default TeacherDashboard;