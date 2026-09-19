import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

import { ensureBracketMatchesExist } from '../lib/bracketManager';

async function main() {
  const matches = await prisma.match.deleteMany();
  const participants = await prisma.participant.deleteMany();
  await ensureBracketMatchesExist();
  console.log(`✔ Cleared ${participants.count} participants. 128-player championship bracket re-initialized.`);
  console.log('Database is now at 0 registrations. Settings and admin user preserved.');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
