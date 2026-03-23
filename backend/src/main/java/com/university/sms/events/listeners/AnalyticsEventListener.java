package com.university.sms.events.listeners;

import com.university.sms.events.AttendanceSubmittedEvent;
import com.university.sms.events.LeaveApprovedEvent;
import com.university.sms.events.MarksPublishedEvent;
import com.university.sms.model.Leave;
import com.university.sms.repository.AttendanceRepository;
import com.university.sms.repository.LeaveRepository;
import com.university.sms.repository.MarksRepository;
import com.university.sms.repository.StudentRepository;
import com.university.sms.service.AIServiceClient;
import com.university.sms.utils.DateUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.event.EventListener;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Component
public class AnalyticsEventListener {

    private static final Logger logger = LoggerFactory.getLogger(AnalyticsEventListener.class);

    @Autowired
    private AttendanceRepository attendanceRepository;

    @Autowired
    private MarksRepository marksRepository;

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private LeaveRepository leaveRepository;

    @Autowired
    private AIServiceClient aiServiceClient;

    @Async
    @EventListener
    public void updateAttendanceAnalytics(AttendanceSubmittedEvent event) {
        logger.info("Updating attendance analytics for class: {}", event.getClassName());

        try {
            // Update student attendance statistics
            updateStudentAttendanceStats(event);

            // Check for attendance trends
            analyzeAttendanceTrends(event);

            // Update risk assessment for students with low attendance
            if (event.getAttendancePercentage() < 75) {
                updateRiskAssessment(event);
            }

        } catch (Exception e) {
            logger.error("Error updating attendance analytics: {}", e.getMessage(), e);
        }
    }

    @Async
    @EventListener
    public void updateMarksAnalytics(MarksPublishedEvent event) {
        logger.info("Updating marks analytics for subject: {}", event.getSubjectName());

        try {
            // Update student performance statistics
            updateStudentPerformanceStats(event);

            // Analyze performance trends
            analyzePerformanceTrends(event);

            // Generate AI-based predictions for at-risk students
            generateRiskPredictions(event);

            // Update department performance metrics
            updateDepartmentMetrics(event);

        } catch (Exception e) {
            logger.error("Error updating marks analytics: {}", e.getMessage(), e);
        }
    }

    @Async
    @EventListener
    public void trackLeaveAnalytics(LeaveApprovedEvent event) {
        logger.info("Tracking leave analytics for student: {}", event.getStudentName());

        try {
            // Update student leave statistics
            updateStudentLeaveStats(event);

            // Check for leave patterns
            analyzeLeavePatterns(event);

            // Alert if student exceeds leave limit
            checkLeaveLimit(event);

        } catch (Exception e) {
            logger.error("Error tracking leave analytics: {}", e.getMessage(), e);
        }
    }

    private void updateStudentAttendanceStats(AttendanceSubmittedEvent event) {
        // Update individual student attendance records
        for (Long studentId : event.getStudentIds()) {
            double attendancePercentage = attendanceRepository.getAttendancePercentage(studentId);
            
            // Store or update attendance statistics (would be saved to database)
            logger.debug("Updated attendance for student {}: {:.2f}%", studentId, attendancePercentage);
        }
    }

    private void analyzeAttendanceTrends(AttendanceSubmittedEvent event) {
        LocalDate thirtyDaysAgo = LocalDate.now().minusDays(30);
        
        for (Long studentId : event.getStudentIds()) {
            List<Object[]> trend = attendanceRepository
                    .getStudentAttendanceTrend(studentId, thirtyDaysAgo, LocalDate.now());
            
            // Analyze trend (improving, declining, stable)
            // This would feed into AI predictions
            logger.debug("Analyzed attendance trend for student: {}", studentId);
        }
    }

    private void updateRiskAssessment(AttendanceSubmittedEvent event) {
        for (Long studentId : event.getStudentIds()) {
            double attendancePercentage = attendanceRepository.getAttendancePercentage(studentId);
            double averageMarks = marksRepository.getAverageMarksByStudent(studentId);
            
            Map<String, Object> studentMetrics = new HashMap<>();
            studentMetrics.put("studentId", studentId);
            studentMetrics.put("attendance", attendancePercentage);
            studentMetrics.put("marks", averageMarks);
            
            // Calculate risk score using AI service
            double riskScore = aiServiceClient.calculateRiskScore(studentMetrics);
            
            if (riskScore > 0.7) {
                logger.warn("High risk student detected: {} - Risk Score: {:.2f}", 
                           studentId, riskScore);
                // Trigger intervention workflow
                triggerInterventionWorkflow(studentId, riskScore);
            }
        }
    }

    private void updateStudentPerformanceStats(MarksPublishedEvent event) {
        for (int i = 0; i < event.getStudentIds().size(); i++) {
            Long studentId = event.getStudentIds().get(i);
            Double marks = event.getMarksList().get(i);
            
            // Calculate student's overall performance
            double overallMarks = marksRepository.getAverageMarksByStudent(studentId);
            
            logger.debug("Updated performance for student {}: Subject: {}, Marks: {:.2f}, Overall: {:.2f}",
                        studentId, event.getSubjectName(), marks, overallMarks);
        }
    }

