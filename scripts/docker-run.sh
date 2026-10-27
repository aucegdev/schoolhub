#!/usr/bin/env bash
set -e

echo "======================================================="
echo " SchoolHub — Single Command Docker Stack Launcher "
echo "======================================================="
echo ""

ENV_FILE=".env.local"

echo " [CONTAINERIZED LOCAL MODE]"
echo ""
if [ ! -f "$ENV_FILE" ]; then
 echo "--> Setting up .env.local from template..."
 cp .env.example .env.local
 echo " [OK] .env.local created. Configure it before production use."
fi

echo "--> Building and starting Docker containers (env: $ENV_FILE)..."
docker compose --env-file "$ENV_FILE" up --build -d --remove-orphans

echo ""
echo "======================================================="
echo " SchoolHub Containers Are Starting! "
echo "======================================================="
echo " Application: http://localhost:${HTTP_PORT:-3000}"
echo " API: http://localhost:${HTTP_PORT:-3000}/api/v1"
echo " Health: http://localhost:${HTTP_PORT:-3000}/api/v1/health"
echo " PgAdmin: http://localhost:5050 (local with --profile tools)"
echo "======================================================="
echo ""
echo " View logs: docker compose logs -f"
echo " Stop: docker compose down"
echo ""
