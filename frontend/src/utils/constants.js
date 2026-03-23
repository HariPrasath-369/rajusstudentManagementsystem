// API Endpoints
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    SEND_OTP: '/auth/send-otp',
    VERIFY_OTP: '/auth/verify-otp',
    RESET_PASSWORD: '/auth/reset-password',
  },
  USER: {
    PROFILE: '/users/profile',
    UPDATE_PROFILE: '/users/profile',
    CHANGE_PASSWORD: '/users/change-password',
    USERS: '/users',
    TEACHERS_BY_DEPARTMENT: (deptId) => `/users/teachers/department/${deptId}`,
    STUDENTS_BY_CLASS: (classId) => `/users/students/class/${classId}`,
  },
  DEPARTMENT: {
    BASE: '/departments',
    WITHOUT_HOD: '/departments/without-hod',
  },
  CLASS: {
    BASE: '/classes',
    STUDENTS: (classId) => `/classes/${classId}/students`,
    SUBJECTS: (classId) => `/classes/${classId}/subjects`,
    ADVISOR: (classId) => `/classes/${classId}/advisor`,
  },
  ATTENDANCE: {
    MARK: '/attendance/mark',
    SUBMIT: '/attendance/submit',
    BY_CLASS_AND_DATE: (classId, date) => `/attendance/class/${classId}/date/${date}`,
    STUDENT: (studentId) => `/attendance/student/${studentId}`,
    STATISTICS: (classId, startDate, endDate) => `/attendance/statistics/class/${classId}?startDate=${startDate}&endDate=${endDate}`,
    QR_GENERATE: '/attendance/qr/generate',
    QR_SCAN: '/attendance/qr/scan',
    EXPORT: '/attendance/export',
  },
  MARKS: {
    BASE: '/marks',
    EXCEL_UPLOAD: '/marks/excel',
    PUBLISH: '/marks/publish',
    BY_SUBJECT: (subjectId, semester) => `/marks/subject/${subjectId}?semester=${semester}`,
    BY_STUDENT: (studentId) => `/marks/student/${studentId}`,
    OEM_BOARD: '/marks/oem-board',
    DOWNLOAD_MARKSHEET: (studentId, semester) => `/marks/download-marksheet?studentId=${studentId}&semester=${semester}`,
  },
  TIMETABLE: {
    BASE: '/timetable',
    BY_CLASS: (classId) => `/timetable/class/${classId}`,
    WEEKLY: (classId) => `/timetable/class/${classId}/weekly`,
    BY_TEACHER: (teacherId) => `/timetable/teacher/${teacherId}`,
    WORKLOAD: (teacherId) => `/timetable/teacher/workload/${teacherId}`,
    GENERATE: '/timetable/generate',
    CONFLICTS: '/timetable/conflicts',
    VALIDATE: (classId) => `/timetable/validate?classId=${classId}`,
    EXPORT: (classId, format) => `/timetable/export?classId=${classId}&format=${format}`,
  },
  NOTIFICATION: {
    BASE: '/notifications',
    UNREAD: '/notifications/unread',
    COUNT_UNREAD: '/notifications/count/unread',
    READ: (id) => `/notifications/${id}/read`,
    READ_ALL: '/notifications/read-all',
    PREFERENCES: '/notifications/preferences',
  },
  MATERIAL: {
    BASE: '/materials',
    UPLOAD: '/materials/upload',
    BY_SUBJECT: (subjectId) => `/materials/subject/${subjectId}`,
    BY_TEACHER: (teacherId) => `/materials/teacher/${teacherId}`,
    DOWNLOAD: (id) => `/materials/download/${id}`,
  },
  ANALYTICS: {
    INSTITUTION: '/analytics/institution/performance',
    TEACHER_RANKING: '/analytics/teacher-ranking',
    DEPARTMENT_COMPARISON: '/analytics/department-comparison',
    STUDENT_PREDICTION: '/analytics/student-failure-prediction',
    STUDENT_PERFORMANCE: (studentId) => `/analytics/student/performance/${studentId}`,
    CLASS_PERFORMANCE: (classId) => `/analytics/class/performance/${classId}`,
    ATTENDANCE_TRENDS: (deptId, year) => `/analytics/attendance/trends?departmentId=${deptId}&academicYear=${year}`,
    MARKS_DISTRIBUTION: (subjectId, semester) => `/analytics/marks/distribution?subjectId=${subjectId}&semester=${semester}`,
    EXPORT_REPORT: (year) => `/analytics/export/performance-report?academicYear=${year}`,
  },
  FILE: {
    UPLOAD: '/files/upload',
    DOWNLOAD: (fileName) => `/files/download/${fileName}`,
    VIEW: (fileName) => `/files/view/${fileName}`,
    DELETE: (fileName) => `/files/${fileName}`,
    FOLDER: (folder) => `/files/folder/${folder}`,
  },
  LEAVE: {
    BASE: '/leaves',
    PENDING: '/leaves/pending',
    BY_CLASS: (classId) => `/leaves/class/${classId}`,
    APPROVE: (id) => `/leaves/${id}/approve`,
    REJECT: (id) => `/leaves/${id}/reject`,
    CANCEL: (id) => `/leaves/${id}`,
  },
};

