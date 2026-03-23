package com.university.sms.service;

import com.university.sms.dto.request.MarksRequest;
import com.university.sms.dto.request.OemBoardRequest;
import com.university.sms.dto.response.MarksResponse;
import com.university.sms.dto.response.OemBoardResponse;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface MarksService {
    void uploadMarks(MarksRequest request, Long teacherId);
    void uploadMarksFromExcel(MultipartFile file, Long subjectId, Integer semester, Long teacherId);
    void updateMarks(Long marksId, Double marksObtained, Long teacherId);
    void publishMarks(Long subjectId, Integer semester, Long teacherId);
    List<MarksResponse> getMarksBySubject(Long subjectId, Integer semester);
    List<MarksResponse> getMarksByStudent(Long studentId);
    OemBoardResponse getOemBoard(Long classId, Long subjectId);
    void fillOemBoard(OemBoardRequest request, Long teacherId);
    byte[] generateMarksheet(Long studentId, Integer semester);
    List<MarksResponse> getStudentMarks(Long studentId);
}