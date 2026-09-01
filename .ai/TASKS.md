# TASKS.md — SchoolHub

> Current tasks, backlog, and priorities for SchoolHub.
> Reference from AI_AGENT.md. Update after every session.

---

## 🔴 HIGH PRIORITY — DevOps (Blocking Demo)

### TASK-001 — Jenkinsfile CI Pipeline
**Owner:** Kathir-Kalidass
**Status:** ⏳ Not Started
**Description:** Write a complete `Jenkinsfile` at project root for Jenkins CI.
**Requirements:**
- Trigger on push to `dev` and `main`
- Stages: Checkout → Install deps → Lint → Test → Docker build
- Use `npm ci` for deterministic installs
- Build Docker images for frontend and backend
- Push to Docker Hub or Azure Container Registry
**Acceptance:** Jenkins pipeline runs green end-to-end.
**Files to create:** `Jenkinsfile` (project root)

---

### TASK-002 — Full azure-pipelines.yml
**Owner:** Kathir-Kalidass
**Status:** ⏳ Not Started
**Description:** Replace the 18-line placeholder `azure-pipelines.yml` with a full build + deploy pipeline.
**Requirements:**
- Trigger on `main` branch
- Stages: Build → Test → Docker push → Deploy to Azure VM via SSH
- Use Azure service connections for VM SSH
- Environment variables for secrets (use Azure Pipeline variables, not hardcoded)
**Acceptance:** Pipeline runs successfully on `main` merge and app is deployed.
**Files to modify:** `azure-pipelines.yml` (project root)

---

### TASK-003 — Dockerfile (Frontend)
**Owner:** Paril T (ordinarySlick)
**Status:** ⏳ Not Started
**Description:** Create multi-stage Dockerfile for frontend.
**Requirements:**
- Stage 1: Node 18 + build with `npm run build`
- Stage 2: Nginx serving static `dist/` files
- Include `frontend/nginx.conf` for SPA routing (all routes → index.html)
**Files to create:** `frontend/Dockerfile`, `frontend/nginx.conf`

---

### TASK-004 — Dockerfile (Backend)
**Owner:** Kathir-Kalidass
**Status:** ⏳ Not Started
**Description:** Create production Dockerfile for Node.js backend.
**Requirements:**
- Base: node:18-alpine
- Multi-stage: build TypeScript → run compiled JS
- Run Prisma generate before build
- Expose port 5000
**Files to create:** `backend/Dockerfile`

---

### TASK-005 — docker-compose.yml
**Owner:** Kathir-Kalidass
**Status:** ⏳ Not Started
**Description:** Create Docker Compose file for all services.
**Services:**
- `frontend` — React (port 3000)
- `backend` — Express (port 5000)
- `postgres` — PostgreSQL 15 (port 5432)
- `pgadmin` — PgAdmin 4 (port 5050)
- `nginx` — Reverse proxy (ports 80, 443)
- `report-service` — Maven Java service (port 8080)
**Files to create:** `docker-compose.yml`, `docker-compose.dev.yml` (project root)

---

### TASK-006 — Ansible Playbooks
**Owner:** Kathir-Kalidass
**Status:** ⏳ Not Started
**Description:** Write Ansible playbooks to provision Azure VM and deploy application.
**Requirements:**
- `ansible/inventory.yml` — Azure VM host
- `ansible/playbooks/provision.yml` — Install Docker, Docker Compose, Nginx on Ubuntu 22.04
- `ansible/playbooks/deploy.yml` — Pull images, run docker-compose, configure Nginx
- `ansible/playbooks/ssl.yml` — Let's Encrypt via certbot
**Files to create:** `ansible/` directory structure

---

## 🔴 HIGH PRIORITY — Application Modules

### TASK-007 — Attendance Module
**Owner:** Paril T (ordinarySlick)
**Status:** ⏳ Not Started
**Description:** Full attendance management — backend API + frontend UI.
**Backend:** `backend/src/modules/attendance/`
- Mark attendance by teacher for a class/section/date
- Attendance status: PRESENT, ABSENT, LATE, HALF_DAY
- Query attendance by student, class, date range
- Monthly attendance summary
**Frontend:** `frontend/src/pages/attendance/`
- Attendance marking UI (grid view by class/date)
- Student attendance report view
**DB:** Add `Attendance` model to Prisma schema if not present.

---

