package com.university.sms.validator;

import com.university.sms.dto.request.TimetableRequest;
import com.university.sms.repository.TimetableRepository;
import com.university.sms.repository.TeacherRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

@Component
public class TimetableConflictValidator {

    @Autowired
    private TimetableRepository timetableRepository;

    @Autowired
    private TeacherRepository teacherRepository;

    public List<String> validate(TimetableRequest request) {
        List<String> conflicts = new ArrayList<>();

        // Validate time range
        if (request.getStartTime().isAfter(request.getEndTime())) {
            conflicts.add("Start time must be before end time");
            return conflicts;
        }

        if (request.getStartTime().equals(request.getEndTime())) {
            conflicts.add("Start time and end time cannot be the same");
            return conflicts;
        }

        // Validate duration (max 2 hours per class)
        long durationMinutes = java.time.Duration.between(request.getStartTime(), request.getEndTime()).toMinutes();
        if (durationMinutes > 120) {
            conflicts.add("Class duration cannot exceed 2 hours");
        }

        if (durationMinutes < 30) {
            conflicts.add("Class duration must be at least 30 minutes");
        }

        // Validate working hours (8 AM to 6 PM)
        LocalTime minTime = LocalTime.of(8, 0);
        LocalTime maxTime = LocalTime.of(18, 0);
        
        if (request.getStartTime().isBefore(minTime) || request.getEndTime().isAfter(maxTime)) {
            conflicts.add("Timetable must be between 8:00 AM and 6:00 PM");
        }

        // Check for class conflicts
        long classConflicts = timetableRepository.countSubjectsByClassAndDay(
                request.getClassId(), request.getDayOfWeek());
        
        if (classConflicts >= 2) {
            conflicts.add("Maximum 2 subjects per day per class exceeded");
        }

        // Check for time conflicts in the same class
        List<?> timeConflicts = timetableRepository.findConflictingTimetables(
                request.getClassId(), request.getDayOfWeek(), 
                request.getStartTime(), request.getEndTime());
        
        if (!timeConflicts.isEmpty()) {
            conflicts.add("Time slot already occupied for this class");
        }

        // Check teacher availability
        List<com.university.sms.model.Timetable> teacherConflicts = timetableRepository.findByTeacherIdAndDayOfWeek(
                request.getTeacherId(), request.getDayOfWeek());
        
        for (com.university.sms.model.Timetable existing : teacherConflicts) {
            if (!(request.getEndTime().isBefore(existing.getStartTime()) || 
                  request.getStartTime().isAfter(existing.getEndTime()))) {
                conflicts.add("Teacher is already assigned to another class during this time");
                break;
            }
        }

        // Validate teacher exists and is active
        teacherRepository.findById(request.getTeacherId())
                .ifPresentOrElse(
                    teacher -> {
                        if (!teacher.getIsActive()) {
                            conflicts.add("Teacher is not active");
                        }
                    },
                    () -> conflicts.add("Teacher not found")
                );

        return conflicts;
    }

    public boolean hasConflicts(TimetableRequest request) {
        return !validate(request).isEmpty();
    }

    public String getConflictMessage(TimetableRequest request) {
        List<String> conflicts = validate(request);
        return conflicts.isEmpty() ? null : String.join(", ", conflicts);
    }
}