// Role Constants
export const ROLES = {
  PRINCIPAL: 'ROLE_PRINCIPAL',
  HOD: 'ROLE_HOD',
  TEACHER: 'ROLE_TEACHER',
  CA: 'ROLE_CA',
  STUDENT: 'ROLE_STUDENT',
};

// Attendance Status
export const ATTENDANCE_STATUS = {
  PRESENT: 'PRESENT',
  ABSENT: 'ABSENT',
  LATE: 'LATE',
  LEAVE: 'LEAVE',
};

// Leave Status
export const LEAVE_STATUS = {
  PENDING: 'PENDING',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
};

// Marks Type
export const MARKS_TYPE = {
  ASSESSMENT: 'ASSESSMENT',
  PRACTICAL: 'PRACTICAL',
  SEMESTER: 'SEMESTER',
  INTERNAL: 'INTERNAL',
  EXTERNAL: 'EXTERNAL',
};

// Notification Types
export const NOTIFICATION_TYPE = {
  INFO: 'INFO',
  WARNING: 'WARNING',
  SUCCESS: 'SUCCESS',
  ERROR: 'ERROR',
  ATTENDANCE: 'ATTENDANCE',
  LEAVE: 'LEAVE',
  MARKS: 'MARKS',
  TIMETABLE: 'TIMETABLE',
};

// Material Types
export const MATERIAL_TYPE = {
  NOTES: 'NOTES',
  ASSIGNMENT: 'ASSIGNMENT',
  SYLLABUS: 'SYLLABUS',
  REFERENCE: 'REFERENCE',
  VIDEO: 'VIDEO',
  OTHER: 'OTHER',
};

// Day of Week
export const DAYS_OF_WEEK = {
  MONDAY: 'MONDAY',
  TUESDAY: 'TUESDAY',
  WEDNESDAY: 'WEDNESDAY',
  THURSDAY: 'THURSDAY',
  FRIDAY: 'FRIDAY',
  SATURDAY: 'SATURDAY',
  SUNDAY: 'SUNDAY',
};

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  PAGE_SIZE_OPTIONS: [10, 25, 50, 100],
};

// File Upload
export const FILE_UPLOAD = {
  MAX_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_TYPES: [
    'image/jpeg',
    'image/png',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'video/mp4',
  ],
};

// Date Formats
export const DATE_FORMATS = {
  DATE: 'yyyy-MM-dd',
  DATE_TIME: 'yyyy-MM-dd HH:mm:ss',
  TIME: 'HH:mm',
  DISPLAY_DATE: 'MMM dd, yyyy',
  DISPLAY_DATE_TIME: 'MMM dd, yyyy hh:mm a',
  DISPLAY_TIME: 'hh:mm a',
};

// Chart Colors
export const CHART_COLORS = {
  PRIMARY: '#3b82f6',
  SECONDARY: '#64748b',
  SUCCESS: '#10b981',
  WARNING: '#f59e0b',
  DANGER: '#ef4444',
  INFO: '#06b6d4',
  PURPLE: '#8b5cf6',
  PINK: '#ec489a',
  INDIGO: '#6366f1',
  TEAL: '#14b8a6',
};

// Local Storage Keys
export const STORAGE_KEYS = {
  TOKEN: 'sms_auth_token',
  USER: 'sms_user',
  THEME: 'theme',
  NOTIFICATION_PREFS: 'notification_prefs',
};

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK: 'Network error. Please check your connection.',
  UNAUTHORIZED: 'Session expired. Please login again.',
  FORBIDDEN: 'You don\'t have permission to perform this action.',
  NOT_FOUND: 'Resource not found.',
  SERVER: 'Server error. Please try again later.',
  VALIDATION: 'Please check the form for errors.',
  FILE_TOO_LARGE: 'File size exceeds the maximum limit.',
  FILE_TYPE_NOT_ALLOWED: 'File type not allowed.',
};

// Success Messages
export const SUCCESS_MESSAGES = {
  LOGIN: 'Login successful!',
  LOGOUT: 'Logged out successfully',
  REGISTER: 'Registration successful! Please login.',
  PROFILE_UPDATE: 'Profile updated successfully',
  PASSWORD_CHANGE: 'Password changed successfully',
  ATTENDANCE_SUBMITTED: 'Attendance submitted successfully',
  MARKS_UPLOADED: 'Marks uploaded successfully',
  MARKS_PUBLISHED: 'Marks published successfully',
  LEAVE_APPLIED: 'Leave application submitted successfully',
  LEAVE_APPROVED: 'Leave approved successfully',
  LEAVE_REJECTED: 'Leave rejected',
  MATERIAL_UPLOADED: 'Material uploaded successfully',
  NOTIFICATION_SENT: 'Notification sent successfully',
};

// Validation Patterns
export const VALIDATION_PATTERNS = {
  EMAIL: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
  PHONE: /^[\+]?[(]?[0-9]{1,3}[)]?[-\s\.]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{3,4}[-\s\.]?[0-9]{4}$/,
  PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{6,}$/,
  ROLL_NUMBER: /^[A-Z0-9]{5,15}$/,
  NAME: /^[a-zA-Z\s]{2,100}$/,
};