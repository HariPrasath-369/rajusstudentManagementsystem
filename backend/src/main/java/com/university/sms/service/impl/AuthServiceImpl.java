package com.university.sms.service.impl;

import com.university.sms.dto.request.LoginRequest;
import com.university.sms.dto.request.RegisterRequest;
import com.university.sms.dto.response.AuthResponse;
import com.university.sms.exception.BadRequestException;
import com.university.sms.model.User;
import com.university.sms.model.enums.Role;
import com.university.sms.repository.UserRepository;
import com.university.sms.security.JwtTokenProvider;
import com.university.sms.service.AuthService;
import com.university.sms.service.EmailService;
import com.university.sms.service.OtpService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
public class AuthServiceImpl implements AuthService {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtTokenProvider tokenProvider;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private EmailService emailService;

    @Autowired
    private OtpService otpService;

    @Override
    public AuthResponse authenticateUser(LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginRequest.getEmail(),
                        loginRequest.getPassword()
                )
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = tokenProvider.generateToken(authentication);

        User user = userRepository.findByEmail(loginRequest.getEmail())
                .orElseThrow(() -> new BadRequestException("User not found"));

        user.setLastLogin(LocalDateTime.now());
        userRepository.save(user);

        return new AuthResponse(jwt, "Bearer", user.getId(), user.getName(), 
                                user.getEmail(), user.getRole().name());
    }

    @Override
    @Transactional
    public AuthResponse registerUser(RegisterRequest registerRequest) {
        if (userRepository.existsByEmail(registerRequest.getEmail())) {
            throw new BadRequestException("Email address already in use");
        }

        User user = new User();
        user.setName(registerRequest.getName());
        user.setEmail(registerRequest.getEmail());
        user.setPassword(passwordEncoder.encode(registerRequest.getPassword()));
        user.setRole(registerRequest.getRole() != null ? registerRequest.getRole() : Role.ROLE_STUDENT);
        user.setEmailVerified(false);
        user.setIsActive(true);
        
        user = userRepository.save(user);

        emailService.sendWelcomeEmail(user.getEmail(), user.getName());

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        registerRequest.getEmail(),
                        registerRequest.getPassword()
                )
        );
        
        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = tokenProvider.generateToken(authentication);

        return new AuthResponse(jwt, "Bearer", user.getId(), user.getName(), 
                                user.getEmail(), user.getRole().name());
    }

    @Override
    public void sendOtp(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new BadRequestException("User not found with email: " + email));

        String otp = otpService.generateOtp();
        otpService.saveOtp(email, otp);
        emailService.sendOtpEmail(email, otp);
    }

    @Override
    public boolean verifyOtp(String email, String otp) {
        return otpService.validateOtp(email, otp);
    }

    @Override
    @Transactional
    public void resetPassword(String email, String otp, String newPassword) {
        if (!otpService.validateOtp(email, otp)) {
            throw new BadRequestException("Invalid or expired OTP");
        }

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new BadRequestException("User not found"));

        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
    }
}