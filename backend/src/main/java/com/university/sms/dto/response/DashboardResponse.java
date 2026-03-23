package com.university.sms.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DashboardResponse {
    @Builder.Default
    private Map<String, Object> stats = new HashMap<>();
    @Builder.Default
    private Map<String, Object> charts = new HashMap<>();
    @Builder.Default
    private List<Map<String, Object>> recentActivities = new ArrayList<>();

    private long totalStudents;
    private long totalTeachers;
    private long totalDepartments;
    private double averageAttendance;
    @Builder.Default
    private Map<String, Long> userDistribution = new HashMap<>();
    @Builder.Default
    private Map<String, Double> performanceMetrics = new HashMap<>();

    // Additional fields for various dashboards
    @Builder.Default
    private List<Map<String, Object>> topPerformers = new ArrayList<>();
    @Builder.Default
    private List<Map<String, Object>> departmentStats = new ArrayList<>();
    @Builder.Default
    private List<Map<String, Object>> alerts = new ArrayList<>();
    @Builder.Default
    private List<Map<String, Object>> notifications = new ArrayList<>();
    @Builder.Default
    private List<Map<String, Object>> upcomingEvents = new ArrayList<>();
    @Builder.Default
    private List<Map<String, Object>> teacherWorkload = new ArrayList<>();
    @Builder.Default
    private List<Map<String, Object>> assignedClasses = new ArrayList<>();
    @Builder.Default
    private List<Map<String, Object>> upcomingClasses = new ArrayList<>();
    @Builder.Default
    private List<Map<String, Object>> pendingTasks = new ArrayList<>();
}