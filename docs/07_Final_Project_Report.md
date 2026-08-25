# Final Project Report — SchoolHub

## Table of Contents
1. Introduction
2. Objectives
3. Technology Stack
4. System Architecture
5. Modules Overview
6. Implementation Highlights
7. DevOps Implementation
8. Cloud Deployment
9. Testing
10. Demo Flow
11. Screenshots
12. Challenges Faced
13. Future Enhancements
14. Conclusion
15. Team

## 1. Introduction
SchoolHub is a web-based School Management System developed using React, TypeScript, Node.js, Express, and PostgreSQL. It digitizes school operations including admissions, attendance, examinations, fees, timetables, and communication through a secure, role-based interface. The project demonstrates a complete DevOps pipeline with Git/GitHub, Jenkins CI, Docker containerization, Ansible configuration management, and Azure DevOps cloud deployment.

## 2. Objectives
- Automate daily school administrative tasks
- Provide role-based access for different stakeholders (Admin, Principal, Teacher, Student, Parent)
- Generate reports and analytics for informed decision-making
- Demonstrate DevOps practices: CI/CD, Docker, Ansible, Azure deployment
- Deploy a working application on Azure cloud within $100 student credit budget

## 3. Technology Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 18, TypeScript, Vite, Tailwind CSS, shadcn/ui |
| Backend | Node.js 18, Express 4.x, TypeScript |
| Database | PostgreSQL 15, Prisma ORM 5.x |
| Auth | JWT + bcrypt |
| Containers | Docker + Docker Compose |
| CI | Jenkins (GitHub webhook) |
| CD | Azure DevOps Pipelines |
| Config Mgmt | Ansible |
| Cloud | Microsoft Azure (B1s VM) |
| Reverse Proxy | Nginx + SSL (Let's Encrypt) |

## 4. System Architecture

```
Developer → GitHub → Jenkins CI → Docker Build → Ansible → Azure VM → SchoolHub LIVE
```

The application follows a three-tier architecture:
- **Presentation:** React SPA served by Nginx
- **Application:** Express.js REST API with JWT auth and RBAC
- **Data:** PostgreSQL with Prisma ORM

All services run as Docker containers orchestrated by Docker Compose on an Azure Ubuntu VM.

## 5. Modules Overview

| # | Module | Status | Description |
|---|--------|--------|-------------|
| 1 | Authentication | ✅ Done | JWT login, RBAC, admin super-authority |
| 2 | Dashboard | 🔄 In Progress | Role-specific views with KPIs |
| 3 | User Management | ✅ Done | Admin CRUD for all user types |
| 4 | Student Management | ✅ Done | Admission, search, promote, transfer |
| 5 | Teacher Management | ✅ Done | Profiles, subject assignment |
| 6 | Class & Subject | 🔄 In Progress | Classes, sections, subjects per year |
| 7 | Academic Year | ✅ Done | Year and term management |
| 8 | Timetable | ⏳ Upcoming | Weekly schedule with conflict detection |
| 9 | Attendance | ⏳ Upcoming | Mark and track daily attendance |
| 10 | Examinations | ⏳ Upcoming | Exam scheduling, marks entry |
| 11 | Report Cards | ⏳ Upcoming | PDF report generation |
| 12 | Assignments | ⏳ Upcoming | Create, submit, grade |
| 13 | Fees | ⏳ Upcoming | Structure, payments, receipts |
| 14 | Transport | ⏳ Upcoming | Routes, vehicles, allocation |
| 15 | Notices | ⏳ Upcoming | Announcements and events |
| 16 | Communication | ⏳ Upcoming | Messages and broadcasts |
| 17 | Reports | ⏳ Upcoming | Analytics and PDF export |
| 18 | Audit Logs | ⏳ Upcoming | Activity tracking |
| 19 | Settings | ✅ Done | Module visibility controls |

## 6. Implementation Highlights

### Admin Super-Authority
The administrator has unrestricted access to all modules. A dedicated `isAdmin` middleware bypasses all RBAC checks, granting full CRUD access to every entity.

### Module Visibility Controls
Admin can toggle visibility of sensitive features (exam results, fee reports) per role. Settings are stored in the database and take effect immediately without server restart.

### Teacher Subject Assignment
Teachers are assigned to subjects and classes through a many-to-many relationship, enabling proper timetable generation and attendance responsibility.

## 7. DevOps Implementation

### 7.1 Git/GitHub
- Repository: `github.com/aucegdev/schoolhub`
- Branch strategy: `main` → `develop` → `feature/*`
- Pull request workflow with code review
- Branch protection on `main`

### 7.2 Jenkins CI
- Server installed on Azure VM
- GitHub webhook triggers build on every push
- Pipeline stages: Checkout → Install → Lint → Test → Build → Docker Build
- Jenkinsfile defined in repository root

### 7.3 Docker
- Frontend: Nginx serving React static files
- Backend: Node.js with Express
- Database: PostgreSQL 15
- All orchestrated via `docker-compose.yml`

### 7.4 Ansible
- Inventory: Azure VM IP and credentials
- Roles: docker, nginx, schoolhub, ssl
- Playbook provisions fresh VM to running application

### 7.5 Azure DevOps
- Pipeline triggered on PR merge to `main`
- Multi-stage: Build & Test → Docker Build → Deploy
- Publishes test results and artifacts

### 7.6 Azure Deployment
- VM: B1s (1 vCPU, 1GB RAM) Ubuntu 22.04
- Cost: ~$18/month from $100 student credit
- Nginx reverse proxy with SSL
- Docker Compose auto-restart on reboot

## 8. Cloud Deployment

| Resource | Specification | Monthly Cost |
|----------|--------------|-------------|
| Azure VM | B1s, Ubuntu 22.04 | ~$15 |
| Managed Disk | 20GB SSD | ~$2 |
| Bandwidth | Minimal | ~$1 |
| **Total** | | **~$18** |

Application accessible at: `https://schoolhub.<domain>.com` or `http://<public-ip>`

## 9. Testing

*Test results to be populated after Week 5-6 execution.*

- Unit tests: Jest (backend), Vitest (frontend)
- Integration tests: Supertest
- E2E tests: Cypress
- Docker build verification
- Jenkins pipeline verification
- Azure pipeline verification

## 10. Demo Flow

### Application Demo (8 minutes)
1. Login as Admin → Dashboard shows school overview
2. Create Student → Fill admission form → Student created
3. Login as Teacher → View assigned classes
4. Mark Attendance → Select class → Mark present/absent
5. Create Exam → Enter marks for students
6. Generate Report Card → PDF downloaded
7. Login as Parent → View child's attendance, results, fees

### DevOps Demo (5 minutes)
1. Push code to GitHub feature branch
2. Create Pull Request → Jenkins build triggers automatically
3. Jenkins: Install → Lint → Test → Build → Docker Build → ✅
4. Merge PR → Azure DevOps pipeline triggers
5. Azure: Build → Test → Docker → Deploy to VM
6. Open browser → Application updated LIVE

## 11. Screenshots
*Screenshots to be captured during Week 5-6.*

- Login page
- Admin dashboard
- Student management
- Teacher management
- Attendance marking
- Exam and marks entry
- Report card PDF
- Parent dashboard
- Jenkins pipeline
- Azure DevOps pipeline
- Docker containers running
- Application on Azure VM

## 12. Challenges Faced
*To be documented during development.*

## 13. Future Enhancements

| Enhancement | Technology | Priority |
|-------------|-----------|----------|
| Mobile Application | React Native | High |
| OCR Mark Assignment | Python, Tesseract OCR | Medium |
| ML Performance Prediction | Python, scikit-learn | Medium |
| AI Chatbot | OpenAI API | Low |
| Face Recognition Attendance | OpenCV, dlib | Low |
| Online Payment Gateway | Razorpay/Stripe | Low |
| Email/SMS Notifications | Twilio, SendGrid | Medium |
| Advanced Analytics Dashboard | D3.js, Recharts | Medium |

## 14. Conclusion
SchoolHub successfully demonstrates a full-stack web application with comprehensive DevOps practices. The system provides role-based access for administrators, teachers, students, and parents with modules covering all major school operations. The DevOps pipeline showcases Git/GitHub version control, Jenkins CI, Docker containerization, Ansible configuration management, and Azure DevOps cloud deployment — meeting all syllabus requirements for the DevOps course.

## 15. Team

| Roll No. | Name | Contribution |
|----------|------|-------------|
| 2023103032 | Jivetesh | Backend, Database, Testing |
| 2023103546 | Kathir Kalidass B | Full Stack, DevOps, Architecture |
| 2023103714 | Paril T | Frontend, UI/UX, Reports |
