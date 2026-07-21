# Software Requirements Specification — SchoolHub

## 1. Introduction

### 1.1 Purpose
This SRS describes the functional and non-functional requirements for SchoolHub, a web-based School Management System.

### 1.2 Scope
SchoolHub automates student admissions, attendance tracking, examination management, fee collection, timetable scheduling, assignment submissions, transport management, notices, and reporting.

### 1.3 Definitions
- **RBAC:** Role-Based Access Control
- **JWT:** JSON Web Token
- **Prisma:** TypeScript ORM for PostgreSQL
- **CRUD:** Create, Read, Update, Delete
- **Admin Super-Authority:** Administrator has unrestricted access to all modules, can manage all user accounts, configure school settings, and toggle visibility of sensitive features

## 2. Overall Description

### 2.1 User Characteristics
- **Administrators (Super-Authority):** IT staff managing the system. Has unrestricted access to all modules. Can create/edit/delete any user account (including other admins). Manages school configuration, branding, academic years. Controls visibility of sensitive features (exam results, fee reports, student details) via toggle switches per role. Full audit log access.
- **Principal:** School head with academic oversight. Manages teachers, views reports, can also teach classes and manage subjects.
- **Teachers:** Subject and class teachers. Manage assigned classes, mark attendance, conduct exams, create assignments, grade submissions.
- **Students:** Enrolled learners. View personal timetable, attendance, marks, homework, fee status. Cannot view results if admin has toggled them off.
- **Parents:** Guardians of students. Track child's progress, attendance, exam results (if enabled by admin), fee dues, school notices.

### 2.2 Operating Environment
- Web browser (Chrome, Firefox, Edge, Safari)
- Server: Linux (Ubuntu) on Azure VM
- Database: PostgreSQL 15
- Container: Docker

### 2.3 Design Constraints
- TypeScript for both frontend and backend
- PostgreSQL as primary database
- REST API architecture
- JWT for stateless authentication

## 3. Functional Requirements

### 3.1 Authentication Module
**FR-01:** System shall authenticate users via email and password.
**FR-02:** System shall issue JWT access tokens valid for 7 days.
**FR-03:** System shall support password reset via email.
**FR-04:** System shall enforce role-based access on all API endpoints.
**FR-05:** Administrator has super-authority — bypasses all role-based restrictions, has full CRUD access to all entities.

### 3.2 User Management Module (Admin-Only)
**FR-06:** Admin shall create, edit, deactivate, and delete all user accounts (admin, principal, teacher, student, parent).
**FR-07:** Admin shall assign and modify roles and permissions for any user.
**FR-08:** Admin shall reset passwords for any user.
**FR-09:** Users (non-admin) shall update only their own profile information.
**FR-10:** System shall log all user activities including admin actions.

### 3.3 Student Management Module
**FR-11:** Admin shall register students with admission number, roll number, name, DOB, gender, blood group, email, phone, address, parent details, class, section, and photo.
**FR-12:** Admin shall edit, delete, promote, and transfer students.
**FR-13:** System shall support student search by name, roll number, or admission number.

### 3.4 Teacher Management Module
**FR-14:** Admin shall manage teacher profiles (employee ID, name, qualification, experience, department, subjects, salary).
**FR-15:** Admin shall assign teachers to subjects and classes.

### 3.5 Academic Management Module
**FR-16:** System shall manage classes, sections, and subjects per academic year.
**FR-17:** System shall generate weekly timetables with conflict detection.

### 3.6 Attendance Module
**FR-18:** Teachers shall mark student attendance as Present/Absent/Late/Leave.
**FR-19:** System shall calculate attendance percentage per student per month.

### 3.7 Examination Module
**FR-20:** Admin shall create exams with configurable types (Internal/Midterm/Model/Final) and max marks (25/50/80/100).
**FR-21:** Teachers shall enter marks per subject per student.
**FR-22:** System shall calculate grades, ranks, and pass/fail status.
**FR-23:** System shall generate report cards in PDF format.
**FR-24:** Admin can toggle exam result visibility — when disabled, students and parents cannot view results (API returns 403, UI hides results section).

### 3.8 Assignment Module
**FR-25:** Teachers shall create assignments with due dates and file attachments.
**FR-26:** Students shall submit assignments with file uploads.
**FR-27:** Teachers shall grade submissions and provide feedback.

### 3.9 Fees Module
**FR-28:** Admin shall define fee structures per class.
**FR-29:** System shall record payments, generate receipts, and track pending fees.
**FR-30:** System shall calculate fines for overdue payments.
**FR-31:** Admin can toggle fee report visibility per role.

### 3.10 Transport Module
**FR-32:** Admin shall manage vehicles, drivers, routes, and bus stops.
**FR-33:** Admin shall assign students to routes.

### 3.11 Notices & Events Module
**FR-34:** Authorized users shall publish notices and events.
**FR-35:** System shall display active notices on user dashboards.

### 3.12 Reports Module
**FR-36:** System shall generate attendance, fee, exam, and student reports.
**FR-37:** Reports shall be exportable as PDF.

### 3.13 Module Visibility Control Module
**FR-38:** Admin shall enable or disable access to specific modules/routes (exam results, fee reports, student details, etc.) on a per-role basis.
**FR-39:** System shall store visibility settings in the database as key-value pairs.
**FR-40:** When a module is disabled for a role, API requests shall return 403 Forbidden.
**FR-41:** Frontend shall hide disabled module UI elements based on visibility settings.
**FR-42:** Visibility changes shall take effect immediately without server restart.

## 4. Non-Functional Requirements

| ID | Requirement | Constraint |
|----|-------------|------------|
| NFR-01 | Performance | API response < 2s for 90% requests |
| NFR-02 | Scalability | Support 500+ concurrent users |
| NFR-03 | Security | bcrypt for passwords, JWT for sessions |
| NFR-04 | Availability | 99% uptime during school hours |
| NFR-05 | Usability | Responsive design for desktop and tablet |
| NFR-06 | Maintainability | Modular codebase with TypeScript |

## 5. Use Cases

### UC-01: User Login
1. User navigates to login page
2. User enters email and password
3. System validates credentials
4. System issues JWT token
5. User redirected to role-specific dashboard

### UC-02: Mark Attendance
1. Teacher logs in
2. Teacher selects class and date
3. System displays student list
4. Teacher marks attendance for each student
5. System saves attendance records

### UC-03: Generate Report Card
1. Admin selects exam and class
2. System calculates grades and ranks
3. System generates PDF report cards
4. Admin downloads or prints report cards

### UC-04: Fee Payment (Admin)
1. Admin selects student
2. System displays fee structure and dues
3. Admin records payment amount
4. System generates receipt
5. System updates fee status

### UC-05: Admin Toggles Result Visibility
1. Admin navigates to Settings → Module Visibility
2. System displays list of modules/features with per-role toggle switches
3. Admin sets "Exam Results" for STUDENT and PARENT roles to OFF
4. System saves visibility settings
5. Admin logs out
6. Student logs in — results page shows "Not available" / API returns 403
7. Admin toggles back to ON — student can view results again
