# Project Timeline — SchoolHub

## Team Members

| Roll No. | Name | Role |
|----------|------|------|
| 2023103032 | Jivetesh | Backend Developer, Database Design, Testing |
| 2023103546 | Kathir Kalidass B | Full Stack & DevOps Lead, Architecture, CI/CD |
| 2023103714 | Paril T | Frontend Developer, UI/UX, Reports |

## Module Distribution

| Member | Application Modules | DevOps Responsibility |
|--------|-------------------|----------------------|
| Jivetesh | Auth, User Management, Student Management, Parent Management, Audit Logs | Testing & quality assurance |
| Kathir Kalidass B | Dashboard, School Admin, Teacher CRUD, Academic Management, Timetable, Settings, Communication, Reports, Events & Notice Board | Jenkins, Docker, Ansible, Azure DevOps, CI/CD pipeline |
| Paril T | Attendance, Examination, Assignment & Homework, Fees, Transport | Frontend Docker config, Nginx |

## Weekly Schedule

| Week | Dates | Sprint | Application Deliverables | DevOps Deliverables |
|------|-------|--------|------------------------|-------------------|
| W1 | 22 Jul – 28 Jul | Foundation | GitHub repo, Prisma schema, Auth module, Docker setup | GitHub repo + branches, `.gitignore`, README |
| W2 | 29 Jul – 4 Aug | Core Data | Student CRUD, Teacher CRUD, Class/Subject CRUD, User Management | Feature branches + PR workflow established |
| W3 | 5 Aug – 11 Aug | Academics | Timetable, Attendance, Dashboard | Jenkins server setup, GitHub webhook configured |
| W4 | 12 Aug – 18 Aug | Assessment | Exams, Marks, Report Cards, Assignments, Fees | Jenkinsfile written, first CI pipeline green |
| W5 | 19 Aug – 25 Aug | Operations + DevOps | Transport, Notices, Events, Communication, Reports | Docker Compose complete, Azure DevOps pipeline, Ansible playbooks |
| W6 | 26 Aug – 1 Sep | Deploy + Polish | UI polish, bug fixes, testing, documentation | Azure VM provisioned, application deployed LIVE, SSL, monitoring |

## Detailed Phase Breakdown

### Phase 1: Foundation (Week 1) ✅ COMPLETED
- [x] GitHub repository created with README and .gitignore
- [x] Branch strategy implemented (main, develop, feature/*)
- [x] Prisma schema designed with all models
- [x] Authentication module (login, JWT, RBAC)
- [x] Docker basic setup
- [x] Project documentation (Charter, PRD, SRS, TRD)
- [x] Thesis LaTeX template

### Phase 2: Core Modules (Week 2) ✅ COMPLETED
- [x] Student CRUD operations
- [x] Teacher CRUD operations
- [x] Teacher Subject Assignment
- [x] Academic Year & Terms
- [x] School Information Setup
- [x] Calendar & Holidays
- [x] Pull Request workflow functional

### Phase 3: Academics (Week3) 🔄 IN PROGRESS
- [ ] Class & Section management
- [ ] Subject management per class
- [ ] Timetable creation with conflict detection
- [ ] Attendance marking by teachers
- [ ] Dashboard (role-specific views)
- [ ] Jenkins server installed and configured

### Phase 4: Assessment (Week4) ⏳ UPCOMING
- [ ] Exam creation and scheduling
- [ ] Marks entry by teachers
- [ ] Grade calculation and ranking
- [ ] Report card PDF generation
- [ ] Assignment creation and submission
- [ ] Fee structure and payment recording
- [ ] Jenkinsfile written and CI pipeline verified

### Phase 5: Operations + DevOps (Week5) ⏳ UPCOMING
- [ ] Transport management
- [ ] Notice board and events
- [ ] Communication module
- [ ] Reports and analytics
- [ ] Docker Compose finalized (all services)
- [ ] Azure DevOps pipeline configured
- [ ] Ansible playbooks for VM provisioning
- [ ] Frontend UI enhancement pass

### Phase 6: Deploy + Polish (Week6) ⏳ UPCOMING
- [ ] Azure VM provisioned (B1s Ubuntu 22.04)
- [ ] Ansible runs: Docker + Nginx + SchoolHub deployed
- [ ] SSL certificate (Let's Encrypt)
- [ ] Application accessible via public IP
- [ ] End-to-end testing
- [ ] Bug fixes and UI polish
- [ ] Final documentation (Testing Report, Final Report, DevOps Implementation)
- [ ] Thesis finalized
- [ ] Demo presentation prepared
- [ ] Demo day

## Milestones

| Milestone | Date | Application Criteria | DevOps Criteria |
|-----------|------|---------------------|----------------|
| M1: Foundation | 28 Jul | Working auth, DB connected, Docker up | GitHub repo + branches |
| M2: Core Modules | 4 Aug | Student, Teacher, Class APIs functional | PR workflow established |
| M3: Academics | 11 Aug | Timetable, Attendance, Dashboard working | Jenkins installed + webhook |
| M4: Assessment | 18 Aug | Exams, marks, report cards, fees | First CI pipeline green |
| M5: DevOps Complete | 25 Aug | All P0+P1 modules functional | Docker + Azure Pipeline + Ansible |
| M6: Final Delivery | 1 Sep | All docs, testing, demo ready | Application LIVE on Azure |

## Branch Strategy

```
main ─────────────────► production-ready code
  │
develop ──────────────► integration branch
  │
  ├── feature/student-management    ✅ merged
  ├── feature/teacher-crud          ✅ merged
  ├── feature/teacher-subject       ✅ merged
  ├── feature/academic-year         ✅ merged
  ├── feature/calendar-holidays     ✅ merged
  ├── feature/school-info           ✅ merged
  ├── feature/class-section         🔄 in progress
  ├── feature/timetable             ⏳ upcoming
  ├── feature/attendance            ⏳ upcoming
  ├── feature/exam-marks            ⏳ upcoming
  ├── feature/fees                  ⏳ upcoming
  ├── feature/dashboard             ⏳ upcoming
  ├── feature/devops                ⏳ upcoming
  └── feature/ui-enhancement        ⏳ upcoming
```

## Development Workflow
1. Create feature branch from `develop`
2. Develop and test locally
3. Create Pull Request to `develop`
4. Code review by another team member
5. Jenkins CI runs on PR (lint + test + build)
6. Merge to `develop` after approval
7. At milestone: merge `develop` → `main`
8. Azure DevOps pipeline deploys from `main`

## Risk Register

| Risk | Impact | Mitigation |
|------|--------|------------|
| Azure credits exhausted | Can't deploy | Use B1s VM, shut down when not in use |
| Jenkins webhook fails | CI doesn't trigger | Use Azure Pipelines as backup |
| Core modules incomplete | Demo fails | Prioritize P0 modules, cut P2 |
| Docker build fails | Deployment blocked | Test Docker locally before pushing |
| Ansible fails on VM | Manual intervention | Keep manual deployment as fallback |
