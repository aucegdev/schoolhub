# Technical Requirements Document — SchoolHub

## 1. Technology Stack

| Layer | Technology | Version |
|-------|------------|---------|
| Frontend | React + TypeScript | React 18, TS 5.x |
| Build Tool | Vite | 5.x |
| Styling | Tailwind CSS | 3.x |
| UI Components | shadcn/ui | Latest |
| Backend | Node.js + Express | Node 18, Express 4.x |
| Database | PostgreSQL | 15 |
| ORM | Prisma | 5.x |
| Auth | JWT (jsonwebtoken) | 9.x |
| Validation | Zod | 3.x |
| Containers | Docker + Docker Compose | Latest |
| CI/CD | Jenkins, Azure DevOps | Latest |
| Config Mgmt | Ansible | Latest |

## 2. Architecture

```
┌─────────────┐     ┌──────────────┐     ┌────────────┐
│  React App  │────▶│  Express API │────▶│ PostgreSQL │
│  (Vite)     │     │  (Node.js)   │     │  (Prisma)  │
└─────────────┘     └──────────────┘     └────────────┘
       │                    │
       │  JWT Token         │  RBAC Middleware
       │  in HTTP Header    │  per Route
```

### Architecture Decisions
- **Single Express Server:** Appropriate for this scale; microservices add unnecessary complexity.
- **Prisma ORM:** Type safety, auto-generated types, migrations, and schema-first approach.
- **JWT Stateless Auth:** Simple, no server-side session store required.
- **Domain-Based Modules:** Backend organized by business domains (people, academics, assessment, finance, operations).

## 3. Folder Structure

```
schoolhub/
├── frontend/
│   ├── src/
│   │   ├── components/       # Shared UI components
│   │   ├── pages/            # Route pages per module
│   │   ├── services/         # API client calls
│   │   ├── hooks/            # Custom React hooks
│   │   ├── contexts/         # Auth, theme contexts
│   │   ├── routes/           # Route definitions
│   │   ├── utils/            # Helper functions
│   │   ├── types/            # TypeScript types
│   │   └── styles/           # Global styles
│   ├── Dockerfile
│   └── package.json
│
├── backend/
│   ├── src/
│   │   ├── config/           # DB, auth config
│   │   ├── middleware/       # Auth, validation, error handling
│   │   ├── modules/
│   │   │   ├── auth/
│   │   │   ├── people/       # students, teachers, parents, users
│   │   │   ├── academics/    # classes, subjects, timetable, attendance
│   │   │   ├── assessment/   # exams, assignments
│   │   │   ├── finance/      # fees
│   │   │   ├── operations/   # events, notices, library, transport
│   │   │   ├── reports/
│   │   │   └── dashboard/
│   │   ├── routes/
│   │   ├── utils/
│   │   └── server.ts
│   ├── prisma/
│   │   ├── schema.prisma
│   │   ├── migrations/
│   │   └── seed.ts
│   ├── Dockerfile
│   └── package.json
│
├── infrastructure/
│   ├── docker/
│   ├── jenkins/
│   ├── ansible/
│   └── azure/
│
├── docs/
├── docker-compose.yml
└── README.md
```

## 4. API Design

Base URL: `/api/v1`

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /auth/login | User login |
| POST | /auth/register | User registration |
| POST | /auth/forgot-password | Request password reset |
| POST | /auth/reset-password | Reset password |

### Students
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /students | List students |
| POST | /students | Create student |
| GET | /students/:id | Get student |
| PUT | /students/:id | Update student |
| DELETE | /students/:id | Delete student |
| POST | /students/:id/promote | Promote student |

### Teachers
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /teachers | List teachers |
| POST | /teachers | Create teacher |
| GET | /teachers/:id | Get teacher |
| PUT | /teachers/:id | Update teacher |
| DELETE | /teachers/:id | Delete teacher |

### Classes
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /classes | List classes |
| POST | /classes | Create class |
| GET | /classes/:id | Get class |
| PUT | /classes/:id | Update class |

### Attendance
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /attendance | List attendance records |
| POST | /attendance | Mark attendance |
| GET | /attendance/report | Attendance report |

### Exams
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /exams | List exams |
| POST | /exams | Create exam |
| POST | /exams/:id/marks | Enter marks |
| GET | /exams/:id/result | Get results |
| GET | /exams/:id/report-card | Download report card PDF |

### Fees
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /fees | List fee records |
| POST | /fees | Record payment |
| GET | /fees/:id/receipt | Generate receipt |
| GET | /fees/report | Fee report |

## 5. Security
- Passwords hashed with bcrypt (salt rounds: 12)
- JWT with RS256 or HS256, 7-day expiry
- All API routes protected by JWT middleware
- Role-based middleware for admin-only endpoints
- Input validation via Zod schemas
- Helmet for HTTP headers
- CORS configured for frontend origin only

## 6. Database Schema
See `docs/Database.md` or `backend/prisma/schema.prisma` for full schema.

Key models: User, Student, Teacher, Parent, Class, Subject, Timetable, Attendance, Exam, Mark, Assignment, Submission, Fee, TransportRoute, Vehicle, Driver, Event, Notice
