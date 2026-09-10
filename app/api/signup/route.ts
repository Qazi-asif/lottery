import { NextRequest } from "next/server";
import { ApiError, apiErrorResponse, jsonOk } from "@/lib/api-error";
import { requirePrisma } from "@/lib/prisma";
import { getAppUrl, getStripe } from "@/lib/stripe";

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as {
      businessName?: string;
      ownerName?: string;
      email?: string;
      phone?: string;
      storeAddress?: string;
      city?: string;
      state?: string;
      zip?: string;
      plan?: string;
      billing?: string;
      referralCode?: string;
    };

    const businessName = body.businessName?.trim();
    const ownerName = body.ownerName?.trim();
    const email = body.email?.trim().toLowerCase();
    const phone = body.phone?.trim();
    const storeAddress = body.storeAddress?.trim();
    const city = body.city?.trim();
    const state = (body.state?.trim() || "TX").toUpperCase();
    const zip = body.zip?.trim();
    const planName = body.plan?.trim();
    const billing = body.billing === "annual" ? "annual" : "monthly";
    const referralCode = body.referralCode?.trim();

    if (
      !businessName ||
      !ownerName ||
      !email ||
      !phone ||
      !storeAddress ||
      !city ||
      !zip ||
      !planName
    ) {
      throw new ApiError("VALIDATION_ERROR", "All signup fields are required", 400);
    }

    const db = requirePrisma();
    const plan = await db.plan.findFirst({
      where: { name: { equals: planName, mode: "insensitive" }, active: true },
    });

    if (!plan) {
      throw new ApiError("VALIDATION_ERROR", "Selected plan is not available", 400);
    }

    const priceId =
      billing === "annual" ? plan.stripePriceIdAnnual : plan.stripePriceIdMonthly;

    const stripe = getStripe();
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      customer_email: email,
      payment_method_types: ["card"],
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${getAppUrl()}/signup/success`,
      cancel_url: `${getAppUrl()}/signup?plan=${encodeURIComponent(plan.name.toLowerCase())}&billing=${billing}`,
      metadata: {
        businessName,
        ownerName,
        email,
        phone,
        storeAddress,
        city,
        state,
        zip,
        planId: plan.id,
        billing,
        ...(referralCode ? { referralCode } : {}),
      },
      subscription_data: {
        metadata: {
          planId: plan.id,
          email,
        },
      },
    });

    if (!session.url) {
      throw new ApiError("VALIDATION_ERROR", "Unable to start checkout", 500);
    }

    return jsonOk({ checkoutUrl: session.url });
  } catch (error) {
    return apiErrorResponse(error);
  }
}
