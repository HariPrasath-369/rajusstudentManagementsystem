package com.university.sms.dto.request;

import com.university.sms.model.enums.DayOfWeek;
import lombok.Data;
import java.time.LocalTime;

@Data
public class TimetableRequest {
    private Long classId;
    private Long subjectId;
    private Long teacherId;
    private DayOfWeek dayOfWeek;
    private LocalTime startTime;
    private LocalTime endTime;
    private String roomNumber;
}