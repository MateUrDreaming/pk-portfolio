#!/bin/bash

set -e

echo "Cleaning up test environment..."

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
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

print_info() {
    echo -e "${CYAN}ℹ  $1${NC}"
}

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    print_error "Docker is not running. Some cleanup operations may not work."
else
    print_status "Docker is running"
fi

# Clean up environment variables that might have been set by test scripts
print_info "Resetting environment variables..."
unset NODE_ENV
unset DATABASE_URL
print_status "Environment variables reset"

# Stop and remove test containers
print_info "Stopping test containers..."
if docker-compose down --remove-orphans > /dev/null 2>&1; then
    print_status "Test containers stopped"
else
    print_warning "No containers to stop or docker-compose not found"
fi

# Remove test volumes (optional - uncomment if you want to remove all data)
# print_info "Removing test volumes..."
# if docker volume prune -f > /dev/null 2>&1; then
#     print_status "Test volumes removed"
# else
#     print_warning "Could not remove volumes"
# fi

# Clean up any temporary test files
print_info "Cleaning up temporary files..."
temp_files=(
    "*.test.log"
    "coverage/"
    ".nyc_output/"
    "test-results/"
    "playwright-report/"
)

for pattern in "${temp_files[@]}"; do
    if ls $pattern > /dev/null 2>&1; then
        rm -rf $pattern
        print_status "Removed $pattern"
    fi
done

# Clean up node_modules/.cache if it exists
cache_dir="node_modules/.cache"
if [ -d "$cache_dir" ]; then
    print_info "Cleaning node cache..."
    rm -rf "$cache_dir"
    print_status "Node cache cleaned"
fi

# Reset Prisma client (optional)
print_info "Regenerating Prisma client for development..."
if pnpm db:generate > /dev/null 2>&1; then
    print_status "Prisma client regenerated"
else
    print_warning "Could not regenerate Prisma client - run 'pnpm db:generate' manually if needed"
fi

print_status "Test environment cleanup complete!"

echo ""
print_info "Environment status:"
echo "NODE_ENV: ${NODE_ENV:-unset}"
echo "DATABASE_URL: ${DATABASE_URL:-unset}"
echo ""
print_info "You can now run:"
echo "pnpm run dev           # Start development server"
echo "pnpm db:studio         # Open Prisma Studio"
echo ""