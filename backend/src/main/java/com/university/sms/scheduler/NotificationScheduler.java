package com.university.sms.scheduler;

import com.university.sms.model.Student;
import com.university.sms.model.Teacher;
import com.university.sms.model.User;
import com.university.sms.model.enums.Role;
import com.university.sms.repository.AttendanceRepository;
import com.university.sms.repository.StudentRepository;
import com.university.sms.repository.TeacherRepository;
import com.university.sms.repository.UserRepository;
import com.university.sms.service.EmailService;
import com.university.sms.service.NotificationService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Component
public class NotificationScheduler {

    private static final Logger logger = LoggerFactory.getLogger(NotificationScheduler.class);

    @Autowired
    private NotificationService notificationService;

    @Autowired
    private EmailService emailService;

    @Autowired
    private AttendanceRepository attendanceRepository;

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private TeacherRepository teacherRepository;

    @Autowired
    private UserRepository userRepository;

    // Send daily attendance reminders to teachers at 9:00 AM
    @Scheduled(cron = "0 0 9 * * MON-FRI")
    public void sendDailyAttendanceReminders() {
        logger.info("Sending daily attendance reminders to teachers");

        List<Teacher> teachers = teacherRepository.findAll();
        for (Teacher teacher : teachers) {
            try {
                notificationService.sendNotification(
                        com.university.sms.dto.request.NotificationRequest.builder()
                                .userId(teacher.getUser().getId())
                                .title("Daily Attendance Reminder")
                                .message("Please mark today's attendance for your classes before the end of the day.")
                                .type("REMINDER")
                                .actionUrl("/attendance/mark")
                                .build(),
                        null);

                emailService.sendNotificationEmail(
                        teacher.getUser().getEmail(),
                        "Daily Attendance Reminder",
                        "Please mark today's attendance for your classes before the end of the day."
                );
            } catch (Exception e) {
                logger.error("Failed to send attendance reminder to teacher {}: {}", 
                            teacher.getUser().getEmail(), e.getMessage());
            }
        }
    }

    // Send low attendance alerts at 6:00 PM daily
    @Scheduled(cron = "0 0 18 * * MON-FRI")
    public void sendLowAttendanceAlerts() {
        logger.info("Checking and sending low attendance alerts");

        LocalDate startDate = LocalDate.now().minusMonths(1);
        LocalDate endDate = LocalDate.now();

        List<Student> students = studentRepository.findAll();
        for (Student student : students) {
            try {
                List<Object[]> attendanceStats = attendanceRepository
                        .getAttendancePercentageByClassAndDateRange(
                                student.getStudentClass().getId(), startDate, endDate);

                for (Object[] stat : attendanceStats) {
                    Student statStudent = (Student) stat[0];
                    if (statStudent.getId().equals(student.getId())) {
                        Long total = (Long) stat[1];
                        Long present = (Long) stat[2];
                        double percentage = total > 0 ? (present * 100.0 / total) : 0;

                        if (percentage < 75) {
                            notificationService.sendNotification(
                                    com.university.sms.dto.request.NotificationRequest.builder()
                                            .userId(student.getUser().getId())
                                            .title("Low Attendance Alert")
                                            .message(String.format("Your attendance is below 75%%. Current: %.2f%%. Please improve your attendance.", percentage))
                                            .type("ATTENDANCE")
                                            .actionUrl("/attendance/view")
                                            .build(),
                                    null);

                            emailService.sendAttendanceAlert(
                                    student.getUser().getEmail(),
                                    student.getUser().getName(),
                                    (int) percentage
                            );
                        }
                        break;
                    }
                }
            } catch (Exception e) {
                logger.error("Failed to send low attendance alert to student {}: {}", 
                            student.getUser().getEmail(), e.getMessage());
            }
        }
    }

    // Send weekly reports to HODs and Principal every Monday at 8:00 AM
    @Scheduled(cron = "0 0 8 * * MON")
    public void sendWeeklyReports() {
        logger.info("Sending weekly reports to HODs and Principal");

        // Send to HODs
        List<User> hods = userRepository.findByRole(Role.ROLE_HOD);
        for (User hod : hods) {
            try {
                notificationService.sendNotification(
                        com.university.sms.dto.request.NotificationRequest.builder()
                                .userId(hod.getId())
                                .title("Weekly Performance Report")
                                .message("Your weekly department performance report is ready. Please review it on the dashboard.")
                                .type("REPORT")
                                .actionUrl("/dashboard/hod")
                                .build(),
                        null);

                emailService.sendNotificationEmail(
                        hod.getEmail(),
                        "Weekly Department Performance Report",
                        "Your weekly department performance report is ready. Please login to view the details."
                );
            } catch (Exception e) {
                logger.error("Failed to send weekly report to HOD {}: {}", hod.getEmail(), e.getMessage());
            }
        }

        // Send to Principal
        List<User> principals = userRepository.findByRole(Role.ROLE_PRINCIPAL);
        for (User principal : principals) {
            try {
                notificationService.sendNotification(
                        com.university.sms.dto.request.NotificationRequest.builder()
                                .userId(principal.getId())
                                .title("Weekly Institution Report")
                                .message("Weekly institution performance report is ready. Please review it on the dashboard.")
                                .type("REPORT")
                                .actionUrl("/dashboard/principal")
                                .build(),
                        null);

                emailService.sendNotificationEmail(
                        principal.getEmail(),
                        "Weekly Institution Performance Report",
                        "Weekly institution performance report is ready. Please login to view the details."
                );
            } catch (Exception e) {
                logger.error("Failed to send weekly report to Principal {}: {}", principal.getEmail(), e.getMessage());
            }
        }
    }

