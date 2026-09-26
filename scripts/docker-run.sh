#!/usr/bin/env bash
set -e

echo "======================================================="
echo " SchoolHub — Single Command Docker Stack Launcher "
echo "======================================================="
echo ""

# Default to local environment
ENV_FILE=".env.local"

# Check for --prod flag
if [ "$1" == "--prod" ] || [ "$1" == "-p" ]; then
 ENV_FILE=".env.production"
 echo " [PRODUCTION MODE]"
 echo ""
 # Verify production env exists
 if [ ! -f "$ENV_FILE" ]; then
 echo " [ERROR] .env.production not found!"
 echo " Create it from .env.example: cp .env.example .env.production"
 echo " Then fill in production secrets."
 exit 1
 fi
else
 echo " [LOCAL DEV MODE]"
 echo ""
 # Verify local env exists
 if [ ! -f "$ENV_FILE" ]; then
 echo "--> Setting up .env.local from template..."
 cp .env.example .env.local
 echo " [OK] .env.local created. Edit it with your values if needed."
 fi
fi

echo "--> Building and starting Docker containers (env: $ENV_FILE)..."
docker compose --env-file "$ENV_FILE" up --build -d

echo ""
echo "======================================================="
echo " SchoolHub Services Are Now Live! "
echo "======================================================="
echo " Frontend: http://localhost:3000"
echo " Backend: http://localhost:4000/api/v1"
echo " Health: http://localhost:4000/api/v1/health"
echo " PgAdmin: http://localhost:5050 (local with --profile tools)"
echo "======================================================="
echo ""
echo " View logs: docker compose logs -f"
echo " Stop: docker compose down"
echo ""
