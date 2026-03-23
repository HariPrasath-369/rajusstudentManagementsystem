package com.university.sms.service.impl;

import com.university.sms.dto.request.TeacherRequest;
import com.university.sms.dto.response.AssignedClassResponse;
import com.university.sms.dto.response.UserResponse;
import com.university.sms.exception.ResourceNotFoundException;
import com.university.sms.model.Hod;
import com.university.sms.model.Teacher;
import com.university.sms.model.User;
import com.university.sms.model.enums.Role;
import com.university.sms.dto.response.StudentResponse;
import com.university.sms.dto.response.SubjectResponse;
import com.university.sms.repository.ClassRepository;
import com.university.sms.repository.HodRepository;
import com.university.sms.repository.TeacherRepository;
import com.university.sms.repository.UserRepository;
import com.university.sms.service.TeacherService;
import com.university.sms.model.Class;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class TeacherServiceImpl implements TeacherService {

    @Autowired
    private TeacherRepository teacherRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private HodRepository hodRepository;
    
    @Autowired
    private ClassRepository classRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public List<Teacher> getAllTeachers() {
        return teacherRepository.findAll();
    }

    @Override
    public Teacher getTeacherById(Long id) {
        return teacherRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Teacher not found"));
    }

    @Override
    @Transactional
    public void deleteTeacher(Long id) {
        Teacher teacher = getTeacherById(id);
        User user = teacher.getUser();
        user.setIsActive(false);
        userRepository.save(user);
    }

    @Override
    @Transactional
    public UserResponse createTeacher(TeacherRequest request, Long hodId) {
        Hod hod = hodRepository.findById(hodId)
                .orElseThrow(() -> new ResourceNotFoundException("HOD not found"));

        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(Role.ROLE_TEACHER);
        user.setIsActive(true);
        user.setCreatedAt(LocalDateTime.now());
        user.setPhoneNumber(request.getPhoneNumber());
        
        user = userRepository.save(user);

        Teacher teacher = new Teacher();
        teacher.setUser(user);
        teacher.setDepartment(hod.getDepartment());
        teacher.setEmployeeId(request.getEmployeeId());
        teacher.setQualification(request.getQualification());
        teacher.setSpecialization(request.getSpecialization());
        teacher.setJoiningDate(LocalDateTime.now());
        teacher.setIsActive(true);

        teacherRepository.save(teacher);

        return mapToUserResponse(user);
    }

    @Override
    public List<UserResponse> getTeachersByDepartment(Long hodId) {
        Hod hod = hodRepository.findById(hodId)
                .orElseThrow(() -> new ResourceNotFoundException("HOD not found"));

        return teacherRepository.findByDepartment(hod.getDepartment()).stream()
                .map(t -> mapToUserResponse(t.getUser()))
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public UserResponse updateTeacher(Long id, TeacherRequest request, Long hodId) {
        Teacher teacher = teacherRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Teacher not found"));

        User user = teacher.getUser();
        user.setName(request.getName());
        user.setPhoneNumber(request.getPhoneNumber());
        userRepository.save(user);

        teacher.setQualification(request.getQualification());
        teacher.setSpecialization(request.getSpecialization());
        teacherRepository.save(teacher);

        return mapToUserResponse(user);
    }

    @Override
    @Transactional
    public void deleteTeacher(Long id, Long hodId) {
        deleteTeacher(id);
    }

    @Override
    @Transactional(readOnly = true)
    public List<AssignedClassResponse> getAssignedClasses(Long userId) {
        Teacher teacher = teacherRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Teacher not found"));
        
        return classRepository.findByAdvisorId(teacher.getId()).stream()
                .map(c -> AssignedClassResponse.builder()
                        .classId(c.getId())
                        .className(c.getClassName())
                        .year(c.getYear())
                        .section(c.getSection())
                        .studentCount(c.getStudents() != null ? c.getStudents().size() : 0)
                        .build())
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<StudentResponse> getStudentsByClass(Long classId) {
        Class classEntity = classRepository.findById(classId)
                .orElseThrow(() -> new ResourceNotFoundException("Class not found"));
        
        return classEntity.getStudents().stream()
                .map(s -> StudentResponse.builder()
                        .id(s.getId())
                        .userId(s.getUser().getId())
                        .name(s.getUser().getName())
                        .email(s.getUser().getEmail())
                        .rollNumber(s.getRollNumber())
                        .registrationNumber(s.getRegistrationNumber())
                        .classId(classId)
                        .className(classEntity.getClassName())
                        .build())
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<SubjectResponse> getSubjectsByClass(Long classId) {
        Class classEntity = classRepository.findById(classId)
                .orElseThrow(() -> new ResourceNotFoundException("Class not found"));
        
        return classEntity.getSubjects().stream()
                .map(cs -> SubjectResponse.builder()
                        .id(cs.getSubject().getId())
                        .name(cs.getSubject().getName())
                        .code(cs.getSubject().getCode())
                        .build())
                .collect(Collectors.toList());
    }

    private UserResponse mapToUserResponse(User user) {
        return UserResponse.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .role(user.getRole())
                .isActive(user.getIsActive())
                .phoneNumber(user.getPhoneNumber())
                .createdAt(user.getCreatedAt())
                .build();
    }
}
