package com.university.sms.dto.response;

import com.university.sms.model.enums.DayOfWeek;
import lombok.Builder;
import lombok.Data;
import java.util.List;
import java.util.Map;

@Data
@Builder
public class WeeklyTimetableResponse {
    private Long classId;
    private String className;
    private Map<DayOfWeek, List<TimetableResponse>> timetable;
}
