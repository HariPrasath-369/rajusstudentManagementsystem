package com.university.sms.service.impl;

import com.university.sms.service.EmailService;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

@Service
public class EmailServiceImpl implements EmailService {

    @Autowired
    private JavaMailSender mailSender;

    @Autowired
    private TemplateEngine templateEngine;

    @Value("${spring.mail.username}")
    private String fromEmail;

    @Override
    @Async
    public void sendOtpEmail(String to, String otp) {
        Context context = new Context();
        context.setVariable("otp", otp);
        context.setVariable("expiryMinutes", 10);
        
        String htmlContent = templateEngine.process("email/otp-email", context);
        sendEmail(to, "OTP for Password Reset", htmlContent);
    }

    @Override
    @Async
    public void sendWelcomeEmail(String to, String name) {
        Context context = new Context();
        context.setVariable("name", name);
        
        String htmlContent = templateEngine.process("email/welcome-email", context);
        sendEmail(to, "Welcome to Student Management System", htmlContent);
    }

    @Override
    @Async
    public void sendAttendanceAlert(String to, String studentName, int attendancePercentage) {
        Context context = new Context();
        context.setVariable("studentName", studentName);
        context.setVariable("attendancePercentage", attendancePercentage);
        
        String htmlContent = templateEngine.process("email/attendance-alert", context);
        sendEmail(to, "Low Attendance Alert", htmlContent);
    }

    @Override
    @Async
    public void sendLeaveApprovalEmail(String to, String studentName, String status) {
        Context context = new Context();
        context.setVariable("studentName", studentName);
        context.setVariable("status", status);
        
        String htmlContent = templateEngine.process("email/leave-approved", context);
        sendEmail(to, "Leave Request " + status, htmlContent);
    }

    @Override
    @Async
    public void sendMarksPublishedEmail(String to, String studentName, String subject) {
        Context context = new Context();
        context.setVariable("studentName", studentName);
        context.setVariable("subject", subject);
        
        String htmlContent = templateEngine.process("email/marks-published", context);
        sendEmail(to, "Marks Published", htmlContent);
    }

    @Override
    @Async
    public void sendPasswordResetEmail(String to, String resetLink) {
        Context context = new Context();
        context.setVariable("resetLink", resetLink);
        
        String htmlContent = templateEngine.process("email/password-reset", context);
        sendEmail(to, "Password Reset Request", htmlContent);
    }

    @Override
    @Async
    public void sendNotificationEmail(String to, String subject, String content) {
        Context context = new Context();
        context.setVariable("content", content);
        context.setVariable("subject", subject);
        
        String htmlContent = templateEngine.process("email/notification", context);
        sendEmail(to, subject, htmlContent);
    }

    private void sendEmail(String to, String subject, String htmlContent) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            helper.setFrom(fromEmail);
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(htmlContent, true);
            mailSender.send(message);
        } catch (MessagingException e) {
            throw new RuntimeException("Failed to send email", e);
        }
    }
}