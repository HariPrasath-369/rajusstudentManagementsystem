package com.university.sms.controller;

import com.university.sms.dto.request.AttendanceRequest;
import com.university.sms.dto.response.ApiResponse;
import com.university.sms.dto.response.AttendanceResponse;
import com.university.sms.dto.response.AttendanceStatisticsResponse;
import com.university.sms.security.CurrentUser;
import com.university.sms.security.UserPrincipal;
import com.university.sms.service.AttendanceService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/attendance")
@SecurityRequirement(name = "bearerAuth")
@Tag(name = "Attendance", description = "Attendance management APIs")
public class AttendanceController {

    @Autowired
    private AttendanceService attendanceService;

    @PostMapping("/mark")
    @PreAuthorize("hasAnyRole('TEACHER', 'CA')")
    @Operation(summary = "Mark attendance for a class")
    public ResponseEntity<List<AttendanceResponse>> markAttendance(@Valid @RequestBody AttendanceRequest request,
                                                                    @CurrentUser UserPrincipal currentUser) {
        List<AttendanceResponse> responses = attendanceService.markAttendance(request, currentUser.getId());
        return ResponseEntity.ok(responses);
    }

    @PutMapping("/{attendanceId}")
    @PreAuthorize("hasAnyRole('TEACHER', 'CA')")
    @Operation(summary = "Update attendance record")
    public ResponseEntity<AttendanceResponse> updateAttendance(@PathVariable Long attendanceId,
                                                                @RequestParam String status,
                                                                @CurrentUser UserPrincipal currentUser) {
        AttendanceResponse response = attendanceService.updateAttendance(attendanceId, status, currentUser.getId());
        return ResponseEntity.ok(response);
    }

    @PostMapping("/submit")
    @PreAuthorize("hasAnyRole('TEACHER', 'CA')")
    @Operation(summary = "Submit attendance for a class (makes it immutable)")
    public ResponseEntity<ApiResponse> submitAttendance(@RequestParam Long classId,
                                                         @RequestParam LocalDate date,
                                                         @CurrentUser UserPrincipal currentUser) {
        attendanceService.submitAttendance(classId, date, currentUser.getId());
        return ResponseEntity.ok(new ApiResponse(true, "Attendance submitted successfully"));
    }

    @GetMapping("/class/{classId}/date/{date}")
    @PreAuthorize("hasAnyRole('HOD', 'TEACHER', 'CA')")
    @Operation(summary = "Get attendance by class and date")
    public ResponseEntity<List<AttendanceResponse>> getAttendanceByClassAndDate(@PathVariable Long classId,
                                                                                 @PathVariable LocalDate date) {
        List<AttendanceResponse> attendance = attendanceService.getAttendanceByClassAndDate(classId, date);
        return ResponseEntity.ok(attendance);
    }

    @GetMapping("/student/{studentId}")
    @PreAuthorize("hasAnyRole('TEACHER', 'CA', 'HOD', 'PRINCIPAL')")
    @Operation(summary = "Get student attendance history")
    public ResponseEntity<Page<AttendanceResponse>> getStudentAttendance(@PathVariable Long studentId,
                                                                          Pageable pageable) {
        Page<AttendanceResponse> attendance = attendanceService.getStudentAttendance(studentId, pageable);
        return ResponseEntity.ok(attendance);
    }

    @GetMapping("/statistics/class/{classId}")
    @PreAuthorize("hasAnyRole('HOD', 'TEACHER', 'CA', 'PRINCIPAL')")
    @Operation(summary = "Get attendance statistics for a class")
    public ResponseEntity<AttendanceStatisticsResponse> getAttendanceStatistics(@PathVariable Long classId,
                                                                                 @RequestParam LocalDate startDate,
                                                                                 @RequestParam LocalDate endDate) {
        AttendanceStatisticsResponse statistics = attendanceService.getAttendanceStatistics(classId, startDate, endDate);
        return ResponseEntity.ok(statistics);
    }

    @PostMapping("/qr/generate")
    @PreAuthorize("hasAnyRole('TEACHER', 'CA')")
    @Operation(summary = "Generate QR code for attendance")
    public ResponseEntity<String> generateQrCode(@RequestParam Long classId,
                                                   @RequestParam LocalDate date,
                                                   @CurrentUser UserPrincipal currentUser) {
        String qrCode = attendanceService.generateQrCodeForAttendance(classId, date, currentUser.getId());
        return ResponseEntity.ok(qrCode);
    }

    @PostMapping("/qr/scan")
    @PreAuthorize("hasRole('STUDENT')")
    @Operation(summary = "Scan QR code to mark attendance")
    public ResponseEntity<ApiResponse> scanQrCode(@RequestParam String qrCode,
                                                   @CurrentUser UserPrincipal currentUser) {
        attendanceService.processQrAttendance(qrCode, currentUser.getId());
        return ResponseEntity.ok(new ApiResponse(true, "Attendance marked successfully"));
    }
}