    private void analyzePerformanceTrends(MarksPublishedEvent event) {
        // Analyze performance across semesters
        for (Long studentId : event.getStudentIds()) {
            Map<Integer, Double> semesterPerformance = new HashMap<>();
            for (int sem = 1; sem <= event.getSemester(); sem++) {
                double avgMarks = marksRepository.getAverageMarksByStudentAndSemester(studentId, sem);
                semesterPerformance.put(sem, avgMarks);
            }
            
            // Detect improving or declining trend
            boolean isImproving = isPerformanceImproving(semesterPerformance);
            logger.debug("Student {} performance trend: {}", studentId, 
                        isImproving ? "Improving" : "Declining");
        }
    }

    private void generateRiskPredictions(MarksPublishedEvent event) {
        Map<String, Object> subjectData = new HashMap<>();
        subjectData.put("subjectId", event.getSubjectId());
        subjectData.put("subjectName", event.getSubjectName());
        subjectData.put("semester", event.getSemester());
        subjectData.put("averageMarks", event.getAverageMarks());
        subjectData.put("passPercentage", event.getPassPercentage());
        subjectData.put("gradeDistribution", event.getGradeDistribution());
        
        // Get AI predictions for student performance
        List<Map<String, Object>> predictions = aiServiceClient
                .predictStudentPerformance(subjectData);
        
        logger.info("Generated risk predictions for subject: {}", event.getSubjectName());
        
        for (Map<String, Object> prediction : predictions) {
            Long studentId = ((Number) prediction.get("studentId")).longValue();
            double riskScore = ((Number) prediction.get("riskScore")).doubleValue();
            
            if (riskScore > 0.6) {
                // Store prediction for dashboard
                storeRiskPrediction(studentId, event.getSubjectId(), riskScore, prediction);
            }
        }
    }

    private void updateDepartmentMetrics(MarksPublishedEvent event) {
        // Calculate department-level metrics
        // This would be used for department comparison dashboards
        logger.debug("Updated department metrics for subject: {}", event.getSubjectName());
    }

    private void updateStudentLeaveStats(LeaveApprovedEvent event) {
        // Update student's leave record
        long totalLeaves = leaveRepository.countApprovedLeavesByStudent(event.getStudentId());
        
        logger.debug("Updated leave stats for student {}: Total leaves: {}", 
                    event.getStudentName(), totalLeaves);
    }

    private void analyzeLeavePatterns(LeaveApprovedEvent event) {
        // Analyze leave patterns (frequency, duration, timing)
        List<Leave> leaves = leaveRepository.findByStudentId(event.getStudentId());
        
        // Check for suspicious patterns (e.g., frequent Monday/Friday leaves)
        boolean hasPattern = detectLeavePattern(leaves);
        
        if (hasPattern) {
            logger.info("Suspicious leave pattern detected for student: {}", event.getStudentName());
            // Trigger alert for counselor
            triggerCounselorAlert(event.getStudentId(), event.getStudentName());
        }
    }

    private void checkLeaveLimit(LeaveApprovedEvent event) {
        // Check if student has exceeded leave limit
        LocalDate semesterStart = DateUtils.getStartOfSemester(
                LocalDate.now().getYear(), 
                DateUtils.getSemesterFromDate(LocalDate.now())
        );
        
        long leavesThisSemester = leaveRepository.countApprovedLeavesForStudentInRange(
                event.getStudentId(), semesterStart, LocalDate.now());
        
        if (leavesThisSemester > 10) {
            logger.warn("Student {} has exceeded leave limit: {} leaves this semester",
                       event.getStudentName(), leavesThisSemester);
            // Notify class advisor
            notifyAdvisorAboutExcessLeaves(event.getStudentId(), leavesThisSemester);
        }
    }

    private boolean isPerformanceImproving(Map<Integer, Double> semesterPerformance) {
        if (semesterPerformance.size() < 2) return false;
        
        double trend = 0;
        int count = 0;
        for (int i = 2; i <= semesterPerformance.size(); i++) {
            if (semesterPerformance.containsKey(i) && semesterPerformance.containsKey(i-1)) {
                trend += semesterPerformance.get(i) - semesterPerformance.get(i-1);
                count++;
            }
        }
        return count > 0 && trend > 0;
    }

    private boolean detectLeavePattern(List<Leave> leaves) {
        // Detect suspicious leave patterns
        // This is a simplified implementation
        return leaves.stream()
                .filter(l -> l.getStartDate().getDayOfWeek().getValue() == 1 || // Monday
                            l.getStartDate().getDayOfWeek().getValue() == 5)   // Friday
                .count() > leaves.size() * 0.5; // More than 50% leaves on Mon/Fri
    }

    private void triggerInterventionWorkflow(Long studentId, double riskScore) {
        // In a real implementation, this would create a task for counselors
        logger.info("Triggering intervention workflow for student: {}, Risk Score: {:.2f}", 
                   studentId, riskScore);
    }

    private void storeRiskPrediction(Long studentId, Long subjectId, double riskScore, 
                                     Map<String, Object> prediction) {
        // In a real implementation, this would save to a predictions table
        logger.debug("Stored risk prediction for student: {}, Subject: {}, Risk: {:.2f}",
                    studentId, subjectId, riskScore);
    }

    private void triggerCounselorAlert(Long studentId, String studentName) {
        // In a real implementation, this would create an alert for counselors
        logger.info("Triggering counselor alert for student: {}", studentName);
    }

    private void notifyAdvisorAboutExcessLeaves(Long studentId, long leaveCount) {
        // In a real implementation, this would send notification to class advisor
        logger.info("Notifying advisor about excess leaves for student: {} ({} leaves)", 
                   studentId, leaveCount);
    }
}