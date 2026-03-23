package com.university.sms.dto.response;

import com.university.sms.model.enums.LeaveStatus;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
public class LeaveResponse {
    private Long id;
    private Long studentId;
    private String studentName;
    private String rollNumber;
    private LocalDate startDate;
    private LocalDate endDate;
    private String reason;
    private LeaveStatus status;
    private LocalDateTime appliedAt;
    private LocalDateTime approvedAt;
    private String rejectionReason;
    private String documentUrl;
}