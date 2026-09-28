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
    process.env.DATABASE_URL = url;
    try {
      globalForPrisma.prisma = asAppDb(
        new PrismaClient({
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
