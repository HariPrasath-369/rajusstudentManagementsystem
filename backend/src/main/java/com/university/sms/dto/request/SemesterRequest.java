package com.university.sms.dto.request;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.time.LocalDate;

@Data
public class SemesterRequest {
    private Long id;

    @NotNull(message = "Class ID is required")
    private Long classId;

    @NotNull(message = "Semester number is required")
    private Integer semesterNumber;

    @NotBlank(message = "Academic year is required")
    private String academicYear;

    private LocalDate startDate;

    private LocalDate endDate;
}