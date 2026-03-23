package com.university.sms.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class AssignedClassResponse {
    private Long classId;
    private String className;
    private String subjectName;
    private int studentCount;
    private Integer year;
    private String section;
}
