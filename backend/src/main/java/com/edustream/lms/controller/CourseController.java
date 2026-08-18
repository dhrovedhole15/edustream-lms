package com.edustream.lms.controller;

import com.edustream.lms.dto.ApiResponse;
import com.edustream.lms.model.Course;
import com.edustream.lms.service.CourseService;
import com.edustream.lms.service.EnrollmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/courses")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class CourseController {

    private final CourseService courseService;
    private final EnrollmentService enrollmentService;

    @GetMapping
    public ResponseEntity<List<Course>> getAllCourses(@RequestParam(required = false) String category,
                                                      @RequestParam(required = false) Boolean featured,
                                                      @RequestParam(required = false) String search) {
        if (search != null && !search.isBlank()) {
            return ResponseEntity.ok(courseService.searchCourses(search));
        }
        if (Boolean.TRUE.equals(featured)) {
            return ResponseEntity.ok(courseService.getFeaturedCourses());
        }
        if (category != null && !category.isBlank()) {
            return ResponseEntity.ok(courseService.getCoursesByCategory(category));
        }
        return ResponseEntity.ok(courseService.getAllPublishedCourses());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Course> getCourseById(@PathVariable Long id) {
        return courseService.getCourseById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/{id}/content")
    public ResponseEntity<?> getCourseContent(@PathVariable Long id, @RequestParam Long userId) {
        if (!enrollmentService.isUserEnrolled(userId, id)) {
            return ResponseEntity.status(403).body(Map.of("error", "Not enrolled in this course"));
        }

        return courseService.getCourseById(id)
                .map(course -> {
                    Map<String, Object> content = new HashMap<>();
                    content.put("title", course.getTitle());
                    content.put("sections", course.getSections());
                    content.put("resources", course.getResources());
                    return ResponseEntity.ok(content);
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
