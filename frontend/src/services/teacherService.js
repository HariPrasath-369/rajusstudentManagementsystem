import api from './api';

export const teacherService = {
  // Dashboard
  getDashboard: async () => {
    return api.get('/teacher/dashboard');
  },

  // Classes & Students
  getAssignedClasses: async () => {
    return api.get('/teacher/assigned-classes');
  },
  getStudentsByClass: async (classId) => {
    return api.get(`/teacher/classes/${classId}/students`);
  },
  getSubjectsByClass: async (classId) => {
    return api.get(`/teacher/classes/${classId}/subjects`);
  },

  // Attendance
  getAttendance: async (classId, date) => {
    return api.get(`/attendance/class/${classId}/date/${date}`);
  },
  markAttendance: async (data) => {
    return api.post('/attendance/mark', data);
  },
  submitAttendance: async (classId, date) => {
    return api.post('/attendance/submit', null, { params: { classId, date } });
  },
  generateQRCode: async (classId, date) => {
    return api.post('/attendance/qr/generate', null, { params: { classId, date } });
  },
  exportAttendance: async (classId, date) => {
    return api.get(`/attendance/statistics/class/${classId}`, { 
      params: { startDate: date, endDate: date },
      responseType: 'blob' 
    });
  },

  // Marks
  getMarks: async (subjectId, semester) => {
    return api.get(`/teacher/marks/${subjectId}`, { params: { semester } });
  },
  uploadMarks: async (data) => {
    return api.post('/teacher/marks', data);
  },
  saveMarks: async (subjectId, semester, marksMap) => {
    const requests = Object.entries(marksMap).map(([studentId, marks]) => ({
      studentId: parseInt(studentId),
      subjectId,
      semester,
      marksObtained: marks
    }));
    return api.post('/teacher/marks', requests[0]);
  },
  uploadMarksExcel: async (subjectId, semester, file) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('subjectId', subjectId);
    formData.append('semester', semester);
    return api.post('/teacher/marks/excel', formData);
  },
  publishMarks: async (subjectId, semester) => {
    return api.post('/teacher/marks/publish', null, { params: { subjectId, semester } });
  },

  // OEM Board
  getOEMBoard: async (classId, subjectId, semester) => {
    return api.get('/teacher/oem-board', { params: { classId, subjectId, semester } });
  },
  saveOEMBoard: async (classId, subjectId, semester, marksMap) => {
    const entries = Object.entries(marksMap).map(([studentId, marks]) => ({
      studentId: parseInt(studentId),
      assessmentMarks: marks.assessment || null,
      practicalMarks: marks.practical || null,
      semesterMarks: marks.semester || null
    }));
    return api.post('/teacher/oem-board', { classId, subjectId, semester, entries });
  },

  // Materials
  getMaterials: async (subjectId) => {
    return api.get('/teacher/materials', { params: { subjectId } });
  },
  uploadMaterial: async (formData) => {
    return api.post('/teacher/materials', formData);
  },
  deleteMaterial: async (id) => {
    return api.delete(`/teacher/materials/${id}`);
  },

  // Leaves
  getLeaveRequests: async (classId, status) => {
    return api.get(`/leaves/class/${classId}`, { params: { status } });
  },
  approveLeave: async (leaveId, reason = 'Approved') => {
    return api.put(`/leaves/${leaveId}/approve`, { remarks: reason });
  },
  rejectLeave: async (leaveId, reason) => {
    return api.put(`/leaves/${leaveId}/reject`, { remarks: reason });
  }
};
