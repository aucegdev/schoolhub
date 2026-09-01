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

## 2026-09-02 — Session 8 (Universal Home Portal & Dashboard Customizer Engine)

**Agent:** Antigravity

### Objective
Create a public-facing Universal School Home Portal, add educational quotes and loading UI animations, and build an Admin Dashboard Customizer Engine with widget reordering and live preview.

### What Was Completed
- Added Universal Public School Portal (`/`) with inspirational quote carousels, live stat counters, announcement banners, and smooth CSS entrance animations (`fadeIn`, `slideUp`, `pulseGlow`, `shimmer-loader`).
- Built Admin Dashboard Customizer (`/admin/dashboard-customizer`) enabling admins to edit hero text, marquee notices, and customize widget layout placement via reordering controls (up/down moves) with interactive Live Preview mode.
- Created `frontend/src/utils/quotes.ts` featuring educational leadership quotes.
- Created Feature Spec 09 (`docs/specs/09-universal-dashboard-customizer.md`) and Feature Spec 10 (`docs/specs/10-completed-features-inventory.md`).
- Verified 0-error frontend and backend builds.
- Merged and synchronized all commits across `dev` and `main` branches on `origin`.

## 2026-09-02 — Session 9 (3D WebGL Layer, Motion & Celebration Milestone Animations)

**Agent:** Antigravity

### Objective
Implement the 80% Clean UI / 15% Motion / 5% 3D Visual Architecture with Three.js WebGL rendering, Framer Motion transitions, cursor spotlight illumination, living statistics, and milestone celebration confetti.

### What Was Completed
- Installed `motion`, `canvas-confetti`, and `three` packages.
- Created `frontend/src/components/3d/ThreeCanvas.tsx` for interactive 3D WebGL school building and floating educational objects with mouse tilt depth.
- Created `frontend/src/components/3d/CelebrationConfetti.ts` using `canvas-confetti` for milestone achievement bursts.
- Created `CountUp.tsx` (living count-up statistic animation), `CursorSpotlight.tsx` (radial light tracking cursor), and `GlassCard.tsx` (frosted glassmorphism card with hover elevation).
- Created Feature Spec 11 (`docs/specs/11-visual-treat-3d-motion-design.md`).
- Verified 0-error frontend and backend production builds.
- Synchronized all changes across `dev` and `main` branches on `origin`.

## 2026-09-02 — Session 10 (ThreeSchoolWorld High-Level 3D WebGL Scene)

**Agent:** Antigravity

### Objective
Enhance the visual experience with vibrant dynamic lighting (cyan, magenta, gold), 3D school building citadel, grand dome roof, golden spire, waving flag, floating graduation cap with tassel, 3D textbook, wireframe globe, and 120+ sparkling star particles.

### What Was Completed
- Created `frontend/src/components/3d/ThreeSchoolWorld.tsx` with high-level 3D WebGL elements and interactive cursor modulation.
- Integrated `ThreeSchoolWorld` into the Universal School Home Portal hero header (`SchoolHome.tsx`).
- Verified 0-error frontend and backend production builds.
- Synchronized all commits across `dev` and `main` branches on `origin`.

---

*Add new sessions here. Keep all history — never delete.*
