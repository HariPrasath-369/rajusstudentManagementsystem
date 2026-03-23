package com.university.sms.dto.response;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDate;
import java.util.List;

@Data
@Builder
public class AttendanceStatisticsResponse {
    private Long classId;
    private LocalDate startDate;
    private LocalDate endDate;
    private Double overallAverage;
    private List<StudentAttendanceStat> studentStatistics;
}
