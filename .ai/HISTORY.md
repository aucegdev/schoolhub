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

*Add new sessions here. Keep all history — never delete.*
