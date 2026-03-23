package com.university.sms.repository;

import com.university.sms.model.Class;
import com.university.sms.model.Teacher;
import com.university.sms.model.Timetable;
import com.university.sms.model.enums.DayOfWeek;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalTime;
import java.util.List;

@Repository
public interface TimetableRepository extends JpaRepository<Timetable, Long> {

    List<Timetable> findByClassEntity(Class classEntity);

    List<Timetable> findByClassEntityAndDayOfWeek(Class classEntity, DayOfWeek dayOfWeek);

    List<Timetable> findByTeacher(Teacher teacher);

    List<Timetable> findByTeacherAndDayOfWeek(Teacher teacher, DayOfWeek dayOfWeek);

    List<Timetable> findByTeacherIdAndDayOfWeek(Long teacherId, DayOfWeek dayOfWeek);

    @Query("SELECT t FROM Timetable t WHERE t.classEntity.id = :classId " +
           "AND t.dayOfWeek = :dayOfWeek " +
           "AND ((t.startTime BETWEEN :startTime AND :endTime) " +
           "OR (t.endTime BETWEEN :startTime AND :endTime) " +
           "OR (t.startTime <= :startTime AND t.endTime >= :endTime))")
    List<Timetable> findConflictingTimetables(@Param("classId") Long classId,
                                               @Param("dayOfWeek") DayOfWeek dayOfWeek,
                                               @Param("startTime") LocalTime startTime,
                                               @Param("endTime") LocalTime endTime);

    @Query("SELECT COUNT(t) FROM Timetable t WHERE t.classEntity.id = :classId AND t.dayOfWeek = :dayOfWeek")
    long countSubjectsByClassAndDay(@Param("classId") Long classId, @Param("dayOfWeek") DayOfWeek dayOfWeek);

    @Query("SELECT COUNT(t) FROM Timetable t WHERE t.teacher.id = :teacherId AND t.dayOfWeek = :dayOfWeek")
    long countClassesByTeacherAndDay(@Param("teacherId") Long teacherId, @Param("dayOfWeek") DayOfWeek dayOfWeek);

    @Query("SELECT COUNT(t) FROM Timetable t WHERE t.teacher.id = :teacherId")
    int countClassesByTeacher(@Param("teacherId") Long teacherId);

    @Query(value = "SELECT COALESCE(SUM(EXTRACT(HOUR FROM (end_time - start_time))), 0) " +
           "FROM timetable WHERE teacher_id = :teacherId", nativeQuery = true)
    int getTotalHoursByTeacher(@Param("teacherId") Long teacherId);

    @Query("SELECT t FROM Timetable t WHERE t.classEntity.id = :classId ORDER BY t.dayOfWeek, t.startTime")
    List<Timetable> findByClassIdOrdered(@Param("classId") Long classId);

    @Query("SELECT t FROM Timetable t WHERE t.classEntity.department.id = :deptId")
    List<Timetable> findByDepartmentId(@Param("deptId") Long deptId);
}