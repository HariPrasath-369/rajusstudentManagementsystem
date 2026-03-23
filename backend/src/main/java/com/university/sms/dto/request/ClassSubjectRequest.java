package com.university.sms.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class ClassSubjectRequest {
    private java.util.List<Long> subjectIds;
    private java.util.Map<Long, Long> teacherIds;
    private String academicYear;
    private Integer semester;
}
