import api from './api';

export const studentService = {
  getDashboard: async () => {
    return api.get('/student/dashboard');
  },
  getAttendance: async () => {
    return api.get('/student/attendance');
  },
  getAttendanceHistory: async (params) => {
    return api.get('/student/attendance/history', { params });
  },
  getMarks: async (semester) => {
    return api.get('/student/marks', { params: { semester } });
  },
  downloadMarksheet: async (semester) => {
    return api.get(`/student/marks/download/${semester}`, { responseType: 'blob' });
  },
  getTimetable: async () => {
    return api.get('/student/timetable');
  },
  getPerformance: async () => {
    return api.get('/student/performance');
  },
  getPerformanceInsights: async () => {
    return api.get('/student/performance/insights');
  },
  applyLeave: async (data) => {
    return api.post('/student/leaves', data);
  },
  getLeaves: async () => {
    return api.get('/student/leaves');
  },
  getSubjects: async () => {
    const response = await api.get('/student/subjects');
    return response.data;
  },
  getMaterials: async (subjectId = null) => {
    const params = subjectId ? { subjectId } : {};
    const response = await api.get('/student/materials', { params });
    return response.data;
  }
};
