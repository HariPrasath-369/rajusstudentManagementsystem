package com.university.sms.controller;

import com.university.sms.dto.request.DepartmentRequest;
import com.university.sms.dto.request.HodRequest;
import com.university.sms.dto.response.ApiResponse;
import com.university.sms.dto.response.DashboardResponse;
import com.university.sms.dto.response.DepartmentResponse;
import com.university.sms.dto.response.UserResponse;
import com.university.sms.security.CurrentUser;
import com.university.sms.security.UserPrincipal;
import com.university.sms.service.*;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/principal")
@PreAuthorize("hasRole('PRINCIPAL')")
@SecurityRequirement(name = "bearerAuth")
@Tag(name = "Principal", description = "Principal management APIs")
public class PrincipalController {

    @Autowired
    private DepartmentService departmentService;

    @Autowired
    private UserService userService;

    @Autowired
    private AnalyticsService analyticsService;

    @Autowired
    private DashboardService dashboardService;

    @PostMapping("/departments")
    @Operation(summary = "Create a new department")
    public ResponseEntity<DepartmentResponse> createDepartment(@Valid @RequestBody DepartmentRequest request) {
        DepartmentResponse response = departmentService.createDepartment(request);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/departments/{id}")
    @Operation(summary = "Update department")
    public ResponseEntity<DepartmentResponse> updateDepartment(@PathVariable Long id, 
                                                                @Valid @RequestBody DepartmentRequest request) {
        DepartmentResponse response = departmentService.updateDepartment(id, request);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/departments/{id}")
    @Operation(summary = "Delete department")
    public ResponseEntity<ApiResponse> deleteDepartment(@PathVariable Long id) {
        departmentService.deleteDepartment(id);
        return ResponseEntity.ok(new ApiResponse(true, "Department deleted successfully"));
    }

    @PostMapping("/hods")
    @Operation(summary = "Assign HOD to department")
    public ResponseEntity<ApiResponse> assignHod(@Valid @RequestBody HodRequest request) {
        userService.assignHod(request);
        return ResponseEntity.ok(new ApiResponse(true, "HOD assigned successfully"));
    }

    @PutMapping("/hods/{hodId}")
    @Operation(summary = "Update HOD details")
    public ResponseEntity<ApiResponse> updateHod(@PathVariable Long hodId, @Valid @RequestBody HodRequest request) {
        userService.updateHod(hodId, request);
        return ResponseEntity.ok(new ApiResponse(true, "HOD updated successfully"));
    }

    @DeleteMapping("/hods/{hodId}")
    @Operation(summary = "Remove HOD")
    public ResponseEntity<ApiResponse> removeHod(@PathVariable Long hodId) {
        userService.removeHod(hodId);
        return ResponseEntity.ok(new ApiResponse(true, "HOD removed successfully"));
    }

    @GetMapping("/hods")
    @Operation(summary = "Get all HODs")
    public ResponseEntity<List<UserResponse>> getAllHods() {
        List<UserResponse> hods = userService.getAllHods();
        return ResponseEntity.ok(hods);
    }

    @GetMapping("/dashboard")
    @Operation(summary = "Get principal dashboard data")
    public ResponseEntity<DashboardResponse> getDashboard(@CurrentUser UserPrincipal currentUser) {
        DashboardResponse dashboard = dashboardService.getPrincipalDashboard(currentUser.getId());
        return ResponseEntity.ok(dashboard);
    }

    @GetMapping("/analytics/performance")
    @Operation(summary = "Get overall institution performance analytics")
    public ResponseEntity<?> getPerformanceAnalytics() {
        return ResponseEntity.ok(analyticsService.getInstitutionPerformance());
    }

    @GetMapping("/analytics/teacher-ranking")
    @Operation(summary = "Get teacher ranking system")
    public ResponseEntity<?> getTeacherRanking() {
        return ResponseEntity.ok(analyticsService.getTeacherRanking());
    }

    @GetMapping("/analytics/department-comparison")
    @Operation(summary = "Get department comparison charts")
    public ResponseEntity<?> getDepartmentComparison() {
        return ResponseEntity.ok(analyticsService.getDepartmentComparison());
    }

    @GetMapping("/analytics/student-failure-prediction")
    @Operation(summary = "AI-based student failure prediction")
    public ResponseEntity<?> getStudentFailurePrediction() {
        return ResponseEntity.ok(analyticsService.getStudentFailurePrediction());
    }
}