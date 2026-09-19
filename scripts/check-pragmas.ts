import { prisma } from '../lib/db';

async function checkPragmas() {
  const jm = await prisma.$queryRawUnsafe('PRAGMA journal_mode;');
  const bt = await prisma.$queryRawUnsafe('PRAGMA busy_timeout;');
  const syn = await prisma.$queryRawUnsafe('PRAGMA synchronous;');
  console.log('journal_mode:', jm);
  console.log('busy_timeout:', bt);
  console.log('synchronous:', syn);
  await prisma.$disconnect();
}

checkPragmas().catch(console.error);
