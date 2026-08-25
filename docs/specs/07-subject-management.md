# Spec: Subject Management

**Issue:** #22
**Status:** ⏳ To Implement
**Branch:** `feature/subject-management`
**Sprint:** Week2 (Core)
**Depends on:** #21 Class & Section

## Overview
Admin creates and manages subjects offered across classes. Subjects have codes, types, and max marks configuration.

## API Endpoints
| Method | Endpoint | Auth | Admin | Description |
|--------|----------|------|-------|-------------|
| GET | /api/v1/subjects | Yes | No | List subjects (filter by class) |
| GET | /api/v1/subjects/:id | Yes | No | Get subject details |
| POST | /api/v1/subjects | Yes | Yes | Create subject |
| PUT | /api/v1/subjects/:id | Yes | Yes | Update subject |
| DELETE | /api/v1/subjects/:id | Yes | Yes | Delete subject |

## Prisma Schema (to extend)
```prisma
model Subject {
  id              String           @id @default(uuid())
  name            String
  code            String?
  type            String?          @default("CORE")
  maxWeeklyPeriods Int?
  passingMarks    Int?
  maxMarks        Int?
  isLanguage      Boolean          @default(false)
  isLab           Boolean          @default(false)
  teachers        TeacherSubject[]
}
```

## Backend Module
```
backend/src/modules/subject/
  subject.routes.ts
  subject.controller.ts
  subject.service.ts
```

## Frontend
- Page: `/admin/subjects` — SubjectManagement.tsx
- Table of subjects with code, type, class assignment
- Create/edit form with validation
- Filter by class, type (Core/Elective)
- Subject-code auto-generation

## Acceptance Criteria
- [ ] List all subjects with filters
- [ ] Create subject with code, type, marks config
- [ ] Edit subject details
- [ ] Delete subject
- [ ] Filter by class and type
- [ ] Subject code uniqueness validation
