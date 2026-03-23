package com.university.sms.service.impl;

import com.university.sms.dto.request.HodRequest;
import com.university.sms.dto.request.TeacherRequest;
import com.university.sms.dto.response.UserResponse;
import com.university.sms.exception.BadRequestException;
import com.university.sms.exception.ResourceNotFoundException;
import com.university.sms.model.*;
import com.university.sms.model.enums.Role;
import com.university.sms.repository.*;
import com.university.sms.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private TeacherRepository teacherRepository;

    @Autowired
    private HodRepository hodRepository;

    @Autowired
    private DepartmentRepository departmentRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public UserResponse createTeacher(TeacherRequest request, Long hodId) {
        Hod hod = hodRepository.findById(hodId)
                .orElseThrow(() -> new ResourceNotFoundException("HOD not found"));

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email already exists");
        }

        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(Role.ROLE_TEACHER);
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
    @Transactional
    public UserResponse updateTeacher(Long teacherId, TeacherRequest request, Long hodId) {
        Teacher teacher = teacherRepository.findById(teacherId)
                .orElseThrow(() -> new ResourceNotFoundException("Teacher not found"));

        User user = teacher.getUser();
        user.setName(request.getName());
        user.setPhoneNumber(request.getPhoneNumber());
        
        if (request.getPassword() != null && !request.getPassword().isEmpty()) {
            user.setPassword(passwordEncoder.encode(request.getPassword()));
        }
        
        user = userRepository.save(user);

        teacher.setQualification(request.getQualification());
        teacher.setSpecialization(request.getSpecialization());
        teacherRepository.save(teacher);

        return mapToUserResponse(user);
    }

    @Override
    @Transactional
    public void deleteTeacher(Long teacherId, Long hodId) {
        Teacher teacher = teacherRepository.findById(teacherId)
                .orElseThrow(() -> new ResourceNotFoundException("Teacher not found"));

        User user = teacher.getUser();
        user.setIsActive(false);
        userRepository.save(user);
        
        teacher.setIsActive(false);
        teacherRepository.save(teacher);
    }

    @Override
    public List<UserResponse> getTeachersByDepartment(Long hodId) {
        Hod hod = hodRepository.findById(hodId)
                .orElseThrow(() -> new ResourceNotFoundException("HOD not found"));

        return teacherRepository.findByDepartmentAndIsActiveTrue(hod.getDepartment())
                .stream()
                .map(teacher -> mapToUserResponse(teacher.getUser()))
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void assignHod(HodRequest request) {
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Department department = departmentRepository.findById(request.getDepartmentId())
                .orElseThrow(() -> new ResourceNotFoundException("Department not found"));

        if (hodRepository.existsByDepartment(department)) {
            throw new BadRequestException("Department already has an HOD");
        }

        user.setRole(Role.ROLE_HOD);
        userRepository.save(user);

        Hod hod = new Hod();
        hod.setUser(user);
        hod.setDepartment(department);
        hod.setAppointmentDate(LocalDateTime.now());
        hod.setOfficeRoom(request.getOfficeRoom());
        hod.setIsActive(true);
        hod = hodRepository.save(hod);

        department.setHod(hod);
        departmentRepository.save(department);
    }

    @Override
    @Transactional
    public void updateHod(Long hodId, HodRequest request) {
        Hod hod = hodRepository.findById(hodId)
                .orElseThrow(() -> new ResourceNotFoundException("HOD not found"));

        hod.setOfficeRoom(request.getOfficeRoom());
        hodRepository.save(hod);
    }

    @Override
    @Transactional
    public void removeHod(Long hodId) {
        Hod hod = hodRepository.findById(hodId)
                .orElseThrow(() -> new ResourceNotFoundException("HOD not found"));

        Department department = hod.getDepartment();
        department.setHod(null);
        departmentRepository.save(department);

        User user = hod.getUser();
        user.setRole(Role.ROLE_TEACHER);
        userRepository.save(user);

        hod.setIsActive(false);
        hodRepository.save(hod);
    }

    @Override
    public List<UserResponse> getAllHods() {
        return hodRepository.findAllByIsActiveTrue().stream()
                .map(hod -> mapToUserResponse(hod.getUser()))
                .collect(Collectors.toList());
    }

    @Override
    public UserResponse getUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return mapToUserResponse(user);
    }

    private UserResponse mapToUserResponse(User user) {
        return UserResponse.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .role(user.getRole())
                .isActive(user.getIsActive())
                .emailVerified(user.getEmailVerified())
                .phoneNumber(user.getPhoneNumber())
                .profilePicture(user.getProfilePicture())
                .createdAt(user.getCreatedAt())
                .lastLogin(user.getLastLogin())
                .build();
    }
}