package com.university.sms.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class OemBoardEntry {
    private Long studentId;
    private String studentName;
    private String rollNumber;
    private Double assessmentMarks;
    private Double practicalMarks;
    private Double semesterMarks;
    private Double totalMarks;
}
