package com.university.sms.repository;

import com.university.sms.model.Department;
import com.university.sms.model.Teacher;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TeacherRepository extends JpaRepository<Teacher, Long> {

    Optional<Teacher> findByUserId(Long userId);

    Optional<Teacher> findByEmployeeId(String employeeId);

    List<Teacher> findByDepartment(Department department);

    List<Teacher> findByDepartmentAndIsActiveTrue(Department department);

    @Query("SELECT t FROM Teacher t WHERE t.isClassAdvisor = true AND t.isActive = true")
    List<Teacher> findAllClassAdvisors();

    List<Teacher> findAllByIsClassAdvisorTrue();

    @Query("SELECT t FROM Teacher t WHERE t.specialization = :specialization AND t.isActive = true")
    List<Teacher> findBySpecialization(@Param("specialization") String specialization);

    @Query("SELECT COUNT(t) FROM Teacher t WHERE t.department.id = :deptId AND t.isActive = true")
    long countActiveByDepartmentId(@Param("deptId") Long deptId);

    @Query("SELECT t FROM Teacher t WHERE t.joiningDate BETWEEN :startDate AND :endDate")
    List<Teacher> findByJoiningDateRange(@Param("startDate") java.time.LocalDateTime startDate,
                                          @Param("endDate") java.time.LocalDateTime endDate);

    @Query("SELECT t FROM Teacher t WHERE t.qualification LIKE %:qualification% AND t.isActive = true")
    List<Teacher> findByQualificationContaining(@Param("qualification") String qualification);

    Page<Teacher> findByDepartment(Department department, Pageable pageable);
}