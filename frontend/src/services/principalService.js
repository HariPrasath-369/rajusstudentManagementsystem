import api from './api';

export const principalService = {
  // Dashboard
  getDashboard: async () => {
    const response = await api.get('/principal/dashboard');
    return response.data;
  },

  // Analytics
  getAnalytics: async (year) => {
    const [performance, ranking, comparison, predictions] = await Promise.all([
      api.get('/analytics/institution/performance'),
      api.get('/analytics/teacher-ranking'),
      api.get('/analytics/department-comparison'),
      api.get('/analytics/student-failure-prediction')
    ]);
    
    return {
      performanceTrend: performance.data,
      teacherRanking: ranking.data,
      departmentComparison: Object.entries(comparison.data.departmentStats || {}).map(([name, stats]) => ({
        dept: name,
        ...stats
      })),
      studentPredictions: predictions.data
    };
  },

  // Reports
  generateReport: async (params) => {
    const response = await api.get('/analytics/export/performance-report', {
      params: { academicYear: params.academicYear || '2024' },
      responseType: 'blob'
    });
    return response.data;
  },

  // Departments
  getDepartments: async () => {
    const response = await api.get('/departments');
    return response.data;
  },

  createDepartment: async (data) => {
    const response = await api.post('/principal/departments', data);
    return response.data;
  },

  updateDepartment: async (id, data) => {
    const response = await api.put(`/principal/departments/${id}`, data);
    return response.data;
  },

  deleteDepartment: async (id) => {
    const response = await api.delete(`/principal/departments/${id}`);
    return response.data;
  },

  // HOD Management
  getHODs: async () => {
    const response = await api.get('/principal/hods');
    return response.data;
  },

  assignHOD: async (data) => {
    const response = await api.post('/principal/hods', data);
    return response.data;
  },

  updateHOD: async (id, data) => {
    const response = await api.put(`/principal/hods/${id}`, data);
    return response.data;
  },

  removeHOD: async (id) => {
    const response = await api.delete(`/principal/hods/${id}`);
    return response.data;
  },

  getAvailableTeachers: async (deptId) => {
    const response = await api.get(`/users/teachers/department/${deptId}`);
    return response.data;
  }
};
