package com.edustream.lms.service;

import com.edustream.lms.model.*;
import com.edustream.lms.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class DataSeederService implements CommandLineRunner {

    private final UserRepository userRepository;
    private final CourseRepository courseRepository;
    private final SectionRepository sectionRepository;
    private final LectureRepository lectureRepository;
    private final CourseResourceRepository courseResourceRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        if (userRepository.count() == 0) {
            seedInitialData();
        }
    }

    @Transactional
    public Course seedJavaDsaCourse() {
        // Ensure default instructor
        User instructor = userRepository.findByEmail("instructor@edustream.com").orElseGet(() ->
            userRepository.save(User.builder()
                .email("instructor@edustream.com")
                .password(passwordEncoder.encode("password123"))
                .displayName("Alpha Placement & Code")
                .role(Role.INSTRUCTOR)
                .avatarUrl("https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150")
                .bio("Senior Software Engineer & Educator specializing in Java, DSA, and System Design.")
                .build())
        );

        // Create or update JAVA TO DSA IN 30 DAYS course
        Course course = Course.builder()
                .title("JAVA TO DSA IN 30 DAYS")
                .description("A comprehensive 30-day journey from Java basics to advanced Data Structures and Algorithms. Master Arrays, Linked Lists, Trees, Dynamic Programming, and crack top tech interviews.")
                .category("development")
                .price(BigDecimal.ZERO)
                .instructor(instructor)
                .instructorName(instructor.getDisplayName())
                .thumbnail("https://images.unsplash.com/photo-1517694712202-14dd9538aa97?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80")
                .rating(new BigDecimal("4.95"))
                .reviewsCount(1540)
                .status("PUBLISHED")
                .featured(true)
                .build();

        Course savedCourse = courseRepository.save(course);

        // Resources
        courseResourceRepository.save(CourseResource.builder()
                .course(savedCourse)
                .title("Java Programming Digital Notes (PDF Manual)")
                .url("https://mrcet.com/pdf/Lab%20Manuals/IT/JAVA%20PROGRAMMING.pdf")
                .resourceType("PDF")
                .fileSize("4.8 MB")
                .build());

        courseResourceRepository.save(CourseResource.builder()
                .course(savedCourse)
                .title("Complete 30-Day DSA Roadmap & Interview Cheat Sheet")
                .url("https://whimsical.com/dsa-roadmap-by-love-babbar-896vYvJvYvJvYvJvYvJvYv")
                .resourceType("LINK")
                .fileSize("Interactive")
                .build());

        // Sections and Lectures
        createSectionWithLectures(savedCourse, "Phase 1: Java Fundamentals & Flow Control (Days 1-7)",
                "Master Java syntax, JVM architecture, data types, loops, and pattern problems.", 1,
                List.of(
                        new String[]{"Day 1: Introduction to Java, JDK Setup & First Program", "https://www.youtube.com/watch?v=yRpLlJmRo2w", "15:30", "true"},
                        new String[]{"Day 2: Variables, Data Types & Input in Java", "https://www.youtube.com/watch?v=lusVd5-S2S4", "22:15", "true"},
                        new String[]{"Day 3: Arithmetic & Logical Operators in Java", "https://www.youtube.com/watch?v=O5x3_S8S2vY", "18:40", "false"},
                        new String[]{"Day 4: Conditional Statements (if-else, switch case)", "https://www.youtube.com/watch?v=I5vP9Z_S_S0", "24:10", "false"},
                        new String[]{"Day 5: Loops in Java (for, while, do-while)", "https://www.youtube.com/watch?v=0Z_vS_vS_vS", "28:50", "false"},
                        new String[]{"Day 6: Star & Number Pattern Questions - Part 1", "https://www.youtube.com/watch?v=dr-pLeJ3_S0", "32:00", "false"},
                        new String[]{"Day 7: Advanced Patterns & Logic Building - Part 2", "https://www.youtube.com/watch?v=dr-pLeJ3_S0", "36:45", "false"}
                ));

        createSectionWithLectures(savedCourse, "Phase 2: Object Oriented Programming (OOP) in Java (Days 8-14)",
                "Deep dive into Classes, Objects, Inheritance, Polymorphism, Abstraction, and Interfaces.", 2,
                List.of(
                        new String[]{"Day 8: Functions & Methods with Memory Call Stack", "https://www.youtube.com/watch?v=vS_vS_vS_vS", "26:20", "false"},
                        new String[]{"Day 9: Introduction to Classes, Objects & Constructors", "https://www.youtube.com/watch?v=BSVKUk58K6U", "29:10", "false"},
                        new String[]{"Day 10: Inheritance & Polymorphism in Depth", "https://www.youtube.com/watch?v=3S_vS_vS_vS", "31:40", "false"},
                        new String[]{"Day 11: Encapsulation & Access Modifiers in Java", "https://www.youtube.com/watch?v=4S_vS_vS_vS", "27:15", "false"},
                        new String[]{"Day 12: Interfaces & Abstract Classes in Java", "https://www.youtube.com/watch?v=5S_vS_vS_vS", "25:00", "false"},
                        new String[]{"Day 13: Packages, Exception Handling & Custom Exceptions", "https://www.youtube.com/watch?v=6S_vS_vS_vS", "33:10", "false"},
                        new String[]{"Day 14: Java Collections Framework Overview", "https://www.youtube.com/watch?v=7S_vS_vS_vS", "30:00", "false"}
                ));

        createSectionWithLectures(savedCourse, "Phase 3: Core Data Structures - Arrays, Strings & Recursion (Days 15-22)",
                "Learn Memory layout, 2D Arrays, String pool, Bit manipulation, and Recursion trees.", 3,
                List.of(
                        new String[]{"Day 15: 1D Arrays - Creation, Traversal & Linear/Binary Search", "https://www.youtube.com/watch?v=5S_vS_vS_vS", "38:00", "false"},
                        new String[]{"Day 16: 2D Arrays, Matrix Multiplication & Spiral Traversal", "https://www.youtube.com/watch?v=6S_vS_vS_vS", "35:20", "false"},
                        new String[]{"Day 17: Strings, StringBuilder & String Constant Pool", "https://www.youtube.com/watch?v=6S_vS_vS_vS", "34:15", "false"},
                        new String[]{"Day 18: Bit Manipulation Tricks for Competitive Coding", "https://www.youtube.com/watch?v=7S_vS_vS_vS", "29:40", "false"},
                        new String[]{"Day 19: Recursion Level 1 (Factorial, Fibonacci, Print N to 1)", "https://www.youtube.com/watch?v=7S_vS_vS_vS", "42:10", "false"},
                        new String[]{"Day 20: Recursion Level 2 (Tower of Hanoi, Subsequences)", "https://www.youtube.com/watch?v=8S_vS_vS_vS", "48:30", "false"},
                        new String[]{"Day 21: Backtracking Intro - N-Queens & Sudoku Solver", "https://www.youtube.com/watch?v=9S_vS_vS_vS", "54:00", "false"},
                        new String[]{"Day 22: Time & Space Complexity (Big-O Notation)", "https://www.youtube.com/watch?v=10S_vS_vS_vS", "35:00", "false"}
                ));

        createSectionWithLectures(savedCourse, "Phase 4: Advanced DSA, Trees, Graphs & DP (Days 23-30)",
                "Master Linked Lists, Stacks, Queues, Binary Trees, BST, Heaps, Hashing, and Dynamic Programming.", 4,
                List.of(
                        new String[]{"Day 23: Sorting Algorithms (Bubble, Selection, Insertion, Merge, Quick)", "https://www.youtube.com/watch?v=7S_vS_vS_vS", "50:00", "false"},
                        new String[]{"Day 24: Singly & Doubly Linked Lists with Interview Questions", "https://www.youtube.com/watch?v=8S_vS_vS_vS", "52:15", "false"},
                        new String[]{"Day 25: Stacks & Queues - Implementation & Monotonic Stack", "https://www.youtube.com/watch?v=9S_vS_vS_vS", "46:40", "false"},
                        new String[]{"Day 26: Binary Trees (Traversals, Height, Diameter, Views)", "https://www.youtube.com/watch?v=10S_vS_vS_vS", "58:20", "false"},
                        new String[]{"Day 27: Binary Search Tree (BST) & Balanced BST", "https://www.youtube.com/watch?v=11S_vS_vS_vS", "49:10", "false"},
                        new String[]{"Day 28: Heaps & Priority Queues (Min-Heap, Max-Heap, Top-K)", "https://www.youtube.com/watch?v=12S_vS_vS_vS", "47:30", "false"},
                        new String[]{"Day 29: Hashing, HashMap & HashSet Internal Working", "https://www.youtube.com/watch?v=13S_vS_vS_vS", "44:00", "false"},
                        new String[]{"Day 30: Dynamic Programming (0/1 Knapsack, LCS, LIS) & Next Steps", "https://www.youtube.com/watch?v=14S_vS_vS_vS", "65:00", "false"}
                ));

        return savedCourse;
    }

    private void createSectionWithLectures(Course course, String title, String description, int order, List<String[]> lectureData) {
        Section section = sectionRepository.save(Section.builder()
                .course(course)
                .title(title)
                .description(description)
                .orderIndex(order)
                .build());

        int lecOrder = 1;
        for (String[] lec : lectureData) {
            lectureRepository.save(Lecture.builder()
                    .section(section)
                    .title(lec[0])
                    .externalLink(lec[1])
                    .duration(lec[2])
                    .isPreview(Boolean.parseBoolean(lec[3]))
                    .lectureType("VIDEO")
                    .orderIndex(lecOrder++)
                    .build());
        }
    }

    private void seedInitialData() {
        seedJavaDsaCourse();
    }
}
