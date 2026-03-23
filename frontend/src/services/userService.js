import api from './api';

export const userService = {
  // Get user profile
  getProfile: async () => {
    return await api.get('/users/profile');
  },

  // Update profile
  updateProfile: async (userData) => {
    return await api.put('/users/profile', userData);
  },

  // Change password
  changePassword: async (passwordData) => {
    return await api.put('/users/change-password', passwordData);
  },

  // Get all users (Admin only)
  getAllUsers: async (params = {}) => {
    return await api.get('/users', { params });
  },

  // Get user by ID
  getUserById: async (id) => {
    return await api.get(`/users/${id}`);
  },

  // Update user (Admin only)
  updateUser: async (id, userData) => {
    return await api.put(`/users/${id}`, userData);
  },

  // Delete user (Admin only)
  deleteUser: async (id) => {
    return await api.delete(`/users/${id}`);
  },

  // Get teachers by department (HOD only)
  getTeachersByDepartment: async (departmentId) => {
    return await api.get(`/users/teachers/department/${departmentId}`);
  },

  // Get students by class (Teacher only)
  getStudentsByClass: async (classId) => {
    return await api.get(`/users/students/class/${classId}`);
  },

  // Get all departments
  getDepartments: async () => {
    return await api.get('/departments');
  },

  // Get all classes
  getClasses: async () => {
    return await api.get('/classes');
  },

  // Upload profile picture
  uploadProfilePicture: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return await api.post('/users/profile/picture', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  // Remove profile picture
  removeProfilePicture: async () => {
    return await api.delete('/users/profile/picture');
  },
};