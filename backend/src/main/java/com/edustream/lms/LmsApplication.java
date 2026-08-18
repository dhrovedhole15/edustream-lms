package com.edustream.lms;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * EduStream LMS - Spring Boot 3 Main Application Entrypoint
 * Openable directly in IntelliJ IDEA or run with: mvn spring-boot:run
 */
@SpringBootApplication
public class LmsApplication {

    public static void main(String[] args) {
        SpringApplication.run(LmsApplication.class, args);
        System.out.println("==========================================================");
        System.out.println("🚀 EduStream LMS Spring Boot Backend is running!");
        System.out.println("👉 API Base URL: http://localhost:8080/api");
        System.out.println("📚 Swagger UI Docs: http://localhost:8080/swagger-ui.html");
        System.out.println("==========================================================");
    }
}
