package com.university.sms.service;

import com.university.sms.dto.response.MaterialResponse;
import com.university.sms.model.ClassSubject;
import java.util.List;

public interface StudentService {
    Long getStudentClass(Long userId);
    List<ClassSubject> getSubjectsByClass(Long classId);
    List<MaterialResponse> getMaterialsForStudent(Long classId, Long subjectId);
}
