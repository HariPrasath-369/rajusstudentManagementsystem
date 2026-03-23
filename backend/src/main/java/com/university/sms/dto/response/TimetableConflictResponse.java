package com.university.sms.dto.response;

import com.university.sms.model.enums.DayOfWeek;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class TimetableConflictResponse {
    private String type;
    private Long classId;
    private String className;
    private Long teacherId;
    private String teacherName;
    private DayOfWeek dayOfWeek;
    private String time;
    private String details;
}
