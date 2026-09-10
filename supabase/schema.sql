-- ScratchCrest schema for Supabase (PostgreSQL public schema).
-- Matches instructions/02_DATABASE_SCHEMA.md and prisma/schema.prisma.
--
-- How to run:
--   1. Supabase Dashboard → SQL Editor → New query
--   2. Paste this file and Run
--   3. Or from the repo: npx prisma migrate deploy  (uses DIRECT_URL)
--
-- Do not enable Row Level Security on these tables while Prisma connects
-- as the database user (postgres / connection string). RLS would block
-- the app unless you also add policies. Auth is NextAuth, not Supabase Auth.

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Enums
CREATE TYPE "SubscriptionStatus" AS ENUM ('active', 'past_due', 'canceled', 'trialing');
CREATE TYPE "UserRole" AS ENUM ('tenant_owner', 'location_manager', 'cashier');
CREATE TYPE "PackStatus" AS ENUM ('received', 'activated', 'closed');
CREATE TYPE "TicketStatus" AS ENUM ('in_stock', 'sold');
CREATE TYPE "DisplayLayout" AS ENUM ('landscape', 'portrait');

-- plans (platform-level)
CREATE TABLE "plans" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "price_monthly_cents" INTEGER NOT NULL,
    "price_annual_cents" INTEGER NOT NULL,
    "stripe_price_id_monthly" TEXT NOT NULL,
    "stripe_price_id_annual" TEXT NOT NULL,
    "features" JSONB NOT NULL,
    "active" BOOLEAN NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "plans_pkey" PRIMARY KEY ("id")
);

