package com.university.sms.controller;

import com.university.sms.dto.request.ClassRequest;
import com.university.sms.dto.request.ClassSubjectRequest;
import com.university.sms.dto.response.ApiResponse;
import com.university.sms.dto.response.ClassResponse;
import com.university.sms.dto.response.StudentResponse;
import com.university.sms.security.CurrentUser;
import com.university.sms.security.UserPrincipal;
import com.university.sms.service.ClassService;
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
@RequestMapping("/api/classes")
@SecurityRequirement(name = "bearerAuth")
@Tag(name = "Classes", description = "Class management APIs")
public class ClassController {

    @Autowired
    private ClassService classService;

    @GetMapping
    @Operation(summary = "Get all classes")
    public ResponseEntity<List<ClassResponse>> getAllClasses() {
        List<ClassResponse> classes = classService.getAllClasses();
        return ResponseEntity.ok(classes);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get class by ID")
    public ResponseEntity<ClassResponse> getClassById(@PathVariable Long id) {
        ClassResponse classResponse = classService.getClassById(id);
        return ResponseEntity.ok(classResponse);
    }

    @PostMapping
    @PreAuthorize("hasRole('HOD')")
    @Operation(summary = "Create a new class")
    public ResponseEntity<ClassResponse> createClass(@Valid @RequestBody ClassRequest request,
                                                      @CurrentUser UserPrincipal currentUser) {
        ClassResponse response = classService.createClass(request, currentUser.getId());
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('HOD')")
    @Operation(summary = "Update class")
    public ResponseEntity<ClassResponse> updateClass(@PathVariable Long id,
                                                      @Valid @RequestBody ClassRequest request,
                                                      @CurrentUser UserPrincipal currentUser) {
        ClassResponse response = classService.updateClass(id, request, currentUser.getId());
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('HOD')")
    @Operation(summary = "Delete class")
    public ResponseEntity<ApiResponse> deleteClass(@PathVariable Long id,
                                                    @CurrentUser UserPrincipal currentUser) {
        classService.deleteClass(id, currentUser.getId());
        return ResponseEntity.ok(new ApiResponse(true, "Class deleted successfully"));
    }

    @GetMapping("/{id}/students")
    @Operation(summary = "Get students by class")
    public ResponseEntity<List<StudentResponse>> getStudentsByClass(@PathVariable Long id) {
        List<StudentResponse> students = classService.getStudentsByClass(id);
        return ResponseEntity.ok(students);
    }

    @PostMapping("/{classId}/subjects")
    @PreAuthorize("hasRole('HOD')")
    @Operation(summary = "Assign subjects to class")
    public ResponseEntity<ApiResponse> assignSubjects(@PathVariable Long classId,
                                                       @Valid @RequestBody ClassSubjectRequest request,
                                                       @CurrentUser UserPrincipal currentUser) {
        classService.assignSubjects(classId, request, currentUser.getId());
        return ResponseEntity.ok(new ApiResponse(true, "Subjects assigned successfully"));
    }

    @PostMapping("/{classId}/advisor")
    @PreAuthorize("hasRole('HOD')")
    @Operation(summary = "Assign class advisor")
    public ResponseEntity<ApiResponse> assignClassAdvisor(@PathVariable Long classId,
                                                           @RequestParam Long teacherId,
                                                           @CurrentUser UserPrincipal currentUser) {
        classService.assignClassAdvisor(classId, teacherId, currentUser.getId());
        return ResponseEntity.ok(new ApiResponse(true, "Class advisor assigned successfully"));
    }

    @GetMapping("/advisor/{advisorId}")
    @PreAuthorize("hasAnyRole('TEACHER', 'CA')")
    @Operation(summary = "Get classes by advisor")
    public ResponseEntity<List<ClassResponse>> getClassesByAdvisor(@PathVariable Long advisorId) {
        List<ClassResponse> classes = classService.getClassesByAdvisor(advisorId);
        return ResponseEntity.ok(classes);
    }
}