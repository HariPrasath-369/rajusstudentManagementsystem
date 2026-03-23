package com.university.sms.repository;

import com.university.sms.model.Marks;
import com.university.sms.model.Student;
import com.university.sms.model.Subject;
import com.university.sms.model.enums.MarksType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@Repository
public interface MarksRepository extends JpaRepository<Marks, Long> {

    List<Marks> findByStudent(Student student);

    List<Marks> findByStudentAndSemester(Student student, Integer semester);

    List<Marks> findBySubjectAndSemester(Subject subject, Integer semester);

    List<Marks> findBySubjectIdAndSemester(Long subjectId, Integer semester);

    Optional<Marks> findByStudentAndSubjectAndMarksTypeAndSemester(Student student, Subject subject, 
                                                                    MarksType marksType, Integer semester);

    Optional<Marks> findByStudentAndSubjectAndMarksType(Student student, Subject subject, MarksType marksType);

    @Query("SELECT m FROM Marks m WHERE m.subject.id = :subjectId AND m.semester = :semester AND m.isPublished = true")
    List<Marks> findPublishedMarksBySubjectAndSemester(@Param("subjectId") Long subjectId, 
                                                        @Param("semester") Integer semester);

    @Query("SELECT AVG(m.marksObtained) FROM Marks m WHERE m.student.id = :studentId AND m.isPublished = true")
    Double getAverageMarksByStudent(@Param("studentId") Long studentId);

    @Query("SELECT AVG(m.marksObtained / m.maxMarks * 100) FROM Marks m WHERE m.enteredBy = :teacherId")
    double getAverageMarksByTeacher(@Param("teacherId") Long teacherId);

    @Query("SELECT AVG(m.marksObtained / m.maxMarks * 100) FROM Marks m " +
           "WHERE m.subject.department.id = :deptId")
    double getAverageMarksByDepartment(@Param("deptId") Long deptId);

    @Query("SELECT AVG(m.marksObtained / m.maxMarks * 100) FROM Marks m")
    double getAverageMarksOverall();

    @Query("SELECT AVG(m.marksObtained / m.maxMarks * 100) FROM Marks m WHERE m.student.id = :studentId AND m.semester = :semester")
    double getAverageMarksByStudentAndSemester(@Param("studentId") Long studentId, @Param("semester") Integer semester);

    @Query("SELECT d.name, AVG(m.marksObtained / m.maxMarks * 100) FROM Marks m " +
           "JOIN m.subject s JOIN s.department d GROUP BY d.name")
    List<Object[]> getPassPercentageByDepartment();

    @Query("SELECT COUNT(CASE WHEN (m.marksObtained / m.maxMarks * 100) >= 40 THEN 1 END) * 100.0 / COUNT(m) " +
           "FROM Marks m WHERE m.subject.department.id = :deptId")
    double getPassRateByDepartment(@Param("deptId") Long deptId);

    @Modifying
    @Transactional
    @Query("UPDATE Marks m SET m.isPublished = true, m.publishedAt = CURRENT_TIMESTAMP " +
           "WHERE m.subject.id = :subjectId AND m.semester = :semester")
    void publishMarksForSubject(@Param("subjectId") Long subjectId, @Param("semester") Integer semester);
}