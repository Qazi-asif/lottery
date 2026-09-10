-- CreateEnum
CREATE TYPE "ShiftStatus" AS ENUM ('open', 'closed');

-- CreateEnum
CREATE TYPE "ReferralStatus" AS ENUM ('pending', 'completed');

-- AlterTable
ALTER TABLE "tenants" ADD COLUMN "referral_code" TEXT;
CREATE UNIQUE INDEX "tenants_referral_code_key" ON "tenants"("referral_code");

UPDATE "tenants"
SET "referral_code" = substr(replace(id::text, '-', ''), 1, 8)
WHERE "referral_code" IS NULL;

-- AlterTable
ALTER TABLE "games" ADD COLUMN "official_close_at" TIMESTAMPTZ(6);

-- AlterTable
ALTER TABLE "display_configs" ADD COLUMN "language" TEXT NOT NULL DEFAULT 'en';

-- CreateTable
CREATE TABLE "shift_reconciliations" (
    "id" UUID NOT NULL,
    "tenant_id" UUID NOT NULL,
    "location_id" UUID NOT NULL,
    "opened_by_user_id" UUID NOT NULL,
    "closed_by_user_id" UUID,
    "opened_at" TIMESTAMPTZ(6) NOT NULL,
    "closed_at" TIMESTAMPTZ(6),
    "expected_cents" INTEGER NOT NULL DEFAULT 0,
    "actual_cents" INTEGER,
    "variance_cents" INTEGER,
    "status" "ShiftStatus" NOT NULL,

    CONSTRAINT "shift_reconciliations_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "pack_transfers" (
    "id" UUID NOT NULL,
    "tenant_id" UUID NOT NULL,
    "pack_id" UUID NOT NULL,
    "from_location_id" UUID NOT NULL,
    "to_location_id" UUID NOT NULL,
    "transferred_by_user_id" UUID NOT NULL,
    "transferred_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "pack_transfers_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "referrals" (
    "id" UUID NOT NULL,
    "tenant_id" UUID NOT NULL,
    "referred_email" TEXT NOT NULL,
    "referred_tenant_id" UUID,
    "credit_cents" INTEGER NOT NULL DEFAULT 5000,
    "status" "ReferralStatus" NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "referrals_pkey" PRIMARY KEY ("id")
);

ALTER TABLE "shift_reconciliations" ADD CONSTRAINT "shift_reconciliations_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "shift_reconciliations" ADD CONSTRAINT "shift_reconciliations_location_id_fkey" FOREIGN KEY ("location_id") REFERENCES "locations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "shift_reconciliations" ADD CONSTRAINT "shift_reconciliations_opened_by_user_id_fkey" FOREIGN KEY ("opened_by_user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "shift_reconciliations" ADD CONSTRAINT "shift_reconciliations_closed_by_user_id_fkey" FOREIGN KEY ("closed_by_user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "pack_transfers" ADD CONSTRAINT "pack_transfers_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "pack_transfers" ADD CONSTRAINT "pack_transfers_pack_id_fkey" FOREIGN KEY ("pack_id") REFERENCES "packs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "pack_transfers" ADD CONSTRAINT "pack_transfers_from_location_id_fkey" FOREIGN KEY ("from_location_id") REFERENCES "locations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "pack_transfers" ADD CONSTRAINT "pack_transfers_to_location_id_fkey" FOREIGN KEY ("to_location_id") REFERENCES "locations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "pack_transfers" ADD CONSTRAINT "pack_transfers_transferred_by_user_id_fkey" FOREIGN KEY ("transferred_by_user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "referrals" ADD CONSTRAINT "referrals_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "referrals" ADD CONSTRAINT "referrals_referred_tenant_id_fkey" FOREIGN KEY ("referred_tenant_id") REFERENCES "tenants"("id") ON DELETE SET NULL ON UPDATE CASCADE;