    // Send monthly attendance summary on the 1st of each month at 7:00 AM
    @Scheduled(cron = "0 0 7 1 * *")
    public void sendMonthlyAttendanceSummary() {
        logger.info("Sending monthly attendance summary to students");

        LocalDate lastMonth = LocalDate.now().minusMonths(1);
        LocalDate startDate = lastMonth.withDayOfMonth(1);
        LocalDate endDate = lastMonth.withDayOfMonth(lastMonth.lengthOfMonth());

        DateTimeFormatter monthFormatter = DateTimeFormatter.ofPattern("MMMM yyyy");
        String monthYear = lastMonth.format(monthFormatter);

        List<Student> students = studentRepository.findAll();
        for (Student student : students) {
            try {
                List<Object[]> attendanceStats = attendanceRepository
                        .getAttendancePercentageByClassAndDateRange(
                                student.getStudentClass().getId(), startDate, endDate);

                for (Object[] stat : attendanceStats) {
                    Student statStudent = (Student) stat[0];
                    if (statStudent.getId().equals(student.getId())) {
                        Long total = (Long) stat[1];
                        Long present = (Long) stat[2];
                        double percentage = total > 0 ? (present * 100.0 / total) : 0;

                        notificationService.sendNotification(
                                com.university.sms.dto.request.NotificationRequest.builder()
                                        .userId(student.getUser().getId())
                                        .title("Monthly Attendance Summary - " + monthYear)
                                        .message(String.format("Your attendance for %s: %.2f%% (Present: %d/%d days)", 
                                                monthYear, percentage, present, total))
                                        .type("SUMMARY")
                                        .actionUrl("/attendance/history")
                                        .build(),
                                null);

                        emailService.sendNotificationEmail(
                                student.getUser().getEmail(),
                                "Monthly Attendance Summary - " + monthYear,
                                String.format("Dear %s,\n\nYour attendance for %s is %.2f%% (Present: %d out of %d days).\n\nThank you.",
                                        student.getUser().getName(), monthYear, percentage, present, total)
                        );
                        break;
                    }
                }
            } catch (Exception e) {
                logger.error("Failed to send monthly summary to student {}: {}", 
                            student.getUser().getEmail(), e.getMessage());
            }
        }
    }

    // Send upcoming exam reminders 1 week before exams (daily at 10:00 AM)
    @Scheduled(cron = "0 0 10 * * *")
    public void sendExamReminders() {
        logger.info("Checking for upcoming exams and sending reminders");
        
        LocalDate today = LocalDate.now();
        LocalDate nextWeek = today.plusDays(7);
        
        // Logic to get upcoming exams from exam repository would go here
        // For now, we'll implement a placeholder
        try {
            // This would be replaced with actual exam data
            List<Object> upcomingExams = getUpcomingExams(nextWeek);
            
            for (Object exam : upcomingExams) {
                // Send notifications to students
                sendExamReminderToStudents(exam);
            }
        } catch (Exception e) {
            logger.error("Failed to send exam reminders: {}", e.getMessage());
        }
    }

    // Send birthday wishes at 9:00 AM daily
    @Scheduled(cron = "0 0 9 * * *")
    public void sendBirthdayWishes() {
        logger.info("Sending birthday wishes");
        
        LocalDate today = LocalDate.now();
        
        List<Student> students = studentRepository.findAll();
        for (Student student : students) {
            if (student.getDateOfBirth() != null && 
                student.getDateOfBirth().getMonth() == today.getMonth() &&
                student.getDateOfBirth().getDayOfMonth() == today.getDayOfMonth()) {
                
                try {
                    notificationService.sendNotification(
                            com.university.sms.dto.request.NotificationRequest.builder()
                                    .userId(student.getUser().getId())
                                    .title("Happy Birthday!")
                                    .message(String.format("Wishing you a very happy birthday, %s! May you have a wonderful day!", 
                                            student.getUser().getName()))
                                    .type("INFO")
                                    .build(),
                            null);
                    
                    emailService.sendNotificationEmail(
                            student.getUser().getEmail(),
                            "Happy Birthday!",
                            String.format("Dear %s,\n\nWishing you a very happy birthday! May you have a wonderful day and a successful year ahead.\n\nBest wishes,\nUniversity Management", 
                                    student.getUser().getName())
                    );
                } catch (Exception e) {
                    logger.error("Failed to send birthday wish to {}: {}", 
                                student.getUser().getEmail(), e.getMessage());
                }
            }
        }
    }

    // Helper methods
    private List<Object> getUpcomingExams(LocalDate nextWeek) {
        // This would query the exam repository
        return java.util.Collections.emptyList();
    }

    private void sendExamReminderToStudents(Object exam) {
        // Implementation would send reminders to students
        // This is a placeholder
    }
}