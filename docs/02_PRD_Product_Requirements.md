# Product Requirements Document — SchoolHub

## Vision Statement
SchoolHub aims to be a single, unified platform that connects all stakeholders in a school ecosystem — administrators, teachers, students, and parents — through an intuitive, role-aware interface that streamlines operations and improves communication.

## User Roles

| Role | Description |
|------|-------------|
| Administrator | Full system access, school settings, all modules |
| Principal | Academic oversight, reports, can teach classes |
| Teacher | Manage classes, attendance, exams, assignments |
| Student | View timetable, attendance, marks, homework, fees |
| Parent | Track child progress, attendance, results, fee status |

## Functional Requirements

### F1: Authentication & Authorization
- F1.1 Users shall log in using email and password
- F1.2 System shall issue JWT tokens for session management
- F1.3 Users shall reset forgotten passwords
- F1.4 Access shall be restricted by role (RBAC)

### F2: Dashboard
- F2.1 Each role shall see a role-specific dashboard
- F2.2 Dashboards shall display relevant KPIs and recent activity

### F3: Student Management
- F3.1 Admin shall register new students with admission details
- F3.2 Admin shall edit, delete, promote, and transfer students
- F3.3 System shall support student search and filtering

### F4: Teacher Management
- F4.1 Admin shall manage teacher profiles and subject assignments
- F4.2 Teachers shall be assignable as class teachers

### F5: Academic Management
- F5.1 System shall manage classes, sections, subjects per academic year
- F5.2 Timetable shall support weekly scheduling with conflict detection

### F6: Attendance
- F6.1 Teachers shall mark student attendance (Present/Absent/Late/Leave)
- F6.2 System shall generate monthly attendance reports

### F7: Examination
- F7.1 Admin shall create exams with configurable max marks
- F7.2 Teachers shall enter marks per subject
- F7.3 System shall calculate grades, rank, and generate report cards (PDF)

### F8: Fees
- F8.1 Admin shall define fee structures
- F8.2 System shall record payments, generate receipts, track dues

### F9: Transport
- F9.1 Admin shall manage vehicles, drivers, routes, and student allocation

### F10: Notices & Events
- F10.1 Authorized users shall publish notices and events
- F10.2 System shall display notices on dashboards

### F11: Reports
- F11.1 System shall generate attendance, fee, exam, and student reports
- F11.2 Reports shall be exportable to PDF

## Non-Functional Requirements

| ID | Requirement |
|----|-------------|
| NFR1 | Response time under 2 seconds for 90% of API calls |
| NFR2 | System shall handle 500+ concurrent users |
| NFR3 | Passwords stored as bcrypt hashes |
| NFR4 | JWT tokens expire after configurable duration |
| NFR5 | Application shall be responsive on desktop and tablet |
| NFR6 | Database backups shall be configurable |
| NFR7 | Application shall be deployable via Docker |

## Success Metrics
- All 19 modules functional
- Zero critical bugs at demo time
- CI/CD pipeline successfully builds and deploys
- Application accessible via Azure public URL
