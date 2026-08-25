# Technical Requirements Document — SchoolHub

## 1. Technology Stack

| Layer | Technology | Version | Purpose |
|-------|------------|---------|---------|
| Frontend | React + TypeScript | React 18, TS 5.x | User interface |
| Build Tool | Vite | 5.x | Frontend bundling |
| Styling | Tailwind CSS | 3.x | Utility-first CSS |
| UI Components | shadcn/ui | Latest | Pre-built components |
| Backend | Node.js + Express | Node 18, Express 4.x | API server |
| Database | PostgreSQL | 15 | Primary database |
| ORM | Prisma | 5.x | Type-safe database access |
| Auth | JWT (jsonwebtoken) | 9.x | Stateless authentication |
| Validation | Zod | 3.x | Schema validation |
| Containers | Docker + Docker Compose | Latest | Containerization |
| CI Server | Jenkins | Latest | Continuous Integration |
| Cloud CI/CD | Azure DevOps | Latest | Cloud pipeline |
| Config Mgmt | Ansible | Latest | VM provisioning |
| Reverse Proxy | Nginx | Latest | HTTP routing, SSL |
| Report Service | Maven + Java | Java 17, Maven 3.9 | PDF report generation |

## 2. Architecture

```
┌─────────────────────────────────────────────────────┐
│                    Nginx (80/443)                    │
│              Reverse Proxy + SSL Termination         │
└──────────────────────┬──────────────────────────────┘
                       │
          ┌────────────┴────────────┐
          ▼                         ▼
┌──────────────────┐     ┌──────────────────┐
│  Frontend (3000) │     │  Backend (5000)  │
│  React + Vite    │     │  Express + TS    │
│  Static files    │     │  REST API        │
└──────────────────┘     └────────┬─────────┘
                                  │
                         ┌────────┴─────────┐
                         ▼                  ▼
                ┌──────────────┐   ┌──────────────┐
                │  PostgreSQL  │   │ Report Svc   │
                │  (5432)      │   │ (Maven/Java) │
                │  Prisma ORM  │   │  PDF Engine  │
                └──────────────┘   └──────────────┘
```

### Architecture Decisions
- **Single Express Server:** Appropriate for this scale
- **Prisma ORM:** Type safety, auto-generated types, migrations
- **JWT Stateless Auth:** No server-side session store
- **Domain-Based Modules:** Backend organized by business domains
- **Admin Super-Authority:** ADMIN role bypasses all RBAC checks
- **Module Visibility Guard:** Middleware checks module enabled per role
- **Maven Report Service:** Java service for PDF report generation (satisfies Maven syllabus requirement)

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
│   ├── nginx.conf            # Nginx config for production
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
│   │   │   ├── operations/   # events, notices, transport
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
├── report-service/              # Maven Java service for PDF reports
│   ├── pom.xml
│   └── src/main/java/
│
├── ansible/
│   ├── inventory/
│   │   └── hosts.yml           # Azure VM inventory
│   ├── playbook.yml             # Main playbook
│   └── roles/
│       ├── docker/              # Install Docker + Compose
│       ├── nginx/               # Configure Nginx
│       ├── schoolhub/           # Deploy application
│       └── ssl/                 # SSL certificate setup
│
├── jenkins/
│   └── Jenkinsfile              # Pipeline definition
│
├── docker/
│   ├── frontend.Dockerfile
│   └── backend.Dockerfile
│
├── docker-compose.yml           # Full stack orchestration
├── azure-pipelines.yml          # Azure DevOps pipeline
├── docs/
├── Thesis_Title/
├── .gitignore
├── README.md
└── LICENSE
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
| GET | /exams/:id/result | Get results *(visibility gated)* |
| GET | /exams/:id/report-card | Download report card PDF |

### Fees
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /fees | List fee records |
| POST | /fees | Record payment |
| GET | /fees/:id/receipt | Generate receipt |
| GET | /fees/report | Fee report *(visibility gated)* |

### Module Visibility
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /settings/module-visibility | Get visibility settings (admin) |
| PUT | /settings/module-visibility | Update module visibility per role |

