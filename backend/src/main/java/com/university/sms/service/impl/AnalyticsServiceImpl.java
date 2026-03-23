package com.university.sms.service.impl;

import com.university.sms.dto.response.*;
import com.university.sms.exception.ResourceNotFoundException;
import com.university.sms.model.*;
import com.university.sms.repository.*;
import com.university.sms.service.AnalyticsService;
import com.university.sms.utils.PdfGenerator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class AnalyticsServiceImpl implements AnalyticsService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private MarksRepository marksRepository;

    @Autowired
    private AttendanceRepository attendanceRepository;

    @Autowired
    private DepartmentRepository departmentRepository;

    @Autowired
    private TeacherRepository teacherRepository;

    @Autowired
    private TimetableRepository timetableRepository;

    @Autowired
    private ClassSubjectRepository classSubjectRepository;

    @Autowired
    private ClassRepository classRepository;

    @Autowired
    private SubjectRepository subjectRepository;

    @Autowired
    private PdfGenerator pdfGenerator;

    @Override
    public InstitutionPerformanceResponse getInstitutionPerformance() {
        long totalStudents = studentRepository.count();
        long totalTeachers = teacherRepository.count();
        long totalDepartments = departmentRepository.count();
        
        Double avgAttendance = attendanceRepository.getAverageAttendanceOverall();
        Double avgMarks = marksRepository.getAverageMarksOverall();
        
        List<Object[]> studentsByYearData = studentRepository.countStudentsByYearData();
        Map<String, Long> studentsByYear = studentsByYearData.stream()
                .collect(Collectors.toMap(r -> r[0].toString(), r -> ((Number) r[1]).longValue()));

        List<Object[]> passPercentageByDeptData = marksRepository.getPassPercentageByDepartment();
        Map<String, Double> passPercentageByDepartment = passPercentageByDeptData.stream()
                .collect(Collectors.toMap(r -> r[0].toString(), r -> ((Number) r[1]).doubleValue()));
        
        return InstitutionPerformanceResponse.builder()
                .totalStudents(totalStudents)
                .totalTeachers(totalTeachers)
                .totalDepartments(totalDepartments)
                .averageAttendance(avgAttendance != null ? avgAttendance : 0.0)
                .averageMarks(avgMarks != null ? avgMarks : 0.0)
                .studentsByYear(studentsByYear)
                .passPercentageByDepartment(passPercentageByDepartment)
                .build();
    }

    @Override
    public List<TeacherRankingResponse> getTeacherRanking() {
        List<Teacher> teachers = teacherRepository.findAll();
        List<TeacherRankingResponse> rankings = new ArrayList<>();
        
        for (Teacher teacher : teachers) {
            double averageMarks = marksRepository.getAverageMarksByTeacher(teacher.getId());
            double studentFeedback = getTeacherFeedback(teacher.getId());
            double attendanceRate = attendanceRepository.getAverageAttendanceByTeacher(teacher.getId());
            
            double overallScore = (averageMarks * 0.4) + (studentFeedback * 0.3) + (attendanceRate * 0.3);
            
            rankings.add(TeacherRankingResponse.builder()
                    .teacherId(teacher.getId())
                    .teacherName(teacher.getUser().getName())
                    .department(teacher.getDepartment().getName())
                    .averageMarks(averageMarks)
                    .studentFeedback(studentFeedback)
                    .attendanceRate(attendanceRate)
                    .overallScore(overallScore)
                    .build());
        }
        
        rankings.sort((a, b) -> Double.compare(b.getOverallScore(), a.getOverallScore()));
        return rankings;
    }

    @Override
    public DepartmentComparisonResponse getDepartmentComparison() {
        List<Department> departments = departmentRepository.findAll();
        Map<String, DepartmentStats> stats = new HashMap<>();
        
        for (Department dept : departments) {
            long studentCount = studentRepository.countByDepartment(dept.getId());
            long teacherCount = teacherRepository.countActiveByDepartmentId(dept.getId());
            
            Double avgAttendance = attendanceRepository.getAverageAttendanceByDepartment(dept.getId());
            Double avgMarks = marksRepository.getAverageMarksByDepartment(dept.getId());
            
            stats.put(dept.getName(), DepartmentStats.builder()
                    .studentCount(studentCount)
                    .teacherCount(teacherCount)
                    .averageAttendance(avgAttendance != null ? avgAttendance : 0.0)
                    .averageMarks(avgMarks != null ? avgMarks : 0.0)
                    .passRate(calculatePassRate(dept.getId()))
                    .build());
        }
        
        return DepartmentComparisonResponse.builder()
                .departmentStats(stats)
                .build();
    }

    @Override
    public List<TeacherWorkloadResponse> getTeacherWorkload(Long departmentId) {
        Department department = departmentRepository.findById(departmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Department not found"));
        
        List<Teacher> teachers = teacherRepository.findByDepartment(department);
        List<TeacherWorkloadResponse> workloads = new ArrayList<>();
        
        for (Teacher teacher : teachers) {
            int totalClasses = timetableRepository.countClassesByTeacher(teacher.getId());
            int totalSubjects = (int) classSubjectRepository.countSubjectsByTeacher(teacher.getId());
            int totalHours = timetableRepository.getTotalHoursByTeacher(teacher.getId());
            
            workloads.add(TeacherWorkloadResponse.builder()
                    .teacherId(teacher.getId())
                    .teacherName(teacher.getUser().getName())
                    .totalClasses(totalClasses)
                    .totalSubjects(totalSubjects)
                    .totalHours(totalHours)
                    .workloadPercentage((totalHours / 40.0) * 100)
                    .build());
        }
        
        return workloads;
    }

    @Override
    public List<StudentRiskPredictionResponse> getStudentFailurePrediction() {
        List<Student> students = studentRepository.findAll();
        List<StudentRiskPredictionResponse> predictions = new ArrayList<>();
        
        for (Student student : students) {
            double attendancePercentage = attendanceRepository.getAttendancePercentage(student.getId());
            double currentMarks = marksRepository.getAverageMarksByStudent(student.getId());
            
            double riskScore = calculateRiskScore(attendancePercentage, currentMarks);
            String riskLevel = getRiskLevel(riskScore);
            List<String> recommendations = getRecommendations(riskLevel);
            
            predictions.add(StudentRiskPredictionResponse.builder()
                    .studentId(student.getId())
                    .studentName(student.getUser().getName())
                    .rollNumber(student.getRollNumber())
                    .className(student.getStudentClass().getClassName())
                    .attendancePercentage(attendancePercentage)
                    .currentMarks(currentMarks)
                    .riskScore(riskScore)
                    .riskLevel(riskLevel)
                    .recommendations(recommendations)
                    .build());
        }
        
        return predictions;
    }

    @Override
    public StudentPerformanceResponse getStudentPerformance(Long studentId) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found"));
        
        List<Marks> marks = marksRepository.findByStudent(student);
        
        Map<String, List<Double>> subjectPerformance = new HashMap<>();
        for (Marks mark : marks) {
            subjectPerformance.computeIfAbsent(mark.getSubject().getName(), k -> new ArrayList<>())
                    .add(mark.getMarksObtained());
        }

        Double currentAvgMarks = marksRepository.getAverageMarksByStudent(studentId);
        Double currentAvgAttendance = attendanceRepository.getAverageAttendanceByStudent(studentId);
        
        List<PerformanceTrend> trend = new ArrayList<>();
        for (int i = 1; i <= 8; i++) {
            Double semAvg = marksRepository.getAverageMarksByStudentAndSemester(studentId, i);
            if (semAvg != null) {
                trend.add(PerformanceTrend.builder()
                        .semester(i)
                        .averageMarks(semAvg)
                        .build());
            }
        }
        
        List<Object[]> attendanceTrendData = attendanceRepository.getTrendData(studentId);
        // Process attendance trend if needed in the future
        
        return StudentPerformanceResponse.builder()
                .studentId(studentId)
                .studentName(student.getUser().getName())
                .rollNumber(student.getRollNumber())
                .className(student.getStudentClass().getClassName())
                .overallPercentage(currentAvgMarks != null ? currentAvgMarks : 0.0)
                .attendancePercentage((currentAvgAttendance != null ? currentAvgAttendance : 0.0) * 100.0)
                .performanceTrend(trend)
                .subjectPerformance(subjectPerformance)
                .build();
    }

    @Override
    public ClassPerformanceResponse getClassPerformance(Long classId) {
        com.university.sms.model.Class classEntity = classRepository.findById(classId)
                .orElseThrow(() -> new RuntimeException("Class not found"));
        
        List<Student> students = studentRepository.findByStudentClass(classEntity);
        
        double averageMarks = 0;
        double averageAttendance = 0;
        int toppers = 0;
        int failures = 0;
        
        for (Student student : students) {
            double studentMarks = marksRepository.getAverageMarksByStudent(student.getId());
            double studentAttendance = attendanceRepository.getAttendancePercentage(student.getId());
            
            averageMarks += studentMarks;
            averageAttendance += studentAttendance;
            
            if (studentMarks >= 75) toppers++;
            if (studentMarks < 40) failures++;
        }
        
        int studentCount = students.size();
        averageMarks = studentCount > 0 ? averageMarks / studentCount : 0;
        averageAttendance = studentCount > 0 ? averageAttendance / studentCount : 0;
        
        return ClassPerformanceResponse.builder()
                .classId(classId)
                .className(classEntity.getClassName())
                .studentCount(studentCount)
                .averageMarks(averageMarks)
                .averageAttendance(averageAttendance)
                .toppersCount(toppers)
                .failuresCount(failures)
                .passPercentage(((studentCount - failures) * 100.0) / studentCount)
                .build();
    }

    @Override
    public Map<String, Object> getAttendanceTrends(Long departmentId, String academicYear) {
        Map<String, Object> trends = new HashMap<>();
        
        List<Object[]> monthlyData = attendanceRepository.getMonthlyAttendanceTrends(departmentId, academicYear);
        List<Object[]> subjectWiseData = attendanceRepository.getSubjectWiseAttendance(departmentId, academicYear);
        
        trends.put("monthlyData", monthlyData);
        trends.put("subjectWiseData", subjectWiseData);
        
        return trends;
    }

    @Override
    public MarksDistributionResponse getMarksDistribution(Long subjectId, Integer semester) {
        Subject subject = subjectRepository.findById(subjectId)
                .orElseThrow(() -> new RuntimeException("Subject not found"));
        
        List<Marks> marks = marksRepository.findBySubjectIdAndSemester(subjectId, semester);
        
        Map<String, Long> distribution = new HashMap<>();
        distribution.put("90-100", 0L);
        distribution.put("80-89", 0L);
        distribution.put("70-79", 0L);
        distribution.put("60-69", 0L);
        distribution.put("50-59", 0L);
        distribution.put("40-49", 0L);
        distribution.put("Below 40", 0L);
        
        for (Marks mark : marks) {
            double percentage = (mark.getMarksObtained() / mark.getMaxMarks()) * 100;
            
            if (percentage >= 90) distribution.put("90-100", distribution.get("90-100") + 1);
            else if (percentage >= 80) distribution.put("80-89", distribution.get("80-89") + 1);
            else if (percentage >= 70) distribution.put("70-79", distribution.get("70-79") + 1);
            else if (percentage >= 60) distribution.put("60-69", distribution.get("60-69") + 1);
            else if (percentage >= 50) distribution.put("50-59", distribution.get("50-59") + 1);
            else if (percentage >= 40) distribution.put("40-49", distribution.get("40-49") + 1);
            else distribution.put("Below 40", distribution.get("Below 40") + 1);
        }
        
        return MarksDistributionResponse.builder()
                .subjectId(subjectId)
                .subjectName(subject.getName())
                .semester(semester)
                .distribution(distribution)
                .build();
    }

    @Override
    public byte[] exportPerformanceReport(String academicYear) {
        List<StudentPerformanceResponse> performances = new ArrayList<>();
        List<Student> students = studentRepository.findAll();
        
        for (Student student : students) {
            performances.add(getStudentPerformance(student.getId()));
        }
        
        try {
            List<Map<String, Object>> mapData = performances.stream().map(r -> {
            Map<String, Object> map = new HashMap<>();
            map.put("studentName", r.getStudentName());
            map.put("rollNumber", r.getRollNumber());
            map.put("className", r.getClassName());
            map.put("percentage", r.getOverallPercentage());
            return map;
        }).collect(Collectors.toList());

        return pdfGenerator.generatePerformanceReport(academicYear, mapData);
        } catch (Exception e) {
            throw new RuntimeException("Error generating report", e);
        }
    }

    private double getTeacherFeedback(Long teacherId) {
        // In real implementation, this would come from a feedback system
        return 85.0 + Math.random() * 10;
    }

    private double calculateRiskScore(double attendance, double marks) {
        double attendanceWeight = 0.4;
        double marksWeight = 0.6;
        
        double normalizedAttendance = Math.max(0, Math.min(100, attendance)) / 100;
        double normalizedMarks = Math.max(0, Math.min(100, marks)) / 100;
        
        return 1 - ((normalizedAttendance * attendanceWeight) + (normalizedMarks * marksWeight));
    }

    private String getRiskLevel(double riskScore) {
        if (riskScore > 0.7) return "HIGH";
        if (riskScore > 0.4) return "MEDIUM";
        return "LOW";
    }

    private List<String> getRecommendations(String riskLevel) {
        List<String> recommendations = new ArrayList<>();
        
        if (riskLevel.equals("HIGH")) {
            recommendations.add("Immediate counseling required");
            recommendations.add("Special attention in classes");
            recommendations.add("Parent meeting recommended");
        } else if (riskLevel.equals("MEDIUM")) {
            recommendations.add("Regular monitoring needed");
            recommendations.add("Extra practice sessions");
        } else {
            recommendations.add("Continue current performance");
            recommendations.add("Encourage for advanced topics");
        }
        
        return recommendations;
    }

    private double calculatePassRate(Long departmentId) {
        return marksRepository.getPassRateByDepartment(departmentId);
    }
}