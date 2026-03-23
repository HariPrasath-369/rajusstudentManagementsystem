import api from './api';

export const timetableService = {
  // Create timetable entry (HOD)
  createTimetableEntry: async (timetableData) => {
    return await api.post('/timetable', timetableData);
  },

  // Update timetable entry (HOD)
  updateTimetableEntry: async (id, timetableData) => {
    return await api.put(`/timetable/${id}`, timetableData);
  },

  // Delete timetable entry (HOD)
  deleteTimetableEntry: async (id) => {
    return await api.delete(`/timetable/${id}`);
  },

  // Get timetable by class
  getTimetableByClass: async (classId) => {
    return await api.get(`/timetable/class/${classId}`);
  },

  // Get weekly timetable by class
  getWeeklyTimetable: async (classId) => {
    return await api.get(`/timetable/class/${classId}/weekly`);
  },

  // Get timetable by teacher
  getTimetableByTeacher: async (teacherId) => {
    return await api.get(`/timetable/teacher/${teacherId}`);
  },

  // Get teacher workload
  getTeacherWorkload: async (teacherId) => {
    return await api.get(`/timetable/teacher/workload/${teacherId}`);
  },

  // Generate auto timetable (HOD)
  generateAutoTimetable: async (classId) => {
    return await api.post(`/timetable/generate?classId=${classId}`);
  },

  // Detect timetable conflicts (HOD)
  detectConflicts: async () => {
    return await api.get('/timetable/conflicts');
  },

  // Validate timetable constraints
  validateTimetable: async (classId) => {
    return await api.get(`/timetable/validate?classId=${classId}`);
  },

  // Export timetable (HOD/Student)
  exportTimetable: async (classId, format = 'pdf') => {
    return await api.get(`/timetable/export?classId=${classId}&format=${format}`, {
      responseType: 'blob',
    });
  },
};