# BUGS.md — SchoolHub

> Known bugs, symptoms, root causes, and fix history.
> Keep bug IDs stable. Never delete closed bugs — mark as FIXED.

---

## BUG-001 — azure-pipelines.yml is a placeholder

**Status:** `FIXED` — 2026-09-02 (commit 8af659f)
**Severity:** HIGH
**Discovered:** 2026-09-02 by Antigravity

**Symptoms:**
Running Azure DevOps pipeline produces only an echo output — no real CI/CD work is done.

**Root Cause:**
The file was scaffolded as a starter template with no actual build, test, or deploy steps.

**Current Content (18 lines):**
```yaml
trigger:
- main
pool:
  vmImage: ubuntu-latest
steps:
- script: |
    echo "SchoolHub Azure Pipeline"
    echo "CI pipeline is working!"
  displayName: 'SchoolHub CI Test'
```

**Expected:**
Full multi-stage pipeline: Install → Lint → Test → Docker build/push → Deploy to Azure VM.

**Affected Files:**
- `azure-pipelines.yml` (project root)

**Next Investigation:**
Implement full pipeline per `docs/08_DevOps_Implementation.md` section 3.6 and TASK-002.

---

## BUG-002 — No Jenkinsfile in repository

**Status:** `FIXED` — 2026-09-02 (commit 76f60e3)

**Root Cause:**
Not yet created. Required by course syllabus.

**Expected:**
`Jenkinsfile` at project root defining multi-stage CI pipeline.

**Affected Files:**
- `Jenkinsfile` (missing)

**Next Investigation:**
Implement per TASK-001. Reference `docs/08_DevOps_Implementation.md` section 3.3.

---

## BUG-003 — No docker-compose.yml

**Status:** `FIXED` — 2026-09-02 (commit b952742)

**Symptoms:**
`docker compose up` fails — no compose file in repository.

**Root Cause:**
Not yet created.

**Expected:**
`docker-compose.yml` defining: frontend, backend, postgres, pgadmin, nginx, report-service.

**Affected Files:**
- `docker-compose.yml` (missing)
- `frontend/Dockerfile` (missing)
- `backend/Dockerfile` (missing)

**Next Investigation:**
Implement per TASK-003, TASK-004, TASK-005.

---

## BUG-004 — Attendance module missing

**Status:** `OPEN`
**Severity:** HIGH
**Discovered:** 2026-09-02 by Antigravity

**Symptoms:**
No `backend/src/modules/attendance/` directory. No attendance frontend pages.

**Root Cause:**
Not yet implemented (P1 priority, Phase 4 originally).

**Expected:**
Full attendance marking, reporting, and summary API with UI.

**Affected Files:**
- `backend/src/modules/attendance/` (missing)
- `frontend/src/pages/attendance/` (missing)

**Next Investigation:**
Implement per TASK-007. Check Prisma schema for `Attendance` model first.

---

## BUG-005 — Examination & Marks module missing

**Status:** `OPEN`
**Severity:** HIGH
**Discovered:** 2026-09-02 by Antigravity

**Symptoms:**
No exam or marks functionality in backend or frontend.

**Root Cause:**
Not yet implemented.

**Affected Files:**
- `backend/src/modules/examination/` (missing)
- `frontend/src/pages/examination/` (missing)

**Next Investigation:**
Implement per TASK-008.

---

## BUG-006 — No Dockerfile for frontend or backend

**Status:** `OPEN`
**Severity:** MEDIUM
**Discovered:** 2026-09-02 by Antigravity

**Symptoms:**
Cannot build Docker images for either service.

**Expected:**
`frontend/Dockerfile` (multi-stage: build → nginx)
`backend/Dockerfile` (multi-stage: build TS → run JS)

**Next Investigation:**
Implement per TASK-003 and TASK-004.

---

## BUG-007 — Auth frontend login not confirmed end-to-end

**Status:** `OPEN`
**Severity:** MEDIUM
**Discovered:** 2026-09-02 by Antigravity

**Symptoms:**
Backend Auth API is implemented but it is unclear if the frontend login page correctly calls the API, stores JWT, and guards protected routes.

**Next Investigation:**
Check `frontend/src/pages/` for login page, `frontend/src/services/` for auth service, and `frontend/src/contexts/` for AuthContext. Verify with manual test.

---

## BUG-008 — `dev` vs `develop` branch confusion

**Status:** `OPEN`
**Severity:** LOW
**Discovered:** 2026-09-02 by Antigravity

**Symptoms:**
Both `dev` and `develop` branches exist. `dev` is HEAD and active. Documentation may reference `develop`.

**Root Cause:**
Branch was renamed or a new branch created. `develop` may be stale.

**Next Investigation:**
Check if `develop` branch is up-to-date with `dev`. Consider deleting `develop` if it is stale or merging it. Update all documentation to reference `dev`.

---

## BUG-009 — JWT auth middleware accepted a mock user

**Status:** `FIXED` — 2026-09-02
**Severity:** HIGH
**Discovered:** 2026-09-02 by Antigravity

**Symptoms:**
Requests with a valid `Authorization: Bearer ...` header were not actually verified. The middleware silently attached a fake admin user and bypassed real authentication.

**Root Cause:**
`backend/src/middleware/auth.ts` had a placeholder implementation with a hardcoded `ADMIN` user and a `TODO` where JWT verification should happen.

**Expected:**
The middleware should validate the signed token against `JWT_SECRET` and attach the real payload data to `req.user`.

**Affected Files:**
- `backend/src/middleware/auth.ts`
- `backend/package.json`

**Fix Applied:**
- Added `jsonwebtoken` and `@types/jsonwebtoken`
- Implemented real JWT verification and payload mapping
- Added safe local-development fallback secret when `JWT_SECRET` is missing

**Next Investigation:**
Add an actual login route that issues signed JWTs for real users and continue with `TASK-011` frontend auth verification.

---

*Keep bug IDs stable. Mark as FIXED with fix date and commit hash when resolved.*
