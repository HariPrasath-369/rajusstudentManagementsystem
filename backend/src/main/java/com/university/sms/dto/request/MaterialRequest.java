package com.university.sms.dto.request;

import lombok.Data;

@Data
public class MaterialRequest {
    private String title;
    private String description;
    private Long subjectId;
    private Long classId;
    private String fileUrl;
    private String fileType;
}
