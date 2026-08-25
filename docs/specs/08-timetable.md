# Spec: Timetable Management

**Issue:** #23
**Status:** ⏳ To Implement
**Branch:** `feature/timetable`
**Sprint:** Week3 (Academics)
**Depends on:** #21 Class, #22 Subject, #19 Teacher Assignment

## Overview
Create and manage weekly class timetables with conflict detection. Grid view showing day × period matrix.

## Prisma Schema (to add)
```prisma
model Timetable {
  id           String   @id @default(uuid())
  classId      String
  class        Class    @relation(fields: [classId], references: [id])
  sectionId    String
  section      Section  @relation(fields: [sectionId], references: [id])
  dayOfWeek    String   // MONDAY, TUESDAY, etc.
  periodNumber Int      // 1-8
  startTime    String   // "08:00"
  endTime      String   // "08:45"
  subjectId    String
  subject      Subject  @relation(fields: [subjectId], references: [id])
  teacherId    String
  teacher      Teacher  @relation(fields: [teacherId], references: [id])
  roomNumber   String?
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt

  @@unique([classId, sectionId, dayOfWeek, periodNumber])
}
```

## API Endpoints
| Method | Endpoint | Auth | Admin | Description |
|--------|----------|------|-------|-------------|
| GET | /api/v1/timetable | Yes | No | Get timetable (filter by class/teacher) |
| POST | /api/v1/timetable | Yes | Yes | Create/update timetable entry |
| PUT | /api/v1/timetable/:id | Yes | Yes | Update entry |
| DELETE | /api/v1/timetable/:id | Yes | Yes | Delete entry |
| GET | /api/v1/timetable/check-conflict | Yes | No | Check for scheduling conflicts |

## Backend Module
```
backend/src/modules/timetable/
  timetable.routes.ts
  timetable.controller.ts
  timetable.service.ts
```

## Frontend
- Page: `/admin/timetable` — TimetableManagement.tsx
- Grid view: rows = days (Mon-Sat), cols = periods (1-8)
- Click cell to assign subject + teacher + room
- Conflict detection (red highlight if teacher double-booked)
- Class/section selector dropdown
- Color-coded by subject

## Acceptance Criteria
- [ ] Timetable grid displays correctly
- [ ] Create entry by clicking cell
- [ ] Assign subject + teacher to slot
- [ ] Conflict detection (teacher/room double-booking)
- [ ] Edit existing entries
- [ ] Delete entries
- [ ] Filter by class/section
- [ ] Color coding by subject
