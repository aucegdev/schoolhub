# Product Requirements Document — SchoolHub

## Vision Statement
SchoolHub aims to be a single, unified platform that connects all stakeholders in a school ecosystem — administrators, teachers, students, and parents — through an intuitive, role-aware interface that streamlines operations and improves communication. The project also serves as a DevOps demonstration, showcasing CI/CD with Jenkins, containerization with Docker, configuration management with Ansible, and cloud deployment with Azure DevOps.

## User Roles

| Role | Description |
|------|-------------|
| Administrator | **Super-authority.** Unrestricted access to all modules. Creates and manages all user accounts. Configures school settings, academic years, branding. Controls visibility of sensitive features via toggle on/off. Full audit log access. |
| Principal | Academic oversight, reports, teacher management. Can also teach classes and manage subjects. |
| Teacher | Manage assigned classes, mark attendance, conduct exams, create assignments, grade submissions. |
| Student | View personal timetable, attendance records, exam marks, homework, fee status. |
| Parent | Track child's progress, view attendance, exam results, fee dues, school notices. |

## Functional Requirements

### F1: Authentication & Authorization
- F1.1 Users shall log in using email and password
- F1.2 System shall issue JWT tokens for session management
- F1.3 Users shall reset forgotten passwords
- F1.4 Access shall be restricted by role (RBAC)
- F1.5 Admin has super-authority — bypasses all role restrictions

### F2: Dashboard
- F2.1 Each role shall see a role-specific dashboard
- F2.2 Dashboards shall display relevant KPIs and recent activity

### F3: User Management (Admin-Only)
- F3.1 Admin shall create, edit, deactivate, and delete all user accounts
- F3.2 Admin shall assign and modify roles and permissions
- F3.3 Admin shall reset passwords for any user

### F4: Student Management
- F4.1 Admin shall register new students with admission details
- F4.2 Admin shall edit, delete, promote, and transfer students
- F4.3 System shall support student search and filtering

### F5: Teacher Management
- F5.1 Admin shall manage teacher profiles and subject assignments
- F5.2 Teachers shall be assignable as class teachers

### F6: Academic Management
- F6.1 System shall manage classes, sections, subjects per academic year
- F6.2 Timetable shall support weekly scheduling with conflict detection

### F7: Attendance
- F7.1 Teachers shall mark student attendance (Present/Absent/Late/Leave)
- F7.2 System shall generate monthly attendance reports

### F8: Examination
- F8.1 Admin shall create exams with configurable max marks
- F8.2 Teachers shall enter marks per subject
- F8.3 System shall calculate grades, ranks, and generate report cards (PDF)
- F8.4 Admin can toggle result visibility

### F9: Fees
- F9.1 Admin shall define fee structures
- F9.2 System shall record payments, generate receipts, track dues
- F9.3 Admin can toggle fee report visibility per role

### F10: Transport
- F10.1 Admin shall manage vehicles, drivers, routes, and student allocation

### F11: Notices & Events
- F11.1 Authorized users shall publish notices and events
- F11.2 System shall display notices on dashboards

### F12: Reports
- F12.1 System shall generate attendance, fee, exam, and student reports
- F12.2 Reports shall be exportable to PDF

### F13: Admin Module Visibility Controls
- F13.1 Admin shall enable or disable access to specific modules per role
- F13.2 Toggle state shall persist in database
- F13.3 Disabled modules shall return 403 or hide UI elements

## CI/CD Acceptance Criteria

| ID | Criterion |
|----|-----------|
| CI-01 | Every push to GitHub triggers Jenkins build within 2 minutes |
| CI-02 | Jenkins pipeline runs: install → lint → test → build → Docker build |
| CI-03 | Pull requests to `main` require at least 1 approval |
| CI-04 | Azure DevOps pipeline runs on PR merge to `main` |
| CI-05 | Docker images built and pushed for both frontend and backend |
| CI-06 | Ansible playbook configures Azure VM from scratch |
| CI-07 | Application accessible via Azure VM public IP after deployment |
| CI-08 | Zero manual deployment steps after code merge to `main` |

## Non-Functional Requirements

| ID | Requirement |
|----|-------------|
| NFR1 | Response time under 2 seconds for 90% of API calls |
| NFR2 | System shall handle 500+ concurrent users |
| NFR3 | Passwords stored as bcrypt hashes |
| NFR4 | JWT tokens expire after configurable duration |
| NFR5 | Application shall be responsive on desktop and tablet |
| NFR6 | Database backups shall be configurable |
| NFR7 | Application shall be deployable via single `docker-compose up` command |

## Success Metrics
- All P0 modules functional and demonstrable
- Jenkins CI pipeline green on every push
- Azure DevOps pipeline builds and deploys successfully
- Application accessible via Azure public URL
- Docker Compose brings up entire stack with one command
- Ansible provisions fresh Ubuntu VM to running application
- Demo flow completes in under 15 minutes
