package com.university.sms.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class TeacherRankingResponse {
    private Long teacherId;
    private String teacherName;
    private String department;
    private double averageMarks;
    private double studentFeedback;
    private double attendanceRate;
    private double overallScore;
}
