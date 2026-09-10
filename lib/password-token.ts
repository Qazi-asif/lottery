import { createHash, randomBytes } from "crypto";

const TOKEN_TTL_MS = 24 * 60 * 60 * 1000;

export function createPasswordSetToken() {
  const token = randomBytes(32).toString("hex");
  return {
    token,
    hash: hashPasswordSetToken(token),
    expires: new Date(Date.now() + TOKEN_TTL_MS),
  };
}

export function hashPasswordSetToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}
