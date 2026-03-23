package com.university.sms.dto.request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class ClassRequest {

    @NotNull(message = "Department ID is required")
    private Long departmentId;

    @NotNull(message = "Year is required")
    @Min(value = 1, message = "Year must be at least 1")
    private Integer year;

    private String section;

    @Min(value = 1, message = "Class size must be at least 1")
    private Integer classSize;

    private Long advisorId;
}