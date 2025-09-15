#!/bin/sh

echo "Starting application setup..."

# Wait for PostgreSQL to be ready
echo "Waiting for PostgreSQL to be ready..."
while ! nc -z postgres 5432; do
  echo "PostgreSQL is unavailable - sleeping"
  sleep 2
done
echo "PostgreSQL is ready!"

# Ensure Prisma client is generated for the correct platform
echo "Generating Prisma client..."
pnpm prisma generate

# Run database migrations
echo "Running Prisma migrations..."
pnpm prisma migrate deploy

# Optional: Seed the database
# echo "Seeding database..."
# pnpm prisma db seed

echo "Setup complete! Starting the application..."

# Start the application
exec pnpm start