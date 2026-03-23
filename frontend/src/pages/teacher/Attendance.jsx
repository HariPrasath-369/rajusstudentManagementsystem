import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Check, X, Clock, QrCode, Download, Calendar, Users, AlertCircle, Save, Eye, Smartphone, CheckCircle } from 'lucide-react';
import Card from '../../components/Common/Card';
import Button from '../../components/Common/Button';
import Modal from '../../components/Common/Modal';
import Select from '../../components/Forms/Select';
import DatePicker from '../../components/Forms/DatePicker';
import { teacherService } from '../../services/teacherService';
import toast from 'react-hot-toast';

const Attendance = () => {
  const [classes, setClasses] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [attendanceData, setAttendanceData] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [qrModalOpen, setQrModalOpen] = useState(false);
  const [qrCode, setQrCode] = useState('');
  const [summaryModalOpen, setSummaryModalOpen] = useState(false);

  useEffect(() => {
    fetchClasses();
  }, []);

  useEffect(() => {
    if (selectedClass) {
      fetchStudents();
      fetchAttendance();
    }
  }, [selectedClass, selectedDate]);

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

  const fetchStudents = async () => {
    try {
      const data = await teacherService.getStudentsByClass(selectedClass.classId || selectedClass.id);
      setStudents(data);
    } catch (error) {
      setStudents(getMockStudents());
    }
  };

  const fetchAttendance = async () => {
    try {
      setLoading(true);
      const data = await teacherService.getAttendance(selectedClass.classId || selectedClass.id, selectedDate);
      if (data && data.length > 0) {
        setIsSubmitted(true);
        const attendanceMap = {};
        data.forEach(record => {
          attendanceMap[record.studentId] = record.status;
        });
        setAttendanceData(attendanceMap);
      } else {
        setIsSubmitted(false);
        const initialMap = {};
        students.forEach(student => {
          initialMap[student.id] = 'PRESENT';
        });
        setAttendanceData(initialMap);
      }
    } catch (error) {
      const initialMap = {};
      students.forEach(student => {
        initialMap[student.id] = 'PRESENT';
      });
      setAttendanceData(initialMap);
      setIsSubmitted(false);
    } finally {
      setLoading(false);
    }
  };

  const getMockClasses = () => [
    { id: 1, name: 'CSE 3A', subject: 'Data Structures' },
    { id: 2, name: 'CSE 3B', subject: 'Algorithms' }
  ];

  const getMockStudents = () => [
    { id: 1, rollNumber: 'CS001', name: 'John Doe', email: 'john@university.edu' },
    { id: 2, rollNumber: 'CS002', name: 'Jane Smith', email: 'jane@university.edu' },
    { id: 3, rollNumber: 'CS003', name: 'Bob Johnson', email: 'bob@university.edu' },
    { id: 4, rollNumber: 'CS004', name: 'Alice Brown', email: 'alice@university.edu' },
    { id: 5, rollNumber: 'CS005', name: 'Charlie Wilson', email: 'charlie@university.edu' }
  ];

  const handleAttendanceChange = (studentId, status) => {
    if (isSubmitted) {
      toast.error('Attendance already submitted and cannot be modified');
      return;
    }
    setAttendanceData({ ...attendanceData, [studentId]: status });
  };

  const handleSubmit = async () => {
    if (isSubmitted) {
      toast.error('Attendance already submitted');
      return;
    }
    
    try {
      const request = {
        classId: selectedClass.classId || selectedClass.id,
        date: selectedDate,
        studentAttendance: attendanceData
      };
      await teacherService.markAttendance(request);
      await teacherService.submitAttendance(selectedClass.classId || selectedClass.id, selectedDate);
      toast.success('Attendance submitted successfully');
      setIsSubmitted(true);
    } catch (error) {
      toast.error('Failed to submit attendance');
    }
  };

  const handleGenerateQR = async () => {
    try {
      const qr = await teacherService.generateQRCode(selectedClass.classId || selectedClass.id, selectedDate);
      setQrCode(qr);
      setQrModalOpen(true);
    } catch (error) {
      toast.error('Failed to generate QR code');
    }
  };

  const handleExport = async () => {
    try {
      const blob = await teacherService.exportAttendance(selectedClass.classId || selectedClass.id, selectedDate);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `attendance_${selectedClass.className || selectedClass.name}_${selectedDate}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      toast.success('Attendance report downloaded');
    } catch (error) {
      toast.error('Failed to export attendance');
    }
  };

  const getAttendanceSummary = () => {
    const stats = {
      present: 0,
      absent: 0,
      late: 0,
      leave: 0
    };
    Object.values(attendanceData).forEach(status => {
      if (status === 'PRESENT') stats.present++;
      else if (status === 'ABSENT') stats.absent++;
      else if (status === 'LATE') stats.late++;
      else if (status === 'LEAVE') stats.leave++;
    });
    return stats;
  };

  const classOptions = classes.map(c => ({ value: c.id, label: `${c.name} - ${c.subject}` }));
  const statusButtons = [
    { value: 'PRESENT', label: 'Present', icon: Check, color: 'green', bg: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' },
    { value: 'ABSENT', label: 'Absent', icon: X, color: 'red', bg: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' },
    { value: 'LATE', label: 'Late', icon: Clock, color: 'yellow', bg: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' },
    { value: 'LEAVE', label: 'Leave', icon: Calendar, color: 'blue', bg: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' }
  ];

  const summary = getAttendanceSummary();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
            Attendance Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Mark and manage student attendance with QR code
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={handleGenerateQR} disabled={isSubmitted}>
            <QrCode size={18} className="mr-2" />
            Generate QR
          </Button>
          <Button variant="outline" onClick={handleExport}>
            <Download size={18} className="mr-2" />
            Export
          </Button>
          <Button variant="primary" onClick={handleSubmit} disabled={isSubmitted}>
            <Save size={18} className="mr-2" />
            {isSubmitted ? 'Submitted' : 'Submit Attendance'}
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Select
          label="Select Class"
          options={classOptions}
          value={selectedClass?.id}
          onChange={(e) => setSelectedClass(classes.find(c => c.id === parseInt(e.target.value)))}
        />
        <DatePicker
          label="Select Date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          maxDate={new Date().toISOString().split('T')[0]}
        />
      </div>

      {/* Status Banner */}
      {isSubmitted && (
        <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg flex items-center gap-3">
          <CheckCircle size={20} className="text-green-500" />
          <div>
            <p className="text-green-700 dark:text-green-300 font-medium">Attendance Already Submitted</p>
            <p className="text-sm text-green-600 dark:text-green-400">Attendance records for this date are locked and cannot be modified.</p>
          </div>
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="text-center p-4">
          <div className="p-2 rounded-full bg-green-100 dark:bg-green-900/30 w-12 h-12 mx-auto mb-2">
            <Check className="h-6 w-6 text-green-600 mx-auto" />
          </div>
          <p className="text-2xl font-bold">{summary.present}</p>
          <p className="text-sm text-gray-500">Present</p>
        </Card>
        <Card className="text-center p-4">
          <div className="p-2 rounded-full bg-red-100 dark:bg-red-900/30 w-12 h-12 mx-auto mb-2">
            <X className="h-6 w-6 text-red-600 mx-auto" />
          </div>
          <p className="text-2xl font-bold">{summary.absent}</p>
          <p className="text-sm text-gray-500">Absent</p>
        </Card>
        <Card className="text-center p-4">
          <div className="p-2 rounded-full bg-yellow-100 dark:bg-yellow-900/30 w-12 h-12 mx-auto mb-2">
            <Clock className="h-6 w-6 text-yellow-600 mx-auto" />
          </div>
          <p className="text-2xl font-bold">{summary.late}</p>
          <p className="text-sm text-gray-500">Late</p>
        </Card>
        <Card className="text-center p-4">
          <div className="p-2 rounded-full bg-blue-100 dark:bg-blue-900/30 w-12 h-12 mx-auto mb-2">
            <Calendar className="h-6 w-6 text-blue-600 mx-auto" />
          </div>
          <p className="text-2xl font-bold">{summary.leave}</p>
          <p className="text-sm text-gray-500">Leave</p>
        </Card>
      </div>

      {/* Info Banner */}
      <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg flex items-start gap-3">
        <AlertCircle size={20} className="text-blue-500 mt-0.5" />
        <div className="text-sm text-blue-700 dark:text-blue-300">
          <p className="font-medium">Attendance Guidelines:</p>
          <ul className="list-disc list-inside mt-1 space-y-1">
            <li>Attendance cannot be modified after submission</li>
            <li>Maximum 2 subjects per day per class</li>
            <li>QR code expires in 15 minutes</li>
            <li>Students can mark attendance via QR code scan</li>
          </ul>
        </div>
      </div>

      {/* Attendance Table */}
      <Card title={`Attendance - ${selectedClass?.name || ''}`} subtitle={`Date: ${selectedDate} | Status: ${isSubmitted ? 'Submitted' : 'Draft'}`}>
        {loading ? (
          <div className="text-center py-8">Loading...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-900">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Roll No</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Student Name</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {students.map((student, idx) => (
                  <motion.tr
                    key={student.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: idx * 0.02 }}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-white">{student.rollNumber}</td>
                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">{student.name}</td>
                    <td className="px-4 py-3 text-sm text-gray-500">{student.email}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        {statusButtons.map((btn) => (
                          <button
                            key={btn.value}
                            onClick={() => handleAttendanceChange(student.id, btn.value)}
                            disabled={isSubmitted}
                            className={`px-3 py-1 rounded-lg text-sm font-medium transition-all ${
                              attendanceData[student.id] === btn.value
                                ? btn.bg
                                : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                            } ${isSubmitted ? 'cursor-not-allowed opacity-50' : ''}`}
                          >
                            {btn.label}
                          </button>
                        ))}
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* QR Code Modal */}
      <Modal
        isOpen={qrModalOpen}
        onClose={() => setQrModalOpen(false)}
        title="QR Code for Attendance"
        size="md"
      >
        <div className="text-center">
          <div className="bg-white p-4 rounded-lg inline-block mx-auto">
            <img src={qrCode} alt="QR Code" className="w-48 h-48 mx-auto" />
          </div>
          <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
            Students can scan this QR code to mark their attendance
          </p>
          <p className="text-xs text-gray-500 mt-2">Valid for 15 minutes</p>
          <div className="flex gap-2 mt-4">
            <Button variant="outline" size="sm" className="flex-1" onClick={() => window.print()}>
              <Download size={14} className="mr-2" />
              Print QR
            </Button>
            <Button variant="outline" size="sm" className="flex-1" onClick={() => setQrModalOpen(false)}>
              Close
            </Button>
          </div>
        </div>
      </Modal>

      {/* Summary Modal */}
      <Modal
        isOpen={summaryModalOpen}
        onClose={() => setSummaryModalOpen(false)}
        title="Attendance Summary"
        size="md"
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <Check className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <p className="text-2xl font-bold">{summary.present}</p>
              <p className="text-sm">Present</p>
            </div>
            <div className="text-center p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
              <X className="h-8 w-8 text-red-600 mx-auto mb-2" />
              <p className="text-2xl font-bold">{summary.absent}</p>
              <p className="text-sm">Absent</p>
            </div>
            <div className="text-center p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
              <Clock className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
              <p className="text-2xl font-bold">{summary.late}</p>
              <p className="text-sm">Late</p>
            </div>
            <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <Calendar className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <p className="text-2xl font-bold">{summary.leave}</p>
              <p className="text-sm">Leave</p>
            </div>
          </div>
          <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <p className="text-center text-sm">
              Total Students: {students.length} | Attendance Rate: {((summary.present / students.length) * 100).toFixed(1)}%
            </p>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Attendance;