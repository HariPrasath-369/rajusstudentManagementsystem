package com.university.sms.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.Builder;

@Data
@Builder
public class ApiResponse {
    private Boolean success;
    private String message;

    public ApiResponse() {}

    public ApiResponse(Boolean success, String message) {
        this.success = success;
        this.message = message;
    }
}
