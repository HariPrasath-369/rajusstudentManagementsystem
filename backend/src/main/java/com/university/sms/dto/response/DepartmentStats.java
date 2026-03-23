package com.university.sms.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class DepartmentStats {
    private double averageMarks;
    private double averageAttendance;
    private long studentCount;
    private long teacherCount;
    private double passRate;
}
