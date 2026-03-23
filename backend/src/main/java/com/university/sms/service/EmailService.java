package com.university.sms.service;

public interface EmailService {
    void sendOtpEmail(String to, String otp);
    void sendWelcomeEmail(String to, String name);
    void sendAttendanceAlert(String to, String studentName, int attendancePercentage);
    void sendLeaveApprovalEmail(String to, String studentName, String status);
    void sendMarksPublishedEmail(String to, String studentName, String subject);
    void sendPasswordResetEmail(String to, String resetLink);
    void sendNotificationEmail(String to, String subject, String content);
}