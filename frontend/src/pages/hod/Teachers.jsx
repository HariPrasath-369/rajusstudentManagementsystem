import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Plus, Edit, Trash2, Mail, Phone, BookOpen, Award, Clock } from 'lucide-react';
import Card from '../../components/Common/Card';
import Button from '../../components/Common/Button';
import Modal from '../../components/Common/Modal';
import Input from '../../components/Forms/Input';
import Select from '../../components/Forms/Select';
import { hodService } from '../../services/hodService';
import toast from 'react-hot-toast';

const Teachers = () => {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    employeeId: '',
    qualification: '',
    specialization: '',
    isClassAdvisor: false
  });

  useEffect(() => {
    fetchTeachers();
  }, []);

  const fetchTeachers = async () => {
    try {
      setLoading(true);
      const data = await hodService.getTeachers();
      setTeachers(data);
    } catch (error) {
      toast.error('Failed to fetch teachers');
      setTeachers(getMockTeachers());
    } finally {
      setLoading(false);
    }
  };

  const getMockTeachers = () => [
    { id: 1, name: 'Dr. Sarah Johnson', email: 'sarah@university.edu', phone: '+1234567890', employeeId: 'T001', qualification: 'PhD', specialization: 'Data Structures', isClassAdvisor: true, classes: 3, students: 120 },
    { id: 2, name: 'Prof. Michael Chen', email: 'michael@university.edu', phone: '+1234567891', employeeId: 'T002', qualification: 'M.Tech', specialization: 'Algorithms', isClassAdvisor: false, classes: 2, students: 95 },
    { id: 3, name: 'Dr. Robert Williams', email: 'robert@university.edu', phone: '+1234567892', employeeId: 'T003', qualification: 'PhD', specialization: 'Database Systems', isClassAdvisor: true, classes: 4, students: 150 }
  ];

  const handleSubmit = async () => {
    try {
      if (editingTeacher) {
        await hodService.updateTeacher(editingTeacher.id, formData);
        toast.success('Teacher updated successfully');
      } else {
        await hodService.createTeacher(formData);
        toast.success('Teacher created successfully');
      }
      setModalOpen(false);
      setEditingTeacher(null);
      setFormData({ name: '', email: '', phone: '', employeeId: '', qualification: '', specialization: '', isClassAdvisor: false });
      fetchTeachers();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Operation failed');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this teacher?')) {
      try {
        await hodService.deleteTeacher(id);
        toast.success('Teacher deleted successfully');
        fetchTeachers();
      } catch (error) {
        toast.error('Failed to delete teacher');
      }
    }
  };

  const handleEdit = (teacher) => {
    setEditingTeacher(teacher);
    setFormData({
      name: teacher.name,
      email: teacher.email,
      phone: teacher.phone,
      employeeId: teacher.employeeId,
      qualification: teacher.qualification,
      specialization: teacher.specialization,
      isClassAdvisor: teacher.isClassAdvisor
    });
    setModalOpen(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="loading-spinner mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading teachers...</p>
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
            Faculty Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage department teachers and their assignments
          </p>
        </div>
        <Button variant="primary" onClick={() => setModalOpen(true)}>
          <Plus size={18} className="mr-2" />
          Add Teacher
        </Button>
      </div>

      {/* Teachers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {teachers.map((teacher, index) => (
          <motion.div
            key={teacher.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="hover:shadow-lg transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 rounded-xl bg-primary-100 dark:bg-primary-900/30">
                  <Users className="h-6 w-6 text-primary-600 dark:text-primary-400" />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(teacher)}
                    className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(teacher.id)}
                    className="p-2 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                {teacher.name}
              </h3>
              <p className="text-sm text-primary-600 dark:text-primary-400 mb-3">
                {teacher.employeeId}
              </p>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <Mail size={14} />
                  <span>{teacher.email}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <Phone size={14} />
                  <span>{teacher.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <BookOpen size={14} />
                  <span>{teacher.qualification} - {teacher.specialization}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <Clock size={14} />
                  <span>{teacher.classes} classes • {teacher.students} students</span>
                </div>
              </div>
              
              {teacher.isClassAdvisor && (
                <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                  <span className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-green-100 text-green-700 rounded-full">
                    <Award size={12} />
                    Class Advisor
                  </span>
                </div>
              )}
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Add/Edit Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingTeacher(null);
          setFormData({ name: '', email: '', phone: '', employeeId: '', qualification: '', specialization: '', isClassAdvisor: false });
        }}
        title={editingTeacher ? 'Edit Teacher' : 'Add New Teacher'}
        size="lg"
        actions={
          <>
            <Button variant="outline" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button variant="primary" onClick={handleSubmit}>Save</Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input
            label="Full Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
          <Input
            label="Email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />
          <Input
            label="Phone Number"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          />
          <Input
            label="Employee ID"
            value={formData.employeeId}
            onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
            required
          />
          <Input
            label="Qualification"
            value={formData.qualification}
            onChange={(e) => setFormData({ ...formData, qualification: e.target.value })}
          />
          <Input
            label="Specialization"
            value={formData.specialization}
            onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
          />
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={formData.isClassAdvisor}
              onChange={(e) => setFormData({ ...formData, isClassAdvisor: e.target.checked })}
              className="h-4 w-4 text-primary-600 rounded"
            />
            <span className="text-sm text-gray-700 dark:text-gray-300">Assign as Class Advisor</span>
          </label>
        </div>
      </Modal>
    </div>
  );
};

export default Teachers;