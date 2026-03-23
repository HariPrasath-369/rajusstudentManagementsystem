package com.university.sms.controller;

import com.university.sms.dto.request.NotificationRequest;
import com.university.sms.dto.response.ApiResponse;
import com.university.sms.dto.response.NotificationResponse;
import com.university.sms.security.CurrentUser;
import com.university.sms.security.UserPrincipal;
import com.university.sms.service.NotificationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
@SecurityRequirement(name = "bearerAuth")
@Tag(name = "Notifications", description = "Notification management APIs")
public class NotificationController {

    @Autowired
    private NotificationService notificationService;

    @PostMapping
    @PreAuthorize("hasAnyRole('PRINCIPAL', 'HOD', 'TEACHER')")
    @Operation(summary = "Send notification")
    public ResponseEntity<NotificationResponse> sendNotification(@Valid @RequestBody NotificationRequest request,
                                                                   @CurrentUser UserPrincipal currentUser) {
        NotificationResponse response = notificationService.sendNotification(request, currentUser.getId());
        return ResponseEntity.ok(response);
    }

    @PostMapping("/broadcast")
    @PreAuthorize("hasAnyRole('PRINCIPAL', 'HOD')")
    @Operation(summary = "Broadcast notification to all users")
    public ResponseEntity<ApiResponse> broadcastNotification(@Valid @RequestBody NotificationRequest request,
                                                              @CurrentUser UserPrincipal currentUser) {
        notificationService.broadcastNotification(request, currentUser.getId());
        return ResponseEntity.ok(new ApiResponse(true, "Notification broadcasted successfully"));
    }

    @GetMapping
    @Operation(summary = "Get user notifications")
    public ResponseEntity<Page<NotificationResponse>> getUserNotifications(@CurrentUser UserPrincipal currentUser,
                                                                            Pageable pageable) {
        Page<NotificationResponse> notifications = notificationService.getUserNotifications(currentUser.getId(), pageable);
        return ResponseEntity.ok(notifications);
    }

    @GetMapping("/unread")
    @Operation(summary = "Get unread notifications")
    public ResponseEntity<List<NotificationResponse>> getUnreadNotifications(@CurrentUser UserPrincipal currentUser) {
        List<NotificationResponse> notifications = notificationService.getUnreadNotifications(currentUser.getId());
        return ResponseEntity.ok(notifications);
    }

    @GetMapping("/count/unread")
    @Operation(summary = "Get unread notification count")
    public ResponseEntity<Long> getUnreadCount(@CurrentUser UserPrincipal currentUser) {
        long count = notificationService.getUnreadCount(currentUser.getId());
        return ResponseEntity.ok(count);
    }

    @PutMapping("/{notificationId}/read")
    @Operation(summary = "Mark notification as read")
    public ResponseEntity<ApiResponse> markAsRead(@PathVariable Long notificationId,
                                                   @CurrentUser UserPrincipal currentUser) {
        notificationService.markAsRead(notificationId, currentUser.getId());
        return ResponseEntity.ok(new ApiResponse(true, "Notification marked as read"));
    }

    @PutMapping("/read-all")
    @Operation(summary = "Mark all notifications as read")
    public ResponseEntity<ApiResponse> markAllAsRead(@CurrentUser UserPrincipal currentUser) {
        notificationService.markAllAsRead(currentUser.getId());
        return ResponseEntity.ok(new ApiResponse(true, "All notifications marked as read"));
    }

    @DeleteMapping("/{notificationId}")
    @Operation(summary = "Delete notification")
    public ResponseEntity<ApiResponse> deleteNotification(@PathVariable Long notificationId,
                                                           @CurrentUser UserPrincipal currentUser) {
        notificationService.deleteNotification(notificationId, currentUser.getId());
        return ResponseEntity.ok(new ApiResponse(true, "Notification deleted successfully"));
    }
}