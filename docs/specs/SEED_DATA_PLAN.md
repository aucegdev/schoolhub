# SchoolHub Seed Data Plan

## Purpose

Populate the database with realistic, valid data so the full UI can be experienced
without manually creating each record through the UI.

## Scope

Seed affects **local development** only. Production uses real data.
Never run the seed script against production databases.

## Data Volume

| Entity | Count | Rationale |
|--------|-------|-----------|
| Academic Years | 2 | Current + previous year |
| Classes | 12 | Grades 1–12 |
| Sections per class | 2–4 | A, B, C sections |
| Subjects | 24 | 2 per class (English + Math baseline) |
| Teachers | 15 | Mix of subjects |
| Students | 180 | ~15 per section across all classes |
| Timetable entries | ~120 | Weekly schedule per class-section |
| Exams | 6 | 2 unit tests + 2 term exams + 2 finals |
| Attendance records | ~900 | 5 school days per class-section |
| Notices | 8 | Mix of targets (all, teachers, parents) |
| Events | 5 | Upcoming events |
| Leave requests | 10 | Mix of approved/pending/rejected |
| Fee structures | 12 | One per class |
| Fee payments | 50 | Partial payments for some students |
| Vehicles | 8 | School buses |
| Routes | 6 | Bus routes |
| Drivers | 6 | One per vehicle |
| Transport allocations | 30 | Student-to-route assignments |
| Notifications | 12 | Various types |

## Execution Order

```
1. Academic Years      (no dependencies)
2. Classes + Sections  (depends on academic years)
3. Subjects            (depends on classes)
4. Teachers            (no dependencies)
5. Students            (depends on classes + sections)
6. Timetable           (depends on classes + sections + subjects + teachers)
7. Exams               (depends on classes + subjects + teachers)
8. Attendance          (depends on classes + sections + students)
9. Notices             (no dependencies)
10. Events             (no dependencies)
11. Leave requests     (depends on teachers)
12. Fee structures     (depends on classes)
13. Fee payments       (depends on students + fee structures)
14. Vehicles + Routes + Drivers (no dependencies)
15. Transport allocations    (depends on vehicles + routes + students)
16. Notifications      (no dependencies)
```

## Script Location

`backend/src/scripts/seed.ts`

## Execution

```bash
# From backend directory
npx tsx src/scripts/seed.ts

# Or via npm script (to be added)
npm run seed
```

## Safety

- Script checks for existing data before inserting
- Skips records that already exist (idempotent)
- Aborts if running in production (checks `NODE_ENV`)
- Logs summary of what was created

## Sample Data Characteristics

- Realistic Indian school names and locations
- Common Indian first/last names for students and teachers
- Valid phone numbers, email patterns
- Proper date ranges (DOB aligned to grade level)
- Attendance follows realistic patterns (Mon–Fri higher, Sat lower)
- Fee amounts vary by class (higher for senior classes)
- Transport routes cover realistic city areas

## Future Enhancements

- CSV import support for bulk student data
- Faker.js integration for randomized realistic data
- Per-role seed (teacher-only, student-only)
- Seed reset (truncate + re-seed)
