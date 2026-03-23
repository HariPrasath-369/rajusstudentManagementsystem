import api from './api';

export const attendanceService = {
  // Mark attendance (Teacher/CA)
  markAttendance: async (attendanceData) => {
    return await api.post('/attendance/mark', attendanceData);
  },

  // Update attendance record (Teacher/CA)
  updateAttendance: async (attendanceId, status) => {
    return await api.put(`/attendance/${attendanceId}?status=${status}`);
  },

  // Submit attendance for a class (Teacher/CA)
  submitAttendance: async (classId, date) => {
    return await api.post(`/attendance/submit?classId=${classId}&date=${date}`);
  },

  // Get attendance by class and date
  getAttendanceByClassAndDate: async (classId, date) => {
    return await api.get(`/attendance/class/${classId}/date/${date}`);
  },

  // Get student attendance history
  getStudentAttendance: async (studentId, page = 0, size = 10) => {
    return await api.get(`/attendance/student/${studentId}?page=${page}&size=${size}`);
  },

  // Get attendance statistics for a class
  getAttendanceStatistics: async (classId, startDate, endDate) => {
    return await api.get(`/attendance/statistics/class/${classId}?startDate=${startDate}&endDate=${endDate}`);
  },

  // Get student attendance percentage
  getStudentAttendancePercentage: async (studentId, subjectId = null) => {
    let url = `/attendance/student/${studentId}/percentage`;
    if (subjectId) {
      url += `?subjectId=${subjectId}`;
    }
    return await api.get(url);
  },

  // Generate QR code for attendance (Teacher/CA)
  generateQRCode: async (classId, date) => {
    return await api.post(`/attendance/qr/generate?classId=${classId}&date=${date}`);
  },

  // Scan QR code for attendance (Student)
  scanQRCode: async (qrCode) => {
    return await api.post('/attendance/qr/scan', { qrCode });
  },

  // Export attendance report
  exportAttendanceReport: async (classId, startDate, endDate) => {
    return await api.get(`/attendance/export?classId=${classId}&startDate=${startDate}&endDate=${endDate}`, {
      responseType: 'blob',
    });
  },
};