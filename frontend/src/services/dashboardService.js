import api from './api';

export const dashboardService = {
  getDashboard: async () => {
    return api.get('/dashboard');
  },
  getPrincipalDashboard: async () => {
    return api.get('/dashboard/principal');
  },
  getHodDashboard: async () => {
    return api.get('/dashboard/hod');
  },
  getTeacherDashboard: async () => {
    return api.get('/dashboard/teacher');
  },
  getStudentDashboard: async () => {
    return api.get('/dashboard/student');
  }
};
