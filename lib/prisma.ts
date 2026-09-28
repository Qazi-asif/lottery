import { loadEnvConfig } from "@next/env";
import { PrismaClient } from "@prisma/client";

loadEnvConfig(process.cwd());

export type AppDb = PrismaClient;

const globalForPrisma = globalThis as unknown as {
  prisma: AppDb | undefined;
};

export function getDatabaseUrl(): string | undefined {
  const url = process.env.DATABASE_URL?.trim();
  if (!url) return undefined;
  if (url.includes("USER:PASSWORD")) return undefined;
  return url;
}

/** Prisma query string extras. Do not log the returned URL (password). */
export function withPrismaUrlParams(url: string): string {
  let next = url;
  if (!/[?&]connection_limit=/.test(next)) {
    next += (next.includes("?") ? "&" : "?") + "connection_limit=1";
  }
  if (!/[?&]pool_timeout=/.test(next)) {
    next += (next.includes("?") ? "&" : "?") + "pool_timeout=10";
  }
  if (/:(6543)\//.test(next) && !/[?&]pgbouncer=/.test(next)) {
    next += (next.includes("?") ? "&" : "?") + "pgbouncer=true";
  }
  return next;
}

export function asAppDb(client: object): AppDb {
  return client as unknown as AppDb;
}

export function loose<T extends object>(value: T): T {
  return value;
}

export function asDate(value: unknown): Date | null {
  if (value instanceof Date && !Number.isNaN(value.getTime())) return value;
  return null;
}

export function stringField(
  record: object | null | undefined,
  key: string,
): string | null {
  if (!record || !(key in record)) return null;
  const value = (record as Record<string, unknown>)[key];
  return typeof value === "string" ? value : null;
}

export function getPrisma(): AppDb | null {
  const url = getDatabaseUrl();
  if (!url) return null;

  if (!process.env.DIRECT_URL?.trim()) {
    process.env.DIRECT_URL = url;
  }

  if (!globalForPrisma.prisma) {
    const prismaUrl = withPrismaUrlParams(url);
    process.env.DATABASE_URL = prismaUrl;
    try {
      globalForPrisma.prisma = asAppDb(
        new PrismaClient({
          datasources: { db: { url: prismaUrl } },
          log:
            process.env.NODE_ENV === "development"
              ? ["error", "warn"]
              : ["error"],
        }),
      );
    } catch (error) {
      console.error("Prisma client failed to start:", error);
      return null;
    }
  }

  return globalForPrisma.prisma;
}

export function requirePrisma(): AppDb {
  const db = getPrisma();
  if (!db) {
    throw new Error("DATABASE_URL is not configured");
  }
  return db;
}
