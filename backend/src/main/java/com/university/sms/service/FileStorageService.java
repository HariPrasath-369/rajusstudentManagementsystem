package com.university.sms.service;

import com.university.sms.dto.response.FileUploadResponse;
import org.springframework.core.io.Resource;
import org.springframework.web.multipart.MultipartFile;

public interface FileStorageService {
    FileUploadResponse uploadFile(MultipartFile file, String folder, Long userId);
    Resource downloadFile(String fileName);
    void deleteFile(String fileName, Long userId);
    String getContentType(String fileName);
}