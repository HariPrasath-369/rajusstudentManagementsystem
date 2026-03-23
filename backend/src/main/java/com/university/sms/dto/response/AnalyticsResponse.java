package com.university.sms.dto.response;

import lombok.Builder;
import lombok.Data;

import java.util.List;
import java.util.Map;

@Data
@Builder
public class AnalyticsResponse {
    private Map<String, Object> summary;
    private List<Map<String, Object>> trends;
    private Map<String, Double> averages;
    private List<Object> topPerformers;
    private Map<String, Object> predictions;
}