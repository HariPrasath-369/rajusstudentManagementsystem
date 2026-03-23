package com.university.sms.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class DepartmentResponse {
    private Long id;
    private String name;
    private String description;
    private String code;
    private String hodName;
    private int studentCount;
    private int teacherCount;
    private Integer establishedYear;
    private Long hodId;
    private java.time.LocalDateTime createdAt;
}