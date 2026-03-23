package com.university.sms.repository;

import com.university.sms.model.Attendance;
import com.university.sms.model.Class;
import com.university.sms.model.Student;
import com.university.sms.model.Subject;
import com.university.sms.model.enums.AttendanceStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface AttendanceRepository extends JpaRepository<Attendance, Long> {

    List<Attendance> findByStudentAndDateBetween(Student student, LocalDate startDate, LocalDate endDate);

    List<Attendance> findByClassEntityAndDate(Class classEntity, LocalDate date);

    Optional<Attendance> findByStudentAndClassEntityAndDate(Student student, Class classEntity, LocalDate date);

    Page<Attendance> findByStudent(Student student, Pageable pageable);

    List<Attendance> findByStudentOrderByDateDesc(Student student);

    @Query("SELECT a FROM Attendance a WHERE a.classEntity.id = :classId AND a.date = :date AND a.isSubmitted = false")
    List<Attendance> findDraftAttendanceByClassAndDate(@Param("classId") Long classId, @Param("date") LocalDate date);

    @Modifying
    @Transactional
    @Query("UPDATE Attendance a SET a.isSubmitted = true, a.submittedAt = CURRENT_TIMESTAMP, a.submittedBy = :teacherId " +
           "WHERE a.classEntity.id = :classId AND a.date = :date")
    void submitAttendanceForClassAndDate(@Param("classId") Long classId, 
                                         @Param("date") LocalDate date,
                                         @Param("teacherId") Long teacherId);

    @Query("SELECT a.student, COUNT(a) as total, " +
           "SUM(CASE WHEN a.status = 'PRESENT' THEN 1 ELSE 0 END) as present " +
           "FROM Attendance a WHERE a.classEntity.id = :classId " +
           "AND a.date BETWEEN :startDate AND :endDate " +
           "GROUP BY a.student")
    List<Object[]> getAttendancePercentageByClassAndDateRange(@Param("classId") Long classId,
                                                                @Param("startDate") LocalDate startDate,
                                                                @Param("endDate") LocalDate endDate);

    @Query("SELECT a FROM Attendance a WHERE a.student.id = :studentId AND a.subject.id = :subjectId " +
           "AND a.date BETWEEN :startDate AND :endDate")
    List<Attendance> getStudentAttendanceForSubject(@Param("studentId") Long studentId, 
                                                     @Param("subjectId") Long subjectId,
                                                     @Param("startDate") LocalDate startDate,
                                                     @Param("endDate") LocalDate endDate);

    @Query("SELECT AVG(CASE WHEN a.status = 'PRESENT' THEN 1.0 ELSE 0.0 END) FROM Attendance a")
    double getAverageAttendanceOverall();

    @Query("SELECT AVG(CASE WHEN a.status = 'PRESENT' THEN 1.0 ELSE 0.0 END) FROM Attendance a WHERE a.submittedBy = :teacherId")
    double getAverageAttendanceByTeacher(@Param("teacherId") Long teacherId);

    @Query("SELECT AVG(CASE WHEN a.status = 'PRESENT' THEN 1.0 ELSE 0.0 END) FROM Attendance a " +
           "WHERE a.classEntity.department.id = :deptId")
    double getAverageAttendanceByDepartment(@Param("deptId") Long deptId);

    @Query("SELECT (COUNT(CASE WHEN a.status = 'PRESENT' THEN 1 END) * 100.0 / COUNT(a)) " +
           "FROM Attendance a WHERE a.student.id = :studentId")
    double getAttendancePercentage(@Param("studentId") Long studentId);

    @Query("SELECT AVG(CASE WHEN a.status = 'PRESENT' THEN 1.0 ELSE 0.0 END) FROM Attendance a WHERE a.student.id = :studentId")
    Double getAverageAttendanceByStudent(@Param("studentId") Long studentId);

    @Query("SELECT FUNCTION('DATE_TRUNC', 'month', a.date) as month, " +
           "AVG(CASE WHEN a.status = 'PRESENT' THEN 1.0 ELSE 0.0 END) " +
           "FROM Attendance a WHERE a.classEntity.department.id = :deptId " +
           "AND a.academicYear = :academicYear GROUP BY month")
    List<Object[]> getMonthlyAttendanceTrends(@Param("deptId") Long deptId, 
                                               @Param("academicYear") String academicYear);

    @Query("SELECT s.name, AVG(CASE WHEN a.status = 'PRESENT' THEN 1.0 ELSE 0.0 END) " +
           "FROM Attendance a JOIN a.subject s WHERE a.classEntity.department.id = :deptId " +
           "AND a.academicYear = :academicYear GROUP BY s.name")
    List<Object[]> getSubjectWiseAttendance(@Param("deptId") Long deptId, 
                                             @Param("academicYear") String academicYear);
    @Query("SELECT a.date, a.status FROM Attendance a WHERE a.student.id = :studentId " +
           "AND a.date BETWEEN :startDate AND :endDate ORDER BY a.date ASC")
    List<Object[]> getStudentAttendanceTrend(@Param("studentId") Long studentId, 
                                              @Param("startDate") LocalDate startDate, 
                                              @Param("endDate") LocalDate endDate);

    @Query("SELECT FUNCTION('DATE_TRUNC', 'month', a.date) as month, " +
           "AVG(CASE WHEN a.status = 'PRESENT' THEN 1.0 ELSE 0.0 END) " +
           "FROM Attendance a WHERE a.student.id = :studentId " +
           "GROUP BY month ORDER BY month DESC")
    List<Object[]> getTrendData(@Param("studentId") Long studentId);
}