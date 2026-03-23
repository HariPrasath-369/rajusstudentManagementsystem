package com.university.sms.controller;

import com.university.sms.dto.response.*;
import com.university.sms.security.CurrentUser;
import com.university.sms.security.UserPrincipal;
import com.university.sms.service.AnalyticsService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/analytics")
@SecurityRequirement(name = "bearerAuth")
@Tag(name = "Analytics", description = "Analytics and reporting APIs")
public class AnalyticsController {

    @Autowired
    private AnalyticsService analyticsService;

    @GetMapping("/institution/performance")
    @PreAuthorize("hasRole('PRINCIPAL')")
    @Operation(summary = "Get institution performance analytics")
    public ResponseEntity<InstitutionPerformanceResponse> getInstitutionPerformance() {
        InstitutionPerformanceResponse performance = analyticsService.getInstitutionPerformance();
        return ResponseEntity.ok(performance);
    }

    @GetMapping("/teacher-ranking")
    @PreAuthorize("hasRole('PRINCIPAL')")
    @Operation(summary = "Get teacher ranking")
    public ResponseEntity<List<TeacherRankingResponse>> getTeacherRanking() {
        List<TeacherRankingResponse> ranking = analyticsService.getTeacherRanking();
        return ResponseEntity.ok(ranking);
    }

    @GetMapping("/department-comparison")
    @PreAuthorize("hasRole('PRINCIPAL')")
    @Operation(summary = "Get department comparison")
    public ResponseEntity<DepartmentComparisonResponse> getDepartmentComparison() {
        DepartmentComparisonResponse comparison = analyticsService.getDepartmentComparison();
        return ResponseEntity.ok(comparison);
    }

    @GetMapping("/student-failure-prediction")
    @PreAuthorize("hasAnyRole('PRINCIPAL', 'HOD', 'TEACHER')")
    @Operation(summary = "Get student failure prediction")
    public ResponseEntity<List<StudentRiskPredictionResponse>> getStudentFailurePrediction() {
        List<StudentRiskPredictionResponse> predictions = analyticsService.getStudentFailurePrediction();
        return ResponseEntity.ok(predictions);
    }

    @GetMapping("/teacher/workload/{departmentId}")
    @PreAuthorize("hasAnyRole('HOD', 'PRINCIPAL')")
    @Operation(summary = "Get teacher workload analysis")
    public ResponseEntity<List<TeacherWorkloadResponse>> getTeacherWorkload(@PathVariable Long departmentId) {
        List<TeacherWorkloadResponse> workload = analyticsService.getTeacherWorkload(departmentId);
        return ResponseEntity.ok(workload);
    }

    @GetMapping("/student/performance/{studentId}")
    @PreAuthorize("hasAnyRole('STUDENT', 'TEACHER', 'CA', 'HOD', 'PRINCIPAL')")
    @Operation(summary = "Get student performance analytics")
    public ResponseEntity<StudentPerformanceResponse> getStudentPerformance(@PathVariable Long studentId) {
        StudentPerformanceResponse performance = analyticsService.getStudentPerformance(studentId);
        return ResponseEntity.ok(performance);
    }

    @GetMapping("/class/performance/{classId}")
    @PreAuthorize("hasAnyRole('HOD', 'PRINCIPAL', 'TEACHER')")
    @Operation(summary = "Get class performance analytics")
    public ResponseEntity<ClassPerformanceResponse> getClassPerformance(@PathVariable Long classId) {
        ClassPerformanceResponse performance = analyticsService.getClassPerformance(classId);
        return ResponseEntity.ok(performance);
    }

    @GetMapping("/attendance/trends")
    @PreAuthorize("hasAnyRole('PRINCIPAL', 'HOD')")
    @Operation(summary = "Get attendance trends")
    public ResponseEntity<Map<String, Object>> getAttendanceTrends(@RequestParam Long departmentId,
                                                                    @RequestParam String academicYear) {
        Map<String, Object> trends = analyticsService.getAttendanceTrends(departmentId, academicYear);
        return ResponseEntity.ok(trends);
    }

    @GetMapping("/marks/distribution")
    @PreAuthorize("hasAnyRole('PRINCIPAL', 'HOD', 'TEACHER')")
    @Operation(summary = "Get marks distribution")
    public ResponseEntity<MarksDistributionResponse> getMarksDistribution(@RequestParam Long subjectId,
                                                                           @RequestParam Integer semester) {
        MarksDistributionResponse distribution = analyticsService.getMarksDistribution(subjectId, semester);
        return ResponseEntity.ok(distribution);
    }

    @GetMapping("/export/performance-report")
    @PreAuthorize("hasRole('PRINCIPAL')")
    @Operation(summary = "Export performance report")
    public ResponseEntity<byte[]> exportPerformanceReport(@RequestParam String academicYear) {
        byte[] report = analyticsService.exportPerformanceReport(academicYear);
        return ResponseEntity.ok()
                .header("Content-Type", "application/pdf")
                .header("Content-Disposition", "attachment; filename=performance_report_" + academicYear + ".pdf")
                .body(report);
    }
}