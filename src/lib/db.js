import { PrismaClient } from "@prisma/client";

// Note: This is singleton design pattern for prisma database. Don't change, but import if using prisma.

if (!globalThis.prisma) {
  globalThis.prisma = new PrismaClient({
    log: ['query']
  });
}

const prisma = globalThis.prisma;

export default prisma;