package com.university.sms.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StudentPerformanceResponse {
    private String studentName;
    private String rollNumber;
    private String className;
    private Double overallPercentage;
    private OverallStats overall;
    private List<SubjectPerformanceStat> subjectWise;
    private List<SemesterPerformanceStat> semesterWise;
    private List<PredictionStat> predictions;
    private List<RecommendationStat> recommendations;

    @Data
    @Builder
    public static class OverallStats {
        private Double cgpa;
        private List<Double> semesterWiseAvg;
        private Double attendance;
        private Double improvement;
        private Integer rank;
        private Integer totalStudents;
    }

    @Data
    @Builder
    public static class SubjectPerformanceStat {
        private String subject;
        private Double marks;
        private String grade;
        private Integer credits;
        private String trend; // "up", "down", "stable"
    }

    @Data
    @Builder
    public static class SemesterPerformanceStat {
        private Integer semester;
        private Double sgpa;
        private Integer credits;
        private Integer rank;
    }

    @Data
    @Builder
    public static class PredictionStat {
        private String metric;
        private String value;
        private Integer confidence;
        private String trend;
    }

    @Data
    @Builder
    public static class RecommendationStat {
        private String area;
        private String suggestion;
        private String priority; // "high", "medium", "low"
    }
}