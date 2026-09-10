import { PrismaClient, type Prisma } from "@prisma/client";
import bcrypt from "bcryptjs";
import { ticketBarcodeValue } from "../lib/barcode";
import { createReferralCode } from "../lib/referral-code";

const prisma = new PrismaClient();

type PlanSeed = {
  name: string;
  priceMonthlyCents: number;
  priceAnnualCents: number;
  stripePriceIdMonthly: string;
  stripePriceIdAnnual: string;
  features: Prisma.InputJsonValue;
};

/**
 * Seed data for the four plan tiers defined in instructions/02_DATABASE_SCHEMA.md.
 * Stripe price IDs are placeholders — replace with real Stripe Price IDs in Stage 3.
 */
const PLANS: PlanSeed[] = [
  {
    name: "Lite",
    priceMonthlyCents: 4900,
    priceAnnualCents: 47000,
    stripePriceIdMonthly: "price_lite_monthly",
    stripePriceIdAnnual: "price_lite_annual",
    features: {
      inventory: true,
      display: false,
      multi_location: false,
      commission_reports: false,
      alerts: true,
      cash_reconciliation: false,
      pack_transfer: false,
      referrals: false,
    },
  },
  {
    name: "Essential",
    priceMonthlyCents: 9900,
    priceAnnualCents: 95000,
    stripePriceIdMonthly: "price_essential_monthly",
    stripePriceIdAnnual: "price_essential_annual",
    features: {
      inventory: true,
      display: false,
      multi_location: false,
      commission_reports: true,
      alerts: true,
      cash_reconciliation: false,
      pack_transfer: false,
      referrals: true,
    },
  },
  {
    name: "Smart",
    priceMonthlyCents: 17900,
    priceAnnualCents: 171000,
    stripePriceIdMonthly: "price_smart_monthly",
    stripePriceIdAnnual: "price_smart_annual",
    features: {
      inventory: true,
      display: true,
      multi_location: true,
      commission_reports: true,
      alerts: true,
      cash_reconciliation: true,
      pack_transfer: true,
      referrals: true,
    },
  },
  {
    name: "Premium",
    priceMonthlyCents: 29900,
    priceAnnualCents: 287000,
    stripePriceIdMonthly: "price_premium_monthly",
    stripePriceIdAnnual: "price_premium_annual",
    features: {
      inventory: true,
      display: true,
      multi_location: true,
      commission_reports: true,
      alerts: true,
      cash_reconciliation: true,
      pack_transfer: true,
      referrals: true,
    },
  },
];

async function main() {
  for (const plan of PLANS) {
    const existing = await prisma.plan.findFirst({
      where: { name: plan.name },
    });

    if (existing) {
      await prisma.plan.update({
        where: { id: existing.id },
        data: {
          priceMonthlyCents: plan.priceMonthlyCents,
          priceAnnualCents: plan.priceAnnualCents,
          stripePriceIdMonthly: plan.stripePriceIdMonthly,
          stripePriceIdAnnual: plan.stripePriceIdAnnual,
          features: plan.features,
          active: true,
        },
      });
    } else {
      await prisma.plan.create({
        data: {
          name: plan.name,
          priceMonthlyCents: plan.priceMonthlyCents,
          priceAnnualCents: plan.priceAnnualCents,
          stripePriceIdMonthly: plan.stripePriceIdMonthly,
          stripePriceIdAnnual: plan.stripePriceIdAnnual,
          features: plan.features,
          active: true,
        },
      });
    }
  }

  console.log(`Seeded ${PLANS.length} plans: ${PLANS.map((p) => p.name).join(", ")}`);

  const GAMES = [
    {
      gameNumber: "SC-1001",
      name: "Morning Cash",
      priceCents: 100,
      ticketsPerPack: 150,
      officialCloseAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    },
    { gameNumber: "SC-1002", name: "Corner Store Classic", priceCents: 200, ticketsPerPack: 150 },
    { gameNumber: "SC-1005", name: "Five Spot", priceCents: 500, ticketsPerPack: 75 },
    { gameNumber: "SC-1010", name: "Ten Trail", priceCents: 1000, ticketsPerPack: 50 },
    { gameNumber: "SC-1020", name: "Double Stack", priceCents: 2000, ticketsPerPack: 30 },
    { gameNumber: "SC-1025", name: "Silver Seal", priceCents: 2500, ticketsPerPack: 30 },
    { gameNumber: "SC-1030", name: "Crest 30", priceCents: 3000, ticketsPerPack: 25 },
    { gameNumber: "SC-1050", name: "High Counter", priceCents: 5000, ticketsPerPack: 20 },
  ];

  for (const game of GAMES) {
    const existing = await prisma.game.findUnique({
      where: { gameNumber: game.gameNumber },
    });
    if (existing) {
      await prisma.game.update({
        where: { id: existing.id },
        data: { ...game, active: true },
      });
    } else {
      await prisma.game.create({ data: { ...game, active: true } });
    }
  }
  console.log(`Seeded ${GAMES.length} sample games`);
  await ensureDemoDashboard();
}

