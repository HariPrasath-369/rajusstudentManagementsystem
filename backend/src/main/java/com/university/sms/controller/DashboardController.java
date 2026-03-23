package com.university.sms.controller;

import com.university.sms.dto.response.DashboardResponse;
import com.university.sms.security.CurrentUser;
import com.university.sms.security.UserPrincipal;
import com.university.sms.service.DashboardService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/dashboard")
@SecurityRequirement(name = "bearerAuth")
@Tag(name = "Dashboard", description = "Dashboard APIs")
public class DashboardController {

    @Autowired
    private DashboardService dashboardService;

    @GetMapping
    @Operation(summary = "Get dashboard data based on user role")
    public ResponseEntity<DashboardResponse> getDashboard(@CurrentUser UserPrincipal currentUser) {
        DashboardResponse dashboard = dashboardService.getDashboardByRole(currentUser);
        return ResponseEntity.ok(dashboard);
    }

    @GetMapping("/principal")
    @Operation(summary = "Get principal dashboard")
    public ResponseEntity<DashboardResponse> getPrincipalDashboard(@CurrentUser UserPrincipal currentUser) {
        DashboardResponse dashboard = dashboardService.getPrincipalDashboard(currentUser.getId());
        return ResponseEntity.ok(dashboard);
    }

    @GetMapping("/hod")
    @Operation(summary = "Get HOD dashboard")
    public ResponseEntity<DashboardResponse> getHodDashboard(@CurrentUser UserPrincipal currentUser) {
        DashboardResponse dashboard = dashboardService.getHodDashboard(currentUser.getId());
        return ResponseEntity.ok(dashboard);
    }

    @GetMapping("/teacher")
    @Operation(summary = "Get teacher dashboard")
    public ResponseEntity<DashboardResponse> getTeacherDashboard(@CurrentUser UserPrincipal currentUser) {
        DashboardResponse dashboard = dashboardService.getTeacherDashboard(currentUser.getId());
        return ResponseEntity.ok(dashboard);
    }

    @GetMapping("/student")
    @Operation(summary = "Get student dashboard")
    public ResponseEntity<DashboardResponse> getStudentDashboard(@CurrentUser UserPrincipal currentUser) {
        DashboardResponse dashboard = dashboardService.getStudentDashboard(currentUser.getId());
        return ResponseEntity.ok(dashboard);
    }
}