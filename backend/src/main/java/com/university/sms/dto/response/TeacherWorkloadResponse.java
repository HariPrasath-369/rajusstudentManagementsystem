package com.university.sms.dto.response;

import com.university.sms.model.enums.DayOfWeek;
import lombok.Builder;
import lombok.Data;
import java.util.Map;

@Data
@Builder
public class TeacherWorkloadResponse {
    private Long teacherId;
    private String teacherName;
    private Integer totalClasses;
    private Integer totalSubjects;
    private Integer totalHours;
    private Double workloadPercentage;
    private Map<DayOfWeek, Long> workloadByDay;
}