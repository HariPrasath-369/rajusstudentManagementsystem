package com.university.sms.service;

import com.university.sms.dto.request.HodRequest;
import com.university.sms.dto.request.TeacherRequest;
import com.university.sms.dto.response.UserResponse;

import java.util.List;

public interface UserService {
    UserResponse createTeacher(TeacherRequest request, Long hodId);
    UserResponse updateTeacher(Long teacherId, TeacherRequest request, Long hodId);
    void deleteTeacher(Long teacherId, Long hodId);
    List<UserResponse> getTeachersByDepartment(Long hodId);
    void assignHod(HodRequest request);
    void updateHod(Long hodId, HodRequest request);
    void removeHod(Long hodId);
    List<UserResponse> getAllHods();
    UserResponse getUserById(Long id);
    List<UserResponse> getAvailableTeachers();
}