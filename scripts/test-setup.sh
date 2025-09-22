#!/bin/bash

set -e

echo "Setting up test environment..."

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' 

print_status() {
    echo -e "${GREEN} $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}  $1${NC}"
}

print_error() {
    echo -e "${RED} $1${NC}"
}

if ! docker info > /dev/null 2>&1; then
    print_error "Docker is not running. Please start Docker and try again."
    exit 1
fi

print_status "Docker is running"

echo "Starting database..."
docker-compose up -d postgres

echo "Waiting for database to be ready..."
sleep 5

if ! docker exec nextjs-postgres pg_isready -U postgres > /dev/null 2>&1; then
    print_error "Database is not ready. Please check the logs."
    exit 1
fi

print_status "Database is ready"

export NODE_ENV=test
export DATABASE_URL="postgresql://postgres:password123@localhost:5432/portfolio_db?schema=public"

echo "Generating Prisma client..."
pnpm test:db:generate

echo "Setting up test database schema..."
print_warning "Cleaning existing data for fresh test environment..."
pnpm test:db:reset

echo "Seeding test database..."
pnpm test:db:seed

print_status "Test environment setup complete!"

echo ""
echo "You can now run tests with:"
echo "pnpm test              # Run integration tests"
echo "pnpm test:e2e          # Run E2E tests"
echo "pnpm test:all          # Run all tests"
echo ""
echo "Additional commands:"
echo "pnpm test:e2e:ui       # Run E2E tests with UI"
echo "pnpm test:e2e:debug    # Debug E2E tests"
echo "pnpm test:coverage     # Run tests with coverage"
echo ""