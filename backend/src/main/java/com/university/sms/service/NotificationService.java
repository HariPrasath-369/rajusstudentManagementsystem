package com.university.sms.service;

import com.university.sms.dto.request.NotificationRequest;
import com.university.sms.dto.response.NotificationResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface NotificationService {
    NotificationResponse sendNotification(NotificationRequest request, Long senderId);
    void broadcastNotification(NotificationRequest request, Long senderId);
    Page<NotificationResponse> getUserNotifications(Long userId, Pageable pageable);
    List<NotificationResponse> getUnreadNotifications(Long userId);
    long getUnreadCount(Long userId);
    void markAsRead(Long notificationId, Long userId);
    void markAllAsRead(Long userId);
    void deleteNotification(Long notificationId, Long userId);
    void sendAttendanceReminders();
    void sendWeeklyReports();
    void sendMonthlyAttendanceSummary();
}