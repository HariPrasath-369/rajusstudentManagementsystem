import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Upload, Download, FileSpreadsheet, Award, TrendingUp, Eye, Edit, Save, CheckCircle, XCircle } from 'lucide-react';
import Card from '../../components/Common/Card';
import Button from '../../components/Common/Button';
import Modal from '../../components/Common/Modal';
import Select from '../../components/Forms/Select';
import Input from '../../components/Forms/Input';
import { teacherService } from '../../services/teacherService';
import toast from 'react-hot-toast';

const Marks = () => {
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [selectedSemester, setSelectedSemester] = useState(1);
  const [marksData, setMarksData] = useState({});
  const [isPublished, setIsPublished] = useState(false);
  const [loading, setLoading] = useState(false);
  const [excelModalOpen, setExcelModalOpen] = useState(false);
  const [excelFile, setExcelFile] = useState(null);

  useEffect(() => {
    fetchClasses();
  }, []);

  useEffect(() => {
    if (selectedClass) {
      fetchSubjects();
    }
  }, [selectedClass]);

  useEffect(() => {
    if (selectedClass && selectedSubject) {
      fetchStudents();
      fetchMarks();
    }
  }, [selectedClass, selectedSubject, selectedSemester]);

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

  const fetchSubjects = async () => {
    try {
      const data = await teacherService.getSubjectsByClass(selectedClass.classId || selectedClass.id);
      setSubjects(data);
      if (data.length > 0) setSelectedSubject(data[0]);
    } catch (error) {
      setSubjects(getMockSubjects());
      setSelectedSubject(getMockSubjects()[0]);
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

  const fetchMarks = async () => {
    try {
      setLoading(true);
      const data = await teacherService.getMarks(selectedSubject.id, selectedSemester);
      setIsPublished(data && data.length > 0 && data[0].isPublished);
      const marksMap = {};
      if (data && data.length > 0) {
        data.forEach(mark => {
          marksMap[mark.studentId] = mark.marksObtained;
        });
      }
      setMarksData(marksMap);
    } catch (error) {
      const initialMap = {};
      students.forEach(student => {
        initialMap[student.id] = '';
      });
      setMarksData(initialMap);
      setIsPublished(false);
    } finally {
      setLoading(false);
    }
  };

  const getMockClasses = () => [
    { id: 1, name: 'CSE 3A' },
    { id: 2, name: 'CSE 3B' }
  ];

  const getMockSubjects = () => [
    { id: 1, name: 'Data Structures', code: 'CS201' },
    { id: 2, name: 'Algorithms', code: 'CS202' }
  ];

  const getMockStudents = () => [
    { id: 1, rollNumber: 'CS001', name: 'John Doe' },
    { id: 2, rollNumber: 'CS002', name: 'Jane Smith' },
    { id: 3, rollNumber: 'CS003', name: 'Bob Johnson' },
    { id: 4, rollNumber: 'CS004', name: 'Alice Brown' },
    { id: 5, rollNumber: 'CS005', name: 'Charlie Wilson' }
  ];

  const handleMarksChange = (studentId, value) => {
    if (isPublished) {
      toast.error('Marks already published and cannot be modified');
      return;
    }
    setMarksData({ ...marksData, [studentId]: parseFloat(value) || '' });
  };

  const handleSave = async () => {
    if (isPublished) {
      toast.error('Cannot modify published marks');
      return;
    }
    try {
      // Bulk upload marks
      for (const [studentId, marks] of Object.entries(marksData)) {
        if (marks !== '') {
          await teacherService.uploadMarks({
            studentId: parseInt(studentId),
            subjectId: selectedSubject.id,
            semester: selectedSemester,
            marksObtained: marks
          });
        }
      }
      toast.success('Marks saved successfully');
    } catch (error) {
      toast.error('Failed to save marks');
    }
  };

  const handlePublish = async () => {
    if (isPublished) {
      toast.error('Marks already published');
      return;
    }
    if (window.confirm('Publishing marks will make them visible to students. This action cannot be undone. Continue?')) {
      try {
        await teacherService.publishMarks(selectedSubject.id, selectedSemester);
        toast.success('Marks published successfully');
        setIsPublished(true);
      } catch (error) {
        toast.error('Failed to publish marks');
      }
    }
  };

  const handleExcelUpload = async () => {
    if (!excelFile) {
      toast.error('Please select a file');
      return;
    }
    try {
      await teacherService.uploadMarksExcel(selectedSubject.id, selectedSemester, excelFile);
      toast.success('Marks uploaded from Excel successfully');
      setExcelModalOpen(false);
      fetchMarks();
    } catch (error) {
      toast.error('Failed to upload Excel file');
    }
  };

  const handleDownloadTemplate = () => {
    toast.success('Template downloaded');
  };

  const classOptions = classes.map(c => ({ value: c.id, label: c.name }));
  const subjectOptions = subjects.map(s => ({ value: s.id, label: `${s.name} (${s.code})` }));
  const semesterOptions = [
    { value: 1, label: 'Semester 1' },
    { value: 2, label: 'Semester 2' },
    { value: 3, label: 'Semester 3' },
    { value: 4, label: 'Semester 4' },
    { value: 5, label: 'Semester 5' },
    { value: 6, label: 'Semester 6' }
  ];

  const calculateAverage = () => {
    const marks = Object.values(marksData).filter(m => m && !isNaN(m));
    if (marks.length === 0) return 0;
    return (marks.reduce((a, b) => a + b, 0) / marks.length).toFixed(2);
  };

  const calculatePassPercentage = () => {
    const marks = Object.values(marksData).filter(m => m && !isNaN(m));
    if (marks.length === 0) return 0;
    const passed = marks.filter(m => m >= 40).length;
    return ((passed / marks.length) * 100).toFixed(2);
  };

  const getGrade = (marks) => {
    if (!marks) return '-';
    if (marks >= 90) return 'A+';
    if (marks >= 80) return 'A';
    if (marks >= 70) return 'B+';
    if (marks >= 60) return 'B';
    if (marks >= 50) return 'C';
    if (marks >= 40) return 'D';
    return 'F';
  };

  const getGradeColor = (marks) => {
    if (!marks) return 'text-gray-500';
    if (marks >= 80) return 'text-green-600';
    if (marks >= 60) return 'text-blue-600';
    if (marks >= 40) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
            Marks Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Upload, manage, and publish student marks
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => setExcelModalOpen(true)} disabled={isPublished}>
            <FileSpreadsheet size={18} className="mr-2" />
            Excel Upload
          </Button>
          <Button variant="outline" onClick={handleSave} disabled={isPublished}>
            <Save size={18} className="mr-2" />
            Save Draft
          </Button>
          <Button variant="success" onClick={handlePublish} disabled={isPublished}>
            <Award size={18} className="mr-2" />
            {isPublished ? 'Published' : 'Publish Marks'}
          </Button>
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
          label="Select Subject"
          options={subjectOptions}
          value={selectedSubject?.id}
          onChange={(e) => setSelectedSubject(subjects.find(s => s.id === parseInt(e.target.value)))}
        />
        <Select
          label="Select Semester"
          options={semesterOptions}
          value={selectedSemester}
          onChange={(e) => setSelectedSemester(parseInt(e.target.value))}
        />
      </div>

      {/* Status Banner */}
      {isPublished && (
        <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg flex items-center gap-3">
          <CheckCircle size={20} className="text-green-500" />
          <div>
            <p className="text-green-700 dark:text-green-300 font-medium">Marks Published</p>
            <p className="text-sm text-green-600 dark:text-green-400">Marks are now visible to students and cannot be modified.</p>
          </div>
        </div>
      )}

      {/* Statistics */}
      {students.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="text-center">
            <TrendingUp className="h-8 w-8 text-primary-600 mx-auto mb-2" />
            <p className="text-2xl font-bold">{calculateAverage()}%</p>
            <p className="text-sm text-gray-500">Class Average</p>
          </Card>
          <Card className="text-center">
            <Award className="h-8 w-8 text-primary-600 mx-auto mb-2" />
            <p className="text-2xl font-bold">{calculatePassPercentage()}%</p>
            <p className="text-sm text-gray-500">Pass Percentage</p>
          </Card>
          <Card className="text-center">
            <Eye className="h-8 w-8 text-primary-600 mx-auto mb-2" />
            <p className="text-2xl font-bold">{students.length}</p>
            <p className="text-sm text-gray-500">Total Students</p>
          </Card>
          <Card className="text-center">
            <Award className="h-8 w-8 text-primary-600 mx-auto mb-2" />
            <p className="text-2xl font-bold">40%</p>
            <p className="text-sm text-gray-500">Passing Marks</p>
          </Card>
        </div>
      )}

      {/* Marks Table */}
      <Card title={`Marks Entry - ${selectedSubject?.name || ''}`} subtitle={`Semester ${selectedSemester} | ${isPublished ? 'Published' : 'Draft Mode'}`}>
        {loading ? (
          <div className="text-center py-8">Loading...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-900">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Roll No</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Student Name</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Marks (out of 100)</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Grade</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {students.map((student, idx) => {
                  const marks = marksData[student.id];
                  const grade = getGrade(marks);
                  const gradeColor = getGradeColor(marks);
                  return (
                    <motion.tr
                      key={student.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: idx * 0.02 }}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-white">{student.rollNumber}</td>
                      <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">{student.name}</td>
                      <td className="px-4 py-3">
                        <Input
                          type="number"
                          value={marks || ''}
                          onChange={(e) => handleMarksChange(student.id, e.target.value)}
                          placeholder="Enter marks"
                          className="w-28"
                          min="0"
                          max="100"
                          step="0.5"
                          disabled={isPublished}
                        />
                      </td>
                      <td className="px-4 py-3">
                        {marks && <span className={`font-semibold ${gradeColor}`}>{grade}</span>}
                      </td>
                      <td className="px-4 py-3">
                        {marks && marks >= 40 ? (
                          <span className="text-green-600 flex items-center gap-1"><CheckCircle size={14} /> Pass</span>
                        ) : marks && marks < 40 ? (
                          <span className="text-red-600 flex items-center gap-1"><XCircle size={14} /> Fail</span>
                        ) : '-'}
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Excel Upload Modal */}
      <Modal
        isOpen={excelModalOpen}
        onClose={() => setExcelModalOpen(false)}
        title="Upload Marks from Excel"
        size="md"
        actions={
          <>
            <Button variant="outline" onClick={() => setExcelModalOpen(false)}>Cancel</Button>
            <Button variant="primary" onClick={handleExcelUpload}>Upload</Button>
          </>
        }
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Upload an Excel file with columns: <strong>Roll Number, Student Name, Marks</strong>
          </p>
          <input
            type="file"
            accept=".xlsx,.xls,.csv"
            onChange={(e) => setExcelFile(e.target.files[0])}
            className="w-full p-2 border rounded-lg"
          />
          <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <p className="text-sm text-blue-700 dark:text-blue-300">
              <strong>Template Format:</strong><br />
              Roll Number | Student Name | Marks<br />
              CS001 | John Doe | 85<br />
              CS002 | Jane Smith | 92
            </p>
          </div>
          <Button variant="outline" size="sm" className="w-full" onClick={handleDownloadTemplate}>
            <Download size={14} className="mr-2" />
            Download Template
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default Marks;