package com.university.sms.controller;

import com.university.sms.dto.request.TimetableRequest;
import com.university.sms.dto.response.ApiResponse;
import com.university.sms.dto.response.TimetableResponse;
import com.university.sms.dto.response.WeeklyTimetableResponse;
import com.university.sms.dto.response.TeacherWorkloadResponse;
import com.university.sms.dto.response.TimetableConflictResponse;
import com.university.sms.security.CurrentUser;
import com.university.sms.security.UserPrincipal;
import com.university.sms.service.TimetableService;
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
@RequestMapping("/api/timetable")
@SecurityRequirement(name = "bearerAuth")
@Tag(name = "Timetable", description = "Timetable management APIs")
public class TimetableController {

    @Autowired
    private TimetableService timetableService;

    @PostMapping
    @PreAuthorize("hasAnyRole('HOD', 'PRINCIPAL')")
    @Operation(summary = "Create timetable entry")
    public ResponseEntity<TimetableResponse> createTimetable(@Valid @RequestBody TimetableRequest request) {
        TimetableResponse response = timetableService.createTimetableEntry(request);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('HOD', 'PRINCIPAL')")
    @Operation(summary = "Update timetable entry")
    public ResponseEntity<TimetableResponse> updateTimetable(@PathVariable Long id,
                                                              @Valid @RequestBody TimetableRequest request) {
        TimetableResponse response = timetableService.updateTimetableEntry(id, request);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('HOD', 'PRINCIPAL')")
    @Operation(summary = "Delete timetable entry")
    public ResponseEntity<ApiResponse> deleteTimetable(@PathVariable Long id) {
        timetableService.deleteTimetableEntry(id);
        return ResponseEntity.ok(new ApiResponse(true, "Timetable entry deleted successfully"));
    }

    @GetMapping("/class/{classId}")
    @Operation(summary = "Get timetable by class")
    public ResponseEntity<List<TimetableResponse>> getTimetableByClass(@PathVariable Long classId) {
        List<TimetableResponse> timetables = timetableService.getTimetableByClass(classId);
        return ResponseEntity.ok(timetables);
    }

    @GetMapping("/class/{classId}/weekly")
    @Operation(summary = "Get weekly timetable by class")
    public ResponseEntity<WeeklyTimetableResponse> getWeeklyTimetable(@PathVariable Long classId) {
        WeeklyTimetableResponse timetable = timetableService.getWeeklyTimetable(classId);
        return ResponseEntity.ok(timetable);
    }

    @GetMapping("/teacher/{teacherId}")
    @PreAuthorize("hasAnyRole('HOD', 'PRINCIPAL')")
    @Operation(summary = "Get timetable by teacher")
    public ResponseEntity<List<TimetableResponse>> getTimetableByTeacher(@PathVariable Long teacherId) {
        List<TimetableResponse> timetables = timetableService.getTimetableByTeacher(teacherId);
        return ResponseEntity.ok(timetables);
    }

    @GetMapping("/teacher/workload/{teacherId}")
    @PreAuthorize("hasAnyRole('HOD', 'PRINCIPAL')")
    @Operation(summary = "Get teacher workload")
    public ResponseEntity<TeacherWorkloadResponse> getTeacherWorkload(@PathVariable Long teacherId) {
        TeacherWorkloadResponse workload = timetableService.getTeacherWorkload(teacherId);
        return ResponseEntity.ok(workload);
    }

    @PostMapping("/generate")
    @PreAuthorize("hasRole('HOD')")
    @Operation(summary = "Generate auto timetable")
    public ResponseEntity<ApiResponse> generateAutoTimetable(@RequestParam Long classId,
                                                              @CurrentUser UserPrincipal currentUser) {
        timetableService.generateAutoTimetable(classId, currentUser.getId());
        return ResponseEntity.ok(new ApiResponse(true, "Timetable generated successfully"));
    }

    @GetMapping("/conflicts")
    @PreAuthorize("hasRole('HOD')")
    @Operation(summary = "Detect timetable conflicts")
    public ResponseEntity<List<TimetableConflictResponse>> detectConflicts(@CurrentUser UserPrincipal currentUser) {
        List<TimetableConflictResponse> conflicts = timetableService.detectConflicts(currentUser.getId());
        return ResponseEntity.ok(conflicts);
    }
}