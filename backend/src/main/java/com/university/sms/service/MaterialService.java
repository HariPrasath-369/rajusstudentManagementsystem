package com.university.sms.service;

import com.university.sms.dto.request.MaterialRequest;
import com.university.sms.dto.response.MaterialResponse;
import java.util.List;

public interface MaterialService {
    MaterialResponse uploadMaterial(MaterialRequest request, Long teacherId);
    List<MaterialResponse> getMaterialsBySubject(Long subjectId);
    List<MaterialResponse> getMaterialsByClass(Long classId);
    List<MaterialResponse> getMaterialsByTeacher(Long teacherId);
    void deleteMaterial(Long id, Long teacherId);
}
