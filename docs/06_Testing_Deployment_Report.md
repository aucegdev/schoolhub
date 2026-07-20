# Testing & Deployment Report — SchoolHub

*This document will be completed during Weeks 5–6.*

## 1. Testing Strategy

### Unit Testing
- **Framework:** Jest (backend), Vitest (frontend)
- **Coverage target:** 70%+ for core modules (Auth, Student, Attendance, Exams)
- **Scope:** Services, controllers, middleware, utility functions

### Integration Testing
- **Framework:** Supertest (API tests)
- **Scope:** All API endpoints for CRUD operations
- **Database:** Separate test database with Prisma

### End-to-End Testing
- **Framework:** Cypress or Playwright
- **Scope:** Critical user flows (login, mark attendance, view results, pay fees)

### Test Cases (to be populated)

| TC ID | Module | Test Case | Expected Result | Status |
|-------|--------|-----------|-----------------|--------|
| TC-01 | Auth | Login with valid credentials | Returns JWT token | |
| TC-02 | Auth | Login with invalid password | Returns 401 | |
| TC-03 | Student | Create student with valid data | Returns 201 | |
| TC-04 | Student | Get student by ID | Returns student data | |
| TC-05 | Attendance | Mark attendance | Saves record | |
| TC-06 | Exam | Generate report card | Returns PDF | |
| TC-07 | Fees | Record payment | Updates fee status | |

## 2. Deployment Architecture

```
                         ┌─────────────┐
                         │   Azure VM  │
                         │  (Ubuntu)   │
                         └──────┬──────┘
                                │
                    ┌───────────┴───────────┐
                    │     Docker Compose    │
                    │                       │
                    │  ┌─────┐ ┌─────┐     │
                    │  │ Nginx│ │ API │     │
                    │  └─────┘ └─────┘     │
                    │  ┌─────┐ ┌─────┐     │
                    │  │Front │ │ DB  │     │
                    │  └─────┘ └─────┘     │
                    └───────────────────────┘
```

## 3. CI/CD Pipeline

### Jenkins Pipeline
1. Checkout code from GitHub
2. Install dependencies
3. Run linting
4. Run tests
5. Build Docker images
6. Push to container registry
7. Deploy to Azure VM via Ansible

### Azure DevOps Pipeline
1. Trigger on push to `develop`
2. Build and test
3. Package as Docker image
4. Deploy to Azure App Service or Azure Container Instances

## 4. Deployment Steps (to be executed)

- [ ] Create Azure VM (Ubuntu 22.04)
- [ ] Install Docker & Docker Compose
- [ ] Configure Nginx reverse proxy
- [ ] Set up SSL certificate
- [ ] Deploy application via Ansible
- [ ] Verify health endpoints
- [ ] Set up monitoring (Azure Monitor)
- [ ] Configure automated backups

## 5. Bug Log (to be populated)

| Bug ID | Module | Description | Status |
|--------|--------|-------------|--------|
| | | | |
