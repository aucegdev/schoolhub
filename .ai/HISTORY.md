# HISTORY.md — SchoolHub

> Chronological record of AI agent and human work sessions.
> Add entries at the END. Never delete past entries.
> Use this to understand what was tried, what failed, and why.

---

## 2026-07-20 — Session 1 (Project Initialization)

**Agent/Human:** Kathir-Kalidass + AI agents (Maya, Suren personas)

### Objective
Define project scope, architecture, role distribution, and initialize repository.

### Decisions Made
- Full 19-module scope with phased delivery (DEC-001)
- Role distribution finalized (DEC-002)
- Tech stack confirmed: React + Node + PostgreSQL + Prisma + JWT
- DevOps toolchain: Git/GitHub + Jenkins + Docker + Ansible + Azure DevOps
- `github.com/aucegdev/schoolhub` repository created

### Completed
- GitHub repository created with README and .gitignore
- Branch strategy: main, develop, feature/*
- Prisma schema designed with all models
- Authentication module backend (JWT + RBAC)
- Docker basic setup (partial)
- Project documentation: Charter, PRD, SRS, TRD (docs/ directory)
- Thesis LaTeX template initialized

### Problems Found
- None recorded at this stage

### Problems Fixed
- None yet

### Still Open
- All application modules need implementation
- DevOps pipeline files need creation

### Next Agent Should
1. Start from `dev` branch.
2. Continue with Core Modules (Week 2 phase).
3. Implement Student CRUD, Teacher CRUD, Teacher Subject Assignment.

---

## 2026-07-22 to 2026-07-28 — Session 2 (Core Modules)

**Agent/Human:** Kathir-Kalidass + team

### Completed
- Student CRUD operations (Jivetesh)
- Teacher CRUD (Kathir)
- Teacher Subject Assignment (Kathir)
- Academic Year & Terms (Kathir)
- School Information Setup (Kathir)
- Calendar & Holidays (Kathir)
- Pull Request workflow established with feature/* branches

### Problems Found
- None recorded

---

## 2026-08-01 to 2026-08-15 — Session 3 (Academics Sprint)

**Agent/Human:** Kathir-Kalidass + team

### Completed
- Class & Section CRUD (backend + frontend) — PR #89
- Subject Management (backend + frontend) — PR #90
- Timetable Management with conflict detection (backend + frontend) — PR #91
- Dashboard Stats API (backend) — PR #92
- Teacher Leave Management (backend + frontend) — PR #93
- All above merged to `dev`

### Problems Found
- Branch `dev` is HEAD (not `develop`) — confirmed from git log
- `develop` branch appears stale

### Still Open
- Attendance, Examination, Fees, Transport modules not started
- All DevOps files missing

---

## 2026-08-25 — Session 4 (Documentation Sprint)

**Agent/Human:** Kathir-Kalidass

### Completed
- 8 documentation files created in `docs/`:
  - Project Charter, PRD, SRS, TRD, Timeline, Testing Report, Final Report, DevOps Implementation
- GitHub issues created (67 total open issues)
- DevOps issues created: #70–#76, #84–#88

### Still Open
- DevOps pipeline files not committed
- Application modules incomplete

---

## 2026-09-02 — Session 5 (AI Memory Initialization)

**Agent:** Antigravity

### Objective
Create AI_AGENT.md and `.ai/` persistent memory structure for cross-agent collaboration.

### What Was Discovered
- `dev` is the active branch (HEAD), not `develop`
- `azure-pipelines.yml` is an 18-line placeholder stub
- No Jenkinsfile, Dockerfiles, docker-compose.yml, or Ansible playbooks committed
- 11 backend modules implemented, multiple frontend pages working
- Paril T's GitHub login is `ordinarySlick`
- 67 open GitHub issues (well-organized with labels)

### What Was Completed
- `AI_AGENT.md` created (project root)
- `.ai/TASKS.md` created
- `.ai/BUGS.md` created (8 bugs documented)
- `.ai/DECISIONS.md` created (8 decisions, including imported memories from previous agents)
- `.ai/DISCOVERIES.md` created (10 discoveries)
- `.ai/HISTORY.md` created (this file)

### What Failed
- Nothing failed (read-only session + file creation)

### Still Open
- All DevOps files missing (BUG-001 through BUG-006)
- Several application modules not implemented (TASK-007 through TASK-013)

### Next Agent Should
1. Read `AI_AGENT.md` and this file first.
2. Start with DevOps: implement `Jenkinsfile` (TASK-001) — highest priority blocker.
3. Then `docker-compose.yml` (TASK-005) and Dockerfiles (TASK-003, TASK-004).
4. Then replace `azure-pipelines.yml` stub with full pipeline (TASK-002).
5. Then Ansible playbooks (TASK-006).
6. Meanwhile, Paril (`ordinarySlick`) should start Attendance module (TASK-007).
7. Do not run destructive migrations against production database.
8. Always validate Prisma schema before migration: `npx prisma validate`.

---

## 2026-09-02 — Session 6 (Auth hardening + Firebase + env readiness)

**Agent:** Kathir-Kalidass + Copilot

### Objective
Complete the authentication security gap and prepare the project for local-and-cloud-ready configuration.

### What Was Discovered
- `backend/src/middleware/auth.ts` used a hardcoded mock admin user and bypassed JWT verification.
- Firebase Google sign-in was not configured in the frontend or backend.
- `env` templates were incomplete and did not cover Firebase, Docker, or Azure deployment variables.

### What Was Completed
- Real JWT verification added to the backend middleware.
- Firebase Admin SDK added for backend token verification.
- Firebase Google login support added to the frontend with `VITE_FIREBASE_*` configuration.
- Root, backend, and frontend `.env.example` files updated with all required deployment variables.
- AI memory files expanded with environment, Firebase, and deployment context.
- README updated with local setup, Firebase instructions, and deployment notes.

### Problems Fixed
- Mock auth bypass removed.
- Missing Firebase setup path documented and scaffolded.
- Config drift between local/dev and Azure deployment reduced.

### Still Open
- Final production Firebase credentials must be supplied in the deployed environment.
- Application modules (Attendance, Exams, Fees, Transport) remain as follow-up feature work.

### Next Agent Should
1. Keep env values in `.env` files only.
2. Update the deployed Azure environment variables before production login tests.
3. Continue with the remaining module implementations and verify the full user flow.

---

## 2026-09-02 — Session 7 (Main & Dev Branch Sync)

**Agent:** Antigravity

### Objective
Synchronize `dev` and `main` branches and verify repo state after PR #101 & PR #102 merges.

### What Was Completed
- PR #101 merged (`feature/firebase-auth-env-memory` into `dev`).
- PR #102 merged (`dev` into `main`).
- Verified local `main` and `dev` branches are fully in sync with `origin/main` and `origin/dev`.
- Updated `AI_AGENT.md` to reflect full branch synchronization and production-ready DevOps/Auth baseline.

---

*Add new sessions here. Keep all history — never delete.*
