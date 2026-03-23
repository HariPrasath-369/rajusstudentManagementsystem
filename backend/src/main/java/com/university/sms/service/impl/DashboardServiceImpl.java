package com.university.sms.service.impl;

import com.university.sms.dto.response.DashboardResponse;
import com.university.sms.repository.*;
import com.university.sms.service.DashboardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.*;

@Service
public class DashboardServiceImpl implements DashboardService {

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private TeacherRepository teacherRepository;

    @Autowired
    private DepartmentRepository departmentRepository;

    @Autowired
    private AttendanceRepository attendanceRepository;

    @Override
    public DashboardResponse getStudentDashboard(Long userId) {
        Map<String, Object> stats = new HashMap<>();
        stats.put("attendancePercentage", 85.0);
        stats.put("cgpa", 3.8);
        stats.put("totalSubjects", 6);
        stats.put("totalCredits", 24);
        stats.put("completedAssignments", 12);
        stats.put("upcomingExams", 2);

        Map<String, Object> charts = new HashMap<>();
        charts.put("performanceTrend", List.of(
            Map.of("month", "Jan", "marks", 82),
            Map.of("month", "Feb", "marks", 85),
            Map.of("month", "Mar", "marks", 88)
        ));

        return DashboardResponse.builder()
                .stats(stats)
                .charts(charts)
                .upcomingClasses(List.of(
                    Map.of("id", 1, "subject", "Mathematics", "teacher", "Dr. Smith", "time", "09:00 AM", "room", "101", "duration", "1h"),
                    Map.of("id", 2, "subject", "Physics", "teacher", "Prof. Doe", "time", "11:00 AM", "room", "202", "duration", "1h")
                ))
                .notifications(List.of(
                    Map.of("id", 1, "title", "Exam Schedule", "message", "Mid-term exams start next week", "type", "info", "read", false)
                ))
                .recentActivities(List.of(
                    Map.of("id", 1, "type", "marks", "message", "New marks uploaded for Mathematics", "time", "2 hours ago", "marks", 85)
                ))
                .build();
    }

    @Override
    public DashboardResponse getPrincipalDashboard(Long userId) {
        long studentCount = studentRepository.count();
        long teacherCount = teacherRepository.count();
        long deptCount = departmentRepository.count();
        double avgAttendance = calculateOverallAttendance();

        Map<String, Object> stats = new HashMap<>();
        stats.put("totalStudents", studentCount);
        stats.put("totalTeachers", teacherCount);
        stats.put("totalDepartments", deptCount);
        stats.put("averageAttendance", avgAttendance);
        stats.put("overallPassRate", 85.5);

        Map<String, Object> charts = new HashMap<>();
        charts.put("studentEnrollment", List.of(
            Map.of("year", "2021", "students", 400),
            Map.of("year", "2022", "students", 450),
            Map.of("year", "2023", "students", 500)
        ));
        charts.put("departmentPerformance", List.of(
            Map.of("dept", "CSE", "avgMarks", 88),
            Map.of("dept", "ECE", "avgMarks", 82)
        ));

        return DashboardResponse.builder()
                .stats(stats)
                .charts(charts)
                .departmentStats(List.of(
                    Map.of("name", "CSE", "students", 120, "teachers", 15, "passRate", 92),
                    Map.of("name", "ECE", "students", 100, "teachers", 12, "passRate", 85)
                ))
                .alerts(List.of(
                    Map.of("id", 1, "message", "Server maintenance scheduled", "type", "Maintenance", "priority", "medium")
                ))
                .topPerformers(List.of(
                    Map.of("id", 1, "name", "Dr. Smith", "dept", "CSE", "rating", 4.8, "students", 150)
                ))
                .recentActivities(new ArrayList<>())
                .build();
    }

    @Override
    public DashboardResponse getHodDashboard(Long userId) {
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalTeachers", 12);
        stats.put("totalClasses", 8);
        stats.put("totalStudents", 320);
        stats.put("averageAttendance", 88.0);

        Map<String, Object> charts = new HashMap<>();
        charts.put("attendanceTrend", List.of(
            Map.of("month", "Jan", "attendance", 85),
            Map.of("month", "Feb", "attendance", 88)
        ));
        charts.put("subjectPerformance", List.of(
            Map.of("subject", "Java", "avgMarks", 85),
            Map.of("subject", "Python", "avgMarks", 82)
        ));

        return DashboardResponse.builder()
                .stats(stats)
                .charts(charts)
                .teacherWorkload(List.of(
                    Map.of("name", "Dr. Smith", "hours", 18, "classes", 4, "students", 120)
                ))
                .notifications(List.of(
                    Map.of("id", 1, "title", "New Leave Request", "message", "John Doe applied for leave", "read", false)
                ))
                .upcomingEvents(List.of(
                    Map.of("id", 1, "title", "Dept Meeting", "date", new Date(), "type", "meeting")
                ))
                .build();
    }

    @Override
    public DashboardResponse getTeacherDashboard(Long userId) {
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalClasses", 4);
        stats.put("totalStudents", 120);
        stats.put("todayClasses", 2);
        stats.put("pendingAttendance", 1);
        stats.put("pendingMarks", 0);
        stats.put("averageAttendance", 92.0);
        stats.put("pendingLeaves", 0);

        Map<String, Object> charts = new HashMap<>();
        charts.put("attendanceTrend", List.of(
            Map.of("month", "Jan", "attendance", 90),
            Map.of("month", "Feb", "attendance", 92)
        ));
        charts.put("performance", List.of(
            Map.of("subject", "Java", "avgMarks", 85)
        ));

        return DashboardResponse.builder()
                .stats(stats)
                .charts(charts)
                .assignedClasses(List.of(
                    Map.of("id", 1, "name", "CSE-A", "subject", "Java", "students", 60, "schedule", "Mon, Wed", "room", "101")
                ))
                .upcomingClasses(List.of(
                    Map.of("id", 1, "name", "CSE-A", "subject", "Java", "time", "10:00 AM", "room", "101", "duration", "1h")
                ))
                .pendingTasks(List.of(
                    Map.of("id", 1, "title", "Mark Attendance", "type", "attendance", "priority", "high")
                ))
                .recentActivities(new ArrayList<>())
                .build();
    }

    @Override
    public DashboardResponse getDashboardByRole(com.university.sms.security.UserPrincipal currentUser) {
        String role = currentUser.getAuthorities().iterator().next().getAuthority();
        switch (role) {
            case "ROLE_PRINCIPAL": return getPrincipalDashboard(currentUser.getId());
            case "ROLE_HOD": return getHodDashboard(currentUser.getId());
            case "ROLE_TEACHER": return getTeacherDashboard(currentUser.getId());
            case "ROLE_STUDENT": return getStudentDashboard(currentUser.getId());
            default: return new DashboardResponse();
        }
    }

    private double calculateOverallAttendance() {
        try {
            return Optional.ofNullable(attendanceRepository.getAverageAttendanceOverall()).orElse(0.0);
        } catch (Exception e) {
            return 0.0;
        }
    }
}
