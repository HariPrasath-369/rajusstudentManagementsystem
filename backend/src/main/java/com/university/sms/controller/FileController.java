package com.university.sms.controller;

import com.university.sms.dto.response.ApiResponse;
import com.university.sms.dto.response.FileUploadResponse;
import com.university.sms.security.CurrentUser;
import com.university.sms.security.UserPrincipal;
import com.university.sms.service.FileStorageService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/files")
@SecurityRequirement(name = "bearerAuth")
@Tag(name = "Files", description = "File management APIs")
public class FileController {

    @Autowired
    private FileStorageService fileStorageService;

    @PostMapping("/upload")
    @PreAuthorize("hasAnyRole('TEACHER', 'CA', 'STUDENT')")
    @Operation(summary = "Upload a file")
    public ResponseEntity<FileUploadResponse> uploadFile(@RequestParam("file") MultipartFile file,
                                                          @RequestParam(required = false) String folder,
                                                          @CurrentUser UserPrincipal currentUser) {
        FileUploadResponse response = fileStorageService.uploadFile(file, folder, currentUser.getId());
        return ResponseEntity.ok(response);
    }

    @GetMapping("/download/{fileName}")
    @Operation(summary = "Download a file")
    public ResponseEntity<Resource> downloadFile(@PathVariable String fileName) {
        Resource resource = fileStorageService.downloadFile(fileName);
        String contentType = fileStorageService.getContentType(fileName);
        
        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(contentType))
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + resource.getFilename() + "\"")
                .body(resource);
    }

    @GetMapping("/view/{fileName}")
    @Operation(summary = "View a file (inline)")
    public ResponseEntity<Resource> viewFile(@PathVariable String fileName) {
        Resource resource = fileStorageService.downloadFile(fileName);
        String contentType = fileStorageService.getContentType(fileName);
        
        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(contentType))
                .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + resource.getFilename() + "\"")
                .body(resource);
    }

    @DeleteMapping("/{fileName}")
    @PreAuthorize("hasAnyRole('TEACHER', 'CA')")
    @Operation(summary = "Delete a file")
    public ResponseEntity<ApiResponse> deleteFile(@PathVariable String fileName,
                                                    @CurrentUser UserPrincipal currentUser) {
        fileStorageService.deleteFile(fileName, currentUser.getId());
        return ResponseEntity.ok(new ApiResponse(true, "File deleted successfully"));
    }
}