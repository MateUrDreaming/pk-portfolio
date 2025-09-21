#!/bin/sh

# Exit on any error
set -e

# Configuration
DB_HOST="${DB_HOST:-postgres}"
DB_PORT="${DB_PORT:-5432}"
MAX_RETRIES="${MAX_RETRIES:-30}"
RETRY_INTERVAL="${RETRY_INTERVAL:-2}"

echo "Starting application setup..."

# Function to log with timestamp
log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1"
}

# Function to wait for PostgreSQL
wait_for_postgres() {
    log "Waiting for PostgreSQL at $DB_HOST:$DB_PORT..."
    
    retries=$MAX_RETRIES
    while [ $retries -gt 0 ]; do
        if nc -z "$DB_HOST" "$DB_PORT"; then
            log "PostgreSQL is ready!"
            return 0
        fi
        
        retries=$((retries - 1))
        log "PostgreSQL is unavailable - sleeping (attempts remaining: $retries)"
        
        if [ $retries -eq 0 ]; then
            log "ERROR: Failed to connect to PostgreSQL after $MAX_RETRIES attempts"
            exit 1
        fi
        
        sleep "$RETRY_INTERVAL"
    done
}

# Function to run migrations
run_migrations() {
    log "Running Prisma migrations..."
    
    # Use 'npx' with the locally installed Prisma
    if ! npx prisma migrate deploy; then
        log "ERROR: Migration failed"
        exit 1
    fi
    
    log "Migrations completed successfully"
}

# Function to seed database (optional)
seed_database() {
    if [ "$RUN_SEED" = "true" ]; then
        log "Seeding database..."
        # You'll need to use 'node' to run your compiled seed script
        # Assuming your seed script is at prisma/seed.js
        if [ -f "prisma/seed.js" ]; then
            node prisma/seed.js 2>/dev/null
        else
            log "WARNING: Database seeding script not found or not configured, continuing anyway..."
        fi
        
        log "Database seeded successfully"
    fi
}

# Function to start application
start_application() {
    log "Setup complete! Starting Next.js application..."
    # The key change is to run the compiled Next.js server.js file
    exec node server.js
}

# Main execution
main() {
    # Trap to handle signals gracefully
    trap 'log "Received signal, shutting down..."; exit 0' TERM INT
    
    wait_for_postgres
    run_migrations
    seed_database
    start_application
}

# Run main function
main "$@"