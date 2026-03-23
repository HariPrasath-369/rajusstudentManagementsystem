package com.university.sms.service;

import com.university.sms.dto.request.TeacherRequest;
import com.university.sms.dto.response.UserResponse;
import com.university.sms.dto.response.AssignedClassResponse;
import com.university.sms.model.Teacher;
import com.university.sms.dto.response.StudentResponse;
import com.university.sms.dto.response.SubjectResponse;
import java.util.List;

public interface TeacherService {
    List<Teacher> getAllTeachers();
    Teacher getTeacherById(Long id);
    void deleteTeacher(Long id);
    
    UserResponse createTeacher(TeacherRequest request, Long hodId);
    List<UserResponse> getTeachersByDepartment(Long hodId);
    UserResponse updateTeacher(Long id, TeacherRequest request, Long hodId);
    void deleteTeacher(Long id, Long hodId);
    List<AssignedClassResponse> getAssignedClasses(Long teacherId);
    List<StudentResponse> getStudentsByClass(Long classId);
    List<SubjectResponse> getSubjectsByClass(Long classId);
}
