package com.university.sms.dto.response;

import lombok.Builder;
import lombok.Data;
import java.util.List;

@Data
@Builder
public class StudentMarksDashboardResponse {
    private Double cgpa;
    private List<SemesterGpaStat> sgpa;
    private List<SubjectMarksStat> subjectWise;
    private List<SemesterPerformanceStat> semesterWise;
    private List<PerformanceTrendStat> performanceTrend;

    @Data
    @Builder
    public static class SemesterGpaStat {
        private Integer semester;
        private Double gpa;
    }

    @Data
    @Builder
    public static class SubjectMarksStat {
        private String subject;
        private Integer marks;
        private Integer total;
        private Double percentage;
    }

    @Data
    @Builder
    public static class SemesterPerformanceStat {
        private Integer semester;
        private Double percentage;
    }

    @Data
    @Builder
    public static class PerformanceTrendStat {
        private String name;
        private Double value;
    }
}
