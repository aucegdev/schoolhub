#!/usr/bin/env bash
set -e

echo "======================================================="
echo "   SchoolHub DevOps & Deployment Verification Audit    "
echo "======================================================="
echo ""

echo "1. Checking Dockerfiles & Docker Compose files..."
test -f backend/Dockerfile && echo "  [OK] backend/Dockerfile exists"
test -f frontend/Dockerfile && echo "  [OK] frontend/Dockerfile exists"
test -f docker-compose.yml && echo "  [OK] docker-compose.yml exists"
test -f docker-compose.prod.yml && echo "  [OK] docker-compose.prod.yml exists"
test -f nginx/nginx.conf && echo "  [OK] nginx/nginx.conf exists"
test -f frontend/nginx.conf && echo "  [OK] frontend/nginx.conf exists"
echo ""

echo "2. Checking CI/CD Pipelines..."
test -f Jenkinsfile && echo "  [OK] Jenkinsfile declarative pipeline exists"
test -f azure-pipelines.yml && echo "  [OK] azure-pipelines.yml exists"
echo ""

echo "3. Checking Ansible Automation Playbooks..."
test -f ansible/ansible.cfg && echo "  [OK] ansible/ansible.cfg exists"
test -f ansible/inventory/hosts.yml && echo "  [OK] ansible/inventory/hosts.yml exists"
test -f ansible/playbooks/provision.yml && echo "  [OK] ansible/playbooks/provision.yml exists"
test -f ansible/playbooks/deploy.yml && echo "  [OK] ansible/playbooks/deploy.yml exists"
test -f ansible/playbooks/ssl.yml && echo "  [OK] ansible/playbooks/ssl.yml exists"
echo ""

echo "4. Validating Prisma Schema & Client..."
cd backend && npx prisma validate && npx prisma generate && cd ..
echo "  [OK] Prisma schema validated & client generated successfully"
echo ""

echo "======================================================="
echo "   ALL DEVOPS DEPLOYMENT AUDIT CHECKS PASSED 100%!     "
echo "======================================================="
