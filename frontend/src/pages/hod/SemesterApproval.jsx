import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, Calendar, Clock, FileText, AlertCircle } from 'lucide-react';
import Card from '../../components/Common/Card';
import Button from '../../components/Common/Button';
import Modal from '../../components/Common/Modal';
import Select from '../../components/Forms/Select';
import DatePicker from '../../components/Forms/DatePicker';
import { hodService } from '../../services/hodService';
import toast from 'react-hot-toast';

const SemesterApproval = () => {
  const [semesters, setSemesters] = useState([]);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedSemester, setSelectedSemester] = useState(null);
  const [formData, setFormData] = useState({
    classId: '',
    semesterNumber: '',
    academicYear: '',
    startDate: '',
    endDate: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [semestersData, classesData] = await Promise.all([
        hodService.getSemesters(),
        hodService.getClasses()
      ]);
      setSemesters(semestersData);
      setClasses(classesData);
    } catch (error) {
      toast.error('Failed to fetch data');
      setSemesters(getMockSemesters());
      setClasses(getMockClasses());
    } finally {
      setLoading(false);
    }
  };

  const getMockSemesters = () => [
    { id: 1, className: 'CSE 3A', semester: 3, academicYear: '2024-25', startDate: '2024-01-15', endDate: '2024-05-30', status: 'PENDING', submittedBy: 'Dr. Sarah Johnson' },
    { id: 2, className: 'CSE 3B', semester: 3, academicYear: '2024-25', startDate: '2024-01-15', endDate: '2024-05-30', status: 'PENDING', submittedBy: 'Prof. Michael Chen' }
  ];

  const getMockClasses = () => [
    { id: 1, name: 'CSE 3A' },
    { id: 2, name: 'CSE 3B' },
    { id: 3, name: 'CSE 2A' }
  ];

  const handleApprove = async (semester) => {
    try {
      await hodService.approveSemester(semester.id);
      toast.success('Semester approved successfully');
      fetchData();
    } catch (error) {
      toast.error('Failed to approve semester');
    }
  };

  const handleReject = async (semester) => {
    try {
      await hodService.rejectSemester(semester.id);
      toast.success('Semester rejected');
      fetchData();
    } catch (error) {
      toast.error('Failed to reject semester');
    }
  };

  const handleStartSemester = async () => {
    try {
      await hodService.startSemester(formData);
      toast.success('Semester started successfully');
      setModalOpen(false);
      setFormData({ classId: '', semesterNumber: '', academicYear: '', startDate: '', endDate: '' });
      fetchData();
    } catch (error) {
      toast.error('Failed to start semester');
    }
  };

  const classOptions = classes.map(c => ({ value: c.id, label: c.name }));
  const semesterOptions = [
    { value: 1, label: 'Semester 1' },
    { value: 2, label: 'Semester 2' },
    { value: 3, label: 'Semester 3' },
    { value: 4, label: 'Semester 4' },
    { value: 5, label: 'Semester 5' },
    { value: 6, label: 'Semester 6' },
    { value: 7, label: 'Semester 7' },
    { value: 8, label: 'Semester 8' }
  ];
  const academicYearOptions = [
    { value: '2024-25', label: '2024-2025' },
    { value: '2025-26', label: '2025-2026' }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="loading-spinner mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading semesters...</p>
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
            Semester Approval
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Review and approve semester start requests from Class Advisors
          </p>
        </div>
        <Button variant="primary" onClick={() => setModalOpen(true)}>
          Start New Semester
        </Button>
      </div>

      {/* Pending Approvals */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Pending Approvals</h2>
        {semesters.filter(s => s.status === 'PENDING').map((semester, index) => (
          <motion.div
            key={semester.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="border-l-4 border-l-yellow-500">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <Calendar className="text-primary-600" size={20} />
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {semester.className} - {semester.semester === 1 ? 'Odd' : 'Even'} Semester
                    </h3>
                    <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-700 rounded-full">
                      Pending
                    </span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                      <Calendar size={14} />
                      <span>Academic Year: {semester.academicYear}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                      <Clock size={14} />
                      <span>Duration: {semester.startDate} to {semester.endDate}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                      <FileText size={14} />
                      <span>Requested by: {semester.submittedBy}</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="success"
                    size="sm"
                    onClick={() => handleApprove(semester)}
                    icon={<CheckCircle size={16} />}
                  >
                    Approve
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleReject(semester)}
                    icon={<XCircle size={16} />}
                  >
                    Reject
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Approved Semesters */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Approved Semesters</h2>
        {semesters.filter(s => s.status === 'APPROVED').map((semester, index) => (
          <motion.div
            key={semester.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="border-l-4 border-l-green-500">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <CheckCircle className="text-green-500" size={20} />
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {semester.className} - {semester.semester === 1 ? 'Odd' : 'Even'} Semester
                    </h3>
                    <span className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded-full">
                      Approved
                    </span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                      <Calendar size={14} />
                      <span>Academic Year: {semester.academicYear}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                      <Clock size={14} />
                      <span>Duration: {semester.startDate} to {semester.endDate}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                      <FileText size={14} />
                      <span>Approved by: HOD</span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Start Semester Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setFormData({ classId: '', semesterNumber: '', academicYear: '', startDate: '', endDate: '' });
        }}
        title="Start New Semester"
        actions={
          <>
            <Button variant="outline" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button variant="primary" onClick={handleStartSemester}>Start Semester</Button>
          </>
        }
      >
        <div className="space-y-4">
          <Select
            label="Class"
            options={classOptions}
            value={formData.classId}
            onChange={(e) => setFormData({ ...formData, classId: e.target.value })}
            required
          />
          <Select
            label="Semester"
            options={semesterOptions}
            value={formData.semesterNumber}
            onChange={(e) => setFormData({ ...formData, semesterNumber: e.target.value })}
            required
          />
          <Select
            label="Academic Year"
            options={academicYearOptions}
            value={formData.academicYear}
            onChange={(e) => setFormData({ ...formData, academicYear: e.target.value })}
            required
          />
          <DatePicker
            label="Start Date"
            value={formData.startDate}
            onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
            required
          />
          <DatePicker
            label="End Date"
            value={formData.endDate}
            onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
            required
          />
          <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <div className="flex items-start gap-2">
              <AlertCircle size={16} className="text-blue-500 mt-0.5" />
              <p className="text-sm text-blue-700 dark:text-blue-300">
                Once a semester is started, attendance and marks can be recorded. The semester must be approved by HOD before it becomes active.
              </p>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default SemesterApproval;