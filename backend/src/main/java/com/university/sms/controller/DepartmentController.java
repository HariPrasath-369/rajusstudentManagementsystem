package com.university.sms.controller;

import com.university.sms.dto.request.DepartmentRequest;
import com.university.sms.dto.response.ApiResponse;
import com.university.sms.dto.response.DepartmentResponse;
import com.university.sms.service.DepartmentService;
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
@RequestMapping("/api/departments")
@SecurityRequirement(name = "bearerAuth")
@Tag(name = "Departments", description = "Department management APIs")
public class DepartmentController {

    @Autowired
    private DepartmentService departmentService;

    @GetMapping
    @Operation(summary = "Get all departments")
    public ResponseEntity<List<DepartmentResponse>> getAllDepartments() {
        List<DepartmentResponse> departments = departmentService.getAllDepartments();
        return ResponseEntity.ok(departments);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get department by ID")
    public ResponseEntity<DepartmentResponse> getDepartmentById(@PathVariable Long id) {
        DepartmentResponse department = departmentService.getDepartmentById(id);
        return ResponseEntity.ok(department);
    }

    @PostMapping
    @PreAuthorize("hasRole('PRINCIPAL')")
    @Operation(summary = "Create a new department")
    public ResponseEntity<DepartmentResponse> createDepartment(@Valid @RequestBody DepartmentRequest request) {
        DepartmentResponse response = departmentService.createDepartment(request);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('PRINCIPAL')")
    @Operation(summary = "Update department")
    public ResponseEntity<DepartmentResponse> updateDepartment(@PathVariable Long id,
                                                                @Valid @RequestBody DepartmentRequest request) {
        DepartmentResponse response = departmentService.updateDepartment(id, request);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('PRINCIPAL')")
    @Operation(summary = "Delete department")
    public ResponseEntity<ApiResponse> deleteDepartment(@PathVariable Long id) {
        departmentService.deleteDepartment(id);
        return ResponseEntity.ok(new ApiResponse(true, "Department deleted successfully"));
    }

    @GetMapping("/without-hod")
    @PreAuthorize("hasRole('PRINCIPAL')")
    @Operation(summary = "Get departments without HOD")
    public ResponseEntity<List<DepartmentResponse>> getDepartmentsWithoutHod() {
        List<DepartmentResponse> departments = departmentService.getDepartmentsWithoutHod();
        return ResponseEntity.ok(departments);
    }
}