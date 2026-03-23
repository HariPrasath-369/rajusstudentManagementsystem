package com.university.sms.service;

public interface OtpService {
    String generateOtp();
    void saveOtp(String email, String otp);
    boolean validateOtp(String email, String otp);
    void clearExpiredOtps();
}