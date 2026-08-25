# Spec: Teacher CRUD Operations

**Issue:** #18 (CLOSED)
**Status:** ✅ Implemented
**Branch:** `feature/teacher-crud`

## Overview
Full teacher management: create, read, update, delete teacher profiles with search and pagination.

## API Endpoints
| Method | Endpoint | Auth | Admin | Description |
|--------|----------|------|-------|-------------|
| GET | /api/v1/teachers | Yes | No | List teachers |
| GET | /api/v1/teachers/:id | Yes | No | Get teacher |
| POST | /api/v1/teachers | Yes | Yes | Create teacher |
| PUT | /api/v1/teachers/:id | Yes | Yes | Update teacher |
| DELETE | /api/v1/teachers/:id | Yes | Yes | Delete teacher |

## Prisma Model
```prisma
enum TeacherStatus { ACTIVE, INACTIVE, ON_LEAVE, RESIGNED }

model Teacher {
  id             String        @id @default(uuid())
  employeeId     String        @unique
  firstName      String
  lastName       String
  dateOfBirth    DateTime?
  gender         String?
  qualification  String?
  specialization String?
  experience     Int?
  department     String?
  designation    String?
  dateOfJoining  DateTime?
  email          String?
  phone          String?
  address        String?
  salary         Float?
  bankAccount    String?
  ifscCode       String?
  photo          String?
  documents      String?
  status         TeacherStatus @default(ACTIVE)
  userId         String?       @unique
  subjects       TeacherSubject[]
  classTeacher   ClassTeacher?
}
```

## Frontend
- Page: `/admin/teachers` — TeacherManagement.tsx
- Table with search, filter, pagination
- Create/edit modal or inline form
- Status badges (Active, Inactive, etc.)
- Delete with confirmation

## Acceptance Criteria
- [x] Teacher list with search and pagination
- [x] Create teacher with all fields
- [x] Edit teacher profile
- [x] Delete teacher with confirmation
- [x] Status filtering
