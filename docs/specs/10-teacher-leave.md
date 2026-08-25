# Spec: Teacher Leave Management

**Issue:** #20
**Status:** ⏳ To Implement
**Branch:** `feature/teacher-leave`
**Sprint:** Week3 (Academics)

## Overview
Teachers apply for leave. Principals/admins approve or reject with reason.

## API Endpoints
| Method | Endpoint | Auth | Role | Description |
|--------|----------|------|------|-------------|
| POST | /api/v1/teachers/:id/leave | Yes | Teacher | Apply for leave |
| GET | /api/v1/teachers/:id/leave | Yes | Teacher | View leave history |
| GET | /api/v1/leave/pending | Yes | Principal | Pending approvals |
| PUT | /api/v1/leave/:id/approve | Yes | Principal | Approve leave |
| PUT | /api/v1/leave/:id/reject | Yes | Principal | Reject with reason |

## Prisma Schema (to add)
```prisma
enum LeaveStatus { PENDING, APPROVED, REJECTED }
enum LeaveType { SICK, CASUAL, MATERNITY, PATERNITY, OTHER }

model Leave {
  id         String      @id @default(uuid())
  teacherId  String
  teacher    Teacher     @relation(fields: [teacherId], references: [id])
  leaveType  LeaveType
  startDate  DateTime
  endDate    DateTime
  reason     String
  status     LeaveStatus @default(PENDING)
  approvedBy String?
  remarks    String?
  createdAt  DateTime    @default(now())
  updatedAt  DateTime    @updatedAt
}
```

## Frontend
- Teacher: Apply form, leave history table
- Principal: Pending leaves list, approve/reject actions

## Acceptance Criteria
- [ ] Teacher can apply for leave
- [ ] Leave has type, dates, reason
- [ ] Principal sees pending leaves
- [ ] Principal can approve with remarks
- [ ] Principal can reject with reason
- [ ] Leave status updated in real-time
