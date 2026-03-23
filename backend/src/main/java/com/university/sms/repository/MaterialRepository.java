package com.university.sms.repository;

import com.university.sms.model.Material;
import com.university.sms.model.Subject;
import com.university.sms.model.Teacher;
import com.university.sms.model.enums.MaterialType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MaterialRepository extends JpaRepository<Material, Long> {

    List<Material> findByTeacher(Teacher teacher);

    List<Material> findBySubject(Subject subject);

    List<Material> findByType(MaterialType type);

    Page<Material> findBySubject(Subject subject, Pageable pageable);

    @Query("SELECT m FROM Material m WHERE m.subject.id = :subjectId ORDER BY m.uploadedAt DESC")
    List<Material> findRecentBySubjectId(@Param("subjectId") Long subjectId, Pageable pageable);

    @Query("SELECT m FROM Material m WHERE m.title LIKE %:keyword% OR m.description LIKE %:keyword%")
    List<Material> searchByKeyword(@Param("keyword") String keyword);

    @Query("SELECT m FROM Material m WHERE m.teacher.id = :teacherId AND m.type = :type")
    List<Material> findByTeacherAndType(@Param("teacherId") Long teacherId, @Param("type") MaterialType type);

    @Query("SELECT COUNT(m) FROM Material m WHERE m.subject.id = :subjectId")
    long countBySubjectId(@Param("subjectId") Long subjectId);

    @Query("SELECT m FROM Material m WHERE m.uploadedAt >= :date")
    List<Material> findRecentMaterials(@Param("date") java.time.LocalDateTime date);

    List<Material> findBySubjectIdOrderByUploadedAtDesc(Long subjectId);

    List<Material> findByStudentClassIdOrderByUploadedAtDesc(Long classId);

    List<Material> findByTeacherIdOrderByUploadedAtDesc(Long teacherId);
}