package com.shopping.mall.file;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.*;
import java.util.*;

@Service
public class FileStorageService {

    @Value("${app.upload-dir}")
    private String uploadDir;

    @Value("${app.upload.max-bytes}")
    private long maxBytes;

    @Value("${app.upload.allowed-ext}")
    private String allowedExtCsv;

    public String saveImage(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("file is empty");
        }

        if (file.getSize() > maxBytes) {
            throw new IllegalArgumentException("file too large (max 2MB)");
        }

        String contentType = file.getContentType();
        if (contentType == null || !contentType.startsWith("image/")) {
            throw new IllegalArgumentException("only image files are allowed");
        }

        String original = Optional.ofNullable(file.getOriginalFilename()).orElse("file");
        String ext = getExt(original); // "png" 같은 형태로
        Set<String> allowed = parseAllowedExt(allowedExtCsv);

        if (!allowed.contains(ext)) {
            throw new IllegalArgumentException("only " + String.join(",", allowed) + " allowed");
        }

        String filename = UUID.randomUUID() + "." + ext;

        try {
            Path dir = Paths.get(uploadDir).toAbsolutePath().normalize();
            Files.createDirectories(dir);

            Path target = dir.resolve(filename);
            Files.copy(file.getInputStream(), target, StandardCopyOption.REPLACE_EXISTING);
        } catch (IOException e) {
            throw new RuntimeException("failed to save file", e);
        }

        return "/uploads/" + filename;
    }

    private Set<String> parseAllowedExt(String csv) {
        Set<String> set = new HashSet<>();
        for (String s : csv.split(",")) {
            String v = s.trim().toLowerCase();
            if (!v.isEmpty()) set.add(v);
        }
        return set;
    }

    private String getExt(String name) {
        int idx = name.lastIndexOf('.');
        if (idx < 0) return "";
        String ext = name.substring(idx + 1).toLowerCase();
        // 방어
        if (ext.length() > 10) return "";
        return ext;
    }
}