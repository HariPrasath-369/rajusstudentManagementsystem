package com.university.sms.service.impl;

import com.university.sms.dto.request.SemesterRequest;
import com.university.sms.exception.ResourceNotFoundException;
import com.university.sms.model.Semester;
import com.university.sms.repository.SemesterRepository;
import com.university.sms.service.SemesterService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class SemesterServiceImpl implements SemesterService {

    @Autowired
    private SemesterRepository semesterRepository;

    @Override
    public List<Semester> getAllSemesters() {
        return semesterRepository.findAll();
    }

    @Override
    public Semester getSemesterById(Integer id) {
        return semesterRepository.findById(id.longValue())
                .map(s -> {
                    // Convert Long ID to Integer if necessary, but model has Long
                    return s;
                })
                .orElseThrow(() -> new ResourceNotFoundException("Semester not found"));
    }

    @Override
    @Transactional
    public void approveSemester(SemesterRequest request, Long hodId) {
        Semester semester = semesterRepository.findById(request.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Semester not found"));
        
        // Logical approval
        semesterRepository.save(semester);
    }
}