const DEMO_PASSWORD = "demo-password";

async function ensureLocation(
  tenantId: string,
  name: string,
  address: string,
  zip: string,
) {
  const existing = await prisma.location.findFirst({
    where: { tenantId, name },
  });
  if (existing) {
    return prisma.location.update({
      where: { id: existing.id },
      data: { address, city: "Austin", state: "TX", zip, active: true },
    });
  }
  return prisma.location.create({
    data: {
      tenantId,
      name,
      address,
      city: "Austin",
      state: "TX",
      zip,
      active: true,
    },
  });
}

async function ensureUser(options: {
  tenantId: string;
  email: string;
  name: string;
  role: "tenant_owner" | "location_manager" | "cashier";
  passwordHash: string;
  locationIds: string[];
}) {
  const existing = await prisma.user.findUnique({ where: { email: options.email } });
  const user = existing
    ? await prisma.user.update({
        where: { id: existing.id },
        data: {
          name: options.name,
          role: options.role,
          passwordHash: options.passwordHash,
          tenantId: options.tenantId,
        },
      })
    : await prisma.user.create({
        data: {
          tenantId: options.tenantId,
          email: options.email,
          name: options.name,
          role: options.role,
          passwordHash: options.passwordHash,
        },
      });

  if (options.role !== "tenant_owner") {
    await prisma.userLocation.deleteMany({ where: { userId: user.id } });
    if (options.locationIds.length > 0) {
      await prisma.userLocation.createMany({
        data: options.locationIds.map((locationId) => ({
          userId: user.id,
          locationId,
        })),
        skipDuplicates: true,
      });
    }
  }
  return user;
}

async function ensureActivatedPack(options: {
  tenantId: string;
  locationId: string;
  gameId: string;
  gameNumber: string;
  packNumber: string;
  ticketCount: number;
}) {
  const existing = await prisma.pack.findFirst({
    where: {
      tenantId: options.tenantId,
      packNumber: options.packNumber,
    },
  });
  if (existing) return existing;

  const now = new Date();
  const pack = await prisma.pack.create({
    data: {
      tenantId: options.tenantId,
      locationId: options.locationId,
      gameId: options.gameId,
      packNumber: options.packNumber,
      ticketCount: options.ticketCount,
      status: "activated",
      receivedAt: now,
      activatedAt: now,
    },
  });
  await prisma.ticket.createMany({
    data: Array.from({ length: options.ticketCount }, (_, index) => {
      const ticketNumber = index + 1;
      return {
        packId: pack.id,
        ticketNumber,
        barcodeValue: ticketBarcodeValue(
          options.gameNumber,
          options.packNumber,
          ticketNumber,
        ),
        status: "in_stock" as const,
      };
    }),
  });
  return pack;
}

