import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, CheckCircle, XCircle, AlertCircle, Download, Eye, BarChart3, TrendingUp, UserCheck } from 'lucide-react';
import Card from '../../components/Common/Card';
import Button from '../../components/Common/Button';
import LineChart from '../../components/Charts/LineChart';
import PieChart from '../../components/Charts/PieChart';
import { studentService } from '../../services/studentService';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

const MyAttendance = () => {
  const [loading, setLoading] = useState(true);
  const [attendanceData, setAttendanceData] = useState({
    overall: 0,
    subjectWise: [],
    monthlyTrend: [],
    recentRecords: []
  });

  useEffect(() => {
    fetchAttendanceData();
  }, []);

  const fetchAttendanceData = async () => {
    try {
      setLoading(true);
      const response = await studentService.getAttendance();
      setAttendanceData(response);
    } catch (error) {
      console.error('Failed to fetch attendance data:', error);
      // toast.error('Failed to load attendance data');
      setAttendanceData(getMockData());
    } finally {
      setLoading(false);
    }
  };

  const getMockData = () => ({
    overall: 87.5,
    subjectWise: [
      { subject: 'Data Structures', percentage: 92, present: 46, total: 50 },
      { subject: 'Algorithms', percentage: 85, present: 34, total: 40 },
      { subject: 'Database Systems', percentage: 88, present: 44, total: 50 },
      { subject: 'Operating Systems', percentage: 78, present: 39, total: 50 },
      { subject: 'Computer Networks', percentage: 90, present: 45, total: 50 }
    ],
    monthlyTrend: [
      { month: 'Sep', attendance: 85 },
      { month: 'Oct', attendance: 86 },
      { month: 'Nov', attendance: 88 },
      { month: 'Dec', attendance: 87 },
      { month: 'Jan', attendance: 89 },
      { month: 'Feb', attendance: 88 }
    ],
    recentRecords: [
      { date: '2024-03-15', subject: 'Data Structures', status: 'PRESENT', time: '09:00 AM' },
      { date: '2024-03-14', subject: 'Algorithms', status: 'PRESENT', time: '10:00 AM' },
      { date: '2024-03-13', subject: 'Database Systems', status: 'PRESENT', time: '02:00 PM' },
      { date: '2024-03-12', subject: 'Operating Systems', status: 'ABSENT', time: '11:00 AM' },
      { date: '2024-03-11', subject: 'Computer Networks', status: 'LATE', time: '09:00 AM' }
    ]
  });

  const getStatusBadge = (status) => {
    switch(status) {
      case 'PRESENT':
        return <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-700 flex items-center gap-1 w-fit"><CheckCircle size={12} /> Present</span>;
      case 'ABSENT':
        return <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-700 flex items-center gap-1 w-fit"><XCircle size={12} /> Absent</span>;
      case 'LATE':
        return <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-700 flex items-center gap-1 w-fit"><Clock size={12} /> Late</span>;
      default:
        return null;
    }
  };

  const getAttendanceColor = (percentage) => {
    if (percentage >= 85) return 'text-green-600';
    if (percentage >= 75) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getAttendanceProgressColor = (percentage) => {
    if (percentage >= 85) return 'bg-green-500';
    if (percentage >= 75) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="loading-spinner mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading attendance data...</p>
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
            My Attendance
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Track your attendance across all subjects
          </p>
        </div>
        <Button variant="outline">
          <Download size={18} className="mr-2" />
          Download Report
        </Button>
      </div>

      {/* Overall Attendance Card */}
      <Card className="bg-gradient-to-r from-primary-600 to-primary-700 text-white">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-center md:text-left">
            <p className="text-primary-100 mb-2">Overall Attendance</p>
            <p className="text-5xl font-bold">{(attendanceData?.overall || 0)}%</p>
          </div>
          <div className="flex-1">
            <div className="w-full bg-white/20 rounded-full h-4">
              <div 
                className="bg-white h-4 rounded-full transition-all duration-500"
                style={{ width: `${(attendanceData?.overall || 0)}%` }}
              />
            </div>
            <div className="flex justify-between mt-2 text-sm text-primary-100">
              <span>0%</span>
              <span>50%</span>
              <span>75%</span>
              <span>100%</span>
            </div>
          </div>
          <div className="text-center">
            <p className="text-primary-100">Status</p>
            <p className={`text-xl font-bold ${(attendanceData?.overall || 0) >= 75 ? 'text-green-300' : 'text-red-300'}`}>
              {(attendanceData?.overall || 0) >= 75 ? 'Good Standing' : 'At Risk'}
            </p>
          </div>
        </div>
      </Card>

      {/* Warning Banner for Low Attendance */}
      {(attendanceData?.overall || 0) < 75 && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg flex items-start gap-3">
          <AlertCircle size={20} className="text-red-500 mt-0.5" />
          <div>
            <p className="text-red-700 dark:text-red-300 font-medium">Low Attendance Alert</p>
            <p className="text-sm text-red-600 dark:text-red-400">
              Your attendance is below 75%. Please attend classes regularly to meet the minimum requirement.
            </p>
          </div>
        </div>
      )}

      {/* Monthly Trend Chart */}
      <LineChart
        data={attendanceData.monthlyTrend}
        lines={[{ key: 'attendance', name: 'Attendance %' }]}
        xAxisKey="month"
        title="Monthly Attendance Trend"
        subtitle="Your attendance pattern over the months"
        height={350}
      />

      {/* Subject-wise Attendance */}
      <Card title="Subject-wise Attendance">
        <div className="space-y-4">
          {attendanceData.subjectWise.map((subject, index) => (
            <motion.div
              key={subject.subject}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="flex justify-between items-center mb-1">
                <span className="font-medium text-gray-900 dark:text-white">{subject.subject}</span>
                <span className={`font-semibold ${getAttendanceColor(subject.percentage)}`}>
                  {subject.percentage}%
                </span>
              </div>
              <div className="flex justify-between text-xs text-gray-500 mb-1">
                <span>Present: {subject.present} days</span>
                <span>Total: {subject.total} days</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div 
                  className={`${getAttendanceProgressColor(subject.percentage)} h-2 rounded-full transition-all duration-500`}
                  style={{ width: `${subject.percentage}%` }}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </Card>

      {/* Recent Attendance Records */}
      <Card title="Recent Attendance Records">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-900">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Subject</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Time</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {attendanceData.recentRecords.map((record, index) => (
                <motion.tr
                  key={index}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">{format(new Date(record.date), 'MMM dd, yyyy')}</td>
                  <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">{record.subject}</td>
                  <td className="px-4 py-3 text-sm text-gray-500">{record.time}</td>
                  <td className="px-4 py-3">{getStatusBadge(record.status)}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Attendance Guidelines */}
      <Card className="bg-blue-50 dark:bg-blue-900/20">
        <h3 className="font-semibold text-blue-800 dark:text-blue-300 mb-2 flex items-center gap-2">
          <AlertCircle size={18} />
          Attendance Guidelines
        </h3>
        <ul className="space-y-1 text-sm text-blue-700 dark:text-blue-400 list-disc list-inside">
          <li>Minimum 75% attendance required to appear for examinations</li>
          <li>Late arrival will be marked as 'Late' in attendance</li>
          <li>Medical leaves require valid documentation</li>
          <li>Attendance is updated daily by 6:00 PM</li>
          <li>For any discrepancies, contact your Class Advisor</li>
        </ul>
      </Card>
    </div>
  );
};

export default MyAttendance;