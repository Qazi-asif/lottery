import { NextRequest } from "next/server";
import type Stripe from "stripe";
import { ApiError, apiErrorResponse, jsonOk } from "@/lib/api-error";
import { sendDunningEmail, sendPasswordSetEmail } from "@/lib/email";
import { createPasswordSetToken } from "@/lib/password-token";
import { asAppDb, loose, requirePrisma } from "@/lib/prisma";
import { createReferralCode } from "@/lib/referral-code";
import { getStripe } from "@/lib/stripe";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const secret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!secret) {
      throw new ApiError("UNAUTHORIZED", "Webhook secret is not configured", 401);
    }

    const signature = request.headers.get("stripe-signature");
    if (!signature) {
      throw new ApiError("UNAUTHORIZED", "Missing Stripe signature", 401);
    }

    const payload = await request.text();
    let event: Stripe.Event;
    try {
      event = getStripe().webhooks.constructEvent(payload, signature, secret);
    } catch {
      throw new ApiError("UNAUTHORIZED", "Invalid Stripe signature", 401);
    }

    if (event.type === "checkout.session.completed") {
      await onCheckoutCompleted(event.data.object as Stripe.Checkout.Session);
    } else if (event.type === "invoice.payment_failed") {
      await onInvoicePaymentFailed(event.data.object as Stripe.Invoice);
    } else if (event.type === "customer.subscription.deleted") {
      await onSubscriptionDeleted(event.data.object as Stripe.Subscription);
    }

    return jsonOk({ received: true });
  } catch (error) {
    return apiErrorResponse(error);
  }
}

async function onCheckoutCompleted(session: Stripe.Checkout.Session) {
  const db = requirePrisma();
  const metadata = session.metadata ?? {};
  const email = (metadata.email ?? session.customer_email ?? "").toLowerCase();
  const planId = metadata.planId;
  const customerId =
    typeof session.customer === "string" ? session.customer : session.customer?.id;
  const subscriptionId =
    typeof session.subscription === "string"
      ? session.subscription
      : session.subscription?.id;

  if (!email || !planId || !customerId || !subscriptionId) {
    throw new Error("Checkout session missing required fields");
  }

  const existing = await db.tenant.findUnique({ where: { ownerEmail: email } });
  if (existing) return;

  const stripeSubscription = await getStripe().subscriptions.retrieve(subscriptionId);
  const periodEndUnix =
    stripeSubscription.items.data[0]?.current_period_end ??
    Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60;
  const periodEnd = new Date(periodEndUnix * 1000);
  const token = createPasswordSetToken();

  await db.$transaction(async (tx) => {
    const dbTx = asAppDb(tx);
    const tenant = await dbTx.tenant.create({
      data: loose({
        businessName: metadata.businessName ?? "New retailer",
        ownerName: metadata.ownerName ?? "Owner",
        ownerEmail: email,
        ownerPhone: metadata.phone ?? "",
        stripeCustomerId: customerId,
        artworkLicenseApproved: false,
        referralCode: createReferralCode(),
      }),
    });

    await dbTx.subscription.create({
      data: {
        tenantId: tenant.id,
        planId,
        stripeSubscriptionId: subscriptionId,
        status: stripeSubscription.status === "trialing" ? "trialing" : "active",
        currentPeriodEnd: periodEnd,
      },
    });

    await dbTx.settings.create({
      data: { tenantId: tenant.id },
    });

    await dbTx.location.create({
      data: {
        tenantId: tenant.id,
        name: "Main store",
        address: metadata.storeAddress ?? "",
        city: metadata.city ?? "",
        state: metadata.state || "TX",
        zip: metadata.zip ?? "",
      },
    });

    await dbTx.user.create({
      data: {
        tenantId: tenant.id,
        email,
        name: metadata.ownerName ?? "Owner",
        role: "tenant_owner",
        passwordHash: null,
        passwordSetToken: token.hash,
        passwordSetTokenExpires: token.expires,
      },
    });

    const referralCode = metadata.referralCode?.trim().toLowerCase();
    if (referralCode) {
      const referrer = await dbTx.tenant.findFirst({
        where: loose({ referralCode: metadata.referralCode.trim() }),
      });
      if (referrer && referrer.id !== tenant.id) {
        const pending = await dbTx.referral.findFirst({
          where: {
            tenantId: referrer.id,
            referredEmail: email,
            status: "pending",
          },
        });
        if (pending) {
          await dbTx.referral.update({
            where: { id: pending.id },
            data: { status: "completed", referredTenantId: tenant.id },
          });
        } else {
          await dbTx.referral.create({
            data: {
              tenantId: referrer.id,
              referredEmail: email,
              referredTenantId: tenant.id,
              status: "completed",
              creditCents: 5000,
            },
          });
        }
      }
    }
  });

  await sendPasswordSetEmail({
    to: email,
    name: metadata.ownerName ?? "there",
    token: token.token,
    kind: "welcome",
  });
}

async function onInvoicePaymentFailed(invoice: Stripe.Invoice) {
  const db = requirePrisma();
  const raw = invoice as unknown as {
    subscription?: string | { id: string } | null;
  };
  const stripeSubscriptionId =
    typeof raw.subscription === "string"
      ? raw.subscription
      : raw.subscription?.id;
  if (!stripeSubscriptionId) return;

  const row = await db.subscription.findFirst({
    where: { stripeSubscriptionId },
    include: { tenant: true },
  });
  if (!row) return;

  await db.subscription.update({
    where: { id: row.id },
    data: { status: "past_due" },
  });

  await sendDunningEmail(row.tenant.ownerEmail, row.tenant.businessName);
}

async function onSubscriptionDeleted(stripeSub: Stripe.Subscription) {
  const db = requirePrisma();
  await db.subscription.updateMany({
    where: { stripeSubscriptionId: stripeSub.id },
    data: { status: "canceled" },
  });
}
