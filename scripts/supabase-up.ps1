# Apply Prisma migrations + seed against the Supabase database in .env
$ErrorActionPreference = "Stop"
Set-Location (Split-Path -Parent $PSScriptRoot)

if (-not (Test-Path ".env")) {
  Write-Error "Create .env from .env.example and paste your Supabase DATABASE_URL and DIRECT_URL first."
}

npx prisma generate
npx prisma migrate deploy
npx prisma db seed
Write-Host "Supabase schema migrated and seeded."
