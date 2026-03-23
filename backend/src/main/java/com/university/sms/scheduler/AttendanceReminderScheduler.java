package com.university.sms.scheduler;

import com.university.sms.model.Attendance;
import com.university.sms.model.Class;
import com.university.sms.model.Teacher;
import com.university.sms.repository.AttendanceRepository;
import com.university.sms.repository.ClassRepository;
import com.university.sms.repository.TeacherRepository;
import com.university.sms.service.EmailService;
import com.university.sms.service.NotificationService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.List;

@Component
public class AttendanceReminderScheduler {

    private static final Logger logger = LoggerFactory.getLogger(AttendanceReminderScheduler.class);

    @Autowired
    private AttendanceRepository attendanceRepository;

    @Autowired
    private ClassRepository classRepository;

    @Autowired
    private TeacherRepository teacherRepository;

    @Autowired
    private NotificationService notificationService;

    @Autowired
    private EmailService emailService;

    // Send reminders to teachers who haven't marked attendance at 2:00 PM
    @Scheduled(cron = "0 0 14 * * MON-FRI")
    public void sendMissingAttendanceReminders() {
        logger.info("Checking for teachers who haven't marked today's attendance");

        LocalDate today = LocalDate.now();
        List<Class> classes = classRepository.findAll();

        for (Class classEntity : classes) {
            List<Attendance> attendance = attendanceRepository
                    .findByClassEntityAndDate(classEntity, today);

            if (attendance.isEmpty()) {
                // No attendance marked for this class
                Teacher advisor = classEntity.getAdvisor();
                if (advisor != null) {
                    sendReminderToTeacher(advisor, classEntity);
                }
            }
        }
    }

    // Send reminders at 5:00 PM for teachers to submit attendance
    @Scheduled(cron = "0 0 17 * * MON-FRI")
    public void sendSubmissionReminders() {
        logger.info("Sending attendance submission reminders");

        LocalDate today = LocalDate.now();
        List<Class> classes = classRepository.findAll();

        for (Class classEntity : classes) {
            List<Attendance> attendance = attendanceRepository
                    .findByClassEntityAndDate(classEntity, today);

            if (!attendance.isEmpty() && !attendance.get(0).getIsSubmitted()) {
                Teacher advisor = classEntity.getAdvisor();
                if (advisor != null) {
                    sendSubmissionReminderToTeacher(advisor, classEntity);
                }
            }
        }
    }

    // Check and send weekly attendance summary to HODs every Friday at 3:00 PM
    @Scheduled(cron = "0 0 15 * * FRI")
    public void sendWeeklyAttendanceSummaryToHODs() {
        logger.info("Sending weekly attendance summary to HODs");

        LocalDate startDate = LocalDate.now().minusDays(7);
        LocalDate endDate = LocalDate.now();

        List<Teacher> teachers = teacherRepository.findAllByIsClassAdvisorTrue();
        
        for (Teacher teacher : teachers) {
            try {
                List<Class> advisorClasses = classRepository.findByAdvisorId(teacher.getId());
                
                for (Class classEntity : advisorClasses) {
                    List<Object[]> stats = attendanceRepository
                            .getAttendancePercentageByClassAndDateRange(
                                    classEntity.getId(), startDate, endDate);
                    
                    if (!stats.isEmpty()) {
                        double avgAttendance = 0;
                        for (Object[] stat : stats) {
                            Long total = (Long) stat[1];
                            Long present = (Long) stat[2];
                            avgAttendance += total > 0 ? (present * 100.0 / total) : 0;
                        }
                        avgAttendance = avgAttendance / stats.size();
                        
                        notificationService.sendNotification(
                                com.university.sms.dto.request.NotificationRequest.builder()
                                        .userId(teacher.getUser().getId())
                                        .title("Weekly Attendance Summary")
                                        .message(String.format("Class %s: Average attendance for this week is %.2f%%", 
                                                classEntity.getClassName(), avgAttendance))
                                        .type("SUMMARY")
                                        .actionUrl("/attendance/statistics")
                                        .build(),
                                null);
                    }
                }
            } catch (Exception e) {
                logger.error("Failed to send weekly summary to teacher {}: {}", 
                            teacher.getUser().getEmail(), e.getMessage());
            }
        }
    }

