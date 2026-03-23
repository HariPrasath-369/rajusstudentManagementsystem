package com.university.sms.service.impl;

import com.university.sms.dto.response.FileUploadResponse;
import com.university.sms.exception.FileStorageException;
import com.university.sms.service.FileStorageService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDateTime;
import java.util.UUID;

@Service
public class FileStorageServiceImpl implements FileStorageService {

    @Value("${app.file.upload-dir}")
    private String uploadDir;

    @Override
    public FileUploadResponse uploadFile(MultipartFile file, String folder, Long userId) {
        try {
            Path uploadPath = Paths.get(uploadDir);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            if (folder != null && !folder.isEmpty()) {
                uploadPath = uploadPath.resolve(folder);
                if (!Files.exists(uploadPath)) {
                    Files.createDirectories(uploadPath);
                }
            }

            String originalFileName = file.getOriginalFilename();
            String fileExtension = originalFileName.substring(originalFileName.lastIndexOf("."));
            String fileName = UUID.randomUUID().toString() + fileExtension;
            
            Path filePath = uploadPath.resolve(fileName);
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

            return FileUploadResponse.builder()
                    .fileName(fileName)
                    .originalFileName(originalFileName)
                    .fileSize(file.getSize())
                    .fileType(file.getContentType())
                    .uploadPath(filePath.toString())
                    .uploadedAt(LocalDateTime.now())
                    .build();
        } catch (IOException e) {
            throw new FileStorageException("Could not upload file", e);
        }
    }

    @Override
    public Resource downloadFile(String fileName) {
        try {
            Path filePath = Paths.get(uploadDir).resolve(fileName);
            Resource resource = new UrlResource(filePath.toUri());
            
            if (resource.exists()) {
                return resource;
            } else {
                throw new FileStorageException("File not found: " + fileName);
            }
        } catch (MalformedURLException e) {
            throw new FileStorageException("Error accessing file", e);
        }
    }

    @Override
    public void deleteFile(String fileName, Long userId) {
        try {
            Path filePath = Paths.get(uploadDir).resolve(fileName);
            Files.deleteIfExists(filePath);
        } catch (IOException e) {
            throw new FileStorageException("Could not delete file", e);
        }
    }

    @Override
    public String getContentType(String fileName) {
        try {
            Path filePath = Paths.get(uploadDir).resolve(fileName);
            return Files.probeContentType(filePath);
        } catch (IOException e) {
            return "application/octet-stream";
        }
    }
}