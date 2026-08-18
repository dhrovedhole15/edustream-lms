package com.edustream.lms.model;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "progress", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"user_id", "course_id"})
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Progress {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "course_id", nullable = false)
    private Course course;

    @Column(name = "progress_percentage", precision = 5, scale = 2, nullable = false)
    @Builder.Default
    private BigDecimal progressPercentage = BigDecimal.ZERO;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "progress_completed_lectures", joinColumns = @JoinColumn(name = "progress_id"))
    @Column(name = "lecture_id")
    @Builder.Default
    private Set<Long> completedLectureIds = new HashSet<>();

    @Column(name = "last_accessed_at")
    @Builder.Default
    private LocalDateTime lastAccessedAt = LocalDateTime.now();

    @PreUpdate
    public void onUpdate() {
        this.lastAccessedAt = LocalDateTime.now();
    }
}
