# AI_AGENT.md — SchoolHub Project Memory

> **Persistent engineering memory for AI coding agents.**
> Shared between Codex, GitHub Copilot, OpenCode, Antigravity, and all AI coding agents.
> **Read this file completely before starting any work.**

---

## 🚦 CURRENT STATE

| Field | Value |
|-------|-------|
| **Project** | SchoolHub — Smart School Management System |
| **Overall Status** | 🟢 Production Ready DevOps & Base Auth — Phase 4/6 (Assessment) |
| **Current Branch** | `dev` (HEAD, synced with `main`) |
| **GitHub** | [aucegdev/schoolhub](https://github.com/aucegdev/schoolhub) |
| **Azure DevOps** | [schoolhub-dev-26/SchoolHub](https://dev.azure.com/schoolhub-dev-26/SchoolHub) |
| **Last Updated** | 2026-09-02 |
| **Last Agent** | Antigravity |

---

## 🎯 NEXT ACTION

> **DevOps is now READY.** Remaining work is APPLICATION MODULES.
> Priority: Attendance → Exams → Fees → Transport → Auth UI verification

1. Read `.ai/TASKS.md` for the full task list.
2. Read `.ai/BUGS.md` for known issues.
3. Read `.ai/DECISIONS.md` before changing architecture.
4. Inspect actual source code — memory may lag behind code.
5. Run `npx prisma validate` after any schema change.
6. Work from the `dev` branch.

---

## ✅ DEVOPS — COMPLETED

| Tool | File | Status |
|------|------|--------|
| Docker (Backend) | `backend/Dockerfile` | ✅ Multi-stage build |
| Docker (Frontend) | `frontend/Dockerfile` | ✅ Multi-stage → nginx |
| Docker Compose (Local) | `docker-compose.yml` | ✅ postgres + pgadmin + backend + frontend |
| Docker Compose (Prod) | `docker-compose.prod.yml` | ✅ + nginx reverse proxy, no pgadmin |
| Nginx (SPA) | `frontend/nginx.conf` | ✅ SPA routing |
| Nginx (Reverse Proxy) | `nginx/nginx.conf` | ✅ / → frontend, /api/ → backend |
| Jenkinsfile | `Jenkinsfile` | ✅ 6-stage parallel pipeline |
| Azure Pipelines | `azure-pipelines.yml` | ✅ 3-stage: Build → Docker → Deploy |
| Ansible Provision | `ansible/playbooks/provision.yml` | ✅ Docker + Nginx + certbot |
| Ansible Deploy | `ansible/playbooks/deploy.yml` | ✅ Pull → compose up → verify |
| Ansible SSL | `ansible/playbooks/ssl.yml` | ✅ Let's Encrypt |
| Env Config | `.env.example` + `backend/.env.example` | ✅ All vars documented |

---

## 🔴 REMAINING BLOCKERS

- Application modules incomplete (Attendance, Exams, Fees, Transport)
- Auth frontend login not verified end-to-end
- Maven report-service not created yet
- Azure VM not yet provisioned
- No test framework configured (Jest/Vitest not in package.json)

---

## 🐛 OPEN BUGS

| ID | Title | Severity | Status |
|----|-------|----------|--------|
| BUG-004 | Attendance module not implemented | HIGH | OPEN |
| BUG-005 | Examination & Marks module not implemented | HIGH | OPEN |
| BUG-007 | Auth frontend login not confirmed E2E | MEDIUM | OPEN |
| BUG-008 | `dev` vs `develop` branch confusion | LOW | OPEN |
| BUG-009 | Auth middleware uses mock user (no real JWT verify) | HIGH | FIXED |

See `.ai/BUGS.md` for full details.

---

## 📋 ACTIVE TASKS (Priority Order)

| ID | Task | Owner | Status |
|----|------|-------|--------|
| TASK-020 | Auth: implement real JWT verification in middleware | Jivetesh | ✅ |
| TASK-007 | Attendance module — backend + frontend | Paril (ordinarySlick) | ⏳ |
| TASK-008 | Examination & Marks module | Paril (ordinarySlick) | ⏳ |
| TASK-009 | Fees module | Paril (ordinarySlick) | ⏳ |
| TASK-010 | Transport module | Paril (ordinarySlick) | ⏳ |
| TASK-012 | Maven report-service (PDF generation) | Kathir | ⏳ |
| TASK-013 | Azure VM provisioning & SSL | Kathir | ⏳ |

See `.ai/TASKS.md` for complete list with details.

---

## 🧠 RECENT MEMORY

### 2026-09-02 — DevOps Implementation Session
- **Created:** Jenkinsfile, azure-pipelines.yml (full), Dockerfiles, docker-compose.yml/.prod.yml, nginx configs, Ansible playbooks, env configs
- **Committed** as 5 separate feature commits on `dev` branch
- **Closed issues:** #21, #22 (completed via PRs #89, #90)
- **Fixed labels** on issues #72, #73, #74, #76, #77
- **Created new issues:** #94–#100
- **Critical fix:** Auth middleware (`backend/src/middleware/auth.ts`) now verifies JWTs with `JWT_SECRET` instead of injecting a mock admin user.
- Backend runs on port 4000 (not 5000 as some docs say)
- Frontend dev server: 5173 (Vite default), containerized: 80 (nginx)
- `VITE_API_URL` defaults to `http://localhost:4000/api/v1` in api.ts

---

## ⚠️ IMPORTANT RULES

- **Never commit secrets** — use `.env` files (in .gitignore)
- **Never force-push** to `main` — requires PR + 1 approval
- **Never run destructive migrations** without backup
- **`npx prisma validate`** must pass before schema commits
- Paril's GitHub login: `ordinarySlick`
- `dev` is the active integration branch (not `develop`)
- Admin role bypasses all RBAC — do not remove
- Backend PORT is **4000** (not 5000)
- Auth middleware verifies JWTs against `JWT_SECRET`; use a real token in production

---

## 1. PROJECT CONTEXT

### Team

| Name | GitHub | Responsibility |
|------|--------|----------------|
| Kathir Kalidass B | `Kathir-Kalidass` | Full Stack & DevOps Lead |
| Jivetesh | — | Backend: Auth, Users, Students, Testing |
| Paril T | `ordinarySlick` | Frontend: Attendance, Exams, Fees, Transport |

### Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19 + TypeScript + Vite 8 + Tailwind CSS v4 + shadcn/ui |
| Backend | Node.js 18 + Express 5 + TypeScript 7 |
| Database | PostgreSQL 15 + Prisma ORM 7 (with `@prisma/adapter-pg`) |
| Auth | JWT (stateless) + Firebase Google OAuth + RBAC |
| Containers | Docker + Docker Compose |
| CI | Jenkins (Jenkinsfile) |
| CD | Azure DevOps (`azure-pipelines.yml`) |
| Config Mgmt | Ansible |
| Reverse Proxy | Nginx |
| Report Service | Maven + Java 17 (planned) |
| Env Templates | Root + backend + frontend `.env.example` files |

### Repository
- GitHub: `github.com/aucegdev/schoolhub`
- Azure DevOps: `https://dev.azure.com/schoolhub-dev-26/SchoolHub`

### Branch Strategy
```
main      ── production (requires PR + 1 approval)
dev       ── active integration (HEAD)
feature/* ── per-feature work branches
```

---

## 2. QUICK REFERENCE

### Local Development
```bash
# Copy env templates
cp .env.example .env
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env

# Start database
docker compose up postgres pgadmin -d

# Backend (terminal 1)
cd backend && npm install && npx prisma generate && npm run dev

# Frontend (terminal 2)
cd frontend && npm install && npm run dev

# Full stack via Docker
cp .env.example .env  # Edit secrets first
docker compose up --build
```

### Firebase Google Login Setup
- Add `VITE_FIREBASE_*` values in `frontend/.env`
- Add `FIREBASE_PROJECT_ID` / `FIREBASE_CLIENT_EMAIL` / `FIREBASE_PRIVATE_KEY` in `backend/.env`
- Frontend uses Google OAuth popup sign-in; backend verifies Firebase ID tokens when configured
- If Firebase config is missing, the app warns and keeps the legacy JWT flow available

### Production Deployment
```bash
# Build and deploy
docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d --build

# Via Ansible
ansible-playbook -i ansible/inventory/hosts.yml ansible/playbooks/deploy.yml
```

### Key URLs (Local Dev)
- Frontend: http://localhost:5173
- Backend API: http://localhost:4000/api/v1
- Health Check: http://localhost:4000/api/v1/health
- PgAdmin: http://localhost:5050

### Key Files
| Purpose | Path |
|---------|------|
| Backend entry | `backend/src/server.ts` |
| App/routes | `backend/src/app.ts` |
| Prisma schema | `backend/prisma/schema.prisma` |
| DB config | `backend/src/config/database.ts` |
| Auth middleware | `backend/src/middleware/auth.ts` ✅ JWT + Firebase verified |
| Firebase admin config | `backend/src/config/firebase.ts` |
| API base | `frontend/src/services/api.ts` |
| Frontend auth config | `frontend/src/config/firebase.ts` |
| Frontend routes | `frontend/src/App.tsx` |
| Admin layout | `frontend/src/components/layout/AdminLayout.tsx` |

---

## 3. MODULE STATUS

### ✅ Implemented (Backend + Frontend)

| Module | Backend | Frontend | Route |
|--------|---------|----------|-------|
| School Info | ✅ | ✅ | `/admin/school` |
| Teacher CRUD | ✅ | ✅ | `/admin/teachers` |
| Teacher Subject Assignment | ✅ | ✅ | — |
| Academic Year & Terms | ✅ | ✅ | `/admin/academic-years` |
| Calendar & Holidays | ✅ | ✅ | `/admin/calendar` |
| Class & Section | ✅ | ✅ | `/admin/classes` |
| Subject Management | ✅ | ✅ | `/admin/subjects` |
| Timetable (conflict detect) | ✅ | ✅ | `/admin/timetable` |
| Teacher Leave | ✅ | ✅ | `/admin/leave` |
| Dashboard Stats | ✅ | ✅ | `/admin/dashboard` |
| Student Directory | ✅ | ✅ | `/admin/students` |
| Attendance Marking | ✅ | ✅ | `/admin/attendance` |
| Examination & Evaluation | ✅ | ✅ | `/admin/exams` |
| Fees & Billing Management | ✅ | ✅ | `/admin/fees` |

### ⏳ Future / Optional Enhancements

| Module | Priority | Owner | Notes |
|--------|----------|-------|-------|
| Maven Report Service PDF | P1 | Kathir | External PDF engine |
| Parent & Student Portal | P2 | Jivetesh | Role-specific views |
| Transport & Notice Board | P2 | Kathir | Operations |

### ✅ DevOps — All Done

| Item | Status | File |
|------|--------|------|
| Git/GitHub | ✅ | — |
| Jenkinsfile | ✅ | `Jenkinsfile` |
| Docker (backend) | ✅ | `backend/Dockerfile` |
| Docker (frontend) | ✅ | `frontend/Dockerfile` |
| Docker Compose (local) | ✅ | `docker-compose.yml` |
| Docker Compose (prod) | ✅ | `docker-compose.prod.yml` |
| Nginx reverse proxy | ✅ | `nginx/nginx.conf` |
| Nginx SPA routing | ✅ | `frontend/nginx.conf` |
| Azure Pipelines | ✅ | `azure-pipelines.yml` |
| Ansible provision | ✅ | `ansible/playbooks/provision.yml` |
| Ansible deploy | ✅ | `ansible/playbooks/deploy.yml` |
| Ansible SSL | ✅ | `ansible/playbooks/ssl.yml` |
| Env config | ✅ | `.env.example` + `backend/.env.example` |

---

## 4. INSTRUCTIONS FOR AI AGENTS

### Before Starting
1. Read this file completely
2. Check `.ai/TASKS.md` → `.ai/BUGS.md` → `.ai/DECISIONS.md`
3. Verify you are on `dev` branch
4. Read the source code before modifying

### During Work
Record: discoveries, failed approaches, root causes, decisions

### After Work
1. Update `.ai/TASKS.md` + `.ai/BUGS.md`
2. Update `.ai/DECISIONS.md` for design decisions
3. Update `.ai/DISCOVERIES.md` with new knowledge
4. Add session entry to `.ai/HISTORY.md`
5. Update this dashboard

### Agent Handoff
Answer: What was I doing? What changed? What worked/failed? What remains? What should the next agent do? Any dangers to avoid?

---

*Maintained by AI agents. Last updated: 2026-09-02 by Antigravity.*
*Never delete historical information. Prefer updating status over removing entries.*
