package com.university.sms.controller;

import com.university.sms.dto.request.LeaveRequest;
import com.university.sms.dto.request.LeaveApprovalRequest;
import com.university.sms.dto.response.ApiResponse;
import com.university.sms.dto.response.LeaveResponse;
import com.university.sms.security.CurrentUser;
import com.university.sms.security.UserPrincipal;
import com.university.sms.service.LeaveService;
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

import java.util.List;

@RestController
@RequestMapping("/api/leaves")
@SecurityRequirement(name = "bearerAuth")
@Tag(name = "Leaves", description = "Leave management APIs")
public class LeaveController {

    @Autowired
    private LeaveService leaveService;

    @PostMapping
    @PreAuthorize("hasRole('STUDENT')")
    @Operation(summary = "Apply for leave")
    public ResponseEntity<LeaveResponse> applyLeave(@Valid @RequestBody LeaveRequest request,
                                                     @CurrentUser UserPrincipal currentUser) {
        LeaveResponse response = leaveService.applyLeave(request, currentUser.getId());
        return ResponseEntity.ok(response);
    }

    @GetMapping
    @Operation(summary = "Get my leaves")
    public ResponseEntity<Page<LeaveResponse>> getMyLeaves(@CurrentUser UserPrincipal currentUser,
                                                            Pageable pageable) {
        Page<LeaveResponse> leaves = leaveService.getMyLeaves(currentUser.getId(), pageable);
        return ResponseEntity.ok(leaves);
    }

    @GetMapping("/pending")
    @PreAuthorize("hasAnyRole('TEACHER', 'CA', 'HOD')")
    @Operation(summary = "Get pending leaves")
    public ResponseEntity<List<LeaveResponse>> getPendingLeaves(@CurrentUser UserPrincipal currentUser) {
        List<LeaveResponse> leaves = leaveService.getPendingLeaves(currentUser.getId());
        return ResponseEntity.ok(leaves);
    }

    @GetMapping("/class/{classId}")
    @PreAuthorize("hasAnyRole('TEACHER', 'CA', 'HOD')")
    @Operation(summary = "Get leaves by class")
    public ResponseEntity<List<LeaveResponse>> getLeavesByClass(@PathVariable Long classId) {
        List<LeaveResponse> leaves = leaveService.getLeavesByClass(classId);
        return ResponseEntity.ok(leaves);
    }

    @PutMapping("/{leaveId}/approve")
    @PreAuthorize("hasAnyRole('TEACHER', 'CA', 'HOD')")
    @Operation(summary = "Approve leave")
    public ResponseEntity<ApiResponse> approveLeave(@PathVariable Long leaveId,
                                                     @Valid @RequestBody LeaveApprovalRequest request,
                                                     @CurrentUser UserPrincipal currentUser) {
        leaveService.approveLeave(leaveId, request, currentUser.getId());
        return ResponseEntity.ok(new ApiResponse(true, "Leave approved successfully"));
    }

    @PutMapping("/{leaveId}/reject")
    @PreAuthorize("hasAnyRole('TEACHER', 'CA', 'HOD')")
    @Operation(summary = "Reject leave")
    public ResponseEntity<ApiResponse> rejectLeave(@PathVariable Long leaveId,
                                                    @Valid @RequestBody LeaveApprovalRequest request,
                                                    @CurrentUser UserPrincipal currentUser) {
        leaveService.rejectLeave(leaveId, request, currentUser.getId());
        return ResponseEntity.ok(new ApiResponse(true, "Leave rejected"));
    }

    @DeleteMapping("/{leaveId}")
    @PreAuthorize("hasRole('STUDENT')")
    @Operation(summary = "Cancel leave")
    public ResponseEntity<ApiResponse> cancelLeave(@PathVariable Long leaveId,
                                                    @CurrentUser UserPrincipal currentUser) {
        leaveService.cancelLeave(leaveId, currentUser.getId());
        return ResponseEntity.ok(new ApiResponse(true, "Leave cancelled successfully"));
    }
}