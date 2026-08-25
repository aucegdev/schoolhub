# Testing & Deployment Report — SchoolHub

## 1. Testing Strategy

### Unit Testing
- **Framework:** Jest (backend), Vitest (frontend)
- **Coverage target:** 70%+ for core modules (Auth, Student, Attendance, Exams)
- **Scope:** Services, controllers, middleware, utility functions
- **Run command:** `cd backend && npm test` / `cd frontend && npm test`

### Integration Testing
- **Framework:** Supertest (API tests)
- **Scope:** All API endpoints for CRUD operations
- **Database:** Separate test database with Prisma (`schoolhub_test`)
- **Run command:** `cd backend && npm run test:integration`

### End-to-End Testing
- **Framework:** Cypress or Playwright
- **Scope:** Critical user flows (login → create student → mark attendance → enter marks → view report card)
- **Run command:** `npx cypress run`

### Test Cases

| TC ID | Module | Test Case | Expected Result | Status |
|-------|--------|-----------|-----------------|--------|
| TC-01 | Auth | Login with valid credentials | Returns JWT token | ⏳ |
| TC-02 | Auth | Login with invalid password | Returns 401 | ⏳ |
| TC-03 | Auth | Access protected route without token | Returns 401 | ⏳ |
| TC-04 | Auth | Admin accesses all modules | Returns 200 | ⏳ |
| TC-05 | Student | Create student with valid data | Returns 201 | ⏳ |
| TC-06 | Student | Get student by ID | Returns student data | ⏳ |
| TC-07 | Student | Search students by name | Returns filtered list | ⏳ |
| TC-08 | Teacher | Create teacher with valid data | Returns 201 | ⏳ |
| TC-09 | Teacher | Assign teacher to subject | Returns 200 | ⏳ |
| TC-10 | Attendance | Mark attendance for class | Saves record | ⏳ |
| TC-11 | Attendance | Get attendance report | Returns percentages | ⏳ |
| TC-12 | Exam | Create exam with max marks | Returns 201 | ⏳ |
| TC-13 | Exam | Enter marks for students | Saves marks | ⏳ |
| TC-14 | Exam | Generate report card PDF | Returns PDF | ⏳ |
| TC-15 | Exam | Student views results (visibility ON) | Returns 200 | ⏳ |
| TC-16 | Exam | Student views results (visibility OFF) | Returns 403 | ⏳ |
| TC-17 | Fees | Record payment | Updates fee status | ⏳ |
| TC-18 | Fees | Generate receipt | Returns receipt | ⏳ |
| TC-19 | Fees | Admin toggles fee visibility | Returns 200 | ⏳ |
| TC-20 | Docker | `docker-compose up` starts all services | All containers healthy | ⏳ |
| TC-21 | Jenkins | Push triggers Jenkins build | Build completes | ⏳ |
| TC-22 | Azure | Pipeline builds on PR merge | Pipeline succeeds | ⏳ |
| TC-23 | Ansible | Playbook provisions fresh VM | Application accessible | ⏳ |

## 2. Deployment Architecture

```
                         ┌─────────────────────────────┐
                         │       Azure VM (B1s)        │
                         │     Ubuntu 22.04 LTS        │
                         │     Public IP: x.x.x.x      │
                         └──────────┬──────────────────┘
                                    │
                    ┌───────────────┴───────────────┐
                    │       Docker Compose          │
                    │                               │
                    │  ┌─────────┐  ┌─────────┐    │
                    │  │  Nginx  │  │Backend  │    │
                    │  │  :80    │  │ :5000   │    │
                    │  │  :443   │  │         │    │
                    │  └────┬────┘  └────┬────┘    │
                    │       │            │         │
                    │  ┌────┴────┐  ┌────┴────┐   │
                    │  │Frontend │  │PostgreSQL│   │
                    │  │  :3000  │  │  :5432   │   │
                    │  └─────────┘  └──────────┘   │
                    └───────────────────────────────┘
```

