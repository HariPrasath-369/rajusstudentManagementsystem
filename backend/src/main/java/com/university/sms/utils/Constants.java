package com.university.sms.utils;

import java.time.LocalTime;
import java.util.Arrays;
import java.util.List;

public final class Constants {

    private Constants() {
        // Private constructor to prevent instantiation
    }

    // Role Constants
    public static final String ROLE_PRINCIPAL = "ROLE_PRINCIPAL";
    public static final String ROLE_HOD = "ROLE_HOD";
    public static final String ROLE_TEACHER = "ROLE_TEACHER";
    public static final String ROLE_CA = "ROLE_CA";
    public static final String ROLE_STUDENT = "ROLE_STUDENT";

    // Attendance Constants
    public static final int MIN_ATTENDANCE_PERCENTAGE = 75;
    public static final int MAX_SUBJECTS_PER_DAY = 2;
    public static final LocalTime WORKING_HOURS_START = LocalTime.of(8, 0);
    public static final LocalTime WORKING_HOURS_END = LocalTime.of(18, 0);
    public static final int MAX_CLASS_DURATION_MINUTES = 120;

    // Marks Constants
    public static final double PASSING_PERCENTAGE = 40.0;
    public static final double MAX_ASSESSMENT_MARKS = 50.0;
    public static final double MAX_PRACTICAL_MARKS = 50.0;
    public static final double MAX_SEMESTER_MARKS = 100.0;

    // Leave Constants
    public static final int MAX_LEAVE_DAYS_PER_SEMESTER = 10;
    public static final int MAX_CONSECUTIVE_LEAVE_DAYS = 5;

    // Pagination Constants
    public static final int DEFAULT_PAGE_SIZE = 20;
    public static final int MAX_PAGE_SIZE = 100;

    // File Upload Constants
    public static final long MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
    public static final List<String> ALLOWED_FILE_TYPES = Arrays.asList(
        "image/jpeg", "image/png", "application/pdf", 
        "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "application/vnd.ms-excel", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );

    // Cache Constants
    public static final String CACHE_USERS = "users";
    public static final String CACHE_DEPARTMENTS = "departments";
    public static final String CACHE_CLASSES = "classes";
    public static final String CACHE_TIMETABLE = "timetable";
    public static final int CACHE_TTL_HOURS = 24;

    // JWT Constants
    public static final String TOKEN_PREFIX = "Bearer ";
    public static final String AUTHORIZATION_HEADER = "Authorization";

    // API Endpoints
    public static final String API_BASE_PATH = "/api";
    public static final String API_AUTH = API_BASE_PATH + "/auth";
    public static final String API_PRINCIPAL = API_BASE_PATH + "/principal";
    public static final String API_HOD = API_BASE_PATH + "/hod";
    public static final String API_TEACHER = API_BASE_PATH + "/teacher";
    public static final String API_STUDENT = API_BASE_PATH + "/student";

    // QR Code Constants
    public static final String QR_CODE_PREFIX = "ATT:";
    public static final int QR_CODE_EXPIRY_MINUTES = 15;

    // Semester Constants
    public static final int SEMESTER_1_MONTH_START = 6; // June
    public static final int SEMESTER_1_MONTH_END = 11; // November
    public static final int SEMESTER_2_MONTH_START = 1; // January
    public static final int SEMESTER_2_MONTH_END = 5; // May

    // Email Templates
    public static final String EMAIL_TEMPLATE_OTP = "otp-email";
    public static final String EMAIL_TEMPLATE_WELCOME = "welcome-email";
    public static final String EMAIL_TEMPLATE_ATTENDANCE_ALERT = "attendance-alert";
    public static final String EMAIL_TEMPLATE_LEAVE_APPROVED = "leave-approved";
    public static final String EMAIL_TEMPLATE_MARKS_PUBLISHED = "marks-published";

    // Notification Types
    public static final String NOTIFICATION_TYPE_INFO = "INFO";
    public static final String NOTIFICATION_TYPE_WARNING = "WARNING";
    public static final String NOTIFICATION_TYPE_SUCCESS = "SUCCESS";
    public static final String NOTIFICATION_TYPE_ERROR = "ERROR";
    public static final String NOTIFICATION_TYPE_ATTENDANCE = "ATTENDANCE";
    public static final String NOTIFICATION_TYPE_LEAVE = "LEAVE";
    public static final String NOTIFICATION_TYPE_MARKS = "MARKS";
    public static final String NOTIFICATION_TYPE_TIMETABLE = "TIMETABLE";

    // Regular Expressions
    public static final String EMAIL_REGEX = "^[A-Za-z0-9+_.-]+@(.+)$";
    public static final String PHONE_REGEX = "^[0-9]{10}$";
    public static final String ROLL_NUMBER_REGEX = "^[A-Z0-9]{5,15}$";

    // Date Formats
    public static final String DATE_FORMAT = "yyyy-MM-dd";
    public static final String DATE_TIME_FORMAT = "yyyy-MM-dd HH:mm:ss";
    public static final String TIME_FORMAT = "HH:mm";

    // Error Messages
    public static final String ERROR_RESOURCE_NOT_FOUND = "Resource not found";
    public static final String ERROR_UNAUTHORIZED = "Unauthorized access";
    public static final String ERROR_BAD_REQUEST = "Bad request";
    public static final String ERROR_CONFLICT = "Data conflict";
    public static final String ERROR_INTERNAL_SERVER = "Internal server error";
    public static final String ERROR_VALIDATION = "Validation failed";
    public static final String ERROR_FILE_STORAGE = "File storage error";
    public static final String ERROR_EMAIL_SENDING = "Email sending failed";

    // Success Messages
    public static final String SUCCESS_CREATED = "Created successfully";
    public static final String SUCCESS_UPDATED = "Updated successfully";
    public static final String SUCCESS_DELETED = "Deleted successfully";
    public static final String SUCCESS_UPLOADED = "Uploaded successfully";
    public static final String SUCCESS_SENT = "Sent successfully";

    // Default Values
    public static final String DEFAULT_PASSWORD = "default@123";
    public static final int DEFAULT_CREDIT_HOURS = 3;
    public static final int DEFAULT_CLASS_SIZE = 60;
    public static final String DEFAULT_ROOM_NUMBER = "TBD";
}