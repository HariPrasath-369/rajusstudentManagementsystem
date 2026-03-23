package com.university.sms.service;

import com.university.sms.dto.request.AttendanceRequest;
import com.university.sms.dto.response.AttendanceResponse;
import com.university.sms.dto.response.AttendanceStatisticsResponse;
import com.university.sms.dto.response.StudentAttendanceDashboardResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.time.LocalDate;
import java.util.List;

public interface AttendanceService {
    List<AttendanceResponse> markAttendance(AttendanceRequest request, Long teacherId);
    AttendanceResponse updateAttendance(Long attendanceId, String status, Long teacherId);
    void submitAttendance(Long classId, LocalDate date, Long teacherId);
    List<AttendanceResponse> getAttendanceByClassAndDate(Long classId, LocalDate date);
    Page<AttendanceResponse> getStudentAttendance(Long studentId, Pageable pageable);
    List<AttendanceResponse> getStudentAttendanceHistory(Long studentId);
    AttendanceStatisticsResponse getAttendanceStatistics(Long classId, LocalDate startDate, LocalDate endDate);
    Double getStudentAttendancePercentage(Long studentId, Long subjectId);
    String generateQrCodeForAttendance(Long classId, LocalDate date, Long teacherId);
    void processQrAttendance(String qrCode, Long studentId);
    void checkAndSendLowAttendanceAlerts();
    StudentAttendanceDashboardResponse getStudentAttendanceDashboard(Long studentId);
}