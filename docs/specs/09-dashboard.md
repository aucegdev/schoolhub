# Spec: Dashboard (All Roles)

**Issues:** #24 Admin, #25 Principal, #26 Teacher, #27 Student, #28 Parent
**Status:** ⏳ To Implement
**Branch:** `feature/dashboard`
**Sprint:** Week3 (Academics)

## Overview
Role-specific dashboard pages showing KPIs, recent activity, and quick actions.

## API Endpoints
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | /api/v1/dashboard/admin | Yes | Admin KPIs |
| GET | /api/v1/dashboard/principal | Yes | Principal KPIs |
| GET | /api/v1/dashboard/teacher | Yes | Teacher's daily view |
| GET | /api/v1/dashboard/student | Yes | Student's personal view |
| GET | /api/v1/dashboard/parent | Yes | Parent's child view |

## Dashboard Content

### Admin Dashboard (#24)
- Stats cards: Total Students, Teachers, Classes, Staff
- Fees collected: This month, this year, pending
- Attendance %: Today's overall, line chart over month
- Recent activities: Latest audit log entries
- Quick actions: Add student, publish notice, create exam
- Charts: Student admission trend, attendance by class

### Principal Dashboard (#25)
- Stats: Total students, teachers, pass percentage
- Pending approvals: Leave requests, exam results
- Teacher performance: Classes taught, assignments graded
- Attendance: Today's staff and student attendance %
- Charts: Exam pass rates by class, teacher workload

### Teacher Dashboard (#26)
- Today's schedule: Timetable for today
- Attendance pending: Classes not yet marked
- My classes: Assigned classes and subjects
- Assignments to grade: Pending submissions
- Quick actions: Mark attendance, create assignment

### Student Dashboard (#27)
- Attendance: This month's percentage
- Upcoming timetable: Today's classes
- Recent marks: Latest exam results
- Pending homework: Unsubmitted assignments
- Fee status: Paid/pending indicator

### Parent Dashboard (#28)
- Child selector: Switch between children
- Attendance: Child's monthly attendance %
- Recent marks: Latest results per subject
- Fee status: Due amounts, paid history
- Homework: Pending and completed
- Timetable: Child's weekly schedule

## Backend Module
```
backend/src/modules/dashboard/
  dashboard.routes.ts
  dashboard.controller.ts
  dashboard.service.ts
```

## Frontend
- Page: `/admin/dashboard` — AdminDashboard.tsx
- Page: `/teacher/dashboard` — TeacherDashboard.tsx
- Page: `/student/dashboard` — StudentDashboard.tsx
- Page: `/parent/dashboard` — ParentDashboard.tsx
- Components: StatCard, ActivityFeed, QuickActionBar, KpiChart, NoticeWidget

## Acceptance Criteria
- [ ] Admin sees system-wide KPIs
- [ ] Principal sees academic overview
- [ ] Teacher sees today's schedule
- [ ] Student sees personal overview
- [ ] Parent sees child's progress
- [ ] Role-based routing to correct dashboard
- [ ] Loading skeletons while fetching
- [ ] Quick action buttons functional
