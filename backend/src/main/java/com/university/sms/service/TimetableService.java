package com.university.sms.service;

import com.university.sms.dto.request.TimetableRequest;
import com.university.sms.dto.response.*;

import java.util.List;

public interface TimetableService {
    TimetableResponse createTimetableEntry(TimetableRequest request);
    TimetableResponse updateTimetableEntry(Long id, TimetableRequest request);
    void deleteTimetableEntry(Long id);
    List<TimetableResponse> getTimetableByClass(Long classId);
    WeeklyTimetableResponse getWeeklyTimetable(Long classId);
    List<TimetableResponse> getTimetableByTeacher(Long teacherId);
    TeacherWorkloadResponse getTeacherWorkload(Long teacherId);
    void generateAutoTimetable(Long classId, Long hodId);
    void generateAutoTimetable(Long classId, List<Long> subjectIds, List<Long> teacherIds);
    List<TimetableConflictResponse> detectConflicts(Long hodId);
    boolean validateTimetableConstraints(TimetableRequest request);
}