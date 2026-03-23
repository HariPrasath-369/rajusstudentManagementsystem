package com.university.sms.dto.response;

import com.university.sms.model.enums.MarksType;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class MarksResponse {
    private Long id;
    private Long studentId;
    private String studentName;
    private String rollNumber;
    private Long subjectId;
    private String subjectName;
    private String subjectCode;
    private MarksType marksType;
    private Double marksObtained;
    private Double maxMarks;
    private Double percentage;
    private Integer semester;
    private Boolean isPublished;
    private LocalDateTime publishedAt;
}