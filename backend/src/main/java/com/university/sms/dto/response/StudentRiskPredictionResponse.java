package com.university.sms.dto.response;

import lombok.Builder;
import lombok.Data;
import java.util.List;

@Data
@Builder
public class StudentRiskPredictionResponse {
    private Long studentId;
    private String studentName;
    private String rollNumber;
    private String className;
    private double attendancePercentage;
    private double currentMarks;
    private double riskScore;
    private String riskLevel;
    private List<String> recommendations;
}
