package com.university.sms.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ClassPerformanceResponse {
    private Long classId;
    private String className;
    private int studentCount;
    private double averageMarks;
    private double averageAttendance;
    private int toppersCount;
    private int failuresCount;
    private double passPercentage;
}
