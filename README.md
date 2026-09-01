# SchoolHub - Smart School Management System

**Manage. Learn. Grow.**

SchoolHub is a modern school management platform built with React, TypeScript, Node.js, PostgreSQL, and Docker. It supports school administration, academic management, attendance, fees, examinations, and deployment-ready DevOps workflows for local and Azure-based production environments.

## Team

| Roll No. | Name |
|----------|------|
| 2023103032 | Jivetesh |
| 2023103546 | Kathir Kalidass B |
| 2023103714 | Paril T |

## Stack

- Frontend: React 19 + TypeScript + Vite + Tailwind CSS
- Backend: Node.js + Express + TypeScript
- Database: PostgreSQL + Prisma ORM
- Authentication: JWT + Firebase Google OAuth
- DevOps: Docker Compose, Jenkins, Azure DevOps, Ansible, Nginx
- Cloud: Azure VM deployment

## Core Modules

1. Authentication & Authorization
2. Dashboard
3. User Management
4. School Administration
5. Student Management
6. Parent Management
7. Teacher & Staff Management
8. Academic Management
9. Timetable Management
10. Attendance Management
11. Examination Management
12. Assignment & Homework
13. Fees Management
14. Transport Management
15. Events & Notice Board
16. Communication
17. Reports & Analytics
18. Audit Logs
19. Settings

## Branch Strategy

- `main` - production branch
- `dev` - active integration branch
- `feature/*` - feature branches

## Local Setup

1. Copy the env templates:
   - `cp .env.example .env`
   - `cp backend/.env.example backend/.env`
   - `cp frontend/.env.example frontend/.env`
2. Fill in your Firebase values and JWT secret.
3. Start PostgreSQL and services:
   - `docker compose up postgres pgadmin -d`
   - `cd backend && npm install && npx prisma generate && npm run dev`
   - `cd frontend && npm install && npm run dev`

## Firebase Google Login

SchoolHub supports Firebase Google authentication for the web portal. Set the following variables in your frontend env:

- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_STORAGE_BUCKET`
- `VITE_FIREBASE_MESSAGING_SENDER_ID`
- `VITE_FIREBASE_APP_ID`

The backend verifies Firebase ID tokens when configured, while still supporting the existing JWT flow for internal API access.

## Deployment

- Local compose path: `docker compose up --build`
- Azure deployment path: `docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d --build`
- Azure DevOps pipeline definition: `azure-pipelines.yml`
- Jenkins pipeline definition: `Jenkinsfile`

## Documentation

- AI handoff memory: `AI_AGENT.md`
- Agent work history: `.ai/`
- Requirements and architecture: `docs/`

## Important Notes

- Use `dev` as the active branch.
- Keep secrets in `.env` files and never commit them.
- Run `npx prisma validate` after Prisma schema changes.
