import { loadEnvConfig } from "@next/env";
import { PrismaClient } from "@prisma/client";

loadEnvConfig(process.cwd());

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export function getDatabaseUrl(): string | undefined {
  const url = process.env.DATABASE_URL?.trim();
  if (!url) return undefined;
  if (url.includes("USER:PASSWORD")) return undefined;
  return url;
}

export function getPrisma(): PrismaClient | null {
  const url = getDatabaseUrl();
  if (!url) return null;

  if (!globalForPrisma.prisma) {
    process.env.DATABASE_URL = url;
    globalForPrisma.prisma = new PrismaClient({
      log:
        process.env.NODE_ENV === "development"
          ? ["error", "warn"]
          : ["error"],
    });
  }

  return globalForPrisma.prisma;
}

export function requirePrisma(): PrismaClient {
  const db = getPrisma();
  if (!db) {
    throw new Error("DATABASE_URL is not configured");
  }
  return db;
}
