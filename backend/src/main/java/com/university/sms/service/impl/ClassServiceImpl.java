package com.university.sms.service.impl;

import com.university.sms.dto.request.ClassRequest;
import com.university.sms.dto.request.ClassSubjectRequest;
import com.university.sms.dto.response.ClassResponse;
import com.university.sms.dto.response.StudentResponse;
import com.university.sms.exception.BadRequestException;
import com.university.sms.exception.ResourceNotFoundException;
import com.university.sms.model.*;
import com.university.sms.repository.*;
import com.university.sms.service.ClassService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ClassServiceImpl implements ClassService {

    @Autowired
    private ClassRepository classRepository;

    @Autowired
    private DepartmentRepository departmentRepository;

    @Autowired
    private HodRepository hodRepository;

    @Autowired
    private TeacherRepository teacherRepository;

    @Autowired
    private SubjectRepository subjectRepository;

    @Autowired
    private ClassSubjectRepository classSubjectRepository;

    @Autowired
    private StudentRepository studentRepository;

    @Override
    @Transactional
    public ClassResponse createClass(ClassRequest request, Long hodId) {
        Department department = departmentRepository.findById(request.getDepartmentId())
                .orElseThrow(() -> new ResourceNotFoundException("Department not found"));

        if (classRepository.findByDepartmentAndYearAndSection(department, request.getYear(), request.getSection())
                .isPresent()) {
            throw new BadRequestException("Class already exists for this department, year, and section");
        }

        com.university.sms.model.Class classEntity = new com.university.sms.model.Class();
        classEntity.setDepartment(department);
        classEntity.setYear(request.getYear());
        classEntity.setSection(request.getSection());
        classEntity.setClassSize(request.getClassSize());
        classEntity.setIsActive(true);

        if (request.getAdvisorId() != null) {
            Teacher advisor = teacherRepository.findById(request.getAdvisorId())
                    .orElseThrow(() -> new ResourceNotFoundException("Teacher not found"));
            classEntity.setAdvisor(advisor);
        }

        classEntity = classRepository.save(classEntity);
        return mapToResponse(classEntity);
    }

    @Override
    @Transactional
    public ClassResponse updateClass(Long id, ClassRequest request, Long hodId) {
        com.university.sms.model.Class classEntity = classRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Class not found"));

        classEntity.setYear(request.getYear());
        classEntity.setSection(request.getSection());
        classEntity.setClassSize(request.getClassSize());

        if (request.getAdvisorId() != null) {
            Teacher advisor = teacherRepository.findById(request.getAdvisorId())
                    .orElseThrow(() -> new ResourceNotFoundException("Teacher not found"));
            classEntity.setAdvisor(advisor);
        }

        classEntity = classRepository.save(classEntity);
        return mapToResponse(classEntity);
    }

    @Override
    @Transactional
    public void deleteClass(Long id, Long hodId) {
        com.university.sms.model.Class classEntity = classRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Class not found"));

        long studentCount = studentRepository.countByStudentClass(classEntity);
        if (studentCount > 0) {
            throw new BadRequestException("Cannot delete class with enrolled students");
        }

        classEntity.setIsActive(false);
        classRepository.save(classEntity);
    }

    @Override
    public ClassResponse getClassById(Long id) {
        com.university.sms.model.Class classEntity = classRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Class not found"));
        return mapToResponse(classEntity);
    }

    @Override
    public List<ClassResponse> getAllClasses() {
        return classRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<ClassResponse> getClassesByDepartment(Long hodId) {
        Hod hod = hodRepository.findById(hodId)
                .orElseThrow(() -> new ResourceNotFoundException("HOD not found"));

        return classRepository.findByDepartment(hod.getDepartment()).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<StudentResponse> getStudentsByClass(Long classId) {
        com.university.sms.model.Class classEntity = classRepository.findById(classId)
                .orElseThrow(() -> new ResourceNotFoundException("Class not found"));

        return studentRepository.findByStudentClass(classEntity).stream()
                .map(this::mapToStudentResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void assignSubjects(Long classId, ClassSubjectRequest request, Long hodId) {
        com.university.sms.model.Class classEntity = classRepository.findById(classId)
                .orElseThrow(() -> new ResourceNotFoundException("Class not found"));

        for (Long subjectId : request.getSubjectIds()) {
            Subject subject = subjectRepository.findById(subjectId)
                    .orElseThrow(() -> new ResourceNotFoundException("Subject not found"));

            ClassSubject classSubject = new ClassSubject();
            classSubject.setClassEntity(classEntity);
            classSubject.setSubject(subject);
            
            if (request.getTeacherIds() != null && request.getTeacherIds().containsKey(subjectId)) {
                Teacher teacher = teacherRepository.findById(request.getTeacherIds().get(subjectId))
                        .orElseThrow(() -> new ResourceNotFoundException("Teacher not found"));
                classSubject.setTeacher(teacher);
            }
            
            classSubject.setAcademicYear(request.getAcademicYear());
            classSubject.setSemester(request.getSemester());
            
            classSubjectRepository.save(classSubject);
        }
    }

    @Override
    @Transactional
    public void assignClassAdvisor(Long classId, Long teacherId, Long hodId) {
        com.university.sms.model.Class classEntity = classRepository.findById(classId)
                .orElseThrow(() -> new ResourceNotFoundException("Class not found"));

        Teacher teacher = teacherRepository.findById(teacherId)
                .orElseThrow(() -> new ResourceNotFoundException("Teacher not found"));

        classEntity.setAdvisor(teacher);
        classRepository.save(classEntity);
    }

    @Override
    public List<ClassResponse> getClassesByAdvisor(Long advisorId) {
        return classRepository.findByAdvisorId(advisorId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    private ClassResponse mapToResponse(com.university.sms.model.Class classEntity) {
        return ClassResponse.builder()
                .id(classEntity.getId())
                .departmentId(classEntity.getDepartment().getId())
                .departmentName(classEntity.getDepartment().getName())
                .year(classEntity.getYear())
                .section(classEntity.getSection())
                .className(classEntity.getClassName())
                .classSize(classEntity.getClassSize())
                .advisorId(classEntity.getAdvisor() != null ? classEntity.getAdvisor().getId() : null)
                .advisorName(classEntity.getAdvisor() != null ? classEntity.getAdvisor().getUser().getName() : null)
                .studentCount(studentRepository.countByStudentClass(classEntity))
                .build();
    }

    private StudentResponse mapToStudentResponse(Student student) {
        return StudentResponse.builder()
                .id(student.getId())
                .userId(student.getUser().getId())
                .name(student.getUser().getName())
                .email(student.getUser().getEmail())
                .rollNumber(student.getRollNumber())
                .registrationNumber(student.getRegistrationNumber())
                .build();
    }
}