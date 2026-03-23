import api from './api';

export const principalService = {
  // Dashboard
  getDashboard: async () => {
    return api.get('/principal/dashboard');
  },

  // Analytics
  getAnalytics: async (year) => {
    const [performance, ranking, comparison, predictions] = await Promise.all([
      api.get('/principal/analytics/performance'),
      api.get('/principal/analytics/teacher-ranking'),
      api.get('/principal/analytics/department-comparison'),
      api.get('/principal/analytics/student-failure-prediction')
    ]);
    
    return {
      performanceTrend: {
        attendanceTrend: Object.entries(performance.passPercentageByDepartment || {}).map(([month, val]) => ({ month, attendance: val })),
        marksTrend: Object.entries(performance.passPercentageByDepartment || {}).map(([month, val]) => ({ month, marks: val }))
      },
      teacherRanking: (ranking || []).map(r => ({
        name: r.teacherName,
        department: r.department,
        rating: (r.studentFeedback / 20).toFixed(1),
        students: r.attendanceRate, // Using attendance as proxy for now
        research: (r.averageMarks / 10).toFixed(0) // Using marks as proxy for now
      })),
      departmentComparison: Object.entries(comparison.departmentStats || {}).map(([name, stats]) => ({
        dept: name,
        avgMarks: stats.averageMarks,
        placement: stats.passRate, // Using passRate as proxy for placement
        satisfaction: stats.averageAttendance
      })),
      studentPredictions: (predictions || []).map(p => ({
        id: p.studentId,
        name: p.studentName,
        risk: p.riskLevel.charAt(0) + p.riskLevel.slice(1).toLowerCase(),
        attendance: p.attendancePercentage,
        marks: p.currentMarks,
        recommended: p.recommendations[0] || 'N/A'
      }))
    };
  },

  // Reports
  generateReport: async (params) => {
    return api.get('/analytics/export/performance-report', {
      params: { academicYear: params.academicYear || '2024' },
      responseType: 'blob'
    });
  },

  // Departments
  getDepartments: async () => {
    const data = await api.get('/departments');
    return (data || []).map(dept => ({
      ...dept,
      hod: dept.hodName // Map hodName to hod for frontend
    }));
  },

  createDepartment: async (data) => {
    return api.post('/principal/departments', data);
  },

  updateDepartment: async (id, data) => {
    return api.put(`/principal/departments/${id}`, data);
  },

  deleteDepartment: async (id) => {
    return api.delete(`/principal/departments/${id}`);
  },

  // HOD Management
  getHODs: async () => {
    const data = await api.get('/principal/hods');
    return (data || []).map(hod => ({
      ...hod,
      department: hod.departmentName || hod.department // Map departmentName if present
    }));
  },

  assignHOD: async (data) => {
    return api.post('/principal/hods', data);
  },

  updateHOD: async (id, data) => {
    return api.put(`/principal/hods/${id}`, data);
  },

  removeHOD: async (id) => {
    return api.delete(`/principal/hods/${id}`);
  },

  getAvailableTeachers: async () => {
    return api.get('/principal/teachers/available');
  }
};
