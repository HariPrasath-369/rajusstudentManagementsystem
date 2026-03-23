import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Award, TrendingUp, Download, Eye, BarChart3, CheckCircle, XCircle, AlertCircle, FileText } from 'lucide-react';
import Card from '../../components/Common/Card';
import Button from '../../components/Common/Button';
import LineChart from '../../components/Charts/LineChart';
import BarChart from '../../components/Charts/BarChart';
import { studentService } from '../../services/studentService';
import toast from 'react-hot-toast';

const MyMarks = () => {
  const [loading, setLoading] = useState(true);
  const [marksData, setMarksData] = useState({
    cgpa: 0,
    sgpa: [],
    subjectWise: [],
    semesterWise: [],
    performanceTrend: []
  });
  const [selectedSemester, setSelectedSemester] = useState(1);

  useEffect(() => {
    fetchMarksData();
  }, [selectedSemester]);

  const fetchMarksData = async () => {
    try {
      setLoading(true);
      const response = await studentService.getMarks(selectedSemester);
      setMarksData(response);
    } catch (error) {
      console.error('Failed to fetch marks data:', error);
      toast.error('Failed to load marks data');
      setMarksData(getMockData());
    } finally {
      setLoading(false);
    }
  };

  const getMockData = () => ({
    cgpa: 8.5,
    sgpa: [8.2, 8.5, 8.7, 8.6],
    subjectWise: [
      { subject: 'Data Structures', code: 'CS201', marks: 85, maxMarks: 100, grade: 'A', credits: 4 },
      { subject: 'Algorithms', code: 'CS202', marks: 82, maxMarks: 100, grade: 'A-', credits: 4 },
      { subject: 'Database Systems', code: 'CS301', marks: 88, maxMarks: 100, grade: 'A', credits: 3 },
      { subject: 'Operating Systems', code: 'CS302', marks: 78, maxMarks: 100, grade: 'B+', credits: 3 },
      { subject: 'Computer Networks', code: 'CS401', marks: 86, maxMarks: 100, grade: 'A-', credits: 3 }
    ],
    semesterWise: [
      { semester: 1, sgpa: 8.2, credits: 24 },
      { semester: 2, sgpa: 8.5, credits: 24 },
      { semester: 3, sgpa: 8.7, credits: 24 },
      { semester: 4, sgpa: 8.6, credits: 24 }
    ],
    performanceTrend: [
      { subject: 'Data Structures', marks: 85 },
      { subject: 'Algorithms', marks: 82 },
      { subject: 'DBMS', marks: 88 },
      { subject: 'OS', marks: 78 },
      { subject: 'CN', marks: 86 }
    ]
  });

  const getGradeColor = (grade) => {
    if (grade === 'A+' || grade === 'A') return 'text-green-600';
    if (grade === 'A-') return 'text-green-500';
    if (grade === 'B+') return 'text-blue-600';
    if (grade === 'B') return 'text-blue-500';
    if (grade === 'C') return 'text-yellow-600';
    return 'text-red-600';
  };

  const handleDownloadMarksheet = async () => {
    try {
      const pdf = await studentService.downloadMarksheet(selectedSemester);
      const blob = new Blob([pdf], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `marksheet_semester_${selectedSemester}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      toast.success('Marksheet downloaded successfully');
    } catch (error) {
      toast.error('Failed to download marksheet');
    }
  };

  const semesterOptions = [1, 2, 3, 4, 5, 6, 7, 8];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="loading-spinner mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading marks data...</p>
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
            My Marks
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Track your academic performance
          </p>
        </div>
        <div className="flex gap-3">
          <select
            value={selectedSemester}
            onChange={(e) => setSelectedSemester(parseInt(e.target.value))}
            className="px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
          >
            {semesterOptions.map(sem => (
              <option key={sem} value={sem}>Semester {sem}</option>
            ))}
          </select>
          <Button variant="outline" onClick={handleDownloadMarksheet}>
            <Download size={18} className="mr-2" />
            Download Marksheet
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="text-center bg-gradient-to-r from-primary-600 to-primary-700 text-white">
          <Award className="h-12 w-12 mx-auto mb-3" />
          <p className="text-4xl font-bold">{typeof marksData.cgpa === 'number' ? marksData.cgpa.toFixed(2) : 'N/A'}</p>
          <p className="text-primary-100 mt-1">Cumulative GPA</p>
        </Card>
        <Card className="text-center">
          <TrendingUp className="h-12 w-12 mx-auto mb-3 text-primary-600" />
          <p className="text-4xl font-bold">
            {marksData.sgpa?.find(s => s.semester === selectedSemester)?.gpa?.toFixed(2) || 'N/A'}
          </p>
          <p className="text-gray-500 mt-1">SGPA - Semester {selectedSemester}</p>
        </Card>
      </div>

      {/* Semester-wise SGPA Trend */}
      <BarChart
        data={marksData.semesterWise}
        bars={[{ key: 'sgpa', name: 'SGPA' }]}
        xAxisKey="semester"
        title="Semester-wise Performance"
        subtitle="SGPA across all semesters"
        height={300}
      />

      {/* Subject-wise Marks */}
      <Card title={`Semester ${selectedSemester} - Subject-wise Marks`}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-900">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Subject Code</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Subject Name</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Marks Obtained</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Max Marks</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Percentage</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Grade</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Credits</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {marksData.subjectWise.map((subject, index) => {
                const percentage = (subject.marks / subject.maxMarks) * 100;
                return (
                  <motion.tr
                    key={subject.code}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    <td className="px-4 py-3 text-sm font-mono text-gray-900 dark:text-white">{subject.code}</td>
                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">{subject.subject}</td>
                    <td className="px-4 py-3 text-center text-sm font-medium">{subject.marks}</td>
                    <td className="px-4 py-3 text-center text-sm text-gray-500">{subject.maxMarks}</td>
                    <td className="px-4 py-3 text-center text-sm">{percentage.toFixed(1)}%</td>
                    <td className="px-4 py-3 text-center">
                      <span className={`font-semibold ${getGradeColor(subject.grade)}`}>{subject.grade}</span>
                    </td>
                    <td className="px-4 py-3 text-center text-sm">{subject.credits}</td>
                    <td className="px-4 py-3 text-center">
                      {percentage >= 40 ? (
                        <span className="text-green-600 flex items-center justify-center gap-1"><CheckCircle size={14} /> Pass</span>
                      ) : (
                        <span className="text-red-600 flex items-center justify-center gap-1"><XCircle size={14} /> Fail</span>
                      )}
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Performance Chart */}
      <LineChart
        data={marksData.performanceTrend}
        lines={[{ key: 'marks', name: 'Marks %' }]}
        xAxisKey="subject"
        title="Subject-wise Performance"
        subtitle="Your performance across subjects"
        height={350}
      />

      {/* Grade Scale */}
      <Card title="Grade Scale">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <p className="font-bold text-green-600">90-100%</p>
            <p className="text-sm">A+</p>
            <p className="text-xs text-gray-500">Outstanding</p>
          </div>
          <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <p className="font-bold text-green-600">80-89%</p>
            <p className="text-sm">A</p>
            <p className="text-xs text-gray-500">Excellent</p>
          </div>
          <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <p className="font-bold text-blue-600">70-79%</p>
            <p className="text-sm">B+</p>
            <p className="text-xs text-gray-500">Very Good</p>
          </div>
          <div className="text-center p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
            <p className="font-bold text-yellow-600">60-69%</p>
            <p className="text-sm">B</p>
            <p className="text-xs text-gray-500">Good</p>
          </div>
          <div className="text-center p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
            <p className="font-bold text-red-600">Below 40%</p>
            <p className="text-sm">F</p>
            <p className="text-xs text-gray-500">Fail</p>
          </div>
        </div>
      </Card>

      {/* Performance Insights */}
      <Card title="Performance Insights">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <h4 className="font-semibold text-green-800 dark:text-green-300 mb-2 flex items-center gap-2">
              <TrendingUp size={16} />
              Strong Areas
            </h4>
            <ul className="space-y-1 text-sm text-green-700 dark:text-green-400">
              <li>• Database Systems: 88% (A grade)</li>
              <li>• Data Structures: 85% (A grade)</li>
              <li>• Computer Networks: 86% (A- grade)</li>
            </ul>
          </div>
          <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
            <h4 className="font-semibold text-yellow-800 dark:text-yellow-300 mb-2 flex items-center gap-2">
              <AlertCircle size={16} />
              Areas for Improvement
            </h4>
            <ul className="space-y-1 text-sm text-yellow-700 dark:text-yellow-400">
              <li>• Operating Systems: 78% (B+ grade)</li>
              <li>• Algorithms: 82% (A- grade - can improve to A)</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default MyMarks;