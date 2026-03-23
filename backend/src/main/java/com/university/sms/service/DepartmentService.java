package com.university.sms.service;

import com.university.sms.dto.request.DepartmentRequest;
import com.university.sms.dto.response.DepartmentResponse;

import java.util.List;

public interface DepartmentService {
    DepartmentResponse createDepartment(DepartmentRequest request);
    DepartmentResponse updateDepartment(Long id, DepartmentRequest request);
    void deleteDepartment(Long id);
    DepartmentResponse getDepartmentById(Long id);
    List<DepartmentResponse> getAllDepartments();
    List<DepartmentResponse> getDepartmentsWithoutHod();
}