### TASK-008 — Examination & Marks Module
**Owner:** Paril T (ordinarySlick)
**Status:** ⏳ Not Started
**Description:** Exam creation, scheduling, marks entry, grade calculation.
**Backend:** `backend/src/modules/examination/`
- Exam CRUD (type: Unit Test, Midterm, Final)
- Marks entry per student per subject
- Grade calculation and ranking
- Report card generation (trigger Maven service for PDF)
**Frontend:** `frontend/src/pages/examination/`
- Exam schedule view
- Marks entry form for teachers
- Student result view

---

### TASK-009 — Fees Module
**Owner:** Paril T (ordinarySlick)
**Status:** ⏳ Not Started
**Description:** Fee structure definition, payment recording, outstanding dues.
**Backend:** `backend/src/modules/fees/`
- Fee structure (term-based, category-based)
- Payment recording
- Outstanding dues query
- Receipt generation

---

### TASK-010 — Transport Module
**Owner:** Paril T (ordinarySlick)
**Status:** ⏳ Not Started
**Description:** Basic CRUD for bus routes and student transport assignment.
**Backend:** `backend/src/modules/transport/`
**Frontend:** Basic list/form UI

---

## 🟡 MEDIUM PRIORITY

### TASK-011 — Auth Frontend Integration
**Owner:** All / Verify
**Status:** 🔄 In Progress
**Description:** Ensure login page calls backend API correctly, JWT is stored, protected routes redirect.
**Key files:** `frontend/src/pages/auth/`, `frontend/src/services/auth.service.ts`, `frontend/src/contexts/`
**Acceptance:** Login → JWT stored → protected pages accessible → logout clears token.

---

### TASK-012 — Reports & Analytics + Maven Report Service
**Owner:** Kathir-Kalidass
**Status:** ⏳ Not Started
**Description:**
- Create `report-service/` Maven Java project for PDF generation
- Reports: Student list, Attendance summary, Fee ledger, Report cards
- Backend endpoint to trigger report-service and return PDF

---

### TASK-013 — Azure VM Deployment + SSL
**Owner:** Kathir-Kalidass
**Status:** ⏳ Not Started
**Description:** Provision Azure B1s Ubuntu 22.04 VM, run Ansible, deploy app, configure SSL via certbot.

---

### TASK-014 — Events & Notice Board
**Owner:** Kathir-Kalidass
**Status:** ⏳ Not Started
**Description:** Notice CRUD (admin/teacher create, all roles view), Event management.

---

### TASK-015 — Settings & Module Visibility
**Owner:** Kathir-Kalidass
**Status:** ⏳ Not Started
**Description:** Admin can toggle module visibility per role. Middleware reads toggle state.

---

## 🟢 LOW PRIORITY

### TASK-016 — Communication & Notifications
**Owner:** Kathir-Kalidass
**Status:** ⏳ Not Started
**Description:** Internal messaging system, notification center.

---

### TASK-017 — Audit Logs
**Owner:** Jivetesh
**Status:** ⏳ Not Started
**Description:** Log all create/update/delete actions with actor, timestamp, before/after state.

---

### TASK-018 — UI Polish Pass
**Owner:** Paril T (ordinarySlick)
**Status:** ⏳ Not Started
**Description:** Consistent design, mobile responsiveness, loading states, error handling.

---

### TASK-019 — Thesis LaTeX Finalization
**Owner:** All
**Status:** ⏳ Not Started
**Description:** Complete `Thesis_Title/` LaTeX document with all sections.

---

## ✅ COMPLETED

| Task | Completed On | Notes |
|------|-------------|-------|
| GitHub repo setup | 2026-07-22 | Branches: main, dev, feature/* |
| Prisma schema design | 2026-07-22 | All models defined |
| Auth backend (JWT + RBAC) | 2026-07-22 | Login, logout, middleware |
| School Info module | 2026-07-28 | Backend + Frontend |
| Teacher CRUD | 2026-07-28 | Backend + Frontend |
| Teacher Subject Assignment | 2026-07-28 | Backend + Frontend |
| Academic Year & Terms | 2026-07-28 | Backend + Frontend |
| Calendar & Holidays | 2026-07-28 | Backend + Frontend |
| Class & Section CRUD | ~2026-08-01 | Backend + Frontend |
| Subject Management | ~2026-08-01 | Backend + Frontend |
| Timetable (conflict detection) | ~2026-08-10 | Backend + Frontend |
| Teacher Leave Management | ~2026-08-15 | Backend + Frontend |
| Dashboard Stats API | ~2026-08-20 | Backend; Frontend in progress |
| Documentation (8 docs) | 2026-08-25 | docs/ directory complete |
