import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Award, BarChart3, Download, AlertCircle, CheckCircle, Target, Brain } from 'lucide-react';
import Card from '../../components/Common/Card';
import Button from '../../components/Common/Button';
import LineChart from '../../components/Charts/LineChart';
import BarChart from '../../components/Charts/BarChart';
import { studentService } from '../../services/studentService';
import toast from 'react-hot-toast';

const Performance = () => {
  const [loading, setLoading] = useState(true);
  const [performanceData, setPerformanceData] = useState({
    overall: {},
    subjectWise: [],
    semesterWise: [],
    predictions: [],
    recommendations: []
  });

  useEffect(() => {
    fetchPerformanceData();
  }, []);

  const fetchPerformanceData = async () => {
    try {
      setLoading(true);
      const response = await studentService.getPerformanceInsights();
      setPerformanceData(response);
    } catch (error) {
      console.error('Failed to fetch performance data:', error);
      //  toast.error('Failed to load performance data');
      setPerformanceData(getMockData());
    } finally {
      setLoading(false);
    }
  };

  const getMockData = () => ({
    overall: {
      cgpa: 8.5,
      semesterWiseAvg: [8.2, 8.5, 8.7, 8.6],
      attendance: 87.5,
      improvement: 0.3,
      rank: 15,
      totalStudents: 120
    },
    subjectWise: [
      { subject: 'Data Structures', marks: 85, grade: 'A', credits: 4, trend: 'up' },
      { subject: 'Algorithms', marks: 82, grade: 'A-', credits: 4, trend: 'stable' },
      { subject: 'Database Systems', marks: 88, grade: 'A', credits: 3, trend: 'up' },
      { subject: 'Operating Systems', marks: 78, grade: 'B+', credits: 3, trend: 'down' },
      { subject: 'Computer Networks', marks: 86, grade: 'A-', credits: 3, trend: 'up' }
    ],
    semesterWise: [
      { semester: 1, sgpa: 8.2, credits: 24, rank: 25 },
      { semester: 2, sgpa: 8.5, credits: 24, rank: 18 },
      { semester: 3, sgpa: 8.7, credits: 24, rank: 12 },
      { semester: 4, sgpa: 8.6, credits: 24, rank: 15 }
    ],
    predictions: [
      { metric: 'Expected CGPA', value: '8.7', confidence: 85, trend: 'up' },
      { metric: 'Semester 5 Performance', value: '8.9', confidence: 78, trend: 'up' },
      { metric: 'Placement Chance', value: '92%', confidence: 88, trend: 'up' }
    ],
    recommendations: [
      { area: 'Algorithms', suggestion: 'Focus more on dynamic programming and graph algorithms', priority: 'high' },
      { area: 'Operating Systems', suggestion: 'Review process synchronization concepts', priority: 'medium' },
      { area: 'Time Management', suggestion: 'Create a study schedule for better consistency', priority: 'high' }
    ]
  });

  const getTrendIcon = (trend) => {
    if (trend === 'up') return <TrendingUp size={14} className="text-green-500" />;
    if (trend === 'down') return <TrendingUp size={14} className="text-red-500 rotate-180" />;
    return null;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="loading-spinner mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading performance data...</p>
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
            Performance Insights
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            AI-powered analysis and personalized recommendations
          </p>
        </div>
        <Button variant="outline">
          <Download size={18} className="mr-2" />
          Download Report
        </Button>
      </div>

      {/* Overall Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="text-center">
          <Award className="h-8 w-8 text-primary-600 mx-auto mb-2" />
          <p className="text-2xl font-bold">{performanceData.overall.cgpa}</p>
          <p className="text-sm text-gray-500">CGPA</p>
        </Card>
        <Card className="text-center">
          <Target className="h-8 w-8 text-primary-600 mx-auto mb-2" />
          <p className="text-2xl font-bold">{performanceData.overall.rank}/{performanceData.overall.totalStudents}</p>
          <p className="text-sm text-gray-500">Class Rank</p>
        </Card>
        <Card className="text-center">
          <TrendingUp className="h-8 w-8 text-primary-600 mx-auto mb-2" />
          <p className="text-2xl font-bold">+{performanceData.overall.improvement}</p>
          <p className="text-sm text-gray-500">Improvement</p>
        </Card>
        <Card className="text-center">
          <Brain className="h-8 w-8 text-primary-600 mx-auto mb-2" />
          <p className="text-2xl font-bold">{performanceData.overall.attendance}%</p>
          <p className="text-sm text-gray-500">Attendance</p>
        </Card>
      </div>

      {/* Semester-wise Performance */}
      <LineChart
        data={performanceData.semesterWise}
        lines={[{ key: 'sgpa', name: 'SGPA' }]}
        xAxisKey="semester"
        title="Semester-wise Performance Trend"
        subtitle="Your SGPA progression across semesters"
        height={350}
      />

      {/* Subject-wise Performance */}
      <Card title="Subject-wise Analysis">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-900">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Subject</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Marks</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Grade</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Credits</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Trend</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {performanceData.subjectWise.map((subject, index) => (
                <motion.tr
                  key={subject.subject}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-white">{subject.subject}</td>
                  <td className="px-4 py-3 text-center text-sm">{subject.marks}%</td>
                  <td className="px-4 py-3 text-center">
                    <span className={`font-semibold ${
                      subject.grade === 'A' || subject.grade === 'A+' ? 'text-green-600' :
                      subject.grade === 'A-' ? 'text-green-500' :
                      subject.grade === 'B+' ? 'text-blue-600' : 'text-yellow-600'
                    }`}>{subject.grade}</span>
                  </td>
                  <td className="px-4 py-3 text-center text-sm">{subject.credits}</td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex items-center justify-center gap-1">
                      {getTrendIcon(subject.trend)}
                      <span className="text-xs capitalize">{subject.trend}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center">
                    {subject.marks >= 40 ? (
                      <span className="text-green-600 flex items-center justify-center gap-1"><CheckCircle size={14} /> Pass</span>
                    ) : (
                      <span className="text-red-600 flex items-center justify-center gap-1"><AlertCircle size={14} /> Need Improvement</span>
                    )}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* AI Predictions */}
      <Card title="🤖 AI Performance Predictions">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {performanceData.predictions.map((prediction, index) => (
            <motion.div
              key={prediction.metric}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="p-4 bg-gradient-to-br from-primary-50 to-primary-100 dark:from-primary-900/20 dark:to-primary-800/20 rounded-lg"
            >
              <p className="text-sm text-gray-600 dark:text-gray-400">{prediction.metric}</p>
              <p className="text-2xl font-bold text-primary-600 mt-1">{prediction.value}</p>
              <div className="flex items-center justify-between mt-2">
                <span className="text-xs text-gray-500">Confidence: {prediction.confidence}%</span>
                {getTrendIcon(prediction.trend)}
              </div>
            </motion.div>
          ))}
        </div>
      </Card>

      {/* Personalized Recommendations */}
      <Card title="📝 Personalized Recommendations">
        <div className="space-y-4">
          {performanceData.recommendations.map((rec, index) => (
            <motion.div
              key={rec.area}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`p-4 rounded-lg border-l-4 ${
                rec.priority === 'high' ? 'border-l-red-500 bg-red-50 dark:bg-red-900/20' :
                rec.priority === 'medium' ? 'border-l-yellow-500 bg-yellow-50 dark:bg-yellow-900/20' :
                'border-l-green-500 bg-green-50 dark:bg-green-900/20'
              }`}
            >
              <div className="flex items-start gap-3">
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">{rec.area}</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{rec.suggestion}</p>
                </div>
                <span className={`ml-auto px-2 py-1 text-xs rounded-full ${
                  rec.priority === 'high' ? 'bg-red-200 text-red-700' :
                  rec.priority === 'medium' ? 'bg-yellow-200 text-yellow-700' :
                  'bg-green-200 text-green-700'
                }`}>
                  {rec.priority} priority
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </Card>

      {/* Performance Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card title="Strengths">
          <ul className="space-y-2">
            <li className="flex items-start gap-2">
              <CheckCircle size={16} className="text-green-500 mt-0.5" />
              <span className="text-sm">Strong performance in core subjects (Data Structures, DBMS)</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle size={16} className="text-green-500 mt-0.5" />
              <span className="text-sm">Consistent improvement across semesters</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle size={16} className="text-green-500 mt-0.5" />
              <span className="text-sm">Good attendance record (87.5%)</span>
            </li>
          </ul>
        </Card>
        <Card title="Areas for Growth">
          <ul className="space-y-2">
            <li className="flex items-start gap-2">
              <AlertCircle size={16} className="text-yellow-500 mt-0.5" />
              <span className="text-sm">Algorithms - Focus on problem-solving techniques</span>
            </li>
            <li className="flex items-start gap-2">
              <AlertCircle size={16} className="text-yellow-500 mt-0.5" />
              <span className="text-sm">Operating Systems - Review synchronization concepts</span>
            </li>
            <li className="flex items-start gap-2">
              <AlertCircle size={16} className="text-yellow-500 mt-0.5" />
              <span className="text-sm">Consider joining study groups for collaborative learning</span>
            </li>
          </ul>
        </Card>
      </div>
    </div>
  );
};

export default Performance;