package com.university.sms.dto.response;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Builder
public class MaterialResponse {
    private Long id;
    private String title;
    private String description;
    private String subjectName;
    private String className;
    private String uploaderName;
    private String fileUrl;
    private String teacherName;
    private String fileType;
    private LocalDateTime createdAt;
}
