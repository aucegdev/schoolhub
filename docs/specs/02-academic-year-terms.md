# Spec: Academic Year & Terms

**Issue:** #16 (CLOSED)
**Status:** ✅ Implemented
**Branch:** `feature/academic-year-and-terms`

## Overview
Admin can create academic years with start/end dates and manage terms within each year.

## API Endpoints
| Method | Endpoint | Auth | Admin | Description |
|--------|----------|------|-------|-------------|
| GET | /api/v1/academic-years | Yes | No | List all years |
| GET | /api/v1/academic-years/:id | Yes | No | Get year with terms |
| POST | /api/v1/academic-years | Yes | Yes | Create year |
| PUT | /api/v1/academic-years/:id | Yes | Yes | Update year |
| GET | /api/v1/terms | Yes | No | List all terms |
| GET | /api/v1/terms/:id | Yes | No | Get term |
| POST | /api/v1/terms | Yes | Yes | Create term |
| PUT | /api/v1/terms/:id | Yes | Yes | Update term |

## Prisma Models
```prisma
model AcademicYear {
  id        String   @id @default(uuid())
  name      String
  startDate DateTime
  endDate   DateTime
  isActive  Boolean  @default(true)
  terms     Term[]
}

model Term {
  id             String       @id @default(uuid())
  name           String
  academicYearId String
  academicYear   AcademicYear @relation(...)
  startDate      DateTime
  endDate        DateTime
  isActive       Boolean      @default(true)
}
```

## Frontend
- Page: `/admin/academic-years` — AcademicYears.tsx
- List of academic years with expandable terms
- Create/edit forms for years and terms
- Active year indicator

## Acceptance Criteria
- [x] Admin can create academic years
- [x] Admin can add terms to years
- [x] Active year is marked
- [x] Terms have date ranges
