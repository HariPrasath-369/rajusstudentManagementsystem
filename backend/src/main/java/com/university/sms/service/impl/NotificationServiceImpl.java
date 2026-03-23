package com.university.sms.service.impl;

import com.university.sms.dto.request.NotificationRequest;
import com.university.sms.dto.response.NotificationResponse;
import com.university.sms.exception.ResourceNotFoundException;
import com.university.sms.model.enums.NotificationType;
import com.university.sms.model.Notification;
import com.university.sms.model.User;
import com.university.sms.repository.NotificationRepository;
import com.university.sms.repository.UserRepository;
import com.university.sms.service.EmailService;
import com.university.sms.service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class NotificationServiceImpl implements NotificationService {

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private EmailService emailService;

    @Override
    @Transactional
    public NotificationResponse sendNotification(NotificationRequest request, Long senderId) {
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Notification notification = new Notification();
        notification.setUser(user);
        notification.setTitle(request.getTitle());
        notification.setMessage(request.getMessage());
        notification.setType(request.getType() != null ? NotificationType.valueOf(request.getType()) : NotificationType.INFO);
        notification.setIsRead(false);
        notification.setCreatedAt(LocalDateTime.now());
        notification.setActionUrl(request.getActionUrl());

        notification = notificationRepository.save(notification);

        // Send email notification
        emailService.sendNotificationEmail(user.getEmail(), request.getTitle(), request.getMessage());

        return mapToResponse(notification);
    }

    @Override
    @Transactional
    public void broadcastNotification(NotificationRequest request, Long senderId) {
        List<User> users = userRepository.findAllByIsActiveTrue();
        
        for (User user : users) {
            Notification notification = new Notification();
            notification.setUser(user);
            notification.setTitle(request.getTitle());
            notification.setMessage(request.getMessage());
            notification.setType(request.getType() != null ? NotificationType.valueOf(request.getType()) : NotificationType.INFO);
            notification.setIsRead(false);
            notification.setCreatedAt(LocalDateTime.now());
            notification.setActionUrl(request.getActionUrl());
            
            notificationRepository.save(notification);
            
            // Send email notification
            emailService.sendNotificationEmail(user.getEmail(), request.getTitle(), request.getMessage());
        }
    }

    @Override
    public Page<NotificationResponse> getUserNotifications(Long userId, Pageable pageable) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
                
        return notificationRepository.findByUserOrderByCreatedAtDesc(user, pageable)
                .map(this::mapToResponse);
    }

    @Override
    public List<NotificationResponse> getUnreadNotifications(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
                
        return notificationRepository.findByUserAndIsReadFalseOrderByCreatedAtDesc(user)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public long getUnreadCount(Long userId) {
        return notificationRepository.countUnreadByUserId(userId);
    }

    @Override
    @Transactional
    public void markAsRead(Long notificationId, Long userId) {
        notificationRepository.markAsRead(userId, notificationId);
    }

    @Override
    @Transactional
    public void markAllAsRead(Long userId) {
        notificationRepository.markAllAsRead(userId);
    }

    @Override
    @Transactional
    public void deleteNotification(Long notificationId, Long userId) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new ResourceNotFoundException("Notification not found"));
        
        if (!notification.getUser().getId().equals(userId)) {
            throw new ResourceNotFoundException("Notification not found");
        }
        
        notificationRepository.delete(notification);
    }

    @Override
    public void sendAttendanceReminders() {
        // Implementation for sending attendance reminders to teachers
        List<User> teachers = userRepository.findByRole(com.university.sms.model.enums.Role.ROLE_TEACHER);
        
        for (User teacher : teachers) {
            Notification notification = new Notification();
            notification.setUser(teacher);
            notification.setTitle("Attendance Reminder");
            notification.setMessage("Please mark today's attendance before the end of the day.");
            notification.setType(com.university.sms.model.enums.NotificationType.REMINDER);
            notification.setIsRead(false);
            notification.setCreatedAt(LocalDateTime.now());
            
            notificationRepository.save(notification);
            emailService.sendNotificationEmail(teacher.getEmail(), "Attendance Reminder", 
                    "Please mark today's attendance before the end of the day.");
        }
    }

    @Override
    public void sendWeeklyReports() {
        // Implementation for sending weekly reports
        List<User> hods = userRepository.findByRole(com.university.sms.model.enums.Role.ROLE_HOD);
        
        for (User hod : hods) {
            Notification notification = new Notification();
            notification.setUser(hod);
            notification.setTitle("Weekly Report");
            notification.setMessage("Weekly performance report is ready. Please check the dashboard.");
            notification.setType(com.university.sms.model.enums.NotificationType.REPORT);
            notification.setIsRead(false);
            notification.setCreatedAt(LocalDateTime.now());
            
            notificationRepository.save(notification);
        }
    }

    @Override
    public void sendMonthlyAttendanceSummary() {
        // Implementation for sending monthly attendance summary
        List<User> students = userRepository.findByRole(com.university.sms.model.enums.Role.ROLE_STUDENT);
        
        for (User student : students) {
            Notification notification = new Notification();
            notification.setUser(student);
            notification.setTitle("Monthly Attendance Summary");
            notification.setMessage("Your monthly attendance summary is available. Please check your dashboard.");
            notification.setType(com.university.sms.model.enums.NotificationType.SUMMARY);
            notification.setIsRead(false);
            notification.setCreatedAt(LocalDateTime.now());
            
            notificationRepository.save(notification);
            emailService.sendNotificationEmail(student.getEmail(), "Monthly Attendance Summary", 
                    "Your monthly attendance summary is available. Please check your dashboard.");
        }
    }

    private NotificationResponse mapToResponse(Notification notification) {
        return NotificationResponse.builder()
                .id(notification.getId())
                .title(notification.getTitle())
                .message(notification.getMessage())
                .type(notification.getType() != null ? notification.getType().name() : null)
                .isRead(notification.getIsRead())
                .createdAt(notification.getCreatedAt())
                .actionUrl(notification.getActionUrl())
                .build();
    }
}