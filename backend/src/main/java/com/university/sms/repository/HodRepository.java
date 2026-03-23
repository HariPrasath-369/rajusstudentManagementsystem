package com.university.sms.repository;

import com.university.sms.model.Department;
import com.university.sms.model.Hod;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface HodRepository extends JpaRepository<Hod, Long> {

    Optional<Hod> findByUserId(Long userId);

    Optional<Hod> findByDepartment(Department department);

    @Query("SELECT h FROM Hod h WHERE h.department.id = :deptId AND h.isActive = true")
    Optional<Hod> findByDepartmentId(@Param("deptId") Long deptId);

    @Query("SELECT h FROM Hod h WHERE h.isActive = true")
    List<Hod> findAllByIsActiveTrue();

    boolean existsByDepartment(Department department);

    @Query("SELECT h FROM Hod h WHERE h.appointmentDate BETWEEN :startDate AND :endDate")
    List<Hod> findByAppointmentDateRange(@Param("startDate") java.time.LocalDateTime startDate,
                                          @Param("endDate") java.time.LocalDateTime endDate);

    @Query("SELECT COUNT(h) FROM Hod h WHERE h.department.id = :deptId")
    long countByDepartmentId(@Param("deptId") Long deptId);
}