    // Auto-submit attendance at 8:00 PM if not submitted
    @Scheduled(cron = "0 0 20 * * MON-FRI")
    public void autoSubmitAttendance() {
        logger.info("Auto-submitting pending attendance");

        LocalDate today = LocalDate.now();
        List<Class> classes = classRepository.findAll();

        for (Class classEntity : classes) {
            List<Attendance> attendance = attendanceRepository
                    .findDraftAttendanceByClassAndDate(classEntity.getId(), today);
            
            if (!attendance.isEmpty()) {
                try {
                    attendanceRepository.submitAttendanceForClassAndDate(
                            classEntity.getId(), today, 1L); // System user ID
                    
                    logger.info("Auto-submitted attendance for class: {}", classEntity.getClassName());
                } catch (Exception e) {
                    logger.error("Failed to auto-submit attendance for class {}: {}", 
                                classEntity.getClassName(), e.getMessage());
                }
            }
        }
    }

    // Send parent notification for students with low attendance at 7:00 PM daily
    @Scheduled(cron = "0 0 19 * * MON-FRI")
    public void sendParentNotifications() {
        logger.info("Sending parent notifications for low attendance");

        LocalDate startDate = LocalDate.now().minusMonths(1);
        LocalDate endDate = LocalDate.now();

        List<Class> classes = classRepository.findAll();
        
        for (Class classEntity : classes) {
            List<Object[]> stats = attendanceRepository
                    .getAttendancePercentageByClassAndDateRange(
                            classEntity.getId(), startDate, endDate);
            
            for (Object[] stat : stats) {
                com.university.sms.model.Student student = (com.university.sms.model.Student) stat[0];
                Long total = (Long) stat[1];
                Long present = (Long) stat[2];
                double percentage = total > 0 ? (present * 100.0 / total) : 0;
                
                if (percentage < 75 && student.getUser().getPhoneNumber() != null) {
                    // Send SMS or email to parents
                    // In a real implementation, you would send SMS to parent's phone
                    logger.info("Low attendance alert for student: {} - {:.2f}%", 
                               student.getUser().getName(), percentage);
                    
                    emailService.sendAttendanceAlert(
                            student.getUser().getEmail(),
                            student.getUser().getName(),
                            (int) percentage
                    );
                }
            }
        }
    }

    private void sendReminderToTeacher(Teacher teacher, Class classEntity) {
        try {
            notificationService.sendNotification(
                    com.university.sms.dto.request.NotificationRequest.builder()
                            .userId(teacher.getUser().getId())
                            .title("Attendance Reminder")
                            .message(String.format("Please mark attendance for class %s (Date: %s)", 
                                    classEntity.getClassName(), LocalDate.now()))
                            .type("REMINDER")
                            .actionUrl("/attendance/mark")
                            .build(),
                    null);

            emailService.sendNotificationEmail(
                    teacher.getUser().getEmail(),
                    "Attendance Reminder",
                    String.format("Dear %s,\n\nPlease mark attendance for class %s for today (%s).\n\nThank you.",
                            teacher.getUser().getName(), classEntity.getClassName(), LocalDate.now())
            );
        } catch (Exception e) {
            logger.error("Failed to send reminder to teacher {}: {}", 
                        teacher.getUser().getEmail(), e.getMessage());
        }
    }

    private void sendSubmissionReminderToTeacher(Teacher teacher, Class classEntity) {
        try {
            notificationService.sendNotification(
                    com.university.sms.dto.request.NotificationRequest.builder()
                            .userId(teacher.getUser().getId())
                            .title("Attendance Submission Reminder")
                            .message(String.format("Please submit attendance for class %s (Date: %s). Attendance cannot be modified after submission.", 
                                    classEntity.getClassName(), LocalDate.now()))
                            .type("REMINDER")
                            .actionUrl("/attendance/submit")
                            .build(),
                    null);
        } catch (Exception e) {
            logger.error("Failed to send submission reminder to teacher {}: {}", 
                        teacher.getUser().getEmail(), e.getMessage());
        }
    }
}