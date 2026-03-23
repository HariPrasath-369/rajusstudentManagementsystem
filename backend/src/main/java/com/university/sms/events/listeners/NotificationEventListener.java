package com.university.sms.events.listeners;

import com.university.sms.dto.request.NotificationRequest;
import com.university.sms.events.AttendanceSubmittedEvent;
import com.university.sms.events.LeaveApprovedEvent;
import com.university.sms.events.MarksPublishedEvent;
import com.university.sms.model.User;
import com.university.sms.repository.UserRepository;
import com.university.sms.service.EmailService;
import com.university.sms.service.NotificationService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.event.EventListener;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;
import org.springframework.transaction.event.TransactionPhase;
import org.springframework.transaction.event.TransactionalEventListener;

import java.util.List;

@Component
public class NotificationEventListener {

    private static final Logger logger = LoggerFactory.getLogger(NotificationEventListener.class);

    @Autowired
    private NotificationService notificationService;

    @Autowired
    private EmailService emailService;

    @Autowired
    private UserRepository userRepository;

    @Async
    @EventListener
    public void handleAttendanceSubmittedEvent(AttendanceSubmittedEvent event) {
        logger.info("Handling AttendanceSubmittedEvent for class: {}, date: {}", 
                   event.getClassName(), event.getDate());

        try {
            // Notify class advisor
            notificationService.sendNotification(
                    NotificationRequest.builder()
                            .userId(event.getTeacherId())
                            .title("Attendance Submitted")
                            .message(String.format("Attendance for class %s on %s has been submitted. " +
                                    "Present: %d, Absent: %d, Late: %d, Leave: %d. " +
                                    "Overall attendance: %.2f%%",
                                    event.getClassName(), event.getDate(),
                                    event.getPresentCount(), event.getAbsentCount(),
                                    event.getLateCount(), event.getLeaveCount(),
                                    event.getAttendancePercentage()))
                            .type("ATTENDANCE")
                            .actionUrl("/attendance/view/" + event.getClassId() + "/" + event.getDate())
                            .build(),
                    null);

            // Notify HOD
            notifyHodAboutAttendance(event);

            // Send low attendance alerts
            if (event.getAttendancePercentage() < 75) {
                sendLowAttendanceAlerts(event);
            }

        } catch (Exception e) {
            logger.error("Error handling AttendanceSubmittedEvent: {}", e.getMessage(), e);
        }
    }

    @Async
    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    public void handleLeaveApprovedEvent(LeaveApprovedEvent event) {
        logger.info("Handling LeaveApprovedEvent for student: {}, status: {}", 
                   event.getStudentName(), event.getStatus());

        try {
            // Notify student
            notificationService.sendNotification(
                    NotificationRequest.builder()
                            .userId(event.getStudentId())
                            .title("Leave Request " + event.getStatus())
                            .message(String.format("Your leave request from %s to %s has been %s. " +
                                    "Duration: %d days. Reason: %s",
                                    event.getStartDate(), event.getEndDate(),
                                    event.getStatus().toLowerCase(),
                                    event.getDurationDays(), event.getReason()))
                            .type("LEAVE")
                            .actionUrl("/leaves/" + event.getLeaveId())
                            .build(),
                    event.getApproverId());

            // Send email notification
            emailService.sendLeaveApprovalEmail(
                    event.getStudentEmail(),
                    event.getStudentName(),
                    event.getStatus()
            );

            // Notify class advisor if leave is approved
            if ("APPROVED".equals(event.getStatus())) {
                notifyClassAdvisorAboutLeave(event);
            }

        } catch (Exception e) {
            logger.error("Error handling LeaveApprovedEvent: {}", e.getMessage(), e);
        }
    }

    @Async
    @EventListener
    public void handleMarksPublishedEvent(MarksPublishedEvent event) {
        logger.info("Handling MarksPublishedEvent for subject: {}, semester: {}", 
                   event.getSubjectName(), event.getSemester());

        try {
            // Notify all students in the class
            for (Long studentId : event.getStudentIds()) {
                notificationService.sendNotification(
                        NotificationRequest.builder()
                                .userId(studentId)
                                .title("Marks Published")
                                .message(String.format("Marks for %s (Semester %d) have been published. " +
                                        "Class average: %.2f, Your marks can be viewed in the portal.",
                                        event.getSubjectName(), event.getSemester(),
                                        event.getAverageMarks()))
                                .type("MARKS")
                                .actionUrl("/marks/view/" + event.getSubjectId() + "/" + event.getSemester())
                                .build(),
                        event.getTeacherId());

                // Send email notifications
                User student = userRepository.findById(studentId).orElse(null);
                if (student != null) {
                    emailService.sendMarksPublishedEmail(
                            student.getEmail(),
                            student.getName(),
                            event.getSubjectName()
                    );
                }
            }

            // Notify HOD
            notifyHodAboutMarks(event);

            // Log performance metrics
            logMarksPerformanceMetrics(event);

        } catch (Exception e) {
            logger.error("Error handling MarksPublishedEvent: {}", e.getMessage(), e);
        }
    }

    private void notifyHodAboutAttendance(AttendanceSubmittedEvent event) {
        // Find HOD of the department
        // In a real implementation, you would query the HOD for the department
        // This is a placeholder for actual HOD notification logic
        logger.debug("Notifying HOD about attendance submission for class: {}", event.getClassName());
        
        // Example notification to HOD (would be implemented with actual HOD ID)
        // notificationService.sendNotification(...)
    }

    private void sendLowAttendanceAlerts(AttendanceSubmittedEvent event) {
        logger.info("Sending low attendance alerts for class: {}", event.getClassName());
        
        // In a real implementation, you would send alerts to parents/guardians
        // This would involve looking up parent contact information
    }

    private void notifyClassAdvisorAboutLeave(LeaveApprovedEvent event) {
        logger.info("Notifying class advisor about approved leave for student: {}", event.getStudentName());
        
        // In a real implementation, you would find the class advisor and send notification
        // notificationService.sendNotification(...)
    }

    private void notifyHodAboutMarks(MarksPublishedEvent event) {
        logger.info("Notifying HOD about marks publication for subject: {}", event.getSubjectName());
        
        // In a real implementation, you would send notification to HOD
        // notificationService.sendNotification(...)
    }

    private void logMarksPerformanceMetrics(MarksPublishedEvent event) {
        logger.info("Marks Performance Metrics - Subject: {}, Avg: {:.2f}, Highest: {:.2f}, Lowest: {:.2f}, Pass %: {:.2f}",
                   event.getSubjectName(), event.getAverageMarks(), 
                   event.getHighestMarks(), event.getLowestMarks(),
                   event.getPassPercentage());
        
        logger.debug("Grade Distribution for {}: {}", event.getSubjectName(), event.getGradeDistribution());
    }
}