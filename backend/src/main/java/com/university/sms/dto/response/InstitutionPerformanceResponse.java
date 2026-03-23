package com.university.sms.dto.response;

import lombok.Builder;
import lombok.Data;
import java.util.Map;

@Data
@Builder
public class InstitutionPerformanceResponse {
    private long totalStudents;
    private long totalTeachers;
    private long totalDepartments;
    private double averageAttendance;
    private double averageMarks;
    private Map<String, Long> studentsByYear;
    private Map<String, Double> passPercentageByDepartment;
}
