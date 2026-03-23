package com.university.sms.service;

import com.university.sms.dto.request.LeaveRequest;
import com.university.sms.dto.request.LeaveApprovalRequest;
import com.university.sms.dto.response.LeaveResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface LeaveService {
    LeaveResponse applyLeave(LeaveRequest request, Long studentId);
    Page<LeaveResponse> getMyLeaves(Long studentId, Pageable pageable);
    List<LeaveResponse> getStudentLeaves(Long studentId);
    List<LeaveResponse> getPendingLeaves(Long teacherId);
    List<LeaveResponse> getLeavesByClass(Long classId);
    void approveLeave(Long leaveId, LeaveApprovalRequest request, Long approverId);
    void rejectLeave(Long leaveId, LeaveApprovalRequest request, Long approverId);
    void cancelLeave(Long leaveId, Long studentId);
    LeaveResponse getLeaveDetails(Long leaveId, Long userId);
}