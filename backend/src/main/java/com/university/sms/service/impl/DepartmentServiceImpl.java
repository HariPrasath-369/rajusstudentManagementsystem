package com.university.sms.service.impl;

import com.university.sms.dto.request.DepartmentRequest;
import com.university.sms.dto.response.DepartmentResponse;
import com.university.sms.exception.BadRequestException;
import com.university.sms.exception.ResourceNotFoundException;
import com.university.sms.model.Department;
import com.university.sms.repository.DepartmentRepository;
import com.university.sms.service.DepartmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class DepartmentServiceImpl implements DepartmentService {

    @Autowired
    private DepartmentRepository departmentRepository;

    @Override
    @Transactional
    public DepartmentResponse createDepartment(DepartmentRequest request) {
        if (departmentRepository.existsByName(request.getName())) {
            throw new BadRequestException("Department name already exists");
        }

        if (departmentRepository.existsByCode(request.getCode())) {
            throw new BadRequestException("Department code already exists");
        }

        Department department = new Department();
        department.setName(request.getName());
        department.setCode(request.getCode());
        department.setDescription(request.getDescription());
        department.setEstablishedYear(request.getEstablishedYear());

        department = departmentRepository.save(department);
        return mapToResponse(department);
    }

    @Override
    @Transactional
    public DepartmentResponse updateDepartment(Long id, DepartmentRequest request) {
        Department department = departmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Department not found"));

        if (!department.getName().equals(request.getName()) && 
            departmentRepository.existsByName(request.getName())) {
            throw new BadRequestException("Department name already exists");
        }

        department.setName(request.getName());
        department.setDescription(request.getDescription());
        department.setEstablishedYear(request.getEstablishedYear());

        department = departmentRepository.save(department);
        return mapToResponse(department);
    }

    @Override
    @Transactional
    public void deleteDepartment(Long id) {
        Department department = departmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Department not found"));

        if (department.getHod() != null) {
            throw new BadRequestException("Cannot delete department with assigned HOD");
        }

        departmentRepository.delete(department);
    }

    @Override
    public DepartmentResponse getDepartmentById(Long id) {
        Department department = departmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Department not found"));
        return mapToResponse(department);
    }

    @Override
    public List<DepartmentResponse> getAllDepartments() {
        return departmentRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<DepartmentResponse> getDepartmentsWithoutHod() {
        return departmentRepository.findDepartmentsWithoutHod().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    private DepartmentResponse mapToResponse(Department department) {
        return DepartmentResponse.builder()
                .id(department.getId())
                .name(department.getName())
                .code(department.getCode())
                .description(department.getDescription())
                .establishedYear(department.getEstablishedYear())
                .hodId(department.getHod() != null ? department.getHod().getId() : null)
                .hodName(department.getHod() != null ? department.getHod().getUser().getName() : null)
                .createdAt(department.getCreatedAt())
                .build();
    }
}