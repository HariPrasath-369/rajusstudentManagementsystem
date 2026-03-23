package com.university.sms.repository;

import com.university.sms.model.Class;
import com.university.sms.model.Semester;
import com.university.sms.model.enums.SemesterStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SemesterRepository extends JpaRepository<Semester, Long> {

    List<Semester> findByClassEntity(Class classEntity);

    Optional<Semester> findByClassEntityAndSemesterNumberAndAcademicYear(Class classEntity, 
                                                                          Integer semesterNumber, 
                                                                          String academicYear);

    List<Semester> findByStatus(SemesterStatus status);

    @Query("SELECT s FROM Semester s WHERE s.classEntity.id = :classId AND s.status = 'IN_PROGRESS'")
    Optional<Semester> findCurrentSemesterByClassId(@Param("classId") Long classId);

    @Query("SELECT s FROM Semester s WHERE s.classEntity.department.id = :deptId AND s.academicYear = :academicYear")
    List<Semester> findByDepartmentAndAcademicYear(@Param("deptId") Long deptId, 
                                                    @Param("academicYear") String academicYear);

    @Query("SELECT s FROM Semester s WHERE s.startDate <= CURRENT_DATE AND s.endDate >= CURRENT_DATE")
    List<Semester> findActiveSemesters();

    @Query("SELECT COUNT(s) FROM Semester s WHERE s.classEntity.id = :classId AND s.status = 'COMPLETED'")
    long countCompletedSemestersByClassId(@Param("classId") Long classId);
}