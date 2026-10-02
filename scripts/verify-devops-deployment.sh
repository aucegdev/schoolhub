#!/usr/bin/env bash
# SchoolHub DevOps & Deployment Verification Audit
set -e

PASS=0
FAIL=0

ok() {
echo " [OK] $1"
PASS=$((PASS + 1))
}

fail() {
echo " [FAIL] $1"
FAIL=$((FAIL + 1))
}

check() {
if [ -f "$1" ]; then
ok "$2"
else
fail "$2 — $1 not found"
fi
}

check_contains() {
if grep -q "$1" "$2" 2>/dev/null; then
ok "$3"
else
fail "$3 — '$1' not found in $2"
fi
}

echo "======================================================="
echo " SchoolHub DevOps & Deployment Verification Audit "
echo "======================================================="
echo ""

echo "1. Dockerfiles..."
check backend/Dockerfile "Backend Dockerfile exists"
check frontend/Dockerfile "Frontend Dockerfile exists"
check report-service/Dockerfile "Report service Dockerfile exists"

echo ""
echo "2. Docker Compose..."
check docker-compose.yml "Local compose file exists"
check docker-compose.prod.yml "Production compose file exists"
check_contains "schoolhub-postgres" docker-compose.prod.yml "Prod compose has postgres service"
check_contains "env_file" docker-compose.prod.yml "Prod compose uses env_file"
check_contains "uploads_data" docker-compose.yml "Local compose persists uploads"
check_contains "start:local" docker-compose.yml "Local backend initializes its schema in Docker"
check_contains "prisma migrate deploy" backend/package.json "Production backend applies checked-in migrations"

echo ""
echo "3. Environment files..."
check .env.example "Env template exists"
check .env.production "Production env file exists"
check .env.test "Test env file exists"

echo ""
echo "4. CI/CD Pipelines..."
check azure-pipelines.yml "Azure Pipelines definition exists"
check Jenkinsfile "Jenkinsfile exists"

echo ""
echo "5. Ansible Automation..."
check ansible/ansible.cfg "Ansible config exists"
check ansible/inventory/hosts.yml "Ansible inventory exists"
check ansible/playbooks/provision.yml "Ansible provision playbook exists"
check ansible/playbooks/deploy.yml "Ansible deploy playbook exists"
check ansible/playbooks/ssl.yml "Ansible SSL playbook exists"

echo ""
echo "6. Nginx..."
check nginx/nginx.conf "Reverse proxy nginx config exists"
check frontend/nginx.conf "Frontend SPA nginx config exists"

echo ""
echo "7. Task Runner..."
check Taskfile.yml "Taskfile.yml exists"
check task.yml "task.yml exists"
check_contains "env:setup" Taskfile.yml "Taskfile has env:setup task"
check_contains "env:check" Taskfile.yml "Taskfile has env:check task"
check_contains "deploy:azure" Taskfile.yml "Taskfile has deploy:azure task"

echo ""
echo "8. Prisma..."
if docker compose run --rm --no-deps --entrypoint npx backend prisma validate 2>/dev/null; then
ok "Prisma schema validated"
else
fail "Prisma schema validation failed"
fi
if docker compose run --rm --no-deps --entrypoint npx backend prisma generate 2>/dev/null; then
ok "Prisma client generated"
else
fail "Prisma client generation failed"
fi

echo ""
echo "9. Security checks..."
if grep -q "backend/.env" .gitignore 2>/dev/null; then
ok "backend/.env in .gitignore"
else
fail "backend/.env NOT in .gitignore"
fi
if grep -q ".env.production" .gitignore 2>/dev/null; then
ok ".env.production in .gitignore"
else
fail ".env.production NOT in .gitignore"
fi
if grep -q "FIREBASE_PRIVATE_KEY" .env.production 2>/dev/null; then
echo " [INFO] .env.production has FIREBASE_PRIVATE_KEY (ensure it is not committed)"
else
echo " [WARN] .env.production may be missing Firebase key"
fi

echo ""
echo "10. Container name consistency..."
check_contains "schoolhub-postgres" docker-compose.prod.yml "Postgres container name matches"
check_contains "schoolhub-backend" docker-compose.prod.yml "Backend container name matches"
check_contains "schoolhub-backend" ansible/playbooks/deploy.yml "Ansible references correct backend name"
check_contains "schoolhub-postgres" ansible/playbooks/deploy.yml "Ansible references correct postgres name"

echo ""
echo "======================================================="
echo " Results: $PASS passed, $FAIL failed "
echo "======================================================="

if [ "$FAIL" -eq 0 ]; then
echo " ALL CHECKS PASSED!"
exit 0
else
echo " Some checks failed. Review the output above."
exit 1
fi
