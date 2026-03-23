package com.university.sms.events;

import lombok.Builder;
import lombok.Getter;
import java.util.List;
import java.util.Map;

@Getter
@Builder
public class MarksPublishedEvent {
    private String subjectName;
    private Long subjectId;
    private Long teacherId;
    private Integer semester;
    private List<Long> studentIds;
    private List<Double> marksList;
    private double averageMarks;
    private double highestMarks;
    private double lowestMarks;
    private double passPercentage;
    private Map<String, Long> gradeDistribution;
}