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

## 2. Overall Description

### 2.1 User Characteristics
- **Administrators:** IT staff managing the system
- **Principal:** School head with academic oversight
- **Teachers:** Subject and class teachers
- **Students:** Enrolled learners
- **Parents:** Guardians of students

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

### 3.2 User Management Module
**FR-05:** Admin shall create, edit, deactivate, and delete users.
**FR-06:** Users shall update their profile information.
**FR-07:** System shall log all user activities.

### 3.3 Student Management Module
**FR-08:** Admin shall register students with admission number, roll number, name, DOB, gender, blood group, email, phone, address, parent details, class, section, and photo.
**FR-09:** Admin shall edit, delete, promote, and transfer students.
**FR-10:** System shall support student search by name, roll number, or admission number.

### 3.4 Teacher Management Module
**FR-11:** Admin shall manage teacher profiles (employee ID, name, qualification, experience, department, subjects, salary).
**FR-12:** Admin shall assign teachers to subjects and classes.

### 3.5 Academic Management Module
**FR-13:** System shall manage classes, sections, and subjects per academic year.
**FR-14:** System shall generate weekly timetables with conflict detection.

### 3.6 Attendance Module
**FR-15:** Teachers shall mark student attendance as Present/Absent/Late/Leave.
**FR-16:** System shall calculate attendance percentage per student per month.

### 3.7 Examination Module
**FR-17:** Admin shall create exams with configurable types (Internal/Midterm/Model/Final) and max marks (25/50/80/100).
**FR-18:** Teachers shall enter marks per subject per student.
**FR-19:** System shall calculate grades, ranks, and pass/fail status.
**FR-20:** System shall generate report cards in PDF format.

### 3.8 Assignment Module
**FR-21:** Teachers shall create assignments with due dates and file attachments.
**FR-22:** Students shall submit assignments with file uploads.
**FR-23:** Teachers shall grade submissions and provide feedback.

### 3.9 Fees Module
**FR-24:** Admin shall define fee structures per class.
**FR-25:** System shall record payments, generate receipts, and track pending fees.
**FR-26:** System shall calculate fines for overdue payments.

### 3.10 Transport Module
**FR-27:** Admin shall manage vehicles, drivers, routes, and bus stops.
**FR-28:** Admin shall assign students to routes.

### 3.11 Notices & Events Module
**FR-29:** Authorized users shall publish notices and events.
**FR-30:** System shall display active notices on user dashboards.

### 3.12 Reports Module
**FR-31:** System shall generate attendance, fee, exam, and student reports.
**FR-32:** Reports shall be exportable as PDF.

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

### UC-04: Fee Payment
1. Accountant selects student
2. System displays fee structure and dues
3. Accountant records payment amount
4. System generates receipt
5. System updates fee status
