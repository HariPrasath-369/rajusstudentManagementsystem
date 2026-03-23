package com.university.sms.service.impl;

import com.university.sms.dto.request.MarksRequest;
import com.university.sms.dto.request.OemBoardRequest;
import com.university.sms.dto.response.MarksResponse;
import com.university.sms.dto.response.OemBoardEntry;
import com.university.sms.dto.response.OemBoardResponse;
import com.university.sms.exception.BadRequestException;
import com.university.sms.exception.ResourceNotFoundException;
import com.university.sms.model.*;
import com.university.sms.model.enums.MarksType;
import com.university.sms.repository.*;
import com.university.sms.service.EmailService;
import com.university.sms.service.MarksService;
import com.university.sms.service.NotificationService;
import com.university.sms.utils.ExcelUtils;
import com.university.sms.utils.PdfGenerator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class MarksServiceImpl implements MarksService {

    @Autowired
    private MarksRepository marksRepository;

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private SubjectRepository subjectRepository;

    @Autowired
    private ClassSubjectRepository classSubjectRepository;

    @Autowired
    private EmailService emailService;

    @Autowired
    private NotificationService notificationService;

    @Autowired
    private PdfGenerator pdfGenerator;

    @Override
    @Transactional
    public void uploadMarks(MarksRequest request, Long teacherId) {
        Subject subject = subjectRepository.findById(request.getSubjectId())
                .orElseThrow(() -> new ResourceNotFoundException("Subject not found"));

        for (Map.Entry<Long, Double> entry : request.getStudentMarks().entrySet()) {
            Student student = studentRepository.findById(entry.getKey())
                    .orElseThrow(() -> new ResourceNotFoundException("Student not found"));

            Marks marks = marksRepository
                    .findByStudentAndSubjectAndMarksTypeAndSemester(
                            student, subject, request.getMarksType(), request.getSemester())
                    .orElse(new Marks());

            marks.setStudent(student);
            marks.setSubject(subject);
            marks.setMarksType(request.getMarksType());
            marks.setMarksObtained(entry.getValue());
            marks.setMaxMarks(request.getMaxMarks());
            marks.setAcademicYear(request.getAcademicYear());
            marks.setSemester(request.getSemester());
            marks.setEnteredBy(teacherId);
            marks.setEnteredAt(LocalDateTime.now());
            marks.setIsPublished(false);

            marksRepository.save(marks);
        }
    }

    @Override
    @Transactional
    public void uploadMarksFromExcel(MultipartFile file, Long subjectId, Integer semester, Long teacherId) {
        try {
            List<Map<String, Object>> excelData = ExcelUtils.parseExcel(file);
            Subject subject = subjectRepository.findById(subjectId)
                    .orElseThrow(() -> new ResourceNotFoundException("Subject not found"));

            for (Map<String, Object> row : excelData) {
                String rollNumber = (String) row.get("Roll Number");
                Double marksObtained = ((Number) row.get("Marks")).doubleValue();

                Student student = studentRepository.findByRollNumber(rollNumber)
                        .orElseThrow(() -> new ResourceNotFoundException("Student not found: " + rollNumber));

                Marks marks = marksRepository
                        .findByStudentAndSubjectAndMarksTypeAndSemester(
                                student, subject, MarksType.ASSESSMENT, semester)
                        .orElse(new Marks());

                marks.setStudent(student);
                marks.setSubject(subject);
                marks.setMarksType(MarksType.ASSESSMENT);
                marks.setMarksObtained(marksObtained);
                marks.setMaxMarks(100.0);
                marks.setSemester(semester);
                marks.setEnteredBy(teacherId);
                marks.setEnteredAt(LocalDateTime.now());
                marks.setIsPublished(false);

                marksRepository.save(marks);
            }
        } catch (Exception e) {
            throw new BadRequestException("Error processing Excel file: " + e.getMessage());
        }
    }

    @Override
    @Transactional
    public void updateMarks(Long marksId, Double marksObtained, Long teacherId) {
        Marks marks = marksRepository.findById(marksId)
                .orElseThrow(() -> new ResourceNotFoundException("Marks not found"));

        if (marks.getIsPublished()) {
            throw new BadRequestException("Cannot update published marks");
        }

        marks.setMarksObtained(marksObtained);
        marksRepository.save(marks);
    }

    @Override
    @Transactional
    public void publishMarks(Long subjectId, Integer semester, Long teacherId) {
        List<Marks> marks = marksRepository.findBySubjectIdAndSemester(subjectId, semester);
        
        if (marks.isEmpty()) {
            throw new BadRequestException("No marks found to publish");
        }

        for (Marks mark : marks) {
            mark.setIsPublished(true);
            mark.setPublishedAt(LocalDateTime.now());
            marksRepository.save(mark);

            // Send notification to student
            notificationService.sendNotification(
                    com.university.sms.dto.request.NotificationRequest.builder()
                            .userId(mark.getStudent().getUser().getId())
                            .title("Marks Published")
                            .message(String.format("Your marks for %s (Semester %d) have been published", 
                                    mark.getSubject().getName(), semester))
                            .type("MARKS")
                            .build(),
                    teacherId);

            // Send email
            emailService.sendMarksPublishedEmail(
                    mark.getStudent().getUser().getEmail(),
                    mark.getStudent().getUser().getName(),
                    mark.getSubject().getName());
        }
    }

    @Override
    public List<MarksResponse> getMarksBySubject(Long subjectId, Integer semester) {
        return marksRepository.findBySubjectIdAndSemester(subjectId, semester).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<MarksResponse> getMarksByStudent(Long studentId) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found"));
                
        return marksRepository.findByStudent(student).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<MarksResponse> getStudentMarks(Long studentId) {
        return getMarksByStudent(studentId);
    }

    @Override
    public OemBoardResponse getOemBoard(Long classId, Long subjectId) {
        Subject subject = subjectRepository.findById(subjectId)
                .orElseThrow(() -> new ResourceNotFoundException("Subject not found"));
                
        List<Student> students = studentRepository.findByStudentClassId(classId);
        
        List<OemBoardEntry> entries = new ArrayList<>();
        for (Student student : students) {
            Marks assessment = marksRepository
                    .findByStudentAndSubjectAndMarksType(student, subject, MarksType.ASSESSMENT)
                    .orElse(null);
            Marks practical = marksRepository
                    .findByStudentAndSubjectAndMarksType(student, subject, MarksType.PRACTICAL)
                    .orElse(null);
            Marks semester = marksRepository
                    .findByStudentAndSubjectAndMarksType(student, subject, MarksType.SEMESTER)
                    .orElse(null);
            
            entries.add(OemBoardEntry.builder()
                    .studentId(student.getId())
                    .studentName(student.getUser().getName())
                    .rollNumber(student.getRollNumber())
                    .assessmentMarks(assessment != null ? assessment.getMarksObtained() : null)
                    .practicalMarks(practical != null ? practical.getMarksObtained() : null)
                    .semesterMarks(semester != null ? semester.getMarksObtained() : null)
                    .totalMarks(calculateTotal(assessment, practical, semester))
                    .build());
        }
        
        return OemBoardResponse.builder()
                .subjectId(subjectId)
                .subjectName(subject.getName())
                .classId(classId)
                .entries(entries)
                .build();
    }

    @Override
    @Transactional
    public void fillOemBoard(OemBoardRequest request, Long teacherId) {
        for (OemBoardEntry entry : request.getEntries()) {
            Student student = studentRepository.findById(entry.getStudentId())
                    .orElseThrow(() -> new ResourceNotFoundException("Student not found"));
            
            if (entry.getAssessmentMarks() != null) {
                saveOrUpdateMarks(student, request.getSubjectId(), MarksType.ASSESSMENT, 
                        entry.getAssessmentMarks(), request.getSemester(), teacherId);
            }
            
            if (entry.getPracticalMarks() != null) {
                saveOrUpdateMarks(student, request.getSubjectId(), MarksType.PRACTICAL, 
                        entry.getPracticalMarks(), request.getSemester(), teacherId);
            }
            
            if (entry.getSemesterMarks() != null) {
                saveOrUpdateMarks(student, request.getSubjectId(), MarksType.SEMESTER, 
                        entry.getSemesterMarks(), request.getSemester(), teacherId);
            }
        }
    }

    @Override
    public byte[] generateMarksheet(Long studentId, Integer semester) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found"));
        
        List<Marks> marks = marksRepository.findByStudentAndSemester(student, semester);
        
        List<Map<String, Object>> marksData = new ArrayList<>();
        double totalObtained = 0;
        double totalMax = 0;
        
        for (Marks mark : marks) {
            Map<String, Object> subjectMarks = new HashMap<>();
            subjectMarks.put("subject", mark.getSubject().getName());
            subjectMarks.put("marksObtained", mark.getMarksObtained());
            subjectMarks.put("maxMarks", mark.getMaxMarks());
            marksData.add(subjectMarks);
            
            totalObtained += mark.getMarksObtained();
            totalMax += mark.getMaxMarks();
        }
        
        double percentage = (totalObtained / totalMax) * 100;
        String result = percentage >= 40 ? "PASS" : "FAIL";
        
        try {
            return pdfGenerator.generateMarksheet(
                    student.getUser().getName(),
                    student.getRollNumber(),
                    student.getStudentClass().getClassName(),
                    marksData,
                    totalObtained,
                    percentage,
                    result
            );
        } catch (Exception e) {
            throw new BadRequestException("Error generating marksheet: " + e.getMessage());
        }
    }

    private void saveOrUpdateMarks(Student student, Long subjectId, MarksType marksType, 
                                    Double marks, Integer semester, Long teacherId) {
        Subject subject = subjectRepository.findById(subjectId)
                .orElseThrow(() -> new ResourceNotFoundException("Subject not found"));
        
        Marks existing = marksRepository
                .findByStudentAndSubjectAndMarksTypeAndSemester(student, subject, marksType, semester)
                .orElse(new Marks());
        
        existing.setStudent(student);
        existing.setSubject(subject);
        existing.setMarksType(marksType);
        existing.setMarksObtained(marks);
        existing.setMaxMarks(marksType == MarksType.SEMESTER ? 100.0 : 50.0);
        existing.setSemester(semester);
        existing.setEnteredBy(teacherId);
        existing.setEnteredAt(LocalDateTime.now());
        
        marksRepository.save(existing);
    }

    private Double calculateTotal(Marks assessment, Marks practical, Marks semester) {
        double total = 0;
        if (assessment != null && assessment.getMarksObtained() != null) {
            total += assessment.getMarksObtained();
        }
        if (practical != null && practical.getMarksObtained() != null) {
            total += practical.getMarksObtained();
        }
        if (semester != null && semester.getMarksObtained() != null) {
            total += semester.getMarksObtained();
        }
        return total;
    }

    private MarksResponse mapToResponse(Marks marks) {
        return MarksResponse.builder()
                .id(marks.getId())
                .studentId(marks.getStudent().getId())
                .studentName(marks.getStudent().getUser().getName())
                .rollNumber(marks.getStudent().getRollNumber())
                .subjectId(marks.getSubject().getId())
                .subjectName(marks.getSubject().getName())
                .subjectCode(marks.getSubject().getCode())
                .marksType(marks.getMarksType())
                .marksObtained(marks.getMarksObtained())
                .maxMarks(marks.getMaxMarks())
                .percentage(marks.getMarksObtained() != null && marks.getMaxMarks() != null ? 
                        (marks.getMarksObtained() / marks.getMaxMarks()) * 100 : null)
                .semester(marks.getSemester())
                .isPublished(marks.getIsPublished())
                .publishedAt(marks.getPublishedAt())
                .build();
    }
}