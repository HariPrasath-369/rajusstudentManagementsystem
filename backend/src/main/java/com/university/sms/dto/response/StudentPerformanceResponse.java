package com.university.sms.dto.response;

import lombok.Builder;
import lombok.Data;

import java.util.List;
import java.util.Map;

@Data
@Builder
public class StudentPerformanceResponse {
    private Long studentId;
    private String studentName;
    private String rollNumber;
    private String className;
    private Double overallPercentage;
    private Double attendancePercentage;
    private Map<String, List<Double>> subjectPerformance;
    private List<PerformanceTrend> performanceTrend;
    private String performanceGrade;
    private List<String> recommendations;
}