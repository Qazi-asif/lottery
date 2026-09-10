import { randomBytes } from "crypto";

export function createReferralCode() {
  return randomBytes(4).toString("hex");
}
