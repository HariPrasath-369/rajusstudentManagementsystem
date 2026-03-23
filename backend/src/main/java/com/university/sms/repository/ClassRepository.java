package com.university.sms.repository;

import com.university.sms.model.Class;
import com.university.sms.model.Department;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ClassRepository extends JpaRepository<Class, Long> {

    List<Class> findByDepartment(Department department);

    List<Class> findByDepartmentAndYear(Department department, Integer year);

    Optional<Class> findByDepartmentAndYearAndSection(Department department, Integer year, String section);

    @Query("SELECT c FROM Class c WHERE c.advisor.id = :advisorId AND c.isActive = true")
    List<Class> findByAdvisorId(@Param("advisorId") Long advisorId);

    @Query("SELECT c FROM Class c WHERE c.department.id = :deptId AND c.isActive = true")
    List<Class> findActiveClassesByDepartment(@Param("deptId") Long deptId);

    @Query("SELECT COUNT(s) FROM Class c JOIN c.students s WHERE c.id = :classId AND s.isActive = true")
    long countActiveStudentsInClass(@Param("classId") Long classId);

    @Query("SELECT c FROM Class c WHERE c.year = :year ORDER BY c.department.name, c.section")
    List<Class> findByYearOrderByDepartment(@Param("year") Integer year);

    @Query("SELECT c FROM Class c WHERE c.classSize < (SELECT COUNT(s) FROM Student s WHERE s.studentClass = c)")
    List<Class> findOverCapacityClasses();

    @Query("SELECT c FROM Class c WHERE c.isActive = true")
    List<Class> findAllActive();
}