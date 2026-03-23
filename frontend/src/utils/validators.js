import { VALIDATION_PATTERNS } from './constants';

// Validate email
export const isValidEmail = (email) => {
  return VALIDATION_PATTERNS.EMAIL.test(email);
};

// Validate phone number
export const isValidPhone = (phone) => {
  return VALIDATION_PATTERNS.PHONE.test(phone);
};

// Validate password
export const isValidPassword = (password) => {
  return VALIDATION_PATTERNS.PASSWORD.test(password);
};

// Validate name
export const isValidName = (name) => {
  return VALIDATION_PATTERNS.NAME.test(name);
};

// Validate roll number
export const isValidRollNumber = (rollNumber) => {
  return VALIDATION_PATTERNS.ROLL_NUMBER.test(rollNumber);
};

// Validate date range
export const isValidDateRange = (startDate, endDate) => {
  if (!startDate || !endDate) return false;
  return new Date(endDate) >= new Date(startDate);
};

// Validate file size
export const isValidFileSize = (file, maxSize) => {
  return file.size <= maxSize;
};

// Validate file type
export const isValidFileType = (file, allowedTypes) => {
  return allowedTypes.includes(file.type);
};

// Validate URL
export const isValidUrl = (url) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

// Form validation helper
export const validateForm = (values, rules) => {
  const errors = {};
  
  Object.keys(rules).forEach(field => {
    const value = values[field];
    const rule = rules[field];
    
    if (rule.required && (!value || value.trim() === '')) {
      errors[field] = `${rule.label || field} is required`;
    } else if (rule.minLength && value && value.length < rule.minLength) {
      errors[field] = `${rule.label || field} must be at least ${rule.minLength} characters`;
    } else if (rule.maxLength && value && value.length > rule.maxLength) {
      errors[field] = `${rule.label || field} must be at most ${rule.maxLength} characters`;
    } else if (rule.pattern && value && !rule.pattern.test(value)) {
      errors[field] = rule.message || `${rule.label || field} is invalid`;
    } else if (rule.custom && value && !rule.custom(value)) {
      errors[field] = rule.message || `${rule.label || field} is invalid`;
    }
  });
  
  return errors;
};

// Validate attendance data
export const validateAttendance = (attendanceData) => {
  const errors = {};
  
  if (!attendanceData.classId) {
    errors.classId = 'Class is required';
  }
  if (!attendanceData.date) {
    errors.date = 'Date is required';
  }
  if (!attendanceData.studentAttendance || Object.keys(attendanceData.studentAttendance).length === 0) {
    errors.studentAttendance = 'Student attendance data is required';
  }
  
  return errors;
};

// Validate marks data
export const validateMarks = (marksData) => {
  const errors = {};
  
  if (!marksData.subjectId) {
    errors.subjectId = 'Subject is required';
  }
  if (!marksData.semester) {
    errors.semester = 'Semester is required';
  }
  if (!marksData.marksType) {
    errors.marksType = 'Marks type is required';
  }
  if (!marksData.studentMarks || Object.keys(marksData.studentMarks).length === 0) {
    errors.studentMarks = 'Student marks data is required';
  }
  
  // Validate each student's marks
  Object.entries(marksData.studentMarks).forEach(([studentId, marks]) => {
    if (marks < 0 || marks > marksData.maxMarks) {
      errors[`marks_${studentId}`] = `Marks must be between 0 and ${marksData.maxMarks}`;
    }
  });
  
  return errors;
};

// Validate leave request
export const validateLeave = (leaveData) => {
  const errors = {};
  
  if (!leaveData.startDate) {
    errors.startDate = 'Start date is required';
  }
  if (!leaveData.endDate) {
    errors.endDate = 'End date is required';
  }
  if (leaveData.startDate && leaveData.endDate && !isValidDateRange(leaveData.startDate, leaveData.endDate)) {
    errors.endDate = 'End date must be after start date';
  }
  if (!leaveData.reason || leaveData.reason.trim() === '') {
    errors.reason = 'Reason is required';
  } else if (leaveData.reason.length < 10) {
    errors.reason = 'Please provide a detailed reason (minimum 10 characters)';
  }
  
  return errors;
};

// Validate timetable entry
export const validateTimetable = (timetableData) => {
  const errors = {};
  
  if (!timetableData.classId) {
    errors.classId = 'Class is required';
  }
  if (!timetableData.subjectId) {
    errors.subjectId = 'Subject is required';
  }
  if (!timetableData.teacherId) {
    errors.teacherId = 'Teacher is required';
  }
  if (!timetableData.dayOfWeek) {
    errors.dayOfWeek = 'Day is required';
  }
  if (!timetableData.startTime) {
    errors.startTime = 'Start time is required';
  }
  if (!timetableData.endTime) {
    errors.endTime = 'End time is required';
  }
  if (timetableData.startTime && timetableData.endTime && timetableData.startTime >= timetableData.endTime) {
    errors.endTime = 'End time must be after start time';
  }
  
  return errors;
};