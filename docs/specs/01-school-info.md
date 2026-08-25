# Spec: School Information Setup

**Issue:** #15 (CLOSED)
**Status:** ✅ Implemented
**Branch:** `feature/school-information-setup`

## Overview
Admin can view and update school profile information including name, tagline, logo, contact details, affiliation, and board.

## API Endpoints
| Method | Endpoint | Auth | Admin | Description |
|--------|----------|------|-------|-------------|
| GET | /api/v1/school | Yes | No | Get school info |
| PUT | /api/v1/school | Yes | Yes | Update school info |
| POST | /api/v1/school/logo | Yes | Yes | Upload school logo |

## Prisma Model
```prisma
model School {
  id                String   @id @default(uuid())
  schoolName        String
  tagline           String?
  logo              String?
  address           String?
  city              String?
  state             String?
  pincode           String?
  phone             String?
  email             String?
  website           String?
  affiliationNumber String?
  board             String?
  establishedYear   Int?
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt
}
```

## Frontend
- Page: `/admin/school` — SchoolInfo.tsx
- Form with fields: schoolName, tagline, address, city, state, pincode, phone, email, website, affiliationNumber, board, establishedYear
- Logo upload with preview
- Save button with loading state

## Acceptance Criteria
- [x] Admin can view school info
- [x] Admin can update school info
- [x] Admin can upload school logo
- [x] Logo displays after upload
- [x] Form validates required fields
