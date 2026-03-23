import api from './api';

export const hodService = {
  getDashboard: async () => {
    return api.get('/hod/dashboard');
  },
  getDepartmentStats: async () => {
    // This could also be part of analytics
    return api.get('/dashboard/hod');
  }
};
