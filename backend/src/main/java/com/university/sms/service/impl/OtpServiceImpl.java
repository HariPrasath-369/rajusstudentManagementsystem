package com.university.sms.service.impl;

import com.university.sms.model.Otp;
import com.university.sms.repository.OtpRepository;
import com.university.sms.service.OtpService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Random;

@Service
public class OtpServiceImpl implements OtpService {

    @Autowired
    private OtpRepository otpRepository;

    private final Random random = new Random();

    @Override
    public String generateOtp() {
        return String.format("%06d", random.nextInt(1000000));
    }

    @Override
    @Transactional
    public void saveOtp(String email, String otp) {
        // Delete any existing OTP for this email
        otpRepository.deleteByEmail(email);
        
        Otp otpEntity = new Otp();
        otpEntity.setEmail(email);
        otpEntity.setOtp(otp);
        otpEntity.setExpiresAt(LocalDateTime.now().plusMinutes(10));
        otpEntity.setIsUsed(false);
        otpEntity.setCreatedAt(LocalDateTime.now());
        
        otpRepository.save(otpEntity);
    }

    @Override
    public boolean validateOtp(String email, String otp) {
        return otpRepository.findByEmailAndOtpAndIsUsedFalseAndExpiresAtAfter(email, otp, LocalDateTime.now())
                .map(otpEntity -> {
                    otpEntity.setIsUsed(true);
                    otpRepository.save(otpEntity);
                    return true;
                })
                .orElse(false);
    }

    @Override
    @Scheduled(cron = "0 0 * * * *") // Run every hour
    @Transactional
    public void clearExpiredOtps() {
        otpRepository.deleteByExpiresAtBefore(LocalDateTime.now());
    }
}