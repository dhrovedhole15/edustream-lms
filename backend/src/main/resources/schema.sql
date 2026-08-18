-- ============================================================================
-- EduStream LMS - Complete MySQL Database Schema (DDL)
-- Compatible with MySQL 8.0+
-- ============================================================================

CREATE DATABASE IF NOT EXISTS `edustream_lms` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `edustream_lms`;

-- 1. USERS TABLE
CREATE TABLE IF NOT EXISTS `users` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `email` VARCHAR(150) NOT NULL UNIQUE,
    `password` VARCHAR(255) NOT NULL,
    `display_name` VARCHAR(100) NOT NULL,
    `role` ENUM('STUDENT', 'INSTRUCTOR', 'ADMIN') NOT NULL DEFAULT 'STUDENT',
    `avatar_url` VARCHAR(500) NULL,
    `bio` TEXT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX `idx_user_email` (`email`),
    INDEX `idx_user_role` (`role`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 2. COURSES TABLE
CREATE TABLE IF NOT EXISTS `courses` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `title` VARCHAR(255) NOT NULL,
    `description` LONGTEXT NOT NULL,
    `category` VARCHAR(100) NOT NULL DEFAULT 'development',
    `price` DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    `instructor_id` BIGINT NOT NULL,
    `instructor_name` VARCHAR(150) NOT NULL,
    `thumbnail` VARCHAR(500) NULL,
    `rating` DECIMAL(3, 2) DEFAULT 5.00,
    `reviews_count` INT DEFAULT 0,
    `status` ENUM('DRAFT', 'PUBLISHED', 'ARCHIVED') NOT NULL DEFAULT 'PUBLISHED',
    `featured` BOOLEAN DEFAULT FALSE,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (`instructor_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
    INDEX `idx_course_category` (`category`),
    INDEX `idx_course_status` (`status`),
    INDEX `idx_course_featured` (`featured`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 3. COURSE SECTIONS TABLE
CREATE TABLE IF NOT EXISTS `sections` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `course_id` BIGINT NOT NULL,
    `title` VARCHAR(255) NOT NULL,
    `description` TEXT NULL,
    `order_index` INT NOT NULL DEFAULT 0,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (`course_id`) REFERENCES `courses`(`id`) ON DELETE CASCADE,
    INDEX `idx_section_course` (`course_id`, `order_index`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 4. SECTION LECTURES TABLE
CREATE TABLE IF NOT EXISTS `lectures` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `section_id` BIGINT NOT NULL,
    `title` VARCHAR(255) NOT NULL,
    `external_link` VARCHAR(1000) NOT NULL,
    `duration` VARCHAR(50) DEFAULT '15:00',
    `is_preview` BOOLEAN DEFAULT FALSE,
    `lecture_type` ENUM('VIDEO', 'PDF', 'LINK', 'ARTICLE') NOT NULL DEFAULT 'VIDEO',
    `order_index` INT NOT NULL DEFAULT 0,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (`section_id`) REFERENCES `sections`(`id`) ON DELETE CASCADE,
    INDEX `idx_lecture_section` (`section_id`, `order_index`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 5. COURSE STUDY MATERIALS & RESOURCES TABLE
CREATE TABLE IF NOT EXISTS `course_resources` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `course_id` BIGINT NOT NULL,
    `title` VARCHAR(255) NOT NULL,
    `url` VARCHAR(1000) NOT NULL,
    `resource_type` VARCHAR(50) DEFAULT 'PDF',
    `file_size` VARCHAR(50) DEFAULT '2.4 MB',
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (`course_id`) REFERENCES `courses`(`id`) ON DELETE CASCADE,
    INDEX `idx_resource_course` (`course_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 6. ENROLLMENTS TABLE
CREATE TABLE IF NOT EXISTS `enrollments` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `user_id` BIGINT NOT NULL,
    `course_id` BIGINT NOT NULL,
    `enrolled_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY `unique_user_course_enrollment` (`user_id`, `course_id`),
    FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
    FOREIGN KEY (`course_id`) REFERENCES `courses`(`id`) ON DELETE CASCADE,
    INDEX `idx_enrollment_user` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 7. PROGRESS TABLE
CREATE TABLE IF NOT EXISTS `progress` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `user_id` BIGINT NOT NULL,
    `course_id` BIGINT NOT NULL,
    `progress_percentage` DECIMAL(5, 2) NOT NULL DEFAULT 0.00,
    `last_accessed_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY `unique_user_course_progress` (`user_id`, `course_id`),
    FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
    FOREIGN KEY (`course_id`) REFERENCES `courses`(`id`) ON DELETE CASCADE,
    INDEX `idx_progress_user` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 8. COMPLETED LECTURES JOIN TABLE (PROGRESS DETAIL)
CREATE TABLE IF NOT EXISTS `progress_completed_lectures` (
    `progress_id` BIGINT NOT NULL,
    `lecture_id` BIGINT NOT NULL,
    `completed_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`progress_id`, `lecture_id`),
    FOREIGN KEY (`progress_id`) REFERENCES `progress`(`id`) ON DELETE CASCADE,
    FOREIGN KEY (`lecture_id`) REFERENCES `lectures`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 9. REVIEWS TABLE
CREATE TABLE IF NOT EXISTS `reviews` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `course_id` BIGINT NOT NULL,
    `user_id` BIGINT NOT NULL,
    `rating` INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    `comment` TEXT NOT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (`course_id`) REFERENCES `courses`(`id`) ON DELETE CASCADE,
    FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
    INDEX `idx_review_course` (`course_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
