package com.university.sms.dto.response;

import lombok.Builder;
import lombok.Data;
import java.util.Map;

@Data
@Builder
public class MarksDistributionResponse {
    private Long subjectId;
    private String subjectName;
    private Integer semester;
    private Map<String, Long> distribution;
}
