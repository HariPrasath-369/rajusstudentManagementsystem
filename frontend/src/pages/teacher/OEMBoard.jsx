import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calculator, Save, TrendingUp, Award, FileText, Download, CheckCircle, AlertCircle } from 'lucide-react';
import Card from '../../components/Common/Card';
import Button from '../../components/Common/Button';
import Select from '../../components/Forms/Select';
import Input from '../../components/Forms/Input';
import { teacherService } from '../../services/teacherService';
import toast from 'react-hot-toast';

const OEMBoard = () => {
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [selectedSemester, setSelectedSemester] = useState(1);
  const [oemData, setOemData] = useState({});
  const [loading, setLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

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
      fetchOEMData();
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

  const fetchOEMData = async () => {
    try {
      setLoading(true);
      const data = await teacherService.getOEMBoard(selectedClass.classId || selectedClass.id, selectedSubject.id, selectedSemester);
      setIsSubmitted(data.isSubmitted || false);
      const oemMap = {};
      if (data.records) {
        data.records.forEach(record => {
          oemMap[record.studentId] = {
            assessment: record.assessmentMarks,
            practical: record.practicalMarks,
            semester: record.semesterMarks
          };
        });
      }
      setOemData(oemMap);
    } catch (error) {
      const initialMap = {};
      students.forEach(student => {
        initialMap[student.id] = { assessment: '', practical: '', semester: '' };
      });
      setOemData(initialMap);
      setIsSubmitted(false);
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
    { id: 3, rollNumber: 'CS003', name: 'Bob Johnson' }
  ];

  const handleMarksChange = (studentId, type, value) => {
    if (isSubmitted) {
      toast.error('OEM Board already submitted');
      return;
    }
    setOemData({
      ...oemData,
      [studentId]: {
        ...oemData[studentId],
        [type]: parseFloat(value) || ''
      }
    });
  };

  const handleSave = async () => {
    if (isSubmitted) {
      toast.error('OEM Board already submitted');
      return;
    }
    try {
      await teacherService.saveOEMBoard(selectedClass.classId || selectedClass.id, selectedSubject.id, selectedSemester, oemData);
      toast.success('OEM Board saved successfully');
    } catch (error) {
      toast.error('Failed to save OEM Board');
    }
  };

  const handleSubmit = async () => {
    if (isSubmitted) {
      toast.error('OEM Board already submitted');
      return;
    }
    if (window.confirm('Submitting the OEM Board will lock all marks. This action cannot be undone. Continue?')) {
      try {
        await teacherService.submitOEMBoard(selectedClass.classId || selectedClass.id, selectedSubject.id, selectedSemester);
        toast.success('OEM Board submitted successfully');
        setIsSubmitted(true);
      } catch (error) {
        toast.error('Failed to submit OEM Board');
      }
    }
  };
 Lively

  const calculateTotal = (studentId) => {
    const data = oemData[studentId];
    if (!data) return 0;
    const assessment = data.assessment || 0;
    const practical = data.practical || 0;
    const semester = data.semester || 0;
    return assessment + practical + semester;
  };

  const calculatePercentage = (studentId) => {
    const total = calculateTotal(studentId);
    return ((total / 200) * 100).toFixed(2);
  };

  const getGrade = (percentage) => {
    const p = parseFloat(percentage);
    if (p >= 90) return 'A+';
    if (p >= 80) return 'A';
    if (p >= 70) return 'B+';
    if (p >= 60) return 'B';
    if (p >= 50) return 'C';
    if (p >= 40) return 'D';
    return 'F';
  };

  const classOptions = classes.map(c => ({ value: c.id, label: c.name }));
  const subjectOptions = subjects.map(s => ({ value: s.id, label: `${s.name} (${s.code})` }));
  const semesterOptions = [
    { value: 1, label: 'Semester 1' },
    { value: 2, label: 'Semester 2' },
    { value: 3, label: 'Semester 3' },
    { value: 4, label: 'Semester 4' }
  ];

  const calculateClassAverage = () => {
    const totals = students.map(s => calculateTotal(s.id));
    if (totals.length === 0) return 0;
    return (totals.reduce((a, b) => a + b, 0) / totals.length).toFixed(2);
  };

  const calculatePassPercentage = () => {
    const percentages = students.map(s => parseFloat(calculatePercentage(s.id)));
    if (percentages.length === 0) return 0;
    const passed = percentages.filter(p => p >= 40).length;
    return ((passed / percentages.length) * 100).toFixed(2);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
            OEM Board
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Assessment (50) | Practical (50) | Semester (100) - Total 200 Marks
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={handleSave} disabled={isSubmitted}>
            <Save size={18} className="mr-2" />
            Save Draft
          </Button>
          <Button variant="primary" onClick={handleSubmit} disabled={isSubmitted}>
            <CheckCircle size={18} className="mr-2" />
            {isSubmitted ? 'Submitted' : 'Submit Board'}
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
      {isSubmitted && (
        <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg flex items-center gap-3">
          <CheckCircle size={20} className="text-green-500" />
          <div>
            <p className="text-green-700 dark:text-green-300 font-medium">OEM Board Submitted</p>
            <p className="text-sm text-green-600 dark:text-green-400">All marks are locked and cannot be modified.</p>
          </div>
        </div>
      )}

      {/* Statistics */}
      {students.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="text-center">
            <Calculator className="h-8 w-8 text-primary-600 mx-auto mb-2" />
            <p className="text-2xl font-bold">{calculateClassAverage()}</p>
            <p className="text-sm text-gray-500">Class Average</p>
          </Card>
          <Card className="text-center">
            <Award className="h-8 w-8 text-primary-600 mx-auto mb-2" />
            <p className="text-2xl font-bold">{calculatePassPercentage()}%</p>
            <p className="text-sm text-gray-500">Pass Percentage</p>
          </Card>
          <Card className="text-center">
            <FileText className="h-8 w-8 text-primary-600 mx-auto mb-2" />
            <p className="text-2xl font-bold">{students.length}</p>
            <p className="text-sm text-gray-500">Total Students</p>
          </Card>
          <Card className="text-center">
            <TrendingUp className="h-8 w-8 text-primary-600 mx-auto mb-2" />
            <p className="text-2xl font-bold">200</p>
            <p className="text-sm text-gray-500">Total Marks</p>
          </Card>
        </div>
      )}

      {/* Info Banner */}
      <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg flex items-start gap-3">
        <AlertCircle size={20} className="text-blue-500 mt-0.5" />
        <div className="text-sm text-blue-700 dark:text-blue-300">
          <p className="font-medium">OEM Guidelines:</p>
          <ul className="list-disc list-inside mt-1">
            <li>Assessment: Maximum 50 marks</li>
            <li>Practical: Maximum 50 marks</li>
            <li>Semester: Maximum 100 marks</li>
            <li>Total: 200 marks (40% required to pass)</li>
          </ul>
        </div>
      </div>

      {/* OEM Table */}
      <Card title="OEM Marks Entry">
        {loading ? (
          <div className="text-center py-8">Loading...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-900">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Roll No</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Student Name</th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Assessment (50)</th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Practical (50)</th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Semester (100)</th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Total (200)</th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Percentage</th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Grade</th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Result</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {students.map((student, idx) => {
                  const total = calculateTotal(student.id);
                  const percentage = calculatePercentage(student.id);
                  const grade = getGrade(percentage);
                  const passed = parseFloat(percentage) >= 40;
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
                          value={oemData[student.id]?.assessment || ''}
                          onChange={(e) => handleMarksChange(student.id, 'assessment', e.target.value)}
                          placeholder="0-50"
                          className="w-24 text-center"
                          min="0"
                          max="50"
                          step="0.5"
                          disabled={isSubmitted}
                        />
                      </td>
                      <td className="px-4 py-3">
                        <Input
                          type="number"
                          value={oemData[student.id]?.practical || ''}
                          onChange={(e) => handleMarksChange(student.id, 'practical', e.target.value)}
                          placeholder="0-50"
                          className="w-24 text-center"
                          min="0"
                          max="50"
                          step="0.5"
                          disabled={isSubmitted}
                        />
                      </td>
                      <td className="px-4 py-3">
                        <Input
                          type="number"
                          value={oemData[student.id]?.semester || ''}
                          onChange={(e) => handleMarksChange(student.id, 'semester', e.target.value)}
                          placeholder="0-100"
                          className="w-24 text-center"
                          min="0"
                          max="100"
                          step="0.5"
                          disabled={isSubmitted}
                        />
                      </td>
                      <td className="px-4 py-3 text-center font-medium">{total}</td>
                      <td className="px-4 py-3 text-center">{percentage}%</td>
                      <td className="px-4 py-3 text-center">
                        <span className={`font-semibold ${passed ? 'text-green-600' : 'text-red-600'}`}>
                          {grade}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        {passed ? (
                          <span className="text-green-600 flex items-center justify-center gap-1"><CheckCircle size={14} /> Pass</span>
                        ) : (
                          <span className="text-red-600 flex items-center justify-center gap-1"><AlertCircle size={14} /> Fail</span>
                        )}
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
};

export default OEMBoard;