async function sellTickets(options: {
  tenantId: string;
  locationId: string;
  packId: string;
  gameId: string;
  priceCents: number;
  soldByUserId: string;
  count: number;
  daysAgoMax: number;
}) {
  const tickets = await prisma.ticket.findMany({
    where: { packId: options.packId, status: "in_stock" },
    orderBy: { ticketNumber: "asc" },
    take: options.count,
  });
  const commissionRate = 0.05;
  for (const [index, ticket] of tickets.entries()) {
    const soldAt = new Date(
      Date.now() - Math.round((options.daysAgoMax * (index + 1) * 3600 * 1000) / options.count),
    );
    await prisma.ticket.update({
      where: { id: ticket.id },
      data: {
        status: "sold",
        soldAt,
        soldByUserId: options.soldByUserId,
      },
    });
    await prisma.sale.create({
      data: {
        tenantId: options.tenantId,
        locationId: options.locationId,
        ticketId: ticket.id,
        gameId: options.gameId,
        priceCents: options.priceCents,
        commissionRate,
        commissionEarnedCents: Math.round(options.priceCents * commissionRate),
        soldByUserId: options.soldByUserId,
        soldAt,
      },
    });
  }
  const remaining = await prisma.ticket.count({
    where: { packId: options.packId, status: "in_stock" },
  });
  if (remaining === 0) {
    await prisma.pack.update({
      where: { id: options.packId },
      data: { status: "closed", closedAt: new Date() },
    });
  }
}

