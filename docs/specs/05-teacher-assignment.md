# Spec: Teacher Subject Assignment

**Issue:** #19 (CLOSED)
**Status:** ✅ Implemented
**Branch:** `feature/teacher-subject-assignment`

## Overview
Assign teachers to subjects and classes. Set class teachers for sections.

## API Endpoints
| Method | Endpoint | Auth | Admin | Description |
|--------|----------|------|-------|-------------|
| GET | /api/v1/assignments/teachers/:id/subjects | Yes | No | Get teacher's subjects |
| POST | /api/v1/assignments/teachers/:id/subjects | Yes | Yes | Assign subject |
| DELETE | /api/v1/assignments/teachers/:id/subjects/:subjectId | Yes | Yes | Remove assignment |
| GET | /api/v1/assignments/classes/:sectionId/class-teacher | Yes | No | Get class teacher |
| PUT | /api/v1/assignments/classes/:sectionId/class-teacher | Yes | Yes | Set class teacher |
| GET | /api/v1/assignments/subjects/:subjectId/teachers | Yes | No | List teachers for subject |
| GET | /api/v1/assignments/sections/:sectionId/teachers | Yes | No | List teachers for section |

## Prisma Models
```prisma
model TeacherSubject {
  id        String   @id @default(uuid())
  teacherId String
  subjectId String
  classId   String?
  @@unique([teacherId, subjectId, classId])
}

model ClassTeacher {
  id        String  @id @default(uuid())
  teacherId String  @unique
  sectionId String  @unique
}
```

## Acceptance Criteria
- [x] Assign teacher to subject+class
- [x] Remove subject assignment
- [x] Set class teacher for section
- [x] List teachers per subject
- [x] List teachers per section
