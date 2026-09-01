# AI_AGENT.md — SchoolHub Project Memory

> **Persistent engineering memory for AI coding agents.**
> This file is shared between Codex, GitHub Copilot, OpenCode, Antigravity, and all other AI coding agents.
> Read this file completely before starting any work.

---

## 🚦 CURRENT STATE

| Field | Value |
|-------|-------|
| **Project** | SchoolHub — Smart School Management System |
| **Overall Status** | 🟡 Active Development — Phase 3/6 |
| **Current Branch** | `dev` (HEAD) |
| **Last Updated** | 2026-09-02 |
| **Last Agent** | Antigravity |

---

## 🎯 NEXT ACTION

> **Priority:** Complete DevOps pipeline (Jenkinsfile, Docker Compose, Ansible, full azure-pipelines.yml), then push remaining app modules (Attendance, Exams, Fees, Transport, Notices, Assignments, Reports).

1. Read `.ai/TASKS.md` for the current active task list.
2. Read `.ai/BUGS.md` for known issues before touching any module.
3. Read `.ai/DECISIONS.md` before changing architecture or patterns.
4. Inspect actual source code — do not assume memory is more accurate than code.
5. Run `npx prisma validate` after any schema change.
6. Run `npm run build` in both `frontend/` and `backend/` before marking work done.

---

## 🔴 BLOCKERS

- `azure-pipelines.yml` is a placeholder stub — needs full CI/CD pipeline
- No `Jenkinsfile` exists yet — Jenkins CI not configured
- No `docker-compose.yml` exists — containerization incomplete
- No `Dockerfile` for frontend or backend yet
- Ansible playbooks not committed to repo
- Auth frontend login UI — not confirmed working end-to-end

---

## 🐛 OPEN BUGS

| ID | Title | Severity | Status |
|----|-------|----------|--------|
| BUG-001 | azure-pipelines.yml is a placeholder, not functional | HIGH | OPEN |
| BUG-002 | No Jenkinsfile in repo — Jenkins CI cannot trigger | HIGH | OPEN |
| BUG-003 | No docker-compose.yml — `docker compose up` fails | HIGH | OPEN |
| BUG-004 | Attendance module not implemented (backend + frontend) | HIGH | OPEN |
| BUG-005 | Examination & Marks module not implemented | HIGH | OPEN |
| BUG-006 | No Dockerfile for frontend or backend | MEDIUM | OPEN |

See `.ai/BUGS.md` for full details.

---

## 📋 ACTIVE TASKS

| ID | Task | Owner | Status |
|----|------|-------|--------|
| TASK-001 | Complete Jenkinsfile CI pipeline | Kathir | ⏳ |
| TASK-002 | Complete azure-pipelines.yml (full build/deploy) | Kathir | ⏳ |
| TASK-003 | Create Dockerfile for frontend | Paril (ordinarySlick) | ⏳ |
| TASK-004 | Create Dockerfile for backend | Kathir | ⏳ |
| TASK-005 | Create docker-compose.yml (all services) | Kathir | ⏳ |
| TASK-006 | Write Ansible playbooks for Azure VM | Kathir | ⏳ |
| TASK-007 | Attendance module — backend + frontend | Paril (ordinarySlick) | ⏳ |
| TASK-008 | Examination & Marks module | Paril (ordinarySlick) | ⏳ |
| TASK-009 | Fees module | Paril (ordinarySlick) | ⏳ |
| TASK-010 | Transport module | Paril (ordinarySlick) | ⏳ |
| TASK-011 | Auth frontend login page wired to API | All | 🔄 |
| TASK-012 | Reports & Analytics (PDF via Maven service) | Kathir | ⏳ |
| TASK-013 | Azure VM provisioning & SSL cert | Kathir | ⏳ |

See `.ai/TASKS.md` for complete task list with details.

---

## 🧠 RECENT MEMORY

