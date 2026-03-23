package com.university.sms.dto.request;

import com.university.sms.model.enums.MarksType;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.util.Map;

@Data
public class MarksRequest {
    @NotNull(message = "Subject ID is required")
    private Long subjectId;
    
    @NotNull(message = "Semester is required")
    private Integer semester;
    
    @NotNull(message = "Marks type is required")
    private MarksType marksType;
    
    private Double maxMarks;
    private String academicYear;
    
    private Map<Long, Double> studentMarks;
}