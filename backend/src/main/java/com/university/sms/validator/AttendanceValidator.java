package com.university.sms.validator;

import com.university.sms.dto.request.AttendanceRequest;
import com.university.sms.model.enums.AttendanceStatus;
import com.university.sms.repository.AttendanceRepository;
import com.university.sms.repository.ClassRepository;
import com.university.sms.repository.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Component
public class AttendanceValidator {

    @Autowired
    private AttendanceRepository attendanceRepository;

    @Autowired
    private ClassRepository classRepository;

    @Autowired
    private StudentRepository studentRepository;

    public List<String> validate(AttendanceRequest request) {
        List<String> errors = new ArrayList<>();

        // Validate date
        if (request.getDate() == null) {
            errors.add("Date is required");
        } else {
            // Cannot mark attendance for future dates
            if (request.getDate().isAfter(LocalDate.now())) {
                errors.add("Cannot mark attendance for future dates");
            }

            // Cannot mark attendance for weekends (optional, depends on policy)
            if (request.getDate().getDayOfWeek() == DayOfWeek.SATURDAY || 
                request.getDate().getDayOfWeek() == DayOfWeek.SUNDAY) {
                errors.add("Attendance cannot be marked on weekends");
            }
        }

        // Validate class exists and is active
        classRepository.findById(request.getClassId())
                .ifPresentOrElse(
                    classEntity -> {
                        if (!classEntity.getIsActive()) {
                            errors.add("Class is not active");
                        }
                    },
                    () -> errors.add("Class not found")
                );

        // Validate student attendance data
        if (request.getStudentAttendance() == null || request.getStudentAttendance().isEmpty()) {
            errors.add("Student attendance data is required");
        } else {
            // Check if all students exist in the class
            for (Long studentId : request.getStudentAttendance().keySet()) {
                studentRepository.findById(studentId)
                        .ifPresentOrElse(
                            student -> {
                                if (student.getStudentClass() == null || 
                                    !student.getStudentClass().getId().equals(request.getClassId())) {
                                    errors.add("Student " + studentId + " is not enrolled in this class");
                                }
                                if (!student.getIsActive()) {
                                    errors.add("Student " + studentId + " is not active");
                                }
                            },
                            () -> errors.add("Student " + studentId + " not found")
                        );
            }

            // Validate attendance status values
            for (String status : request.getStudentAttendance().values()) {
                try {
                    AttendanceStatus.valueOf(status);
                } catch (IllegalArgumentException e) {
                    errors.add("Invalid attendance status: " + status + ". Must be PRESENT, ABSENT, LATE, or LEAVE");
                }
            }
        }

        // Check if attendance is already submitted for this date
        if (request.getDate() != null && request.getClassId() != null) {
            List<?> existingAttendance = attendanceRepository.findByClassEntityAndDate(
                    classRepository.getReferenceById(request.getClassId()), request.getDate());
            
            if (!existingAttendance.isEmpty()) {
                var firstAttendance = (com.university.sms.model.Attendance) existingAttendance.get(0);
                if (firstAttendance.getIsSubmitted()) {
                    errors.add("Attendance for this date has already been submitted and cannot be modified");
                }
            }
        }

        // Validate subject if provided
        if (request.getSubjectId() != null) {
            // Check if subject is assigned to this class
            classRepository.findById(request.getClassId()).ifPresent(classEntity -> {
                boolean subjectAssigned = classEntity.getSubjects().stream()
                        .anyMatch(cs -> cs.getSubject().getId().equals(request.getSubjectId()));
                if (!subjectAssigned) {
                    errors.add("Subject is not assigned to this class");
                }
            });
        }

        return errors;
    }

    public boolean isValid(AttendanceRequest request) {
        return validate(request).isEmpty();
    }

    public List<String> validateSubmission(Long classId, LocalDate date) {
        List<String> errors = new ArrayList<>();

        if (classId == null) {
            errors.add("Class ID is required");
        }

        if (date == null) {
            errors.add("Date is required");
        }

        if (classId != null && date != null) {
            List<?> attendance = attendanceRepository.findByClassEntityAndDate(
                    classRepository.getReferenceById(classId), date);
            
            if (attendance.isEmpty()) {
                errors.add("No attendance records found for this date");
            } else {
                var firstAttendance = (com.university.sms.model.Attendance) attendance.get(0);
                if (firstAttendance.getIsSubmitted()) {
                    errors.add("Attendance for this date has already been submitted");
                }
            }
        }

        return errors;
    }

    public boolean canSubmitAttendance(Long classId, LocalDate date) {
        return validateSubmission(classId, date).isEmpty();
    }

    public List<String> validateQrAttendance(String qrCode, Long studentId) {
        List<String> errors = new ArrayList<>();

        if (qrCode == null || qrCode.isEmpty()) {
            errors.add("QR code is required");
        }

        if (studentId == null) {
            errors.add("Student ID is required");
        } else {
            studentRepository.findById(studentId)
                    .ifPresentOrElse(
                        student -> {
                            if (!student.getIsActive()) {
                                errors.add("Student is not active");
                            }
                        },
                        () -> errors.add("Student not found")
                    );
        }

        // Validate QR code format
        if (qrCode != null && !qrCode.isEmpty()) {
            if (!qrCode.startsWith("ATT:")) {
                errors.add("Invalid QR code format");
            }
        }

        return errors;
    }
}