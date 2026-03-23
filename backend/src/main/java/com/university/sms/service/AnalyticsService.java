package com.university.sms.service;

import com.university.sms.dto.response.*;

import java.util.List;
import java.util.Map;

public interface AnalyticsService {
    InstitutionPerformanceResponse getInstitutionPerformance();
    List<TeacherRankingResponse> getTeacherRanking();
    DepartmentComparisonResponse getDepartmentComparison();
    List<StudentRiskPredictionResponse> getStudentFailurePrediction();
    List<TeacherWorkloadResponse> getTeacherWorkload(Long departmentId);
    StudentPerformanceResponse getStudentPerformance(Long studentId);
    ClassPerformanceResponse getClassPerformance(Long classId);
    Map<String, Object> getAttendanceTrends(Long departmentId, String academicYear);
    MarksDistributionResponse getMarksDistribution(Long subjectId, Integer semester);
    byte[] exportPerformanceReport(String academicYear);
}