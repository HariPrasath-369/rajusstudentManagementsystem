package com.university.sms.service.impl;

import com.university.sms.exception.ResourceNotFoundException;
import com.university.sms.model.Student;
import com.university.sms.repository.StudentRepository;
import com.university.sms.service.StudentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class StudentServiceImpl implements StudentService {

    @Autowired
    private StudentRepository studentRepository;

    @Override
    public Long getStudentClass(Long userId) {
        Student student = studentRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found"));
        return student.getStudentClass().getId();
    }
}
