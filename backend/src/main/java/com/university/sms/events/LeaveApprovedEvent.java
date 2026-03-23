package com.university.sms.events;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class LeaveApprovedEvent {
    private Long leaveId;
    private Long studentId;
    private String studentName;
    private String studentEmail;
    private java.time.LocalDate startDate;
    private java.time.LocalDate endDate;
    private int durationDays;
    private String reason;
    private String status;
    private Long approverId;
}