package com.university.sms.dto.request;

import lombok.Data;
import java.time.LocalDate;
import java.util.Map;

@Data
public class AttendanceRequest {
    private Long classId;
    private LocalDate date;
    private Long subjectId;
    private Map<Long, String> studentAttendance;
}