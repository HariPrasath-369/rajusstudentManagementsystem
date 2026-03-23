package com.university.sms.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ClassResponse {
    private Long id;
    private Long departmentId;
    private String departmentName;
    private Integer year;
    private String section;
    private String className;
    private Integer classSize;
    private Long advisorId;
    private String advisorName;
    private Long studentCount;
}