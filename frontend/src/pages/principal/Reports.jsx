import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Download, FileText, Calendar, Building2, TrendingUp, Users, GraduationCap } from 'lucide-react';
import Card from '../../components/Common/Card';
import Button from '../../components/Common/Button';
import Select from '../../components/Forms/Select';
import DatePicker from '../../components/Forms/DatePicker';
import { principalService } from '../../services/principalService';
import toast from 'react-hot-toast';

const Reports = () => {
  const [loading, setLoading] = useState(false);
  const [reportType, setReportType] = useState('performance');
  const [department, setDepartment] = useState('');
  const [dateRange, setDateRange] = useState({
    startDate: '',
    endDate: ''
  });

  const reportTypes = [
    { value: 'performance', label: 'Performance Report' },
    { value: 'attendance', label: 'Attendance Report' },
    { value: 'financial', label: 'Financial Report' },
    { value: 'placement', label: 'Placement Report' },
    { value: 'research', label: 'Research Output' }
  ];

  const departments = [
    { value: 'all', label: 'All Departments' },
    { value: 'cse', label: 'Computer Science' },
    { value: 'ece', label: 'Electronics' },
    { value: 'me', label: 'Mechanical' },
    { value: 'ce', label: 'Civil' },
    { value: 'it', label: 'Information Technology' }
  ];

  const handleGenerateReport = async () => {
    setLoading(true);
    try {
      const report = await principalService.generateReport({
        type: reportType,
        department,
        ...dateRange
      });
      
      // Download the report
      const blob = new Blob([report], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${reportType}_report_${new Date().toISOString().split('T')[0]}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      
      toast.success('Report generated successfully');
    } catch (error) {
      toast.error('Failed to generate report');
    } finally {
      setLoading(false);
    }
  };

  const reports = [
    {
      id: 1,
      title: 'Annual Performance Report 2023-24',
      type: 'performance',
      date: '2024-03-15',
      size: '2.4 MB',
      icon: TrendingUp
    },
    {
      id: 2,
      title: 'Attendance Summary - Semester 1',
      type: 'attendance',
      date: '2024-02-28',
      size: '1.8 MB',
      icon: Users
    },
    {
      id: 3,
      title: 'Department-wise Results Analysis',
      type: 'performance',
      date: '2024-02-15',
      size: '3.1 MB',
      icon: Building2
    },
    {
      id: 4,
      title: 'Student Enrollment Report',
      type: 'enrollment',
      date: '2024-01-30',
      size: '1.2 MB',
      icon: GraduationCap
    }
  ];

  const handleDownload = (report) => {
    toast.success(`Downloading ${report.title}`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
          Reports
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Generate and download institutional reports
        </p>
      </div>

      {/* Generate Report Form */}
      <Card title="Generate New Report" className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Select
            label="Report Type"
            options={reportTypes}
            value={reportType}
            onChange={(e) => setReportType(e.target.value)}
          />
          <Select
            label="Department"
            options={departments}
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
          />
          <DatePicker
            label="Start Date"
            value={dateRange.startDate}
            onChange={(e) => setDateRange({ ...dateRange, startDate: e.target.value })}
          />
          <DatePicker
            label="End Date"
            value={dateRange.endDate}
            onChange={(e) => setDateRange({ ...dateRange, endDate: e.target.value })}
          />
        </div>
        <div className="mt-4">
          <Button
            variant="primary"
            onClick={handleGenerateReport}
            loading={loading}
            icon={<Download size={18} />}
          >
            Generate Report
          </Button>
        </div>
      </Card>

      {/* Recent Reports */}
      <Card title="Recent Reports">
        <div className="space-y-3">
          {reports.map((report, index) => {
            const Icon = report.icon;
            return (
              <motion.div
                key={report.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-between p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all"
              >
                <div className="flex items-center gap-4">
                  <div className="p-2 rounded-lg bg-primary-100 dark:bg-primary-900/30">
                    <Icon size={20} className="text-primary-600 dark:text-primary-400" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">{report.title}</h4>
                    <div className="flex gap-3 mt-1 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <Calendar size={12} />
                        {report.date}
                      </span>
                      <span>{report.size}</span>
                      <span className="capitalize">{report.type}</span>
                    </div>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDownload(report)}
                  icon={<Download size={16} />}
                >
                  Download
                </Button>
              </motion.div>
            );
          })}
        </div>
      </Card>

      {/* Report Templates */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="text-center cursor-pointer hover:shadow-md transition-all">
          <FileText className="h-10 w-10 text-primary-600 mx-auto mb-3" />
          <h3 className="font-semibold text-gray-900 dark:text-white">Performance Report</h3>
          <p className="text-sm text-gray-500 mt-1">Student and department performance metrics</p>
        </Card>
        <Card className="text-center cursor-pointer hover:shadow-md transition-all">
          <Users className="h-10 w-10 text-primary-600 mx-auto mb-3" />
          <h3 className="font-semibold text-gray-900 dark:text-white">Attendance Report</h3>
          <p className="text-sm text-gray-500 mt-1">Monthly and yearly attendance summaries</p>
        </Card>
        <Card className="text-center cursor-pointer hover:shadow-md transition-all">
          <TrendingUp className="h-10 w-10 text-primary-600 mx-auto mb-3" />
          <h3 className="font-semibold text-gray-900 dark:text-white">Analytics Dashboard</h3>
          <p className="text-sm text-gray-500 mt-1">Interactive data visualization</p>
        </Card>
      </div>
    </div>
  );
};

export default Reports;