package com.university.sms.controller;

import com.university.sms.dto.request.*;
import com.university.sms.dto.response.*;
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
@RequestMapping("/api/hod")
@PreAuthorize("hasRole('HOD')")
@SecurityRequirement(name = "bearerAuth")
@Tag(name = "HOD", description = "HOD management APIs")
public class HodController {

    @Autowired
    private TeacherService teacherService;

    @Autowired
    private ClassService classService;

    @Autowired
    private SubjectService subjectService;

    @Autowired
    private TimetableService timetableService;

    @Autowired
    private SemesterService semesterService;

    @Autowired
    private AnalyticsService analyticsService;

    @Autowired
    private DashboardService dashboardService;

    @PostMapping("/teachers")
    @Operation(summary = "Create a new teacher")
    public ResponseEntity<UserResponse> createTeacher(@Valid @RequestBody TeacherRequest request,
                                                       @CurrentUser UserPrincipal currentUser) {
        UserResponse response = teacherService.createTeacher(request, currentUser.getId());
        return ResponseEntity.ok(response);
    }

    @GetMapping("/teachers")
    @Operation(summary = "Get all teachers in department")
    public ResponseEntity<List<UserResponse>> getTeachers(@CurrentUser UserPrincipal currentUser) {
        List<UserResponse> teachers = teacherService.getTeachersByDepartment(currentUser.getId());
        return ResponseEntity.ok(teachers);
    }

    @PutMapping("/teachers/{teacherId}")
    @Operation(summary = "Update teacher details")
    public ResponseEntity<UserResponse> updateTeacher(@PathVariable Long teacherId,
                                                       @Valid @RequestBody TeacherRequest request,
                                                       @CurrentUser UserPrincipal currentUser) {
        UserResponse response = teacherService.updateTeacher(teacherId, request, currentUser.getId());
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/teachers/{teacherId}")
    @Operation(summary = "Delete teacher")
    public ResponseEntity<ApiResponse> deleteTeacher(@PathVariable Long teacherId,
                                                      @CurrentUser UserPrincipal currentUser) {
        teacherService.deleteTeacher(teacherId, currentUser.getId());
        return ResponseEntity.ok(new ApiResponse(true, "Teacher deleted successfully"));
    }

    @PostMapping("/classes")
    @Operation(summary = "Create a new class")
    public ResponseEntity<ClassResponse> createClass(@Valid @RequestBody ClassRequest request,
                                                      @CurrentUser UserPrincipal currentUser) {
        ClassResponse response = classService.createClass(request, currentUser.getId());
        return ResponseEntity.ok(response);
    }

    @GetMapping("/classes")
    @Operation(summary = "Get all classes in department")
    public ResponseEntity<List<ClassResponse>> getClasses(@CurrentUser UserPrincipal currentUser) {
        List<ClassResponse> classes = classService.getClassesByDepartment(currentUser.getId());
        return ResponseEntity.ok(classes);
    }

    @PutMapping("/classes/{classId}")
    @Operation(summary = "Update class")
    public ResponseEntity<ClassResponse> updateClass(@PathVariable Long classId,
                                                      @Valid @RequestBody ClassRequest request,
                                                      @CurrentUser UserPrincipal currentUser) {
        ClassResponse response = classService.updateClass(classId, request, currentUser.getId());
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/classes/{classId}")
    @Operation(summary = "Delete class")
    public ResponseEntity<ApiResponse> deleteClass(@PathVariable Long classId,
                                                    @CurrentUser UserPrincipal currentUser) {
        classService.deleteClass(classId, currentUser.getId());
        return ResponseEntity.ok(new ApiResponse(true, "Class deleted successfully"));
    }

    @PostMapping("/classes/{classId}/subjects")
    @Operation(summary = "Assign subjects to class")
    public ResponseEntity<ApiResponse> assignSubjects(@PathVariable Long classId,
                                                       @Valid @RequestBody ClassSubjectRequest request,
                                                       @CurrentUser UserPrincipal currentUser) {
        classService.assignSubjects(classId, request, currentUser.getId());
        return ResponseEntity.ok(new ApiResponse(true, "Subjects assigned successfully"));
    }

    @PostMapping("/classes/{classId}/advisor")
    @Operation(summary = "Assign class advisor")
    public ResponseEntity<ApiResponse> assignClassAdvisor(@PathVariable Long classId,
                                                           @RequestParam Long teacherId,
                                                           @CurrentUser UserPrincipal currentUser) {
        classService.assignClassAdvisor(classId, teacherId, currentUser.getId());
        return ResponseEntity.ok(new ApiResponse(true, "Class advisor assigned successfully"));
    }

    @PostMapping("/timetable")
    @Operation(summary = "Create timetable entry")
    public ResponseEntity<TimetableResponse> createTimetable(@Valid @RequestBody TimetableRequest request,
                                                              @CurrentUser UserPrincipal currentUser) {
        TimetableResponse response = timetableService.createTimetableEntry(request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/timetable/generate")
    @Operation(summary = "Generate auto timetable")
    public ResponseEntity<ApiResponse> generateTimetable(@Valid @RequestBody AutoTimetableRequest request,
                                                          @CurrentUser UserPrincipal currentUser) {
        timetableService.generateAutoTimetable(request.getClassId(), 
                request.getSubjectIds(), request.getTeacherIds());
        return ResponseEntity.ok(new ApiResponse(true, "Timetable generated successfully"));
    }

    @GetMapping("/timetable/conflicts")
    @Operation(summary = "Detect timetable conflicts")
    public ResponseEntity<List<TimetableConflictResponse>> getTimetableConflicts(@CurrentUser UserPrincipal currentUser) {
        List<TimetableConflictResponse> conflicts = timetableService.detectConflicts(currentUser.getId());
        return ResponseEntity.ok(conflicts);
    }

    @PostMapping("/semester/approve")
    @Operation(summary = "Approve semester start")
    public ResponseEntity<ApiResponse> approveSemester(@Valid @RequestBody SemesterRequest request,
                                                        @CurrentUser UserPrincipal currentUser) {
        semesterService.approveSemester(request, currentUser.getId());
        return ResponseEntity.ok(new ApiResponse(true, "Semester approved successfully"));
    }

    @GetMapping("/dashboard")
    @Operation(summary = "Get HOD dashboard data")
    public ResponseEntity<DashboardResponse> getDashboard(@CurrentUser UserPrincipal currentUser) {
        DashboardResponse dashboard = dashboardService.getHodDashboard(currentUser.getId());
        return ResponseEntity.ok(dashboard);
    }

    @GetMapping("/analytics/workload")
    @Operation(summary = "Get teacher workload balancing")
    public ResponseEntity<List<TeacherWorkloadResponse>> getTeacherWorkload(@CurrentUser UserPrincipal currentUser) {
        List<TeacherWorkloadResponse> workload = analyticsService.getTeacherWorkload(currentUser.getId());
        return ResponseEntity.ok(workload);
    }
}