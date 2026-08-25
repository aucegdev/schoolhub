# Spec: Class & Section Management

**Issue:** #21
**Status:** ⏳ To Implement
**Branch:** `feature/class-section`
**Sprint:** Week2 (Core)

## Overview
Admin creates classes (grades) and sections within each class. Foundation for timetable, attendance, and student assignment.

## API Endpoints
| Method | Endpoint | Auth | Admin | Description |
|--------|----------|------|-------|-------------|
| GET | /api/v1/classes | Yes | No | List all classes with sections |
| GET | /api/v1/classes/:id | Yes | No | Get class with sections, students |
| POST | /api/v1/classes | Yes | Yes | Create class |
| PUT | /api/v1/classes/:id | Yes | Yes | Update class |
| DELETE | /api/v1/classes/:id | Yes | Yes | Delete class |
| POST | /api/v1/classes/:id/sections | Yes | Yes | Add section to class |
| PUT | /api/v1/sections/:id | Yes | Yes | Update section |
| DELETE | /api/v1/sections/:id | Yes | Yes | Delete section |

## Prisma Schema (existing)
```prisma
model Class {
  id       String           @id @default(uuid())
  name     String
  sections Section[]
  subjects TeacherSubject[]
}

model Section {
  id        String  @id @default(uuid())
  name      String
  classId   String
  class     Class   @relation(fields: [classId], references: [id], onDelete: Cascade)
  classTeacher ClassTeacher?
}
```

## Backend Module
```
backend/src/modules/class/
  class.routes.ts
  class.controller.ts
  class.service.ts
```

## Frontend
- Page: `/admin/classes` — ClassManagement.tsx
- Grid/list of classes with section count
- Expandable class cards showing sections
- Create class form (name, code)
- Add section form (name, capacity, room)
- Class teacher assignment display
- Student count per section

## Acceptance Criteria
- [ ] List all classes with sections
- [ ] Create class with name
- [ ] Add sections to class
- [ ] Edit class and sections
- [ ] Delete class (cascades sections)
- [ ] Delete section
- [ ] Show student count per section
- [ ] Show class teacher per section
