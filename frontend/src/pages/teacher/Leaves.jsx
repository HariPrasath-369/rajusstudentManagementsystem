import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, Clock, User, Calendar, FileText, Mail, Search, Filter, AlertCircle, ChevronDown, ChevronUp } from 'lucide-react';
import Card from '../../components/Common/Card';
import Button from '../../components/Common/Button';
import Modal from '../../components/Common/Modal';
import Select from '../../components/Forms/Select';
import TextArea from '../../components/Forms/TextArea';
import { teacherService } from '../../services/teacherService';
import toast from 'react-hot-toast';

const Leaves = () => {
  const [leaves, setLeaves] = useState([]);
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);
  const [selectedLeave, setSelectedLeave] = useState(null);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedLeave, setExpandedLeave] = useState(null);

  useEffect(() => {
    fetchClasses();
  }, []);

  useEffect(() => {
    if (selectedClass) {
      fetchLeaves();
    }
  }, [selectedClass, filter]);

  const fetchClasses = async () => {
    try {
      const data = await teacherService.getAssignedClasses();
      setClasses(data);
      if (data.length > 0) setSelectedClass(data[0]);
    } catch (error) {
      setClasses(getMockClasses());
      setSelectedClass(getMockClasses()[0]);
    }
  };

  const fetchLeaves = async () => {
    try {
      setLoading(true);
      const data = await teacherService.getLeaveRequests(selectedClass.classId || selectedClass.id, filter);
      setLeaves(data);
    } catch (error) {
      setLeaves(getMockLeaves());
    } finally {
      setLoading(false);
    }
  };

  const getMockClasses = () => [
    { id: 1, name: 'CSE 3A' },
    { id: 2, name: 'CSE 3B' }
  ];

  const getMockLeaves = () => [
    { id: 1, studentName: 'John Doe', rollNumber: 'CS001', startDate: '2024-03-15', endDate: '2024-03-17', reason: 'Medical emergency - need to undergo treatment', status: 'PENDING', appliedAt: '2024-03-10', duration: 3, documentUrl: '/docs/medical.pdf' },
    { id: 2, studentName: 'Jane Smith', rollNumber: 'CS002', startDate: '2024-03-20', endDate: '2024-03-22', reason: 'Family function - sister\'s wedding', status: 'PENDING', appliedAt: '2024-03-12', duration: 3 },
    { id: 3, studentName: 'Bob Johnson', rollNumber: 'CS003', startDate: '2024-03-05', endDate: '2024-03-07', reason: 'Sports event - inter-college tournament', status: 'APPROVED', appliedAt: '2024-03-01', duration: 3, approvedBy: 'Dr. Smith', approvedAt: '2024-03-02' },
    { id: 4, studentName: 'Alice Brown', rollNumber: 'CS004', startDate: '2024-03-01', endDate: '2024-03-02', reason: 'Personal work', status: 'REJECTED', appliedAt: '2024-02-28', duration: 2, rejectionReason: 'Insufficient documentation' }
  ];

  const handleApprove = async (leave) => {
    try {
      await teacherService.approveLeave(leave.id);
      toast.success('Leave approved successfully');
      fetchLeaves();
    } catch (error) {
      toast.error('Failed to approve leave');
    }
  };

  const handleReject = async () => {
    if (!rejectionReason) {
      toast.error('Please provide a reason for rejection');
      return;
    }
    try {
      await teacherService.rejectLeave(selectedLeave.id, rejectionReason);
      toast.success('Leave rejected');
      setModalOpen(false);
      setRejectionReason('');
      fetchLeaves();
    } catch (error) {
      toast.error('Failed to reject leave');
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

  const classOptions = classes.map(c => ({ value: c.id, label: c.name }));
  const filterOptions = [
    { value: 'all', label: 'All Requests' },
    { value: 'PENDING', label: 'Pending' },
    { value: 'APPROVED', label: 'Approved' },
    { value: 'REJECTED', label: 'Rejected' }
  ];

  const filteredLeaves = leaves.filter(leave =>
    leave.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    leave.rollNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = {
    pending: leaves.filter(l => l.status === 'PENDING').length,
    approved: leaves.filter(l => l.status === 'APPROVED').length,
    rejected: leaves.filter(l => l.status === 'REJECTED').length
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
            Leave Requests
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Review and manage student leave applications
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Select
          label="Select Class"
          options={classOptions}
          value={selectedClass?.id}
          onChange={(e) => setSelectedClass(classes.find(c => c.id === parseInt(e.target.value)))}
        />
        <Select
          label="Filter by Status"
          options={filterOptions}
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Search Student
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search by name or roll number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
            />
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="text-center border-l-4 border-l-yellow-500">
          <Clock className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
          <p className="text-2xl font-bold">{stats.pending}</p>
          <p className="text-sm text-gray-500">Pending Requests</p>
        </Card>
        <Card className="text-center border-l-4 border-l-green-500">
          <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-2" />
          <p className="text-2xl font-bold">{stats.approved}</p>
          <p className="text-sm text-gray-500">Approved</p>
        </Card>
        <Card className="text-center border-l-4 border-l-red-500">
          <XCircle className="h-8 w-8 text-red-500 mx-auto mb-2" />
          <p className="text-2xl font-bold">{stats.rejected}</p>
          <p className="text-sm text-gray-500">Rejected</p>
        </Card>
      </div>

      {/* Leave Requests List */}
      {loading ? (
        <div className="text-center py-12">Loading leave requests...</div>
      ) : filteredLeaves.length === 0 ? (
        <Card className="text-center py-12">
          <Mail className="h-12 w-12 mx-auto text-gray-400 mb-3" />
          <p className="text-gray-500">No leave requests found</p>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredLeaves.map((leave, index) => (
            <motion.div
              key={leave.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className={`border-l-4 ${
                leave.status === 'PENDING' ? 'border-l-yellow-500' :
                leave.status === 'APPROVED' ? 'border-l-green-500' :
                'border-l-red-500'
              }`}>
                <div className="flex flex-col">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
                          <User className="h-5 w-5 text-primary-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 dark:text-white">{leave.studentName}</h3>
                          <p className="text-sm text-gray-500">Roll No: {leave.rollNumber}</p>
                        </div>
                        {getStatusBadge(leave.status)}
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-3">
                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                          <Calendar size={14} />
                          <span>From: {leave.startDate}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                          <Calendar size={14} />
                          <span>To: {leave.endDate}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                          <Clock size={14} />
                          <span>Duration: {leave.duration} days</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                          <Mail size={14} />
                          <span>Applied: {leave.appliedAt}</span>
                        </div>
                      </div>
                    </div>
                    
                    {leave.status === 'PENDING' && (
                      <div className="flex gap-2">
                        <Button
                          variant="success"
                          size="sm"
                          onClick={() => handleApprove(leave)}
                          icon={<CheckCircle size={16} />}
                        >
                          Approve
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => {
                            setSelectedLeave(leave);
                            setModalOpen(true);
                          }}
                          icon={<XCircle size={16} />}
                        >
                          Reject
                        </Button>
                      </div>
                    )}
                  </div>
                  
                  <button
                    onClick={() => setExpandedLeave(expandedLeave === leave.id ? null : leave.id)}
                    className="mt-3 text-left"
                  >
                    <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <span className="text-sm font-medium">Reason for leave</span>
                      {expandedLeave === leave.id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </div>
                  </button>
                  
                  {expandedLeave === leave.id && (
                    <div className="mt-2 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <p className="text-sm text-gray-600 dark:text-gray-400">{leave.reason}</p>
                      {leave.documentUrl && (
                        <a
                          href={leave.documentUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-2 inline-flex items-center gap-1 text-xs text-primary-600 hover:underline"
                        >
                          <FileText size={12} />
                          View Attachment
                        </a>
                      )}
                    </div>
                  )}
                  
                  {leave.status === 'APPROVED' && leave.approvedBy && (
                    <div className="mt-2 p-2 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <p className="text-xs text-green-600 dark:text-green-400">
                        Approved by {leave.approvedBy} on {leave.approvedAt}
                      </p>
                    </div>
                  )}
                  
                  {leave.status === 'REJECTED' && leave.rejectionReason && (
                    <div className="mt-2 p-2 bg-red-50 dark:bg-red-900/20 rounded-lg">
                      <p className="text-xs text-red-600 dark:text-red-400">
                        Rejection Reason: {leave.rejectionReason}
                      </p>
                    </div>
                  )}
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {/* Rejection Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setRejectionReason('');
          setSelectedLeave(null);
        }}
        title="Reject Leave Request"
        size="md"
        actions={
          <>
            <Button variant="outline" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button variant="danger" onClick={handleReject}>Reject Leave</Button>
          </>
        }
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Rejecting leave for <strong>{selectedLeave?.studentName}</strong> (Roll No: {selectedLeave?.rollNumber})
          </p>
          <TextArea
            label="Rejection Reason"
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
            placeholder="Please provide a reason for rejecting this leave request..."
            rows={4}
            required
          />
          <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
            <div className="flex items-start gap-2">
              <AlertCircle size={16} className="text-yellow-500 mt-0.5" />
              <p className="text-sm text-yellow-700 dark:text-yellow-300">
                This action cannot be undone. The student will be notified via email and app notification.
              </p>
            </div>
          </div>
        </div>
      </Modal>

      {/* Leave Guidelines */}
      <Card className="bg-blue-50 dark:bg-blue-900/20">
        <h3 className="font-semibold text-blue-800 dark:text-blue-300 mb-2 flex items-center gap-2">
          <AlertCircle size={18} />
          Leave Guidelines for Review
        </h3>
        <ul className="space-y-1 text-sm text-blue-700 dark:text-blue-400 list-disc list-inside">
          <li>Students can apply for leave up to 7 days in advance</li>
          <li>Medical leaves require supporting documents</li>
          <li>Maximum 10 leaves per semester</li>
          <li>Leaves exceeding 5 consecutive days require HOD approval</li>
          <li>Approved leaves will be marked as 'Leave' in attendance</li>
          <li>Response time: 48 hours from application</li>
        </ul>
      </Card>
    </div>
  );
};

export default Leaves;