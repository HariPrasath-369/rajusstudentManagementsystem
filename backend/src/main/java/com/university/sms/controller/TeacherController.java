package com.university.sms.controller;

import com.university.sms.dto.request.MarksRequest;
import com.university.sms.dto.request.MaterialRequest;
import com.university.sms.dto.request.OemBoardRequest;
import com.university.sms.dto.response.ApiResponse;
import com.university.sms.dto.response.AssignedClassResponse;
import com.university.sms.dto.response.DashboardResponse;
import com.university.sms.dto.response.MarksResponse;
import com.university.sms.dto.response.MaterialResponse;
import com.university.sms.dto.response.OemBoardResponse;
import com.university.sms.dto.response.StudentResponse;
import com.university.sms.dto.response.SubjectResponse;
import com.university.sms.security.CurrentUser;
import com.university.sms.security.UserPrincipal;
import com.university.sms.service.MarksService;
import com.university.sms.service.MaterialService;
import com.university.sms.service.TeacherService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/teacher")
@PreAuthorize("hasAnyRole('TEACHER', 'CA')")
@SecurityRequirement(name = "bearerAuth")
@Tag(name = "Teacher", description = "Teacher management APIs")
public class TeacherController {

    @Autowired
    private MarksService marksService;

    @Autowired
    private MaterialService materialService;

    @Autowired
    private TeacherService teacherService;

    @Autowired
    private com.university.sms.service.DashboardService dashboardService;

    @GetMapping("/dashboard")
    @Operation(summary = "Get teacher dashboard data")
    public ResponseEntity<DashboardResponse> getDashboard(@CurrentUser UserPrincipal currentUser) {
        DashboardResponse dashboard = dashboardService.getTeacherDashboard(currentUser.getId());
        return ResponseEntity.ok(dashboard);
    }

    @PostMapping("/marks")
    @Operation(summary = "Upload marks for students")
    public ResponseEntity<ApiResponse> uploadMarks(@Valid @RequestBody MarksRequest request,
                                                    @CurrentUser UserPrincipal currentUser) {
        marksService.uploadMarks(request, currentUser.getId());
        return ResponseEntity.ok(new ApiResponse(true, "Marks uploaded successfully"));
    }

    @PostMapping("/marks/excel")
    @Operation(summary = "Upload marks via Excel file")
    public ResponseEntity<ApiResponse> uploadMarksExcel(@RequestParam("file") MultipartFile file,
                                                         @RequestParam Long subjectId,
                                                         @RequestParam Integer semester,
                                                         @CurrentUser UserPrincipal currentUser) {
        marksService.uploadMarksFromExcel(file, subjectId, semester, currentUser.getId());
        return ResponseEntity.ok(new ApiResponse(true, "Marks uploaded successfully"));
    }

    @GetMapping("/marks/{subjectId}")
    @Operation(summary = "Get marks for a subject")
    public ResponseEntity<List<MarksResponse>> getMarks(@PathVariable Long subjectId,
                                                         @RequestParam Integer semester) {
        List<MarksResponse> marks = marksService.getMarksBySubject(subjectId, semester);
        return ResponseEntity.ok(marks);
    }

    @PutMapping("/marks/{marksId}")
    @Operation(summary = "Update marks")
    public ResponseEntity<ApiResponse> updateMarks(@PathVariable Long marksId,
                                                    @RequestParam Double marksObtained,
                                                    @CurrentUser UserPrincipal currentUser) {
        marksService.updateMarks(marksId, marksObtained, currentUser.getId());
        return ResponseEntity.ok(new ApiResponse(true, "Marks updated successfully"));
    }

    @PostMapping("/marks/publish")
    @Operation(summary = "Publish marks")
    public ResponseEntity<ApiResponse> publishMarks(@RequestParam Long subjectId,
                                                     @RequestParam Integer semester,
                                                     @CurrentUser UserPrincipal currentUser) {
        marksService.publishMarks(subjectId, semester, currentUser.getId());
        return ResponseEntity.ok(new ApiResponse(true, "Marks published successfully"));
    }

    @PostMapping("/materials")
    @Operation(summary = "Upload study materials")
    public ResponseEntity<MaterialResponse> uploadMaterial(@Valid @RequestBody MaterialRequest request,
                                                            @CurrentUser UserPrincipal currentUser) {
        MaterialResponse response = materialService.uploadMaterial(request, currentUser.getId());
        return ResponseEntity.ok(response);
    }

    @GetMapping("/materials")
    @Operation(summary = "Get uploaded materials")
    public ResponseEntity<List<MaterialResponse>> getMaterials(@CurrentUser UserPrincipal currentUser) {
        List<MaterialResponse> materials = materialService.getMaterialsByTeacher(currentUser.getId());
        return ResponseEntity.ok(materials);
    }

    @DeleteMapping("/materials/{materialId}")
    @Operation(summary = "Delete study material")
    public ResponseEntity<ApiResponse> deleteMaterial(@PathVariable Long materialId,
                                                       @CurrentUser UserPrincipal currentUser) {
        materialService.deleteMaterial(materialId, currentUser.getId());
        return ResponseEntity.ok(new ApiResponse(true, "Material deleted successfully"));
    }

    @GetMapping("/assigned-classes")
    @Operation(summary = "Get assigned classes")
    public ResponseEntity<List<AssignedClassResponse>> getAssignedClasses(@CurrentUser UserPrincipal currentUser) {
        List<AssignedClassResponse> classes = teacherService.getAssignedClasses(currentUser.getId());
        return ResponseEntity.ok(classes);
    }

    @GetMapping("/classes/{classId}/students")
    @Operation(summary = "Get students in a class")
    public ResponseEntity<List<StudentResponse>> getStudentsByClass(@PathVariable Long classId) {
        return ResponseEntity.ok(teacherService.getStudentsByClass(classId));
    }

    @GetMapping("/classes/{classId}/subjects")
    @Operation(summary = "Get subjects taught in a class")
    public ResponseEntity<List<SubjectResponse>> getSubjectsByClass(@PathVariable Long classId) {
        return ResponseEntity.ok(teacherService.getSubjectsByClass(classId));
    }

    @GetMapping("/oem-board")
    @Operation(summary = "Get OEM board data")
    public ResponseEntity<OemBoardResponse> getOemBoard(@RequestParam Long classId,
                                                         @RequestParam Long subjectId) {
        OemBoardResponse oemBoard = marksService.getOemBoard(classId, subjectId);
        return ResponseEntity.ok(oemBoard);
    }

    @PostMapping("/oem-board")
    @Operation(summary = "Fill OEM board")
    public ResponseEntity<ApiResponse> fillOemBoard(@Valid @RequestBody OemBoardRequest request,
                                                     @CurrentUser UserPrincipal currentUser) {
        marksService.fillOemBoard(request, currentUser.getId());
        return ResponseEntity.ok(new ApiResponse(true, "OEM board updated successfully"));
    }
}