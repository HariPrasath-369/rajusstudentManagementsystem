import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { GraduationCap, Plus, Edit, Trash2, Users, BookOpen, UserCheck, Calendar } from 'lucide-react';
import Card from '../../components/Common/Card';
import Button from '../../components/Common/Button';
import Modal from '../../components/Common/Modal';
import Input from '../../components/Forms/Input';
import Select from '../../components/Forms/Select';
import { hodService } from '../../services/hodService';
import toast from 'react-hot-toast';

const Classes = () => {
  const [classes, setClasses] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [editingClass, setEditingClass] = useState(null);
  const [selectedClass, setSelectedClass] = useState(null);
  const [formData, setFormData] = useState({
    departmentId: 1,
    year: '',
    section: '',
    classSize: '',
    advisorId: ''
  });
  const [assignData, setAssignData] = useState({
    subjectIds: [],
    teacherIds: {}
  });

  const location = useLocation();

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (location.pathname === '/hod/classes/create') {
      setModalOpen(true);
    } else if (location.pathname === '/hod/classes/assign-subjects') {
      setAssignModalOpen(true);
    }
  }, [location.pathname]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [classesData, teachersData, subjectsData] = await Promise.all([
        hodService.getClasses(),
        hodService.getTeachers(),
        hodService.getSubjects()
      ]);
      setClasses(classesData);
      setTeachers(teachersData);
      setSubjects(subjectsData);
    } catch (error) {
      setClasses(getMockClasses());
      setTeachers(getMockTeachers());
      setSubjects(getMockSubjects());
    } finally {
      setLoading(false);
    }
  };

  const getMockClasses = () => [
    { id: 1, name: 'CSE 3A', year: 3, section: 'A', classSize: 60, advisor: 'Dr. Sarah Johnson', studentCount: 58, subjects: ['Data Structures', 'Algorithms', 'DBMS'] },
    { id: 2, name: 'CSE 3B', year: 3, section: 'B', classSize: 60, advisor: 'Prof. Michael Chen', studentCount: 55, subjects: ['Data Structures', 'Algorithms', 'DBMS'] },
    { id: 3, name: 'CSE 2A', year: 2, section: 'A', classSize: 55, advisor: 'Dr. Robert Williams', studentCount: 53, subjects: ['Programming', 'Discrete Math'] }
  ];

  const getMockTeachers = () => [
    { id: 1, name: 'Dr. Sarah Johnson' },
    { id: 2, name: 'Prof. Michael Chen' },
    { id: 3, name: 'Dr. Robert Williams' }
  ];

  const getMockSubjects = () => [
    { id: 1, name: 'Data Structures', code: 'CS201' },
    { id: 2, name: 'Algorithms', code: 'CS202' },
    { id: 3, name: 'Database Systems', code: 'CS301' }
  ];

  const handleSubmit = async () => {
    try {
      if (editingClass) {
        await hodService.updateClass(editingClass.id, formData);
        toast.success('Class updated successfully');
      } else {
        await hodService.createClass(formData);
        toast.success('Class created successfully');
      }
      setModalOpen(false);
      setEditingClass(null);
      setFormData({ departmentId: 1, year: '', section: '', classSize: '', advisorId: '' });
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Operation failed');
    }
  };

  const handleAssignSubjects = async () => {
    try {
      await hodService.assignSubjects(selectedClass.id, assignData);
      toast.success('Subjects assigned successfully');
      setAssignModalOpen(false);
      fetchData();
    } catch (error) {
      toast.error('Failed to assign subjects');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this class?')) {
      try {
        await hodService.deleteClass(id);
        toast.success('Class deleted successfully');
        fetchData();
      } catch (error) {
        toast.error('Failed to delete class');
      }
    }
  };

  const teacherOptions = teachers.map(t => ({ value: t.id, label: t.name }));
  const yearOptions = [
    { value: 1, label: '1st Year' },
    { value: 2, label: '2nd Year' },
    { value: 3, label: '3rd Year' },
    { value: 4, label: '4th Year' }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="loading-spinner mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading classes...</p>
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
            Class Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage academic classes and subject assignments
          </p>
        </div>
        <Button variant="primary" onClick={() => setModalOpen(true)}>
          <Plus size={18} className="mr-2" />
          Create Class
        </Button>
      </div>

      {/* Classes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {classes.map((classItem, index) => (
          <motion.div
            key={classItem.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="hover:shadow-lg transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 rounded-xl bg-primary-100 dark:bg-primary-900/30">
                  <GraduationCap className="h-6 w-6 text-primary-600 dark:text-primary-400" />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setSelectedClass(classItem);
                      setAssignModalOpen(true);
                    }}
                    className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    <BookOpen size={16} />
                  </button>
                  <button
                    onClick={() => {
                      setEditingClass(classItem);
                      setFormData({
                        year: classItem.year,
                        section: classItem.section,
                        classSize: classItem.classSize,
                        advisorId: teachers.find(t => t.name === classItem.advisor)?.id || ''
                      });
                      setModalOpen(true);
                    }}
                    className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(classItem.id)}
                    className="p-2 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                {classItem.name}
              </h3>
              
              <div className="space-y-2 mt-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Class Size:</span>
                  <span className="font-medium">{classItem.classSize}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Students Enrolled:</span>
                  <span className="font-medium">{classItem.studentCount}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Class Advisor:</span>
                  <span className="font-medium text-primary-600">{classItem.advisor}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mt-2">
                  <BookOpen size={14} />
                  <span>{classItem.subjects?.length || 0} Subjects Assigned</span>
                </div>
              </div>
              
              {classItem.subjects && classItem.subjects.length > 0 && (
                <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                  <p className="text-xs text-gray-500 mb-1">Subjects:</p>
                  <div className="flex flex-wrap gap-1">
                    {classItem.subjects.slice(0, 3).map((subject, idx) => (
                      <span key={idx} className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 rounded-full">
                        {subject}
                      </span>
                    ))}
                    {classItem.subjects.length > 3 && (
                      <span className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 rounded-full">
                        +{classItem.subjects.length - 3}
                      </span>
                    )}
                  </div>
                </div>
              )}
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Create/Edit Class Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingClass(null);
          setFormData({ departmentId: 1, year: '', section: '', classSize: '', advisorId: '' });
        }}
        title={editingClass ? 'Edit Class' : 'Create New Class'}
        actions={
          <>
            <Button variant="outline" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button variant="primary" onClick={handleSubmit}>Save</Button>
          </>
        }
      >
        <div className="space-y-4">
          <Select
            label="Year"
            options={yearOptions}
            value={formData.year}
            onChange={(e) => setFormData({ ...formData, year: e.target.value })}
            required
          />
          <Input
            label="Section"
            value={formData.section}
            onChange={(e) => setFormData({ ...formData, section: e.target.value.toUpperCase() })}
            placeholder="e.g., A, B, C"
          />
          <Input
            label="Class Size"
            type="number"
            value={formData.classSize}
            onChange={(e) => setFormData({ ...formData, classSize: e.target.value })}
            placeholder="Maximum number of students"
          />
          <Select
            label="Class Advisor"
            options={teacherOptions}
            value={formData.advisorId}
            onChange={(e) => setFormData({ ...formData, advisorId: e.target.value })}
            placeholder="Select a teacher"
          />
        </div>
      </Modal>

      {/* Assign Subjects Modal */}
      <Modal
        isOpen={assignModalOpen}
        onClose={() => setAssignModalOpen(false)}
        title={`Assign Subjects - ${selectedClass?.name}`}
        size="lg"
        actions={
          <>
            <Button variant="outline" onClick={() => setAssignModalOpen(false)}>Cancel</Button>
            <Button variant="primary" onClick={handleAssignSubjects}>Assign Subjects</Button>
          </>
        }
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Select subjects and assign teachers for this class
          </p>
          {subjects.map((subject) => (
            <div key={subject.id} className="flex items-center gap-4 p-3 border rounded-lg">
              <input
                type="checkbox"
                checked={assignData.subjectIds.includes(subject.id)}
                onChange={(e) => {
                  if (e.target.checked) {
                    setAssignData({
                      ...assignData,
                      subjectIds: [...assignData.subjectIds, subject.id]
                    });
                  } else {
                    setAssignData({
                      ...assignData,
                      subjectIds: assignData.subjectIds.filter(id => id !== subject.id),
                      teacherIds: { ...assignData.teacherIds, [subject.id]: undefined }
                    });
                  }
                }}
                className="h-4 w-4 text-primary-600 rounded"
              />
              <div className="flex-1">
                <p className="font-medium">{subject.name}</p>
                <p className="text-xs text-gray-500">{subject.code}</p>
              </div>
              {assignData.subjectIds.includes(subject.id) && (
                <Select
                  options={teacherOptions}
                  value={assignData.teacherIds[subject.id] || ''}
                  onChange={(e) => setAssignData({
                    ...assignData,
                    teacherIds: { ...assignData.teacherIds, [subject.id]: e.target.value }
                  })}
                  placeholder="Select Teacher"
                  className="w-48"
                />
              )}
            </div>
          ))}
        </div>
      </Modal>
    </div>
  );
};

export default Classes;