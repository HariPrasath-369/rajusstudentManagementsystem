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
  getMarks: async () => {
    return api.get('/student/marks');
  },
  getTimetable: async () => {
    return api.get('/student/timetable');
  },
  getPerformance: async () => {
    return api.get('/student/performance');
  },
  applyLeave: async (data) => {
    return api.post('/student/leaves', data);
  },
  getLeaves: async () => {
    return api.get('/student/leaves');
  }
};
