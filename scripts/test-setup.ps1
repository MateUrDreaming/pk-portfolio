Write-Host "Setting up test environment..." -ForegroundColor Green

function Write-Success {
    param($Message)
    Write-Host "$Message" -ForegroundColor Green
}

function Write-Warning {
    param($Message)
    Write-Host "$Message" -ForegroundColor Yellow
}

function Write-Error {
    param($Message)
    Write-Host "$Message" -ForegroundColor Red
}

try {
    docker info | Out-Null
    Write-Success "Docker is running"
} catch {
    Write-Error "Docker is not running. Please start Docker Desktop and try again."
    exit 1
}

Write-Host "Starting database..." -ForegroundColor Cyan
docker-compose up -d postgres

Write-Host "Waiting for database to be ready..." -ForegroundColor Cyan
Start-Sleep -Seconds 5

try {
    docker exec nextjs-postgres pg_isready -U postgres | Out-Null
    Write-Success "Database is ready"
} catch {
    Write-Error "Database is not ready. Please check the logs."
    exit 1
}

$env:NODE_ENV = "test"
$env:DATABASE_URL = "postgresql://postgres:password123@localhost:5432/portfolio_db?schema=public"

Write-Host "Generating Prisma client..." -ForegroundColor Cyan
pnpm test:db:generate

Write-Host "Setting up test database schema..." -ForegroundColor Cyan
Write-Warning "Cleaning existing data for fresh test environment..."
pnpm test:db:reset

Write-Host "Seeding test database..." -ForegroundColor Cyan
pnpm test:db:seed

Write-Success "Test environment setup complete!"

Write-Host ""
Write-Host "You can now run tests with:" -ForegroundColor Cyan
Write-Host "pnpm test              # Run integration tests" -ForegroundColor White
Write-Host "pnpm test:e2e          # Run E2E tests" -ForegroundColor White
Write-Host "pnpm test:all          # Run all tests" -ForegroundColor White
Write-Host ""
Write-Host "Additional commands:" -ForegroundColor Cyan
Write-Host "pnpm test:e2e:ui       # Run E2E tests with UI" -ForegroundColor White
Write-Host "pnpm test:e2e:debug    # Debug E2E tests" -ForegroundColor White
Write-Host "pnpm test:coverage     # Run tests with coverage" -ForegroundColor White
Write-Host ""