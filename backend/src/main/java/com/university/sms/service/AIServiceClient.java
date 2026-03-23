package com.university.sms.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.util.*;

@Component
public class AIServiceClient {

    private static final Logger logger = LoggerFactory.getLogger(AIServiceClient.class);

    @Value("${ai.service.url:http://localhost:5000}")
    private String aiServiceUrl;

    @Value("${ai.service.enabled:false}")
    private boolean aiServiceEnabled;

    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();

    public List<Map<String, Object>> predictStudentPerformance(Map<String, Object> studentData) {
        if (!aiServiceEnabled) {
            logger.warn("AI service is disabled, returning mock predictions");
            return getMockPredictions(studentData);
        }

        try {
            String url = aiServiceUrl + "/api/predict/performance";
            JsonNode response = restTemplate.postForObject(url, studentData, JsonNode.class);
            
            if (response != null && response.isArray()) {
                return objectMapper.convertValue(response, List.class);
            }
            
            return Collections.emptyList();
            
        } catch (Exception e) {
            logger.error("Error calling AI service: {}", e.getMessage());
            return getMockPredictions(studentData);
        }
    }

    public Map<String, Object> analyzeAttendanceTrends(List<Map<String, Object>> attendanceData) {
        if (!aiServiceEnabled) {
            logger.warn("AI service is disabled, returning mock analysis");
            return getMockAttendanceAnalysis(attendanceData);
        }

        try {
            String url = aiServiceUrl + "/api/analyze/attendance";
            JsonNode response = restTemplate.postForObject(url, attendanceData, JsonNode.class);
            return objectMapper.convertValue(response, Map.class);
            
        } catch (Exception e) {
            logger.error("Error calling AI service: {}", e.getMessage());
            return getMockAttendanceAnalysis(attendanceData);
        }
    }

    public List<String> generateRecommendations(Map<String, Object> studentData) {
        if (!aiServiceEnabled) {
            return getMockRecommendations(studentData);
        }

        try {
            String url = aiServiceUrl + "/api/recommendations";
            JsonNode response = restTemplate.postForObject(url, studentData, JsonNode.class);
            
            if (response != null && response.isArray()) {
                return objectMapper.convertValue(response, List.class);
            }
            
            return Collections.emptyList();
            
        } catch (Exception e) {
            logger.error("Error calling AI service: {}", e.getMessage());
            return getMockRecommendations(studentData);
        }
    }

    public double calculateRiskScore(Map<String, Object> studentMetrics) {
        if (!aiServiceEnabled) {
            return calculateMockRiskScore(studentMetrics);
        }

        try {
            String url = aiServiceUrl + "/api/risk-score";
            JsonNode response = restTemplate.postForObject(url, studentMetrics, JsonNode.class);
            
            if (response != null && response.has("riskScore")) {
                return response.get("riskScore").asDouble();
            }
            
            return 0.5;
            
        } catch (Exception e) {
            logger.error("Error calling AI service: {}", e.getMessage());
            return calculateMockRiskScore(studentMetrics);
        }
    }

    private List<Map<String, Object>> getMockPredictions(Map<String, Object> studentData) {
        List<Map<String, Object>> predictions = new ArrayList<>();
        Map<String, Object> prediction = new HashMap<>();
        prediction.put("subject", "Overall");
        prediction.put("predictedMarks", 65.5);
        prediction.put("confidence", 0.85);
        prediction.put("riskLevel", "Medium");
        predictions.add(prediction);
        return predictions;
    }

    private Map<String, Object> getMockAttendanceAnalysis(List<Map<String, Object>> attendanceData) {
        Map<String, Object> analysis = new HashMap<>();
        analysis.put("trend", "Stable");
        analysis.put("predictedAttendance", 85.0);
        analysis.put("atRiskStudents", 5);
        return analysis;
    }

    private List<String> getMockRecommendations(Map<String, Object> studentData) {
        List<String> recommendations = new ArrayList<>();
        recommendations.add("Increase attendance to improve performance");
        recommendations.add("Focus on practical applications");
        recommendations.add("Regular revision recommended");
        return recommendations;
    }

    private double calculateMockRiskScore(Map<String, Object> studentMetrics) {
        double attendance = (double) studentMetrics.getOrDefault("attendance", 85.0);
        double marks = (double) studentMetrics.getOrDefault("marks", 70.0);
        
        double normalizedAttendance = Math.max(0, Math.min(100, attendance)) / 100;
        double normalizedMarks = Math.max(0, Math.min(100, marks)) / 100;
        
        return 1 - ((normalizedAttendance * 0.4) + (normalizedMarks * 0.6));
    }
}
