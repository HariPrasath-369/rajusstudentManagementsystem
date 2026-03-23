package com.university.sms.service.impl;

import com.university.sms.exception.ResourceNotFoundException;
import com.university.sms.model.Student;
import com.university.sms.model.ClassSubject;
import com.university.sms.model.Material;
import com.university.sms.repository.StudentRepository;
import com.university.sms.repository.ClassSubjectRepository;
import com.university.sms.repository.MaterialRepository;
import com.university.sms.service.StudentService;
import com.university.sms.dto.response.MaterialResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.ArrayList;
import java.util.stream.Collectors;
import org.springframework.transaction.annotation.Transactional;

@Service
public class StudentServiceImpl implements StudentService {

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private ClassSubjectRepository classSubjectRepository;

    @Autowired
    private MaterialRepository materialRepository;

    @Override
    public Long getStudentClass(Long userId) {
        Student student = studentRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found"));
        return student.getStudentClass() != null ? student.getStudentClass().getId() : null;
    }

    @Override
    public List<ClassSubject> getSubjectsByClass(Long classId) {
        // Find by class ID instead of classEntity object
        com.university.sms.model.Class classEntity = new com.university.sms.model.Class();
        classEntity.setId(classId);
        return classSubjectRepository.findByClassEntity(classEntity);
    }

    @Override
    @Transactional
    public List<MaterialResponse> getMaterialsForStudent(Long classId, Long subjectId) {
        if (classId == null) {
            return new ArrayList<>();
        }
        List<Material> materials;
        // Material uses getStudentClass() instead of getClassEntity() but repository finds by classId
        if (subjectId != null) {
            materials = materialRepository.findByStudentClassIdOrderByUploadedAtDesc(classId).stream()
                            .filter(m -> m.getSubject() != null && m.getSubject().getId().equals(subjectId))
                            .collect(Collectors.toList());
        } else {
            materials = materialRepository.findByStudentClassIdOrderByUploadedAtDesc(classId);
        }
        
        return materials.stream()
                .map(this::mapMaterialToResponse)
                .collect(Collectors.toList());
    }

    private MaterialResponse mapMaterialToResponse(Material material) {
        return MaterialResponse.builder()
                .id(material.getId())
                .title(material.getTitle())
                .description(material.getDescription())
                .fileType(material.getType() != null ? material.getType().name() : null)
                .fileUrl(material.getFileUrl())
                .subjectName(material.getSubject() != null ? material.getSubject().getName() : null)
                .className(material.getStudentClass() != null ? material.getStudentClass().getClassName() : null)
                .teacherName(material.getTeacher() != null ? material.getTeacher().getUser().getName() : null)
                .uploaderName(material.getTeacher() != null ? material.getTeacher().getUser().getName() : null)
                .createdAt(material.getUploadedAt())
                .build();
    }
}
