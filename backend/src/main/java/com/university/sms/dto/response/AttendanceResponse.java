package com.university.sms.dto.response;

import com.university.sms.model.enums.AttendanceStatus;
import lombok.Builder;
import lombok.Data;
import java.time.LocalDate;

@Data
@Builder
public class AttendanceResponse {
    private Long id;
    private Long studentId;
    private String studentName;
    private String rollNumber;
    private Long classId;
    private String className;
    private LocalDate date;
    private AttendanceStatus status;
    private Boolean isSubmitted;
    private String subjectName;
}