import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, FileText, Upload, AlertCircle, CheckCircle, XCircle, Clock } from 'lucide-react';
import Card from '../../components/Common/Card';
import Button from '../../components/Common/Button';
import Input from '../../components/Forms/Input';
import DatePicker from '../../components/Forms/DatePicker';
import TextArea from '../../components/Forms/TextArea';
import { studentService } from '../../services/studentService';
import toast from 'react-hot-toast';

const ApplyLeave = () => {
  const [loading, setLoading] = useState(false);
  const [leaves, setLeaves] = useState([]);
  const [formData, setFormData] = useState({
    startDate: '',
    endDate: '',
    reason: '',
    document: null
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchLeaves();
  }, []);

  const fetchLeaves = async () => {
    try {
      const data = await studentService.getLeaveHistory();
      setLeaves(data);
    } catch (error) {
      setLeaves(getMockLeaves());
    }
  };

  const getMockLeaves = () => [
    { id: 1, startDate: '2024-02-15', endDate: '2024-02-17', reason: 'Medical emergency', status: 'APPROVED', appliedAt: '2024-02-10' },
    { id: 2, startDate: '2024-03-01', endDate: '2024-03-02', reason: 'Family function', status: 'PENDING', appliedAt: '2024-02-25' },
    { id: 3, startDate: '2024-01-20', endDate: '2024-01-22', reason: 'Sports event', status: 'REJECTED', appliedAt: '2024-01-15', rejectionReason: 'Insufficient documentation' }
  ];

  const validateForm = () => {
    const newErrors = {};
    if (!formData.startDate) newErrors.startDate = 'Start date is required';
    if (!formData.endDate) newErrors.endDate = 'End date is required';
    if (formData.startDate && formData.endDate && new Date(formData.endDate) < new Date(formData.startDate)) {
      newErrors.endDate = 'End date must be after start date';
    }
    if (!formData.reason) newErrors.reason = 'Reason is required';
    if (formData.reason && formData.reason.length < 10) newErrors.reason = 'Please provide a detailed reason (minimum 10 characters)';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('startDate', formData.startDate);
      formDataToSend.append('endDate', formData.endDate);
      formDataToSend.append('reason', formData.reason);
      if (formData.document) {
        formDataToSend.append('document', formData.document);
      }

      await studentService.applyLeave(formDataToSend);
      toast.success('Leave application submitted successfully');
      setFormData({ startDate: '', endDate: '', reason: '', document: null });
      fetchLeaves();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit leave application');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelLeave = async (id) => {
    if (window.confirm('Are you sure you want to cancel this leave application?')) {
      try {
        await studentService.cancelLeave(id);
        toast.success('Leave cancelled successfully');
        fetchLeaves();
      } catch (error) {
        toast.error('Failed to cancel leave');
      }
    }
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case 'PENDING':
        return <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-700 flex items-center gap-1 w-fit"><Clock size={12} /> Pending</span>;
      case 'APPROVED':
        return <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-700 flex items-center gap-1 w-fit"><CheckCircle size={12} /> Approved</span>;
      case 'REJECTED':
        return <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-700 flex items-center gap-1 w-fit"><XCircle size={12} /> Rejected</span>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
          Apply for Leave
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Submit leave applications and track their status
        </p>
      </div>

      {/* Leave Application Form */}
      <Card title="New Leave Application">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <DatePicker
              label="Start Date"
              value={formData.startDate}
              onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
              error={errors.startDate}
              required
            />
            <DatePicker
              label="End Date"
              value={formData.endDate}
              onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
              error={errors.endDate}
              required
            />
          </div>
          
          <TextArea
            label="Reason for Leave"
            value={formData.reason}
            onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
            placeholder="Please provide detailed reason for leave..."
            rows={4}
            error={errors.reason}
            required
          />
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Supporting Document (Optional)
            </label>
            <div className="flex items-center gap-2 p-3 border rounded-lg">
              <Upload size={18} className="text-gray-400" />
              <input
                type="file"
                onChange={(e) => setFormData({ ...formData, document: e.target.files[0] })}
                className="flex-1 text-sm"
                accept=".pdf,.jpg,.png,.doc,.docx"
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">Accepted formats: PDF, JPG, PNG, DOC (Max 5MB)</p>
          </div>
          
          <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <div className="flex items-start gap-2">
              <AlertCircle size={16} className="text-blue-500 mt-0.5" />
              <p className="text-sm text-blue-700 dark:text-blue-300">
                <strong>Leave Guidelines:</strong> Maximum 10 leaves per semester. Leaves exceeding 5 consecutive days require HOD approval.
              </p>
            </div>
          </div>
          
          <Button type="submit" variant="primary" loading={loading} fullWidth>
            Submit Application
          </Button>
        </form>
      </Card>

      {/* Leave History */}
      <Card title="Leave History">
        {leaves.length === 0 ? (
          <div className="text-center py-8">
            <Calendar className="h-12 w-12 mx-auto text-gray-400 mb-3" />
            <p className="text-gray-500">No leave applications found</p>
          </div>
        ) : (
          <div className="space-y-4">
            {leaves.map((leave, index) => (
              <motion.div
                key={leave.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`p-4 rounded-lg border-l-4 ${
                  leave.status === 'PENDING' ? 'border-l-yellow-500' :
                  leave.status === 'APPROVED' ? 'border-l-green-500' :
                  'border-l-red-500'
                } bg-white dark:bg-gray-800 shadow-sm`}
              >
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <Calendar size={18} className="text-gray-400" />
                      <span className="text-sm font-medium">
                        {leave.startDate} to {leave.endDate}
                      </span>
                      {getStatusBadge(leave.status)}
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{leave.reason}</p>
                    <p className="text-xs text-gray-500">Applied on: {leave.appliedAt}</p>
                    {leave.rejectionReason && (
                      <p className="text-xs text-red-600 mt-1">Rejection reason: {leave.rejectionReason}</p>
                    )}
                  </div>
                  {leave.status === 'PENDING' && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleCancelLeave(leave.id)}
                    >
                      Cancel Request
                    </Button>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </Card>

      {/* Leave Balance */}
      <Card title="Leave Balance">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <p className="text-2xl font-bold text-green-600">10</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Total Leaves Allowed</p>
          </div>
          <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <p className="text-2xl font-bold text-blue-600">{leaves.filter(l => l.status === 'APPROVED').length}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Leaves Taken</p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ApplyLeave;