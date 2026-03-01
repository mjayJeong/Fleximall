package com.shopping.mall.file;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.*;
import java.util.UUID;

@Service
public class FileStorageService {

    @Value("${app.upload-dir}")
    private String uploadDir;

    public String saveImage(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("file is empty");
        }

        String contentType = file.getContentType();
        if (contentType == null || !contentType.startsWith("image/")) {
            throw new IllegalArgumentException("only image files are allowed");
        }

        String original = file.getOriginalFilename() == null ? "file" : file.getOriginalFilename();
        String ext = getExt(original); // ".png" 같은 확장자
        String filename = UUID.randomUUID() + ext;

        try {
            Path dir = Paths.get(uploadDir).toAbsolutePath().normalize();
            Files.createDirectories(dir);

            Path target = dir.resolve(filename);
            Files.copy(file.getInputStream(), target, StandardCopyOption.REPLACE_EXISTING);
        } catch (IOException e) {
            throw new RuntimeException("failed to save file", e);
        }

        // DB에 저장할 URL (정적 서빙 경로)
        return "/uploads/" + filename;
    }

    private String getExt(String name) {
        int idx = name.lastIndexOf('.');
        if (idx < 0) return "";
        String ext = name.substring(idx).toLowerCase();
        // 너무 이상한 확장자 방어(선택)
        if (ext.length() > 10) return "";
        return ext;
    }
}