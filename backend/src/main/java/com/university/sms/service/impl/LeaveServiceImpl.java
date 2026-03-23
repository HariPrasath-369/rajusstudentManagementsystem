package com.university.sms.service.impl;

import com.university.sms.dto.request.LeaveApprovalRequest;
import com.university.sms.dto.request.LeaveRequest;
import com.university.sms.dto.response.LeaveResponse;
import com.university.sms.exception.BadRequestException;
import com.university.sms.exception.ResourceNotFoundException;
import com.university.sms.model.Leave;
import com.university.sms.model.Student;
import com.university.sms.model.User;
import com.university.sms.model.enums.LeaveStatus;
import com.university.sms.repository.LeaveRepository;
import com.university.sms.repository.StudentRepository;
import com.university.sms.repository.UserRepository;
import com.university.sms.service.EmailService;
import com.university.sms.service.LeaveService;
import com.university.sms.service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class LeaveServiceImpl implements LeaveService {

    @Autowired
    private LeaveRepository leaveRepository;

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private EmailService emailService;

    @Autowired
    private NotificationService notificationService;

    @Override
    @Transactional
    public LeaveResponse applyLeave(LeaveRequest request, Long studentId) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found"));

        if (request.getEndDate().isBefore(request.getStartDate())) {
            throw new BadRequestException("End date must be after start date");
        }

        // Check for overlapping leaves
        List<Leave> overlappingLeaves = leaveRepository.findOverlappingLeaves(
                studentId, request.getStartDate(), request.getEndDate());
        
        if (!overlappingLeaves.isEmpty()) {
            throw new BadRequestException("You already have a leave request for this period");
        }

        Leave leave = new Leave();
        leave.setStudent(student);
        leave.setStartDate(request.getStartDate());
        leave.setEndDate(request.getEndDate());
        leave.setReason(request.getReason());
        leave.setStatus(LeaveStatus.PENDING);
        leave.setAppliedAt(LocalDateTime.now());
        leave.setDocumentUrl(request.getDocumentUrl());

        leave = leaveRepository.save(leave);

        return mapToResponse(leave);
    }

    @Override
    public Page<LeaveResponse> getMyLeaves(Long studentId, Pageable pageable) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found"));
                
        return leaveRepository.findByStudent(student, pageable)
                .map(this::mapToResponse);
    }

    @Override
    public List<LeaveResponse> getStudentLeaves(Long studentId) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found"));
                
        return leaveRepository.findByStudent(student).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<LeaveResponse> getPendingLeaves(Long teacherId) {
        return leaveRepository.findByStatus(LeaveStatus.PENDING).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<LeaveResponse> getLeavesByClass(Long classId) {
        return leaveRepository.findByClassId(classId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void approveLeave(Long leaveId, LeaveApprovalRequest request, Long approverId) {
        Leave leave = leaveRepository.findById(leaveId)
                .orElseThrow(() -> new ResourceNotFoundException("Leave not found"));

        User approver = userRepository.findById(approverId)
                .orElseThrow(() -> new ResourceNotFoundException("Approver not found"));

        leave.setStatus(LeaveStatus.APPROVED);
        leave.setApprovedBy(approverId);
        leave.setApprovedAt(LocalDateTime.now());
        leaveRepository.save(leave);

        // Send notification to student
        notificationService.sendNotification(
                com.university.sms.dto.request.NotificationRequest.builder()
                        .userId(leave.getStudent().getUser().getId())
                        .title("Leave Approved")
                        .message(String.format("Your leave request from %s to %s has been approved",
                                leave.getStartDate(), leave.getEndDate()))
                        .type("LEAVE")
                        .build(),
                approverId);

        // Send email
        emailService.sendLeaveApprovalEmail(
                leave.getStudent().getUser().getEmail(),
                leave.getStudent().getUser().getName(),
                "Approved");
    }

    @Override
    @Transactional
    public void rejectLeave(Long leaveId, LeaveApprovalRequest request, Long approverId) {
        Leave leave = leaveRepository.findById(leaveId)
                .orElseThrow(() -> new ResourceNotFoundException("Leave not found"));

        User approver = userRepository.findById(approverId)
                .orElseThrow(() -> new ResourceNotFoundException("Approver not found"));

        leave.setStatus(LeaveStatus.REJECTED);
        leave.setApprovedBy(approverId);
        leave.setApprovedAt(LocalDateTime.now());
        leave.setRejectionReason(request.getRejectionReason());
        leaveRepository.save(leave);

        // Send notification to student
        notificationService.sendNotification(
                com.university.sms.dto.request.NotificationRequest.builder()
                        .userId(leave.getStudent().getUser().getId())
                        .title("Leave Rejected")
                        .message(String.format("Your leave request from %s to %s has been rejected. Reason: %s",
                                leave.getStartDate(), leave.getEndDate(), request.getRejectionReason()))
                        .type("LEAVE")
                        .build(),
                approverId);

        // Send email
        emailService.sendLeaveApprovalEmail(
                leave.getStudent().getUser().getEmail(),
                leave.getStudent().getUser().getName(),
                "Rejected");
    }

    @Override
    @Transactional
    public void cancelLeave(Long leaveId, Long studentId) {
        Leave leave = leaveRepository.findById(leaveId)
                .orElseThrow(() -> new ResourceNotFoundException("Leave not found"));

        if (!leave.getStudent().getId().equals(studentId)) {
            throw new BadRequestException("You can only cancel your own leaves");
        }

        if (leave.getStatus() != LeaveStatus.PENDING) {
            throw new BadRequestException("Cannot cancel a leave that is already processed");
        }

        leaveRepository.delete(leave);
    }

    @Override
    public LeaveResponse getLeaveDetails(Long leaveId, Long userId) {
        Leave leave = leaveRepository.findById(leaveId)
                .orElseThrow(() -> new ResourceNotFoundException("Leave not found"));
        return mapToResponse(leave);
    }

    private LeaveResponse mapToResponse(Leave leave) {
        return LeaveResponse.builder()
                .id(leave.getId())
                .studentId(leave.getStudent().getId())
                .studentName(leave.getStudent().getUser().getName())
                .rollNumber(leave.getStudent().getRollNumber())
                .startDate(leave.getStartDate())
                .endDate(leave.getEndDate())
                .reason(leave.getReason())
                .status(leave.getStatus())
                .appliedAt(leave.getAppliedAt())
                .approvedAt(leave.getApprovedAt())
                .rejectionReason(leave.getRejectionReason())
                .documentUrl(leave.getDocumentUrl())
                .build();
    }
}