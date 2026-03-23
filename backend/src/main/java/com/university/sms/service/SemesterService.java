package com.university.sms.service;

import com.university.sms.dto.request.SemesterRequest;
import com.university.sms.model.Semester;
import java.util.List;

public interface SemesterService {
    List<Semester> getAllSemesters();
    Semester getSemesterById(Integer id);
    void approveSemester(SemesterRequest request, Long hodId);
}
