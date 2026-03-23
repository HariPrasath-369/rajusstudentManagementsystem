package com.university.sms.repository;

import com.university.sms.model.Class;
import com.university.sms.model.ClassSubject;
import com.university.sms.model.Subject;
import com.university.sms.model.Teacher;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ClassSubjectRepository extends JpaRepository<ClassSubject, Long> {

    List<ClassSubject> findByClassEntity(Class classEntity);

    List<ClassSubject> findBySubject(Subject subject);

    List<ClassSubject> findByTeacher(Teacher teacher);

    Optional<ClassSubject> findByClassEntityAndSubject(Class classEntity, Subject subject);

    @Query("SELECT cs FROM ClassSubject cs WHERE cs.classEntity.id = :classId AND cs.academicYear = :academicYear")
    List<ClassSubject> findByClassIdAndAcademicYear(@Param("classId") Long classId, 
                                                     @Param("academicYear") String academicYear);

    @Query("SELECT cs FROM ClassSubject cs WHERE cs.teacher.id = :teacherId AND cs.academicYear = :academicYear")
    List<ClassSubject> findByTeacherIdAndAcademicYear(@Param("teacherId") Long teacherId, 
                                                       @Param("academicYear") String academicYear);

    @Query("SELECT COUNT(cs) FROM ClassSubject cs WHERE cs.classEntity.id = :classId")
    long countByClassId(@Param("classId") Long classId);

    @Query("SELECT COUNT(cs) FROM ClassSubject cs WHERE cs.teacher.id = :teacherId")
    long countSubjectsByTeacher(@Param("teacherId") Long teacherId);

    @Query("SELECT cs FROM ClassSubject cs WHERE cs.classEntity.department.id = :deptId AND cs.academicYear = :academicYear")
    List<ClassSubject> findByDepartmentAndAcademicYear(@Param("deptId") Long deptId, 
                                                        @Param("academicYear") String academicYear);
}