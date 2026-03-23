package com.university.sms.dto.response;

import lombok.Builder;
import lombok.Data;
import java.util.List;

@Data
@Builder
public class StudentAttendanceDashboardResponse {
    private Double overall;
    private List<SubjectAttendanceStat> subjectWise;
    private List<MonthlyAttendanceStat> monthlyTrend;
    private List<AttendanceResponse> recentRecords;

    @Data
    @Builder
    public static class SubjectAttendanceStat {
        private String subject;
        private Double percentage;
        private Integer present;
        private Integer total;
    }

    @Data
    @Builder
    public static class MonthlyAttendanceStat {
        private String month;
        private Double attendance;
    }
}
