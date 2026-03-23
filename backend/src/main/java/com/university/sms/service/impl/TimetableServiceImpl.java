package com.university.sms.service.impl;

import com.university.sms.dto.request.TimetableRequest;
import com.university.sms.dto.response.*;
import com.university.sms.exception.BadRequestException;
import com.university.sms.exception.ResourceNotFoundException;
import com.university.sms.model.*;
import com.university.sms.model.Class;
import com.university.sms.model.enums.DayOfWeek;
import com.university.sms.repository.*;
import com.university.sms.service.TimetableService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class TimetableServiceImpl implements TimetableService {

    @Autowired
    private TimetableRepository timetableRepository;

    @Autowired
    private ClassRepository classRepository;

    @Autowired
    private SubjectRepository subjectRepository;

    @Autowired
    private TeacherRepository teacherRepository;

    @Autowired
    private ClassSubjectRepository classSubjectRepository;

    @Override
    @Transactional
    public TimetableResponse createTimetableEntry(TimetableRequest request) {
        if (!validateTimetableConstraints(request)) {
            throw new BadRequestException("Timetable entry violates constraints");
        }

        com.university.sms.model.Class classEntity = classRepository.findById(request.getClassId())
                .orElseThrow(() -> new ResourceNotFoundException("Class not found"));

        Subject subject = subjectRepository.findById(request.getSubjectId())
                .orElseThrow(() -> new ResourceNotFoundException("Subject not found"));

        Teacher teacher = teacherRepository.findById(request.getTeacherId())
                .orElseThrow(() -> new ResourceNotFoundException("Teacher not found"));

        Timetable timetable = new Timetable();
        timetable.setClassEntity(classEntity);
        timetable.setSubject(subject);
        timetable.setTeacher(teacher);
        timetable.setDayOfWeek(request.getDayOfWeek());
        timetable.setStartTime(request.getStartTime());
        timetable.setEndTime(request.getEndTime());
        timetable.setRoomNumber(request.getRoomNumber());

        timetable = timetableRepository.save(timetable);
        
        return mapToResponse(timetable);
    }

    @Override
    @Transactional
    public TimetableResponse updateTimetableEntry(Long id, TimetableRequest request) {
        Timetable timetable = timetableRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Timetable entry not found"));

        if (!validateTimetableConstraints(request)) {
            throw new BadRequestException("Timetable entry violates constraints");
        }

        com.university.sms.model.Class classEntity = classRepository.findById(request.getClassId())
                .orElseThrow(() -> new ResourceNotFoundException("Class not found"));

        Subject subject = subjectRepository.findById(request.getSubjectId())
                .orElseThrow(() -> new ResourceNotFoundException("Subject not found"));

        Teacher teacher = teacherRepository.findById(request.getTeacherId())
                .orElseThrow(() -> new ResourceNotFoundException("Teacher not found"));

        timetable.setClassEntity(classEntity);
        timetable.setSubject(subject);
        timetable.setTeacher(teacher);
        timetable.setDayOfWeek(request.getDayOfWeek());
        timetable.setStartTime(request.getStartTime());
        timetable.setEndTime(request.getEndTime());
        timetable.setRoomNumber(request.getRoomNumber());

        timetable = timetableRepository.save(timetable);
        
        return mapToResponse(timetable);
    }

    @Override
    @Transactional
    public void deleteTimetableEntry(Long id) {
        timetableRepository.deleteById(id);
    }

    @Override
    public List<TimetableResponse> getTimetableByClass(Long classId) {
        com.university.sms.model.Class classEntity = classRepository.findById(classId)
                .orElseThrow(() -> new ResourceNotFoundException("Class not found"));
                
        return timetableRepository.findByClassEntity(classEntity)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public WeeklyTimetableResponse getWeeklyTimetable(Long classId) {
        com.university.sms.model.Class classEntity = classRepository.findById(classId)
                .orElseThrow(() -> new ResourceNotFoundException("Class not found"));
                
        List<Timetable> timetables = timetableRepository.findByClassEntity(classEntity);
        
        Map<DayOfWeek, List<TimetableResponse>> timetableByDay = timetables.stream()
                .map(this::mapToResponse)
                .collect(Collectors.groupingBy(TimetableResponse::getDayOfWeek));
        
        return WeeklyTimetableResponse.builder()
                .classId(classId)
                .className(classEntity.getClassName())
                .timetable(timetableByDay)
                .build();
    }

    @Override
    public List<TimetableResponse> getTimetableByTeacher(Long teacherId) {
        Teacher teacher = teacherRepository.findById(teacherId)
                .orElseThrow(() -> new ResourceNotFoundException("Teacher not found"));
                
        return timetableRepository.findByTeacher(teacher)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public TeacherWorkloadResponse getTeacherWorkload(Long teacherId) {
        Teacher teacher = teacherRepository.findById(teacherId)
                .orElseThrow(() -> new ResourceNotFoundException("Teacher not found"));
                
        List<Timetable> timetables = timetableRepository.findByTeacher(teacher);
        
        Map<DayOfWeek, Long> workloadByDay = timetables.stream()
                .collect(Collectors.groupingBy(Timetable::getDayOfWeek, Collectors.counting()));
        
        int totalHours = timetables.stream()
                .mapToInt(t -> t.getEndTime().getHour() - t.getStartTime().getHour())
                .sum();
        
        return TeacherWorkloadResponse.builder()
                .teacherId(teacherId)
                .teacherName(teacher.getUser().getName())
                .totalClasses(timetables.size())
                .totalHours(totalHours)
                .workloadByDay(workloadByDay)
                .build();
    }

    @Override
    @Transactional
    public void generateAutoTimetable(Long classId, Long hodId) {
        com.university.sms.model.Class classEntity = classRepository.findById(classId)
                .orElseThrow(() -> new ResourceNotFoundException("Class not found"));
        
        List<ClassSubject> classSubjects = classSubjectRepository.findByClassEntity(classEntity);
        
        if (classSubjects.isEmpty()) {
            throw new BadRequestException("No subjects assigned to this class");
        }
        
        // Clear existing timetable
        List<Timetable> existingTimetables = timetableRepository.findByClassEntity(classEntity);
        timetableRepository.deleteAll(existingTimetables);
        
        // Generate timetable: 5 days a week, max 2 subjects per day
        DayOfWeek[] days = {DayOfWeek.MONDAY, DayOfWeek.TUESDAY, DayOfWeek.WEDNESDAY, 
                            DayOfWeek.THURSDAY, DayOfWeek.FRIDAY};
        LocalTime[] timeSlots = {
            LocalTime.of(9, 0), LocalTime.of(10, 0), LocalTime.of(11, 0),
            LocalTime.of(14, 0), LocalTime.of(15, 0), LocalTime.of(16, 0)
        };
        
        int subjectIndex = 0;
        for (DayOfWeek day : days) {
            int subjectsPerDay = 0;
            for (LocalTime startTime : timeSlots) {
                if (subjectsPerDay >= 2) break;
                if (subjectIndex >= classSubjects.size()) subjectIndex = 0;
                
                ClassSubject classSubject = classSubjects.get(subjectIndex);
                
                Timetable timetable = new Timetable();
                timetable.setClassEntity(classEntity);
                timetable.setSubject(classSubject.getSubject());
                timetable.setTeacher(classSubject.getTeacher());
                timetable.setDayOfWeek(day);
                timetable.setStartTime(startTime);
                timetable.setEndTime(startTime.plusHours(1));
                timetable.setRoomNumber("Room " + (subjectIndex % 10 + 1));
                
                timetableRepository.save(timetable);
                subjectIndex++;
                subjectsPerDay++;
            }
        }
    }

    @Override
    @Transactional
    public void generateAutoTimetable(Long classId, List<Long> subjectIds, List<Long> teacherIds) {
        // Implementation for manual override
        generateAutoTimetable(classId, 0L); // Simplified for now
    }

    @Override
    public List<TimetableConflictResponse> detectConflicts(Long hodId) {
        List<TimetableConflictResponse> conflicts = new ArrayList<>();
        
        List<com.university.sms.model.Class> classes = classRepository.findAll();
        
        for (com.university.sms.model.Class classEntity : classes) {
            List<Timetable> timetables = timetableRepository.findByClassEntity(classEntity);
            
            // Check for class conflicts
            Map<String, List<Timetable>> byDayAndTime = timetables.stream()
                    .collect(Collectors.groupingBy(t -> t.getDayOfWeek() + "_" + t.getStartTime()));
            
            for (Map.Entry<String, List<Timetable>> entry : byDayAndTime.entrySet()) {
                if (entry.getValue().size() > 1) {
                    conflicts.add(TimetableConflictResponse.builder()
                            .type("CLASS_CONFLICT")
                            .classId(classEntity.getId())
                            .className(classEntity.getClassName())
                            .dayOfWeek(entry.getValue().get(0).getDayOfWeek())
                            .time(entry.getValue().get(0).getStartTime().toString())
                            .details("Multiple subjects scheduled at same time")
                            .build());
                }
            }
            
            // Check for 2 subjects per day constraint
            Map<DayOfWeek, Long> subjectsPerDay = timetables.stream()
                    .collect(Collectors.groupingBy(Timetable::getDayOfWeek, Collectors.counting()));
            
            for (Map.Entry<DayOfWeek, Long> entry : subjectsPerDay.entrySet()) {
                if (entry.getValue() > 2) {
                    conflicts.add(TimetableConflictResponse.builder()
                            .type("MAX_SUBJECTS_EXCEEDED")
                            .classId(classEntity.getId())
                            .className(classEntity.getClassName())
                            .dayOfWeek(entry.getKey())
                            .details("More than 2 subjects scheduled in a day")
                            .build());
                }
            }
        }
        
        // Check for teacher conflicts
        List<Teacher> teachers = teacherRepository.findAll();
        for (Teacher teacher : teachers) {
            List<Timetable> teacherTimetables = timetableRepository.findByTeacher(teacher);
            
            Map<String, List<Timetable>> byDayAndTime = teacherTimetables.stream()
                    .collect(Collectors.groupingBy(t -> t.getDayOfWeek() + "_" + t.getStartTime()));
            
            for (Map.Entry<String, List<Timetable>> entry : byDayAndTime.entrySet()) {
                if (entry.getValue().size() > 1) {
                    conflicts.add(TimetableConflictResponse.builder()
                            .type("TEACHER_CONFLICT")
                            .teacherId(teacher.getId())
                            .teacherName(teacher.getUser().getName())
                            .dayOfWeek(entry.getValue().get(0).getDayOfWeek())
                            .time(entry.getValue().get(0).getStartTime().toString())
                            .details("Teacher assigned to multiple classes at same time")
                            .build());
                }
            }
        }
        
        return conflicts;
    }

    @Override
    public boolean validateTimetableConstraints(TimetableRequest request) {
        // Check: Only 2 subjects per day per class
        long subjectsCount = timetableRepository.countSubjectsByClassAndDay(
                request.getClassId(), request.getDayOfWeek());
        
        if (subjectsCount >= 2) {
            return false;
        }
        
        // Check for time conflicts in the same class
        List<Timetable> conflicts = timetableRepository.findConflictingTimetables(
                request.getClassId(), request.getDayOfWeek(), 
                request.getStartTime(), request.getEndTime());
        
        if (!conflicts.isEmpty()) {
            return false;
        }
        
        // Check teacher availability
        List<Timetable> teacherConflicts = timetableRepository.findByTeacherIdAndDayOfWeek(
                request.getTeacherId(), request.getDayOfWeek());
        
        for (Timetable existing : teacherConflicts) {
            if (!(request.getEndTime().isBefore(existing.getStartTime()) || 
                  request.getStartTime().isAfter(existing.getEndTime()))) {
                return false;
            }
        }
        
        return true;
    }

    private TimetableResponse mapToResponse(Timetable timetable) {
        return TimetableResponse.builder()
                .id(timetable.getId())
                .classId(timetable.getClassEntity().getId())
                .className(timetable.getClassEntity().getClassName())
                .subjectId(timetable.getSubject().getId())
                .subjectName(timetable.getSubject().getName())
                .subjectCode(timetable.getSubject().getCode())
                .teacherId(timetable.getTeacher().getId())
                .teacherName(timetable.getTeacher().getUser().getName())
                .dayOfWeek(timetable.getDayOfWeek())
                .startTime(timetable.getStartTime())
                .endTime(timetable.getEndTime())
                .roomNumber(timetable.getRoomNumber())
                .build();
    }
}