# SchoolHub - Smart School Management System

**Manage. Learn. Grow.**

SchoolHub is a modern school management platform built with React, TypeScript, Node.js, PostgreSQL, and Docker. It supports school administration, academic management, attendance, fees, examinations, and deployment-ready DevOps workflows for local and Azure-based production environments.

## Team

| Roll No. | Name |
|----------|------|
| 2023103032 | Jivetesh |
| 2023103546 | Kathir Kalidass B |
| 2023103714 | Paril T |

## Stack

- Frontend: React 19 + TypeScript + Vite + Tailwind CSS
- Backend: Node.js + Express + TypeScript
- Database: PostgreSQL + Prisma ORM
- Authentication: JWT + Firebase Google OAuth
- DevOps: Docker Compose, Jenkins, Azure DevOps, Ansible, Nginx
- Cloud: Azure VM deployment

## Core Modules

1. Authentication & Authorization
2. Dashboard
3. User Management
4. School Administration
5. Student Management
6. Parent Management
7. Teacher & Staff Management
8. Academic Management
9. Timetable Management
10. Attendance Management
11. Examination Management
12. Assignment & Homework
13. Fees Management
14. Transport Management
15. Events & Notice Board
16. Communication
17. Reports & Analytics
18. Audit Logs
19. Settings

## Branch Strategy

- `main` - production branch
- `dev` - active integration branch
- `feature/*` - feature branches

## Environment Setup

SchoolHub uses separate environment files for local development and production:

| File | Purpose | Used By |
|------|---------|---------|
| `.env.local` | Local Docker configuration and Firebase build values | `task docker:up` |
| `.env.production` | Azure production (secrets, nginx) | CI/CD, Ansible |
| `.env.test` | CI/CD test stage | Azure Pipelines |
| `.env.example` | Reference template | Copy to create others |

**Quick setup:**
```bash
# 1. Create local configuration from the template
task env:setup

# 2. Configure JWT_SECRET and Firebase values in .env.local
#    Set POSTGRES_USER / POSTGRES_PASSWORD / POSTGRES_DB if desired.

# 3. Build all app images, install dependencies inside their build containers,
#    apply database migrations, and start the complete stack.
task docker:up

# Application: http://localhost:3000
# API health: http://localhost:3000/api/v1/health

# Force a clean, uncached image build (including fresh dependency installs):
task docker:rebuild

# Optional database administration UI:
task run:dev:tools
```

All application runtime services (frontend, API, PDF report service, and
PostgreSQL) run in containers. The local Compose file does not mount source code
or host `node_modules`; the frontend and API are built as production images and
served through Nginx. PostgreSQL data and uploaded files are stored in named
Docker volumes and survive container recreation. Use
`docker compose --env-file .env.local down -v` only when you intentionally want
to delete that local data.

**Production deploy:**
```bash
# 1. Create .env.production with real secrets
cp .env.example .env.production
# Set a strong JWT_SECRET, POSTGRES_PASSWORD, DATABASE_URL and Firebase values.

# 2. Push to main branch (triggers Azure DevOps pipeline)
git push origin main
```

## Running the Production Images Locally

The default `docker-compose.yml` builds the frontend and backend production
images locally, so source changes are compiled and dependencies installed
during `docker compose up --build`. To run the registry-backed Azure production
stack instead, populate `.env.production` and use `task docker:prod`. The
production Compose file pulls the tagged backend, frontend, and report-service
images; committed database migrations run before the API begins serving
traffic. The repository currently has no Prisma migration files, so local
Compose bootstraps its disposable/local schema with `prisma db push`. Before
deploying to Azure, create and commit a baseline Prisma migration; the
production container intentionally fails startup rather than serving against
an uninitialized database.

The Azure pipeline's `VITE_FIREBASE_*` variables must also be configured in
the pipeline settings to enable Google sign-in in the deployed frontend.
## Firebase Google Login

SchoolHub supports Firebase Google authentication for the web portal. Set the following variables in your frontend env:

- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_STORAGE_BUCKET`
- `VITE_FIREBASE_MESSAGING_SENDER_ID`
- `VITE_FIREBASE_APP_ID`

The backend verifies Firebase ID tokens when configured, while still supporting the existing JWT flow for internal API access.

For Docker, the frontend values are compiled into the frontend image, so rebuild
it after changing them (`docker compose up --build -d frontend`). Google
Authentication only requires the Firebase Web App's API key, auth domain,
project ID, and app ID; storage bucket, sender ID, and measurement ID are
optional for sign-in. In Firebase Console, enable **Authentication → Google**
and add the browser hostname (for example `localhost`) under **Authorized
domains**. For protected API requests, configure the backend Admin SDK with
`FIREBASE_PROJECT_ID` and either `FIREBASE_CLIENT_EMAIL` plus
`FIREBASE_PRIVATE_KEY`, or Google Application Credentials. Firebase web config
is public client config; never put Admin SDK private keys in `VITE_*` values.

## Deployment

### Local
```bash
task env:setup     # First-time local configuration
task docker:up     # Build and run every service in containers
task docker:logs   # Follow container logs
task docker:down   # Stop containers; named data volumes remain
task docker:rebuild # Rebuild local application images without cache
```

### Production (Azure)
```bash
# Option A: Push to main (triggers Azure DevOps CI/CD)
git push origin main

# Option B: Manual deploy via Ansible
cp .env.example .env.production # Configure production secrets before deploying
ansible-playbook -i ansible/inventory/hosts.yml ansible/playbooks/provision.yml
ansible-playbook -i ansible/inventory/hosts.yml ansible/playbooks/deploy.yml
ansible-playbook -i ansible/inventory/hosts.yml ansible/playbooks/ssl.yml
```

### Azure Hosting Options
| Option | Cost | Complexity |
|--------|------|-----------|
| Azure B1s VM (current) | ~$8-13/mo | Low — Docker Compose |
| Azure Container Apps | ~$5-10/mo | Medium — rewrite deploy |
| Azure for Students | Free (12mo) | Low — $100 credit |

**CI/CD Pipeline definitions:** `azure-pipelines.yml` (primary), `Jenkinsfile` (legacy)

## Documentation

- AI handoff memory: `AI_AGENT.md`
- Agent work history: `.ai/`
- Requirements and architecture: `docs/`

## Important Notes

- Use `dev` as the active branch.
- Keep secrets in `.env` files and never commit them.
- Run `npx prisma validate` after Prisma schema changes.
