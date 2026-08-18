package com.edustream.lms.controller;

import com.edustream.lms.dto.ApiResponse;
import com.edustream.lms.model.Course;
import com.edustream.lms.service.DataSeederService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/seed")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class SeedController {

    private final DataSeederService dataSeederService;

    @PostMapping("/java-dsa")
    public ResponseEntity<ApiResponse<Course>> seedJavaDsaCourse() {
        try {
            Course course = dataSeederService.seedJavaDsaCourse();
            return ResponseEntity.ok(ApiResponse.ok("JAVA TO DSA IN 30 DAYS course seeded successfully!", course));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(ApiResponse.error("Failed to seed course: " + e.getMessage()));
        }
    }
}
