# Plan: Separate Local/Production Environments & Azure DevOps Pipeline Fixes

## 1. Create Environment Files

### 1a. `.env.local` (new) — Local Development
- Source of truth for `docker compose up` local runs
- Hot-reload volume mounts, localhost DB, localhost frontend URLs
- Dev Firebase project, weak JWT secret

### 1b. `.env.production` (new) — Azure Production
- Real production values (strong secrets, production Firebase, production URLs)
- `DATABASE_URL` points to postgres within the compose network
- `NODE_ENV=production`
- `.gitignore`d, referenced by Ansible deploy playbook

### 1c. `.env.example` (update) — Reference Template
- Strip all values, keep only variable names and descriptions
- Add comments explaining local vs production usage
- Single authoritative reference for all env vars

### 1d. `.env.test` (new) — CI/CD Pipeline
- Used by Azure Pipelines for test stage
- Separate test database, no volume mounts

### 1e. `backend/.env` → `.gitignore`
- Currently tracked in git (security issue) — needs to be removed from tracking

## 2. Fix `docker-compose.prod.yml`

- Add postgres service (make it self-contained — currently missing)
- Fix `DATABASE_URL` to use `postgres` hostname (works within compose network)
- Remove dev-only settings (no volumes, no ports on backend/frontend)
- Add healthchecks to all services
- Set resource limits (already present)
- Ensure container names match Ansible references

## 3. Update `docker-compose.yml` (Local)

- Reference `.env.local` as default env file
- Keep dev-friendly settings (hot reload, pgadmin, exposed ports)
- Add profiles so pgadmin doesn't start unless requested

## 4. Update `Taskfile.yml`

- Add `env:setup` task — copies `.env.example` → `.env.local` with dev defaults
- Update `docker:prod` task to use `.env.production`
- Add `deploy:azure` task — pushes images and triggers pipeline
- Add `db:seed` task for initial database setup
- Add `test` task using `.env.test`
- Update `verify:devops` to check new env structure

## 5. Update `azure-pipelines.yml`

- Add **Test stage**: run unit tests against `.env.test`
- Add **Variable Group** from Azure DevOps Library for production secrets
- Use `FileTransform@1` task to inject secrets into `.env.production` template
- Fix service connection — use `dockerRegistryConnection` variable properly
- Deploy stage: copy `.env.production` with injected secrets to VM
- Add stage dependencies and conditions properly

## 6. Update Ansible Playbooks

### `deploy.yml`
- Fix container name: `schoolhub-db` → `schoolhub-postgres` (match compose)
- Fix backend container name: already correct
- Add `--env-file .env.production` to docker compose commands
- Add Prisma migration step (run `npx prisma migrate deploy` in backend container)
- Add health check wait for postgres before starting backend

### `provision.yml` — keep as-is, already provisions Docker + Nginx + certbot

### `ssl.yml` — keep as-is

## 7. Security Hardening

- Add `backend/.env` to `.gitignore`
- Remove `backend/.env` from git tracking (`git rm --cached backend/.env`)
- Add `.env.production` to `.gitignore`
- Ensure Docker build stages don't bake secrets into layers (use `--build-arg` only at final stage)
- Frontend Dockerfile already uses `ARG VITE_API_URL` correctly

## 8. Update `scripts/docker-run.sh`

- Update to use `.env.local` instead of `.env.example`
- Add flag support: `--prod` flag uses `.env.production`

## 9. Cost Optimization Recommendations

### Option A: Current VM Approach (Recommended for now)
- **Azure B1s burstable VM**: ~$7-13/month (1 vCPU, 1GB RAM)
- **Why**: Already architected for this, full control, Docker Compose works as-is
- **Optimization**: 
 - Use B1s (burstable) not B2s — sufficient for 100-500 users
 - Enable Azure Hybrid Benefit (use existing Windows license if available)
 - Use Standard SSD (not Premium SSD) for OS disk
 - Estimated: ~$8-12/month total

### Option B: Azure Container Apps (Cheaper Alternative)
- **Consumption plan**: ~$0 (free tier) to ~$5/month for low traffic
- **Why**: Serverless, scales to zero, no VM management
- **Trade-offs**:
 - Requires rewriting deploy to use `az containerapp` commands
 - No persistent volumes (need Azure Files or external Postgres)
 - Would need to move PostgreSQL to Azure Database for PostgreSQL Flexible Server (~$5/month for Burstable B1ms)
 - **Total estimated: $5-10/month** (cheaper than VM at low traffic)
 - Good option: Container Apps frontend + backend, Azure PostgreSQL Flexible Server B1ms

### Option C: Azure for Students (Free)
- **Azure for Students** provides $100 credit for 12 months
- Can run B1s VM for free for months
- Best for development/testing phase

## Files Changed

| File | Action |
|------|--------|
| `.env.local` | CREATE |
| `.env.production` | CREATE |
| `.env.example` | UPDATE |
| `.env.test` | CREATE |
| `.gitignore` | UPDATE (add backend/.env, .env.production) |
| `docker-compose.prod.yml` | REWRITE (self-contained with postgres) |
| `docker-compose.yml` | UPDATE (reference .env.local, add profiles) |
| `Taskfile.yml` | UPDATE (add env tasks, deploy task, test task) |
| `azure-pipelines.yml` | REWRITE (add test stage, secret injection) |
| `ansible/playbooks/deploy.yml` | UPDATE (fix names, add env-file) |
| `scripts/docker-run.sh` | UPDATE (use .env.local, add --prod flag) |
| `backend/.env` | REMOVE from git tracking |
