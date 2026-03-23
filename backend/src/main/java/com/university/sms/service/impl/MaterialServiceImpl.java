package com.university.sms.service.impl;

import com.university.sms.dto.request.MaterialRequest;
import com.university.sms.dto.response.MaterialResponse;
import com.university.sms.exception.ResourceNotFoundException;
import com.university.sms.model.Class;
import com.university.sms.model.Material;
import com.university.sms.model.Subject;
import com.university.sms.model.Teacher;
import com.university.sms.repository.ClassRepository;
import com.university.sms.repository.MaterialRepository;
import com.university.sms.repository.SubjectRepository;
import com.university.sms.repository.TeacherRepository;
import com.university.sms.service.FileStorageService;
import com.university.sms.service.MaterialService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class MaterialServiceImpl implements MaterialService {

    @Autowired
    private MaterialRepository materialRepository;

    @Autowired
    private TeacherRepository teacherRepository;

    @Autowired
    private SubjectRepository subjectRepository;

    @Autowired
    private ClassRepository classRepository;

    @Autowired
    private FileStorageService fileStorageService;

    @Override
    @Transactional
    public MaterialResponse uploadMaterial(MaterialRequest request, Long teacherId) {
        Teacher teacher = teacherRepository.findById(teacherId)
                .orElseThrow(() -> new ResourceNotFoundException("Teacher not found"));

        Subject subject = subjectRepository.findById(request.getSubjectId())
                .orElseThrow(() -> new ResourceNotFoundException("Subject not found"));

        Class classEntity = classRepository.findById(request.getClassId())
                .orElseThrow(() -> new ResourceNotFoundException("Class not found"));

        Material material = new Material();
        material.setTitle(request.getTitle());
        material.setDescription(request.getDescription());
        material.setTeacher(teacher);
        material.setSubject(subject);
        material.setStudentClass(classEntity);
        material.setFileType(request.getFileType());
        material.setFileUrl(request.getFileUrl());
        material.setUploadedAt(LocalDateTime.now());

        material = materialRepository.save(material);
        return mapToResponse(material);
    }

    @Override
    public List<MaterialResponse> getMaterialsBySubject(Long subjectId) {
        return materialRepository.findBySubjectIdOrderByUploadedAtDesc(subjectId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<MaterialResponse> getMaterialsByClass(Long classId) {
        return materialRepository.findByStudentClassIdOrderByUploadedAtDesc(classId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<MaterialResponse> getMaterialsByTeacher(Long teacherId) {
        return materialRepository.findByTeacherIdOrderByUploadedAtDesc(teacherId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void deleteMaterial(Long id, Long teacherId) {
        Material material = materialRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Material not found"));

        if (!material.getTeacher().getId().equals(teacherId)) {
            throw new ResourceNotFoundException("Material not found");
        }

        materialRepository.delete(material);
    }

    private MaterialResponse mapToResponse(Material material) {
        return MaterialResponse.builder()
                .id(material.getId())
                .title(material.getTitle())
                .description(material.getDescription())
                .teacherName(material.getTeacher().getUser().getName())
                .subjectName(material.getSubject().getName())
                .className(material.getStudentClass().getClassName())
                .uploaderName(material.getTeacher().getUser().getName())
                .fileUrl(material.getFileUrl())
                .fileType(material.getFileType())
                .createdAt(material.getUploadedAt())
                .build();
    }
}
