import { ApiError, apiErrorResponse, jsonOk } from "@/lib/api-error";
import { requireRole } from "@/lib/permissions";
import { getAppUrl, getStripe } from "@/lib/stripe";

export async function POST() {
  try {
    const ctx = await requireRole("tenant_owner");
    if (!ctx.stripeCustomerId) {
      throw new ApiError("VALIDATION_ERROR", "No Stripe customer is on file", 400);
    }

    const session = await getStripe().billingPortal.sessions.create({
      customer: ctx.stripeCustomerId,
      return_url: `${getAppUrl()}/dashboard/billing`,
    });

    return jsonOk({ url: session.url });
  } catch (error) {
    return apiErrorResponse(error);
  }
}
