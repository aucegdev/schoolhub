# Software Requirements Specification — SchoolHub

## 1. Introduction

### 1.1 Purpose
This SRS describes the functional and non-functional requirements for SchoolHub, a web-based School Management System with a complete DevOps CI/CD pipeline.

### 1.2 Scope
SchoolHub automates student admissions, attendance tracking, examination management, fee collection, timetable scheduling, assignment submissions, transport management, notices, and reporting. The system is deployed using Docker containers on an Azure VM, configured by Ansible, with CI/CD through Jenkins and Azure DevOps.

### 1.3 Definitions
- **RBAC:** Role-Based Access Control
- **JWT:** JSON Web Token
- **Prisma:** TypeScript ORM for PostgreSQL
- **Admin Super-Authority:** Administrator has unrestricted access to all modules
- **CI:** Continuous Integration (Jenkins + Azure Pipelines)
- **CD:** Continuous Deployment (Ansible + Docker Compose on Azure VM)

## 2. Overall Description

### 2.1 User Characteristics
- **Administrators (Super-Authority):** Unrestricted access. Creates all user accounts. Toggles module visibility.
- **Principal:** Academic oversight. Manages teachers. Can teach classes.
- **Teachers:** Mark attendance, conduct exams, create assignments, grade.
- **Students:** View timetable, attendance, marks, homework, fee status.
- **Parents:** Track child's progress, attendance, results, fees.

### 2.2 Operating Environment
- **Client:** Web browser (Chrome, Firefox, Edge, Safari)
- **Server:** Ubuntu 22.04 on Azure VM
- **Database:** PostgreSQL 15 (Docker container)
- **Container Runtime:** Docker + Docker Compose
- **Reverse Proxy:** Nginx
- **CI:** Jenkins (on Azure VM or local)
- **CD:** Azure DevOps Pipelines

### 2.3 Design Constraints
- TypeScript for both frontend and backend
- PostgreSQL as primary database
- REST API architecture
- JWT for stateless authentication
- Docker containers for all services
- Ansible for configuration management

## 3. Functional Requirements

### 3.1 Authentication Module
- **FR-01:** System shall authenticate users via email and password
- **FR-02:** System shall issue JWT access tokens valid for 7 days
- **FR-03:** System shall support password reset via email
- **FR-04:** System shall enforce role-based access on all API endpoints
- **FR-05:** Administrator has super-authority — bypasses all role-based restrictions

### 3.2 User Management Module (Admin-Only)
- **FR-06:** Admin shall create, edit, deactivate, and delete all user accounts
- **FR-07:** Admin shall assign and modify roles and permissions
- **FR-08:** Admin shall reset passwords for any user
- **FR-09:** System shall log all user activities including admin actions

### 3.3 Student Management Module
- **FR-10:** Admin shall register students with admission details
- **FR-11:** Admin shall edit, delete, promote, and transfer students
- **FR-12:** System shall support student search by name, roll number, or admission number

### 3.4 Teacher Management Module
- **FR-13:** Admin shall manage teacher profiles
- **FR-14:** Admin shall assign teachers to subjects and classes

### 3.5 Academic Management Module
- **FR-15:** System shall manage classes, sections, and subjects per academic year
- **FR-16:** System shall generate weekly timetables with conflict detection

### 3.6 Attendance Module
- **FR-17:** Teachers shall mark student attendance (Present/Absent/Late/Leave)
- **FR-18:** System shall calculate attendance percentage per student per month

### 3.7 Examination Module
- **FR-19:** Admin shall create exams with configurable types and max marks
- **FR-20:** Teachers shall enter marks per subject per student
- **FR-21:** System shall calculate grades, ranks, and pass/fail status
- **FR-22:** System shall generate report cards in PDF format
- **FR-23:** Admin can toggle exam result visibility

### 3.8 Assignment Module
- **FR-24:** Teachers shall create assignments with due dates
- **FR-25:** Students shall submit assignments
- **FR-26:** Teachers shall grade submissions and provide feedback

### 3.9 Fees Module
- **FR-27:** Admin shall define fee structures per class
- **FR-28:** System shall record payments, generate receipts, track dues
- **FR-29:** Admin can toggle fee report visibility per role

### 3.10 Transport Module
- **FR-30:** Admin shall manage vehicles, drivers, routes
- **FR-31:** Admin shall assign students to routes

### 3.11 Notices & Events Module
- **FR-32:** Authorized users shall publish notices and events
- **FR-33:** System shall display active notices on dashboards

### 3.12 Reports Module
- **FR-34:** System shall generate attendance, fee, exam, and student reports
- **FR-35:** Reports shall be exportable as PDF

### 3.13 Module Visibility Control
- **FR-36:** Admin shall enable or disable modules per role
- **FR-37:** Visibility settings stored in database
- **FR-38:** Disabled modules return 403 / hide UI elements

## 4. Deployment Requirements

### 4.1 Containerization
- **DR-01:** Frontend served as static files via Nginx container
- **DR-02:** Backend runs as Node.js container
- **DR-03:** PostgreSQL runs as official Docker container
- **DR-04:** All services orchestrated via `docker-compose.yml`
- **DR-05:** Single `docker-compose up -d` brings up entire stack

### 4.2 CI/CD Pipeline
- **DR-06:** Jenkins pipeline triggered by GitHub webhook on every push
- **DR-07:** Pipeline stages: Checkout → Install → Lint → Test → Build → Docker Build
- **DR-08:** Azure DevOps pipeline runs on PR merge to `main`
- **DR-09:** Docker images tagged with commit SHA and `latest`
- **DR-10:** Ansible playbook provisions fresh Ubuntu VM to running application

### 4.3 Cloud Deployment
- **DR-11:** Azure B1s VM running Ubuntu 22.04
- **DR-12:** Nginx reverse proxy with SSL (Let's Encrypt)
- **DR-13:** Application accessible via public IP
- **DR-14:** Docker Compose auto-restarts on VM reboot

## 5. Non-Functional Requirements

| ID | Requirement | Constraint |
|----|-------------|------------|
| NFR-01 | Performance | API response < 2s for 90% requests |
| NFR-02 | Scalability | Support 500+ concurrent users |
| NFR-03 | Security | bcrypt passwords, JWT sessions, HTTPS |
| NFR-04 | Availability | 99% uptime during school hours |
| NFR-05 | Usability | Responsive design for desktop and tablet |
| NFR-06 | Maintainability | Modular TypeScript codebase |
| NFR-07 | Deployability | Single command deployment via Docker Compose |
| NFR-08 | Observability | Application logs accessible via `docker logs` |

## 6. Use Cases

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
4. Admin downloads or prints

### UC-04: Fee Payment
1. Admin selects student
2. System displays fee structure and dues
3. Admin records payment
4. System generates receipt

### UC-05: Admin Toggles Result Visibility
1. Admin navigates to Settings → Module Visibility
2. Admin sets "Exam Results" for STUDENT and PARENT to OFF
3. Student logs in — results page shows "Not available"
4. Admin toggles back to ON — student can view results

### UC-06: CI/CD Deployment
1. Developer pushes code to GitHub feature branch
2. Developer creates Pull Request to `develop`
3. Jenkins webhook triggers build
4. Pipeline runs lint, tests, build
5. Docker images built
6. Code reviewed and merged to `main`
7. Azure DevOps pipeline triggered
8. Ansible deploys to Azure VM
9. Application updated with zero downtime
