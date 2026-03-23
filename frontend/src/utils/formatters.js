import { format, parseISO } from 'date-fns';
import { DATE_FORMATS } from './constants';

// Format date for display
export const formatDisplayDate = (date) => {
  if (!date) return 'N/A';
  try {
    const parsedDate = typeof date === 'string' ? parseISO(date) : date;
    return format(parsedDate, DATE_FORMATS.DISPLAY_DATE);
  } catch {
    return 'Invalid Date';
  }
};

// Format datetime for display
export const formatDisplayDateTime = (date) => {
  if (!date) return 'N/A';
  try {
    const parsedDate = typeof date === 'string' ? parseISO(date) : date;
    return format(parsedDate, DATE_FORMATS.DISPLAY_DATE_TIME);
  } catch {
    return 'Invalid Date';
  }
};

// Format time for display
export const formatDisplayTime = (time) => {
  if (!time) return 'N/A';
  try {
    return format(new Date(`2000-01-01T${time}`), DATE_FORMATS.DISPLAY_TIME);
  } catch {
    return 'Invalid Time';
  }
};

// Format attendance status
export const formatAttendanceStatus = (status) => {
  const statusMap = {
    PRESENT: 'Present',
    ABSENT: 'Absent',
    LATE: 'Late',
    LEAVE: 'On Leave',
  };
  return statusMap[status] || status;
};

// Format leave status
export const formatLeaveStatus = (status) => {
  const statusMap = {
    PENDING: 'Pending',
    APPROVED: 'Approved',
    REJECTED: 'Rejected',
  };
  return statusMap[status] || status;
};

// Format marks type
export const formatMarksType = (type) => {
  const typeMap = {
    ASSESSMENT: 'Assessment',
    PRACTICAL: 'Practical',
    SEMESTER: 'Semester Exam',
    INTERNAL: 'Internal Assessment',
    EXTERNAL: 'External Exam',
  };
  return typeMap[type] || type;
};

// Format grade from percentage
export const formatGrade = (percentage) => {
  if (percentage >= 90) return 'A+';
  if (percentage >= 80) return 'A';
  if (percentage >= 70) return 'B+';
  if (percentage >= 60) return 'B';
  if (percentage >= 50) return 'C';
  if (percentage >= 40) return 'D';
  return 'F';
};

// Format role name
export const formatRole = (role) => {
  const roleMap = {
    ROLE_PRINCIPAL: 'Principal',
    ROLE_HOD: 'Head of Department',
    ROLE_TEACHER: 'Teacher',
    ROLE_CA: 'Class Advisor',
    ROLE_STUDENT: 'Student',
  };
  return roleMap[role] || role;
};

// Format day of week
export const formatDayOfWeek = (day) => {
  const dayMap = {
    MONDAY: 'Monday',
    TUESDAY: 'Tuesday',
    WEDNESDAY: 'Wednesday',
    THURSDAY: 'Thursday',
    FRIDAY: 'Friday',
    SATURDAY: 'Saturday',
    SUNDAY: 'Sunday',
  };
  return dayMap[day] || day;
};

// Format notification type
export const formatNotificationType = (type) => {
  const typeMap = {
    INFO: 'Information',
    WARNING: 'Warning',
    SUCCESS: 'Success',
    ERROR: 'Error',
    ATTENDANCE: 'Attendance',
    LEAVE: 'Leave',
    MARKS: 'Marks',
    TIMETABLE: 'Timetable',
  };
  return typeMap[type] || type;
};

// Format material type
export const formatMaterialType = (type) => {
  const typeMap = {
    NOTES: 'Notes',
    ASSIGNMENT: 'Assignment',
    SYLLABUS: 'Syllabus',
    REFERENCE: 'Reference Material',
    VIDEO: 'Video Lecture',
    OTHER: 'Other',
  };
  return typeMap[type] || type;
};

// Format file size
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Format number with suffix
export const formatNumberWithSuffix = (num) => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
};

// Format percentage
export const formatPercentage = (value, total) => {
  if (!total || total === 0) return '0%';
  return ((value / total) * 100).toFixed(1) + '%';
};

// Format phone number
export const formatPhoneNumber = (phone) => {
  if (!phone) return '';
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length === 10) {
    return cleaned.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
  }
  return phone;
};