package com.university.sms.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class StudentAttendanceStat {
    private Long studentId;
    private String studentName;
    private String rollNumber;
    private Long totalDays;
    private Long presentDays;
    private Double percentage;
}
