# Project Timeline — SchoolHub

## Team Members

| Roll No. | Name |
|----------|------|
| 2023103032 | Jivetesh |
| 2023103546 | Kathir Kalidass B |
| 2023103714 | Paril T |

## Module Distribution

| Member | Modules |
|--------|---------|
| Jivetesh | Authentication, User Management, Student Management, Parent Management, Audit Logs |
| Kathir Kalidass B | Dashboard, School Administration, Teacher & Staff Management, Academic Management, Timetable, Settings, Communication, Reports & Analytics, Events & Notice Board |
| Paril T | Attendance, Examination, Assignment & Homework, Fees, Transport |

## Weekly Schedule

| Week | Dates | Sprint | Deliverables |
|------|-------|--------|--------------|
| W1 | 22 Jul – 28 Jul | Project Setup | GitHub repo, Docker, Prisma schema, Auth module, Docs (Charter, PRD, Timeline) |
| W2 | 29 Jul – 4 Aug | Core Data | Student CRUD, Teacher CRUD, Class/Subject CRUD, User Management |
| W3 | 5 Aug – 11 Aug | Academics | Timetable, Attendance, Dashboard |
| W4 | 12 Aug – 18 Aug | Assessment | Exams, Marks, Report Cards, Assignments, Fees |
| W5 | 19 Aug – 25 Aug | Operations | Transport, Notices, Events, Communication, Reports |
| W6 | 26 Aug – 1 Sep | DevOps & Polish | Docker finalize, Jenkins CI/CD, Azure deploy, Ansible, Testing, Docs, PPT, Demo |

## Milestones

| Milestone | Date | Criteria |
|-----------|------|----------|
| M1: Foundation | 28 Jul | Working auth, DB connected, Docker up, project scaffold |
| M2: Core Modules | 11 Aug | Student, Teacher, Class, Subject APIs functional |
| M3: Academics | 18 Aug | Timetable, Attendance, Dashboard working |
| M4: Assessment | 25 Aug | Exams with marks, report cards, fees collection |
| M5: DevOps Complete | 30 Aug | Docker, Jenkins pipeline, Azure deployment, Ansible |
| M6: Final Delivery | 1 Sep | All docs, testing, PPT, demo ready |

## Branch Strategy

```
main ──► production-ready code
  │
develop ──► integration branch
  │
  ├── feature/auth
  ├── feature/student
  ├── feature/teacher
  ├── feature/class
  ├── feature/timetable
  ├── feature/attendance
  ├── feature/exam
  ├── feature/fees
  ├── feature/transport
  ├── feature/notice
  ├── feature/dashboard
  └── feature/devops
```

## Development Workflow
1. Create feature branch from `develop`
2. Develop and test locally
3. Create Pull Request to `develop`
4. Code review by another team member
5. Merge to `develop`
6. At milestone, merge `develop` → `main`
