import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { TrendingUp, Users, BookOpen, Award, Download, Calendar, BarChart3 } from 'lucide-react';
import Card from '../../components/Common/Card';
import Button from '../../components/Common/Button';
import LineChart from '../../components/Charts/LineChart';
import BarChart from '../../components/Charts/BarChart';
import PieChart from '../../components/Charts/PieChart';
import { hodService } from '../../services/hodService';
import toast from 'react-hot-toast';

const DepartmentAnalytics = () => {
  const [loading, setLoading] = useState(true);
  const [analyticsData, setAnalyticsData] = useState({
    overview: {},
    performance: {},
    trends: {},
    teacherStats: []
  });

  const location = useLocation();
  const [activeTab, setActiveTab] = useState(location.pathname.includes('workload') ? 'workload' : 'department');

  useEffect(() => {
    fetchAnalytics();
  }, []);

  useEffect(() => {
    if (location.pathname.includes('workload')) {
      setActiveTab('workload');
    } else {
      setActiveTab('department');
    }
  }, [location.pathname]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const data = await hodService.getDepartmentAnalytics();
      setAnalyticsData(data);
    } catch (error) {
      setAnalyticsData(getMockData());
    } finally {
      setLoading(false);
    }
  };

  const getMockData = () => ({
    overview: {
      totalStudents: 580,
      totalTeachers: 32,
      avgAttendance: 86.5,
      passPercentage: 91.2,
      placementRate: 85.3,
      topSubject: 'Database Systems'
    },
    performance: {
      attendanceTrend: [
        { month: 'Jan', attendance: 85 },
        { month: 'Feb', attendance: 86 },
        { month: 'Mar', attendance: 87 },
        { month: 'Apr', attendance: 88 },
        { month: 'May', attendance: 89 }
      ],
      marksDistribution: [
        { range: '90-100', students: 85 },
        { range: '80-89', students: 120 },
        { range: '70-79', students: 150 },
        { range: '60-69', students: 110 },
        { range: 'Below 60', students: 45 }
      ],
      subjectPerformance: [
        { subject: 'Data Structures', avg: 85 },
        { subject: 'Algorithms', avg: 82 },
        { subject: 'DBMS', avg: 88 },
        { subject: 'OS', avg: 84 },
        { subject: 'CN', avg: 86 }
      ]
    },
    teacherStats: [
      { name: 'Dr. Sarah Johnson', rating: 4.8, students: 120, publications: 15 },
      { name: 'Prof. Michael Chen', rating: 4.7, students: 95, publications: 12 },
      { name: 'Dr. Robert Williams', rating: 4.6, students: 110, publications: 10 }
    ]
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="loading-spinner mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading analytics...</p>
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
            Department Analytics
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Performance insights and analytics for Computer Science Department
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant={activeTab === 'department' ? 'primary' : 'outline'}
            onClick={() => setActiveTab('department')}
          >
            Department Performance
          </Button>
          <Button 
            variant={activeTab === 'workload' ? 'primary' : 'outline'}
            onClick={() => setActiveTab('workload')}
          >
            Teacher Workload
          </Button>
          <Button variant="outline">
            <Download size={18} className="mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {activeTab === 'department' ? (
        <div className="space-y-6">
          {/* Overview Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
            <Card className="text-center">
              <Users className="h-8 w-8 text-primary-600 mx-auto mb-2" />
              <p className="text-2xl font-bold">{analyticsData.overview.totalStudents}</p>
              <p className="text-sm text-gray-500">Total Students</p>
            </Card>
            <Card className="text-center">
              <BookOpen className="h-8 w-8 text-primary-600 mx-auto mb-2" />
              <p className="text-2xl font-bold">{analyticsData.overview.totalTeachers}</p>
              <p className="text-sm text-gray-500">Total Teachers</p>
            </Card>
            <Card className="text-center">
              <TrendingUp className="h-8 w-8 text-primary-600 mx-auto mb-2" />
              <p className="text-2xl font-bold">{analyticsData.overview.avgAttendance}%</p>
              <p className="text-sm text-gray-500">Avg Attendance</p>
            </Card>
            <Card className="text-center">
              <Award className="h-8 w-8 text-primary-600 mx-auto mb-2" />
              <p className="text-2xl font-bold">{analyticsData.overview.passPercentage}%</p>
              <p className="text-sm text-gray-500">Pass Percentage</p>
            </Card>
            <Card className="text-center">
              <BarChart3 className="h-8 w-8 text-primary-600 mx-auto mb-2" />
              <p className="text-2xl font-bold">{analyticsData.overview.placementRate}%</p>
              <p className="text-sm text-gray-500">Placement Rate</p>
            </Card>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
             {/* ... existing charts ... */}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <LineChart
              data={analyticsData.performance.attendanceTrend}
              lines={[{ key: 'attendance', name: 'Attendance %' }]}
              xAxisKey="month"
              title="Attendance Trend"
              subtitle="Monthly attendance percentage"
              height={350}
            />
            <PieChart
              data={analyticsData.performance.marksDistribution}
              dataKey="students"
              nameKey="range"
              title="Marks Distribution"
              subtitle="Student performance distribution"
              height={350}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <BarChart
              data={analyticsData.performance.subjectPerformance}
              bars={[{ key: 'avg', name: 'Average Marks' }]}
              xAxisKey="subject"
              title="Subject Performance"
              subtitle="Average marks by subject"
              height={350}
            />

            {/* Teacher Statistics */}
            <Card title="Teacher Performance">
              <div className="space-y-4">
                {analyticsData.teacherStats.map((teacher, index) => (
                  <motion.div
                    key={teacher.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-3 rounded-lg border border-gray-200 dark:border-gray-700"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white">{teacher.name}</p>
                        <div className="flex gap-3 mt-1 text-xs text-gray-500">
                          <span>{teacher.students} students</span>
                          <span>{teacher.publications} publications</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-lg font-bold text-yellow-600">{teacher.rating}</span>
                        <span className="text-gray-400"> ★</span>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-primary-600 h-2 rounded-full"
                        style={{ width: `${(teacher.rating / 5) * 100}%` }}
                      />
                    </div>
                  </motion.div>
                ))}
              </div>
            </Card>
          </div>

          {/* Insights */}
          <Card title="Key Insights">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <h4 className="font-semibold text-green-800 dark:text-green-300 mb-2">Strengths</h4>
                <ul className="space-y-1 text-sm text-green-700 dark:text-green-400">
                  <li>• High pass percentage ({analyticsData.overview.passPercentage}%)</li>
                  <li>• Excellent placement record ({analyticsData.overview.placementRate}%)</li>
                  <li>• Strong performance in Database Systems</li>
                </ul>
              </div>
              <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                <h4 className="font-semibold text-yellow-800 dark:text-yellow-300 mb-2">Areas for Improvement</h4>
                <ul className="space-y-1 text-sm text-yellow-700 dark:text-yellow-400">
                  <li>• Algorithms subject needs attention (82% avg)</li>
                  <li>• Attendance below target in some classes</li>
                  <li>• Research output can be increased</li>
                </ul>
              </div>
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <h4 className="font-semibold text-blue-800 dark:text-blue-300 mb-2">Recommendations</h4>
                <ul className="space-y-1 text-sm text-blue-700 dark:text-blue-400">
                  <li>• Conduct workshops for Algorithms</li>
                  <li>• Implement attendance improvement plan</li>
                  <li>• Encourage faculty research collaboration</li>
                </ul>
              </div>
            </div>
          </Card>
        </div>
      ) : (
        <div className="space-y-6">
          <Card title="Faculty Workload Analysis">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b dark:border-gray-700">
                    <th className="pb-3 font-semibold">Teacher Name</th>
                    <th className="pb-3 font-semibold">Classes/Week</th>
                    <th className="pb-3 font-semibold">Total Hours</th>
                    <th className="pb-3 font-semibold">Status</th>
                    <th className="pb-3 font-semibold">Workload</th>
                  </tr>
                </thead>
                <tbody className="divide-y dark:divide-gray-700">
                  {analyticsData.teacherStats.map((teacher, idx) => (
                    <tr key={idx} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                      <td className="py-4">
                        <p className="font-medium text-gray-900 dark:text-white">{teacher.name}</p>
                        <p className="text-xs text-gray-500">Employee ID: T00{idx + 1}</p>
                      </td>
                      <td className="py-4">{12 + idx * 2}</td>
                      <td className="py-4">{18 + idx * 3} hrs</td>
                      <td className="py-4">
                        <span className={`px-2 py-1 text-xs rounded-full ${idx === 1 ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                          {idx === 1 ? 'Overloaded' : 'Normal'}
                        </span>
                      </td>
                      <td className="py-4 w-32">
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                          <div
                            className={`h-1.5 rounded-full ${idx === 1 ? 'bg-red-500' : 'bg-primary-600'}`}
                            style={{ width: `${60 + idx * 15}%` }}
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default DepartmentAnalytics;