async function ensureDemoDashboard() {
  const passwordHash = await bcrypt.hash(DEMO_PASSWORD, 12);
  const smart = await prisma.plan.findFirst({ where: { name: "Smart" } });
  if (!smart) return;

  let owner = await prisma.user.findUnique({
    where: { email: "owner@scratchcrest.local" },
  });
  let tenantId = owner?.tenantId;

  if (!tenantId) {
    const tenant = await prisma.tenant.create({
      data: {
        businessName: "Demo Retailer",
        ownerName: "Demo Owner",
        ownerEmail: "owner@scratchcrest.local",
        ownerPhone: "5125550100",
        stripeCustomerId: "cus_demo",
        referralCode: createReferralCode(),
      },
    });
    tenantId = tenant.id;
    await prisma.subscription.create({
      data: {
        tenantId,
        planId: smart.id,
        stripeSubscriptionId: "sub_demo",
        status: "active",
        currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      },
    });
  } else {
    const tenant = await prisma.tenant.findUnique({ where: { id: tenantId } });
    if (tenant && !tenant.referralCode) {
      await prisma.tenant.update({
        where: { id: tenantId },
        data: { referralCode: createReferralCode() },
      });
    }
  }

  await prisma.settings.upsert({
    where: { tenantId },
    create: { tenantId, lowStockThreshold: 10, commissionRate: 0.05 },
    update: { lowStockThreshold: 10 },
  });

  const main = await ensureLocation(tenantId, "Main store", "100 Demo St", "78701");
  const north = await ensureLocation(tenantId, "North store", "500 Airport Blvd", "78753");

  owner = await ensureUser({
    tenantId,
    email: "owner@scratchcrest.local",
    name: "Demo Owner",
    role: "tenant_owner",
    passwordHash,
    locationIds: [],
  });
  const manager = await ensureUser({
    tenantId,
    email: "manager@scratchcrest.local",
    name: "Alex Manager",
    role: "location_manager",
    passwordHash,
    locationIds: [main.id, north.id],
  });
  const cashier = await ensureUser({
    tenantId,
    email: "cashier@scratchcrest.local",
    name: "Casey Cashier",
    role: "cashier",
    passwordHash,
    locationIds: [main.id],
  });

  const games = await prisma.game.findMany();
  const byNumber = new Map(games.map((game) => [game.gameNumber, game]));
  const morning = byNumber.get("SC-1001");
  const classic = byNumber.get("SC-1002");
  const fiveSpot = byNumber.get("SC-1005");
  const high = byNumber.get("SC-1050");
  if (!morning || !classic || !fiveSpot || !high) return;

  const received = await prisma.pack.findFirst({
    where: { tenantId, packNumber: "RECV01" },
  });
  if (!received) {
    await prisma.pack.create({
      data: {
        tenantId,
        locationId: main.id,
        gameId: classic.id,
        packNumber: "RECV01",
        ticketCount: classic.ticketsPerPack,
        status: "received",
        receivedAt: new Date(),
      },
    });
  }

  const morningPack = await ensureActivatedPack({
    tenantId,
    locationId: main.id,
    gameId: morning.id,
    gameNumber: morning.gameNumber,
    packNumber: "MAIN01",
    ticketCount: morning.ticketsPerPack,
  });
  const highPack = await ensureActivatedPack({
    tenantId,
    locationId: main.id,
    gameId: high.id,
    gameNumber: high.gameNumber,
    packNumber: "MAIN50",
    ticketCount: high.ticketsPerPack,
  });
  const northPack = await ensureActivatedPack({
    tenantId,
    locationId: north.id,
    gameId: fiveSpot.id,
    gameNumber: fiveSpot.gameNumber,
    packNumber: "NRTH05",
    ticketCount: fiveSpot.ticketsPerPack,
  });

  const saleCount = await prisma.sale.count({ where: { tenantId } });
  if (saleCount === 0) {
    await sellTickets({
      tenantId,
      locationId: main.id,
      packId: morningPack.id,
      gameId: morning.id,
      priceCents: morning.priceCents,
      soldByUserId: cashier.id,
      count: 60,
      daysAgoMax: 6,
    });
    await sellTickets({
      tenantId,
      locationId: main.id,
      packId: morningPack.id,
      gameId: morning.id,
      priceCents: morning.priceCents,
      soldByUserId: manager.id,
      count: 8,
      daysAgoMax: 6,
    });
    await sellTickets({
      tenantId,
      locationId: main.id,
      packId: highPack.id,
      gameId: high.id,
      priceCents: high.priceCents,
      soldByUserId: cashier.id,
      count: 15,
      daysAgoMax: 5,
    });
    await sellTickets({
      tenantId,
      locationId: north.id,
      packId: northPack.id,
      gameId: fiveSpot.id,
      priceCents: fiveSpot.priceCents,
      soldByUserId: manager.id,
      count: 22,
      daysAgoMax: 20,
    });

    const soldTicket = await prisma.ticket.findFirst({
      where: { packId: morningPack.id, status: "sold" },
    });
    await prisma.prizePayout.create({
      data: {
        tenantId,
        locationId: main.id,
        ticketId: soldTicket?.id,
        amountPaidCents: 10000,
        cashingBonusRate: 0,
        cashingBonusEarnedCents: 0,
        paidByUserId: cashier.id,
        paidAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      },
    });
  }

  const display = await prisma.displayConfig.findFirst({
    where: { locationId: main.id },
  });
  if (!display) {
    await prisma.displayConfig.create({
      data: {
        locationId: main.id,
        layout: "landscape",
        theme: "plain",
        language: "bilingual",
        showWinners: true,
        binAssignments: {
          "1": morning.id,
          "2": classic.id,
          "3": high.id,
        },
      },
    });
  }

  const closedShift = await prisma.shiftReconciliation.findFirst({
    where: { tenantId, status: "closed" },
  });
  if (!closedShift) {
    const openedAt = new Date(Date.now() - 26 * 60 * 60 * 1000);
    const closedAt = new Date(Date.now() - 2 * 60 * 60 * 1000);
    const sales = await prisma.sale.aggregate({
      where: {
        tenantId,
        locationId: main.id,
        soldAt: { gte: openedAt, lte: closedAt },
      },
      _sum: { priceCents: true },
    });
    const expected = sales._sum.priceCents ?? 0;
    await prisma.shiftReconciliation.create({
      data: {
        tenantId,
        locationId: main.id,
        openedByUserId: manager.id,
        closedByUserId: manager.id,
        openedAt,
        closedAt,
        expectedCents: expected,
        actualCents: expected - 250,
        varianceCents: -250,
        status: "closed",
      },
    });
  }

  const referral = await prisma.referral.findFirst({
    where: { tenantId, referredEmail: "friend@example.com" },
  });
  if (!referral) {
    await prisma.referral.create({
      data: {
        tenantId,
        referredEmail: "friend@example.com",
        status: "pending",
        creditCents: 5000,
      },
    });
  }

  console.log("Demo dashboard data ready.");
  console.log("  owner@scratchcrest.local / demo-password");
  console.log("  manager@scratchcrest.local / demo-password");
  console.log("  cashier@scratchcrest.local / demo-password (scan only)");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
