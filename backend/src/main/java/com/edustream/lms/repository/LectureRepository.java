package com.edustream.lms.repository;

import com.edustream.lms.model.Lecture;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface LectureRepository extends JpaRepository<Lecture, Long> {
    List<Lecture> findBySectionIdOrderByOrderIndexAsc(Long sectionId);
}
