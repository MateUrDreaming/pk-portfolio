Write-Host "Cleaning up test environment..." -ForegroundColor Green

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

function Write-Info {
    param($Message)
    Write-Host "ℹ$Message" -ForegroundColor Cyan
}

try {
    docker info | Out-Null
    Write-Success "Docker is running"
} catch {
    Write-Error "Docker is not running. Some cleanup operations may not work."
}

Write-Info "Resetting environment variables..."
$env:NODE_ENV = $null
$env:DATABASE_URL = $null
Write-Success "Environment variables reset"

Write-Info "Stopping test containers..."
try {
    docker-compose down --remove-orphans 2>$null
    Write-Success "Test containers stopped"
} catch {
    Write-Warning "No containers to stop or docker-compose not found"
}

# Remove test volumes (optional - uncomment if you want to remove all data)
# Write-Info "Removing test volumes..."
# try {
#     docker volume prune -f 2>$null
#     Write-Success "Test volumes removed"
# } catch {
#     Write-Warning "Could not remove volumes"
# }

# Clean up any temporary test files
Write-Info "Cleaning up temporary files..."
$tempFiles = @(
    "*.test.log",
    "coverage/",
    ".nyc_output/",
    "test-results/",
    "playwright-report/"
)

foreach ($pattern in $tempFiles) {
    if (Test-Path $pattern) {
        Remove-Item $pattern -Recurse -Force -ErrorAction SilentlyContinue
        Write-Success "Removed $pattern"
    }
}

# Clean up node_modules/.cache if it exists
$cacheDir = "node_modules/.cache"
if (Test-Path $cacheDir) {
    Write-Info "Cleaning node cache..."
    Remove-Item $cacheDir -Recurse -Force -ErrorAction SilentlyContinue
    Write-Success "Node cache cleaned"
}

# Reset Prisma client (optional)
Write-Info "Regenerating Prisma client for development..."
try {
    pnpm db:generate 2>$null
    Write-Success "Prisma client regenerated"
} catch {
    Write-Warning "Could not regenerate Prisma client - run 'pnpm db:generate' manually if needed"
}

Write-Success "Test environment cleanup complete!"

Write-Host ""
Write-Host "Environment status:" -ForegroundColor Cyan
Write-Host "NODE_ENV: $($env:NODE_ENV ?? 'unset')" -ForegroundColor White
Write-Host "DATABASE_URL: $($env:DATABASE_URL ?? 'unset')" -ForegroundColor White
Write-Host ""
Write-Host "You can now run:" -ForegroundColor Cyan
Write-Host "pnpm run dev           # Start development server" -ForegroundColor White
Write-Host "pnpm db:studio         # Open Prisma Studio" -ForegroundColor White
Write-Host ""