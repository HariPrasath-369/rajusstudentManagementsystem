package com.university.sms.repository;

import com.university.sms.model.Department;
import com.university.sms.model.Subject;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SubjectRepository extends JpaRepository<Subject, Long> {

    Optional<Subject> findByCode(String code);

    List<Subject> findByDepartment(Department department);

    List<Subject> findByDepartmentAndSemester(Department department, Integer semester);

    List<Subject> findByIsElectiveTrue();

    @Query("SELECT s FROM Subject s WHERE s.department.id = :deptId AND s.isActive = true")
    List<Subject> findActiveByDepartmentId(@Param("deptId") Long deptId);

    @Query("SELECT s FROM Subject s WHERE s.name LIKE %:name% AND s.isActive = true")
    List<Subject> searchByName(@Param("name") String name);

    @Query("SELECT s FROM Subject s WHERE s.creditHours >= :minCredits ORDER BY s.creditHours DESC")
    List<Subject> findByMinimumCredits(@Param("minCredits") Integer minCredits);

    boolean existsByCode(String code);

    @Query("SELECT COUNT(s) FROM Subject s WHERE s.department.id = :deptId")
    long countByDepartmentId(@Param("deptId") Long deptId);
}