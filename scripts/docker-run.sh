#!/usr/bin/env bash
set -e

echo "======================================================="
echo "   SchoolHub — Single Command Docker Stack Launcher     "
echo "======================================================="
echo ""

# Copy root .env if missing
if [ ! -f .env ]; then
  echo "--> Copying .env.example to .env..."
  cp .env.example .env
fi

echo "--> Building and starting Docker containers..."
docker compose up --build -d

echo ""
echo "======================================================="
echo "   🎉 SchoolHub Services Are Now Live!                "
echo "======================================================="
echo "   • Universal Public Portal: http://localhost:3000"
echo "   • Backend REST API:        http://localhost:4000/api/v1"
echo "   • PgAdmin DB Management:   http://localhost:5050"
echo "======================================================="
