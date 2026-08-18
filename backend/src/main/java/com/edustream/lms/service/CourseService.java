package com.edustream.lms.service;

import com.edustream.lms.model.Course;
import com.edustream.lms.model.CourseResource;
import com.edustream.lms.model.Section;
import com.edustream.lms.repository.CourseRepository;
import com.edustream.lms.repository.CourseResourceRepository;
import com.edustream.lms.repository.SectionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CourseService {

    private final CourseRepository courseRepository;
    private final SectionRepository sectionRepository;
    private final CourseResourceRepository courseResourceRepository;

    @Transactional(readOnly = true)
    public List<Course> getAllPublishedCourses() {
        return courseRepository.findByStatus("PUBLISHED");
    }

    @Transactional(readOnly = true)
    public List<Course> getFeaturedCourses() {
        return courseRepository.findByFeaturedTrueAndStatus("PUBLISHED");
    }

    @Transactional(readOnly = true)
    public List<Course> getCoursesByCategory(String category) {
        return courseRepository.findByCategoryAndStatus(category, "PUBLISHED");
    }

    @Transactional(readOnly = true)
    public List<Course> searchCourses(String query) {
        return courseRepository.searchCourses(query);
    }

    @Transactional(readOnly = true)
    public Optional<Course> getCourseById(Long id) {
        return courseRepository.findById(id);
    }

    @Transactional(readOnly = true)
    public List<Course> getCoursesByInstructor(Long instructorId) {
        return courseRepository.findByInstructorId(instructorId);
    }

    @Transactional
    public Course saveCourse(Course course) {
        return courseRepository.save(course);
    }

    @Transactional(readOnly = true)
    public List<Section> getSectionsByCourseId(Long courseId) {
        return sectionRepository.findByCourseIdOrderByOrderIndexAsc(courseId);
    }

    @Transactional(readOnly = true)
    public List<CourseResource> getResourcesByCourseId(Long courseId) {
        return courseResourceRepository.findByCourseId(courseId);
    }
}
