package com.university.sms.service;

import com.university.sms.model.Subject;
import java.util.List;

public interface SubjectService {
    List<Subject> getAllSubjects();
    Subject getSubjectById(Long id);
    List<Subject> getSubjectsByDepartment(Long deptId);
}
