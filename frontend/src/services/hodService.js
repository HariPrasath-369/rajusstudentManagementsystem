import api from './api';

export const hodService = {
  // Dashboard & Stats
  getDashboard: async () => {
    return api.get('/hod/dashboard');
  },
  getDepartmentStats: async () => {
    return api.get('/dashboard/hod');
  },

  // Teacher Management
  getTeachers: async () => {
    return api.get('/hod/teachers');
  },
  createTeacher: async (data) => {
    return api.post('/hod/teachers', data);
  },
  updateTeacher: async (id, data) => {
    return api.put(`/hod/teachers/${id}`, data);
  },
  deleteTeacher: async (id) => {
    return api.delete(`/hod/teachers/${id}`);
  },

  // Class Management
  getClasses: async () => {
    return api.get('/hod/classes');
  },
  createClass: async (data) => {
    return api.post('/hod/classes', data);
  },
  updateClass: async (id, data) => {
    return api.put(`/hod/classes/${id}`, data);
  },
  deleteClass: async (id) => {
    return api.delete(`/hod/classes/${id}`);
  },

  // Subject Management
  getSubjects: async () => {
    return api.get('/hod/subjects');
  },
  assignSubjects: async (classId, data) => {
    return api.post(`/hod/classes/${classId}/subjects`, data);
  },

  // Timetable Management
  getTimetable: async () => {
    return api.get('/hod/timetable');
  },
  addTimetableEntry: async (data) => {
    return api.post('/hod/timetable', data);
  },
  generateAutoTimetable: async (classId) => {
    return api.post('/hod/timetable/generate', { classId });
  },

  // Semester Management
  approveSemester: async (data) => {
    return api.post('/hod/semester/approve', data);
  }
};
