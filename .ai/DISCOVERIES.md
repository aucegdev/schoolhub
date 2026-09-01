# DISCOVERIES.md — SchoolHub

> Important things agents discovered about the codebase.
> Reference by ID (e.g., DISC-001) in other files.
> Never delete — mark as outdated if superseded.

---

## DISC-001 — Backend Module Structure

**Discovered:** 2026-09-02 by Antigravity

Backend modules live at `backend/src/modules/{module-name}/`.

Currently implemented modules (as directories):
- `academic-year/`
- `calendar/`
- `class/`
- `leave/`
- `school/`
- `stats/`
- `subject/`
- `teacher/`
- `teacher-assignment/`
- `term/`
- `timetable/`

Notable absences: `auth/`, `student/`, `attendance/`, `examination/`, `fees/`, `transport/`

**Note:** Auth may be in `backend/src/middleware/` or a top-level route — investigate before assuming it is missing.

---

## DISC-002 — Frontend Source Structure

**Discovered:** 2026-09-02 by Antigravity

Frontend source at `frontend/src/`:
- `components/` — Shared UI components
- `pages/` — Route pages per module
- `services/` — API client calls
- `assets/` — Static assets

Missing (per TRD spec): `hooks/`, `contexts/`, `routes/`, `utils/`, `types/`, `styles/`
These may exist but were not listed in `list_dir` — verify before creating.

---

## DISC-003 — azure-pipelines.yml is a Stub

**Discovered:** 2026-09-02 by Antigravity

The `azure-pipelines.yml` at project root is only 18 lines — a starter placeholder.
It only echoes text. No build, test, or deploy steps.

**Location:** `/home/kathir/projects/schoolhub/azure-pipelines.yml`

---

## DISC-004 — No DevOps Files Committed

**Discovered:** 2026-09-02 by Antigravity

Running `find . -name "*.yml" -o -name "Jenkinsfile" -o -name "Dockerfile" -o -name "docker-compose*"` (excluding node_modules and .git) returns only `azure-pipelines.yml`.

Conclusion: Jenkinsfile, Dockerfiles, docker-compose.yml, and Ansible playbooks are all missing from the repository.

---

## DISC-005 — Prisma Schema Location

**Discovered:** 2026-09-02 by Antigravity

Prisma schema: `backend/prisma/schema.prisma` (6053 bytes, ~200 lines).
Prisma config: `backend/prisma.config.ts`.
Generated client: `backend/generated/`.

Always run `npx prisma generate` after schema changes.
Always run `npx prisma validate` before committing schema changes.

---

## DISC-006 — Git Branch State

**Discovered:** 2026-09-02 by Antigravity

```
HEAD -> dev (= origin/main, origin/dev after recent PRs)
main (local) is at bbccd43 — one PR behind dev
develop (local + remote) — appears stale, at 8c6fd8f
```

Active feature branches (local): feature/academic-year-and-terms, feature/calendar-and-holidays, feature/dashboard, feature/school-information-setup, feature/teacher-crud, feature/teacher-leave, feature/teacher-subject-assignment, feature/timetable.

Remote: also feature/class-section, feature/subject-management.

**Conclusion:** Work from `dev` branch. Do not use `develop`.

---

## DISC-007 — Paril T GitHub Username

**Discovered:** 2026-09-02 by Kathir-Kalidass (provided to Antigravity)

Paril T's GitHub login is `ordinarySlick`.
Use this when assigning GitHub issues.

---

## DISC-008 — Document Structure

**Discovered:** 2026-09-02 by Antigravity

Docs directory `docs/` contains 8 structured documents:
1. `01_Project_Charter.md` — Scope, objectives, DevOps toolchain
2. `02_PRD_Product_Requirements.md` — Product requirements
3. `03_SRS_Software_Requirements_Specification.md` — SRS
4. `04_TRD_Technical_Requirements.md` — Tech stack, architecture, folder structure
5. `05_Project_Timeline.md` — Week-by-week plan, team roles, milestones
6. `06_Testing_Deployment_Report.md` — Testing and deployment plan
7. `07_Final_Project_Report.md` — Final report
8. `08_DevOps_Implementation.md` — Full DevOps toolchain documentation (24KB, most detailed)

`docs/08_DevOps_Implementation.md` is the most valuable reference for DevOps implementation. Read it before implementing Jenkinsfile, docker-compose, Ansible, or azure-pipelines.

---

## DISC-009 — Maven Report Service Required

**Discovered:** 2026-09-02 by Antigravity

`docs/04_TRD_Technical_Requirements.md` confirms: "Report Service | Maven + Java | Java 17, Maven 3.9 | PDF report generation"

This is a course syllabus requirement. The `report-service/` directory does not exist yet. It must be created as a real Maven Java project to satisfy the build tool requirement.

---

## DISC-010 — 19 Application Modules (Priority List)

**Discovered:** 2026-09-02 from `docs/01_Project_Charter.md`

| # | Module | Priority |
|---|--------|----------|
| 1 | Authentication & Authorization | P0 |
| 2 | Dashboard (role-specific) | P0 |
| 3 | User Management | P0 |
| 4 | Student Management | P0 |
| 5 | Teacher & Staff Management | P0 |
| 6 | Class, Section & Subject Management | P0 |
| 7 | Academic Year & Terms | P0 |
| 8 | Timetable Management | P1 |
| 9 | Attendance Management | P1 |
| 10 | Examination & Marks | P1 |
| 11 | Report Card Generation (PDF) | P1 |
| 12 | Assignment & Homework | P1 |
| 13 | Fees Management | P1 |
| 14 | Transport Management | P2 |
| 15 | Events & Notice Board | P2 |
| 16 | Communication & Notifications | P2 |
| 17 | Reports & Analytics | P2 |
| 18 | Audit Logs | P2 |
| 19 | Settings & Module Visibility Controls | P0 |

P0 = Must have for demo. P1 = Should have. P2 = Nice to have.

---

## DISC-011 — Firebase Google Auth Configuration

**Discovered:** 2026-09-02 during auth hardening

The web app now supports Firebase Google sign-in for local and Azure deployments, but it requires the following environment values to be populated:

- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_STORAGE_BUCKET`
- `VITE_FIREBASE_MESSAGING_SENDER_ID`
- `VITE_FIREBASE_APP_ID`

On the backend, `FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL`, and `FIREBASE_PRIVATE_KEY` enable Firebase ID-token verification. The auth middleware supports both Firebase and the existing JWT flow, so the app can remain resilient during transition.

**Note:** Firebase config is optional for local JWT-only development but required for full Google login support.

---

*Add new discoveries as you work. Reference DISC-IDs in TASKS.md and BUGS.md.*
