# Spec: Calendar & Holidays

**Issue:** #17 (CLOSED)
**Status:** ✅ Implemented
**Branch:** `feature/calendar-and-holidays`

## Overview
Calendar view showing school events and holidays. Admin can add/remove holidays.

## API Endpoints
| Method | Endpoint | Auth | Admin | Description |
|--------|----------|------|-------|-------------|
| GET | /api/v1/calendar | Yes | No | Get calendar data |
| GET | /api/v1/calendar/holidays | Yes | No | List holidays |
| POST | /api/v1/calendar/holidays | Yes | Yes | Add holiday |
| DELETE | /api/v1/calendar/holidays/:id | Yes | Yes | Remove holiday |

## Prisma Model
```prisma
enum HolidayType { PUBLIC, ACADEMIC, EMERGENCY }

model Holiday {
  id          String      @id @default(uuid())
  name        String
  date        DateTime
  type        HolidayType @default(PUBLIC)
  isRecurring Boolean     @default(false)
}
```

## Frontend
- Page: `/admin/calendar` — CalendarHolidays.tsx
- Monthly calendar grid view
- Holidays highlighted with color coding
- Add holiday form (name, date, type, recurring)
- Delete holiday with confirmation

## Acceptance Criteria
- [x] Calendar displays month view
- [x] Holidays shown on calendar
- [x] Admin can add holidays
- [x] Admin can delete holidays
- [x] Holiday types color-coded
