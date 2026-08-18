package com.edustream.lms.service;

import com.edustream.lms.model.Course;
import com.edustream.lms.model.Lecture;
import com.edustream.lms.model.Progress;
import com.edustream.lms.model.Section;
import com.edustream.lms.model.User;
import com.edustream.lms.repository.CourseRepository;
import com.edustream.lms.repository.ProgressRepository;
import com.edustream.lms.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ProgressService {

    private final ProgressRepository progressRepository;
    private final CourseRepository courseRepository;
    private final UserRepository userRepository;

    @Transactional(readOnly = true)
    public Progress getProgress(Long userId, Long courseId) {
        return progressRepository.findByUserIdAndCourseId(userId, courseId)
                .orElse(Progress.builder()
                        .progressPercentage(BigDecimal.ZERO)
                        .completedLectureIds(new HashSet<>())
                        .build());
    }

    @Transactional
    public Progress markLectureComplete(Long userId, Long courseId, Long lectureId) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new IllegalArgumentException("Course not found with id: " + courseId));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found with id: " + userId));

        int totalLectures = 0;
        if (course.getSections() != null) {
            for (Section s : course.getSections()) {
                if (s.getLectures() != null) {
                    totalLectures += s.getLectures().size();
                }
            }
        }
        if (totalLectures == 0) totalLectures = 1;

        Optional<Progress> progressOpt = progressRepository.findByUserIdAndCourseId(userId, courseId);
        Progress progress;

        if (progressOpt.isPresent()) {
            progress = progressOpt.get();
            progress.getCompletedLectureIds().add(lectureId);
        } else {
            progress = Progress.builder()
                    .user(user)
                    .course(course)
                    .completedLectureIds(new HashSet<>())
                    .build();
            progress.getCompletedLectureIds().add(lectureId);
        }

        int completedCount = progress.getCompletedLectureIds().size();
        BigDecimal percentage = BigDecimal.valueOf((double) completedCount / totalLectures * 100)
                .setScale(2, RoundingMode.HALF_UP);

        progress.setProgressPercentage(percentage);
        progress.setLastAccessedAt(LocalDateTime.now());

        return progressRepository.save(progress);
    }
}
