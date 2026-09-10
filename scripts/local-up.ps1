# One-shot local Postgres + migrate + seed + dev server.
# Uses docker-compose.yml (postgres/postgres @ scratchcrest on 5432).
$ErrorActionPreference = "Stop"
Set-Location (Split-Path -Parent $PSScriptRoot)

docker compose up -d
docker compose exec -T postgres pg_isready -U postgres -d scratchcrest
npx prisma generate
npx prisma migrate deploy
npx prisma db seed
npm run dev
