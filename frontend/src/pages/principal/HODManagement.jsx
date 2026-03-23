import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { UserCog, Plus, Edit, Trash2, Mail, Phone, Calendar, Building2 } from 'lucide-react';
import Card from '../../components/Common/Card';
import Button from '../../components/Common/Button';
import Modal from '../../components/Common/Modal';
import Select from '../../components/Forms/Select';
import Input from '../../components/Forms/Input';
import { principalService } from '../../services/principalService';
import toast from 'react-hot-toast';

const HODManagement = () => {
  const [hods, setHods] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingHod, setEditingHod] = useState(null);
  const [formData, setFormData] = useState({
    teacherId: '',
    departmentId: '',
    officeRoom: '',
    appointmentDate: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [hodsData, teachersData, deptsData] = await Promise.all([
        principalService.getHODs(),
        principalService.getAvailableTeachers(),
        principalService.getDepartments()
      ]);
      setHods(hodsData);
      setTeachers(teachersData);
      setDepartments(deptsData);
    } catch (error) {
      toast.error('Failed to fetch data');
      setHods(getMockHODs());
      setTeachers(getMockTeachers());
      setDepartments(getMockDepartments());
    } finally {
      setLoading(false);
    }
  };

  const getMockHODs = () => [
    { id: 1, name: 'Dr. Sarah Johnson', email: 'sarah.johnson@university.edu', department: 'Computer Science', departmentId: 1, officeRoom: 'CS-101', appointmentDate: '2022-08-01', phone: '+1234567890' },
    { id: 2, name: 'Prof. Michael Chen', email: 'michael.chen@university.edu', department: 'Electronics', departmentId: 2, officeRoom: 'EC-202', appointmentDate: '2022-08-15', phone: '+1234567891' }
  ];

  const getMockTeachers = () => [
    { id: 1, name: 'Dr. Emily Davis', email: 'emily.davis@university.edu', department: 'Computer Science' },
    { id: 2, name: 'Prof. James Wilson', email: 'james.wilson@university.edu', department: 'Electronics' }
  ];

  const getMockDepartments = () => [
    { id: 1, name: 'Computer Science', code: 'CSE' },
    { id: 2, name: 'Electronics', code: 'ECE' },
    { id: 3, name: 'Mechanical', code: 'ME' }
  ];

  const handleSubmit = async () => {
    try {
      if (editingHod) {
        await principalService.updateHOD(editingHod.id, formData);
        toast.success('HOD updated successfully');
      } else {
        await principalService.assignHOD(formData);
        toast.success('HOD assigned successfully');
      }
      setModalOpen(false);
      setEditingHod(null);
      setFormData({ teacherId: '', departmentId: '', officeRoom: '', appointmentDate: '' });
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Operation failed');
    }
  };

  const handleRemove = async (id) => {
    if (window.confirm('Are you sure you want to remove this HOD?')) {
      try {
        await principalService.removeHOD(id);
        toast.success('HOD removed successfully');
        fetchData();
      } catch (error) {
        toast.error('Failed to remove HOD');
      }
    }
  };

  const teacherOptions = teachers.map(t => ({ value: t.id, label: `${t.name} (${t.department})` }));
  const departmentOptions = departments.map(d => ({ value: d.id, label: `${d.name} (${d.code})` }));

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="loading-spinner mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading HODs...</p>
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
            HOD Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Assign and manage Heads of Departments
          </p>
        </div>
        <Button variant="primary" onClick={() => setModalOpen(true)}>
          <Plus size={18} className="mr-2" />
          Assign HOD
        </Button>
      </div>

      {/* HOD Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {hods.map((hod, index) => (
          <motion.div
            key={hod.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="hover:shadow-lg transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 rounded-xl bg-primary-100 dark:bg-primary-900/30">
                  <UserCog className="h-6 w-6 text-primary-600 dark:text-primary-400" />
                </div>
                <button
                  onClick={() => handleRemove(hod.id)}
                  className="p-2 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600 transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>
              
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                {hod.name}
              </h3>
              <p className="text-sm text-primary-600 dark:text-primary-400 mb-3">
                {hod.department}
              </p>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <Mail size={14} />
                  <span>{hod.email}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <Phone size={14} />
                  <span>{hod.phone || 'Not provided'}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <Building2 size={14} />
                  <span>Room: {hod.officeRoom || 'Not assigned'}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <Calendar size={14} />
                  <span>Appointed: {hod.appointmentDate}</span>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Assign HOD Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingHod(null);
          setFormData({ teacherId: '', departmentId: '', officeRoom: '', appointmentDate: '' });
        }}
        title="Assign HOD"
        size="lg"
        actions={
          <>
            <Button variant="outline" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button variant="primary" onClick={handleSubmit}>Assign</Button>
          </>
        }
      >
        <div className="space-y-4">
          <Select
            label="Select Teacher"
            options={teacherOptions}
            value={formData.teacherId}
            onChange={(e) => setFormData({ ...formData, teacherId: e.target.value })}
            placeholder="Choose a teacher"
            required
          />
          <Select
            label="Select Department"
            options={departmentOptions}
            value={formData.departmentId}
            onChange={(e) => setFormData({ ...formData, departmentId: e.target.value })}
            placeholder="Choose a department"
            required
          />
          <Input
            label="Office Room"
            value={formData.officeRoom}
            onChange={(e) => setFormData({ ...formData, officeRoom: e.target.value })}
            placeholder="e.g., CS-101"
          />
          <Input
            label="Appointment Date"
            type="date"
            value={formData.appointmentDate}
            onChange={(e) => setFormData({ ...formData, appointmentDate: e.target.value })}
          />
        </div>
      </Modal>
    </div>
  );
};

export default HODManagement;