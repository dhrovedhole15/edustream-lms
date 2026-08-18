package com.edustream.lms.service;

import com.edustream.lms.model.Course;
import com.edustream.lms.model.Enrollment;
import com.edustream.lms.model.Progress;
import com.edustream.lms.model.User;
import com.edustream.lms.repository.CourseRepository;
import com.edustream.lms.repository.EnrollmentRepository;
import com.edustream.lms.repository.ProgressRepository;
import com.edustream.lms.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.HashSet;
import java.util.List;

@Service
@RequiredArgsConstructor
public class EnrollmentService {

    private final EnrollmentRepository enrollmentRepository;
    private final CourseRepository courseRepository;
    private final UserRepository userRepository;
    private final ProgressRepository progressRepository;

    @Transactional
    public Enrollment enrollUser(Long userId, Long courseId) {
        if (enrollmentRepository.existsByUserIdAndCourseId(userId, courseId)) {
            return enrollmentRepository.findByUserIdAndCourseId(userId, courseId).orElseThrow();
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + userId));
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new IllegalArgumentException("Course not found: " + courseId));

        Enrollment enrollment = Enrollment.builder()
                .user(user)
                .course(course)
                .build();

        Enrollment saved = enrollmentRepository.save(enrollment);

        // Initialize empty progress if not existing
        if (progressRepository.findByUserIdAndCourseId(userId, courseId).isEmpty()) {
            progressRepository.save(Progress.builder()
                    .user(user)
                    .course(course)
                    .progressPercentage(BigDecimal.ZERO)
                    .completedLectureIds(new HashSet<>())
                    .build());
        }

        return saved;
    }

    @Transactional(readOnly = true)
    public List<Enrollment> getUserEnrollments(Long userId) {
        return enrollmentRepository.findByUserId(userId);
    }

    @Transactional(readOnly = true)
    public boolean isUserEnrolled(Long userId, Long courseId) {
        return enrollmentRepository.existsByUserIdAndCourseId(userId, courseId);
    }
}
