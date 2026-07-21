# Project Charter — SchoolHub

## Project Title
SchoolHub – Smart School Management System

## Problem Statement
Schools manage admissions, attendance, examinations, fees, timetables, notices, and reports using manual processes or disconnected tools. This leads to data inconsistency, administrative overhead, and poor communication between stakeholders.

## Project Objective
To build a modern, web-based School Management System that digitizes and automates daily school operations with secure role-based access. The system follows a super-admin model where the **Administrator has unrestricted authority** over all modules, school configuration, user management (admin, principal, teacher, student, parent accounts), and can control visibility of sensitive features (results, reports, fees) via toggle controls.

## Scope
**In Scope:**
- Authentication & Role-Based Access Control (with admin super-authority)
- User Management (admin creates/manages all user accounts — admin, principal, teacher, student, parent)
- Student, Teacher, and Parent Management
- Academic Management (Classes, Subjects, Timetable)
- Attendance Tracking
- Examination Management with Report Cards
- Assignment & Homework
- Fees Management
- Transport Management
- Events & Notice Board
- Communication & Notifications
- Reports & Analytics
- Audit Logging

**Out of Scope:**
- Face Recognition Attendance
- AI Chatbot
- Multi-language Support (post-MVP)

## Team Members

| Roll No. | Name | Role |
|----------|------|------|
| 2023103032 | Jivetesh | Backend Developer, Database Design, Testing |
| 2023103546 | Kathir Kalidass B | Full Stack & DevOps, Architecture, CI/CD |
| 2023103714 | Paril T | Frontend Developer, UI/UX, Reports |

*All members are equal contributors.*

## Technology Stack
- **Frontend:** React + TypeScript + Vite + Tailwind CSS + shadcn/ui
- **Backend:** Node.js + Express + TypeScript
- **Database:** PostgreSQL + Prisma ORM
- **Authentication:** JWT + RBAC
- **DevOps:** Docker, Jenkins, Azure DevOps, Ansible
- **Cloud:** Microsoft Azure

## Key Deliverables
1. Fully functional web application with 19 modules
2. REST API Documentation
3. Dockerized application
4. Jenkins CI/CD Pipeline
5. Azure Cloud Deployment
6. Ansible Automation
7. Complete Documentation (SRS, TRD, User Manual)
8. Project Report & Presentation

## Constraints
- 6-week development timeline (22 July – 1 September 2026)
- 3-member team
- Academic project with DevOps syllabus requirements

## Assumptions
- Team has basic familiarity with React, Node.js, and Git
- Azure free tier credits available for deployment
- PostgreSQL chosen as primary database
