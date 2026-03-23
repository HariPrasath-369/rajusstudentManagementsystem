package com.university.sms.service;

import com.university.sms.dto.request.ClassRequest;
import com.university.sms.dto.request.ClassSubjectRequest;
import com.university.sms.dto.response.ClassResponse;
import com.university.sms.dto.response.StudentResponse;

import java.util.List;

public interface ClassService {
    ClassResponse createClass(ClassRequest request, Long hodId);
    ClassResponse updateClass(Long id, ClassRequest request, Long hodId);
    void deleteClass(Long id, Long hodId);
    ClassResponse getClassById(Long id);
    List<ClassResponse> getAllClasses();
    List<ClassResponse> getClassesByDepartment(Long hodId);
    List<StudentResponse> getStudentsByClass(Long classId);
    void assignSubjects(Long classId, ClassSubjectRequest request, Long hodId);
    void assignClassAdvisor(Long classId, Long teacherId, Long hodId);
    List<ClassResponse> getClassesByAdvisor(Long advisorId);
}