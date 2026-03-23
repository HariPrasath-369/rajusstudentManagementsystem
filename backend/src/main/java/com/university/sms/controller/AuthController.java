package com.university.sms.controller;

import com.university.sms.dto.request.LoginRequest;
import com.university.sms.dto.request.OtpRequest;
import com.university.sms.dto.request.RegisterRequest;
import com.university.sms.dto.request.ResetPasswordRequest;
import com.university.sms.dto.response.ApiResponse;
import com.university.sms.dto.response.AuthResponse;
import com.university.sms.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@Tag(name = "Authentication", description = "Authentication APIs")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/login")
    @Operation(summary = "Authenticate user and get JWT token")
    public ResponseEntity<AuthResponse> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
        AuthResponse response = authService.authenticateUser(loginRequest);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/register")
    @Operation(summary = "Register a new user")
    public ResponseEntity<AuthResponse> registerUser(@Valid @RequestBody RegisterRequest registerRequest) {
        AuthResponse response = authService.registerUser(registerRequest);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/send-otp")
    @Operation(summary = "Send OTP to email for password reset")
    public ResponseEntity<ApiResponse> sendOtp(@RequestParam String email) {
        authService.sendOtp(email);
        return ResponseEntity.ok(new ApiResponse(true, "OTP sent successfully"));
    }

    @PostMapping("/verify-otp")
    @Operation(summary = "Verify OTP")
    public ResponseEntity<ApiResponse> verifyOtp(@Valid @RequestBody OtpRequest otpRequest) {
        boolean isValid = authService.verifyOtp(otpRequest.getEmail(), otpRequest.getOtp());
        return ResponseEntity.ok(new ApiResponse(isValid, isValid ? "OTP verified" : "Invalid OTP"));
    }

    @PostMapping("/reset-password")
    @Operation(summary = "Reset password using OTP")
    public ResponseEntity<ApiResponse> resetPassword(@Valid @RequestBody ResetPasswordRequest request) {
        authService.resetPassword(request.getEmail(), request.getOtp(), request.getNewPassword());
        return ResponseEntity.ok(new ApiResponse(true, "Password reset successfully"));
    }
}