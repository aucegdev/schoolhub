# DECISIONS.md — SchoolHub

> Architectural and design decisions. Keep permanently.
> Reference by ID (e.g., DEC-001) in other files and commit messages.

---

## DEC-001 — Full 19-Module Scope with Phased Delivery

**Date:** 2026-07-20
**By:** Kathir-Kalidass
**Agents involved:** Maya, Suren (AI personas)

**Decision:**
Adopted full 19-module scope with phased delivery.
- Phase 1 (Weeks 1–4): Core modules with complete functionality — Auth, Student, Teacher, Academics, Attendance, Examination, Dashboard + DevOps foundation.
- Phase 2 (Weeks 5–6): Remaining modules as basic CRUD — Fees, Transport, Events, Reports, Settings + final testing, documentation, Azure deployment, Jenkins, Ansible.

**Reason:**
Option 1 (10–12 modules only) was too narrow for faculty expectations.
Option 3 (start immediately without priorities) risked dependency issues and blockers.

**Rejected Alternatives:**
- Option 1: 10–12 modules only — too narrow
- Option 3: Start immediately without priority ordering — risk of blockers

**Open Items at Decision Time:**
- Rebalanced role distribution: Kathir owns shared foundation (Auth, DB schema, Prisma, API architecture, Docker, DevOps pipeline) rather than 9 individual modules.
- Exact Phase 2 module list (resolved: Fees, Transport, Events, Reports, Settings).

**Do Not:**
- Reduce scope below 19 modules without faculty approval.
- Skip phased delivery — dependencies between modules are real.

---

## DEC-002 — Role Distribution

**Date:** 2026-07-20
**By:** Kathir-Kalidass

**Decision:**
- **Kathir Kalidass B:** Foundation + DevOps + Core — Auth, RBAC, DB/Prisma schema, API infrastructure, Docker, Jenkins, Azure, Ansible, CI/CD, GitHub management, integration, Teacher CRUD, Dashboard, School Admin, Academic Management, Timetable, Settings, Communication, Reports, Events.
- **Jivetesh:** People + Academics — Students, Teachers (shared), Classes, Subjects, Timetable (shared), Attendance, User Management, Parent Management, Audit Logs.
- **Paril T (ordinarySlick):** Assessment + Operations — Exams, Assignments, Fees, Notices, Events (shared), Library, Transport, Reports (shared), Dashboard (Frontend Docker, Nginx).

**Do Not:**
- Assign Prisma schema changes to anyone except Kathir without coordination.

---

## DEC-003 — Single Express Server Architecture

**Date:** 2026-07-20

**Decision:**
Use a single Express.js server for all backend API routes, organized by modules under `backend/src/modules/`.

**Reason:**
Appropriate scale for a school management MVP. Microservices would add unnecessary complexity.

**Exception:**
Maven report-service is a separate Java service for PDF generation (satisfies syllabus requirement). It runs as a separate container.

**Do Not:**
- Split Express backend into microservices without a team decision.
- Combine report-service logic into Express — it must remain a Maven Java project.

---

## DEC-004 — JWT Stateless Authentication

**Date:** 2026-07-20

**Decision:**
Use JWT (jsonwebtoken) for authentication. No server-side session store.

**Reason:**
Stateless — works across Docker containers without shared session state. Simpler for this scale.

**Token Storage:**
Frontend stores JWT in `localStorage` or `httpOnly` cookie (TBD per TASK-011).

**Do Not:**
- Add server-side session storage (Redis, etc.) without a team decision.
- Share JWT secret in code — use environment variable `JWT_SECRET`.

---

## DEC-005 — Admin Super-Authority (RBAC Bypass)

**Date:** 2026-07-20

**Decision:**
The `ADMIN` role bypasses all RBAC (Role-Based Access Control) checks. Admins can access and perform any action on any module.

**Reason:**
Super-admin model required by project specification. Allows admin to configure and troubleshoot any part of the system.

**Do Not:**
- Remove or weaken the admin bypass in middleware.
- Add granular admin restrictions without explicit approval.

---

## DEC-006 — Maven Report Service for PDF Generation

**Date:** 2026-07-20

**Decision:**
Create a separate Java 17 + Maven 3.9 project (`report-service/`) for PDF report generation using Apache PDFBox or iTextPDF.

**Reason:**
Course syllabus requires Maven/Gradle as a build tool. Since SchoolHub is Node.js, a separate Java service satisfies this requirement with real functionality.

**Integration:**
Backend Express API calls report-service HTTP endpoint → receives PDF → streams to client.

**Do Not:**
- Generate PDFs in the Express server — they must go through report-service.
- Use Gradle instead of Maven (Maven was decided).

---

## DEC-007 — `dev` Branch is Active Integration

**Date:** 2026-09-02
**By:** Antigravity (discovered from git log)

**Decision:**
`dev` is the active integration branch (not `develop`). All feature branches merge to `dev` via PRs.

**Evidence:**
git log shows HEAD at `dev`. PRs #91, #92, #93 merged into `dev`. `develop` branch exists but appears stale.

**Do Not:**
- Create new feature branches from `develop`.
- Merge to `develop` — use `dev` instead.

---

## DEC-008 — Module Folder Structure

**Date:** 2026-07-20

**Decision:**
Backend modules organized by business domain under `backend/src/modules/{module-name}/`.
Each module contains: `{module}.routes.ts`, `{module}.controller.ts`, `{module}.service.ts`, (optional) `{module}.validation.ts`.

Frontend pages organized under `frontend/src/pages/{module-name}/`.

**Do Not:**
- Put route handlers directly in `app.ts` — use module router files.
- Mix multiple domain concerns in one module folder.

---

*Keep architectural decisions permanent unless explicitly superseded.*
*When superseding a decision, reference the old DEC-ID in the new entry.*
