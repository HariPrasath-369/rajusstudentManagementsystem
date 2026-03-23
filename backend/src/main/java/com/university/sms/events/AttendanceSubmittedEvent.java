package com.university.sms.events;

import lombok.Builder;
import lombok.Getter;
import java.util.List;

@Getter
@Builder
public class AttendanceSubmittedEvent {
    private String className;
    private Long classId;
    private Long teacherId;
    private java.time.LocalDate date;
    private int presentCount;
    private int absentCount;
    private int lateCount;
    private int leaveCount;
    private double attendancePercentage;
    private List<Long> studentIds;
}