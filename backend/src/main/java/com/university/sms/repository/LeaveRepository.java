package com.university.sms.repository;

import com.university.sms.model.Leave;
import com.university.sms.model.Student;
import com.university.sms.model.enums.LeaveStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface LeaveRepository extends JpaRepository<Leave, Long> {
    List<Leave> findByStudentId(Long studentId);
    
    @Query("SELECT COUNT(l) FROM Leave l WHERE l.student.id = :studentId AND l.status = 'APPROVED'")
    long countApprovedLeavesByStudent(Long studentId);

    @Query("SELECT COUNT(l) FROM Leave l WHERE l.student.id = :studentId AND l.status = 'APPROVED' AND l.startDate >= :start AND l.startDate <= :end")
    long countApprovedLeavesForStudentInRange(@Param("studentId") Long studentId, @Param("start") LocalDate start, @Param("end") LocalDate end);

    @Query("SELECT l FROM Leave l WHERE l.student.id = :studentId AND " +
           "((l.startDate <= :end AND l.endDate >= :start))")
    List<Leave> findOverlappingLeaves(@Param("studentId") Long studentId, 
                                     @Param("start") LocalDate start, 
                                     @Param("end") LocalDate end);

    List<Leave> findByStudent(Student student);

    Page<Leave> findByStudent(Student student, Pageable pageable);

    List<Leave> findByStatus(LeaveStatus status);

    @Query("SELECT l FROM Leave l WHERE l.student.studentClass.id = :classId")
    List<Leave> findByClassId(@Param("classId") Long classId);

    @Query("SELECT COUNT(l) FROM Leave l WHERE l.student.studentClass.advisor.id = :advisorId AND l.status = 'PENDING'")
    long countPendingByAdvisorId(@Param("advisorId") Long advisorId);
}