## 5. Security
- Passwords hashed with bcrypt (salt rounds: 12)
- JWT with HS256, 7-day expiry
- All API routes protected by JWT middleware
- Role-based middleware for admin-only endpoints
- Admin Super-Authority bypasses all RBAC
- Module Visibility Guard middleware
- Input validation via Zod schemas
- Helmet for HTTP headers
- CORS configured for frontend origin only
- HTTPS via Let's Encrypt on Nginx

## 6. DevOps Configuration Files

### 6.1 Jenkinsfile (Jenkins CI)
```groovy
pipeline {
    agent any
    triggers {
        githubPush()
    }
    stages {
        stage('Checkout') {
            steps {
                git branch: 'main',
                    url: 'https://github.com/aucegdev/schoolhub.git'
            }
        }
        stage('Install') {
            steps {
                sh 'cd backend && npm install'
                sh 'cd frontend && npm install'
            }
        }
        stage('Lint') {
            steps {
                sh 'cd backend && npm run lint'
                sh 'cd frontend && npm run lint'
            }
        }
        stage('Test') {
            steps {
                sh 'cd backend && npm test'
                sh 'cd frontend && npm test'
            }
        }
        stage('Build') {
            steps {
                sh 'cd frontend && npm run build'
                sh 'cd backend && npx tsc'
            }
        }
        stage('Docker Build') {
            steps {
                sh 'docker build -f docker/frontend.Dockerfile -t schoolhub-frontend .'
                sh 'docker build -f docker/backend.Dockerfile -t schoolhub-backend .'
            }
        }
    }
    post {
        always {
            cleanWs()
        }
    }
}
```

### 6.2 azure-pipelines.yml (Azure DevOps)
```yaml
trigger:
  branches:
    include:
      - main

pool:
  vmImage: 'ubuntu-latest'

stages:
- stage: BuildAndTest
  displayName: 'Build and Test'
  jobs:
  - job: Build
    displayName: 'Build Application'
    steps:
    - task: NodeTool@0
      inputs:
        versionSpec: '18.x'
      displayName: 'Install Node.js'

    - script: |
        cd backend && npm install
        cd ../frontend && npm install
      displayName: 'Install Dependencies'

    - script: |
        cd backend && npm run lint
        cd ../frontend && npm run lint
      displayName: 'Lint'

    - script: |
        cd backend && npm test
        cd ../frontend && npm test
      displayName: 'Test'

    - script: |
        cd frontend && npm run build
      displayName: 'Build Frontend'

- stage: DockerBuild
  displayName: 'Docker Build'
  dependsOn: BuildAndTest
  jobs:
  - job: Docker
    displayName: 'Build Docker Images'
    steps:
    - task: Docker@2
      inputs:
        containerRegistry: 'Azure Container Registry'
        command: 'build'
        Dockerfile: 'docker/backend.Dockerfile'
        tags: |
          $(Build.BuildId)
          latest
```

### 6.3 Ansible Playbook
```yaml
# ansible/playbook.yml
---
- name: Deploy SchoolHub to Azure VM
  hosts: schoolhub_server
  become: yes
  roles:
    - docker
    - nginx
    - schoolhub
    - ssl
```

### 6.4 Docker Compose
```yaml
# docker-compose.yml
version: '3.8'
services:
  frontend:
    build:
      context: .
      dockerfile: docker/frontend.Dockerfile
    ports:
      - "3000:80"
    depends_on:
      - backend

  backend:
    build:
      context: .
      dockerfile: docker/backend.Dockerfile
    ports:
      - "5000:5000"
    environment:
      DATABASE_URL: postgresql://schoolhub:password@db:5432/schoolhub
      JWT_SECRET: ${JWT_SECRET}
    depends_on:
      - db

  db:
    image: postgres:15
    environment:
      POSTGRES_DB: schoolhub
      POSTGRES_USER: schoolhub
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - pgdata:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./certbot/conf:/etc/letsencrypt
    depends_on:
      - frontend
      - backend

volumes:
  pgdata:
```

## 7. Database Schema
Key models: User, Student, Teacher, Parent, Class, Subject, Timetable, Attendance, Exam, Mark, Assignment, Submission, Fee, TransportRoute, Vehicle, Driver, Event, Notice, AuditLog, ModuleVisibility

See `backend/prisma/schema.prisma` for full schema.
