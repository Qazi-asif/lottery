import { Resend } from "resend";
import { getAppUrl } from "@/lib/stripe";

function getFromAddress() {
  return process.env.EMAIL_FROM ?? "ScratchCrest <noreply@scratchcrest.com>";
}

async function sendEmail(to: string, subject: string, html: string) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.info(`[email:dev] to=${to} subject=${subject}\n${html}`);
    return;
  }

  const resend = new Resend(apiKey);
  const { error } = await resend.emails.send({
    from: getFromAddress(),
    to,
    subject,
    html,
  });

  if (error) {
    console.error("Resend error:", error);
    throw new Error("Failed to send email");
  }
}

export async function sendPasswordSetEmail(options: {
  to: string;
  name: string;
  token: string;
  kind: "welcome" | "invite" | "dunning";
}) {
  const url = `${getAppUrl()}/set-password/${options.token}`;
  const subject =
    options.kind === "invite"
      ? "You're invited to ScratchCrest"
      : options.kind === "dunning"
        ? "Action needed on your ScratchCrest subscription"
        : "Set up your ScratchCrest account";

  const intro =
    options.kind === "invite"
      ? `You've been invited to join a ScratchCrest team.`
      : `Welcome to ScratchCrest, ${options.name}.`;

  await sendEmail(
    options.to,
    subject,
    `<p>${intro}</p>
     <p>Set your password using this one-time link (expires in 24 hours):</p>
     <p><a href="${url}">${url}</a></p>
     <p>We will never email you a password.</p>`,
  );
}

export async function sendDunningEmail(to: string, businessName: string) {
  const url = `${getAppUrl()}/dashboard/billing`;
  await sendEmail(
    to,
    "ScratchCrest payment failed",
    `<p>A payment for ${businessName} failed. Your subscription is past due.</p>
     <p>Update billing details here: <a href="${url}">${url}</a></p>`,
  );
}
