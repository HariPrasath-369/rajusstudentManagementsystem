package com.university.sms.service;

import com.university.sms.dto.request.LoginRequest;
import com.university.sms.dto.request.RegisterRequest;
import com.university.sms.dto.response.AuthResponse;

public interface AuthService {
    AuthResponse authenticateUser(LoginRequest loginRequest);
    AuthResponse registerUser(RegisterRequest registerRequest);
    void sendOtp(String email);
    boolean verifyOtp(String email, String otp);
    void resetPassword(String email, String otp, String newPassword);
}