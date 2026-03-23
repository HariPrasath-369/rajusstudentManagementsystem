package com.university.sms.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.time.LocalDate;

@Data
public class StudentRequest {

    @NotBlank(message = "Name is required")
    @Size(min = 2, max = 100, message = "Name must be between 2 and 100 characters")
    private String name;

    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    private String email;

    @NotBlank(message = "Password is required")
    @Size(min = 6, max = 100, message = "Password must be between 6 and 100 characters")
    private String password;

    private String phoneNumber;

    @NotNull(message = "Class ID is required")
    private Long classId;

    @NotBlank(message = "Roll number is required")
    private String rollNumber;

    @NotBlank(message = "Registration number is required")
    private String registrationNumber;

    private LocalDate dateOfBirth;

    private String fatherName;

    private String motherName;

    private String address;

    private Integer admissionYear;
}