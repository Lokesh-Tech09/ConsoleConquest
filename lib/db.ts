import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

let pragmasInitialized = false;

export async function ensureSqliteOptimized() {
  if (pragmasInitialized) return;
  const dbUrl = process.env.DATABASE_URL || '';
  if (!dbUrl.startsWith('file:') && !dbUrl.startsWith('sqlite:')) {
    pragmasInitialized = true;
    return;
  }

  try {
    await prisma.$queryRawUnsafe('PRAGMA journal_mode = WAL;');
    await prisma.$queryRawUnsafe('PRAGMA synchronous = NORMAL;');
    await prisma.$queryRawUnsafe('PRAGMA busy_timeout = 10000;');
    pragmasInitialized = true;
  } catch {
    // Ignore in non-sqlite or if already set
  }
}

// Proactively run once on module load
if (typeof window === 'undefined') {
  ensureSqliteOptimized().catch(() => {});
}
