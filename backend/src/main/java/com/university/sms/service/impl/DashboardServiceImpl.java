package com.university.sms.service.impl;

import com.university.sms.dto.response.DashboardResponse;
import com.university.sms.repository.*;
import com.university.sms.service.DashboardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.university.sms.model.Hod;
import com.university.sms.model.Teacher;
import org.springframework.transaction.annotation.Transactional;
import java.util.*;
import java.util.stream.Collectors;

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

    @Autowired
    private HodRepository hodRepository;

    @Autowired
    private ClassRepository classRepository;

    @Autowired
    private SubjectRepository subjectRepository;

    @Autowired
    private TimetableRepository timetableRepository;

    @Autowired
    private LeaveRepository leaveRepository;

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
                    Map.<String, Object>of("id", 1, "message", "Server maintenance scheduled", "type", "Maintenance", "priority", "medium")
                ))
                .topPerformers(List.of(
                    Map.<String, Object>of("id", 1, "name", "Dr. Smith", "dept", "CSE", "rating", 4.8, "students", 150)
                ))
                .recentActivities(new ArrayList<>())
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public DashboardResponse getHodDashboard(Long userId) {
        try {
            Hod hod = hodRepository.findByUserId(userId)
                    .orElseThrow(() -> new RuntimeException("HOD not found for user ID: " + userId));
            
            if (hod.getDepartment() == null) {
                throw new RuntimeException("HOD has no department assigned");
            }
            
            Long deptId = hod.getDepartment().getId();

            long teacherCount = teacherRepository.countActiveByDepartmentId(deptId);
            long studentCount = studentRepository.countByDepartment(deptId);
            long classCount = classRepository.findActiveClassesByDepartment(deptId).size();
            double avgAttendance = calculateDepartmentAttendance(deptId);

            Map<String, Object> stats = new HashMap<>();
            stats.put("totalTeachers", teacherCount);
            stats.put("totalClasses", classCount);
            stats.put("totalStudents", studentCount);
            stats.put("averageAttendance", avgAttendance);

            Map<String, Object> charts = new HashMap<>();
            charts.put("attendanceTrend", List.of(
                Map.<String, Object>of("month", "Mar", "attendance", avgAttendance)
            ));

            return DashboardResponse.builder()
                    .stats(stats)
                    .charts(charts)
                    .build();
        } catch (Exception e) {
            // Return empty/default dashboard instead of 500
            return DashboardResponse.builder()
                    .stats(Map.of(
                        "totalTeachers", 0,
                        "totalClasses", 0,
                        "totalStudents", 0,
                        "averageAttendance", 0.0
                    ))
                    .charts(Map.of())
                    .build();
        }
    }

    @Override
    @Transactional(readOnly = true)
    public DashboardResponse getTeacherDashboard(Long userId) {
        try {
            Teacher teacher = teacherRepository.findByUserId(userId)
                    .orElseThrow(() -> new RuntimeException("Teacher not found"));
            
            List<com.university.sms.model.Class> assignedClasses = classRepository.findByAdvisorId(teacher.getId());
            
            // Get today's classes from timetable
            java.time.DayOfWeek dayOfWeek = java.util.Calendar.getInstance().toInstant().atZone(java.time.ZoneId.systemDefault()).toLocalDate().getDayOfWeek();
            com.university.sms.model.enums.DayOfWeek appDay = com.university.sms.model.enums.DayOfWeek.valueOf(dayOfWeek.name());
            long todayClassesCount = timetableRepository.countClassesByTeacherAndDay(teacher.getId(), appDay);

            Map<String, Object> stats = new HashMap<>();
            stats.put("totalClasses", assignedClasses.size());
            stats.put("totalStudents", assignedClasses.stream().mapToLong(c -> classRepository.countActiveStudentsInClass(c.getId())).sum());
            stats.put("todayClasses", todayClassesCount);
            stats.put("pendingAttendance", 0); // Logic for pending attendance could be more complex
            stats.put("pendingMarks", 0);
            stats.put("averageAttendance", calculateTeacherAttendance(teacher.getId()));
            stats.put("pendingLeaves", leaveRepository.countPendingByAdvisorId(teacher.getId()));

            return DashboardResponse.builder()
                    .stats(stats)
                    .assignedClasses(assignedClasses.stream().map(c -> {
                        Map<String, Object> classMap = new HashMap<>();
                        classMap.put("id", c.getId());
                        classMap.put("name", c.getClassName() != null ? c.getClassName() : "Unknown");
                        classMap.put("students", classRepository.countActiveStudentsInClass(c.getId()));
                        classMap.put("subject", "Class Advisor");
                        classMap.put("room", "N/A");
                        classMap.put("schedule", "Regular");
                        return classMap;
                    }).collect(Collectors.toList()))
                    .charts(Map.of(
                        "attendanceTrend", List.of(Map.of("month", "Mar", "attendance", stats.getOrDefault("averageAttendance", 0.0))),
                        "performance", List.of()
                    ))
                    .upcomingClasses(new ArrayList<>())
                    .recentActivities(new ArrayList<>())
                    .pendingTasks(new ArrayList<>())
                    .build();
        } catch (Exception e) {
            e.printStackTrace(); // Log the error
            Map<String, Object> emptyStats = new HashMap<>();
            emptyStats.put("totalClasses", 0);
            emptyStats.put("totalStudents", 0);
            emptyStats.put("todayClasses", 0);
            emptyStats.put("pendingAttendance", 0);
            emptyStats.put("pendingMarks", 0);
            emptyStats.put("averageAttendance", 0.0);
            emptyStats.put("pendingLeaves", 0);

            return DashboardResponse.builder()
                    .stats(emptyStats)
                    .assignedClasses(new ArrayList<>())
                    .charts(Map.of())
                    .build();
        }
    }

    @Override
    public DashboardResponse getDashboardByRole(com.university.sms.security.UserPrincipal currentUser) {
        String role = currentUser.getAuthorities().iterator().next().getAuthority();
        switch (role) {
            case "ROLE_PRINCIPAL": return getPrincipalDashboard(currentUser.getId());
            case "ROLE_HOD": return getHodDashboard(currentUser.getId());
            case "ROLE_TEACHER":
            case "ROLE_CA": return getTeacherDashboard(currentUser.getId());
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

    private double calculateDepartmentAttendance(Long deptId) {
        try {
            return Optional.ofNullable(attendanceRepository.getAverageAttendanceByDepartment(deptId)).orElse(0.0);
        } catch (Exception e) {
            return 0.0;
        }
    }

    private double calculateTeacherAttendance(Long teacherId) {
        try {
            return Optional.ofNullable(attendanceRepository.getAverageAttendanceByTeacher(teacherId)).orElse(0.0);
        } catch (Exception e) {
            return 0.0;
        }
    }
}
