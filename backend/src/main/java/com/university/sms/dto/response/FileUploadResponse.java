package com.university.sms.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FileUploadResponse {
    private String fileName;
    private String originalFileName;
    private long fileSize;
    private String fileType;
    private String uploadPath;
    private java.time.LocalDateTime uploadedAt;
}
