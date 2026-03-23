import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Award, Building2, BarChart3, Download, Calendar } from 'lucide-react';
import Card from '../../components/Common/Card';
import Button from '../../components/Common/Button';
import LineChart from '../../components/Charts/LineChart';
import BarChart from '../../components/Charts/BarChart';
import PieChart from '../../components/Charts/PieChart';
import { principalService } from '../../services/principalService';
import toast from 'react-hot-toast';

const Analytics = () => {
  const [loading, setLoading] = useState(true);
  const [analyticsData, setAnalyticsData] = useState({
    teacherRanking: [],
    departmentComparison: [],
    studentPredictions: [],
    performanceTrends: {}
  });
  const [selectedYear, setSelectedYear] = useState('2024');

  useEffect(() => {
    fetchAnalytics();
  }, [selectedYear]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const data = await principalService.getAnalytics(selectedYear);
      setAnalyticsData(data);
    } catch (error) {
      toast.error('Failed to fetch analytics data');
      setAnalyticsData(getMockData());
    } finally {
      setLoading(false);
    }
  };

  const getMockData = () => ({
    teacherRanking: [
      { name: 'Dr. Sarah Johnson', department: 'CSE', rating: 4.8, students: 120, research: 15 },
      { name: 'Prof. Michael Chen', department: 'ECE', rating: 4.7, students: 95, research: 12 },
      { name: 'Dr. Robert Williams', department: 'ME', rating: 4.6, students: 110, research: 10 },
      { name: 'Prof. Emily Davis', department: 'IT', rating: 4.5, students: 85, research: 8 }
    ],
    departmentComparison: [
      { dept: 'CSE', avgMarks: 88, placement: 95, research: 85, satisfaction: 90 },
      { dept: 'ECE', avgMarks: 85, placement: 92, research: 80, satisfaction: 88 },
      { dept: 'ME', avgMarks: 82, placement: 88, research: 75, satisfaction: 85 },
      { dept: 'CE', avgMarks: 84, placement: 90, research: 70, satisfaction: 87 },
      { dept: 'IT', avgMarks: 86, placement: 93, research: 82, satisfaction: 89 }
    ],
    studentPredictions: [
      { id: 1, name: 'John Doe', risk: 'High', attendance: 65, marks: 58, recommended: 'Immediate counseling' },
      { id: 2, name: 'Jane Smith', risk: 'Medium', attendance: 72, marks: 65, recommended: 'Regular monitoring' },
      { id: 3, name: 'Bob Johnson', risk: 'Low', attendance: 88, marks: 82, recommended: 'Continue current path' }
    ],
    performanceTrends: {
      attendanceTrend: [
        { month: 'Jan', attendance: 85 },
        { month: 'Feb', attendance: 86 },
        { month: 'Mar', attendance: 87 },
        { month: 'Apr', attendance: 88 },
        { month: 'May', attendance: 89 }
      ],
      marksTrend: [
        { month: 'Jan', marks: 78 },
        { month: 'Feb', marks: 79 },
        { month: 'Mar', marks: 81 },
        { month: 'Apr', marks: 82 },
        { month: 'May', marks: 84 }
      ]
    }
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
            Analytics Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            AI-powered insights and institutional performance metrics
          </p>
        </div>
        <div className="flex gap-3">
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
          >
            <option value="2024">Academic Year 2024-25</option>
            <option value="2023">Academic Year 2023-24</option>
            <option value="2022">Academic Year 2022-23</option>
          </select>
          <Button variant="outline">
            <Download size={18} className="mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Teacher Ranking */}
      <Card title="🏆 Teacher Ranking System" subtitle="Based on student feedback, performance, and research output">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-900">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rank</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Teacher</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Department</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rating</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Students</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Research</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {analyticsData.teacherRanking.map((teacher, index) => (
                <motion.tr
                  key={teacher.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full ${
                      index === 0 ? 'bg-yellow-100 text-yellow-700' :
                      index === 1 ? 'bg-gray-100 text-gray-700' :
                      index === 2 ? 'bg-orange-100 text-orange-700' :
                      'bg-blue-100 text-blue-700'
                    }`}>
                      {index + 1}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">{teacher.name}</td>
                  <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{teacher.department}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <span className="font-semibold text-yellow-600">{teacher.rating}</span>
                      <span className="text-gray-400">★</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{teacher.students}</td>
                  <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{teacher.research}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Department Comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <BarChart
          data={analyticsData.departmentComparison}
          bars={[
            { key: 'avgMarks', name: 'Average Marks' },
            { key: 'placement', name: 'Placement %' },
            { key: 'satisfaction', name: 'Satisfaction' }
          ]}
          xAxisKey="dept"
          title="Department Comparison"
          subtitle="Performance metrics across departments"
          height={400}
          stacked={false}
        />
        
        <LineChart
          data={analyticsData.performanceTrends.attendanceTrend}
          lines={[
            { key: 'attendance', name: 'Attendance %' },
            { key: 'marks', name: 'Average Marks' }
          ]}
          xAxisKey="month"
          title="Performance Trends"
          subtitle="Monthly attendance and marks trend"
          height={400}
        />
      </div>

      {/* AI-Based Student Failure Prediction */}
      <Card title="🧠 AI-Based Student Risk Prediction">
        <div className="space-y-4">
          {analyticsData.studentPredictions.map((student, index) => (
            <motion.div
              key={student.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`p-4 rounded-lg border-l-4 ${
                student.risk === 'High' ? 'border-red-500 bg-red-50 dark:bg-red-900/20' :
                student.risk === 'Medium' ? 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20' :
                'border-green-500 bg-green-50 dark:bg-green-900/20'
              }`}
            >
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">{student.name}</h4>
                  <div className="flex gap-4 mt-1 text-sm">
                    <span>Attendance: {student.attendance}%</span>
                    <span>Current Marks: {student.marks}%</span>
                    <span className={`font-medium ${
                      student.risk === 'High' ? 'text-red-600' :
                      student.risk === 'Medium' ? 'text-yellow-600' :
                      'text-green-600'
                    }`}>
                      Risk Level: {student.risk}
                    </span>
                  </div>
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  <span className="font-medium">Recommendation:</span> {student.recommended}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default Analytics;