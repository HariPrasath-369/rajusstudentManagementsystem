package com.university.sms.controller;

import com.university.sms.dto.request.LeaveRequest;
import com.university.sms.dto.response.*;
import com.university.sms.security.CurrentUser;
import com.university.sms.security.UserPrincipal;
import com.university.sms.service.*;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/student")
@PreAuthorize("hasRole('STUDENT')")
@SecurityRequirement(name = "bearerAuth")
@Tag(name = "Student", description = "Student APIs")
public class StudentController {

    @Autowired
    private AttendanceService attendanceService;

    @Autowired
    private LeaveService leaveService;

    @Autowired
    private TimetableService timetableService;

    @Autowired
    private MarksService marksService;

    @Autowired
    private StudentService studentService;

    @Autowired
    private AnalyticsService analyticsService;

    @Autowired
    private DashboardService dashboardService;

    @GetMapping("/attendance")
    @Operation(summary = "Get attendance percentage")
    public ResponseEntity<Double> getAttendance(@CurrentUser UserPrincipal currentUser) {
        Double attendance = attendanceService.getStudentAttendancePercentage(
                currentUser.getId(), null);
        return ResponseEntity.ok(attendance);
    }

    @GetMapping("/attendance/subject/{subjectId}")
    @Operation(summary = "Get attendance for specific subject")
    public ResponseEntity<Double> getSubjectAttendance(@CurrentUser UserPrincipal currentUser,
                                                        @PathVariable Long subjectId) {
        Double attendance = attendanceService.getStudentAttendancePercentage(
                currentUser.getId(), subjectId);
        return ResponseEntity.ok(attendance);
    }

    @GetMapping("/attendance/history")
    @Operation(summary = "Get attendance history")
    public ResponseEntity<Page<AttendanceResponse>> getAttendanceHistory(
            @CurrentUser UserPrincipal currentUser, Pageable pageable) {
        Page<AttendanceResponse> history = attendanceService.getStudentAttendance(
                currentUser.getId(), pageable);
        return ResponseEntity.ok(history);
    }

    @PostMapping("/leaves")
    @Operation(summary = "Apply for leave")
    public ResponseEntity<LeaveResponse> applyLeave(@Valid @RequestBody LeaveRequest request,
                                                     @CurrentUser UserPrincipal currentUser) {
        LeaveResponse response = leaveService.applyLeave(request, currentUser.getId());
        return ResponseEntity.ok(response);
    }

    @GetMapping("/leaves")
    @Operation(summary = "Get leave history")
    public ResponseEntity<List<LeaveResponse>> getLeaves(@CurrentUser UserPrincipal currentUser) {
        List<LeaveResponse> leaves = leaveService.getStudentLeaves(currentUser.getId());
        return ResponseEntity.ok(leaves);
    }

    @GetMapping("/leaves/{leaveId}")
    @Operation(summary = "Get leave details")
    public ResponseEntity<LeaveResponse> getLeaveDetails(@PathVariable Long leaveId,
                                                          @CurrentUser UserPrincipal currentUser) {
        LeaveResponse leave = leaveService.getLeaveDetails(leaveId, currentUser.getId());
        return ResponseEntity.ok(leave);
    }

    @DeleteMapping("/leaves/{leaveId}")
    @Operation(summary = "Cancel leave application")
    public ResponseEntity<ApiResponse> cancelLeave(@PathVariable Long leaveId,
                                                    @CurrentUser UserPrincipal currentUser) {
        leaveService.cancelLeave(leaveId, currentUser.getId());
        return ResponseEntity.ok(new ApiResponse(true, "Leave cancelled successfully"));
    }

    @GetMapping("/timetable")
    @Operation(summary = "Get weekly timetable")
    public ResponseEntity<WeeklyTimetableResponse> getTimetable(@CurrentUser UserPrincipal currentUser) {
        Long classId = studentService.getStudentClass(currentUser.getId());
        WeeklyTimetableResponse timetable = timetableService.getWeeklyTimetable(classId);
        return ResponseEntity.ok(timetable);
    }

    @GetMapping("/marks")
    @Operation(summary = "Get student marks")
    public ResponseEntity<List<MarksResponse>> getMarks(@CurrentUser UserPrincipal currentUser) {
        List<MarksResponse> marks = marksService.getStudentMarks(currentUser.getId());
        return ResponseEntity.ok(marks);
    }

    @GetMapping("/marks/download")
    @Operation(summary = "Download marksheet as PDF")
    public ResponseEntity<byte[]> downloadMarksheet(@CurrentUser UserPrincipal currentUser,
                                                     @RequestParam Integer semester) {
        byte[] pdf = marksService.generateMarksheet(currentUser.getId(), semester);
        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_PDF)
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=marksheet_semester_" + semester + ".pdf")
                .body(pdf);
    }

    @GetMapping("/performance")
    @Operation(summary = "Get performance graph data")
    public ResponseEntity<StudentPerformanceResponse> getPerformanceGraph(@CurrentUser UserPrincipal currentUser) {
        StudentPerformanceResponse performance = analyticsService.getStudentPerformance(currentUser.getId());
        return ResponseEntity.ok(performance);
    }

    @GetMapping("/dashboard")
    @Operation(summary = "Get student dashboard data")
    public ResponseEntity<DashboardResponse> getDashboard(@CurrentUser UserPrincipal currentUser) {
        DashboardResponse dashboard = dashboardService.getStudentDashboard(currentUser.getId());
        return ResponseEntity.ok(dashboard);
    }
}