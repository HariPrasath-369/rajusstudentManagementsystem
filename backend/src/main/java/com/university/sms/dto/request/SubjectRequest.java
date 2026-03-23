package com.university.sms.dto.request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class SubjectRequest {

    @NotBlank(message = "Subject name is required")
    @Size(min = 2, max = 100, message = "Subject name must be between 2 and 100 characters")
    private String name;

    @NotBlank(message = "Subject code is required")
    @Size(min = 2, max = 20, message = "Subject code must be between 2 and 20 characters")
    private String code;

    @Min(value = 1, message = "Credit hours must be at least 1")
    private Integer creditHours;

    @NotNull(message = "Department ID is required")
    private Long departmentId;

    private Integer semester;

    private Boolean isElective = false;
}