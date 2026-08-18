# 🎓 EduStream LMS — Full Stack Java Spring Boot & React Application

A modern, enterprise-grade Learning Management System (LMS) built with **Java 17 / 21**, **Spring Boot 3.3.x**, **Spring Data JPA / Hibernate**, **MySQL 8.0+**, **Spring Security 6 with JWT**, and a modern **React 19 + TypeScript + Tailwind CSS** frontend.

---

## 📂 Project Architecture

```
edustream-lms/
├── backend/                                   # ☕ Java Spring Boot 3 Backend
│   ├── pom.xml                                # Maven Dependencies (JPA, MySQL, Security, JWT, Lombok, OpenAPI)
│   └── src/
│       └── main/
│           ├── java/com/edustream/lms/
│           │   ├── LmsApplication.java        # Spring Boot Entrypoint (@SpringBootApplication)
│           │   ├── config/                    # Security, JWT & CORS Configurations
│           │   │   ├── CorsConfig.java
│           │   │   ├── JwtAuthenticationFilter.java
│           │   │   ├── JwtUtil.java
│           │   │   └── SecurityConfig.java
│           │   ├── controller/                # REST Controllers (Auth, Courses, Progress, Enrollments)
│           │   │   ├── AuthController.java
│           │   │   ├── CourseController.java
│           │   │   ├── EnrollmentController.java
│           │   │   ├── ProgressController.java
│           │   │   └── SeedController.java
│           │   ├── dto/                       # Data Transfer Objects & API Response Models
│           │   ├── model/                     # JPA Entities (User, Course, Section, Lecture, Progress, etc.)
│           │   │   ├── Course.java
│           │   │   ├── CourseResource.java
│           │   │   ├── Enrollment.java
│           │   │   ├── Lecture.java
│           │   │   ├── Progress.java
│           │   │   ├── Review.java
│           │   │   ├── Role.java
│           │   │   ├── Section.java
│           │   │   └── User.java
│           │   ├── repository/                # Spring Data JPA Repositories
│           │   └── service/                   # Business Logic & Data Seeder
│           └── resources/
│               ├── application.properties     # Database & Security configs
│               ├── schema.sql                 # Complete MySQL DDL scripts
│               └── data.sql                   # Seed data (JAVA TO DSA IN 30 DAYS course)
│
├── src/                                       # ⚡ React 19 + TypeScript Frontend
│   ├── components/                            # Navbar, Footer, Modal, Course Cards
│   ├── pages/                                 # Home, Courses, VideoPlayer, Dashboards, Java IDE Guide
│   ├── index.css                              # Tailwind CSS styling
│   └── App.tsx                                # Routing & App state
├── server.ts                                  # Cloud preview & API gateway
├── package.json                               # Frontend dependencies
└── README.md                                  # Setup & IntelliJ IDEA Guide
```

---

## 💻 How to Open and Run in IntelliJ IDEA

### Step 1: Open in IntelliJ IDEA
1. Launch **IntelliJ IDEA** (Community or Ultimate Edition).
2. Click **Open** (or `File > Open...`).
3. Select the `backend/pom.xml` file or the root project directory.
4. When prompted, select **"Open as Project"** and trust the Maven project.
5. IntelliJ IDEA will automatically download all Maven dependencies and index the project.

### Step 2: Set up MySQL Database
Create the database in your local MySQL instance (or run via Docker):

```sql
CREATE DATABASE edustream_lms CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

*Or via Docker:*
```bash
docker run --name edustream-mysql -e MYSQL_ROOT_PASSWORD=root -e MYSQL_DATABASE=edustream_lms -p 3306:3306 -d mysql:8.0
```

### Step 3: Configure Database Connection
Open `backend/src/main/resources/application.properties` and verify your credentials:
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/edustream_lms?createDatabaseIfNotExist=true&useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC
spring.datasource.username=root
spring.datasource.password=root
```

### Step 4: Run the Backend
1. Locate `backend/src/main/java/com/edustream/lms/LmsApplication.java`.
2. Right-click and choose **Run 'LmsApplication'** (or click the green Play icon).
3. The server will start on port `8080`.
4. Open your browser and navigate to:
   - **Swagger / OpenAPI Documentation:** [http://localhost:8080/swagger-ui.html](http://localhost:8080/swagger-ui.html)
   - **API Base URL:** [http://localhost:8080/api](http://localhost:8080/api)

---

## 🌐 Running the Frontend
In your terminal:
```bash
npm install
npm run dev
```
The React frontend will be available at [http://localhost:3000](http://localhost:3000).

---

## 🎯 Key Features Included

- 🚀 **"JAVA TO DSA IN 30 DAYS" Course**: Full 30-day curriculum with YouTube playlist integration, unique lecture IDs, downloadable PDF study notes, and roadmap.
- 📊 **Video Lecture Progress Tracker**: Real-time progress bar, automated Next Lecture advance upon completion, and section completion metrics.
- 🎓 **Student & Instructor Dashboards**: Enrolled courses with visual progress bars, curriculum management, and one-click seeding.
- 🔒 **Security & Authentication**: Spring Security 6 with stateless JWT Bearer token authentication and role-based access control (`STUDENT`, `INSTRUCTOR`, `ADMIN`).
- 📑 **OpenAPI / Swagger**: Interactive API exploration at `/swagger-ui.html`.
