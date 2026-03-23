import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Building2, Plus, Edit, Trash2, Eye, Users, GraduationCap, BookOpen } from 'lucide-react';
import Card from '../../components/Common/Card';
import Button from '../../components/Common/Button';
import Modal from '../../components/Common/Modal';
import Input from '../../components/Forms/Input';
import TextArea from '../../components/Forms/TextArea';
import { principalService } from '../../services/principalService';
import toast from 'react-hot-toast';

const Departments = () => {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingDept, setEditingDept] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    description: '',
    establishedYear: ''
  });

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      setLoading(true);
      const data = await principalService.getDepartments();
      setDepartments(data);
    } catch (error) {
      toast.error('Failed to fetch departments');
      setDepartments(getMockDepartments());
    } finally {
      setLoading(false);
    }
  };

  const getMockDepartments = () => [
    { id: 1, name: 'Computer Science', code: 'CSE', description: 'Department of Computer Science and Engineering', establishedYear: 2000, hod: 'Dr. Sarah Johnson', studentCount: 580, teacherCount: 32 },
    { id: 2, name: 'Electronics', code: 'ECE', description: 'Department of Electronics and Communication', establishedYear: 2001, hod: 'Prof. Michael Chen', studentCount: 520, teacherCount: 28 },
    { id: 3, name: 'Mechanical', code: 'ME', description: 'Department of Mechanical Engineering', establishedYear: 1999, hod: 'Dr. Robert Williams', studentCount: 480, teacherCount: 26 }
  ];

  const handleSubmit = async () => {
    try {
      if (editingDept) {
        await principalService.updateDepartment(editingDept.id, formData);
        toast.success('Department updated successfully');
      } else {
        await principalService.createDepartment(formData);
        toast.success('Department created successfully');
      }
      setModalOpen(false);
      setEditingDept(null);
      setFormData({ name: '', code: '', description: '', establishedYear: '' });
      fetchDepartments();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Operation failed');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this department?')) {
      try {
        await principalService.deleteDepartment(id);
        toast.success('Department deleted successfully');
        fetchDepartments();
      } catch (error) {
        toast.error('Failed to delete department');
      }
    }
  };

  const handleEdit = (dept) => {
    setEditingDept(dept);
    setFormData({
      name: dept.name,
      code: dept.code,
      description: dept.description,
      establishedYear: dept.establishedYear
    });
    setModalOpen(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="loading-spinner mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading departments...</p>
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
            Departments
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage academic departments and their details
          </p>
        </div>
        <Button variant="primary" onClick={() => setModalOpen(true)}>
          <Plus size={18} className="mr-2" />
          Add Department
        </Button>
      </div>

      {/* Departments Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {departments.map((dept, index) => (
          <motion.div
            key={dept.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="hover:shadow-lg transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 rounded-xl bg-primary-100 dark:bg-primary-900/30">
                  <Building2 className="h-6 w-6 text-primary-600 dark:text-primary-400" />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(dept)}
                    className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(dept.id)}
                    className="p-2 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                {dept.name}
              </h3>
              <p className="text-sm text-primary-600 dark:text-primary-400 font-mono mb-2">
                {dept.code}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                {dept.description}
              </p>
              
              <div className="grid grid-cols-2 gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-2">
                  <Users size={14} className="text-gray-400" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {dept.hod || 'No HOD assigned'}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <GraduationCap size={14} className="text-gray-400" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {dept.studentCount || 0} Students
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Users size={14} className="text-gray-400" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {dept.teacherCount || 0} Teachers
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <BookOpen size={14} className="text-gray-400" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Est. {dept.establishedYear}
                  </span>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Add/Edit Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingDept(null);
          setFormData({ name: '', code: '', description: '', establishedYear: '' });
        }}
        title={editingDept ? 'Edit Department' : 'Add New Department'}
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
            label="Department Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="e.g., Computer Science and Engineering"
            required
          />
          <Input
            label="Department Code"
            value={formData.code}
            onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
            placeholder="e.g., CSE"
            required
          />
          <TextArea
            label="Description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Department description..."
            rows={3}
          />
          <Input
            label="Established Year"
            type="number"
            value={formData.establishedYear}
            onChange={(e) => setFormData({ ...formData, establishedYear: e.target.value })}
            placeholder="e.g., 2000"
          />
        </div>
      </Modal>
    </div>
  );
};

export default Departments;