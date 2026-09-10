import { PrismaClient, type Prisma } from "@prisma/client";
import bcrypt from "bcryptjs";

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
    { gameNumber: "SC-1001", name: "Morning Cash", priceCents: 100, ticketsPerPack: 150 },
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

  const demoEmail = "owner@scratchcrest.local";
  const passwordHash = await bcrypt.hash("demo-password", 12);
  const existingOwner = await prisma.user.findUnique({ where: { email: demoEmail } });
  if (existingOwner) {
    await prisma.user.update({
      where: { id: existingOwner.id },
      data: { passwordHash },
    });
    console.log(`Updated demo login: ${demoEmail} / demo-password`);
  } else {
    const smart = await prisma.plan.findFirst({ where: { name: "Smart" } });
    if (smart) {
      const tenant = await prisma.tenant.create({
        data: {
          businessName: "Demo Retailer",
          ownerName: "Demo Owner",
          ownerEmail: demoEmail,
          ownerPhone: "5125550100",
          stripeCustomerId: "cus_demo",
        },
      });
      await prisma.subscription.create({
        data: {
          tenantId: tenant.id,
          planId: smart.id,
          stripeSubscriptionId: "sub_demo",
          status: "active",
          currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        },
      });
      await prisma.settings.create({ data: { tenantId: tenant.id } });
      const location = await prisma.location.create({
        data: {
          tenantId: tenant.id,
          name: "Main store",
          address: "100 Demo St",
          city: "Austin",
          state: "TX",
          zip: "78701",
        },
      });
      await prisma.user.create({
        data: {
          tenantId: tenant.id,
          email: demoEmail,
          name: "Demo Owner",
          role: "tenant_owner",
          passwordHash,
        },
      });
      console.log(
        `Seeded demo tenant. Login: ${demoEmail} / demo-password (location ${location.id})`,
      );
    }
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
