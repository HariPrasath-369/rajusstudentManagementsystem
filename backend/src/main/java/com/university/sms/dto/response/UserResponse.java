package com.university.sms.dto.response;

import com.university.sms.model.enums.Role;
import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Builder
public class UserResponse {
    private Long id;
    private String name;
    private String email;
    private Role role;
    private Boolean isActive;
    private Boolean emailVerified;
    private String phoneNumber;
    private String profilePicture;
    private LocalDateTime createdAt;
    private LocalDateTime lastLogin;
    private String department;
}