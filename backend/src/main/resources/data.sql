-- ============================================================================
-- EduStream LMS - Initial Seed Data (DML)
-- ============================================================================

USE `edustream_lms`;

-- 1. Insert Initial Users (Passwords encrypted with BCrypt for 'password123')
-- $2a$10$7EqJtq98hPqEX7fNZaFWoO.QG3y5U0k1Jz0E5y9k6t.y0y4t3/7iO
INSERT INTO `users` (`id`, `email`, `password`, `display_name`, `role`, `avatar_url`, `bio`) VALUES
(1, 'instructor@edustream.com', '$2a$10$wK1c5xI/hWdIqA0J/qfT4Oi5L9LqU4sH7H2f1lK2l8l0o6iK2wZ4m', 'Alpha Placement & Code', 'INSTRUCTOR', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150', 'Senior Software Engineer & Educator specializing in Java, DSA, and System Design.'),
(2, 'student@edustream.com', '$2a$10$wK1c5xI/hWdIqA0J/qfT4Oi5L9LqU4sH7H2f1lK2l8l0o6iK2wZ4m', 'Alex Mercer', 'STUDENT', 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150', 'Passionate Computer Science student preparing for top tech product interviews.'),
(3, 'admin@edustream.com', '$2a$10$wK1c5xI/hWdIqA0J/qfT4Oi5L9LqU4sH7H2f1lK2l8l0o6iK2wZ4m', 'Admin System', 'ADMIN', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150', 'System Administrator.');

-- 2. Insert Courses (including JAVA TO DSA IN 30 DAYS)
INSERT INTO `courses` (`id`, `title`, `description`, `category`, `price`, `instructor_id`, `instructor_name`, `thumbnail`, `rating`, `reviews_count`, `status`, `featured`) VALUES
(1, 'JAVA TO DSA IN 30 DAYS', 'A comprehensive 30-day journey from Java basics to advanced Data Structures and Algorithms. Master Arrays, Linked Lists, Trees, Dynamic Programming, and crack top tech interviews.', 'development', 0.00, 1, 'Alpha Placement & Code', 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', 4.95, 1540, 'PUBLISHED', TRUE),
(2, 'Full Stack Web Development with React & Spring Boot', 'Master enterprise full-stack development with React 19, TypeScript, Tailwind CSS, Spring Boot 3, and MySQL database management.', 'development', 29.99, 1, 'Alpha Placement & Code', 'https://images.unsplash.com/photo-1587620962725-abab7fe55159?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', 4.88, 820, 'PUBLISHED', TRUE),
(3, 'System Design & High-Scalability Architecture', 'Learn how to design scalable distributed architectures, caching layers with Redis, message queues with Kafka, and microservices.', 'development', 49.99, 1, 'Alpha Placement & Code', 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', 4.92, 610, 'PUBLISHED', FALSE);

-- 3. Course Study Materials & PDF Resources for JAVA TO DSA
INSERT INTO `course_resources` (`course_id`, `title`, `url`, `resource_type`, `file_size`) VALUES
(1, 'Java Programming Digital Notes (PDF Manual)', 'https://mrcet.com/pdf/Lab%20Manuals/IT/JAVA%20PROGRAMMING.pdf', 'PDF', '4.8 MB'),
(1, 'Complete 30-Day DSA Roadmap & Interview Cheat Sheet', 'https://whimsical.com/dsa-roadmap-by-love-babbar-896vYvJvYvJvYvJvYvJvYv', 'LINK', 'Interactive'),
(1, 'Data Structures & Algorithms in Java - Code Samples Repository', 'https://github.com', 'LINK', 'Code Repository');

-- 4. Sections for JAVA TO DSA IN 30 DAYS
INSERT INTO `sections` (`id`, `course_id`, `title`, `description`, `order_index`) VALUES
(1, 1, 'Phase 1: Java Fundamentals & Flow Control (Days 1-7)', 'Master Java syntax, JVM architecture, data types, loops, and pattern problems.', 1),
(2, 1, 'Phase 2: Object Oriented Programming (OOP) in Java (Days 8-14)', 'Deep dive into Classes, Objects, Inheritance, Polymorphism, Abstraction, and Interfaces.', 2),
(3, 1, 'Phase 3: Core Data Structures - Arrays, Strings & Recursion (Days 15-22)', 'Learn Memory layout, 2D Arrays, String pool, Bit manipulation, and Recursion trees.', 3),
(4, 1, 'Phase 4: Advanced DSA, Trees, Graphs & DP (Days 23-30)', 'Master Linked Lists, Stacks, Queues, Binary Trees, BST, Heaps, Hashing, and Dynamic Programming.', 4);

-- 5. Lectures for JAVA TO DSA IN 30 DAYS
-- Phase 1
INSERT INTO `lectures` (`section_id`, `title`, `external_link`, `duration`, `is_preview`, `lecture_type`, `order_index`) VALUES
(1, 'Day 1: Introduction to Java, JDK Setup & First Program', 'https://www.youtube.com/watch?v=yRpLlJmRo2w', '15:30', TRUE, 'VIDEO', 1),
(1, 'Day 2: Variables, Data Types & Input in Java', 'https://www.youtube.com/watch?v=lusVd5-S2S4', '22:15', TRUE, 'VIDEO', 2),
(1, 'Day 3: Arithmetic & Logical Operators in Java', 'https://www.youtube.com/watch?v=O5x3_S8S2vY', '18:40', FALSE, 'VIDEO', 3),
(1, 'Day 4: Conditional Statements (if-else, switch case)', 'https://www.youtube.com/watch?v=I5vP9Z_S_S0', '24:10', FALSE, 'VIDEO', 4),
(1, 'Day 5: Loops in Java (for, while, do-while)', 'https://www.youtube.com/watch?v=0Z_vS_vS_vS', '28:50', FALSE, 'VIDEO', 5),
(1, 'Day 6: Star & Number Pattern Questions - Part 1', 'https://www.youtube.com/watch?v=dr-pLeJ3_S0', '32:00', FALSE, 'VIDEO', 6),
(1, 'Day 7: Advanced Patterns & Logic Building - Part 2', 'https://www.youtube.com/watch?v=dr-pLeJ3_S0', '36:45', FALSE, 'VIDEO', 7);

-- Phase 2
INSERT INTO `lectures` (`section_id`, `title`, `external_link`, `duration`, `is_preview`, `lecture_type`, `order_index`) VALUES
(2, 'Day 8: Functions & Methods with Memory Call Stack', 'https://www.youtube.com/watch?v=vS_vS_vS_vS', '26:20', FALSE, 'VIDEO', 1),
(2, 'Day 9: Introduction to Classes, Objects & Constructors', 'https://www.youtube.com/watch?v=BSVKUk58K6U', '29:10', FALSE, 'VIDEO', 2),
(2, 'Day 10: Inheritance & Polymorphism in Depth', 'https://www.youtube.com/watch?v=3S_vS_vS_vS', '31:40', FALSE, 'VIDEO', 3),
(2, 'Day 11: Encapsulation & Access Modifiers in Java', 'https://www.youtube.com/watch?v=4S_vS_vS_vS', '27:15', FALSE, 'VIDEO', 4),
(2, 'Day 12: Interfaces & Abstract Classes in Java', 'https://www.youtube.com/watch?v=5S_vS_vS_vS', '25:00', FALSE, 'VIDEO', 5),
(2, 'Day 13: Packages, Exception Handling & Custom Exceptions', 'https://www.youtube.com/watch?v=6S_vS_vS_vS', '33:10', FALSE, 'VIDEO', 6),
(2, 'Day 14: Java Collections Framework Overview', 'https://www.youtube.com/watch?v=7S_vS_vS_vS', '30:00', FALSE, 'VIDEO', 7);

-- Phase 3
INSERT INTO `lectures` (`section_id`, `title`, `external_link`, `duration`, `is_preview`, `lecture_type`, `order_index`) VALUES
(3, 'Day 15: 1D Arrays - Creation, Traversal & Linear/Binary Search', 'https://www.youtube.com/watch?v=5S_vS_vS_vS', '38:00', FALSE, 'VIDEO', 1),
(3, 'Day 16: 2D Arrays, Matrix Multiplication & Spiral Traversal', 'https://www.youtube.com/watch?v=6S_vS_vS_vS', '35:20', FALSE, 'VIDEO', 2),
(3, 'Day 17: Strings, StringBuilder & String Constant Pool', 'https://www.youtube.com/watch?v=6S_vS_vS_vS', '34:15', FALSE, 'VIDEO', 3),
(3, 'Day 18: Bit Manipulation Tricks for Competitive Coding', 'https://www.youtube.com/watch?v=7S_vS_vS_vS', '29:40', FALSE, 'VIDEO', 4),
(3, 'Day 19: Recursion Level 1 (Factorial, Fibonacci, Print N to 1)', 'https://www.youtube.com/watch?v=7S_vS_vS_vS', '42:10', FALSE, 'VIDEO', 5),
(3, 'Day 20: Recursion Level 2 (Tower of Hanoi, Subsequences)', 'https://www.youtube.com/watch?v=8S_vS_vS_vS', '48:30', FALSE, 'VIDEO', 6),
(3, 'Day 21: Backtracking Intro - N-Queens & Sudoku Solver', 'https://www.youtube.com/watch?v=9S_vS_vS_vS', '54:00', FALSE, 'VIDEO', 7),
(3, 'Day 22: Time & Space Complexity (Big-O Notation)', 'https://www.youtube.com/watch?v=10S_vS_vS_vS', '35:00', FALSE, 'VIDEO', 8);

-- Phase 4
INSERT INTO `lectures` (`section_id`, `title`, `external_link`, `duration`, `is_preview`, `lecture_type`, `order_index`) VALUES
(4, 'Day 23: Sorting Algorithms (Bubble, Selection, Insertion, Merge, Quick)', 'https://www.youtube.com/watch?v=7S_vS_vS_vS', '50:00', FALSE, 'VIDEO', 1),
(4, 'Day 24: Singly & Doubly Linked Lists with Interview Questions', 'https://www.youtube.com/watch?v=8S_vS_vS_vS', '52:15', FALSE, 'VIDEO', 2),
(4, 'Day 25: Stacks & Queues - Implementation & Monotonic Stack', 'https://www.youtube.com/watch?v=9S_vS_vS_vS', '46:40', FALSE, 'VIDEO', 3),
(4, 'Day 26: Binary Trees (Traversals, Height, Diameter, Views)', 'https://www.youtube.com/watch?v=10S_vS_vS_vS', '58:20', FALSE, 'VIDEO', 4),
(4, 'Day 27: Binary Search Tree (BST) & Balanced BST', 'https://www.youtube.com/watch?v=11S_vS_vS_vS', '49:10', FALSE, 'VIDEO', 5),
(4, 'Day 28: Heaps & Priority Queues (Min-Heap, Max-Heap, Top-K)', 'https://www.youtube.com/watch?v=12S_vS_vS_vS', '47:30', FALSE, 'VIDEO', 6),
(4, 'Day 29: Hashing, HashMap & HashSet Internal Working', 'https://www.youtube.com/watch?v=13S_vS_vS_vS', '44:00', FALSE, 'VIDEO', 7),
(4, 'Day 30: Dynamic Programming (0/1 Knapsack, LCS, LIS) & Next Steps', 'https://www.youtube.com/watch?v=14S_vS_vS_vS', '65:00', FALSE, 'VIDEO', 8);
