import api from './api';

export const marksService = {
  // Upload marks (Teacher)
  uploadMarks: async (marksData) => {
    return await api.post('/marks', marksData);
  },

  // Upload marks from Excel (Teacher)
  uploadMarksExcel: async (subjectId, semester, file) => {
    const formData = new FormData();
    formData.append('file', file);
    return await api.post(`/marks/excel?subjectId=${subjectId}&semester=${semester}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  // Update marks (Teacher)
  updateMarks: async (marksId, marksObtained) => {
    return await api.put(`/marks/${marksId}?marksObtained=${marksObtained}`);
  },

  // Publish marks (Teacher)
  publishMarks: async (subjectId, semester) => {
    return await api.post(`/marks/publish?subjectId=${subjectId}&semester=${semester}`);
  },

  // Get marks by subject (Teacher/HOD/Principal)
  getMarksBySubject: async (subjectId, semester) => {
    return await api.get(`/marks/subject/${subjectId}?semester=${semester}`);
  },

  // Get marks by student (Student/Teacher)
  getMarksByStudent: async (studentId) => {
    return await api.get(`/marks/student/${studentId}`);
  },

  // Get OEM board data (Teacher)
  getOEMBoard: async (classId, subjectId) => {
    return await api.get(`/marks/oem-board?classId=${classId}&subjectId=${subjectId}`);
  },

  // Fill OEM board (Teacher)
  fillOEMBoard: async (oemData) => {
    return await api.post('/marks/oem-board', oemData);
  },

  // Download marksheet (Student)
  downloadMarksheet: async (studentId, semester) => {
    return await api.get(`/marks/download-marksheet?studentId=${studentId}&semester=${semester}`, {
      responseType: 'blob',
    });
  },

  // Get student performance analytics
  getStudentPerformance: async (studentId) => {
    return await api.get(`/analytics/student/performance/${studentId}`);
  },

  // Get class performance analytics (HOD)
  getClassPerformance: async (classId) => {
    return await api.get(`/analytics/class/performance/${classId}`);
  },
};