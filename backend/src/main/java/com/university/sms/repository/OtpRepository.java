package com.university.sms.repository;

import com.university.sms.model.Otp;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Optional;

@Repository
public interface OtpRepository extends JpaRepository<Otp, Long> {

    Optional<Otp> findByEmailAndOtpAndIsUsedFalseAndExpiresAtAfter(String email, String otp, LocalDateTime now);

    @Modifying
    @Transactional
    @Query("UPDATE Otp o SET o.isUsed = true WHERE o.email = :email AND o.otp = :otp")
    void markOtpAsUsed(@Param("email") String email, @Param("otp") String otp);

    @Modifying
    @Transactional
    void deleteByExpiresAtBefore(LocalDateTime now);

    @Modifying
    @Transactional
    void deleteByEmail(String email);

    Optional<Otp> findByEmailAndIsUsedFalse(String email);

    @Query("SELECT o FROM Otp o WHERE o.email = :email ORDER BY o.createdAt DESC")
    Optional<Otp> findLatestByEmail(@Param("email") String email);
}