-- tenants
CREATE TABLE "tenants" (
    "id" UUID NOT NULL,
    "business_name" TEXT NOT NULL,
    "owner_name" TEXT NOT NULL,
    "owner_email" TEXT NOT NULL,
    "owner_phone" TEXT NOT NULL,
    "stripe_customer_id" TEXT NOT NULL,
    "artwork_license_approved" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "tenants_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "tenants_owner_email_key" ON "tenants"("owner_email");

-- subscriptions
CREATE TABLE "subscriptions" (
    "id" UUID NOT NULL,
    "tenant_id" UUID NOT NULL,
    "plan_id" UUID NOT NULL,
    "stripe_subscription_id" TEXT NOT NULL,
    "status" "SubscriptionStatus" NOT NULL,
    "current_period_end" TIMESTAMPTZ(6) NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "subscriptions_pkey" PRIMARY KEY ("id")
);

-- users
CREATE TABLE "users" (
    "id" UUID NOT NULL,
    "tenant_id" UUID NOT NULL,
    "email" TEXT NOT NULL,
    "password_hash" TEXT,
    "name" TEXT NOT NULL,
    "role" "UserRole" NOT NULL,
    "password_set_token" TEXT,
    "password_set_token_expires" TIMESTAMPTZ(6),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- locations
CREATE TABLE "locations" (
    "id" UUID NOT NULL,
    "tenant_id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL DEFAULT 'TX',
    "zip" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "locations_pkey" PRIMARY KEY ("id")
);

-- user_locations (managers/cashiers only; tenant_owner has implicit access)
CREATE TABLE "user_locations" (
    "user_id" UUID NOT NULL,
    "location_id" UUID NOT NULL,
    CONSTRAINT "user_locations_pkey" PRIMARY KEY ("user_id", "location_id")
);

-- games (global reference data)
CREATE TABLE "games" (
    "id" UUID NOT NULL,
    "game_number" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "price_cents" INTEGER NOT NULL,
    "tickets_per_pack" INTEGER NOT NULL,
    "active" BOOLEAN NOT NULL,
    "prizes_remaining_data" JSONB,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,
    CONSTRAINT "games_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "games_game_number_key" ON "games"("game_number");

-- packs
CREATE TABLE "packs" (
    "id" UUID NOT NULL,
    "tenant_id" UUID NOT NULL,
    "location_id" UUID NOT NULL,
    "game_id" UUID NOT NULL,
    "pack_number" TEXT NOT NULL,
    "ticket_count" INTEGER NOT NULL,
    "status" "PackStatus" NOT NULL,
    "received_at" TIMESTAMPTZ(6) NOT NULL,
    "activated_at" TIMESTAMPTZ(6),
    "closed_at" TIMESTAMPTZ(6),
    CONSTRAINT "packs_pkey" PRIMARY KEY ("id")
);

-- tickets
CREATE TABLE "tickets" (
    "id" UUID NOT NULL,
    "pack_id" UUID NOT NULL,
    "ticket_number" INTEGER NOT NULL,
    "barcode_value" TEXT NOT NULL,
    "status" "TicketStatus" NOT NULL,
    "sold_at" TIMESTAMPTZ(6),
    "sold_by_user_id" UUID,
    CONSTRAINT "tickets_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "tickets_barcode_value_key" ON "tickets"("barcode_value");

-- sales (reporting source of truth)
CREATE TABLE "sales" (
    "id" UUID NOT NULL,
    "tenant_id" UUID NOT NULL,
    "location_id" UUID NOT NULL,
    "ticket_id" UUID NOT NULL,
    "game_id" UUID NOT NULL,
    "price_cents" INTEGER NOT NULL,
    "commission_rate" DECIMAL NOT NULL,
    "commission_earned_cents" INTEGER NOT NULL,
    "sold_by_user_id" UUID NOT NULL,
    "sold_at" TIMESTAMPTZ(6) NOT NULL,
    CONSTRAINT "sales_pkey" PRIMARY KEY ("id")
);

-- prize_payouts
CREATE TABLE "prize_payouts" (
    "id" UUID NOT NULL,
    "tenant_id" UUID NOT NULL,
    "location_id" UUID NOT NULL,
    "ticket_id" UUID,
    "amount_paid_cents" INTEGER NOT NULL,
    "cashing_bonus_rate" DECIMAL NOT NULL,
    "cashing_bonus_earned_cents" INTEGER NOT NULL,
    "paid_by_user_id" UUID NOT NULL,
    "paid_at" TIMESTAMPTZ(6) NOT NULL,
    CONSTRAINT "prize_payouts_pkey" PRIMARY KEY ("id")
);

-- settings (one row per tenant)
CREATE TABLE "settings" (
    "tenant_id" UUID NOT NULL,
    "commission_rate" DECIMAL NOT NULL DEFAULT 0.05,
    "cashing_bonus_rate" DECIMAL NOT NULL DEFAULT 0,
    "low_stock_threshold" INTEGER NOT NULL DEFAULT 10,
    CONSTRAINT "settings_pkey" PRIMARY KEY ("tenant_id")
);

-- display_configs
CREATE TABLE "display_configs" (
    "id" UUID NOT NULL,
    "location_id" UUID NOT NULL,
    "layout" "DisplayLayout" NOT NULL,
    "theme" TEXT NOT NULL,
    "bin_assignments" JSONB NOT NULL,
    "show_winners" BOOLEAN NOT NULL DEFAULT true,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,
    CONSTRAINT "display_configs_pkey" PRIMARY KEY ("id")
);

-- Foreign keys
ALTER TABLE "subscriptions"
  ADD CONSTRAINT "subscriptions_tenant_id_fkey"
  FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "subscriptions"
  ADD CONSTRAINT "subscriptions_plan_id_fkey"
  FOREIGN KEY ("plan_id") REFERENCES "plans"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "users"
  ADD CONSTRAINT "users_tenant_id_fkey"
  FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "locations"
  ADD CONSTRAINT "locations_tenant_id_fkey"
  FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "user_locations"
  ADD CONSTRAINT "user_locations_user_id_fkey"
  FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "user_locations"
  ADD CONSTRAINT "user_locations_location_id_fkey"
  FOREIGN KEY ("location_id") REFERENCES "locations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "packs"
  ADD CONSTRAINT "packs_tenant_id_fkey"
  FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "packs"
  ADD CONSTRAINT "packs_location_id_fkey"
  FOREIGN KEY ("location_id") REFERENCES "locations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "packs"
  ADD CONSTRAINT "packs_game_id_fkey"
  FOREIGN KEY ("game_id") REFERENCES "games"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "tickets"
  ADD CONSTRAINT "tickets_pack_id_fkey"
  FOREIGN KEY ("pack_id") REFERENCES "packs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "tickets"
  ADD CONSTRAINT "tickets_sold_by_user_id_fkey"
  FOREIGN KEY ("sold_by_user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "sales"
  ADD CONSTRAINT "sales_tenant_id_fkey"
  FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "sales"
  ADD CONSTRAINT "sales_location_id_fkey"
  FOREIGN KEY ("location_id") REFERENCES "locations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "sales"
  ADD CONSTRAINT "sales_ticket_id_fkey"
  FOREIGN KEY ("ticket_id") REFERENCES "tickets"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "sales"
  ADD CONSTRAINT "sales_game_id_fkey"
  FOREIGN KEY ("game_id") REFERENCES "games"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "sales"
  ADD CONSTRAINT "sales_sold_by_user_id_fkey"
  FOREIGN KEY ("sold_by_user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "prize_payouts"
  ADD CONSTRAINT "prize_payouts_tenant_id_fkey"
  FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "prize_payouts"
  ADD CONSTRAINT "prize_payouts_location_id_fkey"
  FOREIGN KEY ("location_id") REFERENCES "locations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "prize_payouts"
  ADD CONSTRAINT "prize_payouts_ticket_id_fkey"
  FOREIGN KEY ("ticket_id") REFERENCES "tickets"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "prize_payouts"
  ADD CONSTRAINT "prize_payouts_paid_by_user_id_fkey"
  FOREIGN KEY ("paid_by_user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "settings"
  ADD CONSTRAINT "settings_tenant_id_fkey"
  FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "display_configs"
  ADD CONSTRAINT "display_configs_location_id_fkey"
  FOREIGN KEY ("location_id") REFERENCES "locations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
