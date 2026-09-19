import { prisma } from '../lib/db';

async function enableWAL() {
  console.log('Enabling SQLite WAL mode...');
  const res1 = await prisma.$queryRawUnsafe('PRAGMA journal_mode = WAL;');
  const res2 = await prisma.$queryRawUnsafe('PRAGMA synchronous = NORMAL;');
  const res3 = await prisma.$queryRawUnsafe('PRAGMA busy_timeout = 10000;');
  console.log('Journal mode result:', res1);
  console.log('Synchronous result:', res2);
  console.log('Busy timeout result:', res3);
  await prisma.$disconnect();
}

enableWAL().catch(console.error);