### 2026-09-02
- Reviewed full repo state: `dev` branch is HEAD, main is behind dev (PRs #91, #92, #93 merged into dev).
- Implemented modules: Auth, Teacher CRUD, Teacher Subject Assignment, Academic Year & Terms, School Info, Calendar & Holidays, Class & Section, Subject Management, Timetable, Teacher Leave Management, Dashboard Stats API.
- **Critical gap:** No DevOps files (Jenkinsfile, Dockerfile, docker-compose.yml, Ansible). `azure-pipelines.yml` is an 18-line stub.
- Decision memory imported from previous agents (Maya, Suren personas): full 19-module scope confirmed by Kathir-Kalidass.
- Paril's GitHub username is `ordinarySlick`.
- AI_AGENT.md and `.ai/` memory structure initialized by Antigravity.

---

## ⚠️ IMPORTANT RULES

- **Never expose `.env` contents or commit secrets.**
- **Never run destructive database migrations against production** without backup.
- **Do not rewrite working modules** — check existing implementation first.
- **Run tests before marking any task complete.**
- `npx prisma validate` must pass before any migration.
- The `main` branch requires PR + 1 approval — **never force-push to main**.
- Paril's GitHub login is `ordinarySlick` — use when assigning issues.
- `dev` branch is the active integration branch (not `develop`).
- Admin role bypasses all RBAC checks — do not remove this behavior.

---

## 1. PROJECT CONTEXT

### Project
**SchoolHub** — Smart School Management System

### Purpose
A web-based School Management System that digitizes and automates daily school operations with secure role-based access for Administrators, Principals, Teachers, Students, and Parents.

### Team

| Name | GitHub | Role |
|------|--------|------|
| Kathir Kalidass B | `Kathir-Kalidass` | Full Stack & DevOps Lead, Architecture, CI/CD |
| Jivetesh | — | Backend Developer, Auth, User Mgmt, Student Mgmt, Testing |
| Paril T | `ordinarySlick` | Frontend Developer, UI/UX, Attendance, Exams, Fees, Transport |

### Main Technologies

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + TypeScript + Vite 5 + Tailwind CSS + shadcn/ui |
| Backend | Node.js 18 + Express 4 + TypeScript |
| Database | PostgreSQL 15 + Prisma ORM 5 |
| Authentication | JWT (stateless) + RBAC |
| Validation | Zod |
| Containers | Docker + Docker Compose |
| CI Server | Jenkins |
| Cloud CI/CD | Azure DevOps (azure-pipelines.yml) |
| Config Mgmt | Ansible |
| Report Service | Maven + Java 17 (PDF generation) |
| Reverse Proxy | Nginx |

### Repository
`github.com/aucegdev/schoolhub`

### Branch Strategy
```
main      ── production-ready (requires PR + 1 approval)
  │
dev       ── active integration branch (HEAD, not develop)
  │
feature/* ── per-feature branches
```

---

## 2. INSTRUCTIONS FOR AI AGENTS

### Before Starting Work
1. Read `AI_AGENT.md` (this file) completely.
2. Check `.ai/TASKS.md` for current work.
3. Check `.ai/BUGS.md` for known issues.
4. Check `.ai/DECISIONS.md` before changing architecture.
5. Inspect existing source code first.
6. Verify you are on the `dev` branch.

### During Work
Record:
- Important codebase discoveries
- Failed approaches (prevents repeating mistakes)
- Root causes of bugs
- Architectural decisions

Do **not** record: passwords, API keys, tokens, secrets.

### After Completing Work
1. Update `.ai/TASKS.md`
2. Update `.ai/BUGS.md`
3. Update `.ai/DECISIONS.md`
4. Update `.ai/DISCOVERIES.md`
5. Add a session entry to `.ai/HISTORY.md`
6. Update the 🚦 CURRENT STATE dashboard above.
7. **Do not claim a task is complete unless verified.**

### Agent Handoff Protocol
Always answer before finishing:
- What was I trying to do?
- What did I change?
- What worked / what failed and why?
- What remains?
- What should the next agent do first?
- Any dangerous operations to avoid?

---

## 3. MODULE STATUS

### ✅ Implemented

| Module | Backend | Frontend |
|--------|---------|----------|
| Auth (Login/Logout/JWT/RBAC) | ✅ | 🔄 |
| School Info Setup | ✅ | ✅ |
| Teacher CRUD | ✅ | ✅ |
| Teacher Subject Assignment | ✅ | ✅ |
| Academic Year & Terms | ✅ | ✅ |
| Calendar & Holidays | ✅ | ✅ |
| Class & Section Management | ✅ | ✅ |
| Subject Management | ✅ | ✅ |
| Timetable Management | ✅ | ✅ |
| Teacher Leave Management | ✅ | ✅ |
| Dashboard Stats API | ✅ | 🔄 |

### ⏳ Not Yet Implemented

| Module | Priority | Owner |
|--------|----------|-------|
| Student CRUD (full) | P0 | Jivetesh |
| Parent Management | P0 | Jivetesh |
| User Management (admin CRUD) | P0 | Jivetesh |
| Settings & Module Visibility | P0 | Kathir |
| Attendance Management | P1 | Paril |
| Examination & Marks | P1 | Paril |
| Report Card PDF | P1 | Kathir |
| Assignment & Homework | P1 | Paril |
| Fees Management | P1 | Paril |
| Transport Management | P2 | Paril |
| Events & Notice Board | P2 | Kathir |
| Communication & Notifications | P2 | Kathir |
| Reports & Analytics | P2 | Kathir |
| Audit Logs | P2 | Jivetesh |

### 🔴 DevOps Status

| Item | Status |
|------|--------|
| Git/GitHub branching | ✅ Active |
| Jenkinsfile | ❌ Missing |
| docker-compose.yml | ❌ Missing |
| Dockerfile (frontend) | ❌ Missing |
| Dockerfile (backend) | ❌ Missing |
| azure-pipelines.yml | ⚠️ Stub only |
| Ansible playbooks | ❌ Missing |
| Maven report-service | ❌ Missing |
| Azure VM deployment | ❌ Not done |
| SSL certificate | ❌ Not done |

---

## 4. KEY ARCHITECTURAL DECISIONS

See `.ai/DECISIONS.md` for full ADR log.

- **DEC-001:** Full 19-module scope with phased delivery — decided by Kathir-Kalidass
- **DEC-002:** Single Express server — appropriate for this scale
- **DEC-003:** Prisma ORM for type-safe DB access + migrations
- **DEC-004:** JWT stateless auth — no server-side session store
- **DEC-005:** ADMIN role bypasses all RBAC checks — do not remove
- **DEC-006:** Maven report-service (Java) satisfies build-tool syllabus requirement
- **DEC-007:** `dev` branch is active integration (confirmed by current git log)

---

## 5. KEY DISCOVERIES

See `.ai/DISCOVERIES.md` for full list.

- Backend modules: `backend/src/modules/{module-name}/`
- Prisma schema: `backend/prisma/schema.prisma`
- Frontend pages: `frontend/src/pages/`
- Frontend services (API clients): `frontend/src/services/`
- `azure-pipelines.yml` at root is an 18-line placeholder stub
- No Jenkinsfile, Dockerfile, docker-compose.yml exist yet
- Paril T's GitHub login is `ordinarySlick`
- `dev` is HEAD (not `develop`) per `git log`

---

*Maintained by AI agents. Last updated: 2026-09-02 by Antigravity.*
*Never delete historical information. Prefer updating status over removing old entries.*
