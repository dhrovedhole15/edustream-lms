package com.edustream.lms.controller;

import com.edustream.lms.dto.ApiResponse;
import com.edustream.lms.model.Enrollment;
import com.edustream.lms.service.EnrollmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class EnrollmentController {

    private final EnrollmentService enrollmentService;

    @PostMapping("/enroll/free")
    public ResponseEntity<?> enrollFree(@RequestBody Map<String, Object> body) {
        try {
            Long userId = Long.valueOf(body.get("userId").toString());
            Long courseId = Long.valueOf(body.get("courseId").toString());

            Enrollment enrollment = enrollmentService.enrollUser(userId, courseId);
            return ResponseEntity.ok(ApiResponse.ok("Enrolled successfully in free course", enrollment));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @GetMapping("/enrollments/user/{userId}")
    public ResponseEntity<List<Enrollment>> getUserEnrollments(@PathVariable Long userId) {
        return ResponseEntity.ok(enrollmentService.getUserEnrollments(userId));
    }
}
