package com.university.sms.dto.response;

import com.university.sms.model.enums.DayOfWeek;
import lombok.Builder;
import lombok.Data;
import java.time.LocalTime;

@Data
@Builder
public class TimetableResponse {
    private Long id;
    private Long classId;
    private String className;
    private Long subjectId;
    private String subjectName;
    private String subjectCode;
    private Long teacherId;
    private String teacherName;
    private DayOfWeek dayOfWeek;
    private LocalTime startTime;
    private LocalTime endTime;
    private String roomNumber;
}