## 3. CI/CD Pipeline

### 3.1 Jenkins Pipeline Flow

```
GitHub Push (webhook)
    │
    ▼
Jenkins
    ├── Stage 1: Checkout
    │   └── git clone from GitHub
    │
    ├── Stage 2: Install Dependencies
    │   ├── cd backend && npm install
    │   └── cd frontend && npm install
    │
    ├── Stage 3: Lint
    │   ├── cd backend && npm run lint
    │   └── cd frontend && npm run lint
    │
    ├── Stage 4: Test
    │   ├── cd backend && npm test
    │   └── cd frontend && npm test
    │
    ├── Stage 5: Build
    │   ├── cd frontend && npm run build
    │   └── cd backend && npx tsc
    │
    ├── Stage 6: Docker Build
    │   ├── docker build -f docker/frontend.Dockerfile
    │   └── docker build -f docker/backend.Dockerfile
    │
    └── Stage 7: Deploy (on main branch only)
        └── ansible-playbook deploy.yml
```

### 3.2 Azure DevOps Pipeline Flow

```
PR merged to main
    │
    ▼
Azure DevOps
    ├── Stage 1: Build & Test
    │   ├── Install Node.js 18
    │   ├── npm install (backend + frontend)
    │   ├── Lint
    │   ├── Test
    │   └── Build frontend
    │
    ├── Stage 2: Docker Build
    │   ├── Build frontend image
    │   ├── Build backend image
    │   └ tagging with build ID + latest
    │
    └── Stage 3: Deploy
        ├── SSH to Azure VM
        ├── docker-compose pull
        └── docker-compose up -d
```

## 4. Deployment Steps

### 4.1 Azure VM Setup (One-time)
```bash
# 1. Create Azure VM
az vm create \
  --resource-group schoolhub-rg \
  --name schoolhub-vm \
  --image Ubuntu2204 \
  --size Standard_B1s \
  --admin-username azureuser \
  --ssh-key-value ~/.ssh/id_rsa.pub \
  --nsg-rule SSH

# 2. Open ports
az vm open-port --resource-group schoolhub-rg --name schoolhub-vm --port 80
az vm open-port --resource-group schoolhub-rg --name schoolhub-vm --port 443

# 3. SSH into VM
ssh azureuser@<public-ip>
```

### 4.2 Ansible Deployment
```bash
# From local machine
cd ansible/
ansible-playbook -i inventory/hosts.yml playbook.yml

# What it does:
# 1. Installs Docker + Docker Compose
# 2. Configures Nginx reverse proxy
# 3. Clones SchoolHub repository
# 4. Runs docker-compose up -d
# 5. Sets up SSL with Let's Encrypt
```

### 4.3 Manual Deployment (Fallback)
```bash
# On Azure VM
git pull origin main
docker-compose down
docker-compose build
docker-compose up -d
```

## 5. Monitoring & Logs

```bash
# View container status
docker-compose ps

# View backend logs
docker-compose logs -f backend

# View frontend logs
docker-compose logs -f nginx

# View database logs
docker-compose logs -f db

# Check application health
curl http://localhost:5000/api/v1/health
```

## 6. Rollback Procedure

```bash
# If new deployment fails
docker-compose down
git checkout <previous-commit>
docker-compose build
docker-compose up -d
```

## 7. Bug Log

| Bug ID | Module | Description | Severity | Status |
|--------|--------|-------------|----------|--------|
| — | — | No bugs logged yet | — | — |

## 8. Test Results Summary

| Test Type | Total | Passed | Failed | Coverage |
|-----------|-------|--------|--------|----------|
| Unit Tests | — | — | — | — |
| Integration Tests | — | — | — | — |
| E2E Tests | — | — | — | — |
| Docker Build | — | — | — | — |
| Jenkins Pipeline | — | — | — | — |
| Azure Pipeline | — | — | — | — |

*To be populated as testing is executed in Weeks 5-6.*
