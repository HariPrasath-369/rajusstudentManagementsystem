package com.university.sms.controller;

import com.university.sms.dto.request.MarksRequest;
import com.university.sms.dto.request.OemBoardRequest;
import com.university.sms.dto.response.ApiResponse;
import com.university.sms.dto.response.MarksResponse;
import com.university.sms.dto.response.OemBoardResponse;
import com.university.sms.security.CurrentUser;
import com.university.sms.security.UserPrincipal;
import com.university.sms.service.MarksService;
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
@RequestMapping("/api/marks")
@SecurityRequirement(name = "bearerAuth")
@Tag(name = "Marks", description = "Marks management APIs")
public class MarksController {

    @Autowired
    private MarksService marksService;

    @PostMapping
    @PreAuthorize("hasRole('TEACHER')")
    @Operation(summary = "Upload marks")
    public ResponseEntity<ApiResponse> uploadMarks(@Valid @RequestBody MarksRequest request,
                                                    @CurrentUser UserPrincipal currentUser) {
        marksService.uploadMarks(request, currentUser.getId());
        return ResponseEntity.ok(new ApiResponse(true, "Marks uploaded successfully"));
    }

    @PostMapping("/excel")
    @PreAuthorize("hasRole('TEACHER')")
    @Operation(summary = "Upload marks via Excel")
    public ResponseEntity<ApiResponse> uploadMarksExcel(@RequestParam("file") MultipartFile file,
                                                         @RequestParam Long subjectId,
                                                         @RequestParam Integer semester,
                                                         @CurrentUser UserPrincipal currentUser) {
        marksService.uploadMarksFromExcel(file, subjectId, semester, currentUser.getId());
        return ResponseEntity.ok(new ApiResponse(true, "Marks uploaded successfully"));
    }

    @PutMapping("/{marksId}")
    @PreAuthorize("hasRole('TEACHER')")
    @Operation(summary = "Update marks")
    public ResponseEntity<ApiResponse> updateMarks(@PathVariable Long marksId,
                                                    @RequestParam Double marksObtained,
                                                    @CurrentUser UserPrincipal currentUser) {
        marksService.updateMarks(marksId, marksObtained, currentUser.getId());
        return ResponseEntity.ok(new ApiResponse(true, "Marks updated successfully"));
    }

    @PostMapping("/publish")
    @PreAuthorize("hasRole('TEACHER')")
    @Operation(summary = "Publish marks")
    public ResponseEntity<ApiResponse> publishMarks(@RequestParam Long subjectId,
                                                     @RequestParam Integer semester,
                                                     @CurrentUser UserPrincipal currentUser) {
        marksService.publishMarks(subjectId, semester, currentUser.getId());
        return ResponseEntity.ok(new ApiResponse(true, "Marks published successfully"));
    }

    @GetMapping("/subject/{subjectId}")
    @PreAuthorize("hasAnyRole('TEACHER', 'HOD', 'PRINCIPAL')")
    @Operation(summary = "Get marks by subject")
    public ResponseEntity<List<MarksResponse>> getMarksBySubject(@PathVariable Long subjectId,
                                                                   @RequestParam Integer semester) {
        List<MarksResponse> marks = marksService.getMarksBySubject(subjectId, semester);
        return ResponseEntity.ok(marks);
    }

    @GetMapping("/student/{studentId}")
    @PreAuthorize("hasAnyRole('TEACHER', 'HOD', 'PRINCIPAL', 'STUDENT')")
    @Operation(summary = "Get marks by student")
    public ResponseEntity<List<MarksResponse>> getMarksByStudent(@PathVariable Long studentId) {
        List<MarksResponse> marks = marksService.getMarksByStudent(studentId);
        return ResponseEntity.ok(marks);
    }

    @GetMapping("/oem-board")
    @Operation(summary = "Get OEM board")
    public ResponseEntity<OemBoardResponse> getOemBoard(@RequestParam Long classId,
                                                         @RequestParam Long subjectId) {
        OemBoardResponse oemBoard = marksService.getOemBoard(classId, subjectId);
        return ResponseEntity.ok(oemBoard);
    }

    @PostMapping("/oem-board")
    @PreAuthorize("hasRole('TEACHER')")
    @Operation(summary = "Fill OEM board")
    public ResponseEntity<ApiResponse> fillOemBoard(@Valid @RequestBody OemBoardRequest request,
                                                     @CurrentUser UserPrincipal currentUser) {
        marksService.fillOemBoard(request, currentUser.getId());
        return ResponseEntity.ok(new ApiResponse(true, "OEM board updated successfully"));
    }

    @GetMapping("/download-marksheet")
    @PreAuthorize("hasRole('STUDENT')")
    @Operation(summary = "Download marksheet")
    public ResponseEntity<byte[]> downloadMarksheet(@RequestParam Long studentId,
                                                     @RequestParam Integer semester) {
        byte[] pdf = marksService.generateMarksheet(studentId, semester);
        return ResponseEntity.ok()
                .header("Content-Type", "application/pdf")
                .header("Content-Disposition", "attachment; filename=marksheet.pdf")
                .body(pdf);
    }
}