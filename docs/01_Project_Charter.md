# Project Charter — SchoolHub

## Project Title
SchoolHub – Smart School Management System

## Problem Statement
Schools manage admissions, attendance, examinations, fees, timetables, notices, and reports using manual processes or disconnected tools. This leads to data inconsistency, administrative overhead, and poor communication between stakeholders.

## Project Objective
To build a modern, web-based School Management System that digitizes and automates daily school operations with secure role-based access. The system follows a super-admin model where the **Administrator has unrestricted authority** over all modules, school configuration, user management, and can control visibility of sensitive features via toggle controls. The project also demonstrates a complete DevOps pipeline using Git/GitHub, Jenkins, Docker, Ansible, and Azure DevOps.

## Scope

### In Scope — Application Modules

| # | Module | Priority |
|---|--------|----------|
| 1 | Authentication & Authorization (JWT + RBAC) | P0 |
| 2 | Dashboard (role-specific) | P0 |
| 3 | User Management (admin-only CRUD) | P0 |
| 4 | Student Management | P0 |
| 5 | Teacher & Staff Management | P0 |
| 6 | Class, Section & Subject Management | P0 |
| 7 | Academic Year & Terms | P0 |
| 8 | Timetable Management | P1 |
| 9 | Attendance Management | P1 |
| 10 | Examination & Marks Management | P1 |
| 11 | Report Card Generation (PDF) | P1 |
| 12 | Assignment & Homework | P1 |
| 13 | Fees Management | P1 |
| 14 | Transport Management | P2 |
| 15 | Events & Notice Board | P2 |
| 16 | Communication & Notifications | P2 |
| 17 | Reports & Analytics | P2 |
| 18 | Audit Logs | P2 |
| 19 | Settings & Module Visibility Controls | P0 |

**Priority legend:** P0 = Must have for demo, P1 = Should have, P2 = Nice to have

### In Scope — DevOps Toolchain

| Tool | Role in Project | Syllabus Requirement |
|------|----------------|---------------------|
| Git/GitHub | Source control, branches, PRs, code review | Version control & collaboration |
| Maven/Gradle | Build tool for report-service (Java) or npm build scripts | Build automation |
| Jenkins | CI server — build, test, lint, Docker build on every push | Continuous Integration |
| Docker | Containerize frontend, backend, database | Containerization |
| Ansible | Configure Azure VM, install Docker, deploy application | Configuration management |
| Azure DevOps | Cloud pipeline (azure-pipelines.yml), artifact hosting | Cloud CI/CD |
| Azure VM | Ubuntu server hosting the live application | Cloud deployment |

### Out of Scope (Future Enhancements)
- Mobile application (React Native)
- OCR-based mark assignment from answer sheets
- ML models for performance prediction and grade optimization
- AI Chatbot for FAQ
- Face Recognition Attendance
- Online Payment Gateway integration
- Multi-language Support (post-MVP)

## Team Members

| Roll No. | Name | Role |
|----------|------|------|
| 2023103032 | Jivetesh | Backend Developer, Database Design, Testing |
| 2023103546 | Kathir Kalidass B | Full Stack & DevOps Lead, Architecture, CI/CD |
| 2023103714 | Paril T | Frontend Developer, UI/UX, Reports |

*All members are equal contributors.*

## Technology Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 18 + TypeScript + Vite + Tailwind CSS + shadcn/ui |
| Backend | Node.js 18 + Express 4.x + TypeScript |
| Database | PostgreSQL 15 + Prisma ORM 5.x |
| Authentication | JWT (jsonwebtoken) + bcrypt |
| Validation | Zod |
| Containers | Docker + Docker Compose |
| CI | Jenkins (GitHub webhook triggered) |
| CD | Azure DevOps Pipelines |
| Config Mgmt | Ansible (inventory, playbooks, roles) |
| Cloud | Microsoft Azure (Student $100 credit) |
| Build | Maven (report-service) + npm (frontend/backend) |

## DevOps Pipeline Architecture

```
Developer pushes to GitHub
        │
        ├──▶ Jenkins (via GitHub webhook)
        │       ├── Checkout code
        │       ├── Install dependencies (npm install)
        │       ├── Lint (ESLint)
        │       ├── Unit tests (Jest/Vitest)
        │       ├── Build (Vite build / tsc)
        │       ├── Docker build (frontend + backend images)
        │       └── Push to container registry
        │
        └──▶ Azure DevOps Pipeline (on PR merge to main)
                ├── Build & Test
                ├── Docker build
                └── Deploy to Azure VM via Ansible
                        │
                        ▼
                Azure VM (Ubuntu 22.04)
                ├── Docker Compose
                │   ├── Nginx (reverse proxy)
                │   ├── Frontend container
                │   ├── Backend container
                │   └── PostgreSQL container
                └── SchoolHub LIVE
```

## Azure Budget Plan ($100 Student Credit)

| Resource | Cost | Duration |
|----------|------|----------|
| Azure B1s VM (Ubuntu 22.04, 1 vCPU, 1GB RAM) | ~$15/month | 6 months |
| Managed Disk (20GB SSD) | ~$2/month | 6 months |
| Bandwidth (minimal) | ~$1/month | 6 months |
| **Total estimated** | **~$18/month** | **$108 for 6 months** |

**Strategy:** Use a single VM with Docker Compose. No managed databases, no App Services, no Azure SQL. Keep everything on the VM to minimize cost. Shut down VM when not in use.

## Key Deliverables
1. Fully functional web application with core modules (P0 + P1)
2. Jenkins CI pipeline with GitHub webhook
3. Azure DevOps pipeline with multi-stage build/test/deploy
4. Docker Compose setup (frontend + backend + PostgreSQL + Nginx)
5. Ansible playbooks for VM configuration and deployment
6. Azure VM running SchoolHub live
7. Complete documentation (Charter, PRD, SRS, TRD, Timeline, Testing, Final Report, DevOps Implementation)
8. Thesis document (LaTeX)
9. Demo presentation

## Constraints
- 6-week development timeline (22 July – 1 September 2026)
- 3-member team
- Academic project with DevOps syllabus requirements
- $100 Azure student credit budget
- Must demonstrate: Git/GitHub, Maven/Gradle, Jenkins, Ansible, Azure DevOps, Docker

## Assumptions
- Team has basic familiarity with React, Node.js, and Git
- Azure student account with $100 credit available
- PostgreSQL as primary database
- Node.js npm serves as primary build tool; Maven used for report-service module
