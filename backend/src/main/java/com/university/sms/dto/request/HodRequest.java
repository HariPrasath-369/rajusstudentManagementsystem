package com.university.sms.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class HodRequest {
    @NotNull(message = "HOD ID is required")
    private Long userId;
    
    @NotNull(message = "Department ID is required")
    private Long departmentId;
    
    private String officeRoom;
}