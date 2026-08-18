package com.edustream.lms.controller;

import com.edustream.lms.dto.ApiResponse;
import com.edustream.lms.dto.LectureCompleteRequest;
import com.edustream.lms.model.Progress;
import com.edustream.lms.service.ProgressService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ProgressController {

    private final ProgressService progressService;

    @GetMapping("/progress/{courseId}")
    public ResponseEntity<?> getCourseProgress(@PathVariable Long courseId, @RequestParam Long userId) {
        Progress progress = progressService.getProgress(userId, courseId);
        Map<String, Object> response = new HashMap<>();
        response.put("progressPercentage", progress.getProgressPercentage());
        response.put("completedLectures", progress.getCompletedLectureIds());
        response.put("lastAccessedAt", progress.getLastAccessedAt());
        return ResponseEntity.ok(response);
    }

    @PostMapping("/lecture/complete")
    public ResponseEntity<?> completeLecture(@RequestBody LectureCompleteRequest request) {
        try {
            Progress updated = progressService.markLectureComplete(
                    request.getUserId(),
                    request.getCourseId(),
                    request.getLectureId()
            );

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("progressPercentage", updated.getProgressPercentage());
            response.put("completedLectures", updated.getCompletedLectureIds());

            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
}
