import { cookies } from "next/headers";
import { encode } from "next-auth/jwt";
import type { NextResponse } from "next/server";
import type { UserRole } from "@prisma/client";

export const SESSION_MAX_AGE = 30 * 24 * 60 * 60;

export function sessionCookieName() {
  return process.env.NODE_ENV === "production"
    ? "__Secure-next-auth.session-token"
    : "next-auth.session-token";
}

export async function encodeSessionToken(user: {
  id: string;
  email: string;
  name: string;
  tenantId: string;
  role: UserRole;
}) {
  const secret = process.env.NEXTAUTH_SECRET;
  if (!secret) {
    throw new Error("NEXTAUTH_SECRET is not configured");
  }

  // NextAuth v4.24+ getToken/getServerSession expect salt = cookie name.
  const salt = sessionCookieName();
  return encode({
    token: {
      id: user.id,
      sub: user.id,
      email: user.email,
      name: user.name,
      tenantId: user.tenantId,
      role: user.role,
    },
    secret,
    maxAge: SESSION_MAX_AGE,
    salt,
  });
}

const cookieOptions = {
  httpOnly: true,
  sameSite: "lax" as const,
  path: "/",
  secure: process.env.NODE_ENV === "production",
  maxAge: SESSION_MAX_AGE,
};

/** Attach the NextAuth JWT session cookie to a Route Handler response. */
export async function applySessionCookie(
  response: NextResponse,
  user: {
    id: string;
    email: string;
    name: string;
    tenantId: string;
    role: UserRole;
  },
) {
  const token = await encodeSessionToken(user);
  const name = sessionCookieName();
  response.cookies.set(name, token, cookieOptions);
}

export async function createSessionCookie(user: {
  id: string;
  email: string;
  name: string;
  tenantId: string;
  role: UserRole;
}) {
  const token = await encodeSessionToken(user);
  const jar = await cookies();
  jar.set(sessionCookieName(), token, cookieOptions);
}
