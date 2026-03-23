package com.university.sms.repository;

import com.university.sms.model.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;
import java.util.Map;

@Repository
public interface StudentRepository extends JpaRepository<Student, Long> {
    Optional<Student> findByUserId(Long userId);
    long count();
    // Dummy methods to satisfy compilation
    @org.springframework.data.jpa.repository.Query("SELECT s.admissionYear, COUNT(s) FROM Student s GROUP BY s.admissionYear")
    java.util.List<Object[]> countStudentsByYearData();
    @org.springframework.data.jpa.repository.Query("SELECT COUNT(s) FROM Student s WHERE s.studentClass.department.id = :departmentId")
    long countByDepartment(@org.springframework.data.repository.query.Param("departmentId") Long departmentId);
    java.util.List<Student> findByStudentClass(com.university.sms.model.Class studentClass);
    long countByStudentClass(com.university.sms.model.Class studentClass);
    Optional<Student> findByRollNumber(String rollNumber);
    java.util.List<Student> findByStudentClassId(Long classId);
}
