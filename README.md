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

## Environment Setup

SchoolHub uses separate environment files for local development and production:

| File | Purpose | Used By |
|------|---------|---------|
| `.env.local` | Local development (hot-reload, localhost) | `docker compose up` |
| `.env.production` | Azure production (secrets, nginx) | CI/CD, Ansible |
| `.env.test` | CI/CD test stage | Azure Pipelines |
| `.env.example` | Reference template | Copy to create others |

**Quick setup:**
```bash
# 1. Set up local environment
task env:setup

# 2. Edit with your values
nano .env.local
nano backend/.env
nano frontend/.env

# 3. Start PostgreSQL
docker compose up postgres -d

# 4. Start backend and frontend
task run:dev:backend # Terminal 1
task run:dev:ui # Terminal 2

# Or full Docker stack
task docker:up
```

**Production deploy:**
```bash
# 1. Create .env.production with real secrets
cp .env.example .env.production
# Edit with production values...

# 2. Push to main branch (triggers Azure DevOps pipeline)
git push origin main
```

## Local Setup (manual, no Docker)

1. Copy the env templates:
 - `task env:setup` (or manually: `cp .env.example .env.local && cp backend/.env.example backend/.env && cp frontend/.env.example frontend/.env`)
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

### Local
```bash
task env:setup # First-time setup
task docker:up # Full stack with hot-reload
task docker:down # Stop all
```

### Production (Azure)
```bash
# Option A: Push to main (triggers Azure DevOps CI/CD)
git push origin main

# Option B: Manual deploy via Ansible
task env:setup # Ensure .env.production exists
ansible-playbook -i ansible/inventory/hosts.yml ansible/playbooks/provision.yml
ansible-playbook -i ansible/inventory/hosts.yml ansible/playbooks/deploy.yml
ansible-playbook -i ansible/inventory/hosts.yml ansible/playbooks/ssl.yml
```

### Azure Hosting Options
| Option | Cost | Complexity |
|--------|------|-----------|
| Azure B1s VM (current) | ~$8-13/mo | Low — Docker Compose |
| Azure Container Apps | ~$5-10/mo | Medium — rewrite deploy |
| Azure for Students | Free (12mo) | Low — $100 credit |

**CI/CD Pipeline definitions:** `azure-pipelines.yml` (primary), `Jenkinsfile` (legacy)

## Documentation

- AI handoff memory: `AI_AGENT.md`
- Agent work history: `.ai/`
- Requirements and architecture: `docs/`

## Important Notes

- Use `dev` as the active branch.
- Keep secrets in `.env` files and never commit them.
- Run `npx prisma validate` after Prisma schema changes.
