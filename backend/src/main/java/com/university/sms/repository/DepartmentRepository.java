package com.university.sms.repository;

import com.university.sms.model.Department;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DepartmentRepository extends JpaRepository<Department, Long> {

    Optional<Department> findByName(String name);

    Optional<Department> findByCode(String code);

    @Query("SELECT d FROM Department d WHERE d.hod IS NULL")
    List<Department> findDepartmentsWithoutHod();

    @Query("SELECT d FROM Department d WHERE d.hod IS NOT NULL")
    List<Department> findDepartmentsWithHod();

    boolean existsByName(String name);

    boolean existsByCode(String code);

    @Query("SELECT d FROM Department d WHERE d.isActive = true")
    List<Department> findAllActive();

    @Query("SELECT COUNT(s) FROM Department d JOIN d.classes c JOIN c.students s WHERE d.id = :deptId")
    long countStudentsByDepartment(@Param("deptId") Long deptId);

    @Query("SELECT COUNT(t) FROM Department d JOIN d.teachers t WHERE d.id = :deptId AND t.isActive = true")
    long countActiveTeachersByDepartment(@Param("deptId") Long deptId);
}